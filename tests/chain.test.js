require('./setup');

describe('Phase 8: Chains (Burst Sliders)', () => {
  it('should be registered in AFRAME', () => {
    // Check if the component was successfully registered in the mock AFRAME
    let isRegistered = false;
    const oldRegister = global.AFRAME.registerComponent;
    global.AFRAME.registerComponent = (name, component) => {
      if (name === 'chain') isRegistered = true;
    };

    // Require the component file after hijacking registerComponent
    require('../src/components/chain');

    // Restore
    global.AFRAME.registerComponent = oldRegister;

    expect(isRegistered).toBe(true);
  });
});
