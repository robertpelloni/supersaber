# Handoff Documentation

## Current State
- The user has requested an incredibly ambitious pivot to turn Super Saber into the "Ultimate" version.
- Key requirements include:
  1. Complete feature parity with every version of Beat Saber.
  2. A "corner of my desk" 2D windowed mode.
  3. Optical hand tracking (using a webcam to swing sabers).
  4. Oculus controller support maintained.
  5. Twitch chat integration (specifically for Drum and Bass streams).
- I have generated the massive initial documentation suite to structure this undertaking (`VISION.md`, `ROADMAP.md`, `TODO.md`, `CHANGELOG.md`, `MEMORY.md`, `DEPLOY.md`, `IDEAS.md`, `AGENTS.md`).

## Next Steps for Implementor Models
- Review `TODO.md` and `ROADMAP.md`.
- Read `AGENTS.md` to understand instructions for file editing and testing.
- Almost all single-player modifiers (Ghost Notes, Disappearing Arrows, Fast Song, No Fail, One Saber, 360 Levels) are now fully implemented and bound to the UI.
- Next major missing features from the ultimate vision are: **Multiplayer**, **Custom Saber Models/Assets**, and **Twitch Voting Integration** (allowing chat to vote on the next song).
- We also need to begin migrating away from older, deprecated A-Frame dependencies to ensure future build stability.
