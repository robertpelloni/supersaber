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

## Custom Sabers
- To fully integrate custom sabers, replacing the geometries directly works but ensuring `raycastable-game` stays intact for collisions is necessary. Setting `visible="false"` via dynamic state bindings allows physics to process without the primitive meshes rendering over the custom geometries.
- Currently, `.customSaber` expects an OBJ or GLTF. Testing these loading states within playwright fails unless actual models exist in `assets` which are passed correctly via state, as standard timeout waiting for the rendering will block if it fails to bind correctly due to missing URL data in state configurations.

## Multiplayer Implementation Basics
- Toggle implementation needs state modifications to be mirrored carefully in HTML logic components (Nunjucks templating or via state bindings directly on custom `a-entity` definitions).
- UI buttons are effectively placed by binding `proxy-event="event: click; to: a-scene; as: YOUR_STATE_EVENT"`. This leverages the A-Frame state component architecture dynamically without manually building listener loops.

## Multiplayer WebSocket Integration
- Ensure that the WebSocket logic is enclosed with robust `try...catch` handlers because cross-origin generic relays might not be running locally on port 3001 immediately.
- When generating DOM nodes dynamically within A-Frame components via JS (e.g. `document.createElement('a-entity')`), apply basic attributes (like primitive geometry) early, but remember that appending the child explicitly commits the node. It is highly efficient for spawning remote multiplayer avatars correctly tracked by IDs.

## Final Project Memory
- **A-Frame Versions**: Webpack 2+ limits how aggressively packages can be bumped. Many WebVR libraries predate standard WebXR architectures. `aframe-master` loaded in `vendor` locks down much of the global API space, making major breaking bumps unsafe without a full pivot to a modern bundler like Vite.
- **Twitch Integration**: `tmi.js` functions successfully for listening to chat events asynchronously from rendering state loops. We emit events from the Twitch chat handler to `this.el.emit()` letting `aframe-state-component` capture and resolve it efficiently natively using standard ECS principles.
- **WebSocket Sync**: For multiplayer features, using a standard native WebSocket mapping positional/rotational data every 50ms (`src/components/multiplayer-sync.js`) allows smooth replication across peers in a central room without heavy external libraries. This preserves performance in WebGL/VR contexts.
- **Custom Sabers**: To not break collision layers, the original generic primitive `box` collider is made transparent (`visible="false"` bound to state) while custom obj geometries overlay them visually.
- **File Hierarchy**: Nunjucks is pivotal for the `index.html` UI tree and dynamically rendering lists. Logic goes into `/components/` and global reactive bindings execute out of `state/index.js`.
