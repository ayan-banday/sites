/* act6-finale (v2): shots 28 and 29, P79 to P85. Helpers use the fin prefix. */
const finK = () => ((document.getElementById('shotHost') || {}).clientWidth || W) / W; // viewBox unit -> screen px
const finAudience = () => [...Array(11)].map((_, i) => `<path d="${blob(20 + i * 90, 556, 40, 34, 14, .08)}" fill="#0b070c"/>`).join('');

/* Her painted card: five stroke groups (hair, face, brows and mouth, cheeks, eyes) in card space. */
const finPortrait = () => `<rect x="-78" y="-88" width="156" height="176" fill="${PLUM}"/>` +
  `<path d="M-46,54 C-72,0 -60,-64 0,-72 C60,-64 72,0 46,54" stroke="#9a6fd0" stroke-width="13" fill="none" stroke-linecap="round"/>` +
  `<path d="M-62,-28 q-12,-10 -8,-26 M62,-28 q12,-10 8,-26 M-26,-76 q-6,-8 -2,-14 M26,-76 q8,-8 4,-14" stroke="#9a6fd0" stroke-width="7" fill="none" stroke-linecap="round"/>` +
  `<path d="${blob(0, 8, 31, 39, 18, .02)}" fill="#e3b08c" stroke="${BONE}" stroke-width="3"/>` +
  `<path d="M-24,-16 L-7,-10 M7,-10 L24,-16" stroke="${PINK}" stroke-width="5" stroke-linecap="round"/>` +
  `<path d="M-11,30 Q2,38 15,26" stroke="${PINK}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
  `<ellipse cx="-21" cy="16" rx="8" ry="5" fill="${CORAL}" opacity=".6"/><ellipse cx="21" cy="16" rx="8" ry="5" fill="${CORAL}" opacity=".6"/>` +
  `<circle cx="-14" cy="-2" r="8" fill="#fff" stroke="${INK}" stroke-width="2.2"/><circle cx="-14" cy="-1" r="3.2" fill="${INK}"/><circle cx="-14" cy="-2" r="11" fill="none" stroke="${CORAL}" stroke-width="2.2"/>` +
  `<circle cx="14" cy="-2" r="8" fill="#fff" stroke="${INK}" stroke-width="2.2"/><circle cx="14" cy="-1" r="3.2" fill="${INK}"/><circle cx="14" cy="-2" r="11" fill="none" stroke="${CORAL}" stroke-width="2.2"/>` +
  `<circle cx="-32" cy="12" r="3" fill="${GOLD}"/><circle cx="32" cy="12" r="3" fill="${GOLD}"/>`;
const finCard = (x, y, s, title = 'KHUSHI') => K.bigcard(x, y, s, 0, 'XXII', title, finPortrait());

/* The Script, optionally mirrored so its pen hand faces left. */
const finScript = (x, y, s, mood, flip) => flip
  ? `<g transform="translate(${x} 0) scale(-1 1) translate(${-x} 0)">${K.villain(x, y, s, mood)}</g>`
  : K.villain(x, y, s, mood);
const finStampWide = () => `<g filter="url(#wob)">` +
  `<path d="M632,284 L508,284 L508,316" stroke="${INK}" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="M632,284 L508,284 L508,316" stroke="#b07a4a" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${wob(rectPts(468, 314, 80, 12, 12), .6, true)}" fill="${GOLD}" stroke="${INK}" stroke-width="2.6"/>` +
  `<path d="${wob(rectPts(476, 326, 64, 52, 16), .8, true)}" fill="${PINK}" stroke="${INK}" stroke-width="2.8"/>` +
  K.word(508, 358, 11, 'FOREVER', BONE, 0, 'middle', 'normal') +
  `<circle cx="632" cy="284" r="9" fill="#fbf6ea" stroke="${INK}" stroke-width="2.4"/></g>`;
const finStampBig = () => `<g filter="url(#wob)">` +
  `<path d="M480,40 L480,224" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M480,40 L480,224" stroke="#b07a4a" stroke-width="14" stroke-linecap="round"/>` +
  `<path d="${wob(rectPts(398, 222, 164, 18, 20), .8, true)}" fill="${GOLD}" stroke="${INK}" stroke-width="3.4"/>` +
  `<path d="${wob(rectPts(410, 240, 140, 84, 20), 1, true)}" fill="${PINK}" stroke="${INK}" stroke-width="3.6"/>` +
  K.word(480, 292, 26, 'FOREVER', BONE, 0, 'middle', 'normal') + `</g>`;
const finBonk = () => [...Array(11)].map((_, i) => { const a = Math.PI * (1.05 + i * 0.09), r1 = 112, r2 = 150 + (i % 2) * 16; return `<path d="M${(480 + Math.cos(a) * r1).toFixed(0)},${(330 + Math.sin(a) * r1 * .6).toFixed(0)} L${(480 + Math.cos(a) * r2).toFixed(0)},${(330 + Math.sin(a) * r2 * .6).toFixed(0)}" stroke="${GOLD}" stroke-width="5" stroke-linecap="round"/>`; }).join('') + sparkle(400, 345, 12, GOLD) + sparkle(570, 350, 10, GOLD);
const finScrap = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#wob)"><path d="${wob(rectPts(-100, -140, 200, 280, 20), 1.2, true)}" fill="${INK}" opacity=".35" transform="translate(5 6)"/><path d="${wob(rectPts(-100, -140, 200, 280, 20), 1.2, true)}" fill="#fbf6ea" stroke="${INK}" stroke-width="3"/>` +
  K.word(0, -100, 24, 'CAST LIST', INK, 0, 'middle', 'normal') + `<path d="M-70,-84 H70" stroke="${INK}" stroke-width="2"/>` +
  K.word(-70, -38, 26, 'KHUSHI', INK, 0, 'start', 'normal') + `<path d="M-70,20 H70" stroke="${INK}" stroke-width="2.6" stroke-dasharray="9 7"/>` +
  bars(-70, 70, 140, 3, 22, 7).replaceAll(INK, '#c9bda4') + `</g>`;
const finConfetti = (seed, n) => { const r = rng(seed), cols = [GOLD, ROSE, LILAC, BONE, MOSS, '#e8dcc3', '#fbf6ea']; let g = ''; for (let i = 0; i < n; i++) g += `<path d="${wob(rectPts(0, 0, 13, 17, 7), 1, true)}" transform="translate(${(110 + r() * 740).toFixed(0)} ${(70 + r() * 440).toFixed(0)}) rotate(${(r() * 360).toFixed(0)})" fill="${cols[i % cols.length]}" stroke="${INK}" stroke-width="1.4"/>`; return g; };
const finEl = id => document.getElementById(id);
const finWide = ['khushiH', 'khushiB', 'scriptBow', 'ayanCheer', 'ayanEat', 'bats', 'needleF', 'conf1', 'conf2', 'conFloor'];
const finClose = ['scriptCU', 'mono', 'cuCard2', 'cuTitle', 'cuScrap', 'cuPlayed'];

(window.SHOTS_BY_ACT = window.SHOTS_BY_ACT || {}).act6 = [
  /* ==================== 28 · MIDNIGHT (P79-P81) ==================== */
  {
    title: 'Midnight',
    words: "Midnight. The Script lifted its stamp.",
    clock: { x: 800, y: 130, s: 0.7, h: 11.98 },
    bg: () => bg('stars', W, H, 128, GP.night) + floor() + K.spot(480, 0, 520, 500) + finAudience(),
    sprites: [
      { id: 'khushiW', vx: 240, vy: 100, vw: 200, vh: 395, z: 6, boil: 0.9,
        svg: () => khushi(330, 478, 0.7, 'lidded/lidded smirk brow:arch sparkle', { outfit: 'witch', arms: 'hip', pierce: ALLP }) },
      { id: 'cardW', vx: 400, vy: 205, vw: 220, vh: 250, z: 5, boil: 0.6, svg: () => finCard(508, 330, 0.8) },
      { id: 'scriptW', vx: 590, vy: 215, vw: 225, vh: 245, z: 6, boil: 0.8, svg: () => finScript(720, 335, 1.15, 'prim', true) },
      { id: 'stampW', vx: 440, vy: 175, vw: 250, vh: 215, z: 8, origin: '76% 50.7%', svg: finStampWide },
      { id: 'cuCard', vx: 340, vy: 60, vw: 280, vh: 440, z: 5, boil: 0.5, hidden: true, svg: () => finCard(480, 285, 1.45) },
      { id: 'cuStamp', vx: 380, vy: 30, vw: 200, vh: 310, z: 8, hidden: true, svg: finStampBig },
      { id: 'cuBonk', vx: 300, vy: 240, vw: 360, vh: 200, z: 9, boil: 1.4, hidden: true, svg: finBonk }
    ],
    async run(ctx) { // P79
      ctx.setCurtain(0.88);
      ctx.hideIris();
      ctx.say(this.words, '');
      ctx.pose('stampW', { r: 8 });
      ctx.audio('eveningMelodramaStamp');
      ctx.audio('bells', '1-6');
      const hand = finEl('cMin');
      ctx.tween(1800, p => { if (hand) hand.setAttribute('transform', `rotate(${(352.8 + (1080 - 352.8) * ctx.ease(p)).toFixed(1)})`); }, () => ctx.setClockTime(12));
      ctx.tween(900, p => ctx.pose('stampW', { r: 8 + 62 * ctx.ease(p) }));
      await ctx.wait(1900);
      ctx.say(this.words, 'press space to continue');
    },
    subPresses: [
      async function (ctx) { // P80, no words, bells 7 to 11
        ctx.say('', '');
        ctx.audio('bells', '7-11');
        ctx.tween(1600, p => ctx.pose('stampW', { r: 70 - 32 * p * p + Math.sin(p * 40) * 1.2 * p }));
        await ctx.wait(1700);
        ctx.say('', 'press space to continue');
      },
      async function (ctx) { // P81, the twelfth bell, hard cut to the close-up
        const k = finK();
        ctx.say("The stamp had nowhere to land. The card was already full.", '');
        ctx.audio('silence');
        ctx.audio('bell12');
        ['khushiW', 'cardW', 'scriptW', 'stampW'].forEach(i => ctx.hide(i));
        ctx.pose('cuCard', { op: 1 });
        ctx.pose('cuStamp', { op: 1, dy: -230 * k, r: 0 });
        await ctx.wait(250);
        ctx.tween(300, p => ctx.pose('cuStamp', { dy: -230 * k * (1 - p * p) }));
        await ctx.wait(310);
        ctx.audio('hit');
        ctx.pose('cuStamp', { dy: 0 });
        ctx.pose('cuBonk', { op: 1 });
        ctx.pose('cuCard', { sy: 0.97 });
        await ctx.wait(160);
        ctx.pose('cuCard', { sy: 1 });
        await ctx.wait(900);
        ctx.tween(650, p => {
          const e = ctx.ease(p);
          ctx.pose('cuStamp', { dy: -225 * k * e, r: 14 * e });
          ctx.pose('cuBonk', { op: 1 - p });
        });
        await ctx.wait(1500);
        ctx.say("The stamp had nowhere to land. The card was already full.", 'press space to continue');
      }
    ]
  },

  /* ==================== 29 · KHUSHI, PLAYED BY KHUSHI (P82-P85) ==================== */
  {
    title: 'Played by Khushi',
    words: "The Script filled in its cast list at last: Khushi, played by Khushi.",
    clock: { x: 800, y: 130, s: 0.7, h: 12.0 },
    bg: () => bg('stars', W, H, 129, GP.night) + floor() + K.spot(480, 0, 560, 500) + finAudience(),
    sprites: [
      /* close-up of the Script (P82) */
      { id: 'scriptCU', vx: 95, vy: 195, vw: 270, vh: 290, z: 6, boil: 0.8,
        svg: () => finScript(215, 340, 1.45, 'shock', false) +
          `<g transform="translate(215 340) scale(1.45)"><circle cx="16" cy="-30" r="13.8" fill="#fbf6ea"/><circle cx="16" cy="-30" r="9" fill="#fff" stroke="${INK}" stroke-width="2.4"/><circle cx="16" cy="-30" r="2" fill="${INK}"/></g>` },
      { id: 'mono', vx: 205, vy: 262, vw: 70, vh: 70, z: 7,
        svg: () => `<circle cx="238.2" cy="296.5" r="17.4" fill="none" stroke="${GOLD}" stroke-width="4"/>` },
      { id: 'cuCard2', vx: 420, vy: 150, vw: 200, vh: 300, z: 5, boil: 0.5, svg: () => finCard(520, 300, 1.0, '') },
      { id: 'cuTitle', vx: 450, vy: 392, vw: 140, vh: 34, z: 6, svg: () => K.word(520, 414, 17, 'KHUSHI', INK, 0, 'middle', 'normal') + sparkle(588, 404, 7, GOLD) },
      { id: 'cuScrap', vx: 640, vy: 190, vw: 210, vh: 280, z: 5, boil: 0.6, svg: () => finScrap(745, 325, 0.85) },
      { id: 'cuPlayed', vx: 650, vy: 296, vw: 190, vh: 44, z: 6, svg: () => K.word(745, 322, 17, 'played by KHUSHI', INK, 0, 'middle', 'italic') },
      /* wide: everyone bows (P83-P84) */
      { id: 'khushiH', vx: 360, vy: 95, vw: 240, vh: 400, z: 6, boil: 0.9, hidden: true,
        svg: () => khushi(480, 478, 0.7, 'lidded/lidded smirk brow:arch sparkle', { outfit: 'witch', arms: 'hip', pierce: ALLP }) },
      { id: 'khushiB', vx: 360, vy: 95, vw: 240, vh: 400, z: 6, boil: 0.9, hidden: true, origin: '50% 95.7%',
        svg: () => khushi(480, 478, 0.7, 'soft/soft smirk brow:arch blush sparkle', { outfit: 'witch', arms: 'bow', pierce: ALLP }) },
      { id: 'scriptBow', vx: 580, vy: 280, vw: 220, vh: 200, z: 6, boil: 0.8, hidden: true, origin: '50% 95%',
        svg: () => finScript(690, 381, 0.95, 'prim', true) },
      { id: 'ayanCheer', vx: 60, vy: 290, vw: 220, vh: 250, z: 7, boil: 0.9, hidden: true,
        svg: () => nerd(170, 575, 0.6, 'closed smile blush', { arms: 'up', top: ASH_WEIRD }) + K.banana(205, 478, 0.6, -20) },
      { id: 'ayanEat', vx: 60, vy: 290, vw: 220, vh: 250, z: 7, boil: 0.9, hidden: true,
        svg: () => nerd(170, 575, 0.6, 'closed smile blush', { arms: 'chest', top: ASH_WEIRD }) + K.banana(186, 402, 0.5, 62) },
      { id: 'bats', vx: 270, vy: 100, vw: 420, vh: 100, z: 5, boil: 1.2, hidden: true,
        svg: () => K.bat(330, 170, 0.7, 30) + K.bat(640, 150, 0.7, -30) },
      { id: 'needleF', vx: 290, vy: 395, vw: 130, vh: 95, z: 5, hidden: true, svg: () => K.needle(350, 470, 0.5, 80, 'faint') },
      { id: 'conf1', vx: 100, vy: 60, vw: 760, vh: 480, z: 9, boil: 1.6, hidden: true, svg: () => finConfetti(7, 30) },
      { id: 'conf2', vx: 100, vy: 60, vw: 760, vh: 480, z: 9, boil: 1.6, hidden: true, svg: () => finConfetti(23, 30) },
      { id: 'conFloor', vx: 100, vy: 470, vw: 760, vh: 60, z: 4, hidden: true,
        svg: () => { const r = rng(5), cols = [GOLD, ROSE, LILAC, BONE, MOSS]; let g = ''; for (let i = 0; i < 22; i++) g += `<path d="${wob(rectPts(0, 0, 13, 9, 6), .8, true)}" transform="translate(${(120 + r() * 720).toFixed(0)} ${(486 + r() * 34).toFixed(0)}) rotate(${(r() * 360).toFixed(0)})" fill="${cols[i % 5]}" stroke="${INK}" stroke-width="1.2"/>`; return g; } },
      /* the last frame (P85) */
      { id: 'cuCardFin', vx: 330, vy: 80, vw: 300, vh: 340, z: 5, boil: 0.5, hidden: true, svg: () => finCard(480, 250, 1.15) }
    ],
    async run(ctx) { // P82
      const k = finK();
      ctx.setCurtain(0.88);
      ctx.hideIris();
      ctx.say(this.words, '');
      ctx.pose('cuTitle', { clip: 'inset(0 100% 0 0)' });
      ctx.pose('cuPlayed', { clip: 'inset(0 100% 0 0)' });
      await ctx.wait(500);
      // the monocle falls and dangles on its chain
      ctx.audio('ting', 2);
      ctx.tween(700, p => {
        const b = p < 0.7 ? ctx.ease(p / 0.7) : 1 + 0.12 * Math.sin((p - 0.7) / 0.3 * Math.PI) * (1 - p);
        ctx.pose('mono', { dx: 20.3 * k * Math.min(1, b), dy: 78.3 * k * b, r: 40 * Math.sin(p * Math.PI * 2) });
      });
      await ctx.wait(1000);
      // it reads her face: the word letters in under the portrait
      ctx.audio('finale');
      ctx.tween(1300, p => ctx.pose('cuTitle', { clip: `inset(0 ${(100 - 100 * p).toFixed(1)}% 0 0)` }));
      await ctx.wait(1700);
      ctx.audio('chime');
      // then its cast list: the blank fills in
      ctx.audio('pencil');
      ctx.tween(1100, p => ctx.pose('cuPlayed', { clip: `inset(0 ${(100 - 100 * p).toFixed(1)}% 0 0)` }));
      await ctx.wait(1500);
      ctx.say(this.words, 'press space to continue');
    },
    async bowWide(ctx) { // P83
      const k = finK();
      ctx.say("Even the Script bowed. Ayan cheered, and finally ate his banana.", '');
      finClose.forEach(i => ctx.hide(i));
      ctx.pose('cuCardFin', { op: 0 });
      ['conf1', 'conf2'].forEach(i => ctx.pose(i, { op: 0, dy: -480 * k }));
      ctx.pose('conFloor', { op: 0 });
      ctx.pose('scriptBow', { op: 1, r: 0 });
      ctx.pose('khushiH', { op: 1 });
      ctx.pose('khushiB', { op: 0, r: 0 });
      ctx.pose('ayanCheer', { op: 1 });
      ctx.pose('ayanEat', { op: 0 });
      ctx.pose('bats', { op: 1 });
      ctx.pose('needleF', { op: 1 });
      ctx.audio('fanfare');
      ctx.tween(2600, p => {
        const b = p < 0.25 ? ctx.ease(p / 0.25) : p < 0.7 ? 1 : 1 - ctx.ease((p - 0.7) / 0.3);
        ctx.pose('scriptBow', { r: -28 * b });
        ctx.pose('bats', { dy: -10 * k * b });
        ctx.pose('ayanCheer', { dy: -6 * k * Math.abs(Math.sin(p * Math.PI * 5)) });
      });
      await ctx.wait(2200);
      ctx.pose('ayanCheer', { op: 0, dy: 0 });
      ctx.pose('ayanEat', { op: 1 });
      ctx.audio('munch');
      await ctx.wait(900);
      ctx.audio('merryGoConfetti', 'cross'); // under the confetti
      ctx.say("Even the Script bowed. Ayan cheered, and finally ate his banana.", 'press space to continue');
    },
    async confettiWide(ctx) { // P84
      const k = finK();
      ctx.say("Happy birthday, Khushi.", '');
      ctx.audio('healingClosing', 'cross2');
      ctx.pose('khushiH', { op: 0 });
      ctx.pose('khushiB', { op: 1, r: 0 });
      ['conf1', 'conf2'].forEach(i => ctx.pose(i, { op: 1, dy: -480 * k }));
      ctx.tween(1400, p => ctx.pose('khushiB', { r: 18 * Math.sin(Math.min(1, p) * Math.PI) }));
      ctx.tween(4600, p => ctx.pose('conf1', { dy: (-480 + 540 * p) * k, r: 4 * p }), () => ctx.pose('conFloor', { op: 1 }));
      ctx.tween(5600, p => ctx.pose('conf2', { dy: (-480 + 540 * p) * k, r: -4 * p }));
      await ctx.wait(2600);
      ctx.say("Happy birthday, Khushi.", 'press space to continue');
    },
    async irisOut(ctx) { // P85
      ctx.say("Nobody else could ever play you.", '');
      finWide.forEach(i => ctx.hide(i));
      ctx.pose('cuCardFin', { op: 1 });
      const clk = finEl('clockLayer'); if (clk) clk.hidden = true;
      ctx.audio('fadeOut', 9000);
      ctx.showIris(480, 250, 620);
      ctx.tween(4500, p => ctx.showIris(480, 250, 620 - 450 * ctx.ease(p)));
      await ctx.wait(4700);
      ctx.audio('credits');
      ctx.say("Nobody else could ever play you.", 'press space to bow again');
    },
    subPresses: [
      function (ctx) { return this.bowWide(ctx); },
      function (ctx) { return this.confettiWide(ctx); },
      function (ctx) { return this.irisOut(ctx); }
    ],
    async replay(ctx) {
      ctx.hideIris();
      ctx.audio('creditsHide');
      const clk = finEl('clockLayer'); if (clk) { clk.hidden = false; ctx.setClockTime(12); }
      ctx.audio('finale');
      await ctx.wait(500);
      await this.bowWide(ctx);
      await ctx.wait(400);
      await this.confettiWide(ctx);
      await ctx.wait(1200);
      await this.irisOut(ctx);
    }
  }
];
