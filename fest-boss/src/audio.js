// Fest Boss audio: sfx, babble and chiptune music synthesized with WebAudio; dialogue from the
// recorded clips in audio/voice/ (made by dev/voices.mjs), with Web Speech only when none exist.
// Every public method is a silent no-op (never throws) when audio is unavailable or locked.
import { VOICES as RECORDED } from './voices.js';

const MUTE_KEY = 'festboss.muted';
const MASTER = 0.35;
const MUSIC_GAIN = 0.18;
const FILTER_OPEN = 16000;

let ctx = null;
let master = null;
let noiseBuf = null;
let muted = false;
let lastBabble = 0;
let musicBus = null;     // gain 0.18 -> master
let musicFilter = null;  // lowpass, swept by slowmo() -> musicBus
let detuneCtl = null;    // ConstantSource wired into every music oscillator's detune
let slow = false;        // slowmo state (remembered across unlock)
let tempoMul = 1;
let wantedMusic = null;  // requested track (remembered until the context is running)
let curTrack = null;
let musicTimer = null;
let suspendedByUs = false;

try { muted = localStorage.getItem(MUTE_KEY) === '1'; } catch (e) { muted = false; }

const rnd = (a, b) => a + Math.random() * (b - a);
const semi = (f, n) => f * Math.pow(2, n / 12);

function ready() { return !!ctx && !!master && !muted; }

function makeNoise() {
  const len = Math.floor(ctx.sampleRate * 1.2);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

// Tone with attack/decay envelope. opts: type, f, f2 (end freq), t (start offset s), dur, vol, att,
// lp (lowpass hz), bp (bandpass hz), vib (vibrato hz), vibDepth (cents)
function tone(o) {
  const t0 = o.at != null ? o.at : ctx.currentTime + (o.t || 0);
  const dur = o.dur || 0.1;
  const att = Math.min(o.att == null ? 0.005 : o.att, dur * 0.5);
  const vol = o.vol == null ? 0.5 : o.vol;
  const osc = ctx.createOscillator();
  osc.type = o.type || 'square';
  osc.frequency.setValueAtTime(o.f, t0);
  if (o.f2) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.f2), t0 + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + att);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  let node = osc;
  if (o.lp) {
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp; f.Q.value = 0.7;
    node.connect(f); node = f;
  }
  if (o.bp) {
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = o.bp; f.Q.value = 1.6;
    node.connect(f); node = f;
  }
  node.connect(g); g.connect(o.dest || master);
  if (o.det && detuneCtl) { try { detuneCtl.connect(osc.detune); } catch (e) { /* ignore */ } }
  let lfo = null;
  if (o.vib) {
    lfo = ctx.createOscillator(); lfo.frequency.value = o.vib;
    const lg = ctx.createGain(); lg.gain.value = o.vibDepth || 25; // cents
    lfo.connect(lg); lg.connect(osc.detune);
    lfo.start(t0); lfo.stop(t0 + dur + 0.02);
  }
  osc.start(t0); osc.stop(t0 + dur + 0.02);
  return osc;
}

// Filtered noise burst. opts: t, dur, vol, att, type (filter), f, f2 (filter sweep end), q
function noise(o) {
  const t0 = o.at != null ? o.at : ctx.currentTime + (o.t || 0);
  const dur = o.dur || 0.1;
  const att = Math.min(o.att == null ? 0.003 : o.att, dur * 0.5);
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = o.type || 'lowpass';
  f.frequency.setValueAtTime(o.f || 1500, t0);
  if (o.f2) f.frequency.exponentialRampToValueAtTime(Math.max(20, o.f2), t0 + dur);
  f.Q.value = o.q == null ? 0.8 : o.q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(o.vol == null ? 0.5 : o.vol, t0 + att);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f); f.connect(g); g.connect(o.dest || master);
  src.start(t0, Math.random() * 0.5); src.stop(t0 + dur + 0.02);
}

// ---------- babble ----------

const VOICES = {
  riya:     { type: 'triangle', lo: 520, hi: 760, dur: 0.062, vol: 0.55, lp: 2600, vib: 16, vibDepth: 45 },
  zib:      { type: 'square',   lo: 380, hi: 560, dur: 0.048, vol: 0.30, bp: 1500 },
  gorp:     { type: 'square',   lo: 110, hi: 180, dur: 0.070, vol: 0.50, lp: 700, noise: true },
  narrator: { type: 'sine',     lo: 300, hi: 420, dur: 0.055, vol: 0.30 },
  blorb:    { type: 'triangle', lo: 80,  hi: 140, dur: 0.090, vol: 0.62, lp: 800, vib: 5, vibDepth: 25 },
  bunty:    { type: 'square',   lo: 600, hi: 900, dur: 0.034, vol: 0.26, lp: 3200, vib: 30, vibDepth: 70 },
};

// vowel-ish position table: higher = brighter vowel
const VOWEL = { a: 0.5, e: 0.7, i: 0.95, o: 0.25, u: 0.05, y: 0.8 };

function charPitch01(ch) {
  const c = String(ch).toLowerCase().charAt(0);
  if (VOWEL[c] != null) return VOWEL[c];
  const code = c.charCodeAt(0) || 0;
  return ((code * 37) % 23) / 23 * 0.8 + 0.1;
}

function babble(who, ch) {
  try {
    if (!ready() || ch == null) return;
    const c = String(ch).charAt(0);
    if (!/[A-Za-z0-9À-￿]/.test(c)) return; // ignore spaces / punctuation
    const now = performance.now();
    if (now - lastBabble < 55) return;
    lastBabble = now;
    const v = VOICES[who] || VOICES.narrator;
    const p = charPitch01(c);
    const f = (v.lo + (v.hi - v.lo) * p) * rnd(0.97, 1.03);
    tone({ type: v.type, f, f2: f * rnd(0.96, 1.05), dur: v.dur * rnd(0.9, 1.1), vol: v.vol,
      att: 0.006, lp: v.lp, bp: v.bp, vib: v.vib, vibDepth: v.vibDepth });
    if (v.noise) noise({ dur: 0.05, vol: 0.18, type: 'bandpass', f: f * 4, q: 0.9 });
  } catch (e) { /* silent */ }
}

// ---------- sfx ----------

function seq(notes, o) {
  // notes: semitone offsets or null (rest) from base freq; step seconds
  notes.forEach((n, i) => {
    if (n == null) return;
    tone({ type: o.type || 'square', f: semi(o.base, n), t: i * o.step, dur: o.len || o.step * 1.4,
      vol: o.vol == null ? 0.4 : o.vol, lp: o.lp, att: 0.004 });
  });
}

const SFX = {
  select() { tone({ type: 'square', f: 880, f2: 1000, dur: 0.045, vol: 0.22, lp: 3000 }); },
  confirm() {
    tone({ type: 'square', f: 660, dur: 0.08, vol: 0.32, lp: 3500 });
    tone({ type: 'square', f: 990, t: 0.08, dur: 0.16, vol: 0.32, lp: 3500 });
  },
  tick() {
    tone({ type: 'square', f: 1568, dur: 0.07, vol: 0.28 });
    tone({ type: 'triangle', f: 2349, t: 0.05, dur: 0.35, vol: 0.4 });
    tone({ type: 'sine', f: 3136, t: 0.05, dur: 0.25, vol: 0.12 });
  },
  cross() {
    tone({ type: 'sawtooth', f: 140, f2: 95, dur: 0.32, vol: 0.35, lp: 900, vib: 30, vibDepth: 60 });
    tone({ type: 'square', f: 70, dur: 0.3, vol: 0.3, lp: 400 });
  },
  sparkle() {
    const base = 880;
    [0, 4, 7, 12, 16, 19, 24, 28].forEach((n, i) => {
      tone({ type: 'square', f: semi(base, n), t: i * 0.055, dur: 0.12, vol: 0.2, lp: 5000 });
      tone({ type: 'sine', f: semi(base, n + 12), t: i * 0.055 + 0.02, dur: 0.3, vol: 0.12 });
    });
  },
  crack() {
    noise({ dur: 0.09, vol: 0.7, type: 'highpass', f: 1800, att: 0.001 });
    noise({ dur: 0.05, vol: 0.5, type: 'bandpass', f: 3500, q: 1.2, att: 0.001, t: 0.07 });
    tone({ type: 'square', f: 520, f2: 130, t: 0.1, dur: 0.5, vol: 0.32, lp: 2200 });
  },
  smoke() {
    noise({ dur: 0.6, vol: 0.55, type: 'lowpass', f: 400, f2: 2200, att: 0.12, q: 0.6 });
    noise({ dur: 0.45, vol: 0.2, type: 'bandpass', f: 900, f2: 300, att: 0.1, t: 0.1 });
  },
  jump() { tone({ type: 'square', f: 260, f2: 720, dur: 0.16, vol: 0.28, lp: 3500, att: 0.003 }); },
  hit() {
    tone({ type: 'sine', f: 160, f2: 45, dur: 0.22, vol: 0.9, att: 0.002 });
    tone({ type: 'square', f: 110, f2: 55, dur: 0.15, vol: 0.25, lp: 600 });
    noise({ dur: 0.14, vol: 0.5, type: 'lowpass', f: 2500, f2: 300, att: 0.001 });
  },
  shield() {
    tone({ type: 'sine', f: 2093, dur: 0.6, vol: 0.4 });
    tone({ type: 'sine', f: 3136, t: 0.03, dur: 0.5, vol: 0.2 });
    tone({ type: 'triangle', f: 4186, t: 0.06, dur: 0.3, vol: 0.12 });
  },
  win() { seq([0, 4, 7, 12], { base: 523.25, step: 0.1, len: 0.14, vol: 0.34, lp: 4000 });
    tone({ type: 'square', f: 1046.5, t: 0.4, dur: 0.4, vol: 0.3, lp: 4000 });
    tone({ type: 'triangle', f: 523.25, t: 0.4, dur: 0.4, vol: 0.3 }); },
  lose() {
    [0, -3, -7].forEach((n, i) => {
      tone({ type: 'triangle', f: semi(392, n), t: i * 0.22, dur: i === 2 ? 0.55 : 0.24, vol: 0.5, vib: i === 2 ? 6 : 0, vibDepth: 30 });
      tone({ type: 'square', f: semi(392, n), t: i * 0.22, dur: i === 2 ? 0.5 : 0.2, vol: 0.12, lp: 1200 });
    });
  },
  fanfare() {
    const b = 392; // G4
    const n = [[0, 0.14], [0, 0.14], [0, 0.14], [5, 0.34], [3, 0.14], [5, 0.14], [7, 0.3], [12, 0.8]];
    let t = 0;
    n.forEach(([s, d]) => {
      tone({ type: 'square', f: semi(b, s), t, dur: d * 1.1, vol: 0.3, lp: 4500 });
      tone({ type: 'triangle', f: semi(b, s - 12), t, dur: d * 1.1, vol: 0.4 });
      t += d;
    });
    // final chord + shimmer
    [0, 4, 7].forEach(s => tone({ type: 'square', f: semi(b * 2, s), t: t - 0.8, dur: 1.1, vol: 0.14, lp: 4000, vib: 6, vibDepth: 15 }));
    noise({ dur: 0.5, vol: 0.12, type: 'highpass', f: 5000, t: t - 0.8, att: 0.02 });
  },
  whoosh() {
    noise({ dur: 0.5, vol: 0.5, type: 'bandpass', f: 300, f2: 3000, q: 1.1, att: 0.15 });
    tone({ type: 'sine', f: 200, f2: 900, dur: 0.45, vol: 0.1, att: 0.15 });
  },
  countdown() { tone({ type: 'square', f: 660, dur: 0.14, vol: 0.3, lp: 3000 }); },
  go() { tone({ type: 'square', f: 1320, dur: 0.45, vol: 0.32, lp: 4000, att: 0.004 });
    tone({ type: 'triangle', f: 660, dur: 0.45, vol: 0.3 }); },
  // ----- Fest Boss 2 additions -----
  rumble() {
    tone({ type: 'sine', f: 58, f2: 38, dur: 1.1, vol: 0.7, att: 0.15, vib: 13, vibDepth: 90 });
    noise({ dur: 1.1, vol: 0.55, type: 'lowpass', f: 220, f2: 70, att: 0.2, q: 0.7 });
    tone({ type: 'square', f: 41, dur: 0.9, vol: 0.12, lp: 160, att: 0.2, vib: 17, vibDepth: 60 });
  },
  crash() {
    noise({ dur: 0.45, vol: 0.7, type: 'highpass', f: 900, att: 0.001 });
    noise({ dur: 0.8, vol: 0.6, type: 'lowpass', f: 3200, f2: 180, att: 0.002 });
    tone({ type: 'sine', f: 130, f2: 38, dur: 0.4, vol: 0.85, att: 0.002 });
    for (let i = 0; i < 5; i++) {
      tone({ type: 'triangle', f: rnd(1400, 3200), f2: rnd(900, 1800), t: 0.12 + i * rnd(0.05, 0.1), dur: 0.05, vol: 0.14, att: 0.001 });
    }
  },
  creak() {
    tone({ type: 'sawtooth', f: 190, f2: 140, dur: 0.55, vol: 0.28, bp: 650, vib: 27, vibDepth: 130, att: 0.05 });
    tone({ type: 'sawtooth', f: 150, f2: 235, t: 0.32, dur: 0.4, vol: 0.24, bp: 800, vib: 21, vibDepth: 110, att: 0.04 });
  },
  slowIn() {
    tone({ type: 'sine', f: 950, f2: 140, dur: 0.55, vol: 0.4, att: 0.01 });
    tone({ type: 'triangle', f: 475, f2: 70, dur: 0.55, vol: 0.3, att: 0.01 });
    tone({ type: 'square', f: 1900, f2: 280, dur: 0.4, vol: 0.07, lp: 2500 });
    noise({ dur: 0.55, vol: 0.28, type: 'bandpass', f: 2400, f2: 220, q: 1.2, att: 0.08 });
  },
  slowOut() {
    tone({ type: 'sine', f: 140, f2: 950, dur: 0.4, vol: 0.4, att: 0.01 });
    tone({ type: 'triangle', f: 70, f2: 475, dur: 0.4, vol: 0.3, att: 0.01 });
    noise({ dur: 0.4, vol: 0.25, type: 'bandpass', f: 220, f2: 3000, q: 1.2, att: 0.15 });
    tone({ type: 'square', f: 1568, t: 0.38, dur: 0.07, vol: 0.2, lp: 4000 });
  },
  timer() {
    tone({ type: 'square', f: 1250, dur: 0.045, vol: 0.26, lp: 4000, att: 0.002 });
    tone({ type: 'triangle', f: 625, dur: 0.07, vol: 0.28 });
  },
  buff() {
    [0, 4, 7, 12, 16].forEach((n, i) => {
      tone({ type: 'square', f: semi(660, n), t: i * 0.06, dur: 0.12, vol: 0.24, lp: 4500 });
      tone({ type: 'sine', f: semi(1320, n), t: i * 0.06 + 0.01, dur: 0.22, vol: 0.14 });
    });
    tone({ type: 'triangle', f: semi(660, 19), t: 0.3, dur: 0.35, vol: 0.28, vib: 8, vibDepth: 20 });
  },
  debuff() {
    [0, -2, -5, -8].forEach((n, i) => {
      tone({ type: 'sawtooth', f: semi(440, n), f2: semi(440, n) * 0.96, t: i * 0.1, dur: 0.16, vol: 0.22, lp: 1500 });
    });
    tone({ type: 'triangle', f: semi(440, -12), f2: semi(440, -16), t: 0.35, dur: 0.4, vol: 0.4, vib: 9, vibDepth: 60 });
  },
  thunder() {
    noise({ dur: 0.12, vol: 0.7, type: 'highpass', f: 2000, att: 0.001 });
    noise({ dur: 1.9, vol: 0.85, type: 'lowpass', f: 1400, f2: 90, att: 0.04, q: 0.6, t: 0.05 });
    tone({ type: 'sine', f: 75, f2: 32, t: 0.1, dur: 1.6, vol: 0.7, att: 0.1, vib: 11, vibDepth: 70 });
    noise({ dur: 0.9, vol: 0.4, type: 'lowpass', f: 600, f2: 120, att: 0.05, t: 0.7 });
  },
  wind() {
    noise({ dur: 1.0, vol: 0.42, type: 'bandpass', f: 450, f2: 1200, q: 2.2, att: 0.4 });
    noise({ dur: 1.0, vol: 0.34, type: 'bandpass', f: 1100, f2: 420, q: 2.0, att: 0.2, t: 0.55 });
    noise({ dur: 1.5, vol: 0.12, type: 'highpass', f: 2500, att: 0.5 });
  },
  cheer() {
    [800, 1400, 2400].forEach((f, i) => {
      noise({ dur: 1.3, vol: 0.34 - i * 0.07, type: 'bandpass', f, f2: f * 1.3, q: 1.4, att: 0.25 });
    });
    for (let i = 0; i < 7; i++) {
      const f = rnd(450, 800);
      tone({ type: 'triangle', f, f2: f * 1.6, t: rnd(0.05, 0.85), dur: rnd(0.12, 0.22), vol: 0.1, att: 0.02, lp: 3000 });
    }
  },
  firework() {
    tone({ type: 'sine', f: 480, f2: 2300, dur: 0.45, vol: 0.14, att: 0.02 });
    noise({ dur: 0.45, vol: 0.06, type: 'bandpass', f: 2000, f2: 5000, q: 1.5, att: 0.1 });
    noise({ dur: 0.4, vol: 0.6, type: 'lowpass', f: 3200, f2: 250, att: 0.002, t: 0.46 });
    tone({ type: 'sine', f: 110, f2: 38, t: 0.46, dur: 0.35, vol: 0.7, att: 0.002 });
    for (let i = 0; i < 9; i++) {
      noise({ dur: 0.035, vol: 0.22, type: 'highpass', f: 5500, att: 0.001, t: 0.55 + i * rnd(0.04, 0.09) });
    }
  },
  pitfall() {
    tone({ type: 'square', f: 900, f2: 90, dur: 0.7, vol: 0.26, lp: 2600, vib: 12, vibDepth: 80 });
    tone({ type: 'triangle', f: 450, f2: 50, dur: 0.7, vol: 0.2 });
    tone({ type: 'sine', f: 85, f2: 38, t: 0.72, dur: 0.22, vol: 0.55, att: 0.002 });
    noise({ dur: 0.1, vol: 0.2, type: 'lowpass', f: 700, t: 0.72, att: 0.001 });
  },
  stumble() {
    tone({ type: 'triangle', f: 420, f2: 190, dur: 0.3, vol: 0.5, vib: 18, vibDepth: 170, att: 0.005 });
    noise({ dur: 0.07, vol: 0.4, type: 'lowpass', f: 1200, f2: 250, t: 0.06, att: 0.001 });
    tone({ type: 'square', f: 330, f2: 170, t: 0.2, dur: 0.18, vol: 0.2, lp: 1500 });
    tone({ type: 'sine', f: 140, f2: 55, t: 0.34, dur: 0.14, vol: 0.5, att: 0.002 });
  },
  pop() {
    tone({ type: 'sine', f: 280, f2: 950, dur: 0.07, vol: 0.55, att: 0.002 });
    noise({ dur: 0.03, vol: 0.18, type: 'highpass', f: 3000, att: 0.001 });
  },
  walkie() {
    noise({ dur: 0.17, vol: 0.38, type: 'bandpass', f: 2200, f2: 1700, q: 3, att: 0.004 });
    tone({ type: 'square', f: 1500, t: 0.17, dur: 0.05, vol: 0.18, lp: 3500 });
    tone({ type: 'square', f: 1100, t: 0.25, dur: 0.05, vol: 0.14, lp: 3500 });
    noise({ dur: 0.1, vol: 0.12, type: 'highpass', f: 3000, t: 0.31, att: 0.002 });
  },
  door() {
    tone({ type: 'sawtooth', f: 210, f2: 320, dur: 0.38, vol: 0.22, bp: 500, vib: 24, vibDepth: 120, att: 0.04 });
    tone({ type: 'square', f: 2000, t: 0.02, dur: 0.02, vol: 0.12 });
    tone({ type: 'sine', f: 120, f2: 48, t: 0.4, dur: 0.22, vol: 0.75, att: 0.002 });
    noise({ dur: 0.15, vol: 0.4, type: 'lowpass', f: 900, f2: 200, t: 0.4, att: 0.001 });
  },
  card() {
    noise({ dur: 0.09, vol: 0.45, type: 'bandpass', f: 4200, f2: 1500, q: 0.9, att: 0.004 });
    noise({ dur: 0.05, vol: 0.2, type: 'highpass', f: 5200, t: 0.06, att: 0.002 });
    tone({ type: 'triangle', f: 1300, f2: 1700, t: 0.02, dur: 0.04, vol: 0.07 });
  },
  stamp() {
    tone({ type: 'sine', f: 190, f2: 58, dur: 0.16, vol: 0.85, att: 0.002 });
    noise({ dur: 0.1, vol: 0.55, type: 'lowpass', f: 1900, f2: 200, att: 0.001 });
    tone({ type: 'square', f: 900, f2: 380, t: 0.012, dur: 0.05, vol: 0.18, lp: 2200 });
  },
};

// ---------- chirp (start-of-line signature, 2-3 babble notes) ----------

const CHIRP = {
  riya:     { c: [0.30, 0.70, 0.95], step: 0.060 },
  zib:      { c: [0.85, 0.30, 0.70], step: 0.052 },
  gorp:     { c: [0.60, 0.10],       step: 0.115 },
  blorb:    { c: [0.55, 0.20],       step: 0.105 },
  bunty:    { c: [0.90, 0.30, 0.85], step: 0.040 },
  narrator: { c: [0.40, 0.60],       step: 0.075 },
};

function chirp(who) {
  try {
    if (!ready()) return;
    const v = VOICES[who] || VOICES.narrator;
    const ch = CHIRP[who] || CHIRP.narrator;
    ch.c.forEach((p, i) => {
      const f = (v.lo + (v.hi - v.lo) * p) * rnd(0.97, 1.03);
      tone({ type: v.type, f, f2: f * (i % 2 ? 0.96 : 1.06), t: i * ch.step, dur: v.dur * 1.4, vol: v.vol * 0.9,
        att: 0.006, lp: v.lp, bp: v.bp, vib: v.vib, vibDepth: v.vibDepth });
    });
    if (v.noise) noise({ dur: 0.06, vol: 0.18, type: 'bandpass', f: v.hi * 4, q: 0.9 });
  } catch (e) { /* silent */ }
}

// ---------- music ----------
// Each bar is 16 sixteenth-note steps. Melody tokens: semitones above `root` (midi), '.' rest, '-' hold.
// Bass tokens: semitones above the bar's chord root (two octaves under `root`). Drums: x hit, o accent.

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const P16 = (str) => {
  const t = String(str).trim().split(/\s+/).slice(0, 16);
  while (t.length < 16) t.push('.');
  return t;
};
const D16 = (str) => {
  const t = String(str).replace(/\s+/g, '').split('').slice(0, 16);
  while (t.length < 16) t.push('.');
  return t;
};
const CH = { M: [0, 4, 7, 12], m: [0, 3, 7, 12] };

function mkTrack(o) {
  return {
    bpm: o.bpm, swing: o.swing || 0, root: o.root,
    lead: o.lead || { type: 'square', vol: 0.34, lp: 3200 },
    bassT: o.bassT || { type: 'triangle', vol: 0.62, lp: 900 },
    arpT: o.arpT || null, rumble: !!o.rumble,
    bars: o.bars.map(([root, q, mel]) => ({ root, q: CH[q], mel: P16(mel) })),
    bass: P16(o.bass), arp: o.arp ? P16(o.arp) : null,
    kick: D16(o.kick), snare: D16(o.snare), hat: D16(o.hat),
    fill: o.fill ? D16(o.fill) : null, drumVol: o.drumVol == null ? 1 : o.drumVol,
  };
}

const TRACKS = {
  // upbeat C major, 150 bpm
  run: mkTrack({
    bpm: 150, root: 60,
    lead: { type: 'square', vol: 0.34, lp: 3400 },
    bars: [
      [0, 'M', '19 . 16 . 19 . 24 . 23 . 19 . 16 . . .'],
      [7, 'M', '19 . 23 . 26 . 23 . 19 . 14 . 19 . . .'],
      [9, 'm', '21 . 24 . 28 . 24 . 21 . 24 . 21 . . .'],
      [5, 'M', '17 . 21 . 24 . 21 . 17 . 21 . 24 . . .'],
      [0, 'M', '24 . 24 28 . 24 . 19 . 24 . 28 . 31 . .'],
      [7, 'M', '26 . 26 23 . 26 . 19 . 23 . 26 . 31 . .'],
      [5, 'M', '29 . 28 . 24 . 21 . 24 . 28 . 24 . 21 .'],
      [7, 'M', '26 . 23 . 19 . 23 . 26 . 28 . 31 - - -'],
    ],
    bass: '0 . 0 . 12 . 0 . 0 . 0 . 12 . 7 .',
    kick: 'x...x...x...x...', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.',
    fill: '....x...x.x.xxxx',
  }),
  // urgent A minor gallop, 168 bpm (cold open)
  chase: mkTrack({
    bpm: 168, root: 57,
    lead: { type: 'square', vol: 0.34, lp: 3500 },
    bassT: { type: 'sawtooth', vol: 0.5, lp: 650 },
    bars: [
      [0, 'm', '12 12 15 12 12 19 12 12 15 12 12 19 17 15 12 .'],
      [8, 'M', '20 20 24 20 20 27 20 20 24 20 20 27 24 20 17 .'],
      [10, 'M', '22 22 26 22 22 29 22 22 26 22 22 29 26 22 19 .'],
      [7, 'M', '19 19 23 19 19 26 19 19 23 19 19 26 23 19 23 .'],
      [0, 'm', '12 12 15 12 12 19 12 12 15 12 19 12 24 19 15 12'],
      [8, 'M', '20 20 24 20 20 27 20 20 24 20 27 20 32 27 24 20'],
      [10, 'M', '22 22 26 22 22 29 22 22 26 22 29 22 34 29 26 22'],
      [7, 'M', '19 19 23 19 19 26 19 19 23 19 26 19 31 26 23 19'],
    ],
    bass: '0 0 12 0 0 0 12 0 0 0 12 0 0 12 0 7',
    kick: 'x..x..x...x..x..', snare: '....x.......x..x', hat: 'xoxxxoxxxoxxxoxx',
    fill: 'x.x.xxxxxxxxxxxx',
  }),
  // light bouncy C major, 112 bpm swung
  hall: mkTrack({
    bpm: 112, swing: 0.2, root: 60,
    lead: { type: 'square', vol: 0.26, lp: 2300 },
    bassT: { type: 'triangle', vol: 0.55, lp: 800 },
    bars: [
      [0, 'M', '19 . . 16 . . 12 . . 16 . . 19 . 21 .'],
      [9, 'm', '21 . . 24 . . 28 . . 24 . . 21 . 19 .'],
      [5, 'M', '17 . . 21 . . 24 . . 21 . . 17 . 19 .'],
      [7, 'M', '19 . . 23 . . 26 . . 23 . . 19 . . .'],
      [0, 'M', '24 . . 19 . . 16 . . 19 . . 24 . 26 .'],
      [4, 'm', '28 . . 23 . . 19 . . 23 . . 28 . 26 .'],
      [5, 'M', '24 . . 21 . . 17 . . 21 . . 24 . 26 .'],
      [7, 'M', '23 . . 26 . . 29 . . 26 . . 23 . 19 .'],
    ],
    bass: '0 . . 0 . . 7 . 0 . . 0 . . 7 .',
    kick: 'x.....x...x.....', snare: '....x.......x...', hat: '..x...x...x...x.',
    drumVol: 0.7,
  }),
  // junction pulse, D minor, 132 bpm
  tense: mkTrack({
    bpm: 132, root: 62,
    lead: { type: 'square', vol: 0.22, lp: 2600 },
    bassT: { type: 'square', vol: 0.34, lp: 520 },
    bars: [
      [0, 'm', '24 . 24 . . . 24 . . . 27 . 26 . . .'],
      [0, 'm', '24 . 24 . . . 24 . . . 29 . 27 . . .'],
      [8, 'M', '20 . 20 . . . 24 . . . 27 . 24 . . .'],
      [7, 'M', '26 . 23 . 19 . . . 23 . 26 . 23 . . .'],
    ],
    bass: '0 . 0 0 . 0 0 . 0 . 0 0 . 0 0 .',
    kick: 'x.......x.......', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.',
    drumVol: 0.6,
  }),
  // dark thunder, E minor, 124 bpm
  storm: mkTrack({
    bpm: 124, root: 64, rumble: true,
    lead: { type: 'sawtooth', vol: 0.22, lp: 1800, vib: 5, vibDepth: 20 },
    bassT: { type: 'sawtooth', vol: 0.42, lp: 520 },
    bars: [
      [0, 'm', '12 . . 15 . . 19 . . 15 . 12 . . .'],
      [8, 'M', '20 . . 24 . . 27 . . 24 . 20 . . .'],
      [10, 'M', '22 . . 26 . . 29 . . 26 . 22 . . .'],
      [7, 'M', '19 . 23 . 26 . 29 . 26 . 23 . 19 . . .'],
    ],
    bass: '0 . . 0 . . 0 . 12 . . 0 . . 7 .',
    kick: 'x..x..x.x..x..x.', snare: '....x.......x.x.', hat: '..x...x...x...x.',
    drumVol: 0.85,
  }),
  // bright D major celebration, 140 bpm
  fest: mkTrack({
    bpm: 140, root: 62,
    lead: { type: 'square', vol: 0.3, lp: 3600 },
    bassT: { type: 'triangle', vol: 0.62, lp: 900 },
    arpT: { type: 'square', vol: 0.11, lp: 3000 },
    arp: '0 1 2 3 2 1 2 1 0 1 2 3 2 1 2 1',
    bars: [
      [0, 'M', '19 . 19 21 . 19 . 16 . 19 . 24 . . . .'],
      [7, 'M', '26 . 26 24 . 23 . 19 . 23 . 26 . . . .'],
      [9, 'm', '28 . 28 26 . 24 . 21 . 24 . 28 . . . .'],
      [5, 'M', '24 . 24 26 . 24 . 21 . 17 . 21 . 24 . .'],
      [0, 'M', '24 . 28 . 31 . 28 . 24 . 28 . 31 . 28 .'],
      [5, 'M', '29 . 29 . 26 . 24 . 21 . 24 . 29 . . .'],
      [7, 'M', '26 . 26 . 23 . 26 . 31 . 26 . 23 . 19 .'],
      [7, 'M', '26 . 23 . 19 . 23 . 26 . 31 - - . . .'],
    ],
    bass: '0 . 0 12 . 0 . 12 0 . 0 12 . 0 7 .',
    kick: 'x...x...x...x.x.', snare: '....x.......x...', hat: 'x.xxx.xxx.xxx.xx',
    fill: '....x...x.x.xxxx',
  }),
};

function musicNote(tr, o) {
  tone({ type: o.type, f: o.f, at: o.at, dur: o.dur, vol: o.vol, lp: o.lp, att: o.att == null ? 0.004 : o.att,
    vib: o.vib, vibDepth: o.vibDepth, dest: tr.gain, det: true });
}

function holdLen(arr, s) { let n = 1; while (s + n < 16 && arr[s + n] === '-') n++; return n; }

function playStep(tr, T, barIdx, s, when, stepDur) {
  const bar = T.bars[barIdx];
  const last = barIdx === T.bars.length - 1;
  // lead
  const m = bar.mel[s];
  if (m !== '.' && m !== '-') {
    const n = Number(m);
    if (isFinite(n)) {
      musicNote(tr, { type: T.lead.type, f: mtof(T.root + n), at: when, dur: holdLen(bar.mel, s) * stepDur * 0.92,
        vol: T.lead.vol, lp: T.lead.lp, vib: T.lead.vib, vibDepth: T.lead.vibDepth });
    }
  }
  // bass
  const b = T.bass[s];
  if (b !== '.' && b !== '-') {
    const n = Number(b);
    if (isFinite(n)) {
      musicNote(tr, { type: T.bassT.type, f: mtof(T.root - 24 + bar.root + n), at: when, dur: stepDur * 1.7,
        vol: T.bassT.vol, lp: T.bassT.lp });
    }
  }
  // arpeggio
  if (T.arp && T.arpT) {
    const a = Number(T.arp[s]);
    if (isFinite(a) && bar.q[a] != null) {
      musicNote(tr, { type: T.arpT.type, f: mtof(T.root - 12 + bar.root + bar.q[a]), at: when, dur: stepDur * 0.9,
        vol: T.arpT.vol, lp: T.arpT.lp });
    }
  }
  // drums
  const dv = T.drumVol;
  const snare = last && T.fill ? T.fill : T.snare;
  const dest = tr.gain;
  if (T.kick[s] === 'x' || T.kick[s] === 'o') {
    tone({ type: 'sine', f: 150, f2: 45, at: when, dur: 0.13, vol: 0.75 * dv, att: 0.002, dest, det: true });
  }
  if (snare[s] === 'x' || snare[s] === 'o') {
    noise({ at: when, dur: 0.1, vol: 0.34 * dv, type: 'bandpass', f: 1900, q: 0.8, att: 0.001, dest });
    tone({ type: 'triangle', f: 210, f2: 120, at: when, dur: 0.07, vol: 0.2 * dv, att: 0.001, dest, det: true });
  }
  if (T.hat[s] === 'x' || T.hat[s] === 'o') {
    noise({ at: when, dur: T.hat[s] === 'o' ? 0.07 : 0.03, vol: (T.hat[s] === 'o' ? 0.16 : 0.1) * dv,
      type: 'highpass', f: 7000, att: 0.001, dest });
  }
  if (T.rumble && s === 0 && barIdx % 2 === 0) {
    noise({ at: when, dur: 0.9, vol: 0.28, type: 'lowpass', f: 260, f2: 70, att: 0.1, q: 0.7, dest });
  }
}

function schedTrack(tr, horizon) {
  const T = TRACKS[tr.name];
  const per = T.bars.length * 16;
  const stepDur = 60 / T.bpm / 4 / tempoMul;
  let guard = 0;
  while (tr.next < horizon && guard++ < 64) {
    const idx = tr.step % per;
    const barIdx = Math.floor(idx / 16);
    const s = idx % 16;
    const when = tr.next + (s % 2 ? T.swing * stepDur : 0);
    playStep(tr, T, barIdx, s, when, stepDur);
    tr.step++;
    tr.next += stepDur;
  }
}

function musicTick() {
  try {
    if (!curTrack || !ctx) { clearInterval(musicTimer); musicTimer = null; return; }
    if (ctx.state !== 'running') return;
    const now = ctx.currentTime;
    if (muted) { curTrack.next = now + 0.05; return; }
    if (curTrack.next < now - 0.15) curTrack.next = now + 0.03; // fell behind (throttled timer): skip ahead
    schedTrack(curTrack, now + 0.1);
  } catch (e) { /* silent */ }
}

function startTrack(name) {
  const now = ctx.currentTime;
  const old = curTrack;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.linearRampToValueAtTime(1, now + 0.3);
  g.connect(musicFilter);
  curTrack = { name, gain: g, step: 0, next: now + 0.05 };
  if (old) fadeOut(old);
  if (!musicTimer) musicTimer = setInterval(musicTick, 25);
  musicTick();
}

function fadeOut(tr) {
  try {
    const now = ctx.currentTime;
    const p = tr.gain.gain;
    p.cancelScheduledValues(now);
    p.setValueAtTime(Math.max(0.0001, p.value), now);
    p.linearRampToValueAtTime(0.0001, now + 0.3);
    setTimeout(() => { try { tr.gain.disconnect(); } catch (e) { /* ignore */ } }, 700);
  } catch (e) { /* ignore */ }
}

function applyMusic() {
  if (!ctx || ctx.state !== 'running' || !musicFilter) return;
  if (!wantedMusic) {
    if (curTrack) { const old = curTrack; curTrack = null; fadeOut(old); }
    return;
  }
  if (!curTrack || curTrack.name !== wantedMusic) startTrack(wantedMusic);
}

function applySlow(fast) {
  if (!ctx || !musicFilter) return;
  const t = ctx.currentTime;
  const dur = fast ? 0.001 : 0.25;
  const f = musicFilter.frequency;
  f.cancelScheduledValues(t);
  f.setValueAtTime(Math.max(20, f.value), t);
  f.exponentialRampToValueAtTime(slow ? 600 : FILTER_OPEN, t + dur);
  if (detuneCtl) {
    const o = detuneCtl.offset;
    o.cancelScheduledValues(t);
    o.setValueAtTime(o.value, t);
    o.linearRampToValueAtTime(slow ? -300 : 0, t + dur);
  }
}

// ---------- speech ----------

const SPEECH = {
  riya:     { lang: 'hi', pitch: 1.55, rate: 1.08, g: 'f' },
  zib:      { lang: 'en', pitch: 1.30, rate: 1.12, g: 'f' },
  gorp:     { lang: 'hi', pitch: 0.35, rate: 0.85, g: 'm' },
  blorb:    { lang: 'hi', pitch: 0.70, rate: 0.95, g: 'm' },
  bunty:    { lang: 'hi', pitch: 1.15, rate: 1.30, g: 'm' },
  narrator: { lang: 'en', pitch: 1.00, rate: 1.05, g: '' },
};

let voices = [];
let picks = {};
let voiceTimer = null;
let voiceTries = 0;
let cur = null; // the line currently being spoken: { resolve, done, started, timer, delayT, u }

function synth() {
  try { return (typeof speechSynthesis !== 'undefined' && typeof SpeechSynthesisUtterance !== 'undefined') ? speechSynthesis : null; }
  catch (e) { return null; }
}

function refreshVoices() {
  try {
    const s = synth();
    if (!s) return;
    const v = s.getVoices ? s.getVoices() : [];
    if (v && v.length !== voices.length) { voices = Array.prototype.slice.call(v); picks = {}; }
    else if (v && v.length && !voices.length) { voices = Array.prototype.slice.call(v); picks = {}; }
  } catch (e) { /* ignore */ }
}

function initSpeech() {
  try {
    const s = synth();
    if (!s) return;
    refreshVoices();
    if (s.addEventListener) s.addEventListener('voiceschanged', refreshVoices);
    else s.onvoiceschanged = refreshVoices;
    // Some Chrome builds never fire voiceschanged: poll for a few seconds.
    voiceTimer = setInterval(() => {
      refreshVoices();
      if (voices.length || ++voiceTries > 20) { clearInterval(voiceTimer); voiceTimer = null; }
    }, 300);
  } catch (e) { /* ignore */ }
}

const normLang = (l) => String(l || '').replace('_', '-').toLowerCase();
const NAME_GOOD = /google|natural|neural/i;
const NAME_F = /female|kalpana|swara|neerja|heera|veena|lekha|aditi|priya|zira|hazel|susan|sonia|samantha/i;
const NAME_M = /\bmale\b|hemant|ravi|madhur|prabhat|rishi|james|george|ryan|daniel|david|mark/i;

function scoreVoice(v, kind, gender) {
  const l = normLang(v.lang);
  let sc = -1;
  if (kind === 'hi') {
    if (l === 'hi-in') sc = 20; else if (l.indexOf('hi') === 0) sc = 15;
  } else if (l === 'en-in') sc = 30;
  else if (l === 'en-gb') sc = 20;
  else if (l.indexOf('en') === 0) sc = 10;
  if (sc < 0) return -1;
  const n = v.name || '';
  if (NAME_GOOD.test(n)) sc += 6;
  const isF = /female/i.test(n) || (NAME_F.test(n) && !/\bmale\b/i.test(n) && !/^google/i.test(n));
  const isM = !isF && NAME_M.test(n);
  if (gender === 'f') sc += isF ? 3 : isM ? -3 : 0;
  else if (gender === 'm') sc += isM ? 3 : isF ? -3 : 0;
  return sc;
}

function pickFor(who, kind) {
  const key = who + ':' + kind;
  if (key in picks) return picks[key];
  const gender = (SPEECH[who] || SPEECH.narrator).g;
  let best = null, bs = -1;
  for (const v of voices) {
    const sc = scoreVoice(v, kind, gender);
    if (sc > bs) { bs = sc; best = v; }
  }
  if (voices.length) picks[key] = best; // do not cache while voices are still loading
  return best;
}

function finish(c, spoken) {
  if (!c || c.done) return;
  c.done = true;
  clearTimeout(c.timer); clearTimeout(c.delayT);
  if (cur === c) cur = null;
  try { c.resolve({ spoken: !!spoken }); } catch (e) { /* ignore */ }
}

function stopSpeech() {
  stopClip();
  try {
    const c = cur;
    const s = synth();
    try { if (s) s.cancel(); } catch (e) { /* ignore */ }
    if (c) finish(c, c.started);
  } catch (e) { /* silent */ }
}

// ---------- recorded voices (dev/voices.mjs) ----------
// Natural recordings beat the browser's robotic voices, so a recorded line always wins.
// Lines without a recording fall back to the chirp + subtitles, never to browser TTS.

const VOICE_GAIN = 2.4;          // under MASTER 0.35 -> ~0.84
const voiceBufs = {};            // id -> Promise<AudioBuffer|null>
let clip = null;                 // { src, c }

export function voiceId(who, text) {
  let h = 0x811c9dc5;
  for (const ch of who + '|' + text) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}
const hasClip = (who, text) => RECORDED.has(voiceId(who, text));

function loadClip(id) {
  if (!voiceBufs[id]) {
    voiceBufs[id] = fetch('audio/voice/' + id + '.mp3')
      .then((r) => (r.ok ? r.arrayBuffer() : null))
      .then((ab) => (ab && ctx ? new Promise((res) => ctx.decodeAudioData(ab, res, () => res(null))) : null))
      .catch(() => null);
  }
  return voiceBufs[id];
}

function duck(on) {
  try {
    if (!musicBus || !ctx) return;
    const g = musicBus.gain, t = ctx.currentTime;
    g.cancelScheduledValues(t);
    g.setTargetAtTime(on ? MUSIC_GAIN * 0.35 : MUSIC_GAIN, t, on ? 0.05 : 0.25);
  } catch (e) { /* ignore */ }
}

function stopClip() {
  const k = clip;
  clip = null;
  if (!k) return;
  try { k.src.onended = null; k.src.stop(); } catch (e) { /* ignore */ }
  duck(false);
  finish(k.c, true);
}

function sayClip(c, id, fallbackMs) {
  loadClip(id).then((buf) => {
    if (c.done) return;
    if (!buf || !ready() || ctx.state !== 'running') { chirp(c.who); c.delayT = setTimeout(() => finish(c, false), fallbackMs); return; }
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    g.gain.value = VOICE_GAIN;
    src.buffer = buf;
    src.connect(g); g.connect(master);
    clip = { src, c };
    c.started = true;
    duck(true);
    src.onended = () => { if (clip && clip.src === src) { clip = null; duck(false); } finish(c, true); };
    c.timer = setTimeout(() => stopClip(), buf.duration * 1000 + 1500);
    src.start();
  });
}

// Fetch every recording in the background once sound is unlocked, a few at a time.
function preloadVoices() {
  if (!ctx) return;
  const ids = [...RECORDED];
  let i = 0;
  const next = () => { if (i < ids.length) loadClip(ids[i++]).then(next); };
  for (let n = 0; n < 3; n++) next();
}

function say(who, line) {
  return new Promise((resolve) => {
    let c = null;
    try {
      stopSpeech();
      stopClip();
      const l = typeof line === 'string' ? { text: line } : (line || {});
      const text = String(l.text != null ? l.text : (l.say || ''));
      if (RECORDED.size) {
        c = { resolve, done: false, started: false, timer: 0, delayT: 0, who, t0: Date.now() };
        cur = c;
        if (hasClip(who, text) && !muted) sayClip(c, voiceId(who, text), 600 + 45 * text.length);
        else { chirp(who); c.delayT = setTimeout(() => finish(c, false), 600 + 45 * text.length); }
        return;
      }
      const sp = SPEECH[who] || SPEECH.narrator;
      const fallbackMs = 600 + 45 * text.length;
      c = { resolve, done: false, started: false, timer: 0, delayT: 0, u: null, t0: Date.now() };
      cur = c;
      chirp(who);
      const s = synth();
      refreshVoices();
      if (!s || muted || !voices.length || (typeof document !== 'undefined' && document.hidden) || !text.trim()) {
        c.delayT = setTimeout(() => finish(c, false), fallbackMs);
        return;
      }
      // choose voice + string: Devanagari with a hi voice, else Roman text with an English voice
      let str = text, voice = null;
      const hv = l.say ? pickFor(who, 'hi') : null;
      if (hv && l.say) { str = String(l.say); voice = hv; }
      else { voice = pickFor(who, 'en'); }
      const safetyMs = 1500 + 90 * str.length;
      c.timer = setTimeout(() => {
        try { if (s) s.cancel(); } catch (e) { /* ignore */ }
        finish(c, c.started);
      }, safetyMs);
      const go = () => {
        if (c.done) return;
        try {
          try { s.resume(); } catch (e) { /* ignore */ }
          const u = new SpeechSynthesisUtterance(str);
          if (voice) { u.voice = voice; u.lang = voice.lang; }
          else u.lang = (hv && l.say) ? 'hi-IN' : 'en-IN';
          u.pitch = sp.pitch; u.rate = sp.rate; u.volume = 1;
          u.onstart = () => { c.started = true; };
          u.onend = () => finish(c, true);
          u.onerror = (e) => {
            const er = e && e.error;
            if (c.started || er === 'interrupted' || er === 'canceled') { finish(c, c.started); return; }
            const remain = Math.max(0, fallbackMs - (Date.now() - c.t0));
            clearTimeout(c.timer);
            c.delayT = setTimeout(() => finish(c, false), remain);
          };
          c.u = u; // keep a reference: Chrome can GC an utterance and drop its events
          s.speak(u);
        } catch (e) { finish(c, false); }
      };
      // Chrome sometimes drops a speak() issued right after cancel(): give it a tick.
      let busy = false;
      try { busy = !!(s.speaking || s.pending); } catch (e) { busy = false; }
      if (busy) { c.delayT = setTimeout(go, 60); } else go();
    } catch (e) {
      try { if (c) finish(c, false); else resolve({ spoken: false }); } catch (e2) { /* ignore */ }
    }
  });
}

function canSpeak() {
  if (RECORDED.size) return !muted && !!ctx; // recordings carry the voice; no per-letter babble on top
  try { refreshVoices(); return !!synth() && voices.length > 0 && !muted; } catch (e) { return false; }
}

function voiceInfo() {
  try {
    refreshVoices();
    const out = { supported: !!synth(), count: voices.length, voices: voices.map(v => ({ name: v.name, lang: v.lang, local: !!v.localService })), picks: {} };
    Object.keys(SPEECH).forEach((who) => {
      const h = pickFor(who, 'hi'), e = pickFor(who, 'en');
      out.picks[who] = { hi: h ? h.name + ' (' + h.lang + ')' : null, en: e ? e.name + ' (' + e.lang + ')' : null };
    });
    return out;
  } catch (e) { return { supported: false, count: 0, voices: [], picks: {} }; }
}

try {
  initSpeech();
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      try {
        if (document.hidden) {
          stopSpeech();
          if (ctx && ctx.state === 'running') { suspendedByUs = true; const p = ctx.suspend(); if (p && p.catch) p.catch(() => {}); }
        } else if (suspendedByUs && ctx) {
          suspendedByUs = false;
          const p = ctx.resume(); if (p && p.catch) p.catch(() => {});
        }
      } catch (e) { /* silent */ }
    });
  }
  if (typeof window !== 'undefined') window.addEventListener('pagehide', () => stopSpeech());
} catch (e) { /* silent */ }

// ---------- public api ----------

export const audio = {
  unlock() {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = muted ? 0 : MASTER;
        master.connect(ctx.destination);
        noiseBuf = makeNoise();
        musicBus = ctx.createGain();
        musicBus.gain.value = MUSIC_GAIN;
        musicBus.connect(master);
        musicFilter = ctx.createBiquadFilter();
        musicFilter.type = 'lowpass';
        musicFilter.Q.value = 0.7;
        musicFilter.frequency.value = slow ? 600 : FILTER_OPEN;
        musicFilter.connect(musicBus);
        try {
          if (ctx.createConstantSource) {
            detuneCtl = ctx.createConstantSource();
            detuneCtl.offset.value = slow ? -300 : 0;
            detuneCtl.start();
          }
        } catch (e) { detuneCtl = null; }
        try { ctx.addEventListener('statechange', () => { try { applyMusic(); } catch (e) { /* ignore */ } }); } catch (e) { /* ignore */ }
      }
      if (ctx.state !== 'running') { // 'suspended', or iOS 'interrupted' after an app switch
        suspendedByUs = false;
        const p = ctx.resume();
        if (p && p.then) p.then(() => { try { applyMusic(); } catch (e) { /* ignore */ } }, () => {});
      } else applyMusic();
    } catch (e) { /* silent */ }
  },
  setMuted(m) {
    muted = !!m;
    try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch (e) { /* ignore */ }
    try { if (master) master.gain.value = muted ? 0 : MASTER; } catch (e) { /* ignore */ }
    if (muted) stopSpeech();
  },
  isMuted() { return muted; },
  babble,
  sfx(name) {
    try {
      if (!ready()) return;
      const fn = SFX[name];
      if (fn) fn();
    } catch (e) { /* silent */ }
  },
  say,
  canSpeak,
  stopSpeech,
  warmup() {
    try {
      audio.unlock();
      preloadVoices();
      refreshVoices();
      const s = synth();
      if (s) {
        const u = new SpeechSynthesisUtterance(' ');
        u.volume = 0;
        u.lang = 'en-IN';
        s.speak(u); // inside the user gesture: lets Android Chrome speak later without one
      }
    } catch (e) { /* silent */ }
  },
  music(name) {
    try {
      if (name != null && !TRACKS[name]) return;
      wantedMusic = name || null;
      applyMusic(); // no-op until the context is running; unlock() applies the remembered request
    } catch (e) { /* silent */ }
  },
  slowmo(on) {
    try {
      slow = !!on;
      tempoMul = slow ? 0.8 : 1;
      applySlow(false);
    } catch (e) { /* silent */ }
  },
  voiceInfo,
  tracks: Object.keys(TRACKS),
  sfxNames: Object.keys(SFX),
};

export default audio;
