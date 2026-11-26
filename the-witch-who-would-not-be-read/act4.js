/* act4: add shots to this array. n is renumbered automatically. */
(window.SHOTS_BY_ACT = window.SHOTS_BY_ACT || {}).act4 = [
  /* ==================== 8 · SHE READS HIM ==================== */
  {
    n: 8,
    title: 'She Reads Him',
    words: "Ayan tried to read her tarot. \"I'm unpredictable,\" she said, and dealt him The Fool.",
    clock: { x: 890, y: 118, s: 0.36, h: 11.92 },
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
          `<path d="${wob(rectPts(540, 470, 350, 44, 20), 1, true)}" fill="#fbf6ea" stroke="${INK}" stroke-width="2.4" filter="url(#wob)"/>` +
          K.word(715, 500, 18, 'starring Khushi as THE SENSIBLE ON_') +
          `<path d="M880,470 q-4,14 0,26" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
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
  }
];
