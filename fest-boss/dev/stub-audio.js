// No-op audio stub for stage testing.
export const audio = {
  unlock() {},
  setMuted() {},
  isMuted() { return false; },
  babble() {},
  sfx(name) { console.debug('[sfx]', name); },
};
