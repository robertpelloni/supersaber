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
