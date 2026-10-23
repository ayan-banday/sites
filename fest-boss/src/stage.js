// Fest Boss 2 - KAPLAY stage: title backdrop, runner (cold open, loops with the slow-mo junction,
// storm, finale) and the meeting hall. Uses only the passed `k` (kaplay created with global:false).
// All world drawing happens in one draw callback per scene so layer order is explicit.
import { W, H } from './view.js';
import { SPRITE_DEFS } from './art.js';

const GROUND_Y = 150;          // feet line
const PLAYER_X = 72;
const GRAVITY = 1000;          // px/s^2
const JUMP_V = 262;            // tap jump: apex ~34 px
const HOLD_MAX = 0.2;          // holding lightens gravity for this long while rising
const HOLD_G = 0.45;           // full hold: apex ~55 px
const COYOTE = 0.1;
const BUFFER = 0.12;
const PBOX = { x: -6, w: 12, h: 16 };

const STYLE_ORDER = ['direct', 'coach', 'support', 'delegate'];
const STYLE_COL = { direct: '#FF8A3D', coach: '#FFC93C', support: '#FF8FC7', delegate: '#2EC4B6' };
const HEX = { ink: '#1B1530', night: '#2B2350', cream: '#FFF6E5', white: '#FFFFFF', heart: '#FF4D6D', gold: '#FFC93C', teal: '#2EC4B6', dust: '#D9C7A8', gray: '#8A8F9C' };

const PLACES = {
  fest:      { sky: ['#7FCBFF', '#D6F1FF'], ground: 'gr_grass', far: 'fest_far', near: 'fest_near', obs: ['ob_crate', 'ob_cone', 'ob_crate'], tall: 'ob_speaker', drop: 'ob_debris', pits: true },
  quad:      { sky: ['#8FD3FF', '#CDEFFF'], ground: 'gr_grass', far: 'quad_far', near: 'quad_near', obs: ['ob_cone', 'ob_crate', 'ob_rock', 'ob_budget'], tall: 'ob_speaker', pits: true },
  woods:     { sky: ['#8ED1B4', '#E0F6E6'], ground: 'gr_path', far: 'woods_far', near: 'woods_near', obs: ['ob_log', 'ob_rock', 'ob_posters'], tall: 'ob_speaker', pits: true },
  backstage: { sky: ['#241B3D', '#4A3870'], ground: 'gr_stage', far: 'backstage_far', near: 'backstage_near', obs: ['ob_crate', 'ob_stage', 'ob_cone'], tall: 'ob_speaker', drop: 'ob_light' },
  canteen:   { sky: ['#2B2350', '#5E4596'], ground: 'gr_tile', far: 'canteen_far', near: 'canteen_near', obs: ['ob_tray', 'ob_cone', 'ob_food', 'ob_crate'], tall: 'ob_speaker', pits: true },
  night:     { sky: ['#140F28', '#3B2A6B'], ground: 'gr_grass', far: 'night_far', near: 'night_near', obs: ['ob_cone', 'ob_crate'], tall: 'ob_speaker' },
};

const SZ = Object.fromEntries(SPRITE_DEFS.map((d) => [d.name, d]));
const has = (n) => !!(n && SZ[n]);
const pick = (...names) => names.flat().find(has);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rnd = (a, b) => a + Math.random() * (b - a);
const choose = (arr) => arr[Math.floor(Math.random() * arr.length)];
const lerp = (a, b, t) => a + (b - a) * t;

let pending = null;
const BOT = new URLSearchParams(location.search).has('bot');

export function createStage(k, audio) {
  const cache = {};
  const col = (h) => cache[h] || (cache[h] = k.Color.fromHex(h));
  const sfx = (n) => { try { audio.sfx(n); } catch (e) { /* never throw */ } };
  const v2 = (x, y) => k.vec2(Math.round(x), Math.round(y));

  // ---- drawing helpers ------------------------------------------------------
  function rect(x, y, w, h, c, opacity = 1) {
    if (w <= 0 || h <= 0 || opacity <= 0) return;
    k.drawRect({ pos: v2(x, y), width: Math.ceil(w), height: Math.ceil(h), color: col(c), opacity });
  }
  function sprite(name, x, y, o = {}) {
    if (!has(name)) return;
    k.drawSprite({ sprite: name, frame: o.frame || 0, pos: v2(x, y), anchor: o.anchor || 'topleft', flipX: !!o.flip, opacity: o.opacity == null ? 1 : o.opacity, scale: o.scale ? k.vec2(o.scale) : undefined, angle: o.angle || 0 });
  }
  function sky(top, bot) {
    const bands = 9, bh = GROUND_Y / bands;
    const a = col(top), b = col(bot);
    for (let i = 0; i < bands; i++) {
      const t = i / (bands - 1);
      k.drawRect({ pos: v2(0, i * bh), width: W, height: Math.ceil(bh) + 1, color: k.rgb(lerp(a.r, b.r, t), lerp(a.g, b.g, t), lerp(a.b, b.b, t)) });
    }
  }
  function layer(name, off, bottom) {
    if (!has(name)) return false;
    const { w, h } = SZ[name];
    let x = -Math.floor(((off % w) + w) % w);
    for (; x < W; x += w) sprite(name, x, bottom - h);
    return true;
  }
  function ground(name, off, pits) {
    const g = pick(name, 'ground');
    const { w, h } = SZ[g];
    let x = -Math.floor(((off % w) + w) % w);
    if (h < 30) rect(0, GROUND_Y + h, W, H - GROUND_Y - h, '#C98B5A');
    for (; x < W; x += w) sprite(g, x, GROUND_Y);
    for (const p of pits) {
      rect(p.x, GROUND_Y - 1, p.w, H - GROUND_Y + 1, HEX.ink);
      rect(p.x + 2, GROUND_Y + 6, p.w - 4, H - GROUND_Y, '#0D0A18');
      rect(p.x, GROUND_Y - 1, 2, 10, '#000000', 0.35);
    }
  }
  function shadow(x, rx, op = 0.25, y = GROUND_Y + 1) {
    if (rx <= 0) return;
    k.drawEllipse({ pos: v2(x, y), radiusX: rx, radiusY: Math.max(1.5, rx * 0.25), color: col(HEX.ink), opacity: op });
  }
  // Creature frames: idle 0-1, run 2-3, jump 4, happy 5, sad 6.
  function creature(id, x, y, pose, o = {}) {
    const name = pick(id, 'riya');
    const tt = k.time() + (o.ph || 0);
    const f = pose === 'run' ? 2 + (Math.floor(tt * 10) % 2)
      : pose === 'idle' ? Math.floor(tt * 3) % 2
      : pose === 'jump' ? 4 : pose === 'happy' ? 5 : pose === 'sad' ? 6 : 0;
    sprite(name, x, y, { frame: f, anchor: 'bot', flip: o.flip, opacity: o.opacity, scale: o.scale });
  }

  // ---- particles (sprite or pixel) -------------------------------------------
  function makeParticles() {
    const list = [];
    return {
      add(p) { list.push({ age: 0, vx: 0, vy: 0, g: 0, life: 0.8, size: 2, ...p }); },
      burst(n, p, speed) {
        for (let i = 0; i < n; i++) {
          const a = rnd(0, Math.PI * 2), s = speed * rnd(0.4, 1);
          this.add({ ...p, vx: Math.cos(a) * s + (p.vx || 0), vy: Math.sin(a) * s + (p.vy || 0), life: (p.life || 0.8) * rnd(0.7, 1.2) });
        }
      },
      update(dt, scroll) {
        for (let i = list.length - 1; i >= 0; i--) {
          const p = list[i];
          p.age += dt; p.vy += p.g * dt;
          p.x += p.vx * dt - (p.world ? scroll : 0); p.y += p.vy * dt;
          if (p.age >= p.life) list.splice(i, 1);
        }
      },
      draw() {
        for (const p of list) {
          const r = p.age / p.life;
          const op = r < 0.6 ? 1 : 1 - (r - 0.6) / 0.4;
          if (p.sprite) {
            const fr = p.frames ? Math.min(p.frames - 1, Math.floor(r * p.frames)) : (p.frame || 0);
            sprite(p.sprite, p.x, p.y, { frame: fr, anchor: 'center', opacity: op, scale: p.scale, angle: p.spin ? p.age * p.spin : 0 });
          } else rect(p.x, p.y, p.size, p.size, p.color || HEX.white, op);
        }
      },
    };
  }

  // =========================================================================
  // TITLE: the fest falling apart, looping behind the title overlay
  // =========================================================================
  k.scene('title', () => {
    const P = PLACES.fest;
    const parts = makeParticles();
    let off = 0, dropT = 1, buntyX = -30, buntyDir = 1;
    k.onUpdate(() => {
      const dt = Math.min(k.dt(), 0.05);
      off += 18 * dt;
      parts.update(dt, 0);
      buntyX += buntyDir * 95 * dt;
      if (buntyX > W + 30) buntyDir = -1;
      if (buntyX < -30) buntyDir = 1;
      dropT -= dt;
      if (dropT <= 0) {
        dropT = rnd(0.9, 1.8);
        const x = rnd(W * 0.55, W - 20);
        parts.add({ sprite: pick('ob_debris', 'ob_stage'), x, y: -10, vy: 40, g: 700, life: 0.75, spin: rnd(-6, 6) });
        k.wait(0.62, () => { parts.burst(8, { x, y: GROUND_Y - 2, color: HEX.dust, g: 200, life: 0.6, size: 2 }, 50); k.shake(1.5); });
      }
    });
    k.add([{
      draw() {
        const t = k.time();
        sky(...P.sky);
        layer(P.far, off * 0.3, GROUND_Y + 2);
        // the leaning scaffold wobbles on the right
        if (has('scaffold')) {
          const f = Math.floor(t * 1.5) % 2;
          sprite('scaffold', W - 26, GROUND_Y, { frame: f, anchor: 'bot', angle: -6 + Math.sin(t * 2.2) * 3 }); // clear of the logo
        }
        layer(P.near, off * 0.7, GROUND_Y + 2);
        ground(P.ground, off, []);
        shadow(buntyX, 9);
        creature('bunty', buntyX, GROUND_Y, 'run', { flip: buntyDir < 0 });
        parts.draw();
        rect(0, 0, W, H, HEX.ink, 0.25);
      },
    }]);
  });

  // =========================================================================
  // HALL: Dean Blorb hands out the jobs
  // =========================================================================
  const hallState = { cards: [], who: {} };
  k.scene('hall', () => {
    const ox = Math.floor((W - 400) / 2);
    const LIFT = 36; // the dialogue box covers the bottom of the screen, so the room sits higher
    const FLOOR = GROUND_Y - LIFT;
    const seat = { riya: 44, zib: 84, gorp: 124, boss: 168 };
    const tasks = ['budget', 'posters', 'stage', 'food'];
    hallState.cards = tasks.map((t, i) => ({ task: t, x: ox + 222 + i * 26, y: 56 - LIFT + 10 + (i % 2) * 18, flying: null, owner: null }));
    hallState.who = { riya: 0, zib: 0, gorp: 0 };
    let fade = 1;
    k.onUpdate(() => { fade = Math.max(0, fade - k.dt() * 3); });
    k.add([{
      draw() {
        const t = k.time();
        rect(0, 0, W, H, '#8A5A32'); // floor colour under the dialogue box
        if (has('hall')) sprite('hall', ox, -LIFT); // centred, so the board lines up with the cards
        else {
          rect(0, 0, W, H, '#E9D8B8');
          rect(0, FLOOR, W, H - FLOOR, '#A0703F');
          rect(ox + 200, 30 - LIFT, 130, 70, HEX.white);
        }
        for (const c of hallState.cards) {
          let { x, y } = c;
          if (c.flying) {
            const f = c.flying, r = clamp((k.time() - f.t0) / 0.6, 0, 1);
            x = lerp(f.x0, f.x1, r); y = lerp(f.y0, f.y1, r) - Math.sin(r * Math.PI) * 40;
            if (r >= 1) { c.x = f.x1; c.y = f.y1; c.flying = null; }
          } else if (c.owner) { x = seat[c.owner] - 12; y = FLOOR - 52 + Math.sin(t * 3 + seat[c.owner]) * 1.5; }
          sprite('task_' + c.task, x, y, { opacity: 1 });
        }
        for (const id of ['riya', 'zib', 'gorp']) {
          const hop = hallState.who[id] && k.time() - hallState.who[id] < 0.5 ? Math.sin(((k.time() - hallState.who[id]) / 0.5) * Math.PI) * 10 : 0;
          shadow(seat[id], 9, 0.2, FLOOR + 1);
          creature(id, seat[id], FLOOR - hop, hop ? 'happy' : 'idle', { ph: seat[id] });
        }
        shadow(seat.boss, 9, 0.2, FLOOR + 1);
        creature('boss', seat.boss, FLOOR, 'idle', { flip: false });
        const bx = ox + 290;
        shadow(bx, 14, 0.2, FLOOR + 1);
        creature('blorb', bx, FLOOR, 'idle', { flip: true, ph: 0.4 });
        rect(0, 0, W, H, HEX.ink, fade);
      },
    }]);
  });

  function hallAssign(who, task) {
    const c = hallState.cards.find((x) => x.task === task);
    if (!c) return;
    const seat = { riya: 44, zib: 84, gorp: 124 };
    c.flying = { t0: k.time(), x0: c.x, y0: c.y, x1: seat[who] - 12, y1: GROUND_Y - 36 - 52 };
    c.owner = who;
    sfx('card');
    k.wait(0.6, () => { hallState.who[who] = k.time(); sfx('pop'); });
  }

  // =========================================================================
  // RUN: cold open | loop (A, break, fork, B) | storm | finale
  // =========================================================================
  k.scene('run', () => {
    const { opts, hooks, resolve } = pending;
    const kind = opts.kind;
    const P = PLACES[opts.place] || PLACES.quad;
    const obsList = P.obs.filter(has);
    if (!obsList.length) obsList.push(pick('ob_budget', 'ob_stage'));
    const tallName = pick(P.tall, 'ob_speaker', obsList[0]);
    const dropName = P.drop ? pick(P.drop, 'ob_debris', 'ob_stage') : null;
    const parts = makeParticles();

    // ---- state
    let phase = kind === 'loop' ? 'A' : 'run';
    let t = 0, pt = 0, ts = 1, tsTarget = 1, raw = 0;
    let baseSpeed = opts.speed || 140, speedMul = 1, dip = 0;
    let off = 0, vNow = 0;
    let y = GROUND_Y, vy = 0, grounded = true, coyote = 0, buffer = 0, holding = false, holdT = 0, pitRescue = 0;
    let hearts = 3, hits = 0, stumbles = 0, invuln = 0;
    let jumpMul = 1, shield = false, fogX = null, gapMul = kind === 'finale' ? 1.35 : 1, cloudEvery = 0, cloudT = 2;
    let mode = null, gap = 0, style = null, timedOut = false, buffId = null;
    let difficulty = opts.difficulty || 0.4;
    let gapLeft = opts.firstGap || 170, patterns = 0;
    let dim = 0, dimTarget = 0, lanes = 0, chosen = -1, flash = 0, fade = 1, laneGrow = 0;
    let rainT = 0, lightT = 0, lightNext = 2, groundTint = null, ended = false, hudT = 0;
    let door = null, festProps = 0, propT = 1.5, fireworksT = 0;
    const things = [];
    const barks = (opts.barks || []).slice().sort((a, b) => a.at - b.at);
    let barkIdx = 0;
    const revealed = { skill: false, will: false }, revealT = { skill: -9, will: -9 };
    const tips = { tap: !opts.tutorial, hold: !opts.tutorial };
    let tipActive = null, autoJump = null, forceHold = false;
    const bunty = opts.kind === 'cold' && has('bunty') ? { x: -40 } : null;
    const buddies = (opts.buddies || []).map((id, i) => ({ id, x: PLAYER_X - 28 - i * 22, y: GROUND_Y, vy: 0, grounded: true, ph: i * 0.7, mood: 'run' }));

    // ---- HUD bridge
    const progress = () => {
      if (kind === 'loop') return phase === 'A' ? 0.5 * pt / opts.durA : phase === 'B' || phase === 'end' ? 0.5 + 0.5 * clamp(pt / opts.durB, 0, 1) : 0.5;
      return clamp(t / (opts.dur || 30), 0, 1);
    };
    const pushHud = () => {
      if (ended || phase === 'fork') return; // main hides the HUD for the junction and after the run
      const buff = buffId && phase === 'B' ? { id: buffId, t01: clamp(1 - pt / opts.durB, 0, 1) } : null;
      try { hooks.hud({ hearts, maxHearts: 3, progress: progress(), buff }); } catch (e) { /* ignore */ }
    };
    pushHud();

    // ---- input
    const isUI = (e) => e.target && e.target.closest && e.target.closest('button, a, input, [data-ui]');
    const inputOn = () => ['run', 'A', 'B', 'break'].includes(phase);
    const press = () => {
      if (tipActive) {
        // The tutorial tap queues a perfectly timed jump, so the first try always works.
        autoJump = { th: things.find((x) => x.tip === tipActive), full: tipActive === 'hold' };
        tips[tipActive] = true; tipActive = null; tsTarget = 1; ts = 1; hooks.hideTip && hooks.hideTip();
        return;
      }
      if (!inputOn()) return;
      buffer = BUFFER; holding = true;
    };
    const release = () => { holding = false; };
    const onDown = (e) => { if (isUI(e)) return; press(); };
    const onKey = (e) => {
      if (!['Space', 'ArrowUp', 'KeyW'].includes(e.code)) return;
      e.preventDefault();
      if (e.repeat) return;
      if (e.type === 'keydown') press(); else release();
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    k.onSceneLeave(() => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
    });

    // ---- spawning
    function addOb(name, x, extra = {}) {
      const s = SZ[name];
      if (!s) return 0;
      things.push({ type: 'ob', name, x, w: s.w, h: s.h, frames: s.frames, box: { x: s.w * 0.17, w: s.w * 0.66, h: s.h * 0.8 }, ph: Math.random() * 2, ...extra });
      return s.w;
    }
    function addPit(x, w) { things.push({ type: 'pit', x, w: Math.round(w) }); return Math.round(w); }
    function addDrop(name, x, o = {}) {
      const s = SZ[name];
      if (!s) return 0;
      things.push({ type: 'drop', name, x, w: s.w, h: s.h, frames: s.frames, yb: o.yb || 30, vy: 0, state: o.state || 'hang', warn: o.warn || 0, cloud: !!o.cloud, box: { x: s.w * 0.15, w: s.w * 0.7, h: s.h * 0.8 } });
      return s.w;
    }
    const pitsOn = () => P.pits || mode === 'under' || kind === 'storm';
    function spawnPattern() {
      const n = patterns++;
      const x0 = W + 12;
      if (opts.tutorial && n === 0) return addOb(pick('ob_crate', obsList[0]), x0, { tip: 'tap' });
      if (opts.tutorial && n === 3) return addOb(tallName, x0, { tip: 'hold' });
      const d = difficulty;
      const opt = [
        ['single', 1],
        ['double', d > 0.3 ? 0.55 : 0],
        ['tall', d > 0.15 && tips.hold ? 0.45 : 0],
        ['pit', pitsOn() && d > 0.2 ? 0.45 + (mode === 'under' ? 0.6 : 0) : 0],
        ['drop', dropName && d > 0.25 ? 0.5 : 0],
        ['combo', d > 0.6 ? 0.35 + (mode === 'under' ? 0.3 : 0) : 0],
      ];
      let r = Math.random() * opt.reduce((s, o) => s + o[1], 0);
      let type = 'single';
      for (const [name, w] of opt) { if ((r -= w) <= 0) { type = name; break; } }
      if (type === 'single') return addOb(choose(obsList), x0);
      if (type === 'tall') return addOb(tallName, x0);
      if (type === 'double') {
        // Wide pairs are two quick taps; tight pairs (later, harder) need one held jump.
        const a = addOb(choose(obsList), x0);
        const g = d > 0.55 && Math.random() < 0.5 ? rnd(22, 30) : rnd(58, 70);
        return a + g + addOb(choose(obsList), x0 + a + g);
      }
      if (type === 'pit') return addPit(x0, Math.min(46, 24 + d * 14 + (mode === 'under' ? gap * 4 : 0)));
      if (type === 'drop') return addDrop(dropName, x0);
      const pw = addPit(x0, 26);
      return pw + 48 + addOb(choose(obsList), x0 + pw + 48);
    }
    function gapPx(v) {
      const base = lerp(1.35, 0.82, difficulty) + rnd(0, 0.45);
      return Math.max(v * base * gapMul, v * 0.62 + 40);
    }

    // ---- damage
    function hurt(th) {
      if (invuln > 0 || ended) return;
      if (th) th.hit = true;
      if (BOT) console.log('[bot] hit', th ? th.name + ':' + th.type + (th.state ? ':' + th.state : '') : 'pit', 'v=' + Math.round(vNow), 'y=' + Math.round(y), 'vy=' + Math.round(vy));
      if (shield) {
        shield = false; invuln = 0.9; sfx('shield');
        parts.burst(10, { sprite: 'sparkle', frames: 4, x: PLAYER_X, y: y - 10, life: 0.6 }, 60);
        hooks.toast && hooks.toast('shield', 'good');
        return;
      }
      hearts -= 1; hits += 1; invuln = 1.2;
      sfx('hit'); k.shake(3);
      parts.burst(6, { color: HEX.heart, x: PLAYER_X, y: y - 10, g: 300, life: 0.5, size: 2 }, 70);
      if (hearts <= 0) {
        stumbles += 1; hearts = 3; invuln = 2; dip = 1;
        sfx('stumble');
        hooks.toast && hooks.toast('stumble', 'bad');
      }
      pushHud();
    }

    // ---- loop phases
    function startBreak() {
      phase = 'break'; pt = 0;
      const task = opts.loop.task;
      const bx = buddies[0] ? buddies[0].x : PLAYER_X;
      if (opts.loop.breakLine) hooks.bark(opts.loop.breakLine);
      if (task === 'budget') {
        sfx('wind');
        for (let i = 0; i < 16; i++) k.wait(i * 0.08, () => parts.add({ sprite: pick('ob_cash', 'ob_budget'), frames: SZ[pick('ob_cash', 'ob_budget')].frames, x: bx, y: GROUND_Y - 20, vx: rnd(60, 160), vy: rnd(-120, -40), g: -10, life: 1.6, spin: rnd(-4, 4) }));
      } else if (task === 'posters') {
        sfx('thunder'); rainT = 4; flash = 0.8;
        for (let i = 0; i < 10; i++) k.wait(i * 0.1, () => parts.add({ sprite: 'ob_posters', x: bx, y: GROUND_Y - 16, vx: rnd(40, 140), vy: rnd(-90, -30), g: 160, life: 1.3, spin: rnd(-5, 5) }));
      } else if (task === 'stage') {
        sfx('creak');
        const x = PLAYER_X + 70;
        parts.add({ sprite: pick('ob_light', 'ob_stage'), x, y: -10, vy: 30, g: 900, life: 0.55, spin: 3 });
        k.wait(0.52, () => { sfx('crash'); k.shake(5); flash = 0.5; parts.burst(14, { color: HEX.dust, x, y: GROUND_Y - 4, g: 250, life: 0.7, size: 2 }, 90); parts.burst(6, { sprite: 'sparkle', frames: 4, x, y: GROUND_Y - 10, life: 0.6 }, 70); });
      } else {
        sfx('crash'); k.shake(3);
        for (let i = 0; i < 12; i++) k.wait(i * 0.12, () => parts.add({ sprite: 'smoke', frames: 4, x: bx + rnd(-10, 30), y: GROUND_Y - 14, vy: -rnd(20, 40), vx: rnd(-10, 10), life: 1.1, scale: 1.4 }));
      }
    }

    async function startFork() {
      phase = 'fork'; pt = 0;
      tsTarget = 0.1; dimTarget = 0.5; laneGrow = 0;
      sfx('slowIn');
      try { audio.slowmo(true); audio.music('tense'); } catch (e) { /* ignore */ }
      let res = { style: 'delegate', timedOut: true };
      try { res = await hooks.junction(); } catch (e) { /* default */ }
      style = res.style; timedOut = !!res.timedOut;
      chosen = STYLE_ORDER.indexOf(style);
      const fit = hooks.fit(style);
      mode = fit.mode; gap = fit.gap;
      sfx('slowOut');
      try { audio.slowmo(false); audio.music('run'); } catch (e) { /* ignore */ }
      k.wait(0.5, () => {
        flash = 1; dimTarget = 0; tsTarget = 1; lanes = 0;
        groundTint = STYLE_COL[style];
        applyMode();
        phase = 'B'; pt = 0;
        sfx(mode === 'match' ? 'buff' : 'debuff');
        const line = hooks.reaction(mode);
        if (line) hooks.bark(line);
        pushHud();
      });
    }

    function applyMode() {
      const b = buddies[0];
      difficulty = Math.min(0.95, difficulty + 0.1);
      if (mode === 'match') {
        buffId = 'sync'; shield = true; gapMul = 1.15;
        if (b) b.mood = 'happy';
      } else if (mode === 'over') {
        buffId = 'resentful';
        jumpMul = 1 - 0.07 * gap; speedMul = 1 + 0.08 * gap; cloudEvery = 3.4 - 0.5 * gap; cloudT = 1.2;
        if (b) b.mood = 'sulk';
      } else {
        buffId = 'lost';
        fogX = PLAYER_X + 150 - 25 * gap; gapMul = 0.8; speedMul = 1.05;
        if (b) b.mood = 'lost';
      }
    }

    function finish() {
      if (ended) return;
      ended = true; phase = 'end'; holding = false;
      k.wait(kind === 'cold' ? 0.9 : 1.1, () => resolve({ hits, stumbles, style, timedOut, mode, gap }));
    }

    // ---- update
    k.onUpdate(() => {
      raw = Math.min(k.dt(), 0.05);
      ts += (tsTarget - ts) * Math.min(1, raw * 8);
      const dt = raw * ts;
      t += dt; pt += dt;
      fade = Math.max(0, fade - raw * 3);
      flash = Math.max(0, flash - raw * 2.5);
      dim += (dimTarget - dim) * Math.min(1, raw * 8);
      if (phase === 'fork') laneGrow = Math.min(1, laneGrow + raw * 2.5);
      rainT = Math.max(0, rainT - dt);
      dip = Math.max(0, dip - dt);
      invuln = Math.max(0, invuln - dt);

      // phase transitions
      if (kind === 'loop') {
        if (phase === 'A' && pt >= opts.durA) startBreak();
        else if (phase === 'break' && pt >= 2.6) startFork();
        else if (phase === 'B' && pt >= opts.durB) finish();
      } else if (phase === 'run' && t >= opts.dur) {
        if (kind === 'cold') { phase = 'door'; door = { x: W + 30 }; }
        else if (kind === 'finale') { phase = 'fireworks'; fireworksT = 3; }
        else finish();
      }

      // speed
      if (kind === 'cold') { baseSpeed = lerp(125, 172, clamp(t / opts.dur, 0, 1)); difficulty = lerp(0.15, 0.95, clamp(t / opts.dur, 0, 1)); }
      let v = baseSpeed * speedMul * (1 - dip * 0.5);
      if (phase === 'break') v *= 0.75;
      if (phase === 'end' || phase === 'fireworks') v = 0;
      if (door && door.stopped) v = 0;
      vNow = v;
      const step = v * dt;
      off += step;
      for (const th of things) th.x -= step;
      if (door) door.x -= step;

      // spawn
      if (['run', 'A', 'B'].includes(phase)) {
        gapLeft -= step;
        if (gapLeft <= 0) { const w = spawnPattern(); gapLeft = w + gapPx(v); }
      }
      if (cloudEvery && phase === 'B') {
        cloudT -= dt;
        if (cloudT <= 0) { cloudT = cloudEvery; addDrop(pick(obsList[0], dropName), W - 12, { state: 'warn', warn: 0.55, yb: 40, cloud: true }); sfx('thunder'); }
      }
      if (kind === 'finale' && phase === 'run') {
        propT -= dt;
        if (propT <= 0 && festProps < 4) {
          propT = (opts.dur - 3) / 4;
          const task = ['budget', 'posters', 'stage', 'food'][festProps++];
          const good = !!(opts.outcomes && opts.outcomes[task]);
          things.push({ type: 'prop', name: 'prop_' + task + (good ? '_good' : '_bad'), x: W + 10, task, good, said: false });
        }
      }

      // barks on the clock (phase A for loops)
      const clock = kind === 'loop' ? (phase === 'A' ? pt : 1e9) : t;
      while (barkIdx < barks.length && clock >= barks[barkIdx].at) {
        const b = barks[barkIdx++];
        hooks.bark(b);
        if (b.cue && revealed[b.cue] === false) { revealed[b.cue] = true; revealT[b.cue] = k.time(); sfx('stamp'); }
      }

      // tutorial slow-mo
      if (!tipActive) {
        for (const th of things) {
          if (th.tip && !tips[th.tip] && th.x - PLAYER_X < 95) { tipActive = th.tip; tsTarget = 0.04; hooks.tip && hooks.tip(th.tip); break; }
        }
      }
      if (BOT) botStep();
      if (autoJump && autoJump.th && autoJump.th.x - PLAYER_X <= (autoJump.full ? 26 : 30)) {
        buffer = BUFFER; forceHold = autoJump.full; autoJump = null;
      }
      if (bunty) bunty.x += 82 * dt; // overtakes you and flees offscreen while his barks play

      // player physics
      const overPit = things.some((p) => p.type === 'pit' && PLAYER_X > p.x + 3 && PLAYER_X < p.x + p.w - 3);
      if (buffer > 0) buffer -= dt;
      if (grounded && overPit) grounded = false;
      if (grounded) coyote = COYOTE; else coyote -= dt;
      if (pitRescue > 0) {
        pitRescue -= dt; y = GROUND_Y - 30; vy = 0;
      } else {
        if (buffer > 0 && coyote > 0 && inputOn()) {
          vy = -JUMP_V * jumpMul; grounded = false; coyote = 0; buffer = 0; holdT = 0;
          sfx('jump');
          parts.burst(3, { color: HEX.dust, x: PLAYER_X, y: GROUND_Y - 1, g: 100, life: 0.3, size: 2 }, 30);
        }
        if (!grounded) {
          let g = GRAVITY;
          if ((holding || forceHold) && vy < 0 && holdT < HOLD_MAX) { g *= HOLD_G; holdT += dt; }
          vy += g * dt; y += vy * dt;
          if (vy >= 0 && y >= GROUND_Y && !overPit) { y = GROUND_Y; vy = 0; grounded = true; forceHold = false; }
          else if (y > GROUND_Y + 20) { sfx('pitfall'); hurt(null); pitRescue = 0.55; }
        }
      }

      // buddies auto-jump
      for (const b of buddies) {
        const target = phase === 'B' && b.mood === 'happy' ? PLAYER_X + 26 : phase === 'B' && b.mood !== 'run' ? PLAYER_X - 46 : b.x0 || b.x;
        if (!b.x0) b.x0 = b.x;
        b.x += (target - b.x) * Math.min(1, dt * 2);
        if (b.grounded && v > 0) {
          const danger = things.some((th) => (th.type === 'ob' || th.type === 'pit' || (th.type === 'drop' && th.state === 'land')) && th.x > b.x - 2 && th.x < b.x + 26);
          if (danger) { b.vy = -275; b.grounded = false; }
        }
        if (!b.grounded) { b.vy += GRAVITY * dt; b.y += b.vy * dt; if (b.y >= GROUND_Y) { b.y = GROUND_Y; b.vy = 0; b.grounded = true; } }
      }

      // things: drops, collisions, cleanup
      const px0 = PLAYER_X + PBOX.x, px1 = px0 + PBOX.w, pyb = y, pyt = y - PBOX.h;
      for (let i = things.length - 1; i >= 0; i--) {
        const th = things[i];
        if (th.x < -60) { things.splice(i, 1); continue; }
        if (th.type === 'drop') {
          if (th.state === 'warn') { th.warn -= dt; if (th.warn <= 0) th.state = 'fall'; }
          else if (th.state === 'hang' && th.x < PLAYER_X + 175) { th.state = 'fall'; sfx('creak'); }
          if (th.state === 'fall') {
            th.vy += 900 * dt; th.yb += th.vy * dt;
            if (th.yb >= GROUND_Y) {
              th.yb = GROUND_Y; th.state = 'land'; th.type = 'ob';
              sfx('crash'); k.shake(1.5);
              parts.burst(8, { color: HEX.dust, x: th.x + th.w / 2, y: GROUND_Y - 2, g: 200, life: 0.5, size: 2, world: true }, 60);
            }
          }
        }
        if (th.type === 'prop' && !th.said && th.x < PLAYER_X + 60) {
          th.said = true;
          const line = th.good ? opts.propLines.good[th.task] : opts.propLines.bad[th.task];
          if (line) hooks.bark({ who: 'narrator', text: line });
          sfx(th.good ? 'cheer' : 'debuff');
        }
        if (th.hit || ended || pitRescue > 0) continue;
        let oyb = null, oyt = null;
        if (th.type === 'ob') { oyb = GROUND_Y; oyt = GROUND_Y - th.box.h; }
        else if (th.type === 'drop' && th.state === 'fall') { oyb = th.yb; oyt = th.yb - th.box.h; }
        if (oyb == null) continue;
        const ox0 = th.x + th.box.x, ox1 = ox0 + th.box.w;
        if (px1 > ox0 && px0 < ox1 && pyb > oyt && pyt < oyb) hurt(th);
      }

      // cold open: the door
      if (door && !door.stopped && door.x <= PLAYER_X + 12) {
        door.stopped = true; door.open = true; sfx('door');
        finish();
      }
      // storm lightning
      if (kind === 'storm') {
        lightNext -= dt; lightT = Math.max(0, lightT - raw);
        if (lightNext <= 0) { lightNext = rnd(2.2, 3.8); lightT = 0.22; sfx('thunder'); }
      }
      // finale fireworks
      if (phase === 'fireworks') {
        fireworksT -= raw;
        if (Math.random() < raw * 5) {
          const x = rnd(30, W - 30), yy = rnd(20, 70);
          parts.add({ sprite: 'firework', frames: 4, x, y: yy, life: 0.8, scale: 1.5 });
          parts.burst(8, { sprite: 'confetti', frame: Math.floor(rnd(0, 4)), x, y: yy, g: 60, life: 1 }, 50);
          sfx('firework');
        }
        if (fireworksT <= 0) finish();
      }
      // cold open: the collapse behind you
      if (kind === 'cold' && phase === 'run' && Math.random() < raw * 3) {
        parts.add({ color: HEX.dust, x: rnd(0, 40), y: rnd(60, GROUND_Y), vx: rnd(10, 40), vy: rnd(-30, 10), g: 80, life: 0.8, size: 3 });
        if (Math.random() < 0.08) { sfx('rumble'); k.shake(1); }
      }
      if (kind === 'loop' && phase === 'B' && mode === 'match' && Math.random() < raw * 4) {
        parts.add({ sprite: 'sparkle', frames: 4, x: PLAYER_X + rnd(-14, 40), y: GROUND_Y - rnd(10, 30), life: 0.6 });
      }

      parts.update(dt, step);
      hudT -= raw;
      if (hudT <= 0) { hudT = 0.25; pushHud(); }
    });

    // ---- draw
    k.add([{
      draw() {
        const tt = k.time();
        sky(...P.sky);
        if (!layer(P.far, off * 0.25, GROUND_Y + 2)) layer('bg_hills', off * 0.25, GROUND_Y);
        if (kind === 'cold' && has('scaffold')) {
          // collapsing scaffolding chasing from the left
          for (let i = 0; i < 2; i++) sprite('scaffold', -18 + i * 26, GROUND_Y, { frame: Math.min(2, Math.floor(tt * 2 + i) % 3), anchor: 'bot', angle: 8 + Math.sin(tt * 3 + i) * 6 });
        }
        if (!layer(P.near, off * 0.6, GROUND_Y + 2)) layer('bg_bushes', off * 0.6, GROUND_Y);
        const pits = things.filter((p) => p.type === 'pit');
        ground(P.ground, off, pits);
        if (groundTint) rect(0, GROUND_Y, W, 4, groundTint, 0.85);

        // finale props behind the action
        for (const th of things) if (th.type === 'prop') sprite(th.name, th.x, GROUND_Y + 2, { anchor: 'botleft' });
        if (door) sprite('door', door.x, GROUND_Y, { frame: door.open ? 1 : 0, anchor: 'botleft' });

        // shadows
        for (const th of things) {
          if (th.type === 'drop' && th.state !== 'land') {
            const r = clamp(th.yb / GROUND_Y, 0.2, 1);
            const blink = th.state !== 'hang' && Math.floor(tt * 12) % 2 === 0;
            shadow(th.x + th.w / 2, th.w * 0.6 * r, blink ? 0.5 : 0.3);
          }
        }
        const air = clamp((GROUND_Y - y) / 50, 0, 1);
        shadow(PLAYER_X, 9 - air * 4, 0.28 - air * 0.1);
        for (const b of buddies) shadow(b.x, 8, 0.22);

        // obstacles and drops
        for (const th of things) {
          if (th.type === 'ob') {
            const f = th.frames > 1 ? Math.floor(tt * 4 + th.ph) % th.frames : 0;
            sprite(th.name, th.x, GROUND_Y, { frame: f, anchor: 'botleft' });
            if (th.tip && !tips[th.tip]) {
              const pulse = 0.5 + Math.sin(tt * 10) * 0.5;
              rect(th.x - 2, GROUND_Y - th.h - 6, th.w + 4, 2, HEX.gold, pulse);
            }
          } else if (th.type === 'drop') {
            if (th.state === 'hang') rect(th.x + th.w / 2, 0, 1, th.yb - th.h, HEX.ink, 0.8);
            if (th.cloud && th.state === 'warn') sprite('stormcloud', th.x + th.w / 2, 22 + Math.sin(tt * 8) * 1.5, { frame: Math.floor(tt * 4) % 2, anchor: 'center', scale: 1.2 });
            const wob = th.state === 'hang' ? Math.sin(tt * 6 + th.x) * 4 : 0;
            sprite(th.name, th.x, th.yb, { anchor: 'botleft', angle: wob });
          }
        }

        // buddies + cue bubble
        for (const b of buddies) {
          const pose = !b.grounded ? 'jump' : phase === 'end' ? (mode === 'match' || kind !== 'loop' ? 'happy' : 'sad') : b.mood === 'sulk' || b.mood === 'lost' ? 'sad' : 'run';
          creature(b.id, b.x, b.y, pose, { ph: b.ph, opacity: b.mood === 'lost' ? 0.55 + Math.sin(tt * 3) * 0.2 : 1 });
          if (b.mood === 'sulk') sprite('stormcloud', b.x, b.y - 36 + Math.sin(tt * 4) * 1.5, { frame: Math.floor(tt * 4) % 2, anchor: 'center' });
          if (b.mood === 'lost') k.drawText({ text: '?', size: 12, pos: v2(b.x + 6, b.y - 40 + Math.sin(tt * 5) * 2), color: col(HEX.white) });
        }
        if (kind === 'loop' && ['A', 'break', 'fork'].includes(phase) && buddies[0]) drawCues(buddies[0], tt);

        // player
        if (bunty && bunty.x < W + 30) {
          const by = GROUND_Y - Math.abs(Math.sin(tt * 14)) * 3;
          shadow(bunty.x, 8, 0.2);
          creature('bunty', bunty.x, by, 'run');
          if (Math.floor(tt * 8) % 2) rect(bunty.x - 14, by - 18, 4, 2, '#BFE6FF', 0.8); // sweat
        }
        const blink = invuln > 0 && Math.floor(invuln * 14) % 2 === 0;
        const pose = !grounded ? 'jump' : phase === 'end' || (door && door.stopped) ? 'happy' : vNow > 0 ? 'run' : 'idle';
        creature('boss', PLAYER_X, y, pose, { opacity: blink ? 0.35 : 1 });
        if (shield && has('shield')) sprite('shield', PLAYER_X, y - 12, { frame: Math.floor(tt * 6) % 2, anchor: 'center', opacity: 0.85 });

        parts.draw();

        // weather and debuffs
        if (rainT > 0 || kind === 'storm') {
          for (let i = 0; i < 46; i++) {
            const rx = ((i * 53 + tt * 260) % (W + 40)) - 20, ry = ((i * 97 + tt * 420) % (H + 20)) - 10;
            rect(rx, ry, 1, 6, '#BFE6FF', 0.6);
          }
        }
        if (kind === 'storm' && lightT <= 0) darkness(PLAYER_X, y - 10, 62, 0.86);
        if (kind === 'storm' && lightT > 0) rect(0, 0, W, H, HEX.white, lightT * 2);
        if (fogX != null && phase === 'B') {
          for (let x = Math.floor(fogX); x < W; x += 3) {
            const a = clamp((x - fogX) / 46, 0, 1) * 0.94;
            rect(x, 0, 3, H, HEX.night, a);
          }
          for (let i = 0; i < 5; i++) {
            const fx = fogX + 10 + ((i * 70 + tt * 12) % 120);
            k.drawEllipse({ pos: v2(fx, 40 + i * 26), radiusX: 26, radiusY: 9, color: col('#6B5E96'), opacity: 0.35 });
          }
        }
        if (mode === 'over' && phase === 'B') rect(0, 0, W, H, '#4A4560', 0.18);

        // the junction
        if (dim > 0.01) rect(0, 0, W, H, HEX.ink, dim);
        if (phase === 'fork' || lanes > 0) drawLanes(tt);
        if (flash > 0) rect(0, 0, W, H, HEX.white, flash * 0.7);
        if (fade > 0) rect(0, 0, W, H, HEX.ink, fade);
      },
    }]);

    // Testing aid (?bot): jumps at the right moment so a full play-through can be checked unattended.
    function botStep() {
      if (tipActive) { press(); return; }
      if (!inputOn() || !grounded || autoJump) return;
      const list = things
        .filter((th) => (th.type === 'ob' || th.type === 'pit' || (th.type === 'drop' && th.state !== 'hang')) && th.x + (th.w || 0) > PLAYER_X - 6)
        .sort((a, b) => a.x - b.x);
      const ahead = list[0];
      if (!ahead) return;
      const d = ahead.x - PLAYER_X;
      const pair = list[1] && list[1].x - (ahead.x + (ahead.w || 0)) < 40;
      const tall = pair || ahead.type === 'pit' || (ahead.h || 0) >= 20;
      if (d > 0 && d < (pair ? 14 + vNow * 0.05 : 22 + vNow * 0.07)) { buffer = BUFFER; forceHold = tall; }
    }

    function drawCues(b, tt) {
      const bx = Math.round(b.x - 30), by = Math.round(b.y - 54); // left of the player's head

      rect(bx - 1, by - 1, 42, 26, HEX.ink);
      rect(bx, by, 40, 24, HEX.cream);
      rect(b.x - 2, by + 24, 4, 3, HEX.ink);
      const L = opts.loop;
      [['skill', 'icon_skill'], ['will', 'icon_will']].forEach(([key, icon], i) => {
        const yy = by + 2 + i * 11;
        sprite(icon, bx + 2, yy);
        const pop = clamp((k.time() - revealT[key]) / 0.25, 0, 1);
        if (!revealed[key]) {
          k.drawText({ text: '?', size: 9, pos: v2(bx + 21, yy + 1), color: col('#8A8F9C') });
          return;
        }
        const high = L[key] === 'high';
        const n = high ? 3 : 1;
        for (let j = 0; j < 3; j++) {
          const on = j < n;
          const h = 4 + j * 2;
          rect(bx + 16 + j * 7, yy + 10 - h * pop, 5, h * pop, on ? (high ? '#3FBF5F' : HEX.heart) : '#D8CFC0');
        }
      });
    }

    function drawLanes(tt) {
      const ox = PLAYER_X + 30, oy = GROUND_Y - 6;
      const reach = lerp(ox + 10, W, k.easings.easeOutCubic(laneGrow));
      STYLE_ORDER.forEach((id, i) => {
        if (chosen >= 0 && chosen !== i) return;
        const yc = 38 + i * 34;
        const pulse = chosen === i ? 1 : 0.85 + Math.sin(tt * 6 + i) * 0.1;
        const pts = [k.vec2(ox, oy - 3), k.vec2(ox + 54, yc - 7), k.vec2(reach, yc - 7), k.vec2(reach, yc + 7), k.vec2(ox + 54, yc + 7), k.vec2(ox, oy + 3)];
        k.drawPolygon({ pts, color: col(STYLE_COL[id]), opacity: pulse });
        for (let x = ox + 66; x < reach - 6; x += 18) rect(x, yc - 1, 8, 2, HEX.white, 0.6);
      });
      k.drawCircle({ pos: v2(ox, oy), radius: 5, color: col(HEX.cream) });
    }

    function darkness(cx, cy, R, op) {
      const stepY = 3;
      for (let yy = 0; yy < H; yy += stepY) {
        const dy = Math.abs(yy + stepY / 2 - cy);
        if (dy >= R) { rect(0, yy, W, stepY, '#06040C', op); continue; }
        const w = Math.floor(Math.sqrt(R * R - dy * dy));
        rect(0, yy, cx - w, stepY, '#06040C', op);
        rect(cx + w, yy, W - cx - w, stepY, '#06040C', op);
      }
    }
  });

  return {
    title() { k.go('title'); },
    hall() { k.go('hall'); },
    hallAssign,
    // opts: { kind:'cold'|'loop'|'storm'|'finale', place, dur | durA+durB, speed, difficulty, barks, buddies, loop, tutorial, outcomes, propLines }
    // hooks: { bark(line), hud(state), tip(kind), hideTip(), toast(key,tone), junction() -> Promise<{style,timedOut}>, fit(style), reaction(mode) }
    run(opts, hooks) {
      return new Promise((resolve) => {
        pending = { opts, hooks, resolve };
        k.go('run');
      });
    },
  };
}
