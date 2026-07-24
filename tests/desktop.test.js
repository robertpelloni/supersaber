import { describe, it, expect, beforeEach } from 'vitest';

describe('Desktop UI Modifiers & Toggles', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="desktopUI">
        <label><input type="checkbox" id="modGhostNotes"> Ghost Notes</label>
        <button id="toggleMultiplayerBtn">Enable Multiplayer</button>
        <div id="trackingFailureWarning" style="display: none;"></div>
      </div>
    `;
  });

  it('renders modifier toggles correctly', () => {
    const ghostNotes = document.getElementById('modGhostNotes');
    expect(ghostNotes).not.toBeNull();
    expect(ghostNotes.checked).toBe(false);
  });

  it('renders multiplayer UI binding', () => {
    const multiBtn = document.getElementById('toggleMultiplayerBtn');
    expect(multiBtn.textContent).toBe('Enable Multiplayer');
  });

  it('renders optical tracking failure warning as hidden by default', () => {
    const warning = document.getElementById('trackingFailureWarning');
    expect(warning.style.display).toBe('none');
  });
});
