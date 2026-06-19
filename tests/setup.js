global.THREE = {
  Object3D: class {},
  MeshBasicMaterial: class {},
  DoubleSide: 2,
  Vector3: class {
    constructor(x, y, z) {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
    }
    distanceTo(v) {
      return Math.sqrt(
        Math.pow(this.x - v.x, 2) +
        Math.pow(this.y - v.y, 2) +
        Math.pow(this.z - v.z, 2)
      );
    }
  }
};
global.AFRAME = {
  registerComponent: () => {}
};
