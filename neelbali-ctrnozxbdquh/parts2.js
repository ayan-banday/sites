/* extra scenes for the extreme close-ups: a flat coloured wall behind one big part */
SCENES.closeup = function (o) { o = o || {}; return `<rect x="40" y="40" width="1520" height="820" fill="${o.fill || VIOLET}"/><g opacity=".18" fill="${CREAM}">${Array.from({ length: 12 }, (_, i) => `<circle cx="${140 + i * 125}" cy="${i % 2 ? 90 : 810}" r="9"/>`).join("")}</g>`; };
/* footTap.js: Neel's right foot tapping, side view, heel at (0,0) on the floor. o.state: "up" (toe lifted 20deg) | "down" (flat, with ticks, impact lines and a note). */
KIT.footTap = function (x, y, s, o) { o = o || {}; const down = o.state === "down"; const rot = down ? "" : ` transform="rotate(-20)"`;
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <defs><pattern id="footTapTile" width="60" height="40" patternUnits="userSpaceOnUse"><rect width="60" height="40" fill="${TURM}"/><path d="M0 20L30 0L60 20L30 40Z" fill="${SAFF}" ${st(4)}/><circle cx="30" cy="20" r="5" fill="${CREAM}" ${st(3)}/></pattern></defs>
  <rect x="-250" y="0" width="500" height="60" fill="url(#footTapTile)" ${st(4)}/>
  <ellipse cx="30" cy="2" rx="130" ry="12" fill="${INK}" opacity=".22"/>
  ${down ? `<path d="M-100 -30H-70M-112 -50H-78M-100 -70H-72" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` : ""}
  <g${rot}>
    <path d="M-12 -18C-16 -44 -12 -66 2 -76C14 -82 30 -80 44 -76C70 -68 96 -48 116 -40C130 -36 144 -30 146 -16L146 -12L-4 -12Z" fill="${INK}" ${st(4)}/>
    <path d="M40 -70C66 -62 92 -46 112 -38" fill="none" stroke="${CREAM}" stroke-width="4" stroke-linecap="round"/>
    <path d="M122 -30C132 -26 139 -22 141 -16" fill="none" stroke="${CREAM}" stroke-width="3" stroke-linecap="round"/>
    <path d="M58 -64L66 -58M72 -58L80 -52M86 -52L94 -46" fill="none" stroke="${CREAM}" stroke-width="3" stroke-linecap="round"/>
    <path d="M-16 -26L-16 -22Q-16 -26 -10 -26L8 -26L8 0L-16 0Z" fill="${HAIR}" ${st(4)}/>
    <path d="M-16 -4Q-16 0 -10 0L136 0Q148 0 148 -8Q148 -14 136 -14L-4 -14Q-16 -14 -16 -4Z" fill="${INK}" ${st(4)}/>
    <path d="M-24 -330L28 -330L26 -66C26 -62 24 -60 20 -60L-20 -62C-24 -62 -25 -66 -24 -70Z" fill="${HAIR}" ${st(4)}/>
  </g>
  ${down ? `<path d="M158 -26L174 -36M160 -10L178 -10" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M158 -26L174 -36M160 -10L178 -10" stroke="${CREAM}" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="182" cy="-88" rx="10" ry="8" transform="rotate(-20 182 -88)" fill="${MADDER}" ${st(3)}/>
  <path d="M190 -88V-140" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M190 -88V-140" stroke="${MADDER}" stroke-width="3" stroke-linecap="round"/>
  <path d="M190 -140C202 -132 208 -120 204 -106C200 -116 196 -124 190 -128Z" fill="${MADDER}" ${st(3)}/>` : ""}
</g>`; };
/* latchCloseUp.js: extreme close-up of the gate latch. Frame is 900 x 500 at s=1, centred on (0,0). */
KIT.latchCloseUp = function (x, y, s, o) { o = o || {};
  const shut = o.state === "shut";
  const L = shut ? 20 : (o.state === "mid" ? -190 : -400);
  const bx1 = -240, bx2 = 180;
  const ring = bx => `<path d="M${bx-40} -70H${bx+40}V70H${bx-40}Z M${bx-26} -46V46H${bx+26}V-46Z" fill="${SLATE}" fill-rule="evenodd" ${st(4)}/>` +
    [[-30,-58],[30,-58],[-30,58],[30,58]].map(([dx,dy]) => `<circle cx="${bx+dx}" cy="${dy}" r="5" fill="${INK}"/>`).join("");
  const plate = bx => `<rect x="${bx-52}" y="-96" width="104" height="192" fill="${TURM}" ${st(4)}/>`;
  const studs = [-390,-270,-150,-30,90,210,330].map(sx => [-180,180].map(sy => `<circle cx="${sx}" cy="${sy}" r="16" fill="${TURM}" ${st(3)}/>`).join("")).join("");
  const petals = [0,45,90,135,180,225,270,315].map(a => `<path transform="rotate(${a})" d="M0 0C-22 -18 -22 -44 0 -58C22 -44 22 -18 0 0Z" fill="${BLUE2}" ${st(3)}/>`).join("");
  let sparks = "";
  if (shut) {
    for (let k = 0; k < 8; k++) {
      const a = (22.5 + k * 45) * Math.PI / 180;
      const x1 = (345 + 78 * Math.cos(a)).toFixed(1), y1 = (78 * Math.sin(a)).toFixed(1);
      const x2 = (345 + 106 * Math.cos(a)).toFixed(1), y2 = (106 * Math.sin(a)).toFixed(1);
      sparks += `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>`;
      sparks += `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${CREAM}" stroke-width="4" stroke-linecap="round"/>`;
    }
  }
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-450" y="-250" width="900" height="500" fill="${MADDER}" ${st(5)}/>
    <rect x="-450" y="-142" width="900" height="24" fill="${SLATE}" ${st(4)}/>
    <rect x="-450" y="118" width="900" height="24" fill="${SLATE}" ${st(4)}/>
    ${studs}
    <rect x="300" y="-70" width="110" height="140" fill="${SLATE}" ${st(4)}/>
    <rect x="318" y="-46" width="78" height="92" fill="${VIOLET}" ${st(3)}/>
    ${plate(bx1)}${plate(bx2)}
    <g transform="translate(${L} 0)">
      <path d="M0 -34H340L372 0L340 34H0Z" fill="${INK}" ${st(4)}/>
      <rect x="16" y="-24" width="300" height="7" fill="${SLATE}"/>
      <rect x="16" y="17" width="300" height="7" fill="${SLATE}"/>
      <g transform="translate(60 0)">${petals}<circle r="26" fill="${BLUE}" ${st(3)}/><circle r="10" fill="${TURM}" ${st(3)}/></g>
    </g>
    ${ring(bx1)}${ring(bx2)}
    <rect x="300" y="-70" width="18" height="140" fill="${SLATE}" ${st(4)}/>
    ${sparks}
  </g>`;
};
/* ledgerScroll.js: a long guest-book scroll lying unrolled on the palace floor. Origin = middle of the scroll on the floor line. */
KIT.ledgerScroll = function (x, y, s, o) { o = o || {}; return `<g transform="translate(${x} ${y}) scale(${s})">${(() => {
  const L = Math.min(3, Math.max(1, (o.length | 0) || 1));
  const W = [600, 950, 1300][L - 1], h = W / 2;
  const smud = o.state === "smudged";
  const top = -92, bot = -6, rowsY = [-74, -58, -42, -26];
  const shadow = `<ellipse cx="0" cy="4" rx="${h + 30}" ry="10" fill="${INK}" opacity=".22"/>`;
  const sheet = `<rect x="${-h + 16}" y="${top}" width="${W - 32}" height="${bot - top}" fill="${CREAM}" ${st(4)}/>`;
  const edge = `<path d="M${-h + 16} ${top + 8}H${h - 16}M${-h + 16} ${bot - 8}H${h - 16}" fill="none" stroke="${BLUE2}" stroke-width="3" stroke-linecap="round"/>`;
  let rows = "";
  rowsY.forEach((ry, r) => {
    for (let x0 = -h + 44, i = 0; x0 < h - 80; x0 += 40, i++) {
      if (smud && (i + r) % 4 !== 0) {
        rows += `<ellipse cx="${x0 + 16}" cy="${ry - 3}" rx="${14 + (i % 3) * 3}" ry="${6 + (i % 2) * 2}" fill="${INK}" ${st(2)}/>`;
      } else {
        rows += `<path d="M${x0} ${ry} c6 -8 12 -8 18 0 s12 8 18 0" fill="none" stroke="${(i + r) % 3 === 2 ? BLUE2 : INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
    }
  });
  const seal = `<circle cx="${h - 62}" cy="-50" r="20" fill="${MADDER}" ${st(4)}/><circle cx="${h - 62}" cy="-50" r="9" fill="none" stroke="${CREAM}" stroke-width="2.5"/>`;
  let qs = "";
  if (smud) {
    [-0.55, -0.12, 0.3, 0.62].forEach((f) => {
      const qx = f * h, qy = -50;
      qs += `<circle cx="${qx}" cy="${qy}" r="16" fill="${CREAM}" ${st(3)}/><path d="M${qx - 7} ${qy - 8}Q${qx - 7} ${qy - 16} ${qx} ${qy - 16}Q${qx + 7} ${qy - 16} ${qx + 7} ${qy - 8}Q${qx + 7} ${qy - 3} ${qx} ${qy}L${qx} ${qy + 5}" fill="none" stroke="${MADDER}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${qx}" cy="${qy + 11}" r="2.5" fill="${MADDER}"/>`;
    });
  }
  const rod = (cx) => `<rect x="${cx - 16}" y="${top - 6}" width="32" height="${bot - top + 12}" rx="16" fill="${OCHRE}" ${st(4)}/><circle cx="${cx}" cy="${top - 8}" r="9" fill="${TURM}" ${st(3)}/><circle cx="${cx}" cy="${bot + 4}" r="9" fill="${TURM}" ${st(3)}/>`;
  return shadow + sheet + edge + rows + seal + qs + rod(-(h - 6)) + rod(h - 6);
})()}</g>`; };
KIT.takerPoses = function (x, y, s, o) { o = o || {}; const S = o.state || "stand"; const ask = S === "ask", grab = S === "grab", ref = S === "refused";
const lean = S === "stand" ? "" : `transform="rotate(${grab ? -10 : ask ? -7 : 5} 0 -4)"`;
const arm = (d) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="46" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${TURM}" stroke-width="36" stroke-linecap="round"/>`;
const armF = ask ? "M-40 -262Q-104 -282 -130 -336" : grab ? "M-40 -262Q-120 -246 -178 -256" : ref ? "M-40 -262Q-86 -226 -100 -190" : "M-40 -262Q-100 -256 -124 -300";
const handF = ask ? `<ellipse cx="-138" cy="-346" rx="17" ry="19" fill="${OCHRE}" ${st(3)} transform="rotate(-30 -138 -346)"/><path d="M-150 -358L-162 -372M-142 -366L-150 -382M-132 -362L-134 -378" fill="none" ${st(3)}/>`
  : grab ? `<ellipse cx="-188" cy="-258" rx="16" ry="14" fill="${OCHRE}" ${st(3)}/><path d="M-196 -262Q-212 -256 -208 -238M-190 -268Q-206 -272 -204 -254M-182 -272Q-196 -278 -194 -262" fill="none" ${st(3.2)}/>`
  : ref ? `<ellipse cx="-106" cy="-184" rx="16" ry="18" fill="${OCHRE}" ${st(3)} transform="rotate(30 -106 -184)"/>`
  : `<ellipse cx="-128" cy="-306" rx="16" ry="18" fill="${OCHRE}" ${st(3)} transform="rotate(-20 -128 -306)"/>`;
const head = ref ? "translate(2 -304) rotate(-12)" : grab ? "translate(-6 -322)" : ask ? "translate(-2 -326)" : "translate(0 -318)";
const pupX = grab ? -32 : -20, pupY = ref ? -8 : -14;
const brow = grab ? "M-48 -40Q-18 -60 14 -46" : ref ? "M-48 -30Q-18 -40 14 -32" : "M-48 -36Q-18 -52 14 -40";
const mouth = ref ? `<path d="M-50 40Q-30 44 -18 34L-12 28" fill="none" ${st(3.4)}/>`
  : grab ? `<g transform="translate(-6 4) scale(1.15)"><path d="M56 6Q40 62 -24 40Q22 48 52 2Z" fill="${MADDER}" ${st(3)}/><path d="M52 12Q36 46 -10 36Q20 40 48 8Z" fill="#fff"/><path d="M40 22L38 34M28 28L26 40M14 32L12 40" stroke="${INK}" stroke-width="2.4"/><path d="M56 4Q36 10 18 4Q36 2 56 -2Z" fill="${HAIR}" ${st(2.5)}/></g><path d="M-52 36C-44 42 -34 42 -28 38" fill="none" ${st(3)}/>`
  : `<path d="M56 6Q40 62 -24 40Q22 48 52 2Z" fill="${MADDER}" ${st(3)}/><path d="M52 12Q36 46 -10 36Q20 40 48 8Z" fill="#fff"/><path d="M40 22L38 34M28 28L26 40M14 32L12 40" stroke="${INK}" stroke-width="2.4"/><path d="M56 4Q36 10 18 4Q36 2 56 -2Z" fill="${HAIR}" ${st(2.5)}/><path d="M-52 36C-44 42 -34 42 -28 38" fill="none" ${st(3)}/>`;
const scroll = `<g transform="rotate(${ref ? 24 : -12} 70 -146)"><rect x="18" y="-160" width="108" height="26" rx="13" fill="${CREAM}" ${st(4)}/><circle cx="20" cy="-147" r="11" fill="${TURM}" ${st(3)}/><circle cx="124" cy="-147" r="11" fill="${TURM}" ${st(3)}/><path d="M30 -152H112" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>`;
const sweat = ref ? `<path d="M-50 -352Q-58 -338 -58 -330A8 8 0 0 0 -42 -330Q-42 -338 -50 -352Z" fill="${BLUE}" ${st(2.4)}/>` : "";
return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="4" rx="120" ry="14" fill="${INK}" opacity=".22"/><g ${lean}><path d="M-48 -286C-80 -230 -96 -120 -104 -8Q0 6 104 -8C96 -120 70 -230 46 -286Q0 -300 -48 -286Z" fill="${TURM}" ${st(4)}/><path d="M-104 -8Q0 6 104 -8L104 -26Q0 -10 -104 -26Z" fill="${SAFF}" ${st(3)}/><path d="M-60 -270C-70 -200 -80 -120 -88 -22L-70 -22C-62 -120 -50 -200 -40 -270Z" fill="${SAFF}" ${st(3)}/><path d="M-48 -286Q0 -300 46 -286L42 -270Q0 -282 -44 -270Z" fill="${SAFF}" ${st(3)}/>${scroll}${arm("M40 -262Q96 -230 92 -170")}${arm(armF)}${handF}<g transform="${head} scale(.72 .72)"><path d="M52 -50C54 -10 56 30 40 62C20 78 -10 74 -30 58C-40 52 -42 40 -46 30L-52 24L-46 16L-60 4L-48 -6L-44 -30C-36 -56 -8 -70 22 -68C40 -66 50 -60 52 -50Z" fill="${OCHRE}" ${st(4)}/><path d="M40 -50C18 -82 -26 -78 -46 -40C-30 -56 -4 -62 16 -56C30 -52 38 -44 40 -34Z" fill="${HAIR}" ${st(3)}/><path d="M-30 -62C-10 -70 10 -68 26 -60" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/><ellipse cx="38" cy="2" rx="10" ry="17" fill="${OCHRE}" ${st(3)}/><path d="M-44 -14C-30 -38 4 -34 16 -14C4 2 -32 4 -44 -14Z" fill="#fff" ${st(3)}/><circle cx="${pupX}" cy="${pupY}" r="8" fill="${INK}"/><circle cx="${pupX + 3}" cy="${pupY - 3}" r="2.4" fill="#fff"/><path d="M-46 -20C-30 -28 0 -28 16 -20" fill="none" ${st(3)}/><path d="${brow}" fill="none" stroke="${HAIR}" stroke-width="7" stroke-linecap="round"/>${mouth}</g>${sweat}</g></g>`;
};
/* watchCloseUp.js: extreme close-up of Neel's silver watch. Centre (0,0), about 700 by 700 at s=1. */
KIT.watchCloseUp = function (x, y, s, o) {
  o = o || {};
  const state = o.state || "tick";
  const wet = state === "wet";
  const secAng = state === "tock" ? 128 : 0;
  const drop = (dx, dy, r) => `<path d="M${dx} ${dy - 2 * r} C${dx + r} ${dy - r * 0.2} ${dx + r} ${dy + r * 0.6} ${dx} ${dy + r} C${dx - r} ${dy + r * 0.6} ${dx - r} ${dy - r * 0.2} ${dx} ${dy - 2 * r}Z" fill="${CREAM}" ${st(3)}/>`;
  const hourD = "M-14 16 L-14 -92 L0 -108 L14 -92 L14 16Z";
  const minD = "M-10 18 L-10 -150 L0 -166 L10 -150 L10 18Z";
  const secD = "M0 34 L0 -170";
  const hands = `<g transform="rotate(305)"><path d="${hourD}" fill="${INK}" ${st(4)}/></g>`
    + `<g transform="rotate(60)"><path d="${minD}" fill="${INK}" ${st(4)}/></g>`
    + `<g transform="rotate(${secAng})"><path d="${secD}" fill="none" stroke="${MADDER}" stroke-width="7" stroke-linecap="round"/></g>`;
  const washHands = wet ? `<g fill="${CREAM}" opacity=".45" stroke="none"><g transform="rotate(305)"><path d="${hourD}"/></g><g transform="rotate(60)"><path d="${minD}"/></g><g transform="rotate(${secAng})"><path d="M-4 34 L-4 -170 L4 -170 L4 34Z"/></g></g>` : "";
  const dots = Array.from({ length: 12 }, (_, k) => {
    const a = (k / 12) * 2 * Math.PI - Math.PI / 2;
    return `<circle cx="${(Math.cos(a) * 170).toFixed(1)}" cy="${(Math.sin(a) * 170).toFixed(1)}" r="9" fill="${INK}"/>`;
  }).join("");
  const water = wet ? `<clipPath id="wcDialClip"><circle r="200"/></clipPath>`
    + `<g clip-path="url(#wcDialClip)"><path d="M-220 40Q-110 14 0 40T220 40L220 240L-220 240Z" fill="${VIOLET}" opacity=".6"/></g>`
    + drop(-150, -70, 16) + drop(96, -150, 13) + drop(-30, 30, 11) + drop(160, 50, 14) + drop(-120, 120, 10)
    : "";
  const bezelTicks = Array.from({ length: 60 }, (_, k) => {
    const a = (k / 60) * 2 * Math.PI;
    const r1 = 232, r2 = k % 5 === 0 ? 210 : 220;
    return `<path d="M${(Math.cos(a) * r1).toFixed(1)} ${(Math.sin(a) * r1).toFixed(1)}L${(Math.cos(a) * r2).toFixed(1)} ${(Math.sin(a) * r2).toFixed(1)}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  }).join("");
  return `<g transform="translate(${x} ${y}) scale(${s})">`
    + `<rect x="-360" y="-110" width="720" height="220" fill="${BLUE2}" ${st(5)}/>`
    + `<path d="M-360 -92H360M-360 92H360" stroke="${CREAM}" stroke-width="3" stroke-dasharray="16 12"/>`
    + `<circle r="250" fill="${SLATE}" ${st(5)}/>`
    + `<circle r="214" fill="none" ${st(3)}/>`
    + bezelTicks
    + `<path d="M-199 -115A230 230 0 0 1 -40 -226" fill="none" stroke="${CREAM}" stroke-width="14" stroke-linecap="round"/>`
    + `<circle r="200" fill="${CREAM}" ${st(5)}/>`
    + dots
    + water
    + hands
    + washHands
    + `<circle r="14" fill="${INK}" ${st(3)}/><circle r="5" fill="${CREAM}"/>`
    + `<path d="M140 -160Q146 -124 180 -130Q146 -136 140 -100Q134 -136 100 -130Q134 -124 140 -160Z" fill="${CREAM}" ${st(3)}/>`
    + `</g>`;
};
