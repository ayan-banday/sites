/* The Witch Who Would Not Be Read — all 12 shots as data.
   On-screen words copied verbatim from story.md.
   Coral (#F58E84) appears ONLY on Khushi's brush and paint. */

const W = 960, H = 540;
const floor = (y = 470) => `<path d="${wob([[0, y], [W, y], [W, H], [0, H]], 2, true)}" fill="#24151f"/><path d="M0,${y + 24} H${W} M0,${y + 52} H${W}" stroke="#140b12" stroke-width="3"/>`;
const ashBanana = `<g transform="translate(-6 -262)">${K.banana(0, 0, .55, -40)}</g>`;
const bubble = (x, y, w, h) => `<path d="${blob(x, y, w, h, 26, .04)}" fill="#fffaf0" stroke="${INK}" stroke-width="2.6" filter="url(#wob)"/><path d="M${x - w * .3},${y + h * .8} l-26,40 l40,-30" fill="#fffaf0" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>` + bars(x - w * .75, y - h * .5, w * 1.5, 6, h * .18, 3.4);
const bolt = (x, y, s, col = GOLD, r = 0) => `<path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M0,0 L-18,40 L4,40 L-12,86 L30,28 L8,28 L22,0Z" fill="${col}" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round" filter="url(#wob)"/>`;
const speedTo = (x1, y1, x2, y2, n = 5) => { let s = ''; for (let i = 0; i < n; i++) { const o = (i - n / 2) * 14; s += `<path d="M${x1},${y1 + o} L${x2},${y2 + o}" stroke="${BONE}" stroke-width="3" stroke-linecap="round" opacity=".7" stroke-dasharray="${30 + i * 6} 14"/>`; } return s; };

const SHOTS = [
  /* ==================== 1 · OVERTURE ==================== */
  {
    n: 1,
    title: 'Overture',
    words: "Tonight's melodrama stars Khushi, who never auditioned. At midnight, someone else's script locks in her part.",
    clock: { x: 870, y: 96, s: 0.55, h: 11.0 },
    bg: () => bg('stars', W, H, 101, GP.night) + K.spot(480, 0, 420, 540) + K.cobweb(0, 0, 0.9),
    sprites: [
      {
        id: 'playbill', vx: 340, vy: 110, vw: 280, vh: 350, z: 4, boil: 0.7,
        svg: () => K.playbill(480, 286, 1.05, true) + K.word(480, 348, 34, 'KHUSHI', GOLD, 0, 'middle', 'normal') + K.word(480, 382, 15, 'who did not audition', BONE)
      }
    ],
    async run(ctx) {
      ctx.setCurtain(0.02);
      ctx.showIris(480, 270, 0);
      ctx.say('', '');
      ctx.audio('overture');
      ctx.tween(1050, p => {
        const e = ctx.ease(p);
        ctx.setCurtain(0.05 + 0.83 * e);
        ctx.showIris(480, 270, 620 * e);
      });
      await ctx.wait(1100);
      ctx.hideIris();
      ctx.say(this.words, 'press space to continue');
    }
  },

  /* ==================== 2 · ACT I: THE SENSIBLE SCRIPT ==================== */
  {
    n: 2,
    title: 'Act I · The Sensible Script',
    words: "ACT I. A prim scroll called the Sensible Script had already written her part: good girl, normal, quiet.",
    clock: { x: 840, y: 130, s: 0.5, h: 11.25 },
    bg: () => bg('wash', W, H, 102, GP.ward) + floor() +
      nerd(880, 478, 0.3, 'dot o', { arms: 'chest', top: ashBanana }),
    sprites: [
      {
        id: 'villain', vx: 560, vy: 90, vw: 210, vh: 220, z: 4, boil: 1.0,
        svg: () => K.villain(660, 200, 0.95, 'prim', -6)
      },
      { id: 'tag1', vx: 230, vy: 10, vw: 200, vh: 145, z: 6, boil: 0.8, hidden: true, svg: () => K.tag(330, 110, 0.85, -8, 'GOOD GIRL') },
      { id: 'tag2', vx: 380, vy: 70, vw: 180, vh: 120, z: 5, boil: 0.8, hidden: true, svg: () => K.tag(470, 140, 0.75, 10, 'NORMAL') },
      { id: 'tag3', vx: 165, vy: 160, vw: 170, vh: 130, z: 5, boil: 0.8, hidden: true, svg: () => K.tag(250, 250, 0.7, 12, 'SENSIBLE') },
      { id: 'tag4', vx: 435, vy: 210, vw: 170, vh: 130, z: 5, boil: 0.8, hidden: true, svg: () => K.tag(520, 300, 0.7, -6, 'QUIET') },
      {
        id: 'khushi', vx: 270, vy: 195, vw: 210, vh: 300, z: 7, boil: 1.1,
        svg: () => khushi(380, 478, 0.62, 'lidded/lidded flat brow:arch', { outfit: 'coat', arms: 'hip', pierce: ['earL'] })
      },
      {
        id: 'blankCard', vx: 315, vy: 285, vw: 85, vh: 105, z: 8, boil: 0.6,
        svg: () => K.card(356, 332, 0.42, -14, 'blank')
      }
    ],
    async run(ctx) {
      ctx.setCurtain(1);
      ctx.say('', '');
      ctx.audio('waltz');
      const tags = ['tag1', 'tag2', 'tag3', 'tag4'];
      tags.forEach((id, i) => {
        ctx.pose(id, { dy: -160, op: 0 });
        setTimeout(() => {
          ctx.tween(420, p => ctx.pose(id, { dy: -160 * (1 - ctx.ease(p)), op: Math.min(1, p * 2.5) }));
        }, i * 190);
      });
      await ctx.wait(420);
      // She pockets the blank card
      ctx.tween(520, p => {
        const e = ctx.ease(p);
        ctx.pose('blankCard', { dx: 36 * e, dy: 44 * e, r: 12 * e, s: 1 - 0.35 * e, op: 1 - e * 0.85 });
      });
      await ctx.wait(580);
      ctx.hide('blankCard');
      ctx.say(this.words, 'press space to continue');
    }
  },

  /* ==================== 3 · THE FLING ==================== */
  {
    n: 3,
    title: 'The Fling',
    words: "Okay, that's too much.",
    clock: { x: 70, y: 80, s: 0.48, h: 11.5 },
    bg: () => bg('speed', W, H, 103, GP.blood, { fx: 640, fy: 210 }) + speedTo(420, 200, 720, 190) +
      nerd(870, 545, 0.4, 'side o', { arms: 'chest', top: ashBanana }),
    sprites: [
      {
        id: 'khushi', vx: 110, vy: 150, vw: 420, vh: 410, z: 7, boil: 1.4,
        svg: () => khushi(320, 745, 1.25, 'side fang brow:angry bolt', { outfit: 'coat', arms: 'fling', pierce: ['earL'] })
      },
      {
        id: 'villainPrim', vx: 640, vy: 165, vw: 245, vh: 260, z: 5, boil: 0.9,
        svg: () => K.villain(765, 300, 1.05, 'prim', -4)
      },
      {
        id: 'villainShock', vx: 640, vy: 165, vw: 245, vh: 260, z: 5, boil: 1.6, hidden: true,
        svg: () => K.villain(765, 300, 1.05, 'shock', 14)
      },
      {
        id: 'flingTag', vx: 370, vy: 110, vw: 200, vh: 140, z: 8, boil: 1.0,
        svg: () => K.tag(470, 180, 1.15, -12, 'GOOD GIRL', 0)
      }
    ],
    async run(ctx) {
      ctx.setCurtain(1);
      ctx.say('', '');
      // Brief pause of the prim waltz, then she flings it and stops the music dead!
      await ctx.wait(320);
      ctx.audio('flingHit');
      ctx.tween(380, p => {
        const e = ctx.ease(p);
        ctx.pose('flingTag', { dx: 210 * e, dy: -20 * Math.sin(p * Math.PI), r: 40 * e, s: 1 + 0.08 * e });
        ctx.pose('khushi', { dx: 14 * Math.sin(p * Math.PI) });
      });
      await ctx.wait(220);
      ctx.hide('villainPrim');
      ctx.show('villainShock');
      ctx.tween(450, p => {
        const e = ctx.ease(p);
        ctx.pose('villainShock', { dx: 48 * e, dy: 28 * e, r: 16 * e });
        ctx.pose('flingTag', { dx: 210 + 50 * e, dy: 40 * e, r: 40 + 25 * e, op: 1 - e * 0.25 });
      });
      // Beat of dead silence before her line lands
      await ctx.wait(550);
      ctx.say(this.words, 'press space to continue');
    }
  },

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
        id: 'khushiBase', vx: 170, vy: 60, vw: 440, vh: 420, z: 6, boil: 1.5,
        svg: () => khead(390, 300, 1.9, 'cat fang brow:angry', { wild: true, hat: false, pierce: ['earL'] })
      },
      {
        id: 'khushiEpic', vx: 170, vy: 20, vw: 440, vh: 460, z: 7, boil: 1.8, hidden: true,
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
        id: 'needleFaint', vx: 650, vy: 330, vw: 230, vh: 180, z: 8, boil: 0.5, hidden: true,
        svg: () => K.needle(770, 430, 0.95, 92, 'faint')
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
  },

  /* ==================== 6 · ACT III: ENTER A FOOL ==================== */
  {
    n: 6,
    title: 'Act III · Enter a Fool',
    words: "ACT III. Enter a fool, panicking about his TEDx talk.",
    clock: { x: 880, y: 80, s: 0.45, h: 11.85 },
    bg: () => bg('scribble', W, H, 106, GP.night) + floor() + K.door(240, 472, 1),
    sprites: [
      {
        id: 'storm', vx: 70, vy: 50, vw: 590, vh: 370, z: 4, boil: 2.2,
        svg: () => K.script(170, 180, 0.8, -30) + K.script(440, 140, 0.7, 24) + K.script(390, 330, 0.6, -50) +
          bolt(470, 200, 0.9) + bolt(150, 300, 0.7, GOLD, -20) + bubble(560, 120, 90, 48)
      },
      {
        id: 'fool', vx: 195, vy: 120, vw: 230, vh: 375, z: 6, boil: 2.4,
        svg: () => nerd(320, 476, 0.74, 'panic scream shake bigsweat brow:worry', { arms: 'up', top: ASH_WEIRD, r: -8 })
      },
      {
        id: 'khushi', vx: 675, vy: 165, vw: 190, vh: 330, z: 7, boil: 0.8,
        svg: () => khushi(770, 478, 0.62, 'lidded/lidded flat brow:arch', {
          outfit: 'witch', arms: 'cards', pierce: ALLP,
          hold: K.card(-24, -262, 0.42, -20) + K.card(0, -268, 0.42, 0) + K.card(24, -262, 0.42, 20)
        })
      }
    ],
    async run(ctx) {
      ctx.setCurtain(0.88);
      ctx.say('', '');
      ctx.audio('mountainKing');
      ctx.pose('fool', { dx: -160, s: 0.85, op: 0 });
      ctx.pose('storm', { s: 0.7, op: 0 });
      ctx.tween(520, p => {
        const e = ctx.ease(p);
        ctx.pose('fool', { dx: -160 * (1 - e), s: 0.85 + 0.15 * e, op: Math.min(1, p * 2.5) });
        ctx.pose('storm', { s: 0.7 + 0.3 * e, op: e });
      });
      await ctx.wait(560);
      ctx.say(this.words, 'press space to continue');
    }
  },

  /* ==================== 7 · THE BREATHING SPELL ==================== */
  {
    n: 7,
    title: 'The Breathing Spell',
    words: "She talked the fool down: \"Stop using your brain. Deep breath in. Pause. Don't dismiss it.\"",
    clock: { x: 880, y: 72, s: 0.42, h: 11.88 },
    bg: () => bg('glow', W, H, 107, GP.lilac),
    sprites: [
      {
        id: 'stormLive', vx: 540, vy: 30, vw: 380, vh: 240, z: 3, boil: 2.0,
        svg: () => bolt(600, 90, 0.9, GOLD) + bolt(700, 170, 0.6, GOLD, 30) + K.script(860, 140, 0.6, 20)
      },
      {
        id: 'stormFrozen', vx: 540, vy: 30, vw: 380, vh: 240, z: 3, boil: 0, hidden: true,
        svg: () => bolt(600, 90, 0.9, '#c9c2d4') + bolt(700, 170, 0.6, '#c9c2d4', 30) + K.script(860, 140, 0.6, 20).replace('#fbf6ea', '#e3dde9')
      },
      {
        id: 'candles', vx: 500, vy: 380, vw: 180, vh: 165, z: 4, boil: 0.6,
        svg: () => K.candle(560, 548, 0.9, 'calm') + K.candle(620, 548, 0.7, 'calm')
      },
      {
        id: 'foolPanic', vx: 685, vy: 225, vw: 210, vh: 315, z: 5, boil: 1.8,
        svg: () => nerd(790, 560, 0.68, 'panic scream shake brow:worry', { arms: 'up', top: ASH_WEIRD })
      },
      {
        id: 'foolCalm', vx: 685, vy: 225, vw: 210, vh: 315, z: 5, boil: 0.5, hidden: true,
        svg: () => nerd(790, 560, 0.68, '^soft o brow:soft', { arms: 'chest', top: ASH_WEIRD })
      },
      {
        id: 'khushi', vx: 130, vy: 60, vw: 380, vh: 480, z: 7, boil: 0.7,
        svg: () => khushi(320, 905, 1.6, 'soft/soft soft brow:soft aura', { outfit: 'witch', arms: 'conduct', pierce: ALLP })
      }
    ],
    async run(ctx) {
      ctx.setCurtain(1);
      // Hard cut to silence when she raises her hand
      ctx.audio('silence');
      ctx.say('', '');
      await ctx.wait(420);
      // Paper storm freezes & turns grey; he pushes his goggles up
      ctx.hide('stormLive');
      ctx.show('stormFrozen');
      ctx.hide('foolPanic');
      ctx.show('foolCalm');
      ctx.audio('musicBox');
      ctx.say(this.words, 'breathe in... pause...');
      // Slow 2s inhale glow
      ctx.tween(1800, p => {
        const s = 1 + 0.08 * Math.sin(p * Math.PI);
        ctx.pose('candles', { s });
        ctx.pose('khushi', { dy: -6 * Math.sin(p * Math.PI) });
      });
      await ctx.wait(1850);
      ctx.say(this.words, 'press space to continue');
    }
  },

  /* ==================== 8 · SHE READS HIM ==================== */
  {
    n: 8,
    title: 'She Reads Him',
    words: "The fool tried to read her tarot. \"I'm unpredictable,\" she said, and dealt him The Fool.",
    clock: { x: 890, y: 70, s: 0.4, h: 11.92 },
    bg: () => bg('halftone', W, H, 108, GP.candle, { fx: 520, fy: 250 }),
    sprites: [
      {
        id: 'bats', vx: 300, vy: 30, vw: 440, vh: 160, z: 4, boil: 1.5,
        svg: () => K.bat(380, 100, 0.9, -10) + K.card(350, 140, 0.35, 20) + K.bat(660, 80, 0.8, 12) + K.card(690, 118, 0.32, -14)
      },
      {
        id: 'khushi', vx: 80, vy: 100, vw: 340, vh: 440, z: 6, boil: 1.2,
        svg: () => khushi(240, 640, 1.05, 'villain/villain fang brow:angry shadow sparkle', { outfit: 'witch', arms: 'point', pierce: ALLP })
      },
      {
        id: 'fool', vx: 685, vy: 200, vw: 230, vh: 340, z: 5, boil: 1.5,
        svg: () => nerd(810, 560, 0.78, 'x O sweat brow:worry', { arms: 'shrug', top: ASH_WEIRD })
      },
      {
        id: 'foolCard', vx: 400, vy: 100, vw: 260, vh: 310, z: 8, boil: 0.8, hidden: true,
        svg: () => K.bigcard(530, 255, 0.95, -6, '0', 'THE FOOL',
          `<rect x="-78" y="-88" width="156" height="176" fill="#f6e7c4"/>${ashhead(-6, -20, 0.5, 'panic O sweat', { top: ASH_WEIRD })}<path d="M-50,70 L40,-40" stroke="#7a4a2a" stroke-width="5"/>${K.banana(40, -46, 0.6, -30)}${sparkle(-50, -60, 8, GOLD)}`)
      }
    ],
    async run(ctx) {
      ctx.setCurtain(1);
      ctx.say('', '');
      ctx.audio('misteriosoCard');
      ctx.pose('bats', { dy: -70 });
      ctx.tween(600, p => ctx.pose('bats', { dy: -70 * (1 - ctx.ease(p)) }));
      await ctx.wait(650);
      // Deals THE FOOL + one huge gong!
      ctx.audio('gong');
      ctx.show('foolCard');
      ctx.pose('foolCard', { dx: -140, s: 0.25, r: -28 });
      ctx.tween(320, p => {
        const e = ctx.ease(p);
        ctx.pose('foolCard', { dx: -140 * (1 - e), s: 0.25 + 0.75 * e, r: -28 * (1 - e) });
      });
      await ctx.wait(360);
      ctx.say(this.words, 'tableau · hold...');
      // 3-second frozen tableau
      await ctx.holdTableau(3000);
      ctx.say(this.words, 'press space to continue');
    }
  },

  /* ==================== 9 · ACT IV: ONE MINUTE TO MIDNIGHT ==================== */
  {
    n: 9,
    title: 'Act IV · One Minute to Midnight',
    words: "ACT IV. One minute to midnight, and the last card in her deck was still blank.",
    clock: { hide: true },
    bg: () => bg('screentone', W, H, 109, GP.night, { fx: 330, fy: 270, spot: '#3b2a55' }) +
      `<circle cx="720" cy="300" r="120" fill="url(#candleG)"/>` +
      nerd(70, 580, 0.36, 'dead flat', { arms: 'chest', top: ashBanana }),
    sprites: [
      {
        id: 'bigClock', vx: 120, vy: 70, vw: 400, vh: 400, z: 4, boil: 0.5,
        svg: () => K.clockDial(320, 270, 2.55)
      },
      {
        id: 'bigHour', vx: 120, vy: 70, vw: 400, vh: 400, z: 5,
        svg: () => `<g transform="translate(320 270) scale(2.55)"><path d="M0,0 L-16,-28" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><circle r="5" fill="${INK}"/></g>`
      },
      {
        id: 'bigMin', vx: 120, vy: 70, vw: 400, vh: 400, z: 6,
        svg: () => `<g transform="translate(320 270) scale(2.55)"><path d="M0,0 L0,-52" stroke="${PINK}" stroke-width="4" stroke-linecap="round"/><circle r="5" fill="${INK}"/></g>`
      },
      {
        id: 'blankGlow', vx: 640, vy: 205, vw: 160, vh: 190, z: 6, boil: 0.9,
        svg: () => K.card(720, 300, 1.15, 6, 'blank')
      },
      {
        id: 'scriptPrinting', vx: 540, vy: 60, vw: 420, vh: 470, z: 7, boil: 0.7,
        svg: () => K.villain(830, 130, 0.5, 'prim', -8) +
          `<path d="${wob(rectPts(560, 470, 390, 44, 20), 1, true)}" fill="#fbf6ea" stroke="${INK}" stroke-width="2.4" filter="url(#wob)"/>` +
          K.word(750, 500, 22, 'starring Khushi as THE SENSIBLE ON_') +
          `<path d="M940,470 q-4,14 0,26" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
      }
    ],
    async run(ctx) {
      ctx.setCurtain(1);
      ctx.say('', '');
      ctx.pose('bigMin', { r: -14 });
      ctx.showIris(320, 270, 195);
      ctx.audio('heartbeatTick');
      await ctx.wait(700);
      // Iris opens out from the clock while the last tick strains too long
      ctx.tween(900, p => ctx.showIris(320, 270, 195 + 560 * ctx.ease(p)));
      await ctx.wait(950);
      ctx.hideIris();
      // The tick before twelve runs too long!
      ctx.tween(1300, p => {
        const pullBack = p < 0.7 ? -14 - 8 * (p / 0.7) : -22 + 16 * ((p - 0.7) / 0.3);
        ctx.pose('bigMin', { r: pullBack });
      });
      await ctx.wait(920);
      ctx.audio('longTick');
      await ctx.wait(420);
      ctx.say(this.words, 'press space to continue');
    }
  },

  /* ==================== 10 · SHE PAINTS HER OWN ==================== */
  {
    n: 10,
    title: 'She Paints Her Own',
    words: "So she painted the blank card herself. Press space for each brushstroke.",
    clock: { x: 905, y: 62, s: 0.36, h: 11.984 },
    bg: () => bg('pencil', W, H, 110, GP.bone) +
      `<path d="${wob(rectPts(110, 26, 740, 500, 30), 1.6, true)}" fill="${PLUM}" stroke="${INK}" stroke-width="4" filter="url(#wob)"/><rect x="132" y="48" width="696" height="456" rx="10" fill="none" stroke="${GOLD}" stroke-width="4"/>`,
    sprites: [
      {
        id: 'stroke1', vx: 135, vy: 210, vw: 700, vh: 260, z: 5, boil: 0.5, hidden: true,
        svg: () => `<g filter="url(#wob)" fill="none" stroke-linecap="round"><path d="M180,420 C300,240 420,460 560,300 S760,160 800,250" stroke="${CORAL}" stroke-width="34"/></g>`
      },
      {
        id: 'stroke2', vx: 165, vy: 90, vw: 410, vh: 140, z: 6, boil: 0.5, hidden: true,
        svg: () => `<g filter="url(#wob)" fill="none" stroke-linecap="round"><path d="M200,140 C320,90 380,200 520,150" stroke="${LILAC}" stroke-width="24"/></g>`
      },
      {
        id: 'stroke3', vx: 560, vy: 330, vw: 220, vh: 140, z: 6, boil: 0.5, hidden: true,
        svg: () => `<g filter="url(#wob)" fill="none" stroke-linecap="round"><path d="M600,420 q60,-80 140,-40" stroke="${GOLD}" stroke-width="16"/></g>`
      },
      {
        id: 'stroke4', vx: 375, vy: 200, vw: 210, vh: 100, z: 7, boil: 0.8, hidden: true,
        svg: () => `<g filter="url(#wob)"><circle cx="430" cy="250" r="34" fill="none" stroke="#fff" stroke-width="12"/><circle cx="530" cy="250" r="34" fill="none" stroke="#fff" stroke-width="12" stroke-dasharray="120 300"/></g>`
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
        id: 'brush', vx: 560, vy: 180, vw: 240, vh: 340, z: 10, boil: 0.8,
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
  },

  /* ==================== 11 · ACT V: XXII KHUSHI ==================== */
  {
    n: 11,
    title: 'Act V · XXII',
    words: "ACT V. Doctor. Bitch. Healer. Witch. Artist. Same hands.",
    clock: { hide: true },
    bg: () => bg('burst', W, H, 111, GP.lilac, { fx: 500, fy: 260 }),
    sprites: [
      {
        id: 'bellClock', vx: 20, vy: 40, vw: 250, vh: 210, z: 5, boil: 1.4,
        svg: () => K.clock(140, 140, 0.95, 12) + `<path d="M40,60 q-14,80 0,160 M240,60 q14,80 0,160" stroke="${INK}" stroke-width="4" fill="none" opacity=".6"/>`
      },
      {
        id: 'cardXXII', vx: 340, vy: 40, vw: 320, vh: 460, z: 7, boil: 0.7,
        svg: () => K.bigcard(500, 270, 1.55, 0, 'XXII', 'KHUSHI',
          `<rect x="-78" y="-88" width="156" height="176" fill="${PLUM}"/><path d="M-70,80 C-30,40 20,90 70,30" stroke="${CORAL}" stroke-width="10" fill="none" stroke-linecap="round"/>${khead(0, 8, 0.6, 'star fang sparkle', { pierce: ALLP })}`)
      },
      {
        id: 'reprintBill', vx: 665, vy: 25, vw: 280, vh: 90, z: 6, boil: 0.6,
        svg: () => `<path d="${wob(rectPts(675, 36, 260, 56, 16), 1, true)}" fill="#fbf6ea" stroke="${GOLD}" stroke-width="2.6" filter="url(#wob)"/>` +
          K.word(805, 70, 18, 'Starring Khushi as Khushi', INK, 0, 'middle', 'italic')
      },
      {
        id: 'confetti', vx: 680, vy: 60, vw: 270, vh: 420, z: 5, boil: 1.9,
        svg: () => [...Array(14)].map((_, i) => `<path d="${wob(rectPts(0, 0, 18, 24, 8), 1, true)}" transform="translate(${720 + (i * 53) % 220} ${80 + (i * 97) % 380}) rotate(${i * 41})" fill="#fbf6ea" stroke="${INK}" stroke-width="1.6"/>`).join('') +
          `<circle cx="830" cy="430" r="14" fill="none" stroke="${GOLD}" stroke-width="3"/>`
      }
    ],
    async run(ctx) {
      ctx.setCurtain(1);
      ctx.say('', '');
      // Beat of silence before the twelfth bell
      ctx.audio('silence');
      await ctx.wait(350);
      ctx.audio('bells12');
      ctx.pose('cardXXII', { sx: 0.05, op: 0 });
      ctx.tween(550, p => {
        const e = ctx.ease(p);
        ctx.pose('cardXXII', { sx: 0.05 + 0.95 * e, op: Math.min(1, p * 3) });
        ctx.pose('bellClock', { r: 6 * Math.sin(p * Math.PI * 4) });
      });
      await ctx.wait(650);
      // Act I waltz returns as her grand major-key finale!
      ctx.audio('finale');
      ctx.tween(700, p => ctx.pose('confetti', { dy: 30 * ctx.ease(p), r: 6 * p }));
      ctx.say(this.words, 'tableau · hold...');
      await ctx.holdTableau(2500);
      ctx.say(this.words, 'press space to continue');
    }
  },

  /* ==================== 12 · CURTAIN CALL ==================== */
  {
    n: 12,
    title: 'Curtain Call',
    words: "Happy birthday, Khushi. Nobody else could ever play you.",
    clock: { x: 890, y: 80, s: 0.42, h: 12.02 },
    bg: () => bg('stars', W, H, 112, GP.night) + floor() + K.spot(480, 0, 520, 480) +
      K.needle(700, 470, 0.6, 70, 'faint') +
      [...Array(8)].map((_, i) => `<path d="${wob(rectPts(0, 0, 14, 18, 6), 1, true)}" transform="translate(${760 + i * 18} ${450 - (i % 3) * 14}) rotate(${i * 50})" fill="#fbf6ea" stroke="${INK}" stroke-width="1.4"/>`).join(''),
    sprites: [
      {
        id: 'foolBow', vx: 125, vy: 220, vw: 210, vh: 275, z: 5, boil: 0.9,
        svg: () => nerd(250, 476, 0.52, 'closed smile blush', { arms: 'down', r: 30, top: ASH_WEIRD })
      },
      {
        id: 'batsBow', vx: 270, vy: 110, vw: 420, vh: 100, z: 5, boil: 1.2,
        svg: () => K.bat(330, 170, 0.7, 30) + K.bat(640, 150, 0.7, -30)
      },
      {
        id: 'khushi', vx: 380, vy: 80, vw: 210, vh: 420, z: 7, boil: 0.9,
        svg: () => khushi(480, 478, 0.7, 'lidded/lidded smirk brow:arch sparkle', {
          outfit: 'both', arms: 'fling', pierce: ALLP,
          hold: K.banana(-30, -236, 0.6, 20)
        })
      },
      {
        id: 'cardFocus', vx: 485, vy: 105, vw: 100, vh: 120, z: 8, boil: 0.5,
        svg: () => `<g transform="translate(480 478) scale(.7)">${K.card(77, -470, 0.75, 8, 'artist')}</g>`
      }
    ],
    async playBow(ctx) {
      ctx.hideIris();
      ctx.setCurtain(0.88);
      ctx.audio('fanfare');
      ctx.say(this.words, '');
      ctx.tween(900, p => {
        const s = Math.sin(p * Math.PI);
        ctx.pose('foolBow', { r: 12 * s });
        ctx.pose('khushi', { dy: 6 * s });
        ctx.pose('batsBow', { dy: -12 * s });
      });
      await ctx.wait(1900);
      // Iris closes onto her painted card XXII in silence
      ctx.audio('silence');
      ctx.tween(1300, p => {
        const e = ctx.ease(p);
        ctx.showIris(534, 150, 560 * (1 - 0.86 * e));
      });
      await ctx.wait(1350);
      ctx.say(this.words, 'press space to bow again');
    },
    async run(ctx) {
      await this.playBow(ctx);
    },
    async replay(ctx) {
      await this.playBow(ctx);
    }
  }
];
