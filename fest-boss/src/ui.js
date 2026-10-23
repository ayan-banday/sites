// Fest Boss 2: every piece of UI is an overlay on top of the full-screen game canvas.
// Each function mounts something into #overlay and (where it asks the player for something) returns a Promise.
// Content and art are read defensively: a missing sprite or string never throws, it falls back.
import { spriteURL } from './art.js';
import { audio } from './audio.js';
import * as CONTENT from './content.js';

const STYLES = CONTENT.STYLES || [];
const CAST = CONTENT.CAST || CONTENT.CREATURES || {};
const COPY = CONTENT.COPY || {};
const PROFILES = CONTENT.PROFILES || {};

const NS = 'http://www.w3.org/2000/svg';
const TYPE_MS = 24;
const CAST_FALLBACK = {
  riya: { name: 'Riya', color: '#9B6BFF' }, zib: { name: 'Zib', color: '#2EC4B6' },
  gorp: { name: 'Gorp', color: '#8DBB3A' }, blorb: { name: 'Dean Blorb', color: '#C98B5A' },
  bunty: { name: 'Bunty Bhaiya', color: '#6E7FD8' }, narrator: { name: 'Narrator', color: '#FFC93C' },
};
const STYLE_FALLBACK = [
  { id: 'direct', name: 'Direct', level: 4, skill: 'low', will: 'high', color: '#FF8A3D', quote: 'Main dikhata hoon', tagline: 'Tell them how' },
  { id: 'coach', name: 'Coach', level: 3, skill: 'low', will: 'low', color: '#FFC93C', quote: 'Saath karo, main samjhaunga', tagline: 'Show how, explain why' },
  { id: 'support', name: 'Support', level: 2, skill: 'high', will: 'low', color: '#FF8FC7', quote: 'Tu kar sakta hai', tagline: 'Listen, cheer, back them' },
  { id: 'delegate', name: 'Delegate', level: 1, skill: 'high', will: 'high', color: '#2EC4B6', quote: 'Poora tera', tagline: 'Hand it over, step back' },
];
const BUFF_ICON = { sync: 'buff_sync', resentful: 'debuff_resentful', lost: 'debuff_lost' };
const BUFF_FALLBACK = { sync: 'In Sync', resentful: 'Resentful', lost: 'Lost' };
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

// ---------- small helpers ----------

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
const cap = s => (s ? s[0].toUpperCase() + s.slice(1) : '');
const copy = (key, fb) => (COPY[key] != null ? COPY[key] : fb);
const lineText = l => (typeof l === 'string' ? l : (l && l.text) || '');

function sfx(name) { try { audio.sfx && audio.sfx(name); } catch { /* sound is optional */ } }
function canSpeak() { try { return !!(audio.canSpeak && audio.canSpeak()); } catch { return false; } }
function stopSpeech() { try { audio.stopSpeech && audio.stopSpeech(); } catch { /* ignore */ } }

// sprite(name): an <img> from art.js, or a plain-text stand-in when the sprite does not exist (yet).
function spriteSrc(name, frame = 0) {
  try { return spriteURL(name, frame) || ''; } catch { return ''; }
}
function sprite(name, frame = 0, cls = '', fallback = '') {
  const src = spriteSrc(name, frame);
  if (src) return el('img', { class: cls, src, alt: '', draggable: 'false' });
  return el('span', { class: `${cls} nosprite`, 'aria-hidden': 'true' }, fallback);
}

function cast(who) {
  const c = CAST[who] || {};
  const f = CAST_FALLBACK[who] || {};
  return { id: who, name: c.name || f.name || cap(who || 'narrator'), color: c.color || f.color || '#FFC93C' };
}
// Creature portrait in a coloured tile; falls back to an initial if the sprite is missing.
function portrait(who, cls = '') {
  const c = cast(who);
  const src = who && who !== 'narrator' ? spriteSrc(who, 0) : '';
  return el('span', { class: `portrait ${cls}`, style: `--pc:${c.color}` },
    src ? el('img', { src, alt: '', draggable: 'false' }) : el('span', { class: 'ph-initial', 'aria-hidden': 'true' }, c.name[0] || '?'));
}

function styleList() {
  const base = STYLES.length ? STYLES : STYLE_FALLBACK;
  return base.map(s => {
    const f = STYLE_FALLBACK.find(x => x.id === s.id) || {};
    return {
      id: s.id, name: s.name || s.label || cap(s.id), color: s.color || f.color || '#FFC93C',
      icon: s.icon || `sign_${s.id}`, quote: s.quote || s.hint || f.quote || '', tagline: s.tagline || f.tagline || '',
      skill: s.skill || f.skill, will: s.will || f.will, level: s.level ?? f.level,
    };
  });
}
function styleById(id) {
  return styleList().find(s => s.id === id) || { id, name: cap(id || '?'), color: '#FFC93C', icon: `sign_${id}`, quote: '', tagline: '' };
}

// Tiny pixel pictures drawn as SVG so they never depend on a font having the glyph.
const PX = {
  check: ['........##.', '.......###.', '......###..', '##...###...', '###.###....', '.#####.....', '..###......', '...#.......'],
  up: ['....#....', '...###...', '..#####..', '.#######.', '...###...', '...###...', '...###...', '...###...', '...###...'],
  down: ['...###...', '...###...', '...###...', '...###...', '...###...', '.#######.', '..#####..', '...###...', '....#....'],
  hand: [
    '....###.......', '...#ccc#......', '...#ccc#......', '...#ccc#......', '...#ccc#.##...', '...#ccc##cc#..',
    '.###ccc#ccc##.', '#cc#cccccccc#.', '#ccccccccccc#.', '.#cccccccccc#.', '.#cccccccccc#.', '..#ccccccccc#.',
    '..#ccccccccc#.', '...#cccccccc#.', '...#cccccccc#.', '....########..',
  ],
};
function pxSvg(map, cls, colors) {
  const h = map.length, w = map[0].length;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('class', cls);
  svg.setAttribute('aria-hidden', 'true');
  map.forEach((row, y) => {
    for (let x = 0; x < w; x++) {
      const ch = row[x];
      if (ch === '.') continue;
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', 1); r.setAttribute('height', 1);
      r.setAttribute('fill', colors ? colors[ch] : 'currentColor');
      svg.append(r);
    }
  });
  return svg;
}

const live = () => document.getElementById('sr-live');

// ---------- keys: one active handler at a time ----------

let keyHandler = null;
window.addEventListener('keydown', e => {
  if (!keyHandler || e.repeat) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.target instanceof HTMLElement && e.target.closest('input, textarea')) return;
  // A focused button already turns Enter/Space into a click; handling it here too would double-fire.
  if ((e.key === 'Enter' || e.key === ' ') && e.target instanceof HTMLElement && e.target.closest('button, a')) return;
  if (keyHandler(e) === true) e.preventDefault();
});
function onKeys(fn) { keyHandler = fn; }
export function clearKeys() { keyHandler = null; }
const isAdvanceKey = e => e.key === 'Enter' || e.key === ' ';

// ---------- typewriter ----------

// Types text into node. Real speech does the voice; babble only fills in when nobody is speaking.
function typewrite(node, text, who, speed = TYPE_MS) {
  text = String(text || '');
  let i = 0, timer = null, finished = false;
  let resolve;
  const done = new Promise(r => { resolve = r; });
  const caret = el('span', { class: 'caret', 'aria-hidden': 'true' });
  const textNode = document.createTextNode('');
  node.replaceChildren(el('span', { class: 'sr-only' }, text), el('span', { 'aria-hidden': 'true' }, textNode), caret);

  const end = () => { finished = true; timer = null; caret.remove(); resolve(); };
  const finish = () => {
    if (finished) return;
    clearTimeout(timer);
    i = text.length;
    textNode.data = text;
    end();
  };
  const step = () => {
    i++;
    textNode.data = text.slice(0, i);
    const ch = text[i - 1];
    if (ch !== ' ' && !canSpeak()) { try { audio.babble && audio.babble(who, ch); } catch { /* ignore */ } }
    if (i >= text.length) { end(); return; }
    timer = setTimeout(step, /[.!?]/.test(ch) ? 190 : ch === ',' ? 100 : speed);
  };
  if (!text) end(); else timer = setTimeout(step, 90);
  return { done, finish, isTyping: () => !finished };
}

// Speak a line; always resolves, never throws. {spoken} tells whether a real voice was used.
async function speak(who, line) {
  const obj = typeof line === 'string' ? { who, text: line } : (line || { who, text: '' });
  const text = obj.text || '';
  try {
    if (audio.say) {
      const r = await audio.say(who, obj);
      return r || { spoken: false };
    }
  } catch { /* fall through to a timed wait */ }
  await sleep(600 + 45 * text.length);
  return { spoken: false };
}

// ---------- shell: overlay, mute button, rotate prompt ----------

let ready = false;
let frame = null, root = null, muteBtn = null, rotateEl = null;
const L = {};
const screens = new Set();

function setAspect(w, h) {
  if (!frame || !(w > 0) || !(h > 0)) return;
  frame.style.setProperty('--ar', String(w / h));
}
export { setAspect };

function mount(node) { L.screens.append(node); screens.add(node); return node; }
function dismiss(node, ms = 240) {
  screens.delete(node);
  node.classList.add('out');
  setTimeout(() => node.remove(), ms);
}
export function clearScreens() {
  for (const n of screens) n.remove();
  screens.clear();
  clearKeys();
}

const SND_SVG = '<svg viewBox="0 0 16 16" width="100%" height="100%" aria-hidden="true" shape-rendering="crispEdges"><path class="snd-on" d="M2 6h3l4-3v10l-4-3H2zM11 5h1v6h-1zM13 3h1v10h-1z"/><path class="snd-off" d="M2 6h3l4-3v10l-4-3H2zM11 6h1v1h1v1h1V7h1v1h-1v1h1v1h-1V9h-1v1h-1V9h1V8h-1z"/></svg>';

export function init() {
  if (ready) return;
  ready = true;
  let host = document.getElementById('overlay');
  if (!host) {
    host = el('div', { id: 'overlay' });
    (document.getElementById('stage-wrap') || document.body).append(host);
  }
  host.replaceChildren();

  L.screens = el('div', { class: 'layer l-screens' });
  L.hud = el('div', { class: 'layer l-hud' });
  L.tip = el('div', { class: 'layer l-tip' });
  L.bark = el('div', { class: 'layer l-bark', 'aria-live': 'polite' });
  L.toast = el('div', { class: 'layer l-toast', 'aria-live': 'polite' });
  L.chapter = el('div', { class: 'layer l-chapter' });

  muteBtn = el('button', { class: 'mute', type: 'button', 'aria-pressed': 'false', 'aria-label': 'Mute sound' });
  muteBtn.innerHTML = SND_SVG;
  const syncMute = () => {
    let m = false;
    try { m = !!audio.isMuted(); } catch { /* ignore */ }
    muteBtn.setAttribute('aria-pressed', String(m));
    muteBtn.setAttribute('aria-label', m ? 'Unmute sound' : 'Mute sound');
  };
  muteBtn.addEventListener('click', e => {
    e.stopPropagation();
    try { audio.unlock && audio.unlock(); audio.setMuted(!audio.isMuted()); } catch { /* ignore */ }
    syncMute();
  });
  syncMute();

  root = el('div', { class: 'ov-root' }, L.screens, L.hud, L.tip, L.bark, L.toast, L.chapter, muteBtn);
  frame = el('div', { class: 'ov-frame' }, root);

  rotateEl = el('div', { class: 'rotate', role: 'alert', hidden: true },
    el('div', { class: 'rot-stars', 'aria-hidden': 'true' }),
    el('div', { class: 'rot-phone', 'aria-hidden': 'true' }, el('span', { class: 'rot-notch' }), el('span', { class: 'rot-heart' })),
    el('p', { class: 'rot-title' }, copy('rotate', 'Turn your phone sideways')),
    el('p', { class: 'rot-sub' }, copy('rotateSub', 'Fest Boss plays in landscape')));
  host.append(frame, rotateEl);

  // Match the game's letterboxed rectangle when view.js is around.
  import('./view.js').then(m => { if (m && m.W && m.H) setAspect(m.W, m.H); }).catch(() => {});

  setupOrientation();
}

// ---------- orientation ----------

const orientationCbs = new Set();
let blocked = false;
function computeBlocked() {
  try {
    const portrait = window.matchMedia('(orientation: portrait)').matches;
    if (!portrait) return false;
    const touch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    return touch || window.innerWidth < 700;
  } catch { return false; }
}
function updateOrientation() {
  const b = computeBlocked();
  if (b === blocked) return;
  blocked = b;
  if (rotateEl) rotateEl.hidden = !b;
  document.documentElement.classList.toggle('is-portrait-blocked', b);
  for (const cb of orientationCbs) { try { cb(b); } catch { /* a bad listener must not break the others */ } }
}
function setupOrientation() {
  try {
    const mq = window.matchMedia('(orientation: portrait)');
    if (mq.addEventListener) mq.addEventListener('change', updateOrientation);
  } catch { /* ignore */ }
  window.addEventListener('resize', updateOrientation);
  window.addEventListener('orientationchange', updateOrientation);
  updateOrientation();
}
// cb(blocked): true when the "turn your phone" screen is up (pause the game), false when it is gone (resume).
export function onOrientation(cb) {
  orientationCbs.add(cb);
  return () => orientationCbs.delete(cb);
}
export function isBlocked() { return blocked; }

// ---------- title ----------

function goFullscreenLandscape() {
  try {
    if (!window.matchMedia('(pointer: coarse)').matches) return;
    const lock = () => {
      try {
        const r = window.screen.orientation && window.screen.orientation.lock && window.screen.orientation.lock('landscape');
        if (r && r.catch) r.catch(() => {});
      } catch { /* iPhone cannot; the rotate prompt covers it */ }
    };
    const d = document.documentElement;
    if (!document.fullscreenElement && d.requestFullscreen) {
      const r = d.requestFullscreen({ navigationUI: 'hide' });
      if (r && r.then) r.then(lock, () => {}); else lock();
    } else lock();
  } catch { /* ignore */ }
}

export function title({ mode = 'short' } = {}) {
  init();
  return new Promise(resolve => {
    let cur = mode === 'long' ? 'long' : 'short';
    let started = false;
    const segs = {};
    const mk = m => {
      const b = el('button', { class: 'seg', type: 'button', 'data-m': m, 'aria-pressed': String(m === cur) },
        copy(m, m === 'long' ? 'Full fest · 10 min' : 'Quick fest · 6 min'));
      b.addEventListener('click', e => {
        e.stopPropagation();
        cur = m;
        sfx('select');
        for (const k in segs) segs[k].setAttribute('aria-pressed', String(k === cur));
      });
      segs[m] = b;
      return b;
    };
    const scr = el('div', { class: 'screen title modal', role: 'button', tabindex: '0', 'aria-label': `${copy('title', 'Fest Boss')}. ${copy('tap', 'TAP TO RUN')}` },
      el('div', { class: 'tt-center' },
        el('h1', { class: 'logo' }, el('span', {}, 'FEST'), ' ', el('span', {}, 'BOSS')),
        el('p', { class: 'tt-sub' }, copy('subtitle', 'Lead the Situation')),
        el('p', { class: 'tt-tap' }, copy('tap', 'TAP TO RUN'))),
      el('div', { class: 'tt-mode', role: 'group', 'aria-label': copy('modeSwitch', 'Change mode') }, mk('short'), mk('long')));
    const go = () => {
      if (started) return;
      started = true;
      try { audio.unlock && audio.unlock(); } catch { /* ignore */ }
      try { audio.warmup && audio.warmup(); } catch { /* ignore */ }
      goFullscreenLandscape();
      sfx('confirm');
      clearKeys();
      dismiss(scr, 320);
      resolve({ mode: cur });
    };
    scr.addEventListener('click', go);
    onKeys(e => { if (isAdvanceKey(e)) { go(); return true; } });
    mount(scr);
    try { scr.focus({ preventScroll: true }); } catch { /* ignore */ }
  });
}

// ---------- barks (walkie strip, top centre) ----------

const barkQ = [];
let barkBusy = false;
let barkGen = 0;
let curBark = null;

export function bark(line) {
  init();
  // Keep barks in step with the run: if lines pile up, the oldest waiting one is dropped.
  return new Promise(res => { while (barkQ.length >= 2) barkQ.shift().res(); barkQ.push({ line, res }); pumpBarks(); });
}
async function pumpBarks() {
  if (barkBusy) return;
  barkBusy = true;
  while (barkQ.length) {
    const { line, res } = barkQ.shift();
    try { await showBark(line); } catch { /* skip a broken bark */ }
    res();
  }
  barkBusy = false;
}
async function showBark(line) {
  const l = typeof line === 'string' ? { who: 'narrator', text: line } : (line || {});
  const who = l.who || 'narrator';
  const c = cast(who);
  const textEl = el('span', { class: 'bk-text' });
  const node = el('div', { class: 'bark', style: `--pc:${c.color}` },
    portrait(who, 'bk-portrait'),
    el('div', { class: 'bk-body' },
      el('div', { class: 'bk-name' }, el('span', {}, c.name), el('i', { class: 'bk-led', 'aria-hidden': 'true' })),
      textEl));
  L.bark.replaceChildren(node);
  sfx('walkie');
  let cancelled = false;
  let wake;
  const cancelP = new Promise(r => { wake = r; });
  curBark = { cancel() { cancelled = true; wake(); } };
  const t0 = performance.now();
  typewrite(textEl, l.text, who);
  await Promise.race([speak(who, l), cancelP]);
  if (!cancelled) {
    const left = Math.max(2200 - (performance.now() - t0), 300);
    await Promise.race([sleep(left), cancelP]);
  }
  curBark = null;
  if (cancelled) { node.remove(); return; }
  node.classList.add('out');
  await sleep(220);
  node.remove();
}
export function clearBarks() {
  barkGen++;
  for (const q of barkQ.splice(0)) q.res();
  if (curBark) curBark.cancel();
  stopSpeech();
  if (L.bark) L.bark.replaceChildren();
}

// ---------- dialogue (bottom box, scenes) ----------

export function dialogue(lines) {
  init();
  lines = (lines || []).filter(Boolean);
  return new Promise(resolve => {
    if (!lines.length) { resolve(); return; }
    let idx = 0, typing = null, token = 0, textDone = false, speechDone = false, autoT = null, shownAt = 0, over = false;
    const portraitSlot = el('div', { class: 'dl-pslot' });
    const nameEl = el('div', { class: 'dl-name' });
    const textEl = el('p', { class: 'dl-text' });
    const chev = el('span', { class: 'dl-chev', 'aria-hidden': 'true' }, copy('tapShort', 'tap'), el('i', {}));
    const box = el('div', { class: 'dl-box card', 'aria-live': 'polite' },
      portraitSlot, el('div', { class: 'dl-main' }, nameEl, textEl), chev);
    const scr = el('div', { class: 'screen dialogue modal' }, box);

    const finishAll = () => {
      if (over) return;
      over = true;
      clearTimeout(autoT);
      clearKeys();
      dismiss(scr);
      resolve();
    };
    const maybeAuto = my => {
      if (my !== token || !(textDone && speechDone)) return;
      clearTimeout(autoT);
      autoT = setTimeout(() => { if (my === token) next(); }, 500);
    };
    const show = i => {
      const my = ++token;
      textDone = false; speechDone = false;
      clearTimeout(autoT);
      shownAt = performance.now();
      const line = lines[i];
      const who = line.who || 'narrator';
      const c = cast(who);
      box.style.setProperty('--pc', c.color);
      portraitSlot.replaceChildren(portrait(who, 'dl-portrait'));
      nameEl.textContent = c.name;
      chev.classList.remove('ready');
      typing = typewrite(textEl, line.text, who);
      typing.done.then(() => { if (my !== token) return; textDone = true; chev.classList.add('ready'); maybeAuto(my); });
      speak(who, line).then(() => { if (my !== token) return; speechDone = true; maybeAuto(my); });
    };
    const next = () => {
      stopSpeech();
      idx++;
      if (idx >= lines.length) finishAll(); else show(idx);
    };
    const tap = () => {
      if (performance.now() - shownAt < 160) return;
      if (typing && typing.isTyping()) { typing.finish(); return; }
      next();
    };
    scr.addEventListener('click', tap);
    onKeys(e => { if (isAdvanceKey(e)) { tap(); return true; } });
    mount(scr);
    show(0);
  });
}

// ---------- roads (the four style signs, introduced by the Dean) ----------

export function roads(meeting = {}) {
  init();
  return new Promise(resolve => {
    const list = styleList();
    const dean = 'blorb';
    const capText = el('p', { class: 'rd-text' });
    const caption = el('div', { class: 'rd-cap card' }, portrait(dean, 'rd-portrait'), el('div', { class: 'rd-main' }, el('div', { class: 'rd-name' }, cast(dean).name), capText));
    const cards = list.map(s => el('div', { class: 'rd-card card', style: `--c:${s.color}` },
      el('div', { class: 'rd-tile' }, sprite(s.icon, 0, 'rd-icon', '?')),
      el('div', { class: 'rd-name2' }, s.name),
      el('div', { class: 'rd-tag' }, s.tagline),
      el('div', { class: 'rd-quote' }, s.quote ? `“${s.quote}”` : ''),
      forChips(s)));
    const go = el('button', { class: 'btn rd-go', type: 'button' }, copy('letsGo', "Let's go!"));
    const scr = el('div', { class: 'screen roads modal' }, caption, el('div', { class: 'rd-row' }, cards), el('div', { class: 'rd-foot' }, go));

    let typing = null, skipWake = null, dead = false, done = false;
    const wait = promise => new Promise(r => { skipWake = r; promise.then(r, r); });
    const say = async line => {
      if (!line || dead) return;
      const who = line.who || dean;
      typing = typewrite(capText, line.text, who);
      await wait(speak(who, line));
      typing.finish();
      await sleep(320);
    };
    scr.addEventListener('click', e => {
      if (e.target.closest('button')) return;
      if (typing && typing.isTyping()) { typing.finish(); return; }
      stopSpeech();
      if (skipWake) skipWake();
    });
    const finish = () => {
      if (done) return;
      done = true; dead = true;
      sfx('confirm');
      clearKeys();
      stopSpeech();
      dismiss(scr);
      resolve();
    };
    go.addEventListener('click', e => { e.stopPropagation(); finish(); });

    mount(scr);
    (async () => {
      await sleep(250);
      await say(meeting.roadsIntro);
      for (let i = 0; i < list.length; i++) {
        if (dead) return;
        cards[i].classList.add('show');
        sfx('card');
        await say((meeting.roads || {})[list[i].id]);
        cards[i].classList.add('seen');
      }
      if (dead) return;
      go.classList.add('show');
      onKeys(e => { if (isAdvanceKey(e)) { finish(); return true; } });
      try { go.focus({ preventScroll: true }); } catch { /* ignore */ }
    })();
  });
}

// ---------- chapter splash ----------

export function chapter({ n, total, title: name, creature, task } = {}) {
  init();
  const c = cast(creature);
  const node = el('div', { class: 'chapter', style: `--pc:${c.color}` },
    el('div', { class: 'ch-band' },
      portrait(creature, 'ch-portrait'),
      el('div', { class: 'ch-text' },
        el('div', { class: 'ch-kick' }, n != null && total ? `${n}/${total}` : copy('chapter', 'Chapter')),
        el('div', { class: 'ch-title' }, name || '')),
      task ? el('span', { class: 'ch-task' }, sprite(`ob_${task}`, 0, 'ch-icon', '')) : null));
  L.chapter.replaceChildren(node);
  sfx('whoosh');
  return new Promise(resolve => {
    setTimeout(() => node.classList.add('out'), 1250);
    setTimeout(() => { node.remove(); resolve(); }, 1600);
  });
}

// ---------- HUD ----------

let hudBuilt = false;
let hudEls = null;
let hudPrev = { hearts: null, max: null, progress: 0, buffId: null };

function heartSrc(f) { return spriteSrc('heart', f); }
function buildHud() {
  hudEls = {
    hearts: el('div', { class: 'hd-hearts', role: 'img' }),
    fill: el('span', { class: 'hd-fill' }),
    buff: el('div', { class: 'hd-buff', hidden: true }),
  };
  const prog = el('div', { class: 'hd-prog', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-label': 'Run progress' }, hudEls.fill);
  hudEls.prog = prog;
  L.hud.append(el('div', { class: 'hud' }, hudEls.hearts, prog, hudEls.buff));
  hudBuilt = true;
}
function heartNode(full) {
  const src = heartSrc(full ? 0 : 2);
  return el('span', { class: `heart ${full ? '' : 'empty'}` }, src ? el('img', { src, alt: '', draggable: 'false' }) : el('span', { class: 'hf', 'aria-hidden': 'true' }, '♥'));
}
function setHeartFrame(node, f) {
  const img = node.querySelector('img');
  if (img) img.src = heartSrc(f) || BLANK;
}

export function hud(state = {}) {
  init();
  if (!hudBuilt) buildHud();
  L.hud.hidden = false;
  const hearts = state.hearts != null ? state.hearts : hudPrev.hearts != null ? hudPrev.hearts : 3;
  const max = state.maxHearts != null ? state.maxHearts : hudPrev.max != null ? hudPrev.max : 3;

  // hearts
  const row = hudEls.hearts;
  if (hudPrev.max !== max || row.children.length !== max) {
    row.replaceChildren(...Array.from({ length: max }, (_, i) => heartNode(i < hearts)));
  } else if (hudPrev.hearts !== hearts) {
    [...row.children].forEach((node, i) => {
      const was = i < hudPrev.hearts;
      const now = i < hearts;
      if (was && !now) {
        node.classList.add('crack');
        setHeartFrame(node, 1);
        setTimeout(() => { node.classList.remove('crack'); node.classList.add('empty'); setHeartFrame(node, 2); }, 340);
      } else if (!was && now) {
        node.classList.remove('empty', 'crack');
        setHeartFrame(node, 0);
        node.classList.add('gain');
        setTimeout(() => node.classList.remove('gain'), 500);
      }
    });
  }
  row.setAttribute('aria-label', `${hearts} of ${max} hearts`);
  hudPrev.hearts = hearts; hudPrev.max = max;

  // progress
  if (state.progress != null) hudPrev.progress = state.progress;
  const p = Math.max(0, Math.min(1, hudPrev.progress || 0));
  hudEls.fill.style.transform = `scaleX(${p})`;
  hudEls.prog.setAttribute('aria-valuenow', String(Math.round(p * 100)));

  // buff chip: absent key = unchanged, null/undefined value or falsy = none
  if ('buff' in state) {
    const b = state.buff;
    if (!b || !b.id) {
      hudEls.buff.hidden = true;
      hudEls.buff.replaceChildren();
      hudPrev.buffId = null;
    } else {
      const t = Math.max(0, Math.min(1, b.t01 == null ? 1 : b.t01));
      if (hudPrev.buffId !== b.id) {
        const label = b.label || (COPY.buffs && COPY.buffs[b.id]) || BUFF_FALLBACK[b.id] || cap(b.id);
        hudEls.buff.className = `hd-buff b-${b.id}`;
        hudEls.buff.hidden = false;
        const bar = el('span', { class: 'hb-fill' });
        hudEls.buff.replaceChildren(
          sprite(BUFF_ICON[b.id] || 'buff_sync', 0, 'hb-icon', b.id === 'sync' ? '♥' : '!'),
          el('span', { class: 'hb-main' }, el('span', { class: 'hb-label' }, label), el('span', { class: 'hb-bar' }, bar)));
        hudEls.buffBar = bar;
        hudPrev.buffId = b.id;
        // restart the pop animation
        void hudEls.buff.offsetWidth;
      }
      hudEls.buffBar.style.transform = `scaleX(${t})`;
      hudEls.buff.classList.toggle('low', t < 0.25);
    }
  }
}
export function hideHud() {
  if (!hudBuilt) return;
  L.hud.hidden = true;
  hudBuilt = false;
  L.hud.replaceChildren();
  hudPrev = { hearts: null, max: null, progress: 0, buffId: null };
}

// ---------- tip (hand + text, centred low) ----------

let tipNode = null;
export function tip(kind = 'tap') {
  init();
  hideTip(true);
  const hold = kind === 'hold';
  const text = hold ? copy('tipHold', 'HOLD to jump higher') : copy('tipTap', 'TAP to jump');
  tipNode = el('div', { class: `tip ${hold ? 'hold' : 'tapk'}` },
    el('div', { class: 'tp-hand' },
      el('i', { class: 'tp-ring' }),
      pxSvg(PX.hand, 'tp-svg', { '#': '#1B1530', c: '#FFF6E5' }),
      hold ? el('span', { class: 'tp-up', 'aria-hidden': 'true' }, pxSvg(PX.up, 'tp-arrow'), pxSvg(PX.up, 'tp-arrow')) : null),
    el('div', { class: 'tp-text' }, text));
  L.tip.replaceChildren(tipNode);
}
export function hideTip(instant) {
  const n = tipNode;
  if (!n) return;
  tipNode = null;
  if (instant) { n.remove(); return; }
  n.classList.add('out');
  setTimeout(() => n.remove(), 220);
}

// ---------- toast ----------

let toastTimer = null;
export function toast(text, tone = 'good') {
  init();
  clearTimeout(toastTimer);
  const node = el('div', { class: `toast t-${tone === 'bad' ? 'bad' : 'good'}` }, text);
  L.toast.replaceChildren(node);
  toastTimer = setTimeout(() => node.remove(), 1300);
}

// ---------- junction ----------

// Little "[wrench] LOW" style chip for a skill/will level.
function lvlChip(kind, level, withLabel) {
  const lv = String(level || '').toLowerCase() === 'high' ? 'high' : 'low';
  const word = lv === 'high' ? copy('high', 'HIGH') : copy('low', 'LOW');
  return el('span', { class: `rchip ${kind} lv-${lv}` },
    sprite(kind === 'skill' ? 'icon_skill' : 'icon_will', 0, 'ri', kind === 'skill' ? '\u{1F527}' : '\u{1F525}'),
    withLabel ? el('b', {}, copy(kind, cap(kind))) : null,
    el('span', { class: 'lvl' }, word));
}
function forChips(s) {
  if (!s.skill && !s.will) return el('span', { class: 'for' });
  return el('span', { class: 'for' }, el('em', {}, copy('forWord', 'for')), lvlChip('skill', s.skill), lvlChip('will', s.will));
}

export function junction({ creature, read = {}, ask, limit = 8 } = {}) {
  init();
  return new Promise(resolve => {
    const list = styleList();
    const c = cast(creature);
    const limitMs = Math.max(1, limit) * 1000;
    let done = false, armed = false, elapsed = 0, last = performance.now(), lastSec = null;

    const fill = el('span', { class: 'jt-fill' });
    const num = el('span', { class: 'jt-num' }, String(Math.ceil(limit)));
    const timer = el('div', { class: 'jt', role: 'timer', 'aria-label': 'Time left' }, fill, num);
    const askEl = el('p', { class: 'jl-text' });
    const left = el('div', { class: 'jl' },
      el('div', { class: 'jl-top' }, portrait(creature, 'jl-portrait'), el('div', { class: 'jl-name' }, c.name)),
      el('div', { class: 'jl-bubble' }, askEl),
      el('div', { class: 'jl-chips' }, lvlChip('skill', read.skill, true), lvlChip('will', read.will, true)));
    const buttons = list.map((s, i) => {
      const b = el('button', { class: 'sign', type: 'button', style: `--c:${s.color};--i:${i}`, 'aria-label': `${i + 1}. ${s.name}. ${s.quote}` },
        el('span', { class: 'sg-tile' }, sprite(s.icon, 0, 'sg-icon', '?')),
        el('span', { class: 'sg-main' },
          el('span', { class: 'sg-name' }, s.name, el('kbd', { 'aria-hidden': 'true' }, String(i + 1))),
          el('span', { class: 'sg-quote' }, s.quote)),
        forChips(s));
      b.addEventListener('click', e => { e.stopPropagation(); choose(s.id); });
      return b;
    });
    const timeUp = el('div', { class: 'jt-up', hidden: true }, copy('timeUp', "Time's up!"));
    const scr = el('div', { class: 'screen junction modal' }, timer, left, el('div', { class: 'signs', role: 'group', 'aria-label': 'Choose how to lead' }, buttons), timeUp);

    const stop = () => { clearInterval(iv); clearKeys(); };
    const finish = (style, timedOut, delay) => {
      stop();
      setTimeout(() => { dismiss(scr); resolve({ style, timedOut }); }, delay);
    };
    function choose(id) {
      if (done || !armed) return;
      done = true;
      sfx('pop');
      scr.classList.add('picked');
      buttons.forEach((b, i) => {
        b.disabled = true;
        b.classList.toggle('chosen', list[i].id === id);
      });
      finish(id, false, 460);
    }
    function timeout() {
      if (done) return;
      done = true;
      scr.classList.add('timeup');
      timeUp.hidden = false;
      buttons.forEach(b => { b.disabled = true; });
      sfx('stumble');
      finish('delegate', true, 800);
    }
    const tick = () => {
      const now = performance.now();
      if (!blocked) elapsed += now - last;
      last = now;
      if (done) return;
      const rem = Math.max(0, limitMs - elapsed);
      const frac = rem / limitMs;
      fill.style.transform = `scaleX(${frac})`;
      scr.classList.toggle('low', frac < 0.3);
      const sec = Math.ceil(rem / 1000);
      if (sec !== lastSec) {
        lastSec = sec;
        num.textContent = String(sec);
        if (frac < 0.3 && sec > 0) sfx('timer');
      }
      if (rem <= 0) timeout();
    };
    const iv = setInterval(tick, 60);

    const askLine = ask || { who: creature, text: '' };
    const typing = typewrite(askEl, lineText(askLine), creature);
    void typing;
    speak(creature, typeof askLine === 'string' ? { who: creature, text: askLine } : askLine);

    onKeys(e => {
      const i = '1234'.indexOf(e.key);
      if (i >= 0 && i < list.length && e.key.length === 1) { choose(list[i].id); return true; }
    });
    mount(scr);
    // Taps from the run that just ended must not pick a road by accident.
    setTimeout(() => { armed = true; scr.classList.add('armed'); }, 480);
  });
}

// ---------- lesson ----------

export function lesson({ creature, need, chosen, fit, timedOut, reaction, read } = {}) {
  init();
  return new Promise(resolve => {
    const f = fit === 'over' || fit === 'under' ? fit : 'match';
    const c = cast(creature);
    const titleText = timedOut ? copy('timedOut', 'You froze!')
      : f === 'match' ? copy('spotOn', 'Spot on!')
        : f === 'over' ? copy('tooMuch', 'Too hands-on') : copy('tooLittle', 'Too hands-off');
    const glyph = f === 'match' ? PX.check : f === 'over' ? PX.up : PX.down;
    const sn = styleById(need), sc = styleById(chosen);
    const styleChip = s => el('span', { class: 'ls-chip', style: `--c:${s.color}` }, sprite(s.icon, 0, 'ls-ci', ''), el('b', {}, s.name));
    const line = reaction && reaction.line;
    const lessonText = (reaction && reaction.lesson) || '';
    const reads = [];
    if (read) {
      for (const kind of ['skill', 'will']) {
        const v = read[kind];
        if (!v) continue;
        if (/^(low|high)$/i.test(v)) reads.push(lvlChip(kind, v, true));
        else reads.push(el('span', { class: 'ls-read' }, cap(copy(kind, kind)), ': ', v));
      }
    }
    const reactEl = el('p', { class: 'ls-line' });
    const cont = el('button', { class: 'btn ls-go', type: 'button', disabled: true }, copy('continue', 'Continue'));
    const scr = el('div', { class: 'screen lesson modal' },
      el('div', { class: `ls-card card fit-${f}${timedOut ? ' froze' : ''}` },
        el('div', { class: 'ls-left', style: `--pc:${c.color}` },
          portrait(creature, 'ls-portrait'),
          el('div', { class: 'ls-bubble' }, el('div', { class: 'ls-who' }, c.name), reactEl)),
        el('div', { class: 'ls-right' },
          el('div', { class: 'ls-head' }, el('span', { class: 'ls-badge' }, pxSvg(glyph, 'ls-glyph')), el('h2', { class: 'ls-title' }, titleText)),
          el('div', { class: 'ls-vs' },
            el('span', { class: 'ls-lab' }, copy('needed', 'Needed')), styleChip(sn),
            el('span', { class: 'ls-lab' }, copy('you', 'You')), styleChip(sc)),
          el('p', { class: 'ls-lesson' }, lessonText),
          reads.length ? el('div', { class: 'ls-reads' }, reads) : null,
          el('div', { class: 'ls-foot' }, cont))));

    if (line) {
      typewrite(reactEl, lineText(line), creature);
      speak(creature, line);
    } else reactEl.textContent = '';

    let done = false, armed = false;
    const go = () => {
      if (done || !armed) return;
      done = true;
      sfx('whoosh');
      stopSpeech();
      clearKeys();
      dismiss(scr);
      resolve();
    };
    cont.addEventListener('click', go);
    onKeys(e => { if (isAdvanceKey(e)) { go(); return true; } });
    mount(scr);
    sfx(f === 'match' ? 'cheer' : 'stumble');
    setTimeout(() => { armed = true; cont.disabled = false; scr.classList.add('armed'); try { cont.focus({ preventScroll: true }); } catch { /* ignore */ } }, 1000);
  });
}

// ---------- report ----------

function normRow(r) {
  const loop = r.loop || {};
  const score = r.score;
  return {
    creature: r.creature ?? loop.creature,
    task: r.task ?? loop.task,
    title: r.title ?? loop.title,
    need: r.need ?? loop.need,
    chosen: r.chosen ?? r.style ?? (r.run && r.run.style),
    fit: r.fit ?? r.mode ?? (score && score.mode),
    timedOut: !!(r.timedOut ?? (r.run && r.run.timedOut)),
    pts: typeof score === 'number' ? score : (score && score.total) ?? r.total,
    max: r.max ?? 10,
  };
}

export function report(summary = {}) {
  init();
  return new Promise(resolve => {
    const g = String(summary.grade || '?');
    const total = summary.total, max = summary.max;
    const pid = typeof summary.profile === 'string' ? summary.profile : (summary.profile && summary.profile.id) || summary.profileId || 'situational';
    const prof = { ...(PROFILES[pid] || {}), ...(typeof summary.profile === 'object' && summary.profile ? summary.profile : {}) };
    const habitTitle = prof.title || cap(pid);
    const habitLine = prof.line || prof.blurb || '';
    const rows = (summary.loops || summary.rows || summary.turns || []).map(normRow);
    const closing = summary.closing || copy('closing', 'Lead the situation in front of you.');
    const mode = summary.mode || (new URLSearchParams(location.search).get('mode') === 'long' ? 'long' : 'short');

    const rowEls = rows.map((r, i) => {
      const ok = r.fit === 'match';
      const sn = styleById(r.need), sc = styleById(r.chosen);
      const verdict = ok ? copy('spotOn', 'Spot on!') : r.timedOut ? copy('timedOut', 'You froze!') : r.fit === 'over' ? copy('tooMuch', 'Too hands-on') : copy('tooLittle', 'Too hands-off');
      return el('li', { class: `rp-row ${ok ? 'ok' : 'no'}`, style: `--i:${i}` },
        portrait(r.creature, 'rp-portrait'),
        el('div', { class: 'rp-mid' },
          el('div', { class: 'rp-title' }, r.title || cast(r.creature).name),
          el('div', { class: 'rp-vs' },
            el('span', { class: 'rp-lab' }, copy('needed', 'Needed')),
            el('span', { class: 'rp-chip', style: `--c:${sn.color}` }, sprite(sn.icon, 0, 'rp-ci', ''), sn.name),
            el('span', { class: 'rp-lab' }, copy('you', 'You')),
            el('span', { class: 'rp-chip', style: `--c:${sc.color}` }, sprite(sc.icon, 0, 'rp-ci', ''), sc.name))),
        el('div', { class: 'rp-res' },
          el('span', { class: 'rp-mark' }, pxSvg(ok ? PX.check : r.fit === 'over' ? PX.up : PX.down, 'rp-glyph')),
          el('span', { class: 'rp-verdict' }, verdict),
          r.pts != null ? el('span', { class: 'rp-pts' }, `${r.pts}/${r.max}`) : null));
    });

    const replay = el('button', { class: 'btn rp-replay', type: 'button' }, copy('replay', 'Play again'));
    const long = mode !== 'long' ? el('a', { class: 'btn alt rp-long', href: '?mode=long' }, copy('tryLong', 'Try the full fest')) : null;
    const badge = sprite(`badge_${pid}`, 0, 'rp-badge', '★');
    const scroller = el('div', { class: 'rp-scroll', tabindex: '0', role: 'region', 'aria-label': copy('reportTitle', 'Fest Report') },
      el('div', { class: 'rp-head' },
        el('div', { class: `rp-grade g-${g}`, 'aria-label': `Grade ${g}` }, el('span', {}, g),
          total != null && max != null ? el('small', {}, `${total}/${max}`) : null),
        el('div', { class: 'rp-habit' },
          el('div', { class: 'rp-kick' }, copy('reportTitle', 'Fest Report')),
          el('div', { class: 'rp-hrow' }, badge,
            el('div', {}, el('div', { class: 'rp-hkick' }, copy('habit', 'Your leadership habit')),
              el('h2', { class: 'rp-htitle' }, habitTitle))),
          habitLine ? el('p', { class: 'rp-hline' }, habitLine) : null)),
      rowEls.length ? el('ol', { class: 'rp-rows' }, rowEls) : null,
      el('p', { class: 'rp-closing' }, closing));
    const scr = el('div', { class: 'screen report modal' },
      el('div', { class: 'rp-card card' }, scroller, el('div', { class: 'rp-foot' }, long, replay)));

    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      sfx('confirm');
      clearKeys();
      dismiss(scr);
      resolve();
    };
    replay.addEventListener('click', go);
    onKeys(e => { if (e.key === 'Enter') { go(); return true; } });
    mount(scr);
    setTimeout(() => sfx('stamp'), 350);
    try { replay.focus({ preventScroll: true }); } catch { /* ignore */ }
  });
}

// ---------- error ----------

export function error() {
  init();
  clearKeys();
  clearBarks();
  hideTip(true);
  const btn = el('button', { class: 'btn', type: 'button' }, 'Reload');
  btn.addEventListener('click', () => location.reload());
  mount(el('div', { class: 'screen error modal' },
    el('div', { class: 'er-card card' },
      el('h2', { class: 'er-title' }, copy('errorTitle', 'Something broke backstage')),
      el('p', {}, copy('errorBody', 'Reload the page to run the fest again.')),
      btn)));
}
