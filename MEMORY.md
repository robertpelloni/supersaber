# Memory

## Ongoing Observations
- The project is heavily dependent on older versions of `aframe` and various `aframe-*` components. Extreme care must be taken when updating dependencies to avoid breaking the core rendering loop or WebVR APIs.
- The state is managed centrally via `aframe-state-component`. Any new features (Twitch integrations, optical tracking states) must be integrated into this state machine rather than hacking one-off solutions.
- `src/index.html` relies on Nunjucks templating. Modifying the DOM structure requires editing the `.html` files in `src/` and running the build step.
- Current input is handled via `aframe-thumb-controls-component` and custom saber components within the `controllerRig`. To support optical tracking, we will need to create a new component (e.g., `optical-saber-controls`) that interfaces with the MediaPipe data stream and overrides the transform of the sabers when active.
