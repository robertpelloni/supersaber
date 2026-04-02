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
- The state machinery and UI for modifiers (Ghost Notes, No Fail, etc.) is complete, but the visual logic inside the beat spawning code needs to be wired up. Check `src/components/beat.js` or `src/components/beat-loader.js` to implement the visual behavior of these modifiers based on the new `state.modifiers` object.
- Continue migrating remaining legacy dependencies to ensure build stability without using `--legacy-peer-deps`.
