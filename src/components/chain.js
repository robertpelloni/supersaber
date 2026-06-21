/* global AFRAME, THREE */
/**
 * Phase 8: Chains (Burst Sliders) Component
 * Visualizes a connected sequence of notes (Burst Sliders) that require continuous swinging.
 * The Chain is composed of a Head (standard note size) and a sequence of Links (smaller note size).
 */
AFRAME.registerComponent('chain', {
  schema: {
    startPoint: { type: 'vec3' },
    endPoint: { type: 'vec3' },
    numLinks: { type: 'int', default: 5 },
    cutDirection: { type: 'string', default: 'up' },
    color: { type: 'string', default: 'red' },
    linkSpacing: { type: 'number', default: 0.5 }
  },

  init: function () {
    this.links = [];
    this.material = new THREE.MeshStandardMaterial({
      color: this.data.color === 'red' ? 0xff0000 : 0x0000ff,
      roughness: 0.2,
      metalness: 0.5
    });

    // Instead of instantiating the components, we will create simple meshes for visual representation.
    // In a full implementation, these would spawn actual 'beat' entities.
    this.createChain();
  },

  update: function () {
    this.removeChain();
    this.createChain();
  },

  createChain: function () {
    const start = new THREE.Vector3(this.data.startPoint.x, this.data.startPoint.y, this.data.startPoint.z);
    const end = new THREE.Vector3(this.data.endPoint.x, this.data.endPoint.y, this.data.endPoint.z);

    const direction = new THREE.Vector3().subVectors(end, start).normalize();
    const distance = start.distanceTo(end);

    const actualSpacing = distance / (this.data.numLinks > 0 ? this.data.numLinks : 1);

    // Create the Head
    const headGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const headMesh = new THREE.Mesh(headGeometry, this.material);
    headMesh.position.copy(start);
    this.el.object3D.add(headMesh);
    this.links.push(headMesh);

    // Create the Links (smaller notes)
    const linkGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);

    for (let i = 1; i <= this.data.numLinks; i++) {
      const linkMesh = new THREE.Mesh(linkGeometry, this.material);
      const position = start.clone().add(direction.clone().multiplyScalar(i * actualSpacing));
      linkMesh.position.copy(position);
      this.el.object3D.add(linkMesh);
      this.links.push(linkMesh);
    }
  },

  removeChain: function () {
    for (let i = 0; i < this.links.length; i++) {
      this.el.object3D.remove(this.links[i]);
      if (this.links[i].geometry) {
        this.links[i].geometry.dispose();
      }
    }
    this.links = [];
  },

  remove: function () {
    this.removeChain();
    if (this.material) {
      this.material.dispose();
    }
  }
});
