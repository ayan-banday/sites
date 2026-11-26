/* The Witch Who Would Not Be Read — drawing kit (Gauri's hand-drawn kit recoloured goth + Khushi's cast).
   Heavy SVG filters (#grain, #wob, #pencil, #wc, #soft) ONLY ever run once inside paint() / makeSprite()
   to produce flat bitmaps. Nothing live uses SVG turbulence or watercolor filters. */

function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let R=rng(1111);
const j=a=>(R()-.5)*2*a;

/* Goth palette: coral (#F58E84) is ONLY her paint and brush. */
const INK='#1c1020',CREAM='#f1e7d6',GOLD='#d9a441',AMBER='#b8612a',PINK='#8e1f3d',ROSE='#cf6f8a',BLUSH='#ecc1cc',
      VIOLET='#4a2b63',PLUM='#2b1733',NIGHT='#120a14',MUZZLE='#f6b9c9',SKIN='#d49a72',HAIR='#160c14',TEAR='#fff8ee';
const KSKIN='#d8a07c',CORAL='#F58E84',LILAC='#b9a3d6',MOSS='#6f7f4a',BONE=CREAM;

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
function bars(x,y,w,rows,gap=13,th=9){let g='';for(let i=0;i<rows;i++){const ww=w*(i==rows-1?.55+R()*.2:.85+R()*.15);g+=`<path d="${wob([[x,y+i*gap-th/2],[x+ww*.5,y+i*gap-th/2+j(1)],[x+ww,y+i*gap-th/2+j(1)],[x+ww+j(2),y+i*gap+th/2],[x+ww*.5,y+i*gap+th/2+j(1)],[x,y+i*gap+th/2]],.7,true)}" fill="${INK}"/>`}return g}
function sparkle(x,y,r,col){return `<path d="M${x},${y-r} Q${x+r*.18},${y-r*.18} ${x+r},${y} Q${x+r*.18},${y+r*.18} ${x},${y+r} Q${x-r*.18},${y+r*.18} ${x-r},${y} Q${x-r*.18},${y-r*.18} ${x},${y-r}Z" fill="${col}" filter="url(#wob)"/>`}
const ln=(d,w=2.4,col=INK,f='wob')=>`<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${f?` filter="url(#${f})"`:''}/>`;

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

const MORE_PATTERNS=
  `<pattern id="kStripe" width="12" height="16" patternUnits="userSpaceOnUse"><rect width="12" height="8" fill="${INK}"/><rect y="8" width="12" height="8" fill="${LILAC}"/></pattern>`+
  hatch('hRose',ROSE,2.2,6,35)+hatch('hLil',LILAC,1.6,6,-35)+hatch('hKs','#b8785a',1.2,5,35)+hatch('hMoss',MOSS,2,6,30)+
  `<radialGradient id="candleG"><stop offset="0" stop-color="#ffe9b0" stop-opacity=".9"/><stop offset=".5" stop-color="${GOLD}" stop-opacity=".35"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0"/></radialGradient>`+
  `<radialGradient id="spotG"><stop offset="0" stop-color="#fff3d6" stop-opacity=".85"/><stop offset="1" stop-color="#fff3d6" stop-opacity="0"/></radialGradient>`;

const OL=`stroke="${INK}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"`;
const thick=(d,w,col)=>`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w+5}" stroke-linecap="round" stroke-linejoin="round" filter="url(#wob)"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" filter="url(#wob)"/>`;

/* ================= Ayan (the author; sprite ids still say fool) ================= */
function buildChars(){
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
  hN+=`<path d="M-33,-356 C-38,-380 -26,-400 -2,-402 C22,-402 36,-384 30,-356 L26,-368 C24,-380 18,-388 12,-390 C8,-382 4,-380 -2,-386 C-8,-380 -12,-382 -16,-390 C-22,-388 -28,-380 -29,-366Z" fill="url(#hHair)" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round" filter="url(#wob)"/>`;
  hN+=`<path d="M-4,-386 q-4,-10 2,-16 M1,-386 q2,-12 8,-14 M-6,-387 q-8,-6 -6,-14" stroke="${INK}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  hN+=`<path d="M-14,-376 q8,-5 16,-3" stroke="#f3d2b6" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  hN+=`<path d="M3,-332 C6,-322 10,-316 6,-312 C3,-310 0,-312 -1,-314" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round" filter="url(#wob)"/>`;
  /* weirder crooked goggles on the fool */
  const gogOn=`<g transform="rotate(-4 3 -344)"><path d="M-34,-344 L-26,-344 M22,-344 L32,-344" stroke="${VIOLET}" stroke-width="5" stroke-linecap="round"/><g filter="url(#wob)"><circle cx="-12" cy="-344" r="16" fill="#fff6dc" stroke="${INK}" stroke-width="5"/><circle cx="18" cy="-344" r="17" fill="#fff6dc" stroke="${INK}" stroke-width="5"/><circle cx="-12" cy="-344" r="12" fill="url(#hGl)" opacity=".55"/><circle cx="18" cy="-344" r="13" fill="url(#hGl)" opacity=".55"/><path d="M4,-346 q2,-3 -2,0" stroke="${INK}" stroke-width="4"/></g></g>`;
  const gogUp=`<path d="M-33,-382 Q0,-392 31,-382" stroke="${VIOLET}" stroke-width="5" fill="none" stroke-linecap="round"/><g filter="url(#wob)"><ellipse cx="-12" cy="-388" rx="15" ry="11" fill="#fff6dc" stroke="${INK}" stroke-width="4.4"/><ellipse cx="17" cy="-388" rx="15" ry="11" fill="#fff6dc" stroke="${INK}" stroke-width="4.4"/><ellipse cx="-12" cy="-388" rx="10" ry="7" fill="url(#hGl)" opacity=".6"/><ellipse cx="17" cy="-388" rx="10" ry="7" fill="url(#hGl)" opacity=".6"/><path d="M-16,-392 l6,-2 M13,-392 l6,-2" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g>`;
  const hand=(x,y)=>`<circle cx="${x}" cy="${y}" r="6.5" fill="${SKIN}" stroke="${INK}" stroke-width="2"/>`;
  const arms={
    phone:thick('M-32,-286 C-46,-256 -48,-228 -40,-214 C-30,-204 -14,-224 -6,-236',10,CREAM)+thick('M28,-286 C42,-258 42,-226 36,-214 C28,-206 18,-224 14,-236',10,CREAM)+hand(-6,-238)+hand(14,-238),
    out:thick('M-32,-286 C-36,-250 0,-236 50,-246',10,CREAM)+thick('M28,-286 C50,-266 70,-258 92,-262',10,CREAM)+hand(52,-246)+hand(94,-262),
    up:thick('M-32,-286 C-58,-320 -40,-400 -10,-436',10,CREAM)+thick('M28,-286 C54,-320 36,-400 8,-436',10,CREAM)+hand(-9,-438)+hand(8,-438),
    down:thick('M-32,-286 C-44,-240 -46,-200 -44,-172',10,CREAM)+thick('M28,-286 C40,-240 42,-200 40,-172',10,CREAM)+hand(-44,-170)+hand(40,-170),
    chest:thick('M-32,-286 C-48,-252 -34,-232 -6,-252',10,CREAM)+hand(-4,-254)+thick('M28,-286 C40,-240 42,-200 40,-172',10,CREAM)+hand(40,-170),
    shrug:thick('M-32,-286 C-58,-262 -70,-286 -78,-316',10,CREAM)+thick('M28,-286 C54,-262 66,-286 74,-316',10,CREAM)+`<path d="M-86,-320 q8,-10 16,0 M66,-320 q8,-10 16,0" stroke="${INK}" stroke-width="2" fill="${SKIN}"/>`+hand(-78,-318)+hand(74,-318)
  };
  let d=`<g id="nerd-legs">${legsN}</g><g id="nerd-torso">${torN}</g><g id="nerd-head">${hN}</g><g id="gog-on">${gogOn}</g><g id="gog-up">${gogUp}</g>`;
  for(const k in arms)d+=`<g id="arms-${k}">${arms[k]}</g>`;
  return d;
}

const EY=-344;
const nEye={
  dot:x=>`<circle cx="${x-2}" cy="${EY+2}" r="3.6" fill="${INK}"/>`,
  huge:x=>`<circle cx="${x}" cy="${EY}" r="11" fill="${CREAM}" stroke="${INK}" stroke-width="1.6"/><circle cx="${x}" cy="${EY+1}" r="8" fill="${INK}"/><circle cx="${x-3}" cy="${EY-3}" r="3" fill="${CREAM}"/><circle cx="${x+3}" cy="${EY+4}" r="1.4" fill="${CREAM}"/>`,
  star:x=>sparkle(x,EY,10,GOLD)+`<path d="M${x},${EY-10} Q${x+1.8},${EY-1.8} ${x+10},${EY} Q${x+1.8},${EY+1.8} ${x},${EY+10} Q${x-1.8},${EY+1.8} ${x-10},${EY} Q${x-1.8},${EY-1.8} ${x},${EY-10}Z" fill="none" stroke="${INK}" stroke-width="1.6"/>`,
  x:x=>`<path d="M${x-6},${EY-6} L${x+6},${EY+6} M${x+6},${EY-6} L${x-6},${EY+6}" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>`,
  panic:x=>`<circle cx="${x}" cy="${EY}" r="11" fill="${CREAM}" stroke="${INK}" stroke-width="1.6"/><circle cx="${x}" cy="${EY}" r="1.8" fill="${INK}"/><circle cx="${x}" cy="${EY}" r="5.5" fill="none" stroke="${PINK}" stroke-width="1.1" stroke-dasharray="2 2"/><path d="M${x-20},${EY-14} l-5,-4 M${x+20},${EY-14} l5,-4" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`,
  dead:x=>`<path d="M${x-8},${EY-1} h16" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${x}" cy="${EY+3}" r="1.6" fill="${INK}"/>`,
  closed:x=>`<path d="M${x-8},${EY} Q${x},${EY+6} ${x+8},${EY}" stroke="${INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`,
  side:x=>`<path d="M${x-9},${EY-3} h18" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${x-6}" cy="${EY+2}" r="3.6" fill="${INK}"/>`,
  fog:x=>`<circle cx="${x}" cy="${EY}" r="12" fill="#f2ece6"/><circle cx="${x}" cy="${EY}" r="12" fill="url(#hK)" opacity=".25"/><path d="M${x-7},${EY-3} q4,-4 8,0 M${x-2},${EY+4} q4,-3 8,0" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
};
const nEyeUp={
  soft:x=>`<path d="M${x-8},${EY-3} Q${x},${EY-9} ${x+8},${EY-3}" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="${x}" cy="${EY+1}" rx="4" ry="4.6" fill="${INK}"/><circle cx="${x-1.4}" cy="${EY-.6}" r="1.3" fill="${CREAM}"/>`,
  hap:x=>`<path d="M${x-8},${EY+2} Q${x},${EY-7} ${x+8},${EY+2}" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  teary:x=>`<ellipse cx="${x}" cy="${EY}" rx="6" ry="7" fill="${INK}"/><circle cx="${x-2}" cy="${EY-2.4}" r="2.2" fill="${CREAM}"/><circle cx="${x+2}" cy="${EY+2.6}" r="1" fill="${CREAM}"/><path d="M${x-7},${EY+5} q3.5,-2 7,0 q3.5,2 7,0" stroke="#cfe" stroke-width="1.6" fill="none"/>`
};
const nBrow={
  worry:`<path d="M-24,-364 L-6,-370 M12,-370 L30,-364" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
  angry:`<path d="M-26,-374 L-2,-362 M8,-362 L32,-374" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/>`,
  soft:`<path d="M-24,-358 Q-14,-362 -6,-358 M10,-358 Q18,-362 26,-358" stroke="${INK}" stroke-width="2.4" stroke-linecap="round" fill="none"/>`
};
const nMouth={
  grin:`<path d="M-16,-308 Q0,-312 16,-308 Q10,-292 0,-292 Q-10,-292 -16,-308Z" fill="${CREAM}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M-14,-303 Q0,-300 14,-303 M-6,-308 v8 M2,-308 v9 M9,-307 v7" stroke="${INK}" stroke-width="1.3" fill="none"/>`,
  wobble:`<path d="M-10,-302 q4,-4 6,0 q3,4 6,0 q3,-4 6,0" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`,
  scream:`<path d="M-13,-312 Q0,-316 13,-312 Q11,-280 0,-276 Q-11,-280 -13,-312Z" fill="${INK}"/><path d="M-7,-286 Q0,-294 7,-286 Q4,-280 0,-280 Q-4,-280 -7,-286Z" fill="${PINK}"/><path d="M-11,-311 h22 v4 h-22z" fill="${CREAM}"/>`,
  flat:`<path d="M-8,-304 h14" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`,
  o:`<ellipse cx="-1" cy="-302" rx="4" ry="5" fill="${INK}"/>`,
  O:`<ellipse cx="-1" cy="-300" rx="8" ry="10" fill="${INK}"/><ellipse cx="-1" cy="-294" rx="5" ry="3" fill="${PINK}"/>`,
  smile:`<path d="M-10,-306 Q0,-298 10,-306" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
};
const nFx={
  sweat:`<g fill="${TEAR}" stroke="${INK}" stroke-width="1.6"><path d="M-24,-380 q-6,9 0,12 q6,-3 0,-12z"/><path d="M30,-376 q-5,8 0,11 q5,-3 0,-11z"/><path d="M38,-330 q-5,8 0,11 q5,-3 0,-11z"/></g>`,
  bigsweat:`<path d="M40,-392 q-14,20 0,28 q14,-8 0,-28z" fill="${TEAR}" stroke="${INK}" stroke-width="2"/><path d="M36,-376 q2,-6 5,-8" stroke="#fff" stroke-width="2" fill="none"/>`,
  blush:`<g opacity=".85"><ellipse cx="-24" cy="-322" rx="8" ry="4.5" fill="url(#hP)"/><ellipse cx="26" cy="-322" rx="8" ry="4.5" fill="url(#hP)"/></g>`,
  soul:`<g transform="translate(26 -292)"><path d="M0,0 C8,-10 26,-14 34,-30 C40,-44 26,-56 16,-48 C6,-42 10,-26 0,0Z" fill="${CREAM}" stroke="${INK}" stroke-width="2" opacity=".9"/><circle cx="20" cy="-42" r="1.8" fill="${INK}"/><circle cx="27" cy="-40" r="1.8" fill="${INK}"/></g>`,
  steam:`<g fill="${CREAM}" stroke="${INK}" stroke-width="1.8"><path d="${blob(-46,-392,10,7,10,.2)}"/><path d="${blob(46,-394,10,7,10,.2)}"/></g>`,
  sparkle:sparkle(-44,-392,8,GOLD)+sparkle(46,-380,6,GOLD),
  shake:`<path d="M-50,-370 q-6,14 0,28 M-58,-364 q-4,10 0,18 M46,-370 q6,14 0,28 M54,-364 q4,10 0,18" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
};
function nface(spec){
  const [e,m,...fx]=spec.split(' ');let s='';const up=e[0]==='^';
  fx.forEach(f=>{if(f.startsWith('brow:'))s+=nBrow[f.slice(5)]});
  if(fx.includes('blush'))s+=nFx.blush;
  s+=up?nEyeUp[e.slice(1)](-14)+nEyeUp[e.slice(1)](16):nEye[e](-12)+nEye[e](18);
  s+=nMouth[m]||'';
  fx.forEach(f=>{if(!f.startsWith('brow:')&&f!=='blush')s+=nFx[f]||''});
  return {up,s:`<g filter="url(#wob)">${s}</g>`};
}
function nerd(x,gy,s,face,o={}){
  const f=nface(face),fl=o.flip?-1:1;
  return `<g transform="translate(${x} ${gy}) rotate(${o.r||0}) scale(${s*fl} ${s})"><use href="#nerd-legs"/><use href="#nerd-torso"/>${o.under||''}<use href="#arms-${o.arms||'chest'}"/><use href="#nerd-head"/>${f.up?f.s+'<use href="#gog-up"/>':'<use href="#gog-on"/>'+f.s}${o.top||''}</g>`;
}

/* ================= Khushi ================= */
function buildKhushi(){
  R=rng(31);let d='';
  const OLk=`stroke="${INK}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"`;
  let legs=thick('M-14,-150 C-16,-110 -20,-70 -20,-24',12,LILAC)+thick('M14,-150 C16,-110 20,-70 20,-24',12,LILAC);
  legs+=`<path d="M-26,-150 L-14,-150 L-14,-24 L-26,-24Z" fill="url(#kStripe)" opacity=".85" filter="url(#wob)"/><path d="M14,-150 L26,-150 L26,-24 L14,-24Z" fill="url(#kStripe)" opacity=".85" filter="url(#wob)"/>`;
  legs+=`<path d="M-30,-30 C-34,-6 -50,0 -78,-10 Q-70,4 -40,4 L-10,4 C-8,-10 -10,-24 -14,-30Z" fill="${INK}" ${OLk} filter="url(#wob)"/>`;
  legs+=`<path d="M14,-30 C10,-24 8,-10 10,4 L40,4 Q70,4 78,-10 C50,0 34,-6 30,-30Z" fill="${INK}" ${OLk} filter="url(#wob)"/>`;
  legs+=`<path d="M-30,-14 l12,0 M18,-14 l12,0" stroke="${GOLD}" stroke-width="3"/>`;
  d+=`<g id="k-legs">${legs}</g>`;
  const dress='M-28,-292 C-46,-250 -72,-190 -98,-140 L-82,-150 L-68,-134 L-52,-150 L-36,-132 L-18,-148 L0,-130 L18,-148 L36,-132 L52,-150 L68,-134 L82,-150 L98,-140 C72,-190 46,-250 28,-292 C10,-300 -10,-300 -28,-292Z';
  d+=`<g id="k-dress"><path d="${dress}" fill="${INK}" ${OLk} filter="url(#wob)"/><path d="${dress}" fill="url(#hV)" opacity=".6" filter="url(#pencil)"/>`+
     `<path d="M-40,-200 q-10,30 -24,52 M40,-196 q12,30 26,50 M0,-250 v100" stroke="${VIOLET}" stroke-width="2.4" fill="none"/>`+
     `<path d="M-30,-292 Q0,-270 30,-292" stroke="${GOLD}" stroke-width="3" fill="none"/>${sparkle(0,-270,7,GOLD)}</g>`;
  const coat='M-30,-292 C-48,-240 -64,-190 -74,-128 L74,-128 C64,-190 48,-240 30,-292 C10,-300 -10,-300 -30,-292Z';
  d+=`<g id="k-coat"><path d="${coat}" fill="${BONE}" ${OLk} filter="url(#wob)"/><path d="${coat}" fill="url(#hW)" opacity=".4" filter="url(#pencil)"/>`+
     `<path d="M-14,-292 L0,-236 L14,-292" fill="${INK}" ${OLk} filter="url(#wob)"/><path d="M-22,-292 L-6,-220 M22,-292 L6,-220 M0,-232 V-130" stroke="${INK}" stroke-width="2.4" fill="none" filter="url(#wob)"/>`+
     `<g transform="translate(36 -186) rotate(8)"><path d="M-6,-14 h22 v32 h-22z" fill="${VIOLET}" stroke="${INK}" stroke-width="2" filter="url(#wob)"/><circle cx="5" cy="-2" r="4" fill="none" stroke="${GOLD}" stroke-width="1.6"/></g>`+
     `<path d="${wob(rectPts(22,-176,34,30,10),1,true)}" fill="${BONE}" stroke="${INK}" stroke-width="2.4"/>`+
     `<path d="${wob(rectPts(-56,-262,26,14,8),.8,true)}" fill="#fff" stroke="${INK}" stroke-width="1.8"/><path d="M-52,-255 h18" stroke="${INK}" stroke-width="1.4"/></g>`;
  d+=`<g id="k-snake">${thick('M-22,-296 C-30,-270 -20,-236 4,-238 C26,-240 30,-266 18,-292',7,ROSE)}`+
     `<path d="${blob(21,-298,9,7,12,.1)}" fill="${ROSE}" ${OLk} filter="url(#wob)"/><circle cx="19" cy="-300" r="2.6" fill="none" stroke="${INK}" stroke-width="1.4"/><circle cx="25" cy="-300" r="2.6" fill="none" stroke="${INK}" stroke-width="1.4"/>`+
     `<path d="M28,-296 l6,2 l-2,3 M34,-294 l3,-2" stroke="${PINK}" stroke-width="1.6" fill="none"/>`+
     `<circle cx="-22" cy="-296" r="7" fill="${GOLD}" stroke="${INK}" stroke-width="2.2"/><circle cx="-22" cy="-296" r="3" fill="${INK}"/></g>`;
  const hb='M-38,-356 C-56,-320 -60,-270 -52,-236 C-40,-246 -30,-240 -22,-252 C-10,-246 10,-246 22,-252 C30,-240 40,-246 52,-236 C60,-270 56,-320 38,-356 C30,-394 -30,-394 -38,-356Z';
  d+=`<g id="k-hairback"><path d="${hb}" fill="${HAIR}" ${OLk} filter="url(#wob)"/><path d="${hb}" fill="url(#hHair)" opacity=".5" filter="url(#pencil)"/></g>`;
  let wild='';for(let i=0;i<11;i++){const a=-2.75+i*.55,r1=40,r2=96+R()*44;wild+=`<path d="M${Math.cos(a)*r1},${-340+Math.sin(a)*r1} Q${Math.cos(a+.3)*r2*.7},${-340+Math.sin(a+.3)*r2*.7} ${Math.cos(a+.15)*r2},${-340+Math.sin(a+.15)*r2}" stroke="${HAIR}" stroke-width="${10-i%3*2}" fill="none" stroke-linecap="round" filter="url(#wob)"/>`}
  d+=`<g id="k-hairwild">${wild}</g>`;
  const head=blob(0,-344,34,39,26,.02);
  d+=`<g id="k-head"><path d="M-8,-312 L-8,-290 L8,-290 L8,-312Z" fill="${KSKIN}" ${OLk} filter="url(#wob)"/>`+
     `<path d="${blob(-35,-338,7,10,10,.1)}" fill="${KSKIN}" ${OLk}/><path d="${blob(35,-338,7,10,10,.1)}" fill="${KSKIN}" ${OLk}/>`+
     `<path d="${head}" fill="${KSKIN}" ${OLk} filter="url(#wob)"/><path d="${head}" fill="url(#hKs)" opacity=".3" filter="url(#pencil)"/></g>`;
  const bangs='M-36,-344 C-40,-384 -10,-396 4,-394 C30,-392 42,-378 37,-344 L30,-360 L22,-350 L14,-366 L4,-354 L-6,-368 L-14,-354 L-22,-366 L-30,-352Z';
  d+=`<g id="k-bangs"><path d="${bangs}" fill="${HAIR}" ${OLk} filter="url(#wob)"/><path d="M-20,-386 q14,-6 30,-2" stroke="#4a3550" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
  d+=`<g id="k-hat" transform="rotate(-9 0 -384)" filter="url(#wob)"><path d="M-74,-378 Q0,-404 74,-382 Q30,-366 0,-368 Q-40,-366 -74,-378Z" fill="${INK}" ${OLk}/>`+
     `<path d="M-38,-384 L-8,-468 Q6,-506 46,-500 Q22,-490 12,-470 L36,-386 Q0,-396 -38,-384Z" fill="${INK}" ${OLk}/><path d="M-38,-384 L-8,-468 Q6,-506 46,-500" fill="url(#hV)" opacity=".5"/>`+
     `<path d="M-36,-392 Q0,-404 35,-394 L32,-404 Q0,-414 -32,-402Z" fill="${PINK}" stroke="${INK}" stroke-width="2"/>`+
     `<path d="M46,-500 v14" stroke="${GOLD}" stroke-width="2"/><path d="M40,-480 a9,9 0 1 0 14,-2 a7,7 0 1 1 -14,2" fill="${GOLD}" stroke="${INK}" stroke-width="1.6"/></g>`;
  const hand=(x,y)=>`<circle cx="${x}" cy="${y}" r="7" fill="${KSKIN}" stroke="${INK}" stroke-width="2"/>`;
  const nails=(x,y)=>`<path d="M${x-4},${y-6} l-2,-4 M${x},${y-7} l0,-4 M${x+4},${y-6} l2,-4" stroke="${PINK}" stroke-width="2.4" stroke-linecap="round"/>`;
  const A={
    hip:s=>thick('M-30,-286 C-56,-262 -62,-230 -44,-218 C-34,-212 -26,-220 -26,-228',11,s)+hand(-26,-228)+thick('M30,-286 C56,-262 62,-230 44,-218 C34,-212 26,-220 26,-228',11,s)+hand(26,-228),
    fling:s=>thick('M-30,-286 C-56,-262 -62,-230 -44,-218 C-34,-212 -26,-220 -26,-228',11,s)+hand(-26,-228)+thick('M30,-286 C54,-320 66,-380 76,-424',11,s)+hand(77,-428)+nails(77,-428),
    conduct:s=>thick('M-30,-286 C-60,-280 -80,-320 -88,-352',11,s)+hand(-88,-356)+nails(-88,-356)+thick('M30,-286 C60,-280 80,-320 88,-352',11,s)+hand(88,-356)+nails(88,-356),
    cards:s=>thick('M-30,-286 C-46,-252 -24,-236 -4,-244',11,s)+hand(-2,-246)+thick('M30,-286 C46,-254 32,-238 16,-244',11,s)+hand(14,-246),
    brush:s=>thick('M-30,-286 C-56,-262 -62,-230 -44,-218 C-34,-212 -26,-220 -26,-228',11,s)+hand(-26,-228)+thick('M30,-286 C62,-292 94,-306 122,-326',11,s)+hand(124,-328),
    point:s=>thick('M-30,-286 C-56,-262 -62,-230 -44,-218 C-34,-212 -26,-220 -26,-228',11,s)+hand(-26,-228)+thick('M30,-286 C62,-282 100,-284 132,-292',11,s)+hand(134,-292)+`<path d="M140,-294 l14,-2" stroke="${KSKIN}" stroke-width="5" stroke-linecap="round"/>`,
    bow:s=>thick('M-30,-286 C-50,-270 -70,-230 -96,-214',11,s)+hand(-98,-212)+thick('M30,-286 C50,-270 70,-230 96,-214',11,s)+hand(98,-212),
    face:s=>thick('M-30,-286 C-58,-280 -54,-330 -40,-336',11,s)+hand(-38,-338)+thick('M30,-286 C56,-262 62,-230 44,-218 C34,-212 26,-220 26,-228',11,s)+hand(26,-228)
  };
  for(const k in A){d+=`<g id="k-arms-${k}-w">${A[k](INK)}</g><g id="k-arms-${k}-c">${A[k](BONE)}</g>`}
  return d;
}

const KEY=-346;
const kEye={
  side:(x)=>`<path d="M${x-10},${KEY-3} Q${x},${KEY-10} ${x+10},${KEY-3}" stroke="${INK}" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M${x-8},${KEY+5} Q${x},${KEY+7} ${x+8},${KEY+4}" stroke="${INK}" stroke-width="1.6" fill="none"/><circle cx="${x+5}" cy="${KEY+1}" r="4.6" fill="${INK}"/><circle cx="${x+6}" cy="${KEY-1}" r="1.4" fill="#fff"/><path d="M${x+9},${KEY-5} l6,-5" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`,
  feral:(x)=>`<ellipse cx="${x}" cy="${KEY}" rx="10" ry="12.5" fill="#fff" stroke="${INK}" stroke-width="2.6"/><circle cx="${x}" cy="${KEY+1}" r="2.2" fill="${INK}"/><path d="M${x-9},${KEY-12} l-4,-6 M${x},${KEY-14} v-7 M${x+9},${KEY-12} l4,-6" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`,
  star:(x)=>sparkle(x,KEY,11,GOLD)+`<path d="M${x},${KEY-11} Q${x+2},${KEY-2} ${x+11},${KEY} Q${x+2},${KEY+2} ${x},${KEY+11} Q${x-2},${KEY+2} ${x-11},${KEY} Q${x-2},${KEY-2} ${x},${KEY-11}Z" fill="none" stroke="${INK}" stroke-width="1.6"/>`,
  villain:(x)=>`<path d="M${x-10},${KEY+3} Q${x},${KEY-7} ${x+10},${KEY+3}" stroke="${INK}" stroke-width="3.8" fill="none" stroke-linecap="round"/><path d="M${x+(x<0?-10:10)},${KEY+2} l${x<0?-5:5},-4" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`,
  lidded:(x)=>`<path d="M${x-10},${KEY-1} h20" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M${x-6},${KEY-1} a6,6 0 0 0 12,0z" fill="${INK}"/><path d="M${x+(x<0?-10:10)},${KEY-2} l${x<0?-5:5},-5" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`,
  soft:(x)=>`<path d="M${x-9},${KEY} Q${x},${KEY+7} ${x+9},${KEY}" stroke="${INK}" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M${x+(x<0?-9:9)},${KEY} l${x<0?-4:4},-3" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`,
  spiral:(x)=>`<ellipse cx="${x}" cy="${KEY}" rx="11" ry="12.5" fill="#fff" stroke="${INK}" stroke-width="2.4"/><path d="M${x},${KEY} m0,-1.5 a1.5,1.5 0 1 1 -1.5,1.5 a4,4 0 1 1 5,3 a6.5,6.5 0 1 1 -8,-6.5 a9,9 0 1 1 7,10" stroke="${PINK}" stroke-width="1.8" fill="none"/>`,
  cat:(x)=>`<ellipse cx="${x}" cy="${KEY}" rx="11" ry="13" fill="${GOLD}" stroke="${INK}" stroke-width="2.8"/><ellipse cx="${x}" cy="${KEY}" rx="2.6" ry="9.5" fill="${INK}"/><circle cx="${x-4}" cy="${KEY-5}" r="2.2" fill="#fff"/><path d="M${x+(x<0?-11:11)},${KEY-4} l${x<0?-6:6},-6" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`,
  wink:(x)=>`<path d="M${x-10},${KEY+1} Q${x},${KEY-9} ${x+10},${KEY+1}" stroke="${INK}" stroke-width="3.8" fill="none" stroke-linecap="round"/>`,
  big:(x)=>`<ellipse cx="${x}" cy="${KEY}" rx="11" ry="13" fill="${INK}"/><circle cx="${x-4}" cy="${KEY-5}" r="3.6" fill="#fff"/><circle cx="${x+3}" cy="${KEY+4}" r="1.6" fill="#fff"/><path d="M${x+(x<0?-11:11)},${KEY-4} l${x<0?-5:5},-4" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`
};
const KM=-316;
const kMouth={
  smirk:`<path d="M-9,${KM+2} Q3,${KM+6} 13,${KM-6}" stroke="${PINK}" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M-9,${KM+2} Q3,${KM+6} 13,${KM-6}" stroke="${INK}" stroke-width="1.4" fill="none"/>`,
  fang:`<path d="M-16,${KM-4} Q0,${KM} 16,${KM-4} Q10,${KM+14} 0,${KM+14} Q-10,${KM+14} -16,${KM-4}Z" fill="#fff" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/><path d="M-16,${KM-4} Q0,${KM} 16,${KM-4}" stroke="${PINK}" stroke-width="3" fill="none"/><path d="M4,${KM-2} l3,9 l3,-10" fill="#fff" stroke="${INK}" stroke-width="1.6"/>`,
  cackle:`<path d="M-19,${KM-8} Q0,${KM-13} 19,${KM-8} Q15,${KM+24} 0,${KM+26} Q-15,${KM+24} -19,${KM-8}Z" fill="${INK}" stroke="${PINK}" stroke-width="3.2"/><path d="M-10,${KM+17} Q0,${KM+6} 10,${KM+17} Q5,${KM+24} 0,${KM+24} Q-5,${KM+24} -10,${KM+17}Z" fill="${ROSE}"/><path d="M-13,${KM-7} l3.5,9 l3.5,-9 M6,${KM-8} l3.5,9 l3.5,-9" fill="#fff" stroke="#fff" stroke-width="1"/>`,
  flat:`<path d="M-8,${KM} h15" stroke="${PINK}" stroke-width="4" stroke-linecap="round"/>`,
  soft:`<path d="M-9,${KM-2} Q0,${KM+6} 9,${KM-2}" stroke="${PINK}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  tongue:`<path d="M-11,${KM-3} Q0,${KM+5} 11,${KM-3}" stroke="${PINK}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M-2,${KM+1} q0,12 7,12 q6,-1 3,-12" fill="${ROSE}" stroke="${INK}" stroke-width="1.8"/><circle cx="4" cy="${KM+8}" r="2.2" fill="${GOLD}" stroke="${INK}" stroke-width="1"/>`
};
const kBrow={
  arch:`<path d="M-24,-364 Q-14,-378 -4,-366" stroke="${INK}" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M6,-362 Q16,-366 26,-362" stroke="${INK}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`,
  angry:`<path d="M-25,-370 L-3,-360 M5,-360 L27,-370" stroke="${INK}" stroke-width="4.6" stroke-linecap="round"/>`,
  soft:`<path d="M-23,-362 Q-14,-366 -5,-362 M5,-362 Q14,-366 23,-362" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  up:`<path d="M-24,-370 Q-14,-378 -4,-370 M6,-370 Q16,-378 26,-370" stroke="${INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`
};
const kFx={
  blush:`<g opacity=".8"><ellipse cx="-22" cy="-328" rx="8" ry="4.5" fill="url(#hP)"/><ellipse cx="24" cy="-328" rx="8" ry="4.5" fill="url(#hP)"/></g>`,
  shadow:`<path d="M-34,-374 Q0,-390 36,-374 L36,-334 Q0,-344 -34,-334Z" fill="${PLUM}" opacity=".55"/>`,
  sparkle:sparkle(-48,-392,9,GOLD)+sparkle(50,-372,7,GOLD)+sparkle(44,-410,5,LILAC),
  bolt:`<path d="M-54,-410 l10,16 l-8,2 l10,16 M56,-406 l-10,14 l8,2 l-10,16" stroke="${GOLD}" stroke-width="3.4" fill="none" stroke-linejoin="round"/>`,
  aura:`<g opacity=".7">${[0,1,2,3,4,5].map(i=>{const a=i/6*Math.PI*2;return sparkle(Math.cos(a)*62,-350+Math.sin(a)*62,4+i%2*3,i%2?LILAC:GOLD)}).join('')}</g>`
};
const ALLP=['earL','earR','nose','septum','brow'];
const PIERCE={
  earL:`<circle cx="-38" cy="-326" r="5.5" fill="none" stroke="${GOLD}" stroke-width="2.6"/><circle cx="-41" cy="-336" r="2.6" fill="${GOLD}" stroke="${INK}" stroke-width="1"/><circle cx="-40" cy="-344" r="2.2" fill="${GOLD}" stroke="${INK}" stroke-width="1"/>`,
  earR:`<circle cx="38" cy="-330" r="3" fill="${GOLD}" stroke="${INK}" stroke-width="1"/><path d="M36,-352 q8,2 6,10" stroke="${GOLD}" stroke-width="2.6" fill="none"/><path d="M38,-327 v12" stroke="${GOLD}" stroke-width="1.6"/><path d="M38,-315 l-3,5 h6z" fill="${GOLD}" stroke="${INK}" stroke-width="1"/>`,
  nose:`<circle cx="7" cy="-327" r="4" fill="none" stroke="${GOLD}" stroke-width="2.2"/>`,
  septum:`<path d="M-4,-324 a4,4 0 1 0 8,0" stroke="${GOLD}" stroke-width="2.4" fill="none"/>`,
  brow:`<circle cx="18" cy="-370" r="2.4" fill="${GOLD}" stroke="${INK}" stroke-width="1"/><circle cx="24" cy="-376" r="2.4" fill="${GOLD}" stroke="${INK}" stroke-width="1"/>`
};
const kNose=`<path d="M1,-336 C3,-330 5,-326 2,-324" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
function kface(spec){
  const [e,m,...fx]=spec.split(' ');const [el,er]=e.includes('/')?e.split('/'):[e,e];let s=kNose;
  fx.forEach(f=>{if(f.startsWith('brow:'))s+=kBrow[f.slice(5)]});
  if(fx.includes('blush'))s+=kFx.blush;
  if(fx.includes('shadow'))s+=kFx.shadow;
  s+=kEye[el](-14)+kEye[er](15)+(kMouth[m]||'');
  fx.forEach(f=>{if(!f.startsWith('brow:')&&f!=='blush'&&f!=='shadow')s+=kFx[f]||''});
  return `<g filter="url(#wob)">${s}</g>`;
}
function khushi(x,gy,s,face,o={}){
  const outfit=o.outfit||'witch',sl=outfit==='coat'||outfit==='both'?'c':'w',fl=o.flip?-1:1;
  let g=`<use href="#k-hairback"/>`+(o.wild?`<use href="#k-hairwild"/>`:'')+(o.legs===false?'':`<use href="#k-legs"/>`);
  if(outfit==='witch'||outfit==='both')g+=`<use href="#k-dress"/>`;
  if(outfit==='coat'||outfit==='both')g+=`<use href="#k-coat"/>`;
  g+=`<use href="#k-head"/>`+kface(face)+`<use href="#k-bangs"/>`+(o.pierce||[]).map(p=>PIERCE[p]).join('');
  if(o.snake!==false)g+=`<use href="#k-snake"/>`;
  if(o.hat!==false&&outfit!=='coat')g+=`<use href="#k-hat"/>`;
  g+=(o.behind||'')+(o.arms===false?'':`<use href="#k-arms-${o.arms||'hip'}-${sl}"/>`)+(o.hold||'');
  return `<g transform="translate(${x} ${gy}) rotate(${o.r||0}) scale(${s*fl} ${s})">${g}</g>`;
}
function khead(x,y,s,face,o={}){
  return `<g transform="translate(${x} ${y}) scale(${s}) translate(0 345)"><use href="#k-hairback"/>${o.wild?'<use href="#k-hairwild"/>':''}<use href="#k-head"/>${kface(face)}<use href="#k-bangs"/>${(o.pierce||[]).map(p=>PIERCE[p]).join('')}${o.hat?'<use href="#k-hat"/>':''}</g>`;
}
function ashhead(x,y,s,face,o={}){
  const f=nface(face);return `<g transform="translate(${x} ${y}) scale(${s}) translate(0 350)"><use href="#nerd-head"/>${f.up?f.s+'<use href="#gog-up"/>':'<use href="#gog-on"/>'+f.s}${o.top||''}</g>`;
}
const ASH_WEIRD=`<g filter="url(#wob)"><path d="M-6,-404 l-8,-28 M2,-404 l6,-32 M8,-402 l14,-24 M-12,-402 l-18,-20 M-2,-406 l-1,-22" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`+
  `<path d="M-22,-292 L-4,-238 L16,-292" stroke="${PINK}" stroke-width="3.2" fill="none"/><path d="${wob(rectPts(-15,-244,24,30,8),.8,true)}" fill="${BONE}" stroke="${INK}" stroke-width="2"/><path d="M-11,-236 h16 M-11,-228 h11" stroke="${PINK}" stroke-width="2.4"/></g>`;

/* ================= props ================= */
const K={
  clock:(x,y,s=1,h=11.95)=>{const ma=(h%1)*Math.PI*2-Math.PI/2,ha=(h%12)/12*Math.PI*2-Math.PI/2;let t='';for(let i=0;i<12;i++){const a=i/12*Math.PI*2;t+=`<path d="M${Math.cos(a)*58},${Math.sin(a)*58} L${Math.cos(a)*(i%3?50:44)},${Math.sin(a)*(i%3?50:44)}" stroke="${INK}" stroke-width="${i%3?2.4:4.4}"/>`}
    return `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#wob)"><circle r="74" fill="${GOLD}" stroke="${INK}" stroke-width="4"/><circle r="64" fill="${BONE}" stroke="${INK}" stroke-width="2.4"/>${t}<circle cx="-16" cy="22" r="6" fill="none" stroke="${INK}" stroke-width="2.4"/><circle cx="16" cy="22" r="6" fill="none" stroke="${INK}" stroke-width="2.4"/>`+
    `<path d="M0,0 L${Math.cos(ha)*32},${Math.sin(ha)*32}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M0,0 L${Math.cos(ma)*52},${Math.sin(ma)*52}" stroke="${PINK}" stroke-width="4" stroke-linecap="round"/><circle r="5" fill="${INK}"/></g>`},
  clockDial:(x,y,s=1)=>{let t='';for(let i=0;i<12;i++){const a=i/12*Math.PI*2;t+=`<path d="M${Math.cos(a)*58},${Math.sin(a)*58} L${Math.cos(a)*(i%3?50:44)},${Math.sin(a)*(i%3?50:44)}" stroke="${INK}" stroke-width="${i%3?2.4:4.4}"/>`}
    return `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#wob)"><circle r="74" fill="${GOLD}" stroke="${INK}" stroke-width="4"/><circle r="64" fill="${BONE}" stroke="${INK}" stroke-width="2.4"/>${t}<circle cx="-16" cy="22" r="6" fill="none" stroke="${INK}" stroke-width="2.4"/><circle cx="16" cy="22" r="6" fill="none" stroke="${INK}" stroke-width="2.4"/></g>`},
  candle:(x,y,s=1,fl='calm',h=60)=>{const flame=fl==='out'?`<path d="M0,-${h+6} q-6,-14 2,-26 q-8,-10 2,-22" stroke="#9a8f9c" stroke-width="2.4" fill="none"/>`:fl==='wild'?`<path d="M0,-${h} C-18,-${h+20} 6,-${h+34} -2,-${h+64} C14,-${h+40} 18,-${h+24} 0,-${h}Z" fill="${GOLD}" stroke="${INK}" stroke-width="2"/><path d="M0,-${h+4} C-6,-${h+16} 4,-${h+24} 0,-${h+36}" stroke="${AMBER}" stroke-width="3" fill="none"/>`:`<path d="M0,-${h} C-10,-${h+10} -6,-${h+24} 0,-${h+34} C6,-${h+24} 10,-${h+10} 0,-${h}Z" fill="${GOLD}" stroke="${INK}" stroke-width="2"/><ellipse cx="0" cy="-${h+12}" rx="3" ry="7" fill="#fff6dc"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#wob)">${fl==='out'?'':`<circle cy="-${h+18}" r="60" fill="url(#candleG)"/>`}<path d="M-12,0 L-12,-${h} Q0,-${h+6} 12,-${h} L12,0Z" fill="${BONE}" stroke="${INK}" stroke-width="2.4"/><path d="M-12,-${h} q4,14 2,22 q4,-6 5,-20 M6,-${h+2} q2,10 6,14" stroke="${INK}" stroke-width="1.6" fill="${BONE}"/>${flame}</g>`},
  card:(x,y,s=1,r=0,kind='back')=>{let face='';
    if(kind==='back')face=`<rect x="-34" y="-52" width="68" height="104" rx="6" fill="${VIOLET}"/><path d="M-20,-8 Q0,-26 20,-8 Q0,10 -20,-8Z" fill="${BONE}" stroke="${GOLD}" stroke-width="2"/><circle cy="-8" r="6" fill="${INK}"/>${sparkle(0,-36,6,GOLD)}${sparkle(0,24,6,GOLD)}`;
    else if(kind==='blank')face=`<rect x="-34" y="-52" width="68" height="104" rx="6" fill="#fffaf0"/>`;
    else if(kind==='artist')face=`<rect x="-34" y="-52" width="68" height="104" rx="6" fill="${PLUM}"/><path d="M-26,30 C-10,-10 10,20 26,-30" stroke="${CORAL}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-24,-30 C-4,-36 6,-10 24,-20" stroke="${LILAC}" stroke-width="5" fill="none" stroke-linecap="round"/>${sparkle(-14,10,7,GOLD)}${sparkle(16,24,5,GOLD)}<circle cx="-8" cy="-2" r="5" fill="none" stroke="#fff" stroke-width="2.4"/><circle cx="8" cy="-2" r="5" fill="none" stroke="#fff" stroke-width="2.4"/>`;
    return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" filter="url(#wob)"><path d="${wob(rectPts(-40,-60,80,120,14),1,true)}" fill="${INK}" opacity=".35" transform="translate(4 5)"/><path d="${wob(rectPts(-40,-60,80,120,14),1,true)}" fill="${BONE}" stroke="${INK}" stroke-width="2.8"/>${face}<rect x="-34" y="-52" width="68" height="104" rx="6" fill="none" stroke="${GOLD}" stroke-width="2.4"/></g>`},
  bat:(x,y,s=1,r=0)=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" filter="url(#wob)"><path d="M0,-6 C-10,-22 -30,-26 -46,-14 C-38,-12 -36,-4 -40,2 C-30,-4 -22,0 -18,8 C-12,2 -6,4 0,10 C6,4 12,2 18,8 C22,0 30,-4 40,2 C36,-4 38,-12 46,-14 C30,-26 10,-22 0,-6Z" fill="${INK}" stroke="${INK}" stroke-width="2"/><circle cx="-5" cy="-2" r="3.4" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="5" cy="-2" r="3.4" fill="none" stroke="#fff" stroke-width="1.8"/><path d="M-3,6 l1,4 l1,-4 M2,6 l1,4 l1,-4" stroke="#fff" stroke-width="1.2"/></g>`,
  needle:(x,y,s=1,r=0,mood='sweat')=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" filter="url(#wob)"><path d="M-6,-120 L6,-120 L5,40 L0,70 L-5,40Z" fill="#dfe3e8" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="0" cy="-108" rx="3" ry="8" fill="${INK}"/>`+
    (mood==='faint'?`<path d="M-4,-60 l-4,4 l4,4 l-4,4 M4,-60 l4,4 l-4,4 l4,4" stroke="${INK}" stroke-width="2" fill="none"/><path d="M-5,-30 q5,4 10,0" stroke="${INK}" stroke-width="2" fill="none"/>`:`<circle cx="-3" cy="-60" r="2.4" fill="${INK}"/><circle cx="3" cy="-60" r="2.4" fill="${INK}"/><path d="M-4,-46 q4,-4 8,0" stroke="${INK}" stroke-width="2" fill="none"/>`)+
    `<g fill="${TEAR}" stroke="${INK}" stroke-width="1.4"><path d="M14,-80 q-5,8 0,11 q5,-3 0,-11z"/><path d="M-16,-70 q-4,7 0,10 q4,-3 0,-10z"/><path d="M16,-50 q-4,7 0,10 q4,-3 0,-10z"/></g><path d="M-22,-92 q-6,10 0,20 M22,-92 q6,10 0,20" stroke="${INK}" stroke-width="1.8" fill="none"/></g>`,
  banana:(x,y,s=1,r=0)=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" filter="url(#wob)"><path d="M-40,-6 C-30,24 30,24 44,-14 C30,4 -20,6 -40,-6Z" fill="#f2cf5b" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/><path d="M-40,-6 l-6,-4 M44,-14 l4,-6" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="-4" cy="6" r="2.2" fill="${INK}"/><circle cx="6" cy="5" r="2.2" fill="${INK}"/><path d="M-2,11 q3,2 6,0" stroke="${INK}" stroke-width="1.6" fill="none"/></g>`,
  script:(x,y,s=1,r=0,big=false)=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" filter="url(#wob)"><path d="${wob(rectPts(-34,-44,68,88,12),1,true)}" fill="${INK}" opacity=".3" transform="translate(3 4)"/><path d="${wob(rectPts(-34,-44,68,88,12),1,true)}" fill="#fbf6ea" stroke="${INK}" stroke-width="2.4"/>`+
    bars(-24,-24,46,4,14,5)+(big?`<path d="M-34,-10 h68" stroke="${ROSE}" stroke-width="6" opacity=".9"/>`:'')+`</g>`,
  brush:(x,y,s=1,r=0)=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" filter="url(#wob)"><path d="M-4,0 L4,0 L3,-90 L-3,-90Z" fill="${INK}"/><rect x="-6" y="-104" width="12" height="16" fill="${GOLD}" stroke="${INK}" stroke-width="1.6"/><path d="M-6,-104 Q-2,-134 0,-146 Q4,-130 6,-104Z" fill="${CORAL}" stroke="${INK}" stroke-width="1.8"/></g>`,
  playbill:(x,y,s=1,clean=false)=>`<g transform="translate(${x} ${y}) scale(${s})" filter="url(#wob)"><path d="${wob(rectPts(-110,-150,220,300,20),1.4,true)}" fill="${INK}" stroke="${GOLD}" stroke-width="5"/><path d="${wob(rectPts(-98,-138,196,276,20),1,true)}" fill="none" stroke="${GOLD}" stroke-width="1.8"/>`+
    `<path d="M-40,-60 a40,40 0 1 0 50,48 a32,32 0 1 1 -50,-48" fill="${GOLD}"/><circle cx="-6" cy="-24" r="6" fill="none" stroke="${INK}" stroke-width="2.4"/><circle cx="12" cy="-24" r="6" fill="none" stroke="${INK}" stroke-width="2.4"/>`+
    (clean?'':bars(-70,46,140,2,16,6).replaceAll(INK,BONE)+bars(-50,90,100,1,14,10).replaceAll(INK,GOLD))+`</g>`,
  door:(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})" filter="url(#wob)"><path d="M-70,0 L-70,-260 Q0,-300 70,-260 L70,0Z" fill="${NIGHT}" stroke="${INK}" stroke-width="3"/><path d="M-70,0 L-70,-260 Q-10,-290 30,-270 L46,-10Z" fill="#6b3f2a" stroke="${INK}" stroke-width="3" transform="skewY(-8) translate(-30 -6)"/>`+
    [[-90,-200,-130,-230],[-80,-120,-128,-110],[60,-230,104,-262],[70,-80,116,-70],[0,-292,10,-330]].map(([a,b,c,e])=>`<path d="M${a},${b} L${c},${e}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`).join('')+`</g>`,
  jars:(x,y,s=1)=>{let g='';[[-70,MOSS,40],[-24,ROSE,56],[22,LILAC,36],[66,GOLD,48]].forEach(([jx,c,h])=>{g+=`<path d="M${jx-16},0 L${jx-16},-${h} Q${jx},-${h+8} ${jx+16},-${h} L${jx+16},0Z" fill="${c}" fill-opacity=".75" stroke="${INK}" stroke-width="2.4"/><rect x="${jx-10}" y="-${h+14}" width="20" height="10" fill="${AMBER}" stroke="${INK}" stroke-width="2"/><circle cx="${jx-4}" cy="-${h/2}" r="3" fill="none" stroke="${INK}" stroke-width="1.6"/><circle cx="${jx+5}" cy="-${h/2}" r="3" fill="none" stroke="${INK}" stroke-width="1.6"/>`});
    return `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#wob)"><path d="M-110,4 h220" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>${g}</g>`},
  cobweb:(x,y,s=1,flip=1)=>{let g='';for(let i=0;i<5;i++){const a=i/4*Math.PI/2;g+=`<path d="M0,0 L${Math.cos(a)*90},${Math.sin(a)*90}" stroke="${BONE}" stroke-width="1.4"/>`}for(let r=24;r<=90;r+=22){let p='';for(let i=0;i<=4;i++){const a=i/4*Math.PI/2;p+=`${i?'Q'+(Math.cos(a-.2)*(r-6)).toFixed(0)+','+(Math.sin(a-.2)*(r-6)).toFixed(0)+' ':'M'}${(Math.cos(a)*r).toFixed(0)},${(Math.sin(a)*r).toFixed(0)} `}g+=`<path d="${p}" stroke="${BONE}" stroke-width="1.2" fill="none"/>`}
    return `<g transform="translate(${x} ${y}) scale(${s*flip} ${s})" opacity=".55" filter="url(#wob)">${g}</g>`},
  spot:(x,y,w,h)=>`<path d="M${x-30},${y} L${x+30},${y} L${x+w/2},${y+h} L${x-w/2},${y+h}Z" fill="url(#spotG)" opacity=".55" filter="url(#wc)"/>`,
  valance:(W,H)=>{let sc='';const n=11;for(let i=0;i<n;i++){const x0=i*W/n,x1=(i+1)*W/n;sc+=`Q${((x0+x1)/2).toFixed(0)},${(H*.16).toFixed(0)} ${x1.toFixed(0)},${(H*.09).toFixed(0)} `}
    return `<path d="M0,0 H${W} V${(H*.09).toFixed(0)} L0,${(H*.09).toFixed(0)} ${sc}" fill="#6a1a35" stroke="${INK}" stroke-width="3" filter="url(#wob)"/>`+
      `<path d="M0,${(H*.95).toFixed(0)} H${W}" stroke="${GOLD}" stroke-width="6"/>`+[...Array(8)].map((_,i)=>`<path d="M${W*(i+.5)/8-10},${H} a10,8 0 0 1 20,0Z" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>`).join('')},
  curtainHalf:(W,H,side='L')=>{const w=W*.48;let f='';for(let k=1;k<6;k++)f+=`<path d="M${w*k/6},0 q${side==='L'?10:-10},${H*.5} 0,${H}" stroke="#3a0c1e" stroke-width="8" fill="none" opacity=".75"/>`;
    return `<path d="M0,0 H${w} V${H} H0Z" fill="#6a1a35" filter="url(#wob)"/>${f}<path d="M0,0 H${w} V${H} H0Z" fill="url(#hP)" opacity=".25"/>`},
  stageSides:(W,H,sw=68)=>{const c=(x,fl)=>{let f='';for(let k=1;k<4;k++)f+=`<path d="M${x+sw*k/4},0 q${fl*7},${H*.5} 0,${H}" stroke="#3a0c1e" stroke-width="6" fill="none" opacity=".7"/>`;return `<path d="M${x},0 H${x+sw} V${H} H${x}Z" fill="#6a1a35" filter="url(#wob)"/>${f}<path d="M${x},0 H${x+sw} V${H} H${x}Z" fill="url(#hP)" opacity=".25"/>`};
    return c(-4,1)+c(W-sw+4,-1)+K.valance(W,H)},
  villain:(x,y,s=1,mood='prim',r=0)=>{
    const eyes=mood==='shock'?`<circle cx="-14" cy="-30" r="9" fill="#fff" stroke="${INK}" stroke-width="2.4"/><circle cx="-14" cy="-30" r="2" fill="${INK}"/><circle cx="16" cy="-30" r="9" fill="#fff" stroke="${INK}" stroke-width="2.4"/><circle cx="16" cy="-30" r="2" fill="${INK}"/>`
      :mood==='shout'?`<path d="M-24,-40 L-6,-30 M26,-40 L8,-30" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="-14" cy="-26" r="3" fill="${INK}"/><circle cx="16" cy="-26" r="3" fill="${INK}"/>`
      :`<path d="M-22,-30 h14 M8,-30 h14" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><path d="M-20,-38 q6,-6 12,0" stroke="${INK}" stroke-width="2.4" fill="none"/>`;
    const mouth=mood==='shout'?`<ellipse cx="0" cy="2" rx="10" ry="12" fill="${INK}"/><ellipse cx="0" cy="8" rx="6" ry="3" fill="${ROSE}"/>`:mood==='shock'?`<ellipse cx="0" cy="2" rx="5" ry="7" fill="${INK}"/>`:`<path d="M-6,2 q6,-4 12,0" stroke="${INK}" stroke-width="2.4" fill="none"/>`;
    return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" filter="url(#wob)">`+
      `<path d="${wob(rectPts(-46,-74,92,150,14),1.2,true)}" fill="#fbf6ea" stroke="${INK}" stroke-width="2.8"/>`+bars(-34,30,66,3,12,4)+
      `<path d="M-56,-84 h112 a10,10 0 0 1 0,20 h-112 a10,10 0 0 1 0,-20Z" fill="#e8dcc3" stroke="${INK}" stroke-width="2.6"/><path d="M-56,74 h112 a10,10 0 0 1 0,20 h-112 a10,10 0 0 1 0,-20Z" fill="#e8dcc3" stroke="${INK}" stroke-width="2.6"/>`+
      eyes+`<circle cx="16" cy="-30" r="12" fill="none" stroke="${GOLD}" stroke-width="2.6"/><path d="M28,-28 q8,20 2,40" stroke="${GOLD}" stroke-width="1.4" fill="none"/>`+
      `<path d="M0,-12 C-10,-20 -22,-14 -30,-4 C-24,-12 -14,-12 0,-6 C14,-12 24,-12 30,-4 C22,-14 10,-20 0,-12Z" fill="${INK}"/>`+mouth+
      thick('M46,-10 C66,-14 74,-30 78,-44',5,'#fbf6ea')+`<path d="M78,-44 L96,-96 Q100,-78 84,-40Z" fill="${BONE}" stroke="${INK}" stroke-width="2"/><path d="M80,-46 l-4,10" stroke="${INK}" stroke-width="3"/>`+
      thick('M-46,-10 C-64,-6 -70,8 -76,22',5,'#fbf6ea')+`</g>`},
  tag:(x,y,s=1,r=0,text='GOOD GIRL',str=60)=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0,${-str} Q6,${-str/2} 0,-30" stroke="${INK}" stroke-width="1.6" fill="none"/><path d="${wob([[-62,-30],[54,-30],[70,-8],[54,16],[-62,16]],1,true)}" fill="#fbf6ea" stroke="${INK}" stroke-width="2.6" filter="url(#wob)"/><circle cx="50" cy="-8" r="4" fill="none" stroke="${INK}" stroke-width="2"/><text x="-4" y="0" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="17" font-style="italic" fill="${INK}">${text}</text></g>`,
  word:(x,y,size,text,col=INK,r=0,anchor='middle',style='italic')=>`<text x="${x}" y="${y}" transform="rotate(${r} ${x} ${y})" text-anchor="${anchor}" font-family="Georgia,'Times New Roman',serif" font-size="${size}" font-style="${style}" fill="${col}">${text}</text>`,
  bigcard:(x,y,s=1,r=0,num='0',title='THE FOOL',inner='',fill=BONE)=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="${wob(rectPts(-90,-135,180,270,20),1.2,true)}" fill="${INK}" opacity=".4" transform="translate(6 8)"/><path d="${wob(rectPts(-90,-135,180,270,20),1.2,true)}" fill="${fill}" stroke="${INK}" stroke-width="3.4" filter="url(#wob)"/><rect x="-78" y="-123" width="156" height="246" rx="8" fill="none" stroke="${GOLD}" stroke-width="3"/>${inner}<path d="M-78,92 h156" stroke="${GOLD}" stroke-width="2"/>${K.word(0,-100,20,num,INK,0,'middle','normal')}${K.word(0,114,17,title,INK,0,'middle','normal')}</g>`
};

const GP={
  ward:{paper:'#e9e2d3',a:'#b9c2b0',b:'#d9c7a8',c:'#a7a0b8',dark:'#3d3348'},
  night:{paper:'#2a1830',a:'#4a2b63',b:'#6a1a35',c:'#3b2a55',dark:NIGHT},
  candle:{paper:'#3a2230',a:'#b8612a',b:'#6a1a35',c:'#d9a441',dark:NIGHT},
  blood:{paper:'#5a1428',a:'#8e1f3d',b:'#2b1733',c:'#cf6f8a',dark:NIGHT},
  lilac:{paper:'#d9cde6',a:'#b9a3d6',b:'#cf6f8a',c:'#d9a441',dark:'#3b2a55'},
  bone:{paper:'#efe4cf',a:'#cf6f8a',b:'#b9a3d6',c:'#d9a441',dark:'#2b1733'}
};

function bg(type,W,H,seed,pal,o={}){
  R=rng(seed);const {paper,a,b,c,dark}=pal;let s=`<rect width="${W}" height="${H}" fill="${o.base||paper}"/>`;
  const grain=`<rect width="${W}" height="${H}" fill="${CREAM}" opacity="${o.grain??.45}" filter="url(#grain)"/>`;
  const fx=o.fx??W*.5,fy=o.fy??H*.5;
  switch(type){
    case 'wash':
      s+=grain;[[.25,.3,.5,.4,a,.45],[.8,.75,.45,.4,b,.5],[.75,.2,.3,.3,c,.4],[.2,.85,.35,.3,a,.25]].forEach(([x,y,rx,ry,col,op])=>s+=wash(blob(W*x,H*y,W*rx,H*ry,22,.16),col,op));
      for(let i=0;i<6;i++)s+=shade(R()*W*.9,R()*H*.9,60+R()*120,8+R()*14,6,i%2?a:b,.4,-25+R()*50);break;
    case 'pencil':
      s+=grain;for(let i=0;i<Math.round(W*H/9000);i++)s+=shade(R()*W*.95-20,R()*H*.95,70+R()*160,8+R()*18,5+R()*3,[a,b,c][i%3],.35+R()*.25,-30+R()*60,1.1+R()*.6);
      for(let i=0;i<Math.round(W*H/40000)+3;i++)s+=curl(R()*W,R()*H,6+R()*8,7,a,.5,1.6);break;
    case 'halftone':
      s+=grain+`<mask id="m${seed}"><rect width="${W}" height="${H}" fill="#000"/><circle cx="${fx}" cy="${fy}" r="${Math.max(W,H)*.75}" fill="url(#fadeR)"/></mask><rect width="${W}" height="${H}" fill="url(#dots)" opacity=".28" mask="url(#m${seed})"/>`;
      s+=wash(blob(fx,fy,W*.32,H*.3,20,.2),a,.35);break;
    case 'speed':
      s+=`<rect width="${W}" height="${H}" fill="${o.base||paper}"/>`;
      for(let i=0;i<70;i++){const an=R()*Math.PI*2,r1=Math.min(W,H)*(.22+R()*.12),r2=Math.max(W,H);const w=1+R()*5;s+=`<path d="M${(fx+Math.cos(an)*r1).toFixed(0)},${(fy+Math.sin(an)*r1).toFixed(0)} L${(fx+Math.cos(an)*r2).toFixed(0)},${(fy+Math.sin(an)*r2).toFixed(0)}" stroke="${i%4?dark:a}" stroke-width="${w.toFixed(1)}" stroke-linecap="round" opacity="${(.35+R()*.5).toFixed(2)}" filter="url(#pencil)"/>`}
      s+=grain;break;
    case 'burst':
      for(let i=0;i<24;i++){if(i%2)continue;const a1=i/24*Math.PI*2,a2=(i+1)/24*Math.PI*2,r=Math.max(W,H)*1.2;s+=`<path d="M${fx},${fy} L${fx+Math.cos(a1)*r},${fy+Math.sin(a1)*r} L${fx+Math.cos(a2)*r},${fy+Math.sin(a2)*r}Z" fill="${a}" opacity=".55"/>`}
      s+=grain+`<rect width="${W}" height="${H}" fill="url(#hW)" opacity=".18"/>`;break;
    case 'screentone':
      s+=`<rect width="${W}" height="${H}" fill="url(#hK)" opacity=".22"/>`+`<path d="${blob(fx,fy,W*.36,H*.42,20,.08)}" fill="${o.spot||CREAM}" opacity=".85" filter="url(#wob)"/>`+grain;break;
    case 'stars':
      s+=washN(blob(W*.3,H*.3,W*.5,H*.5,24,.14),PLUM,.9)+washN(blob(W*.8,H*.7,W*.5,H*.5,24,.14),PLUM,.8)+washN(blob(W*.5,H*.5,W*.3,H*.3,20,.2),VIOLET,.5);
      for(let i=0;i<Math.round(W*H/5000);i++)s+=`<circle cx="${(R()*W)|0}" cy="${(R()*H)|0}" r="${(.8+R()*1.7).toFixed(1)}" fill="${i%5?GOLD:CREAM}" opacity="${(.45+R()*.5).toFixed(2)}"/>`;
      for(let i=0;i<8;i++)s+=sparkle(R()*W,R()*H,3+R()*5,i%2?GOLD:AMBER);
      for(let i=0;i<6;i++)s+=shade(R()*W*.9,R()*H*.9,80+R()*120,8+R()*10,7,'#8a4f86',.4,-20+R()*40,1.1);break;
    case 'scribble':
      for(let i=0;i<Math.round(W*H/6000);i++){const p=[];let x=R()*W,y=R()*H;for(let k=0;k<9;k++){x+=j(60);y+=j(40);p.push([x,y])}s+=`<path d="${wob(p,3)}" fill="none" stroke="${[a,b,c][i%3]}" stroke-width="${(1+R()*2.2).toFixed(1)}" opacity="${(.35+R()*.4).toFixed(2)}" stroke-linejoin="round" filter="url(#pencil)"/>`}
      s+=grain;break;
    case 'embers':
      s+=wash(blob(W*.5,H*.85,W*.6,H*.35,20,.2),a,.7)+wash(blob(W*.2,H*.3,W*.3,H*.3,20,.2),b,.5)+wash(blob(W*.85,H*.25,W*.3,H*.3,20,.2),c,.4);
      for(let i=0;i<60;i++){const x=R()*W,y=R()*H;s+=`<path d="M${x.toFixed(0)},${y.toFixed(0)} l${j(4).toFixed(1)},${(-4-R()*8).toFixed(1)}" stroke="${i%3?GOLD:AMBER}" stroke-width="${(1.5+R()*2.5).toFixed(1)}" stroke-linecap="round" opacity="${(.5+R()*.5).toFixed(2)}"/>`}s+=grain;break;
    case 'glow':
      s+=grain+wash(blob(W*.5,H*.3,W*.7,H*.5,22,.15),a,.45)+wash(blob(W*.15,H*.8,W*.35,H*.35,22,.15),b,.5);break;
  }
  return s;
}

function panelSVG(W,H,seed,inner){R=rng(seed+500);const clip=wob(rectPts(8,8,W-16,H-16,24),1.6,true);return `<clipPath id="c${seed}"><path d="${clip}"/></clipPath><g clip-path="url(#c${seed})">${inner}</g>${frame(6,6,W-12,H-12,{sw:4.6,amp:2,stroke:INK})}`}

let DEFS='';
function initKit(){DEFS=`<defs>${FILTERS}${PATTERNS}${MORE_PATTERNS}${buildChars()}${buildKhushi()}</defs>`}

/* Paint an SVG string once into a bitmap canvas, or return an object URL for a sprite <img> */
function paint(canvas,vw,vh,inner,cssW,cssH,par='xMidYMid meet'){
  const d=Math.min(window.devicePixelRatio||1,1.5),pw=Math.max(1,Math.round(cssW*d)),ph=Math.max(1,Math.round(cssH*d));
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${pw}" height="${ph}" viewBox="0 0 ${vw} ${vh}" preserveAspectRatio="${par}">${DEFS}${inner}</svg>`;
  const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
  const img=new Image();img.src=url;
  return img.decode().catch(()=>new Promise(r=>{if(img.complete&&img.naturalWidth)r();else{img.onload=r;img.onerror=r}})).then(()=>{canvas.width=pw;canvas.height=ph;canvas.getContext('2d').drawImage(img,0,0,pw,ph);URL.revokeObjectURL(url);return canvas});
}

async function paintSprite(vx,vy,vw,vh,inner,scale=1.5){
  const pw=Math.max(1,Math.round(vw*scale)),ph=Math.max(1,Math.round(vh*scale));
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${pw}" height="${ph}" viewBox="${vx} ${vy} ${vw} ${vh}">${DEFS}${inner}</svg>`;
  const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
  const img=new Image();img.src=url;
  await img.decode().catch(()=>new Promise(r=>{if(img.complete&&img.naturalWidth)r();else{img.onload=r;img.onerror=r}}));
  const c=document.createElement('canvas');c.width=pw;c.height=ph;c.getContext('2d').drawImage(img,0,0,pw,ph);
  URL.revokeObjectURL(url);
  const outUrl=c.toDataURL('image/png');
  return outUrl;
}

function svgURI(vw,vh,inner,par='none'){return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${vw} ${vh}' preserveAspectRatio='${par}'>${inner}</svg>`)}")`}
function letteringCSS(){
  R=rng(42);const r=document.documentElement.style;
  r.setProperty('--paper',svgURI(200,100,`<path d='${wob(rectPts(3,3,194,94,14),1.3,true)}' fill='${BONE}' stroke='${GOLD}' stroke-width='2.6' vector-effect='non-scaling-stroke'/><path d='${wob(rectPts(7,7,186,86,24),1.4,true)}' fill='none' stroke='${GOLD}' stroke-width='.9' opacity='.6' vector-effect='non-scaling-stroke'/>`));
  r.setProperty('--btnart',svgURI(220,74,`<path d='${wob(rectPts(4,4,212,66,16),1.6,true)}' fill='${GOLD}' stroke='${INK}' stroke-width='3.2' vector-effect='non-scaling-stroke'/><path d='${wob(rectPts(8,8,204,58,20),1.4,true)}' fill='none' stroke='${INK}' stroke-width='1.5' vector-effect='non-scaling-stroke'/>`));
}
