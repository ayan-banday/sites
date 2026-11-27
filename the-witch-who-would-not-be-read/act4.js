/* act4 (v2): shots 16 to 18, P42-P50 (tarot, the Script fails at the tower, one minute to midnight). */
const a4h = P => (P <= 47 ? 11 + (P - 3) / 44 * 0.97 : 11.98);
const a4px = v => v * ((document.getElementById('stageWrap') || { clientWidth: 960 }).clientWidth / 960);
const a4plaque = (x, y, text) => `<g transform="translate(${x} ${y})" filter="url(#wob)"><path d="${wob(rectPts(-110, -26, 220, 52, 14), 1.2, true)}" fill="${INK}" stroke="${GOLD}" stroke-width="4"/><path d="${wob(rectPts(-102, -19, 204, 38, 14), .8, true)}" fill="none" stroke="${GOLD}" stroke-width="1.6"/>${K.word(0, 10, 28, text, CREAM, 0, 'middle', 'normal')}</g>`;
/* the tower on the card: a stranger's tower in Ayan's future, one door */
const a4Tower = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#wob)"><path d="M-17,0 L-14,-62 L-20,-62 L-20,-76 L-12,-76 L-12,-68 L-5,-68 L-5,-76 L5,-76 L5,-68 L12,-68 L12,-76 L20,-76 L20,-62 L14,-62 L17,0Z" fill="${LILAC}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M-15,-20 h30 M-14,-38 h28 M-14,-52 h28" stroke="${INK}" stroke-width="1" opacity=".5"/><path d="M-7,0 L-7,-20 Q0,-30 7,-20 L7,0Z" fill="${INK}"/><circle cx="3.5" cy="-10" r="1.6" fill="${GOLD}"/><rect x="-3" y="-50" width="6" height="9" fill="${GOLD}" stroke="${INK}" stroke-width="1.4"/></g>`;
const a4Sun = (x, y) => { let r = ''; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; r += `<path d="M${x + Math.cos(a) * 12},${y + Math.sin(a) * 12} L${x + Math.cos(a) * 18},${y + Math.sin(a) * 18}" stroke="${AMBER}" stroke-width="2.4" stroke-linecap="round"/>`; } return r + `<circle cx="${x}" cy="${y}" r="9" fill="${GOLD}" stroke="${INK}" stroke-width="1.8"/>`; };
const a4Stamp = (x, y, s, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" filter="url(#wob)"><path d="M-8,-70 L8,-70 L6,-40 L-6,-40Z" fill="#6b3f2a" stroke="${INK}" stroke-width="2.4"/><ellipse cx="0" cy="-74" rx="16" ry="10" fill="#6b3f2a" stroke="${INK}" stroke-width="2.4"/><path d="${wob(rectPts(-60, -40, 120, 34, 14), 1, true)}" fill="${PINK}" stroke="${INK}" stroke-width="2.8"/><path d="${wob(rectPts(-56, -6, 112, 12, 14), .8, true)}" fill="${INK}"/>${K.word(0, -16, 22, 'FOREVER', CREAM, 0, 'middle', 'normal')}</g>`;
const a4FoolCard = (x, y, s, r, withTower) => K.bigcard(x, y, s, r, '0', 'THE FOOL', a4Sun(-52, -64) + (withTower ? a4Tower(30, -12, 1) : ''));
const a4CardText = (lines, y0) => `<g transform="translate(500 285) scale(1.3)">` + lines.map((t, i) => K.word(0, y0 + i * 14.5, 12.5, t, INK)).join('') + `</g>`;

(window.SHOTS_BY_ACT = window.SHOTS_BY_ACT || {}).act4 = [
  /* ==================== SHOT 16: THE CARD (P42-P44) ==================== */
  {
    n: 16,
    title: 'Act IV · The Tarot',
    words: "ACT IV. Khushi reads tarot. Once, she wrote Ayan a card about his future.",
    clock: { x: 150, y: 120, s: 0.46, h: a4h(42) },
    bg: () => bg('halftone', W, H, 116, GP.candle, { fx: 500, fy: 290 }),
    sprites: [
      {
        id: 'khushi', vx: 120, vy: 150, vw: 240, vh: 320, z: 6, boil: 1.0,
        svg: () => khushi(235, 575, 0.95, 'soft smirk brow:arch', { outfit: 'witch', arms: 'cards', pierce: ALLP })
      },
      {
        id: 'ayan', vx: 630, vy: 180, vw: 220, vh: 300, z: 6, boil: 1.1,
        svg: () => nerd(740, 585, 0.9, 'dot flat brow:worry', { arms: 'out', flip: true, top: ashBanana })
      },
      {
        id: 'table', vx: 60, vy: 330, vw: 840, vh: 210, z: 9, boil: 0.4,
        svg: () => `<path d="${wob(rectPts(60, 458, 840, 90, 28), 1.4, true)}" fill="${PLUM}" stroke="${INK}" stroke-width="3" filter="url(#wob)"/><path d="M60,458 H900" stroke="${GOLD}" stroke-width="5"/><path d="M60,490 H900" stroke="${GOLD}" stroke-width="1.6" opacity=".6"/>` + K.candle(350, 462, 0.8, 'calm')
      },
      { id: 'plaque', vx: 630, vy: 108, vw: 220, vh: 60, z: 10, boil: 0.5, hidden: true, svg: () => a4plaque(740, 138, 'ACT IV') },
      { id: 'cardBack', vx: 380, vy: 105, vw: 240, vh: 360, z: 8, boil: 0.5, hidden: true, svg: () => K.card(500, 285, 2.93, 0, 'back') },
      { id: 'foolCard', vx: 380, vy: 105, vw: 240, vh: 360, z: 8, boil: 0.5, hidden: true, svg: () => a4FoolCard(500, 285, 1.3, 0, false) },
      { id: 'tower', vx: 505, vy: 160, vw: 70, vh: 120, z: 9, boil: 0.7, hidden: true, svg: () => `<g transform="translate(500 285) scale(1.3)">${a4Tower(30, -12, 1)}</g>` },
      { id: 't1', vx: 380, vy: 105, vw: 240, vh: 360, z: 9, boil: 0.4, hidden: true, svg: () => a4CardText(['The one meant for you', 'will not come easily.'], 6) },
      { id: 't2', vx: 380, vy: 105, vw: 240, vh: 360, z: 9, boil: 0.4, hidden: true, svg: () => a4CardText(['She is a locked tower.', 'Only the one who stops', 'thinking finds the door.'], 38) }
    ],
    async run(ctx) {
      // P42: intertitle; Khushi deals, the card flips to THE FOOL (0)
      ctx.setCurtain(1);
      ctx.audio('dreamyTarot', 'fade');
      ctx.say(this.words, 'press space');
      ctx.show('plaque');
      ctx.pose('plaque', { s: 0.4 });
      ctx.tween(300, p => ctx.pose('plaque', { s: 0.4 + 0.6 * ctx.ease(p) }));
      await ctx.wait(600);
      ctx.show('cardBack');
      ctx.pose('cardBack', { dx: a4px(-250), dy: a4px(60), s: 0.3, r: -40 });
      ctx.tween(420, p => {
        const e = ctx.ease(p);
        ctx.pose('cardBack', { dx: a4px(-250) * (1 - e), dy: a4px(60) * (1 - e), s: 0.3 + 0.7 * e, r: -40 * (1 - e) });
      });
      await ctx.wait(560);
      ctx.pose('foolCard', { sx: 0.02, sy: 1 });
      ctx.tween(240, p => ctx.pose('cardBack', { sx: Math.max(0.02, 1 - ctx.ease(p)), sy: 1 }));
      await ctx.wait(250);
      ctx.hide('cardBack');
      ctx.show('foolCard');
      ctx.tween(260, p => ctx.pose('foolCard', { sx: Math.max(0.02, ctx.ease(p)), sy: 1 }));
      await ctx.wait(280);
    },
    subPresses: [
      // P43: line 1 appears on the card
      async function (ctx) {
        ctx.setClockTime(a4h(43));
        ctx.say("The one meant for you will not come easily.", 'press space');
        ctx.hide('plaque');
        ctx.audio('gong');
        ctx.show('t1');
        ctx.pose('t1', { op: 0 });
        ctx.tween(500, p => ctx.pose('t1', { op: ctx.ease(p) }));
        await ctx.wait(600);
      },
      // P44: line 2 and the tower
      async function (ctx) {
        ctx.setClockTime(a4h(44));
        ctx.say("She is a locked tower. Only the one who stops thinking finds the door.", 'press space to continue');
        ctx.show('tower');
        ctx.pose('tower', { s: 0.3 });
        ctx.tween(420, p => ctx.pose('tower', { s: 0.3 + 0.7 * ctx.ease(p) }));
        await ctx.wait(450);
        ctx.show('t2');
        ctx.pose('t2', { op: 0 });
        ctx.tween(500, p => ctx.pose('t2', { op: ctx.ease(p) }));
        await ctx.wait(560);
      }
    ]
  },

  /* ==================== SHOT 17: THE SCRIPT AND THE TOWER (P45-P47) ==================== */
  {
    n: 17,
    title: 'The Script Cannot Open the Door',
    words: "The Script grabbed the card. It writes everyone's part, so it wanted his love story too.",
    clock: { x: 150, y: 120, s: 0.46, h: a4h(45) },
    bg: () => bg('screentone', W, H, 117, GP.night, { fx: 480, fy: 300, spot: '#3b2a55' }) + floor(490),
    sprites: [
      {
        id: 'khushi', vx: 115, vy: 170, vw: 200, vh: 340, z: 6, boil: 1.0,
        svg: () => khushi(215, 500, 0.75, 'lidded/lidded flat brow:arch', { outfit: 'witch', arms: 'cards', pierce: ALLP })
      },
      {
        id: 'ayan', vx: 705, vy: 190, vw: 150, vh: 320, z: 6, boil: 1.1,
        svg: () => nerd(790, 505, 0.7, 'dot O sweat brow:worry', { arms: 'out', flip: true, top: ashBanana })
      },
      {
        id: 'villain', vx: 340, vy: 285, vw: 200, vh: 200, z: 7, boil: 1.1,
        svg: () => K.villain(430, 385, 0.95, 'prim', 0)
      },
      {
        id: 'card', vx: 480, vy: 190, vw: 190, vh: 260, z: 8, boil: 0.6,
        svg: () => a4FoolCard(575, 320, 0.8, -4, true)
      },
      {
        id: 'lens', vx: 515, vy: 90, vw: 130, vh: 170, z: 9, boil: 0.8, hidden: true,
        svg: () => `<path d="M566,202 L598,252 M594,202 L602,252" stroke="${INK}" stroke-width="1.8" stroke-dasharray="4 4"/><circle cx="580" cy="150" r="56" fill="#fbf6ea" stroke="${GOLD}" stroke-width="5" filter="url(#wob)"/>` +
          a4Tower(580, 192, 1.2) + `<path d="M556,118 q4,-9 8,0 q4,9 8,0 q4,-9 8,0 q4,9 8,0" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
      },
      {
        id: 'steam', vx: 350, vy: 215, vw: 150, vh: 80, z: 9, boil: 1.8, hidden: true,
        svg: () => [[395, 272, 14], [430, 255, 17], [465, 274, 14]].map(([x, y, r]) => `<path d="${blob(x, y, r, r * 0.7, 10, .2)}" fill="${CREAM}" stroke="${INK}" stroke-width="2" filter="url(#wob)"/>`).join('') +
          `<path d="M410,238 q-6,-14 4,-24 M446,236 q6,-12 -2,-22" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>`
      },
      { id: 'stamp', vx: 240, vy: 380, vw: 190, vh: 115, z: 8, boil: 0.5, hidden: true, svg: () => a4Stamp(320, 470, 0.75, 0) }
    ],
    async run(ctx) {
      // P45: the Script snatches the card, pen out
      ctx.setCurtain(1);
      ctx.audio('fadeOut', 1000); // the tarot colour fades out
      ctx.say(this.words, 'press space');
      ctx.pose('card', { dx: a4px(140), dy: a4px(5), r: 14 });
      await ctx.wait(350);
      ctx.tween(450, p => {
        const e = ctx.ease(p);
        ctx.pose('card', { dx: a4px(140) * (1 - e), dy: a4px(5) * (1 - e), r: 14 * (1 - e) });
        ctx.pose('villain', { dx: a4px(40) * Math.sin(e * Math.PI) });
      });
      await ctx.wait(500);
      ctx.show('lens');
      ctx.pose('lens', { s: 0.3 });
      ctx.tween(380, p => ctx.pose('lens', { s: 0.3 + 0.7 * ctx.ease(p) }));
      ctx.tween(500, p => ctx.pose('villain', { r: 3 * Math.sin(p * Math.PI * 6) }));
      await ctx.wait(560);
    },
    subPresses: [
      // P46: it pulls at the tower door, steams with thinking, the door stays shut
      async function (ctx) {
        ctx.setClockTime(a4h(46));
        ctx.say("It pulled at the tower door. A script is all thinking. The door stayed shut.", 'press space');
        ctx.show('steam');
        ctx.pose('steam', { dy: a4px(10), op: 0 });
        ctx.tween(1100, p => {
          ctx.pose('steam', { dy: a4px(10) - a4px(22) * ctx.ease(p), op: Math.min(1, p * 4), s: 1 + 0.18 * Math.sin(p * Math.PI * 4) });
          ctx.pose('lens', { r: 5 * Math.sin(p * Math.PI * 10), dx: a4px(3) * Math.sin(p * Math.PI * 14) });
          ctx.pose('villain', { dx: a4px(-8) * Math.abs(Math.sin(p * Math.PI * 5)), r: -3 * Math.sin(p * Math.PI * 5) });
          ctx.pose('card', { dx: a4px(2) * Math.sin(p * Math.PI * 12) });
        });
        await ctx.wait(1200);
      },
      // P47: it flings the card back to Ayan and rolls the stamp up to Khushi
      async function (ctx) {
        ctx.setClockTime(a4h(47));
        ctx.say("It threw the card back and rolled its stamp up to Khushi.", 'press space to continue');
        ctx.audio('waltz');
        ctx.hide('lens');
        ctx.hide('steam');
        ctx.tween(420, p => {
          const e = ctx.ease(p);
          ctx.pose('card', { dx: a4px(140) * e, dy: a4px(5) * e - a4px(60) * Math.sin(p * Math.PI), r: 360 * e });
        });
        await ctx.wait(450);
        ctx.pose('card', { r: 10 });
        ctx.show('stamp');
        ctx.pose('stamp', { dx: a4px(130), r: 60 });
        ctx.tween(650, p => {
          const e = ctx.ease(p);
          ctx.pose('stamp', { dx: a4px(130) * (1 - e) - a4px(30) * e, r: 60 * (1 - e) - 10 * Math.sin(p * Math.PI * 3) });
        });
        await ctx.wait(700);
      }
    ]
  },

  /* ==================== SHOT 18: ONE MINUTE TO MIDNIGHT (P48-P50) ==================== */
  {
    n: 18,
    title: 'One Minute to Midnight',
    words: "11:59. The stamp hung over her. One minute to FOREVER.",
    clock: { hide: true },
    bg: () => bg('screentone', W, H, 118, GP.night, { fx: 330, fy: 270, spot: '#3b2a55' }) + floor(500),
    sprites: [
      {
        id: 'bigClock', vx: 70, vy: 100, vw: 400, vh: 400, z: 4, boil: 0.5,
        svg: () => K.clockDial(270, 300, 2.0)
      },
      {
        id: 'bigHour', vx: 70, vy: 100, vw: 400, vh: 400, z: 5,
        svg: () => `<g transform="translate(270 300) scale(2)"><path d="M0,0 L-2,-30" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><circle r="5" fill="${INK}"/></g>`
      },
      {
        id: 'bigMin', vx: 70, vy: 100, vw: 400, vh: 400, z: 6,
        svg: () => `<g transform="translate(270 300) scale(2)"><path d="M0,0 L0,-52" stroke="${PINK}" stroke-width="4" stroke-linecap="round"/><circle r="5" fill="${INK}"/></g>`
      },
      {
        id: 'khushi', vx: 555, vy: 150, vw: 200, vh: 390, z: 6, boil: 0.9,
        svg: () => khushi(650, 535, 0.85, 'lidded/lidded flat brow:arch', { outfit: 'witch', arms: 'hip', pierce: ALLP })
      },
      {
        id: 'khushiCards', vx: 555, vy: 150, vw: 200, vh: 390, z: 6, boil: 0.9, hidden: true,
        svg: () => khushi(650, 535, 0.85, 'lidded/lidded flat brow:arch', { outfit: 'witch', arms: 'cards', pierce: ALLP })
      },
      {
        id: 'khushiBrush', vx: 555, vy: 150, vw: 260, vh: 390, z: 6, boil: 0.9, hidden: true,
        svg: () => khushi(650, 535, 0.85, 'lidded/lidded smirk brow:arch', { outfit: 'witch', arms: 'brush', pierce: ALLP, hold: K.brush(124, -322, 1.05, 16) })
      },
      {
        id: 'blankGlow', vx: 500, vy: 240, vw: 200, vh: 220, z: 7, boil: 0.9, hidden: true,
        svg: () => `<circle cx="600" cy="350" r="85" fill="url(#candleG)"/>` + K.card(600, 350, 1.25, -8, 'blank')
      },
      {
        id: 'stamp', vx: 580, vy: 70, vw: 140, vh: 100, z: 8, boil: 0.5, origin: '50% 0%',
        svg: () => a4Stamp(650, 138, 0.65, 0)
      }
    ],
    async run(ctx) {
      // P48: the low point. Music cut, the stamp hangs, one tick runs too long.
      ctx.setCurtain(1);
      ctx.audio('silence');
      ctx.say(this.words, 'press space');
      ctx.pose('bigMin', { r: -6 });
      ctx.pose('stamp', { dy: a4px(-40) });
      ctx.tween(800, p => ctx.pose('stamp', { dy: a4px(-40) * (1 - ctx.ease(p)) }));
      ctx.tween(3200, p => {
        const s = 1 + 0.07 * p;
        ['bigClock', 'bigHour', 'bigMin'].forEach(id => ctx.pose(id, { s }));
      });
      await ctx.wait(500);
      ctx.audio('longTick');
      ctx.tween(1500, p => ctx.pose('bigMin', { r: -6 - 10 * ctx.ease(Math.min(1, p / 0.8)) + (p > 0.8 ? 10 * ctx.ease((p - 0.8) / 0.2) : 0) }));
      await ctx.wait(1600);
      ctx.tween(1400, p => ctx.pose('stamp', { r: 2.5 * Math.sin(p * Math.PI * 2) }));
      await ctx.wait(1000);
    },
    subPresses: [
      // P49: still silent. She pulls out the blank card. Still blank.
      async function (ctx) {
        ctx.say("She took out her blank card. Still blank.", 'press space');
        ctx.hide('khushi');
        ctx.show('khushiCards');
        ctx.show('blankGlow');
        ctx.pose('blankGlow', { dy: a4px(40), op: 0 });
        ctx.tween(700, p => ctx.pose('blankGlow', { dy: a4px(40) * (1 - ctx.ease(p)), op: ctx.ease(p) }));
        ctx.tween(500, p => ctx.pose('bigMin', { r: -6 + 2.5 * Math.sin(p * Math.PI * 3) }));
        await ctx.wait(1700);
      },
      // P50: she takes up her brush; the first chord
      async function (ctx) {
        ctx.say("They had words for her. She had a brush.", 'press space to continue');
        ctx.hide('khushiCards');
        ctx.show('khushiBrush');
        ctx.pose('khushiBrush', { dy: a4px(6) });
        ctx.tween(400, p => ctx.pose('khushiBrush', { dy: a4px(6) * (1 - ctx.ease(p)) }));
        ctx.audio('brushChord', 0);
        ctx.tween(500, p => ctx.pose('bigMin', { r: -6 + 2.5 * Math.sin(p * Math.PI * 3) }));
        await ctx.wait(900);
      }
    ]
  }
];
