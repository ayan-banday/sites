/* act2: add shots to this array. n is renumbered automatically. */
(window.SHOTS_BY_ACT = window.SHOTS_BY_ACT || {}).act2 = [
  /* ==================== 4 · ACT II: THE COAT COMES OFF ==================== */
  {
    n: 4,
    title: 'Act II · The Coat Comes Off',
    words: "ACT II. She threw off the white coat. The Script yelled \"Slower!\", so she went faster.",
    clock: { x: 80, y: 80, s: 0.48, h: 11.67 },
    bg: () => bg('burst', W, H, 104, GP.night, { fx: 390, fy: 300 }) + speedTo(560, 330, 700, 300, 4),
    sprites: [
      {
        id: 'coat', vx: 430, vy: 80, vw: 260, vh: 300, z: 4, boil: 1.0,
        svg: () => `<g transform="translate(560 220) rotate(12) scale(.85) translate(0 210)"><use href="#k-coat"/></g>`
      },
      {
        id: 'khushiBase', vx: 90, vy: 20, vw: 600, vh: 540, z: 6, boil: 1.5,
        svg: () => khead(390, 300, 1.9, 'cat fang brow:angry', { wild: true, hat: false, pierce: ['earL'] })
      },
      {
        id: 'khushiEpic', vx: 90, vy: 20, vw: 600, vh: 540, z: 7, boil: 1.8, hidden: true,
        svg: () => khead(390, 300, 1.9, 'cat cackle brow:angry sparkle bolt', { wild: true, hat: true, pierce: ['earL'] })
      },
      {
        id: 'villainShout', vx: 680, vy: 295, vw: 255, vh: 220, z: 8, boil: 1.2, hidden: true,
        svg: () => K.villain(860, 450, 0.55, 'shout', -12) +
          `<path d="${blob(760, 370, 66, 32, 18, .05)}" fill="#fffaf0" stroke="${INK}" stroke-width="2.4" filter="url(#wob)"/>` +
          K.word(760, 378, 24, 'Slower!')
      }
    ],
    async run(ctx) {
      ctx.setCurtain(1);
      ctx.say('', '');
      ctx.audio('bach');
      ctx.tween(620, p => {
        const e = ctx.ease(p);
        ctx.pose('coat', { dx: 210 * e, dy: -20 * Math.sin(p * Math.PI) + 55 * e, r: 34 * e, op: 1 - 0.15 * e });
      });
      await ctx.wait(480);
      ctx.hide('khushiBase');
      ctx.show('khushiEpic');
      ctx.show('villainShout');
      ctx.tween(300, p => ctx.pose('villainShout', { s: 0.7 + 0.3 * ctx.ease(p) }));
      await ctx.wait(320);
      ctx.say(this.words, 'tableau · hold...');
      // 2-second frozen tableau
      await ctx.holdTableau(2000);
      ctx.say(this.words, 'press space to continue');
    }
  },

  /* ==================== 5 · THE PARLOUR OF SMALL HOLES ==================== */
  {
    n: 5,
    title: 'The Parlour of Small Holes',
    words: "She got five new piercings and didn't flinch once. The needle fainted.",
    clock: { x: 80, y: 80, s: 0.48, h: 11.75 },
    bg: () => bg('embers', W, H, 105, GP.candle) + K.cobweb(0, 0, 1.2) + K.jars(770, 250, 1) + K.candle(880, 470, 1, 'calm'),
    sprites: [
      {
        id: 'khushiCalm', vx: 210, vy: 50, vw: 340, vh: 490, z: 5, boil: 1.0,
        svg: () => khushi(380, 890, 1.62, 'lidded/lidded smirk brow:arch', { outfit: 'witch', arms: 'face', pierce: [] })
      },
      {
        id: 'khushiEpic', vx: 210, vy: 50, vw: 340, vh: 490, z: 5, boil: 1.1, hidden: true,
        svg: () => khushi(380, 890, 1.62, 'cat smirk brow:arch sparkle', { outfit: 'witch', arms: 'face', pierce: [] })
      },
      {
        id: 'p1', vx: 295, vy: 300, vw: 60, vh: 70, z: 7, boil: 0.6, hidden: true,
        svg: () => `<g transform="translate(380 890) scale(1.62)">${PIERCE.earL}</g>` + sparkle(318, 334, 11, GOLD)
      },
      {
        id: 'p2', vx: 420, vy: 295, vw: 60, vh: 80, z: 7, boil: 0.6, hidden: true,
        svg: () => `<g transform="translate(380 890) scale(1.62)">${PIERCE.earR}</g>` + sparkle(448, 326, 11, GOLD)
      },
      {
        id: 'p3', vx: 365, vy: 335, vw: 50, vh: 50, z: 7, boil: 0.6, hidden: true,
        svg: () => `<g transform="translate(380 890) scale(1.62)">${PIERCE.nose}</g>` + sparkle(392, 358, 9, GOLD)
      },
      {
        id: 'p4', vx: 355, vy: 345, vw: 50, vh: 50, z: 7, boil: 0.6, hidden: true,
        svg: () => `<g transform="translate(380 890) scale(1.62)">${PIERCE.septum}</g>` + sparkle(380, 368, 9, GOLD)
      },
      {
        id: 'p5', vx: 385, vy: 265, vw: 70, vh: 60, z: 7, boil: 0.6, hidden: true,
        svg: () => `<g transform="translate(380 890) scale(1.62)">${PIERCE.brow}</g>` + sparkle(420, 290, 12, GOLD)
      },
      {
        id: 'needleSweat', vx: 495, vy: 130, vw: 210, vh: 310, z: 8, boil: 2.2,
        svg: () => K.needle(600, 300, 1.3, 28, 'sweat')
      },
      {
        id: 'needleFaint', vx: 560, vy: 330, vw: 230, vh: 180, z: 8, boil: 0.5, hidden: true,
        svg: () => K.needle(680, 430, 0.95, 92, 'faint')
      }
    ],
    async run(ctx) {
      ctx.setCurtain(1);
      ctx.audio('danse');
      ctx.say(this.words, 'press space · piercing 1 of 5');
    },
    subPresses: [0, 1, 2, 3, 4].map(i => async function (ctx) {
      const pid = 'p' + (i + 1);
      ctx.audio('ting', i);
      ctx.setClockTime(11.765 + i * 0.015);
      ctx.show(pid);
      ctx.pose(pid, { s: 1.45 });
      ctx.tween(260, p => ctx.pose(pid, { s: 1.45 - 0.45 * ctx.ease(p) }));
      ctx.tween(220, p => ctx.pose('needleSweat', { dx: 18 * Math.sin(p * Math.PI * 3), r: 8 * Math.sin(p * Math.PI * 2) }));
      if (i < 4) {
        ctx.say(this.words, `press space · piercing ${i + 2} of 5`);
      } else {
        ctx.hide('khushiCalm');
        ctx.show('khushiEpic');
        await ctx.wait(160);
        ctx.audio('slideWhistle');
        ctx.tween(420, p => {
          const e = ctx.ease(p);
          ctx.pose('needleSweat', { dx: 140 * e, dy: 140 * e, r: 64 * e, op: 1 - e });
        });
        await ctx.wait(320);
        ctx.hide('needleSweat');
        ctx.show('needleFaint');
        ctx.tween(280, p => ctx.pose('needleFaint', { dy: -16 * (1 - ctx.ease(p)) }));
        await ctx.wait(280);
        ctx.say(this.words, 'press space to continue');
      }
    })
  }
];
