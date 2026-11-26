/* act3 (v2): Act III. Enter Ayan. Shots 10 to 15, presses P27 to P41.
   Helpers carry the a3 prefix. Heavy art is painted once; only small layers move (transform + opacity). */

const a3Clock = P => 11 + (P - 3) / 44 * 0.97;
const a3Say = (ctx, t, hint) => ctx.say(t, hint || 'press space to continue');
const a3Tag = (x, y, s, r, text, grey, str = 16) => {
  const t = K.tag(x, y, s, r, text, str);
  return grey ? t.replace('#fbf6ea', '#cfc8d8') : t;
};
const a3Phone = (x, y, r = 0, s = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" filter="url(#wob)"><rect x="-8" y="-16" width="16" height="30" rx="4" fill="${INK}" stroke="${GOLD}" stroke-width="1.8"/><rect x="-5" y="-12" width="10" height="20" rx="2" fill="#6f7fa0"/></g>`;
const a3Page = (x, y, s, r, word) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" filter="url(#wob)"><path d="${wob(rectPts(-46,-58,92,116,12),1,true)}" fill="${INK}" opacity=".3" transform="translate(4 5)"/><path d="${wob(rectPts(-46,-58,92,116,12),1,true)}" fill="#fbf6ea" stroke="${INK}" stroke-width="2.6"/></g>` +
  K.word(x, y - 26 * s, 17 * s, word, INK, r) + `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">${bars(-34, -10, 68, 4, 14, 5)}</g>`;
const a3BananaW = (x, y, s) => `<g transform="translate(${x} ${y}) rotate(-40) scale(${s})">${K.banana(0, 0, 1, 0)}<path d="M-12,-1 L-3,-6 M5,-6 L14,-1" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M22,-6 q-5,9 0,12 q5,-3 0,-12z" fill="${TEAR}" stroke="${INK}" stroke-width="1.5"/></g>`;
const a3Pocket = `<g transform="translate(14 -228)">${K.banana(0, 0, 0.95, -55)}</g>`;
const a3Journal = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#wob)">` +
  `<path d="${wob([[-132,-62],[0,-52],[0,66],[-132,76]], 1.2, true)}" fill="#fbf6ea" stroke="${INK}" stroke-width="2.8"/>` +
  `<path d="${wob([[0,-52],[132,-62],[132,76],[0,66]], 1.2, true)}" fill="#f3ead7" stroke="${INK}" stroke-width="2.8"/>` +
  `<path d="M0,-52 V66" stroke="${INK}" stroke-width="3"/><path d="M-138,80 L0,70 L138,80" stroke="${PINK}" stroke-width="5" fill="none"/></g>`;
const a3Scribble = (x, y, w, rows) => { let g = ''; for (let i = 0; i < rows; i++) { let d = `M${x},${y + i * 22}`; for (let k = 0; k < 9; k++) d += ` q${w / 18},${(k % 2 ? 7 : -7) + j(3)} ${w / 9},${j(2)}`; g += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round" filter="url(#pencil)"/>`; } return g; };
const a3Cloud = (cx, cy, s) => `<g transform="translate(${cx} ${cy}) scale(${s})" filter="url(#wob)">` +
  [[-60, 12, 60, 40], [0, -10, 70, 50], [64, 14, 56, 38], [0, 26, 90, 34]].map(([x, y, rx, ry]) => `<path d="${blob(x, y, rx, ry, 16, .06)}" fill="#8d7aa8" stroke="${INK}" stroke-width="2.6"/>`).join('') +
  a3Tag(-40, 40, .55, -12, 'FRAUD', false, 8) + a3Tag(48, 46, .5, 10, 'NOT READY', false, 8) + bolt(8, 52, .6, GOLD, 8) + `</g>`;
const a3Ring = (cx, cy, rx, ry, texts, grey) => texts.map((t, i) => {
  const a = i / texts.length * Math.PI * 2;
  return a3Tag(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, .78, (i * 47) % 70 - 35, t, grey, 10);
}).join('');
const a3Tilt = (cx, cy, th) => { const a = th * Math.PI / 180, c = Math.cos(a) - 1, s = Math.sin(a), x = cx - 480, y = cy - 270; return { dx: c * x - s * y, dy: s * x + c * y, r: th }; };
const a3Flakes = () => { let g = ''; for (let i = 0; i < 26; i++) g += `<path d="${blob(150 + R() * 560, 100 + R() * 380, 3 + R() * 3.5, 2.5 + R() * 2.5, 8, .2)}" fill="#fbf6ea" stroke="${INK}" stroke-width="1.2" opacity=".95"/>`; return g; };

(window.SHOTS_BY_ACT = window.SHOTS_BY_ACT || {}).act3 = [
  /* ==================== 10 · ACT III intertitle, Ayan crashes in (P27-P28) ==================== */
  {
    title: 'Act III · Enter Ayan',
    words: 'ACT III. Enter Ayan, who is writing this movie.',
    clock: { x: 790, y: 118, s: 0.45, h: a3Clock(27) },
    bg: () => bg('scribble', W, H, 106, GP.night) + floor(),
    sprites: [
      { id: 'door', vx: 120, vy: 150, vw: 260, vh: 340, z: 3, boil: 0.6, svg: () => K.door(240, 472, 1) },
      { id: 'ayanA', vx: 300, vy: 100, vw: 240, vh: 400, z: 6, boil: 2.0,
        svg: () => nerd(420, 476, 0.8, 'panic wobble shake brow:worry', { arms: 'up', top: ASH_WEIRD, under: a3Pocket }) },
      { id: 'ayanB', vx: 300, vy: 100, vw: 240, vh: 400, z: 6, boil: 1.8, hidden: true,
        svg: () => nerd(420, 476, 0.8, 'panic wobble sweat bigsweat brow:worry', { arms: 'out', top: ASH_WEIRD, under: a3Pocket }) },
      { id: 'page', vx: 500, vy: 200, vw: 200, vh: 260, z: 7, boil: 1.4, hidden: true, svg: () => a3Page(600, 330, 1.5, -8, 'the talk') }
    ],
    async run(ctx) {
      ctx.setCurtain(1);
      ctx.setClockTime(a3Clock(27));
      a3Say(ctx, this.words);
      ctx.audio('silence');
      ctx.audio('doorSlam');
      ctx.pose('ayanA', { dx: -340, op: 0 });
      ctx.tween(700, p => {
        const e = ctx.ease(p);
        ctx.pose('ayanA', { dx: -340 * (1 - e), r: -10 * (1 - e), op: Math.min(1, p * 5) });
        ctx.pose('door', { dx: 14 * Math.sin(p * Math.PI * 4) * (1 - p), dy: 0 });
      });
      await ctx.wait(760);
    },
    subPresses: [
      async function (ctx) { // P28
        ctx.setClockTime(a3Clock(28));
        a3Say(ctx, 'He had a talk coming up, and he did not feel ready.');
        ctx.audio('hitmanDread', 'fade soft');
        ctx.hide('ayanA'); ctx.show('ayanB');
        ctx.show('page');
        ctx.pose('page', { dx: 190, op: 0 });
        ctx.tween(700, p => {
          const e = ctx.ease(p);
          ctx.pose('page', { dx: 190 * (1 - e), op: Math.min(1, p * 3) });
          ctx.pose('ayanB', { dx: 6 * Math.sin(p * Math.PI * 6) * (1 - p) });
        });
        await ctx.wait(760);
      }
    ]
  },

  /* ==================== 11 · The storm grows (P29-P31) ==================== */
  {
    title: 'The Storm Grows',
    words: 'He felt like a fraud. That feeling has a name: imposter syndrome.',
    clock: { x: 790, y: 118, s: 0.45, h: a3Clock(29) },
    bg: () => bg('scribble', W, H, 111, GP.night),
    sprites: [
      { id: 'floor', vx: -100, vy: 478, vw: 1160, vh: 200, z: 1, boil: 0, svg: () => floor(478) },
      { id: 'ayanE', vx: 340, vy: 130, vw: 200, vh: 370, z: 6, boil: 2.0, svg: () => nerd(440, 480, 0.74, 'panic wobble sweat brow:worry', { arms: 'chest', top: ASH_WEIRD, under: a3Pocket }) },
      { id: 'ayanF', vx: 340, vy: 130, vw: 200, vh: 370, z: 6, boil: 2.2, hidden: true, svg: () => nerd(440, 480, 0.74, 'huge wobble shake brow:worry', { arms: 'chest', top: ASH_WEIRD }) },
      { id: 'ayanG', vx: 340, vy: 130, vw: 200, vh: 370, z: 6, boil: 2.6, hidden: true, svg: () => nerd(440, 480, 0.74, 'panic wobble shake bigsweat brow:worry', { arms: 'up', top: ASH_WEIRD }) },
      { id: 'banW', vx: 380, vy: 230, vw: 150, vh: 150, z: 7, boil: 1.8, hidden: true, svg: () => a3BananaW(452, 304, 1.15) },
      { id: 'ring', vx: 190, vy: 100, vw: 500, vh: 400, z: 8, boil: 1.6, svg: () => a3Ring(440, 300, 190, 130, ['FRAUD', 'NOT READY', 'FRAUD', 'NOT READY', 'FRAUD', 'NOT READY'], false) },
      { id: 'bolts', vx: 250, vy: 90, vw: 400, vh: 300, z: 9, boil: 2.4, hidden: true,
        svg: () => bolt(300, 150, 1.1, GOLD, -20) + bolt(600, 130, 1.0, GOLD, 16) + bolt(450, 110, .8, GOLD, 4) },
      { id: 'script', vx: 740, vy: 390, vw: 130, vh: 140, z: 5, boil: 1.0, hidden: true, svg: () => K.villain(795, 466, 0.5, 'prim', -6) }
    ],
    async run(ctx) { // P29
      this.T = { th: 0, spin: 0, rs: 1 };
      const C = { floor: [480, 578], ayanE: [440, 315], ayanF: [440, 315], ayanG: [440, 315], banW: [452, 304], ring: [440, 300], bolts: [450, 240], script: [805, 460] };
      this.C = C;
      this.apply = (ctx2) => {
        for (const id in C) {
          const t = a3Tilt(C[id][0], C[id][1], this.T.th);
          if (id === 'ring') { t.r = this.T.th + this.T.spin; t.s = this.T.rs; }
          ctx2.pose(id, t);
        }
      };
      ctx.setCurtain(1);
      ctx.setClockTime(a3Clock(29));
      a3Say(ctx, this.words);
      ctx.pose('ring', { s: 0.4, op: 0 });
      ctx.tween(900, p => {
        const e = ctx.ease(p);
        this.T.spin = 150 * e; this.T.rs = 0.4 + 0.6 * e;
        this.apply(ctx);
        ctx.pose('ring', { op: Math.min(1, p * 2.5) });
      });
      await ctx.wait(960);
    },
    subPresses: [
      async function (ctx) { // P30
        ctx.setClockTime(a3Clock(30));
        a3Say(ctx, 'Then came a panic attack. His chest got tight. Even the banana looked worried.');
        ctx.audio('musicLevel', 0.9); // the dread swells with the tilt
        ctx.hide('ayanE'); ctx.show('ayanF');
        ctx.show('banW');
        const T = this.T, s0 = T.spin, th0 = T.th;
        ctx.tween(1100, p => {
          const e = ctx.ease(p);
          T.spin = s0 + 230 * e; T.th = th0 + (3.5 - th0) * e; T.rs = 1 - 0.18 * e;
          this.apply(ctx);
          ctx.pose('banW', { dy: -10 * Math.sin(p * Math.PI) });
        });
        await ctx.wait(1160);
      },
      async function (ctx) { // P31
        ctx.setClockTime(a3Clock(31));
        a3Say(ctx, 'The harder he thought, the bigger the storm got.');
        ctx.audio('mountainKing', 'cross'); // the P31 peak
        ctx.hide('ayanF'); ctx.show('ayanG');
        ctx.show('bolts'); ctx.show('script');
        const T = this.T, s0 = T.spin, th0 = T.th;
        ctx.tween(1100, p => {
          const e = ctx.ease(p);
          T.spin = s0 + 480 * e; T.th = th0 + (6 - th0) * e; T.rs = 0.82 + 0.28 * e;
          this.apply(ctx);
        });
        await ctx.wait(1160);
        ctx.tween(500, p => ctx.pose('script', { dy: -6 * Math.sin(p * Math.PI * 2) }));
        await ctx.wait(520);
        ctx.audio('silence');
      }
    ]
  },

  /* ==================== 12 · The journal (P32-P33) ==================== */
  {
    title: 'The Journal',
    words: 'So he journaled. He wrote it all down, one shaky line at a time.',
    clock: { x: 790, y: 118, s: 0.45, h: a3Clock(32) },
    bg: () => bg('glow', W, H, 112, GP.night),
    sprites: [
      { id: 'cloud', vx: 510, vy: 100, vw: 260, vh: 240, z: 3, boil: 2.0, svg: () => a3Cloud(640, 220, 1) },
      { id: 'ayanA', vx: 200, vy: 40, vw: 330, vh: 500, z: 5, boil: 1.4,
        svg: () => nerd(360, 752, 1.5, 'dot wobble sweat brow:worry', { arms: 'out', top: ASH_WEIRD }) },
      { id: 'ayanB', vx: 200, vy: 40, vw: 330, vh: 500, z: 5, boil: 0.8, hidden: true,
        svg: () => nerd(360, 752, 1.5, 'closed flat brow:soft', { arms: 'out', top: ASH_WEIRD }) },
      { id: 'book', vx: 360, vy: 350, vw: 320, vh: 180, z: 6, boil: 0.5, svg: () => a3Journal(520, 440, 1) },
      { id: 'scrib', vx: 360, vy: 350, vw: 320, vh: 180, z: 7, boil: 0.5, svg: () => a3Scribble(402, 402, 105, 4) + a3Scribble(536, 400, 105, 4) }
    ],
    async run(ctx) { // P32
      ctx.setCurtain(1);
      ctx.setClockTime(a3Clock(32));
      a3Say(ctx, this.words);
      ctx.audio('silence');
      ctx.audio('pencil');
      ctx.pose('scrib', { clip: 'inset(0 100% 0 0)' });
      ctx.pose('book', { dy: 60, op: 0 });
      ctx.tween(500, p => ctx.pose('book', { dy: 60 * (1 - ctx.ease(p)), op: Math.min(1, p * 3) }));
      await ctx.wait(520);
      ctx.tween(1700, p => {
        ctx.pose('scrib', { clip: `inset(0 ${(100 - 100 * p).toFixed(1)}% 0 0)` });
        ctx.pose('ayanA', { dx: 3 * Math.sin(p * Math.PI * 12), dy: 2 * Math.sin(p * Math.PI * 9) });
      });
      await ctx.wait(1760);
    },
    subPresses: [
      async function (ctx) { // P33
        ctx.setClockTime(a3Clock(33));
        a3Say(ctx, 'It helped a little. The storm got smaller, not gone.');
        ctx.hide('ayanA'); ctx.show('ayanB');
        ctx.tween(1200, p => {
          const e = ctx.ease(p);
          ctx.pose('cloud', { s: 1 - 0.55 * e, dy: -20 * e, dx: 40 * e });
        });
        await ctx.wait(1260);
      }
    ]
  },

  /* ==================== 13 · The call, split screen (P34-P35) ==================== */
  {
    title: 'The Call',
    words: 'So he called Khushi.',
    clock: { x: 790, y: 118, s: 0.45, h: a3Clock(34) },
    bg: () => bg('glow', W, H, 113, GP.night) +
      frame(110, 100, 360, 400, { fill: '#3b2a55', sw: 4 }) + frame(490, 100, 360, 400, { fill: '#d9cde6', sw: 4 }) +
      `<path d="M120,480 H460 M500,480 H840" stroke="${INK}" stroke-width="3"/>`,
    sprites: [
      { id: 'ayan', vx: 200, vy: 150, vw: 180, vh: 360, z: 5, boil: 1.4,
        svg: () => nerd(290, 492, 0.74, 'panic wobble sweat brow:worry', { arms: 'phone', top: ASH_WEIRD + `<g transform="translate(4 -248)">${a3Phone(0, 0, 0, 1.1)}</g>` }) },
      { id: 'rings', vx: 300, vy: 230, vw: 130, vh: 130, z: 7, boil: 1.0,
        svg: () => [0, 1, 2].map(i => `<path d="M${330 + i * 2},${278 - 18 - i * 9} q${22 + i * 10},${18 + i * 9} 0,${36 + i * 18}" fill="none" stroke="${GOLD}" stroke-width="3.2" stroke-linecap="round"/>`).join('') },
      { id: 'tablePhone', vx: 700, vy: 440, vw: 80, vh: 60, z: 6, boil: 1.4, svg: () => a3Phone(740, 470, 80, 1.1) },
      { id: 'kA', vx: 560, vy: 110, vw: 220, vh: 400, z: 5, boil: 0.8,
        svg: () => khushi(640, 492, 0.72, 'soft/soft soft brow:soft', { outfit: 'witch', arms: 'cards', pierce: ALLP, hold: K.card(-24, -262, 0.42, -20) + K.card(0, -268, 0.42, 0) + K.card(24, -262, 0.42, 20) }) },
      { id: 'kB', vx: 560, vy: 110, vw: 220, vh: 400, z: 5, boil: 0.8, hidden: true,
        svg: () => khushi(640, 492, 0.72, 'soft/soft soft brow:soft', { outfit: 'witch', arms: 'face', pierce: ALLP, hold: `<g transform="translate(-46 -342)">${a3Phone(0, 0, 8, 1)}</g>` }) },
      { id: 'cover', vx: 100, vy: 90, vw: 760, vh: 420, z: 9, boil: 0, hidden: true,
        svg: () => frame(110, 100, 740, 400, { fill: '#d9cde6', sw: 4 }) + `<path d="M120,480 H840" stroke="${INK}" stroke-width="3"/>` },
      { id: 'kClose', vx: 280, vy: 110, vw: 400, vh: 400, z: 10, boil: 0.9, hidden: true,
        svg: () => khushi(480, 730, 1.3, 'soft/soft flat brow:soft', { outfit: 'witch', arms: 'face', pierce: ALLP, hat: false, hold: `<g transform="translate(-46 -342)">${a3Phone(0, 0, 8, 1)}</g>` }) }
    ],
    async run(ctx) { // P34
      ctx.setCurtain(1);
      ctx.setClockTime(a3Clock(34));
      a3Say(ctx, this.words);
      ctx.audio('gymnopedieCall', 'fade');
      ctx.tween(800, p => {
        const k = Math.sin(p * Math.PI * 6);
        ctx.pose('rings', { op: k > -0.2 ? 1 : 0.15 });
        ctx.pose('tablePhone', { dx: 4 * k, r: 6 * k });
      });
      await ctx.wait(860);
      ctx.hide('rings'); ctx.hide('tablePhone');
      ctx.hide('kA'); ctx.show('kB');
      ctx.tween(300, p => ctx.pose('kB', { dy: -8 * Math.sin(p * Math.PI) }));
      await ctx.wait(340);
    },
    subPresses: [
      async function (ctx) { // P35
        ctx.setClockTime(a3Clock(35));
        a3Say(ctx, 'She listened.');
        ctx.show('cover'); ctx.show('kClose');
        ctx.pose('kClose', { s: 0.9, op: 0 });
        ctx.tween(600, p => ctx.pose('kClose', { s: 0.9 + 0.1 * ctx.ease(p), op: Math.min(1, p * 3) }));
        await ctx.wait(660);
      }
    ]
  },

  /* ==================== 14 · Her raised hand (P36-P38) ==================== */
  {
    title: 'Her Raised Hand',
    words: '"Shut off your brain," she said.',
    clock: { x: 790, y: 118, s: 0.45, h: a3Clock(36) },
    bg: () => bg('scribble', W, H, 114, GP.night),
    sprites: [
      { id: 'tags', vx: 470, vy: 100, vw: 380, vh: 330, z: 4, boil: 1.6,
        svg: () => a3Tag(560, 180, .8, -18, 'FRAUD', false, 18) + a3Tag(720, 192, .8, 14, 'NOT READY', false, 18) + a3Tag(700, 290, .8, -8, 'FRAUD', false, 18) +
          a3Tag(540, 330, .8, 20, 'NOT READY', false, 18) + a3Tag(770, 360, .75, -22, 'FRAUD', false, 18) + a3Tag(640, 400, .7, 8, 'NOT READY', false, 18) },
      { id: 'tagsG', vx: 470, vy: 100, vw: 380, vh: 330, z: 4, boil: 0, hidden: true,
        svg: () => a3Tag(560, 180, .8, -18, 'FRAUD', true, 18) + a3Tag(720, 192, .8, 14, 'NOT READY', true, 18) + a3Tag(700, 290, .8, -8, 'FRAUD', true, 18) +
          a3Tag(540, 330, .8, 20, 'NOT READY', true, 18) + a3Tag(770, 360, .75, -22, 'FRAUD', true, 18) + a3Tag(640, 400, .7, 8, 'NOT READY', true, 18) },
      { id: 'kD', vx: 120, vy: 100, vw: 360, vh: 440, z: 6, boil: 0.8,
        svg: () => khushi(290, 770, 1.5, 'soft/soft flat brow:arch', { outfit: 'witch', arms: 'hip', pierce: ALLP, hat: false }) },
      { id: 'kS', vx: 120, vy: 60, vw: 360, vh: 480, z: 6, boil: 0.8, hidden: true,
        svg: () => khushi(290, 770, 1.5, 'soft/soft flat brow:arch', { outfit: 'witch', arms: 'fling', pierce: ALLP, hat: false }) },
      { id: 'kT', vx: 120, vy: 60, vw: 360, vh: 480, z: 6, boil: 0.8, hidden: true,
        svg: () => khushi(290, 770, 1.5, 'soft/soft soft brow:soft blush', { outfit: 'witch', arms: 'fling', pierce: ALLP, hat: false }) },
      { id: 'ayP', vx: 640, vy: 340, vw: 200, vh: 190, z: 7, boil: 1.6,
        svg: () => nerd(740, 520, 0.42, 'panic wobble sweat brow:worry', { arms: 'chest', top: ASH_WEIRD }) },
      { id: 'ayC', vx: 640, vy: 340, vw: 200, vh: 190, z: 7, boil: 0.6, hidden: true,
        svg: () => nerd(740, 520, 0.42, '^soft smile brow:soft', { arms: 'chest', top: ASH_WEIRD }) }
    ],
    async run(ctx) { // P36
      ctx.setCurtain(1);
      ctx.setClockTime(a3Clock(36));
      a3Say(ctx, this.words);
      ctx.audio('musicDuck', 0.35); // under the spoken lines
      ctx.tween(500, p => {
        const k = (1 - p);
        ctx.pose('tags', { dx: 10 * Math.sin(p * 20) * k, dy: 8 * Math.cos(p * 17) * k, r: 4 * Math.sin(p * 13) * k });
      });
      await ctx.wait(520);
      ctx.hide('kD'); ctx.show('kS');
      ctx.tween(300, p => ctx.pose('kS', { dy: 10 * (1 - ctx.ease(p)) }));
      await ctx.wait(700);
    },
    subPresses: [
      async function (ctx) { // P37
        ctx.setClockTime(a3Clock(37));
        a3Say(ctx, '"No brains allowed."');
        ctx.hide('tags'); ctx.show('tagsG');
        await ctx.wait(500);
      },
      async function (ctx) { // P38
        ctx.setClockTime(a3Clock(38));
        a3Say(ctx, '"Let us feel it together."');
        ctx.hide('kS'); ctx.show('kT');
        ctx.hide('ayP'); ctx.show('ayC');
        await ctx.wait(500);
      }
    ]
  },

  /* ==================== 15 · Breathing, the storm falls like snow (P39-P41) ==================== */
  {
    title: 'The Breath',
    words: '"Stop using your brain. Deep breath in."',
    clock: { x: 790, y: 118, s: 0.45, h: a3Clock(39) },
    bg: () => bg('glow', W, H, 115, GP.lilac),
    sprites: [
      { id: 'halo', vx: 220, vy: 120, vw: 520, vh: 380, z: 2, boil: 0.5,
        svg: () => `<path d="${blob(480, 300, 230, 170, 24, .04)}" fill="${GOLD}" opacity=".28" filter="url(#wc)"/>` },
      { id: 'tagsAir', vx: 250, vy: 90, vw: 480, vh: 140, z: 3, boil: 0.4,
        svg: () => a3Tag(300, 150, .7, -14, 'FRAUD', true, 14) + a3Tag(420, 130, .7, 10, 'NOT READY', true, 14) + a3Tag(540, 160, .7, -8, 'FRAUD', true, 14) + a3Tag(660, 135, .7, 16, 'NOT READY', true, 14) },
      { id: 'flakes', vx: 130, vy: 80, vw: 720, vh: 440, z: 4, boil: 0, hidden: true, svg: () => a3Flakes() },
      { id: 'kS', vx: 540, vy: 150, vw: 220, vh: 380, z: 5, boil: 0.7,
        svg: () => khushi(650, 495, 0.66, 'soft/soft soft brow:soft blush', { outfit: 'witch', arms: 'cards', pierce: ALLP, hat: false }) },
      { id: 'ay1', vx: 230, vy: 130, vw: 200, vh: 390, z: 5, boil: 0.6,
        svg: () => nerd(330, 498, 0.8, '^soft o brow:soft', { arms: 'chest', top: ASH_WEIRD }) },
      { id: 'ay2', vx: 230, vy: 130, vw: 200, vh: 390, z: 5, boil: 0.2, hidden: true,
        svg: () => nerd(330, 498, 0.8, 'closed flat brow:soft', { arms: 'chest', top: ASH_WEIRD }) },
      { id: 'ay3', vx: 230, vy: 130, vw: 200, vh: 390, z: 5, boil: 0.6, hidden: true,
        svg: () => nerd(330, 498, 0.8, '^soft smile brow:soft', { arms: 'chest', top: ASH_WEIRD }) }
    ],
    async run(ctx) { // P39
      ctx.setCurtain(1);
      ctx.setClockTime(a3Clock(39));
      a3Say(ctx, this.words);
      ctx.audio('musicLevel', 1);
      ctx.tween(2000, p => {
        const b = Math.sin(p * Math.PI * 0.5);
        ctx.pose('ay1', { s: 1 + 0.05 * b, dy: -4 * b });
        ctx.pose('kS', { s: 1 + 0.05 * b, dy: -4 * b });
        ctx.pose('halo', { s: 1 + 0.08 * b, op: 0.6 + 0.4 * b });
      });
      await ctx.wait(2060);
    },
    subPresses: [
      async function (ctx) { // P40
        ctx.setClockTime(a3Clock(40));
        a3Say(ctx, '"Pause."');
        ctx.audio('silence'); // hard silence for the pause
        ctx.hide('ay1'); ctx.show('ay2');
        ctx.pose('ay2', { s: 1.05, dy: -4 });
        await ctx.wait(1700);
      },
      async function (ctx) { // P41
        ctx.setClockTime(a3Clock(41));
        a3Say(ctx, '"Don\'t dismiss it." So they felt it together.');
        ctx.audio('musicBox', 'fade soft'); // music-box only for the breath out
        ctx.hide('ay2'); ctx.show('ay3');
        ctx.show('flakes');
        ctx.pose('flakes', { dy: -170, op: 0 });
        ctx.tween(2200, p => {
          const e = ctx.ease(p);
          ctx.pose('tagsAir', { dy: 330 * e, dx: 18 * Math.sin(p * 9), r: 14 * e, op: 1 - Math.max(0, (p - 0.55) / 0.45) });
          ctx.pose('flakes', { dy: -170 + 330 * p, op: Math.min(1, p * 4) * (1 - Math.max(0, (p - 0.7) / 0.3)) });
          ctx.pose('ay3', { s: 1 - 0.04 * Math.sin(p * Math.PI), dy: 3 * Math.sin(p * Math.PI) });
          ctx.pose('kS', { s: 1 - 0.04 * Math.sin(p * Math.PI) });
          ctx.pose('halo', { s: 1.04 - 0.04 * p, op: 1 - 0.4 * p });
        });
        await ctx.wait(2300);
        ctx.audio('musicFade');
      }
    ]
  }
];
