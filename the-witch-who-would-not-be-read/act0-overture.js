/* act0-overture (v2): shot 1, presses P1-P3. n is renumbered by assembleShots(). */
const ov_dark = (x, y, w, h) => `<path d="${blob(x, y, w, h, 18, .06)}" fill="${NIGHT}" stroke="${INK}" stroke-width="2.4" filter="url(#wob)"/>`;
const ov_audience = () => {
  let s = '';
  [30, 120, 215, 320, 430, 540, 640, 830, 925].forEach((x, i) => { s += ov_dark(x, 512 + (i % 2) * 8, 36, 32) + ov_dark(x, 552, 52, 40); });
  return s;
};
const ov_title = (y, t, size = 27) => K.word(360, y, size, t, GOLD, 0, 'middle', 'normal');

(window.SHOTS_BY_ACT = window.SHOTS_BY_ACT || {}).act0 = [
  /* ==================== 1 · OVERTURE (P1-P3) ==================== */
  {
    title: 'Overture',
    words: "Tonight's movie stars Khushi, who never auditioned.",
    clock: { hide: true },
    bg: () => bg('stars', W, H, 101, GP.night) + floor(440) + K.cobweb(0, 0, 0.9) + K.cobweb(W, 0, 0.9, -1) +
      nerd(740, 572, 0.3, 'dot smile', { arms: 'chest', top: ashBanana }) +
      `<rect x="0" y="500" width="960" height="40" fill="${NIGHT}" opacity=".9"/><rect x="640" y="430" width="200" height="70" fill="${NIGHT}" opacity=".4"/>` + ov_audience(),
    sprites: [
      { id: 'glow', vx: 150, vy: 40, vw: 420, vh: 460, z: 2, boil: 0.4, hidden: true, svg: () => wash(blob(360, 270, 190, 215, 22, .1), GOLD, .55) },
      { id: 'spot', vx: 400, vy: 0, vw: 480, vh: 540, z: 3, boil: 0.5, hidden: true, svg: () => K.spot(640, 0, 400, 540) },
      { id: 'playbill', vx: 230, vy: 100, vw: 260, vh: 340, z: 4, boil: 0.7, hidden: true, svg: () => K.playbill(360, 270, 1.05, true) },
      { id: 'tl1', vx: 230, vy: 292, vw: 260, vh: 36, z: 5, boil: 0.5, hidden: true, svg: () => ov_title(318, 'THE WITCH') },
      { id: 'tl2', vx: 230, vy: 325, vw: 260, vh: 36, z: 5, boil: 0.5, hidden: true, svg: () => ov_title(350, 'WHO WOULD') },
      { id: 'tl3', vx: 230, vy: 357, vw: 260, vh: 36, z: 5, boil: 0.5, hidden: true, svg: () => ov_title(382, 'NOT BE READ') },
      { id: 'tl4', vx: 230, vy: 395, vw: 260, vh: 30, z: 5, boil: 0.5, hidden: true, svg: () => K.word(360, 416, 15, 'starring KHUSHI', BONE) },
      { id: 'clockA', vx: 750, vy: 55, vw: 160, vh: 160, z: 6, boil: 0.5, hidden: true, svg: () => K.clock(830, 135, 0.55, 10.93) },
      { id: 'clockB', vx: 750, vy: 55, vw: 160, vh: 160, z: 6, boil: 0.5, hidden: true, svg: () => K.clock(830, 135, 0.55, 11.0) },
      {
        id: 'khushi', vx: 520, vy: 195, vw: 240, vh: 260, z: 7, boil: 1.0, hidden: true,
        svg: () => khushi(640, 440, 0.6, 'big/big soft', { outfit: 'coat', arms: 'hip', pierce: ['earL'] })
      }
    ],
    async run(ctx) {
      // P1: the curtain parts on an empty theatre; organ chord. Ayan sits in the dark with a banana.
      ctx.setCurtain(0.02);
      ctx.showIris(480, 270, 0);
      ctx.say('', '');
      ctx.audio('overture');
      ctx.tween(1100, p => {
        const e = ctx.ease(p);
        ctx.setCurtain(0.05 + 0.83 * e);
        ctx.showIris(480, 270, 620 * e);
      });
      await ctx.wait(1150);
      ctx.hideIris();
      ctx.say(this.words, 'press space to continue');
    },
    subPresses: [
      // P2: the playbill rises and glows; the title letters in.
      async function (ctx) {
        ctx.say('', '');
        ctx.pose('playbill', { dy: 90, op: 0 });
        ctx.pose('glow', { op: 0 });
        ctx.tween(700, p => {
          const e = ctx.ease(p);
          ctx.pose('playbill', { dy: 90 * (1 - e), op: Math.min(1, p * 2) });
          ctx.pose('glow', { op: 0.9 * e });
        });
        await ctx.wait(750);
        for (const id of ['tl1', 'tl2', 'tl3']) {
          ctx.pose(id, { dy: 10, op: 0 });
          ctx.tween(300, p => ctx.pose(id, { dy: 10 * (1 - ctx.ease(p)), op: p }));
          await ctx.wait(320);
        }
        ctx.show('tl4');
        await ctx.wait(250);
        ctx.say('The Witch Who Would Not Be Read', 'press space to continue');
      },
      // P3: the clock ticks to eleven; Khushi steps into the single spotlight.
      async function (ctx) {
        ctx.say('', '');
        ctx.pose('clockA', { s: 0.6, op: 0 });
        ctx.tween(350, p => ctx.pose('clockA', { s: 0.6 + 0.4 * ctx.ease(p), op: p }));
        await ctx.wait(450);
        ctx.audio('longTick');
        ctx.hide('clockA'); ctx.show('clockB');
        ctx.pose('spot', { op: 0 });
        ctx.tween(500, p => ctx.pose('spot', { op: p }));
        ctx.pose('khushi', { dx: 280, op: 0 });
        ctx.tween(1100, p => {
          const e = ctx.ease(p);
          ctx.pose('khushi', { dx: 280 * (1 - e), dy: -7 * Math.abs(Math.sin(p * Math.PI * 5)), op: Math.min(1, p * 3) });
        });
        await ctx.wait(1200);
        ctx.say("At midnight, someone else's script locks in her part.", 'press space to continue');
      }
    ]
  }
];
