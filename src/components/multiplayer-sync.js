/* global AFRAME, THREE */

/**
 * Multiplayer Sync Component
 * Synchronizes local player saber and head movements over WebSockets
 * and parses remote payloads to spawn other players in the room.
 */
AFRAME.registerComponent('multiplayer-sync', {
  schema: {
    enabled: {type: 'boolean', default: false},
    room: {type: 'string', default: 'ROOM1'},
    serverUrl: {type: 'string', default: 'ws://localhost:3001/'},
    updateInterval: {type: 'number', default: 50} // Send state every 50ms
  },

  init: function () {
    this.ws = null;
    this.lastTime = 0;
    this.remotePlayers = {}; // Track remote player entities

    // Find local rig entities to track
    this.rigEl = document.getElementById('cameraRig') || this.el.sceneEl.camera.el;
    this.leftHandEl = document.getElementById('leftHand');
    this.rightHandEl = document.getElementById('rightHand');
  },

  update: function (oldData) {
    if (this.data.enabled && (!oldData.enabled || this.data.room !== oldData.room)) {
      this.connect();
    } else if (!this.data.enabled && oldData.enabled) {
      this.disconnect();
    }
  },

  connect: function () {
    if (this.ws) {
      this.ws.close();
    }

    console.log(`[Multiplayer] Connecting to ${this.data.serverUrl} for room ${this.data.room}...`);
    try {
      this.ws = new WebSocket(`${this.data.serverUrl}?room=${this.data.room}`);

      this.ws.onopen = () => {
        console.log('[Multiplayer] WebSocket connected.');
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onclose = () => {
        console.log('[Multiplayer] WebSocket disconnected.');
      };

      this.ws.onerror = (err) => {
        console.warn('[Multiplayer] WebSocket error (this is expected if no relay server is running on localhost:3001):', err);
      };
    } catch (e) {
      console.warn('[Multiplayer] WebSocket creation failed:', e);
    }
  },

  disconnect: function () {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    // Cleanup remote players
    Object.keys(this.remotePlayers).forEach(id => {
      this.el.removeChild(this.remotePlayers[id].container);
      delete this.remotePlayers[id];
    });
  },

  handleMessage: function (dataStr) {
    try {
      const data = JSON.parse(dataStr);
      const id = data.id;

      if (!this.remotePlayers[id]) {
        // Create new remote player container
        const container = document.createElement('a-entity');
        container.setAttribute('id', `remote-player-${id}`);

        // Setup visual representations
        const head = document.createElement('a-entity');
        head.setAttribute('geometry', 'primitive: box; width: 0.2; height: 0.2; depth: 0.2');
        head.setAttribute('material', 'color: #888; wireframe: true');
        container.appendChild(head);

        const leftSaber = document.createElement('a-entity');
        leftSaber.setAttribute('geometry', 'primitive: cylinder; radius: 0.02; height: 1');
        leftSaber.setAttribute('material', 'color: #ff0000; wireframe: true');
        container.appendChild(leftSaber);

        const rightSaber = document.createElement('a-entity');
        rightSaber.setAttribute('geometry', 'primitive: cylinder; radius: 0.02; height: 1');
        rightSaber.setAttribute('material', 'color: #0000ff; wireframe: true');
        container.appendChild(rightSaber);

        this.el.appendChild(container);

        this.remotePlayers[id] = {
          container: container,
          head: head,
          leftSaber: leftSaber,
          rightSaber: rightSaber
        };
      }

      // Update positions and rotations based on network payload
      const player = this.remotePlayers[id];
      if (data.head) {
        player.head.setAttribute('position', data.head.position);
        player.head.setAttribute('rotation', data.head.rotation);
      }
      if (data.leftSaber) {
        player.leftSaber.setAttribute('position', data.leftSaber.position);
        player.leftSaber.setAttribute('rotation', data.leftSaber.rotation);
      }
      if (data.rightSaber) {
        player.rightSaber.setAttribute('position', data.rightSaber.position);
        player.rightSaber.setAttribute('rotation', data.rightSaber.rotation);
      }
    } catch (e) {
      console.warn('[Multiplayer] Failed to parse message', e);
    }
  },

  tick: function (time, timeDelta) {
    if (!this.data.enabled || !this.ws || this.ws.readyState !== 1) return;

    if (time - this.lastTime > this.data.updateInterval) {
      this.lastTime = time;

      // Extract raw world coordinates to broadcast
      const payload = {
        type: 'update',
        head: {
          position: this.el.sceneEl.camera.el.getAttribute('position'),
          rotation: this.el.sceneEl.camera.el.getAttribute('rotation')
        }
      };

      if (this.leftHandEl) {
        payload.leftSaber = {
          position: this.leftHandEl.getAttribute('position'),
          rotation: this.leftHandEl.getAttribute('rotation')
        };
      }

      if (this.rightHandEl) {
        payload.rightSaber = {
          position: this.rightHandEl.getAttribute('position'),
          rotation: this.rightHandEl.getAttribute('rotation')
        };
      }

      this.ws.send(JSON.stringify(payload));
    }
  },

  remove: function () {
    this.disconnect();
  }
});
