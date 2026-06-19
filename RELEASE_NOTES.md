# Super Saber - Release Notes

## Version 2.0.0-beta.1

Welcome to the Super Saber 2.0.0 Closed Beta! This major release marks a significant milestone in our journey towards the "Ultimate Parity" goal, bringing the project to a near-feature-complete state. We have integrated core features, robust UI enhancements, and an autonomous testing pipeline.

### Highlights & New Features

*   **Complete Feature Parity Achieved**: All major Beat Saber game modes and mechanics are now implemented, including Standard, One Saber, No Arrows, 360/90 Degree modes, and Campaign mode.
*   **Advanced Block Types**: Added full support for Arcs (Sliders) and Chains (Burst Sliders) logic and visual representation.
*   **Exact 115-Point Scoring System**: The scoring algorithm has been entirely overhauled to match the precise 115 max point system (70 points for swing-in, 30 points for swing-out, and 15 points for accuracy).
*   **Comprehensive Modifiers Suite**:
    *   **Positive Modifiers**: No Fail, No Obstacles, No Bombs, No Arrows, Slower Song.
    *   **Negative Modifiers**: Insta Fail (One Life), Battery Energy (4 Lives), Ghost Notes, Disappearing Arrows, Faster Song, Super Fast Song, Strict Angles, Pro Mode (tighter hitboxes), and Small Notes.
*   **Enhanced Lighting Engine**: Upgraded the environment lighting to support V3-style granular group controls, translation, and rotation events for an immersive visual experience.
*   **UI/UX Overhaul**: Every single new feature and modifier is now comprehensively represented in the in-game menus, complete with Nunjucks-based tooltips and detailed descriptions.
*   **Autonomous CI/CD Testing Pipeline**: We've set up automated Playwright frontend testing and Jest unit testing pipelines to ensure that every future commit maintains the visual and logical integrity of the game.

### What's Next?
During this Closed Beta phase, we will be collecting community feedback on performance, balancing (especially for Pro Mode and Small Notes), and cross-platform compatibility (VR vs. Desktop vs. MediaPipe Hand Tracking).

Thank you for participating and helping us refine the ultimate rhythm game experience!
