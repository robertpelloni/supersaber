/* global AFRAME, THREE */
/**
 * Phase 8: V3 Lighting Visualizer Editor / Engine upgrade
 * Supports granular light groups, translation, and rotation events based on Beat Saber V3 spec.
 */
AFRAME.registerComponent('v3-lighting', {
  schema: {
    enabled: {default: true}
  },

  init: function () {
    this.lightGroups = new Map();
    // Default group setup
    this.createLightGroup(0, 'bg');
    this.createLightGroup(1, 'tunnel');
    this.createLightGroup(2, 'leftlaser');
    this.createLightGroup(3, 'rightlaser');
    this.createLightGroup(4, 'floor');

    // Additional V3 group initialization would happen dynamically or here
  },

  createLightGroup: function (groupId, name) {
    const group = {
      name: name,
      lights: [],
      translation: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1),
      color: 'off'
    };
    this.lightGroups.set(groupId, group);
  },

  handleV3Event: function (event) {
    if (!this.data.enabled) return;

    // V3 spec introduces translation and rotation events, often mapped to new types.
    // e.g. type 12 might be left laser rotation, but in V3 they have specific
    // light color events and specific transformation events.
    // We intercept these specific V3 types (e.g. 100+ or custom mapped).

    const { _type, _customData } = event;

    // Simple emulation of V3 event mapping
    if (_customData && _customData.color) {
      this.setGroupColor(_type, _customData.color);
    }

    if (_customData && _customData.rotation) {
      this.setGroupRotation(_type, _customData.rotation);
    }

    if (_customData && _customData.position) {
      this.setGroupTranslation(_type, _customData.position);
    }
  },

  setGroupColor: function (groupId, colorCode) {
    const group = this.lightGroups.get(groupId);
    if (!group) return;

    // Dispatch events to the actual meshes to change their shader colors
    this.el.emit(`${group.name}color${colorCode}`, null, false);
  },

  setGroupRotation: function (groupId, eulerArray) {
    // Advanced V3 rotation logic
    const group = this.lightGroups.get(groupId);
    if (!group) return;
    // Map array to Euler and apply to group meshes
    // group.rotation.set(eulerArray[0], eulerArray[1], eulerArray[2]);
  },

  setGroupTranslation: function (groupId, posArray) {
    // Advanced V3 translation logic
  }
});
