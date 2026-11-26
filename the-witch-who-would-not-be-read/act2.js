/* act2 (v2): shots 7 to 9, P17-P26. n is renumbered automatically.
   Clock: h = 11 + (P-3)/44 * 0.97 */
const a2h = P => 11 + (P - 3) / 44 * 0.97;
const a2px = v => v * ((document.getElementById('stageWrap') || { clientWidth: 960 }).clientWidth / 960);
const a2plaque = (x, y, text) => `<g transform="translate(${x} ${y})" filter="url(#wob)"><path d="${wob(rectPts(-110, -26, 220, 52, 14), 1.2, true)}" fill="${INK}" stroke="${GOLD}" stroke-width="4"/><path d="${wob(rectPts(-102, -19, 204, 38, 14), .8, true)}" fill="none" stroke="${GOLD}" stroke-width="1.6"/>${K.word(0, 10, 28, text, CREAM, 0, 'middle', 'normal')}</g>`;
const a2pile = () => {
  const L = [[300, 150, -14, 'GOOD GIRL'], [352, 138, 9, 'NORMAL'], [330, 188, -6, 'QUIET'], [275, 205, 12, 'SENSIBLE'], [385, 195, -10, 'EASY TO READ'], [318, 118, 4, 'NORMAL'], [262, 160, 18, 'QUIET'], [372, 160, 20, 'SENSIBLE']];
  return L.map(([x, y, r, t]) => K.tag(x, y, 0.72, r, t, 22)).join('');
};

(window.SHOTS_BY_ACT = window.SHOTS_BY_ACT || {}).act2 = [
  /* ==================== SHOT 7: THE FLING (P17-P19) ==================== */
  {
    n: 7,
    title: 'The Fling',
    words: "\"Okay, that's too much.\"",
    clock: { x: 150, y: 120, s: 0.46, h: a2h(17) },
    bg: () => bg('speed', W, H, 107, GP.blood, { fx: 520, fy: 300 }) + floor(480) + speedTo(420, 250, 700, 300, 4),
    sprites: [
      {
        id: 'khushiBuried', vx: 190, vy: 100, vw: 280, vh: 410, z: 6, boil: 0.9,
        svg: () => khushi(330, 495, 0.85, 'lidded/lidded flat brow:arch', { outfit: 'coat', arms: 'hip', pierce: ['earL'] })
      },
      {
        id: 'khushiFling', vx: 190, vy: 100, vw: 280, vh: 410, z: 6, boil: 1.4, hidden: true,
        svg: () => khushi(330, 495, 0.85, 'cat fang brow:angry', { outfit: 'coat', arms: 'fling', pierce: ['earL'] })
      },
      {
        id: 'pile', vx: 230, vy: 90, vw: 200, vh: 160, z: 8, boil: 0.8, hidden: true,
        svg: () => a2pile()
      },
      {
        id: 'villain', vx: 630, vy: 290, vw: 220, vh: 215, z: 5, boil: 1.0,
        svg: () => K.villain(730, 395, 0.9, 'prim', -4)
      },
      {
        id: 'villainShock', vx: 630, vy: 290, vw: 220, vh: 215, z: 5, boil: 1.6, hidden: true,
        svg: () => K.villain(730, 395, 0.9, 'shock', -4)
      },
      { id: 'tagFlung', vx: 230, vy: 90, vw: 200, vh: 140, z: 9, boil: 0.5, hidden: true, svg: () => K.tag(330, 150, 0.85, -8, 'GOOD GIRL', 22) },
      {
        id: 'burst', vx: 680, vy: 300, vw: 140, vh: 110, z: 10, boil: 0.6, hidden: true,
        svg: () => sparkle(745, 352, 30, GOLD) + sparkle(715, 325, 14, CREAM) + sparkle(782, 335, 12, '#f6e7c4') + sparkle(770, 380, 10, GOLD)
      },
      {
        id: 'monocle', vx: 700, vy: 320, vw: 90, vh: 80, z: 10, boil: 0.4, hidden: true,
        svg: () => `<circle cx="745" cy="355" r="13" fill="none" stroke="${GOLD}" stroke-width="3"/><path d="M757,361 q6,12 2,22" stroke="${GOLD}" stroke-width="1.6" fill="none"/>`
      },
      { id: 'pr1', vx: 520, vy: 340, vw: 200, vh: 130, z: 7, boil: 0.5, hidden: true, svg: () => K.tag(610, 420, 0.7, 10, 'QUIET', 20) },
      { id: 'pr2', vx: 520, vy: 340, vw: 200, vh: 130, z: 7, boil: 0.5, hidden: true, svg: () => K.tag(610, 420, 0.7, -8, 'NORMAL', 20) },
      { id: 'pr3', vx: 520, vy: 340, vw: 200, vh: 130, z: 7, boil: 0.5, hidden: true, svg: () => K.tag(610, 420, 0.7, 6, 'SENSIBLE', 20) }
    ],
    async run(ctx) {
      // P17: the pile lands, music stops dead
      ctx.setCurtain(1);
      ctx.audio('silence');
      ctx.say(this.words, 'press space · she fights back');
      ctx.show('pile');
      ctx.pose('pile', { dy: a2px(-150), op: 1 });
      ctx.tween(420, p => {
        const e = ctx.ease(p);
        ctx.pose('pile', { dy: a2px(-150) * (1 - e) });
        ctx.pose('khushiBuried', { sy: 1 - 0.04 * e });
      });
      await ctx.wait(460);
      ctx.pose('khushiBuried', { sy: 0.96 });
    },
    subPresses: [
      // P18: she flings GOOD GIRL, it hits the monocle
      async function (ctx) {
        ctx.setClockTime(a2h(18));
        ctx.say("She flung the first label right back.", 'press space');
        ctx.hide('khushiBuried');
        ctx.show('khushiFling');
        ctx.pose('khushiFling', { sy: 1 });
        ctx.show('tagFlung');
        ctx.tween(420, p => {
          const e = ctx.ease(p);
          ctx.pose('tagFlung', { dx: a2px(415) * e, dy: a2px(215) * e - a2px(90) * Math.sin(p * Math.PI), r: 540 * e, s: 1 - 0.15 * e });
        });
        await ctx.wait(430);
        ctx.hide('tagFlung');
        ctx.audio('flingHit');
        ctx.hide('villain');
        ctx.show('villainShock');
        ctx.show('burst');
        ctx.pose('burst', { s: 1.5 });
        ctx.tween(260, p => ctx.pose('burst', { s: 1.5 - 0.5 * ctx.ease(p) }));
        ctx.show('monocle');
        ctx.tween(520, p => {
          const e = ctx.ease(p);
          ctx.pose('monocle', { dx: a2px(40) * e, dy: a2px(-70) * Math.sin(p * Math.PI) + a2px(70) * e, r: 360 * e });
        });
        ctx.tween(380, p => {
          const e = ctx.ease(p);
          ctx.pose('villainShock', { dx: a2px(30) * Math.sin(e * Math.PI), r: -26 * Math.sin(e * Math.PI) });
        });
        await ctx.wait(560);
        ctx.hide('burst');
      },
      // P19: the Script picks itself up and prints again
      async function (ctx) {
        ctx.setClockTime(a2h(19));
        ctx.say("The Script picked itself up and kept printing.", 'press space to continue');
        ctx.audio('waltz');
        ctx.tween(300, p => ctx.pose('villainShock', { dy: a2px(-16) * Math.sin(p * Math.PI) }));
        await ctx.wait(320);
        ctx.hide('villainShock');
        ctx.show('villain');
        ctx.pose('villain', { r: 5 });
        ['pr1', 'pr2', 'pr3'].forEach((id, i) => {
          setTimeout(() => {
            ctx.show(id);
            ctx.tween(520, p => {
              const e = ctx.ease(p);
              ctx.pose(id, { dx: a2px(110) + a2px(-190 - i * 50) * e, dy: a2px(-20) * Math.sin(p * Math.PI) + a2px(20) * e, r: -140 * e + 20 * i, op: 1 });
            });
          }, i * 240);
        });
        await ctx.wait(760);
      }
    ]
  },

  /* ==================== SHOT 8: THE COAT COMES OFF (P20-P21) ==================== */
  {
    n: 8,
    title: 'The Coat Comes Off',
    words: "ACT II. THE COAT COMES OFF.",
    clock: { x: 150, y: 120, s: 0.46, h: a2h(20) },
    bg: () => bg('burst', W, H, 108, GP.night, { fx: 420, fy: 280 }) + speedTo(150, 200, 330, 230, 4) + speedTo(700, 440, 860, 420, 3),
    sprites: [
      {
        id: 'kCoat', vx: 220, vy: 90, vw: 400, vh: 450, z: 6, boil: 1.0,
        svg: () => khushi(420, 640, 1.3, 'lidded/lidded flat brow:arch', { outfit: 'coat', arms: 'hip', pierce: ['earL'] })
      },
      {
        id: 'kFree', vx: 220, vy: 90, vw: 400, vh: 450, z: 6, boil: 1.8, hidden: true,
        svg: () => khushi(420, 640, 1.3, 'cat fang brow:angry', { outfit: 'witch', arms: 'fling', wild: true, hat: false, pierce: ['earL'] })
      },
      {
        id: 'kEpic', vx: 220, vy: 90, vw: 400, vh: 450, z: 6, boil: 2.2, hidden: true,
        svg: () => khushi(420, 640, 1.3, 'cat cackle brow:angry sparkle bolt', { outfit: 'witch', arms: 'fling', wild: true, hat: true, pierce: ['earL'] })
      },
      {
        id: 'coatFly', vx: 220, vy: 90, vw: 400, vh: 450, z: 8, boil: 0.8, hidden: true,
        svg: () => `<g transform="translate(420 640) scale(1.3)"><use href="#k-coat"/></g>`
      },
      {
        id: 'hairWhip', vx: 220, vy: 60, vw: 400, vh: 200, z: 9, boil: 1.4, hidden: true,
        svg: () => thick('M372,160 C320,150 300,110 250,120', 9, HAIR) + thick('M468,160 C520,150 548,108 590,124', 9, HAIR) +
          thick('M380,140 C340,112 330,80 290,76', 7, HAIR) + thick('M458,140 C500,112 520,82 560,80', 7, HAIR)
      },
      { id: 'plaque', vx: 580, vy: 100, vw: 280, vh: 72, z: 10, boil: 0.5, svg: () => a2plaque(720, 136, 'ACT II') },
      {
        id: 'villainShout', vx: 600, vy: 270, vw: 250, vh: 235, z: 8, boil: 1.2, hidden: true,
        svg: () => K.villain(770, 440, 0.62, 'shout', -10) +
          `<path d="${blob(690, 330, 74, 34, 18, .05)}" fill="#fffaf0" stroke="${INK}" stroke-width="2.4" filter="url(#wob)"/><path d="M724,356 l22,36 l-38,-22" fill="#fffaf0" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>` +
          K.word(690, 340, 26, 'Slower!')
      }
    ],
    async run(ctx) {
      // P20: intertitle, the coat flies off, hair whips loose
      ctx.setCurtain(1);
      ctx.audio('bach');
      ctx.say(this.words, 'press space');
      ctx.pose('plaque', { s: 0.4 });
      ctx.tween(300, p => ctx.pose('plaque', { s: 0.4 + 0.6 * ctx.ease(p) }));
      await ctx.wait(700);
      ctx.hide('kCoat');
      ctx.show('kFree');
      ctx.show('coatFly');
      ctx.show('hairWhip');
      ctx.tween(600, p => {
        const e = ctx.ease(p);
        ctx.pose('coatFly', { dx: a2px(-300) * e, dy: a2px(-120) * Math.sin(p * Math.PI) - a2px(10) * e, r: -50 * e, op: 1 - 0.6 * e });
        ctx.pose('kFree', { dx: a2px(10) * Math.sin(p * Math.PI * 4) });
        ctx.pose('hairWhip', { r: 6 * Math.sin(p * Math.PI * 5) });
      });
      await ctx.wait(640);
      ctx.hide('coatFly');
    },
    subPresses: [
      // P21: "Slower!" so she goes faster
      async function (ctx) {
        ctx.setClockTime(a2h(21));
        ctx.say("The Script yelled \"Slower!\" So she went faster.", 'press space to continue');
        ctx.hide('plaque');
        ctx.show('villainShout');
        ctx.tween(260, p => ctx.pose('villainShout', { s: 0.7 + 0.3 * ctx.ease(p) }));
        await ctx.wait(300);
        ctx.hide('kFree');
        ctx.show('kEpic');
        ctx.tween(900, p => {
          ctx.pose('kEpic', { dx: a2px(14) * Math.sin(p * Math.PI * 10), r: 3 * Math.sin(p * Math.PI * 12) });
          ctx.pose('hairWhip', { r: 9 * Math.sin(p * Math.PI * 12), s: 1 + 0.08 * Math.sin(p * Math.PI * 6) });
        });
        await ctx.wait(920);
      }
    ]
  },

  /* ==================== SHOT 9: THE PARLOUR OF SMALL HOLES (P22-P26) ==================== */
  {
    n: 9,
    title: 'The Parlour of Small Holes',
    words: "She chose five piercings. One.",
    clock: { x: 150, y: 120, s: 0.46, h: a2h(22) },
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
      ...['earL', 'earR', 'nose', 'septum', 'brow'].map((pk, i) => {
        const sp = [[318, 334, 295, 300, 60, 70], [448, 326, 420, 295, 60, 80], [392, 358, 365, 335, 50, 50], [380, 368, 355, 345, 50, 50], [420, 290, 385, 265, 70, 60]][i];
        return {
          id: 'p' + (i + 1), vx: sp[2], vy: sp[3], vw: sp[4], vh: sp[5], z: 7, boil: 0.6, hidden: true,
          svg: () => `<g transform="translate(380 890) scale(1.62)">${PIERCE[pk]}</g>` + sparkle(sp[0], sp[1], i === 4 ? 12 : 10, GOLD)
        };
      }),
      ...['One', 'Two', 'Three', 'Four', 'Five'].map((t, i) => ({
        id: 'num' + (i + 1), vx: 530, vy: 92, vw: 300, vh: 92, z: 9, boil: 0.5, hidden: true,
        svg: () => K.word(680, 150, 58, t, GOLD)
      })),
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
      // P22: piercing One
      ctx.setCurtain(1);
      ctx.audio('danse');
      ctx.audio('ting', 0);
      ctx.say(this.words, 'press space · piercing 1 of 5');
      this.pierce(ctx, 0);
    },
    pierce(ctx, i) {
      const pid = 'p' + (i + 1);
      if (i > 0) ctx.hide('num' + i);
      ctx.show('num' + (i + 1));
      ctx.pose('num' + (i + 1), { s: 1.35 });
      ctx.tween(240, p => ctx.pose('num' + (i + 1), { s: 1.35 - 0.35 * ctx.ease(p) }));
      ctx.show(pid);
      ctx.pose(pid, { s: 1.45 });
      ctx.tween(260, p => ctx.pose(pid, { s: 1.45 - 0.45 * ctx.ease(p) }));
      ctx.tween(220, p => ctx.pose('needleSweat', { dx: a2px(18 * (i === 3 ? 1.8 : 1)) * Math.sin(p * Math.PI * 3), r: (i === 3 ? 14 : 8) * Math.sin(p * Math.PI * 2) }));
    },
    subPresses: [1, 2, 3, 4].map(i => async function (ctx) {
      // P23 to P26: piercings Two to Five
      const P = 22 + i;
      ctx.setClockTime(a2h(P));
      ctx.audio('ting', i);
      const lines = [null, 'Two.', 'Three.', 'Four. The needle was sweating.', "Five. She didn't flinch. The needle fainted."];
      ctx.say(lines[i], i < 4 ? `press space · piercing ${i + 1} of 5` : 'press space to continue');
      this.pierce(ctx, i);
      if (i === 4) {
        ctx.hide('khushiCalm');
        ctx.show('khushiEpic');
        await ctx.wait(160);
        ctx.audio('silence');
        ctx.audio('slideWhistle');
        ctx.tween(420, p => {
          const e = ctx.ease(p);
          ctx.pose('needleSweat', { dx: a2px(140) * e, dy: a2px(140) * e, r: 64 * e, op: 1 - e });
        });
        await ctx.wait(320);
        ctx.hide('needleSweat');
        ctx.show('needleFaint');
        ctx.tween(280, p => ctx.pose('needleFaint', { dy: a2px(-16) * (1 - ctx.ease(p)) }));
        await ctx.wait(280);
      }
    })
  }
];
