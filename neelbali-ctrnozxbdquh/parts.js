"use strict";
/* ashStand.js */
KIT.ashStand = function (x, y, s, o) { o = o || {}; const hrt = (hx, hy, r) => `<path transform="translate(${hx} ${hy}) scale(${r})" d="M0 .9C-1.2 .1 -1 -.9 -.5 -.9C-.2 -.9 0 -.6 0 -.4C0 -.6 .2 -.9 .5 -.9C1 -.9 1.2 .1 0 .9Z" fill="${MADDER}" ${st(0.12)}/>`; const sc = o.scroll !== false; return `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="0" cy="6" rx="90" ry="12" fill="${INK}" opacity=".22"/>
  <path d="M-30 0V-40M26 0V-40" stroke="${OCHRE}" stroke-width="22" stroke-linecap="round"/>
  <path d="M-62 -10C-56 -120 -52 -200 -44 -258H50C58 -200 62 -120 68 -10Q4 4 -62 -10Z" fill="url(#robepat)" ${st(5)}/>
  <path d="M-62 -10Q4 4 68 -10L66 -28Q4 -14 -60 -28Z" fill="${SAFF}" ${st(3)}/>
  <path d="M-6 -258L4 -150" stroke="${MADDER}" stroke-width="5" stroke-linecap="round"/>
  <path d="M30 -240Q70 -190 78 -170" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M30 -240Q70 -190 78 -170" fill="none" stroke="${CREAM}" stroke-width="22" stroke-linecap="round"/>
  ${sc ? `<g transform="rotate(-8 90 -176)"><rect x="76" y="-210" width="30" height="76" rx="12" fill="${CREAM}" ${st(4)}/><path d="M84 -196H98M84 -184H98M84 -172H98" stroke="${MADDER}" stroke-width="3"/></g>` : ""}
  <circle cx="82" cy="-170" r="12" fill="${OCHRE}" ${st(3)}/>
  <g transform="translate(0 -300) scale(.85)">${profile(0, 0, 1, {skin: OCHRE, glasses: true, deadpan: false, hair: "#3a2a1a", turban: true, moustache: false, flip: o.flip !== false})}${hrt(o.flip === false ? -26 : 26, -15, 11)}</g>
</g>`; };

/* creditsText.js */
KIT.creditsText = function (x, y, s, o) { o = o || {}; const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); const size = o.size || 1; const src = o.lines || ["Credits"]; const items = []; src.forEach((raw) => { if (raw === "") { items.push({ blank: true }); return; } const head = raw.startsWith("#"); const txt = head ? raw.slice(1) : raw; const parts = []; if (txt.length > 70 / size) { const mid = txt.length / 2; let best = -1; for (let i = 0; i < txt.length; i++) { if (txt[i] === " " && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i; } if (best > 0) parts.push(txt.slice(0, best), txt.slice(best + 1)); else parts.push(txt); } else parts.push(txt); parts.forEach((p) => items.push({ head, text: p })); }); let yy = 0; let out = ""; items.forEach((it) => { if (it.blank) { yy += 23 * size; return; } if (it.head) yy += 20 * size; const fs = (it.head ? 40 : 30) * size; const fill = it.head ? TURM : CREAM; out += `<text x="0" y="${yy}" text-anchor="middle" font-family="Rozha One" font-size="${fs}" fill="${fill}" stroke="${INK}" stroke-width="${5 * size}" paint-order="stroke">${esc(it.text)}</text>`; yy += 46 * size; }); return `<g transform="translate(${x} ${y}) scale(${s})">${out}</g>`; };

/* cushion.js */
KIT.cushion = function (x, y, s, o) { o = o || {}; return `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="0" cy="4" rx="110" ry="12" fill="${INK}" opacity=".22"/>
  <path d="M-96 0C-104 -34 -80 -52 0 -52C80 -52 104 -34 96 0Q0 12 -96 0Z" fill="${MADDER}" ${st(4)}/>
  <path d="M-70 -30Q0 -44 70 -30" fill="none" stroke="${TURM}" stroke-width="5" stroke-linecap="round"/>
  <circle cx="-96" cy="-2" r="9" fill="${TURM}" ${st(3)}/><circle cx="96" cy="-2" r="9" fill="${TURM}" ${st(3)}/>
  <path d="M-96 6V34M-102 6L-104 32M-90 6L-88 32" stroke="${TURM}" stroke-width="4" stroke-linecap="round"/><path d="M96 6V34M90 6L88 32M102 6L104 32" stroke="${TURM}" stroke-width="4" stroke-linecap="round"/>
</g>`; };

/* drumLine.js */
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
    let face = frontFace(-150, -96, .88, !!o.mortified);
    if (o.brows) {
      face = face.replace(o.mortified ? "M6 -42Q26 -56 46 -44" : "M6 -28Q26 -42 46 -30", o.mortified ? "M2 -52Q26 -76 50 -56" : "M2 -44Q26 -68 50 -50");
      face = face.replace('<path d="M-46', `<ellipse cx="26" cy="-52" rx="30" ry="15" fill="${BLUE}"/><path d="M-46`);
    }
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

/* eyeCloseUp.js */
KIT.eyeCloseUp = function (x, y, s, o) { o = o || {}; const open = o.state === "open"; const brow = open ? "M-150 -70Q-50 -112 44 -84" : "M-150 -60Q-50 -68 44 -60"; const lid = open ? "" : `<path d="M-136 0C-70 -70 70 -70 136 0Q0 -2 -136 0Z" fill="${BLUE}" ${st(5)}/>`; const drip = o.drip ? `<path d="M176 30C224 36 262 80 256 150C254 164 240 168 236 154C228 112 208 92 176 84Z" fill="${HAIR}" ${st(4)}/><path d="M244 168Q252 184 244 198Q236 184 244 168Z" fill="#8FD3FF" ${st(2.5)}/><path d="M244 214Q250 224 244 232Q238 224 244 214Z" fill="#8FD3FF" ${st(2)}/>` : ""; return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-180" y="-110" width="360" height="220" rx="28" fill="${VIOLET}" ${st(5)}/><rect x="-170" y="-100" width="340" height="200" rx="40" fill="${BLUE}" ${st(4)}/><circle cx="-150" cy="-88" r="16" fill="${HAIR}" ${st(3)}/><circle cx="156" cy="84" r="14" fill="${HAIR}" ${st(3)}/><path d="M-120 -26Q0 -86 120 -26" fill="none" ${st(3)}/><path d="M-135 0C-70 -70 70 -70 135 0C70 70 -70 70 -135 0Z" fill="#fff" ${st(5)}/><circle cx="0" cy="0" r="44" fill="${HAIR}"/><circle cx="-14" cy="-14" r="10" fill="#fff"/><circle cx="16" cy="14" r="4" fill="#fff"/>${lid}<path d="${brow}" fill="none" stroke="${HAIR}" stroke-width="16" stroke-linecap="round"/>${drip}</g>`; };

/* faceInset.js */
KIT.faceInset = function (x, y, s, o) { o = o || {}; return `<g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-170" y="-130" width="340" height="260" rx="26" fill="${INK}"/>
  <rect x="-160" y="-120" width="320" height="240" rx="20" fill="${CREAM}" ${st(4)}/>
  <rect x="-148" y="-108" width="296" height="216" rx="14" fill="${VIOLET}" ${st(3)}/>
  ${profile(-8, 52, 1.6, {flip: true, moustache: o.moustache, smile: o.smile})}
</g>`; };

/* fireworks.js */
KIT.fireworks = function (x, y, s, o) { o = o || {}; const R = 70 + ((o.size || 1) - 1) * 40; return `<g transform="translate(${x} ${y}) scale(${s})">${[[300,200],[800,140],[1300,210],[560,300],[1060,300]].map(([cx,cy],b)=>{ const pal = [TURM, SAFF, CREAM, MADDER, BLUE2]; const spokes = Array.from({length:6},(_,k)=>{ const a = k/6*2*Math.PI; return `<path d="M${(Math.cos(a)*(R+18)).toFixed(1)} ${(Math.sin(a)*(R+18)).toFixed(1)}L${(Math.cos(a)*(R+40)).toFixed(1)} ${(Math.sin(a)*(R+40)).toFixed(1)}" fill="none" ${st(3)}/>`; }).join(""); const dots = Array.from({length:14},(_,k)=>{ const a = k/14*2*Math.PI; return `<circle cx="${(Math.cos(a)*R).toFixed(1)}" cy="${(Math.sin(a)*R).toFixed(1)}" r="9" fill="${pal[(k+b)%5]}" ${st(3)}/>`; }).join(""); return `<g transform="translate(${cx} ${cy})">${spokes}${dots}<circle r="20" fill="${CREAM}" ${st(3)}/></g>`; }).join("")}</g>`; };

/* gift.js */
KIT.gift = function (x, y, s, o) { o = o || {}; return `<g transform="translate(${x} ${y}) scale(${s})">
<ellipse cx="0" cy="-4" rx="130" ry="16" fill="${INK}" opacity=".22"/>
${o.state === "open" ? `
<path d="M-46 -60 L-52 -6 M46 -60 L52 -6" fill="none" stroke="${INK}" stroke-width="42" stroke-linecap="round"/>
<path d="M-46 -60 L-52 -6 M46 -60 L52 -6" fill="none" stroke="${OCHRE}" stroke-width="32" stroke-linecap="round"/>
<ellipse cx="-56" cy="-6" rx="24" ry="10" fill="${OCHRE}" ${st(3)}/><ellipse cx="56" cy="-6" rx="24" ry="10" fill="${OCHRE}" ${st(3)}/>
<path d="M-78 -318 Q-132 -290 -124 -236 Q-120 -212 -106 -196 M78 -318 Q132 -290 124 -236 Q120 -212 106 -196" fill="none" stroke="${INK}" stroke-width="60" stroke-linecap="round"/>
<path d="M-78 -318 Q-132 -290 -124 -236 Q-120 -212 -106 -196 M78 -318 Q132 -290 124 -236 Q120 -212 106 -196" fill="none" stroke="${OCHRE}" stroke-width="50" stroke-linecap="round"/>
<circle cx="-106" cy="-184" r="24" fill="${OCHRE}" ${st(4)}/><circle cx="106" cy="-184" r="24" fill="${OCHRE}" ${st(4)}/>
<path d="M-18 -346 H18 V-324 H-18Z" fill="${OCHRE}" ${st(3)}/>
<path d="M-84 -330 Q0 -352 84 -330 Q100 -262 86 -196 Q0 -178 -86 -196 Q-100 -262 -84 -330Z" fill="${OCHRE}" ${st(5)}/>
<path d="M-44 -284 Q-22 -264 -2 -282 M44 -284 Q22 -264 2 -282 M0 -262 V-226" fill="none" ${st(2.5)}/>
<path d="M-86 -200 Q0 -178 86 -200 L104 -60 Q70 -40 60 -18 L14 -48 L-4 -14 L-38 -46 L-66 -18 Q-100 -60 -86 -200Z" fill="${SAFF}" ${st(4)}/>
<path d="M-6 -184 Q-18 -110 -6 -50 M30 -186 Q24 -120 40 -60" fill="none" ${st(2.5)}/>
<path d="M-88 -204 Q0 -182 88 -204 L90 -186 Q0 -164 -90 -186Z" fill="${TURM}" ${st(3)}/>
<circle cx="0" cy="-414" r="10" fill="${HAIR}" ${st(3)}/>
<ellipse cx="0" cy="-374" rx="38" ry="42" fill="${OCHRE}" ${st(4)}/>
<ellipse cx="0" cy="-366" rx="27" ry="30" fill="${CREAM}" ${st(3)}/>
<circle cx="-11" cy="-372" r="3.6" fill="${INK}"/><circle cx="11" cy="-372" r="3.6" fill="${INK}"/>
<path d="M-10 -352 H10" fill="none" ${st(3.5)}/>
<path d="M-120 0 C-132 -30 -104 -52 -66 -54 C-40 -82 0 -76 14 -58 C44 -80 92 -72 108 -48 C140 -42 140 -14 124 0Z" fill="${CREAM}" ${st(4)}/>
<path d="M-40 -28 Q-20 -40 0 -26" fill="none" ${st(2.5)}/>
` : `
<path d="M-96 0V-318L-84 -330H84L96 -318V0Z" fill="${CREAM}" ${st(5)}/>
<path d="M-108 -318H108V-352H-108Z" fill="${SAFF}" ${st(4)}/>
<path d="M-60 -290V-30M58 -280V-40M-30 -300L-34 -250M34 -120L30 -70" fill="none" stroke="${INK}" stroke-width="2.5" stroke-dasharray="10 9" opacity=".55"/>
<path d="M-96 -168H96V-136H-96Z" fill="${TURM}" ${st(4)}/>
<path d="M-16 -352V0H16V-352Z" fill="${TURM}" ${st(4)}/>
<path d="M-16 -168H16V-136H-16Z" fill="${TURM}"/>
<path d="M-4 -356C-30 -420 -88 -412 -78 -380C-70 -360 -30 -356 -4 -356Z M4 -356C30 -420 88 -412 78 -380C70 -360 30 -356 4 -356Z" fill="${TURM}" ${st(4)}/>
<circle cx="0" cy="-356" r="13" fill="${SAFF}" ${st(3.5)}/>
<path d="M16 -356L50 -310" fill="none" ${st(2.5)}/>
<g transform="translate(58 -300) rotate(-14)"><path d="M-24 -4H24V44H-24Z" fill="${CREAM}" ${st(3)}/><circle cx="0" cy="3" r="3" fill="${INK}"/><path d="M-14 20H14M-14 32H8" stroke="${MADDER}" stroke-width="3"/></g>
`}
</g>`; };

/* gong.js */
KIT.gong = function (x, y, s, o) {
  o = o || {};
  /* A big turmeric gong hung from a madder frame; disc centred on (0,0). o.ring true adds light rings and a cream burst. */
  const rings = o.ring ? `<circle r="175" fill="none" stroke="${CREAM}" stroke-width="10"/><circle r="205" fill="none" stroke="${TURM}" stroke-width="7"/><circle r="235" fill="none" stroke="${CREAM}" stroke-width="5"/>` : "";
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="318" rx="230" ry="16" fill="#000" opacity=".22"/>
    <path d="M-200 316V-240M200 316V-240" stroke="${INK}" stroke-width="30" stroke-linecap="round"/>
    <path d="M-200 316V-240M200 316V-240" stroke="${MADDER}" stroke-width="20" stroke-linecap="round"/>
    <path d="M-230 -240H230" stroke="${INK}" stroke-width="30" stroke-linecap="round"/>
    <path d="M-230 -240H230" stroke="${MADDER}" stroke-width="20" stroke-linecap="round"/>
    <circle cx="-230" cy="-240" r="16" fill="${TURM}" ${st(4)}/><circle cx="230" cy="-240" r="16" fill="${TURM}" ${st(4)}/>
    <path d="M-60 -236L-6 -150M60 -236L6 -150" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <circle r="150" fill="${TURM}" ${st(7)}/>
    <circle r="116" fill="none" ${st(4)}/><circle r="84" fill="${SAFF}" ${st(4)}/><circle r="44" fill="${TURM}" ${st(4)}/><circle cx="-14" cy="-14" r="14" fill="${CREAM}" opacity=".7"/>
    ${rings}
  </g>`;
};

/* grilleWindow.js */
KIT.grilleWindow = function (x, y, s, o) { o = o || {}; const open = o.state === "open"; return `<g transform="translate(${x} ${y}) scale(${s})">
  ${open ? `<rect x="-70" y="-70" width="140" height="140" fill="none" stroke="${MADDER}" stroke-width="10"/>` : `<rect x="-75" y="-75" width="150" height="150" fill="${MADDER}" ${st(5)}/>`}
  ${open ? `<rect x="-59" y="-59" width="118" height="118" fill="none" stroke="${CREAM}" stroke-width="10"/>` : `<rect x="-64" y="-64" width="128" height="128" fill="${CREAM}" ${st(3)}/>`}
  <rect x="-54" y="-54" width="108" height="108" fill="${open ? "none" : TURM}" ${st(4)}/>
  ${open ? `<rect x="-22" y="-54" width="8" height="108" fill="${INK}"/><rect x="14" y="-54" width="8" height="108" fill="${INK}"/>` : ""}
  ${open
    ? `<path d="M-54 -54L-84 -44V44L-54 54Z" fill="${TURM}" ${st(4)}/><path d="M-72 -20V20" ${st(2)}/>`
    : `<path d="M-40 -40L40 40M40 -40L-40 40" fill="none" stroke="${MADDER}" stroke-width="2.5" stroke-linecap="round"/>`}
  <circle cx="-54" cy="-28" r="4" fill="${INK}"/><circle cx="-54" cy="28" r="4" fill="${INK}"/>
</g>`; };

/* neelFace.js */
KIT.neelFace = function (x, y, s, o) { o = o || {}; return profile(x, y, s, Object.assign({flip:true}, o)); };

/* passingSilhouette.js */
KIT.passingSilhouette = function (x, y, s, o) { o = o || {}; return `<g transform="translate(${x} ${y}) scale(${s})">${(() => {
  const peer = o.state === "peer";
  const arch = "M-130 0V-300C-130 -352 -70 -380 0 -380C70 -380 130 -352 130 -300V0Z";
  let grid = "";
  for (let c = -520; c <= 160; c += 40) {
    grid += `M-200 ${-200 + c}L200 ${200 + c}M-200 ${200 + c}L200 ${-200 + c}`;
  }
  const lean = peer ? "rotate(10 12 -200)" : "";
  const parts = [
    { d: "M2 -258C-12 -266 -26 -262 -34 -254C-22 -248 -10 -248 2 -252Z", tf: lean },
    { d: "M2 -256C0 -292 32 -308 54 -292C64 -284 62 -270 52 -268C40 -262 16 -262 2 -256Z", tf: lean },
    { d: "M10 -262C30 -270 48 -258 50 -240L60 -232L51 -226C53 -218 49 -210 40 -206C30 -200 16 -202 10 -212C4 -224 4 -252 10 -262Z", tf: lean },
    { d: peer ? "M-6 -96L-10 -50L-14 -10" : "M-6 -96L-30 -52L-54 -14", w: 18 },
    { d: peer ? "M-14 -10L6 -4" : "M-54 -14L-70 -4", w: 14 },
    { d: "M2 -184Q-30 -164 -44 -134", w: 12 },
    { d: "M-8 -192C14 -202 40 -202 52 -190C60 -150 60 -116 54 -92C60 -84 62 -76 60 -68L28 -64C16 -62 6 -66 -2 -72C-10 -66 -20 -62 -30 -62C-24 -100 -16 -150 -8 -192Z" },
    { d: peer ? "M16 -96L24 -50L28 -10" : "M18 -96L50 -50L66 -14", w: 18 },
    { d: peer ? "M28 -10L48 -4" : "M66 -14L92 -6", w: 14 },
    { d: peer ? "M40 -182L78 -186L60 -238" : "M42 -182Q72 -160 66 -126", w: 12 },
    ...(peer ? [{ d: "M49 -242a9 9 0 1 0 18 0a9 9 0 1 0 -18 0Z" }] : [])
  ];
  const halo = (p) => p.w
    ? `<path d="${p.d}" fill="none" stroke="${INK}" stroke-width="${p.w + 6}" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="${p.d}" fill="${INK}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  const body = (p) => p.w
    ? `<path d="${p.d}" fill="none" stroke="${VIOLET}" stroke-width="${p.w}" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="${p.d}" fill="${VIOLET}"/>`;
  const figure = parts.map(p => `<g transform="${p.tf || ""}">${halo(p)}${body(p)}</g>`).join("");
  return `<defs><clipPath id="passingJali"><path d="${arch}"/></clipPath></defs>
    <path d="${arch}" fill="${CREAM}"/>
    <g transform="translate(-12 0)"><ellipse cx="0" cy="4" rx="90" ry="9" fill="${INK}" opacity=".22"/>${figure}</g>
    <g clip-path="url(#passingJali)"><path d="${grid}" fill="none" stroke="${INK}" stroke-width="3"/></g>
    <path d="${arch}" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
})()}</g>`; };

/* raasCircle.js */
KIT.raasCircle = function (x, y, s, o) {
  o = o || {};
  const m = !!o.mortified, id = m ? "rcwm" : "rcw";
  const defs = `<defs><g id="${id}">${warriorBent(0, 0, 1, frontFace(-150, -92, 1.3, m))}</g></defs>`;
  const use = (px, py, sc, flip) => `<use href="#${id}" transform="translate(${px.toFixed(1)} ${py.toFixed(1)}) scale(${flip ? -sc : sc} ${sc})"/>`;
  let body = "";
  if (o.view === "ring") {
    const mk = (rx, ry, n, cy, smin, smax, ph) => Array.from({ length: n }, (_, i) => {
      const t = (i + ph) / n * Math.PI * 2, sn = Math.sin(t);
      return { x: 800 + rx * Math.cos(t), y: cy + ry * sn, sc: smin + (smax - smin) * (sn + 1) / 2, f: Math.cos(t) > 0 };
    });
    const list = mk(690, 175, 30, 640, .2, .42, 0).concat(mk(500, 115, 24, 630, .17, .34, .5));
    list.sort((a, b) => a.y - b.y);
    const men = [150, 330, 520, 800, 1080, 1270, 1450].map((px, i) => `<g transform="translate(${px} 520) scale(.36)">
      <path d="M-24 0V-150M24 0V-150" stroke="${OCHRE}" stroke-width="34" stroke-linecap="round"/><path d="M-58 -150H58L48 -260H-48Z" fill="${i % 2 ? BLUE2 : MADDER}" ${st(6)}/><path d="M-48 -260C-58 -330 58 -330 48 -260Z" fill="${OCHRE}" ${st(6)}/>
      ${profile(0, -318, .62, { skin: OCHRE, glasses: true, deadpan: false, hair: "#3a2a1a", turban: true, moustache: false })}
      <path d="M46 -240L${i % 2 ? -10 : 100} -520" stroke="#6B4A3A" stroke-width="16" stroke-linecap="round"/></g>`).join("");
    body = men + list.map(p => use(p.x, p.y, p.sc, p.f)).join("");
  } else {
    const rows = [[480, .15, 17], [550, .19, 14], [630, .24, 12], [720, .3, 10], [815, .38, 8]];
    rows.forEach(([ry, sc, n], r) => {
      const d = 1500 / n;
      for (let i = 0; i < n; i++) body += use(80 + d * (i + .5 * (r % 2)) + ((i * 7 + r * 3) % 5 - 2), ry + ((i * 5 + r) % 4 - 1.5), sc, false);
    });
    if (o.front) [760, 960, 1160, 1360].forEach((px, i) => { body += use(px, 832 + (i % 2) * 8, .56, false); });
  }
  return `<g transform="translate(${x} ${y}) scale(${s})">${defs}${body}</g>`;
};

/* rain.js */
/* rain: slate diagonal rain over the whole 1600x900 canvas. opts.density 1 (sparse) | 2 | 3 (heavy). Fixed seed, so the same density always draws the same drops. */
KIT.rain = function (x, y, s, o) { o = o || {};
  const d = Math.min(3, Math.max(1, o.density || 2));
  let seed = 12345, path = "";
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 70 * d; i++) {
    const px = rnd() * 1640 - 20, py = rnd() * 940 - 20, len = 26 + rnd() * 14;
    path += `M${px.toFixed(1)} ${py.toFixed(1)}l${(-len * 0.3).toFixed(1)} ${len.toFixed(1)}`;
  }
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="${path}" fill="none" stroke="${SLATE}" stroke-width="2.5" stroke-linecap="round"/></g>`;
};

/* puddle: flat violet ellipse centred on (0,0), with a lighter slate ring inside. opts.size 1 (120 wide) | 2 (240) | 3 (360). */
KIT.puddle = function (x, y, s, o) { o = o || {};
  const k = Math.min(3, Math.max(1, o.size || 1));
  const rx = 60 * k, ry = 16 * k;
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${VIOLET}" ${st(3)}/><ellipse cx="0" cy="0" rx="${rx * 0.66}" ry="${ry * 0.66}" fill="none" stroke="${SLATE}" stroke-width="3"/></g>`;
};

/* raisedSticks.js */
KIT.raisedSticks = function (x, y, s, o) {
  o = o || {};
  const still = o.still !== false;
  const head = profile(0, -318, .62, { skin: OCHRE, glasses: true, deadpan: false, hair: "#3a2a1a", turban: true, moustache: false });
  const man = (id, c) => `<g id="${id}"><path d="M-26 0V-150M26 0V-150" stroke="${OCHRE}" stroke-width="34" stroke-linecap="round"/><path d="M-60 -150H60L50 -260H-50Z" fill="${c}" ${st(5)}/><path d="M-50 -260C-60 -330 60 -330 50 -260Z" fill="${OCHRE}" ${st(5)}/>${head}</g>`;
  const defs = `<defs>${man("rsa", MADDER)}${man("rsb", BLUE2)}</defs>`;
  const fig = (px, py, sc, a, k, len) => {
    const sway = still ? "" : `<animateTransform attributeName="transform" type="rotate" values="${a - 5} 46 -240;${a + 5} 46 -240;${a - 5} 46 -240" dur="${(1.6 + (k % 5) * .2).toFixed(1)}s" repeatCount="indefinite"/>`;
    return `<g transform="translate(${px.toFixed(1)} ${py}) scale(${sc})"><use href="#${k % 2 ? "rsb" : "rsa"}"/><g transform="rotate(${a} 46 -240)">${sway}<path d="M46 -240V${-240 - len}" stroke="#6B4A3A" stroke-width="15" stroke-linecap="round"/><path d="M46 -240V${-240 - len}" stroke="${TURM}" stroke-width="4" stroke-linecap="round"/><circle cx="46" cy="-240" r="17" fill="${OCHRE}" ${st(4)}/></g></g>`;
  };
  let out = "", k = 0;
  [[610, .22, 14], [680, .28, 11], [755, .34, 9], [830, .4, 7]].forEach(([ry, sc, n], r) => {
    const d = 1500 / n;
    for (let i = 0; i < n; i++, k++) out += fig(70 + d * (i + .5 * (r % 2)) + (k * 13 % 17), ry, sc, ((k * 37) % 50) - 25, k, 420 + (k * 29) % 90);
  });
  [[150, .6], [1450, .6]].forEach(([px, sc], i) => { out += fig(px, 900, sc, [-14, 16][i], k++, 380); });
  return `<g transform="translate(${x} ${y}) scale(${s})"><g transform="translate(800 960) scale(1.7) translate(-800 -960)">${defs}${out}</g></g>`;
};

/* rosePetals.js */
KIT.rosePetals = function (x, y, s, o) { o = o || {}; const d = o.density || 2; const n = d <= 1 ? 7 : d >= 3 ? 22 : 14; let g = ""; for (let i = 0; i < n; i++) { const px = -320 + ((i * 181) % 640), py = -320 + ((i * 97 + 53) % 640), r = (i * 67) % 360 - 180, k = 0.8 + (i % 3) * 0.15; g += `<g transform="translate(${px} ${py}) rotate(${r}) scale(${k})"><path d="M0 0C18 -10 28 -38 14 -54C6 -64 -10 -62 -14 -50C-18 -32 -10 -10 0 0Z" fill="${MADDER}" ${st(3)}/><path d="M2 -8C10 -22 10 -38 4 -48" fill="none" stroke="${CREAM}" stroke-width="2.5" stroke-linecap="round"/></g>`; if (i % 4 === 1) g += `<circle cx="${px + 14}" cy="${py + 20}" r="4" fill="${CREAM}" stroke="${INK}" stroke-width="1.5"/>`; } return `<g transform="translate(${x} ${y}) scale(${s})">${g}</g>`; };

/* scroll.js */
KIT.scroll = function (x, y, s, o) { o = o || {}; return `<g transform="translate(${x} ${y}) scale(${s})">${(() => {
  const L = Math.min(3, Math.max(0, o.length | 0)), H = [60, 120, 210, 290][L];
  const rod = `<path d="M-100 0H100" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M-100 0H100" fill="none" stroke="${OCHRE}" stroke-width="7" stroke-linecap="round"/><circle cx="-104" cy="0" r="9" fill="${TURM}" ${st(3)}/><circle cx="104" cy="0" r="9" fill="${TURM}" ${st(3)}/>`;
  if (L === 0) {
    return `<rect x="-58" y="10" width="116" height="48" fill="${CREAM}" ${st(4)}/><path d="M-50 22H50M-50 34H50M-50 46H50" fill="none" stroke="${BLUE2}" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="-58" cy="34" rx="9" ry="24" fill="${CREAM}" ${st(4)}/><ellipse cx="58" cy="34" rx="9" ry="24" fill="${CREAM}" ${st(4)}/><ellipse cx="58" cy="34" rx="4" ry="12" fill="${MADDER}" ${st(2)}/>` + rod;
  }
  const shadow = L === 3 ? `<ellipse cx="0" cy="${H + 24}" rx="150" ry="8" fill="${INK}" opacity=".22"/><path d="M-50 ${H - 6}C-90 ${H + 2} -128 ${H + 8} -134 ${H + 18}C-100 ${H + 28} 70 ${H + 28} 124 ${H + 18}C138 ${H + 12} 110 ${H} 72 ${H - 6}Z" fill="${CREAM}" ${st(4)}/><path d="M-134 ${H + 18}C-156 ${H + 14} -158 ${H + 36} -132 ${H + 34}" fill="none" ${st(4)}/>` : "";
  const sheet = `<path d="M-70 8H70V${H - 22}H-70Z" fill="${CREAM}" ${st(4)}/><rect x="-70" y="8" width="140" height="14" fill="${BLUE}" ${st(3)}/>`;
  const rows = o.blank ? "" : Array.from({ length: Math.max(0, Math.ceil((H - 56 - 44) / 34)) }, (_, k) => {
    const r = 44 + k * 34, dir = k % 2 ? 1 : -1;
    return `<path d="M-50 ${r} c12 ${-14 * dir} 24 ${-14 * dir} 32 0 s24 ${14 * dir} 32 0 s22 ${-12 * dir} 30 0" fill="none" stroke="${k % 3 === 2 ? BLUE2 : INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  }).join("");
  const seal = o.blank ? "" : `<rect x="34" y="${H - 100}" width="24" height="24" fill="${MADDER}" ${st(2.5)}/>`;
  const roll = `<rect x="-72" y="${H - 42}" width="144" height="40" rx="18" fill="${CREAM}" ${st(4)}/><ellipse cx="-72" cy="${H - 22}" rx="10" ry="20" fill="${CREAM}" ${st(4)}/><ellipse cx="72" cy="${H - 22}" rx="10" ry="20" fill="${CREAM}" ${st(4)}/><ellipse cx="72" cy="${H - 22}" rx="4" ry="11" fill="${MADDER}" ${st(2)}/>`;
  return shadow + sheet + rows + seal + roll + rod;
})()}</g>`; };

/* seatedAsh.js */
KIT.seatedAsh = function (x, y, s, o) { o = o || {}; const hap = o.state === "happy"; const hrt = (hx, hy, r) => `<path transform="translate(${hx} ${hy}) scale(${r})" d="M0 .9C-1.2 .1 -1 -.9 -.5 -.9C-.2 -.9 0 -.6 0 -.4C0 -.6 .2 -.9 .5 -.9C1 -.9 1.2 .1 0 .9Z" fill="${MADDER}" ${st(0.12)}/>`; return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="8" rx="150" ry="14" fill="${INK}" opacity=".22"/>
    ${hap ? `<path d="M-60 -160C-90 -190 -110 -215 -124 -246" fill="none" ${st(40)}/><path d="M60 -160C90 -190 104 -220 108 -252" fill="none" ${st(40)}/><path d="M-60 -160C-90 -190 -110 -215 -124 -246" fill="none" stroke="url(#robepat)" stroke-width="30" stroke-linecap="round"/><path d="M60 -160C90 -190 104 -220 108 -252" fill="none" stroke="url(#robepat)" stroke-width="30" stroke-linecap="round"/><circle cx="-124" cy="-250" r="14" fill="${OCHRE}" ${st(3)}/><circle cx="108" cy="-256" r="14" fill="${OCHRE}" ${st(3)}/>` : ""}
    <path d="M-130 0C-140 -50 -90 -92 0 -92C90 -92 140 -50 130 0Z" fill="url(#robepat)" ${st(5)}/>
    <path d="M-70 -88C-84 -140 -70 -184 -20 -192C40 -198 78 -160 72 -88Z" fill="url(#robepat)" ${st(5)}/>
    ${hap ? "" : `<ellipse cx="34" cy="-96" rx="26" ry="14" fill="${OCHRE}" ${st(3)}/><ellipse cx="-4" cy="-94" rx="20" ry="11" fill="${OCHRE}" ${st(3)}/>`}
    <g transform="translate(0 -215) scale(.8)">${profile(0, 0, 1, {skin: OCHRE, glasses: true, deadpan: false, hair: "#3a2a1a", turban: true, moustache: false})}${hrt(-26, -15, 11)}</g>
    ${hap ? hrt(-170, -300, 20) + hrt(150, -340, 16) + hrt(-70, -400, 13) : ""}
  </g>`; };

/* silhouetteCrowd.js */
KIT.silhouetteCrowd = function (x, y, s, o) { o = o || {}; const cheer = !!o.cheer; const hi = cheer ? 1.15 : 1;
  /* One silhouette standing with feet at (0,0). k = height scale. pose 0 both arms up, 1 left arm high (flag), 2 both arms out and up. */
  const person = (px, py, k, i, flagged) => {
    const pose = flagged ? 1 : (i % 3 === 0 ? 0 : 2);
    const arm = (side, j) => {
      const high = pose === 0 ? -226 : pose === 1 ? (j === 0 ? -250 : -196) : -196;
      const hy = high * hi, hx = side * (pose === 2 ? 78 : 64) * hi;
      const ex = side * (pose === 2 ? 58 : 52), ey = (hy - 140) / 2 - 8;
      const d = `M${side * 26} -140Q${ex} ${ey} ${hx} ${hy}`;
      return { hx, hy, s: `<path d="${d}" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${VIOLET}" stroke-width="9" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="7" fill="${VIOLET}" ${st(4)}/>` };
    };
    const L = arm(-1, 0), R = arm(1, 1);
    let flagPart = "";
    if (flagged) {
      const fx = L.hx - 6, fy = L.hy - 70;
      flagPart = `<path d="M${fx} ${L.hy}L${fx} ${fy}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${fx} ${fy}C${fx + 24} ${fy - 12} ${fx + 46} ${fy + 12} ${fx + 68} ${fy - 2}L${fx + 62} ${fy + 18}L${fx + 68} ${fy + 36}C${fx + 46} ${fy + 24} ${fx + 24} ${fy + 48} ${fx} ${fy + 32}Z" fill="${SAFF}" ${st(3)}/>`;
    }
    const body = `<path d="M-30 0C-36 -40 -42 -92 -38 -128L-30 -150H30L38 -128C42 -92 36 -40 30 0Z" fill="${VIOLET}" ${st(5)}/>`;
    const head = `<circle cx="0" cy="-166" r="17" fill="${VIOLET}" ${st(5)}/><path d="M-20 -176C-26 -200 22 -206 20 -178C8 -184 -8 -184 -20 -176Z" fill="${VIOLET}" ${st(5)}/><path d="M-19 -178Q0 -186 19 -180" fill="none" stroke="${TURM}" stroke-width="3"/>`;
    return `<g transform="translate(${px} ${py}) scale(${k})">${L.s}${R.s}${body}${head}${flagPart}</g>`;
  };
  /* Back row first (smaller, higher), then the front row over it */
  const back = Array.from({ length: 10 }, (_, i) => person(-540 + i * 120, -62, 0.74 + ((i * 3) % 3) * 0.04, i + 3, false)).join("");
  const front = Array.from({ length: 11 }, (_, i) => person(-600 + i * 120, 0, 0.96 + ((i * 5) % 4) * 0.06, i, i % 4 === 1)).join("");
  const spark = (sx, sy, r) => `<path transform="translate(${sx} ${sy}) scale(${r})" d="M0 -14L4 -4L14 0L4 4L0 14L-4 4L-14 0L-4 -4Z" fill="${TURM}" ${st(3)}/>`;
  const sparks = cheer ? [[-470, -330, 1.2], [-250, -420, 0.9], [210, -400, 1.1], [470, -320, 1.3], [0, -470, 1]].map(([a, b, c]) => spark(a, b, c)).join("") : "";
  return `<g transform="translate(${x} ${y}) scale(${s})">${back}${front}${sparks}</g>`;
};

/* smoothVisitor.js */
KIT.smoothVisitor = function (x, y, s, o) { o = o || {}; return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="4" rx="120" ry="14" fill="${INK}" opacity=".22"/><g ${o.state === "stand" ? "" : 'transform="rotate(-4 0 -4)"'}><path d="M-48 -286C-80 -230 -96 -120 -104 -8Q0 6 104 -8C96 -120 70 -230 46 -286Q0 -300 -48 -286Z" fill="${TURM}" ${st(4)}/><path d="M-104 -8Q0 6 104 -8L104 -26Q0 -10 -104 -26Z" fill="${SAFF}" ${st(3)}/><path d="M-60 -270C-70 -200 -80 -120 -88 -22L-70 -22C-62 -120 -50 -200 -40 -270Z" fill="${SAFF}" ${st(3)}/><path d="M-48 -286Q0 -300 46 -286L42 -270Q0 -282 -44 -270Z" fill="${SAFF}" ${st(3)}/><g transform="rotate(-12 70 -146)"><rect x="18" y="-160" width="108" height="26" rx="13" fill="${CREAM}" ${st(4)}/><circle cx="20" cy="-147" r="11" fill="${TURM}" ${st(3)}/><circle cx="124" cy="-147" r="11" fill="${TURM}" ${st(3)}/><path d="M30 -152H112" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g><path d="M40 -262Q96 -230 92 -170" fill="none" stroke="${INK}" stroke-width="46" stroke-linecap="round"/><path d="M40 -262Q96 -230 92 -170" fill="none" stroke="${TURM}" stroke-width="36" stroke-linecap="round"/><path d="M-40 -262Q-100 -256 -124 -300" fill="none" stroke="${INK}" stroke-width="46" stroke-linecap="round"/><path d="M-40 -262Q-100 -256 -124 -300" fill="none" stroke="${TURM}" stroke-width="36" stroke-linecap="round"/><path d="M-118 -292Q-128 -300 -136 -292" fill="none" stroke="${SAFF}" stroke-width="10" stroke-linecap="round"/><path d="M-134 -322C-146 -332 -152 -322 -144 -310" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M-120 -316C-132 -340 -142 -346 -150 -338" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M-120 -316C-132 -340 -142 -346 -150 -338" fill="none" stroke="${OCHRE}" stroke-width="7" stroke-linecap="round"/><path d="M-106 -314C-112 -342 -102 -352 -96 -340" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M-106 -314C-112 -342 -102 -352 -96 -340" fill="none" stroke="${OCHRE}" stroke-width="7" stroke-linecap="round"/><ellipse cx="-128" cy="-306" rx="16" ry="18" fill="${OCHRE}" ${st(3)} transform="rotate(-20 -128 -306)"/><g transform="translate(0 -318) scale(-.72 .72)"><path d="M52 -50C54 -10 56 30 40 62C20 78 -10 74 -30 58C-40 52 -42 40 -46 30L-50 22Q-54 12 -48 4L-44 -4L-44 -30C-36 -56 -8 -70 22 -68C40 -66 50 -60 52 -50Z" fill="${OCHRE}" ${st(4)}/><path d="M40 -50C18 -82 -26 -78 -46 -40C-30 -56 -4 -62 16 -56C30 -52 38 -44 40 -34Z" fill="${HAIR}" ${st(3)}/><path d="M-30 -62C-10 -70 10 -68 26 -60" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/><ellipse cx="38" cy="2" rx="10" ry="17" fill="${OCHRE}" ${st(3)}/><path d="M-44 -14C-30 -38 4 -34 16 -14C4 2 -32 4 -44 -14Z" fill="#fff" ${st(3)}/><circle cx="-20" cy="-14" r="8" fill="${INK}"/><circle cx="-17" cy="-17" r="2.4" fill="#fff"/><path d="M-46 -20C-30 -28 0 -28 16 -20" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M-48 -36Q-18 -52 14 -40" fill="none" stroke="${HAIR}" stroke-width="7" stroke-linecap="round"/><path d="M56 6Q40 62 -24 40Q22 48 52 2Z" fill="${MADDER}" ${st(3)}/><path d="M52 12Q36 46 -10 36Q20 40 48 8Z" fill="#fff"/><path d="M40 22L38 34M28 28L26 40M14 32L12 40" stroke="${INK}" stroke-width="2.4"/><path d="M56 4Q36 10 18 4Q36 2 56 -2Z" fill="${HAIR}" ${st(2.5)}/><path d="M-52 36C-44 42 -34 42 -28 38" fill="none" ${st(3)}/></g></g></g>`; };

/* strap.js */
KIT.strap = function (x, y, s, o) { o = o || {}; return `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="0" cy="-30" rx="92" ry="118" fill="${OCHRE}" ${st(5)}/>
  <path d="M-60 -50Q-40 -76 -16 -52M16 -52Q40 -76 60 -50" fill="none" ${st(4)}/>
  ${[-34, 34].map(ex => `<ellipse cx="${ex}" cy="-26" rx="13" ry="10" fill="#fff" ${st(3)}/><circle cx="${ex}" cy="-25" r="5" fill="${INK}"/>`).join("")}
  <path d="M0 -24Q-10 6 6 12" fill="none" ${st(3.5)}/>
  <path d="M-36 40Q0 22 36 40Q0 56 -36 40Z" fill="${HAIR}" ${st(3)}/>
  <path d="M-16 62Q0 70 16 62" fill="none" ${st(3.5)}/>
  <g ${o.state==="slip"?'transform="translate(34 70) rotate(25)"':''}>
    <path d="M-100 -108Q0 -86 100 -108L100 -92Q0 -70 -100 -92Z" fill="${MADDER}" ${st(3.5)}/>
    <path d="M-92 -98Q0 -76 92 -98" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="6 6"/>
    ${o.state==="slip"?'<path d="M88 -104L100 -104L110 -20Q102 0 94 -10Q92 -50 88 -90Z" fill="'+MADDER+'" '+st(3)+'/>':'<path d="M88 -102L100 -100L98 -80Q94 -72 90 -80Z" fill="'+MADDER+'" '+st(3)+'/>'}
    <circle cx="92" cy="-100" r="12" fill="${TURM}" ${st(3.5)}/>
    ${frontFace(0,-98,.5,false)}
  </g>
</g>`; };

/* tailorTape.js */
KIT.tailorTape = function (x, y, s, o) { o = o || {}; return `<g transform="translate(${x} ${y}) scale(${s})">${(() => {
  const dx = o.dx != null ? o.dx : 300, dy = o.dy != null ? o.dy : 0;
  const L = Math.hypot(dx, dy), ang = Math.atan2(dy, dx) * 180 / Math.PI;
  const snap = o.state === "snap";
  /* taut: straight tape. snap: first 2 loops coil back flat against the reel, then the straight run */
  let d = `M0 0L${L} 0`, sx = 40;
  if (snap) {
    let pts = "";
    for (let k = 0; k <= 60; k++) {
      const t = k / 60, th = Math.PI + t * 4 * Math.PI, r = 60 - 40 * t;
      pts += `${k ? "L" : "M"}${(60 + r * Math.cos(th)).toFixed(1)} ${(0.45 * r * Math.sin(th)).toFixed(1)}`;
    }
    d = `${pts}L${L} 0`; sx = 100;
  }
  const body = `<path d="${d}" fill="none" stroke="${INK}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#F0D878" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>`;
  /* ticks every 9 units, a long tick every 90, a tiny numeral-like dash between */
  let marks = "";
  for (let i = 0, u = sx; u < L - 30; i++, u = sx + i * 9) {
    if (i % 10 === 0) marks += `<path d="M${u} -7V7" stroke="${INK}" stroke-width="2.6"/>`;
    else marks += `<path d="M${u} -5V5" stroke="${INK}" stroke-width="1.6"/>`;
    if (i % 10 === 5 && u + 12 < L - 30) marks += `<path d="M${u + 4} -4L${u + 7} 4M${u + 7} -4L${u + 10} 4" stroke="${MADDER}" stroke-width="1.8"/>`;
  }
  const tab = `<path d="M${L - 6} -10L${L + 26} 0L${L - 6} 10Z" fill="${MADDER}" ${st(3)}/>`;
  const reel = `<circle r="27" fill="${CREAM}" ${st(5)}/><circle r="17" fill="${TURM}" ${st(3)}/><circle r="6" fill="${INK}"/>`;
  return `<g transform="rotate(${ang})">${body}${marks}${tab}${reel}</g>`;
})()}</g>`; };

/* walkingNeel.js */
KIT.walkingNeel = function (x, y, s, o) { o = o || {}; return `<g transform="translate(${x} ${y}) scale(${s})">${(() => {
  const S = o.state || "stand";
  const sw = S === "walk1" ? 1 : S === "walk2" ? -1 : 0;
  const JK = "#17141c", TR = "#17141c", SH = "#fff";
  const leg = (hx, a) => `<g transform="translate(${hx} -200) rotate(${a})"><path d="M0 0V178" stroke="${INK}" stroke-width="50" stroke-linecap="round"/><path d="M0 0V178" stroke="${TR}" stroke-width="38" stroke-linecap="round"/><ellipse cx="12" cy="188" rx="26" ry="11" fill="${INK}"/></g>`;
  const arm = (sx, a, near, L = 96, open = false) => `<g transform="translate(${sx} -288) rotate(${a})"><path d="M0 0V${L}" stroke="${INK}" stroke-width="34" stroke-linecap="round"/><path d="M0 0V${L}" stroke="${JK}" stroke-width="26" stroke-linecap="round"/>${near ? `<circle cx="0" cy="${L + 20}" r="10" fill="${SLATE}" ${st(2.5)}/><circle cx="0" cy="${L + 20}" r="5.5" fill="${SH}" ${st(1.5)}/>` : ""}${open ? `<g transform="translate(0 ${L + 42})"><path d="M-8 -6L-16 24M0 -6L0 30M8 -6L16 24M16 -2L28 14" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M-8 -6L-16 24M0 -6L0 30M8 -6L16 24M16 -2L28 14" stroke="${BLUE}" stroke-width="4" stroke-linecap="round"/><circle r="15" fill="${BLUE}" ${st(3)}/></g>` : `<circle cx="0" cy="${L + 42}" r="11" fill="${BLUE}" ${st(3)}/>`}</g>`;
  const stickAt = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="#8B5A3A" stroke-width="10" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${TURM}" stroke-width="3" stroke-linecap="round" stroke-dasharray="14 22"/>`;
  const near = S === "wave" ? arm(50, -150, true, 96, true)
    : S === "reach" ? arm(50, -102, true, 128)
    : S === "stick" ? stickAt(158, -20, 158, -440) + arm(50, -52, true)
    : S === "strike" ? stickAt(150, -345, 290, -95) + arm(50, -78, true) + `<path d="M120 -400Q200 -380 260 -300M150 -430Q250 -400 320 -300" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="10 12"/>`
    : arm(50, 12 * sw, true);
  const garland = Array.from({length: 11}, (_, i) => { const t = i / 10, gx = -26 + t * 66, gy = -282 + Math.sin(t * Math.PI) * 50; return `<circle cx="${gx}" cy="${gy}" r="10.5" fill="${i % 2 ? SAFF : TURM}" ${st(2.5)}/>`; }).join("");
  return `<ellipse cx="10" cy="2" rx="120" ry="14" fill="${INK}" opacity=".22"/>`
    + leg(-8, 22 * sw)
    + leg(6, -22 * sw)
    + arm(-44, -12 * sw, false)
    + `<path d="M-12 -302L18 -302L18 -266L-12 -266Z" fill="${BLUE}" ${st(3)}/>`
    + `<path d="M-52 -296Q2 -318 56 -294L58 -210Q54 -192 40 -192L-46 -192Q-58 -220 -52 -296Z" fill="${JK}" ${st(4.5)}/>`
    + `<path d="M-8 -304L30 -304L18 -214Z" fill="${CREAM}" ${st(3)}/>`
    + `<path d="M-8 -304L12 -256L-26 -214M30 -304L14 -256L52 -214" fill="none" stroke="${CREAM}" stroke-width="3"/>`
    + `<path d="M12 -298L20 -290L16 -276L22 -238L12 -222L6 -238L10 -276L4 -290Z" fill="${MADDER}" ${st(2.5)}/>`
    + `<path d="M-24 -214L-34 -196M50 -214L44 -196" fill="none" stroke="${CREAM}" stroke-width="2.5"/>`
    + garland
    + near
    + profile(6, -322, 0.8, {flip: true, moustache: o.moustache, smile: o.smile});
  })()}</g>`; };

/* whirlwind.js */
KIT.whirlwind = function (x, y, s, o) { o = o || {}; const talk = o.state === "talk"; const k = talk ? 1.3 : 0.8; const cy = talk ? -520 : -450; const tube = (d, w, c) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`; return `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="0" cy="6" rx="78" ry="12" fill="${INK}" opacity=".22"/>
  <g transform="translate(-6 ${cy}) scale(${k})">
    <path d="M-120 16C-150 16-150 -26-116 -32C-120 -72-70 -92-44-64C-34-110 24-112 40-70C62-100 118-88 112-40C146-34 144 16 114 16Z" fill="${SLATE}" ${st(4)}/>
    <path d="M-116 16C-80 2-40 12 0 4C40 -4 80 6 116 16Z" fill="${VIOLET}" ${st(3)}/>
    ${talk ? `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-84 -36q8-14 16 0t16 0t16 0t16 0" stroke="${INK}" stroke-width="3.5"/>
      <path d="M-50 -8q8-14 16 0t16 0t16 0" stroke="${VIOLET}" stroke-width="3.5"/>
      <path d="M8 -44q8-14 16 0t16 0t16 0" stroke="${INK}" stroke-width="3.5"/>
      <path d="M30 -10q8-14 16 0t16 0" stroke="${VIOLET}" stroke-width="3.5"/></g>
    <path d="M-40 14L-56 36L-44 36L-54 56L-30 30L-42 30L-30 14Z" fill="${TURM}" ${st(3)}/>
    <path d="M52 14L40 34L50 34L42 50L62 28L52 28L62 14Z" fill="${TURM}" ${st(3)}/>` : ""}
  </g>
  ${tube("M-26 -222Q-56 -190-50 -150", 20, CREAM)}
  ${tube("M-6 -130L-22 -70L-40 -16", 24, BLUE2)}
  ${tube("M10 -130Q30 -80 44 -40L50 -12", 24, BLUE2)}
  <ellipse cx="-48" cy="-6" rx="17" ry="7" fill="${INK}"/>
  <ellipse cx="58" cy="-6" rx="17" ry="7" fill="${INK}"/>
  <path d="M-40 -236Q0 -252 42 -236L50 -172Q58 -120 66 -62Q2 -44-62 -62Q-46 -120-40 -172Z" fill="${CREAM}" ${st(4)}/>
  <path d="M-62 -62Q2 -44 66 -62L68 -50Q2 -32-64 -50Z" fill="${TURM}" ${st(3)}/>
  <path d="M-42 -170Q0 -162 46 -172L46 -158Q0 -150-42 -158Z" fill="${BLUE2}" ${st(3)}/>
  ${tube("M26 -222Q58 -196 66 -160", 20, CREAM)}
  <circle cx="68" cy="-156" r="9" fill="${OCHRE}" ${st(3)}/>
  ${profile(8, -258, 0.92, {flip: true, skin: OCHRE, hair: HAIR, deadpan: false, moustache: false})}
</g>`; };

/* worm.js */
/* worm: Ash as a funny worm. o.phase 0-3: 0 flat, 1 gentle S, 2 tall S, 3 head raised with a floating heart. */
KIT.worm = function (x, y, s, o) {
  o = o || {};
  const ph = Math.min(3, Math.max(0, o.phase === undefined ? 1 : +o.phase));
  const A = [0, 20, 38, 26][ph];          /* sideways wave height */
  const lift = [0, 6, 16, 130][ph];       /* how high the head goes */
  const N = 48;
  const hw = t => 14 + 22 * Math.pow(t, 1.1);            /* half body width, tail thin to neck thick */
  const X = t => -190 + 340 * t;
  const Y = t => -hw(t) - 2 - A * Math.sin(2 * Math.PI * t) - lift * Math.pow(Math.max(0, (t - 0.6) / 0.4), 2);
  const pts = [];
  for (let i = 0; i <= N; i++) { const t = i / N; pts.push([X(t), Y(t), t]); }
  const edge = side => pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(N, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    const w = hw(p[2]) * side;
    return [p[0] - dy / L * w, p[1] + dx / L * w];
  });
  const left = edge(1), right = edge(-1);
  const f = v => v[0].toFixed(1) + " " + v[1].toFixed(1);
  const d = "M" + left.map(f).join("L") + "L" + right.slice().reverse().map(f).join("L") + "Z";

  /* body rings and small madder dots */
  let rings = "", dots = "";
  for (let k = 1; k < 8; k++) {
    const i = Math.round(k * N / 8), p = pts[i], L = left[i], R = right[i];
    const a = pts[i - 1], b = pts[i + 1], tl = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const tx = (b[0] - a[0]) / tl, ty = (b[1] - a[1]) / tl;
    rings += `<path d="M${f(L)}Q${(p[0] + tx * 8).toFixed(1)} ${(p[1] + ty * 8).toFixed(1)} ${f(R)}" fill="none" ${st(3)}/>`;
    const j = Math.round((k + 0.5) * N / 8), q = pts[j];
    dots += `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="5" fill="${MADDER}" ${st(2)}/>`;
  }

  /* head at the right end, facing right (flip), saffron turban, glasses */
  const [ex, ey] = pts[N];
  const hx = ex + 6, hy = ey - 20;
  const head = profile(hx, hy, 0.55, { skin: OCHRE, glasses: true, deadpan: false, hair: HAIR, turban: true, moustache: false, flip: true });
  /* the big heart eye sits on the lens: local (-26,-15) maps to (+14.3,-8.25) when flipped */
  const heart = (tx, ty, k) => `<g transform="translate(${tx} ${ty}) scale(${k})"><path d="M0 14C-30 -6 -22 -34 0 -16C22 -34 30 -6 0 14Z" fill="${MADDER}" ${st(6)}/></g>`;
  const eye = heart((hx + 14.3).toFixed(1), (hy - 8.3).toFixed(1), 0.46);
  const floating = ph === 3 ? heart((hx + 26).toFixed(1), (hy - 100).toFixed(1), 0.9) : "";

  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="20" cy="6" rx="230" ry="12" fill="${INK}" opacity=".22"/>
    <path d="${d}" fill="${OCHRE}" ${st(6)}/>
    ${rings}${dots}
    ${head}${eye}${floating}
  </g>`;
};
