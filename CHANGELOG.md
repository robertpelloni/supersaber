# Changelog

All notable changes to this project will be documented in this file.

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
