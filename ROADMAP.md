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

## Phase 5: Feature Parity & Enhancements (In Progress)
- [x] Initial modifiers state implemented and wired to UI.
- [x] Implemented core backend visual logic for Ghost Notes, Disappearing Arrows, No Fail, and Fast Song modifiers.
- [ ] Implement remaining modifiers (e.g., 360 levels, one-saber).
- [ ] Multiplayer implementation.
- [ ] Enhanced mod support and custom asset loading.

## Phase 6: Polish and Robust UI
- [ ] Ensure every single feature added is represented in the in-game menus.
- [ ] Detailed tooltips and documentation within the UI.
- [ ] Comprehensive bug fixing.
