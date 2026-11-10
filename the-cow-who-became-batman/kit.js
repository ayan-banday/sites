/* The drawing kit. Every character is drawn once; faces, arms, capes and props swap per panel.
   Heavy SVG filters only ever run once: paint() turns a drawing into a plain bitmap. */
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let R=rng(1111);
const j=a=>(R()-.5)*2*a;

/* Night: Wada Sanzo No. 53, Yellow Orange + Dusky Madder Violet. Chapter colours sit in story.js. */
const INK='#2b0d2a',CREAM='#fdf4e3',GOLD='#fcb315',AMBER='#f99d1b',PINK='#b73f74',ROSE='#e47fa8',BLUSH='#f7cbd9',
      VIOLET='#59256a',PLUM='#4e1d4c',NIGHT='#1d0a1c',MUZZLE='#f6b9c9',SKIN='#d49a72',HAIR='#24121f',TEAR='#fff8ee';

function wob(pts,amp=1.6,close=false){let d='';pts.forEach((p,i)=>{d+=(i?'L':'M')+(p[0]+j(amp)).toFixed(1)+','+(p[1]+j(amp)).toFixed(1)});return d+(close?'Z':'')}
function rectPts(x,y,w,h,step=22){const p=[];for(let i=0;i<=w;i+=step)p.push([x+i,y]);for(let i=step;i<=h;i+=step)p.push([x+w,y+i]);for(let i=w-step;i>=0;i-=step)p.push([x+i,y+h]);for(let i=h-step;i>0;i-=step)p.push([x,y+i]);return p}
function frame(x,y,w,h,o={}){const s=o.sw||3;let g='';for(let k=0;k<(o.passes||2);k++)g+=`<path d="${wob(rectPts(x+j(1.5),y+j(1.5),w,h,o.step||22),o.amp||1.8,true)}" fill="${k?'none':(o.fill||'none')}" stroke="${o.stroke||INK}" stroke-width="${k?s*.55:s}" stroke-linejoin="round" stroke-linecap="round"/>`;return g}
function blob(cx,cy,rx,ry,n=22,lump=.16){const p=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2,r=1+j(lump);p.push([cx+Math.cos(a)*rx*r,cy+Math.sin(a)*ry*r])}return wob(p,2,true)}
function wash(d,col,op){return `<g style="mix-blend-mode:multiply"><path d="${d}" fill="${col}" fill-opacity="${op}" filter="url(#wc)"/><path d="${d}" fill="none" stroke="${col}" stroke-opacity="${Math.min(1,op*1.9)}" stroke-width="3.5" filter="url(#wc)"/></g>`}
function washN(d,col,op){return `<path d="${d}" fill="${col}" fill-opacity="${op}" filter="url(#wc)"/>`}
function hatch(id,col,w=3.2,gap=6,ang=38,col2){return `<pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse" patternTransform="rotate(${ang})"><line x1="1" y1="0" x2="1" y2="${gap}" stroke="${col}" stroke-width="${w}"/>${col2?`<line x1="${gap/2+1}" y1="0" x2="${gap/2+1}" y2="${gap}" stroke="${col2}" stroke-width="${w*.7}"/>`:''}</pattern>`}
function stripes(id,cols,ang=78){const g=cols.length*4.6;let l='';cols.forEach((c,i)=>l+=`<line x1="${i*4.6+1.4}" y1="0" x2="${i*4.6+1.4}" y2="10" stroke="${c}" stroke-width="3.6"/>`);return `<pattern id="${id}" width="${g}" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(${ang})">${l}</pattern>`}
function shade(x,y,w,h,step,col,op,ang=0,sw=1.3){const p=[];for(let i=0;i<=w;i+=step){p.push([x+i,y+j(3)]);p.push([x+i+step/2,y+h+j(3)])}return `<path d="${wob(p,1.2)}" fill="none" stroke="${col}" stroke-opacity="${op}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" transform="rotate(${ang} ${x+w/2} ${y+h/2})" filter="url(#pencil)"/>`}
function curl(x,y,r,n,col,op,sw=1.4){const p=[];for(let i=0;i<n;i++){const a=i*.9;p.push([x+i*r*.55+Math.cos(a)*r,y+Math.sin(a)*r])}return `<path d="${wob(p,1)}" fill="none" stroke="${col}" stroke-opacity="${op}" stroke-width="${sw}" stroke-linecap="round" filter="url(#pencil)"/>`}
function note(x,y,s,col,r=0){return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" filter="url(#wob)"><ellipse rx="7" ry="5" transform="rotate(-20)" fill="${col}" stroke="${INK}" stroke-width="1.8"/><path d="M6,-2 V-30 q10,6 14,16" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/></g>`}
function note2(x,y,s,col,r=0){return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" filter="url(#wob)"><ellipse rx="7" ry="5" transform="rotate(-20)" fill="${col}" stroke="${INK}" stroke-width="1.8"/><ellipse cx="24" cy="-5" rx="7" ry="5" transform="rotate(-20 24 -5)" fill="${col}" stroke="${INK}" stroke-width="1.8"/><path d="M6,-2 V-30 L30,-36 V-7" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M6,-24 L30,-30" stroke="${INK}" stroke-width="4"/></g>`}
function vnote(x,y,w,r,fill){let b='';for(let i=0;i<(w-34)/5;i++){const h=3+Math.abs(Math.sin(i*1.7+x))*7;b+=`<path d="M${30+i*5},${11-h/2} v${h}" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`}
  return `<g transform="translate(${x} ${y}) rotate(${r})"><path d="${wob(rectPts(0,0,w,22,10),.8,true)}" fill="${fill}" stroke="${INK}" stroke-width="2" stroke-linejoin="round" filter="url(#wob)"/><circle cx="13" cy="11" r="7" fill="${PINK}" stroke="${INK}" stroke-width="1.5"/><path d="M11,7.5 L16,11 L11,14.5Z" fill="${CREAM}"/>${b}</g>`}
function bars(x,y,w,rows,gap=13,th=9){let g='';for(let i=0;i<rows;i++){const ww=w*(i==rows-1?.55+R()*.2:.85+R()*.15);g+=`<path d="${wob([[x,y+i*gap-th/2],[x+ww*.5,y+i*gap-th/2+j(1)],[x+ww,y+i*gap-th/2+j(1)],[x+ww+j(2),y+i*gap+th/2],[x+ww*.5,y+i*gap+th/2+j(1)],[x,y+i*gap+th/2]],.7,true)}" fill="${INK}"/>`}return g}
function sparkle(x,y,r,col){return `<path d="M${x},${y-r} Q${x+r*.18},${y-r*.18} ${x+r},${y} Q${x+r*.18},${y+r*.18} ${x},${y+r} Q${x-r*.18},${y+r*.18} ${x-r},${y} Q${x-r*.18},${y-r*.18} ${x},${y-r}Z" fill="${col}" filter="url(#wob)"/>`}
const ln=(d,w=2.4,col=INK,f='wob')=>`<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${f?` filter="url(#${f})"`:''}/>`;
const box=(x,y,w,h,fill=CREAM)=>`<path d="${wob(rectPts(x,y,w,h,18),1.2,true)}" fill="${INK}" opacity=".35" transform="translate(4 5)"/><path d="${wob(rectPts(x,y,w,h,18),1.2,true)}" fill="${fill}" stroke="${INK}" stroke-width="2.6"/>`;
/* a drawn "XD" with no font */
const xdMark=(x,y,s,col)=>`<g transform="translate(${x} ${y}) scale(${s})" stroke="${col}" stroke-width="2.6" fill="none" stroke-linecap="round" filter="url(#wob)"><path d="M-12,-7 L-2,7 M-2,-7 L-12,7"/><path d="M3,-7 V7 Q14,7 14,0 Q14,-7 3,-7"/></g>`;

const FILTERS=`
<filter id="grain" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.75" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>
<filter id="wob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="7" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="3.2" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="pencil" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="9" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="4" xChannelSelector="R" yChannelSelector="G" result="d"/><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="2" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.6" result="m"/><feComposite in="d" in2="m" operator="in"/></filter>
<filter id="wc" x="-25%" y="-25%" width="150%" height="150%"><feTurbulence type="fractalNoise" baseFrequency=".013" numOctaves="3" seed="11" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="46" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="1.6" result="b"/><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" seed="5" result="g"/><feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.3 1.45" result="gm"/><feComposite in="b" in2="gm" operator="in"/></filter>
<filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="14"/></filter>`;

const PATTERNS=
 hatch('hG',GOLD,2.6,6,40)+hatch('hGl',GOLD,1.6,7,40)+hatch('hP',PINK,2.6,5.5,-35)+hatch('hPl',PINK,1.4,7,-30)+hatch('hR',ROSE,2.4,6,30)+
 hatch('hV',VIOLET,2.6,5.5,-40)+hatch('hK',INK,1.3,6,40)+hatch('hKd',INK,2.2,4.5,-40,VIOLET)+hatch('hSk',AMBER,1.2,5,35)+hatch('hHair',INK,2,3.5,70,HAIR)+
 hatch('hW',CREAM,1.2,6,40)+hatch('hGr','#a1a39a',1.4,6,-38)+
 stripes('sw',[GOLD,AMBER,GOLD,'#e8a21a'],80)+stripes('sGold',[GOLD,AMBER,CREAM,GOLD],70)+
 `<pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="4.5" cy="4.5" r="2.1" fill="${INK}"/></pattern>`+
 `<pattern id="dotsW" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="5" cy="5" r="2.3" fill="${CREAM}"/></pattern>`+
 `<radialGradient id="fadeR"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>`+
 `<radialGradient id="burn"><stop offset="0" stop-color="#fffdf5"/><stop offset=".22" stop-color="#fff4cf"/><stop offset=".45" stop-color="${GOLD}" stop-opacity=".6"/><stop offset="1" stop-color="${PINK}" stop-opacity="0"/></radialGradient>`+
 `<radialGradient id="lampG"><stop offset="0" stop-color="#ffe7a8" stop-opacity=".95"/><stop offset=".6" stop-color="${AMBER}" stop-opacity=".35"/><stop offset="1" stop-color="${AMBER}" stop-opacity="0"/></radialGradient>`;

/* ================= the characters, drawn once ================= */
const OL=`stroke="${INK}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"`;
const thick=(d,w,col)=>`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w+5}" stroke-linecap="round" stroke-linejoin="round" filter="url(#wob)"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" filter="url(#wob)"/>`;
function buildChars(){
  R=rng(19);
  /* Gauri, the cow. Origin = middle of her body; hooves rest on y=104. */
  let torso='';
  torso+=`<path d="M58,30 C80,24 92,6 96,-14" fill="none" ${OL} filter="url(#wob)"/><path d="${blob(98,-20,7,10,10,.25)}" fill="${INK}" filter="url(#wob)"/>`;
  const body=blob(0,42,66,42,26,.04);
  torso+=`<path d="${body}" fill="${CREAM}"/><path d="M-60,52 Q0,96 60,52 L60,84 L-60,84Z" fill="url(#hPl)" opacity=".5" clip-path="url(#cowBodyClip)" filter="url(#pencil)"/>`;
  torso+=`<path d="${body}" fill="none" ${OL} filter="url(#wob)"/>`;
  torso+=`<path d="${blob(-30,30,18,13,14,.3)}" fill="${INK}" filter="url(#wob)"/><path d="${blob(28,52,14,11,12,.3)}" fill="${INK}" filter="url(#wob)"/><path d="${blob(46,20,9,7,10,.3)}" fill="${INK}" filter="url(#wob)"/>`;
  let head='';
  head+=`<path d="M-44,-66 C-70,-80 -92,-66 -94,-52 C-80,-46 -60,-48 -46,-54Z" fill="${CREAM}" ${OL} filter="url(#wob)"/><path d="M-50,-62 C-68,-70 -82,-62 -84,-55 C-74,-52 -62,-54 -52,-58Z" fill="url(#hR)" filter="url(#pencil)"/>`;
  head+=`<path d="M44,-66 C70,-80 92,-66 94,-52 C80,-46 60,-48 46,-54Z" fill="${CREAM}" ${OL} filter="url(#wob)"/><path d="M50,-62 C68,-70 82,-62 84,-55 C74,-52 62,-54 52,-58Z" fill="url(#hR)" filter="url(#pencil)"/>`;
  head+=`<path d="M-24,-92 C-30,-108 -42,-114 -48,-120 C-34,-120 -18,-110 -12,-96Z" fill="#f5ecc2" ${OL} filter="url(#wob)"/><path d="M24,-92 C30,-108 42,-114 48,-120 C34,-120 18,-110 12,-96Z" fill="#f5ecc2" ${OL} filter="url(#wob)"/>`;
  head+=`<path d="${blob(0,-50,58,48,28,.03)}" fill="${CREAM}" ${OL} filter="url(#wob)"/><path d="${blob(-36,-78,13,10,12,.25)}" fill="${INK}" filter="url(#wob)"/>`;
  head+=`<path d="M-10,-96 q4,-14 10,-4 q4,-14 10,-2 q6,-10 8,4" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" filter="url(#wob)"/>`;
  const muz=blob(0,-12,46,25,26,.02);
  head+=`<path d="${muz}" fill="${MUZZLE}" ${OL} filter="url(#wob)"/><path d="${muz}" fill="url(#hR)" opacity=".45" filter="url(#pencil)"/>`;
  head+=`<path d="M-30,-20 q4,-8 12,-6 q-2,8 -12,6Z" fill="${INK}" filter="url(#wob)"/><path d="M30,-20 q-4,-8 -12,-6 q2,8 12,6Z" fill="${INK}" filter="url(#wob)"/>`;
  head+=`<path d="M-26,-30 q10,-6 20,-5" stroke="${CREAM}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="20" cy="-30" r="2" fill="${CREAM}"/>`;
  const leg=(x,ang,sy=1)=>`<g transform="rotate(${ang} ${x} 62) translate(${x} 62) scale(1 ${sy}) translate(${-x} -62)"><path d="${wob([[x-8,62],[x+8,62],[x+8,96],[x-8,96]],.8,true)}" fill="${CREAM}" ${OL} filter="url(#wob)"/><path d="${wob([[x-9,93],[x+9,93],[x+9,104],[x-9,104]],.6,true)}" fill="url(#hKd)" ${OL}/></g>`;
  const legs={stand:[[-44,0],[-18,0],[16,0],[42,0]],fly:[[-44,38],[-18,18],[16,-18],[42,-40]],hop:[[-44,-14,.72],[-18,10,.72],[16,-10,.72],[42,14,.72]],hold:[[-44,0],[42,0]]};
  let d=`<clipPath id="cowBodyClip"><path d="${body}"/></clipPath><g id="cow-torso">${torso}</g><g id="cow-head">${head}</g>`;
  for(const k in legs)d+=`<g id="cow-legs-${k}">${legs[k].map(l=>leg(...l)).join('')}</g>`;
  // front legs raised to hold something at the chest
  d+=`<g id="cow-hooves">${thick('M-36,46 C-48,30 -40,22 -22,26',13,CREAM)}${thick('M36,46 C48,30 40,22 22,26',13,CREAM)}<ellipse cx="-20" cy="26" rx="8" ry="9" fill="url(#hKd)" ${OL}/><ellipse cx="20" cy="26" rx="8" ry="9" fill="url(#hKd)" ${OL}/></g>`;

  /* capes: the too-big one that drags, and the one that fits */
  let edge='';for(let x=-104;x<170;x+=27){edge+=` Q${x+13.5},${92} ${x+27},${108}`}
  const big=`M-30,2 C-70,8 -96,54 -104,108${edge} C176,118 190,112 182,104 C150,90 110,40 60,10 C40,2 20,0 -30,2Z`;
  d+=`<g id="cape-big"><path d="${big}" fill="${INK}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round" filter="url(#wob)"/><path d="${big}" fill="url(#hV)" opacity=".55" filter="url(#pencil)"/><path d="M120,96 q22,-4 38,10 M90,70 q20,10 30,30" stroke="${VIOLET}" stroke-width="2" fill="none"/><path d="M-40,2 L-66,-26 L-42,-14 Z M40,2 L66,-26 L42,-14 Z" fill="${INK}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round" filter="url(#wob)"/></g>`;
  const fit='M-34,4 C-80,20 -104,64 -112,104 Q-90,90 -68,106 Q-46,90 -22,106 Q0,92 22,106 Q46,90 68,106 Q90,90 112,104 C104,64 80,20 34,4Z';
  d+=`<g id="cape-fit"><path d="${fit}" fill="${INK}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round" filter="url(#wob)"/><path d="${fit}" fill="url(#hV)" opacity=".6" filter="url(#pencil)"/><path d="M-50,40 q-8,24 -10,46 M44,36 q10,24 12,48" stroke="${VIOLET}" stroke-width="2.4" fill="none"/><path d="M-38,4 L-58,-22 L-40,-12 Z M38,4 L58,-22 L40,-12 Z" fill="${INK}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round" filter="url(#wob)"/></g>`;
  const flyc='M-30,4 C0,30 70,40 170,12 Q156,34 178,52 Q148,52 160,76 Q126,66 128,92 Q96,74 80,92 C50,74 10,50 30,4Z';
  d+=`<g id="cape-fly"><path d="${flyc}" fill="${INK}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round" filter="url(#wob)"/><path d="${flyc}" fill="url(#hV)" opacity=".6" filter="url(#pencil)"/><path d="M60,40 q40,8 90,-6 M50,60 q30,10 60,10" stroke="${VIOLET}" stroke-width="2.2" fill="none"/></g>`;
  d+=`<g id="clasp" transform="translate(0 6)" filter="url(#wob)"><path d="M-30,-4 Q0,8 30,-4" stroke="${INK}" stroke-width="4" fill="none"/><ellipse cx="0" cy="2" rx="11" ry="7" fill="url(#hG)" stroke="${INK}" stroke-width="2"/><path d="M-6,2 q3,-4 6,-1 q3,-3 6,1 q-3,3 -6,2 q-3,1 -6,-2z" fill="${INK}"/></g>`;

  /* Ash, the nerd. Origin = between his feet. About 400 units tall. */
  R=rng(7);
  let legsN=thick('M-12,-172 C-16,-130 -24,-110 -20,-90 C-16,-60 -22,-34 -22,-14',13,VIOLET)+thick('M12,-172 C16,-130 22,-112 18,-90 C14,-60 20,-34 20,-14',13,VIOLET);
  legsN+=`<path d="M-24,-96 q4,-6 8,0 M14,-96 q4,-6 8,0" stroke="${INK}" stroke-width="2" fill="none"/>`;
  legsN+=`<path d="M-34,-16 C-58,-16 -64,-2 -52,2 L-14,2 C-10,-8 -14,-16 -34,-16Z" fill="${CREAM}" ${OL} filter="url(#wob)"/><path d="M-58,-2 h44" stroke="${GOLD}" stroke-width="3"/>`;
  legsN+=`<path d="M14,-16 C30,-16 52,-12 52,-2 L12,2 C8,-8 8,-16 14,-16Z" fill="${CREAM}" ${OL} filter="url(#wob)"/><path d="M14,-2 h38" stroke="${GOLD}" stroke-width="3"/>`;
  const tor='M-34,-292 C-44,-260 -36,-210 -28,-166 L28,-166 C34,-210 40,-260 30,-292 C10,-302 -14,-302 -34,-292Z';
  let torN=`<path d="${tor}" fill="${CREAM}"/><path d="${tor}" fill="url(#sw)" opacity=".9" filter="url(#pencil)"/><path d="${tor}" fill="none" ${OL} filter="url(#wob)"/>`;
  torN+=`<path d="M-14,-296 L-2,-268 L10,-296" fill="${CREAM}" ${OL} filter="url(#wob)"/><path d="M-30,-180 h56" stroke="${INK}" stroke-width="2" stroke-dasharray="4 3"/>`;
  torN+=`<path d="M-8,-318 L-8,-292 L6,-292 L6,-318Z" fill="${SKIN}" ${OL} filter="url(#wob)"/>`;
  const headN=blob(-2,-352,32,46,28,.02);
  let hN=`<path d="${blob(-35,-350,7,11,10,.1)}" fill="${SKIN}" ${OL}/><path d="${blob(31,-350,7,11,10,.1)}" fill="${SKIN}" ${OL}/>`;
  hN+=`<path d="${headN}" fill="${SKIN}" ${OL} filter="url(#wob)"/><path d="${headN}" fill="url(#hSk)" opacity=".35" filter="url(#pencil)"/>`;
  // the receding hairline: hair at the sides and back, an M high on the forehead, one brave tuft
  hN+=`<path d="M-33,-356 C-38,-380 -26,-400 -2,-402 C22,-402 36,-384 30,-356 L26,-368 C24,-380 18,-388 12,-390 C8,-382 4,-380 -2,-386 C-8,-380 -12,-382 -16,-390 C-22,-388 -28,-380 -29,-366Z" fill="url(#hHair)" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round" filter="url(#wob)"/>`;
  hN+=`<path d="M-4,-386 q-4,-10 2,-16 M1,-386 q2,-12 8,-14 M-6,-387 q-8,-6 -6,-14" stroke="${INK}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  hN+=`<path d="M-14,-376 q8,-5 16,-3" stroke="#f3d2b6" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  hN+=`<path d="M3,-332 C6,-322 10,-316 6,-312 C3,-310 0,-312 -1,-314" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round" filter="url(#wob)"/>`;
  const gogOn=`<path d="M-34,-344 L-26,-344 M22,-344 L32,-344" stroke="${VIOLET}" stroke-width="5" stroke-linecap="round"/><g filter="url(#wob)"><circle cx="-12" cy="-344" r="16" fill="#fff6dc" stroke="${INK}" stroke-width="5"/><circle cx="18" cy="-344" r="16" fill="#fff6dc" stroke="${INK}" stroke-width="5"/><circle cx="-12" cy="-344" r="12" fill="url(#hGl)" opacity=".55"/><circle cx="18" cy="-344" r="12" fill="url(#hGl)" opacity=".55"/><path d="M4,-346 q2,-3 -2,0" stroke="${INK}" stroke-width="4"/></g>`;
  const gogUp=`<path d="M-33,-382 Q0,-392 31,-382" stroke="${VIOLET}" stroke-width="5" fill="none" stroke-linecap="round"/><g filter="url(#wob)"><ellipse cx="-12" cy="-388" rx="15" ry="11" fill="#fff6dc" stroke="${INK}" stroke-width="4.4"/><ellipse cx="17" cy="-388" rx="15" ry="11" fill="#fff6dc" stroke="${INK}" stroke-width="4.4"/><ellipse cx="-12" cy="-388" rx="10" ry="7" fill="url(#hGl)" opacity=".6"/><ellipse cx="17" cy="-388" rx="10" ry="7" fill="url(#hGl)" opacity=".6"/><path d="M-16,-392 l6,-2 M13,-392 l6,-2" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g>`;
  const hand=(x,y)=>`<circle cx="${x}" cy="${y}" r="6.5" fill="${SKIN}" stroke="${INK}" stroke-width="2"/>`;
  const arms={
    phone:thick('M-32,-286 C-46,-256 -48,-228 -40,-214 C-30,-204 -14,-224 -6,-236',10,CREAM)+thick('M28,-286 C42,-258 42,-226 36,-214 C28,-206 18,-224 14,-236',10,CREAM)+
      `<path d="${wob([[-8,-262],[14,-262],[14,-232],[-8,-232]],.6,true)}" fill="${INK}" stroke="${INK}" stroke-width="2.4"/><rect x="-5" y="-259" width="16" height="23" fill="${GOLD}" opacity=".85"/>`+hand(-6,-238)+hand(14,-238),
    out:thick('M-32,-286 C-36,-250 0,-236 50,-246',10,CREAM)+thick('M28,-286 C50,-266 70,-258 92,-262',10,CREAM)+hand(52,-246)+hand(94,-262),
    out1:thick('M-32,-286 C-44,-240 -46,-200 -44,-172',10,CREAM)+hand(-44,-170)+thick('M28,-286 C50,-266 70,-262 90,-270',10,CREAM)+hand(92,-270),
    up:thick('M-32,-286 C-58,-320 -40,-400 -10,-436',10,CREAM)+thick('M28,-286 C54,-320 36,-400 8,-436',10,CREAM)+hand(-9,-438)+hand(8,-438),
    down:thick('M-32,-286 C-44,-240 -46,-200 -44,-172',10,CREAM)+thick('M28,-286 C40,-240 42,-200 40,-172',10,CREAM)+hand(-44,-170)+hand(40,-170),
    chest:thick('M-32,-286 C-48,-252 -34,-232 -6,-252',10,CREAM)+hand(-4,-254)+thick('M28,-286 C40,-240 42,-200 40,-172',10,CREAM)+hand(40,-170),
    shrug:thick('M-32,-286 C-58,-262 -70,-286 -78,-316',10,CREAM)+thick('M28,-286 C54,-262 66,-286 74,-316',10,CREAM)+`<path d="M-86,-320 q8,-10 16,0 M66,-320 q8,-10 16,0" stroke="${INK}" stroke-width="2" fill="${SKIN}"/>`+hand(-78,-318)+hand(74,-318),
    type:thick('M-32,-286 C-46,-250 -30,-222 0,-224',10,CREAM)+thick('M28,-286 C42,-252 40,-226 20,-222',10,CREAM)+
      `<path d="${wob([[-20,-226],[40,-226],[46,-210],[-26,-210]],.8,true)}" fill="${INK}" stroke="${INK}" stroke-width="2"/><path d="${wob([[-14,-262],[34,-262],[40,-228],[-20,-228]],.8,true)}" fill="${INK}"/><path d="M-10,-258 h40 l4,26 h-48z" fill="${GOLD}" opacity=".8"/>`+hand(0,-222)+hand(20,-222)
  };
  d+=`<g id="nerd-legs">${legsN}</g><g id="nerd-torso">${torN}</g><g id="nerd-head">${hN}</g><g id="gog-on">${gogOn}</g><g id="gog-up">${gogUp}</g>`;
  for(const k in arms)d+=`<g id="arms-${k}">${arms[k]}</g>`;

  /* the star each of them carries */
  R=rng(5);
  const sp=[];for(let i=0;i<10;i++){const a=i/10*Math.PI*2-Math.PI/2,r=i%2?9:22;sp.push([Math.cos(a)*r,Math.sin(a)*r])}
  d+=`<g id="star"><circle r="30" fill="${GOLD}" opacity=".28" filter="url(#soft)"/><path d="${wob(sp,1,true)}" fill="${CREAM}"/><path d="${wob(sp,1.2,true)}" fill="url(#sGold)" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round" filter="url(#pencil)"/><path d="${wob(sp,1.2,true)}" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round" filter="url(#wob)"/></g>`;
  return d;
}

/* ================= faces: "eyes mouth fx fx" ================= */
const CY=-60;
const cEye={
  o:(x,px=0,py=2)=>`<ellipse cx="${x}" cy="${CY}" rx="15" ry="17" fill="${CREAM}" stroke="${INK}" stroke-width="2.6"/><ellipse cx="${x+px}" cy="${CY+py}" rx="10" ry="12" fill="${INK}"/><circle cx="${x+px-4}" cy="${CY+py-5}" r="3.6" fill="${CREAM}"/><circle cx="${x+px+3}" cy="${CY+py+4}" r="1.6" fill="${CREAM}"/>`,
  sp:x=>`<ellipse cx="${x}" cy="${CY}" rx="17" ry="19" fill="${CREAM}" stroke="${INK}" stroke-width="2.6"/><ellipse cx="${x}" cy="${CY+1}" rx="13" ry="15" fill="${INK}"/>${sparkle(x-4,CY-5,7,CREAM)}<circle cx="${x+5}" cy="${CY+7}" r="2.2" fill="${CREAM}"/><circle cx="${x-6}" cy="${CY+8}" r="1.3" fill="${GOLD}"/>`,
  xd:x=>{const s=x<0?1:-1;return `<path d="M${x-10*s},${CY-11} L${x+8*s},${CY} L${x-10*s},${CY+11}" stroke="${INK}" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`},
  hap:x=>`<path d="M${x-13},${CY+4} Q${x},${CY-14} ${x+13},${CY+4}" stroke="${INK}" stroke-width="4.4" fill="none" stroke-linecap="round"/>`,
  sad:x=>`<path d="M${x-12},${CY-2} Q${x},${CY+8} ${x+12},${CY-2}" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M${x+(x<0?-12:12)},${CY-14} L${x+(x<0?10:-10)},${CY-20}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
  wide:x=>`<ellipse cx="${x}" cy="${CY}" rx="17" ry="20" fill="${CREAM}" stroke="${INK}" stroke-width="2.6"/><circle cx="${x}" cy="${CY}" r="4" fill="${INK}"/>`,
  flat:(x,px=4)=>`<ellipse cx="${x}" cy="${CY}" rx="15" ry="16" fill="${CREAM}" stroke="${INK}" stroke-width="2.6"/><ellipse cx="${x+px}" cy="${CY+6}" rx="8" ry="8" fill="${INK}"/><path d="M${x+16},${CY-1} A16,17 0 0 0 ${x-16},${CY-1}Z" fill="${CREAM}"/><path d="M${x-17},${CY-1} L${x+17},${CY-1}" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>`,
  det:x=>{const s=x<0?1:-1;return `<ellipse cx="${x}" cy="${CY}" rx="14" ry="16" fill="${CREAM}" stroke="${INK}" stroke-width="2.6"/><ellipse cx="${x+2*s}" cy="${CY+4}" rx="8" ry="9" fill="${INK}"/><circle cx="${x+2*s-3}" cy="${CY+1}" r="2.6" fill="${CREAM}"/><path d="M${x-18*s},${CY-20} L${x+18*s},${CY-4} L${x+18*s},${CY-26} Z" fill="${CREAM}"/><path d="M${x-18*s},${CY-18} L${x+17*s},${CY-5}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`},
  angry:x=>{const s=x<0?1:-1;return `<ellipse cx="${x}" cy="${CY+2}" rx="14" ry="14" fill="${CREAM}" stroke="${INK}" stroke-width="2.6"/><circle cx="${x+3*s}" cy="${CY+5}" r="4.5" fill="${INK}"/><path d="M${x-18*s},${CY-22} L${x+18*s},${CY-2} L${x+18*s},${CY-30} Z" fill="${CREAM}"/><path d="M${x-20*s},${CY-20} L${x+16*s},${CY-4}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`},
  spiral:x=>`<ellipse cx="${x}" cy="${CY}" rx="15" ry="17" fill="${CREAM}" stroke="${INK}" stroke-width="2.6"/><path d="M${x},${CY} m0,-2 a2,2 0 1 1 -2,2 a5,5 0 1 1 6,4 a8,8 0 1 1 -10,-8 a11,11 0 1 1 13,-2" stroke="${INK}" stroke-width="2.2" fill="none"/>`,
  wet:x=>`<ellipse cx="${x}" cy="${CY}" rx="16" ry="18" fill="${CREAM}" stroke="${INK}" stroke-width="2.6"/><ellipse cx="${x}" cy="${CY+2}" rx="12" ry="14" fill="${INK}"/><circle cx="${x-5}" cy="${CY-4}" r="4.4" fill="${CREAM}"/><circle cx="${x+4}" cy="${CY-6}" r="2" fill="${CREAM}"/><circle cx="${x+5}" cy="${CY+7}" r="2" fill="${CREAM}"/><path d="M${x-12},${CY+11} q4,-3 8,0 q4,3 8,0 q3,-2 4,-1" stroke="#cfe" stroke-width="2" fill="none"/><path d="M${x+(x<0?-15:15)},${CY+10} q-3,6 0,8 q3,-2 0,-8z" fill="${TEAR}" stroke="${INK}" stroke-width="1.4"/>`,
  shut:x=>`<path d="M${x-14},${CY} q7,-8 14,0 q7,8 14,0" stroke="${INK}" stroke-width="4.6" fill="none" stroke-linecap="round"/><path d="M${x-12},${CY-12} l-4,-6 M${x},${CY-14} v-7 M${x+12},${CY-12} l4,-6" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`
};
const cMouth={
  xd:`<path d="M-16,-6 Q0,-8 16,-6 Q12,12 0,13 Q-12,12 -16,-6Z" fill="${INK}"/><path d="M-8,8 Q0,2 8,8 Q4,12 0,12 Q-4,12 -8,8Z" fill="${PINK}"/>`,
  wail:`<path d="M-26,-10 Q0,-14 26,-10 Q22,22 0,25 Q-22,22 -26,-10Z" fill="${INK}"/><path d="M-12,16 Q0,6 12,16 Q6,22 0,22 Q-6,22 -12,16Z" fill="${PINK}"/><path d="M-20,-9 h40 v5 h-40z" fill="${CREAM}"/>`,
  smile:`<path d="M-14,0 Q0,12 14,0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  tiny:`<path d="M-6,4 Q0,9 6,4" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
  wob:`<path d="M-14,4 q3,-5 7,0 q3,5 7,0 q3,-5 7,0 q3,5 7,0" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
  o:`<ellipse cx="0" cy="4" rx="5" ry="6" fill="${INK}"/>`,
  O:`<ellipse cx="0" cy="3" rx="10" ry="13" fill="${INK}"/><ellipse cx="0" cy="10" rx="6" ry="4" fill="${PINK}"/>`,
  flat:`<path d="M-10,4 h20" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
  pout:`<path d="M-3,-3 q8,2 1,5 q8,2 -1,6" stroke="${INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`,
  grit:`<path d="M-16,-4 h32 v14 h-32z" fill="${CREAM}" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/><path d="M-16,3 h32 M-8,-4 v14 M0,-4 v14 M8,-4 v14" stroke="${INK}" stroke-width="1.6"/>`,
  cat:`<path d="M-13,1 q6.5,8 13,0 q6.5,8 13,0" stroke="${INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`,
  frown:`<path d="M-12,9 Q0,-2 12,9" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  tongue:`<path d="M-14,0 Q0,12 14,0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M2,6 q2,12 9,10 q5,-2 1,-12" fill="${PINK}" stroke="${INK}" stroke-width="2"/>`
};
const cFx={
  blush:`<g opacity=".85"><ellipse cx="-44" cy="-36" rx="10" ry="6" fill="url(#hP)"/><ellipse cx="44" cy="-36" rx="10" ry="6" fill="url(#hP)"/></g>`,
  nerv:`<g stroke="${PINK}" stroke-width="1.6"><path d="M-50,-40 l4,-6 M-44,-40 l4,-6 M-38,-40 l4,-6 M38,-40 l4,-6 M44,-40 l4,-6 M50,-40 l4,-6"/></g>`,
  tears:`<path d="M-30,-48 C-40,-34 -34,-16 -44,6 C-48,16 -36,18 -34,8 C-28,-12 -24,-30 -24,-48Z" fill="${TEAR}" stroke="${INK}" stroke-width="1.8"/><path d="M30,-48 C40,-34 34,-16 44,6 C48,16 36,18 34,8 C28,-12 24,-30 24,-48Z" fill="${TEAR}" stroke="${INK}" stroke-width="1.8"/>`,
  drops:[[-62,-56],[-58,-34],[64,-58],[60,-32],[-70,-74],[72,-76]].map(([x,y])=>`<path d="M${x},${y} q-5,7 0,10 q5,-3 0,-10z" fill="${TEAR}" stroke="${INK}" stroke-width="1.4"/>`).join(''),
  tear:`<path d="M30,-44 q-6,10 0,14 q6,-4 0,-14z" fill="${TEAR}" stroke="${INK}" stroke-width="1.6"/>`,
  sweat:`<path d="M58,-96 q-10,14 0,20 q10,-6 0,-20z" fill="${TEAR}" stroke="${INK}" stroke-width="2"/>`,
  shake:`<g stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"><path d="M-100,-80 q-8,20 0,40 M-110,-70 q-6,14 0,26 M100,-80 q8,20 0,40 M110,-70 q6,14 0,26"/></g>`,
  steam:`<g fill="${CREAM}" stroke="${INK}" stroke-width="2"><path d="${blob(-74,-112,12,9,10,.2)}"/><path d="${blob(-88,-130,9,7,10,.2)}"/><path d="${blob(76,-112,12,9,10,.2)}"/><path d="${blob(90,-130,9,7,10,.2)}"/></g>`,
  vein:`<path d="M40,-100 q6,6 0,12 M48,-92 q6,-6 12,0 M52,-102 q-6,-6 0,-12 M44,-106 q-6,6 -12,0" stroke="${PINK}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`,
  sparkles:sparkle(-80,-96,9,GOLD)+sparkle(84,-90,7,GOLD)+sparkle(-70,-4,5,CREAM),
  gloom:`<g stroke="${VIOLET}" stroke-width="2.4" opacity=".8"><path d="M-30,-98 v22 M-18,-100 v28 M-6,-101 v24 M6,-101 v28 M18,-100 v22 M30,-98 v26"/></g>`
};
function cface(spec){
  const [e,m,...fx]=spec.split(' ');
  const [type,dir]=e.split(/(?=[<>^v])/);
  const off={'<':[-5,1],'>':[5,1],'^':[0,-5],'v':[-1,6]}[dir]||[0,2];
  let s='';
  if(fx.includes('blush'))s+=cFx.blush;
  s+=type==='o'?cEye.o(-22,...off)+cEye.o(22,...off):type==='flat'?cEye.flat(-22,dir==='<'?-4:4)+cEye.flat(22,dir==='<'?-4:4):cEye[type](-22)+cEye[type](22);
  s+=cMouth[m]||'';
  fx.forEach(f=>{if(f!=='blush')s+=cFx[f]||''});
  return `<g filter="url(#wob)">${s}</g>`;
}
/* Ash's eyes sit in the goggles at (-12,-344) and (18,-344), or on his face when the goggles are up */
const EY=-344;
const nEye={
  dot:x=>`<circle cx="${x-2}" cy="${EY+2}" r="3.6" fill="${INK}"/>`,
  huge:x=>`<circle cx="${x}" cy="${EY}" r="11" fill="${CREAM}" stroke="${INK}" stroke-width="1.6"/><circle cx="${x}" cy="${EY+1}" r="8" fill="${INK}"/><circle cx="${x-3}" cy="${EY-3}" r="3" fill="${CREAM}"/><circle cx="${x+3}" cy="${EY+4}" r="1.4" fill="${CREAM}"/>`,
  star:x=>sparkle(x,EY,10,GOLD)+`<path d="M${x},${EY-10} Q${x+1.8},${EY-1.8} ${x+10},${EY} Q${x+1.8},${EY+1.8} ${x},${EY+10} Q${x-1.8},${EY+1.8} ${x-10},${EY} Q${x-1.8},${EY-1.8} ${x},${EY-10}Z" fill="none" stroke="${INK}" stroke-width="1.6"/>`,
  x:x=>`<path d="M${x-6},${EY-6} L${x+6},${EY+6} M${x+6},${EY-6} L${x-6},${EY+6}" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>`,
  panic:x=>`<circle cx="${x}" cy="${EY}" r="10" fill="${CREAM}" stroke="${INK}" stroke-width="1.4"/><circle cx="${x}" cy="${EY}" r="1.8" fill="${INK}"/><path d="M${x-20},${EY-14} l-5,-4 M${x+20},${EY-14} l5,-4" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`,
  smug:x=>`<path d="M${x-9},${EY-2} h18" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M${x-1},${EY-2} a4,4 0 0 0 8,0z" fill="${INK}"/>`,
  squint:x=>{const s=x<0?1:-1;return `<path d="M${x-8*s},${EY-5} L${x+6*s},${EY} L${x-8*s},${EY+6}" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`},
  dead:x=>`<path d="M${x-8},${EY-1} h16" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${x}" cy="${EY+3}" r="1.6" fill="${INK}"/>`,
  teary:x=>`<circle cx="${x}" cy="${EY}" r="10" fill="${INK}"/><circle cx="${x-3}" cy="${EY-4}" r="3.4" fill="${CREAM}"/><circle cx="${x+3}" cy="${EY+3}" r="1.6" fill="${CREAM}"/><path d="M${x-10},${EY+6} q5,-3 10,0 q5,3 10,0" stroke="#cfe" stroke-width="2" fill="none"/>`,
  closed:x=>`<path d="M${x-8},${EY} Q${x},${EY+6} ${x+8},${EY}" stroke="${INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`,
  side:x=>`<path d="M${x-9},${EY-3} h18" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${x-6}" cy="${EY+2}" r="3.6" fill="${INK}"/>`,
  fog:x=>`<circle cx="${x}" cy="${EY}" r="12" fill="#f2ece6"/><circle cx="${x}" cy="${EY}" r="12" fill="url(#hK)" opacity=".25"/><path d="M${x-7},${EY-3} q4,-4 8,0 M${x-2},${EY+4} q4,-3 8,0" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
  glare:x=>`<circle cx="${x}" cy="${EY}" r="12.5" fill="#fffdf2"/><path d="M${x-9},${EY+7} L${x+7},${EY-9} M${x-3},${EY+10} L${x+10},${EY-3}" stroke="${GOLD}" stroke-width="3" stroke-linecap="round"/>`,
  focus:x=>`<path d="M${x-9},${EY-4} h18 M${x-9},${EY+5} h18" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><circle cx="${x+3}" cy="${EY+1}" r="3" fill="${INK}"/>`,
  angry:x=>`<circle cx="${x}" cy="${EY+2}" r="3.4" fill="${INK}"/><path d="M${x-9},${EY-9} L${x+9},${EY-4}" stroke="${INK}" stroke-width="3.4" stroke-linecap="round" transform="${x<0?'':`scale(-1 1) translate(${-2*x} 0)`}"/>`,
  up:x=>`<circle cx="${x+1}" cy="${EY-5}" r="4" fill="${INK}"/><circle cx="${x}" cy="${EY-6}" r="1.2" fill="${CREAM}"/>`
};
const nEyeUp={ // goggles pushed up: plain eyes on the face, at (-14,-344) and (16,-344)
  soft:x=>`<path d="M${x-8},${EY-3} Q${x},${EY-9} ${x+8},${EY-3}" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="${x}" cy="${EY+1}" rx="4" ry="4.6" fill="${INK}"/><circle cx="${x-1.4}" cy="${EY-.6}" r="1.3" fill="${CREAM}"/>`,
  hap:x=>`<path d="M${x-8},${EY+2} Q${x},${EY-7} ${x+8},${EY+2}" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  teary:x=>`<ellipse cx="${x}" cy="${EY}" rx="6" ry="7" fill="${INK}"/><circle cx="${x-2}" cy="${EY-2.4}" r="2.2" fill="${CREAM}"/><circle cx="${x+2}" cy="${EY+2.6}" r="1" fill="${CREAM}"/><path d="M${x-7},${EY+5} q3.5,-2 7,0 q3.5,2 7,0" stroke="#cfe" stroke-width="1.6" fill="none"/>`,
  up:x=>`<ellipse cx="${x}" cy="${EY}" rx="6" ry="7" fill="${CREAM}" stroke="${INK}" stroke-width="1.8"/><circle cx="${x+1}" cy="${EY-3}" r="3.4" fill="${INK}"/>`
};
const nBrow={
  worry:`<path d="M-24,-364 L-6,-370 M12,-370 L30,-364" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
  angry:`<path d="M-26,-374 L-2,-362 M8,-362 L32,-374" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/>`,
  raise:`<path d="M-24,-378 Q-14,-386 -4,-378 M10,-366 L28,-366" stroke="${INK}" stroke-width="3" stroke-linecap="round" fill="none"/>`,
  up:`<path d="M-24,-372 Q-14,-380 -4,-372 M10,-372 Q20,-380 30,-372" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" fill="none"/>`,
  soft:`<path d="M-24,-358 Q-14,-362 -6,-358 M10,-358 Q18,-362 26,-358" stroke="${INK}" stroke-width="2.4" stroke-linecap="round" fill="none"/>`
};
const nMouth={
  talk:`<path d="M-10,-306 Q0,-302 8,-306 Q4,-294 -2,-294 Q-8,-296 -10,-306Z" fill="${INK}"/>`,
  grin:`<path d="M-16,-308 Q0,-312 16,-308 Q10,-292 0,-292 Q-10,-292 -16,-308Z" fill="${CREAM}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M-14,-303 Q0,-300 14,-303 M-6,-308 v8 M2,-308 v9 M9,-307 v7" stroke="${INK}" stroke-width="1.3" fill="none"/>`,
  smirk:`<path d="M-10,-302 Q2,-298 12,-310" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
  wobble:`<path d="M-10,-302 q4,-4 6,0 q3,4 6,0 q3,-4 6,0" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`,
  scream:`<path d="M-13,-312 Q0,-316 13,-312 Q11,-280 0,-276 Q-11,-280 -13,-312Z" fill="${INK}"/><path d="M-7,-286 Q0,-294 7,-286 Q4,-280 0,-280 Q-4,-280 -7,-286Z" fill="${PINK}"/><path d="M-11,-311 h22 v4 h-22z" fill="${CREAM}"/>`,
  flat:`<path d="M-8,-304 h14" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`,
  o:`<ellipse cx="-1" cy="-302" rx="4" ry="5" fill="${INK}"/>`,
  O:`<ellipse cx="-1" cy="-300" rx="8" ry="10" fill="${INK}"/><ellipse cx="-1" cy="-294" rx="5" ry="3" fill="${PINK}"/>`,
  frown:`<path d="M-10,-298 Q0,-308 10,-298" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
  smile:`<path d="M-10,-306 Q0,-298 10,-306" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
  teeth:`<path d="M-12,-304 h20" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M-12,-304 h20 M-6,-308 v8 M0,-308 v8 M6,-308 v8" stroke="${CREAM}" stroke-width="1.4"/>`,
  tongue:`<path d="M-12,-306 Q0,-298 12,-306" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M4,-302 q1,10 7,9 q4,-2 0,-10" fill="${PINK}" stroke="${INK}" stroke-width="1.6"/>`
};
const nFx={
  sweat:`<g fill="${TEAR}" stroke="${INK}" stroke-width="1.6"><path d="M-24,-380 q-6,9 0,12 q6,-3 0,-12z"/><path d="M30,-376 q-5,8 0,11 q5,-3 0,-11z"/><path d="M38,-330 q-5,8 0,11 q5,-3 0,-11z"/></g>`,
  bigsweat:`<path d="M40,-392 q-14,20 0,28 q14,-8 0,-28z" fill="${TEAR}" stroke="${INK}" stroke-width="2"/><path d="M36,-376 q2,-6 5,-8" stroke="#fff" stroke-width="2" fill="none"/>`,
  blush:`<g opacity=".85"><ellipse cx="-24" cy="-322" rx="8" ry="4.5" fill="url(#hP)"/><ellipse cx="26" cy="-322" rx="8" ry="4.5" fill="url(#hP)"/></g>`,
  gloom:`<g stroke="${VIOLET}" stroke-width="2.2" opacity=".85"><path d="M-22,-398 v18 M-12,-400 v24 M-2,-401 v20 M8,-401 v24 M18,-399 v18"/></g>`,
  soul:`<g transform="translate(26 -292)"><path d="M0,0 C8,-10 26,-14 34,-30 C40,-44 26,-56 16,-48 C6,-42 10,-26 0,0Z" fill="${CREAM}" stroke="${INK}" stroke-width="2" opacity=".9"/><circle cx="20" cy="-42" r="1.8" fill="${INK}"/><circle cx="27" cy="-40" r="1.8" fill="${INK}"/></g>`,
  steam:`<g fill="${CREAM}" stroke="${INK}" stroke-width="1.8"><path d="${blob(-46,-392,10,7,10,.2)}"/><path d="${blob(-56,-408,7,5,10,.2)}"/><path d="${blob(46,-394,10,7,10,.2)}"/><path d="${blob(56,-410,7,5,10,.2)}"/></g>`,
  sparkle:sparkle(-44,-392,8,GOLD)+sparkle(46,-380,6,GOLD),
  tears:`<path d="M-20,-330 C-24,-316 -20,-300 -26,-284 M24,-330 C28,-316 24,-300 30,-284" stroke="${TEAR}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-20,-330 C-24,-316 -20,-300 -26,-284 M24,-330 C28,-316 24,-300 30,-284" stroke="${INK}" stroke-width="1" fill="none" opacity=".6"/>`,
  speed:`<path d="M-30,-302 h-16 M-30,-296 h-12 M28,-302 h16 M28,-296 h12" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`,
  shake:`<path d="M-50,-370 q-6,14 0,28 M-58,-364 q-4,10 0,18 M46,-370 q6,14 0,28 M54,-364 q4,10 0,18" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
};
/* spec: "eyes mouth [brow:x] [fx...]"; goggles up when eyes start with "^" */
function nface(spec){
  const [e,m,...fx]=spec.split(' ');let s='';const up=e[0]==='^';
  fx.forEach(f=>{if(f.startsWith('brow:'))s+=nBrow[f.slice(5)]});
  if(fx.includes('blush'))s+=nFx.blush;
  s+=up?nEyeUp[e.slice(1)](-14)+nEyeUp[e.slice(1)](16):nEye[e](-12)+nEye[e](18);
  s+=nMouth[m]||'';
  fx.forEach(f=>{if(!f.startsWith('brow:')&&f!=='blush')s+=nFx[f]||''});
  return {up,s:`<g filter="url(#wob)">${s}</g>`};
}

/* place characters by where their feet touch the ground */
function cow(x,gy,s,face,o={}){
  const pose=o.pose||'stand',cape=o.cape||'',fl=o.flip?-1:1;
  const capeUse=cape?`<use href="#cape-${cape}"/>`:'';
  return `<g transform="translate(${x} ${gy-104*s}) rotate(${o.r||0}) scale(${s*fl} ${s})">${capeUse}<use href="#cow-legs-${pose}"/><use href="#cow-torso"/>${pose==='hold'?'<use href="#cow-hooves"/>':''}${o.hold||''}<use href="#cow-head"/>${cape?'<use href="#clasp"/>':''}${cface(face)}${o.top||''}</g>`;
}
function nerd(x,gy,s,face,o={}){
  const f=nface(face),fl=o.flip?-1:1;
  return `<g transform="translate(${x} ${gy}) rotate(${o.r||0}) scale(${s*fl} ${s})"><use href="#nerd-legs"/><use href="#nerd-torso"/>${o.under||''}<use href="#arms-${o.arms||'phone'}"/><use href="#nerd-head"/>${f.up?f.s+'<use href="#gog-up"/>':'<use href="#gog-on"/>'+f.s}${o.top||''}</g>`;
}
const starAt=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><use href="#star"/></g>`;

/* ================= props ================= */
const P={
  phone:(x,y,s=1,r=0)=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" filter="url(#wob)"><rect x="-16" y="-26" width="32" height="52" rx="6" fill="${INK}"/><rect x="-12" y="-20" width="24" height="38" rx="2" fill="${GOLD}"/><circle cy="22" r="2" fill="${CREAM}"/></g>`,
  bigPhone:(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})" filter="url(#wob)"><path d="${wob(rectPts(-60,-110,120,220,20),1.4,true)}" fill="${INK}" stroke="${INK}" stroke-width="3"/><rect x="-50" y="-96" width="100" height="180" rx="6" fill="#ffe7b0"/><circle cx="0" cy="-40" r="26" fill="${CREAM}" stroke="${INK}" stroke-width="2.6"/><circle cx="-9" cy="-42" r="8" fill="#fff6dc" stroke="${INK}" stroke-width="3.4"/><circle cx="9" cy="-42" r="8" fill="#fff6dc" stroke="${INK}" stroke-width="3.4"/><path d="M-1,-43 h2 M-24,-42 h6 M18,-42 h6" stroke="${INK}" stroke-width="3"/><path d="M-30,6 h60 M-20,18 h40" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity=".5"/><circle cx="0" cy="58" r="17" fill="#c84d34" stroke="${INK}" stroke-width="2.6"/><path d="M-9,58 q9,-10 18,0" stroke="${CREAM}" stroke-width="4" fill="none" stroke-linecap="round" transform="rotate(135 0 58)"/><circle cx="0" cy="98" r="4" fill="${CREAM}"/></g>`,
  glass:(x,y,r=0)=>`<g transform="translate(${x} ${y}) rotate(${r})" filter="url(#wob)"><path d="M-14,-22 L14,-22 L10,22 L-10,22Z" fill="#fff6e8" fill-opacity=".7" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M-12,-14 L12,-14" stroke="${INK}" stroke-width="1.4" opacity=".5"/></g>`,
  splash:(x,y,s=1)=>{let a='';for(let i=0;i<9;i++){const an=-1.2+i*.32,r=30+R()*30;a+=`<path d="M${x+Math.cos(an)*r*s*.4},${y+Math.sin(an)*r*s*.4} q${Math.cos(an)*10*s},${Math.sin(an)*10*s} ${Math.cos(an)*r*s},${Math.sin(an)*r*s}" stroke="#e8f4f0" stroke-width="${4*s}" fill="none" stroke-linecap="round"/><circle cx="${x+Math.cos(an)*r*s*1.15}" cy="${y+Math.sin(an)*r*s*1.15}" r="${(3+R()*3)*s}" fill="#e8f4f0" stroke="${INK}" stroke-width="1.4"/>`}return `<g filter="url(#wob)">${a}</g>`},
  sticky:(x,y,w,h,r,col='#ffd86b')=>`<g transform="translate(${x} ${y}) rotate(${r})" filter="url(#wob)"><path d="M3,4 h${w} v${h} h${-w}z" fill="${INK}" opacity=".3"/><path d="M0,0 h${w} v${h-12} l-12,12 h${-w+12}z" fill="${col}" stroke="${INK}" stroke-width="2"/><path d="M${w},${h-12} l-12,0 l0,12" fill="#e9b94a" stroke="${INK}" stroke-width="1.6"/></g>`,
  hammer:(x,y,s,r)=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" filter="url(#wob)"><path d="${wob([[-7,0],[7,0],[7,190],[-7,190]],1,true)}" fill="#bb7125" stroke="${INK}" stroke-width="3"/><path d="M-7,40 h14 M-7,90 h14" stroke="${INK}" stroke-width="1.6" opacity=".6"/><path d="${wob(rectPts(-90,-70,180,74,20),1.6,true)}" fill="#a1a39a" stroke="${INK}" stroke-width="3.6"/><path d="${wob(rectPts(-90,-70,180,74,20),1.6,true)}" fill="url(#hK)" opacity=".3"/><path d="M-90,-70 h18 v74 h-18z M72,-70 h18 v74 h-18z" fill="#6f6f6a" stroke="${INK}" stroke-width="2.4"/></g>`,
  brick:(x,y,w=58,h=26,r=0,col='#bb7125')=>`<g transform="translate(${x} ${y}) rotate(${r})"><path d="${wob(rectPts(-w/2,-h/2,w,h,14),1,true)}" fill="${col}" stroke="${INK}" stroke-width="2.4" filter="url(#wob)"/><path d="M${-w/2+6},${-h/2+6} h${w*.4}" stroke="${CREAM}" stroke-width="2" opacity=".5"/></g>`,
  cup:(x,y,r=0)=>`<g transform="translate(${x} ${y}) rotate(${r})" filter="url(#wob)"><path d="M-14,-18 L14,-18 L10,18 L-10,18Z" fill="${CREAM}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M-12,-8 h24" stroke="${PINK}" stroke-width="3"/></g>`,
  capeHeld:(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})" filter="url(#wob)"><path d="M-30,0 C-36,40 -48,90 -40,150 Q-20,138 0,152 Q20,138 40,152 Q48,100 40,40 L30,0Z" fill="${INK}" stroke="${INK}" stroke-width="3"/><path d="M-30,0 C-36,40 -48,90 -40,150 Q-20,138 0,152 Q20,138 40,152 Q48,100 40,40 L30,0Z" fill="url(#hV)" opacity=".55"/><path d="M-34,0 L-50,-22 L-30,-10Z M34,0 L50,-22 L30,-10Z" fill="${INK}"/></g>`
};

/* ================= panel backgrounds: every panel gets its own ================= */
/* pal: {paper, a, b, c, ink(dark), lite} */
function bg(type,W,H,seed,pal,o={}){
  R=rng(seed);const {paper,a,b,c,dark}=pal;let s=`<rect width="${W}" height="${H}" fill="${o.base||paper}"/>`;
  const grain=`<rect width="${W}" height="${H}" fill="${CREAM}" opacity="${o.grain??.45}" filter="url(#grain)"/>`;
  const fx=o.fx??W*.5,fy=o.fy??H*.5;
  switch(type){
    case 'wash':
      s+=grain;[[.25,.3,.5,.4,a,.45],[.8,.75,.45,.4,b,.5],[.75,.2,.3,.3,c,.4],[.2,.85,.35,.3,a,.25]].forEach(([x,y,rx,ry,col,op])=>s+=wash(blob(W*x,H*y,W*rx,H*ry,22,.16),col,op));
      for(let i=0;i<6;i++)s+=shade(R()*W*.9,R()*H*.9,60+R()*120,8+R()*14,6,i%2?a:b,.4,-25+R()*50);break;
    case 'pencil': // a scribbled pencil sky
      s+=grain;for(let i=0;i<Math.round(W*H/9000);i++)s+=shade(R()*W*.95-20,R()*H*.95,70+R()*160,8+R()*18,5+R()*3,[a,b,c][i%3],.35+R()*.25,-30+R()*60,1.1+R()*.6);
      for(let i=0;i<Math.round(W*H/40000)+3;i++)s+=curl(R()*W,R()*H,6+R()*8,7,a,.5,1.6);break;
    case 'halftone':
      s+=grain+`<mask id="m${seed}"><rect width="${W}" height="${H}" fill="#000"/><circle cx="${fx}" cy="${fy}" r="${Math.max(W,H)*.75}" fill="url(#fadeR)"/></mask><rect width="${W}" height="${H}" fill="url(#dots)" opacity=".28" mask="url(#m${seed})"/>`;
      s+=wash(blob(fx,fy,W*.32,H*.3,20,.2),a,.35);break;
    case 'speed': // manga speed lines to a focus
      s+=`<rect width="${W}" height="${H}" fill="${o.base||paper}"/>`;
      for(let i=0;i<70;i++){const an=R()*Math.PI*2,r1=Math.min(W,H)*(.22+R()*.12),r2=Math.max(W,H);const w=1+R()*5;s+=`<path d="M${(fx+Math.cos(an)*r1).toFixed(0)},${(fy+Math.sin(an)*r1).toFixed(0)} L${(fx+Math.cos(an)*r2).toFixed(0)},${(fy+Math.sin(an)*r2).toFixed(0)}" stroke="${i%4?dark:a}" stroke-width="${w.toFixed(1)}" stroke-linecap="round" opacity="${(.35+R()*.5).toFixed(2)}" filter="url(#pencil)"/>`}
      s+=grain;break;
    case 'burst': // sunburst wedges
      for(let i=0;i<24;i++){if(i%2)continue;const a1=i/24*Math.PI*2,a2=(i+1)/24*Math.PI*2,r=Math.max(W,H)*1.2;s+=`<path d="M${fx},${fy} L${fx+Math.cos(a1)*r},${fy+Math.sin(a1)*r} L${fx+Math.cos(a2)*r},${fy+Math.sin(a2)*r}Z" fill="${a}" opacity=".55"/>`}
      s+=grain+`<rect width="${W}" height="${H}" fill="url(#hW)" opacity=".18"/>`;break;
    case 'notes': // confetti of voice notes and music notes
      s+=grain+wash(blob(W*.3,H*.4,W*.4,H*.4,20,.2),a,.35)+wash(blob(W*.8,H*.7,W*.3,H*.3,20,.2),c,.4);
      for(let i=0;i<22;i++){const f=i%3==0?note2:note;s+=f(30+R()*(W-60),30+R()*(H-60),.6+R()*.6,[GOLD,CREAM,a,AMBER][i%4],-25+R()*50)}
      for(let i=0;i<10;i++)s+=vnote(R()*(W-80),R()*(H-30),56+R()*30,-16+R()*32,['#ffe3a8',CREAM,'#fad3e1'][i%3]);break;
    case 'screentone': // diagonal lines tone with a spotlight
      s+=`<rect width="${W}" height="${H}" fill="url(#hK)" opacity=".22"/>`+`<path d="${blob(fx,fy,W*.36,H*.42,20,.08)}" fill="${o.spot||CREAM}" opacity=".85" filter="url(#wob)"/>`+grain;break;
    case 'rain':
      s+=wash(blob(W*.3,H*.2,W*.5,H*.3,20,.2),a,.5)+wash(blob(W*.8,H*.8,W*.4,H*.3,20,.2),b,.4);
      for(let i=0;i<Math.round(W*H/1800);i++){const x=R()*W*1.1,y=R()*H,l=14+R()*24;s+=`<path d="M${x.toFixed(0)},${y.toFixed(0)} l${(-l*.35).toFixed(1)},${l.toFixed(1)}" stroke="${i%3?c:CREAM}" stroke-width="${(1+R()).toFixed(1)}" opacity="${(.35+R()*.4).toFixed(2)}" stroke-linecap="round"/>`}break;
    case 'tally': {
      s+=wash(blob(W*.5,H*.4,W*.5,H*.4,20,.2),a,.4);
      let n=0;const cols=6,rows=Math.ceil(19/cols);
      for(let g=0;g<19;g++){const gx=W*.1+(g%cols)*(W*.8/cols)+j(6),gy=H*.18+Math.floor(g/cols)*(H*.17)+j(6);const k=Math.min(5,94-n);n+=k;
        for(let t=0;t<Math.min(4,k);t++)s+=ln(`M${gx+t*9},${gy} l${j(2)},26`,2.6,c,'pencil');if(k===5)s+=ln(`M${gx-5},${gy+20} L${gx+34},${gy+5}`,2.6,c,'pencil')}
      break}
    case 'paper': // lined notebook paper
      s+=grain;for(let y=40;y<H;y+=30)s+=`<path d="M0,${y} H${W}" stroke="${b}" stroke-width="1.4" opacity=".5"/>`;
      s+=`<path d="M60,0 V${H}" stroke="${a}" stroke-width="2" opacity=".6"/><circle cx="${W*.82}" cy="${H*.22}" r="38" fill="none" stroke="#bb7125" stroke-width="6" opacity=".18" filter="url(#wc)"/>`;
      for(let i=0;i<4;i++)s+=curl(80+R()*(W-160),R()*H,6,6,a,.45);break;
    case 'stars':
      s+=washN(blob(W*.3,H*.3,W*.5,H*.5,24,.14),PLUM,.9)+washN(blob(W*.8,H*.7,W*.5,H*.5,24,.14),PLUM,.8)+washN(blob(W*.5,H*.5,W*.3,H*.3,20,.2),VIOLET,.5);
      for(let i=0;i<Math.round(W*H/5000);i++)s+=`<circle cx="${(R()*W)|0}" cy="${(R()*H)|0}" r="${(.8+R()*1.7).toFixed(1)}" fill="${i%5?GOLD:CREAM}" opacity="${(.45+R()*.5).toFixed(2)}"/>`;
      for(let i=0;i<8;i++)s+=sparkle(R()*W,R()*H,3+R()*5,i%2?GOLD:AMBER);
      for(let i=0;i<6;i++)s+=shade(R()*W*.9,R()*H*.9,80+R()*120,8+R()*10,7,'#8a4f86',.4,-20+R()*40,1.1);break;
    case 'scribble': // heavy angry scribble
      for(let i=0;i<Math.round(W*H/6000);i++){const p=[];let x=R()*W,y=R()*H;for(let k=0;k<9;k++){x+=j(60);y+=j(40);p.push([x,y])}s+=`<path d="${wob(p,3)}" fill="none" stroke="${[a,b,c][i%3]}" stroke-width="${(1+R()*2.2).toFixed(1)}" opacity="${(.35+R()*.4).toFixed(2)}" stroke-linejoin="round" filter="url(#pencil)"/>`}
      s+=grain;break;
    case 'bricks':
      s+=grain;for(let r=0;r*32<H;r++)for(let k=-1;k*70<W;k++){const x=k*70+(r%2?35:0),y=r*32;s+=`<path d="${wob(rectPts(x+3,y+3,64,26,16),1.2,true)}" fill="${[a,b,c][(r+k+9)%3]}" fill-opacity="${(.35+R()*.3).toFixed(2)}" stroke="${dark}" stroke-width="1.6" stroke-opacity=".5"/>`}break;
    case 'embers':
      s+=wash(blob(W*.5,H*.85,W*.6,H*.35,20,.2),a,.7)+wash(blob(W*.2,H*.3,W*.3,H*.3,20,.2),b,.5)+wash(blob(W*.85,H*.25,W*.3,H*.3,20,.2),c,.4);
      for(let i=0;i<60;i++){const x=R()*W,y=R()*H;s+=`<path d="M${x.toFixed(0)},${y.toFixed(0)} l${j(4).toFixed(1)},${(-4-R()*8).toFixed(1)}" stroke="${i%3?GOLD:AMBER}" stroke-width="${(1.5+R()*2.5).toFixed(1)}" stroke-linecap="round" opacity="${(.5+R()*.5).toFixed(2)}"/>`}s+=grain;break;
    case 'lamp': // a warm lamp cone from the top
      s+=grain+`<path d="M${fx-40},0 L${fx+40},0 L${fx+W*.42},${H} L${fx-W*.42},${H}Z" fill="url(#lampG)" filter="url(#wc)"/><path d="M${fx-46},-4 Q${fx},-40 ${fx+46},-4 L${fx+30},16 L${fx-30},16Z" fill="${dark}" stroke="${INK}" stroke-width="2.4" filter="url(#wob)"/>`;
      for(let i=0;i<4;i++)s+=shade(R()*W*.9,R()*H*.9,60+R()*100,8+R()*12,6,a,.35,-25+R()*50);break;
    case 'door':
      s+=`<rect width="${W}" height="${H}" fill="${dark}"/>`+`<path d="M${o.dx},${H*.12} L${o.dx+o.dw},${H*.12} L${W},${H} L${o.dx-40},${H}Z" fill="${GOLD}" opacity=".25" filter="url(#wc)"/>`;
      s+=`<path d="${wob(rectPts(o.dx,H*.12,o.dw,H*.8,24),1.4,true)}" fill="#ffd98a" stroke="${INK}" stroke-width="3"/>`;
      for(let i=0;i<8;i++)s+=shade(R()*W*.9,R()*H*.9,60+R()*100,8+R()*12,6,c,.3,-25+R()*50);break;
    case 'glow':
      s+=grain+wash(blob(W*.5,H*.3,W*.7,H*.5,22,.15),a,.45)+wash(blob(W*.15,H*.8,W*.35,H*.35,22,.15),b,.5);break;
  }
  return s;
}
/* a panel: clipped background + art + inked frame */
function panelSVG(W,H,seed,inner){R=rng(seed+500);const clip=wob(rectPts(8,8,W-16,H-16,24),1.6,true);return `<clipPath id="c${seed}"><path d="${clip}"/></clipPath><g clip-path="url(#c${seed})">${inner}</g>${frame(6,6,W-12,H-12,{sw:4.6,amp:2})}`}

/* ================= paint: draw an SVG once into a bitmap ================= */
let DEFS='';
function initKit(){DEFS=`<defs>${FILTERS}${PATTERNS}${buildChars()}</defs>`}
function paint(canvas,vw,vh,inner,cssW,cssH,par='xMidYMid meet'){
  const d=Math.min(window.devicePixelRatio||1,2),pw=Math.max(1,Math.round(cssW*d)),ph=Math.max(1,Math.round(cssH*d));
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${pw}" height="${ph}" viewBox="0 0 ${vw} ${vh}" preserveAspectRatio="${par}">${DEFS}${inner}</svg>`;
  const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
  const img=new Image();img.src=url;
  return img.decode().then(()=>{canvas.width=pw;canvas.height=ph;canvas.getContext('2d').drawImage(img,0,0,pw,ph);URL.revokeObjectURL(url);return canvas});
}
/* data-URI shapes for the HTML lettering: paper boxes, bubbles and marker highlights */
function svgURI(vw,vh,inner,par='none'){return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${vw} ${vh}' preserveAspectRatio='${par}'>${inner}</svg>`)}")`}
function letteringCSS(){
  R=rng(42);const r=document.documentElement.style;
  r.setProperty('--paper',svgURI(200,100,`<path d='${wob(rectPts(3,3,194,94,14),1.3,true)}' fill='${CREAM}' stroke='${INK}' stroke-width='2.6' vector-effect='non-scaling-stroke'/><path d='${wob(rectPts(7,7,186,86,24),1.4,true)}' fill='none' stroke='${INK}' stroke-width='.9' opacity='.5' vector-effect='non-scaling-stroke'/>`));
  r.setProperty('--bub',svgURI(200,100,`<path d='${blob(100,50,96,46,30,.025)}' fill='${CREAM}' stroke='${INK}' stroke-width='2.6' vector-effect='non-scaling-stroke'/>`));
  r.setProperty('--ashbub',svgURI(200,100,`<path d='${blob(100,50,96,46,30,.03)}' fill='#fffaf0' stroke='${INK}' stroke-width='2' stroke-dasharray='6 3' vector-effect='non-scaling-stroke'/>`));
  const mk=(name,col)=>{R=rng(name.length*7+col.length);
    r.setProperty(`--mk-${name}-swipe`,svgURI(100,40,`<path d='${(()=>{let p='M2,10';for(let i=0;i<=24;i++)p+=` L${(2+i*4+j(1)).toFixed(1)},${(i%2?8+j(2):33+j(2)).toFixed(1)}`;return p})()}' stroke='${col}' stroke-width='6' fill='none' stroke-linejoin='round' stroke-linecap='round' opacity='.7'/>`));
    r.setProperty(`--mk-${name}-circle`,svgURI(100,40,`<path d='M10,22 C6,6 60,2 88,8 C102,12 98,34 70,37 C40,40 4,36 6,18 C8,8 30,4 52,4' stroke='${col}' stroke-width='3.4' fill='none' stroke-linecap='round'/>`));
    let b='';for(let i=0;i<16;i++){const a=i/16*Math.PI*2,rr=i%2?.55:1;b+=`${i?'L':'M'}${(50+Math.cos(a)*48*rr).toFixed(1)},${(20+Math.sin(a)*19*rr).toFixed(1)}`}
    r.setProperty(`--mk-${name}-burst`,svgURI(100,40,`<path d='${b}Z' fill='${col}' opacity='.9'/>`));
  };
  [['gold','#fcb315'],['rose','#f2a6c4'],['salmon','#e9b38b'],['orange','#f6a35c'],['grey','#c8c9c2'],['ember','#f0995a']].forEach(([n,c])=>mk(n,c));
}
