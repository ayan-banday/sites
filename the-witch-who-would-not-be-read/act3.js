/* act3: add shots to this array. n is renumbered automatically. */
(window.SHOTS_BY_ACT = window.SHOTS_BY_ACT || {}).act3 = [
  /* ==================== 6 · ACT III: ENTER AYAN ==================== */
  {
    n: 6,
    title: 'Act III · Enter Ayan',
    words: "ACT III. Enter Ayan, panicking about his talk.",
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
    words: "She talked Ayan down: \"Stop using your brain. Deep breath in. Pause. Don't dismiss it.\"",
    clock: { x: 880, y: 118, s: 0.36, h: 11.88 },
    bg: () => bg('glow', W, H, 107, GP.lilac),
    sprites: [
      {
        id: 'stormLive', vx: 540, vy: 30, vw: 380, vh: 240, z: 3, boil: 2.0,
        svg: () => bolt(600, 90, 0.9, GOLD) + bolt(700, 170, 0.6, GOLD, 30) + K.script(810, 160, 0.6, 20)
      },
      {
        id: 'stormFrozen', vx: 540, vy: 30, vw: 380, vh: 240, z: 3, boil: 0, hidden: true,
        svg: () => bolt(600, 90, 0.9, '#c9c2d4') + bolt(700, 170, 0.6, '#c9c2d4', 30) + K.script(810, 160, 0.6, 20).replace('#fbf6ea', '#e3dde9')
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
  }
];
