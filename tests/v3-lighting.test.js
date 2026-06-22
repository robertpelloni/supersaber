require('./setup');

describe('Phase 8: V3 Lighting', () => {
  it('should be registered in AFRAME', () => {
    let isRegistered = false;
    const oldRegister = global.AFRAME.registerComponent;
    global.AFRAME.registerComponent = (name, component) => {
      if (name === 'v3-lighting') isRegistered = true;
    };

    require('../src/components/v3-lighting');

    global.AFRAME.registerComponent = oldRegister;

    expect(isRegistered).toBe(true);
  });
});
