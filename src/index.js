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
const componentsJS = import.meta.glob('./components/**/*.js', { eager: true });
const componentsTS = import.meta.glob('./components/**/*.ts', { eager: true });
const stateFilesJS = import.meta.glob('./state/**/*.js', { eager: true });
const stateFilesTS = import.meta.glob('./state/**/*.ts', { eager: true });
