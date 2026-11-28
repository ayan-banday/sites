"use strict";
/* NEELBALI engine: runs the presses in story.js. A press is a function that takes one object `c` (the press API). */
const $ = s => document.querySelector(s);
const DEBUG = /[?&]debug/.test(location.search);
const stageEl = $("#stage"), tallyEl = $("#tally");
const sceneEl = $("#scene"), partsEl = $("#parts"), fxEl = $("#fx"), capEl = $("#cap"), panelEl = $("#panel"), hintEl = $("#hint");
/* light carries the mood (story-plan: "when you cannot draw it, change the light"): one CSS grade per shot */
const GRADES = { dawn: "saturate(1.1) brightness(1.06)", storm: "saturate(.7) brightness(.88) hue-rotate(-8deg)", heavy: "saturate(.6) brightness(.82)", lonely: "saturate(.3) brightness(.78) contrast(1.05)", warm: "saturate(1.12) sepia(.12) brightness(1.04)", bright: "saturate(1.15) brightness(1.05)", hot: "saturate(1.3) contrast(1.06)" };
const LEVELS = [2,2,3,1,1,2,2,3,2,3,5,3];           /* music level per shot (music-plan.md, "The dynamic curve") */
let actLeft = 0, SILENT = false, BREATH = false, curMood = "none", curScene = "", shotNo = 0, sfxNow = [];
window.__log = []; window.__missing = [];
const shown = {};                                      /* id -> {el, name, opts, t} */

const tfStr = t => `translate(${t.x}px,${t.y}px) rotate(${t.r}deg) scale(${t.s * (t.flip ? -1 : 1)},${t.s})`;
function renderInner(rec){
  const fn = KIT[rec.name];
  if(!fn){ window.__missing.push(rec.name); return `<text x="0" y="0" font-size="40" fill="#fff" stroke="#000">?${rec.name}</text>`; }
  return fn(0, 0, 1, rec.opts);
}
function makeC(){
  return {
    scene(name, o){ curScene = name; capEl.classList.add("blank"); panelEl.classList.add("blank"); sceneEl.innerHTML = SCENES[name](o||{}); partsEl.innerHTML = ""; fxEl.innerHTML = ""; for(const k in shown) delete shown[k]; },
    show(id, name, o = {}){
      this.hide(id);
      const { x = 0, y = 0, s = 1, r = 0, flip = false, opacity = 1, fade = false, behind = false, state, ...rest } = o;
      const opts = { ...rest }; if(state !== undefined) opts.state = state;
      const rec = { name, opts, t: { x, y, s, r, flip, opacity } };
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("id", "part-" + id); g.style.transform = tfStr(rec.t); g.style.opacity = opacity;
      if(fade && !SILENT) g.classList.add("fadein");
      g.innerHTML = renderInner(rec); rec.el = g;
      (behind && document.getElementById("slot-back") || partsEl).appendChild(g); shown[id] = rec;
    },
    hide(id){ const r = shown[id]; if(r){ r.el.remove(); delete shown[id]; } },
    move(id, to, ms = 0){
      const r = shown[id]; if(!r || BREATH) return;
      Object.assign(r.t, to);
      if(SILENT || !ms){ r.el.style.transition = "none"; }
      else { const st = Math.max(1, Math.round(ms / 83.3)); r.el.style.transition = `transform ${ms}ms steps(${st}), opacity ${ms}ms steps(${st})`; }
      r.el.style.transform = tfStr(r.t); if(to.opacity !== undefined) r.el.style.opacity = to.opacity;
    },
    set(id, state){
      const r = shown[id]; if(!r) return;
      if(typeof state === "string") r.opts.state = state; else Object.assign(r.opts, state);
      r.el.innerHTML = renderInner(r);
    },
    say(who, text){ capEl.className = ""; capEl.innerHTML = `<span id="who">${who}</span>${text}`; capEl.classList.remove("blank"); },
    panel(text){ panelEl.className = ""; panelEl.textContent = text; panelEl.classList.remove("blank"); },
    /* a card at the top of the miniature (acts, movements, days); kept for `ttl` presses */
    card(label, title, sub = "", ttl = 3, cls = ""){ panelEl.className = ("act " + cls).trim(); panelEl.innerHTML = `<span class="actno">${label}</span>${title}${sub ? `<small>${sub}</small>` : ""}`; actLeft = ttl; },
    act(no, title, sub){ this.card("Act " + no, title, sub, 3); },
    /* the narrator (third person, plain): a caption with no speaker */
    narr(text){ capEl.className = "narr"; capEl.innerHTML = text; },
    /* the corner plate (Guests let in -> Friends). tally() hides it. */
    tally(label, value){
      if(label === undefined){ tallyEl.classList.add("blank"); delete tallyEl.dataset.l; return; }
      const changed = tallyEl.dataset.v !== label + "|" + value; const swap = tallyEl.dataset.l !== undefined && tallyEl.dataset.l !== label; tallyEl.dataset.v = label + "|" + value; tallyEl.dataset.l = label;
      tallyEl.classList.toggle("swap", swap && !SILENT);
      tallyEl.querySelector(".tl").textContent = label; tallyEl.querySelector(".tv").textContent = value; tallyEl.classList.remove("blank");
      if(changed && !SILENT){ tallyEl.classList.remove("pop"); void tallyEl.offsetWidth; tallyEl.classList.add("pop"); }
    },
    clear(){ capEl.classList.add("blank"); panelEl.classList.add("blank"); },
    mood(name){ curMood = name; if(!SILENT) Sound.cue(name); },
    silence(){ curMood = "silence"; if(!SILENT) Sound.cue("silence"); },
    sfx(...names){ sfxNow.push(...names); if(!SILENT) names.forEach(n => Sound.sfx(n)); },
  };
}

const PRESSES = [];
STORY.forEach(sh => sh.presses.forEach(p => { PRESSES[p.p] = { ...p, shot: sh.shot, level: sh.level, grade: sh.grade }; }));
let idx = 0, last = 0;
function doPress(n, silent){
  const pr = PRESSES[n]; if(!pr) return;
  SILENT = !!silent; BREATH = !!pr.breath; sfxNow = []; shotNo = pr.shot;
  if(actLeft > 0 && --actLeft === 0) panelEl.classList.add("blank");
  stageEl.style.transition = silent ? "none" : "filter .7s steps(7)"; stageEl.style.filter = GRADES[pr.grade] || "none";
  tallyEl.classList.remove("swap");
  const c = makeC(); capEl.classList.add("blank");   /* the caption clears on every press unless the press sets its own */
  pr.run(c);
  if(!silent){
    Sound.duck(BREATH && curMood !== "silence");
    const level = curMood === "silence" ? 1 : (BREATH ? 1 : pr.level || 3);
    window.__log.push(`P${n} mood=${curMood} level=${level} sfx=${sfxNow.join(",") || "-"}`);
  }
  SILENT = false; BREATH = false;
  if(DEBUG) hintEl.textContent = `P${n}`;
}
function next(){
  const now = performance.now(); if(now - last < 120) return; last = now;
  Sound.init(); if(idx >= PRESSES.length) return;
  doPress(idx++, false);
}
/* QA hook: replay presses 0..n-1 silently, then run press n normally. */
window.__jump = n => { window.__log.length = 0; curMood = "none"; for(let i = 0; i < n; i++) doPress(i, true); doPress(n, false); idx = n + 1; };
window.__press = doPress;
if(DEBUG) hintEl.style.display = "block";

/* Phone detection copied from Khushi's film (the-witch-who-would-not-be-read/app.js). */
const PHONE = Math.min(screen.width, screen.height) < 600 || matchMedia("(max-width:599px)").matches;
const TOUCH = PHONE || matchMedia("(pointer:coarse)").matches;
if(PHONE) document.documentElement.classList.add("phone");
const turnShown = () => getComputedStyle($("#turn")).display !== "none";
const tap = () => { if(!turnShown()) next(); };
document.addEventListener("keydown", e => { if(e.code === "Space" || e.code === "ArrowRight" || e.code === "Enter"){ e.preventDefault(); tap(); } });
/* touch advances once on touchend (preventDefault stops the follow-up click); mouse uses click */
document.addEventListener("touchend", e => { e.preventDefault(); tap(); }, { passive: false });
document.addEventListener("click", tap);
sceneEl.innerHTML = SCENES.dawn({}); capEl.innerHTML = TOUCH ? "Tap to begin." : "Press space to begin."; capEl.classList.remove("blank");
