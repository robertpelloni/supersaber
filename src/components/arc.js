/* global AFRAME, THREE */
/**
 * Phase 8: Arcs (Sliders) Component
 * Visualizes a curved procedural tube between two notes to represent a slider.
 */
AFRAME.registerComponent('arc', {
  schema: {
    startPoint: { type: 'vec3' },
    endPoint: { type: 'vec3' },
    startCutDirection: { type: 'string', default: 'up' },
    endCutDirection: { type: 'string', default: 'up' },
    color: { type: 'string', default: 'red' }
  },

  init: function () {
    this.geometry = null;
    this.mesh = null;
    this.material = new THREE.MeshBasicMaterial({
      color: this.data.color === 'red' ? 0xff0000 : 0x0000ff,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
  },

  update: function () {
    if (this.mesh) {
      this.el.object3D.remove(this.mesh);
      if (this.geometry) { this.geometry.dispose(); }
    }

    const startPoint = this.data.startPoint;
    const endPoint = this.data.endPoint;
    const startCutDirection = this.data.startCutDirection;
    const endCutDirection = this.data.endCutDirection;

    // Calculate control points based on cut direction to create a bezier curve
    const p1 = new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z);
    const p2 = new THREE.Vector3(endPoint.x, endPoint.y, endPoint.z);

    const cp1 = p1.clone().add(this.getDirectionVector(startCutDirection).multiplyScalar(1.0));
    const cp2 = p2.clone().add(this.getDirectionVector(endCutDirection).multiplyScalar(-1.0));

    const curve = new THREE.CubicBezierCurve3(p1, cp1, cp2, p2);

    this.geometry = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.el.object3D.add(this.mesh);
  },

  getDirectionVector: function (direction) {
    switch (direction) {
      case 'up': return new THREE.Vector3(0, 1, 0);
      case 'down': return new THREE.Vector3(0, -1, 0);
      case 'left': return new THREE.Vector3(-1, 0, 0);
      case 'right': return new THREE.Vector3(1, 0, 0);
      case 'upLeft': return new THREE.Vector3(-0.707, 0.707, 0);
      case 'upRight': return new THREE.Vector3(0.707, 0.707, 0);
      case 'downLeft': return new THREE.Vector3(-0.707, -0.707, 0);
      case 'downRight': return new THREE.Vector3(0.707, -0.707, 0);
      default: return new THREE.Vector3(0, 0, 0);
    }
  },

  remove: function () {
    if (this.mesh) {
      this.el.object3D.remove(this.mesh);
      if (this.geometry) { this.geometry.dispose(); }
    }
  }
});
