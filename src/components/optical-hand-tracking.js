import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

AFRAME.registerComponent('optical-hand-tracking', {
  schema: {
    enabled: {default: false}
  },

  init: function () {
    this.videoElement = document.createElement('video');
    this.videoElement.style.display = 'none';
    document.body.appendChild(this.videoElement);

    this.hands = new Hands({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});

    this.hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    this.hands.onResults(this.onResults.bind(this));

    this.camera = new Camera(this.videoElement, {
      onFrame: async () => {
        if (!this.data.enabled) return;
        await this.hands.send({image: this.videoElement});
      },
      width: 640,
      height: 480
    });
  },

  update: function (oldData) {
    if (this.data.enabled && !oldData.enabled) {
      this.camera.start();
    } else if (!this.data.enabled && oldData.enabled) {
      this.camera.stop();
    }
  },

  onResults: function (results) {
    if (!results.multiHandLandmarks) return;

    // Dispatch event with hand data so sabers can update their positions
    this.el.emit('optical-hands-updated', {
      hands: results.multiHandLandmarks,
      handedness: results.multiHandedness
    });
  }
});
