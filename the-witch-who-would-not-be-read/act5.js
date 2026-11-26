/* act5 v2: ACT V. FIVE HANDS (shots 19 to 27, P51-P78).
   The card sits on an easel; one stroke per label builds her face. Helpers all live in V5. */
const V5 = {
  GREEN: '#8fb09c', RED: '#c4263f', VIOLET: '#6a3fa8', MOSSL: '#8aa35c',
  C: { x: 690, y: 290, s: 1.05 },
  HINT: 'press space to continue',
  vb(cx, cy, rx, ry) {
    const vx = Math.max(0, Math.round(cx - rx)), vy = Math.max(0, Math.round(cy - ry));
    const r = Math.min(960, Math.round(cx + rx)), b = Math.min(540, Math.round(cy + ry));
    return { vx, vy, vw: r - vx, vh: b - vy };
  },
  kb(x, gy, s, w = 150) { return V5.vb(x, (gy - 440 * s + gy + 12) / 2, w * s, (440 * s + 12) / 2); },
  tick(ctx) { ctx.setClockTime(11.982 + Math.random() * 0.006); },
  /* card-local strokes: 1 outline, 2 brows+mouth, 3 cheeks, 4 hair, 5 eyes */
  stroke(k) {
    const w = (d, wd, col, x = '') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${wd}" stroke-linecap="round" stroke-linejoin="round" ${x}/>`;
    let s = '';
    if (k === 1) {
      s += `<path d="M0,-70 C34,-70 46,-40 44,-8 C42,30 22,52 0,54 C-22,52 -42,30 -44,-8 C-46,-40 -34,-70 0,-70Z" fill="${V5.GREEN}" fill-opacity=".14" stroke="${V5.GREEN}" stroke-width="5" stroke-linejoin="round"/>`;
      s += w('M-14,52 L-16,70 C-40,76 -56,84 -66,90 M14,52 L16,70 C40,76 56,84 66,90', 5, V5.GREEN);
      s += w('M-44,-16 C-56,-18 -56,6 -43,6 M44,-16 C56,-18 56,6 43,6', 4, V5.GREEN);
      s += w('M2,-12 C6,-2 7,4 0,6', 3.4, V5.GREEN);
    }
    if (k === 2) {
      s += w('M-38,-46 L-10,-28 M38,-46 L10,-28', 9, V5.RED);
      s += `<path d="M-27,22 Q0,54 27,22 Q0,32 -27,22Z" fill="${V5.RED}" stroke="${V5.RED}" stroke-width="7" stroke-linejoin="round"/><path d="M-13,28 l6,12 l6,-9Z" fill="#fff"/>`;
    }
    if (k === 3) {
      s += `<ellipse cx="-29" cy="10" rx="14" ry="10" fill="${V5.MOSSL}" fill-opacity=".55"/><ellipse cx="29" cy="10" rx="14" ry="10" fill="${V5.MOSSL}" fill-opacity=".55"/>`;
      s += w('M-37,10 q8,-8 16,0 M21,10 q8,-8 16,0', 5, '#c7d79a', 'opacity=".85"');
    }
    if (k === 4) {
      s += w('M-45,-12 C-66,-48 -54,-92 -10,-98 C22,-108 58,-90 54,-50 C60,-30 52,-10 46,-2', 10, V5.VIOLET);
      s += w('M-30,-92 C-52,-112 -22,-118 -8,-106 M24,-96 C44,-116 70,-102 58,-84', 8, V5.VIOLET);
      s += w('M-46,0 C-62,30 -56,56 -68,78 M46,0 C64,30 58,56 70,80', 9, V5.VIOLET);
      s += w('M-22,-84 C-8,-70 10,-72 28,-84', 6, '#9a77d6');
      s += sparkle(-62, -100, 9, GOLD) + sparkle(62, -104, 8, GOLD) + sparkle(70, -58, 6, GOLD);
    }
    if (k === 5) {
      [-17, 17].forEach(x => {
        s += `<ellipse cx="${x}" cy="-12" rx="12" ry="9" fill="#fff" stroke="${CORAL}" stroke-width="4.4"/><circle cx="${x}" cy="-12" r="5.6" fill="${INK}"/><circle cx="${x - 2}" cy="-14.5" r="2" fill="#fff"/>`;
      });
      s += w('M-29,-18 q-6,-3 -9,-10 M29,-18 q6,-3 9,-10', 3.6, CORAL);
    }
    return `<g filter="url(#wob)">${s}</g>`;
  },
  inner(n) { let s = ''; for (let i = 1; i <= n; i++) s += V5.stroke(i); return s; },
  card(cx, cy, s, n, r = 0) { return K.bigcard(cx, cy, s, r, '', '', V5.inner(n)); },
  cardBox(cx, cy, s) { return V5.vb(cx, cy, 100 * s, 140 * s); },
  strokeSprite(id, k, cx, cy, s, z = 7) {
    return { id, ...V5.cardBox(cx, cy, s), z, boil: 0.5, hidden: true, svg: () => `<g transform="translate(${cx} ${cy}) scale(${s})">${V5.stroke(k)}</g>` };
  },
  easel(cx, cy, s) {
    const top = cy + 135 * s + 4, w = 112 * s;
    const leg = (x1, y1, x2, y2) => `<path d="M${x1},${y1} L${x2},${y2}" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="M${x1},${y1} L${x2},${y2}" stroke="#8a5a34" stroke-width="9" stroke-linecap="round"/>`;
    return `<g filter="url(#wob)">${leg(cx - 70 * s, top, cx - 100, 482)}${leg(cx + 70 * s, top, cx + 100, 482)}${leg(cx, top - 20, cx + 8, 482)}<path d="${wob(rectPts(cx - w, top - 2, w * 2, 12, 20), 1, true)}" fill="#8a5a34" stroke="${INK}" stroke-width="3"/></g>`;
  },
  hand(x, y, s = 1, r = 0, col = '#fbf6ea', arm = 0) {
    const f = [[-21, -30], [-7, -44], [8, -40], [22, -28]];
    let fi = ''; f.forEach(([fx, ft]) => { fi += `M${fx},0 L${fx},${ft} `; });
    const th = 'M-26,26 L-48,4', ar = arm ? `M0,48 L0,${48 + arm}` : '';
    const L = (d, wd, c) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${wd}" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" filter="url(#wob)">${arm ? L(ar, 40, INK) : ''}${L(fi, 18, INK)}${L(th, 18, INK)}<path d="M-30,-2 L30,-2 L30,34 Q28,54 0,56 Q-28,54 -30,34Z" fill="${col}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>${L(fi, 12, col)}${L(th, 12, col)}${arm ? L(ar, 33, col) : ''}${arm ? `<path d="M-17,${50 + 6} h34" stroke="${INK}" stroke-width="3"/>` : ''}</g>`;
  },
  glow(id, x, y, r, col) {
    return `<defs><radialGradient id="v5g${id}"><stop offset="0" stop-color="${col}" stop-opacity=".85"/><stop offset=".6" stop-color="${col}" stop-opacity=".3"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs><circle cx="${x}" cy="${y}" r="${r}" fill="url(#v5g${id})"/>`;
  },
  glass(x, y, s = 1, r = 0, broke = false) {
    return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" filter="url(#wob)"><path d="M40,40 L74,88" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M40,40 L74,88" stroke="${GOLD}" stroke-width="10" stroke-linecap="round"/><circle r="58" fill="#dff1f5" fill-opacity=".4" stroke="${INK}" stroke-width="12"/><circle r="58" fill="none" stroke="${GOLD}" stroke-width="6"/><path d="M-34,-24 Q-24,-40 -6,-44" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>${broke ? `<path d="M0,0 L-30,-42 M0,0 L40,-30 M0,0 L28,44 M0,0 L-44,22 M0,0 L2,-58" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>` : ''}</g>`;
  },
  list(x, y, s, ticked) {
    const words = ['DOCTOR', 'BITCH', 'HEALER', 'WITCH', 'ARTIST'];
    let t = '';
    words.forEach((wd, i) => {
      t += `<text x="-44" y="${-36 + i * 28}" font-family="Georgia,serif" font-size="17" font-style="italic" fill="${INK}">${wd}</text><path d="M-48,${-30 + i * 28} h96" stroke="${INK}" stroke-width="1.2" opacity=".35"/>`;
      if (i < ticked) t += `<path d="M-50,${-42 + i * 28} L50,${-30 + i * 28}" stroke="${V5.RED}" stroke-width="4" stroke-linecap="round"/>`;
    });
    return `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#wob)"><path d="${wob(rectPts(-62, -76, 124, 160, 16), 1.2, true)}" fill="#fbf6ea" stroke="${INK}" stroke-width="3"/>${t}</g>`;
  },
  sil(x, gy, s, face, o) {
    return `<g style="filter:brightness(0)" opacity=".78">${khushi(x, gy, s, face, o)}</g>`;
  },
  title() {
    const t = (y, tx) => `<text x="480" y="${y}" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="46" font-style="italic" font-weight="bold" fill="${GOLD}" stroke="${INK}" stroke-width="7" paint-order="stroke" stroke-linejoin="round">${tx}</text>`;
    return `<g filter="url(#wob)">${t(158, 'THE WITCH WHO')}${t(212, 'WOULD NOT BE READ')}</g>`;
  },
  /* paint one stroke: reveal by clip while the brush sweeps over the card */
  async paint(ctx, sid, o = {}) {
    const dur = o.dur || 900, down = !!o.down;
    const clip = e => down ? `inset(0 0 ${(100 * (1 - e)).toFixed(1)}% 0)` : `inset(0 ${(100 * (1 - e)).toFixed(1)}% 0 0)`;
    ctx.show(sid); ctx.pose(sid, { clip: clip(0) });
    ctx.show('brush'); ctx.pose('brush', { op: 1 });
    ctx.audio('brushStroke');
    ctx.tween(dur, p => {
      const e = ctx.ease(p);
      ctx.pose(sid, { clip: clip(e) });
      ctx.pose('brush', down
        ? { dx: 10 * Math.sin(p * 9), dy: -60 + 130 * e, r: 8 * Math.sin(p * 7) }
        : { dx: -90 + 170 * e, dy: -10 * Math.sin(p * 9), r: 8 * Math.sin(p * 7) });
    });
    await ctx.wait(dur + 60);
    ctx.tween(240, p => ctx.pose('brush', { op: 1 - p }));
    await ctx.wait(260);
  },
  brushSprite(tx, ty) {
    /* tip at (tx,ty); handle lower right */
    const bx = tx + 109, by = ty + 156;
    return { id: 'brush', ...V5.vb(tx + 54, ty + 78, 90, 100), z: 12, boil: 0.8, hidden: true, svg: () => K.brush(bx, by, 1.3, -35) };
  }
};
V5.scene = (n, cx = V5.C.x, cy = V5.C.y, s = V5.C.s) => V5.easel(cx, cy, s) + V5.card(cx, cy, s, n);
const V5clock = { x: 836, y: 104, s: 0.4, h: 11.984 };

(window.SHOTS_BY_ACT = window.SHOTS_BY_ACT || {}).act5 = [

  /* ================= DOCTOR (P51-P53) ================= */
  {
    title: 'Five Hands · Doctor',
    words: 'First word on the list: Doctor.',
    clock: V5clock,
    bg: () => bg('wash', W, H, 151, GP.ward) + floor() + V5.scene(0),
    sprites: [
      { id: 'script', ...V5.vb(170, 190, 100, 110), z: 3, boil: 1, svg: () => K.villain(170, 190, 0.75, 'prim', -4) },
      { id: 'khushi', ...V5.kb(370, 478, 0.85), z: 5, boil: 1.1, svg: () => khushi(370, 478, 0.85, 'soft/soft soft brow:soft', { outfit: 'coat', arms: 'cards', pierce: ['earL'] }) },
      { id: 'glow', ...V5.vb(370, 285, 130, 130), z: 6, hidden: true, svg: () => V5.glow('d', 370, 285, 120, '#7fc09a') },
      { id: 'tag', ...V5.vb(370, 295, 100, 90), z: 8, boil: 0.8, svg: () => K.tag(370, 305, 0.95, 0, 'DOCTOR') },
      V5.strokeSprite('s1', 1, V5.C.x, V5.C.y, V5.C.s),
      V5.brushSprite(V5.C.x - 20, V5.C.y - 40)
    ],
    async run(ctx) {
      ctx.setCurtain(1); V5.tick(ctx);
      ctx.audio('virtutesDoctor');
      ctx.say(this.words, V5.HINT);
      ctx.pose('tag', { dy: -220, op: 0, r: -16 });
      ctx.tween(520, p => { const e = ctx.ease(p); ctx.pose('tag', { dy: -220 * (1 - e), op: Math.min(1, p * 3), r: -16 * (1 - e) }); });
      await ctx.wait(560);
      ctx.audio('tagThud');
      ctx.tween(220, p => ctx.pose('khushi', { dy: 5 * Math.sin(p * Math.PI) }));
    },
    subPresses: [
      async function (ctx) {
        V5.tick(ctx);
        ctx.say('It fits. She worked for it.', V5.HINT);
        ctx.audio('ting');
        ctx.show('glow'); ctx.pose('glow', { op: 0 });
        ctx.tween(520, p => {
          const e = ctx.ease(p);
          ctx.pose('tag', { dy: -26 * e, s: 1 + 0.12 * Math.sin(p * Math.PI) });
          ctx.pose('glow', { op: Math.min(1, p * 2), s: 0.8 + 0.3 * e });
        });
        await ctx.wait(580);
      },
      async function (ctx) {
        V5.tick(ctx);
        ctx.say('One stroke for the doctor.', V5.HINT);
        await V5.paint(ctx, 's1', { dur: 1000 });
      }
    ]
  },

  /* ================= THE STANDING COAT (P54-P56) ================= */
  {
    title: 'Five Hands · The Coat',
    words: 'Then she stepped out of the coat.',
    clock: V5clock,
    bg: () => bg('wash', W, H, 152, GP.ward) + floor() + V5.scene(1, 780, 300, 0.82),
    sprites: [
      { id: 'script', ...V5.vb(160, 190, 100, 110), z: 3, boil: 1, svg: () => K.villain(160, 190, 0.7, 'prim', -4) },
      { id: 'list', ...V5.vb(165, 350, 80, 100), z: 3, boil: 0.6, svg: () => V5.list(165, 350, 0.9, 0) },
      { id: 'tick', ...V5.vb(165, 350, 80, 100), z: 4, hidden: true, boil: 0.5, svg: () => V5.list(165, 350, 0.9, 1) },
      { id: 'coatOn', ...V5.kb(400, 478, 0.8), z: 5, boil: 1.1, svg: () => khushi(400, 478, 0.8, 'lidded/lidded flat brow:arch', { outfit: 'coat', arms: 'hip', pierce: ['earL'] }) },
      {
        id: 'coatStand', ...V5.kb(400, 478, 0.8), z: 5, boil: 1.1, hidden: true,
        svg: () => `<g transform="translate(400 468) scale(.8)"><path d="M0,-300 q0,-16 12,-20 q12,-4 10,-16" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round" filter="url(#wob)"/><path d="M-70,-296 L0,-300 L70,-296" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round" filter="url(#wob)"/><use href="#k-coat"/><use href="#k-arms-hip-c"/></g>`
      },
      { id: 'tagCoat', ...V5.vb(400, 320, 100, 90), z: 8, hidden: true, boil: 0.8, svg: () => K.tag(400, 330, 0.9, 0, 'DOCTOR') },
      { id: 'dress', ...V5.kb(400, 478, 0.75), z: 6, boil: 1.1, hidden: true, svg: () => khushi(400, 478, 0.75, 'soft/soft smirk brow:arch', { outfit: 'witch', arms: 'hip', pierce: ALLP }) },
      { id: 'pulse', ...V5.vb(780, 300, 130, 170), z: 9, hidden: true, svg: () => sparkle(715, 200, 16, GOLD) + sparkle(850, 250, 12, LILAC) + sparkle(735, 410, 11, GOLD) + sparkle(848, 380, 15, GOLD) }
    ],
    async run(ctx) {
      ctx.setCurtain(1); V5.tick(ctx);
      ctx.say(this.words, V5.HINT);
      ctx.show('tagCoat'); ctx.hide('coatOn'); ctx.show('coatStand'); ctx.show('dress');
      ctx.pose('tagCoat', { op: 1 });
      ctx.tween(900, p => {
        const e = ctx.ease(p);
        ctx.pose('dress', { dx: 150 * e });
        ctx.pose('coatStand', { dx: -110 * e, dy: -10 * Math.sin(p * Math.PI) - 8 * e });
        ctx.pose('tagCoat', { dx: -110 * e, dy: -8 * e });
      });
      await ctx.wait(960);
    },
    subPresses: [
      async function (ctx) {
        V5.tick(ctx);
        ctx.say('The coat could be a doctor. It could not be her.', V5.HINT);
        const gy = 478, cy = (gy - 440 * 0.75 + gy + 12) / 2;
        ctx.tween(700, p => {
          const e = ctx.ease(p), s = 1 + 0.17 * e;
          ctx.pose('dress', { dx: 150, s, dy: (gy - cy) * (1 - s) });
          ctx.pose('coatStand', { dx: -110, dy: -18 - 6 * Math.sin(p * 9) });
          ctx.pose('tagCoat', { dx: -110, dy: -18 - 6 * Math.sin(p * 9) });
        });
        await ctx.wait(760);
      },
      async function (ctx) {
        V5.tick(ctx);
        ctx.say('The Script ticked it off. Her card kept growing.', V5.HINT);
        ctx.audio('fadeOut', 1500);
        ctx.hide('list'); ctx.show('tick');
        ctx.audio('tagThud');
        ctx.pose('script', { r: 0 });
        ctx.show('pulse'); ctx.pose('pulse', { op: 0 });
        ctx.tween(700, p => {
          ctx.pose('script', { dx: 12 * Math.sin(p * Math.PI), r: -5 * Math.sin(p * Math.PI) });
          ctx.pose('pulse', { op: Math.sin(p * Math.PI), s: 0.9 + 0.2 * p });
        });
        await ctx.wait(760);
      }
    ]
  },

  /* ================= BITCH (P57-P60) ================= */
  {
    title: 'Five Hands · Bitch',
    words: 'Next word: Bitch.',
    clock: V5clock,
    bg: () => bg('speed', W, H, 153, GP.blood, { fx: 400, fy: 300 }) + floor() + V5.scene(1),
    sprites: [
      { id: 'script', ...V5.vb(170, 290, 100, 110), z: 3, boil: 1.4, svg: () => K.villain(170, 290, 0.95, 'shout', 6) },
      { id: 'khushiA', ...V5.kb(400, 478, 0.88), z: 5, boil: 1.4, svg: () => khushi(400, 478, 0.88, 'side fang brow:angry bolt', { outfit: 'witch', arms: 'hip', pierce: ALLP }) },
      { id: 'khushiB', ...V5.kb(400, 478, 0.88), z: 5, boil: 1.8, hidden: true, svg: () => khushi(400, 478, 0.88, 'feral/feral cackle brow:angry bolt', { outfit: 'witch', arms: 'fling', pierce: ALLP }) },
      { id: 'khushiC', ...V5.kb(400, 478, 0.88), z: 5, boil: 1.4, hidden: true, svg: () => khushi(400, 478, 0.88, 'big/big cackle brow:up sparkle', { outfit: 'witch', arms: 'hip', pierce: ALLP }) },
      { id: 'tag', ...V5.vb(400, 300, 110, 100), z: 8, boil: 1, svg: () => K.tag(400, 305, 1.0, -6, 'BITCH') },
      V5.strokeSprite('s2', 2, V5.C.x, V5.C.y, V5.C.s),
      V5.brushSprite(V5.C.x - 30, V5.C.y - 20)
    ],
    async run(ctx) {
      ctx.setCurtain(1); V5.tick(ctx);
      ctx.audio('sneakySnitchBitch');
      ctx.say(this.words, V5.HINT);
      ctx.pose('tag', { dx: -200, dy: -60, r: -300, op: 0 });
      ctx.tween(380, p => {
        const e = ctx.ease(p);
        ctx.pose('tag', { dx: -200 * (1 - e), dy: -60 * (1 - e), r: -300 * (1 - e), op: Math.min(1, p * 4) });
        ctx.pose('script', { dx: 14 * Math.sin(p * Math.PI) });
      });
      await ctx.wait(420);
      ctx.audio('tagThud');
    },
    subPresses: [
      async function (ctx) {
        V5.tick(ctx);
        ctx.say('"Okay, that\'s too much."', V5.HINT);
        ctx.hide('khushiA'); ctx.show('khushiB');
        ctx.tween(480, p => {
          const e = ctx.ease(p);
          ctx.pose('khushiB', { dx: 10 * Math.sin(p * 18) * (1 - p) });
          ctx.pose('tag', { dx: -60 * e, dy: -20 * Math.sin(p * Math.PI), r: -60 * e });
          ctx.pose('script', { dx: -20 * e, r: -10 * e });
        });
        await ctx.wait(540);
      },
      async function (ctx) {
        V5.tick(ctx);
        ctx.say('Two bold strokes. Red, and not sorry.', V5.HINT);
        await V5.paint(ctx, 's2', { dur: 800, down: true });
      },
      async function (ctx) {
        V5.tick(ctx);
        ctx.say('A loud word for one small part of her.', V5.HINT);
        ctx.hide('khushiB'); ctx.show('khushiC');
        ctx.tween(520, p => {
          const e = ctx.ease(p);
          ctx.pose('tag', { dx: -60 + 40 * e, dy: 120 * e, s: 1 - 0.55 * e, r: -60 + 50 * e });
          ctx.pose('khushiC', { dy: -6 * Math.sin(p * 12) });
        });
        await ctx.wait(600);
        ctx.audio('silence');
      }
    ]
  },

  /* ================= HEALER (P61-P63) ================= */
  {
    title: 'Five Hands · Healer',
    words: 'A kind word came next: Healer.',
    clock: V5clock,
    bg: () => bg('wash', W, H, 154, GP.lilac) + floor() + V5.scene(2),
    sprites: [
      { id: 'ayan', ...V5.vb(190, 336, 130, 160), z: 4, boil: 1, svg: () => nerd(190, 478, 0.75, '^soft smile brow:soft', { arms: 'out', top: ashBanana }) },
      { id: 'khushi', ...V5.kb(420, 478, 0.82), z: 5, boil: 0.9, svg: () => khushi(420, 478, 0.82, 'soft/soft soft brow:soft blush', { outfit: 'witch', arms: 'cards', pierce: ALLP }) },
      { id: 'glow', ...V5.vb(425, 285, 130, 130), z: 6, hidden: true, svg: () => V5.glow('h', 425, 285, 120, '#b9d9a8') },
      { id: 'tag', ...V5.vb(300, 300, 130, 100), z: 8, boil: 0.8, svg: () => K.tag(270, 305, 0.9, -6, 'HEALER') },
      V5.strokeSprite('s3', 3, V5.C.x, V5.C.y, V5.C.s),
      V5.brushSprite(V5.C.x - 30, V5.C.y - 20)
    ],
    async run(ctx) {
      ctx.setCurtain(1); V5.tick(ctx);
      ctx.audio('heartOfNowhereHealer', 'fade2');
      ctx.say(this.words, V5.HINT);
      ctx.pose('tag', { dx: -60, dy: -20, op: 0 });
      ctx.tween(700, p => { const e = ctx.ease(p); ctx.pose('tag', { dx: -60 * (1 - e), dy: -20 * (1 - e), op: Math.min(1, p * 3), r: 4 * Math.sin(p * 6) }); });
      await ctx.wait(760);
    },
    subPresses: [
      async function (ctx) {
        V5.tick(ctx);
        ctx.say('It fits the part that said: Deep breath in. Pause. Don\'t dismiss it.', V5.HINT);
        ctx.show('glow'); ctx.pose('glow', { op: 0 });
        ctx.tween(1500, p => {
          const e = ctx.ease(Math.min(1, p * 1.6));
          ctx.pose('tag', { dx: 150 * e, dy: -14 * e, r: 6 * e });
          ctx.pose('glow', { op: Math.sin(p * Math.PI * 0.9), s: 0.85 + 0.2 * Math.sin(p * Math.PI) });
          const br = 1 + 0.03 * Math.sin(p * Math.PI * 2);
          ctx.pose('khushi', { s: br, dy: (478 - ((478 - 440 * 0.82 + 490) / 2)) * (1 - br) });
        });
        await ctx.wait(1560);
      },
      async function (ctx) {
        V5.tick(ctx);
        ctx.say('One soft stroke, the color of breathing out.', V5.HINT);
        await V5.paint(ctx, 's3', { dur: 1100 });
      }
    ]
  },

  /* ================= SHOULDER TO SHOULDER (P64-P65) ================= */
  {
    title: 'Five Hands · Shoulder to Shoulder',
    words: 'But she never fixed him. They felt it together.',
    clock: V5clock,
    bg: () => bg('wash', W, H, 155, GP.lilac) + `<path d="M0,470 H960 V540 H0Z" fill="#8a7aa8" opacity=".55"/>`,
    sprites: [
      { id: 'khushi', vx: 210, vy: 0, vw: 330, vh: 540, z: 4, boil: 0.9, svg: () => khushi(390, 740, 1.3, 'soft/soft soft brow:soft blush', { outfit: 'witch', arms: 'hip', pierce: ALLP }) },
      { id: 'ayan', vx: 450, vy: 40, vw: 330, vh: 500, z: 5, boil: 0.9, svg: () => nerd(610, 720, 1.05, '^soft smile brow:soft', { arms: 'chest', top: ashBanana }) },
      { id: 'tag', ...V5.vb(480, 270, 130, 150), z: 8, boil: 0.8, svg: () => K.tag(480, 300, 1.0, 0, 'HEALER', 80) }
    ],
    async run(ctx) {
      ctx.setCurtain(1); V5.tick(ctx);
      ctx.say(this.words, V5.HINT);
      ctx.pose('tag', { dx: -60, dy: 180, s: 1.0 });
      ctx.tween(1300, p => {
        const e = ctx.ease(p);
        ctx.pose('tag', { dx: -60 * (1 - e), dy: 180 * (1 - e) - 70 * e, s: 1 - 0.35 * e, r: 8 * Math.sin(p * 5) });
      });
      await ctx.wait(1360);
    },
    subPresses: [
      async function (ctx) {
        V5.tick(ctx);
        ctx.say('A kind label is still a label.', V5.HINT);
        ctx.tween(1600, p => ctx.pose('tag', { dy: -70 + 6 * Math.sin(p * Math.PI * 2), s: 0.65, r: 7 * Math.sin(p * Math.PI * 2) }));
        await ctx.wait(1500);
        ctx.audio('fadeOut');
      }
    ]
  },

  /* ================= WITCH (P66-P68) ================= */
  {
    title: 'Five Hands · Witch',
    words: 'The word Witch came flapping in on bats.',
    clock: V5clock,
    bg: () => bg('stars', W, H, 156, GP.night) + floor() + V5.scene(3) + K.playbill(185, 300, 0.72),
    sprites: [
      { id: 'candle', ...V5.vb(335, 440, 60, 140), z: 4, boil: 1.4, svg: () => K.candle(335, 478, 0.9, 'wild', 50) },
      { id: 'khushi', ...V5.kb(480, 478, 0.85), z: 5, boil: 1.2, svg: () => khushi(480, 478, 0.85, 'cat/cat cackle brow:arch sparkle', { outfit: 'witch', arms: 'conduct', pierce: ALLP }) },
      ...[0, 1, 2, 3, 4].map(i => ({ id: 'bat' + i, ...V5.vb([270, 370, 480, 640, 800][i], [130, 190, 100, 100, 105][i], 90, 70), z: 9, boil: 1.4, hidden: true, svg: () => K.bat([270, 370, 480, 640, 800][i], [130, 190, 100, 100, 105][i], 0.8 + (i % 2) * 0.15, [-10, 12, -6, 10, -14][i]) })),
      { id: 'tag', ...V5.vb(335, 280, 100, 90), z: 8, boil: 0.9, hidden: true, svg: () => K.tag(335, 295, 1.0, 0, 'WITCH', 50) },
      V5.strokeSprite('s4', 4, V5.C.x, V5.C.y, V5.C.s),
      V5.brushSprite(V5.C.x - 30, V5.C.y - 30)
    ],
    async run(ctx) {
      ctx.setCurtain(1); V5.tick(ctx);
      ctx.audio('ghostStoryWitch', 'fade');
      ctx.say(this.words, V5.HINT);
      const sx = [185, 185, 185, 185, 185], sy = [300, 300, 300, 300, 300], ex = [270, 370, 480, 640, 800], ey = [130, 190, 100, 100, 105];
      for (let i = 0; i < 5; i++) {
        const id = 'bat' + i;
        ctx.show(id); ctx.pose(id, { dx: sx[i] - ex[i], dy: sy[i] - ey[i], s: 0.4, op: 0 });
        setTimeout(() => ctx.tween(620, p => {
          const e = ctx.ease(p);
          ctx.pose(id, { dx: (sx[i] - ex[i]) * (1 - e), dy: (sy[i] - ey[i]) * (1 - e), s: 0.4 + 0.6 * e, op: Math.min(1, p * 4), sy: Math.abs(Math.cos(p * 18)) * 0.6 + 0.5, sx: 1.0001 });
        }), i * 120);
      }
      await ctx.wait(700);
      ctx.show('tag'); ctx.pose('tag', { dx: -200, dy: 40, r: -720, s: 0.3, op: 0 });
      ctx.tween(700, p => {
        const e = ctx.ease(p);
        ctx.pose('tag', { dx: -200 * (1 - e), dy: 40 * (1 - e), r: -720 * (1 - e), s: 0.3 + 0.7 * e, op: Math.min(1, p * 3) });
      });
      await ctx.wait(760);
      ctx.audio('tagThud');
    },
    subPresses: [
      async function (ctx) {
        V5.tick(ctx);
        ctx.say('It fits the part that said: "I\'m unpredictable."', V5.HINT);
        ctx.tween(1800, p => {
          const a = p * Math.PI * 6;
          ctx.pose('tag', { sx: Math.max(0.08, Math.abs(Math.cos(a))), sy: 1, r: 6 * Math.sin(a * 0.5) });
          ctx.pose('khushi', { dy: -5 * Math.abs(Math.sin(p * 14)) });
          for (let i = 0; i < 5; i++) ctx.pose('bat' + i, { sy: Math.abs(Math.cos(p * 22 + i)) * 0.6 + 0.5, dy: 14 * Math.sin(p * 9 + i), sx: 1.0001 });
        });
        await ctx.wait(1860);
        ctx.pose('tag', { sx: 1.0001 });
      },
      async function (ctx) {
        V5.tick(ctx);
        ctx.say('One wild violet stroke for her hair.', V5.HINT);
        await V5.paint(ctx, 's4', { dur: 1000 });
      }
    ]
  },

  /* ================= THE READING GLASS (P69-P70) ================= */
  {
    title: 'Five Hands · Reading Glass',
    words: 'The Script tried to read her. The page kept changing.',
    clock: V5clock,
    bg: () => bg('stars', W, H, 157, GP.night) + floor(),
    sprites: [
      { id: 'script', ...V5.vb(200, 330, 110, 130), z: 3, boil: 1, svg: () => K.villain(200, 330, 0.95, 'prim', 4) },
      {
        id: 'page', ...V5.vb(620, 295, 190, 200), z: 2, boil: 0.5,
        svg: () => `<path d="${wob(rectPts(450, 110, 340, 370, 24), 1.4, true)}" fill="#fbf6ea" stroke="${INK}" stroke-width="4" filter="url(#wob)"/>${bars(472, 138, 296, 2, 16, 5).replaceAll(INK, '#b9a9a0')}${bars(472, 430, 296, 2, 16, 5).replaceAll(INK, '#b9a9a0')}`
      },
      { id: 'silA', ...V5.vb(620, 300, 160, 190), z: 3, boil: 1.2, svg: () => V5.sil(620, 465, 0.72, 'cat/cat cackle', { outfit: 'witch', arms: 'conduct' }) },
      { id: 'silB', ...V5.vb(620, 300, 160, 190), z: 3, boil: 1.2, hidden: true, svg: () => V5.sil(620, 465, 0.72, 'cat/cat cackle', { outfit: 'coat', arms: 'fling' }) },
      { id: 'silC', ...V5.vb(620, 300, 160, 190), z: 3, boil: 1.2, hidden: true, svg: () => V5.sil(620, 465, 0.72, 'cat/cat cackle', { outfit: 'witch', arms: 'bow', hat: false }) },
      { id: 'glass', ...V5.vb(420, 300, 190, 170), z: 7, boil: 0.8, svg: () => V5.glass(380, 270, 1.1, -8) },
      { id: 'glassB', ...V5.vb(560, 300, 190, 170), z: 7, boil: 0.8, hidden: true, svg: () => V5.glass(560, 290, 1.1, -8, true) },
      ...[0, 1, 2, 3, 4, 5].map(i => ({ id: 'bat' + i, ...V5.vb(560, 290, 90, 80), z: 9, boil: 1.4, hidden: true, svg: () => K.bat(560, 290, 0.9 + (i % 2) * 0.2, [-20, 10, 30, -30, 0, 20][i]) })),
      { id: 'title', vx: 80, vy: 100, vw: 800, vh: 140, z: 10, hidden: true, boil: 0.5, svg: () => V5.title() }
    ],
    async run(ctx) {
      ctx.setCurtain(1); V5.tick(ctx);
      ctx.say(this.words, V5.HINT); // ghost-story-witch keeps playing
      ctx.pose('glass', { dx: 0, dy: 0 });
      ctx.tween(2400, p => {
        const e = ctx.ease(Math.min(1, p * 1.5));
        ctx.pose('glass', { dx: 180 * e, dy: -10 * e + 8 * Math.sin(p * 10), r: -2 * Math.sin(p * 8) });
        ctx.pose('script', { dx: 40 * e });
        const f = Math.floor(p * 9) % 3;
        ['silA', 'silB', 'silC'].forEach((id, i) => ctx.pose(id, { op: f === i ? 1 : 0 }));
      });
      await ctx.wait(2460);
    },
    subPresses: [
      async function (ctx) {
        V5.tick(ctx);
        ctx.say('That is why she is the witch who would not be read.', V5.HINT);
        ctx.hide('glass'); ctx.show('glassB');
        ctx.pose('glassB', { dx: -180 + 180, dy: 0 });
        await ctx.wait(350);
        ctx.audio('gong');
        ctx.hide('glassB');
        const tx = [-250, -150, 40, 180, 270, 330], ty = [-180, -120, -190, -130, -60, 20];
        for (let i = 0; i < 6; i++) {
          const id = 'bat' + i;
          ctx.show(id); ctx.pose(id, { op: 0, s: 0.4 });
          ctx.tween(1100, p => {
            const e = ctx.ease(p);
            ctx.pose(id, { dx: tx[i] * e, dy: ty[i] * e + 10 * Math.sin(p * 12), s: 0.4 + 0.7 * e, op: Math.min(1, p * 4) * (1 - Math.max(0, p - 0.7) / 0.3), sy: Math.abs(Math.cos(p * 20 + i)) * 0.6 + 0.5, sx: 1.0001 });
          });
        }
        ctx.show('title'); ctx.pose('title', { clip: 'inset(0 100% 0 0)', op: 1 });
        ctx.tween(800, p => ctx.pose('title', { clip: `inset(0 ${(100 * (1 - ctx.ease(p))).toFixed(1)}% 0 0)` }));
        await ctx.wait(2100);
        ctx.tween(500, p => ctx.pose('title', { op: 1 - p }));
        await ctx.wait(520);
      }
    ]
  },

  /* ================= ARTIST (P71-P74) ================= */
  {
    title: 'Five Hands · Artist',
    words: 'The last word was the only one she chose: Artist.',
    clock: V5clock,
    bg: () => bg('glow', W, H, 158, GP.candle),
    sprites: [
      { id: 'head', ...V5.vb(290, 270, 200, 200), z: 4, boil: 1, svg: () => khead(290, 290, 1.7, 'soft/soft soft brow:arch', { pierce: ALLP }) },
      { id: 'cardA', ...V5.cardBox(800, 300, 1.0), z: 5, boil: 0.5, svg: () => V5.card(800, 300, 1.0, 4) },
      { id: 'cardFinal', ...V5.cardBox(480, 290, 1.45), z: 6, boil: 0.5, hidden: true, svg: () => V5.card(480, 290, 1.45, 5) },
      { id: 'tag', ...V5.vb(560, 290, 130, 110), z: 8, boil: 0.8, svg: () => K.tag(560, 300, 1.7, -4, 'ARTIST', 60) },
      { id: 'hand', ...V5.vb(450, 400, 110, 120), z: 9, boil: 1, svg: () => V5.hand(480, 410, 1.5, 55, KSKIN) },
      V5.strokeSprite('s5', 5, 640, 300, 1.35, 7),
      V5.brushSprite(560, 300)
    ],
    async run(ctx) {
      ctx.setCurtain(1); V5.tick(ctx);
      ctx.audio('carefreeArtist');
      ctx.say(this.words, V5.HINT);
      ctx.pose('hand', { dx: -100, dy: 160, op: 0 });
      ctx.tween(1100, p => {
        const e = ctx.ease(p);
        ctx.pose('hand', { dx: -100 * (1 - e), dy: 160 * (1 - e) - 60 * e, op: Math.min(1, p * 3), r: 55 * 0 });
      });
      await ctx.wait(1160);
      ctx.audio('tagThud');
      ctx.tween(500, p => {
        const e = ctx.ease(p);
        ctx.pose('hand', { dx: -80 * e, dy: -60 - 20 * e });
        ctx.pose('tag', { dx: -80 * e, dy: -80 * e, r: -10 * e });
      });
      await ctx.wait(560);
    },
    subPresses: [
      async function (ctx) {
        V5.tick(ctx);
        ctx.say('It fits. She was painting her own card right then.', V5.HINT);
        ctx.tween(500, p => {
          const e = ctx.ease(p);
          ctx.pose('cardA', { dx: -160 * e, s: 1 + 0.35 * e });
          ctx.pose('tag', { dx: -80 - 230 * e, dy: -80 - 120 * e, s: 1 - 0.45 * e, r: -10 - 8 * e });
          ctx.pose('hand', { dx: -80 - 230 * e, dy: -80 - 150 * e, op: 1 - e });
        });
        await ctx.wait(560);
        ctx.show('brush'); ctx.pose('brush', { op: 1 });
        ctx.tween(2300, p => {
          const a = p * Math.PI * 4;
          ctx.pose('brush', { dx: 40 * Math.sin(a) - 20, dy: 50 * Math.sin(a * 1.5) + 20, r: 22 * Math.sin(a * 1.2) });
          ctx.pose('head', { dy: -4 * Math.sin(a) });
        });
        await ctx.wait(2360);
      },
      async function (ctx) {
        V5.tick(ctx);
        ctx.say('The last stroke was her eyes.', V5.HINT);
        ctx.audio('fadeOut', 1000);
        ctx.show('s5'); ctx.pose('s5', { clip: 'inset(0 100% 0 0)' });
        ctx.show('brush');
        ctx.audio('brushStroke');
        ctx.tween(1300, p => {
          const e = ctx.ease(p);
          ctx.pose('s5', { clip: `inset(0 ${(100 * (1 - e)).toFixed(1)}% 0 0)` });
          ctx.pose('brush', { dx: -50 + 110 * e, dy: 25 + 8 * Math.sin(p * 14) - 25 * e, r: 8 * Math.sin(p * 9) });
        });
        await ctx.wait(1360);
        ctx.tween(300, p => ctx.pose('brush', { op: 1 - p }));
        await ctx.wait(1000);
      },
      async function (ctx) {
        V5.tick(ctx);
        ctx.say('She turned it round. No label. Just her.', V5.HINT);
        ctx.show('cardFinal'); ctx.pose('cardFinal', { sx: 0.001, op: 1 });
        ctx.tween(450, p => {
          const e = ctx.ease(p);
          ctx.pose('cardA', { sx: Math.max(0.001, 1 - e) });
          ctx.pose('s5', { sx: Math.max(0.001, 1 - e) });
          ctx.pose('head', { dx: -140 * e, op: 1 - e });
          ctx.pose('tag', { op: 1 - e });
        });
        await ctx.wait(480);
        ctx.hide('cardA'); ctx.hide('s5');
        ctx.tween(500, p => ctx.pose('cardFinal', { sx: Math.max(0.001, ctx.ease(p)) }));
        await ctx.wait(560);
        ctx.tween(1800, p => ctx.pose('cardFinal', { s: 1 + 0.03 * Math.sin(p * Math.PI) }));
        await ctx.wait(1000);
      }
    ]
  },

  /* ================= FIVE PAPER HANDS (P75-P78) ================= */
  (() => {
    const CX = 480, CY = 320, HS = 1.1, ARM = 320;
    const H5 = [
      { k: 'doc', t: 'DOCTOR', x: 170, y: 350, f: 0.5 },
      { k: 'bit', t: 'BITCH', x: 270, y: 170, f: 0.38 },
      { k: 'hea', t: 'HEALER', x: 480, y: 110, f: 0.12 },
      { k: 'wit', t: 'WITCH', x: 690, y: 170, f: 0.38 },
      { k: 'art', t: 'ARTIST', x: 790, y: 350, f: 0.5 }
    ].map(h => {
      const dx = CX - h.x, dy = CY - h.y, d = Math.hypot(dx, dy);
      const ux = dx / d, uy = dy / d, tl = ARM * HS + 70;
      const x0 = Math.min(h.x, h.x - ux * tl) - 90, x1 = Math.max(h.x, h.x - ux * tl) + 90;
      const y0 = Math.min(h.y, h.y - uy * tl) - 90, y1 = Math.max(h.y, h.y - uy * tl) + 90;
      return { ...h, ux, uy, d, r: Math.atan2(dx, -dy) * 180 / Math.PI, box: V5.vb((x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2) };
    });
    const sprites = [
      { id: 'khushiA', ...V5.kb(400, 478, 0.82), z: 5, boil: 1.1, svg: () => khushi(400, 478, 0.82, 'wink/soft smirk brow:arch', { outfit: 'witch', arms: 'hip', pierce: ALLP }) },
      { id: 'khushiB', ...V5.kb(480, 478, 0.82), z: 5, boil: 1.1, hidden: true, svg: () => khushi(480, 478, 0.82, 'soft/soft soft brow:soft sparkle', { outfit: 'witch', arms: 'conduct', pierce: ALLP }) },
      { id: 'cardHeld', ...V5.cardBox(400, 385, 0.5), z: 6, boil: 0.6, svg: () => V5.card(400, 385, 0.5, 5, -5) }
    ];
    H5.forEach(h => {
      const ang = h.r;
      const pcx = h.x - 26 * HS * Math.sin(ang * Math.PI / 180), pcy = h.y + 26 * HS * Math.cos(ang * Math.PI / 180);
      sprites.push({ id: 'h_' + h.k, ...h.box, z: 3, boil: 1, hidden: true, svg: () => V5.hand(h.x, h.y, HS, ang, '#fbf6ea', ARM) });
      sprites.push({ id: 't_' + h.k, ...V5.vb(pcx, pcy, 90, 80), z: 8, boil: 0.9, hidden: true, svg: () => K.tag(pcx, pcy + 8, 0.72, 0, h.t, 30) });
    });
    return {
      title: 'Five Hands · The Five Hands',
      words: 'Five hands. Five words. Every one of them true.',
      clock: V5clock,
      bg: () => bg('wash', W, H, 159, GP.bone) + floor(),
      sprites,
      async run(ctx) {
        ctx.setCurtain(1); V5.tick(ctx);
        ctx.audio('ossuaryAirSuspended', 'fade');
        ctx.say(this.words, V5.HINT);
        H5.forEach((h, i) => {
          setTimeout(() => {
            ctx.show('h_' + h.k); ctx.show('t_' + h.k);
            ctx.tween(800, p => {
              const e = ctx.ease(p), off = 300 * (1 - e);
              ctx.pose('h_' + h.k, { dx: -h.ux * off, dy: -h.uy * off });
              ctx.pose('t_' + h.k, { dx: -h.ux * off, dy: -h.uy * off });
            });
          }, i * 260);
        });
        await ctx.wait(1100 + 4 * 260 + 100);
      },
      subPresses: [
        async function (ctx) {
          V5.tick(ctx);
          ctx.say('Each one fit a part of her. None fit all of her.', V5.HINT);
          ctx.tween(1500, p => {
            const e = ctx.ease(p);
            ctx.pose('khushiA', { dx: 80 * e });
            ctx.pose('cardHeld', { dx: 80 * e });
            H5.forEach(h => {
              const k = h.f * h.d * e + 3 * Math.sin(p * 30) * (p > 0.85 ? 1 : 0);
              ctx.pose('h_' + h.k, { dx: h.ux * k, dy: h.uy * k });
              ctx.pose('t_' + h.k, { dx: h.ux * k, dy: h.uy * k });
            });
          });
          await ctx.wait(1560);
        },
        async function (ctx) {
          V5.tick(ctx);
          ctx.say('', '');
          await ctx.holdTableau(2800);
        },
        async function (ctx) {
          V5.tick(ctx);
          ctx.say('So she let them go.', 'press space for midnight');
          ctx.hide('khushiA'); ctx.show('khushiB');
          ctx.pose('khushiB', { op: 1 });
          ctx.tween(2200, p => {
            const e = ctx.ease(p);
            ctx.pose('cardHeld', { dx: 80, dy: -8 * e, r: -3 * e });
            H5.forEach((h, i) => {
              const k0 = h.f * h.d;
              const open = Math.min(1, p * 2);
              ctx.pose('h_' + h.k, { dx: h.ux * k0 - h.ux * 120 * open, dy: h.uy * k0 - h.uy * 120 * open, r: (h.ux < 0 ? 1 : -1) * 30 * open, op: 1 - Math.max(0, p - 0.7) / 0.3 });
              const q = Math.min(1, Math.max(0, p * 1.15 - 0.12));
              ctx.pose('t_' + h.k, {
                dx: h.ux * k0 + 34 * Math.sin(q * 7 + i),
                dy: h.uy * k0 + (500 - h.y) * q * q,
                r: (i % 2 ? 1 : -1) * 90 * q + 25 * Math.sin(q * 9),
                op: 1 - Math.max(0, q - 0.8) / 0.2
              });
            });
          });
          await ctx.wait(2300);
          ctx.audio('fadeOut');
        }
      ]
    };
  })()
];
