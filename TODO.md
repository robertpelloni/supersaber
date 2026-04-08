# TODO

## Immediate Tasks
- [x] Complete documentation generation for this session.
- [x] Check `npm install` progress.
- [x] Locate main camera rig in `src/index.html` to begin designing the 2D "corner of desk" layout.
- [x] Setup a basic HTML/JS wrapper for importing `tmi.js` (Twitch integration).
- [x] Determine best method to inject MediaPipe script tags into `src/index.html` without breaking A-Frame.
- [x] Implement Modifiers State (Ghost Notes, No Fail, Fast Song, Disappearing Arrows) and bind them to UI.

## Short-Term Fixes/Refactors
- [x] Upgrade deprecated packages in `package.json` if they cause build failures (managed via `--legacy-peer-deps`).
- [x] Consolidate the controller configuration in `src/index.html` to allow injecting external coordinate data (for MediaPipe).
- [x] Wire up actual visual logic for Ghost Notes and Disappearing arrows inside the beat spawning mechanism.
- [x] Implement Fast Song audio and beat-loader scaling logic.
