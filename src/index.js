import '../vendor/BufferGeometryUtils.js';
import 'aframe-aabb-collider-component';
import 'aframe-atlas-uvs-component';
import 'aframe-audioanalyser-component';
import 'aframe-event-set-component';
import 'aframe-geometry-merger-component';
import 'aframe-haptics-component';
import 'aframe-layout-component';
import 'aframe-orbit-controls';
import 'aframe-proxy-event-component';
import 'aframe-ring-shader';
import 'aframe-state-component';
import 'aframe-slice9-component';
import 'aframe-thumb-controls-component';

import './index.css';

// To dynamically import all files like require.context in Webpack:
const components = import.meta.glob('./components/**/*.js', { eager: true });
const stateFiles = import.meta.glob('./state/**/*.{js,ts}', { eager: true });
