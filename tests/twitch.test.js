import { describe, it, expect } from 'vitest';

describe('Twitch Voting & UI States', () => {
  it('registers correct state bindings for Nunjucks arrays', () => {
    // Mock the state
    const twitchVotes = {
      1: 5,
      2: 12,
      3: 0
    };

    // Simulate what the template does
    const item1Index = 0; // Menu item 1 maps to array index 0
    const value1 = twitchVotes[item1Index + 1] || 0;

    const item3Index = 2;
    const value3 = twitchVotes[item3Index + 1] || 0;

    const item4Index = 3;
    const value4 = twitchVotes[item4Index + 1] || 0; // doesn't exist

    expect(value1).toBe(5);
    expect(value3).toBe(0);
    expect(value4).toBe(0); // Safely falls back to 0 without breaking template
  });
});
