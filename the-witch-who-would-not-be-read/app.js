/* The Witch Who Would Not Be Read — engine, 12 fps stop-motion clock, sound mixer, phone teaser & midnight lock. */
(() => {
  assembleShots();
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

  /* CUE LIST (ctx.audio(name, arg)). Music: overture, organChord, waltz, bach, danse, mountainKing, musicBox,
     misteriosoCard, finale (=waltz-finale, once), fanfare (layered over the running music, ducks it).
     Music flags in arg (string, space separated): 'soft' 55% volume, 'low' 50%, 'loud' full, 'fade' 1 s fade in,
     'cross' 1 s crossfade from the old track, 'off' (waltz played at 0.94 so it sounds off). Aliases: waltzSoft,
     waltzLoud, waltzOff, waltzPrim, waltzFinale. Control: silence (hard cut), fadeOut (arg ms, default 1000),
     duck / unduck (running music), credits / creditsHide.
     SFX: thud(i) gong hit flingHit(hit + cut) ting(i) doorSlam pencil tick longTick heartbeatTick stroke(i)
     brushChord(=stroke) bell(n) bells([a,b] or 'a-b') bellsA(1-6) bellsB(7-11) bell12 bells12(all twelve)
     whoosh pop rustle munch chime flap boing slideWhistle. Unknown names are logged and stay silent. */
  let activeName = null, noiseBuf = null, strokeN = 0;
  const BASE_VOL = 0.88;

  function setVol(t, v) {
    t.vol = v;
    if (t.node) t.node.gain.value = v; else t.el.volume = Math.max(0, Math.min(1, v));
  }
  function fadeTrack(t, to, ms, done) {
    if (t.fx) { clearInterval(t.fx); t.fx = null; }
    if (ms <= 0) { setVol(t, to); done && done(); return; }
    const t0 = performance.now(), v0 = t.vol == null ? to : t.vol;
    t.fx = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      setVol(t, v0 + (to - v0) * k);
      if (k >= 1) { clearInterval(t.fx); t.fx = null; done && done(); }
    }, 40);
  }
  function haltTrack(t) {
    if (t.fx) { clearInterval(t.fx); t.fx = null; }
    if (t.stopT) { clearTimeout(t.stopT); t.stopT = null; }
    try { t.el.pause(); t.el.currentTime = 0; t.el.playbackRate = 1; } catch (e) {}
  }
  function stopMusicDead() { for (const k in tracks) haltTrack(tracks[k]); activeName = null; }
  function fadeMusicOut(ms) {
    for (const k in tracks) {
      const t = tracks[k];
      if (t.el.paused) continue;
      fadeTrack(t, 0, ms, () => haltTrack(t));
    }
    activeName = null;
  }

  function playFile(name, o = {}) {
    const { loop = true, vol = BASE_VOL, loopStart = 0, rate = 1, fadeIn = 0, cross = 0, layer = false, cutAfter = 0 } = o;
    if (!layer) {
      for (const k in tracks) {
        const t = tracks[k];
        if (k === name || t.el.paused) continue;
        if (cross > 0) fadeTrack(t, 0, cross, () => haltTrack(t)); else haltTrack(t);
      }
    }
    let t = tracks[name];
    if (!t) {
      const el = new Audio(`audio/${name}.mp3`);
      el.preload = 'auto';
      let node = null;
      if (ACX) {
        try {
          const src = ACX.createMediaElementSource(el);
          node = ACX.createGain();
          src.connect(node).connect(masterGain);
        } catch (e) {}
      }
      t = tracks[name] = { el, node, vol };
      el.addEventListener('ended', () => {
        if (t.loopStart && t.wantLoop) { try { el.currentTime = t.loopStart; el.play().catch(() => {}); } catch (e) {} }
        if (t.onEnd) t.onEnd();
      });
    }
    haltTrack(t);
    t.loopStart = loopStart; t.wantLoop = loop; t.base = vol; t.onEnd = null;
    t.el.loop = loop && !loopStart;
    t.el.playbackRate = rate;
    setVol(t, fadeIn ? 0 : vol);
    if (fadeIn) fadeTrack(t, vol, fadeIn);
    if (cutAfter) t.stopT = setTimeout(() => fadeTrack(t, 0, 500, () => haltTrack(t)), cutAfter * 1000);
    if (!layer) activeName = name;
    t.el.play().catch(() => {});
    return t;
  }

  const MUSIC = {
    overture: { file: 'overture-misterioso', loop: true, loopStart: 3.6 },
    organChord: { file: 'overture-misterioso', loop: false, cutAfter: 3.6 },
    waltz: { file: 'waltz-prim', loop: true },
    bach: { file: 'bach-agitato', loop: false },
    danse: { file: 'danse-macabre', loop: true },
    mountainKing: { file: 'mountain-king', loop: false },
    musicBox: { file: 'music-box', loop: true },
    misteriosoCard: { file: 'misterioso-card', loop: true },
    finale: { file: 'waltz-finale', loop: false },
    /* v2 additions (Kevin MacLeod, CC BY 4.0; 38-75 s, they fade out by themselves) */
    dreamyTarot: { file: 'dreamy-tarot', loop: false },
    hitmanDread: { file: 'hitman-dread', loop: false },
    gymnopedieCall: { file: 'gymnopedie-call', loop: false },
    eveningMelodramaStamp: { file: 'evening-melodrama-stamp', loop: false },
    ossuaryAirSuspended: { file: 'ossuary-air-suspended', loop: true },
    virtutesDoctor: { file: 'virtutes-doctor', loop: false },
    sneakySnitchBitch: { file: 'sneaky-snitch-bitch', loop: false },
    heartOfNowhereHealer: { file: 'heart-of-nowhere-healer', loop: false },
    ghostStoryWitch: { file: 'ghost-story-witch', loop: false },
    carefreeArtist: { file: 'carefree-artist', loop: false },
    merryGoConfetti: { file: 'merry-go-confetti', loop: false },
    healingClosing: { file: 'healing-closing', loop: false }
  };
  const ALIAS = {
    waltzPrim: ['waltz'], waltzSoft: ['waltz', 'soft'], waltzLoud: ['waltz', 'loud'], waltzOff: ['waltz', 'off'],
    waltzFinale: ['finale'], bellsA: ['bells', '1-6'], bellsB: ['bells', '7-11'], bell12: ['bell', 12],
    brushChord: ['stroke'], bachAgitato: ['bach'], mountain: ['mountainKing']
  };
  const flagsOf = arg => { const f = {}; String(arg == null ? '' : arg).split(/[ ,+]/).forEach(s => { if (s) f[s] = true; }); return f; };
  function playMusic(name, arg) {
    const d = MUSIC[name], f = flagsOf(arg);
    let vol = BASE_VOL;
    if (f.soft) vol *= 0.55;
    if (f.low) vol *= 0.5;
    if (f.loud) vol = 0.95;
    playFile(d.file, { loop: d.loop, loopStart: d.loopStart || 0, vol, rate: f.off ? 0.94 : 1, fadeIn: f.fade2 ? 2000 : (f.fade || f.fadeIn) ? 1000 : 0, cross: f.cross2 ? 2000 : f.cross ? 1000 : 0, cutAfter: d.cutAfter || 0 });
  }

  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  function noise(t, dur, vol, freq, type = 'lowpass', q = 0.7, bus = sfxGain) {
    if (!ACX) return;
    if (!noiseBuf) {
      noiseBuf = ACX.createBuffer(1, ACX.sampleRate, ACX.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = ACX.createBufferSource(), f = ACX.createBiquadFilter(), g = ACX.createGain();
    s.buffer = noiseBuf; s.loop = true;
    f.type = type; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
    s.connect(f); f.connect(g); g.connect(bus);
    s.start(t); s.stop(t + dur + 0.05);
  }
  function bell(n, t) {
    const big = n === 12, f = big ? 294 : 587 * (1 + (n % 3) * 0.004);
    osc('sine', f, t, big ? 2.6 : 1.3, big ? 0.16 : 0.1, sfxGain, 4200);
    osc('triangle', f * 1.5, t, big ? 1.6 : 0.8, 0.045, sfxGain, 5000);
    osc('sine', f * 2.01, t, 0.6, 0.04, sfxGain, 6000);
    noise(t, 0.05, 0.05, 3000, 'highpass');
  }
  function bells(a, b, t, gap = 0.3) { for (let i = a; i <= b; i++) bell(i, t + (i - a) * gap); }
  function orchHit(t, vol = 0.11) { [43, 55, 58, 62, 67, 74].forEach(m => osc('sawtooth', mtof(m), t, 0.55, vol, sfxGain, 2800)); }

  function triggerAudio(rawName, arg) {
    ensureAudio();
    window.__MOVIE_STATE__.cuesPlayed.push({ cue: rawName, arg: arg ?? null, t: Math.round(performance.now()) });
    let name = rawName;
    const al = ALIAS[name];
    if (al) { name = al[0]; if (arg == null && al.length > 1) arg = al[1]; }
    const t = ACX ? ACX.currentTime : 0;
    const num = Number.isFinite(Number(arg)) && arg !== null && arg !== '' && !Array.isArray(arg) ? Number(arg) : 0;
    if (MUSIC[name]) {
      if (name === 'overture') strokeN = 0;
      if (name === 'overture' && ACX) [43, 55, 58, 62, 67].forEach(m => osc('sawtooth', mtof(m), t, 0.9, 0.08, sfxGain, 2200));
      playMusic(name, arg);
      return;
    }
    switch (name) {
      case 'silence': case 'cut': stopMusicDead(); break;
      case 'musicLevel': { const m = activeName && tracks[activeName]; if (m) { m.base = Math.min(1, num); fadeTrack(m, m.base, 400); } break; }
      case 'musicDuck': { const m = activeName && tracks[activeName]; if (m) fadeTrack(m, arg == null ? 0.25 : num, 300); break; }
      case 'musicFade': fadeMusicOut(1000); break;
      case 'fadeOut': fadeMusicOut(typeof arg === 'number' ? arg : 1000); break;
      case 'duck': { const m = activeName && tracks[activeName]; if (m) fadeTrack(m, (m.base || BASE_VOL) * 0.25, 400); break; }
      case 'unduck': {
        const m = activeName && tracks[activeName]; if (m) fadeTrack(m, m.base || BASE_VOL, 600);
        const fa = tracks['fanfare-applause']; if (fa && !fa.el.paused) fadeTrack(fa, 0.3, 800);
        break;
      }
      case 'credits': { const cr = $('stageCredits'); if (cr) { cr.hidden = false; void cr.offsetWidth; cr.classList.add('on'); } break; }
      case 'creditsHide': { const cr = $('stageCredits'); if (cr) { cr.classList.remove('on'); cr.hidden = true; } break; }
      case 'fanfare': {
        const m = activeName && tracks[activeName];
        const layer = !!(m && !m.el.paused);
        if (layer) fadeTrack(m, (m.base || BASE_VOL) * 0.25, 400);
        const fa = playFile('fanfare-applause', { loop: false, vol: 0.96, layer }); // file measures 0.7 LU quieter than the rest
        fa.onEnd = () => { const mm = activeName && tracks[activeName]; if (mm && !mm.el.paused) fadeTrack(mm, mm.base || BASE_VOL, 800); };
        break;
      }
      case 'flingHit': stopMusicDead(); if (ACX) orchHit(t, 0.11); break;
      case 'hit': if (ACX) orchHit(t, 0.11); break;
      case 'thud': if (ACX) {
        const o = osc('sine', 120 - num * 6, t, 0.3, 0.45, sfxGain, 500);
        if (o) o.frequency.exponentialRampToValueAtTime(48, t + 0.25);
        noise(t, 0.08, 0.12, 700);
      } break;
      case 'gong': if (ACX) [38, 45, 50, 57, 61, 66].forEach((m, i) => osc(i % 2 ? 'triangle' : 'sawtooth', mtof(m), t, 2.6, 0.06, sfxGain, 1400)); break;
      case 'ting': if (ACX) {
        const f = mtof(84 + num * 2);
        osc('sine', f, t, 0.45, 0.25, sfxGain, 8000);
        osc('triangle', f * 2, t, 0.25, 0.12, sfxGain, 8000);
      } break;
      case 'doorSlam': if (ACX) {
        noise(t, 0.18, 0.5, 900);
        const o = osc('sine', 90, t, 0.4, 0.5, sfxGain, 400);
        if (o) o.frequency.exponentialRampToValueAtTime(40, t + 0.3);
        noise(t + 0.22, 0.12, 0.15, 700);
      } break;
      case 'pencil': if (ACX) for (let i = 0; i < 7; i++) noise(t + i * 0.16, 0.12, 0.07 + (i % 2) * 0.03, 3200 + i * 150, 'bandpass', 1.2); break;
      case 'tick': if (ACX) osc('square', 900, t, 0.04, 0.1, sfxGain, 2000); break;
      case 'longTick': if (ACX) {
        osc('square', 780, t, 0.06, 0.16, sfxGain, 1800);
        osc('triangle', 390, t, 0.2, 0.14, sfxGain, 1200);
      } break;
      case 'heartbeatTick': if (ACX) {
        osc('sine', 58, t, 0.25, 0.4, sfxGain, 400);
        osc('sine', 52, t + 0.18, 0.25, 0.3, sfxGain, 400);
        osc('square', 920, t + 0.55, 0.05, 0.12, sfxGain, 2000);
      } break;
      case 'stroke': if (ACX) {
        const i = num, f0 = 330 * Math.pow(1.12, i);
        const o = osc('sine', f0, t, 0.6, 0.18, sfxGain, 5000);
        if (o) o.frequency.exponentialRampToValueAtTime(f0 * 2, t + 0.5);
        osc('triangle', f0 * 3, t + 0.05, 0.4, 0.05, sfxGain, 6000);
        noise(t, 0.25, 0.04, 2500, 'bandpass', 0.9);
      } break;
      case 'gongSoft': if (ACX) [38, 45, 50, 57, 61, 66].forEach((m, i) => osc(i % 2 ? 'triangle' : 'sawtooth', mtof(m), t, 2.2, 0.022, sfxGain, 1000)); break; /* leaves the music running */
      case 'tagThud': if (ACX) {
        const o = osc('sine', 150, t, 0.2, 0.2, sfxGain, 420);
        if (o) o.frequency.exponentialRampToValueAtTime(70, t + 0.15);
        noise(t, 0.06, 0.07, 1200, 'lowpass');
      } break;
      case 'brushStroke': if (ACX) {
        if (arg === 'reset') { strokeN = 0; break; }
        const f0 = 392 * Math.pow(1.1225, strokeN % 9); strokeN++;
        const o = osc('sine', f0, t, 0.35, 0.13, sfxGain, 5000);
        if (o) o.frequency.exponentialRampToValueAtTime(f0 * 1.5, t + 0.25);
        osc('triangle', f0 * 2, t + 0.03, 0.22, 0.035, sfxGain, 6000);
        noise(t, 0.12, 0.025, 2600, 'bandpass', 0.9);
      } break;
      case 'bell': if (ACX) bell(num || 1, t); break;
      case 'bells': if (ACX) {
        let a = 1, b = 12;
        if (Array.isArray(arg)) [a, b] = arg; else if (typeof arg === 'string' && arg.includes('-')) [a, b] = arg.split('-').map(Number);
        else if (typeof arg === 'number') a = b = arg;
        bells(a, b, t);
      } break;
      case 'bells12': if (ACX) bells(1, 12, t, 0.16); break;
      case 'whoosh': if (ACX) noise(t, 0.45, 0.14, 1200, 'bandpass', 0.8); break;
      case 'pop': if (ACX) { const o = osc('sine', 500, t, 0.12, 0.3, sfxGain, 3000); if (o) o.frequency.exponentialRampToValueAtTime(160, t + 0.1); } break;
      case 'rustle': if (ACX) for (let i = 0; i < 4; i++) noise(t + i * 0.07, 0.08, 0.08, 4500, 'highpass'); break;
      case 'munch': if (ACX) for (let i = 0; i < 3; i++) { noise(t + i * 0.22, 0.1, 0.2, 700); osc('sine', 150, t + i * 0.22, 0.08, 0.2, sfxGain, 600); } break;
      case 'chime': if (ACX) [84, 88, 91, 96].forEach((m, i) => osc('sine', mtof(m), t + i * 0.09, 0.7, 0.12, sfxGain, 8000)); break;
      case 'flap': if (ACX) for (let i = 0; i < 5; i++) noise(t + i * 0.08, 0.06, 0.1, 1800, 'bandpass', 1); break;
      case 'boing': if (ACX) { const o = osc('triangle', 180, t, 0.5, 0.2, sfxGain, 2500); if (o) { o.frequency.exponentialRampToValueAtTime(420, t + 0.12); o.frequency.exponentialRampToValueAtTime(150, t + 0.45); } } break;
      case 'slideWhistle': if (ACX) {
        const o = osc('sine', 1150, t, 0.75, 0.22, sfxGain, 6000);
        if (o) o.frequency.exponentialRampToValueAtTime(210, t + 0.7);
      } break;
    }
  }
  window.__MOVIE_STATE__.audio = triggerAudio; // test hook

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
  else openMovie().then(() => {
    // Test jump (?preview&shot=N): the next press mounts shot N directly.
    const N = parseInt(Q.get('shot') || '0', 10);
    if (PREVIEW && N > 1 && N <= SHOTS.length) {
      shotIdx = N - 2;
      subIdx = ((SHOTS[shotIdx] || {}).subPresses || []).length;
      window.__MOVIE_STATE__.shotIndex = shotIdx;
    }
  });
})();
