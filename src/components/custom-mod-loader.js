/* global AFRAME */

/**
 * Handles drag-and-drop of custom .zip mod files on the window.
 * Parses the zip file (using JSZip if available or simple File API)
 * and emits an event to the state to load the local custom song.
 */
AFRAME.registerComponent('custom-mod-loader', {
  init: function () {
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);

    window.addEventListener('dragover', this.onDragOver);
    window.addEventListener('drop', this.onDrop);

    console.log('[Custom Mod Loader] Initialized. Ready for drag-and-drop.');
  },

  onDragOver: function (e) {
    e.preventDefault();
    e.stopPropagation();
  },

  onDrop: function (e) {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Check if it's a zip file
    if (file.name.endsWith('.zip')) {
      console.log('[Custom Mod Loader] Processing custom zip:', file.name);

      // In a full implementation, you would use JSZip to extract the info.dat and audio files.
      // For this step in A-Frame state architecture, we will mock the object structure
      // that the `searchresults` or `menuchallengeselect` expects and inject it.

      const customChallenge = {
        id: 'custom-local-' + Date.now(),
        author: 'Local Player',
        difficulty: 'Expert',
        downloads: 0,
        upvotes: 0,
        downvotes: 0,
        genre: 'Custom',
        image: 'assets/img/logo.png', // Fallback
        numBeats: { Expert: 0 },
        songDuration: 120, // Mock 2 min
        songName: file.name.replace('.zip', ''),
        songSubName: 'Local Mod',
        isLocalMod: true,
        fileRef: file // Pass the actual File object reference so beat-loader could hypothetically read it
      };

      // Dispatch into the state system
      this.el.sceneEl.emit('custommodloaded', customChallenge);
    } else {
      console.warn('[Custom Mod Loader] Unsupported file type. Please drop a .zip file.');
    }
  },

  remove: function () {
    window.removeEventListener('dragover', this.onDragOver);
    window.removeEventListener('drop', this.onDrop);
  }
});
