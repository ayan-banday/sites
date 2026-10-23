// Stub art: coloured rectangle sheets with the exact names/sizes/frames/anims from SPEC.md.
const INK = '#1B1530';
function sheet(w, h, frames, draw) {
  const c = document.createElement('canvas');
  c.width = w * frames; c.height = h;
  const g = c.getContext('2d');
  for (let f = 0; f < frames; f++) draw(g, f * w, w, h, f);
  return c.toDataURL();
}
function box(color) {
  return (g, x, w, h, f) => {
    g.fillStyle = INK; g.fillRect(x, 0, w, h);
    g.fillStyle = color; g.fillRect(x + 1, 1, w - 2, h - 2);
    g.fillStyle = f % 2 ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.18)';
    g.fillRect(x + 1, 1, w - 2, Math.max(2, Math.floor(h / 4)));
    if (w >= 16 && h >= 16 && w < 100) {
      g.fillStyle = INK;
      g.fillRect(x + 4 + (f % 3), 5, 2, 3);
      g.fillRect(x + w - 7 - (f % 3), 5, 2, 3);
    }
  };
}
export function registerArt(k) {
  const L = (name, w, h, frames, color, anims) =>
    k.loadSprite(name, sheet(w, h, frames, box(color)), { sliceX: frames, sliceY: 1, anims });
  const cre = { idle: { from: 0, to: 1, loop: true, speed: 3 }, run: { from: 2, to: 3, loop: true, speed: 10 }, jump: 4, happy: 5, sad: 6 };
  L('riya', 24, 24, 7, '#9B6BFF', cre);
  L('zib', 24, 24, 7, '#2EC4B6', cre);
  L('gorp', 24, 24, 7, '#8DBB3A', cre);
  L('heart', 9, 8, 3, '#FF4D6D');
  L('sparkle', 8, 8, 4, '#FFC93C', { play: { from: 0, to: 3, speed: 12 } });
  L('smoke', 16, 16, 4, '#B9B4C7', { play: { from: 0, to: 3, speed: 10 } });
  L('shield', 28, 28, 2, '#8FD3FF', { glow: { from: 0, to: 1, loop: true, speed: 6 } });
  L('stormcloud', 32, 16, 2, '#5A5F6B', { rumble: { from: 0, to: 1, loop: true, speed: 4 } });
  L('ob_budget', 16, 16, 2, '#E23B3B', { idle: { from: 0, to: 1, loop: true, speed: 4 } });
  L('ob_posters', 16, 16, 2, '#FF8FC7');
  L('ob_stage', 16, 16, 2, '#C98B5A');
  L('ob_food', 16, 12, 2, '#FF4D2E');
  k.loadSprite('ground', sheet(16, 16, 1, (g, x, w, h) => {
    g.fillStyle = '#C98B5A'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#6BCB5A'; g.fillRect(0, 0, w, 4);
    g.fillStyle = '#3E9A47'; g.fillRect(0, 4, w, 1);
  }));
  const bg = (name, w, h, top, bot) => k.loadSprite(name, sheet(w, h, 1, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, top); gr.addColorStop(1, bot);
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(255,255,255,.4)';
    for (let i = 0; i < 5; i++) g.fillRect(20 + i * 60, 20 + (i % 2) * 15, 30, 8);
    g.fillStyle = '#6BCB5A'; if (h > 100) g.fillRect(0, h - 30, w, 30);
  }));
  bg('bg_campus', 320, 180, '#8FD3FF', '#C9EEFF');
  bg('bg_night', 320, 180, '#1B1530', '#2B2350');
  k.loadSprite('bg_hills', sheet(320, 60, 1, (g, x, w, h) => {
    g.fillStyle = '#6FB6A0';
    for (let i = 0; i < 8; i++) { g.beginPath(); g.ellipse(i * 40, h, 40, 20 + (i % 3) * 10, 0, Math.PI, 0); g.fill(); }
  }));
  k.loadSprite('bg_bushes', sheet(320, 30, 1, (g, x, w, h) => {
    g.fillStyle = '#3E9A47';
    for (let i = 0; i < 10; i++) { g.beginPath(); g.ellipse(i * 32 + 10, h, 18, 12 + (i % 2) * 6, 0, Math.PI, 0); g.fill(); }
  }));
  for (const t of ['budget', 'posters', 'stage', 'food']) {
    L('prop_' + t + '_good', 48, 48, 1, '#FFC93C');
    L('prop_' + t + '_bad', 48, 48, 1, '#8A8F9C');
    L('task_' + t, 24, 24, 1, '#FFF6E5');
  }
  for (const b of ['situational', 'micromanager', 'ghost', 'frozen']) L('badge_' + b, 24, 24, 1, '#FF8A3D');
}
