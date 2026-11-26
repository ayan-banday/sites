/* act0-overture: add shots to this array. n is renumbered automatically. */
(window.SHOTS_BY_ACT = window.SHOTS_BY_ACT || {}).act0 = [
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
  }
];
