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
        const xPos = (knuckle.x - 0.5) * 2.0; // -1 to 1 spread
        const yPos = -(knuckle.y - 0.5) * 2.0 + 1.2; // Invert Y, add base height

        this.el.object3D.position.set(xPos, yPos, this.basePosition.z);

        // Calculate basic rotation based on wrist to knuckle vector
        const wrist = handLandmarks[0];
        const dx = knuckle.x - wrist.x;
        const dy = knuckle.y - wrist.y;

        // Simple 2D rotation for the saber
        const angle = Math.atan2(-dy, dx) - Math.PI / 2;
        this.el.object3D.rotation.z = angle;
      }
    }
  }
});
