/* act5: add shots to this array. n is renumbered automatically. */
(window.SHOTS_BY_ACT = window.SHOTS_BY_ACT || {}).act5 = [
  /* ==================== 10 · SHE PAINTS HER OWN ==================== */
  {
    n: 10,
    title: 'She Paints Her Own',
    words: "So she painted the blank card herself. Press space for each brushstroke.",
    clock: { x: 900, y: 92, s: 0.36, h: 11.984 },
    bg: () => bg('pencil', W, H, 110, GP.bone) +
      `<path d="${wob(rectPts(110, 26, 740, 500, 30), 1.6, true)}" fill="${PLUM}" stroke="${INK}" stroke-width="4" filter="url(#wob)"/><rect x="132" y="48" width="696" height="456" rx="10" fill="none" stroke="${GOLD}" stroke-width="4"/>`,
    sprites: [
      {
        id: 'stroke1', vx: 135, vy: 120, vw: 700, vh: 340, z: 5, boil: 0.5, hidden: true,
        svg: () => `<g filter="url(#wob)" fill="none" stroke-linecap="round"><rect x="150" y="130" width="670" height="320" stroke="none"/><path d="M180,420 C300,240 420,460 560,300 S760,160 800,250" stroke="${CORAL}" stroke-width="34"/></g>`
      },
      {
        id: 'stroke2', vx: 165, vy: 65, vw: 410, vh: 175, z: 6, boil: 0.5, hidden: true,
        svg: () => `<g filter="url(#wob)" fill="none" stroke-linecap="round"><rect x="180" y="70" width="360" height="165" stroke="none"/><path d="M200,140 C320,90 380,200 520,150" stroke="${LILAC}" stroke-width="24"/></g>`
      },
      {
        id: 'stroke3', vx: 560, vy: 330, vw: 220, vh: 140, z: 6, boil: 0.5, hidden: true,
        svg: () => `<g filter="url(#wob)" fill="none" stroke-linecap="round"><rect x="575" y="335" width="190" height="130" stroke="none"/><path d="M600,420 q60,-80 140,-40" stroke="${GOLD}" stroke-width="16"/></g>`
      },
      {
        id: 'stroke4', vx: 375, vy: 185, vw: 210, vh: 130, z: 7, boil: 0.8, hidden: true,
        svg: () => `<g filter="url(#wob)"><rect x="385" y="190" width="190" height="120" fill="none"/><circle cx="430" cy="250" r="34" fill="none" stroke="#fff" stroke-width="12"/><circle cx="530" cy="250" r="34" fill="none" stroke="#fff" stroke-width="12" stroke-dasharray="120 300"/></g>`
      },
      {
        id: 'stroke5', vx: 590, vy: 310, vw: 100, vh: 100, z: 8, boil: 0.9, hidden: true,
        svg: () => sparkle(640, 360, 26, GOLD) + sparkle(615, 335, 14, CORAL)
      },
      {
        id: 'inkDrip1', vx: 90, vy: 20, vw: 60, vh: 120, z: 9, hidden: true,
        svg: () => `<path d="M110,26 v60 q6,20 0,40" stroke="${INK}" stroke-width="12" stroke-linecap="round" filter="url(#wob)"/>`
      },
      {
        id: 'inkDrip2', vx: 160, vy: 20, vw: 60, vh: 90, z: 9, hidden: true,
        svg: () => `<path d="M180,26 v30 q5,14 0,26" stroke="${INK}" stroke-width="12" stroke-linecap="round" filter="url(#wob)"/>`
      },
      {
        id: 'inkDrip3', vx: 230, vy: 20, vw: 60, vh: 100, z: 9, hidden: true,
        svg: () => `<path d="M250,26 v80" stroke="${INK}" stroke-width="12" stroke-linecap="round" filter="url(#wob)"/>`
      },
      {
        id: 'brush', vx: 560, vy: 180, vw: 260, vh: 370, z: 10, boil: 0.8,
        svg: () => K.brush(760, 640, 3.3, -38)
      }
    ],
    async run(ctx) {
      ctx.setCurtain(1);
      ctx.audio('silence');
      ctx.say(this.words, 'press space · brushstroke 1 of 5');
    },
    subPresses: [0, 1, 2, 3, 4].map(i => async function (ctx) {
      const sid = 'stroke' + (i + 1);
      ctx.audio('brushChord', i);
      ctx.setClockTime(11.986 + i * 0.003);
      ctx.show(sid);
      ctx.pose(sid, { clip: 'inset(0 100% 0 0)' });
      ctx.tween(320, p => {
        const e = ctx.ease(p);
        ctx.pose(sid, { clip: `inset(0 ${(100 * (1 - e)).toFixed(1)}% 0 0)` });
        ctx.pose('brush', { dx: -140 * Math.sin(p * Math.PI), dy: -60 * Math.sin(p * Math.PI * 2), r: -14 * Math.sin(p * Math.PI) });
      });
      if (i < 3) {
        const did = 'inkDrip' + (i + 1);
        ctx.show(did);
        ctx.pose(did, { dy: -20 });
        ctx.tween(300, p => ctx.pose(did, { dy: -20 * (1 - ctx.ease(p)) }));
      }
      await ctx.wait(340);
      if (i < 4) {
        ctx.say(this.words, `press space · brushstroke ${i + 2} of 5`);
      } else {
        ctx.say(this.words, 'press space for midnight');
      }
    })
  }
];
