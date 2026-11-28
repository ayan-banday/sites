"use strict";
/* ================= SOUND: a small Hindustani-flavoured score + sound effects =================
   This is a stand-in score so the prototype has highs and lows. The build replaces it with
   real recordings and earshot files (see build/spec.md, "Music"). */
let AC = null, MASTER = null, SCORE = null, DUCK = null, MUSIC = null, SFXB = null;
function ac(){
  if(!AC){ try{ AC = new (window.AudioContext||window.webkitAudioContext)(); MASTER = AC.createGain(); MASTER.gain.value = .9; MASTER.connect(AC.destination);
      DUCK = AC.createGain(); DUCK.connect(MASTER); SCORE = AC.createGain(); SCORE.gain.value = .8; SCORE.connect(DUCK);
      MUSIC = AC.createGain(); MUSIC.gain.value = .8; MUSIC.connect(DUCK); SFXB = AC.createGain(); SFXB.gain.value = 1.15; SFXB.connect(MASTER);
      startScheduler(); loadSfx(); }catch(e){} }
  if(AC && AC.state==="suspended") AC.resume(); return AC;
}
function osc(type, f, t0, dur, vol, f2, dest, lp){
  const a = AC, o = a.createOscillator(), g = a.createGain(); let out = g;
  o.type = type; o.frequency.setValueAtTime(f, t0); if(f2) o.frequency.exponentialRampToValueAtTime(f2, t0+dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0+.008); g.gain.exponentialRampToValueAtTime(.0008, t0+dur);
  o.connect(g);
  if(lp){ const b = a.createBiquadFilter(); b.type="lowpass"; b.frequency.value = lp; g.connect(b); out = b; }
  out.connect(dest||SFXB||MASTER); o.start(t0); o.stop(t0+dur+.05);
}
function nz(t0, dur, vol, hp, dest){
  const a = AC, b = a.createBuffer(1, Math.max(1,Math.floor(a.sampleRate*dur)), a.sampleRate), d = b.getChannelData(0);
  for(let i=0;i<d.length;i++) d[i] = (Math.random()*2-1)*Math.pow(1-i/d.length,2);
  const s = a.createBufferSource(); s.buffer = b; const f = a.createBiquadFilter(); f.type="highpass"; f.frequency.value = hp;
  const g = a.createGain(); g.gain.value = vol; s.connect(f).connect(g).connect(dest||SFXB||MASTER); s.start(t0);
}
const hz = m => 130.81*Math.pow(2,m/12);
const sitar = (m,t,d=.9,v=.22)=>{ const f=hz(m); osc("sawtooth",f,t,d,v,null,SCORE,f*5); osc("triangle",f*2,t,d*.6,v*.5,null,SCORE,f*6); osc("sine",f*3.01,t,d*.3,v*.3,null,SCORE); };
const flute  = (m,t,d=1.4,v=.18)=>{ const f=hz(m+12); osc("sine",f,t,d,v,null,SCORE); osc("triangle",f*2,t,d*.7,v*.18,null,SCORE); nz(t,d*.5,.01,3000,SCORE); };
const bellI  = (m,t,d=1.2,v=.16)=>{ const f=hz(m+24); osc("triangle",f,t,d,v,null,SCORE); osc("sine",f*2.76,t,d*.5,v*.4,null,SCORE); };
const pluckM = (m,t,d=.25,v=.2)=>{ const f=hz(m+12); osc("square",f,t,d,v,null,SCORE,f*3); };
const brass  = (m,t,d=1.6,v=.12)=>{ [0,.012,-.012].forEach(dt=>osc("sawtooth",hz(m)*(1+dt),t,d,v,null,SCORE,700)); };
const tanpura= (t,v=.14)=>{ [0,7,12,0].forEach((m,i)=>osc("sawtooth",hz(m-12),t+i*.55,2.4,v,null,SCORE,420)); };
const T = {
  D:(t,v=.5)=>{ osc("sine",150,t,.24,v,70,SCORE); nz(t,.04,v*.4,1400,SCORE); },
  G:(t,v=.35)=>{ osc("sine",110,t,.3,v,60,SCORE); },
  N:(t,v=.3)=>{ osc("sine",520,t,.09,v,480,SCORE); nz(t,.03,v*.5,3000,SCORE); },
  T:(t,v=.3)=>{ osc("sine",760,t,.07,v,700,SCORE); },
  K:(t,v=.22)=>{ nz(t,.03,v,2500,SCORE); },
  H:(t,v=.8)=>{ osc("sine",95,t,.45,v,42,SCORE); nz(t,.07,v*.5,900,SCORE); },
};
const RAGA = [0,1,4,5,7,8,11];          /* Bhairav, semitones above C */
const deg = d => RAGA[((d%7)+7)%7] + 12*Math.floor(d/7);
const R = null;
const MOODS = {
  dawn:   { bpm:54,  drone:true,  tab:"G.......N.......", mel:[0,R,R,R,R,R,R,R,2,R,R,R,4,R,R,R, 4,R,R,R,R,R,R,R,7,R,R,R,5,R,4,R], inst:flute,  vol:1 },
  court:  { bpm:84,  drone:true,  tab:"D.NT.NK.D.NT.NK.", mel:[0,R,2,R,4,R,2,R,0,R,2,R,4,R,5,R, 4,R,2,R,0,R,2,R,4,R,R,R,0,R,R,R], inst:sitar,  vol:.9 },
  playful:{ bpm:112, drone:false, tab:"K.N.K.N.K.NNK.N.", mel:[0,2,4,2,0,R,4,R,5,4,2,R,0,R,R,R, 7,5,4,5,7,R,4,R,2,0,2,R,0,R,R,R], inst:pluckM, vol:.9 },
  epic:   { bpm:76,  drone:true,  tab:"H...H.H.H...HHH.", mel:[0,R,R,R,R,R,R,R,0,R,R,R,3,R,R,R, 4,R,R,R,R,R,R,R,5,R,R,R,4,R,R,R], inst:brass,  vol:1.1 },
  tabla:  { bpm:118, drone:false, tab:"D.NKT.NGD.KNT.NK", mel:[0,R,2,R,4,5,4,2, 0,R,R,2,4,R,7,R, 8,7,5,4,5,R,4,2, 0,R,2,4,5,R,R,R], inst:sitar, vol:1 },
  finale: { bpm:140, drone:true,  tab:"DNTNDNTNDNTNDDNT", mel:[7,R,9,R,11,R,9,R,7,9,11,12,11,9,7,R, 12,R,11,R,9,R,11,R,12,14,12,11,9,7,R,R], inst:bellI,  vol:1.1 },
};
let mood = null, step = 0, nextT = 0, droneNext = 0;
function setMood(name){ mood = MOODS[name]||null; step = 0; if(AC){ nextT = AC.currentTime+.05; droneNext = nextT; } }
function startScheduler(){ nextT = AC.currentTime+.1; droneNext = nextT;
  setInterval(()=>{ if(!AC||!mood) return; const m = mood;
    while(nextT < AC.currentTime+.25){
      const s = step%16, spb = 60/m.bpm/4, bol = m.tab[s];
      if(bol && bol!=="." && T[bol]) T[bol](nextT, (bol==="H"? .8:.4)*m.vol);
      const n = m.mel[step%m.mel.length]; if(n!==null && n!==undefined){ m.inst(deg(n), nextT, spb*3, .2*m.vol); }
      nextT += spb; step++;
    }
    if(m.drone){ while(droneNext < AC.currentTime+.25){ tanpura(droneNext, .12*m.vol); droneNext += 2.2; } }
  }, 60);
}

/* ---- sfx: the old synth versions stay as the fallback when a file will not load ---- */
const SND = {
  tick(){ osc("square",1800,AC.currentTime,.03,.08); },
  thump(){ osc("sine",90,AC.currentTime,.25,.4,50); },
  drum(i){ const sc=[0,2,4,5,7,9,11,12]; const f=hz(sc[i%8]-12); const t=AC.currentTime;
    osc("sine",f*2.4,t,.3,.7,f*.9); nz(t,.05,.35,1500); osc("triangle",f*4,t+.02,.6,.14,null); },
  gong(){ const t=AC.currentTime; osc("sine",110,t,3,.5,95); osc("sine",165,t,2.4,.25,null); osc("triangle",227,t,1.8,.12,null); nz(t,.1,.3,600); },
  pop(){ nz(AC.currentTime,.35,.18,1200); },
  cheer(){ nz(AC.currentTime,1.4,.14,600); },
  bell(){ [0,4,7,12].forEach((m,i)=>bellI(m,AC.currentTime+i*.12,1.4,.14)); },
};
/* a note with a slow attack, used by the synthesised sfx */
function swell(type, f, f2, t, dur, vol, lp, att, vib){
  const a = AC, o = a.createOscillator(), g = a.createGain(), b = a.createBiquadFilter();
  o.type = type; o.frequency.setValueAtTime(f, t); if(f2) o.frequency.exponentialRampToValueAtTime(f2, t+dur);
  if(vib){ const l = a.createOscillator(), lg = a.createGain(); l.frequency.value = vib[0]; lg.gain.value = vib[1]; l.connect(lg).connect(o.frequency); l.start(t); l.stop(t+dur+.1); }
  g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(vol, t+att); g.gain.setValueAtTime(vol, t+Math.max(att, dur-.25)); g.gain.linearRampToValueAtTime(.0001, t+dur);
  b.type = "lowpass"; b.frequency.value = lp||20000; o.connect(b).connect(g).connect(SFXB); o.start(t); o.stop(t+dur+.1);
}
const SYN = {
  conch(){ const t=AC.currentTime; swell("sawtooth",160,250,t,1.5,.22,800,.35); swell("sawtooth",162,253,t,1.5,.16,800,.35); swell("sine",80,125,t,1.5,.3,400,.3); },
  "slide-whistle"(){ const t=AC.currentTime; swell("sine",400,1900,t,.8,.22,5000,.04,[9,25]); swell("triangle",800,3800,t,.8,.04,6000,.04); },
  "jazz-sting"(){ const t=AC.currentTime; [[330,0,.22],[392,.24,.3],[466,.58,.95]].forEach(([f,d,l],i)=>{
      swell("sawtooth",f,null,t+d,l,.2,1500,.03,i==2?[5.5,5]:null); swell("sawtooth",f*1.004,null,t+d,l,.12,1200,.03); }); },
  "scroll-slide"(){ const a=AC, t=a.currentTime, n=Math.floor(a.sampleRate*.9), b=a.createBuffer(1,n,a.sampleRate), d=b.getChannelData(0);
    for(let i=0;i<n;i++){ const x=i/n; d[i]=(Math.random()*2-1)*Math.sin(Math.PI*x)*(.7+.3*Math.sin(x*60)); }
    const s=a.createBufferSource(); s.buffer=b; const f=a.createBiquadFilter(); f.type="bandpass"; f.Q.value=.9;
    f.frequency.setValueAtTime(1200,t); f.frequency.exponentialRampToValueAtTime(3800,t+.9); const g=a.createGain(); g.gain.value=.55;
    s.connect(f).connect(g).connect(SFXB); s.start(t); },
};
const FALLBACK = {chime:SND.bell, "nod-thump":SND.thump, "watch-tick":SND.tick, gong:SND.gong, fireworks:SND.pop, "crowd-roar":SND.cheer, "crowd-cheer-small":SND.cheer, "drum-strike":()=>SND.drum(0), "stick-hit":()=>SND.drum(2)};
const SFX_FILES = ["birds","chime","crowd-cheer-small","crowd-roar","drum-strike","fanfare","fireworks","footsteps","gong","knock","latch","nod-thump","rain","record-scratch","soft-slam","stick-hit","strap-squeak","tape-snap","thunder","warm-chord","watch-tick","wind-chimes"];
const SFX_TAKES = {"drum-strike":3, "stick-hit":3, "nod-thump":3};
const sfxBuf = {};   /* name -> [AudioBuffer, ...] */
function loadSfx(){
  if(location.protocol==="file:") return;   /* fetch cannot read file://; the synth fallbacks play instead */
  SFX_FILES.forEach(n=>{
    const files = [n]; for(let i=1;i<=(SFX_TAKES[n]||0);i++) files.push(n+"-"+i);
    files.forEach(f=>{ try{ fetch("audio/sfx/final/"+f+".ogg").then(r=>r.ok?r.arrayBuffer():Promise.reject())
      .then(ab=>new Promise((ok,no)=>{ const p = AC.decodeAudioData(ab, ok, no); if(p&&p.catch) p.catch(no); }))
      .then(buf=>{ (sfxBuf[n] = sfxBuf[n]||[]).push(buf); }).catch(()=>{}); }catch(e){} });
  });
}
const sfxLast = {};
function playSfx(name){
  if(SYN[name]){ SYN[name](); return; }
  const arr = sfxBuf[name];
  if(arr && arr.length){ let i = Math.floor(Math.random()*arr.length); if(arr.length>1 && i===sfxLast[name]) i = (i+1)%arr.length; sfxLast[name] = i;
    const s = AC.createBufferSource(); s.buffer = arr[i]; s.connect(SFXB); s.start(); return; }
  if(FALLBACK[name]) FALLBACK[name]();
}

/* ---- music: one table, one row per cue. level = loudness (1 = the file as mastered, about -16 LUFS) ----
   Special cases from music-plan.md: silence = stop at once (no row); tabla and happy-birthday are generated (no file);
   ossuary is quiet on purpose; heart crossfades 1 s from carefree; fanfare is the peak; a new cue cuts the old one. */
const MD = "audio/music/";
const CUES = {
  raga:            {file:"raga-kaushi-dawn.mp3",          loop:false, fadeIn:1.2, level:1,    next:"bombay"},
  bombay:          {file:"bombay-summer-court.mp3",       loop:true,  fadeIn:1,   level:1,    next:"mountain-king"},
  "mountain-king": {file:"mountain-king.mp3",             loop:false, fadeIn:.4,  level:1,    next:"ossuary"},
  ossuary:         {file:"ossuary-air-suspended.mp3",     loop:false, fadeIn:3,   level:.45,  next:"carefree"},
  carefree:        {file:"carefree-artist.mp3",           loop:false, fadeIn:1,   level:1,    next:"dreamy"},
  dreamy:          {file:"dreamy-tarot.mp3",              loop:false, fadeIn:1.2, level:1,    next:"heart"},
  heart:           {file:"heart-of-nowhere-healer.mp3",   loop:false, fadeIn:1,   level:1,    next:"sneaky", crossfade:1},
  sneaky:          {file:"sneaky-snitch.mp3",             loop:false, fadeIn:0,   level:1,    next:"bach"},
  bach:            {file:"bach-agitato.mp3",              loop:false, fadeIn:0,   level:.95,  next:"mountain-king"},
  fanfare:         {file:"fanfare-applause.mp3",          loop:false, fadeIn:0,   level:1.12, next:"merry"},
  merry:           {file:"merry-go-confetti.mp3",         loop:false, fadeIn:.3,  level:1,    next:"healing"},
  healing:         {file:"healing-closing.mp3",           loop:false, fadeIn:1.8, level:1},
};
let manifestDone = false;
function loadManifest(){ if(manifestDone) return; manifestDone = true; if(location.protocol==="file:") return;
  try{ fetch(MD+"cue-manifest.json").then(r=>r.json()).then(j=>{ (j.cues||[]).forEach(c=>{ for(const k in CUES) if(CUES[k].file===c.file){ CUES[k].loop = !!c.loop; CUES[k].dur = c.duration_sec; } }); }).catch(()=>{}); }catch(e){} }
const preloaded = {};
function preload(name){ const c = CUES[name]; if(!c||preloaded[name]) return; try{ const a = new Audio(MD+c.file); a.preload = "auto"; preloaded[name] = a; }catch(e){} }

let cur = null, curName = null, ducked = false, hb = 0;
const useWA = () => !!AC && location.protocol !== "file:";   /* file:// would mute a media element source */
function trackVol(tr){ return Math.min(1, tr.level*.8*(ducked?.15:1)); }
function killTrack(tr, fade){
  if(!tr) return;
  const done = ()=>{ try{ tr.el.pause(); tr.el.removeAttribute("src"); tr.el.load(); }catch(e){} try{ if(tr.g) tr.g.disconnect(); if(tr.src) tr.src.disconnect(); }catch(e){} };
  if(fade && tr.g){ const t = AC.currentTime; tr.g.gain.cancelScheduledValues(t); tr.g.gain.setValueAtTime(tr.g.gain.value, t); tr.g.gain.linearRampToValueAtTime(0, t+fade); setTimeout(done, fade*1000+80); }
  else done();
}
function startFile(name){
  const c = CUES[name]; const old = cur; cur = null;
  killTrack(old, c.crossfade && old ? c.crossfade : 0);
  const el = new Audio(MD+c.file); el.loop = !!c.loop; el.preload = "auto";
  const tr = {el, level:c.level, name}; cur = tr;
  try{
    if(useWA()){ tr.g = AC.createGain(); tr.src = AC.createMediaElementSource(el); tr.src.connect(tr.g); tr.g.connect(MUSIC);
      const t = AC.currentTime, fi = c.fadeIn||0;
      tr.g.gain.setValueAtTime(fi?0:c.level, t); if(fi) tr.g.gain.linearRampToValueAtTime(c.level, t+fi);
    } else { el.volume = trackVol(tr); }
    const p = el.play(); if(p && p.catch) p.catch(()=>{});
  }catch(e){}
  if(c.next) preload(c.next);
}
function stopMusic(){ killTrack(cur, 0); cur = null; }

/* "Happy Birthday to You" (public domain): semitones above C3, [note, beats]; sitar plays it, bells an octave up.
   Phrases 1, 2 and 3 (phrase 3 = the tune of lines 3 and 4, no words). One phrase per engine call. */
const HB = [
  [[19,.75],[19,.25],[21,1],[19,1],[24,1],[23,2]],
  [[19,.75],[19,.25],[21,1],[19,1],[26,1],[24,2]],
  [[19,.75],[19,.25],[31,1],[28,1],[24,1],[23,1],[21,1],[29,.75],[29,.25],[28,1],[24,1],[26,1],[24,2]],
];
function hbPhrase(){
  const k = hb % 3; hb++; setMood(null); stopMusic(); curName = "happy-birthday";
  const spb = 60/112; let t = AC.currentTime+.06, beat = 0;
  HB[k].forEach(([m,d])=>{ sitar(m,t,Math.max(.5,d*spb*1.2),.24); bellI(m-12,t,Math.max(.7,d*spb*1.6),.15);
    if(Math.abs(beat%3)<1e-6) T.D(t,.6); t += d*spb; beat += d; });
  T.H(t, .5);   /* a soft closing strike */
}

/* ================= SOUND API USED BY THE ENGINE: init, cue, sfx, duck (plus state for QA) ================= */
const Sound = {
  init(){ try{ ac(); loadManifest(); }catch(e){} },
  cue(name){
    try{
      if(!ac()) return; loadManifest();
      if(name==="happy-birthday"){ hbPhrase(); return; }
      hb = 0;
      if(name===curName && name!=="silence" && (CUES[name]||name==="tabla")) return;   /* same cue again: keep playing */
      curName = name;
      if(name==="silence" || (!CUES[name] && name!=="tabla")){ setMood(null); stopMusic(); curName = "silence"; return; }
      if(name==="tabla"){ stopMusic(); setMood("tabla"); return; }
      setMood(null); startFile(name);
    }catch(e){}
  },
  sfx(name){ try{ if(!ac()) return; playSfx(name); }catch(e){} },
  duck(on){ try{ ducked = !!on; if(!AC) return; DUCK.gain.setTargetAtTime(ducked?.15:1, AC.currentTime, .05); if(cur && !cur.g) cur.el.volume = trackVol(cur); }catch(e){} },
  state(){ return {cue: curName, ducked}; },
};
