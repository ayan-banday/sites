/* The Witch Who Would Not Be Read — shared helpers + shot assembly.
   Act files (act0-overture.js, act1.js ... act6-finale.js) each do:
     (window.SHOTS_BY_ACT = window.SHOTS_BY_ACT || {}).actN = [ {shot}, {shot} ];
   assembleShots() (called by app.js) concatenates them in ACT_ORDER and renumbers n from 1.
   On-screen words copied verbatim from story.md.
   Coral (#F58E84) appears ONLY on Khushi's brush and paint. */

const W = 960, H = 540;
const floor = (y = 470) => `<path d="${wob([[0, y], [W, y], [W, H], [0, H]], 2, true)}" fill="#24151f"/><path d="M0,${y + 24} H${W} M0,${y + 52} H${W}" stroke="#140b12" stroke-width="3"/>`;
const ashBanana = `<g transform="translate(-6 -262)">${K.banana(0, 0, .55, -40)}</g>`;
const bubble = (x, y, w, h) => `<path d="${blob(x, y, w, h, 26, .04)}" fill="#fffaf0" stroke="${INK}" stroke-width="2.6" filter="url(#wob)"/><path d="M${x - w * .3},${y + h * .8} l-26,40 l40,-30" fill="#fffaf0" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>` + bars(x - w * .75, y - h * .5, w * 1.5, 6, h * .18, 3.4);
const bolt = (x, y, s, col = GOLD, r = 0) => `<path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M0,0 L-18,40 L4,40 L-12,86 L30,28 L8,28 L22,0Z" fill="${col}" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round" filter="url(#wob)"/>`;
const speedTo = (x1, y1, x2, y2, n = 5) => { let s = ''; for (let i = 0; i < n; i++) { const o = (i - n / 2) * 14; s += `<path d="M${x1},${y1 + o} L${x2},${y2 + o}" stroke="${BONE}" stroke-width="3" stroke-linecap="round" opacity=".7" stroke-dasharray="${30 + i * 6} 14"/>`; } return s; };


const ACT_ORDER = ['act0', 'act1', 'act2', 'act3', 'act4', 'act5', 'act6'];
const SHOTS = [];
function assembleShots() {
  SHOTS.length = 0;
  const by = window.SHOTS_BY_ACT || {};
  ACT_ORDER.forEach(k => (by[k] || []).forEach(s => SHOTS.push(s)));
  SHOTS.forEach((s, i) => { s.n = i + 1; });
  return SHOTS;
}
