# TODO

## Immediate Tasks
- [x] Complete documentation generation for this session.
- [x] Check `npm install` progress.
- [x] Locate main camera rig in `src/index.html` to begin designing the 2D "corner of desk" layout.
- [x] Setup a basic HTML/JS wrapper for importing `tmi.js` (Twitch integration).
- [x] Determine best method to inject MediaPipe script tags into `src/index.html` without breaking A-Frame.
- [x] Implement Modifiers State (Ghost Notes, No Fail, Fast Song, Disappearing Arrows) and bind them to UI.
- [x] Implement "One Saber" mode and "360 Level" mode visual logic.

## Short-Term Fixes/Refactors
- [x] Upgrade deprecated packages in `package.json` if they cause build failures (managed via `--legacy-peer-deps`).
- [x] Consolidate the controller configuration in `src/index.html` to allow injecting external coordinate data (for MediaPipe).
- [x] Wire up actual visual logic for Ghost Notes and Disappearing arrows inside the beat spawning mechanism.
- [x] Implement Fast Song audio and beat-loader scaling logic.
- [x] Initial implementation of custom sabers geometry binding.
- [x] Twitch chat voting integration for song selection.
- [x] Migrate completely away from deprecated older `npm` packages where possible.

## Completed Tasks
- [x] Integrate Nunjucks based tooltips for multiplayer and modifiers directly beneath their toggles inside menu.html.
- [x] Create Global Library documentation list and structure dashboard inside docs.html, rendering out from webpack configuration globally and linking natively into the A-Frame main UI loop context.

- [x] Complete Modifier Scoring Implementation for High Scores. Submitting scores to Firebase now calculates a `finalScore` which scales the raw `state.score.score` values by their respective active modifier percentages.

- [x] Complete Modifier Scoring Implementation for High Scores. Submitting scores to Firebase now calculates a `finalScore` which scales the raw `state.score.score` values by their respective active modifier percentages.

- [x] Complete native custom mod drag-and-drop system. Allows `zip` files to be dragged directly into the browser viewport natively, binding into the A-Frame state to trigger load logic immediately on drop.

- [x] Complete Moderator Verification for Twitch. Only mods and the broadcaster can trigger `!startvote` and `!stopvote`.

- [x] Comprehensive Bug Fixing: Removed obsolete legacy linter blocks and eliminated fatal state errors in the WebGL generation scripts (e.g. `twister.js`, `trail.js`).

- [x] Implemented Multiplayer Visual Refinement. Remote avatars correctly interpolate smoothly over WebSocket ticks instead of hard snapping, use custom scaling properties if passed, have customized `#ff4444` distinct glow shaders, and have strict Math boundaries preventing them from sliding below the floor `Math.max(0.5, player.head.object3D.position.y)`.

## Completed Tasks
- [x] Generated `IDEAS.md` evaluating the repository's trajectory in complete depth, analyzing every potential pivot path and identifying architectural upgrades such as WebRTC, Vite, Vue 3, and TypeScript integrations.

## Completed Tasks
- [x] Integrated `trail` visual effect directly onto the dynamically instantiated remote player controllers in `multiplayer-sync.js`.

## Completed Tasks
- [x] Initialized Phase 7 Editor Mode. Implemented `isEditing` toggle directly in `state/index.js`, wired `[ ENTER BEATMAP EDITOR ]` to the main menu context, and crafted `src/templates/editor.html` GUI shell securely.

## Completed Tasks
- [x] Complete drag-and-drop system for 3D Custom Sabers natively using `custom-asset-loader.js` and blob URLs.

## Completed Tasks
- [x] Extended `custom-asset-loader` to securely accept `.mp3` and `.ogg` files mapped to `URL.createObjectURL()`. This natively intercepts the drop and updates the Phase 7 Editor grid GUI to replace instructions with actual file-mapped layout bindings and transport controls automatically.

## Completed Tasks
- [x] Integrated `saber-particles` and `raycaster__game` visual effects directly onto the dynamically instantiated remote player controllers in `multiplayer-sync.js` enabling live multiplayer spark collisions.

## Completed Tasks
- [x] Bound synchronous floating text leaderboards to multiplayer avatars fetching score array subsets natively.
