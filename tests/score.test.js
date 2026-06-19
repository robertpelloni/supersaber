import { calculatePhase8Score } from '../src/components/beat.js';

describe('Phase 8: Scoring System Calculation (115 max points)', () => {
  it('should calculate the maximum 115 points for a perfect hit', () => {
    const angleBeforeHit = 100;
    const angleAfterHit = 60;
    const beatPosition = new THREE.Vector3(0, 0, 0);
    const intersectionPoint = new THREE.Vector3(0, 0, 0); // Dead center (distance 0)

    const totalScore = calculatePhase8Score(angleBeforeHit, angleAfterHit, intersectionPoint, beatPosition);

    expect(totalScore).toBe(115);
  });

  it('should calculate partial points for a sub-optimal hit', () => {
    const angleBeforeHit = 50; // 50/100 * 70 = 35
    const angleAfterHit = 30;  // 30/60 * 30 = 15
    const beatPosition = new THREE.Vector3(0, 0, 0);
    const intersectionPoint = new THREE.Vector3(0.1, 0, 0); // Distance 0.1 -> 15 - (0.1 * 50) = 10

    const totalScore = calculatePhase8Score(angleBeforeHit, angleAfterHit, intersectionPoint, beatPosition);

    expect(totalScore).toBe(60);
  });
});
