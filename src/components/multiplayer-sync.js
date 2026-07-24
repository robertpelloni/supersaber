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
    this.peerConnections = {}; // WebRTC connections
    this.dataChannels = {};    // WebRTC data channels
    this.localId = Math.random().toString(36).substr(2, 9); // Generate local peer ID

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
        // Signal that we joined
        this.ws.send(JSON.stringify({ type: 'join', id: this.localId }));
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
    Object.keys(this.peerConnections).forEach(id => {
      this.peerConnections[id].close();
      delete this.peerConnections[id];
    });
    Object.keys(this.dataChannels).forEach(id => {
      this.dataChannels[id].close();
      delete this.dataChannels[id];
    });
    // Cleanup remote players
    Object.keys(this.remotePlayers).forEach(id => {
      this.el.removeChild(this.remotePlayers[id].container);
      delete this.remotePlayers[id];
    });
  },

  setupPeerConnection: function (id, isInitiator) {
    if (this.peerConnections[id]) return;

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });
    this.peerConnections[id] = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.ws.send(JSON.stringify({
          type: 'candidate',
          target: id,
          id: this.localId,
          candidate: event.candidate
        }));
      }
    };

    if (isInitiator) {
      const dc = pc.createDataChannel('sync');
      this.setupDataChannel(id, dc);
      pc.createOffer().then(offer => {
        return pc.setLocalDescription(offer);
      }).then(() => {
        this.ws.send(JSON.stringify({
          type: 'offer',
          target: id,
          id: this.localId,
          offer: pc.localDescription
        }));
      }).catch(e => console.error(e));
    } else {
      pc.ondatachannel = (event) => {
        this.setupDataChannel(id, event.channel);
      };
    }
  },

  setupDataChannel: function (id, dc) {
    this.dataChannels[id] = dc;
    dc.onopen = () => { console.log(`[WebRTC] DataChannel open for ${id}`); };
    dc.onclose = () => { console.log(`[WebRTC] DataChannel closed for ${id}`); delete this.dataChannels[id]; };
    dc.onmessage = (event) => {
      this.handleMessage(event.data);
    };
  },

  handleMessage: function (dataStr) {
    try {
      const data = JSON.parse(dataStr);
      const id = data.id || data.source;

      // Ignore echoes of our own messages
      if (id === this.localId) return;
      if (data.target && data.target !== this.localId) return;

      // Handle WebRTC Signaling
      if (data.type === 'join') {
        // Someone joined, we should initiate a connection to them
        this.setupPeerConnection(id, true);
        return;
      }
      if (data.type === 'offer') {
        this.setupPeerConnection(id, false);
        this.peerConnections[id].setRemoteDescription(new RTCSessionDescription(data.offer))
          .then(() => this.peerConnections[id].createAnswer())
          .then(answer => this.peerConnections[id].setLocalDescription(answer))
          .then(() => {
            this.ws.send(JSON.stringify({
              type: 'answer',
              target: id,
              id: this.localId,
              answer: this.peerConnections[id].localDescription
            }));
          }).catch(e => console.error(e));
        return;
      }
      if (data.type === 'answer') {
        if (this.peerConnections[id]) {
          this.peerConnections[id].setRemoteDescription(new RTCSessionDescription(data.answer)).catch(e => console.error(e));
        }
        return;
      }
      if (data.type === 'candidate') {
        if (this.peerConnections[id]) {
          this.peerConnections[id].addIceCandidate(new RTCIceCandidate(data.candidate)).catch(e => console.error(e));
        }
        return;
      }

      if (data.type !== 'update') return; // Ignore unknown or non-update messages

      if (!this.remotePlayers[id]) {
        // Create new remote player container
        const container = document.createElement('a-entity');
        container.setAttribute('id', `remote-player-${id}`);

        // Setup high-fidelity visual representations
        const head = document.createElement('a-entity');
        // If a remote player explicitly sends a custom head model, we could bind it here.
        // For now, construct a detailed multi-part mesh representation of a VR headset.
        const strap = document.createElement('a-entity');
        strap.setAttribute('geometry', 'primitive: torus; radius: 0.16; tube: 0.02; arc: 360; rotation: 90 0 0');
        strap.setAttribute('material', 'color: #111; roughness: 0.9');
        head.appendChild(strap);

        const faceplate = document.createElement('a-entity');
        faceplate.setAttribute('geometry', 'primitive: box; width: 0.22; height: 0.12; depth: 0.1');
        faceplate.setAttribute('material', 'color: #333; metalness: 0.8; roughness: 0.2; sphericalEnvMap: #envmap');
        faceplate.setAttribute('position', '0 0.02 -0.1');
        head.appendChild(faceplate);

        const visor = document.createElement('a-entity');
        visor.setAttribute('geometry', 'primitive: plane; width: 0.20; height: 0.08');
        visor.setAttribute('material', 'color: #00ffff; emissive: #00ffff; emissiveIntensity: 0.8; shader: flat');
        visor.setAttribute('position', '0 0.02 -0.151');
        head.appendChild(visor);

        const nameTag = document.createElement('a-entity');
        nameTag.setAttribute('class', 'remoteNameTag');
        nameTag.setAttribute('mixin', 'font');
        nameTag.setAttribute('text', `align: center; color: #fff; width: 2; value: Player ${id}`);
        nameTag.setAttribute('position', '0 0.4 0'); // Float above head
        head.appendChild(nameTag);

        container.appendChild(head);

        const leftSaber = document.createElement('a-entity');
        const leftBladeContainer = document.createElement('a-entity');
        leftBladeContainer.setAttribute('class', 'bladeContainer');
        const leftBlade = document.createElement('a-entity');
        leftBlade.setAttribute('class', 'blade bladeleft');

        // Use custom saber model if local state has one, else use high fidelity primitives
        const state = this.el.sceneEl.systems.state.state;
        if (state.customSaberModel) {
          leftBlade.setAttribute('obj-model', `obj: ${state.customSaberModel}`);
          leftBlade.setAttribute('material', 'color: #ff4444');
        } else {
          leftBlade.setAttribute('geometry', 'primitive: cylinder; radius: 0.015; height: 0.9');
          leftBlade.setAttribute('material', 'shader: flat; color: #ff4444; emissive: #ff4444; emissiveIntensity: 0.8');
        }
        leftBlade.setAttribute('raycastable-game', '');
        leftBlade.setAttribute('position', '0 -0.55 0');
        leftBladeContainer.appendChild(leftBlade);

        const leftSaberGlow = document.createElement('a-entity');
        leftSaberGlow.setAttribute('class', 'saberglow');
        leftSaberGlow.setAttribute('obj-model', 'obj: #saberGlowObj');
        leftSaberGlow.setAttribute('material', 'shader: flat; color: #ff4444; blending: additive; opacity: 0.4');
        leftSaberGlow.setAttribute('position', '0 -0.55 0');
        leftBladeContainer.appendChild(leftSaberGlow);

        leftSaber.appendChild(leftBladeContainer);

        const leftHandle = document.createElement('a-entity');
        leftHandle.setAttribute('class', 'saberHandle');
        leftHandle.setAttribute('geometry', 'primitive: box; height: 0.2; depth: 0.025; width: 0.025');
        leftHandle.setAttribute('material', 'shader: flat; color: #151515');

        const leftHighlightTop = document.createElement('a-entity');
        leftHighlightTop.setAttribute('class', 'highlightTop');
        leftHighlightTop.setAttribute('geometry', 'primitive: box; height: 0.18; depth: 0.005; width: 0.005');
        leftHighlightTop.setAttribute('material', 'shader: flat; color: #FAFAFA');
        leftHighlightTop.setAttribute('position', '0 0 0.0125');
        leftHandle.appendChild(leftHighlightTop);

        const leftHighlightBottom = document.createElement('a-entity');
        leftHighlightBottom.setAttribute('class', 'highlightBottom');
        leftHighlightBottom.setAttribute('geometry', 'primitive: box; height: 0.18; depth: 0.005; width: 0.005');
        leftHighlightBottom.setAttribute('material', 'shader: flat; color: #FAFAFA');
        leftHighlightBottom.setAttribute('position', '0 0 -0.0125');
        leftHandle.appendChild(leftHighlightBottom);

        leftSaber.appendChild(leftHandle);
        leftSaber.setAttribute('saber-controls', 'hand: left; bladeEnabled: true');
        leftSaber.setAttribute('trail', 'color: #ff4444; hand: left; enabled: true');

        // Setup raycasting hit logic so remote saber visually triggers particles natively
        leftSaber.setAttribute('raycaster__game', 'objects: [data-saber-particles]; interval: 100; far: 2.0');
        leftSaber.setAttribute('saber-particles', 'enabled: true; hand: left');
        container.appendChild(leftSaber);

        const rightSaber = document.createElement('a-entity');
        const rightBladeContainer = document.createElement('a-entity');
        rightBladeContainer.setAttribute('class', 'bladeContainer');
        const rightBlade = document.createElement('a-entity');
        rightBlade.setAttribute('class', 'blade bladeright');

        if (state.customSaberModel) {
          rightBlade.setAttribute('obj-model', `obj: ${state.customSaberModel}`);
          rightBlade.setAttribute('material', 'color: #4444ff');
        } else {
          rightBlade.setAttribute('geometry', 'primitive: cylinder; radius: 0.015; height: 0.9');
          rightBlade.setAttribute('material', 'shader: flat; color: #4444ff; emissive: #4444ff; emissiveIntensity: 0.8');
        }

        rightBlade.setAttribute('raycastable-game', '');
        rightBlade.setAttribute('position', '0 -0.55 0');
        rightBladeContainer.appendChild(rightBlade);

        const rightSaberGlow = document.createElement('a-entity');
        rightSaberGlow.setAttribute('class', 'saberglow');
        rightSaberGlow.setAttribute('obj-model', 'obj: #saberGlowObj');
        rightSaberGlow.setAttribute('material', 'shader: flat; color: #4444ff; blending: additive; opacity: 0.4');
        rightSaberGlow.setAttribute('position', '0 -0.55 0');
        rightBladeContainer.appendChild(rightSaberGlow);

        rightSaber.appendChild(rightBladeContainer);

        const rightHandle = document.createElement('a-entity');
        rightHandle.setAttribute('class', 'saberHandle');
        rightHandle.setAttribute('geometry', 'primitive: box; height: 0.2; depth: 0.025; width: 0.025');
        rightHandle.setAttribute('material', 'shader: flat; color: #151515');

        const rightHighlightTop = document.createElement('a-entity');
        rightHighlightTop.setAttribute('class', 'highlightTop');
        rightHighlightTop.setAttribute('geometry', 'primitive: box; height: 0.18; depth: 0.005; width: 0.005');
        rightHighlightTop.setAttribute('material', 'shader: flat; color: #FAFAFA');
        rightHighlightTop.setAttribute('position', '0 0 0.0125');
        rightHandle.appendChild(rightHighlightTop);

        const rightHighlightBottom = document.createElement('a-entity');
        rightHighlightBottom.setAttribute('class', 'highlightBottom');
        rightHighlightBottom.setAttribute('geometry', 'primitive: box; height: 0.18; depth: 0.005; width: 0.005');
        rightHighlightBottom.setAttribute('material', 'shader: flat; color: #FAFAFA');
        rightHighlightBottom.setAttribute('position', '0 0 -0.0125');
        rightHandle.appendChild(rightHighlightBottom);

        rightSaber.appendChild(rightHandle);
        rightSaber.setAttribute('saber-controls', 'hand: right; bladeEnabled: true');
        rightSaber.setAttribute('trail', 'color: #4444ff; hand: right; enabled: true');

        rightSaber.setAttribute('raycaster__game', 'objects: [data-saber-particles]; interval: 100; far: 2.0');
        rightSaber.setAttribute('saber-particles', 'enabled: true; hand: right');
        container.appendChild(rightSaber);

        this.el.appendChild(container);

        this.remotePlayers[id] = {
          container: container,
          head: head,
          leftSaber: leftSaber,
          rightSaber: rightSaber,
          targetHeadPos: new THREE.Vector3(),
          targetHeadRot: new THREE.Euler(),
          targetLeftSaberPos: new THREE.Vector3(),
          targetLeftSaberRot: new THREE.Euler(),
          targetRightSaberPos: new THREE.Vector3(),
          targetRightSaberRot: new THREE.Euler(),
          q1: new THREE.Quaternion(),
          q2: new THREE.Quaternion()
        };
      }

      // Update targets based on network payload
      const player = this.remotePlayers[id];
      if (data.head) {
        player.targetHeadPos = new THREE.Vector3(data.head.position.x, data.head.position.y, data.head.position.z);
        player.targetHeadRot = new THREE.Euler(THREE.Math.degToRad(data.head.rotation.x), THREE.Math.degToRad(data.head.rotation.y), THREE.Math.degToRad(data.head.rotation.z));
        if (data.head.scale) player.head.setAttribute('scale', data.head.scale);

        // Update floating score/status if provided
        if (data.scoreData) {
          const nameTag = player.head.querySelector('.remoteNameTag');
          if (nameTag) {
            const name = data.scoreData.username || `Player ${id}`;
            const score = data.scoreData.score || 0;
            const combo = data.scoreData.combo || 0;
            let mods = [];
            if (data.scoreData.modifiers) {
               if (data.scoreData.modifiers.mode360) mods.push("360");
               if (data.scoreData.modifiers.oneSaber) mods.push("OneSaber");
            }
            nameTag.setAttribute('text', `value: ${name}\nScore: ${score}\nCombo: ${combo}${mods.length > 0 ? '\n[' + mods.join(', ') + ']' : ''}`);
          }
        }
      }
      if (data.leftSaber) {
        player.targetLeftSaberPos = new THREE.Vector3(data.leftSaber.position.x, data.leftSaber.position.y, data.leftSaber.position.z);
        player.targetLeftSaberRot = new THREE.Euler(THREE.Math.degToRad(data.leftSaber.rotation.x), THREE.Math.degToRad(data.leftSaber.rotation.y), THREE.Math.degToRad(data.leftSaber.rotation.z));
        if (data.leftSaber.scale) player.leftSaber.setAttribute('scale', data.leftSaber.scale);
      }
      if (data.rightSaber) {
        player.targetRightSaberPos = new THREE.Vector3(data.rightSaber.position.x, data.rightSaber.position.y, data.rightSaber.position.z);
        player.targetRightSaberRot = new THREE.Euler(THREE.Math.degToRad(data.rightSaber.rotation.x), THREE.Math.degToRad(data.rightSaber.rotation.y), THREE.Math.degToRad(data.rightSaber.rotation.z));
        if (data.rightSaber.scale) player.rightSaber.setAttribute('scale', data.rightSaber.scale);
      }
    } catch (e) {
      console.warn('[Multiplayer] Failed to parse message', e);
    }
  },

  tick: function (time, timeDelta) {
    if (!this.data.enabled) return;

    // Interpolate remote players and constrain physics clipping
    const lerpFactor = Math.min(timeDelta * 0.015, 1.0); // smooth step
    Object.keys(this.remotePlayers).forEach(id => {
      const player = this.remotePlayers[id];
      if (player.head.object3D) {
        player.head.object3D.position.lerp(player.targetHeadPos, lerpFactor);

        // Head Boundary constraints to avoid clipping floors/walls
        player.head.object3D.position.y = Math.max(0.5, player.head.object3D.position.y); // Don't go through floor
        player.head.object3D.position.x = Math.max(-2, Math.min(2, player.head.object3D.position.x)); // Don't go outside stage
        player.head.object3D.position.z = Math.max(-2, Math.min(2, player.head.object3D.position.z));

        player.q1.setFromEuler(player.head.object3D.rotation);
        player.q2.setFromEuler(player.targetHeadRot);
        player.q1.slerp(player.q2, lerpFactor);
        player.head.object3D.rotation.setFromQuaternion(player.q1);
      }
      if (player.leftSaber.object3D) {
        player.leftSaber.object3D.position.lerp(player.targetLeftSaberPos, lerpFactor);
        player.leftSaber.object3D.position.y = Math.max(0.1, player.leftSaber.object3D.position.y); // Sabers above floor
        player.q1.setFromEuler(player.leftSaber.object3D.rotation);
        player.q2.setFromEuler(player.targetLeftSaberRot);
        player.q1.slerp(player.q2, lerpFactor);
        player.leftSaber.object3D.rotation.setFromQuaternion(player.q1);
      }
      if (player.rightSaber.object3D) {
        player.rightSaber.object3D.position.lerp(player.targetRightSaberPos, lerpFactor);
        player.rightSaber.object3D.position.y = Math.max(0.1, player.rightSaber.object3D.position.y); // Sabers above floor
        player.q1.setFromEuler(player.rightSaber.object3D.rotation);
        player.q2.setFromEuler(player.targetRightSaberRot);
        player.q1.slerp(player.q2, lerpFactor);
        player.rightSaber.object3D.rotation.setFromQuaternion(player.q1);
      }
    });

    if (time - this.lastTime > this.data.updateInterval) {
      this.lastTime = time;

      // Extract raw world coordinates to broadcast
      const state = this.el.sceneEl.systems.state.state;
      const payload = {
        type: 'update',
        head: {
          position: this.el.sceneEl.camera.el.getAttribute('position'),
          rotation: this.el.sceneEl.camera.el.getAttribute('rotation')
        },
        scoreData: {
          username: localStorage.getItem('supersaberusername') || 'Player',
          score: state.score.score,
          combo: state.score.combo,
          modifiers: {
            mode360: state.modifiers.mode360,
            oneSaber: state.modifiers.oneSaber
          }
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

      const payloadStr = JSON.stringify(payload);
      let sentViaWebRTC = false;

      // Try WebRTC Data Channels first
      Object.keys(this.dataChannels).forEach(id => {
        const dc = this.dataChannels[id];
        if (dc && dc.readyState === 'open') {
          try {
            dc.send(payloadStr);
            sentViaWebRTC = true;
          } catch (e) {
            console.warn(`[WebRTC] Failed to send over datachannel to ${id}`, e);
          }
        }
      });

      // Fallback to WebSocket if no data channels are open yet
      if (!sentViaWebRTC && this.ws && this.ws.readyState === 1) {
        this.ws.send(payloadStr);
      }
    }
  },

  remove: function () {
    this.disconnect();
  }
});
