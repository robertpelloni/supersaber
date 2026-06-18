# Super Saber - Project Vision

## Overview
Super Saber aims to be the ultimate, all-encompassing rhythm game experience, bringing together the best features from all versions of Beat Saber into a unified, open-source project. Originally a WebVR clone built with A-Frame and JavaScript, the project is expanding into a multi-modal experience.

## Ultimate Goals
1. **Multi-Modal Gameplay**:
   - **Full VR Mode**: Maintain and improve the robust WebVR/WebXR experience for users with Oculus, Vive, and other supported headsets.
   - **"Corner of my Desk" 2D Mode**: A windowed, non-VR mode where the game can be played passively or actively on a desktop screen, utilizing optical hand tracking or traditional controllers.
2. **Optical Hand Tracking**:
   - Integrate computer vision solutions (e.g., MediaPipe) to allow players to use standard webcams to "waggle their hands" to control the sabers, creating an accessible input method requiring no specialized hardware.
3. **Deep Twitch Integration ("dnb twitch game")**:
   - Build robust hooks for Twitch chat interaction.
   - Viewers can spawn obstacles, alter gameplay speed, vote on songs, and directly influence the player's session.
   - Strong focus on Drum and Bass and high-BPM gameplay.
4. **Comprehensive Feature Parity**:
   - Aiming to implement every modifier, obstacle, song format, and specific feature from the history of Beat Saber.
   - Provide an ultimate sandbox for community maps (BeatSaver integration).

## Architectural Design
- **Core Framework**: A-Frame / Three.js / WebGL.
- **State Management**: `aframe-state-component` for centralized game state.
- **Inputs**: WebXR Controllers, Desktop Mouse/Keyboard, MediaPipe optical hand tracking.
- **Deployment**: Web-based deployment (GitHub Pages, Supermedium, etc.) ensuring maximum accessibility across platforms without local installation.

## Ongoing Directives
- **Documentation**: All models and implementors must heavily document new code, update these markdown files, and follow strict tracking protocols.
- **Robust UI**: Every backend feature must have comprehensive, clear UI representations.
- **Testing**: No feature is complete until verified thoroughly.

*Last updated during initial deep analysis and pivot phase.*

## Expansion & Long-term Features
- **Multiplayer / Cooperative Modes**: Allow users to join the same instance and compete or cooperate.
- **Enhanced Twitch Voting**: Let chat organically vote on the next song.
- **Custom Assets**: The ability to drop in custom 3D models for sabers, blocks, or stages to fully personalize the experience.

## Current Direction (Phase 7+)
- **Full Custom Web Editor**: Continuing expansion into full `.mp3` and `.ogg` native processing. The project is heavily prioritizing an in-engine native mapping software (timeline scrubbers, audio peak extractors, visual 3D array grids) directly compiled to `custom_map.json` downloads. The goal is removing the dependency on external applications entirely.

# Beat Saber: Comprehensive Feature & Version History

## Core Gameplay Mechanics
- **Blocks (Notes)**:
  - Directional Blocks (require specific cut direction).
  - Any-Direction Blocks (dot blocks, can be cut from any angle).
  - Arcs / Sliders (long continuous cuts, introduced in v1.18.0).
  - Chains / Burst Sliders (sequential blocks with a leader and small links, introduced in v1.18.0).
- **Weapons**: Two Sabers (usually Red/Blue), customizable colors, physics-based collision detection.
- **Obstacles**:
  - Walls/Barriers (requires physical dodging/crouching).
  - Bombs (deducts points/combo if hit by sabers).
- **Scoring System**:
  - Swing angle before cut: 70 points max (requires 100-degree swing).
  - Swing angle after cut: 30 points max (requires 60-degree follow-through).
  - Cut accuracy (center of block): 15 points max.
  - Total max points per standard block: 115.
  - Arcs and Chains have partial/fractional scoring.
- **Combo/Multiplier System**: 1x, 2x, 4x, 8x multiplier based on consecutive successful cuts. Multiplier resets on miss, wall hit, or bomb hit. Energy bar depletes on misses and replenishes on successful hits.

## Game Modes
- **Standard Mode**: Two sabers, stationary forward-facing gameplay.
- **One Saber Mode**: Gameplay designed for a single saber.
- **No Arrows Mode**: All blocks are converted to Any-Direction blocks.
- **360 Degree / 90 Degree Modes**: Blocks approach from multiple lanes arranged in a circle/arc around the player (Introduced in v1.6.0).
- **Multiplayer Mode**: Real-time competitive mode with 5 players, featuring avatars, live scoreboards, spectator mode, and end-game badges (Longest Combo, Most Accurate, etc.) (Introduced in v1.12.0).
- **Campaign Mode**: Progression-based levels with specific objectives (e.g., minimum score, maximum hand movement distance, minimum combo) and modifiers forced.
- **Party Mode**: Local leaderboards for pass-and-play sessions.
- **Practice Mode**: Ability to scrub the song timeline and adjust playback speed (e.g., 50% to 150%).

## Modifiers
### Positive Modifiers (Score Reduction)
- **No Fail (-50%)**: The game continues even if the energy bar fully depletes.
- **No Obstacles (-5%)**: Removes all walls from the map.
- **No Bombs (-10%)**: Removes all bombs from the map.
- **No Arrows (-30%)**: Removes directional requirements from all blocks.
- **Slower Song (-30%)**: Decreases song speed (usually to 85%).

### Negative Modifiers (Score Bonus)
- **Insta Fail (+5%) / One Life**: A single mistake (miss, bad cut, bomb hit, wall hit) ends the level.
- **Battery Energy (+5%) / 4 Lives**: Limited energy bar (4 lives), replenishes slightly on consecutive successful cuts.
- **Ghost Notes (+11%)**: Notes become invisible shortly before reaching the player.
- **Disappearing Arrows (+7%)**: The directional arrows on notes fade out as they approach the player.
- **Faster Song (+8%)**: Increases song speed (usually to 120%).
- **Super Fast Song (+10%)**: Increases song speed (usually to 150%).
- **Strict Angles (+4%)**: Requires more precise swing angles to register a good cut.
- **Pro Mode (Score varies)**: Hitboxes are tighter and correspond more strictly to the visual model of the block.
- **Small Notes (Score varies)**: Note hitboxes and visual models are 50% smaller.

## Environments & Lighting Systems
- **V1 Lighting**: Basic lane-based control (3 Light Lanes, 2 Laser Lanes, 2 ring lanes). 4 event types (Turn off, Turn on, Flash, Fade).
- **V2 Lighting**: Introduced more complex lane controls and environmental movements.
- **V3 Lighting (v1.20.0+)**: Advanced lighting system with granular control over light groups, translation, rotation, and complex strobe sequences.
- **Environments**: The First, Origins, Triangle, Billie Eilish, Linkin Park, Interscope, Skrillex, Lady Gaga, Fall Out Boy, Daft Punk, etc.

## Major Version History Highlights
- **v0.11.0 (May 2018)**: Initial Early Access release.
- **v1.0.0 (May 2019)**: Official Release. 2D Level Editor launched publicly.
- **v1.6.0 (Dec 2019)**: 360 Degree and 90 Degree modes added.
- **v1.12.0 (Oct 2020)**: Multiplayer mode added.
- **v1.18.0 (Mar 2022)**: Sliders (Arcs), Burst Sliders (Chains), and V3 Lighting system introduced.
- **v1.20.0+**: UI overhauls, new modifiers (Pro Mode, Small Notes), continuous music packs.
