"use strict";
const INK = "#1b1210", BLUE = "#3F66B0", BLUE2 = "#2F4B8F", OCHRE = "#E9A93A", MADDER = "#B4251D", CREAM = "#F3E7C9", HAIR = "#15100e", SAFF = "#E8662A", TURM = "#F2B91E", LEAF = "#1F3D26", SLATE = "#8C93A8";
const st = (w = 4) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const VIOLET = "#3D3F7A";
/* ================= DRAWING PARTS ================= */
function leaves(y, n=26, seed=1){
  let s = `<rect x="40" y="40" width="1520" height="${y}" fill="${LEAF}"/>`;
  for(let i=0;i<n;i++){ const x = 60+i*(1480/n)+((i*37*seed)%30), yy = 70+((i*53*seed)%(y-60)), r = (i*47)%60-30;
    s += `<g transform="translate(${x} ${yy}) rotate(${r})"><path d="M0 0C30 -30 70 -10 80 20C50 30 20 20 0 0Z" fill="${i%3?'#3F7A3A':'#2C5A2E'}" stroke="${INK}" stroke-width="2"/><path d="M6 2L66 14" stroke="${INK}" stroke-width="1.6"/></g>`;
    if(i%4===0) s += `<circle cx="${x+30}" cy="${yy+34}" r="9" fill="${MADDER}" stroke="${INK}" stroke-width="2"/>`; }
  return s;
}
function flag(x,y,s=1){ return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0V120" stroke="${INK}" stroke-width="6"/><path d="M0 4C40 -8 70 24 110 8L96 36L110 62C70 78 40 44 0 60Z" fill="${SAFF}" stroke="${INK}" stroke-width="3"/></g>`; }
function shrine(x,y,s=1,fill="#7B7FB5"){
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-130" y="-60" width="260" height="260" fill="${fill}" stroke="${INK}" stroke-width="4"/>
    <path d="M-150 -60C-150 -200 -60 -230 0 -300C60 -230 150 -200 150 -60Z" fill="#9A9FCB" stroke="${INK}" stroke-width="4"/>
    <path d="M0 -300V-350" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="-358" r="12" fill="${TURM}" stroke="${INK}" stroke-width="3"/>
    <path d="M-60 200V60C-60 20 60 20 60 60V200Z" fill="${MADDER}" stroke="${INK}" stroke-width="4"/>
    <g fill="#3D3F7A" stroke="${INK}" stroke-width="2.5">${[-100,100].map(dx=>`<path d="M${dx-18} 120V70C${dx-18} 44 ${dx+18} 44 ${dx+18} 70V120Z"/>`).join("")}</g>
  </g>`;
}
function steps(y0, n, c1="#3D3F7A", c2="#5B5F9E"){ let s=""; for(let i=0;i<n;i++) s += `<rect x="40" y="${y0+i*34}" width="1520" height="34" fill="${i%2?c2:c1}" stroke="${INK}" stroke-width="2"/>`; return s; }

/* Moustache states, the film's mood meter. Profile coordinates: root near (6,24), tip at the front (left). */
function moustache(state, hair){
  const D = {
    normal: "M-58 14C-40 6 -20 8 6 24C-18 32 -40 28 -58 14Z",
    droop1: "M-58 34C-52 14 -20 6 6 24C-16 34 -40 44 -58 34Z",
    droop2: "M-50 90C-62 52 -30 8 6 24C-8 38 -26 52 -34 68C-38 78 -42 86 -50 90Z",
    flat: "M-20 22C-44 22 -56 34 -54 62L-52 140L-46 128L-42 150L-34 128L-28 146L-24 120L-22 70C-18 56 -8 46 6 36L6 24C-4 22 -10 21 -20 22Z",
    curl: "M-68 4C-66 22 -46 40 -18 38C-8 36 0 30 6 24C-16 26 -38 20 -52 12C-58 9 -64 6 -68 4Z",
    proud: "M-88 -14C-90 6 -70 26 -42 26C-24 26 -8 22 6 24C-14 36 -44 40 -66 28C-82 18 -92 2 -88 -14Z"
  };
  const k = (state===true || state===undefined || state==="drip" || !D[state]) ? (state==="drip"?"drip":"normal") : state;
  let s = `<path d="${D[k]}" fill="${hair}" ${st(3)}/>`;
  if(k==="drip") s = `<path d="${D.droop2}" fill="${hair}" ${st(3)}/><path d="M-48 92Q-40 104 -48 114Q-56 104 -48 92Z" fill="#8FD3FF" ${st(2.4)}/>`;
  return s;
}

/* Neel is BLUE (Neel means blue). Miniature profile with one big lotus eye. Ash wears a saffron turban from his first frame. */
function profile(cx, cy, s, o={}){
  const skin = o.skin||BLUE, hair = o.hair||HAIR, deadpan = o.deadpan!==false, flip = o.flip?-1:1;
  const curls = [[10,-62,28],[40,-56,28],[66,-30,26],[-14,-70,26],[30,-80,28],[60,-62,24],[-30,-50,22]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${hair}" ${st(3)}/>`).join("");
  const turban = o.turban?`<path d="M-44 -46C-40 -104 50 -110 62 -46C40 -56 -10 -60 -44 -46Z" fill="${SAFF}" ${st(4)}/><path d="M-40 -56C-10 -70 40 -72 58 -56" fill="none" stroke="${TURM}" stroke-width="7"/>`:"";
  return `<g transform="translate(${cx} ${cy}) scale(${s*flip} ${s})">
    ${o.turban?"":curls}
    <path d="M52 -50C54 -10 56 30 40 62C20 78 -10 74 -30 58C-40 52 -42 40 -46 30L-52 24L-46 16L-60 4L-48 -6L-44 -30C-36 -56 -8 -70 22 -68C40 -66 50 -60 52 -50Z" fill="${skin}" ${st(4)}/>
    ${o.turban?turban:`<path d="M38 -52C20 -76 -20 -64 -40 -40C-30 -52 -6 -58 14 -52C26 -48 34 -44 38 -34Z" fill="${hair}"/>`}
    <ellipse cx="38" cy="2" rx="10" ry="17" fill="${skin}" ${st(3)}/>
    <g><path d="M-40 -14C-30 -30 0 -30 12 -14C0 -4 -30 -2 -40 -14Z" fill="#fff" ${st(3)}/>${o.heart?`<path d="M-26 -4C-44 -16 -41 -29 -33 -29C-29 -29 -26 -26 -26 -23C-26 -26 -23 -29 -19 -29C-11 -29 -8 -16 -26 -4Z" fill="${MADDER}" ${st(2)}/><circle cx="-31" cy="-24" r="2" fill="#fff"/>`:`<circle cx="-26" cy="-15" r="8" fill="${INK}"/><circle cx="-23" cy="-18" r="2.4" fill="#fff"/>`}
      ${deadpan&&!o.brow?`<path d="M-42 -16C-30 -34 2 -34 14 -16L10 -17C0 -26 -30 -26 -38 -17Z" fill="${skin}" stroke="${INK}" stroke-width="3"/>`:`<path d="M30 -48Q38 -30 30 -22Q22 -30 30 -48Z" fill="#8FD3FF" ${st(2.4)}/>`}</g>
    <path class="brow" d="${o.brow?"M-50 -62Q-20 -102 16 -70":`M-48 ${deadpan?-34:-44}Q-20 ${deadpan?-48:-60} 12 ${deadpan?-32:-42}`}" fill="none" stroke="${hair}" stroke-width="9" stroke-linecap="round"/>
    ${o.glasses?`<circle cx="-26" cy="-15" r="19" fill="none" ${st(4)}/><path d="M-7 -15H36" ${st(3)}/>`:""}
    ${o.moustache===false?"":moustache(o.moustache===undefined&&o.smile?"curl":o.moustache,hair)}
    ${o.smile?`<path d="M-54 36C-46 54 -30 52 -20 38" fill="none" ${st(3.4)}/><path d="M-20 38Q-16 36 -14 32" fill="none" ${st(2.4)}/>`:`<path d="M-52 36C-44 42 -34 42 -28 38" fill="none" ${st(3)}/>`}
  </g>`;
}
function frontFace(cx, cy, s, mortified){
  const curls = [[-50,-50,28],[-20,-76,30],[16,-80,31],[50,-54,28],[-8,-56,44],[-62,-18,20],[62,-18,20]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${HAIR}" ${st(3)}/>`).join("");
  const w = mortified, lid = w?0:9;
  return `<g transform="translate(${cx} ${cy}) scale(${s})">${curls}
    <ellipse cx="0" cy="0" rx="62" ry="74" fill="${BLUE}" ${st(5)}/>
    <path d="M-52 -40C-30 -62 30 -62 52 -40C40 -76 -40 -76 -52 -40Z" fill="${HAIR}"/>
    ${[-26,26].map(x=>`<ellipse cx="${x}" cy="-8" rx="17" ry="${w?15:11}" fill="#fff" ${st(3)}/><circle cx="${x+2}" cy="-7" r="7" fill="${INK}"/>${lid?`<path d="M${x-18} -8C${x-12} ${-8-lid} ${x+12} ${-8-lid} ${x+18} -8Z" fill="${BLUE}" ${st(3)}/>`:""}`).join("")}
    <path d="M-46 ${w?-44:-30}Q-26 ${w?-56:-42} -6 ${w?-42:-28}M6 ${w?-42:-28}Q26 ${w?-56:-42} 46 ${w?-44:-30}" fill="none" stroke="${HAIR}" stroke-width="9" stroke-linecap="round"/>
    <path d="M0 26C-24 12 -52 22 -62 12C-58 34 -30 40 0 34C30 40 58 34 62 12C52 22 24 12 0 26Z" fill="${HAIR}" ${st(3)}/>
    <path d="M-10 46Q0 ${w?58:50} 10 46" fill="none" ${st(3.5)}/>
    ${w?`<path d="M54 -52Q62 -30 54 -22Q46 -30 54 -52Z" fill="#8FD3FF" ${st(2.5)}/>`:""}</g>`;
}
function pavilion(o={}){
  const NOD=[[0,0],[16,2],[26,-3],[38,-6],[50,-8]][o.nod||0];
  const garland = Array.from({length:13},(_,i)=>{const t=i/12,x=-96+t*192,y=70+Math.sin(t*Math.PI)*58; return `<circle cx="${x}" cy="${y}" r="12" fill="${i%2?SAFF:TURM}" ${st(2.5)}/>`;}).join("");
  return `<g>
    <path d="M520 720V330C520 220 640 170 800 170C960 170 1080 220 1080 330V720Z" fill="${BLUE2}" ${st(5)}/>
    <path d="M550 720V340C550 250 650 205 800 205C950 205 1050 250 1050 340V720Z" fill="${MADDER}" ${st(4)}/>
    <g fill="${TURM}" ${st(3)}>${[0,1,2,3,4,5].map(i=>`<circle cx="${590+i*84}" cy="290" r="14"/>`).join("")}</g>
    <path d="M800 170V90" ${st(6)}/><path d="M690 100C700 40 900 40 910 100Z" fill="${SAFF}" ${st(5)}/><circle cx="800" cy="34" r="12" fill="${TURM}" ${st(3)}/>
    <rect x="470" y="690" width="660" height="60" fill="${TURM}" ${st(5)}/>
    <path d="M610 700L640 600H960L990 700Z" fill="${SAFF}" ${st(5)}/>
    <g transform="translate(800 440)">
      <path d="M-140 160C-140 80 -90 40 0 40C90 40 140 80 140 160V250H-140Z" fill="#17141c" ${st(5)}/>
      <path d="M-30 40L0 180L30 40Z" fill="#fff" ${st(3)}/><path d="M-8 64L8 64L14 180L0 204L-14 180Z" fill="#17141c" ${st(3)}/>
      <path d="M-76 56L-30 40L0 180L-66 144Z" fill="#101018" ${st(3)}/><path d="M76 56L30 40L0 180L66 144Z" fill="#101018" ${st(3)}/>
      ${garland}
      <g transform="translate(108 ${(o.glint||o.water)?206:214}) scale(${(o.glint||o.water)?1.7:1})"><ellipse rx="32" ry="22" fill="${BLUE}" ${st(4)}/><circle cx="-4" cy="-6" r="18" fill="#E6E9F0" ${st(4)}/><circle cx="-4" cy="-6" r="12" fill="#fff" ${st(2)}/>${o.water===1?`<path d="M-16 -6A12 12 0 0 0 8 -6Z" fill="#8FD3FF"/><path d="M-16 -6Q-10 -9 -4 -6T8 -6" fill="none" stroke="${INK}" stroke-width="1.6"/>`:o.water>=2?`<circle cx="-4" cy="-6" r="12" fill="#8FD3FF" ${st(2)}/><path d="M-13 -9Q-8 -12 -4 -9T5 -9" fill="none" stroke="#fff" stroke-width="2"/>`:""}<path d="M-4 -6V-14M-4 -6H2" ${st(2.5)}/>${o.glint?`<path d="M26 -40L31 -24L47 -19L31 -14L26 2L21 -14L5 -19L21 -24Z" fill="${CREAM}" ${st(3)}/><path d="M-30 -30L-42 -40M-4 -36L-4 -52M-30 18L-44 26M30 20L42 30" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`:""}</g>
    </g>
    <g id="neelHead" style="transform-origin:800px 430px;transform:translateY(${NOD[0]}px) rotate(${NOD[1]}deg)">${profile(808,350,1.25,{flip:true,moustache:o.moustache,brow:o.brow})}</g>
  </g>`;
}
function ashBow(x, y, s=1){
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="8" rx="170" ry="14" fill="#000" opacity=".22"/>
    <path d="M-50 0V-120M60 0V-120" stroke="${OCHRE}" stroke-width="26" stroke-linecap="round"/>
    <path d="M-70 -110C-60 -190 -20 -200 40 -200C130 -200 150 -150 140 -100C120 -90 60 -105 -10 -100Z" fill="url(#robepat)" ${st(5)}/>
    <path d="M-80 -120C-130 -118 -150 -100 -150 -70" fill="none" stroke="${CREAM}" stroke-width="40" stroke-linecap="round"/>
    <g transform="translate(-170 -56) scale(.62)">${profile(0,0,1,{skin:OCHRE,glasses:true,heart:true,deadpan:false,hair:"#3a2a1a",turban:true,moustache:false})}</g>
    <rect x="-270" y="-26" width="120" height="30" rx="14" fill="${CREAM}" ${st(4)}/><path d="M-258 -18H-163M-258 -8H-163" stroke="${MADDER}" stroke-width="3"/>
    <path d="M-120 -90Q-150 -50 -190 -22" fill="none" stroke="${CREAM}" stroke-width="18" stroke-linecap="round"/>
  </g>`;
}
function warriorBent(x, y, s, face){
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="20" cy="8" rx="160" ry="14" fill="#000" opacity=".22"/>
    <path d="M-30 0V-130M60 0V-130" stroke="${OCHRE}" stroke-width="40" stroke-linecap="round"/>
    <path d="M-60 -150C-60 -240 0 -260 80 -250C150 -240 150 -170 120 -140Z" fill="${OCHRE}" ${st(5)}/>
    <path d="M-60 -150C-90 -150 -150 -130 -160 -60" fill="none" stroke="${OCHRE}" stroke-width="56" stroke-linecap="round"/>
    <path d="M-110 -150Q-150 -100 -160 -64" fill="none" stroke="${MADDER}" stroke-width="12" stroke-linecap="round"/>
    <path d="M40 -250C100 -250 140 -200 140 -150L120 -100C80 -90 20 -100 -10 -120Z" fill="${SAFF}" ${st(5)}/>
    <path d="M40 -245C100 -245 138 -205 138 -160" fill="none" stroke="${TURM}" stroke-width="12"/>
    <g class="face">${face}</g>
  </g>`;
}
function striker(x, y, s, id){
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="8" rx="80" ry="12" fill="#000" opacity=".22"/>
    <path d="M-26 0V-150M26 0V-150" stroke="${OCHRE}" stroke-width="34" stroke-linecap="round"/>
    <path d="M-60 -150H60L50 -260H-50Z" fill="${MADDER}" ${st(5)}/>
    <path d="M-50 -260C-60 -330 60 -330 50 -260Z" fill="${OCHRE}" ${st(5)}/>
    ${profile(0,-318,.62,{skin:OCHRE,glasses:true,deadpan:false,hair:"#3a2a1a",turban:true,moustache:false})}
    <g id="stick${id}" style="transform-origin:46px -240px;transform:rotate(-62deg)" class="hit-stick">
      <path d="M46 -240L150 -430" stroke="#6B4A3A" stroke-width="16" stroke-linecap="round"/><path d="M46 -240L150 -430" stroke="${TURM}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="46" cy="-240" r="17" fill="${OCHRE}" ${st(4)}/>
    </g>
  </g>`;
}
function gate(open, go={}){
  const door = side => { const x0 = side<0?560:800; const o = open?"scale(.12, 1)":"scale(1, 1)";
    return `<g id="door${side<0?'L':'R'}" style="transform-origin:${side<0?560:1040}px 560px;transform:${o};transition:transform .8s steps(8)">
      <rect x="${x0}" y="270" width="240" height="430" fill="${MADDER}" ${st(5)}/>
      <rect x="${x0+20}" y="296" width="200" height="170" rx="6" fill="${TURM}" ${st(4)}/><rect x="${x0+20}" y="490" width="200" height="170" rx="6" fill="${TURM}" ${st(4)}/>
      <circle cx="${x0+120}" cy="381" r="34" fill="${BLUE2}" ${st(4)}/><circle cx="${x0+120}" cy="575" r="34" fill="${BLUE2}" ${st(4)}/>
      <circle cx="${x0+(side<0?205:35)}" cy="480" r="14" fill="${BLUE}" ${st(4)}/></g>`; };
  return `<g>
    <path d="M520 700V340C520 220 680 160 800 160C920 160 1080 220 1080 340V700Z" fill="#232957" ${st(6)}/>
    <g id="inside">${!go.crowd?"":[620,700,780,860,940,1020].map((x,i)=>`<g transform="translate(${x} 690)" fill="${OCHRE}" ${st(3)}><ellipse cy="-108" rx="28" ry="32"/><path d="M-40 0C-40 -68 40 -68 40 0Z"/><path d="M-32 -50L${i%2?-60:-54} -112M32 -50L${i%2?60:54} -112" fill="none" stroke="${OCHRE}" stroke-width="15"/></g>`).join("")}</g>
    ${door(-1)}${door(1)}
    <path d="M500 700V340C500 190 670 130 800 130C930 130 1100 190 1100 340V700" fill="none" stroke="${TURM}" stroke-width="24"/>
    <path d="M500 700V340C500 190 670 130 800 130C930 130 1100 190 1100 340V700" fill="none" ${st(5)}/>
  </g>`;
}

function hallBase(people){ return `
    <rect x="40" y="40" width="1520" height="820" fill="${MADDER}"/>
    ${leaves(190,24,1)}
    <g fill="none" stroke="${TURM}" stroke-width="10">${[0,1,2,3,4].map(i=>`<path d="M40 ${240+i*90}H1560"/>`).join("")}</g>
    <rect x="40" y="740" width="1520" height="120" fill="url(#floorpat)" ${st(4)}/>
    ${[190,1410].map(x=>`<g><rect x="${x-32}" y="190" width="64" height="550" fill="${BLUE2}" ${st(5)}/><g fill="${TURM}" ${st(3)}>${[0,1,2,3,4].map(i=>`<circle cx="${x}" cy="${240+i*100}" r="15"/>`).join("")}</g></g>`).join("")}
${people?`<g fill="${OCHRE}" ${st(3)}>${[290,380,1220,1310].map(x=>`<g transform="translate(${x} 740)"><ellipse cy="-100" rx="32" ry="38"/><path d="M-46 0C-46 -64 46 -64 46 0Z"/></g>`).join("")}</g>`:""}
    `; }

function hallLight(){
  let dust = "";
  for(let i=0;i<14;i++){ const t=(i*0.071+0.05)%1, w=(i*37%100)/100-.5;
    const x = 250+t*560+w*150*(0.4+t), y = 90+t*640+((i*53)%40)-20;
    dust += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${2+(i%3)*1.2}" fill="${CREAM}" opacity="${(.5+(i%4)*.12).toFixed(2)}"/>`; }
  return `<g id="light">
    <path d="M120 80C120 36 200 36 200 80V150H120Z" fill="${CREAM}" ${st(4)}/>
    <path d="M160 80V150M120 115H200" stroke="${INK}" stroke-width="3"/>
    <path d="M120 150H200L1010 740H640Z" fill="${CREAM}" opacity=".35"/>${dust}</g>`;
}
function hangings(){
  const cloth = x => `<g transform="translate(${x} 250)"><path d="M-30 0H30" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M-26 3H26V150L0 188L-26 150Z" fill="${SAFF}" ${st(4)}/><path d="M-26 28H26" stroke="${TURM}" stroke-width="10"/><circle cx="0" cy="84" r="13" fill="${TURM}" ${st(3)}/><circle cx="0" cy="84" r="5" fill="${MADDER}"/><path d="M-26 128H26" stroke="${CREAM}" stroke-width="6" stroke-dasharray="6 6"/></g>`;
  let bunt = `<path d="M240 262Q800 330 1360 262" fill="none" ${st(4)}/>`;
  for(let i=0;i<13;i++){ const t=(i+.5)/13, x=240+t*1120, y=262+Math.sin(t*Math.PI)*34*1.1+4; bunt += `<path d="M${(x-18).toFixed(1)} ${y.toFixed(1)}L${(x+18).toFixed(1)} ${y.toFixed(1)}L${x.toFixed(1)} ${(y+44).toFixed(1)}Z" fill="${i%2?TURM:SAFF}" ${st(3)}/>`; }
  return `<g id="hangings">${bunt}${[300,390,1210,1300].map(cloth).join("")}${flag(120,270,.7)}${flag(1480,270,.7)}</g>`;
}
function starryScene(){
  const four = (x,y,r) => `<path d="M${x} ${y-r}Q${x} ${y} ${x+r} ${y}Q${x} ${y} ${x} ${y+r}Q${x} ${y} ${x-r} ${y}Q${x} ${y} ${x} ${y-r}Z" fill="${TURM}"/>`;
  let stars = "";
  for(let i=0;i<40;i++){ const x = 70+((i*257+31)%1460), y = 60+((i*139+17)%560);
    stars += (i%4===0) ? four(x,y,9+(i%3)*3) : `<circle cx="${x}" cy="${y}" r="${1.6+(i%3)*.9}" fill="${TURM}"/>`; }
  return `<rect x="40" y="40" width="1520" height="820" fill="${VIOLET}"/>
    <g id="slot-back"></g>
    ${stars}
    <rect x="40" y="690" width="1520" height="170" fill="#4F5280"/>
    ${gate(false)}
    ${steps(700,5,"#5B5F8C","#4A4D7C")}`;
}
function creditsScene(){
  return `<rect x="40" y="40" width="1520" height="820" fill="${MADDER}"/>
    ${leaves(190,24,1)}
    <path d="M40 240H1560" stroke="${TURM}" stroke-width="10"/>
    <text x="800" y="170" text-anchor="middle" font-family="Yatra One" font-size="130" fill="${CREAM}" stroke="${INK}" stroke-width="12" paint-order="stroke">NEELBALI</text>
    <text x="800" y="296" text-anchor="middle" font-family="Rozha One" font-size="34" fill="${CREAM}" stroke="${INK}" stroke-width="6" paint-order="stroke">a birthday film for Neel</text>`;
}
/* ================= SCENES ================= */
const SCENES = {
  dawn(o={}){ return `
    <rect x="40" y="40" width="1520" height="820" fill="url(#sky)"/>
    <path d="M470 700V340C470 150 660 80 800 80C940 80 1130 150 1130 340V700Z" fill="${TURM}" opacity=".22"/>
    <path d="M440 700V340C440 120 650 40 800 40C950 40 1160 120 1160 340V700Z" fill="${TURM}" opacity=".12"/>
    <g id="slot-back"></g>
    <g fill="${SLATE}" ${st(3)}><path d="M40 560V470H150V400H230V470H330V560Z"/><path d="M1270 560V450H1360V380H1440V450H1560V560Z"/></g>
    ${shrine(250,600,.9)}${shrine(1350,600,.9,"#6E72AA")}
    ${flag(330,170)}${flag(1260,190)}
    ${gate(!!o.open,{crowd:!!o.crowd})}
    ${steps(700,5)}`; },
  hall(){ return hallBase(true); },
  emptyHall(){ return hallBase(false).replace("/>", "/><g id=\"slot-back\"></g>") + hangings() + hallLight(); },
  starrySky(){ return starryScene(); },
  credits(){ return creditsScene(); },
  arena(o={}){ return `
    <rect x="40" y="40" width="1520" height="820" fill="url(#sky)"/>
    <g fill="${SLATE}" ${st(3)}><path d="M40 520V440H170V360H250V440H400V520Z"/><path d="M1180 520V430H1290V350H1380V430H1560V520Z"/></g>
    ${shrine(250,560,1.0)}${shrine(1340,560,1.0,"#6E72AA")}${shrine(800,600,.8,"#8A8EC4")}
    ${flag(360,100,1.1)}${flag(1250,120,1.1)}${flag(830,150,.8)}
    ${steps(640,7)}
    <g id="back" opacity=".95">${o.back===false?"":[130,350,570,790,1010,1230,1450].map(x=>warriorBent(x,660,.42,frontFace(-120,-100,.46,false))).join("")}</g>
    <g id="front"></g>
    `; },
};
function frontRow(mortified=false){
  const xs=[330,640,950,1260]; let s="";
  xs.forEach((x,i)=>{ s += `<g id="pair${i}">${warriorBent(x,800,.95,frontFace(-150,-96,.88,mortified))}${striker(x+240,800,.95,i)}</g>`; });
  return s;
}


/* ================= PARTS FOR THE PRESS ENGINE =================
   Every part is KIT.name(x, y, s, opts) -> SVG string. The engine calls it as KIT.name(0, 0, 1, opts)
   and moves it with a CSS transform. States arrive as opts.state (a string) or as plain option keys. */
const KIT = {
  sun: (x,y,s,o={}) => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="120" fill="${MADDER}" ${st(5)}/><circle r="82" fill="${SAFF}"/></g>`,
  birds: (x,y,s,o={}) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" ${st(4)}><path d="M300 150q20 -22 40 0q20 -22 40 0M520 110q16 -18 32 0q16 -18 32 0M1180 140q20 -22 40 0q20 -22 40 0"/></g>`,
  titleCard: (x,y,s,o={}) => `<g transform="translate(${x} ${y}) scale(${s})"><text text-anchor="middle" font-family="Yatra One" font-size="120" fill="${CREAM}" stroke="${INK}" stroke-width="12" paint-order="stroke">NEELBALI</text></g>`,
  /* Neel on the throne. opts: nod 0..4 (head sinks), brow (true = eyebrow up), moustache (state name, see S5) */
  throneNeel: (x,y,s,o={}) => `<g transform="translate(${x} ${y}) scale(${s})">${pavilion(o)}</g>`,
  /* A line of visitors (ochre silhouettes) in front of the throne. opts: n = how many */
  visitors: (x,y,s,o={}) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${OCHRE}" ${st(3)}>${Array.from({length:o.n||1},(_,i)=>`<g transform="translate(${i*(o.gap||180)} 0)"><ellipse cy="-108" rx="28" ry="32"/><path d="M-40 0C-40 -68 40 -68 40 0Z"/><path d="M-32 -50L-54 -100M32 -50L54 -100" fill="none" stroke="${OCHRE}" stroke-width="15"/><path d="M-26 -126C-20 -150 20 -150 26 -126Z" fill="${i%2?SAFF:MADDER}"/></g>`).join("")}</g>`,
  /* The gate seen small at the end of the hall. opts.state: open | shut */
  hallGate: (x,y,s,o={}) => `<g transform="translate(${x-800*s} ${y-700*s}) scale(${s})">${gate(o.state!=="shut")}</g>`,
};

/* Ash bowing with his scroll (existing drawing, faces left in the bow). */
KIT.sunStreaks = (x,y,s,o={}) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#FFE9A0" opacity=".5"><path d="M720 560L800 560L690 858L580 858Z"/><path d="M930 600L990 600L900 858L810 858Z"/><path d="M1130 640L1180 640L1130 858L1050 858Z"/></g>`;
KIT.ashBow = (x, y, s, o = {}) => ashBow(x, y, s);
