/* act6-finale: add shots to this array. n is renumbered automatically. */
(window.SHOTS_BY_ACT = window.SHOTS_BY_ACT || {}).act6 = [
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
        id: 'reprintBill', vx: 655, vy: 105, vw: 270, vh: 90, z: 6, boil: 0.6,
        svg: () => `<path d="${wob(rectPts(668, 117, 232, 56, 16), 1, true)}" fill="#fbf6ea" stroke="${GOLD}" stroke-width="2.6" filter="url(#wob)"/>` +
          K.word(784, 151, 15.5, 'Starring Khushi as Khushi', INK, 0, 'middle', 'italic')
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
        id: 'foolBow', vx: 100, vy: 200, vw: 300, vh: 295, z: 5, boil: 0.9,
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
