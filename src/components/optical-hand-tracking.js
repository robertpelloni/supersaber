import '@mediapipe/hands';
import '@mediapipe/camera_utils';
const Hands = window.Hands;
const Camera = window.Camera;

AFRAME.registerComponent('optical-hand-tracking', {
  schema: {
    enabled: {default: false}
  },

  init: function () {
    this.videoElement = document.createElement('video');
    this.videoElement.style.display = 'none';
    document.body.appendChild(this.videoElement);

    this.hands = new Hands({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});

    // Bind to state for sensitivity configurations
    const state = this.el.sceneEl.systems.state.state;
    this.hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: state.opticalTrackingSensitivity || 0.5,
      minTrackingConfidence: state.opticalTrackingSensitivity || 0.5
    });

    this.hands.onResults(this.onResults.bind(this));

    this.camera = new Camera(this.videoElement, {
      onFrame: async () => {
        if (!this.data.enabled) return;
        await this.hands.send({image: this.videoElement});
      },
      width: 640,
      height: 480
    });

    this.failedFramesCount = 0;
    this.failedStateActive = false;
  },

  update: function (oldData) {
    if (this.data.enabled && !oldData.enabled) {
      this.camera.start();
      this.failedFramesCount = 0;
      this.failedStateActive = false;
    } else if (!this.data.enabled && oldData.enabled) {
      this.camera.stop();
      if (this.failedStateActive) {
        this.el.sceneEl.emit('optical-tracking-failed', false);
        this.failedStateActive = false;
      }
    }
  },

  onResults: function (results) {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      this.failedFramesCount++;
      if (this.failedFramesCount > 30 && !this.failedStateActive) { // ~1 second at 30fps
        this.failedStateActive = true;
        this.el.sceneEl.emit('optical-tracking-failed', true);
      }
      return;
    }

    if (this.failedStateActive) {
      this.failedStateActive = false;
      this.failedFramesCount = 0;
      this.el.sceneEl.emit('optical-tracking-failed', false);
    }

    // Dispatch event with hand data so sabers can update their positions
    this.el.emit('optical-hands-updated', {
      hands: results.multiHandLandmarks,
      handedness: results.multiHandedness
    });
  }
});
