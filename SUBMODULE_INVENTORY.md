# Library and Dependency Inventory

| Dependency | Version | Location | Purpose |
| ---------- | ------- | -------- | ------- |
| A-Frame | `v0.8.2` (modified) | `vendor/aframe-master.js` | Core WebVR rendering framework. Required for 3D stage and components. |
| MediaPipe Hands | `^0.4.x` | NPM | Optical hand tracking for desktop mapping. |
| TMI.js | `^1.8.3` | NPM | Twitch chat API integration. |
| Firebase | `^5.11.1` | NPM | Global remote high-score leaderboards. |
| Nunjucks | `3.0.1` | NPM | Dynamic HTML templating inside A-Frame arrays. |
| aframe-state-component | `^6.4.2` | NPM | Global application state management. |

*No new submodules were added in Phase 7 as the audio extraction natively utilized `window.AudioContext` built into the Web API.*
