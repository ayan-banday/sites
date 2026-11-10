/* One link, two screens, a timer. Phone: the funnel. Laptop: a countdown until 00:00 IST on Nov 11, then the movie. */
const Q=new URLSearchParams(location.search);
const OPENS=Date.UTC(2026,10,10,18,30,0); // 2026-11-11 00:00 IST
const PREVIEW=Q.has('preview');
const PHONE=matchMedia('(max-width:760px),(pointer:coarse)').matches;
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
function paintSky(cv,seed,far){const w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return Promise.resolve();
  return paint(cv,w,h,skyArt(w,h,seed,far),w*Math.min(DPR(),1),h*Math.min(DPR(),1),'none')}

/* ================= PHONE ================= */
const partyHat=`<g transform="translate(18 -104) rotate(16)" filter="url(#wob)"><path d="M-20,8 L0,-48 L20,8Z" fill="${PINK}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/><path d="M-13,-12 L11,-2 M-7,-30 L7,-24" stroke="${GOLD}" stroke-width="5"/><circle cy="-50" r="8" fill="${GOLD}" stroke="${INK}" stroke-width="2.4"/><path d="M-22,8 q22,10 44,0" stroke="${INK}" stroke-width="2.6" fill="none"/></g>`;
function phone(){
  document.documentElement.classList.add('phone');document.getElementById('phone').hidden=false;
  const go=()=>{paintSky(document.getElementById('psky1'),19,0);paintSky(document.getElementById('psky2'),11,0);
    const pc=document.getElementById('pcow');R=rng(4);
    paint(pc,300,330,`<g transform="translate(150 190)"><g transform="translate(-112 -150) scale(.8)"><use href="#star"/></g><g transform="rotate(-12)">${cow(0,104,1,'sp tongue blush sparkles',{pose:'fly',top:partyHat})}</g>${sparkle(-120,-60,8,GOLD)}${sparkle(122,10,6,CREAM)}${sparkle(-96,90,5,GOLD)}${note(110,-80,1,GOLD,-12)}${note2(-130,40,.8,CREAM,10)}</g>`,pc.clientWidth*DPR(),pc.clientHeight*DPR());
    const pl=document.getElementById('plap');R=rng(9);
    paint(pl,220,150,`<path d="${wob(rectPts(36,14,148,98,18),1.4,true)}" fill="${INK}" stroke="${CREAM}" stroke-width="3"/><path d="${wob(rectPts(46,24,128,78,18),1.2,true)}" fill="${PLUM}"/><g transform="translate(78 62) scale(.5)"><use href="#star"/></g><g transform="translate(146 50) scale(.5)"><use href="#star"/></g><path d="${wob([[16,118],[204,118],[214,134],[6,134]],1.4,true)}" fill="${INK}" stroke="${CREAM}" stroke-width="3" stroke-linejoin="round"/><path d="M92,126 h36" stroke="${CREAM}" stroke-width="2" stroke-linecap="round"/>`,pl.clientWidth*DPR(),pl.clientHeight*DPR());
    R=rng(6);document.getElementById('down').innerHTML=`<path d="${wob([[17,4],[17,26]],1)}" stroke="${GOLD}" stroke-width="2.6" stroke-linecap="round" fill="none"/><path d="${wob([[8,18],[17,28],[26,18]],1)}" stroke="${GOLD}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  };
  requestAnimationFrame(go);
}

/* ================= LAPTOP: the lock ================= */
const pad=n=>String(n).padStart(2,'0');
function lock(){
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
  CHAPTERS.forEach((ch,ci)=>host.appendChild(chapterEl(ch,ci)));
  requestAnimationFrame(()=>{
    enqueue(()=>paintSky(document.getElementById('csky'),53));
    enqueue(()=>starImg());
    document.querySelectorAll('[data-paint]').forEach(el=>enqueue(()=>PAINT.get(el)()));
    setupStory();
  });
}
function openMovie(){buildMovie(false);document.getElementById('movie').classList.remove('offstage');scrollTo(0,0);
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
  const band=document.createElement('div');band.className='band';const bc=document.createElement('canvas');band.appendChild(bc);
  bc.dataset.paint=1;PAINT.set(bc,()=>paint(bc,1120,150,panelSVG(1120,150,900+ci,ch.band(1120,150)),band.clientWidth*DPR(),band.clientHeight*DPR()));
  const sw=document.createElement('div');sw.className=ch.orbit?'orbit':'';sw.style.cssText='position:absolute;inset:0';
  const prev=ci?CHAPTERS[ci-1].stars:.76;
  [-1,1].forEach(s=>{const i=document.createElement('img');i.className='bstar';i.alt='';i.dataset.s=s;i.style.transform=`translateX(${s*prev*50}cqw) translateY(${s*-12}%)`;sw.appendChild(i)});
  band.appendChild(sw);if(ch.bandFx)band.insertAdjacentHTML('beforeend',ch.bandFx);
  band.appendChild(textEl({k:'ttl',x:200,y:22,w:720,html:`${ch.num?`<small>CHAPTER ${ch.num}</small>`:'<small>THE END</small>'}${ch.title}`},1120,150));
  page.appendChild(band);
  ch.rows.forEach(r=>{const row=document.createElement('div');row.className='row';row.style.gridTemplateColumns=r.map(i=>ch.panels[i].W+'fr').join(' ');
    r.forEach(i=>row.appendChild(panelEl(ch,ch.panels[i],ci*10+i)));page.appendChild(row)});
  if(ci<CHAPTERS.length-1){const n=CHAPTERS[ci+1];const tz=document.createElement('div');tz.className='teaser hid';tz.innerHTML=`<svg width="90" height="34" viewBox="0 0 90 34" aria-hidden="true">${(()=>{R=rng(ci+70);return `<path d="${wob([[8,18],[82,18]],1.4)}" stroke="${GOLD}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-dasharray="3 6"/><path d="${wob([[70,8],[84,18],[70,28]],1)}" stroke="${GOLD}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`})()}</svg><span>next: <b>${n.title}</b></span>`;
    tz.addEventListener('click',e=>{e.stopPropagation();document.getElementById(n.id).scrollIntoView({behavior:'smooth'})});wrap.appendChild(tz);ch._teaser=tz}
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
  el.insertAdjacentHTML('beforeend','<div class="hint">click for the next panel ›</div>');
  el.setAttribute('role','img');el.setAttribute('aria-label',(p.t||[]).filter(t=>t.k!=='ash').map(t=>t.html.replace(/<[^>]+>/g,' ')).join(' '));
  el._p=p;el._ch=ch;return el;
}

/* ---------- reveal one panel at a time ---------- */
let story=[],next=0,lockT=0;
function setupStory(){
  story=[...document.querySelectorAll('#chapters .panel')];
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    e.target.classList.toggle('vis',e.isIntersecting);
    if(e.isIntersecting&&e.target.classList.contains('band')){const ch=CHAPTERS.find(c=>c._band===e.target);
      e.target.querySelectorAll('img.bstar').forEach(i=>{const s=+i.dataset.s;i.style.transform=`translateX(${s*ch.stars*50}cqw) translateY(${s*(ch.tilt??-12)}%)`;i.style.opacity=ch.dim||1})}
  }),{threshold:.35});
  document.querySelectorAll('.band,.panel,.chapter').forEach(el=>io.observe(el));
  if(Q.has('all')){story.forEach(el=>{el.classList.remove('hid');runCue(el,true)});next=story.length;CHAPTERS.forEach(c=>c._teaser&&c._teaser.classList.remove('hid'));return}
  mark();
}
function mark(){story.forEach((el,i)=>el.classList.toggle('nexth',i===next))}
function reveal(fromScroll){
  if(next>=story.length)return;const el=story[next++];el.classList.remove('hid');
  if(!fromScroll){const r=el.getBoundingClientRect();if(r.bottom>innerHeight-20||r.top<0)el.scrollIntoView({behavior:'smooth',block:r.height>innerHeight*.8?'start':'center'})}
  runCue(el);mark();
  const ch=el._ch;const last=ch.panels[ch.rows.flat().slice(-1)[0]];if(el._p===last&&ch._teaser)setTimeout(()=>ch._teaser.classList.remove('hid'),2400);
}
document.addEventListener('click',e=>{if(!built||document.getElementById('movie').classList.contains('offstage'))return;if(e.target.closest('#knob,#cover,.teaser'))return;wake();reveal()});
addEventListener('keydown',e=>{if(!built||document.activeElement.id==='dial')return;if((e.key===' '||e.key==='ArrowRight')&&next<story.length&&document.getElementById('cover').getBoundingClientRect().bottom<innerHeight*.5){e.preventDefault();wake();reveal()}});
addEventListener('scroll',()=>{if(!story.length||next>=story.length||Date.now()<lockT)return;const r=story[next].getBoundingClientRect();if(r.top<innerHeight*.7){lockT=Date.now()+900;wake();reveal(true)}},{passive:true});

/* ================= sound: her songs, barely there ================= */
const SONGS={risk:['songs/risk-it-all.m4a','Risk It All'],cloud:['songs/cloud-9.m4a','Cloud 9'],reckless:['songs/reckless.m4a','Reckless'],rain:['sfx/rain.mp3','rain']};
const A={vol:.15,tr:{},on:false,want:'risk'};
function track(k){if(!A.tr[k]){const el=new Audio(SONGS[k][0]);el.loop=true;el.preload='auto';A.tr[k]={el,g:0,t:0,ms:1500,mul:k==='rain'?.5:1}}return A.tr[k]}
let last=0,raf=0;
function step(ts){const dt=last?ts-last:16;last=ts;let busy=false;
  for(const k in A.tr){const c=A.tr[k];if(c.g!==c.t){const d=dt/c.ms;c.g=c.t>c.g?Math.min(c.t,c.g+d):Math.max(c.t,c.g-d);busy=true}
    c.el.volume=Math.max(0,Math.min(1,c.g*A.vol*c.mul));if(c.g===0&&c.t===0&&!c.el.paused)c.el.pause()}
  raf=busy?requestAnimationFrame(step):0;if(!busy)last=0}
function fadeTo(k,t,ms){const c=track(k);c.t=t;c.ms=ms;if(t>0&&c.el.paused&&A.on){c.el.play().catch(()=>{})}if(!raf)raf=requestAnimationFrame(step)}
function song(k,ms=2500){A.want=k;if(!A.on)return;for(const o in A.tr)if(o!==k&&o!=='rain')fadeTo(o,0,1500);if(k)fadeTo(k,1,ms);label(k)}
function label(k){if(!k)return;document.getElementById('song').textContent=k==='rain'?'rain':`${SONGS[k][1]} · sung by Gauri`}
function sfx(n,rel=.55,delay=0){if(!A.on)return;setTimeout(()=>{const a=new Audio(`sfx/${n}.mp3`);a.volume=Math.min(1,A.vol*rel*2.2);a.play().catch(()=>{})},delay)}
function wake(){if(A.on)return;A.on=true;document.getElementById('knob').hidden=false;const k=A.want;A.want=null;if(k==='rain'){fadeTo('rain',1,1500);label('rain')}else song(k)}
document.getElementById('begin').addEventListener('click',()=>{wake();const f=CHAPTERS[0];document.getElementById(f.id).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})});

/* cues fire when their panel appears */
function runCue(el,silent){const p=el._p;if(!p||!p.cue)return;if(silent&&p.cue!=='flight')return;CUES[p.cue](el)}
const CUES={
  risk:()=>song('risk'),
  cloud:()=>song('cloud'),
  gasp:()=>sfx('gasp',.45,900),
  snap:()=>{for(const k in A.tr)if(k!=='rain')fadeTo(k,0,120);if(!A.on)A.want='rain';sfx('snap',.7,150);sfx('thunder',.5,1700);setTimeout(()=>{fadeTo('rain',1,2500);label('rain')},1900)},
  thunder:()=>sfx('thunder',.35,600),
  door:()=>{sfx('creak',.6,300);fadeTo('rain',0,3500);setTimeout(()=>song('reckless',4000),900)},
  ending:()=>song('cloud',3000),
  cape:el=>{for(const k in A.tr)fadeTo(k,0,1400);setTimeout(()=>{el.classList.add('cape');if(A.on)setTimeout(()=>fadeTo('cloud',1,3500),1800)},4200)},
  flight:el=>{setTimeout(()=>el.classList.add('flying'),700);const m=el.querySelector('animateMotion');if(m)setTimeout(()=>{try{m.beginElement()}catch(e){}},700);setTimeout(()=>el.classList.add('done'),8600)}
};

/* ---------- the hand-drawn volume knob ---------- */
const dial=document.getElementById('dial');
(function(){R=rng(15);let a='';
  for(let i=0;i<=10;i++){const an=(-135+i*27)*Math.PI/180;a+=`<path d="M${(Math.sin(an)*29).toFixed(1)},${(-Math.cos(an)*29).toFixed(1)} L${(Math.sin(an)*34).toFixed(1)},${(-Math.cos(an)*34).toFixed(1)}" stroke="${GOLD}" stroke-width="${i%5?1.6:2.6}" stroke-linecap="round"/>`}
  a+=`<path d="${blob(0,0,24,24,18,.03)}" fill="${CREAM}" stroke="${INK}" stroke-width="2.6"/><path d="${blob(0,0,17,17,14,.04)}" fill="none" stroke="${INK}" stroke-width="1.4"/>`;
  a+=`<g id="ptr"><path d="M0,-6 L0,-21" stroke="${PINK}" stroke-width="4.4" stroke-linecap="round"/><circle cx="0" cy="0" r="3" fill="${INK}"/></g>`;dial.innerHTML=a})();
function setVol(v){A.vol=Math.max(0,Math.min(1,v));if(!raf)raf=requestAnimationFrame(step);dial.querySelector('#ptr').setAttribute('transform',`rotate(${-135+A.vol*270})`);dial.setAttribute('aria-valuenow',Math.round(A.vol*100));document.getElementById('vol').textContent=`volume ${Math.round(A.vol*100)}%`}
setVol(.15);
function fromPointer(e){const r=dial.getBoundingClientRect();let an=Math.atan2(e.clientX-(r.left+r.width/2),-(e.clientY-(r.top+r.height/2)))*180/Math.PI;an=Math.max(-135,Math.min(135,an));setVol((an+135)/270)}
dial.addEventListener('pointerdown',e=>{dial.setPointerCapture(e.pointerId);fromPointer(e)});
dial.addEventListener('pointermove',e=>{if(dial.hasPointerCapture(e.pointerId))fromPointer(e)});
dial.addEventListener('keydown',e=>{if(e.key==='ArrowUp'||e.key==='ArrowRight'){e.preventDefault();setVol(A.vol+.05)}if(e.key==='ArrowDown'||e.key==='ArrowLeft'){e.preventDefault();setVol(A.vol-.05)}});

let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{['psky1','psky2','lsky','csky'].forEach((id,i)=>{const c=document.getElementById(id);if(c&&c.offsetParent!==null)paintSky(c,[19,11,53,53][i],i<2?0:.76)})},300)});

/* ---------- go ---------- */
if(PHONE)phone();
else if(!PREVIEW&&Date.now()<OPENS)lock();
else openMovie();
