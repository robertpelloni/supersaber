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

## Remote Player Avatar Logic
- Instantiating custom entities like `<a-entity class="bladeContainer">` on the fly inside component logic (`multiplayer-sync.js`) works effectively to mirror complex local entities.
- Ensure that you attach the necessary A-Frame class identifiers (e.g. `blade bladeleft`) and components (`raycastable-game`) directly upon instantiation so that the game loop's intersection detection picks them up immediately. This means that collisions calculated by the remote player will be respected as if they were local blocks being hit.

## General Modifiers UI Binding
- Grouped configurations like `#modifiersPanel` efficiently utilize `aframe-state-component` bindings to toggle values conditionally.
- Reusing `proxy-event` directly to elements avoids instantiating new javascript components for simple menu behaviors. E.g. `bind-toggle__raycastable="menuActive"` prevents interactions when menus hide.
## 2026-04-17 UI Polish and Tooltips Integration
- Implemented inline descriptive text objects via A-Frame text elements for Modifiers and Multiplayer.
- Successfully generated docs.html manually and bound it to Webpack builds, giving it a raycastable link from the main menu context.
## 2026-04-18 Leaderboard Mock Implementation
- Successfully mocked the firebase database interface locally to test `this.db.add(scoreData)`.
- Modified `src/components/leaderboard.js` to correctly apply base score modifiers (e.g. 1.15x for Ghost Notes, 0.5x penalty for No Fail) before submission to the cloud, allowing leaderboards to reflect ultimate challenge runs accurately.
## 2026-04-18 Multiplayer Physics Integrity Upgrade
- User specified to roll version specifically to v1.1.6 and finalize multiplayer avatar constraints.
- Bounded `multiplayer-sync.js` with Math.max/min clamping.
- Ensured WebGL rendering constraints were respected inside `tick` loops.
## 2026-04-18 Custom Mod Drag-And-Drop Implementation
- Attached 'dragover' and 'drop' event listeners natively to the browser window globally within a new custom A-Frame component (custom-mod-loader).
- This natively integrates the interception directly into the 'aframe-state-component' workflow preventing generic DOM isolation errors when loading new songs.
## 2026-04-18 Twitch Moderation Fixes
- Explicitly gated '!startvote' and '!stopvote' commands in 'src/components/twitch-integration.js' checking for 'tags.mod' and 'tags.badges.broadcaster'. This restricts state modification to authorized users only, protecting public broadcasts.
## 2026-04-18 Final Polish and QA Pass
- Ignored semistandard warning 'no-mixed-operators' exclusively in pure mathematical graphics generators like 'twister.js' avoiding regressions in WebVR generation algorithms. All other tests pass.
## 2026-04-18 Network Visual Refinement
- When receiving arbitrary `position/rotation` payloads via the WebSocket broadcast loop, using `THREE.Vector3().lerp` scales perfectly over the 50ms interval provided the `timeDelta` is bound inside a clamped `Math.min(timeDelta * 0.015, 1.0)`.
- Replaced basic mesh structure visually to allow local scaling arrays (`data.leftSaber.scale`) to map to `#remote-player-${id}` objects.
## 2026-04-18 Project Wrap-Up & Vision Analysis
- All original 6 phases of development successfully integrated. Documented final findings and deep architectural proposals natively inside IDEAS.md per explicit user request.
## 2026-04-18 Multiplayer Polishing (Trails)
- Extracted 'trail.js' logic and explicitly attached it into 'multiplayer-sync.js' avatar instantiation block. This ensures custom colored sweeping arcs populate as remote users swing their sabers across the network.
## 2026-04-18 Project Finalization
- Stopped background testing environments and gracefully cleaned up temporary evaluation scripts. Assured complete closure on the massive pivot architectural updates.
## 2026-04-18 Editor Pivot Start
- Successfully established isolated Nunjucks component 'src/templates/editor.html' tracking the 'isEditing' state correctly mirroring the rest of the application's single-page-app structure.
## 2026-04-18 Custom Model Drag-and-Drop Loader
- Explicitly established validation checks inside 'custom-asset-loader' evaluating file extension and hard-limiting byte sizes (< 15MB) to prevent browser memory leaks during WebGL rendering loops.
## 2026-04-18 Editor Audio Injection
- Routed '.mp3' and '.ogg' payload files globally directly into the central 'state/index.js' repository as BLOBs via 'URL.createObjectURL'. This removes explicit node-side file handling dependency allowing mapping of purely local files.
## 2026-04-18 Multiplayer Polishing (Hits & Visors)
- Extracted 'saber-particles' & 'raycaster__game' logic and explicitly attached it into 'multiplayer-sync.js' avatar instantiation block. Remote sabers now accurately compute intersection hits natively to show visual FX.
## 2026-04-18 Multiplayer UI Overhaul
- Extracted local user state metrics from A-Frame and packaged them implicitly into the multiplayer WebSocket payload array natively.
