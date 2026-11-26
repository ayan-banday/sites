/* act1: add shots to this array. n is renumbered automatically. */
(window.SHOTS_BY_ACT = window.SHOTS_BY_ACT || {}).act1 = [
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
  }
];
