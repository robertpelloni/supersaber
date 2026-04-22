/* global AFRAME */

/**
 * Encapsulates the visual logic for a remote player's avatar.
 * Receives coordinate sync updates from multiplayer-sync.js.
 */
AFRAME.registerComponent('multiplayer-avatar', {
  schema: {
    id: {type: 'string', default: ''}
  },

  init: function () {
    // Setup head
    this.head = document.createElement('a-entity');
    this.head.setAttribute('geometry', 'primitive: box; width: 0.2; height: 0.2; depth: 0.2');
    this.head.setAttribute('material', 'color: #888; wireframe: true');
    this.el.appendChild(this.head);

    // Setup left saber
    this.leftSaber = this.createSaber('left', '#ff0000');
    this.el.appendChild(this.leftSaber);

    // Setup right saber
    this.rightSaber = this.createSaber('right', '#0000ff');
    this.el.appendChild(this.rightSaber);
  },

  createSaber: function (hand, color) {
    const saber = document.createElement('a-entity');
    const bladeContainer = document.createElement('a-entity');
    bladeContainer.setAttribute('class', 'bladeContainer');

    const blade = document.createElement('a-entity');
    blade.setAttribute('class', `blade blade${hand}`);
    blade.setAttribute('geometry', 'primitive: box; height: 0.9; depth: 0.02; width: 0.02');
    blade.setAttribute('material', `shader: flat; color: ${color}`);
    blade.setAttribute('raycastable-game', '');
    blade.setAttribute('position', '0 -0.55 0');
    bladeContainer.appendChild(blade);

    const saberGlow = document.createElement('a-entity');
    saberGlow.setAttribute('class', 'saberglow');
    saberGlow.setAttribute('obj-model', 'obj: #saberGlowObj');
    saberGlow.setAttribute('material', `shader: flat; color: ${color}; blending: additive; opacity: 0.08`);
    saberGlow.setAttribute('position', '0 -0.55 0');
    bladeContainer.appendChild(saberGlow);

    saber.appendChild(bladeContainer);

    const handle = document.createElement('a-entity');
    handle.setAttribute('class', 'saberHandle');
    handle.setAttribute('geometry', 'primitive: box; height: 0.2; depth: 0.025; width: 0.025');
    handle.setAttribute('material', 'shader: flat; color: #151515');

    const highlightTop = document.createElement('a-entity');
    highlightTop.setAttribute('class', 'highlightTop');
    highlightTop.setAttribute('geometry', 'primitive: box; height: 0.18; depth: 0.005; width: 0.005');
    highlightTop.setAttribute('material', 'shader: flat; color: #FAFAFA');
    highlightTop.setAttribute('position', '0 0 0.0125');
    handle.appendChild(highlightTop);

    const highlightBottom = document.createElement('a-entity');
    highlightBottom.setAttribute('class', 'highlightBottom');
    highlightBottom.setAttribute('geometry', 'primitive: box; height: 0.18; depth: 0.005; width: 0.005');
    highlightBottom.setAttribute('material', 'shader: flat; color: #FAFAFA');
    highlightBottom.setAttribute('position', '0 0 -0.0125');
    handle.appendChild(highlightBottom);

    saber.appendChild(handle);
    saber.setAttribute('saber-controls', `hand: ${hand}; bladeEnabled: true`);
    return saber;
  },

  updateHead: function (position, rotation) {
    if (position) this.head.setAttribute('position', position);
    if (rotation) this.head.setAttribute('rotation', rotation);
  },

  updateLeftSaber: function (position, rotation) {
    if (position) this.leftSaber.setAttribute('position', position);
    if (rotation) this.leftSaber.setAttribute('rotation', rotation);
  },

  updateRightSaber: function (position, rotation) {
    if (position) this.rightSaber.setAttribute('position', position);
    if (rotation) this.rightSaber.setAttribute('rotation', rotation);
  }
});
