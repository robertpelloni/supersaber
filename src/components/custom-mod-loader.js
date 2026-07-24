/* eslint-disable no-undef */
/* global AFRAME */
import JSZip from 'jszip';

/**
 * Handles drag-and-drop of custom .zip mod files on the window.
 * Parses the zip file using JSZip and emits an event to the state to load the local custom song.
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

      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        JSZip.loadAsync(arrayBuffer).then((zip) => {
          console.log('[Custom Mod Loader] ZIP contents:', Object.keys(zip.files));

          let infoFile = zip.file('info.dat') || zip.file('Info.dat');
          if (!infoFile) {
            console.error('[Custom Mod Loader] Could not find info.dat in the zip file.');
            this.el.sceneEl.emit('asset-load-error', 'Invalid zip: Missing info.dat');
            return;
          }

          infoFile.async('string').then((infoJson) => {
            const info = JSON.parse(infoJson);
            console.log('[Custom Mod Loader] Parsed info.dat:', info);

            // Mock basic difficulty mapping
            const difficultySets = info._difficultyBeatmapSets || [];
            let difficulties = [];
            let defaultDifficulty = 'Expert';
            if (difficultySets.length > 0 && difficultySets[0]._difficultyBeatmaps) {
              difficulties = difficultySets[0]._difficultyBeatmaps.map(m => m._difficulty);
              if (difficulties.includes('Expert')) defaultDifficulty = 'Expert';
              else defaultDifficulty = difficulties[0];
            }

            // Build challenge object expected by state
            const customChallenge = {
              id: 'custom-local-' + Date.now(),
              author: info._songAuthorName || 'Local Player',
              difficulty: defaultDifficulty,
              downloads: 0,
              upvotes: 0,
              downvotes: 0,
              genre: 'Custom',
              image: 'assets/img/logo.png', // Fallback, could extract cover image later
              numBeats: { [defaultDifficulty]: 0 },
              songDuration: 120, // Cannot easily parse audio duration yet, mock
              songName: info._songName || file.name.replace('.zip', ''),
              songSubName: info._songSubName || 'Local Mod',
              isLocalMod: true,
              zipFile: zip, // Pass the parsed JSZip object reference for beat-loader to read audio/dat
              info: info, // Pass info block to derive BPM
              audioFileName: info._songFilename
            };

            // Dispatch into the state system
            this.el.sceneEl.emit('custommodloaded', customChallenge);
          }).catch((err) => {
            console.error('Error parsing info.dat:', err);
          });
        }).catch((err) => {
          console.error('Error reading zip:', err);
          this.el.sceneEl.emit('asset-load-error', 'Failed to read ZIP file.');
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      console.warn('[Custom Mod Loader] Unsupported file type. Please drop a .zip file.');
    }
  },

  remove: function () {
    window.removeEventListener('dragover', this.onDragOver);
    window.removeEventListener('drop', this.onDrop);
  }
});
