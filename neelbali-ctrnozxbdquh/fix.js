/* F1.js */
/* F1.js: moustache flat + curl, bigger raised eyebrow (frontFace raise, drumLine brows). Loaded after parts.js. */

function moustache(state, hair){
  const D = {
    normal: "M-58 14C-40 6 -20 8 6 24C-18 32 -40 28 -58 14Z",
    droop1: "M-58 34C-52 14 -20 6 6 24C-16 34 -40 44 -58 34Z",
    droop2: "M-56 24C-36 10 -8 12 10 24C20 30 26 38 24 46C16 44 8 38 -2 36C-14 34 -28 40 -36 48C-44 54 -54 52 -56 44C-58 36 -58 30 -56 24Z",
    /* flat: a heavy walrus moustache, sagging at both ends and resting on the cheek; lowest point stays above the chin */
    flat: "M-52 26C-34 12 -6 12 14 22C30 30 40 44 36 58C30 62 22 56 14 48C4 40 -10 40 -24 46C-34 52 -42 60 -50 58C-58 54 -58 42 -54 34C-54 30 -53 28 -52 26Z",
    /* curl: the tip sweeps forward and up into a clear hook */
    curl: "M-64 14C-76 8 -90 -2 -92 -20C-92 -34 -78 -40 -70 -32C-64 -26 -68 -16 -76 -16C-72 -8 -62 0 -50 6C-34 12 -14 14 6 24C-14 36 -44 42 -64 30Z",
    proud: "M-88 -14C-90 6 -70 26 -42 26C-24 26 -8 22 6 24C-14 36 -44 40 -66 28C-82 18 -92 2 -88 -14Z"
  };
  const k = (state===true || state===undefined || state==="drip" || !D[state]) ? (state==="drip"?"drip":"normal") : state;
  let s = `<path d="${D[k]}" fill="${hair}" ${st(3)}/>`;
  if(k==="drip") s = `<path d="${D.droop2}" fill="${hair}" ${st(3)}/><path d="M-48 56Q-41 66 -48 75Q-55 66 -48 56Z" fill="#8FD3FF" ${st(2.4)}/>`;
  return s;
}

function frontFace(cx, cy, s, mortified, raise){
  const curls = [[-50,-50,28],[-20,-76,30],[16,-80,31],[50,-54,28],[-8,-56,44],[-62,-18,20],[62,-18,20]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${HAIR}" ${st(3)}/>`).join("");
  const w = mortified, lid = w?0:9;
  /* raise: the right brow is lifted high into a big arch (forehead cleared of hair), the left stays flat and low */
  const eyes = [-26,26].map(x=>{
    const up = raise && x>0, ry = w?15:(up?17:10), l = up?0:lid;
    return `<ellipse cx="${x}" cy="-8" rx="17" ry="${ry}" fill="#fff" ${st(3)}/><circle cx="${x+2}" cy="${up?-6:-7}" r="7" fill="${INK}"/>${l?`<path d="M${x-18} -8C${x-12} ${-8-l} ${x+12} ${-8-l} ${x+18} -8Z" fill="${BLUE}" ${st(3)}/>`:""}`;
  }).join("");
  let brows, patch = "";
  if(raise){
    patch = `<path d="M-6 -36C-2 -56 14 -70 36 -70C52 -68 60 -54 58 -36C44 -26 12 -26 -6 -36Z" fill="${BLUE}"/>`;
    const y0 = w?-8:0;
    brows = `<path d="M-46 ${w?-34:-26}Q-26 ${w?-42:-30} -6 ${w?-32:-20}" fill="none" stroke="${HAIR}" stroke-width="9" stroke-linecap="round"/><path d="M0 -34C8 -62 40 -70 56 -40" fill="none" stroke="${HAIR}" stroke-width="14" stroke-linecap="round"/>`;
  } else {
    brows = `<path d="M-46 ${w?-44:-30}Q-26 ${w?-56:-42} -6 ${w?-42:-28}M6 ${w?-42:-28}Q26 ${w?-56:-42} 46 ${w?-44:-30}" fill="none" stroke="${HAIR}" stroke-width="9" stroke-linecap="round"/>`;
  }
  return `<g transform="translate(${cx} ${cy}) scale(${s})">${curls}
    <ellipse cx="0" cy="0" rx="62" ry="74" fill="${BLUE}" ${st(5)}/>
    <path d="M-52 -40C-30 -62 30 -62 52 -40C40 -76 -40 -76 -52 -40Z" fill="${HAIR}"/>${patch}
    ${eyes}
    ${brows}
    <path d="M0 26C-24 12 -52 22 -62 12C-58 34 -30 40 0 34C30 40 58 34 62 12C52 22 24 12 0 26Z" fill="${HAIR}" ${st(3)}/>
    <path d="M-10 46Q0 ${w?58:50} 10 46" fill="none" ${st(3.5)}/>
    ${w?`<path d="M54 -52Q62 -30 54 -22Q46 -30 54 -52Z" fill="#8FD3FF" ${st(2.5)}/>`:""}</g>`;
}

KIT.drumLine = function (x, y, s, o) {
  o = o || {};
  /* Drawn in absolute frame coordinates: show it with x:0, y:0, s:1. o.view: line (default) | close | low. */
  const hits = o.hit === undefined || o.hit === null ? [] : (Array.isArray(o.hit) ? o.hit : [o.hit]);
  const xs = [330, 640, 950, 1260];
  const burst = (cx, cy, r, n, c1, c2) => {
    let d = "";
    for (let k = 0; k < n * 2; k++) { const a = k / (n * 2) * Math.PI * 2, rr = k % 2 ? r * .55 : r; d += `${k ? "L" : "M"}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`; }
    return `<path d="${d}Z" fill="${c1}" ${st(4)}/><circle cx="${cx}" cy="${cy}" r="${r * .3}" fill="${c2}" ${st(3)}/>`;
  };
  const star = (cx, cy, k) => `<path d="M${cx} ${cy - 15}L${cx + 5} ${cy - 5}L${cx + 15} ${cy}L${cx + 5} ${cy + 5}L${cx} ${cy + 15}L${cx - 5} ${cy + 5}L${cx - 15} ${cy}L${cx - 5} ${cy - 5}Z" fill="${k % 2 ? TURM : CREAM}" ${st(3)}/>`;
  const stars = (cx, cy) => [[-44, -6], [40, -14], [-8, -44], [26, 22], [-34, 24]].map(([dx, dy], k) => star(cx + dx, cy + dy, k)).join("");
  const dreamEyes = `<g transform="translate(0 -318) scale(.62)"><circle cx="-26" cy="-15" r="19.5" fill="${OCHRE}"/><path d="M-42 -10Q-26 -34 -10 -10" fill="none" ${st(4.5)}/><circle cx="-26" cy="-15" r="19" fill="none" ${st(4)}/><path d="M-52 28Q-36 52 -14 32" fill="none" ${st(4)}/></g>`;
  const stickPath = (len, w) => `<path d="M46 -240V${-240 - len}" stroke="${INK}" stroke-width="${w + 5}" stroke-linecap="round"/><path d="M46 -240V${-240 - len}" stroke="#8A5A3A" stroke-width="${w}" stroke-linecap="round"/><path d="M46 -240V${-240 - len}" stroke="${TURM}" stroke-width="4" stroke-linecap="round"/><circle cx="46" cy="-240" r="19" fill="${OCHRE}" ${st(4)}/>`;
  let out = "", outM = "", fx = "", bk = "";
  xs.forEach((wx, i) => {
    const hit = hits.indexOf(i) >= 0, slip = o.slip === i, self = o.selfHit === i, slow = o.slow === i;
    let face = frontFace(-150, -96, .88, !!o.mortified, !!o.brows);
    if (slip) face = `<g transform="translate(40 60) rotate(34 -150 -96)">${face}</g>`;
    if (hit) face = `<g class="puff">${face}<circle cx="-196" cy="-84" r="15" fill="${MADDER}" opacity=".55"/><circle cx="-104" cy="-84" r="15" fill="${MADDER}" opacity=".55"/></g>`;
    let stick;
    if (self) stick = `<g transform="rotate(-22 46 -240)">${stickPath(150, 16)}</g>${stars(-4, -372)}`;
    else if (slow) stick = `<g><animateTransform attributeName="transform" type="rotate" values="-30 46 -240;-8 46 -240;-30 46 -240" dur="2.6s" repeatCount="indefinite"/>${stickPath(440, 16)}</g>`;
    else stick = `<g transform="rotate(${hit ? (o.off ? -150 : -160) : 24} 46 -240)">${stickPath(hit ? 158 : 440, 16)}</g>`;
    const man = `<g transform="translate(${wx + 240} 800) scale(.95)">
    <ellipse cx="0" cy="8" rx="80" ry="12" fill="#000" opacity=".22"/>
    <path d="M-26 0V-150M26 0V-150" stroke="${OCHRE}" stroke-width="34" stroke-linecap="round"/>
    <path d="M-60 -150H60L50 -260H-50Z" fill="${MADDER}" ${st(5)}/>
    <path d="M-50 -260C-60 -330 60 -330 50 -260Z" fill="${OCHRE}" ${st(5)}/>
    ${profile(0, -318, .62, { skin: OCHRE, glasses: true, deadpan: false, hair: "#3a2a1a", turban: true, moustache: false })}
    <path d="M-44 -176Q0 -160 44 -176" fill="none" stroke="${MADDER}" stroke-width="9"/><ellipse cx="6" cy="-108" rx="50" ry="56" fill="${TURM}" ${st(5)}/><ellipse cx="0" cy="-108" rx="42" ry="48" fill="${CREAM}" ${st(4)}/><path d="M0 -146V-70M-34 -108H34" stroke="${INK}" stroke-width="2.5" opacity=".35"/><circle cx="0" cy="-108" r="10" fill="${TURM}" ${st(3)}/>
    ${slow ? dreamEyes : ""}${stick}</g>`;
    if (o.brows) fx += `<text x="${wx - 50}" y="600" font-size="70" fill="${CREAM}" stroke="${INK}" stroke-width="6" paint-order="stroke">!</text>`;
    const dx = wx + 240, dy = 696;
    out += warriorBent(wx, 800, .95, face); outM += man;
    if (hit) {
      const fxp = dx, fyp = dy;
      bk += `<g>${burst(fxp, fyp, 84, 9, TURM, CREAM)}</g>`;
      fx += `<g><circle cx="${fxp}" cy="${fyp}" r="66" fill="none" stroke="${CREAM}" stroke-width="10"/><circle cx="${fxp}" cy="${fyp}" r="66" fill="none" stroke="${TURM}" stroke-width="4"/><circle cx="${fxp}" cy="${fyp}" r="92" fill="none" stroke="${CREAM}" stroke-width="5" opacity=".8"/>
        <text x="${dx + 60}" y="520" text-anchor="middle" font-size="110" fill="${CREAM}" stroke="${INK}" stroke-width="8" paint-order="stroke">${o.off ? "♫♪" : "♪"}</text></g>`;
    }
  });
  let fest = "";
  if (o.fest) {
    for (let k = 0; k < 14; k++) { const fx0 = 90 + k * 108, c = [TURM, MADDER, SAFF, BLUE2][k % 4]; fest += `<path d="M${fx0} 90L${fx0 + 70} 90L${fx0 + 35} 160Z" fill="${c}" ${st(3)}/>`; }
    fest = `<path d="M60 84Q800 140 1540 84" fill="none" ${st(5)}/>${fest}`;
    [[200, 300], [800, 260], [1400, 300]].forEach(([hx, hy]) => { fest += `<path d="M${hx} ${hy + 30}C${hx - 50} ${hy - 10} ${hx - 30} ${hy - 50} ${hx} ${hy - 20}C${hx + 30} ${hy - 50} ${hx + 50} ${hy - 10} ${hx} ${hy + 30}Z" fill="${MADDER}" ${st(3)}/>`; });
  }
  const v = o.view || "line";
  const tf = v === "close" ? "translate(800 800) scale(1.65) translate(-800 -800)" : v === "low" ? "translate(800 860) scale(1.25) translate(-800 -800)" : "";
  const ground = v === "low" ? `<path d="M0 840Q800 780 1600 840V900H0Z" fill="#4a3f6e" ${st(4)}/>` : "";
  return `<g transform="translate(${x} ${y}) scale(${s})">${fest}<g transform="${tf}">${bk}${out}${outM}${fx}</g>${ground}</g>`;
};


/* F2.js */
"use strict";
/* F2.js : (1) a readable deep bow for Ash, (2) a "pat" state for walkingNeel. */

/* ---- 1. ashBow: same footprint (x -270..150, y -200..8), facing left ---- */
function ashBow(x, y, s=1){
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="8" rx="170" ry="14" fill="#000" opacity=".22"/>
    <!-- legs and slippers -->
    <path d="M-20 -4V-100M48 -4V-100" stroke="${INK}" stroke-width="32" stroke-linecap="round"/>
    <path d="M-20 -4V-100M48 -4V-100" stroke="${OCHRE}" stroke-width="24" stroke-linecap="round"/>
    <path d="M-48 2Q-44 -14 -18 -12L-4 2Z M20 2Q24 -14 50 -12L64 2Z" fill="${MADDER}" ${st(3.5)}/>
    <!-- long robe skirt below the fold -->
    <path d="M-30 -165L114 -165L124 -86Q44 -70 -52 -86Z" fill="url(#robepat)" ${st(5)}/>
    <path d="M-52 -86Q44 -70 124 -86L122 -102Q44 -86 -50 -102Z" fill="${TURM}" ${st(3.5)}/>
    <!-- bowed back, straight and level, dotted robe -->
    <path d="M108 -186L-96 -182Q-128 -170 -126 -148Q-124 -126 -96 -122L100 -126Q126 -156 108 -186Z" fill="url(#robepat)" ${st(5.5)}/>
    <!-- saffron sash at the fold of the bow -->
    <path d="M62 -192Q74 -156 64 -122" fill="none" stroke="${INK}" stroke-width="26" stroke-linecap="round"/>
    <path d="M62 -192Q74 -156 64 -122" fill="none" stroke="${SAFF}" stroke-width="18" stroke-linecap="round"/>
    <path d="M-94 -184Q-112 -152 -96 -124" fill="none" stroke="${MADDER}" stroke-width="9" stroke-linecap="round"/>
    <!-- bent neck -->
    <path d="M-108 -146L-140 -126" stroke="${INK}" stroke-width="34" stroke-linecap="round"/>
    <path d="M-108 -146L-140 -126" stroke="${OCHRE}" stroke-width="26" stroke-linecap="round"/>
    <!-- arms hanging forward, holding the scroll low -->
    <path d="M-76 -132Q-96 -78 -166 -46" fill="none" stroke="${INK}" stroke-width="36" stroke-linecap="round"/>
    <path d="M-76 -132Q-96 -78 -166 -46" fill="none" stroke="${CREAM}" stroke-width="28" stroke-linecap="round"/>
    <path d="M-92 -96Q-110 -66 -150 -50" fill="none" stroke="${BLUE2}" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 9"/>
    <!-- head, face down and forward: turban, glasses, heart eye -->
    <g transform="translate(-172 -102) rotate(-16) scale(.74)">${profile(0,0,1,{skin:OCHRE,glasses:true,heart:true,deadpan:false,hair:"#3a2a1a",turban:true,moustache:false})}</g>
    <rect x="-274" y="-58" width="124" height="30" rx="14" fill="${CREAM}" ${st(4)} transform="rotate(-4 -212 -43)"/><path d="M-262 -48H-166M-262 -38H-166" stroke="${MADDER}" stroke-width="3" transform="rotate(-4 -212 -43)"/>
    <circle cx="-166" cy="-44" r="13" fill="${OCHRE}" ${st(3.5)}/>
  </g>`;
}
KIT.ashBow = (x, y, s, o = {}) => ashBow(x, y, s);

/* ---- 2. walkingNeel state "pat": leans in, near arm down and forward, flat palm patting the seat ---- */
const _w = KIT.walkingNeel;
KIT.walkingNeel = function (x, y, s, o) {
  o = o || {};
  if (o.state === "pat") {
    const JK = "#17141c", SH = "#fff", LEAN = 14;
    const leg = (hx) => `<g transform="translate(${hx} -200)"><path d="M0 0V178" stroke="${INK}" stroke-width="50" stroke-linecap="round"/><path d="M0 0V178" stroke="${JK}" stroke-width="38" stroke-linecap="round"/><ellipse cx="12" cy="188" rx="26" ry="11" fill="${INK}"/></g>`;
    const farArm = `<g transform="translate(-44 -288) rotate(-8)"><path d="M0 0V96" stroke="${INK}" stroke-width="34" stroke-linecap="round"/><path d="M0 0V96" stroke="${JK}" stroke-width="26" stroke-linecap="round"/><circle cx="0" cy="138" r="11" fill="${BLUE}" ${st(3)}/></g>`;
    const garland = Array.from({length: 11}, (_, i) => { const t = i / 10, gx = -26 + t * 66, gy = -282 + Math.sin(t * Math.PI) * 50; return `<circle cx="${gx}" cy="${gy}" r="10.5" fill="${i % 2 ? SAFF : TURM}" ${st(2.5)}/>`; }).join("");
    const body = `<path d="M-12 -302L18 -302L18 -266L-12 -266Z" fill="${BLUE}" ${st(3)}/>`
      + `<path d="M-52 -296Q2 -318 56 -294L58 -210Q54 -192 40 -192L-46 -192Q-58 -220 -52 -296Z" fill="${JK}" ${st(4.5)}/>`
      + `<path d="M-8 -304L30 -304L18 -214Z" fill="${CREAM}" ${st(3)}/>`
      + `<path d="M-8 -304L12 -256L-26 -214M30 -304L14 -256L52 -214" fill="none" stroke="${CREAM}" stroke-width="3"/>`
      + `<path d="M12 -298L20 -290L16 -276L22 -238L12 -222L6 -238L10 -276L4 -290Z" fill="${MADDER}" ${st(2.5)}/>`
      + `<path d="M-24 -214L-34 -196M50 -214L44 -196" fill="none" stroke="${CREAM}" stroke-width="2.5"/>`
      + garland;
    /* near arm in absolute coordinates: shoulder (leaned), elbow, wrist, flat palm */
    const Sx = 70, Sy = -273, Ex = 84, Ey = -176, Hx = 178, Hy = -84;
    const arm = `<path d="M${Sx} ${Sy}L${Ex} ${Ey}L${Hx} ${Hy}" fill="none" stroke="${INK}" stroke-width="34" stroke-linejoin="round" stroke-linecap="round"/>`
      + `<path d="M${Sx} ${Sy}L${Ex} ${Ey}L${Hx} ${Hy}" fill="none" stroke="${JK}" stroke-width="26" stroke-linejoin="round" stroke-linecap="round"/>`
      + `<circle cx="${Hx - 8}" cy="${Hy - 16}" r="10" fill="${SLATE}" ${st(2.5)}/><circle cx="${Hx - 8}" cy="${Hy - 16}" r="5.5" fill="${SH}" ${st(1.5)}/>`
      + `<g transform="translate(${Hx + 6} ${Hy + 6}) rotate(8)"><path d="M-14 -9C-6 -14 16 -14 34 -9L40 -4L34 1L38 6L30 10C14 12 -4 12 -14 8Z" fill="${BLUE}" ${st(3)}/><path d="M12 -8L36 -5M10 -2L34 2M8 4L30 8" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/></g>`
      + `<path d="M${Hx + 6} ${Hy - 40}Q${Hx + 30} ${Hy - 56} ${Hx + 52} ${Hy - 40}M${Hx + 22} ${Hy - 66}Q${Hx + 42} ${Hy - 78} ${Hx + 62} ${Hy - 64}" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})">`
      + `<ellipse cx="10" cy="2" rx="120" ry="14" fill="${INK}" opacity=".22"/>`
      + leg(-8) + leg(6)
      + `<g transform="rotate(${LEAN} 0 -200)">${farArm}${body}</g>`
      + arm
      + `<g transform="rotate(${LEAN} 0 -200)">${profile(6, -322, 0.8, {flip: true, moustache: o.moustache, smile: o.smile})}</g>`
      + `</g>`;
  }
  return _w(x, y, s, o);
};

/* F3.js */
/* F3.js: drumLine v3 (F1 + clearer drum strikes, no red cheek dots, faces clear of the drum, view "faces" for the eyebrow gag). Loaded after fix.js. */
KIT.drumLine = function (x, y, s, o) {
  o = o || {};
  /* Drawn in absolute frame coordinates: show it with x:0, y:0, s:1. o.view: line (default) | close | low. */
  const hits = o.hit === undefined || o.hit === null ? [] : (Array.isArray(o.hit) ? o.hit : [o.hit]);
  const xs = [300, 610, 920, 1230];   /* shifted left 30 so the drums keep clear of the frame edge */
  const MX = 280, FX = -195, FS = .84;   /* striker offset from his warrior, Neel face centre and size on the warrior */
  const burst = (cx, cy, r, n, c1, c2) => {
    let d = "";
    for (let k = 0; k < n * 2; k++) { const a = k / (n * 2) * Math.PI * 2, rr = k % 2 ? r * .55 : r; d += `${k ? "L" : "M"}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`; }
    return `<path d="${d}Z" fill="${c1}" ${st(4)}/><circle cx="${cx}" cy="${cy}" r="${r * .3}" fill="${c2}" ${st(3)}/>`;
  };
  const star = (cx, cy, k) => `<path d="M${cx} ${cy - 15}L${cx + 5} ${cy - 5}L${cx + 15} ${cy}L${cx + 5} ${cy + 5}L${cx} ${cy + 15}L${cx - 5} ${cy + 5}L${cx - 15} ${cy}L${cx - 5} ${cy - 5}Z" fill="${k % 2 ? TURM : CREAM}" ${st(3)}/>`;
  const stars = (cx, cy) => [[-44, -6], [40, -14], [-8, -44], [26, 22], [-34, 24]].map(([dx, dy], k) => star(cx + dx, cy + dy, k)).join("");
  const dreamEyes = `<g transform="translate(0 -318) scale(.62)"><circle cx="-26" cy="-15" r="19.5" fill="${OCHRE}"/><path d="M-42 -10Q-26 -34 -10 -10" fill="none" ${st(4.5)}/><circle cx="-26" cy="-15" r="19" fill="none" ${st(4)}/><path d="M-52 28Q-36 52 -14 32" fill="none" ${st(4)}/></g>`;
  const stickPath = (len, w) => `<path d="M46 -240V${-240 - len}" stroke="${INK}" stroke-width="${w + 5}" stroke-linecap="round"/><path d="M46 -240V${-240 - len}" stroke="#8A5A3A" stroke-width="${w}" stroke-linecap="round"/><path d="M46 -240V${-240 - len}" stroke="${TURM}" stroke-width="4" stroke-linecap="round"/><circle cx="46" cy="-240" r="19" fill="${OCHRE}" ${st(4)}/>`;
  let out = "", outM = "", fx = "", bk = "";
  /* a striker (profile, in profile always) with a bigger gold drum disc on his belly; tr places him */
  const manG = (tr, stick, dream) => `<g transform="${tr}">
    <ellipse cx="0" cy="8" rx="80" ry="12" fill="#000" opacity=".22"/>
    <path d="M-26 0V-150M26 0V-150" stroke="${OCHRE}" stroke-width="34" stroke-linecap="round"/>
    <path d="M-60 -150H60L50 -260H-50Z" fill="${MADDER}" ${st(5)}/>
    <path d="M-50 -260C-60 -330 60 -330 50 -260Z" fill="${OCHRE}" ${st(5)}/>
    ${profile(0, -318, .62, { skin: OCHRE, glasses: true, deadpan: false, hair: "#3a2a1a", turban: true, moustache: false })}
    <path d="M-52 -176Q0 -156 52 -176" fill="none" stroke="${MADDER}" stroke-width="9"/><ellipse cx="6" cy="-108" rx="62" ry="68" fill="${TURM}" ${st(5)}/><ellipse cx="6" cy="-108" rx="53" ry="59" fill="${CREAM}" ${st(4)}/><path d="M6 -158V-58M-42 -108H54" stroke="${INK}" stroke-width="2.5" opacity=".35"/><circle cx="6" cy="-108" r="12" fill="${TURM}" ${st(3)}/>
    ${dream}${stick}</g>`;
  xs.forEach((wx, i) => {
    const hit = hits.indexOf(i) >= 0, slip = o.slip === i, self = o.selfHit === i, slow = o.slow === i;
    let face = frontFace(FX, -96, FS, !!o.mortified, !!o.brows);
    if (slip) face = `<g transform="translate(40 60) rotate(34 ${FX} -96)">${face}</g>`;
    if (hit) face = `<g class="puff">${face}</g>`;   /* no red cheek dots: the strike is shown on the drum only */
    let stick;
    if (self) stick = `<g transform="rotate(-22 46 -240)">${stickPath(150, 16)}</g>${stars(-4, -372)}`;
    else if (slow) stick = `<g><animateTransform attributeName="transform" type="rotate" values="-30 46 -240;-8 46 -240;-30 46 -240" dur="2.6s" repeatCount="indefinite"/>${stickPath(440, 16)}</g>`;
    else stick = `<g transform="rotate(${hit ? (o.off ? -150 : -160) : 24} 46 -240)">${stickPath(hit ? 158 : 440, 16)}</g>`;
    const man = manG(`translate(${wx + MX} 800) scale(.95)`, stick, slow ? dreamEyes : "");
    const dx = wx + MX + 6, dy = 696;   /* centre of the drum disc */
    out += warriorBent(wx, 800, .95, face); outM += man;
    if (hit) {
      const fxp = dx, fyp = dy;
      bk += `<g>${burst(fxp, fyp, 96, 9, TURM, CREAM)}</g>`;
      fx += `<g><circle cx="${fxp}" cy="${fyp}" r="76" fill="none" stroke="${CREAM}" stroke-width="10"/><circle cx="${fxp}" cy="${fyp}" r="76" fill="none" stroke="${TURM}" stroke-width="4"/><circle cx="${fxp}" cy="${fyp}" r="90" fill="none" stroke="${CREAM}" stroke-width="5" opacity=".8"/>
        <text x="${dx + 70}" y="520" text-anchor="middle" font-size="110" fill="${CREAM}" stroke="${INK}" stroke-width="8" paint-order="stroke">${o.off ? "♫♪" : "♪"}</text></g>`;
    }
  });
  let fest = "";
  if (o.fest) {
    for (let k = 0; k < 14; k++) { const fx0 = 90 + k * 108, c = [TURM, MADDER, SAFF, BLUE2][k % 4]; fest += `<path d="M${fx0} 90L${fx0 + 70} 90L${fx0 + 35} 160Z" fill="${c}" ${st(3)}/>`; }
    fest = `<path d="M60 84Q800 140 1540 84" fill="none" ${st(5)}/>${fest}`;
    [[200, 300], [800, 260], [1400, 300]].forEach(([hx, hy]) => { fest += `<path d="M${hx} ${hy + 30}C${hx - 50} ${hy - 10} ${hx - 30} ${hy - 50} ${hx} ${hy - 20}C${hx + 30} ${hy - 50} ${hx + 50} ${hy - 10} ${hx} ${hy + 30}Z" fill="${MADDER}" ${st(3)}/>`; });
  }
  if (o.view === "faces") {
    /* the eyebrow gag: five big Neel faces side by side along the lower frame above the caption plate, no striker in front of any; one thick raised brow each */
    let row = "";
    [200, 500, 800, 1100, 1400].forEach((fxx) => { row += frontFace(fxx, 624, 1.25, !!o.mortified, true); });
    let up = "";
    [350, 650, 950, 1250].forEach((px) => { up += manG(`translate(${px} 430) scale(.5)`, `<g transform="rotate(24 46 -240)">${stickPath(440, 16)}</g>`, ""); });
    const panel = `<rect x="50" y="470" width="1500" height="282" rx="30" fill="${CREAM}" ${st(5)}/><rect x="68" y="486" width="1464" height="250" rx="20" fill="none" stroke="${OCHRE}" stroke-width="4"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})">${up}${panel}${row}</g>`;
  }
  const v = o.view || "line";
  const tf = v === "close" ? "translate(800 800) scale(1.65) translate(-800 -800)" : v === "low" ? "translate(800 860) scale(1.25) translate(-800 -800)" : "";
  const ground = v === "low" ? `<path d="M0 840Q800 780 1600 840V900H0Z" fill="#4a3f6e" ${st(4)}/>` : "";
  return `<g transform="translate(${x} ${y}) scale(${s})">${fest}<g transform="${tf}">${bk}${out}${outM}${fx}</g>${ground}</g>`;
};


/* F4.js */
/* F4.js: footTap redrawn. Neel's right foot tapping, side view, toe to the right, heel at (0,0) on the floor. o.state: "up" (heel down, toe lifted 25deg) | "down" (flat, motion ticks, impact lines, a madder note). Cream picture panel behind it keeps it readable. Whole part is x -160..350, y -294..50 (centre about x 95). */
KIT.footTap = function (x, y, s, o) { o = o || {}; const down = o.state === "down";
  const ax = down ? 49 : 4, ay = down ? -92 : -101;
  const foot = `<path d="M0 -18C-4 -44 2 -76 6 -92L92 -92C104 -80 120 -70 150 -64C190 -58 226 -50 258 -42C282 -36 292 -28 292 -17L292 -12L0 -12Z" fill="${INK}" ${st(4)}/>
    <path d="M6 -92L92 -92L90 -80C60 -72 30 -76 8 -80Z" fill="${HAIR}" ${st(3)}/>
    <path d="M214 -52C228 -44 230 -28 224 -13" fill="none" stroke="${CREAM}" stroke-width="3" stroke-linecap="round"/>
    <path d="M112 -76C132 -70 156 -64 200 -56" fill="none" stroke="${CREAM}" stroke-width="5" stroke-linecap="round"/>
    <path d="M250 -37C266 -33 278 -28 282 -20" fill="none" stroke="${CREAM}" stroke-width="4" stroke-linecap="round"/>
    <path d="M122 -62L130 -56M138 -58L146 -52M154 -55L162 -49" fill="none" stroke="${CREAM}" stroke-width="3" stroke-linecap="round"/>
    <path d="M-2 -22L-2 0L58 0L58 -14L292 -14L292 -8Q292 0 280 0L-2 0Z" fill="${HAIR}" ${st(4)}/>
    <path d="M70 -9H280" stroke="${CREAM}" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>
    <path d="M-2 -24L58 -24L58 -14" fill="none" ${st(3)}/>`;
  const sock = `<path d="M${ax - 36} ${ay - 36}L${ax + 36} ${ay - 36}L${ax + 36} ${ay + 6}L${ax - 36} ${ay + 6}Z" fill="${CREAM}" ${st(3.5)}/><path d="M${ax - 34} ${ay - 22}H${ax + 34}M${ax - 34} ${ay - 12}H${ax + 34}" stroke="${SLATE}" stroke-width="2.5"/>`;
  const trouser = `<path d="M${ax - 38} ${ay - 172}L${ax + 38} ${ay - 172}L${ax + 50} ${ay - 36}L${ax - 50} ${ay - 36}Z" fill="${HAIR}" ${st(4)}/>
    <path d="M${ax - 49} ${ay - 50}L${ax + 49} ${ay - 50}" stroke="${CREAM}" stroke-width="2.5" opacity=".7"/>
    <path d="M${ax + 4} ${ay - 164}L${ax + 8} ${ay - 62}" stroke="${CREAM}" stroke-width="3" stroke-linecap="round" opacity=".55"/>`;
  const chain = `<path d="M${ax - 30} ${ay - 36}Q${ax - 10} ${ay + 4} ${ax + 14} ${ay - 36}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${ax - 30} ${ay - 36}Q${ax - 10} ${ay + 4} ${ax + 14} ${ay - 36}" fill="none" stroke="${SLATE}" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="6 4"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <defs><pattern id="footTapTile" width="60" height="40" patternUnits="userSpaceOnUse"><rect width="60" height="40" fill="${TURM}"/><path d="M0 20L30 0L60 20L30 40Z" fill="${SAFF}" ${st(3)}/><circle cx="30" cy="20" r="5" fill="${CREAM}" ${st(2.5)}/></pattern></defs>
  <rect x="-160" y="-294" width="510" height="344" rx="26" fill="${CREAM}" ${st(4)}/>
  <rect x="-148" y="-282" width="486" height="320" rx="18" fill="none" stroke="${OCHRE}" stroke-width="3"/>
  <rect x="-140" y="0" width="480" height="40" fill="url(#footTapTile)" ${st(4)}/>
  <ellipse cx="150" cy="3" rx="170" ry="10" fill="${INK}" opacity=".22"/>
  ${down ? `<path d="M-48 -24H-88M-60 -48H-108M-48 -72H-84" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` : ""}
  ${trouser}${sock}${chain}
  <g${down ? "" : ` transform="rotate(-25)"`}>${foot}</g>
  ${down ? `<path d="M310 -34L334 -50M314 -14L342 -14" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M310 -34L334 -50M314 -14L342 -14" stroke="${CREAM}" stroke-width="3.5" stroke-linecap="round"/>
  <ellipse cx="300" cy="-100" rx="14" ry="11" transform="rotate(-20 300 -100)" fill="${MADDER}" ${st(3)}/>
  <path d="M312 -102V-170" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M312 -102V-170" stroke="${MADDER}" stroke-width="4" stroke-linecap="round"/>
  <path d="M312 -170C328 -162 336 -146 330 -128C326 -140 320 -148 312 -152Z" fill="${MADDER}" ${st(3)}/>` : ""}
</g>`; };

