/* The Witch Who Would Not Be Read — engine, 12 fps stop-motion clock, sound mixer, phone teaser & midnight lock. */
(() => {
  const $ = id => document.getElementById(id);
  const Q = new URLSearchParams(location.search);
  const OPENS = Date.UTC(2026, 10, 30, 18, 30, 0); // 2026-12-01 00:00 IST
  const PREVIEW = Q.has('preview') || window.FORCE_MOVIE === true;
  /* Test clock: ?now=2026-11-30T23:59:50+05:30 starts the page's clock there and lets it keep ticking. */
  const NOW_OFFSET = (() => { const t = Date.parse(Q.get('now') || ''); return isNaN(t) ? 0 : t - Date.now(); })();
  const nowMs = () => Date.now() + NOW_OFFSET;
  const PHONE = window.FORCE_MOVIE !== true && (Math.min(screen.width, screen.height) < 600 || matchMedia('(max-width:599px)').matches);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = n => String(n).padStart(2, '0');

  document.documentElement.classList.add('js');
  initKit();
  letteringCSS();

  /* Expose verification hooks for automated checks */
  window.__MOVIE_STATE__ = {
    shotIndex: -1,
    subIndex: 0,
    presses: 0,
    busy: false,
    frozen: false,
    frameTimes: [],
    cuesPlayed: [],
    unlocked: false
  };

  /* ================= PHONE TEASER ================= */
  function runPhone() {
    document.documentElement.classList.add('phone');
    $('phone').hidden = false;
    const go = () => {
      const s1 = $('psky1'), s2 = $('psky2');
      paint(s1, 420, 740, bg('stars', 420, 740, 19, GP.night) + K.cobweb(0, 0, .85), s1.clientWidth || 390, s1.clientHeight || 700, 'none');
      paint(s2, 420, 740, bg('glow', 420, 740, 29, GP.night) + K.spot(210, 0, 360, 520), s2.clientWidth || 390, s2.clientHeight || 700, 'none');
      const pb = $('pPlaybill');
      paint(pb, 260, 340,
        K.playbill(130, 170, 1.02) +
        K.word(130, 236, 28, 'KHUSHI', GOLD, 0, 'middle', 'normal') +
        K.word(130, 268, 13, 'who did not audition', BONE),
        pb.clientWidth || 260, pb.clientHeight || 340);
      const pl = $('pLap');
      R = rng(9);
      paint(pl, 220, 150,
        `<path d="${wob(rectPts(22, 10, 176, 128, 16), 1.2, true)}" fill="${INK}" stroke="${BONE}" stroke-width="3" stroke-linejoin="round"/>` +
        `<path d="${wob(rectPts(34, 20, 152, 108, 18), 1.1, true)}" fill="${PLUM}"/>` +
        `<path d="M56,20 L56,128 M164,20 L164,128" stroke="#6a1a35" stroke-width="18"/>` +
        sparkle(110, 72, 14, GOLD) +
        `<path d="M198,42 v14" stroke="${BONE}" stroke-width="3" stroke-linecap="round"/>`,
        pl.clientWidth || 220, pl.clientHeight || 150);
      R = rng(6);
      $('pDown').innerHTML = `<path d="${wob([[17, 4], [17, 26]], 1)}" stroke="${GOLD}" stroke-width="2.6" stroke-linecap="round" fill="none"/><path d="${wob([[8, 18], [17, 28], [26, 18]], 1)}" stroke="${GOLD}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    };
    requestAnimationFrame(go);
  }

  /* ================= MIDNIGHT LOCK ================= */
  function runLock() {
    document.documentElement.classList.add('wide');
    const el = $('lock');
    el.hidden = false;
    const paintLockSky = () => {
      const c = $('lsky');
      if (!c.clientWidth) return;
      paint(c, c.clientWidth, c.clientHeight,
        bg('stars', c.clientWidth, c.clientHeight, 53, GP.night) +
        K.valance(c.clientWidth, c.clientHeight) +
        K.clock(c.clientWidth * 0.5, c.clientHeight * 0.16, 0.45, 11.95),
        c.clientWidth, c.clientHeight, 'none');
    };
    requestAnimationFrame(paintLockSky);
    preloadTheatre();
    const tick = () => {
      const left = OPENS - nowMs();
      if (left <= 0) {
        if (el.hidden) return;
        clearInterval(iv);
        el.hidden = true;
        openMovie();
        return;
      }
      const s = Math.floor(left / 1000);
      $('hh').textContent = pad(Math.floor(s / 3600));
      $('mm').textContent = pad(Math.floor(s / 60) % 60);
      $('ss').textContent = pad(s % 60);
    };
    const iv = setInterval(tick, 500);
    document.addEventListener('visibilitychange', tick); // a slept tab catches up the moment it wakes
    tick();
  }

  /* ================= 12 FPS STOP-MOTION CLOCK ================= */
  const FPS = 12;
  const tweens = [];
  let boilers = [];
  let frozen = false;
  let lastTick = performance.now();

  function tween(dur, fn, done) {
    tweens.push({ t0: performance.now(), dur: Math.max(1, dur), fn, done });
  }
  const ease = p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
  const wait = ms => new Promise(r => setTimeout(r, ms));

  function step12fps() {
    if (document.hidden) return;
    const now = performance.now();
    const dt = now - lastTick;
    lastTick = now;
    if (window.__MOVIE_STATE__.frameTimes.length < 300) {
      window.__MOVIE_STATE__.frameTimes.push(Math.round(dt * 10) / 10);
    }
    for (let i = tweens.length - 1; i >= 0; i--) {
      const w = tweens[i];
      const p = Math.min(1, (now - w.t0) / w.dur);
      w.fn(p);
      if (p >= 1) {
        tweens.splice(i, 1);
        w.done && w.done();
      }
    }
    if (!reduce && !frozen) {
      for (const b of boilers) {
        const a = +(b.dataset.amp || 1);
        const dx = ((Math.random() - 0.5) * 2 * a).toFixed(2);
        const dy = ((Math.random() - 0.5) * 2 * a).toFixed(2);
        const dr = ((Math.random() - 0.5) * a * 0.55).toFixed(2);
        b.style.transform = `translate(${dx}px, ${dy}px) rotate(${dr}deg)`;
      }
    }
  }
  setInterval(step12fps, 1000 / FPS);

  /* ================= AUDIO ENGINE ================= */
  let ACX = null, masterGain = null, sfxGain = null;
  const tracks = {};
  let activeTrack = null;

  function ensureAudio() {
    if (ACX) {
      if (ACX.state === 'suspended') ACX.resume().catch(() => {});
      return;
    }
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    ACX = new C();
    masterGain = ACX.createGain();
    masterGain.gain.value = 0.85;
    masterGain.connect(ACX.destination);
    sfxGain = ACX.createGain();
    sfxGain.gain.value = 0.9;
    sfxGain.connect(masterGain);
  }

  function osc(type, freq, t, dur, vol, bus = sfxGain, cutoff = 3600) {
    if (!ACX) return null;
    const o = ACX.createOscillator();
    const g = ACX.createGain();
    const lp = ACX.createBiquadFilter();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    lp.frequency.setValueAtTime(cutoff, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
    o.connect(lp); lp.connect(g); g.connect(bus);
    o.start(t); o.stop(t + dur + 0.04);
    return o;
  }

  let activeName = null, fadeTimer = null, finaleTimer = null, bellsEndAt = 0;
  function stopMusicDead() {
    if (fadeTimer) { clearInterval(fadeTimer); fadeTimer = null; }
    if (finaleTimer) { clearTimeout(finaleTimer); finaleTimer = null; }
    if (activeTrack) {
      try { activeTrack.pause(); activeTrack.currentTime = 0; } catch (e) {}
      activeTrack = null;
      activeName = null;
    }
  }
  // Short fade for the last cue (fanfare ends on the iris, not a click)
  function fadeMusicOut(ms) {
    const t = activeName && tracks[activeName];
    if (!t) return stopMusicDead();
    const t0 = performance.now();
    const v0 = t.node ? t.node.gain.value : t.el.volume;
    activeTrack = null;
    fadeTimer = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      if (t.node) t.node.gain.value = v0 * (1 - k); else t.el.volume = v0 * (1 - k);
      if (k >= 1) {
        clearInterval(fadeTimer); fadeTimer = null;
        try { t.el.pause(); t.el.currentTime = 0; } catch (e) {}
        activeName = null;
      }
    }, 40);
  }

  function playFile(name, loop = true, vol = 0.85, loopStart = 0) {
    stopMusicDead();
    let t = tracks[name];
    if (!t) {
      const el = new Audio(`audio/${name}.mp3`);
      el.preload = 'auto';
      el.loop = loop;
      let node = null;
      if (ACX) {
        try {
          const src = ACX.createMediaElementSource(el);
          node = ACX.createGain();
          node.gain.value = vol;
          src.connect(node).connect(masterGain);
        } catch (e) {}
      }
      t = tracks[name] = { el, node };
    }
    t.el.loop = loop && !loopStart;
    if (loop && loopStart && !t.wired) {
      t.wired = true;
      t.el.addEventListener('ended', () => { try { t.el.currentTime = loopStart; t.el.play().catch(() => {}); } catch (e) {} });
    }
    activeName = name;
    if (t.node) t.node.gain.value = vol;
    else t.el.volume = vol;
    try { t.el.currentTime = 0; } catch (e) {}
    activeTrack = t.el;
    t.el.play().catch(() => {});
  }

  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  function triggerAudio(name, arg) {
    ensureAudio();
    window.__MOVIE_STATE__.cuesPlayed.push({ cue: name, arg: arg ?? null, t: Math.round(performance.now()) });
    const t = ACX ? ACX.currentTime : 0;
    switch (name) {
      case 'silence':
        if (activeName === 'fanfare-applause') {
          fadeMusicOut(900);
          const cr = $('stageCredits');
          if (cr) setTimeout(() => { cr.hidden = false; }, 700);
        } else stopMusicDead();
        break;
      case 'overture':
        if (ACX) {
          // Dramatic theatre-organ chord stab before overture mp3 kicks in
          [43, 55, 58, 62, 67].forEach(m => osc('sawtooth', mtof(m), t, 0.9, 0.08, sfxGain, 2200));
        }
        playFile('overture-misterioso', true, 0.88, 3.6); // loops from 3.6s, past the organ chord
        break;
      case 'waltz':
        playFile('waltz-prim', true, 0.88);
        break;
      case 'flingHit':
        stopMusicDead();
        if (ACX) {
          [43, 55, 58, 62, 67, 74].forEach(m => osc('sawtooth', mtof(m), t, 0.6, 0.11, sfxGain, 2800));
        }
        break;
      case 'bach':
        playFile('bach-agitato', false, 0.88);
        break;
      case 'danse':
        playFile('danse-macabre', true, 0.88);
        break;
      case 'ting':
        if (ACX) {
          const f = mtof(84 + (arg || 0) * 2);
          osc('sine', f, t, 0.45, 0.25, sfxGain, 8000);
          osc('triangle', f * 2, t, 0.25, 0.12, sfxGain, 8000);
        }
        break;
      case 'slideWhistle':
        if (ACX) {
          const o = osc('sine', 1150, t, 0.75, 0.22, sfxGain, 6000);
          if (o) o.frequency.exponentialRampToValueAtTime(210, t + 0.7);
        }
        break;
      case 'mountainKing':
        playFile('mountain-king', false, 0.88);
        break;
      case 'musicBox':
        playFile('music-box', true, 0.88);
        break;
      case 'misteriosoCard':
        playFile('misterioso-card', true, 0.88);
        break;
      case 'gong':
        stopMusicDead();
        if (ACX) {
          [38, 45, 50, 57, 61, 66].forEach((m, i) => osc(i % 2 ? 'triangle' : 'sawtooth', mtof(m), t, 2.6, 0.09, sfxGain, 1400));
        }
        break;
      case 'heartbeatTick':
        stopMusicDead();
        if (ACX) {
          osc('sine', 58, t, 0.25, 0.4, sfxGain, 400);
          osc('sine', 52, t + 0.18, 0.25, 0.3, sfxGain, 400);
          osc('square', 920, t + 0.55, 0.05, 0.12, sfxGain, 2000);
        }
        break;
      case 'longTick':
        if (ACX) {
          osc('square', 780, t, 0.06, 0.16, sfxGain, 1800);
          osc('triangle', 390, t, 0.2, 0.14, sfxGain, 1200);
        }
        break;
      case 'brushChord': {
        stopMusicDead();
        const chords = [[55, 58, 62], [60, 63, 67], [63, 67, 70], [62, 66, 69], [67, 71, 74, 79]];
        const c = chords[(arg || 0) % chords.length];
        if (ACX) {
          c.forEach(m => osc('triangle', mtof(m), t, 0.75, 0.14, sfxGain, 3200));
          // Script ink drip counterpoint
          osc('sine', mtof(48 - (arg || 0)), t + 0.18, 0.18, 0.12, sfxGain, 1500);
        }
        break;
      }
      case 'bells12':
        stopMusicDead();
        bellsEndAt = performance.now() + 12 * 160 + 500;
        if (ACX) {
          for (let i = 0; i < 12; i++) {
            const bt = t + i * 0.16;
            osc('sine', 587, bt, 0.9, 0.11, sfxGain, 4200);
            osc('triangle', 880, bt, 0.5, 0.05, sfxGain, 5000);
          }
        }
        break;
      case 'finale':
        // twelve bells first (about 2.4s), then the waltz
        stopMusicDead();
        finaleTimer = setTimeout(() => { finaleTimer = null; playFile('waltz-finale', false, 0.88); }, Math.max(0, bellsEndAt - performance.now()));
        break;
      case 'fanfare':
        {
          const cr = $('stageCredits'); if (cr) cr.hidden = true;
          playFile('fanfare-applause', false, 0.96); // file measures 0.7 LU quieter than the rest
        }
        break;
    }
  }

  /* ================= PRE-PAINT PIPELINE ================= */
  const cache = new Map();
  let theatreReady = false;
  let preloaded = false;

  async function preloadTheatre() {
    if (theatreReady) return;
    theatreReady = true;
    const [cL, cR, val, pb, dial] = await Promise.all([
      paintSprite(0, 0, W * 0.48, H, K.curtainHalf(W, H, 'L'), 1.25),
      paintSprite(0, 0, W * 0.48, H, K.curtainHalf(W, H, 'R'), 1.25),
      paintSprite(0, 0, W, H, K.valance(W, H), 1.25),
      paintSprite(340, 110, 280, 350, K.playbill(480, 286, 1.05, true) + K.word(480, 348, 34, 'KHUSHI', GOLD, 0, 'middle', 'normal') + K.word(480, 382, 15, 'who did not audition', BONE), 1.4),
      paintSprite(-78, -78, 156, 156, K.clockDial(0, 0, 1), 1.5)
    ]);
    $('curtainLImg').src = cL;
    $('curtainRImg').src = cR;
    $('valanceImg').src = val;
    $('playbillFloatImg').src = pb;
    $('clockDialImg').src = dial;
  }

  async function buildShotAssets(shot) {
    if (cache.has(shot.n)) return cache.get(shot.n);
    const bgCanvas = document.createElement('canvas');
    bgCanvas.className = 'shotBg';
    await paint(bgCanvas, W, H, panelSVG(W, H, 400 + shot.n, shot.bg()), W * 1.25, H * 1.25);

    const spriteNodes = new Map();
    const frag = document.createDocumentFragment();
    for (const sp of (shot.sprites || [])) {
      const url = await paintSprite(sp.vx, sp.vy, sp.vw, sp.vh, sp.svg(), sp.scale || 1.4);
      const wrap = document.createElement('div');
      wrap.className = 'spriteWrap';
      wrap.style.left = (sp.vx / W * 100).toFixed(3) + '%';
      wrap.style.top = (sp.vy / H * 100).toFixed(3) + '%';
      wrap.style.width = (sp.vw / W * 100).toFixed(3) + '%';
      wrap.style.height = (sp.vh / H * 100).toFixed(3) + '%';
      wrap.style.zIndex = String(sp.z ?? 5);
      wrap.style.transformOrigin = sp.origin || '50% 50%';
      if (sp.hidden) wrap.style.opacity = '0';
      const inner = document.createElement('div');
      inner.style.width = '100%';
      inner.style.height = '100%';
      if (sp.boil) {
        inner.className = 'boil';
        inner.dataset.amp = String(sp.boil);
      }
      const img = document.createElement('img');
      img.className = 'sprite';
      img.src = url;
      img.alt = '';
      inner.appendChild(img);
      wrap.appendChild(inner);
      frag.appendChild(wrap);
      spriteNodes.set(sp.id, { wrap, sp, state: { dx: 0, dy: 0, r: 0, s: 1, sx: 1, sy: 1, op: sp.hidden ? 0 : 1, clip: '' } });
    }
    const built = { bgCanvas, frag, spriteNodes };
    cache.set(shot.n, built);
    return built;
  }

  /* ================= STAGE & CLOCK HELPERS ================= */
  function setCurtain(open) {
    const sx = 1 - open * 0.86;
    $('curtainL').style.transform = `scaleX(${sx.toFixed(4)})`;
    $('curtainR').style.transform = `scaleX(${sx.toFixed(4)})`;
  }

  function showIris(cx, cy, r) {
    const svg = $('irisSvg');
    svg.removeAttribute('hidden');
    $('irisPath').setAttribute('d', `M0,0 H${W} V${H} H0Z M${(cx - r).toFixed(1)},${cy.toFixed(1)} a${r.toFixed(1)},${r.toFixed(1)} 0 1 0 ${(2 * r).toFixed(1)},0 a${r.toFixed(1)},${r.toFixed(1)} 0 1 0 ${(-2 * r).toFixed(1)},0Z`);
  }
  function hideIris() { $('irisSvg').setAttribute('hidden', ''); }

  function setClock(cfg) {
    const cl = $('clockLayer');
    if (!cfg || cfg.hide) { cl.hidden = true; return; }
    cl.hidden = false;
    cl.style.left = (cfg.x / W * 100).toFixed(2) + '%';
    cl.style.top = (cfg.y / H * 100).toFixed(2) + '%';
    const wPct = (148 * (cfg.s || 0.5) / W * 100).toFixed(2);
    cl.style.width = wPct + '%';
    setClockTime(cfg.h);
  }

  function setClockTime(h) {
    const mDeg = (h % 1) * 360;
    const hDeg = ((h % 12) / 12) * 360;
    $('cMin').setAttribute('transform', `rotate(${mDeg.toFixed(1)})`);
    $('cHour').setAttribute('transform', `rotate(${hDeg.toFixed(1)})`);
  }

  function say(line, hint = '') {
    $('capLine').textContent = line;
    $('capHint').textContent = hint;
    $('cap').classList.toggle('blank', !line && !hint);
  }

  let currentBuilt = null;
  function applyPose(id, patch) {
    if (!currentBuilt) return;
    const entry = currentBuilt.spriteNodes.get(id);
    if (!entry) return;
    Object.assign(entry.state, patch);
    const st = entry.state;
    const sx = st.sx !== 1 ? st.sx : st.s;
    const sy = st.sy !== 1 ? st.sy : st.s;
    entry.wrap.style.transform = `translate(${st.dx}px, ${st.dy}px) rotate(${st.r}deg) scale(${sx}, ${sy})`;
    entry.wrap.style.opacity = String(st.op);
    if (st.clip !== undefined) entry.wrap.style.clipPath = st.clip;
  }

  function makeCtx() {
    return {
      tween, ease, wait,
      setCurtain,
      showIris, hideIris,
      setClockTime,
      say,
      audio: triggerAudio,
      pose: applyPose,
      show: id => applyPose(id, { op: 1 }),
      hide: id => applyPose(id, { op: 0 }),
      freeze(flag) { frozen = flag; window.__MOVIE_STATE__.frozen = flag; },
      fxHost: () => $('fxHost'),
      async holdTableau(ms) {
        this.freeze(true);
        await wait(ms);
        this.freeze(false);
      }
    };
  }

  /* ================= SHOT RUNNER & INPUT QUEUE ================= */
  let shotIdx = -1;
  let subIdx = 0;
  let busy = false;
  let queued = false;
  let movieStarted = false;

  async function mountShot(shot) {
    tweens.length = 0;
    frozen = false;
    $('fxHost').innerHTML = '';
    const built = await buildShotAssets(shot);
    currentBuilt = built;
    const host = $('shotHost');
    host.innerHTML = '';
    host.appendChild(built.bgCanvas);
    for (const { wrap, sp, state } of built.spriteNodes.values()) {
      state.dx = 0; state.dy = 0; state.r = 0; state.s = 1; state.sx = 1; state.sy = 1;
      state.op = sp.hidden ? 0 : 1;
      state.clip = '';
      wrap.style.transform = '';
      wrap.style.opacity = String(state.op);
      wrap.style.clipPath = '';
      host.appendChild(wrap);
    }
    boilers = [...host.querySelectorAll('.boil')];
    setClock(shot.clock);
    // Warm next shot silently
    const nextShot = SHOTS[shotIdx + 1];
    if (nextShot) buildShotAssets(nextShot).catch(() => {});
  }

  async function advance() {
    if (!movieStarted) {
      movieStarted = true;
      goFull();
    }
    if (busy) {
      queued = true;
      return;
    }
    window.__MOVIE_STATE__.presses++;
    busy = true;
    window.__MOVIE_STATE__.busy = true;
    try {
      const curShot = SHOTS[shotIdx];
      if (curShot && curShot.subPresses && subIdx < curShot.subPresses.length) {
        const fn = curShot.subPresses[subIdx++];
        window.__MOVIE_STATE__.subIndex = subIdx;
        await fn.call(curShot, makeCtx(), subIdx);
      } else if (shotIdx + 1 < SHOTS.length) {
        shotIdx++;
        subIdx = 0;
        window.__MOVIE_STATE__.shotIndex = shotIdx;
        window.__MOVIE_STATE__.subIndex = 0;
        const shot = SHOTS[shotIdx];
        await mountShot(shot);
        await shot.run.call(shot, makeCtx());
      } else if (curShot && curShot.replay) {
        await curShot.replay.call(curShot, makeCtx());
      }
    } finally {
      busy = false;
      window.__MOVIE_STATE__.busy = false;
      if (queued) {
        queued = false;
        advance();
      }
    }
  }

  function goFull() {
    const d = document.documentElement;
    if (document.fullscreenElement || document.webkitFullscreenElement) return;
    try {
      const r = d.requestFullscreen ? d.requestFullscreen({ navigationUI: 'hide' }) : d.webkitRequestFullscreen && d.webkitRequestFullscreen();
      if (r && r.catch) r.catch(() => {});
    } catch (e) {}
  }

  /* Inputs: space, click/tap, right arrow, enter, wheel flick, swipe up */
  addEventListener('keydown', e => {
    if ($('movie').hidden) return;
    if (['Space', ' ', 'ArrowRight', 'Enter'].includes(e.key) || e.code === 'Space') {
      e.preventDefault();
      advance();
    }
  });
  $('movie').addEventListener('pointerdown', e => {
    if ($('movie').hidden) return;
    advance();
  });
  let wq = 0;
  addEventListener('wheel', e => {
    if ($('movie').hidden) return;
    e.preventDefault();
    const now = performance.now();
    if (now - wq > 420 && Math.abs(e.deltaY) > 8) {
      wq = now;
      advance();
    }
  }, { passive: false });
  let ty = null, tx = 0;
  addEventListener('touchstart', e => { ty = e.touches[0].clientY; tx = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', e => {
    if ($('movie').hidden || ty === null) return;
    const t = e.changedTouches[0];
    const dy = t.clientY - ty, dx = t.clientX - tx;
    ty = null;
    if (Math.abs(dy) > 36 || Math.abs(dx) > 36) advance();
  }, { passive: true });

  /* ================= BOOT ================= */
  async function openMovie() {
    window.__MOVIE_STATE__.unlocked = true;
    document.documentElement.classList.add('wide');
    $('movie').hidden = false;
    await preloadTheatre();
    setCurtain(0);
    $('playbillFloat').hidden = false;
    // Paint shot 1 ready behind curtain
    if (SHOTS[0]) await buildShotAssets(SHOTS[0]);
    say('Press space to raise the curtain.', 'sound on · space, click, or swipe');
    // Hook first advance to hide floating playbill cleanly
    const origMount = mountShot;
    $('playbillFloat').hidden = false;
    if (!preloaded) {
      preloaded = true;
      // Hide closed-curtain playbill when Shot 1 mounts
      const checkPb = setInterval(() => {
        if (shotIdx >= 0) {
          $('playbillFloat').hidden = true;
          clearInterval(checkPb);
        }
      }, 50);
    }
  }

  if (PHONE) runPhone();
  else if (!PREVIEW && nowMs() < OPENS) runLock();
  else openMovie();
})();
