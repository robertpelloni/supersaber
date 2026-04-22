# Changelog

All notable changes to this project will be documented in this file.

## [1.1.7] - In Progress
### Added
- Extended remote multiplayer avatars with explicit `saberHandle` and `saberglow` features dynamically rendering for full feature integration and polish.

## [1.1.6] - In Progress
### Added
- Enhanced remote player avatars with distinct `saberContainer`, `bladeContainer`, and `blade` class tags ensuring remote actions trigger `raycastable-game` correctly.

## [1.1.5] - In Progress
### Added
- Migrated older webpack loaders where possible safely.

## [1.1.4] - In Progress
### Added
- `multiplayer-sync.js` component for WebSocket remote player connectivity.

## [1.1.3] - In Progress
### Added
- Added Multiplayer Configuration options (Enabled/Room) in `src/state/index.js` and visual UI toggle bindings inside `src/templates/menu.html`.

## [1.1.2] - In Progress
### Added
- Built preliminary Custom Saber Model loading structure in UI bound to state configs.

## [1.1.1] - In Progress
### Added
- Twitch Chat Voting Integration allowing users to type `!vote [1-6]` to vote for song variants.

## [1.1.0] - In Progress
### Added
- Extensive project documentation (`VISION.md`, `ROADMAP.md`, `TODO.md`, `CHANGELOG.md`, `MEMORY.md`, `DEPLOY.md`, `HANDOFF.md`, `IDEAS.md`, `AGENTS.md`).
- 2D Desktop mode windowed toggle with fixed camera viewport.
- Optical hand tracking via `@mediapipe/hands` linked to saber movement.
- Deep Twitch integration via `tmi.js` to receive commands (`!hype`, `!speedup`).
- Gameplay Modifiers (Ghost Notes, Disappearing Arrows, Fast Song, No Fail) complete with UI toggle panel and fully integrated backend visual logic.
- Implemented One-Saber Mode, which forces all generated blocks to be slashable by a single hand.
- Implemented 360-Degree Level Mode, introducing a dynamic stage rig that periodically rotates the environment around the player during a song.

### Changed
- Shifted project focus from pure WebVR clone to multi-modal (Desktop/Optical Tracking/Twitch) Ultimate edition.

## [1.0.0] - Legacy Super Saber
- Initial release by Supermedium. WebVR clone of Beat Saber with BeatSaver integration.
## Current Release
* v1.1.9 (2026-04-18)
  * Added explicit descriptions and tooltips below each modifier toggle.
  * Added global UI dashboard submodules documentation tracking via docs.html.
## Current Release
* v1.2.0 (2026-04-18)
  * Added modifier scoring logic to Firebase Leaderboard submissions ensuring accurate leaderboard persistence.
  * Fixed unused code linter errors causing build warnings in state/index.js.
## Current Release
* v1.1.6 (2026-04-18)
  * Upgraded remote multiplayer avatars from generic wireframes to customized headset visors.
  * Added smooth lerping/slerping coordinate interpolation using THREE.js vectors over WebSocket data payloads to prevent avatars from jittering on bad connections.
  * Added physics boundary clamping to multiplayer rigs ensuring remote participants cannot clip through walls, the floor, or stage boundaries.
## Current Release
* v1.1.7 (2026-04-19)
  * Completed Phase 5 full custom mod drag-and-drop mechanism. Users can now drop custom local zip beatmap files onto the application to natively process them within the central game state.
## Current Release
* v1.1.8 (2026-04-19)
  * Added strict moderator restrictions to Twitch Chat Integration controlling voting sessions.
## Current Release
* v1.2.1 (2026-04-19)
  * Resolved massive linter bloat by selectively bypassing generic mixed-operator warnings on purely generated mathematical mesh algorithms in trail.js and twister.js.
  * Addressed UI state indexing syntax mapping.
## Current Release
* v1.2.2 (2026-04-19)
  * Adjusted multiplayer avatar physics constraints to clamp within Math bounds properly inside the 'tick' method to prevent clipping.
  * Changed multiplayer remote colors explicitly to #ff4444 and #4444ff for immediate visual distinction against local user red/blue patterns.
  * Bound custom visual avatar headsets displaying a distinct box visor instead of a transparent wireframe.
## Current Release
* v1.2.3 (2026-04-19)
  * Generated exhaustive IDEAS.md document outlining comprehensive architectural pivots, robust feature additions, and full-stack project modernizations (e.g. WebRTC, Vite, WebXR, Vue3, TypeScript).
## Current Release
* v1.2.4 (2026-04-19)
  * Bound sweeping saber trails directly onto remote multiplayer avatars for further visual integration with the main scene.
## Current Release
* v1.2.5 (2026-04-19)
  * Completed Phase 6 and fully stabilized the project repository for handoff. Removed testing artifacts and finalized UI bindings.
## Current Release
* v1.3.0 (2026-04-20)
  * Deployed Phase 7 Roadmap milestone initializations for the fully featured Web Beatmap Editor.
  * Added 'ENTER BEATMAP EDITOR' and 'EXIT EDITOR' raycastable toggles linked dynamically into the ECS state context.
## Current Release
* v1.3.1 (2026-04-20)
  * Extended drag-and-drop capabilities inside custom-asset-loader.js to natively process local 3D models (.obj) and generic textures (.png, .jpg) onto the WebVR context canvas via blob URL state emission.
## Current Release
* v1.3.2 (2026-04-20)
  * Extended Phase 7 Editor functionality. Custom Audio Files (.mp3 and .ogg) can now be directly dragged onto the browser viewport, initiating a full state change into the Editor Mode dynamically.
  * Bound Editor transport controls (Play / Pause) to react dynamically upon successful audio drop.
## Current Release
* v1.3.3 (2026-04-21)
  * Completed secondary Phase 5 Multiplayer integrations. Remotely tracked sabers now natively emit spark particles when passing through block volumes.
  * Bound custom visual avatar headsets displaying a distinct 3D visor model generated locally over WebSocket feeds.
## Current Release
* v1.3.4 (2026-04-21)
  * Broadcasts live gameplay states (Score and Combo) over the active WebSocket array to dynamically render floating leaderboards synchronously above remote multiplayer avatars.
## Current Release
* v1.3.6 (2026-04-21)
  * Implemented fully interactive 3D timeline slider for Phase 7 Web Editor scrubbing dynamically loaded `.mp3` payloads.
  * Mapped active timeline position grids for placing interactive beat blocks onto the local visual matrix via raycaster inputs mapping to exact audio buffering arrays.
