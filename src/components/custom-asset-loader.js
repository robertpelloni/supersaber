/* eslint-disable no-undef */
/* global AFRAME */

/**
 * Handles drag-and-drop of custom asset files (.obj, .gltf, .glb, .png, .jpg)
 * Validates sizes and emits blob URLs to the A-Frame state system.
 */
AFRAME.registerComponent('custom-asset-loader', {
  init: function () {
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);

    // Bind to window to allow dropping anywhere
    window.addEventListener('dragenter', this.onDragEnter);
    window.addEventListener('dragover', this.onDragOver);
    window.addEventListener('dragleave', this.onDragLeave);
    window.addEventListener('drop', this.onDrop);

    console.log('[Custom Asset Loader] Initialized. Ready for drag-and-drop of 3D Models/Textures.');

    // Max size in bytes (15MB limit)
    this.MAX_FILE_SIZE = 15 * 1024 * 1024;
  },

  onDragEnter: function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.el.sceneEl.emit('asset-drag-enter');
  },

  onDragOver: function (e) {
    e.preventDefault();
    e.stopPropagation();
    // Required to allow dropping
  },

  onDragLeave: function (e) {
    e.preventDefault();
    e.stopPropagation();

    // Prevent flickering when dragging over child elements
    if (e.clientX === 0 || e.clientY === 0) {
      this.el.sceneEl.emit('asset-drag-leave');
    }
  },

  onDrop: function (e) {
    e.preventDefault();
    e.stopPropagation();

    this.el.sceneEl.emit('asset-drag-leave');

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileName = file.name.toLowerCase();

    // Check size limit
    if (file.size > this.MAX_FILE_SIZE) {
      this.el.sceneEl.emit('asset-load-error', `File too large: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB). Max limit is 15MB.`);
      return;
    }

    // Process model assets (Saber)
    if (fileName.endsWith('.obj') || fileName.endsWith('.gltf') || fileName.endsWith('.glb')) {
      console.log(`[Custom Asset Loader] Processing 3D Model: ${file.name}`);
      this.el.sceneEl.emit('asset-load-start', `Loading model ${file.name}...`);

      const blobUrl = URL.createObjectURL(file);

      // We assume .obj by default based on the existing `customSaberModel` mapping which binds to `obj-model`
      // For a robust system, we would conditionally attach `gltf-model` vs `obj-model` but we will stick to the existing OBJ pattern
      if (fileName.endsWith('.obj')) {
        this.el.sceneEl.emit('custom-saber-loaded', blobUrl);
      } else {
        this.el.sceneEl.emit('asset-load-error', `Only .obj models are fully supported for sabers currently.`);
      }
    }
    // Process texture assets (Stage/Blocks)
    else if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
      console.log(`[Custom Asset Loader] Processing Texture: ${file.name}`);
      this.el.sceneEl.emit('asset-load-start', `Loading texture ${file.name}...`);

      const blobUrl = URL.createObjectURL(file);
      this.el.sceneEl.emit('custom-texture-loaded', blobUrl);
    } else if (fileName.endsWith('.mp3') || fileName.endsWith('.ogg')) {
      console.log(`[Custom Asset Loader] Processing Audio: ${file.name}`);
      this.el.sceneEl.emit('asset-load-start', `Loading audio ${file.name}...`);

      const blobUrl = URL.createObjectURL(file);
      this.el.sceneEl.emit('editor-audio-loaded', { url: blobUrl, name: file.name });
    } else if (!fileName.endsWith('.zip')) {
      // Ignore .zip since custom-mod-loader handles it
      this.el.sceneEl.emit('asset-load-error', `Unsupported file type: ${file.name}`);
    }
  },

  remove: function () {
    window.removeEventListener('dragenter', this.onDragEnter);
    window.removeEventListener('dragover', this.onDragOver);
    window.removeEventListener('dragleave', this.onDragLeave);
    window.removeEventListener('drop', this.onDrop);
  }
});
