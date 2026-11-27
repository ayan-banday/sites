/* act1 (v2): Act I, The Sensible Script. Shots 2 to 6, presses P4-P16. n is renumbered by assembleShots().
   Helpers carry the a1_ prefix. */
const a1_h = P => 11 + (P - 3) / 44 * 0.97; // the corner clock: P4..P47 climb to 11:58
const a1_hint = 'press space to continue';
const a1_vil = (id, cx, cy, s, mood, r, extra = {}) => Object.assign({ id, vx: cx - 125 * s, vy: cy - 120 * s, vw: 250 * s, vh: 225 * s, z: 4, boil: 1.0, svg: () => K.villain(cx, cy, s, mood, r) }, extra);
const a1_kh = (id, x, gy, s, face, o = {}, extra = {}) => Object.assign({ id, vx: x - 110 * s, vy: gy - 450 * s, vw: 220 * s, vh: 460 * s, z: 7, boil: 1.0, svg: () => khushi(x, gy, s, face, Object.assign({ outfit: 'coat', arms: 'hip', pierce: ['earL'] }, o)) }, extra);
const a1_tagSp = (id, x, y, s, r, text, extra = {}) => Object.assign({ id, vx: x - 75, vy: y - 62, vw: 150, vh: 95, z: 8, boil: 0.8, hidden: true, svg: () => a1_tag(x, y, s, r, text) }, extra);
const a1_tag = (x, y, s, r, text, str = 60) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0,${-str} Q6,${-str / 2} 0,-30" stroke="${INK}" stroke-width="1.6" fill="none"/><path d="${wob([[-62, -30], [54, -30], [70, -8], [54, 16], [-62, 16]], 1, true)}" fill="#fbf6ea" stroke="${INK}" stroke-width="2.6" filter="url(#wob)"/><circle cx="50" cy="-8" r="4" fill="none" stroke="${INK}" stroke-width="2"/><text x="-4" y="-1" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="${text.length > 10 ? 13 : 17}" font-style="italic" fill="${INK}">${text}</text></g>`;
const a1_wait = ms => new Promise(r => setTimeout(r, ms));

/* ---- new art ---- */
const a1_banner = () => `<path d="${wob(rectPts(210, 105, 540, 104, 16), 1.4, true)}" fill="${INK}" stroke="${GOLD}" stroke-width="5" filter="url(#wob)"/>` +
  `<path d="${wob(rectPts(222, 117, 516, 80, 12), 1, true)}" fill="none" stroke="${GOLD}" stroke-width="1.8"/>` +
  K.word(480, 140, 17, 'ACT I', BONE, 0, 'middle', 'normal') + K.word(480, 182, 38, 'THE SENSIBLE SCRIPT', GOLD, 0, 'middle', 'normal');
const a1_bed = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#wob)">` +
  `<path d="M-84,-80 v84 M84,-96 v100" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>` +
  `<path d="${wob(rectPts(-86, -40, 172, 36, 8), 1, true)}" fill="#fbf6ea" stroke="${INK}" stroke-width="2.8"/>` +
  `<path d="${wob(rectPts(-30, -40, 114, 36, 8), 1, true)}" fill="#b9c2b0" stroke="${INK}" stroke-width="2.8"/>` +
  `<path d="${wob(rectPts(-80, -58, 46, 20, 9), 1, true)}" fill="#fff" stroke="${INK}" stroke-width="2.4"/>` +
  `<path d="M-84,4 h168" stroke="${INK}" stroke-width="5"/></g>`;
const a1_steth = `<path d="M-22,-292 C-34,-244 -12,-214 0,-214 C12,-214 34,-244 22,-292" fill="none" stroke="#2f3b4a" stroke-width="7" stroke-linecap="round"/><circle cx="0" cy="-208" r="11" fill="#dfe3e8" stroke="${INK}" stroke-width="2.6"/>`;
const a1_castScrap = (x, y) => `<g transform="translate(${x} ${y}) rotate(-3)" filter="url(#wob)"><path d="${wob(rectPts(-60, -42, 120, 84, 6), 1, true)}" fill="#fbf6ea" stroke="${INK}" stroke-width="2.6"/>` +
  K.word(0, -20, 13, 'CAST', INK, 0, 'middle', 'normal') + K.word(-14, 8, 15, 'KHUSHI', INK, 0, 'middle', 'normal') +
  `<rect x="22" y="-6" width="34" height="18" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="4 3"/><path d="M-50,30 h100" stroke="${INK}" stroke-width="1.4" opacity=".5"/></g>`;
const a1_stamp = (x, y, s, r) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" filter="url(#wob)">` +
  `<path d="M0,-30 L0,-110" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M0,-30 L0,-110" stroke="#8a5a3a" stroke-width="10" stroke-linecap="round"/><circle cx="0" cy="-116" r="17" fill="#8a5a3a" stroke="${INK}" stroke-width="3"/>` +
  `<path d="${wob(rectPts(-100, -34, 200, 24, 6), .8, true)}" fill="#6b3f2a" stroke="${INK}" stroke-width="3"/>` +
  `<path d="${wob(rectPts(-104, -10, 208, 66, 8), 1, true)}" fill="#fbf6ea" stroke="${INK}" stroke-width="3.4"/>` +
  K.word(0, 36, 40, 'FOREVER', PINK, 0, 'middle', 'normal') + `</g>`;
const a1_cart = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#wob)"><path d="${wob(rectPts(-86, -10, 172, 22, 6), 1, true)}" fill="#6b3f2a" stroke="${INK}" stroke-width="3"/>` +
  [-54, 54].map(wx => `<circle cx="${wx}" cy="26" r="24" fill="#3b2a55" stroke="${INK}" stroke-width="3.4"/><circle cx="${wx}" cy="26" r="6" fill="${GOLD}" stroke="${INK}" stroke-width="2"/><path d="M${wx},4 v44 M${wx - 22},26 h44" stroke="${INK}" stroke-width="2"/>`).join('') + `</g>`;
const a1_fan = (px, py, s, kinds) => kinds.map(([a, kind]) => K.card(px + Math.sin(a * Math.PI / 180) * 95, py - Math.cos(a * Math.PI / 180) * 95, s, a, kind)).join('');

/* tag landing spots on Khushi in shot 3: [x, y, rotation] */
const a1_L = [[285, 332, -8], [380, 352, 10], [282, 394, 6], [384, 414, -9], [330, 458, 3]];
const a1_LABEL = ['GOOD GIRL', 'NORMAL', 'QUIET', 'SENSIBLE', 'EASY TO READ'];

async function a1_throw(ctx, i, dur) {
  const [x, y] = a1_L[i], id = 'tag' + i;
  const dx0 = 640 - x, dy0 = 240 - y;
  ctx.pose(id, { dx: dx0, dy: dy0, r: 300, op: 0 });
  ctx.tween(280, p => ctx.pose('villain', { dx: -18 * Math.sin(p * Math.PI), r: -5 * Math.sin(p * Math.PI) }));
  ctx.tween(dur, p => {
    const e = ctx.ease(p);
    ctx.pose(id, { dx: dx0 * (1 - e), dy: dy0 * (1 - e) - 90 * Math.sin(p * Math.PI), r: 300 * (1 - e), op: Math.min(1, p * 4) });
  });
  await ctx.wait(dur + 30);
  ctx.audio('thud');
}
const a1_sag = (ctx, id, dy, sy, dur = 380) => ctx.tween(dur, p => { const e = ctx.ease(p); ctx.pose(id, { dy: dy * e, sy: 1 - (1 - sy) * e }); });

(window.SHOTS_BY_ACT = window.SHOTS_BY_ACT || {}).act1 = [
  /* ==================== 2 · ACT I title, the Script marches in (P4-P5) ==================== */
  {
    title: 'Act I · The Sensible Script',
    words: 'ACT I. THE SENSIBLE SCRIPT.',
    clock: { x: 840, y: 130, s: 0.5, h: a1_h(4) },
    bg: () => bg('wash', W, H, 102, GP.bone) + floor(),
    sprites: [
      { id: 'inter', vx: 200, vy: 95, vw: 560, vh: 125, z: 9, boil: 0.6, hidden: true, svg: a1_banner },
      a1_kh('khushi', 300, 478, 0.62, 'big/big soft'),
      a1_vil('villain', 650, 345, 1.05, 'prim', -4, { origin: '50% 0%' }),
      { id: 'pile', vx: 500, vy: 330, vw: 150, vh: 110, z: 6, boil: 0.8, hidden: true,
        svg: () => a1_tag(545, 390, 0.5, -14, 'NORMAL', 0) + a1_tag(585, 395, 0.5, 10, 'QUIET', 0) + a1_tag(560, 372, 0.5, -3, 'GOOD GIRL', 0) + a1_tag(598, 372, 0.5, 16, 'SENSIBLE', 0) }
    ],
    async run(ctx) {
      // P4: intertitle; the Script marches in on the waltz.
      ctx.setCurtain(1);
      ctx.say('', '');
      ctx.audio('waltz');
      ctx.pose('villain', { dx: 380 });
      ctx.pose('inter', { dy: -50, op: 0 });
      ctx.tween(500, p => ctx.pose('inter', { dy: -50 * (1 - ctx.ease(p)), op: Math.min(1, p * 2) }));
      ctx.tween(1900, p => {
        const e = ctx.ease(p);
        ctx.pose('villain', { dx: 380 * (1 - e), dy: -9 * Math.abs(Math.sin(p * Math.PI * 7)) * (1 - p), r: 3 * Math.sin(p * Math.PI * 7) * (1 - p) });
      });
      await ctx.wait(2000);
      ctx.say(this.words, a1_hint);
    },
    subPresses: [
      // P5: it unrolls, holding a pen and a pile of tags.
      async function (ctx) {
        ctx.setClockTime(a1_h(5));
        ctx.say('', '');
        ctx.tween(450, p => ctx.pose('inter', { dy: -30 * p, op: 1 - p }));
        ctx.tween(650, p => { const e = ctx.ease(p); ctx.pose('villain', { sy: 0.55 + 0.45 * e, dy: 0 }); });
        await ctx.wait(500);
        ctx.pose('pile', { dy: 40, op: 0 });
        ctx.tween(380, p => ctx.pose('pile', { dy: 40 * (1 - ctx.ease(p)), op: p }));
        await ctx.wait(560);
        ctx.say('It writes a part for everyone: the one most people like best. It already had one for her.', a1_hint);
      }
    ]
  },

  /* ==================== 3 · The tags land (P6-P10) ==================== */
  {
    title: 'Five Tags',
    words: 'Good girl.',
    clock: { x: 840, y: 130, s: 0.5, h: a1_h(6) },
    bg: () => bg('halftone', W, H, 103, GP.bone, { fx: 330, fy: 300 }) + floor(),
    sprites: [
      a1_kh('khA', 330, 500, 0.8, 'soft/soft soft brow:soft'),
      a1_kh('khB', 330, 500, 0.8, 'lidded/lidded soft brow:soft', {}, { hidden: true, origin: '50% 100%' }),
      a1_kh('khC', 330, 500, 0.8, 'lidded/lidded flat brow:soft', {}, { hidden: true, origin: '50% 100%' }),
      a1_vil('villain', 700, 265, 1.1, 'prim', -4),
      ...a1_L.map(([x, y, r], i) => a1_tagSp('tag' + i, x, y, 0.72, r, a1_LABEL[i]))
    ],
    async run(ctx) {
      // P6: GOOD GIRL lands; she smiles politely.
      ctx.setCurtain(1);
      ctx.say('', '');
      await a1_throw(ctx, 0, 560);
      ctx.say(this.words, a1_hint);
    },
    subPresses: [
      // P7: NORMAL; her shoulders drop.
      async function (ctx) {
        ctx.setClockTime(a1_h(7)); ctx.say('', '');
        await a1_throw(ctx, 1, 470);
        a1_sag(ctx, 'khA', 10, 0.97);
        await ctx.wait(420);
        ctx.say('Normal.', a1_hint);
      },
      // P8: QUIET; her eyes go lidded.
      async function (ctx) {
        ctx.setClockTime(a1_h(8)); ctx.say('', '');
        await a1_throw(ctx, 2, 400);
        ctx.hide('khA'); ctx.pose('khB', { dy: 10, sy: 0.97, op: 1 });
        await ctx.wait(300);
        ctx.say('Quiet.', a1_hint);
      },
      // P9: SENSIBLE; her mouth goes flat.
      async function (ctx) {
        ctx.setClockTime(a1_h(9)); ctx.say('', '');
        await a1_throw(ctx, 3, 330);
        ctx.hide('khB'); ctx.pose('khC', { dy: 10, sy: 0.97, op: 1 });
        await ctx.wait(300);
        ctx.say('Sensible.', a1_hint);
      },
      // P10: EASY TO READ; the weight of five tags pins her. Drumbeat: faster than the last.
      async function (ctx) {
        ctx.setClockTime(a1_h(10)); ctx.say('', '');
        await a1_throw(ctx, 4, 250);
        ctx.tween(300, p => { const e = ctx.ease(p); ctx.pose('khC', { dy: 10 + 12 * e, sy: 0.97 - 0.04 * e, dx: 3 * Math.sin(p * Math.PI * 6) }); });
        await ctx.wait(380);
        ctx.say('Easy to read.', a1_hint);
      }
    ]
  },

  /* ==================== 4 · The ward (P11-P13) ==================== */
  {
    title: 'The White Coat',
    words: 'By day she wore a white coat, and she was good at it.',
    clock: { x: 840, y: 130, s: 0.5, h: a1_h(11) },
    bg: () => bg('wash', W, H, 104, GP.ward) + floor() + a1_bed(190, 440, 0.95) + a1_bed(470, 440, 0.95) + a1_bed(750, 440, 0.95),
    sprites: [
      a1_kh('khushi', 560, 490, 0.66, 'soft/soft soft', { hold: a1_steth, snake: false }),
      a1_vil('villain', 250, 330, 0.95, 'prim', 4),
      { id: 'coatTags', vx: 290, vy: 260, vw: 320, vh: 140, z: 8, boil: 0.8, hidden: true,
        svg: () => `<g fill="none" stroke="${INK}" stroke-width="1.8"><path d="M318,318 Q420,360 506,300"/><path d="M318,322 Q430,392 548,326"/><path d="M318,326 Q400,396 518,360"/></g>` +
          a1_tag(520, 322, 0.5, -8, 'NORMAL', 0) + a1_tag(562, 346, 0.5, 8, 'QUIET', 0) + a1_tag(530, 372, 0.5, -4, 'EASY', 0) },
      { id: 'bill', vx: 665, vy: 190, vw: 170, vh: 240, z: 5, boil: 0.7, hidden: true, svg: () => K.playbill(750, 305, 0.7, true) },
      { id: 'cast', vx: 680, vy: 280, vw: 140, vh: 110, z: 6, boil: 0.7, hidden: true, svg: () => a1_castScrap(750, 335) }
    ],
    async run(ctx) {
      // P11: she walks past the beds in her white coat, stethoscope round her neck.
      ctx.setCurtain(1);
      ctx.say('', '');
      ctx.audio('waltzSoft');
      ctx.pose('villain', { op: 0, dx: -330 });
      ctx.tween(1800, p => {
        const e = ctx.ease(p);
        ctx.pose('khushi', { dx: -430 * (1 - e), dy: -8 * Math.abs(Math.sin(p * Math.PI * 6)) * (1 - p * 0.8) });
      });
      await ctx.wait(1900);
      ctx.say(this.words, a1_hint);
    },
    subPresses: [
      // P12: the Script follows, tags on strings pinned to the coat.
      async function (ctx) {
        ctx.setClockTime(a1_h(12)); ctx.say('', '');
        ctx.pose('villain', { op: 1, dx: -330 });
        ctx.tween(1500, p => {
          const e = ctx.ease(p);
          ctx.pose('villain', { dx: -330 * (1 - e), dy: -8 * Math.abs(Math.sin(p * Math.PI * 6)) * (1 - p), r: 3 * Math.sin(p * Math.PI * 6) * (1 - p) });
        });
        await ctx.wait(1550);
        ctx.pose('coatTags', { dy: -14, op: 0 });
        ctx.tween(350, p => ctx.pose('coatTags', { dy: -14 * (1 - ctx.ease(p)), op: p }));
        ctx.audio('thud');
        await ctx.wait(450);
        ctx.say('The Script loved the coat. A coat is easy to read.', a1_hint);
      },
      // P13: the playbill with a cast list: KHUSHI and a blank; the Script sharpens its pen.
      async function (ctx) {
        ctx.setClockTime(a1_h(13)); ctx.say('', '');
        ctx.pose('bill', { dy: 60, op: 0 });
        ctx.tween(520, p => ctx.pose('bill', { dy: 60 * (1 - ctx.ease(p)), op: Math.min(1, p * 2) }));
        await ctx.wait(560);
        ctx.pose('cast', { dy: 14, op: 0 });
        ctx.tween(300, p => ctx.pose('cast', { dy: 14 * (1 - ctx.ease(p)), op: p }));
        ctx.tween(800, p => ctx.pose('villain', { r: 4 + 6 * Math.sin(p * Math.PI * 9) * (1 - p) }));
        await ctx.wait(850);
        ctx.say('On its playbill, her name had a blank beside it. Its pen was ready.', a1_hint);
      }
    ]
  },

  /* ==================== 5 · The blank card, close-up (P14-P15) ==================== */
  {
    title: 'The Blank Card',
    words: 'In her deck was one card nobody had painted.',
    clock: { x: 840, y: 130, s: 0.5, h: a1_h(14) },
    bg: () => bg('glow', W, H, 105, GP.night),
    sprites: [
      a1_kh('khA', 420, 770, 1.45, 'soft/soft soft brow:soft', { arms: 'cards' }),
      a1_kh('khB', 420, 770, 1.45, 'wink/soft smirk', { arms: 'cards' }, { hidden: true }),
      { id: 'fan', vx: 360, vy: 330, vw: 280, vh: 190, z: 8, boil: 0.6, hidden: true, svg: () => a1_fan(500, 525, 0.95, [[-30, 'back'], [-15, 'back'], [0, 'back'], [15, 'back']]) },
      { id: 'blank', vx: 495, vy: 375, vw: 110, vh: 150, z: 9, boil: 0.5, hidden: true, svg: () => K.card(556, 448, 0.95, 36, 'blank') },
      { id: 'ledge', vx: 680, vy: 120, vw: 190, vh: 130, z: 3, boil: 0.7, hidden: true,
        svg: () => `<path d="M690,218 h140" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M690,218 h140" stroke="#6b3f2a" stroke-width="4" stroke-linecap="round"/>` + K.banana(760, 200, 0.8, -8) }
    ],
    async run(ctx) {
      // P14: she fans her deck; the last card is blank.
      ctx.setCurtain(1);
      ctx.say('', '');
      ctx.audio('misteriosoCard');
      ctx.pose('fan', { dy: 50, op: 0 });
      ctx.tween(520, p => ctx.pose('fan', { dy: 50 * (1 - ctx.ease(p)), op: Math.min(1, p * 2) }));
      await ctx.wait(560);
      ctx.pose('blank', { dy: 0, op: 0 });
      ctx.tween(520, p => { const e = ctx.ease(p); ctx.pose('blank', { dy: -34 * e, dx: 14 * e, r: 8 * e, op: Math.min(1, p * 3) }); });
      await ctx.wait(600);
      ctx.say(this.words, a1_hint);
    },
    subPresses: [
      // P15: she tucks the blank card into her pocket; the banana waits on a ledge behind her.
      async function (ctx) {
        ctx.setClockTime(a1_h(15)); ctx.say('', '');
        ctx.hide('khA'); ctx.show('khB');
        ctx.tween(800, p => {
          const e = ctx.ease(p);
          ctx.pose('blank', { dx: 14 - 199 * e, dy: -34 + 80 * e, r: 8 - 33 * e, s: 1 - 0.65 * e, op: 1 - Math.max(0, (p - 0.75) * 4) });
        });
        await ctx.wait(850);
        ctx.hide('blank');
        ctx.pose('ledge', { dy: 12, op: 0 });
        ctx.tween(400, p => ctx.pose('ledge', { dy: 12 * (1 - ctx.ease(p)), op: p }));
        await ctx.wait(450);
        ctx.say('She tucked it away. Not yet.', a1_hint);
      }
    ]
  },

  /* ==================== 6 · FOREVER (P16) ==================== */
  {
    title: 'Forever',
    words: 'At midnight it would stamp her part for good.',
    clock: { x: 770, y: 170, s: 0.95, h: a1_h(16) },
    bg: () => bg('halftone', W, H, 106, GP.blood, { fx: 480, fy: 300 }) + floor(),
    sprites: [
      a1_kh('khushi', 240, 478, 0.66, 'big/big soft brow:worry', {}, {}),
      { id: 'cart', vx: 480, vy: 410, vw: 250, vh: 90, z: 3, boil: 0.5, svg: () => a1_cart(610, 438, 1.1) },
      a1_vil('villain', 610, 300, 1.15, 'prim', -3),
      { id: 'stamp', vx: 300, vy: 120, vw: 250, vh: 200, z: 9, boil: 0.8, svg: () => a1_stamp(425, 235, 1.0, -12) }
    ],
    async run(ctx) {
      // P16: the Script wheels in a big FOREVER stamp. Clock is bigger.
      ctx.setCurtain(1);
      ctx.say('', '');
      ctx.audio('waltz');
      const g = ['villain', 'cart', 'stamp'];
      g.forEach(id => ctx.pose(id, { dx: 420 }));
      ctx.tween(1500, p => {
        const e = ctx.ease(p), bob = -5 * Math.abs(Math.sin(p * Math.PI * 8)) * (1 - p);
        g.forEach(id => ctx.pose(id, { dx: 420 * (1 - e), dy: bob }));
      });
      await ctx.wait(1600);
      ctx.audio('gongSoft');
      ctx.tween(400, p => ctx.pose('stamp', { dy: 10 * Math.sin(p * Math.PI), r: -3 * Math.sin(p * Math.PI) }));
      await ctx.wait(450);
      ctx.say(this.words, a1_hint);
    }
  }
];
