/* eslint-disable no-undef */
/* global AFRAME, THREE */

/**
 * Handles the 3D timeline slider and waveform representation for the Web Editor.
 */
AFRAME.registerComponent('editor-timeline', {
  schema: {
    audioUrl: { type: 'string', default: '' },
    isPlaying: { type: 'boolean', default: false }
  },

  init: function () {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.audioBuffer = null;
    this.audioSource = null;
    this.startTime = 0;
    this.pausedAt = 0;
    this.duration = 0;

    // Timeline visuals
    this.timelineWidth = 3;

    this.scrubBar = document.createElement('a-entity');
    this.scrubBar.setAttribute('geometry', `primitive: plane; width: ${this.timelineWidth}; height: 0.1`);
    this.scrubBar.setAttribute('material', 'color: #333; shader: flat');
    this.scrubBar.setAttribute('position', '0 -0.5 0.01');
    this.scrubBar.classList.add('raycastable');
    this.el.appendChild(this.scrubBar);

    this.playhead = document.createElement('a-entity');
    this.playhead.setAttribute('geometry', 'primitive: plane; width: 0.05; height: 0.15');
    this.playhead.setAttribute('material', 'color: #ff0055; shader: flat');
    this.playhead.setAttribute('position', `${-this.timelineWidth / 2} -0.5 0.02`);
    this.el.appendChild(this.playhead);

    this.onScrub = this.onScrub.bind(this);
    this.scrubBar.addEventListener('mousedown', this.onScrub);

    this.el.sceneEl.addEventListener('editor-play', () => this.play());
    this.blocks = [];
    this.beatGrid = document.querySelector('#editorTimelineGrid');

    this.onGridClick = this.onGridClick.bind(this);
    if (this.beatGrid) {
      this.beatGrid.addEventListener('mousedown', this.onGridClick);
      this.beatGrid.classList.add('raycastable');
    }
  },

  onGridClick: function (evt) {
    if (!this.audioBuffer) return;

    const intersection = evt.detail.intersection;
    if (!intersection) return;

    // Convert local click to grid coordinate (4x3 roughly mapping X and Y)
    const localPoint = this.beatGrid.object3D.worldToLocal(intersection.point);

    // Normalize coordinates from -1 to 1 based on plane dimensions
    const xIndex = Math.round(localPoint.x * 2 + 1.5); // Maps approximately 0 to 3
    const yIndex = Math.round(localPoint.y * 2 + 1);   // Maps approximately 0 to 2

    const clampedX = Math.max(0, Math.min(3, xIndex));
    const clampedY = Math.max(0, Math.min(2, yIndex));

    // Current Time of the playhead (with snapping to 1/8th beats usually, but simple for now)
    let currentTime = this.data.isPlaying ? this.audioContext.currentTime - this.startTime : this.pausedAt;

    console.log(`[Editor] Placing block at grid [${clampedX}, ${clampedY}] at ${currentTime.toFixed(2)}s`);

    const blockVisual = document.createElement('a-entity');
    blockVisual.setAttribute('geometry', 'primitive: box; width: 0.2; height: 0.2; depth: 0.2');
    blockVisual.setAttribute('material', 'color: #ff0000; shader: flat');

    // Position it visually on the grid offset for feedback
    blockVisual.setAttribute('position', `${(clampedX - 1.5) * 0.4} ${(clampedY - 1) * 0.4} 0.1`);
    this.beatGrid.appendChild(blockVisual);

    this.blocks.push({
      time: currentTime,
      lineIndex: clampedX,
      lineLayer: clampedY,
      type: 0,
      cutDirection: 1,
      element: blockVisual
    });

    this.el.sceneEl.addEventListener('editor-pause', () => this.pause());
    this.exportJSON = this.exportJSON.bind(this);
    this.el.sceneEl.addEventListener('editor-export', this.exportJSON);
  },

  exportJSON: function () {
    console.log('[Editor] Exporting map to JSON...');

    const mapData = {
      _version: '2.0.0',
      _events: [],
      _notes: this.blocks.map(b => ({
        _time: b._time,
        _lineIndex: b._lineIndex,
        _lineLayer: b._lineLayer,
        _type: b._type,
        _cutDirection: b._cutDirection
      })),
      _obstacles: []
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(mapData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'custom_map.json');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  },
  update: function (oldData) {
    if (this.data.audioUrl !== oldData.audioUrl && this.data.audioUrl !== '') {
      this.loadAudio(this.data.audioUrl);
    }

    if (this.data.isPlaying !== oldData.isPlaying) {
      if (this.data.isPlaying) {
        this.play();
      } else {
        this.pause();
      }
    }
  },

  loadAudio: function (url) {
    console.log(`[Editor] Loading audio from ${url}`);
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        this.audioBuffer = audioBuffer;
        this.duration = audioBuffer.duration;
        console.log(`[Editor] Audio loaded. Duration: ${this.duration}s`);
        this.pausedAt = 0;
        this.updatePlayheadVisual(0);
      })
      .catch(e => console.error('Error loading audio:', e));
  },

  play: function () {
    if (!this.audioBuffer) return;

    if (this.audioSource) {
      this.audioSource.stop();
      this.audioSource.disconnect();
    }

    this.audioSource = this.audioContext.createBufferSource();
    this.audioSource.buffer = this.audioBuffer;
    this.audioSource.connect(this.audioContext.destination);

    this.startTime = this.audioContext.currentTime - this.pausedAt;
    this.audioSource.start(0, this.pausedAt);
    this.data.isPlaying = true;
  },

  pause: function () {
    if (!this.audioSource || !this.data.isPlaying) return;
    this.audioSource.stop();
    this.pausedAt = this.audioContext.currentTime - this.startTime;
    this.data.isPlaying = false;
  },

  onScrub: function (evt) {
    if (!this.audioBuffer) return;

    const intersection = evt.detail.intersection;
    if (!intersection) return;

    // Calculate percentage along the scrub bar (-1.5 to 1.5 local X)
    const localX = this.scrubBar.object3D.worldToLocal(intersection.point).x;
    const percentage = (localX + (this.timelineWidth / 2)) / this.timelineWidth;

    let targetTime = percentage * this.duration;
    targetTime = Math.max(0, Math.min(this.duration, targetTime));

    const wasPlaying = this.data.isPlaying;
    if (wasPlaying) {
      this.pause();
    }

    this.pausedAt = targetTime;
    this.updatePlayheadVisual(targetTime);

    if (wasPlaying) {
      this.play();
    }
  },

  updatePlayheadVisual: function (time) {
    if (this.duration <= 0) return;
    const percentage = time / this.duration;
    const xPos = -(this.timelineWidth / 2) + (percentage * this.timelineWidth);
    this.playhead.setAttribute('position', `${xPos} -0.5 0.02`);
  },

  tick: function () {
    if (this.data.isPlaying && this.audioBuffer) {
      let currentTime = this.audioContext.currentTime - this.startTime;
      if (currentTime > this.duration) {
        this.pause();
        this.pausedAt = 0;
        currentTime = 0;
      }
      this.updatePlayheadVisual(currentTime);
    }
  }
});
