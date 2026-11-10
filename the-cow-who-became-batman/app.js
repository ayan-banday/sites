/* One link, two screens, a timer. Phone: the funnel. Laptop: a countdown until 00:00 IST on Nov 11, then the movie. */
const Q=new URLSearchParams(location.search);
const OPENS=Date.UTC(2026,10,10,18,30,0); // 2026-11-11 00:00 IST
const PREVIEW=Q.has('preview')||window.FORCE_MOVIE===true;
/* phones get the teaser; iPads, tablets and laptops get the movie */
const PHONE=window.FORCE_MOVIE!==true&&(Math.min(screen.width,screen.height)<600||matchMedia('(max-width:599px)').matches);
const TOUCH=matchMedia('(pointer:coarse)').matches;
const DPR=()=>Math.min(window.devicePixelRatio||1,1.5);
document.documentElement.classList.add('js');
initKit();letteringCSS();

/* small inline icons, drawn by hand (no filters, no emoji) */
function speakerIcon(col=GOLD){R=rng(3);return `<path d="${wob([[5,15],[13,15],[23,6],[23,34],[13,25],[5,25]],.8,true)}" fill="${col}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M28,14 q5,6 0,12 M32,9 q10,11 0,22" stroke="${col}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`}
document.querySelectorAll('svg.spk').forEach(s=>s.innerHTML=speakerIcon());

function skyArt(W,H,seed,far=.76){R=rng(seed);let a=`<rect width="${W}" height="${H}" fill="#2c0f2b"/>`;
  a+=washN(blob(W*.23,H*.3,W*.4,H*.41,24,.14),PLUM,.9)+washN(blob(W*.81,H*.75,W*.4,H*.4,24,.14),PLUM,.85)+washN(blob(W*.5,H*.52,W*.3,H*.27,20,.2),VIOLET,.5)+washN(blob(W*.12,H*.87,W*.23,H*.2,18,.2),VIOLET,.4)+washN(blob(W*.87,H*.15,W*.19,H*.19,18,.2),'#8a4f86',.3)+wash(blob(W*.5,H*.08,W*.55,H*.15,20,.2),NIGHT,.7)+wash(blob(W*.5,H*.97,W*.55,H*.15,20,.2),NIGHT,.6);
  a+=wash(blob(W*.48,H*.15,W*.12,H*.075,14,.3),AMBER,.12);
  for(let i=0;i<14;i++)a+=shade(R()*W*.94,R()*H*.95,80+R()*160,10+R()*14,7,i%3?VIOLET:'#8a4f86',.5,-20+R()*40,1.2);
  for(let i=0;i<10;i++)a+=curl(R()*W*.94,R()*H*.97,7+R()*6,6,'#8a4f86',.45);
  for(let i=0;i<Math.round(W*H/11000);i++)a+=`<circle cx="${(R()*W)|0}" cy="${(R()*H)|0}" r="${(.8+R()*1.8).toFixed(1)}" fill="${i%5?GOLD:CREAM}" opacity="${(.45+R()*.5).toFixed(2)}"/>`;
  for(let i=0;i<16;i++)a+=sparkle(R()*W,R()*H,4+R()*6,i%2?GOLD:AMBER);
  if(far)a+=starAt(W*(.5-far/2),H*.7,.9)+starAt(W*(.5+far/2),H*.31,.9);
  return a+frame(18,18,W-36,H-36,{sw:3.4,amp:2.4,stroke:GOLD,step:40});}
function coverCast(W,H){const s=Math.min(H/800,W/1280);return cow(W*.2,H-40*s,1.05*s,'sp tiny sparkles',{cape:'big'})+nerd(W*.82,H-34*s,.78*s,'side wobble sweat blush',{arms:'shrug'})}
function paintSky(cv,seed,far){const w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return Promise.resolve();
  return paint(cv,w,h,skyArt(w,h,seed,far)+(cv.id==='csky'?coverCast(w,h):''),w*Math.min(DPR(),1),h*Math.min(DPR(),1),'none')}

/* ================= PHONE ================= */
const partyHat=`<g transform="translate(18 -104) rotate(16)" filter="url(#wob)"><path d="M-20,8 L0,-48 L20,8Z" fill="${PINK}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/><path d="M-13,-12 L11,-2 M-7,-30 L7,-24" stroke="${GOLD}" stroke-width="5"/><circle cy="-50" r="8" fill="${GOLD}" stroke="${INK}" stroke-width="2.4"/><path d="M-22,8 q22,10 44,0" stroke="${INK}" stroke-width="2.6" fill="none"/></g>`;
function phone(){
  document.documentElement.classList.add('phone');document.getElementById('phone').hidden=false;
  const go=()=>{paintSky(document.getElementById('psky1'),19,0);paintSky(document.getElementById('psky2'),11,0);
    const pc=document.getElementById('pcow');R=rng(4);
    paint(pc,300,330,`<g transform="translate(150 190)"><g transform="translate(-112 -150) scale(.8)"><use href="#star"/></g><g transform="rotate(-12)">${cow(0,104,1,'sp tongue blush sparkles',{pose:'fly',top:partyHat})}</g>${sparkle(-120,-60,8,GOLD)}${sparkle(122,10,6,CREAM)}${sparkle(-96,90,5,GOLD)}${note(110,-80,1,GOLD,-12)}${note2(-130,40,.8,CREAM,10)}</g>`,pc.clientWidth*DPR(),pc.clientHeight*DPR());
    const pl=document.getElementById('plap');R=rng(9);
    paint(pl,220,150,`<path d="${wob(rectPts(22,10,176,128,16),1.2,true)}" fill="${INK}" stroke="${CREAM}" stroke-width="3" stroke-linejoin="round"/><path d="${wob(rectPts(34,20,152,108,18),1.1,true)}" fill="${PLUM}"/><circle cx="28" cy="74" r="2.2" fill="${CREAM}"/><g transform="translate(80 70) scale(.55)"><use href="#star"/></g><g transform="translate(146 56) scale(.55)"><use href="#star"/></g><path d="M200,40 v14" stroke="${CREAM}" stroke-width="3" stroke-linecap="round"/>`,pl.clientWidth*DPR(),pl.clientHeight*DPR());
    R=rng(6);document.getElementById('down').innerHTML=`<path d="${wob([[17,4],[17,26]],1)}" stroke="${GOLD}" stroke-width="2.6" stroke-linecap="round" fill="none"/><path d="${wob([[8,18],[17,28],[26,18]],1)}" stroke="${GOLD}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  };
  requestAnimationFrame(go);
}

/* ================= LAPTOP: the lock ================= */
const pad=n=>String(n).padStart(2,'0');
function lock(){
  document.documentElement.classList.add('wide');
  const el=document.getElementById('lock');el.hidden=false;
  requestAnimationFrame(()=>paintSky(document.getElementById('lsky'),53));
  const tick=()=>{const left=OPENS-Date.now();
    if(left<=0){clearInterval(iv);el.hidden=true;openMovie();return}
    const s=Math.floor(left/1000);document.getElementById('hh').textContent=pad(Math.floor(s/3600));document.getElementById('mm').textContent=pad(Math.floor(s/60)%60);document.getElementById('ss').textContent=pad(s%60)};
  const iv=setInterval(tick,1000);tick();
  // build the movie off-screen now, so midnight opens instantly
  buildMovie(true);
}

/* ================= LAPTOP: the movie ================= */
let built=false;
const queue=[];let painting=false;
function enqueue(job){queue.push(job);if(!painting)drain()}
async function drain(){painting=true;while(queue.length){const job=queue.shift();try{await job()}catch(e){console.warn(e)}await new Promise(r=>setTimeout(r,16))}painting=false}

function buildMovie(offstage){
  if(built)return;built=true;
  const mv=document.getElementById('movie');mv.hidden=false;if(offstage)mv.classList.add('offstage');
  R=rng(8);document.getElementById('btnArt').innerHTML=`<path class="fillme" d="${wob(rectPts(6,6,188,58,16),2.2,true)}" fill="${GOLD}" stroke="${INK}" stroke-width="3.2"/><path d="${wob(rectPts(9,9,184,54,20),2,true)}" fill="none" stroke="${INK}" stroke-width="1.6"/>`;
  const host=document.getElementById('chapters');
  CHAPTERS.forEach((ch,ci)=>host.appendChild(chapterEl(ch,ci)));setVol(A.vol);
  requestAnimationFrame(()=>{
    enqueue(()=>paintSky(document.getElementById('csky'),53));
    enqueue(()=>starImg());
    enqueue(()=>{const c=document.createElement('canvas');return paint(c,300,300,`<g transform="translate(150 160) rotate(-14)">${cow(0,60,.95,'hap xd sparkles',{pose:'fly',cape:'fly'})}</g>`,200,200).then(()=>document.querySelectorAll('image[data-cow]').forEach(i=>i.setAttribute('href',c.toDataURL())))});
    document.querySelectorAll('.fly .trail').forEach(t=>t.style.setProperty('--len',Math.ceil(t.getTotalLength())));
    document.querySelectorAll('[data-paint]').forEach(el=>enqueue(()=>PAINT.get(el)()));
    setupStory();
  });
}
function openMovie(){document.documentElement.classList.add('reader');buildMovie(false);document.getElementById('movie').classList.remove('offstage');scrollTo(0,0);
  requestAnimationFrame(()=>paintSky(document.getElementById('csky'),53))}

/* the two band stars are one small bitmap, shared */
let STAR='';
function starImg(){const c=document.createElement('canvas');return paint(c,80,80,`<g transform="translate(40 40)"><use href="#star"/></g>`,96,96).then(()=>{STAR=c.toDataURL();document.querySelectorAll('img.bstar').forEach(i=>i.src=STAR)})}

const PAINT=new Map();
function textEl(t,W,H){
  const d=document.createElement('div');d.className=`t ${t.k} ${t.cls||''}`;
  d.style.cssText=`left:${(t.x/W*100).toFixed(2)}%;top:${(t.y/H*100).toFixed(2)}%;${t.w?`width:${(t.w/W*100).toFixed(2)}%;`:''}${t.rot?`transform:rotate(${t.rot}deg);`:''}${t.fs?`--fs:${t.fs};`:''}${t.col?`color:${t.col};`:''}`;
  if(t.k==='ash')d.innerHTML=`<span class="spill" style="--h:${t.h||40}cqw">${t.html}</span>`;else d.innerHTML=t.html;
  if(t.tail){const [pos,at]=t.tail;const tl=document.createElementNS('http://www.w3.org/2000/svg','svg');tl.setAttribute('viewBox','0 0 42 38');tl.setAttribute('class',`tail ${pos.includes('t')?'up':''} ${pos.includes('r')?'flip':''}`);tl.style.left=`calc(${at??25}% - 21px)`;
    tl.innerHTML=`<path d="M4,2 C10,14 8,26 2,36 C16,30 28,18 32,2Z" fill="${t.k==='ash'?'#fffaf0':CREAM}"/><path d="M4,4 C10,14 8,26 2,36 C16,30 28,18 32,4" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round" ${t.k==='ash'?'stroke-dasharray="6 3"':''}/>`;d.appendChild(tl)}
  return d;
}
function chapterEl(ch,ci){
  const sec=document.createElement('section');sec.className='chapter';sec.id=ch.id;sec.setAttribute('aria-label',`${ch.num?`Chapter ${ch.num}, `:''}${ch.title}`);
  sec.style.setProperty('--mk-swipe',`var(--mk-${ch.mk}-swipe)`);sec.style.setProperty('--mk-circle',`var(--mk-${ch.mk}-circle)`);sec.style.setProperty('--mk-burst',`var(--mk-${ch.mk}-burst)`);
  sec.style.background=ch.pal.page;
  const g=document.createElement('canvas');g.className='bg';sec.appendChild(g);
  g.dataset.paint=1;PAINT.set(g,()=>{const w=sec.clientWidth,h=sec.clientHeight;return paint(g,640,640*h/w,ch.ground(640,640*h/w),w*.5,h*.5,'none')});
  const wrap=document.createElement('div');wrap.className='wrap';const page=document.createElement('div');page.className='page';wrap.appendChild(page);sec.appendChild(wrap);
  // the top band: drawn, with the two stars
  const band=document.createElement('div');band.className='band hid';band._ch=ch;const bc=document.createElement('canvas');band.appendChild(bc);
  bc.dataset.paint=1;band.style.setProperty('--W',1120);PAINT.set(bc,()=>paint(bc,1120,190,panelSVG(1120,190,900+ci,ch.band(1120,190)),band.clientWidth*DPR(),band.clientHeight*DPR()));
  const sw=document.createElement('div');sw.className=ch.orbit?'orbit':'';sw.style.cssText='position:absolute;inset:0';
  const prev=ci?CHAPTERS[ci-1].stars:.76;
  [-1,1].forEach(s=>{const i=document.createElement('img');i.className='bstar';i.alt='';i.dataset.s=s;i.style.transform=`translateX(${s*prev*50}cqw) translateY(${s*-12}%)`;sw.appendChild(i)});
  const kn=document.createElement('div');kn.className='bknob';kn.innerHTML=`<span>${ch.song}<br>sung by Gauri</span>`;makeDial(kn);band.appendChild(sw);band.appendChild(kn);if(ch.bandFx)band.insertAdjacentHTML('beforeend',ch.bandFx);
  band.appendChild(textEl({k:'ttl',x:200,y:16,w:720,html:`${ch.num?`<small>CHAPTER ${ch.num}</small>`:'<small>THE END</small>'}${ch.title}`},1120,190));
  page.appendChild(band);
  ch.rows.forEach(r=>{const row=document.createElement('div');row.className='row';row.style.gridTemplateColumns=r.map(i=>ch.panels[i].W+'fr').join(' ');row.style.setProperty('--rr',(Math.max(...r.map(i=>ch.panels[i].H))/r.reduce((s,i)=>s+ch.panels[i].W,0)).toFixed(4));
    r.forEach(i=>row.appendChild(panelEl(ch,ch.panels[i],ci*10+i)));page.appendChild(row)});
  ch._sec=sec;ch._band=band;
  return sec;
}
function panelEl(ch,p,seed){
  const el=document.createElement('div');el.className=`panel hid ${p.cls||''}`;el.style.setProperty('--W',p.W);el.style.aspectRatio=`${p.W}/${p.H}`;
  const c=document.createElement('canvas');el.appendChild(c);
  c.dataset.paint=1;PAINT.set(c,()=>paint(c,p.W,p.H,panelSVG(p.W,p.H,seed,bg(p.bg[0],p.W,p.H,seed,ch.pal,p.bg[1]||{})+p.art(p.W,p.H)),el.clientWidth*DPR(),el.clientWidth*p.H/p.W*DPR()));
  if(p.art2){const c2=document.createElement('canvas');c2.className='layer2';el.appendChild(c2);c2.dataset.paint=1;PAINT.set(c2,()=>paint(c2,p.W,p.H,p.art2(p.W,p.H),el.clientWidth*DPR(),el.clientWidth*p.H/p.W*DPR()))}
  if(p.over)el.insertAdjacentHTML('beforeend',p.over(p.W,p.H));
  (p.t||[]).forEach(t=>el.appendChild(textEl(t,p.W,p.H)));
  el.setAttribute('role','img');el.setAttribute('aria-label',(p.t||[]).filter(t=>t.k!=='ash').map(t=>t.html.replace(/<[^>]+>/g,' ')).join(' '));
  el._p=p;el._ch=ch;return el;
}

/* ---------- one tap, one card: no scrolling, the page moves itself ---------- */
let story=[],next=0,readyAt=0,qT=0,cur=null,started=false;
const PORTRAIT=matchMedia('(orientation:portrait) and (pointer:coarse)');
function reading(){return built&&!PHONE&&!PORTRAIT.matches&&!document.getElementById('movie').classList.contains('offstage')}
function moveStars(ch){ch._band.querySelectorAll('img.bstar').forEach(i=>{const s=+i.dataset.s;i.style.transform=`translateX(${s*ch.stars*50}cqw) translateY(${s*(ch.tilt??-12)}%)`;i.style.opacity=ch.dim||1})}
function setupStory(){
  story=[...document.querySelectorAll('#chapters .band,#chapters .panel')];
  const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('vis',e.isIntersecting)),{threshold:.35});
  document.querySelectorAll('.band,.panel,.chapter').forEach(el=>io.observe(el));
  if(Q.has('all')){document.documentElement.classList.remove('reader');CHAPTERS.forEach(moveStars);story.forEach(el=>{el.classList.remove('hid');runCue(el,true)});next=story.length;started=true}
}
/* how long a card stays before the next tap counts: longer for more words and the big moments */
function rest(el){
  if(el.classList.contains('band'))return 2400;
  const p=el._p,n=(p.t||[]).filter(t=>t.k!=='ash').map(t=>t.html.replace(/<[^>]+>/g,'')).join(' ').length;
  return Math.max({snap:3600,door:4000,cape:5200,flight:4600}[p.cue]||0,Math.min(4200,1300+n*30));
}
/* where the page should sit so the new card is in view: a band opens its chapter at the top; a panel shows its whole row */
function target(el){
  const y=scrollY,H=innerHeight,max=document.documentElement.scrollHeight-H;
  if(el.classList.contains('band'))return Math.min(max,el._ch._sec.getBoundingClientRect().top+y);
  const r=el.parentElement.getBoundingClientRect();
  if(r.top>=12&&r.bottom<=H-16)return y;
  return Math.max(0,Math.min(max,r.bottom+y-H+32,r.top+y-24));
}
let tw=0;
function glide(to,ms=1100){cancelAnimationFrame(tw);const from=scrollY,d=to-from;if(Math.abs(d)<2)return;
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){scrollTo(0,to);return}
  const t0=performance.now(),f=now=>{const k=Math.min(1,(now-t0)/ms),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;scrollTo(0,from+d*e);if(k<1)tw=requestAnimationFrame(f)};tw=requestAnimationFrame(f)}
function reveal(){
  if(next>=story.length)return;const el=story[next++];cur=el;el.classList.remove('hid');
  readyAt=performance.now()+rest(el);glide(target(el));
  if(el.classList.contains('band')){const ch=el._ch;setTimeout(()=>moveStars(ch),500);if(ch.cue)CUES[ch.cue](el)}else runCue(el);
}
/* an early tap is kept, not lost: the next card comes as soon as this one has had its moment */
function advance(){
  if(next>=story.length){replay();return}
  const wait=readyAt-performance.now();
  if(wait>0){clearTimeout(qT);qT=setTimeout(reveal,wait);return}
  reveal();
}
function begin(){if(started)return;started=true;wake();goFull().then(()=>setTimeout(reveal,350))}
document.addEventListener('click',e=>{if(!reading()||e.target.closest('.bknob'))return;if(!started){begin();return}wake();advance()});
addEventListener('keydown',e=>{if(!reading()||document.activeElement.classList?.contains('bdial'))return;
  if([' ','ArrowDown','ArrowRight','PageDown','Enter'].includes(e.key)){if(e.key==='Enter'&&e.target.closest('button'))return;e.preventDefault();if(!started)begin();else advance()}
  else if(['ArrowUp','ArrowLeft','PageUp','Home','End'].includes(e.key))e.preventDefault()});
/* no free scrolling: a wheel flick or a swipe up counts as one tap */
let wq=0;addEventListener('wheel',e=>{if(!reading())return;e.preventDefault();const now=performance.now();if(started&&now-wq>450&&e.deltaY>8)advance();wq=now},{passive:false});
let ty=null,tx=0;
addEventListener('touchstart',e=>{ty=e.touches[0].clientY;tx=e.touches[0].clientX},{passive:true});
addEventListener('touchmove',e=>{if(reading()&&!e.target.closest('.bdial'))e.preventDefault()},{passive:false});
addEventListener('touchend',e=>{if(!reading()||ty===null||!started)return;const t=e.changedTouches[0],dy=t.clientY-ty,dx=t.clientX-tx;ty=null;if(dy<-40&&Math.abs(dy)>Math.abs(dx)){wake();advance()}},{passive:true});
/* after the last card, a tap sends the cow round again */
function replay(){const el=cur;if(!el||el._p?.cue!=='flight'||!el.classList.contains('done')||performance.now()<readyAt)return;
  el.classList.remove('flying','done');void el.offsetWidth;readyAt=performance.now()+4600;CUES.flight(el)}

/* ================= sound: her songs, in the background ================= */
const SONGS={risk:['songs/risk-it-all.mp3','Risk It All'],cloud:['songs/cloud-9.mp3','Cloud 9'],reckless:['songs/reckless.mp3','Reckless'],rain:['sfx/rain.mp3','rain']};
const CHORUS=46; // Cloud 9 lifts here: the cape lands on it
const A={vol:.55,tr:{},on:false,want:'risk'};
/* Sound goes through a Web Audio gain node: iPads ignore an audio element's volume, but obey a gain node */
let ACX=null;
function wire(c){if(ACX&&!c.node){try{const s=ACX.createMediaElementSource(c.el);c.node=ACX.createGain();c.node.gain.value=0;s.connect(c.node).connect(ACX.destination)}catch(e){}}}
function setLevel(c,v){v=Math.max(0,Math.min(1,v));if(c.node){c.node.gain.value=v;c.el.volume=1}else c.el.volume=v}
/* a song never jumps back to its start: near the end it fades away, then comes back in from the top */
function track(k){if(!A.tr[k]){const el=new Audio(SONGS[k][0]);el.preload='auto';const c=A.tr[k]={el,g:0,t:0,ms:1500,mul:1,lm:1,lmT:1};wire(c);
  if(k==='rain')el.loop=true;else{
    el.addEventListener('timeupdate',()=>{if(c.lmT&&el.duration&&el.duration-el.currentTime<3.2){c.lmT=0;kick()}});
    el.addEventListener('ended',()=>{try{el.currentTime=0}catch(e){}if(c.t>0)el.play().catch(()=>{});c.lmT=1;kick()})}}
  return A.tr[k]}
const FX={};
function fx(n){if(!FX[n]){const c={el:new Audio(`sfx/${n}.mp3`)};c.el.preload='auto';FX[n]=c;wire(c)}return FX[n]}
let last=0,raf=0;
function kick(){if(!raf)raf=requestAnimationFrame(step)}
/* equal-power fades: while one song leaves and the next arrives, the room stays just as full */
function step(ts){const dt=last?Math.min(ts-last,100):16;last=ts;let busy=false;
  for(const k in A.tr){const c=A.tr[k];
    if(c.g!==c.t){const d=dt/c.ms;c.g=c.t>c.g?Math.min(c.t,c.g+d):Math.max(c.t,c.g-d);busy=true}
    if(c.lm!==c.lmT){const d=dt/2600;c.lm=c.lmT>c.lm?Math.min(c.lmT,c.lm+d):Math.max(c.lmT,c.lm-d);busy=true}
    setLevel(c,Math.sin(c.g*Math.PI/2)*A.vol*c.mul*c.lm);if(c.g===0&&c.t===0&&!c.el.paused)c.el.pause()}
  raf=busy?requestAnimationFrame(step):0;if(!busy)last=0}
function fadeTo(k,t,ms){const c=track(k);c.t=t;c.ms=ms;if(t>0&&c.el.paused&&A.on){c.el.play().catch(()=>{})}kick()}
/* change songs: both play together for a few seconds; `from` starts the new one at a chosen spot */
function song(k,ms=5000,from){A.want=k;if(!A.on)return;for(const o in A.tr)if(o!==k&&o!=='rain')fadeTo(o,0,ms);
  if(k){const c=track(k);if(from!=null&&c.g===0){try{c.el.currentTime=from}catch(e){}}fadeTo(k,1,ms)}}
function label(){}
function sfx(n,rel=.55,delay=0){if(!A.on)return;setTimeout(()=>{const c=fx(n);setLevel(c,A.vol*rel*1.6);try{c.el.currentTime=0}catch(e){}c.el.play().catch(()=>{})},delay)}
function wake(){if(A.on)return;A.on=true;
  // inside her first tap: start the mixer and unlock every sound, so later cues can play on an iPad
  try{const C=window.AudioContext||window.webkitAudioContext;if(C){ACX=new C();ACX.resume&&ACX.resume()}}catch(e){}
  ['risk','cloud','reckless','rain'].forEach(k=>{const c=track(k);wire(c);if(k!==A.want){setLevel(c,0);c.el.play().then(()=>{if(c.t===0)c.el.pause()}).catch(()=>{})}});
  ['gasp','snap','thunder','sparkle'].forEach(n=>{const c=fx(n);wire(c);setLevel(c,0);c.el.play().then(()=>c.el.pause()).catch(()=>{})});const k=A.want;A.want=null;if(k==='rain')fadeTo('rain',1,1500);else song(k,3000)}
/* full screen needs a click: "let's begin" (or any click on the countdown) hides the browser's bars */
function goFull(){const d=document.documentElement;if(document.fullscreenElement||document.webkitFullscreenElement)return Promise.resolve();
  try{const r=d.requestFullscreen?d.requestFullscreen({navigationUI:'hide'}):d.webkitRequestFullscreen&&d.webkitRequestFullscreen();return Promise.resolve(r).catch(()=>{})}catch(e){return Promise.resolve()}}
document.getElementById('lock').addEventListener('click',()=>goFull());

/* cues fire when their card appears */
function runCue(el,silent){const p=el._p;if(!p||!p.cue)return;if(silent){if(p.cue==='flight')el.classList.add('flying','done');if(p.art2)el.classList.add('cape');return}CUES[p.cue](el)}
const CUES={
  risk:()=>song('risk'),
  cloud:()=>song('cloud',5000,0),
  gasp:()=>sfx('gasp',.45,900),
  glow:el=>setTimeout(()=>el.classList.add('cape'),1300),
  // the string snaps: the music stops with the snap, then thunder, then the rain comes in under it
  snap:()=>{for(const k in A.tr)if(k!=='rain')fadeTo(k,0,350);if(!A.on)A.want='rain';sfx('snap',.55);sfx('thunder',.4,1300);setTimeout(()=>fadeTo('rain',1,3000),1100)},
  thunder:()=>sfx('thunder',.35,600),
  // the door: the rain thins out slowly while Reckless rises under it
  door:()=>{fadeTo('rain',0,8000);setTimeout(()=>song('reckless',6000,0),500)},
  ending:()=>song('cloud',5000,0),
  // a short hush, then the cape lands on the lift in Cloud 9
  cape:el=>{for(const k in A.tr)fadeTo(k,0,1200);setTimeout(()=>{el.classList.add('cape');sfx('sparkle',.5);if(A.on){const c=track('cloud');try{c.el.currentTime=CHORUS}catch(e){}fadeTo('cloud',1,2500)}},2600)},
  // "Happy 19th," as she takes off; "Batman." stamps in as the 19 is finished
  flight:el=>{const m=el.querySelector('animateMotion');setTimeout(()=>{el.classList.add('flying');if(m){try{m.beginElement()}catch(e){}}},400);setTimeout(()=>{el.classList.add('done');sfx('sparkle',.45)},4000)}
};

/* ---------- the volume: a hand-drawn knob inside each chapter's top band ---------- */
const DIAL=(()=>{R=rng(15);let a='';
  for(let i=0;i<=10;i++){const an=(-135+i*27)*Math.PI/180;a+=`<path d="M${(Math.sin(an)*29).toFixed(1)},${(-Math.cos(an)*29).toFixed(1)} L${(Math.sin(an)*34).toFixed(1)},${(-Math.cos(an)*34).toFixed(1)}" stroke="${GOLD}" stroke-width="${i%5?1.6:2.6}" stroke-linecap="round"/>`}
  a+=`<path d="${blob(0,0,24,24,18,.03)}" fill="${CREAM}" stroke="${INK}" stroke-width="2.6"/><path d="${blob(0,0,17,17,14,.04)}" fill="none" stroke="${INK}" stroke-width="1.4"/>`;
  return a+`<g class="ptr"><path d="M0,-6 L0,-21" stroke="${PINK}" stroke-width="4.4" stroke-linecap="round"/><circle r="3" fill="${INK}"/></g>`})();
const dials=[];
function makeDial(host){const d=document.createElementNS('http://www.w3.org/2000/svg','svg');d.setAttribute('viewBox','-38 -38 76 76');d.setAttribute('class','bdial');d.setAttribute('role','slider');d.setAttribute('tabindex','0');d.setAttribute('aria-label','Music volume');d.setAttribute('aria-valuemin','0');d.setAttribute('aria-valuemax','100');d.innerHTML=DIAL;host.appendChild(d);dials.push(d);
  const from=e=>{const r=d.getBoundingClientRect();let an=Math.atan2(e.clientX-(r.left+r.width/2),-(e.clientY-(r.top+r.height/2)))*180/Math.PI;an=Math.max(-135,Math.min(135,an));setVol((an+135)/270)};
  d.addEventListener('pointerdown',e=>{e.stopPropagation();wake();d.setPointerCapture(e.pointerId);from(e)});
  d.addEventListener('pointermove',e=>{if(d.hasPointerCapture(e.pointerId))from(e)});
  d.addEventListener('keydown',e=>{if(e.key==='ArrowUp'||e.key==='ArrowRight'){e.preventDefault();setVol(A.vol+.05)}if(e.key==='ArrowDown'||e.key==='ArrowLeft'){e.preventDefault();setVol(A.vol-.05)}});}
function setVol(v){A.vol=Math.max(0,Math.min(1,v));if(!raf)raf=requestAnimationFrame(step);dials.forEach(d=>{d.querySelector('.ptr').setAttribute('transform',`rotate(${-135+A.vol*270})`);d.setAttribute('aria-valuenow',Math.round(A.vol*100))})}

let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{['psky1','psky2','lsky','csky'].forEach((id,i)=>{const c=document.getElementById(id);if(c&&c.offsetParent!==null)paintSky(c,[19,11,53,53][i],i<2?0:.76)});if(cur&&!Q.has('all'))scrollTo(0,target(cur))},300)});

/* ---------- go ---------- */
if(PHONE)phone();
else if(!PREVIEW&&Date.now()<OPENS)lock();
else{document.documentElement.classList.add('wide');openMovie()}
