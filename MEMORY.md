# Memory

## Ongoing Observations
- The project is heavily dependent on older versions of `aframe` and various `aframe-*` components. Extreme care must be taken when updating dependencies to avoid breaking the core rendering loop or WebVR APIs.
- The state is managed centrally via `aframe-state-component`. Any new features (Twitch integrations, optical tracking states) must be integrated into this state machine rather than hacking one-off solutions.
- `src/index.html` relies on Nunjucks templating. Modifying the DOM structure requires editing the `.html` files in `src/` and running the build step.
- Current input is handled via `aframe-thumb-controls-component` and custom saber components within the `controllerRig`. To support optical tracking, we will need to create a new component (e.g., `optical-saber-controls`) that interfaces with the MediaPipe data stream and overrides the transform of the sabers when active.

## General Lessons & Discoveries
- Nunjucks is used for templating. Passing values like the project version requires updating `webpack.config.js` to add the variable to `nunjucks.addGlobal()`.
- Modifying DOM elements means you have to edit the files inside `src/templates/` and build.
- The `verify.py` script provided locally takes a screenshot via Playwright to verify the UI. Use `#versionText` explicitly to ensure our version element actually attaches.

## Twitch Voting
- State properties must be initialized manually in `src/state/index.js` `state` initialization.
- Nunjucks templates require array access `twitchVotes[item.index + 1] || 0` syntax in the `menu.html` bindings instead of direct nested object calls when building lists dynamically.
- `tmi.js` parses the tags properly to fetch the `username`.
- Updating DOM bindings inside the `searchResultTemplate` loop ensures that each block renders independent values based on the global state structure.
