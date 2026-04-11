# Roadmap

## Phase 1: Deep Analysis & Restructuring (Current)
- [x] Initial codebase review (A-Frame, package setup).
- [x] Establishment of project documentation (VISION, ROADMAP, TODO, CHANGELOG, MEMORY, DEPLOY, HANDOFF, IDEAS, AGENTS).
- [ ] Upgrade dependencies and ensure build system stability.

## Phase 2: Desktop "Corner of Desk" Mode (Complete)
- [x] Implement a fixed-camera 2D desktop mode alongside the existing VR rig.
- [x] Allow toggling between VR and 2D modes.
- [x] Adjust UI rendering for 2D fixed perspective.

## Phase 3: Optical Hand Tracking Integration (Complete)
- [x] Evaluate and integrate MediaPipe Hands (or similar browser-based computer vision library).
- [x] Map 2D hand coordinates/depth to the 3D saber positions in the desktop mode.
- [x] Add configuration settings for webcam selection and tracking sensitivity.

## Phase 4: Twitch Integration (Complete)
- [x] Connect a Twitch chat client (e.g., `tmi.js`) to the browser application.
- [x] Implement event listeners for chat commands (e.g., `!spawn`, `!speedup`, `!hype`, `!ghostnotes`, `!nofail`).
- [x] Link chat events to the A-Frame state component to dynamically modify gameplay.
- [x] Twitch chat voting integration for song selection.

## Phase 5: Feature Parity & Enhancements (In Progress)
- [x] Initial modifiers state implemented and wired to UI.
- [x] Implemented core backend visual logic for Ghost Notes, Disappearing Arrows, No Fail, and Fast Song modifiers.
- [x] Implement remaining modifiers (e.g., 360 levels, one-saber).
- [x] Multiplayer implementation state bindings and UI components.
- [ ] Fully networked replication via WebSockets.
- [x] Preliminary custom asset loading logic configured in state and UI.
- [ ] Full custom mod drag-and-drop system.

## Phase 6: Polish and Robust UI
- [ ] Ensure every single feature added is represented in the in-game menus.
- [ ] Detailed tooltips and documentation within the UI.
- [ ] Comprehensive bug fixing.

## Submodules & External Libraries Tracking
- **A-Frame Core (`vendor/aframe-master.js`)**: Modified 0.8.2 framework (WebVR API legacy compatibility).
- **MediaPipe Hands (`@mediapipe/hands`)**: ^0.4.x via NPM. Used for Optical Hand Tracking.
- **TMI.js (`tmi.js`)**: ^1.8.3 via NPM. Core library for Twitch Chat integration.
- **Firebase (`firebase`)**: ^5.5.8 via NPM. Required for leaderboard cloud store operations.

## Directory Structure
- `/src/`: Core application source files.
  - `/components/`: A-Frame specific entity-component logic.
  - `/state/`: Application state management via `aframe-state-component`.
  - `/templates/`: Nunjucks HTML templates.
- `/vendor/`: Pre-compiled legacy dependencies not available via modern NPM.
- `/assets/`: Sounds, textures, fonts, and 3D models.
- `/build/`: Webpack output directory (contains `build.js`).
