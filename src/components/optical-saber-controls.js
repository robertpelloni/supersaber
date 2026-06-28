/* global AFRAME, THREE */
AFRAME.registerComponent('optical-saber-controls', {
  schema: {
    hand: {default: 'right'}
  },

  init: function () {
    this.onHandsUpdated = this.onHandsUpdated.bind(this);
    this.sceneEl = this.el.sceneEl;
    this.sceneEl.addEventListener('optical-hands-updated', this.onHandsUpdated);

    // Initial position in front of camera
    this.basePosition = new THREE.Vector3(
      this.data.hand === 'left' ? -0.3 : 0.3,
      1.2,
      -0.5
    );
  },

  remove: function () {
    this.sceneEl.removeEventListener('optical-hands-updated', this.onHandsUpdated);
  },

  onHandsUpdated: function (evt) {
    if (!this.el.sceneEl.systems.state.state.is2DDesktopMode) return;

    const data = evt.detail;
    if (!data.hands || data.hands.length === 0) return;

    for (let i = 0; i < data.hands.length; i++) {
      const handLandmarks = data.hands[i];
      // MediaPipe label might be 'Left' or 'Right', but we need to map it carefully
      // Note: webcam is often mirrored.
      const classification = data.handedness[i].label.toLowerCase();

      // Assume a flipped view for webcam
      const isLeftHand = classification === 'right';

      if ((this.data.hand === 'left' && isLeftHand) ||
          (this.data.hand === 'right' && !isLeftHand)) {
        // Landmark 9 is the middle finger MCP (knuckle), a good center point
        const knuckle = handLandmarks[9];

        // Map normalized coordinates (0-1) to local A-Frame space
        // X ranges from 0 (left) to 1 (right)
        // Y ranges from 0 (top) to 1 (bottom)
        // Use hand bounding box size (approximate) to estimate Z-depth.
        // A larger hand means it's closer to the camera.
        const wrist = handLandmarks[0];
        const wristToMiddleFingerDist = Math.sqrt(
          Math.pow(knuckle.x - wrist.x, 2) + Math.pow(knuckle.y - wrist.y, 2)
        );
        // Base Z is -0.5. As hand gets smaller, it goes further back.
        // E.g., if dist is 0.2 (close), z = -0.5. If dist is 0.05 (far), z = -1.5.
        // This is a rough heuristic.
        const estimatedZ = -1.5 + (wristToMiddleFingerDist * 5.0);
        const clampedZ = Math.min(-0.2, Math.max(-2.5, estimatedZ));

        const xPos = (knuckle.x - 0.5) * 2.0; // -1 to 1 spread
        const yPos = -(knuckle.y - 0.5) * 2.0 + 1.2; // Invert Y, add base height

        // Update position
        this.el.object3D.position.set(xPos, yPos, clampedZ);

        // Simple 2D rotation for the saber based on wrist-to-knuckle angle
        const dx = knuckle.x - wrist.x;
        const dy = knuckle.y - wrist.y;
        const angle = Math.atan2(-dy, dx) - Math.PI / 2;

        // Disable default saber-controls position overriding if we're actively optical tracking
        const saberControls = this.el.components['saber-controls'];
        if (saberControls) {
          saberControls.opticalOverride = true; // Inject a flag that saber-controls can respect
        }

        this.el.object3D.rotation.z = angle;
        // Optionally add pitch/yaw based on other hand landmarks in the future.
      }
    }
  }
});
