// Fest Boss - all pixel art, generated in code. No external files.
// Exports: PAL, registerArt(k), spriteURL(name, frame = 0)

export const PAL = {
  ink: '#1B1530', night: '#2B2350',
  sky: '#8FD3FF', sky2: '#C9EEFF',
  grass: '#6BCB5A', grassDk: '#3E9A47',
  dirt: '#C98B5A', dirtDk: '#8E5A35',
  cream: '#FFF6E5', white: '#FFFFFF',
  riya: '#9B6BFF', riyaDk: '#6A3FD1', riyaLt: '#C9B0FF',
  zib: '#2EC4B6', zibDk: '#168A80', zibLt: '#9BF0E6',
  gorp: '#8DBB3A', gorpDk: '#5E8424', stone: '#8A8F9C', stoneDk: '#5A5F6B',
  heart: '#FF4D6D', heartDk: '#C21E45',
  gold: '#FFC93C', orange: '#FF8A3D', pink: '#FF8FC7', gray: '#B9B4C7',
  // --- Fest Boss 2 additions
  blorb: '#C98B5A', blorbDk: '#9A5F38', blorbLt: '#E8B98A', stache: '#5A3220',
  bunty: '#6E7FD8', buntyDk: '#4656B0', buntyLt: '#A5B1F5',
  boss: '#FFC93C', bossDk: '#E8921F', bossLt: '#FFE88A',
  steel: '#7A8196', steelDk: '#4B5068', steelLt: '#B5BBCE',
  brick: '#D4604F', brickDk: '#97403F', brickLt: '#F08A72',
  pine: '#2F8A63', pineDk: '#1E5E4B', pineLt: '#58B67C',
  lime: '#C6FF4D', cyan: '#7DF9FF', wood: '#A8683C', woodDk: '#6F4125', woodLt: '#D99A5E',
  orangeDk: '#D9601C', grassLt: '#9CE86C', wallLt: '#E9DDF5', wallDk: '#C9B8E0',
};
const P = PAL;
const INK = P.ink;

// ---------------------------------------------------------------- toolkit
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
const rgbCache = {};
function rgba(hex) {
  let v = rgbCache[hex];
  if (!v) {
    v = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16), 255];
    rgbCache[hex] = v;
  }
  return v;
}

class Buf {
  constructor(w, h) { this.w = w; this.h = h; this.p = new Array(w * h).fill(null); }
  set(x, y, c) {
    x = Math.floor(x); y = Math.floor(y);
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.p[y * this.w + x] = c;
  }
  get(x, y) {
    x = Math.floor(x); y = Math.floor(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return null;
    return this.p[y * this.w + x];
  }
  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, typeof c === 'function' ? c(x + i, y + j) : c);
  }
  // ellipse; c may be a colour or fn(x,y,nx,ny)->colour|null
  ell(cx, cy, rx, ry, c, maxY = 1e9) {
    for (let y = Math.floor(cy - ry - 1); y <= Math.ceil(cy + ry + 1); y++) {
      if (y > maxY) continue;
      for (let x = Math.floor(cx - rx - 1); x <= Math.ceil(cx + rx + 1); x++) {
        const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry;
        if (nx * nx + ny * ny <= 1) {
          const col = typeof c === 'function' ? c(x, y, nx, ny) : c;
          if (col) this.set(x, y, col);
        }
      }
    }
  }
  circle(cx, cy, r, c) { this.ell(cx, cy, r, r, c); }
  ring(cx, cy, r0, r1, c) {
    for (let y = Math.floor(cy - r1 - 1); y <= Math.ceil(cy + r1 + 1); y++)
      for (let x = Math.floor(cx - r1 - 1); x <= Math.ceil(cx + r1 + 1); x++) {
        const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
        if (d >= r0 && d <= r1) this.set(x, y, c);
      }
  }
  // even-odd polygon fill
  poly(pts, c) {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const [x, y] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    for (let y = Math.floor(y0); y <= Math.ceil(y1); y++)
      for (let x = Math.floor(x0); x <= Math.ceil(x1); x++) {
        const px = x + 0.5, py = y + 0.5;
        let inside = false;
        for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
          const [xi, yi] = pts[i], [xj, yj] = pts[j];
          if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) inside = !inside;
        }
        if (inside) this.set(x, y, typeof c === 'function' ? c(x, y) : c);
      }
  }
  line(x0, y0, x1, y1, c, t = 1) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.rect(x0, y0, t, t, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }
  // stamp a char grid; map char->colour; '.' = transparent
  stamp(rows, x, y, map, scale = 1) {
    rows.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) {
        const ch = row[i];
        if (ch === '.' || ch === ' ') continue;
        const c = map[ch];
        if (c === undefined) throw new Error('bad grid char ' + ch);
        if (scale === 1) this.set(x + i, y + j, c); else this.rect(x + i * scale, y + j * scale, scale, scale, c);
      }
    });
  }
  blit(src, ox, oy) {
    for (let y = 0; y < src.h; y++) for (let x = 0; x < src.w; x++) {
      const c = src.p[y * src.w + x];
      if (c) this.set(ox + x, oy + y, c);
    }
  }
  // 1px ink outline around every non-empty pixel (4-neighbourhood)
  outline(c = INK) {
    const add = [];
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      if (this.p[y * this.w + x]) continue;
      if (this.get(x - 1, y) || this.get(x + 1, y) || this.get(x, y - 1) || this.get(x, y + 1)) add.push([x, y]);
    }
    for (const [x, y] of add) this.set(x, y, c);
  }
  shear(fn) {
    const np = new Array(this.w * this.h).fill(null);
    for (let y = 0; y < this.h; y++) {
      const d = Math.round(fn(y));
      for (let x = 0; x < this.w; x++) {
        const nx = x + d;
        if (nx >= 0 && nx < this.w) np[y * this.w + nx] = this.p[y * this.w + x];
      }
    }
    this.p = np;
  }
  // ordered dither: density d in 0..16
  dither(x, y, w, h, c, d) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++)
      if (BAYER[(y + j) & 3][(x + i) & 3] < d) this.set(x + i, y + j, c);
  }
  canvas() {
    const cv = document.createElement('canvas');
    cv.width = this.w; cv.height = this.h;
    const ctx = cv.getContext('2d');
    const img = ctx.createImageData(this.w, this.h);
    for (let i = 0; i < this.p.length; i++) {
      const c = this.p[i];
      if (!c) continue;
      const v = rgba(c);
      img.data[i * 4] = v[0]; img.data[i * 4 + 1] = v[1]; img.data[i * 4 + 2] = v[2]; img.data[i * 4 + 3] = v[3];
    }
    ctx.putImageData(img, 0, 0);
    return cv;
  }
}

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// shaded fill: base colour, dark bottom-right, light top-left highlight
function shade(base, dk, lt, k = 0.6) {
  return (x, y, nx, ny) => {
    const s = nx + ny;
    if (s > k) return dk;
    if (((nx + 0.5) / 0.2) ** 2 + ((ny + 0.55) / 0.3) ** 2 < 1) return lt;
    if (s < -1.08) return lt;
    return base;
  };
}

// rotated rectangle as polygon points
function rrect(cx, cy, w, h, ang) {
  const c = Math.cos(ang), s = Math.sin(ang);
  return [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]);
}

function flame(b, x, y, w, h, flick = 0) {
  // teardrop flame with base centre (x, y), tip upward
  const tip = [x + flick, y - h];
  b.poly([[x - w, y], [x - w * 0.9, y - h * 0.4], [x - w * 0.3, y - h * 0.55], tip, [x + w * 0.3, y - h * 0.5], [x + w * 0.9, y - h * 0.35], [x + w, y]], P.heart);
  b.poly([[x - w * 0.75, y], [x - w * 0.6, y - h * 0.35], tip.map((v, i) => i ? v + h * 0.12 : v), [x + w * 0.6, y - h * 0.3], [x + w * 0.75, y]], P.orange);
  b.poly([[x - w * 0.45, y], [x - w * 0.3, y - h * 0.25], [x + flick * 0.5, y - h * 0.62], [x + w * 0.3, y - h * 0.22], [x + w * 0.45, y]], P.gold);
  b.poly([[x - w * 0.2, y], [x, y - h * 0.3], [x + w * 0.2, y]], P.white);
}

const FONT57 = {
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
};
const FONT35 = {
  E: ['111', '100', '111', '100', '111'],
  R: ['110', '101', '110', '101', '101'],
  '#': ['101', '111', '101', '111', '101'],
};
function text(b, str, x, y, font, w, color, scale = 1, gap = 1) {
  for (const ch of str) {
    const g = font[ch];
    g.forEach((row, j) => { for (let i = 0; i < row.length; i++) if (row[i] === '1') b.rect(x + i * scale, y + j * scale, scale, scale, color); });
    x += (w + gap) * scale;
  }
}

// ---------------------------------------------------------------- faces
function eyeOpen(b, x, y, w, h, hl = true) {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    if (w >= 4 && (i === 0 || i === w - 1) && (j === 0 || j === h - 1)) continue;
    b.set(x + i, y + j, INK);
  }
  if (hl) {
    b.set(x + 1, y + 1, P.white);
    if (h >= 5) b.set(x + w - 2, y + h - 2, P.white);
  }
}
function eyeHappy(b, x, y, w, col = INK) {
  if (w >= 4) { [[0, 3], [1, 2], [2, 2], [3, 3], [0, 4], [3, 4]].forEach(([i, j]) => b.set(x + i, y + j - 1, col)); }
  else { [[0, 3], [1, 2], [2, 3], [0, 4], [2, 4]].forEach(([i, j]) => b.set(x + i, y + j - 1, col)); }
}
function eyeSad(b, x, y, w, h, left, col = INK) {
  eyeOpen(b, x, y + 1, w, h - 1, true);
  const brow = w >= 4 ? (left ? [[0, 0], [1, 0], [2, -1], [3, -1]] : [[0, -1], [1, -1], [2, 0], [3, 0]])
    : (left ? [[0, 0], [1, -1], [2, -1]] : [[0, -1], [1, -1], [2, 0]]);
  brow.forEach(([i, j]) => b.set(x + i, y + j, col));
  const tx = left ? x : x + w - 1;
  b.set(tx, y + h + 1, P.sky); b.set(tx, y + h + 2, P.sky); b.set(tx, y + h + 1, P.white);
}

// @@HELPERS-START
// ---------------------------------------------------------------- Indian-flavour helpers (Fest Boss 2 character redesign)
// extra palette for the cast accessories
Object.assign(PAL, {
  riyaHair: '#4A2A94', riyaHairDk: '#2E1A5E',
  dup: '#FF7A1A', dupDk: '#D9501C', dupLt: '#FFB04D',
  bindi: '#E3153F', jhumka: '#FFD23C',
  jasmine: '#FFFFFF', leaf: '#3E9A47',
  kurta: '#FFF6E5', kurtaDk: '#E2D2B4', jhola: '#D9892F', jholaDk: '#9C5A1C',
  gamchaA: '#E3153F', gamchaB: '#FFF6E5', chai: '#C98B3C', chaiDk: '#8E5A22',
  hardhat: '#FFC93C', hardhatDk: '#E8921F',
  oil: '#2A1D3E', oilLt: '#5C4A7A', gold2: '#FFD23C', gold2Dk: '#C98F10',
  vest: '#B7352F', vestDk: '#7E1F26', vestLt: '#E0594C', nehru: '#6B5A9A', nehruDk: '#463B73',
  lanyard: '#FF4D6D', paper: '#FFF6E5',
  vestBlue: '#3F5FA8', vestBlueDk: '#2B4180', vestBlueLt: '#7F9BE0',
});
// first/last painted x on a row (null if empty)
function rowSpan(b, y) {
  let x0 = -1, x1 = -1;
  for (let x = 0; x < b.w; x++) if (b.get(x, y)) { if (x0 < 0) x0 = x; x1 = x; }
  return x0 < 0 ? null : [x0, x1];
}
// fluttering cloth tail leaving (x, y) toward `dir` (-1 = left/back), th tall, wavy; cA body colour, cB hem (bottom pixel)
function flutter(b, x, y, dir, len, th, phase, amp, drift, cA, cB, cC) {
  for (let i = 0; i < len; i++) {
    const wv = Math.round(amp * Math.sin(i * 0.95 + phase) + drift * i);
    const t = i > len - 3 ? Math.max(1, th - 1) : th;
    for (let j = 0; j < t; j++) b.set(x + dir * i, y + wv + j, j === t - 1 ? cB : (j === 0 && cC && i % 2 === 0 ? cC : cA));
  }
}
// @@HELPERS-END

// ---------------------------------------------------------------- Riya (purple jelly girl: bindi, jhumkas, choti + gajra, dupatta, calculator)
const RIYA = [
  { rx: 9.5, ry: 8.5, cy: 13, lean: 0, mood: 'idle', fl: [0, 0], fr: [0, 0], floor: 21, br: [[0, 0], [-1, 1], [-1, 3], [-1, 4]], dp: [0.0, 1.0, 0.3] },
  { rx: 8.5, ry: 9.5, cy: 12, lean: 0, mood: 'idle', fl: [0, 0], fr: [0, 0], floor: 21, br: [[0, 0], [-1, 1], [-2, 3], [-1, 4]], dp: [2.0, 1.0, 0.3] },
  { rx: 10, ry: 7.5, cy: 14, lean: 2, mood: 'idle', fl: [3, -2], fr: [-2, 0], floor: 21, br: [[0, 0], [-2, 1], [-4, 1], [-6, 2]], dp: [0.0, 1.6, -0.35] },
  { rx: 8.5, ry: 9, cy: 12.5, lean: 1, mood: 'idle', fl: [-2, 0], fr: [3, -2], floor: 21, br: [[0, 0], [-2, 1], [-4, 1], [-6, 1]], dp: [3.0, 1.6, -0.35] },
  { rx: 7, ry: 10.5, cy: 11.5, lean: 0, mood: 'jump', fl: [1, -3], fr: [-1, -3], floor: 20, br: [[0, 0], [-2, 1], [-3, 2], [-4, 4]], dp: [1.5, 1.4, -0.5] },
  { rx: 9.5, ry: 9, cy: 12.5, lean: 0, mood: 'happy', fl: [0, 0], fr: [0, 0], floor: 21, br: [[0, 0], [-2, 0], [-3, 2], [-3, 4]], dp: [1.0, 1.4, -0.3] },
  { rx: 10.5, ry: 6.5, cy: 14.5, lean: 0, mood: 'sad', fl: [0, 0], fr: [0, 0], floor: 21, br: [[0, 0], [-1, 1], [-1, 3], [-1, 4]], dp: [0.0, 0.5, 0.6] },
];
function drawRiya(f) {
  const s = RIYA[f];
  const b = new Buf(24, 24);
  const body = new Buf(24, 24);
  const cx = 13, rxs = s.rx * 0.86;
  const lean = (y) => s.lean * Math.max(0, (s.floor - y)) / (s.ry * 2);
  const ox = (y) => Math.round(lean(y));
  const top = Math.floor(s.cy - s.ry);
  // feet
  b.ell(cx - 4 + s.fl[0], s.floor - 0.5 + s.fl[1], 2.6, 1.7, P.riyaDk);
  b.ell(cx + 4 + s.fr[0], s.floor - 0.5 + s.fr[1], 2.6, 1.7, P.riyaDk);
  body.ell(cx, s.cy, rxs, s.ry, shade(P.riya, P.riyaDk, P.riyaLt), s.floor);
  // drips on sad
  if (s.mood === 'sad') { body.rect(5, s.floor - 1, 2, 1, P.riya); body.rect(19, s.floor - 1, 2, 1, P.riyaDk); }
  body.shear(lean);
  b.blit(body, 0, 0);
  const eyeY = Math.round(s.cy - s.ry * 0.45) - 1;
  const dx = ox(eyeY + 2) + 1;
  const xl = 6 + dx, xr = 14 + dx;
  const my = eyeY + 6;
  // hair cap with centre parting
  for (let y = top; y <= top + 1; y++) {
    const sp = rowSpan(b, y); if (!sp) continue;
    for (let x = sp[0]; x <= sp[1]; x++) {
      if (!b.get(x, y)) continue;
      b.set(x, y, x === cx + ox(y) ? P.riyaLt : (x < cx ? P.riyaHair : P.riyaHairDk));
    }
  }
  { const sp = rowSpan(b, top + 2); if (sp) { b.set(sp[0], top + 2, P.riyaHair); b.set(sp[0] + 1, top + 2, P.riyaHair); b.set(sp[1], top + 2, P.riyaHairDk); } }
  // dupatta: scarf band under the mouth + fluttering tail
  const dy0 = Math.min(my + 2, s.floor - 5);
  for (let y = dy0; y <= dy0 + 1; y++) {
    const sp = rowSpan(b, y); if (!sp) continue;
    for (let x = sp[0] - 1; x <= sp[1] + 1; x++) {
      const hem = y === dy0 + 1;
      b.set(x, y, hem ? (x % 3 === 0 ? P.white : P.pink) : (x % 4 === 1 ? P.dupLt : P.dup));
    }
  }
  const sp0 = rowSpan(b, dy0);
  flutter(b, sp0[0] - 1, dy0 + 0, -1, 6, 3, s.dp[0], s.dp[1], s.dp[2], P.dup, P.pink, P.dupLt);
  // braid (choti) trailing from the back of the head, red tie, jasmine gajra
  const bsp = rowSpan(b, top + 3);
  const rx0 = bsp[0] - 1, ry0 = top + 3;
  const bp = s.br.map(([x, y]) => [rx0 + x, ry0 + y]);
  for (let i = 0; i < bp.length - 1; i++) b.line(bp[i][0], bp[i][1], bp[i + 1][0], bp[i + 1][1], P.riyaHair, 3);
  bp.forEach(([x, y], i) => { b.set(x + (i % 2), y, P.riyaHairDk); b.set(x + 1 - (i % 2), y + 1, P.riyaHairDk); b.set(x + (i % 2), y + 2, P.riyaHairDk); });
  const bl = bp[bp.length - 1];
  b.rect(bl[0], bl[1] + 3, 3, 2, P.heart); b.set(bl[0] + 1, bl[1] + 5, P.heartDk);
  // gajra flowers along the braid
  b.set(bp[0][0], bp[0][1], P.white); b.set(bp[0][0] - 1, bp[0][1] + 1, P.white); b.set(bp[1][0] - 1, bp[1][1] + 1, P.white); b.set(bp[1][0], bp[1][1], P.leaf); b.set(bp[2][0] - 1, bp[2][1] + 1, P.white);
  // jhumkas (gold bells at the ears)
  [1].forEach((sd) => {
    const ey = eyeY + 3;
    const sp = rowSpan(b, ey);
    const ex = sd < 0 ? sp[0] : sp[1];
    const jx = sd < 0 ? ex - 1 : ex;
    b.rect(jx, ey, 2, 2, P.jhumka); b.set(jx + (sd < 0 ? 0 : 1), ey + 1, P.orange);
    b.set(jx + (sd < 0 ? 1 : 0), ey + 2, P.jhumka); b.set(jx + (sd < 0 ? 1 : 0), ey, P.white);
  });
  // tiny calculator held at lower right
  const cbx = Math.round(cx + rxs) - 5 + ox(dy0), cby = dy0 - 1;
  b.ell(cbx - 0.5, cby + 5, 1.5, 1.5, P.riyaDk);
  b.rect(cbx, cby, 5, 6, INK);
  b.rect(cbx + 1, cby + 1, 3, 4, P.steelLt);
  b.rect(cbx + 1, cby + 1, 3, 1, P.lime);
  b.set(cbx + 1, cby + 3, P.heart); b.set(cbx + 3, cby + 3, P.pink); b.set(cbx + 2, cby + 4, P.steelDk); b.set(cbx + 1, cby + 4, P.white);
  b.outline();
  // bindi
  b.rect(cx + ox(top + 3) - 1, top + 3, 2, 2, P.bindi);
  b.set(cx + ox(top + 3) - 1, top + 3, P.heartDk);
  // face
  const ck = (s.mood === 'sad') ? null : P.pink;
  if (ck) { b.rect(xl - 1, eyeY + 5, 2, 1, ck); b.rect(xr + 3, eyeY + 5, 2, 1, ck); }
  if (s.mood === 'happy') {
    eyeHappy(b, xl, eyeY, 4); eyeHappy(b, xr, eyeY, 4);
    b.rect(10 + dx, my, 4, 2, INK); b.rect(11 + dx, my + 1, 2, 1, P.heart);
    b.set(10 + dx, my - 1, INK); b.set(13 + dx, my - 1, INK);
  } else if (s.mood === 'sad') {
    eyeSad(b, xl, eyeY, 4, 5, true); eyeSad(b, xr, eyeY, 4, 5, false);
    [[10, 1], [11, 0], [12, 0], [13, 1]].forEach(([i, j]) => b.set(i + dx, my + j, INK));
  } else if (s.mood === 'jump') {
    eyeOpen(b, xl, eyeY, 4, 5); eyeOpen(b, xr, eyeY, 4, 5);
    b.rect(11 + dx, my, 2, 2, INK);
  } else {
    eyeOpen(b, xl, eyeY, 4, 5); eyeOpen(b, xr, eyeY, 4, 5);
    [[10, 0], [11, 1], [12, 1], [13, 0]].forEach(([i, j]) => b.set(i + dx, my + j, INK));
  }
  return b;
}

// ---------------------------------------------------------------- Zib (teal three-eyed bat-thing: Bollywood quiff, kurta, jhola, brush behind the ear, arty specs)
const ZIB = [
  { cy: 13.5, wy: 6, lean: 0, mood: 'idle', fl: [0, 0], fr: [0, 0], ry: 7.5, ant: 0, bag: 0, q: 0 },
  { cy: 12.5, wy: 14, lean: 0, mood: 'idle', fl: [0, 0], fr: [0, 0], ry: 7.5, ant: 0, bag: 1, q: 1 },
  { cy: 13, wy: 5, lean: 2, mood: 'idle', fl: [3, -2], fr: [-2, 0], ry: 7.5, ant: 1, bag: -1, q: 2 },
  { cy: 13.5, wy: 14, lean: 1, mood: 'idle', fl: [-2, 0], fr: [3, -2], ry: 7.5, ant: 1, bag: 1, q: 2 },
  { cy: 12.5, wy: 2, lean: 0, mood: 'jump', fl: [1, -3], fr: [-1, -3], ry: 8.5, ant: 0, bag: -2, q: 3 },
  { cy: 12.5, wy: 4, lean: 0, mood: 'happy', fl: [0, 0], fr: [0, 0], ry: 7.5, ant: 0, bag: -1, q: 1 },
  { cy: 14, wy: 19, lean: 0, mood: 'sad', fl: [0, 0], fr: [0, 0], ry: 6.5, ant: -1, bag: 1, q: -1 },
];
function drawZib(f) {
  const s = ZIB[f];
  const b = new Buf(24, 24);
  const cx = 12.5, rx = 7.5;
  const top = Math.round(s.cy - s.ry);
  const lean = (y) => s.lean * Math.max(0, (22 - y)) / 16;
  const ox = (y) => Math.round(lean(y));
  // wings (behind body)
  const wing = (mirror) => {
    const X = (x) => (mirror ? 25 - x : x);
    const wy = s.wy;
    const root = 11;
    const poly = [[6.5, root - 0.5], [1.5, wy], [3.2, wy + 2.8 * (wy < 10 ? 1 : -1) + (wy < 10 ? 1 : 0)], [4.2, (wy + root + 4) / 2 + 1], [6.5, root + 5]].map(([x, y]) => [X(x), y]);
    b.poly(poly, P.zibDk);
    b.line(X(6), root + 1, X(2), wy + (wy < 10 ? 1 : -0), P.zib);
  };
  wing(false); wing(true);
  // feet
  b.rect(8 + s.fl[0], Math.round(s.cy + 7.5) + s.fl[1] - 1, 3, 2, P.orange);
  b.rect(14 + s.fr[0], Math.round(s.cy + 7.5) + s.fr[1] - 1, 3, 2, P.orange);
  const body = new Buf(24, 24);
  body.ell(cx, s.cy, rx, s.ry, shade(P.zib, P.zibDk, P.zibLt), 99);
  body.shear(lean);
  // face geometry
  const eyeY = Math.round(s.cy - s.ry * 0.5) - 1;
  const dx = ox(eyeY + 2);
  const ex = [6 + dx, 10 + dx, 16 + dx];
  const eys = [eyeY + 1, eyeY, eyeY + 1];
  const my = eyeY + 6;
  // kurta over the lower body (cream, orange hem trim, mandarin collar buttons)
  const ky = my + 2;
  const kb = Math.round(s.cy + s.ry);
  for (let y = ky; y <= kb; y++) for (let x = 0; x < 24; x++) {
    if (!body.get(x, y)) continue;
    let c = P.kurta;
    if (x > cx + 4 + ox(y)) c = P.kurtaDk;
    if (y === kb) c = P.orange;
    if (y === ky) c = P.kurtaDk;
    body.set(x, y, c);
  }
  { const cxk = Math.round(cx) + ox(ky);
    body.set(cxk, ky + 1, P.gold); body.set(cxk, ky + 3, P.gold); body.set(cxk, ky, INK); }
  b.blit(body, 0, 0);
  // hair: cap + Bollywood quiff swooping forward
  const HC = '#173C3F', HL = '#2F7478';
  for (let y = top; y <= top + 1; y++) for (let x = 0; x < 24; x++) if (b.get(x, y) && body.get(x, y) && (x >= 9 + ox(y) || y === top)) b.set(x, y, (y === top && x % 3 === 0) ? HL : HC);
  const qx = 12 + ox(top);
  const ql = s.q === 3 ? -1 : (s.q === 1 ? -1 : 0);
  const qpts = s.q === -1
    ? [[qx - 2, top + 1], [qx, top - 1], [qx + 3, top - 1], [qx + 6, top], [qx + 6, top + 2], [qx + 4, top + 1], [qx + 1, top + 1]]
    : [[qx - 2, top + 1], [qx - 1, top - 1 + ql], [qx + 2, top - 2 + ql], [qx + 5, top - 2 + ql], [qx + 7, top + ql], [qx + 7, top + 3], [qx + 5, top + 1], [qx + 3, top], [qx + 1, top + 1]];
  b.poly(qpts, HC);
  b.line(qx + 1, top - 1 + ql, qx + 4, top - 1 + ql, HL);
  // paint brush tucked behind the ear (back of head, pointing up-left)
  const bx0 = 7 + ox(top + 3), by0 = top + 4;
  const bdx = s.q === -1 ? -2 : -3, bdy = s.q === -1 ? -2 : -4;
  b.line(bx0, by0, bx0 + bdx, Math.max(2, by0 + bdy), P.woodLt, 1);
  b.line(bx0 + 1, by0, bx0 + 1 + bdx, Math.max(2, by0 + bdy), P.wood, 1);
  const btx = bx0 + bdx, bty = Math.max(2, by0 + bdy);
  b.rect(btx - 1, bty - 1, 2, 1, P.steelLt);
  b.rect(btx - 1, bty - 3, 2, 2, P.pink); b.set(btx, bty - 3, P.heart); b.set(btx - 1, bty - 3, P.white);
  // jhola: strap across the kurta + cloth bag at the hip
  b.line(ex[0] + 2, ky, 17 + ox(kb), kb - 2, P.jholaDk);
  const bgx = 17 + ox(kb), bgy = kb - 4 + Math.min(0, s.bag);
  b.rect(bgx, bgy, 5, 5, P.jhola);
  b.rect(bgx, bgy, 5, 2, P.jholaDk);
  b.rect(bgx + 4, bgy + 2, 1, 3, P.jholaDk);
  b.rect(bgx, bgy + 4, 5, 1, P.jholaDk);
  b.set(bgx + 1, bgy + 3, P.gold); b.set(bgx + 2, bgy + 3, P.heart); b.set(bgx + 2, bgy + 2, P.white);
  b.outline();
  // arty round specs on the right eye (red frame)
  {
    const gx = ex[2] + 1.5, gy = eys[2] + 1.5 + (s.mood === 'sad' ? 0.5 : 0);
    for (let y = Math.floor(gy - 5); y <= Math.ceil(gy + 5); y++) for (let x = Math.floor(gx - 5); x <= Math.ceil(gx + 5); x++) {
      const nx = (x + 0.5 - gx) / 3.5, ny = (y + 0.5 - gy) / 3.7;
      const d = nx * nx + ny * ny;
      if (d <= 1 && d > 0.5) b.set(x, y, d > 0.8 ? INK : P.heart);
    }
    b.set(Math.round(gx + 2), Math.round(gy - 2), P.white);
  }
  // face: three eyes
  b.rect(ex[0] - 1, my - 1, 1, 1, P.pink);
  if (s.mood === 'happy') {
    ex.forEach((x, i) => eyeHappy(b, x, eys[i] - 1, 3));
    b.rect(11 + dx, my, 3, 2, INK); b.set(12 + dx, my + 1, P.heart);
  } else if (s.mood === 'sad') {
    ex.forEach((x, i) => {
      if (i === 1) { eyeOpen(b, x, eys[i] + 1, 3, 3); b.set(x, eys[i] - 0, INK); b.set(x + 1, eys[i] - 1, INK); b.set(x + 2, eys[i] - 0, INK); }
      else eyeSad(b, x, eys[i], 3, 4, i === 0);
    });
    [[11, 1], [12, 0], [13, 0], [14, 1]].forEach(([i, j]) => b.set(i + dx, my + j + 0, INK));
  } else if (s.mood === 'jump') {
    ex.forEach((x, i) => eyeOpen(b, x, eys[i], 3, 4));
    b.rect(12 + dx, my, 2, 2, INK);
  } else {
    ex.forEach((x, i) => eyeOpen(b, x, eys[i], 3, 4));
    [[11, 0], [12, 1], [13, 1], [14, 0]].forEach(([i, j]) => b.set(i + dx, my + j, INK));
  }
  return b;
}

// ---------------------------------------------------------------- Gorp (mossy rock golem: walrus moustache, gamcha on the shoulder, cutting-chai glass, tilak, marigold)
const GORP = [
  { dy: 0, lean: 0, mood: 'idle', armL: 0, armR: 0, legL: [0, 0], legR: [0, 0], up: 0, fl: 0 },
  { dy: 1, lean: 0, mood: 'idle', armL: 1, armR: 1, legL: [0, 0], legR: [0, 0], up: 0, fl: 1 },
  { dy: -1, lean: 1, mood: 'idle', armL: -2, armR: 1, legL: [1, -2], legR: [-1, 0], up: 0, fl: 2 },
  { dy: 0, lean: 1, mood: 'idle', armL: 1, armR: -2, legL: [-1, 0], legR: [1, -2], up: 0, fl: 3 },
  { dy: -3, lean: 0, mood: 'jump', armL: -6, armR: -6, legL: [0, -2], legR: [0, -2], up: 1, fl: 4 },
  { dy: -1, lean: 0, mood: 'happy', armL: -5, armR: -5, legL: [0, 0], legR: [0, 0], up: 0, fl: 1 },
  { dy: 2, lean: 0, mood: 'sad', armL: 3, armR: 3, legL: [0, 0], legR: [0, 0], up: 0, fl: 5 },
];
function drawGorp(f) {
  const s = GORP[f];
  const b = new Buf(24, 24);
  const dy = s.dy;
  const bodyTop = 8 + dy - s.up, bodyBot = 19; // rows inclusive (bottom fixed, top moves)
  // legs
  b.rect(7 + s.legL[0], 20 + s.legL[1], 3, 2, P.stoneDk);
  b.rect(14 + s.legR[0], 20 + s.legR[1], 3, 2, P.stoneDk);
  const body = new Buf(24, 24);
  // stone body (rounded rect with chipped top corners)
  for (let y = bodyTop; y <= bodyBot; y++) for (let x = 6; x <= 17; x++) {
    if ((y === bodyTop || y === bodyBot) && (x === 6 || x === 17)) continue;
    let c = P.stone;
    if (x >= 15 || y >= bodyBot - 1) c = P.stoneDk;
    if ((y === bodyTop + 3 && x >= 7 && x <= 9) || (x === 7 && y >= bodyTop + 3 && y <= bodyTop + 5)) c = P.gray;
    body.set(x, y, c);
  }
  // stone texture
  body.set(13, bodyBot - 4, P.stoneDk); body.set(14, bodyBot - 3, P.stoneDk); body.set(9, bodyBot - 2, P.stone);
  // moss cap
  const capY = bodyTop - 3;
  body.ell(11.5, capY + 3.4, 8.3, 3.7, (x, y, nx, ny) => ((nx + ny > 0.55) || y >= capY + 5) ? P.gorpDk : P.gorp, capY + 5);
  [[5, 1], [9, 1], [11, 2], [14, 1], [17, 0]].forEach(([x, d]) => { const dd = s.mood === 'sad' ? d + 1 : d; for (let j = 0; j <= dd; j++) body.set(x, capY + 5 + j, j === dd ? P.gorpDk : P.gorp); });
  body.set(8, capY + 1, P.grass); body.set(9, capY + 1, P.grass); body.set(14, capY + 2, P.grass); body.set(6, capY + 3, P.grass);
  body.shear((y) => s.lean * Math.max(0, 19 - y) / 14);
  b.blit(body, 0, 0);
  // arms (own ink seam)
  const ay = 12 + dy;
  const arm = (x0, off, left) => {
    const y = ay + off;
    b.rect(x0, y, 3, 5, P.stone);
    b.rect(left ? x0 : x0 + 1, y + 3, 2, 2, P.stoneDk);
    b.rect(x0, y, 1, 1, P.gray);
    // seam to body
    b.rect(left ? x0 + 3 : x0 - 1, y, 1, 5, INK);
    if (off < -3) { b.rect(x0, y - 1, 3, 1, P.stone); } // raised arm paw
  };
  arm(2, s.armL, true); arm(19, s.armR, false);
  // gamcha (red/white checked towel) over the left shoulder, tail flaps when running
  {
    const gx = 3 + Math.round(s.lean * 0.5), gy = bodyTop + 2;
    const len = s.mood === 'sad' ? 5 : 7;
    for (let j = 0; j < len; j++) for (let i = 0; i < 4; i++) {
      const sway = j > 3 ? (s.fl === 2 ? -1 : s.fl === 3 ? -2 : s.fl === 1 ? 1 : 0) : 0;
      b.set(gx + i + (j > 4 ? sway : 0), gy + j, ((i >> 1) + (j >> 1)) % 2 ? P.gamchaB : P.gamchaA);
    }
    // fringe tassels
    const sw2 = len > 5 ? (s.fl === 2 ? -1 : s.fl === 3 ? -2 : s.fl === 1 ? 1 : 0) : 0;
    b.set(gx + sw2, gy + len, P.gamchaA); b.set(gx + 2 + sw2, gy + len, P.gamchaA);
    // knot on top of the shoulder
    b.rect(gx, gy - 1, 4, 1, P.gamchaA);
  }
  // cutting chai glass in the right hand (steam rises)
  {
    const gx = 19, gyy = ay + s.armR - 5 + (s.armR < -3 ? -1 : 0);
    b.rect(gx, gyy, 3, 5, INK);
    b.rect(gx + 1, gyy, 1, 1, P.white);
    b.rect(gx, gyy + 1, 3, 1, P.cream);
    b.rect(gx, gyy + 2, 3, 3, P.chai);
    b.set(gx, gyy + 2, P.gold); b.set(gx + 2, gyy + 4, P.chaiDk);
    const st = s.fl % 2;
    b.set(gx + 1 + st, gyy - 2, P.white); b.set(gx + 1 - st + 1, gyy - 3, P.cream);
  }
  // marigold (genda phool) on the moss
  const fx = 15 + Math.round(s.lean), fy = capY + (s.mood === 'sad' ? 0 : -1);
  if (s.mood === 'sad') {
    b.set(fx - 1, fy + 1, P.gray); b.set(fx + 1, fy + 1, P.gray); b.set(fx, fy + 2, P.gray); b.set(fx, fy, P.gray); b.set(fx, fy + 1, P.orange);
    b.set(fx + 1, fy + 2, P.gray);
  } else {
    b.set(fx, fy - 1, P.orange); b.set(fx - 1, fy, P.orange); b.set(fx + 1, fy, P.orange); b.set(fx, fy + 1, P.orange); b.set(fx, fy, P.gold);
    b.set(fx - 1, fy - 1, P.gold); b.set(fx + 1, fy + 1, P.gold);
  }
  b.outline();
  // face (sockets with glowing gold eyes)
  const ey = bodyTop + (s.mood === 'sad' ? 2 : 3);
  const dx = Math.round(s.lean * 0.5);
  const sock = (x, y) => b.rect(x, y, 4, 4, INK);
  sock(7 + dx, ey); sock(13 + dx, ey);
  if (s.mood === 'happy') {
    [7 + dx, 13 + dx].forEach((x) => { b.set(x, ey + 3, P.gold); b.set(x + 1, ey + 2, P.gold); b.set(x + 2, ey + 2, P.gold); b.set(x + 3, ey + 3, P.gold); b.set(x + 1, ey + 1, P.white); });
  } else if (s.mood === 'sad') {
    [7 + dx, 13 + dx].forEach((x) => { b.rect(x + 1, ey + 2, 2, 1, P.orange); b.rect(x + 1, ey + 1, 2, 1, P.gold); });
    b.set(7 + dx, ey + 4, P.sky); b.set(7 + dx, ey + 5, P.sky); b.set(7 + dx, ey + 4, P.white);
    b.set(6 + dx, ey - 1, INK); b.set(7 + dx, ey - 1, INK); b.set(8 + dx, ey - 2, INK); b.set(9 + dx, ey - 2, INK);
  } else {
    [7 + dx, 13 + dx].forEach((x) => { b.rect(x + 1, ey + 1, 2, 2, P.gold); b.set(x + 1, ey + 1, P.white); b.set(x + 2, ey + 2, P.orange); });
  }
  // tilak between the eyes
  b.rect(11 + dx, ey, 2, 3, P.bindi); b.set(11 + dx, ey, P.heartDk); b.set(12 + dx, ey + 3, P.bindi);
  // big walrus moustache
  const M = P.stache, MD = '#33190D', my = ey + 4 + (s.mood === 'sad' ? 1 : 0);
  b.rect(7 + dx, my, 10, 2, M);
  b.rect(7 + dx, my + 1, 10, 1, MD);
  b.set(6 + dx, my + 1, M); b.set(17 + dx, my + 1, M);
  if (s.mood === 'sad') { b.rect(7 + dx, my + 2, 3, 1, MD); b.rect(14 + dx, my + 2, 3, 1, MD); b.set(6 + dx, my + 2, M); b.set(17 + dx, my + 2, M); }
  else { b.set(6 + dx, my, M); b.set(17 + dx, my, M); b.set(5 + dx, my - 1, M); b.set(18 + dx, my - 1, M); b.rect(7 + dx, my + 2, 2, 1, MD); b.rect(15 + dx, my + 2, 2, 1, MD); }
  b.set(11 + dx, my, null); b.set(12 + dx, my, null);
  b.rect(11 + dx, my, 2, 1, MD);
  // mouth peeking under the moustache
  if (s.mood === 'happy') { b.rect(10 + dx, my + 2, 4, 2, INK); b.rect(11 + dx, my + 3, 2, 1, P.heart); }
  else if (s.mood === 'jump') b.rect(11 + dx, my + 2, 2, 2, INK);
  else if (s.mood !== 'sad') b.rect(10 + dx, my + 2, 4, 1, INK);
  return b;
}

// ---------------------------------------------------------------- HUD / FX sprites
const HMAP = { K: INK, R: P.heart, D: P.heartDk, W: P.white, G: P.gray, S: P.stoneDk, g: P.stone };
const HEART = [
  '.KKK.KKK.',
  'KRWRKRRRK',
  'KRWRRRRDK',
  'KRRRRRRDK',
  '.KRRRRDK.',
  '..KRRDK..',
  '...KDK...',
  '....K....',
];
function drawHeart(f) {
  const b = new Buf(9, 8);
  if (f === 0) b.stamp(HEART, 0, 0, HMAP);
  else if (f === 1) {
    b.stamp(HEART, 0, 0, HMAP);
    // crack: zigzag in ink
    [[4, 1], [3, 2], [4, 3], [3, 4], [4, 5], [4, 6]].forEach(([x, y]) => b.set(x, y, INK));
    b.set(5, 2, P.white); b.set(2, 3, P.white);
  } else {
    const m = { ...HMAP, R: P.gray, D: P.gray, W: P.white };
    b.stamp(HEART, 0, 0, m);
    b.set(2, 1, P.gray); b.set(2, 2, P.gray);
  }
  return b;
}

function drawSparkle(f) {
  const b = new Buf(8, 8);
  const cols = [P.gold, P.white, P.pink, P.gold];
  const c = cols[f];
  if (f === 0) { b.rect(3, 3, 2, 2, c); b.set(3, 1, c); b.set(4, 6, c); b.set(1, 4, c); b.set(6, 3, c); }
  else if (f === 1) {
    b.rect(3, 0, 2, 8, P.gold); b.rect(0, 3, 8, 2, P.gold); b.rect(3, 3, 2, 2, P.white);
    b.set(2, 2, P.white); b.set(5, 5, P.white); b.set(5, 2, P.gold); b.set(2, 5, P.gold);
  } else if (f === 2) {
    b.rect(3, 1, 2, 6, P.pink); b.rect(1, 3, 6, 2, P.pink); b.rect(3, 3, 2, 2, P.white);
    b.set(1, 1, P.gold); b.set(6, 1, P.gold); b.set(1, 6, P.gold); b.set(6, 6, P.gold);
  } else { b.set(1, 1, c); b.set(6, 2, P.white); b.set(3, 6, P.pink); b.set(5, 4, P.gold); b.set(2, 4, P.white); }
  return b;
}

function drawSmoke(f) {
  const b = new Buf(16, 16);
  const R = [[5, 3.2, 3.2], [6, 4.6, 4.6], [7, 6, 5.5], [8, 7, 6]][f];
  const puffs = [
    [[8, 11, 3.2], [6, 12, 2.2]],
    [[8, 10, 4.4], [5, 11, 3], [11, 11, 3]],
    [[8, 8, 5], [4, 10, 3.4], [12, 10, 3.4], [8, 12, 3.6]],
    [[8, 6, 4], [3, 9, 2.6], [13, 8, 3], [6, 12, 2.4], [11, 13, 2.4]],
  ][f];
  void R;
  puffs.forEach(([x, y, r]) => b.ell(x, y, r, r, shade(P.gray, P.stone, P.white, 0.55)));
  if (f === 3) { for (let i = 0; i < 40; i++) { const x = (i * 7) % 16, y = (i * 5) % 16; if ((x + y) % 3 === 0 && b.get(x, y) && BAYER[y & 3][x & 3] < 7) b.set(x, y, null); } }
  b.outline();
  return b;
}

function drawShield(f) {
  const b = new Buf(28, 28);
  b.ring(14, 14, 12.4, 13.9, f ? P.zibLt : P.zib);
  b.ring(14, 14, 11.2, 12.4, f ? P.zib : P.zibLt);
  // soft glass fill (sparse dither toward the rim)
  for (let y = 0; y < 28; y++) for (let x = 0; x < 28; x++) {
    const d = Math.hypot(x + 0.5 - 14, y + 0.5 - 14);
    if (d < 11.2 && d > 6 && BAYER[y & 3][x & 3] < (f ? 5 : 3) * (d - 6) / 5.2 && !b.get(x, y)) b.set(x, y, P.zibLt);
  }
  // highlight arc + glints
  [[6, 6], [7, 5], [8, 4], [9, 4], [5, 7], [4, 8], [4, 9], [10, 3]].forEach(([x, y]) => b.set(x + (f ? 1 : 0), y + (f ? 1 : 0), P.white));
  b.set(21, 22, P.white); b.set(22, 21, P.white); b.set(22, 20, P.white);
  b.set(f ? 20 : 22, f ? 5 : 6, P.white);
  return b;
}

function drawStorm(f) {
  const b = new Buf(32, 16);
  const sh = (x, y, nx, ny) => (nx + ny > 0.6 ? P.stone : (nx + ny < -0.75 ? P.white : P.gray));
  const dy = f ? 1 : 0;
  b.ell(16, 9, 14, 5.2, sh, 14);
  b.ell(8, 8.5, 6, 4, sh, 14); b.ell(25, 8.5, 6, 4, sh, 14);
  b.ell(11, 5.5 + dy, 5.2, 4, sh); b.ell(19, 4.5 - dy, 6.5, 3.8, sh); b.ell(24.5, 6.5, 4, 3, sh);
  b.rect(4, 12, 24, 3, P.stone);
  b.outline();
  // angry face
  b.rect(11, 7, 3, 3, INK); b.rect(18, 7, 3, 3, INK);
  b.set(11, 7, P.white); b.set(18, 7, P.white);
  [[10, 5], [11, 5], [12, 6], [13, 6]].forEach(([x, y]) => b.set(x, y, INK));
  [[21, 5], [20, 5], [19, 6], [18, 6]].forEach(([x, y]) => b.set(x, y, INK));
  b.rect(13, 12, 6, 1, INK); b.set(12, 13, INK); b.set(19, 13, INK);
  if (f) { b.set(14, 12, P.white); b.set(16, 12, P.white); b.set(18, 12, P.white); [[27, 11], [26, 12], [27, 13], [26, 14]].forEach(([x, y]) => b.set(x, y, P.gold)); }
  b.set(9, 10, P.pink); b.set(22, 10, P.pink);
  return b;
}

// ---------------------------------------------------------------- obstacles
function drawBudget(f) {
  const b = new Buf(16, 16);
  const j = f ? 1 : 0;
  b.rect(1 + j, 1, 14, 14, P.heart);
  b.rect(1 + j, 1, 14, 3, P.cream);
  // header cells
  b.rect(5 + j, 1, 1, 3, P.gray); b.rect(10 + j, 1, 1, 3, P.gray);
  b.rect(1 + j, 11, 14, 1, P.heartDk); b.rect(1 + j, 14, 14, 1, P.heartDk);
  b.rect(13 + j, 4, 2, 11, P.heartDk);
  b.rect(5 + j, 12, 1, 3, P.heartDk); b.rect(10 + j, 12, 1, 3, P.heartDk);
  text(b, 'ERR', 2 + j, 5, FONT35, 3, P.white);
  b.outline();
  if (f) { b.set(0, 0, P.gold); b.set(15, 0, P.orange); b.set(0, 15, P.gold); b.set(15, 14, P.orange); }
  else { b.set(14, 0, P.gold); b.set(0, 14, P.orange); }
  return b;
}

function drawPosters(f) {
  const b = new Buf(16, 16);
  // puddle + splat
  b.ell(6, 14, 5.6, 1.7, P.pink);
  b.rect(0, 13, 2, 1, P.pink); b.set(2, 11 + f, P.pink); b.set(11, 13, P.pink); b.set(13, 14, P.heart);
  b.set(4, 13, P.white); b.set(5, 13, P.white); b.rect(2, 15, 8, 1, P.heart);
  // bucket lying on its side, opening to the left
  b.rect(7, 3, 8, 8, (x, y) => ((x >= 13 || y >= 9) ? P.stoneDk : (y === 3 ? P.gray : P.stone)));
  b.rect(10, 3, 1, 8, P.stoneDk); b.set(10, 3, P.gray);
  b.ell(7.5, 7, 2.4, 4.4, P.gray);
  b.ell(7.8, 7.3, 1.5, 3.3, P.pink);
  b.set(7, 6, P.white);
  // handle arc
  b.rect(8, 1, 5, 1, P.stoneDk); b.set(8, 2, P.stoneDk); b.set(12, 2, P.stoneDk);
  // paint pouring from the lip
  b.rect(6, 10, 2, 2 + f, P.pink); b.rect(5, 12, 2, 1, P.pink); b.set(6, 10, P.white);
  b.outline();
  b.set(15, 13, null);
  return b;
}

function drawStageOb(f) {
  const b = new Buf(16, 16);
  const j = f ? 1 : 0;
  // bottom crate
  b.rect(1, 8, 14, 8, P.dirt);
  b.rect(1, 8, 14, 1, P.orange);
  b.rect(1, 15, 14, 1, P.dirtDk);
  b.rect(6, 9, 4, 1, P.dirtDk);
  b.line(2, 9, 6, 14, P.dirtDk); b.line(13, 9, 9, 14, P.dirtDk);
  b.rect(1, 8, 2, 8, P.dirtDk); b.rect(13, 8, 2, 8, P.dirtDk);
  b.set(1, 9, P.gray); b.set(13, 9, P.gray); b.set(1, 14, P.gray); b.set(13, 14, P.gray);
  // top plank
  b.rect(2 + j, 2, 12, 3, P.dirt);
  b.rect(2 + j, 2, 12, 1, P.orange);
  b.rect(2 + j, 4, 12, 1, P.dirtDk);
  b.set(4 + j, 3, P.dirtDk); b.set(11 + j, 3, P.dirtDk);
  b.set(8 + j, 3, P.dirtDk); b.set(9 + j, 3, P.dirtDk);
  // middle plank
  b.rect(0, 5, 16, 3, P.dirt);
  b.rect(0, 5, 16, 1, P.orange);
  b.rect(0, 7, 16, 1, P.dirtDk);
  b.set(3, 6, P.gray); b.set(12, 6, P.gray); b.set(7, 6, P.dirtDk); b.set(8, 6, P.dirtDk);
  b.outline();
  return b;
}

function drawFoodOb(f) {
  const b = new Buf(16, 12);
  // flame trail (right), chilli flying left
  flame(b, 14, 10, 2, 6, f ? 1 : -1);
  b.rect(11, 6 + f, 4, 3, P.orange);
  b.rect(12, 7 + f, 3, 1, P.gold);
  // chilli body
  b.poly([[0.5, 7], [3, 3], [7, 2], [12, 3], [12, 8], [8, 8.5], [4, 9]], (x, y) => (y >= 7 ? P.heartDk : (y <= 3 && x < 9 ? P.orange : P.heart)));
  b.set(3, 4, P.white); b.set(4, 3, P.white); b.set(5, 3, P.white);
  b.rect(1, 6, 2, 2, P.heartDk);
  // stem
  b.rect(11, 1, 3, 2, P.grass); b.rect(13, 0, 1, 1, P.grassDk); b.set(11, 2, P.grassDk);
  b.outline();
  // angry eye
  b.rect(8, 5, 2, 2, INK); b.set(8, 5, P.white);
  b.set(7, 4, INK); b.set(8, 4, INK); b.set(9, 4, null);
  return b;
}

function drawGround() {
  const b = new Buf(16, 16);
  b.rect(0, 0, 16, 16, P.dirt);
  b.rect(0, 0, 16, 5, P.grass);
  b.rect(0, 0, 16, 1, P.grassDk);
  b.rect(0, 4, 16, 1, P.grassDk);
  [[2, 1], [3, 2], [9, 1], [10, 2], [14, 2]].forEach(([x, y]) => b.set(x, y, P.gold)); // tiny flower dots? keep subtle
  b.set(2, 1, P.grassDk); b.set(3, 2, P.grassDk); b.set(9, 1, P.grassDk); b.set(10, 2, P.grassDk); b.set(14, 2, P.grassDk);
  b.set(6, 2, P.white);
  // grass blades fringe over dirt
  [1, 4, 7, 10, 13].forEach((x) => { b.set(x, 5, P.grassDk); });
  b.rect(0, 5, 16, 1, P.dirtDk);
  [1, 4, 7, 10, 13].forEach((x) => b.set(x, 5, P.grassDk));
  // dirt texture
  const specks = [[2, 8], [3, 8], [10, 7], [6, 11], [7, 11], [13, 10], [1, 14], [11, 14], [12, 14], [8, 9]];
  specks.forEach(([x, y]) => b.set(x, y, P.dirtDk));
  [[5, 8], [12, 12], [2, 12]].forEach(([x, y]) => b.set(x, y, P.orange));
  b.rect(0, 15, 16, 1, P.dirtDk);
  return b;
}

// ---------------------------------------------------------------- backgrounds
function cloud(b, cx, cy, s) {
  const sh = (x, y, nx, ny) => (ny > 0.35 ? P.sky2 : P.white);
  b.ell(cx, cy, 14 * s, 5 * s, sh);
  b.ell(cx - 9 * s, cy + 1 * s, 8 * s, 4 * s, sh);
  b.ell(cx + 10 * s, cy + 1 * s, 9 * s, 4 * s, sh);
  b.ell(cx - 3 * s, cy - 4 * s, 7 * s, 5 * s, sh);
  b.ell(cx + 5 * s, cy - 3 * s, 6 * s, 4 * s, sh);
}

function sagLine(x0, y0, x1, y1, sag, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + sag * 4 * t * (1 - t)]);
  }
  return pts;
}

function bunting(b, x0, y0, x1, y1, sag, step, cols, ph = 0) {
  const pts = sagLine(x0, y0, x1, y1, sag, 200);
  for (let i = 1; i < pts.length; i++) b.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], INK);
  const n = Math.floor(Math.hypot(x1 - x0, y1 - y0) / step);
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + sag * 4 * t * (1 - t);
    const c = cols[(i + ph) % cols.length];
    b.poly([[x - 3.5, y + 1], [x + 3.5, y + 1], [x, y + 8]], c);
    b.set(x - 3, y + 1, INK); b.set(x + 3, y + 1, INK);
    b.set(x - 1, y + 3, P.white);
  }
}

function tree(b, x, y, s) {
  b.rect(x - 2, y, 4, 22, P.dirtDk);
  b.rect(x - 2, y, 1, 22, P.dirt);
  b.rect(x - 3, y + 20, 6, 2, P.dirtDk);
  const sh = (X, Y, nx, ny) => (nx + ny > 0.5 ? P.grassDk : (nx + ny < -0.8 ? P.gorp : P.grass));
  b.ell(x, y - 8 * s, 12 * s, 11 * s, sh);
  b.ell(x - 10 * s, y - 2 * s, 8 * s, 7 * s, sh);
  b.ell(x + 10 * s, y - 2 * s, 8 * s, 7 * s, sh);
  b.outline();
}

function tuft(b, x, y, c) { b.set(x, y, c); b.set(x - 1, y + 1, c); b.set(x + 1, y + 1, c); }
function flower(b, x, y, c) {
  b.set(x, y, P.gold); b.set(x - 1, y, c); b.set(x + 1, y, c); b.set(x, y - 1, c); b.set(x, y + 1, c);
  b.set(x, y + 2, P.grassDk);
}

function drawCampus() {
  const b = new Buf(320, 180);
  const R = rng(7);
  // sky gradient in bayer bands
  for (let y = 0; y < 180; y++) {
    const d = y < 40 ? 0 : y < 48 ? 3 : y < 58 ? 6 : y < 70 ? 10 : y < 82 ? 13 : 16;
    for (let x = 0; x < 320; x++) b.set(x, y, BAYER[y & 3][x & 3] < d ? P.sky2 : P.sky);
  }
  cloud(b, 36, 24, 1.1); cloud(b, 138, 38, 0.8); cloud(b, 236, 20, 1); cloud(b, 292, 46, 0.7);
  // distant rolling grass hills
  for (let x = 0; x < 320; x++) {
    const h = 118 - Math.round(7 * Math.sin(x / 38 + 1) + 4 * Math.sin(x / 15));
    for (let y = h; y < 130; y++) b.set(x, y, y === h ? P.gorp : P.grass);
  }
  // ground
  b.rect(0, 124, 320, 56, P.grass);
  for (let y = 124; y < 180; y += 8) for (let x = ((y / 8) % 2) * 6; x < 320; x += 12) b.rect(x, y + 3, 5, 1, P.grassDk);
  // path
  const path = (y) => { const t = (y - 124) / 56; return [160 - (9 + 40 * t), 160 + (9 + 40 * t)]; };
  for (let y = 124; y < 180; y++) { const [a, c] = path(y); b.rect(Math.round(a), y, Math.round(c - a), 1, P.dirt); b.set(Math.round(a), y, P.dirtDk); b.set(Math.round(c) - 1, y, P.dirtDk); }
  [[150, 140], [172, 152], [140, 168], [185, 168], [160, 160]].forEach(([x, y]) => { b.set(x, y, P.dirtDk); b.set(x + 1, y, P.dirtDk); });
  // wings
  const wing = (x0) => {
    b.rect(x0, 88, 38, 36, P.cream); b.rect(x0 + 28, 88, 10, 36, P.gray);
    b.poly([[x0 - 3, 88], [x0 + 41, 88], [x0 + 38, 82], [x0, 82]], P.riyaDk);
    b.rect(x0 - 3, 88, 44, 2, P.riya);
    for (let i = 0; i < 4; i++) { b.rect(x0 + 4 + i * 9, 96, 7, 12, INK); b.rect(x0 + 5 + i * 9, 97, 5, 10, P.sky); b.rect(x0 + 5 + i * 9, 97, 5, 3, P.sky2); b.rect(x0 + 7 + i * 9, 97, 1, 10, INK); }
    b.rect(x0 + 3, 109, 30, 2, P.dirtDk);
    b.outline();
  };
  wing(64); wing(218);
  // main block
  b.rect(104, 66, 112, 58, P.cream);
  b.rect(196, 66, 20, 58, P.gray);
  b.rect(104, 120, 112, 4, P.gray);
  // pediment (roof)
  b.poly([[98, 66], [160, 40], [222, 66]], P.orange);
  b.poly([[98, 66], [160, 40], [162, 41], [102, 66]], P.gold);
  b.poly([[160, 40], [222, 66], [216, 66], [160, 44]], P.dirtDk);
  b.rect(98, 64, 124, 4, P.riyaDk); b.rect(98, 64, 124, 1, P.riya);
  for (let i = 0; i < 9; i++) b.rect(110 + i * 12, 66, 1, 2, INK);
  // round clock window
  b.circle(160, 55, 7.5, INK); b.circle(160, 55, 6, P.cream);
  b.line(160, 55, 160, 51, INK); b.line(160, 55, 163, 56, INK);
  b.set(160, 55, P.heart);
  // flag on top
  b.rect(160, 28, 1, 14, INK); b.poly([[161, 28], [171, 31], [161, 34]], P.heart);
  b.outline();
  // FEST banner
  b.rect(120, 70, 80, 20, INK);
  b.rect(121, 71, 78, 18, P.heart);
  b.rect(121, 71, 78, 2, P.pink);
  b.rect(121, 87, 78, 2, P.heartDk);
  b.rect(120, 90, 80, 2, INK);
  for (let i = 0; i < 20; i++) b.rect(121 + i * 4, 90, 2, 3, i % 2 ? P.gold : P.orange);
  text(b, 'FEST', 140 + 1, 74 + 1, FONT57, 5, INK, 2, 1);
  text(b, 'FEST', 140, 74, FONT57, 5, P.white, 2, 1);
  [[124, 74], [194, 74], [124, 85], [194, 85]].forEach(([x, y]) => b.set(x, y, P.gold));
  b.rect(124, 66, 2, 4, INK); b.rect(194, 66, 2, 4, INK);
  // windows main
  const win = (x, y) => { b.rect(x, y, 18, 20, INK); b.rect(x + 1, y + 1, 16, 18, P.sky); b.rect(x + 1, y + 1, 16, 6, P.sky2); b.rect(x + 8, y + 1, 2, 18, INK); b.rect(x + 1, y + 9, 16, 2, INK); b.rect(x - 1, y + 20, 20, 3, P.dirtDk); b.rect(x - 1, y + 20, 20, 1, P.dirt); b.set(x + 3, y + 3, P.white); b.set(x + 4, y + 3, P.white); };
  win(116, 98); win(186, 98);
  // little flower boxes
  [[116, 118], [186, 118]].forEach(([x, y]) => { for (let i = 0; i < 5; i++) { b.set(x + 1 + i * 4, y - 1, [P.pink, P.gold, P.heart, P.pink, P.white][i]); b.set(x + 1 + i * 4, y, P.grass); } });
  // door
  b.rect(148, 96, 24, 28, INK);
  b.poly([[149, 124], [149, 104], [152, 99], [168, 99], [171, 104], [171, 124]], P.dirtDk);
  b.rect(151, 103, 8, 21, P.dirt); b.rect(161, 103, 8, 21, P.dirt);
  b.rect(151, 103, 8, 1, P.orange); b.rect(161, 103, 8, 1, P.orange);
  b.rect(159, 103, 2, 21, INK);
  b.set(157, 114, P.gold); b.set(162, 114, P.gold);
  b.rect(144, 124, 32, 2, P.gray); b.rect(146, 122, 28, 2, P.cream);
  // trees
  tree(b, 22, 86, 1.1); tree(b, 298, 90, 1);
  // bunting
  bunting(b, 6, 56, 116, 64, 10, 10, [P.pink, P.gold, P.zib, P.orange, P.riya, P.heart]);
  bunting(b, 204, 64, 314, 56, 10, 10, [P.riya, P.heart, P.gold, P.zib, P.pink, P.orange], 2);
  // poles
  b.rect(5, 52, 3, 72, INK); b.rect(6, 52, 1, 72, P.dirtDk); b.circle(6.5, 51, 3, P.gold); b.outline();
  b.rect(312, 52, 3, 72, INK); b.rect(313, 52, 1, 72, P.dirtDk); b.circle(313.5, 51, 3, P.gold); b.outline();
  // grass tufts + flowers at the edges, calm in the lower middle
  for (let i = 0; i < 70; i++) {
    const x = Math.floor(R() * 320), y = 128 + Math.floor(R() * 50);
    const nearMid = x > 70 && x < 250 && y > 128;
    if (nearMid) continue;
    if (R() < 0.5) tuft(b, x, y, P.grassDk);
    else flower(b, x, y, [P.pink, P.white, P.heart, P.gold][i % 4]);
  }
  for (let i = 0; i < 10; i++) { const x = (i < 5 ? 8 + i * 12 : 262 + (i - 5) * 11), y = 168 + (i % 3) * 3; flower(b, x, y, [P.pink, P.white, P.heart, P.gold, P.riyaLt][i % 5]); }
  return b;
}

function drawHills() {
  const b = new Buf(320, 60);
  const T = Math.PI * 2 / 320;
  const h1 = (x) => 26 + 8 * Math.sin(T * x * 2 + 0.7) + 5 * Math.sin(T * x * 5 + 2);
  const h2 = (x) => 38 + 7 * Math.sin(T * x * 3 + 2.1) + 3 * Math.sin(T * x * 7);
  for (let x = 0; x < 320; x++) {
    const a = Math.round(h1(x));
    for (let y = a; y < 60; y++) b.set(x, y, y - a < 4 && BAYER[y & 3][x & 3] < (4 - (y - a)) * 4 ? P.sky2 : P.grass);
    const c = Math.round(h2(x));
    for (let y = c; y < 60; y++) b.set(x, y, y === c ? P.gorp : (BAYER[y & 3][x & 3] < 3 && y - c < 5 ? P.gorp : P.grassDk));
  }
  // tiny trees on far hill (fully inside tile)
  const R = rng(3);
  for (let i = 0; i < 16; i++) {
    const x = 6 + Math.floor(R() * 308), y = Math.round(h1(x)) + 1;
    b.ell(x, y - 2, 2.5, 3, P.grassDk); b.set(x - 1, y - 3, P.gorp);
  }
  return b;
}

function drawBushes() {
  const b = new Buf(320, 30);
  const R = rng(11);
  const bush = (cx, w, h) => {
    const sh = (x, y, nx, ny) => (nx + ny > 0.45 ? P.gorpDk : (nx + ny < -0.7 ? P.grass : P.grassDk));
    b.ell(cx, 30 - h + 1, w, h, sh, 29);
    b.ell(cx - w * 0.6, 30 - h * 0.5, w * 0.55, h * 0.6, sh, 29);
    b.ell(cx + w * 0.6, 30 - h * 0.5, w * 0.55, h * 0.6, sh, 29);
  };
  const tmp = new Buf(320, 30);
  const keep = b;
  void tmp; void keep;
  const xs = [18, 62, 104, 150, 196, 238, 282];
  xs.forEach((x, i) => bush(x, 14 + (i % 3) * 3, 9 + (i % 2) * 3));
  // lamp posts
  [40, 128, 216, 300].forEach((x) => {
    b.rect(x, 4, 2, 26, P.stoneDk);
    b.rect(x - 2, 1, 6, 4, P.gold); b.rect(x - 1, 2, 2, 2, P.white);
    b.rect(x - 2, 0, 6, 1, P.stoneDk);
  });
  b.outline();
  // berries (after outline)
  for (let i = 0; i < 36; i++) { const x = 4 + Math.floor(R() * 312), y = 18 + Math.floor(R() * 10); const c = b.get(x, y); if (c === P.grassDk || c === P.gorpDk) b.set(x, y, [P.heart, P.pink, P.gold][i % 3]); }
  // keep ink base line tileable: clear outline columns crossing tile seams
  for (let y = 0; y < 30; y++) { if (b.get(0, y) === INK) b.set(0, y, null); if (b.get(319, y) === INK) b.set(319, y, null); }
  return b;
}

function drawNight() {
  const b = new Buf(320, 180);
  const R = rng(21);
  for (let y = 0; y < 180; y++) {
    // ink at the top fading to night near the horizon (clean dither bands)
    const d = y < 30 ? 0 : y < 40 ? 3 : y < 52 ? 6 : y < 66 ? 10 : y < 82 ? 13 : 16;
    for (let x = 0; x < 320; x++) b.set(x, y, BAYER[y & 3][x & 3] < d ? P.night : P.ink);
  }
  // purple glow along the horizon
  for (let y = 96; y < 126; y++) {
    const d = y < 104 ? 2 : y < 112 ? 4 : y < 119 ? 7 : 10;
    for (let x = 0; x < 320; x++) if (BAYER[y & 3][x & 3] < d) b.set(x, y, P.riyaDk);
  }
  // stars
  for (let i = 0; i < 90; i++) {
    const x = Math.floor(R() * 320), y = Math.floor(R() * 90);
    b.set(x, y, [P.white, P.gold, P.pink, P.zibLt, P.white][i % 5]);
    if (i % 9 === 0) { b.set(x - 1, y, P.white); b.set(x + 1, y, P.white); b.set(x, y - 1, P.white); b.set(x, y + 1, P.white); b.set(x, y, P.gold); }
  }
  // moon
  b.dither(244, 10, 50, 50, P.night, 0);
  for (let y = 6; y < 66; y++) for (let x = 240; x < 300; x++) { const d = Math.hypot(x - 270, y - 36); if (d > 16 && d < 26 && BAYER[y & 3][x & 3] < Math.floor((26 - d) / 1.3)) b.set(x, y, P.night); }
  b.circle(270, 36, 14, (x, y, nx, ny) => (nx + ny > 0.7 ? P.gray : P.cream));
  b.circle(264, 31, 3, P.gray); b.circle(274, 42, 2.4, P.gray); b.circle(277, 31, 1.6, P.gray); b.set(262, 30, P.cream);
  b.circle(270, 36, 14.9, (x, y, nx, ny) => (nx * nx + ny * ny > 0.93 ? INK : null));
  // distant hills silhouette
  for (let x = 0; x < 320; x++) { const h = 112 - Math.round(8 * Math.sin(x / 33 + 2) + 5 * Math.sin(x / 12)); for (let y = h; y < 130; y++) b.set(x, y, P.ink); }
  // ground
  b.rect(0, 126, 320, 54, P.grassDk);
  for (let y = 126; y < 180; y += 9) for (let x = ((y / 9) % 2) * 7; x < 320; x += 14) b.rect(x, y + 4, 4, 1, P.grass);
  b.dither(0, 126, 320, 6, P.ink, 8);
  for (let y = 132; y < 180; y++) if (Math.floor((y - 132) / 8) % 2 === 0) b.dither(0, y, 320, 1, P.ink, 4);
  // stage: back frame
  b.rect(100, 76, 120, 50, P.night); b.dither(100, 76, 120, 50, P.riyaDk, 5);
  // curtain
  b.rect(108, 84, 104, 36, P.riyaDk);
  for (let i = 0; i < 13; i++) b.rect(108 + i * 8, 84, 4, 36, P.riya);
  b.rect(108, 84, 104, 3, P.heartDk);
  for (let i = 0; i < 13; i++) b.poly([[108 + i * 8, 87], [116 + i * 8, 87], [112 + i * 8, 91]], P.heart);
  // star on backdrop
  b.poly([[160, 95], [162, 100], [167, 100], [163, 103], [165, 108], [160, 105], [155, 108], [157, 103], [153, 100], [158, 100]], P.gold);
  // towers + truss
  [96, 214].forEach((x) => { b.rect(x, 70, 10, 56, P.stoneDk); b.rect(x, 70, 3, 56, P.stone); b.line(x, 80, x + 9, 74, INK); b.line(x, 92, x + 9, 86, INK); b.line(x, 104, x + 9, 98, INK); });
  b.rect(94, 66, 124, 8, P.stoneDk); b.rect(94, 66, 124, 2, P.stone);
  for (let i = 0; i < 31; i++) b.line(96 + i * 4, 67, 98 + i * 4, 73, INK);
  // spotlights (soft cones, only over the stage opening)
  [[112, 0, 1], [134, 1, -1], [186, 2, 1], [208, 3, -1]].forEach(([x, k, dir]) => {
    const c = [P.pink, P.gold, P.zib, P.gold][k];
    b.rect(x, 74, 6, 4, INK); b.rect(x + 1, 75, 4, 2, c);
    for (let y = 78; y < 116; y++) {
      const t = (y - 78) / 38; const cx = x + 3 + dir * t * 16; const half = 2 + t * 9;
      for (let xx = Math.floor(cx - half); xx <= Math.ceil(cx + half); xx++) if (BAYER[y & 3][xx & 3] < 2 && b.get(xx, y) !== INK) b.set(xx, y, c);
    }
  });
  // deck
  b.rect(92, 120, 136, 6, INK);
  b.rect(93, 121, 134, 4, P.dirt); b.rect(93, 121, 134, 1, P.orange); b.rect(93, 124, 134, 1, P.dirtDk);
  for (let i = 0; i < 17; i++) b.set(100 + i * 8, 122, P.dirtDk);
  // speakers
  [[84, 0], [228, 1]].forEach(([x]) => { b.rect(x, 104, 12, 22, INK); b.rect(x + 1, 105, 10, 20, P.stoneDk); b.circle(x + 6, 111, 3, INK); b.circle(x + 6, 111, 2, P.stone); b.circle(x + 6, 119, 3.5, INK); b.circle(x + 6, 119, 2.5, P.stone); b.set(x + 5, 110, P.white); b.set(x + 5, 118, P.white); });
  // string lights
  const lights = (x0, y0, x1, y1, sag, n, ph) => {
    const pts = sagLine(x0, y0, x1, y1, sag, 200);
    for (let i = 1; i < pts.length; i++) b.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], P.ink, 1);
    for (let i = 1; i < n; i++) {
      const t = i / n; const x = Math.round(x0 + (x1 - x0) * t), y = Math.round(y0 + (y1 - y0) * t + sag * 4 * t * (1 - t));
      const c = [P.gold, P.pink, P.zib][(i + ph) % 3];
      b.set(x - 1, y + 2, c); b.set(x + 1, y + 2, c); b.set(x, y + 1, c);
      b.rect(x - 1, y + 3, 3, 3, c); b.set(x, y + 4, P.white);
      b.set(x - 2, y + 4, c); b.set(x + 2, y + 4, c);
      b.set(x, y + 7, c);
      b.set(x - 2, y + 6, c); b.set(x + 2, y + 6, c);
      b.set(x - 1, y + 3, c);
    }
  };
  lights(4, 48, 96, 68, 16, 12, 0);
  lights(218, 68, 316, 48, 16, 12, 1);
  lights(106, 66, 214, 66, 10, 14, 2);
  [[4, 40], [315, 40]].forEach(([x, y]) => { b.rect(x - 1, y, 3, 90, INK); b.rect(x, y, 1, 90, P.dirtDk); });
  // tiny crowd silhouettes at the edges (cheering, with glow sticks)
  const person = (x, y, h, arm, c) => {
    b.circle(x, y - h - 3, 3.2, INK);
    b.ell(x, y - h / 2, 4, h / 2 + 1, INK);
    b.rect(x - 4, y - 1, 8, 3, INK);
    // raised arm
    b.rect(x + (arm > 0 ? 3 : -4), y - h - 2, 1, h - 1, INK);
    b.set(x + (arm > 0 ? 3 : -4), y - h - 3, c); b.set(x + (arm > 0 ? 3 : -4), y - h - 4, c);
    b.set(x - 1, y - h - 4, INK); b.set(x + 1, y - h - 4, INK);
  };
  [[14, 160, 9, 1, P.pink], [27, 166, 8, -1, P.gold], [41, 160, 10, 1, P.zib], [279, 164, 9, -1, P.pink], [295, 159, 10, 1, P.gold], [310, 166, 8, -1, P.zib]].forEach(([x, y, h, a, c]) => person(x, y, h, a, c));
  return b;
}

// ---------------------------------------------------------------- props 48x48
function stall(b, burning) {
  // posts
  b.rect(6, 22, 3, 22, P.dirtDk); b.rect(39, 22, 3, 22, P.dirtDk);
  b.rect(6, 22, 1, 22, P.dirt); b.rect(39, 22, 1, 22, P.dirt);
  // back shelf wall
  b.rect(9, 20, 30, 12, burning ? P.stoneDk : P.cream);
  if (!burning) { b.rect(9, 20, 30, 12, P.cream); b.rect(35, 20, 4, 12, P.gray); }
  // counter
  b.rect(4, 32, 40, 12, P.dirt);
  b.rect(4, 32, 40, 2, P.orange);
  b.rect(4, 42, 40, 2, P.dirtDk);
  for (let i = 0; i < 5; i++) b.rect(11 + i * 8, 34, 1, 8, P.dirtDk);
  // pot on counter
  b.ell(16, 29, 7, 4, shade(P.stone, P.stoneDk, P.gray), 31);
  b.rect(9, 27, 14, 1, P.stoneDk);
  // awning
  const awn = (i) => (burning ? (i % 2 ? P.stoneDk : P.stone) : (i % 2 ? P.white : P.heart));
  for (let i = 0; i < 8; i++) { b.rect(3 + i * 5, 11, 5, 10, awn(i)); b.poly([[3 + i * 5, 21], [8 + i * 5, 21], [5.5 + i * 5, 24]], awn(i)); }
  b.poly([[4, 11], [44, 11], [40, 6], [8, 6]], burning ? P.stone : P.heart);
  b.rect(8, 6, 32, 1, burning ? P.gray : P.pink);
  b.rect(3, 20, 42, 1, burning ? P.stoneDk : P.heartDk);
  b.outline();
  // contents
  if (!burning) {
    // food in pot + steam
    b.ell(16, 27, 5, 2, P.orange); b.set(14, 26, P.gold); b.set(18, 26, P.gold); b.set(16, 25, P.heart);
    [[12, 0], [16, 1], [20, 2]].forEach(([x, k]) => { for (let y = 0; y < 5; y++) b.set(x + (y % 2 ? 1 : 0) + (k % 2), 17 - y * 2 + 8 + 0, P.white); });
    // burger + sausage on counter
    b.ell(33, 30, 4, 2.5, P.orange); b.rect(30, 30, 7, 1, P.grass); b.rect(30, 31, 7, 1, P.dirtDk); b.set(32, 28, P.gold); b.set(34, 28, P.gold);
    b.outline();
    // lanterns on awning edge
    [[10, 25], [24, 26], [38, 25]].forEach(([x, y]) => { b.rect(x, y, 3, 3, INK); b.rect(x + 1, y + 1, 1, 1, P.gold); });
    // steam wisps above
    [[14, 3], [18, 1], [22, 4]].forEach(([x, y]) => { [[0, 0], [1, 1], [0, 2], [-1, 3], [0, 4]].forEach(([i, j]) => b.set(x + i, y + j, P.white)); });
  }
}

function drawProp(name) {
  const b = new Buf(48, 48);
  const R = rng(name.length * 13 + name.charCodeAt(5));
  if (name === 'prop_budget_good') {
    const cols = [P.gold, P.pink, P.zib, P.orange, P.heart, P.white, P.riyaLt];
    const burst = (cx, cy, r0, r1, n, off) => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + off, c = cols[i % cols.length];
        b.line(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, c, r1 > 8 ? 2 : 1);
        const ex = cx + Math.cos(a) * (r1 + 1.5), ey = cy + Math.sin(a) * (r1 + 1.5);
        b.rect(Math.round(ex) - 1, Math.round(ey) - 1, 2, 2, c);
        b.set(Math.round(ex + Math.cos(a) * 2.5), Math.round(ey + Math.sin(a) * 2.5), c);
      }
    };
    burst(24, 18, 5, 13, 14, 0.1);
    b.circle(24, 18, 4.5, (x, y, nx, ny) => (nx + ny > 0.3 ? P.orange : P.gold));
    b.circle(24, 18, 2.3, P.white);
    burst(9, 9, 2, 5, 8, 0.4); burst(40, 10, 2, 5, 8, 0.2);
    burst(8, 30, 1, 3, 6, 0); burst(41, 30, 1, 3, 6, 0.5);
    // sparkle trail
    for (let y = 26; y < 38; y += 3) { b.set(24, y, P.gold); b.set(23 + (y % 2) * 2, y + 1, P.orange); }
    // launcher
    b.rect(20, 38, 8, 8, P.stone); b.rect(25, 38, 3, 8, P.stoneDk); b.rect(20, 38, 2, 8, P.gray);
    b.rect(18, 36, 12, 3, P.heart); b.rect(18, 36, 12, 1, P.pink); b.rect(18, 38, 12, 1, P.heartDk);
    b.rect(16, 46, 16, 2, P.dirtDk);
    b.outline();
    // rim lights
    b.set(22, 41, P.white);
  } else if (name === 'prop_budget_bad') {
    // dirt ground
    b.ell(24, 44, 19, 3, P.dirtDk); b.ell(24, 43, 18, 2, P.dirt);
    // rocket lying on its side, nose drooping into the dirt
    const ang = 0.2, cx = 24, cy = 31;
    b.poly(rrect(cx, cy, 26, 12, ang), (x, y) => (y > cy + (x - cx) * 0.2 + 2 ? P.gray : P.cream));
    const ex = cx + Math.cos(ang) * 13, ey = cy + Math.sin(ang) * 13;
    b.poly([[ex - 1, ey - 6], [ex + 8, ey + 2], [ex - 1, ey + 6]], P.heart);
    b.poly([[ex - 1, ey + 1], [ex + 8, ey + 2], [ex - 1, ey + 6]], P.heartDk);
    const tx = cx - Math.cos(ang) * 13, ty = cy - Math.sin(ang) * 13;
    b.poly([[tx + 5, ty - 5], [tx - 4, ty - 10], [tx - 2, ty - 1]], P.heart);
    b.poly([[tx + 5, ty + 5], [tx - 4, ty + 10], [tx - 2, ty + 1]], P.heartDk);
    b.line(Math.round(tx + 6), Math.round(ty - 5), Math.round(tx + 8), Math.round(ty + 6), P.gold, 2);
    b.outline();
    // sad face on the body
    const fx = 19, fy = 28;
    b.rect(fx, fy + 1, 3, 4, INK); b.rect(fx + 6, fy + 2, 3, 4, INK);
    b.set(fx, fy + 1, P.white); b.set(fx + 6, fy + 2, P.white);
    [[0, 0], [1, 0], [2, -1]].forEach(([i, j]) => b.set(fx + i, fy + j, INK));
    [[6, 0], [7, -1], [8, -1]].forEach(([i, j]) => b.set(fx + i, fy + j + 1, INK));
    [[3, 8], [4, 7], [5, 7], [6, 8]].forEach(([i, j]) => b.set(fx + i, fy + j, INK));
    b.set(fx, fy + 6, P.sky); b.set(fx, fy + 7, P.sky); b.set(fx, fy + 6, P.white);
    // limp fuse + weak smoke rising from the tail
    for (let i = 0; i < 5; i++) b.set(Math.round(tx - 5 - i), Math.round(ty - 8 + i * 0.4), INK);
    b.set(Math.round(tx - 10), Math.round(ty - 6), P.orange);
    [[7, 22, 2.6], [9, 16, 2.2], [7, 11, 1.8]].forEach(([x, y, r]) => { b.ell(x, y, r, r, P.gray); b.ring(x, y, r, r + 1, INK); });
    b.set(6, 21, P.white); b.set(8, 15, P.white);
    // spent sparks
    [[38, 17], [41, 23], [34, 11]].forEach(([x, y]) => { b.set(x, y, P.gray); b.set(x, y + 1, P.stoneDk); });
    b.set(36, 19, P.orange);
  } else if (name === 'prop_posters_good') {
    // poster paper
    b.rect(10, 6, 28, 36, P.cream);
    b.rect(35, 6, 3, 36, P.gray);
    b.rect(12, 8, 24, 3, P.heart); b.rect(12, 8, 24, 1, P.pink);
    // sun/star art
    b.circle(24, 22, 8, (x, y, nx, ny) => (nx + ny > 0.4 ? P.orange : P.gold));
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; b.line(24 + Math.cos(a) * 10, 22 + Math.sin(a) * 10, 24 + Math.cos(a) * 13, 22 + Math.sin(a) * 13, P.gold); }
    b.set(21, 19, P.white); b.set(22, 19, P.white);
    b.rect(20, 21, 2, 3, INK); b.rect(26, 21, 2, 3, INK); [[21, 26], [22, 27], [23, 27], [24, 27], [25, 27], [26, 26]].forEach(([x, y]) => b.set(x, y, INK));
    b.rect(18, 25, 2, 1, P.pink); b.rect(28, 25, 2, 1, P.pink);
    // text bars
    b.rect(14, 33, 20, 2, P.riya); b.rect(14, 33, 20, 1, P.riyaLt);
    b.rect(17, 37, 14, 2, P.zib);
    b.outline();
    // pins
    [[12, 4], [35, 4]].forEach(([x, y]) => { b.rect(x, y, 3, 3, P.heart); b.set(x, y, P.pink); });
    // soft golden glow (drawn after the outline so it stays soft)
    for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++) {
      if (b.get(x, y)) continue;
      const dx = Math.max(9 - x, 0, x - 38), dy = Math.max(5 - y, 0, y - 43);
      const d = Math.hypot(dx, dy);
      if (d < 7 && BAYER[y & 3][x & 3] < Math.floor((7 - d) * 1.6)) b.set(x, y, P.gold);
    }
    // sparkles
    [[4, 12], [43, 20], [6, 38], [42, 40], [38, 2], [5, 4]].forEach(([x, y]) => { b.set(x, y, P.white); b.set(x - 1, y, P.white); b.set(x + 1, y, P.white); b.set(x, y - 1, P.white); b.set(x, y + 1, P.white); });
  } else if (name === 'prop_posters_bad') {
    // crooked poster, hanging by one tape, blank and torn
    const ang = -0.22;
    const pts = rrect(24, 26, 26, 34, ang);
    b.poly(pts, (x, y) => ((x - 24) * -Math.sin(ang) + (y - 26) * Math.cos(ang) > 6 ? P.gray : P.cream));
    // torn bottom: jagged cutouts
    const tornY = [40, 38, 41, 37, 40, 38, 42, 39, 41, 38, 40];
    for (let i = 0; i < 11; i++) for (let y = tornY[i]; y < 48; y++) b.set(10 + i * 3, y, null), b.set(11 + i * 3, y, null), b.set(12 + i * 3, y, null);
    // torn right edge
    for (let y = 14; y < 38; y++) { if ((y * 7) % 5 < 2) { b.set(35, y, null); b.set(36, y, null); } }
    // curled corner
    b.poly([[12, 16], [18, 9], [20, 18]], P.gray);
    b.set(14, 14, P.white);
    b.outline();
    // faint blank lines
    for (let i = 0; i < 4; i++) b.rect(15, 20 + i * 4 + 0, 14 - (i % 2) * 4, 1, P.gray);
    // tape
    b.rect(18, 5, 12, 4, P.gold); b.rect(18, 5, 12, 1, P.cream); b.outline();
    // a lonely scribble and a drop of sadness
    b.set(30, 28, P.stoneDk); b.set(31, 29, P.stoneDk); b.set(30, 30, P.stoneDk); b.set(29, 31, P.stoneDk);
    b.set(30, 34, P.stoneDk);
    // fallen scrap + dust
    b.rect(36, 44, 5, 2, P.cream); b.outline();
    b.set(5, 42, P.gray); b.set(7, 44, P.gray); b.set(41, 36, P.gray);
  } else if (name === 'prop_stage_good') {
    // pillars
    b.rect(5, 9, 6, 31, P.stone); b.rect(37, 9, 6, 31, P.stone);
    b.rect(5, 9, 2, 31, P.gray); b.rect(37, 9, 2, 31, P.gray);
    b.rect(9, 9, 2, 31, P.stoneDk); b.rect(41, 9, 2, 31, P.stoneDk);
    // truss
    b.rect(3, 6, 42, 5, P.stoneDk); b.rect(3, 6, 42, 1, P.stone);
    // curtains
    b.rect(11, 12, 26, 26, P.heartDk);
    for (let i = 0; i < 5; i++) b.rect(12 + i * 5, 12, 2, 26, P.heart);
    b.rect(11, 12, 26, 3, P.gold);
    b.poly([[11, 38], [19, 38], [11, 24]], P.heartDk); // swag
    b.poly([[37, 38], [29, 38], [37, 24]], P.heartDk);
    // opening reveals backdrop
    b.poly([[17, 38], [31, 38], [27, 18], [21, 18]], P.night);
    b.poly([[21, 38], [27, 38], [25, 24], [23, 24]], P.riya);
    b.set(24, 21, P.gold); b.set(23, 20, P.gold); b.set(25, 20, P.gold);
    // platform
    b.rect(2, 38, 44, 7, P.dirt); b.rect(2, 38, 44, 1, P.orange); b.rect(2, 44, 44, 1, P.dirtDk);
    for (let i = 0; i < 6; i++) b.rect(8 + i * 7, 40, 1, 4, P.dirtDk);
    // flags
    b.rect(7, 0, 1, 7, P.stoneDk); b.poly([[8, 0], [14, 2.5], [8, 5]], P.pink);
    b.rect(40, 0, 1, 7, P.stoneDk); b.poly([[41, 0], [47, 2.5], [41, 5]], P.zib);
    b.outline();
    // spotlight beams (after outline, soft)
    [[8, P.pink, 1], [40, P.zib, -1], [24, P.gold, 0]].forEach(([x, c, dir]) => {
      for (let y = 11; y < 38; y++) {
        const t = (y - 11) / 27, cx = x + dir * t * 8, half = 1 + t * 3.5;
        for (let xx = Math.floor(cx - half); xx <= Math.ceil(cx + half); xx++) if (xx > 9 && xx < 38 && BAYER[y & 3][xx & 3] < 3 && b.get(xx, y) === P.heartDk) b.set(xx, y, c);
      }
    });
    // lamps
    [[8, P.pink], [16, P.gold], [24, P.zib], [32, P.gold], [40, P.pink]].forEach(([x, c]) => { b.rect(x - 1, 7, 3, 3, c); b.set(x, 8, P.white); });
    // sparkles
    [[3, 20], [44, 24], [24, 30]].forEach(([x, y]) => { b.set(x, y, P.white); b.set(x - 1, y, P.gold); b.set(x + 1, y, P.gold); b.set(x, y - 1, P.gold); b.set(x, y + 1, P.gold); });
  } else if (name === 'prop_stage_bad') {
    // dust puffs at the sides
    [[7, 30, 4], [41, 31, 4], [12, 24, 4], [36, 24, 4], [24, 17, 4]].forEach(([x, y, r]) => { b.ell(x, y, r, r * 0.8, P.gray); b.set(x - 1, y - 1, P.white); });
    b.outline();
    // fallen planks: each one gets its own ink border so the heap reads as separate boards
    const plank = (cx, cy, w, h, ang) => {
      b.poly(rrect(cx, cy, w, h, ang), INK);
      b.poly(rrect(cx, cy, w - 2, h - 2, ang), (x, y) => ((x + y * 2) % 9 === 0 ? P.dirtDk : P.dirt));
      b.poly(rrect(cx - 0.5, cy - h * 0.25, w - 4, 1.2, ang), P.orange);
    };
    plank(24, 41, 42, 7, 0.02);
    plank(17, 33, 30, 7, -0.28);
    plank(31, 32, 28, 7, 0.38);
    plank(14, 24, 20, 6, -0.9);
    plank(33, 23, 20, 6, 0.95);
    plank(24, 27, 24, 6, 0.1);
    // nails + splinters
    [[9, 41], [38, 40], [24, 27], [13, 31], [34, 30]].forEach(([x, y]) => { b.set(x, y, P.gray); });
    [[3, 40], [45, 41], [8, 15], [41, 14]].forEach(([x, y]) => { b.set(x, y, INK); b.set(x + 1, y - 1, INK); b.set(x + 1, y, P.dirt); });
    // curtain scrap
    b.poly([[20, 24], [29, 22], [31, 28], [22, 29]], INK); b.poly([[21, 25], [28, 23.5], [29.5, 27.5], [22.5, 28]], P.heartDk); b.rect(24, 24, 1, 4, P.heart);
    // dizzy stars
    [[12, 8], [24, 4], [36, 8]].forEach(([x, y]) => { b.set(x, y, P.gold); b.set(x + 1, y + 1, P.gold); b.set(x - 1, y + 1, P.gold); b.set(x, y + 2, P.gold); b.set(x, y + 1, P.white); });
  } else if (name === 'prop_food_good') {
    stall(b, false);
  } else if (name === 'prop_food_bad') {
    stall(b, true);
    // flames over the awning and counter
    [[10, 12, 5, 11, 1], [20, 9, 6, 15, -1], [31, 11, 5, 12, 1], [40, 12, 4, 9, -1], [14, 6, 3, 7, 1], [26, 3, 3, 8, 1]].forEach(([x, y, w, h, f]) => flame(b, x, y + 4, w, h, f));
    flame(b, 20, 31, 5, 8, 1); flame(b, 36, 31, 3, 6, -1);
    // smoke
    [[7, 4, 3], [4, 2, 2], [38, 3, 3], [30, 0, 2]].forEach(([x, y, r]) => { b.ell(x, y, r, r, P.stoneDk); b.set(x - 1, y - 1, P.stone); });
    b.outline();
    // soot
    [[14, 36], [24, 40], [34, 36]].forEach(([x, y]) => { b.rect(x, y, 3, 2, INK); });
  }
  return b;
}

// ---------------------------------------------------------------- badges + task icons
function medal(bg, bgDk, ribbon, ribbonDk) {
  const b = new Buf(24, 24);
  b.poly([[6, 15], [12, 15], [12, 23], [9, 21], [6, 23]], ribbon);
  b.poly([[12, 15], [18, 15], [18, 23], [15, 21], [12, 23]], ribbonDk);
  b.circle(12, 10.5, 10, (x, y, nx, ny) => (nx + ny > 0.55 ? P.orange : P.gold));
  b.outline();
  b.circle(12, 10.5, 7.8, INK);
  b.circle(12, 10.5, 7, (x, y, nx, ny) => (nx + ny > 0.6 ? bgDk : bg));
  return b;
}

function drawBadge(name) {
  if (name === 'badge_situational') {
    const b = medal(P.cream, P.gray, P.zib, P.zibDk);
    b.stamp([
      '......O......',
      '.....OOO.....',
      '....OOOOO....',
      '......O......',
      '..T...O...Y..',
      '.TT...O...YY.',
      'TTTTTTKYYYYYY',
      '.TT...P...YY.',
      '..T...P...Y..',
      '......P......',
      '....PPPPP....',
      '.....PPP.....',
      '......P......',
    ], 6, 4, { O: P.orange, Y: P.gold, P: P.pink, T: P.zib, K: INK });
    b.rect(5, 10, 2, 1, P.zibDk);
    return b;
  }
  if (name === 'badge_micromanager') {
    const b = medal(P.orange, P.heartDk, P.heart, P.heartDk);
    b.circle(10.5, 9, 4.8, INK); b.circle(10.5, 9, 3.6, (x, y, nx, ny) => (nx + ny > 0.5 ? P.sky : P.sky2));
    b.set(9, 7, P.white); b.set(10, 7, P.white); b.set(8, 8, P.white);
    b.line(14, 12, 18, 16, INK, 3); b.line(14, 12, 18, 16, P.dirt, 1);
    b.rect(12, 5, 1, 1, INK);
    // tiny eyes peeking in the glass
    b.set(9, 10, INK); b.set(12, 10, INK);
    return b;
  }
  if (name === 'badge_ghost') {
    const b = medal(P.riya, P.riyaDk, P.pink, P.heart);
    const g = new Buf(24, 24);
    g.ell(12, 8.5, 4.6, 4.6, P.white);
    g.rect(7, 9, 10, 6, P.white);
    [[7, 15], [11, 15], [15, 15]].forEach(([x]) => g.rect(x, 15, 2, 2, P.white));
    g.rect(9, 15, 2, 1, null); g.rect(13, 15, 2, 1, null);
    g.set(8, 16, null);
    g.rect(15, 9, 2, 6, P.riyaLt);
    b.blit(g, 0, 0);
    // ink outline for ghost only
    const o = new Buf(24, 24); o.p = g.p.slice(); o.outline();
    for (let i = 0; i < o.p.length; i++) if (o.p[i] === INK) b.p[i] = INK;
    b.blit(g, 0, 0);
    b.rect(9, 8, 2, 3, INK); b.rect(13, 8, 2, 3, INK); b.set(9, 8, P.white); b.set(13, 8, P.white);
    b.rect(11, 12, 2, 1, INK);
    b.set(8, 11, P.pink); b.set(15, 11, P.pink);
    return b;
  }
  const b = medal(P.sky, P.zib, P.zib, P.zibDk);
  b.rect(7, 5, 10, 10, INK);
  b.rect(8, 6, 8, 8, P.zibLt);
  b.rect(8, 6, 8, 2, P.white); b.rect(8, 6, 2, 8, P.white);
  b.rect(14, 8, 2, 6, P.sky); b.rect(8, 12, 8, 2, P.sky);
  b.rect(9, 9, 2, 3, INK); b.rect(13, 9, 2, 3, INK); b.set(9, 9, P.white); b.set(13, 9, P.white);
  b.rect(11, 12, 2, 1, INK);
  b.set(8, 11, P.pink); b.set(15, 11, P.pink);
  // ice glints
  b.set(5, 4, P.white); b.set(4, 5, P.white); b.set(18, 14, P.white);
  return b;
}

function drawTask(name) {
  const b = new Buf(24, 24);
  if (name === 'task_budget') {
    b.rect(3, 2, 18, 20, P.cream);
    b.rect(3, 2, 18, 4, P.grass); b.rect(3, 5, 18, 1, P.grassDk);
    for (let i = 1; i < 3; i++) b.rect(3 + i * 6, 6, 1, 16, P.gray);
    for (let j = 0; j < 3; j++) b.rect(3, 10 + j * 4, 18, 1, P.gray);
    b.rect(5, 16, 3, 5, P.heart); b.rect(10, 12, 3, 9, P.gold); b.rect(16, 14, 3, 7, P.zib);
    b.rect(5, 16, 1, 5, P.pink); b.rect(10, 12, 1, 9, P.cream); b.rect(16, 14, 1, 7, P.zibLt);
    b.rect(5, 3, 3, 1, P.white);
    b.outline();
    b.set(6, 8, INK); b.set(11, 8, INK); b.set(15, 8, INK);
  } else if (name === 'task_posters') {
    b.poly(rrect(12, 12, 14, 18, -0.15), P.cream);
    b.rect(7, 5, 11, 12, P.pink);
    b.poly([[12, 6], [13.3, 9.3], [17, 9.5], [14, 11.8], [15, 15.2], [12, 13], [9, 15.2], [10, 11.8], [7, 9.5], [10.7, 9.3]], P.gold);
    b.rect(8, 19, 9, 1, P.riya);
    b.outline();
    b.rect(11, 2, 3, 3, P.heart); b.set(11, 2, P.pink); b.outline();
    b.set(12, 11, INK);
    b.set(18, 20, P.gold); b.set(20, 19, P.pink);
  } else if (name === 'task_stage') {
    b.rect(2, 17, 20, 5, P.dirt); b.rect(2, 17, 20, 1, P.orange); b.rect(2, 21, 20, 1, P.dirtDk);
    b.rect(3, 4, 18, 13, P.night);
    b.rect(3, 4, 5, 13, P.heart); b.rect(16, 4, 5, 13, P.heart); b.rect(3, 4, 18, 2, P.gold);
    b.rect(6, 6, 1, 11, P.heartDk); b.rect(17, 6, 1, 11, P.heartDk);
    b.poly([[10, 6], [14, 6], [16, 17], [8, 17]], P.gold);
    b.set(12, 10, P.white); b.set(11, 11, P.white);
    b.rect(10, 12, 4, 5, P.riya);
    b.outline();
    b.set(6, 3, P.pink); b.set(18, 3, P.zib);
  } else {
    // burger
    b.ell(12, 8, 9, 5, (x, y, nx, ny) => (nx + ny > 0.45 ? P.orange : P.gold), 11);
    [[8, 5], [12, 4], [16, 6], [10, 7]].forEach(([x, y]) => b.set(x, y, P.cream));
    b.rect(3, 12, 18, 2, P.grass); b.rect(4, 14, 16, 1, P.grassDk);
    b.rect(3, 14, 18, 3, P.dirtDk); b.rect(3, 14, 18, 1, P.dirt);
    b.rect(4, 17, 16, 2, P.heart);
    b.ell(12, 20, 9, 3, (x, y, nx, ny) => (nx + ny > 0.5 ? P.orange : P.gold), 22);
    b.rect(3, 19, 18, 1, P.gold);
    b.outline();
    b.set(9, 3, P.white); b.set(10, 3, P.white);
  }
  return b;
}

// ================================================================ FEST BOSS 2 ART
// ---------------------------------------------------------------- shared helpers (new)
// WBuf: horizontally wrapping buffer so parallax layers tile seamlessly (set/get wrap on x)
class WBuf extends Buf {
  set(x, y, c) { x = Math.floor(x); x = ((x % this.w) + this.w) % this.w; super.set(x, y, c); }
  get(x, y) { x = Math.floor(x); x = ((x % this.w) + this.w) % this.w; return super.get(x, y); }
}
function sweat(b, x, y) { // small water drop with ink edge
  b.set(x, y, INK); b.set(x - 1, y + 1, INK); b.set(x + 1, y + 1, INK);
  b.set(x, y + 1, P.sky2); b.set(x - 1, y + 2, INK); b.set(x + 1, y + 2, INK); b.set(x, y + 2, P.sky);
  b.set(x, y + 3, INK);
}

// ---------------------------------------------------------------- Boss (the player: gold blob, backwards cap, walkie-talkie, college ID lanyard)
const BOSS = [
  { rx: 9, ry: 8, cy: 13.5, lean: 0, mood: 'idle', fl: [0, 0], fr: [0, 0], floor: 21 },
  { rx: 8, ry: 9, cy: 12.5, lean: 0, mood: 'idle', fl: [0, 0], fr: [0, 0], floor: 21 },
  { rx: 9.5, ry: 7.5, cy: 14, lean: 2, mood: 'idle', fl: [3, -2], fr: [-2, 0], floor: 21 },
  { rx: 8.5, ry: 8.5, cy: 13, lean: 1, mood: 'idle', fl: [-2, 0], fr: [3, -2], floor: 21 },
  { rx: 7.5, ry: 9.5, cy: 12.5, lean: 0, mood: 'jump', fl: [1, -3], fr: [-1, -3], floor: 20 },
  { rx: 9, ry: 8.5, cy: 13, lean: 0, mood: 'happy', fl: [0, 0], fr: [0, 0], floor: 21 },
  { rx: 10, ry: 6.5, cy: 15, lean: 0, mood: 'sad', fl: [0, 0], fr: [0, 0], floor: 21 },
];
function drawBoss(f) {
  const s = BOSS[f];
  const b = new Buf(24, 24);
  const cx = 12;
  const lean = (y) => s.lean * Math.max(0, (s.floor - y)) / (s.ry * 2);
  const capY = Math.round(s.cy - s.ry);
  b.ell(cx - 4.5 + s.fl[0], s.floor - 0.5 + s.fl[1], 2.6, 1.7, P.bossDk);
  b.ell(cx + 4.5 + s.fr[0], s.floor - 0.5 + s.fr[1], 2.6, 1.7, P.bossDk);
  const body = new Buf(24, 24);
  body.ell(cx, s.cy, s.rx, s.ry, (x, y, nx, ny) => {
    const sh = nx + ny;
    if (sh > 0.62) return P.orange;
    if (y > s.cy + s.ry * 0.5 && sh > 0.1) return P.bossDk;
    if (((nx + 0.45) / 0.22) ** 2 + ((ny + 0.5) / 0.32) ** 2 < 1) return P.bossLt;
    return P.boss;
  }, s.floor);
  body.shear(lean);
  b.blit(body, 0, 0);
  const ax = Math.round(lean(s.cy + 3));
  const up = s.mood === 'jump' || s.mood === 'happy';
  if (s.mood !== 'sad') {
    b.ell(cx - s.rx + 0.5 + ax, s.cy + (up ? -2 : 3), 1.6, 1.6, P.bossDk);
    b.ell(cx + s.rx - 0.5 + ax, s.cy + (up ? -2 : 3), 1.6, 1.6, P.bossDk);
  }
  // backwards cap: dome + bill pointing back (left)
  const cdx = Math.round(lean(capY + 2));
  b.ell(cx + cdx + 0.5, capY + 3, 6.3, 3.6, (x, y, nx, ny) => (nx + ny > 0.45 ? P.heartDk : (ny < -0.5 && nx < 0.2 ? P.pink : P.heart)), capY + 3);
  b.poly([[cx + cdx - 4, capY + 1.6], [cx + cdx - 10, capY + 2.4], [cx + cdx - 10, capY + 4], [cx + cdx - 3, capY + 4]], P.heartDk);
  b.rect(cx + cdx - 3, capY + 3, 9, 1, P.heartDk);
  b.set(cx + cdx + 1, capY - 1, P.heartDk);
  // walkie-talkie in the right hand (front)
  const wx = cx + Math.round(s.rx) - 3 + ax, wy = Math.round(s.cy) + (up ? -4 : 0);
  b.rect(wx, wy, 4, 6, INK); b.rect(wx + 1, wy + 1, 2, 4, P.steel); b.set(wx + 1, wy + 1, P.cyan); b.set(wx + 2, wy + 1, P.cyan);
  b.set(wx + 1, wy + 3, P.steelLt); b.set(wx + 2, wy + 4, P.steelDk);
  b.rect(wx + 3, wy - 4, 1, 4, INK);
  // college ID lanyard: strap down the left side to a hanging ID card
  {
    const ey0 = capY + 5;
    const ky = Math.min(ey0 + 6, s.floor - 4);
    const kx = cx - 8 + Math.round(lean(ky));
    const sx = cx - 6 + Math.round(lean(ey0));
    b.line(sx, ey0 + 1, kx + 1, ky - 1, P.lanyard);
    b.rect(kx + 1, ky - 1, 1, 1, P.lanyard);
    b.line(sx - 1, ey0 + 1, kx, ky - 1, P.heartDk);
    b.rect(kx, ky, 5, 5, INK);
    b.rect(kx + 1, ky + 1, 3, 3, P.white);
    b.rect(kx + 1, ky + 1, 3, 1, P.heart);
    b.set(kx + 1, ky + 2, P.steel); b.set(kx + 2, ky + 2, P.steelLt); b.set(kx + 1, ky + 3, P.steelDk); b.set(kx + 2, ky + 3, P.steel); b.set(kx + 3, ky + 3, P.gray);
  }
  b.outline();
  b.set(wx + 3, wy - 5, P.lime);
  // face
  const eyeY = capY + 5;
  const dx = Math.round(lean(eyeY + 2));
  const xl = 6 + dx, xr = 14 + dx;
  const my = eyeY + 6;
  if (s.mood !== 'sad') { b.set(xl - 1, eyeY + 5, P.pink); b.set(xl, eyeY + 5, P.pink); b.set(xr + 3, eyeY + 5, P.pink); b.set(xr + 4, eyeY + 5, P.pink); }
  const brow = (x, left, lift = 0) => {
    const pts = left ? [[0, 0], [1, 0], [2, 1], [3, 1]] : [[0, 1], [1, 1], [2, 0], [3, 0]];
    pts.forEach(([i, j]) => b.set(x + i, eyeY - 1 + j + lift, INK));
  };
  if (s.mood === 'happy') {
    eyeHappy(b, xl, eyeY, 4); eyeHappy(b, xr, eyeY, 4);
    b.rect(10 + dx, my, 4, 2, INK); b.rect(11 + dx, my + 1, 2, 1, P.heart);
    b.set(10 + dx, my - 1, INK); b.set(13 + dx, my - 1, INK);
  } else if (s.mood === 'sad') {
    eyeSad(b, xl, eyeY, 4, 5, true); eyeSad(b, xr, eyeY, 4, 5, false);
    [[10, 1], [11, 0], [12, 0], [13, 1]].forEach(([i, j]) => b.set(i + dx, my + j - 1, INK));
  } else if (s.mood === 'jump') {
    eyeOpen(b, xl, eyeY, 4, 5); eyeOpen(b, xr, eyeY, 4, 5);
    brow(xl, true, -1); brow(xr, false, -1);
    b.rect(11 + dx, my, 2, 2, INK);
  } else {
    eyeOpen(b, xl, eyeY + 1, 4, 5); eyeOpen(b, xr, eyeY + 1, 4, 5);
    brow(xl, true); brow(xr, false);
    [[10, 0], [11, 1], [12, 1], [13, 0]].forEach(([i, j]) => b.set(i + dx, my + j + 1, INK));
  }
  return b;
}

// ---------------------------------------------------------------- Blorb (Dean uncle: round specs, walrus moustache, knit sweater-vest, tie, pen pocket, tilak, ear tufts, namaste)
const BLORB = [
  { rx: 13, ry: 11, cy: 18.5, lean: 0, mood: 'idle', fl: [0, 0], fr: [0, 0], floor: 29, tie: 0 },
  { rx: 12, ry: 12, cy: 17.5, lean: 0, mood: 'idle', fl: [0, 0], fr: [0, 0], floor: 29, tie: 0 },
  { rx: 13.5, ry: 10, cy: 19.5, lean: 3, mood: 'idle', fl: [4, -2], fr: [-3, 0], floor: 29, tie: -1 },
  { rx: 12.5, ry: 11, cy: 18.5, lean: 2, mood: 'idle', fl: [-3, 0], fr: [4, -2], floor: 29, tie: -1 },
  { rx: 10.5, ry: 13.5, cy: 16, lean: 0, mood: 'jump', fl: [1, -3], fr: [-1, -3], floor: 28, tie: -2 },
  { rx: 13, ry: 11, cy: 18, lean: 0, mood: 'happy', fl: [0, 0], fr: [0, 0], floor: 29, tie: 0 },
  { rx: 14, ry: 9.5, cy: 19.5, lean: 0, mood: 'sad', fl: [0, 0], fr: [0, 0], floor: 29, tie: 1 },
];
function drawBlorb(f) {
  const s = BLORB[f];
  const b = new Buf(32, 32);
  const cx = 16;
  const lean = (y) => s.lean * Math.max(0, (s.floor - y)) / (s.ry * 2);
  b.ell(cx - 6 + s.fl[0], s.floor - 0.5 + s.fl[1], 3.4, 1.9, P.stache);
  b.ell(cx + 6 + s.fr[0], s.floor - 0.5 + s.fr[1], 3.4, 1.9, P.stache);
  const body = new Buf(32, 32);
  body.ell(cx, s.cy, s.rx, s.ry, shade(P.blorb, P.blorbDk, P.blorbLt, 0.55), s.floor);
  body.shear(lean);
  b.blit(body, 0, 0);
  // sweater-vest (blue argyle knit, V-neck with shirt showing)
  const ty = s.floor - 7;
  const tx = Math.round(cx + lean(ty) + s.tie * 0.5);
  for (let y = ty - 1; y <= s.floor; y++) for (let x = 0; x < 32; x++) {
    if (!body.get(x, y)) continue;
    const dxv = Math.abs(x - tx);
    const vTop = ty - 1 + Math.max(0, 5 - dxv);
    if (y < vTop) { if (dxv <= 5) b.set(x, y, y === vTop - 1 && dxv > 1 ? P.kurtaDk : P.cream); continue; }
    let c = P.vestBlue;
    if (((x + y) % 6 === 0) || ((((x - y) % 6) + 6) % 6 === 0)) c = P.vestBlueLt;
    if (x > cx + 7 || y >= s.floor - 1) c = (y >= s.floor - 1 && x % 2) ? P.vestBlue : P.vestBlueDk;
    if (y === vTop) c = P.vestBlueDk;
    b.set(x, y, c);
  }
  // pen pocket
  b.rect(tx + 5, ty + 4, 5, 4, P.vestBlueDk); b.rect(tx + 5, ty + 4, 5, 1, P.vestBlueLt);
  b.rect(tx + 6, ty + 1, 1, 4, '#3F8CFF'); b.set(tx + 6, ty + 1, P.white);
  b.rect(tx + 8, ty + 2, 1, 3, P.heart); b.set(tx + 8, ty + 2, P.pink);
  // fluffy grey tufts above the ears (classic uncle)
  {
    const lyT = Math.round(Math.round(s.cy - s.ry) + 5 + 2.5);
    const sp = rowSpan(b, lyT - 1);
    if (sp) [[sp[0] + 2, -1], [sp[1] - 2, 1]].forEach(([x, sd]) => {
      b.ell(x + sd, lyT - 2, 2.0, 2.6, (X, Y, nx, ny) => (nx + ny > 0.3 ? P.gray : P.wallLt));
      b.set(x + sd * 2, lyT - 4, P.wallLt);
    });
  }
  const top = Math.round(s.cy - s.ry);
  const tdx = Math.round(lean(top + 1));
  const sd = s.mood === 'sad' ? 1 : 0;
  [-2, 0, 2].forEach((i, n) => { b.set(cx + tdx + i, top - 1 - (n === 1 ? 1 : 0) + sd, P.stache); b.set(cx + tdx + i, top + sd, P.stache); });
  const ax = Math.round(lean(s.cy + 3));
  const up = s.mood === 'jump' || s.mood === 'happy';
  if (s.mood !== 'happy') {
    b.ell(cx - s.rx + 0.5 + ax, s.cy + (up ? -3 : 3), 2.2, 2.2, P.blorbDk);
    b.ell(cx + s.rx - 0.5 + ax, s.cy + (up ? -3 : 3), 2.2, 2.2, P.blorbDk);
  }
  b.outline();
  const eyeY = Math.round(top + 5);
  const dx = Math.round(lean(eyeY + 3));
  const lx = cx - 5.5 + dx, rx = cx + 5.5 + dx;
  const ly = eyeY + 2.5;
  if (s.mood !== 'sad') { b.rect(Math.round(lx) - 5, eyeY + 6, 3, 1, P.pink); b.rect(Math.round(rx) + 3, eyeY + 6, 3, 1, P.pink); }
  b.rect(Math.round(cx + dx) - 2, Math.round(ly) - 1, 4, 1, INK);
  [lx, rx].forEach((x) => { b.circle(x, ly, 3.9, INK); b.circle(x, ly, 2.95, (X, Y, nx, ny) => (nx + ny < -0.7 ? P.white : P.cream)); });
  const pupil = (x, y, big) => { b.rect(Math.round(x) - 1, Math.round(y) - 1, big ? 3 : 2, big ? 3 : 2, INK); b.set(Math.round(x) - 1, Math.round(y) - 1, P.white); };
  if (s.mood === 'happy') {
    [lx, rx].forEach((x) => { b.rect(Math.round(x) - 2, Math.round(ly), 1, 1, INK); b.rect(Math.round(x) - 1, Math.round(ly) - 1, 2, 1, INK); b.rect(Math.round(x) + 1, Math.round(ly), 1, 1, INK); });
  } else if (s.mood === 'sad') {
    pupil(lx + 0.5, ly + 0.5, true); pupil(rx + 0.5, ly + 0.5, true);
    b.set(Math.round(lx) - 4, Math.round(ly) + 4, P.sky); b.set(Math.round(lx) - 4, Math.round(ly) + 5, P.white);
  } else if (s.mood === 'jump') {
    pupil(lx + 0.5, ly, false); pupil(rx + 0.5, ly, false);
  } else {
    pupil(lx + 1, ly + 0.5, true); pupil(rx + 1, ly + 0.5, true);
  }
  const browY = Math.round(ly) - 6 + (s.mood === 'jump' ? -1 : 0);
  const brow = (x, left) => {
    const sad = s.mood === 'sad';
    const slope = sad ? (left ? [1, 0, -1, -1] : [-1, -1, 0, 1]) : (s.mood === 'happy' ? [1, 0, 0, 1] : [0, 0, 0, 0]);
    for (let i = 0; i < 4; i++) b.rect(Math.round(x) - 2 + i, browY + slope[i], 1, 2, P.stache);
  };
  brow(lx, true); brow(rx, false);
  // moustache (handlebar)
  const my = Math.round(ly) + 4;
  const mx = Math.round(cx + dx);
  const M = P.stache, H = P.dirtDk;
  b.rect(mx - 6, my + 1, 12, 3, M); b.rect(mx - 5, my, 4, 1, M); b.rect(mx + 1, my, 4, 1, M);
  b.rect(mx - 5, my + 1, 10, 1, H);
  b.set(mx - 1, my, null); b.set(mx, my, null); b.set(mx - 1, my + 3, null); b.set(mx, my + 3, null);
  if (s.mood === 'sad') { [[-7, 3], [-7, 4], [-8, 5], [6, 3], [6, 4], [7, 5]].forEach(([i, j]) => b.set(mx + i, my + j, M)); }
  else { [[-7, 2], [-8, 1], [-8, 0], [6, 2], [7, 1], [7, 0]].forEach(([i, j]) => b.set(mx + i, my + j, M)); }
  if (s.mood === 'happy') { b.rect(mx - 2, my + 4, 4, 2, INK); b.rect(mx - 1, my + 5, 2, 1, P.heart); }
  else if (s.mood === 'jump') { b.rect(mx - 1, my + 4, 2, 2, INK); }
  else if (s.mood === 'sad') { b.rect(mx - 2, my + 5, 4, 1, INK); }
  else { b.rect(mx - 2, my + 4, 4, 1, INK); }
  // tie
  b.rect(tx - 2, ty - 1, 5, 3, INK);
  b.rect(tx - 1, ty, 3, 1, P.heart); b.set(tx - 1, ty, P.pink);
  b.poly([[tx - 2, ty + 2], [tx + 3, ty + 2], [tx + 4, ty + 7], [tx, ty + 8.5], [tx - 3, ty + 7]], INK);
  b.poly([[tx - 1, ty + 2], [tx + 2, ty + 2], [tx + 3, ty + 6.5], [tx, ty + 7.5], [tx - 2, ty + 6.5]], P.heart);
  b.rect(tx, ty + 3, 1, 4, P.gold); b.rect(tx - 1, ty + 4, 1, 1, P.pink);
  // tilak between the brows
  b.rect(cx + dx - 1, Math.round(ly) - 6, 2, 4, P.bindi); b.set(cx + dx - 1, Math.round(ly) - 6, P.heartDk);
  // happy: namaste
  if (s.mood === 'happy') {
    const nx = tx, ny = ty + 2;
    b.poly([[nx, ny - 2], [nx + 5, ny + 3], [nx + 4, ny + 6.5], [nx - 4, ny + 6.5], [nx - 5, ny + 3]], INK);
    b.poly([[nx, ny - 0.5], [nx + 4, ny + 3], [nx + 3, ny + 5.5], [nx - 3, ny + 5.5], [nx - 4, ny + 3]], P.blorbLt);
    b.rect(nx - 3, ny + 3, 6, 3, P.blorb);
    b.rect(nx, ny, 1, 6, INK);
    b.rect(nx - 3, ny + 5, 6, 1, P.blorbDk);
    b.set(nx - 1, ny + 1, P.white);
  }
  return b;
}

// ---------------------------------------------------------------- Bunty Bhaiya (frazzled blue senior: oil-slick side parting, headband, aviators pushed up, gold chain, clipboard, sweat)
const BUNTY = [
  { rx: 7.5, ry: 8.5, cy: 13, lean: 0, mood: 'idle', fl: [0, 0], fr: [0, 0], floor: 21, cb: 0, sw: 0 },
  { rx: 7, ry: 9, cy: 12.5, lean: 0, mood: 'idle', fl: [0, 0], fr: [0, 0], floor: 21, cb: 1, sw: 1 },
  { rx: 8, ry: 8, cy: 13.5, lean: 2, mood: 'idle', fl: [3, -2], fr: [-2, 0], floor: 21, cb: -1, sw: 2 },
  { rx: 7.5, ry: 8.5, cy: 13, lean: 1, mood: 'idle', fl: [-2, 0], fr: [3, -2], floor: 21, cb: 1, sw: 3 },
  { rx: 6.5, ry: 9.5, cy: 12, lean: 0, mood: 'jump', fl: [1, -3], fr: [-1, -3], floor: 20, cb: -5, sw: 2 },
  { rx: 8, ry: 8.5, cy: 13, lean: 0, mood: 'happy', fl: [0, 0], fr: [0, 0], floor: 21, cb: 0, sw: 0 },
  { rx: 8.5, ry: 7, cy: 14.5, lean: 0, mood: 'sad', fl: [0, 0], fr: [0, 0], floor: 21, cb: 3, sw: 1 },
];
function drawBunty(f) {
  const s = BUNTY[f];
  const b = new Buf(24, 24);
  const cx = 11;
  const lean = (y) => s.lean * Math.max(0, (s.floor - y)) / (s.ry * 2);
  const top = Math.round(s.cy - s.ry);
  b.ell(cx - 3.5 + s.fl[0], s.floor - 0.5 + s.fl[1], 2.4, 1.6, P.buntyDk);
  b.ell(cx + 3.5 + s.fr[0], s.floor - 0.5 + s.fr[1], 2.4, 1.6, P.buntyDk);
  const body = new Buf(24, 24);
  body.ell(cx, s.cy, s.rx, s.ry, shade(P.bunty, P.buntyDk, P.buntyLt), s.floor);
  body.shear(lean);
  b.blit(body, 0, 0);
  const tdx = Math.round(lean(top + 2));
  // oil-slick hair with a razor side parting and a little Bollywood puff
  for (let y = top; y <= top + 1; y++) {
    const sp = rowSpan(b, y); if (!sp) continue;
    for (let x = sp[0]; x <= sp[1]; x++) {
      if (!b.get(x, y)) continue;
      b.set(x, y, (y === top + 1 && x > cx - 1 + tdx && x < cx + 4 + tdx) ? P.oilLt : P.oil);
    }
  }
  b.rect(cx + tdx - 1, top, 1, 2, P.buntyLt);
  b.rect(cx + tdx - 3, top - 1, 8, 1, P.oil); b.rect(cx + tdx - 1, top - 2, 4, 1, P.oil);
  b.set(cx + tdx + 1, top - 1, P.oilLt); b.set(cx + tdx + 2, top - 1, P.oilLt);
  // clipboard + arm
  const bx = cx + 6 + Math.round(lean(s.cy)), by = Math.round(s.cy) - 1 + s.cb;
  b.ell(cx - s.rx + 0.5, s.cy + 3 + (s.mood === 'jump' ? -5 : 0), 1.6, 1.6, P.buntyDk);
  b.rect(bx, by, 8, 10, INK);
  b.rect(bx + 1, by + 1, 6, 8, P.woodLt);
  b.rect(bx + 1, by + 2, 6, 6, P.cream);
  b.rect(bx + 2, by - 1, 4, 2, INK); b.rect(bx + 3, by - 1, 2, 1, P.gold);
  b.rect(bx + 2, by + 3, 3, 1, P.gray); b.rect(bx + 2, by + 5, 4, 1, P.gray);
  b.set(bx + 2, by + 7, P.heart); b.set(bx + 3, by + 7, P.heart);
  b.ell(bx + 1.5, by + 8.5, 1.8, 1.8, P.buntyDk);
  // aviator sunglasses pushed up on the forehead (gold rims, teal lenses)
  {
    const ax0 = cx - 5 + tdx, ay0 = top + 2;
    b.rect(ax0, ay0, 11, 3, P.gold2);
    [ax0 + 1, ax0 + 6].forEach((x) => { b.rect(x, ay0 + 1, 4, 2, '#2B6E7A'); b.set(x, ay0 + 1, P.cyan); b.set(x + 1, ay0 + 1, P.cyan); });
    b.set(ax0 + 5, ay0 + 1, P.gold2Dk); b.set(ax0, ay0 + 2, P.gold2Dk); b.set(ax0 + 10, ay0 + 2, P.gold2Dk);
    b.rect(ax0 + 1, ay0 + 3, 4, 0, P.gold2);
  }
  b.outline();
  // headband + knot tail (left)
  const hy = top + 5;
  for (let x = 0; x < 24; x++) {
    const c0 = b.get(x, hy), c1 = b.get(x, hy + 1);
    if (c0 && c0 !== INK && c1 && c1 !== INK) { b.set(x, hy, P.heart); b.set(x, hy + 1, P.heartDk); }
  }
  const hx0 = cx - Math.round(s.rx) + tdx + 1;
  [[-1, 0, P.heart], [-2, -1, P.heart], [-2, 1, P.heartDk], [-3, 0, P.heart], [-3, 2, P.heartDk]].forEach(([i, j, c]) => b.set(hx0 + i, hy + j, c));
  for (let x = cx - 3 + tdx; x < cx + 4 + tdx; x += 3) b.set(x, hy, P.white);
  // face
  const eyeY = hy + 2;
  const dx = Math.round(lean(eyeY + 2));
  const xl = cx - 5 + dx, xr = cx + 1 + dx;
  const my = eyeY + 6;
  const sad = s.mood === 'sad', hap = s.mood === 'happy';
  if (hap) {
    eyeHappy(b, xl, eyeY, 4); eyeHappy(b, xr, eyeY, 4);
    b.rect(cx - 2 + dx, my - 1, 4, 2, INK); b.rect(cx - 1 + dx, my, 2, 1, P.heart);
  } else {
    [xl, xr].forEach((x, i) => {
      b.rect(x + 1, eyeY, 3, 5, INK); b.rect(x, eyeY + 1, 5, 3, INK); b.rect(x + 1, eyeY + 1, 3, 3, P.white);
      const px = x + (s.mood === 'jump' ? 2 : (i ? 2 : 3)), py = eyeY + (sad ? 3 : 2);
      b.rect(px, py - 1, 1, 2, INK);
      b.set(px - 1, py, INK);
    });
    if (sad) { b.rect(xl, eyeY - 1, 3, 1, INK); b.rect(xr + 2, eyeY - 1, 3, 1, INK); }
    if (s.mood === 'jump') { b.rect(cx - 1 + dx, my - 1, 3, 3, INK); b.set(cx + dx, my, P.heart); }
    else if (sad) { [[0, 1], [1, 0], [2, 0], [3, 1]].forEach(([i, j]) => b.set(cx - 2 + dx + i, my + j, INK)); }
    else { [[0, 0], [1, 1], [2, 0], [3, 1], [4, 0]].forEach(([i, j]) => b.set(cx - 2 + dx + i, my + j, INK)); }
  }
  if (!sad) { b.set(xl - 1, eyeY + 6, P.pink); b.set(xr + 5, eyeY + 6, P.pink); }
  // chunky gold chain
  { const cy1 = Math.min(my + 2, s.floor - 3);
    [[-4, 0], [-3, 0], [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 0], [3, 0]].forEach(([i, j], n) => b.set(cx + dx + i, cy1 + j, n % 3 === 2 ? P.white : P.gold2));
    b.set(cx + dx - 1, cy1 + 2, P.gold2); b.set(cx + dx, cy1 + 2, P.gold2Dk); }
  if (s.sw === 1) sweat(b, 2, top + 1);
  if (s.sw === 2) { sweat(b, 1, top + 4); sweat(b, 20, Math.max(0, top)); }
  if (s.sw === 3) sweat(b, 20, top + 3);
  if (sad) sweat(b, 2, top + 3);
  return b;
}


// ---------------------------------------------------------------- new obstacles
function drawCrate() {
  const b = new Buf(16, 16);
  b.rect(0, 0, 16, 16, P.wood);
  b.rect(0, 0, 16, 2, P.woodLt); b.rect(0, 0, 2, 16, P.woodLt);
  b.rect(0, 14, 16, 2, P.woodDk); b.rect(14, 0, 2, 16, P.woodDk);
  b.rect(2, 2, 12, 12, P.wood);
  b.line(2, 2, 13, 13, P.woodDk, 2); b.line(13, 2, 2, 13, P.woodDk, 2);
  b.rect(2, 2, 12, 1, P.woodLt); b.rect(2, 2, 1, 12, P.woodLt);
  b.rect(6, 6, 4, 4, P.orange); b.rect(6, 6, 4, 1, P.gold); b.rect(7, 7, 2, 2, P.cream); b.set(7, 7, P.white);
  [[1, 1], [14, 1], [1, 14], [14, 14]].forEach(([x, y]) => b.set(x, y, P.steelLt));
  b.outline();
  return b;
}

function drawSpeakerOb() {
  const b = new Buf(16, 26);
  b.rect(0, 0, 16, 26, P.steelDk);
  b.rect(0, 0, 16, 26, (x, y) => (x === 0 ? P.steel : (x === 15 ? '#383C52' : (y === 0 ? P.steel : P.steelDk))));
  b.rect(0, 3, 16, 2, P.pink); b.rect(0, 3, 16, 1, P.white); b.rect(0, 4, 16, 1, P.heart);
  // tweeter
  b.circle(8, 10, 3.6, INK); b.circle(8, 10, 2.6, shade(P.steelLt, P.steel, P.white)); b.set(8, 10, P.steelDk);
  // woofer
  b.circle(8, 19, 6.2, INK); b.circle(8, 19, 5.2, (x, y, nx, ny) => (nx + ny > 0.5 ? P.steelDk : (nx + ny < -0.7 ? P.steelLt : P.steel)));
  b.circle(8, 19, 2.4, INK); b.circle(8, 19, 1.6, (x, y, nx, ny) => (nx + ny < -0.3 ? P.steelLt : P.steel));
  b.set(6, 16, P.white); b.set(7, 15, P.white);
  [[2, 7], [13, 7], [2, 23], [13, 23]].forEach(([x, y]) => b.set(x, y, P.steelLt));
  b.set(13, 1, P.lime); b.set(12, 1, P.lime);
  b.outline();
  // carry handle on top
  b.rect(5, 0, 6, 1, INK);
  return b;
}

function drawConeOb() {
  const b = new Buf(12, 12);
  b.poly([[5, 0], [7, 0], [10, 10], [2, 10]], (x, y) => (x >= 7 + (y - 4) * 0.12 ? P.orangeDk : P.orange));
  b.poly([[4.2, 3.5], [7.8, 3.5], [8.4, 5.6], [3.6, 5.6]], P.white);
  b.poly([[3.2, 7], [8.8, 7], [9.4, 8.6], [2.6, 8.6]], P.white);
  b.rect(4, 1, 1, 2, P.gold); b.rect(7, 4, 1, 2, P.gray);
  b.rect(0, 10, 12, 2, P.stoneDk); b.rect(0, 10, 12, 1, P.stone);
  b.outline();
  return b;
}

function drawDebrisOb() {
  const b = new Buf(18, 10);
  b.ell(9, 8.5, 8.6, 1.9, P.stoneDk);
  b.poly(rrect(8.5, 6, 15, 4, -0.2), (x, y) => (y < 5 ? P.woodLt : P.wood));
  b.poly(rrect(6, 4, 9, 2.4, 0.5), P.steelLt);
  b.rect(11, 4, 5, 3, P.stone); b.rect(11, 4, 5, 1, P.gray); b.rect(15, 5, 1, 2, P.stoneDk);
  b.rect(3, 7, 3, 2, P.stone); b.set(3, 7, P.gray);
  b.set(2, 5, P.gray); b.set(14, 3, P.orange); b.set(8, 4, P.woodDk); b.set(10, 6, P.woodDk);
  b.outline();
  b.set(0, 9, P.stoneDk);
  return b;
}

function drawLightOb(f) {
  const b = new Buf(16, 12);
  // hanging clamp and bent bracket
  b.rect(6, 0, 4, 3, P.orange); b.rect(6, 0, 4, 1, P.gold); b.rect(7, 1, 2, 1, INK);
  // can body (horizontal), lens at right
  b.ell(7, 7, 6, 4.6, shade(P.steelDk, '#383C52', P.steel, 0.5));
  b.rect(10, 3, 3, 9, (x, y) => (y < 4 ? null : P.steel));
  b.ell(12.4, 7.2, 2.2, 4.2, f ? P.white : P.gold);
  b.rect(12, 5, 2, 4, f ? P.gold : P.white);
  b.rect(0, 6, 3, 3, P.steelDk);
  b.rect(2, 9, 8, 1, P.pink);
  b.outline();
  b.set(1, 10, P.gold); b.set(0, 11, INK); // cable tail
  if (f) { b.set(15, 3, P.white); b.set(15, 11, P.gold); b.set(14, 1, P.gold); }
  else { b.set(15, 2, P.gold); b.set(15, 10, P.white); }
  return b;
}

function drawLogOb() {
  const b = new Buf(22, 12);
  // trunk
  b.rect(4, 2, 17, 10, (x, y) => (y <= 3 ? P.woodLt : (y >= 9 ? P.woodDk : P.wood)));
  b.rect(20, 3, 1, 8, P.woodDk);
  [[7, 5], [8, 5], [12, 6], [13, 6], [14, 6], [16, 4], [10, 8], [11, 8], [18, 8]].forEach(([x, y]) => b.set(x, y, P.woodDk));
  [[6, 4], [11, 4], [15, 7]].forEach(([x, y]) => b.set(x, y, P.woodLt));
  // moss on top
  [[9, 2], [10, 2], [11, 2], [10, 3], [16, 2], [17, 2], [8, 2]].forEach(([x, y]) => b.set(x, y, y === 2 ? P.pineLt : P.pine));
  // cut end with rings
  b.ell(4, 7, 3.4, 5, (x, y, nx, ny) => (nx * nx + ny * ny > 0.55 ? P.woodLt : P.dirt));
  b.ell(4, 7, 1.7, 2.6, P.woodLt); b.set(4, 7, P.woodDk); b.set(3, 6, P.white);
  // branch stub with leaf
  b.rect(14, 0, 3, 3, P.woodDk); b.set(17, 0, P.pineLt); b.set(18, 1, P.pine); b.set(17, 1, P.pine);
  b.outline();
  return b;
}

function drawRockOb() {
  const b = new Buf(14, 12);
  b.ell(7, 7, 6.6, 5.2, (x, y, nx, ny) => (nx + ny > 0.5 ? P.stoneDk : (nx + ny < -0.7 ? P.white : P.stone)), 11);
  b.rect(0, 10, 14, 2, (x) => (x < 1 || x > 12 ? null : P.stoneDk));
  b.rect(3, 4, 3, 1, P.gray); b.set(2, 5, P.gray);
  [[8, 5], [9, 6], [9, 7], [10, 8]].forEach(([x, y]) => b.set(x, y, P.stoneDk));
  // moss tuft
  [[4, 2], [5, 1], [6, 1], [7, 2], [5, 2], [6, 2]].forEach(([x, y]) => b.set(x, y, P.pineLt));
  b.set(5, 0, P.pineLt); b.set(4, 3, P.pine); b.set(8, 3, P.pine);
  b.outline();
  return b;
}

function drawTrayOb() {
  const b = new Buf(16, 10);
  b.rect(0, 7, 16, 3, P.steel); b.rect(0, 7, 16, 1, P.steelLt); b.rect(0, 9, 16, 1, P.steelDk);
  // samosas
  b.poly([[1, 7], [4.5, 2], [8, 7]], (x, y) => (x > 5 ? P.orange : P.gold));
  b.poly([[6.5, 7], [9, 3.5], [11.5, 7]], (x, y) => (x > 9 ? P.orangeDk : P.orange));
  b.set(4, 4, P.cream); b.set(4, 5, P.cream); b.set(9, 5, P.gold);
  // chai glass with foam
  b.rect(12, 3, 4, 4, P.woodLt); b.rect(12, 3, 4, 1, P.cream); b.rect(12, 4, 1, 3, P.dirt); b.rect(15, 4, 1, 3, P.woodDk);
  b.set(13, 5, P.cream);
  // steam
  b.set(13, 1, P.white); b.set(14, 0, P.white);
  b.outline();
  b.set(0, 0, null); b.set(15, 9, INK);
  return b;
}

function drawCashOb(f) {
  const b = new Buf(14, 10);
  const j = f ? 1 : 0;
  // bundle
  b.rect(0, 3 + j, 10, 6, P.grass); b.rect(0, 3 + j, 10, 1, P.grassLt); b.rect(0, 8 + j, 10, 1, P.grassDk);
  b.rect(3, 3 + j, 3, 6, P.cream); b.rect(3, 5 + j, 3, 1, P.heart); b.set(4, 6 + j, P.heart);
  b.rect(9, 3 + j, 1, 6, P.grassDk);
  b.set(1, 5 + j, P.grassDk); b.set(7, 5 + j, P.grassDk); b.set(7, 7 + j, P.grassDk); b.set(1, 7 + j, P.gold);
  // loose notes flapping off the back
  if (f) { b.poly([[9, 4], [13, 2], [13, 5], [9, 6]], P.grassLt); b.set(12, 3, P.grass); b.poly([[1, 3], [3, 0.5], [5, 3]], P.grass); }
  else { b.poly([[9, 4], [13, 5], [13, 7.5], [9, 7]], P.grassLt); b.set(12, 6, P.grass); b.poly([[1, 3], [5, 1], [6, 3]], P.grass); }
  b.outline();
  return b;
}

// ---------------------------------------------------------------- ground tiles 16x30 (top rows = walking surface)
function drawGrGrass() {
  const b = new Buf(16, 30);
  b.rect(0, 0, 16, 30, P.dirt);
  b.rect(0, 0, 16, 1, P.grassLt); b.rect(0, 1, 16, 2, P.grass); b.rect(0, 3, 16, 1, P.grassDk);
  [1, 4, 8, 11, 14].forEach((x) => { b.set(x, 4, P.grassDk); b.set(x, 5, P.grassDk); });
  [[2, 1], [9, 1], [13, 2], [6, 0]].forEach(([x, y]) => b.set(x, y, P.grassLt));
  b.rect(0, 5, 16, 1, P.dirtDk);
  [1, 4, 8, 11, 14].forEach((x) => b.set(x, 5, P.grassDk));
  b.dither(0, 14, 16, 16, P.dirtDk, 3);
  b.dither(0, 22, 16, 8, P.dirtDk, 6);
  [[2, 9], [3, 9], [10, 8], [6, 12], [7, 12], [13, 11], [1, 18], [11, 17], [12, 17], [5, 24], [14, 26], [8, 21]].forEach(([x, y]) => b.set(x, y, P.dirtDk));
  [[5, 9], [12, 13], [2, 15], [9, 19], [4, 27]].forEach(([x, y]) => b.set(x, y, P.orange));
  b.rect(7, 8, 3, 2, P.gray); b.set(7, 8, P.white); b.rect(7, 9, 3, 1, P.stone);
  return b;
}
function drawGrWood() {
  const b = new Buf(16, 30);
  b.rect(0, 0, 16, 30, P.wood);
  b.rect(0, 0, 16, 1, P.woodLt); b.rect(0, 1, 16, 2, P.dirt); b.rect(0, 3, 16, 1, P.woodDk);
  b.rect(0, 0, 16, 1, '#F0B878');
  // vertical boards, seam at x=0 and x=8
  [0, 8].forEach((x) => { b.rect(x, 4, 1, 22, P.woodDk); });
  [[3, 8], [4, 8], [11, 14], [12, 14], [2, 18], [13, 22], [5, 12]].forEach(([x, y]) => { b.set(x, y, P.woodDk); });
  [[6, 7], [14, 16], [3, 21]].forEach(([x, y]) => { b.set(x, y, P.woodLt); });
  [[2, 6], [6, 6], [10, 6], [14, 6]].forEach(([x, y]) => { b.set(x, y, P.steelLt); b.set(x, y + 1, P.woodDk); });
  b.rect(0, 26, 16, 4, P.woodDk); b.rect(0, 26, 16, 1, INK);
  b.dither(0, 20, 16, 6, P.woodDk, 5);
  return b;
}
function drawGrTile() {
  const b = new Buf(16, 30);
  b.rect(0, 0, 16, 30, P.wallLt);
  b.rect(0, 0, 16, 1, P.white); b.rect(0, 1, 16, 2, P.cream); b.rect(0, 3, 16, 1, P.gray);
  for (let ty = 0; ty < 3; ty++) {
    const y0 = 4 + ty * 9;
    b.rect(0, y0, 16, 1, P.gray);
    [0, 8].forEach((x) => b.rect(x + (ty % 2 ? 4 : 0) % 16, y0 + 1, 1, 8, P.gray));
    if (ty % 2) b.rect(0, y0 + 1, 16, 0, P.gray);
    for (let i = 0; i < 2; i++) {
      const x0 = i * 8 + (ty % 2 ? 4 : 0);
      for (let k = 0; k < 8; k++) { const xx = (x0 + 1 + k) % 16; b.set(xx, y0 + 1, P.white); }
      if ((i + ty) % 2 === 0) for (let k = 0; k < 7; k++) for (let m = 0; m < 7; m++) if ((k + m) % 5 === 0) b.set((x0 + 1 + k) % 16, y0 + 2 + m, P.sky2);
    }
  }
  b.rect(0, 31 - 4, 16, 4, P.wallDk); b.rect(0, 26, 16, 1, P.gray);
  return b;
}
function drawGrPath() {
  const b = new Buf(16, 30);
  b.rect(0, 0, 16, 30, '#B87A4B');
  b.rect(0, 0, 16, 1, '#E8B27C'); b.rect(0, 1, 16, 2, P.dirt); b.rect(0, 3, 16, 1, '#9E6A40');
  [[2, 1], [7, 2], [12, 1]].forEach(([x, y]) => b.set(x, y, '#F2C896'));
  // pebbles
  [[3, 7, 3, 2], [10, 10, 3, 2], [6, 15, 2, 2], [13, 18, 2, 1], [1, 21, 3, 2], [9, 24, 3, 2]].forEach(([x, y, w, h]) => { b.rect(x, y, w, h, P.gray); b.rect(x, y + h - 1, w, 1, P.stone); b.set(x, y, P.white); });
  [[5, 5], [14, 8], [8, 13], [3, 12], [11, 20], [15, 23], [5, 27], [13, 27]].forEach(([x, y]) => b.set(x, y, P.dirtDk));
  b.dither(0, 12, 16, 18, P.dirtDk, 4);
  // little grass tuft edges
  b.set(0, 4, P.grassDk); b.set(15, 4, P.grassDk); b.set(7, 3, P.grass);
  return b;
}
function drawGrStage() {
  const b = new Buf(16, 30);
  b.rect(0, 0, 16, 30, '#3C2F66');
  b.rect(0, 0, 16, 1, P.pink); b.rect(0, 1, 16, 1, '#8A5AD0'); b.rect(0, 2, 16, 2, '#4C3A80');
  b.rect(0, 4, 16, 1, INK);
  [0, 8].forEach((x) => b.rect(x, 5, 1, 21, INK));
  // gaffer tape stripes
  b.rect(0, 9, 16, 2, P.gold); b.rect(0, 9, 16, 1, P.cream);
  [[3, 14], [4, 14], [11, 18], [12, 18], [5, 22], [14, 12]].forEach(([x, y]) => b.set(x, y, '#5A4A94'));
  // bolts + reflective glints
  [[3, 6], [12, 6]].forEach(([x, y]) => { b.set(x, y, P.steelLt); });
  [[6, 1], [13, 0]].forEach(([x, y]) => b.set(x, y, P.white));
  b.rect(0, 26, 16, 4, INK); b.rect(0, 26, 16, 1, P.steelDk);
  b.dither(0, 14, 16, 12, INK, 4);
  return b;
}

// ---------------------------------------------------------------- scaffold 48x140 (standing, tilting, collapsing)
function scaffoldBase(banner = true) {
  const b = new Buf(48, 140);
  const poles = [6, 22];
  poles.forEach((x) => {
    b.rect(x, 4, 3, 136, P.steel);
    b.rect(x, 4, 1, 136, P.steelLt); b.rect(x + 2, 4, 1, 136, P.steelDk);
  });
  const lv = [22, 56, 90, 124];
  // diagonal braces
  lv.slice(0, -1).forEach((y, i) => {
    const y2 = lv[i + 1];
    if (i % 2) { b.line(9, y + 3, 22, y2, P.steelDk, 1); b.line(9, y2, 22, y + 3, P.steelLt, 1); }
    else { b.line(9, y2, 22, y + 3, P.steelDk, 1); b.line(9, y + 3, 22, y2, P.steelLt, 1); }
    b.line(9, y + 3, 22, y2, P.steelLt, 1);
    b.line(9, y2, 22, y + 3, P.steelDk, 1);
  });
  // ledgers + planks
  lv.forEach((y, i) => {
    b.rect(5, y, 21, 2, P.steel); b.rect(5, y, 21, 1, P.steelLt);
    if (i) {
      b.rect(1, y - 3, 29, 3, P.woodLt); b.rect(1, y - 1, 29, 1, P.woodDk);
      for (let x = 5; x < 29; x += 6) b.set(x, y - 2, P.woodDk);
    }
    [6, 22].forEach((x) => { b.rect(x - 1, y - 1, 5, 4, P.orange); b.rect(x - 1, y - 1, 5, 1, P.gold); b.set(x + 1, y + 1, INK); });
  });
  // base plates + sandbags
  [3, 19].forEach((x) => { b.rect(x, 136, 9, 4, P.steelDk); b.rect(x, 136, 9, 1, P.steel); });
  // banner
  if (banner) {
    b.rect(8, 28, 15, 15, P.heart); b.rect(8, 28, 15, 2, P.pink); b.rect(8, 41, 15, 2, P.heartDk);
    b.poly([[8, 43], [15.5, 43], [8, 48]], P.heartDk); b.poly([[15.5, 43], [23, 43], [23, 49]], P.heartDk);
    b.poly([[15.5, 31], [17, 35], [21, 35], [18, 37.5], [19, 41], [15.5, 38.8], [12, 41], [13, 37.5], [10, 35], [14, 35]], P.gold);
  }
  // flag on top
  b.rect(7, 0, 1, 6, P.steelDk); b.poly([[8, 0], [14, 1.5], [8, 3]], P.zib);
  return b;
}
function rotRegion(src, y0, y1, ang, px, py) {
  const out = new Buf(src.w, src.h);
  const c = Math.cos(-ang), s = Math.sin(-ang);
  for (let y = 0; y < src.h; y++) for (let x = 0; x < src.w; x++) {
    const dx = x + 0.5 - px, dy = y + 0.5 - py;
    const sx = px + dx * c - dy * s, sy = py + dx * s + dy * c;
    const iy = Math.floor(sy);
    if (iy < y0 || iy >= y1) continue;
    const v = src.get(Math.floor(sx), iy);
    if (v) out.set(x, y, v);
  }
  return out;
}
function dust(b, x, y, r) {
  b.ell(x, y, r, r * 0.75, P.gray); b.ell(x - r * 0.3, y - r * 0.3, r * 0.5, r * 0.4, P.white);
  b.ring(x, y, r * 0.95, r + 0.6, INK);
}
function drawScaffold(f) {
  const base = scaffoldBase();
  let b = new Buf(48, 140);
  if (f === 0) { b.blit(base, 0, 0); b.outline(); return b; }
  if (f === 1) {
    const t = new Buf(48, 140); t.blit(base, 0, 0);
    t.shear((y) => (139 - y) * 0.1 + Math.sin((139 - y) / 22) * 1.2);
    b.blit(t, 0, 0); b.outline();
    // bolts and screws shaking loose
    [[30, 60], [34, 70], [31, 96]].forEach(([x, y]) => { b.set(x, y, P.gray); b.set(x + 1, y, P.stoneDk); });
    dust(b, 8, 135, 4);
    return b;
  }
  // collapsing: lower section stays, upper section topples to the right and breaks apart
  const low = rotRegion(base, 92, 140, 0, 0, 0);
  const lowS = new Buf(48, 140); lowS.blit(low, 0, 0); lowS.shear((y) => Math.max(0, (139 - y)) * 0.04);
  const mid = rotRegion(base, 48, 92, 0.2, 7, 92);
  const top = rotRegion(base, 0, 48, 0.62, 9, 50);
  b.blit(lowS, 0, 0); b.blit(mid, 0, 0);
  // top piece falling away: shift right/down a little so it looks detached
  const tp = new Buf(48, 140); tp.blit(top, 0, 0);
  b.blit(tp, 0, 6);
  // broken tubes tumbling
  const tube = (cx, cy, len, ang) => { b.poly(rrect(cx, cy, len, 3, ang), P.steel); b.poly(rrect(cx - 0.3, cy - 0.7, len - 1, 1, ang), P.steelLt); };
  tube(38, 100, 14, 1.0); tube(30, 118, 12, -0.4); tube(42, 124, 10, 0.2);
  b.rect(34, 130, 10, 3, P.woodLt); b.rect(34, 132, 10, 1, P.woodDk);
  b.outline();
  dust(b, 10, 133, 6); dust(b, 26, 136, 5); dust(b, 41, 135, 5); dust(b, 18, 128, 4); dust(b, 38, 118, 3);
  [[28, 80], [36, 90], [41, 110], [22, 100]].forEach(([x, y]) => { b.set(x, y, P.orange); b.set(x + 1, y, P.gold); });
  return b;
}

// ---------------------------------------------------------------- hall door 40x60 (closed 0, open 1)
function drawDoor(f) {
  const b = new Buf(40, 60);
  // stone frame
  b.rect(0, 0, 40, 60, P.gray);
  b.rect(0, 0, 40, 60, (x, y) => (x < 2 ? P.white : (x > 37 ? P.stone : (y < 2 ? P.white : P.gray))));
  // sign plate
  b.rect(8, 3, 24, 7, INK); b.rect(9, 4, 22, 5, P.gold); b.rect(9, 4, 22, 1, P.cream); b.rect(9, 8, 22, 1, P.orange);
  [[12, 5], [14, 6], [17, 5], [19, 6], [22, 5], [25, 6], [27, 5]].forEach(([x, y]) => b.set(x, y, INK));
  // door opening
  b.rect(5, 12, 30, 48, INK);
  if (f === 0) {
    b.rect(6, 13, 28, 47, P.wood);
    b.rect(6, 13, 28, 2, P.woodLt); b.rect(6, 13, 1, 47, P.woodLt); b.rect(33, 13, 1, 47, P.woodDk);
    b.rect(19, 13, 2, 47, INK);
    [[8, 17, 10, 16], [22, 17, 10, 16], [8, 37, 10, 18], [22, 37, 10, 18]].forEach(([x, y, w, h]) => {
      b.rect(x, y, w, h, P.woodDk); b.rect(x + 1, y + 1, w - 2, h - 2, P.wood);
      b.rect(x + 1, y + 1, w - 2, 1, P.woodLt); b.rect(x + 1, y + 1, 1, h - 2, P.woodLt);
    });
    // round porthole windows
    [[13, 24], [27, 24]].forEach(([x, y]) => { b.circle(x, y, 4.2, INK); b.circle(x, y, 3.2, P.sky); b.rect(x - 2, y - 2, 2, 1, P.white); b.set(x - 3, y - 1, P.white); });
    b.rect(16, 44, 2, 3, P.gold); b.rect(23, 44, 2, 3, P.gold); b.rect(16, 44, 1, 3, P.cream);
    b.rect(5, 57, 30, 3, P.dirtDk);
  } else {
    // warm hall visible through the open door
    b.rect(6, 13, 28, 47, (x, y) => (y < 30 ? P.wallLt : (y < 52 ? P.wallDk : P.dirt)));
    b.rect(6, 13, 28, 47, (x, y) => { const d = BAYER[y & 3][x & 3]; const t = (y - 13) / 47; return d < t * 14 - 2 ? P.gold : (y < 30 ? P.wallLt : (y < 52 ? P.wallDk : P.dirt)); });
    // whiteboard glimpse and floor
    b.rect(16, 22, 14, 14, INK); b.rect(17, 23, 12, 12, P.cream); b.rect(17, 23, 12, 1, P.white);
    [[19, 26, 8], [19, 29, 6], [19, 32, 9]].forEach(([x, y, w]) => b.rect(x, y, w, 1, P.riya));
    b.rect(6, 52, 28, 8, P.dirt); b.rect(6, 52, 28, 1, P.orange);
    for (let i = 0; i < 5; i++) b.rect(8 + i * 6, 54, 1, 6, P.dirtDk);
    // glow spilling out
    // door leaf swung open on the left (perspective sliver)
    b.poly([[6, 13], [14, 17], [14, 56], [6, 60]], INK);
    b.poly([[7, 15], [13, 18], [13, 55], [7, 58]], P.wood);
    b.poly([[7, 15], [13, 18], [13, 20], [7, 17]], P.woodLt);
    b.rect(11, 36, 1, 3, P.gold);
    b.poly([[8, 23], [12, 24.5], [12, 36], [8, 35]], P.woodDk);
    b.poly([[8, 40], [12, 41], [12, 53], [8, 54]], P.woodDk);
    // light spill on the ground out front
    b.rect(5, 59, 30, 1, P.gold);
  }
  b.rect(0, 59, 40, 1, INK);
  b.rect(0, 0, 40, 1, INK); b.rect(0, 0, 1, 60, INK); b.rect(39, 0, 1, 60, INK);
  // door step
  return b;
}

// ---------------------------------------------------------------- 24x24 style sign icons
const HMAP2 = { K: P.heart, R: P.pink, D: P.heart, W: P.white };
function drawSign(name) {
  const b = new Buf(24, 24);
  if (name === 'sign_direct') {
    // megaphone pointing right, with sound bursts
    b.poly([[2, 9], [14, 4], [14, 20], [2, 15]], (x, y) => (y < 8 + (x - 2) * -0.1 ? P.gold : (y > 15 - (x - 2) * 0.2 ? P.orangeDk : P.orange)));
    b.rect(2, 9, 2, 6, P.stoneDk);
    b.ell(14.5, 12, 2.4, 8.4, (x, y, nx, ny) => (nx + ny < -0.2 ? P.white : P.cream));
    b.ell(15, 12, 1.2, 5.8, P.heartDk);
    b.poly([[5, 16], [9, 17.5], [8, 23], [4, 22]], P.stoneDk);
    b.rect(5, 16, 1, 4, P.stone);
    b.outline();
    [[19, 6, 21, 3], [20, 12, 23, 12], [19, 18, 21, 21]].forEach(([x0, y0, x1, y1]) => b.line(x0, y0, x1, y1, P.gold, 1));
    b.set(7, 8, P.white); b.set(6, 9, P.white); b.set(8, 7, P.white);
  } else if (name === 'sign_coach') {
    // clipboard + whistle
    b.rect(1, 3, 13, 19, P.gold); b.rect(1, 3, 13, 1, P.cream); b.rect(1, 21, 13, 1, P.orange); b.rect(13, 3, 1, 19, P.orange);
    b.rect(3, 6, 9, 14, P.cream); b.rect(3, 6, 9, 1, P.white);
    b.rect(4, 9, 6, 1, P.gray); b.rect(4, 12, 7, 1, P.gray);
    b.set(4, 16, P.zibDk); b.set(5, 17, P.zibDk); b.set(6, 16, P.zibDk); b.set(7, 15, P.zibDk); b.set(8, 14, P.zibDk);
    b.rect(5, 1, 5, 4, P.stoneDk); b.rect(6, 2, 3, 1, P.gray);
    // whistle (silver) with red lanyard
    b.ell(18.5, 17.5, 4.4, 4, (x, y, nx, ny) => (nx + ny > 0.45 ? P.stone : (nx + ny < -0.5 ? P.white : P.steelLt)));
    b.rect(13, 14, 6, 4, (x, y) => (y === 14 ? P.white : (y === 17 ? P.stone : P.steelLt)));
    b.circle(19, 18, 1.7, INK); b.set(18, 17, P.gold);
    b.rect(17, 11, 4, 1, P.heart); b.rect(20, 11, 1, 3, P.heart); b.rect(17, 11, 1, 3, P.heart);
    b.outline();
    b.set(16, 15, P.white);
  } else if (name === 'sign_support') {
    // heart held by two hands
    b.stamp(['.KKK.KKK.', 'KRWRKRRRK', 'KRWRRRRDK', 'KRRRRRRDK', '.KRRRRDK.', '..KRRDK..', '...KDK...', '....K....'], 3, 0, HMAP2, 2);
    // heart cupped by two hands
    b.stamp(['.KKK.KKK.', 'KRWRKRRRK', 'KRWRRRRDK', 'KRRRRRRDK', '.KRRRRDK.', '..KRRDK..', '...KDK...', '....K....'], 3, 1, HMAP2, 2);
    b.ell(12, 20.5, 10.6, 4.4, (x, y, nx, ny) => (ny > 0.35 ? P.blorb : P.blorbLt));
    b.rect(1, 14, 2, 5, P.blorbLt); b.rect(21, 14, 2, 5, P.blorb); b.rect(1, 14, 1, 5, P.cream);
    [5, 8, 15, 18].forEach((x) => { b.set(x, 19, P.blorbDk); b.set(x, 20, P.blorbDk); });
    b.rect(9, 22, 6, 1, P.blorbDk);
    b.outline();
    b.set(21, 3, P.white); b.set(22, 2, P.white); b.set(22, 4, P.white); b.set(2, 9, P.gold); b.set(1, 10, P.gold);
  } else {
    // delegate: paper plane (teal)
    b.poly([[2, 11], [22, 2], [10, 14]], P.zibLt);
    b.poly([[10, 14], [22, 2], [14, 22]], P.zib);
    b.poly([[10, 14], [14, 22], [12, 15.5]], P.zibDk);
    b.poly([[22, 2], [13, 12.5], [10, 14]], P.white);
    b.outline();
    [[1, 19], [3, 20], [5, 20], [8, 19], [11, 22], [14, 23]].forEach(([x, y]) => b.set(x, y, P.gold));
    b.line(2, 11, 10, 14, P.zibDk, 1);
    b.set(20, 4, P.white); b.set(19, 5, P.white);
  }
  return b;
}

// ---------------------------------------------------------------- 12x12 small icons
function drawSmallIcon(name) {
  const b = new Buf(12, 12);
  if (name === 'icon_skill') {
    // wrench: open-jaw head right, grip left
    b.circle(8, 5.5, 3.7, (x, y, nx, ny) => (nx + ny > 0.4 ? P.steel : P.steelLt));
    b.rect(9, 4, 3, 3, null);
    b.rect(2, 5, 5, 2, (x, y) => (y === 6 ? P.sky : P.sky2));
    b.circle(2.5, 5.9, 2.1, (x, y, nx, ny) => (nx + ny > 0.4 ? P.steel : P.steelLt));
    b.set(2, 5, null); b.set(2, 6, null);
    b.rect(3, 5, 4, 2, (x, y) => (y === 6 ? P.sky : P.sky2));
    b.outline();
    b.set(6, 3, P.white); b.set(7, 3, P.white); b.set(5, 5, P.white);
  } else if (name === 'icon_will') {
    flame(b, 6, 10.5, 3.9, 10, 1);
    b.outline();
  } else if (name === 'icon_walkie') {
    b.rect(2, 4, 6, 8, P.steel); b.rect(2, 4, 6, 1, P.steelLt); b.rect(2, 4, 1, 8, P.steelLt); b.rect(7, 5, 1, 7, P.steelDk);
    b.rect(8, 1, 1, 4, P.steelDk);
    b.rect(3, 5, 4, 2, P.cyan); b.set(3, 5, P.white);
    b.set(3, 8, P.stoneDk); b.set(5, 8, P.stoneDk); b.set(4, 9, P.stoneDk); b.set(6, 9, P.stoneDk);
    b.rect(3, 10, 2, 1, P.heart);
    b.outline();
    b.set(8, 0, P.lime); b.set(8, 1, P.lime);
    b.set(10, 2, P.gold); b.set(11, 1, P.gold); b.set(10, 4, P.gold); b.set(11, 5, P.gold);
  } else if (name === 'buff_sync') {
    const heart = (cMain, cDk) => {
      const h = new Buf(12, 12);
      h.stamp(['.RR.RR.', 'RRRRRRR', 'RRRRRRR', '.RRRRR.', '..RRR..', '...R...'], 0, 0, { R: cMain });
      h.set(1, 1, P.white); h.set(2, 1, P.white);
      h.set(5, 4, cDk); h.set(4, 5, cDk); h.set(6, 3, cDk); h.set(6, 2, cDk);
      h.outline();
      return h;
    };
    const a = heart(P.pink, P.heart);
    b.blit(a, 0, 0);
    const c = heart(P.heart, P.heartDk);
    b.blit(c, 4, 5);
    b.set(6, 6, P.gold); b.set(7, 7, P.gold); b.set(5, 5, P.gold); b.set(10, 1, P.white); b.set(11, 2, P.gold); b.set(1, 10, P.gold);
  } else if (name === 'debuff_resentful') {
    const sh = (x, y, nx, ny) => (nx + ny > 0.5 ? P.stoneDk : (nx + ny < -0.7 ? P.gray : P.stone));
    b.ell(6, 5, 5.5, 3.8, sh, 9);
    b.ell(2.8, 6, 2.6, 2.3, sh, 9); b.ell(9.2, 6, 2.6, 2.3, sh, 9);
    b.ell(4.5, 2.6, 2.4, 2, sh); b.ell(8, 3.2, 2.4, 1.9, sh);
    b.poly([[8, 8], [10.8, 8], [9.4, 9.8], [10.8, 9.8], [7.2, 12], [8.2, 10.2], [6.8, 10.2]], P.gold);
    b.outline();
    // angry eyes + brows + frown
    b.rect(3, 4, 2, 2, P.white); b.rect(7, 4, 2, 2, P.white);
    b.set(4, 5, INK); b.set(7, 5, INK); b.set(4, 4, INK); b.set(7, 4, INK);
    b.set(2, 2, INK); b.set(3, 3, INK); b.set(4, 3, INK); b.set(9, 2, INK); b.set(8, 3, INK); b.set(7, 3, INK);
    b.set(5, 7, INK); b.set(6, 7, INK); b.set(4, 8, INK); b.set(7, 8, INK);
    b.set(2, 6, P.heart); b.set(9, 6, P.heart);

  } else {
    // debuff_lost: question mark swallowed by fog
    const sh = (x, y, nx, ny) => (nx + ny > 0.55 ? P.stone : (nx + ny < -0.6 ? P.white : P.gray));
    b.ell(6, 8, 5.4, 3.6, sh, 11);
    b.ell(3, 8.5, 2.8, 2.5, sh, 11); b.ell(9.2, 8.5, 2.8, 2.5, sh, 11);
    b.ell(6, 5.5, 3.6, 2.4, sh);
    b.outline();
    const q = new Buf(12, 12);
    q.stamp(['.WWW.', 'WW.WW', '...WW', '..WW.', '..W..', '.....', '..W..'], 3, 0, { W: P.riyaLt });
    q.set(4, 1, P.white); q.set(5, 0, P.white);
    const qo = new Buf(12, 12); qo.blit(q, 0, 0); qo.outline();
    b.blit(qo, 0, 0);
    b.set(1, 10, P.gray); b.set(10, 10, P.gray);
  }
  return b;
}

// ---------------------------------------------------------------- firework (16x16, 4 frames) + confetti (4x4, 4 colours)
function drawFirework(f) {
  const b = new Buf(16, 16);
  const cols = [P.gold, P.pink, P.cyan, P.white, P.orange, P.lime];
  const cx = 8, cy = 8;
  if (f === 0) {
    b.rect(7, 7, 2, 2, P.white); b.set(7, 5, P.gold); b.set(8, 10, P.gold); b.set(5, 8, P.pink); b.set(10, 7, P.pink);
    b.set(6, 6, P.gold); b.set(9, 9, P.gold); b.set(9, 6, P.orange); b.set(6, 9, P.orange);
  } else if (f === 1) {
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4 + 0.2, c = cols[i % cols.length];
      b.line(cx + Math.cos(a) * 2, cy + Math.sin(a) * 2, cx + Math.cos(a) * 5, cy + Math.sin(a) * 5, c, 1);
      b.set(cx + Math.cos(a) * 6.5, cy + Math.sin(a) * 6.5, P.white);
    }
    b.rect(7, 7, 2, 2, P.white);
  } else if (f === 2) {
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6 + 0.1, c = cols[i % cols.length];
      b.line(cx + Math.cos(a) * 4, cy + Math.sin(a) * 4, cx + Math.cos(a) * 6.3, cy + Math.sin(a) * 6.3, c, 1);
      const ex = cx + Math.cos(a) * 7.4, ey = cy + Math.sin(a) * 7.4;
      b.set(ex, ey, i % 2 ? P.white : c);
    }
    b.set(7, 7, P.gold); b.set(8, 8, P.gold); b.set(7, 8, P.pink); b.set(8, 7, P.pink);
  } else {
    for (let i = 0; i < 14; i++) {
      const a = i * Math.PI * 2 / 14 + 0.3, r = 6 + (i % 3) * 0.9;
      b.set(cx + Math.cos(a) * r, cy + Math.sin(a) * r + 1.2, [P.pink, P.gold, P.gray, P.cyan][i % 4]);
    }
    b.set(8, 3, P.gold); b.set(3, 9, P.pink); b.set(12, 10, P.cyan);
  }
  return b;
}
function drawConfetti(f) {
  const b = new Buf(4, 4);
  if (f === 0) { b.rect(0, 1, 3, 2, P.pink); b.set(0, 1, P.white); b.set(2, 2, P.heart); }
  else if (f === 1) { b.rect(1, 0, 2, 3, P.gold); b.set(1, 0, P.white); b.set(2, 2, P.orange); }
  else if (f === 2) { b.rect(0, 0, 3, 1, P.zib); b.rect(1, 1, 3, 2, P.zib); b.set(3, 2, P.zibDk); b.set(1, 1, P.zibLt); }
  else { b.rect(1, 1, 3, 3, P.riya); b.set(1, 1, P.riyaLt); b.set(3, 3, P.riyaDk); b.set(0, 0, P.riyaLt); }
  return b;
}


// ================================================================ parallax layers (400 px wide, wrap horizontally)
const INKF = '#4F4380';          // atmospheric outline for far layers
const LW = 400;
const wv = (x, k, ph = 0) => Math.sin((2 * Math.PI * k * x) / LW + ph);   // periodic wave: integer k tiles seamlessly
// draw `fn` into a temp wrapping buffer, outline it, blit onto b (so overlapping shapes get their own ink edge)
function grp(b, fn, oc = INK) {
  const t = new WBuf(b.w, b.h);
  fn(t);
  t.outline(oc);
  b.blit(t, 0, 0);
}
function hill(b, fn, fill, top) {
  for (let x = 0; x < b.w; x++) {
    const h = Math.round(fn(x));
    for (let y = Math.max(0, h); y < b.h; y++) b.set(x, y, y === h ? top : (typeof fill === 'function' ? fill(x, y, h) : fill));
  }
}
function flags(b, x0, y0, x1, y1, sag, step, cols, ink, ph = 0, len = 7) {
  const pts = sagLine(x0, y0, x1, y1, sag, 160);
  for (let i = 1; i < pts.length; i++) b.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], ink);
  const n = Math.floor(Math.hypot(x1 - x0, y1 - y0) / step);
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + sag * 4 * t * (1 - t);
    const c = cols[(i + ph) % cols.length];
    b.poly([[x - 3, y + 1], [x + 3, y + 1], [x, y + len]], c);
    b.set(x - 3, y + 1, ink); b.set(x + 3, y + 1, ink);
  }
}
function mushroom(b, x, base, r, cap, capDk, ink = INK) {
  grp(b, (t) => {
    t.rect(x - Math.round(r * 0.28), base - Math.round(r * 0.9), Math.round(r * 0.56) + 1, Math.round(r * 0.9), P.cream);
    t.ell(x, base - r * 0.9, r, r * 0.72, (X, Y, nx, ny) => (nx + ny > 0.5 ? capDk : cap), base - r * 0.75);
  }, ink);
  b.rect(x - Math.round(r * 0.3) + 1, base - Math.round(r * 0.6), 1, Math.round(r * 0.5), P.gray);
  [[-0.45, -1.15, 1.2], [0.25, -1.4, 1.5], [0.55, -0.95, 1.1], [-0.1, -0.95, 0.9]].forEach(([dx, dy, rr]) => b.circle(x + dx * r, base + dy * r, Math.max(0.9, rr * r * 0.2), P.white));
}
function pine(b, cx, by, h, w, c, dk, lt, ink, trunk = P.dirtDk) {
  const th = Math.max(3, Math.round(h * 0.12));
  const tiers = Math.max(3, Math.round(h / 13));
  const g = new WBuf(b.w, b.h);
  g.rect(cx - 1, by - th, 3, th, trunk);
  for (let i = tiers - 1; i >= 0; i--) {
    const top = by - th - ((h - th) * (tiers - i)) / tiers - 3;
    const bot = by - th - ((h - th) * (tiers - i - 1)) / tiers + 2 - (tiers - 1 - i) * 0;
    const hw = (w / 2) * (0.5 + (0.5 * (i + 1)) / tiers);
    g.poly([[cx, top], [cx + hw, bot], [cx - hw, bot]], (x, y) => {
      const d = (x - cx) / hw;
      return d > 0.25 ? dk : (d < -0.55 && y < bot - 2 ? lt : c);
    });
    for (let k = 0; k < 3; k++) g.set(cx - hw + 1 + k * (hw * 0.7), bot, dk);
  }
  g.outline(ink);
  b.blit(g, 0, 0);
}
function leaf(b, x, y, c) { b.set(x, y, c); b.set(x + 1, y + 1, c); b.set(x - 1, y + 1, c); }
function glowDot(b, x, y, c, halo) {
  b.set(x - 1, y, halo); b.set(x + 1, y, halo); b.set(x, y - 1, halo); b.set(x, y + 1, halo);
  b.set(x, y, c);
}
function miniRunner(b, x, base, body, dk, lt, fr, ink, look = 0) {
  grp(b, (t) => {
    t.ell(x, base - 6, 5, 5.3, shade(body, dk, lt), base - 1);
    t.rect(x - 4 + (fr ? 2 : 0), base - 1, 3, 1, dk); t.rect(x + 1 - (fr ? 2 : 0), base - 2, 3, 1, dk);
    t.rect(x - 7, base - 12 - fr, 2, 6, body); t.rect(x + 5, base - 12 + fr, 2, 6, body);
    t.rect(x - 7, base - 12 - fr, 2, 1, lt); t.rect(x + 5, base - 12 + fr, 2, 1, lt);
  }, ink);
  b.rect(x - 3, base - 9, 2, 3, ink); b.rect(x + 1, base - 9, 2, 3, ink);
  b.set(x - 3, base - 9, P.white); b.set(x + 1, base - 9, P.white);
  b.rect(x - 1, base - 5, 2, 2, ink);
  b.set(x - 6, base - 5, P.sky2); b.set(x - 6, base - 4, P.sky);
  void look;
}

// ---------------------------------------------------------------- fest
function drawFestFar() {
  const b = new WBuf(LW, 100);
  hill(b, (x) => 80 + 3 * wv(x, 2, 0.4) + 2 * wv(x, 5, 1.3), '#A8DE98', '#C8F2B6');
  hill(b, (x) => 90 + 2 * wv(x, 3, 2) + 1.5 * wv(x, 7, 0.5), (x, y) => (y > 96 ? '#7DC27A' : '#8FD18A'), '#B2E8A2');
  // balloon bunch (wraps over the seam on purpose)
  const balloons = [[0, 40, '#F27C92', '#D45A78'], [7, 33, '#FFD866', '#E8B040'], [13, 41, '#6FD6C9', '#3FAE9F'], [4, 48, '#B79BFF', '#8A6AE0']];
  balloons.forEach(([dx, y]) => b.line(396 + dx, y + 6, 401, 80, INKF));
  grp(b, (t) => balloons.forEach(([dx, y]) => t.ell(396 + dx, y, 4.6, 5.6, '#FFFFFF')), INKF);
  balloons.forEach(([dx, y, c, d]) => {
    b.ell(396 + dx, y, 4.6, 5.6, (x, yy, nx, ny) => (nx + ny > 0.3 ? d : (nx + ny < -0.7 ? '#FFFFFF' : c)));
    b.set(396 + dx - 2, y - 2, '#FFFFFF');
  });
  // ferris wheel
  const wx = 300, wy = 47, R = 29;
  b.line(wx, wy, wx - 17, 95, INKF, 3); b.line(wx, wy, wx + 17, 95, INKF, 3);
  b.line(wx, wy, wx - 17, 95, '#E8E0F5', 1); b.line(wx + 1, wy, wx + 18, 95, '#B7AAD8', 1);
  b.line(wx - 12, 76, wx + 12, 76, INKF, 2); b.line(wx - 8, 85, wx + 9, 85, INKF, 1);
  b.ring(wx, wy, R - 1.3, R + 1.3, INKF); b.ring(wx, wy, R - 0.6, R + 0.6, '#FFEAF2');
  b.ring(wx, wy, 14.5, 15.7, INKF); b.ring(wx, wy, 15, 15.4, '#B7AAD8');
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    b.line(wx + Math.cos(a) * 4, wy + Math.sin(a) * 4, wx + Math.cos(a) * (R - 1), wy + Math.sin(a) * (R - 1), i % 2 ? '#C9BDE8' : INKF, 1);
  }
  const gcols = ['#F27C92', '#FFD866', '#6FD6C9', '#B79BFF', '#FF9E5E', '#7DB8FF'];
  for (let i = 0; i < 12; i++) {
    if (i === 3) continue; // a gondola fell off
    const a = (i / 12) * Math.PI * 2 + 0.1;
    const gx = Math.round(wx + Math.cos(a) * R), gy = Math.round(wy + Math.sin(a) * R);
    b.rect(gx - 3, gy, 7, 6, INKF); b.rect(gx - 2, gy + 1, 5, 4, gcols[i % 6]); b.rect(gx - 2, gy + 1, 5, 1, '#FFFFFF');
    b.line(gx - 2, gy, gx, gy - 2, INKF); b.line(gx + 2, gy, gx, gy - 2, INKF);
  }
  b.circle(wx, wy, 4.5, INKF); b.circle(wx, wy, 3.2, '#FFD866'); b.set(wx - 1, wy - 1, '#FFFFFF');
  // sagging tent (broken pole)
  grp(b, (t) => {
    t.poly([[128, 94], [128, 80], [147, 66], [158, 76], [172, 79], [190, 94]], (x, y) => (Math.floor((x - 128) / 5) % 2 ? '#FFE27A' : '#6FA8F5'));
    t.poly([[158, 76], [172, 79], [190, 94], [160, 94]], (x, y) => (Math.floor((x - 128) / 5) % 2 ? '#E8B040' : '#4F86DD'));
    t.rect(146, 56, 1, 11, P.dirtDk); t.set(147, 57, '#F27C92'); t.set(148, 58, '#F27C92'); t.set(147, 58, '#F27C92');
  }, INKF);
  b.poly([[150, 94], [158, 82], [166, 94]], '#4A3E80');
  b.line(180, 70, 184, 92, '#B58A5A', 2);   // fallen pole
  // big red/white circus tent
  const tc = 62, tb = 95;
  grp(b, (t) => {
    for (let x = tc - 28; x <= tc + 28; x++) t.rect(x, tb - 18, 1, 18, Math.floor((x - tc + 28) / 4) % 2 ? '#FFF3E4' : (x > tc + 12 ? '#D45A78' : '#F27C92'));
    for (let y = 40; y < tb - 18; y++) {
      const half = ((y - 40 + 1) / (tb - 18 - 40)) * 31;
      for (let x = Math.ceil(tc - half); x <= tc + half; x++) {
        const s = Math.floor(((x - tc) / Math.max(1, y - 40)) * 4 + 40);
        t.set(x, y, s % 2 ? '#FFF3E4' : (x > tc + 8 ? '#D45A78' : '#F27C92'));
      }
    }
    for (let i = 0; i < 14; i++) t.ell(tc - 28 + 2 + i * 4, tb - 17, 2.2, 2.6, i % 2 ? '#F27C92' : '#FFF3E4', tb - 15);
    t.rect(tc, 30, 1, 11, P.stoneDk); t.poly([[tc + 1, 30], [tc + 9, 33], [tc + 1, 36]], '#FFD866');
  }, INKF);
  b.poly([[tc - 6, tb], [tc, tb - 14], [tc + 6, tb]], '#6A4E9C'); b.line(tc, tb - 14, tc, tb, INKF);
  // torn banner between two poles
  b.rect(204, 58, 2, 38, INKF); b.rect(205, 58, 1, 38, '#B58A5A'); b.rect(250, 62, 2, 34, INKF); b.rect(250, 62, 1, 34, '#B58A5A');
  grp(b, (t) => {
    t.poly([[206, 60], [236, 66], [236, 78], [206, 72]], '#F27C92');
    t.poly([[206, 60], [236, 66], [236, 68], [206, 62]], '#FFB6C6');
    t.poly([[206, 72], [236, 78], [236, 76], [206, 70.5]], '#D45A78');
    t.poly([[250, 63], [244, 66], [246, 82], [251, 80]], '#F27C92');   // dangling end
  }, INKF);
  text(b, 'FES', 209, 64, FONT57, 5, '#FFFFFF', 1, 1);
  for (let i = 0; i < 6; i++) { b.set(236 - (i % 2), 66 + i * 2, null); b.set(235 - (i % 2), 67 + i * 2, null); }
  b.line(237, 66, 243, 70, INKF); b.line(240, 76, 244, 71, INKF);
  // leaning scaffold at the right edge (wraps)
  const sx = 352, sb = 96, sh = 58, lean = 17;
  const xt = (y) => (lean * (sb - y)) / sh;
  const steel = '#B9C0D8', steelD = '#7F87A8';
  for (let y = sb - sh; y <= sb; y++) { b.rect(sx + Math.round(xt(y)) - 1, y, 4, 1, INKF); b.rect(sx + 16 + Math.round(xt(y)) - 1, y, 4, 1, INKF); }
  for (let y = sb - sh; y <= sb; y++) { b.set(sx + Math.round(xt(y)), y, steel); b.set(sx + 16 + Math.round(xt(y)), y, steel); b.set(sx + Math.round(xt(y)) + 1, y, steelD); b.set(sx + 17 + Math.round(xt(y)), y, steelD); }
  [96, 78, 60, 40].forEach((y, i, arr) => {
    if (i < arr.length - 1) { const y2 = arr[i + 1]; b.line(sx + 2 + xt(y), y, sx + 16 + xt(y2), y2, INKF); b.line(sx + 16 + xt(y), y, sx + 2 + xt(y2), y2, INKF); }
    if (i) { b.rect(sx - 3 + Math.round(xt(y)), y - 2, 25, 3, INKF); b.rect(sx - 2 + Math.round(xt(y)), y - 1, 23, 1, '#E8B27C'); }
  });
  b.rect(sx + 24, 60, 1, 6, INKF); b.poly([[sx + 25, 58], [sx + 33, 61], [sx + 25, 64]], '#F27C92');
  b.line(sx - 6, 96, sx + 6, 76, '#B58A5A', 3);   // plank propped on it
  b.line(sx - 6, 96, sx + 6, 76, INKF, 1);
  // bunting between tent, banner pole and scaffold
  flags(b, 100, 70, 128, 78, 6, 7, ['#F27C92', '#FFD866', '#6FD6C9', '#B79BFF'], INKF, 0, 6);
  flags(b, 252, 66, 300, 60, 8, 8, ['#B79BFF', '#F27C92', '#FFD866', '#6FD6C9'], INKF, 1, 6);
  // grass tufts and flowers
  const R2 = rng(5);
  for (let i = 0; i < 44; i++) { const x = Math.floor(R2() * LW), y = 94 + Math.floor(R2() * 5); if (!b.get(x, y) || b.get(x, y) === '#8FD18A' || b.get(x, y) === '#7DC27A') { if (i % 3) tuft(b, x, y, '#5FAE6A'); else flower(b, x, y - 1, ['#F27C92', '#FFFFFF', '#FFD866'][i % 3]); } }
  return b;
}

function drawFestNear() {
  const b = new WBuf(LW, 36);
  const g = 35;
  // ground-level confetti litter
  const R = rng(9);
  // bunting string with poles
  [2, 102, 202, 302].forEach((px) => { b.rect(px - 1, 0, 3, g, INK); b.rect(px, 0, 1, g, P.dirtDk); b.circle(px + 0.5, 1, 2.6, INK); b.circle(px + 0.5, 1, 1.6, P.gold); });
  const cols = [P.pink, P.gold, P.zib, P.orange, P.riya, P.heart];
  [2, 102, 202, 302].forEach((px, i) => flags(b, px + 1, 4, px + 99, 4, 7, 9, cols, INK, i * 2, 8));
  // barricades (striped crowd-barriers)
  const barrier = (x, tilt) => {
    grp(b, (t) => {
      const y0 = g - 18;
      if (!tilt) {
        t.rect(x, y0, 34, 8, P.white);
        for (let i = 0; i < 9; i++) t.poly([[x + i * 4, y0 + 8], [x + i * 4 + 2, y0 + 8], [x + i * 4 + 4, y0], [x + i * 4 + 2, y0]], P.heart);
        t.rect(x, y0, 34, 1, P.cream); t.rect(x, y0 + 7, 34, 1, P.gray);
        t.line(x + 4, y0 + 8, x + 1, g, P.steelDk, 2); t.line(x + 6, y0 + 8, x + 9, g, P.steelDk, 2);
        t.line(x + 29, y0 + 8, x + 26, g, P.steelDk, 2); t.line(x + 31, y0 + 8, x + 34, g, P.steelDk, 2);
      } else {
        t.poly(rrect(x + 17, g - 8, 34, 8, -0.22), (X, Y) => (Math.floor(X / 4) % 2 ? P.white : P.heart));
        t.line(x + 6, g - 4, x + 1, g - 14, P.steelDk, 2); t.line(x + 28, g - 11, x + 31, g - 2, P.steelDk, 2);
      }
    });
  };
  barrier(30, false); barrier(188, false); barrier(326, true);
  // fleeing crowd (tiny panicking creatures)
  [[96, P.riya, P.riyaDk, P.riyaLt, 0], [138, P.zib, P.zibDk, P.zibLt, 1], [150, P.orange, P.heartDk, P.gold, 0], [262, P.pink, P.heart, P.white, 1], [284, P.gorp, P.gorpDk, P.grassLt, 0], [372, P.gold, P.orange, P.white, 1]]
    .forEach(([x, c, d, l, f]) => miniRunner(b, x, g, c, d, l, f, INK));
  // dropped traffic cone, dropped sign, torn banner heap, confetti
  grp(b, (t) => { t.poly([[236, g], [238, g - 9], [240, g - 9], [242, g]], P.orange); t.rect(234, g - 1, 10, 2, P.stoneDk); }, INK);
  b.rect(237, g - 6, 4, 1, P.white);
  grp(b, (t) => { t.poly([[116, g], [128, g - 4], [134, g], [124, g]], P.heart); }, INK);
  b.rect(120, g - 2, 4, 1, P.pink);
  for (let i = 0; i < 26; i++) b.set(Math.floor(R() * LW), 28 + Math.floor(R() * 7), [P.pink, P.gold, P.zib, P.white, P.orange][i % 5]);
  return b;
}

// ---------------------------------------------------------------- quad (college courtyard)
function drawQuadFar() {
  const b = new WBuf(LW, 90);
  const brick = '#E69A86', brickD = '#C77A6E', brickL = '#F4B7A2', cream = '#FFF0DA', creamD = '#E8D3C0', roof = '#8F74C4', roofD = '#6F57A6', roofL = '#B49BE6';
  hill(b, (x) => 82 + 1.5 * wv(x, 3, 1), '#8FD18A', '#B2E8A2');
  // side wings
  grp(b, (t) => {
    [[70, 46], [262, 46]].forEach(([x0, w]) => {
      t.rect(x0, 58, w, 31, brick); t.rect(x0 + w - 9, 58, 9, 31, brickD);
      t.rect(x0 - 2, 55, w + 4, 4, cream); t.rect(x0 - 2, 58, w + 4, 1, creamD);
      t.rect(x0 - 2, 54, w + 4, 1, '#FFFFFF');
    });
  }, INKF);
  // main block
  grp(b, (t) => {
    t.rect(122, 46, 148, 43, brick); t.rect(258, 46, 12, 43, brickD);
    for (let y = 50; y < 88; y += 4) for (let x = 124 + ((y / 4) % 2) * 3; x < 268; x += 6) t.set(x, y, brickD);
    t.rect(120, 42, 152, 5, cream); t.rect(120, 46, 152, 1, creamD); t.rect(120, 41, 152, 1, '#FFFFFF');
    for (let x = 122; x < 270; x += 6) t.rect(x, 47, 2, 2, creamD);
    // tower
    t.rect(182, 20, 28, 24, brick); t.rect(202, 20, 8, 24, brickD);
    t.rect(180, 18, 32, 3, cream); t.rect(180, 20, 32, 1, creamD);
    t.poly([[177, 18], [196, -2], [215, 18]], (x, y) => (x > 199 + (y - 8) * 0.0 ? roofD : roof));
    t.poly([[177, 18], [196, -2], [197.5, -1], [180, 18]], roofL);
  }, INKF);
  b.circle(196, 31, 8.2, INKF); b.circle(196, 31, 7, cream); b.circle(196, 31, 7, (x, y, nx, ny) => (nx + ny > 0.55 ? creamD : cream));
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; b.set(196 + Math.cos(a) * 5.6, 31 + Math.sin(a) * 5.6, INKF); }
  b.line(196, 31, 196, 26, INKF); b.line(196, 31, 199, 33, INKF); b.set(196, 31, P.heart);
  b.rect(196, -2, 1, 1, INKF);
  b.rect(195, 21, 3, 5, INKF);   // belfry slit under the roof
  // FEST banner on the facade
  grp(b, (t) => { t.rect(128, 50, 32, 10, P.heart); }, INKF);
  b.rect(129, 51, 30, 2, P.pink); b.rect(129, 58, 30, 1, P.heartDk);
  text(b, 'FEST', 133, 52, FONT57, 5, '#FFFFFF', 1, 1);
  b.rect(130, 60, 2, 3, INKF); b.rect(156, 60, 2, 3, INKF);
  // windows
  const win = (x, y, w, h, arch) => {
    b.rect(x - 1, y - 1, w + 2, h + 2, INKF);
    b.rect(x, y, w, h, '#9AD4F5'); b.rect(x, y, w, 3, '#CFEBFF'); b.rect(x + (w >> 1), y, 1, h, '#FFF0DA'); b.rect(x, y + (h >> 1), w, 1, '#FFF0DA');
    if (arch) { b.rect(x - 1, y - 2, w + 2, 1, creamD); }
    b.rect(x - 1, y + h + 1, w + 2, 2, creamD);
    b.set(x + 1, y + 1, '#FFFFFF');
  };
  [130, 148].forEach((x) => win(x, 67, 11, 12));
  [220, 238, 256].forEach((x) => win(x, 51, 9, 10));
  [220, 238, 256].forEach((x) => win(x, 67, 11, 12));
  [78, 96].forEach((x) => win(x, 64, 9, 12)); [270, 288].forEach((x) => win(x, 64, 9, 12));
  // arched door + steps
  grp(b, (t) => {
    t.rect(182, 72, 28, 17, P.dirtDk);
    t.ell(196, 74, 14, 8, P.dirtDk, 74);
  }, INKF);
  b.rect(185, 75, 11, 14, P.wood); b.rect(196, 75, 11, 14, P.woodDk); b.rect(196, 75, 1, 14, INKF);
  b.ell(196, 75, 11, 6, (x, y, nx, ny) => (x < 196 ? P.wood : P.woodDk), 75);
  b.set(194, 82, P.gold); b.set(198, 82, P.gold);
  b.rect(178, 86, 36, 3, '#E8E0F0'); b.rect(178, 86, 36, 1, '#FFFFFF'); b.rect(176, 88, 40, 2, '#CBBFE0');
  // side trees
  const treeF = (cx, cy, r) => {
    grp(b, (t) => {
      t.rect(cx - 2, cy + r * 0.5, 4, 90 - (cy + r * 0.5), P.dirtDk);
      t.ell(cx, cy, r, r * 0.9, (x, y, nx, ny) => (nx + ny > 0.5 ? '#4EA47A' : (nx + ny < -0.7 ? '#92DCA0' : '#6FC58A')));
      t.ell(cx - r * 0.7, cy + r * 0.35, r * 0.6, r * 0.55, (x, y, nx, ny) => (nx + ny > 0.5 ? '#4EA47A' : '#6FC58A'));
      t.ell(cx + r * 0.7, cy + r * 0.35, r * 0.6, r * 0.55, (x, y, nx, ny) => (nx + ny > 0.3 ? '#4EA47A' : '#6FC58A'));
    }, INKF);
    for (let i = 0; i < 9; i++) leaf(b, Math.round(cx - r + 3 + (i * 7) % (r * 2 - 4)), Math.round(cy - r * 0.5 + ((i * 5) % Math.round(r))), '#92DCA0');
  };
  treeF(36, 54, 18); treeF(360, 52, 17); treeF(386, 62, 11); treeF(16, 66, 9); treeF(332, 68, 10);
  // notice board
  grp(b, (t) => {
    t.rect(306, 78, 2, 11, P.dirtDk); t.rect(318, 78, 2, 11, P.dirtDk);
    t.rect(300, 62, 26, 17, P.woodDk); t.rect(302, 64, 22, 13, '#E8B27C');
  }, INKF);
  [[303, 65, 6, 5, P.cream], [310, 65, 5, 7, P.pink], [316, 66, 6, 5, P.gold], [304, 71, 6, 5, P.zibLt], [312, 73, 7, 3, P.cream], [320, 72, 3, 4, P.pink]].forEach(([x, y, w, h, c]) => { b.rect(x, y, w, h, c); b.set(x + 1, y, P.heart); });
  // flag pole at the lawn
  b.rect(106, 52, 1, 37, INKF); b.poly([[107, 52], [117, 55], [107, 58]], P.heart);
  // hedges
  grp(b, (t) => {
    [[8, 12], [48, 11], [118, 12], [150, 11], [244, 10], [272, 12], [338, 11], [372, 12]].forEach(([x, r]) => t.ell(x, 90, r, 5.5, (X, Y, nx, ny) => (nx + ny > 0.5 ? '#4EA47A' : '#6FC58A'), 89));
  }, INKF);
  [[6, 86, P.pink], [14, 88, P.white], [46, 87, P.gold], [120, 86, P.pink], [152, 87, P.white], [246, 87, P.gold], [274, 86, P.pink], [340, 87, P.white], [374, 86, P.gold]].forEach(([x, y, c]) => b.set(x, y, c));
  return b;
}

function drawQuadNear() {
  const b = new WBuf(LW, 36);
  const g = 35;
  const hedgeX = [[10, 11, 12], [34, 10, 14], [92, 9, 13], [118, 11, 15], [230, 10, 14], [256, 12, 12], [344, 10, 14], [372, 11, 12]];
  grp(b, (t) => {
    for (let x = 0; x < LW; x++) { const h = 11 + Math.round(2 * wv(x, 23, 0.4) + 1.5 * wv(x, 41, 1.7)); for (let y = g - h; y < g; y++) t.set(x, y, y < g - h + 2 ? '#6FD06F' : (y > g - 4 ? '#1E5E4B' : '#2F8A63')); }
    hedgeX.forEach(([x, r, h]) => {
      t.ell(x, g - h * 0.35, r, h * 0.62, (X, Y, nx, ny) => (nx + ny > 0.45 ? '#2F8A63' : (nx + ny < -0.7 ? '#6FD06F' : '#46B26B')), g - 1);
    });
    // lamp posts
    [64, 210, 306].forEach((x) => { t.rect(x, 4, 2, g - 4, P.steelDk); t.rect(x - 3, 3, 8, 5, P.gold); t.rect(x - 4, 2, 10, 2, P.steelDk); t.rect(x - 1, g - 4, 4, 4, P.steelDk); });
    // bench
    [[150, 28], [392, 28]].forEach(([x]) => {
      t.rect(x - 12, g - 16, 26, 3, P.wood); t.rect(x - 12, g - 12, 26, 3, P.wood);
      t.rect(x - 10, g - 9, 3, 9, P.steelDk); t.rect(x + 8, g - 9, 3, 9, P.steelDk);
      t.rect(x - 12, g - 9, 26, 2, P.woodDk);
    });
    // sandwich board "FEST"
    t.poly([[180, g], [184, g - 19], [198, g - 19], [202, g]], P.dirtDk);
    t.rect(185, g - 18, 12, 14, P.cream);
    t.rect(184, g - 19, 14, 1, P.woodLt);
    // trash can
    t.rect(236, g - 11, 8, 11, P.zibDk); t.rect(235, g - 12, 10, 2, P.zib);
    // bike wheel
  }, INK);
  [64, 210, 306].forEach((x) => { b.rect(x - 2, 4, 5, 3, P.white); b.set(x - 3, 5, P.gold); b.set(x + 3, 5, P.gold); b.rect(x - 1, 5, 3, 1, '#FFF3B0'); });
  // bench slats + shading
  [[150], [392]].forEach(([x]) => { b.rect(x - 12, g - 16, 26, 1, P.woodLt); b.rect(x - 12, g - 12, 26, 1, P.woodLt); });
  b.poly([[191, g - 16], [192.5, g - 12.5], [196, g - 12.2], [193.2, g - 10.2], [194.2, g - 6.8], [191, g - 8.8], [187.8, g - 6.8], [188.8, g - 10.2], [186, g - 12.2], [189.5, g - 12.5]], P.heart);
  b.set(190, g - 13, P.pink); b.rect(187, g - 5, 9, 1, P.gold);
  b.rect(236, g - 8, 8, 1, P.zibDk); b.rect(237, g - 5, 6, 1, P.zibDk);
  // flowers on hedges, fallen leaves
  const R = rng(14);
  for (let i = 0; i < 46; i++) {
    const x = Math.floor(R() * LW), y = 22 + Math.floor(R() * 12);
    const c = b.get(x, y);
    if (c === '#46B26B' || c === '#2F8A63') b.set(x, y, [P.pink, P.white, P.gold, P.heart][i % 4]);
  }
  for (let i = 0; i < 14; i++) { const x = Math.floor(R() * LW); b.set(x, g, P.orange); b.set(x + 1, g - 1, P.gold); }
  return b;
}

// ---------------------------------------------------------------- woods
function drawWoodsFar() {
  const b = new WBuf(LW, 110);
  const R = rng(31);
  // misty back row of pines
  for (let i = 0; i < 24; i++) {
    const x = Math.round(i * (LW / 24) + R() * 8), h = 52 + Math.floor(R() * 30);
    pine(b, x, 104, h, 20 + Math.floor(R() * 6), '#7CC49A', '#5FA884', '#A2DDB4', '#6B8FB0', '#8E6A52');
  }
  // haze band (dither)
  for (let y = 70; y < 96; y++) for (let x = 0; x < LW; x++) if (b.get(x, y) && BAYER[y & 3][x & 3] < Math.round(((y - 70) / 26) * 6)) b.set(x, y, '#C8EAD6');
  // front row, bigger and richer
  for (let i = 0; i < 12; i++) {
    const x = Math.round(i * (LW / 12) + 8 + R() * 14), h = 66 + Math.floor(R() * 30);
    pine(b, x, 108, h, 26 + Math.floor(R() * 8), P.pine, P.pineDk, P.pineLt, '#2A3F6E', P.dirtDk);
  }
  // ground strip
  hill(b, (x) => 101 + wv(x, 6, 0.3) * 1.3, '#3E9A74', '#58B67C');
  // giant mushrooms
  [[92, 7, P.heart, P.heartDk], [214, 9, P.orange, P.heartDk], [326, 6, P.riya, P.riyaDk], [48, 5, P.pink, P.heart]].forEach(([x, r, c, d]) => mushroom(b, x, 106, r, c, d, '#2A3F6E'));
  // fireflies
  const fr = rng(77);
  for (let i = 0; i < 26; i++) { const x = Math.floor(fr() * LW), y = 26 + Math.floor(fr() * 64); glowDot(b, x, y, '#FFF8C0', i % 3 ? '#C6FF4D' : '#FFE27A'); }
  return b;
}

function drawWoodsNear() {
  const b = new WBuf(LW, 40);
  const g = 39;
  const R = rng(41);
  // grass base mounds
  grp(b, (t) => {
    for (let x = 0; x < LW; x += 1) { const h = 30 + Math.round(2 * wv(x, 9, 0.6) + 1.5 * wv(x, 17, 2)); for (let y = h; y < g; y++) t.set(x, y, P.pineDk); }
    // stump
    t.rect(112, g - 14, 16, 14, P.woodDk); t.ell(120, g - 14, 8, 2.6, P.woodLt); t.rect(112, g - 14, 4, 14, P.wood);
    // big ferns
    [[40, 16], [196, 18], [300, 15], [376, 17]].forEach(([x, h]) => {
      for (let k = -3; k <= 3; k++) { const L = h - Math.abs(k) * 2; t.line(x, g, x + k * 4, g - L, P.pine, 2); t.line(x + k * 4, g - L, x + k * 5, g - L + 2, P.pineLt, 1); }
    });
    // fallen log
    t.rect(246, g - 10, 38, 9, P.wood); t.ell(246, g - 5.5, 3, 4.6, P.woodLt); t.rect(250, g - 10, 34, 2, P.woodLt); t.rect(250, g - 3, 34, 2, P.woodDk);
    t.ell(268, g - 11, 7, 2.4, P.pineLt, g - 9);
    // boulders
    t.ell(70, g - 5, 9, 6, P.stone, g - 1); t.ell(160, g - 4, 7, 5, P.stone, g - 1);
  }, INK);
  b.rect(114, g - 12, 5, 1, P.gold);
  [[70, g - 8], [160, g - 6]].forEach(([x, y]) => { b.set(x - 3, y, P.gray); b.set(x - 2, y - 1, P.white); b.rect(x + 2, y + 1, 3, 3, P.stoneDk); });
  // mushrooms + flowers
  [[20, 8, P.heart, P.heartDk], [84, 6, P.orange, P.heartDk], [142, 7, P.pink, P.heart], [222, 9, P.riya, P.riyaDk], [330, 7, P.heart, P.heartDk], [356, 5, P.gold, P.orange]].forEach(([x, r, c, d]) => mushroom(b, x, g, r, c, d, INK));
  for (let i = 0; i < 40; i++) { const x = Math.floor(R() * LW); const y = g - 1 - Math.floor(R() * 4); if (!b.get(x, y)) { if (i % 4) tuft(b, x, y - 1, P.pineLt); else flower(b, x, y - 2, [P.pink, P.white, P.gold][i % 3]); } }
  return b;
}


// ---------------------------------------------------------------- shared night/interior helpers
function bulb(b, x, y, c, halo) {
  // halo: soft dither ring around a bright lamp
  for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) {
    const d = Math.hypot(i, j);
    if (d > 1.2 && d < 3.6 && BAYER[(y + j) & 3][(x + i) & 3] < Math.round((3.6 - d) * 3) && !b.get(x + i, y + j)) b.set(x + i, y + j, halo);
  }
  b.set(x, y, c); b.set(x - 1, y, c); b.set(x + 1, y, c); b.set(x, y + 1, c); b.set(x, y - 1, c);
  b.set(x, y, P.white);
}
function lightString(b, x0, y0, x1, y1, sag, n, cols, ink, haloCols) {
  const pts = sagLine(x0, y0, x1, y1, sag, 200);
  for (let i = 1; i < pts.length; i++) b.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], ink);
  for (let i = 1; i < n; i++) {
    const t = i / n, x = Math.round(x0 + (x1 - x0) * t), y = Math.round(y0 + (y1 - y0) * t + sag * 4 * t * (1 - t));
    bulb(b, x, y + 3, cols[i % cols.length], haloCols[i % haloCols.length]);
    b.set(x, y + 1, ink); b.set(x, y + 2, ink);
  }
}
function beam(b, x, y, dirX, len, w0, w1, c, dens) {
  for (let i = 0; i < len; i++) {
    const t = i / len, cx = x + dirX * i, half = w0 + (w1 - w0) * t;
    const yy = y - i;
    if (yy < 0) break;
    for (let xx = Math.floor(cx - half); xx <= Math.ceil(cx + half); xx++) if (BAYER[yy & 3][xx & 3] < dens && !b.get(xx, yy)) b.set(xx, yy, c);
  }
}
function personSil(b, x, base, s, col, rim, arms, stick, look, front) {
  const hr = Math.round(4 * s), sw = Math.round(7 * s);
  const headY = base - Math.round(21 * s);
  const t = new WBuf(b.w, b.h);
  t.ell(x, base - Math.round(5 * s), sw, Math.round(10 * s), col, base);
  t.rect(x - sw, base - Math.round(5 * s), sw * 2, Math.round(6 * s) + 8, col);
  t.rect(x - 2, headY + hr - 1, 5, 4, col);
  t.circle(x + 0.5, headY, hr, col);
  const handY = headY - hr - Math.round(3 * s);
  const hands = [];
  [-1, 1].forEach((d) => {
    if (arms === 2 || arms === d) {
      const hx = x + d * Math.round((sw + 3) * s ** 0.5), sy = base - Math.round(15 * s);
      t.line(x + d * (sw - 2), sy, hx, handY, col, front ? 3 : 2);
      t.circle(hx, handY, 1.8 * s + 0.6, col);
      hands.push([hx, handY, d]);
    }
  });
  const ey = headY - hr;
  if (look === 1) { t.poly([[x - hr, headY - 1], [x - hr, ey - 4], [x - 1, ey]], col); t.poly([[x + hr + 1, headY - 1], [x + hr + 1, ey - 4], [x + 2, ey]], col); }
  if (look === 2) { t.line(x, ey, x + 2, ey - 5, col, 1); t.circle(x + 2.5, ey - 6, 1.6, col); }
  if (look === 3) { t.line(x - 2, ey + 1, x - 4, ey - 6, col, 2); t.line(x + 3, ey + 1, x + 5, ey - 6, col, 2); }
  if (look === 4) { t.poly([[x - 3, ey + 1], [x - 5, ey - 3], [x - 1, ey]], col); t.poly([[x + 4, ey + 1], [x + 6, ey - 3], [x + 2, ey]], col); }
  b.blit(t, 0, 0);
  for (let yy = Math.floor(ey - 10); yy < base; yy++) for (let xx = Math.floor(x - sw - 8); xx < x + sw + 8; xx++) {
    if (t.get(xx, yy) && (!t.get(xx, yy - 1) || !t.get(xx - 1, yy)) && BAYER[yy & 3][xx & 3] < 10) b.set(xx, yy, rim);
  }
  hands.forEach(([hx, hy, d], k) => {
    const c = Array.isArray(stick) ? stick[k % stick.length] : stick;
    for (let j = 1; j <= 7; j++) { b.set(hx, hy - j, c); b.set(hx + 1, hy - j, c); }
    b.set(hx, hy - 8, c); b.set(hx + 1, hy - 8, c); b.set(hx, hy - 4, P.white); b.set(hx, hy - 5, P.white);
    for (let j = 2; j <= 7; j += 2) { if (!b.get(hx - 1, hy - j)) b.set(hx - 1, hy - j, c); if (!b.get(hx + 2, hy - j)) b.set(hx + 2, hy - j, c); }
  });
  if (look === 5) { b.set(x - 1, headY, P.white); b.set(x, headY, P.white); b.set(x - 1, headY + 1, P.white); b.set(x, headY + 1, INK); }
}

// ---------------------------------------------------------------- backstage
function curtainSeg(b, x0, w, side) {
  // red velvet curtain, tied back at y=66; side = 0 gathers left, 1 gathers right
  const t = new WBuf(b.w, b.h);
  const tieY = 66;
  const rowW = (y) => {
    if (y <= 56) return w;
    const k = Math.min(1, (y - 56) / 12);
    const narrow = w * 0.5;
    return w - (w - narrow) * k * k * (3 - 2 * k) + (y > 72 ? (y - 72) * 0.28 : 0);
  };
  for (let y = 8; y < 108; y++) {
    const rw = Math.round(rowW(y));
    const xs = side ? x0 + w - rw : x0;
    for (let i = 0; i < rw; i++) {
      const x = xs + i;
      const f = Math.sin(((x - x0) / w) * Math.PI * 6 + (y > 60 ? 0.5 : 0));
      t.set(x, y, f > 0.6 ? '#EE7A92' : f > 0 ? '#D8556F' : f > -0.55 ? '#B93C5E' : '#8E2E4E');
    }
  }
  t.rect(x0, 104, w, 2, '#FFC93C'); // hem
  t.outline(INK);
  b.blit(t, 0, 0);
  // tie-back rope + tassel
  const rw = Math.round(rowW(tieY));
  const xs = side ? x0 + w - rw : x0;
  b.line(xs, tieY - 1, xs + rw, tieY + 2, INK, 3); b.line(xs, tieY - 1, xs + rw, tieY + 2, '#FFC93C', 1);
  const tx = side ? xs : xs + rw;
  b.rect(tx - 1, tieY + 2, 3, 6, INK); b.rect(tx, tieY + 3, 1, 5, '#FFC93C'); b.set(tx, tieY + 1, '#FFC93C');
}
function drawBackstageFar() {
  const b = new WBuf(LW, 110);
  b.rect(0, 0, LW, 110, '#2B2350');
  for (let y = 0; y < 110; y++) for (let x = 0; x < LW; x++) if (BAYER[y & 3][x & 3] < Math.round((y / 110) * 7)) b.set(x, y, '#3A2F6B');
  for (let x = 0; x < LW; x += 20) b.rect(x, 12, 1, 98, '#241C48');
  // truss pillars + curtains
  for (let k = 0; k < 4; k++) {
    const gx = 4 + k * 100;
    curtainSeg(b, gx, 64, k % 2);
    // pillar in the gap
    const px = gx + 64 + 14;
    b.rect(px, 12, 9, 98, '#4B5068'); b.rect(px, 12, 2, 98, '#7A8196'); b.rect(px + 7, 12, 2, 98, '#2B2350');
    for (let y = 14; y < 106; y += 8) { b.line(px, y, px + 8, y + 7, INK); b.line(px + 8, y, px, y + 7, '#3A3F58'); }
    b.rect(px - 2, 106, 13, 4, '#3A3F58');
    // rope with knots and a sandbag
    const rx = px + 17;
    b.line(rx, 12, rx, 78, '#E8C99A', 1);
    for (let y = 22; y < 78; y += 11) { b.rect(rx - 1, y, 3, 2, '#C9A070'); }
    b.ell(rx, 86, 5, 6.5, (x, y, nx, ny) => (nx + ny > 0.3 ? '#9B7B52' : '#C9A070'));
    b.ring(rx, 86, 5, 6.3, INK); b.rect(rx - 1, 78, 3, 3, INK); b.rect(rx - 3, 85, 6, 1, '#7A5A3A');
    b.set(rx - 2, 83, '#E8C99A');
  }
  // light truss
  b.rect(0, 20, LW, 3, INK); b.rect(0, 20, LW, 1, '#B5BBCE'); b.rect(0, 28, LW, 3, INK); b.rect(0, 28, LW, 1, '#B5BBCE');
  for (let x = 0; x < LW; x += 8) { b.line(x, 23, x + 4, 28, '#7A8196'); b.line(x + 4, 28, x + 8, 23, '#4B5068'); }
  // par cans hanging from the truss
  const cols = ['#FF8FC7', '#FFC93C', '#7DF9FF', '#FFC93C'];
  for (let i = 0; i < 16; i++) {
    const x = 6 + i * 25;
    b.rect(x - 1, 31, 7, 7, INK); b.rect(x, 32, 5, 5, '#4B5068'); b.rect(x + 1, 36, 3, 2, cols[i % 4]); b.set(x + 2, 37, '#FFFFFF');
    beam(b, x + 2, 108, 0, 76, 1.5, 7, cols[i % 4], 2);
  }
  // valance across the very top
  b.rect(0, 0, LW, 9, '#B93C5E'); b.rect(0, 0, LW, 2, '#FFC93C'); b.rect(0, 2, LW, 2, '#EE7A92');
  for (let i = 0; i < 33; i++) {
    b.ell(i * 12 + 6, 9, 6.2, 5, (x, y, nx, ny) => (nx + ny > 0.4 ? '#8E2E4E' : '#D8556F'), 15);
    b.ring(i * 12 + 6, 9, 5.4, 6.4, INK);
    b.set(i * 12 + 6, 15, '#FFC93C'); b.set(i * 12 + 5, 14, '#FFC93C'); b.set(i * 12 + 7, 14, '#FFC93C');
  }
  b.rect(0, 9, LW, 1, INK);
  return b;
}
function drawBackstageNear() {
  const b = new WBuf(LW, 36);
  const g = 35;
  // cables running across the floor
  for (let x = 0; x < LW; x++) {
    const y = Math.round(31 + 2 * wv(x, 5, 0.8));
    b.rect(x, y, 1, 3, INK); b.set(x, y + 1, '#4B5068'); if (x % 9 < 2) b.set(x, y + 1, '#FFC93C');
  }
  const flight = (x, w, h, y) => {
    grp(b, (t) => { t.rect(x, y, w, h, '#2F2A4F'); }, INK);
    b.rect(x, y, w, 2, '#4B5068'); b.rect(x, y + h - 2, w, 2, '#1B1530');
    b.rect(x, y, 3, 3, '#B5BBCE'); b.rect(x + w - 3, y, 3, 3, '#B5BBCE'); b.rect(x, y + h - 3, 3, 3, '#B5BBCE'); b.rect(x + w - 3, y + h - 3, 3, 3, '#B5BBCE');
    b.rect(x + (w >> 1) - 2, y + 4, 4, 3, '#7A8196'); b.rect(x + (w >> 1) - 1, y + 5, 2, 1, INK);
    b.rect(x + 5, y + Math.floor(h / 2), w - 10, 1, '#4B5068');
    b.rect(x + 5, y + h - 6, 7, 3, '#FF4D6D'); b.rect(x + 6, y + h - 5, 5, 1, '#FFFFFF');
    b.rect(x + w - 11, y + h - 7, 5, 4, '#FFC93C');
  };
  flight(14, 32, 20, g - 20); flight(20, 20, 13, g - 33 + 0);
  flight(116, 26, 17, g - 17);
  flight(300, 30, 22, g - 22); flight(305, 18, 12, g - 34 + 0);
  // amp rack with knobs
  grp(b, (t) => { t.rect(60, g - 24, 22, 24, '#3A3F58'); }, INK);
  b.rect(60, g - 24, 22, 2, '#7A8196');
  [0, 1, 2].forEach((i) => { b.rect(63, g - 20 + i * 7, 16, 5, '#1B1530'); b.rect(64, g - 19 + i * 7, 14, 3, '#2B2350'); [0, 1, 2, 3].forEach((k) => b.set(66 + k * 3, g - 18 + i * 7, i % 2 ? '#7DF9FF' : '#FF8FC7')); b.set(77, g - 18 + i * 7, '#C6FF4D'); });
  // cable ramp (yellow with black bars)
  grp(b, (t) => { t.poly([[196, g], [200, g - 7], [226, g - 7], [230, g]], '#FFC93C'); }, INK);
  for (let i = 0; i < 7; i++) b.rect(202 + i * 4, g - 6, 2, 5, INK);
  // coiled rope
  grp(b, (t) => { t.ell(166, g - 6, 10, 6, '#E8C99A', g - 1); }, INK);
  b.ell(166, g - 6, 6.5, 3.5, '#C9A070', g - 1); b.ell(166, g - 6, 3.5, 1.8, INK, g - 1); b.rect(158, g - 6, 3, 1, '#FFF0DA'); b.rect(170, g - 8, 4, 1, '#FFF0DA');
  // mic stand + monitor wedge
  b.rect(256, g - 28, 1, 28, INK); b.rect(250, g - 1, 13, 1, INK); b.rect(252, g - 2, 9, 1, '#4B5068');
  b.line(256, g - 28, 262, g - 31, INK, 1); b.circle(264, g - 31.5, 2.4, INK); b.circle(264, g - 31.5, 1.4, '#B5BBCE');
  grp(b, (t) => { t.poly([[336, g], [340, g - 11], [364, g - 15], [368, g]], '#2F2A4F'); }, INK);
  b.rect(345, g - 11, 16, 3, '#7A8196'); b.rect(345, g - 11, 16, 1, '#FFFFFF');
  b.circle(353, g - 5, 3.2, INK); b.circle(353, g - 5, 2, '#4B5068'); b.set(352, g - 6, '#B5BBCE');
  // gaffer tape roll
  grp(b, (t) => { t.circle(386, g - 4, 4.6, '#FFC93C'); }, INK);
  b.circle(386, g - 4, 1.8, INK); b.set(384, g - 6, '#FFF0DA');
  return b;
}

// ---------------------------------------------------------------- canteen (night)
function drawCanteenFar() {
  const b = new WBuf(LW, 100);
  const R = rng(51);
  // night skyline of the college/canteen block with warm windows
  const sil = '#3C3070', silD = '#2B2350';
  hill(b, (x) => 58 + 5 * Math.round(wv(x, 4, 0.2) + wv(x, 9, 1)), sil, sil);
  grp(b, (t) => {
    [[0, 40, 60], [64, 36, 44], [114, 52, 34], [170, 30, 56], [236, 44, 40], [286, 34, 52], [346, 46, 44]].forEach(([x0, w, h]) => { t.rect(x0, 98 - h, w, h, sil); t.rect(x0 + w - 6, 98 - h, 6, h, silD); });
  }, '#241C48');
  [[0, 40, 60], [64, 36, 44], [114, 52, 34], [170, 30, 56], [236, 44, 40], [286, 34, 52], [346, 46, 44]].forEach(([x0, w, h]) => {
    for (let wy = 98 - h + 5; wy < 76; wy += 11) for (let wx = x0 + 4; wx < x0 + w - 8; wx += 9) { if (R() < 0.72) { b.rect(wx, wy, 4, 5, '#FFD27A'); b.rect(wx, wy, 4, 1, '#FFF3B0'); } else b.rect(wx, wy, 4, 5, '#241C48'); }
  });
  // rooftop water tanks and a neon arrow
  b.rect(190, 38, 12, 8, '#241C48'); b.rect(192, 36, 8, 2, '#241C48'); b.rect(196, 30, 1, 7, '#241C48');
  b.rect(250, 52, 10, 6, '#241C48'); b.rect(248, 50, 14, 2, '#241C48');
  // stalls
  const stall = (x0, w, awn1, awn2, kind) => {
    const top = 56, base = 97;
    grp(b, (t) => {
      t.rect(x0 + 2, top + 8, 3, base - top - 8, '#6F4125'); t.rect(x0 + w - 5, top + 8, 3, base - top - 8, '#6F4125');
      t.rect(x0 + 5, top + 12, w - 10, base - top - 12, '#FFB15E');
      t.rect(x0, base - 14, w, 14, '#8E5A35');
      for (let i = 0; i < w; i += 5) t.rect(x0 + i, top + 2, 5, 12, Math.floor(i / 5) % 2 ? awn1 : awn2);
      t.rect(x0 - 2, top, w + 4, 3, awn1);
      for (let i = 0; i < w; i += 5) t.ell(x0 + i + 2.5, top + 14, 2.6, 2.6, Math.floor(i / 5) % 2 ? awn1 : awn2, top + 17);
    }, '#241C48');
    // glowing interior (dither toward the counter)
    for (let y = top + 16; y < base - 14; y++) for (let x = x0 + 6; x < x0 + w - 6; x++) { const d = BAYER[y & 3][x & 3]; if (d < 7) b.set(x, y, '#FFD27A'); }
    b.rect(x0 + 5, base - 15, w - 10, 1, '#FFF3B0');
    b.rect(x0, base - 14, w, 2, '#B87A4B'); b.rect(x0, base - 3, w, 3, '#6F4125');
    for (let i = 0; i < w - 6; i += 8) b.rect(x0 + 5 + i, base - 11, 1, 8, '#6F4125');
    // goods per stall
    if (kind === 'chai') {
      b.ell(x0 + w / 2, base - 20, 7, 4.4, (X, Y, nx, ny) => (nx + ny > 0.4 ? '#7A8196' : '#B5BBCE'), base - 17); b.rect(x0 + w / 2 - 7, base - 18, 14, 2, '#4B5068');
      b.rect(x0 + 7, base - 22, 2, 5, '#FFF3B0'); b.rect(x0 + 7, base - 22, 2, 1, '#FFFFFF');
      // giant kettle sign above the awning
      grp(b, (t) => {
        t.ell(x0 + w / 2, top - 9, 10, 8, (X, Y, nx, ny) => (nx + ny > 0.45 ? '#B5BBCE' : (nx + ny < -0.7 ? '#FFFFFF' : '#E1E6F5')));
        t.rect(x0 + w / 2 - 6, top - 18, 12, 3, '#B5BBCE'); t.rect(x0 + w / 2 - 2, top - 21, 4, 3, '#FFC93C');
        t.poly([[x0 + w / 2 + 8, top - 8], [x0 + w / 2 + 17, top - 16], [x0 + w / 2 + 18, top - 14], [x0 + w / 2 + 10, top - 4]], '#B5BBCE');
        t.ring(x0 + w / 2 - 7, top - 12, 5, 6.4, '#7A8196');
      }, '#241C48');
      b.rect(x0 + w / 2 - 5, top - 12, 3, 1, '#FFFFFF');
      [[x0 + w / 2 + 19, top - 22], [x0 + w / 2 + 21, top - 27], [x0 + w / 2 + 18, top - 32]].forEach(([x, y]) => { b.ell(x, y, 2.6, 2, '#DCE0F2'); });
    } else if (kind === 'samosa') {
      [[10, '#FFC93C'], [18, '#FF8A3D'], [26, '#FFC93C']].forEach(([dx, c]) => { b.poly([[x0 + dx, base - 15], [x0 + dx + 3.5, base - 21], [x0 + dx + 7, base - 15]], c); });
      b.rect(x0 + w - 16, base - 22, 8, 7, '#8E2E4E'); b.rect(x0 + w - 16, base - 22, 8, 1, '#FF8FC7');
    } else if (kind === 'wok') {
      b.ell(x0 + w / 2, base - 18, 9, 4, (X, Y, nx, ny) => (ny > 0.2 ? '#2B2350' : '#4B5068'), base - 15);
      flame(b, x0 + w / 2 - 4, base - 14, 3, 6, 1); flame(b, x0 + w / 2 + 4, base - 14, 3, 5, -1);
      b.rect(x0 + w / 2 + 8, base - 28, 1, 8, '#B5BBCE');
    } else {
      [['#7DF9FF'], ['#FF8FC7'], ['#C6FF4D'], ['#FFC93C']].forEach(([c], i) => { b.rect(x0 + 8 + i * 6, base - 24, 4, 9, INK); b.rect(x0 + 9 + i * 6, base - 23, 2, 7, c); b.rect(x0 + 9 + i * 6, base - 26, 2, 2, INK); });
    }
    // hanging sign board
    b.rect(x0 + w / 2 - 9, top + 19, 18, 6, INK); b.rect(x0 + w / 2 - 8, top + 20, 16, 4, '#FFF3B0');
    b.rect(x0 + w / 2 - 6, top + 21, 3, 2, awn1); b.rect(x0 + w / 2 - 1, top + 21, 3, 2, '#6F4125'); b.rect(x0 + w / 2 + 4, top + 21, 2, 2, awn1);
    b.line(x0 + w / 2 - 6, top + 14, x0 + w / 2 - 6, top + 19, INK); b.line(x0 + w / 2 + 6, top + 14, x0 + w / 2 + 6, top + 19, INK);
  };
  stall(16, 54, '#E8506E', '#FFF0DA', 'chai');
  stall(120, 52, '#FF8A3D', '#FFF0DA', 'samosa');
  stall(214, 54, '#7DC7FF', '#FFF0DA', 'wok');
  stall(310, 52, '#B79BFF', '#FFF0DA', 'drinks');
  // ground glow
  for (let y = 90; y < 100; y++) for (let x = 0; x < LW; x++) if (!b.get(x, y) && BAYER[y & 3][x & 3] < (y - 89)) b.set(x, y, '#FF8A3D');
  // string lights between poles
  [0, 100, 200, 300].forEach((px) => { b.rect(px, 20, 2, 80, '#241C48'); b.rect(px, 20, 1, 80, '#4A3A7A'); });
  const lc = ['#FFC93C', '#FF8FC7', '#7DF9FF'], hc = ['#8A6A2A', '#8A4A6A', '#2A6A8A'];
  [0, 100, 200, 300].forEach((px, i) => lightString(b, px + 1, 22, px + 101, 22, 9, 12, lc, '#241C48', hc));
  lightString(b, 20, 44, 190, 38, 9, 14, ['#FF8FC7', '#FFC93C'], '#241C48', ['#8A4A6A', '#8A6A2A']);
  lightString(b, 214, 38, 380, 44, 9, 14, ['#7DF9FF', '#FFC93C'], '#241C48', ['#2A6A8A', '#8A6A2A']);
  return b;
}
function drawCanteenNear() {
  const b = new WBuf(LW, 36);
  const g = 35;
  const table = (x, w) => {
    grp(b, (t) => {
      t.rect(x, g - 17, w, 3, '#E8B27C'); t.rect(x, g - 14, w, 2, '#A8683C');
      t.rect(x + 3, g - 12, 3, 12, '#6F4125'); t.rect(x + w - 6, g - 12, 3, 12, '#6F4125');
      t.rect(x - 4, g - 6, w + 8, 2, '#A8683C'); // bench plank
    }, INK);
    b.rect(x, g - 17, w, 1, '#FFE0B0');
    // chai glasses + plate
    [[x + 6, '#E8B27C'], [x + 13, '#E8B27C']].forEach(([gx, c]) => { b.rect(gx, g - 22, 4, 5, '#FFF0DA'); b.rect(gx, g - 22, 4, 1, '#FFFFFF'); b.rect(gx + 1, g - 21, 2, 3, c); b.rect(gx, g - 22, 4, 5, null); b.rect(gx, g - 22, 4, 5, (X, Y) => (X === gx || X === gx + 3 || Y === g - 22 ? '#FFF0DA' : '#C98B5A')); b.rect(gx, g - 18, 4, 1, INK); b.set(gx + 4, g - 20, INK); });
    b.rect(x + w - 14, g - 19, 10, 2, '#FFFFFF'); b.rect(x + w - 14, g - 20, 10, 1, '#B5BBCE');
    b.poly([[x + w - 12, g - 20], [x + w - 8.5, g - 24], [x + w - 5, g - 20]], '#FFC93C');
    for (let i = 0; i < 2; i++) { b.set(x + 8 + i * 7, g - 24, '#FFFFFF'); b.set(x + 9 + i * 7, g - 26, '#DCE0F2'); }
  };
  table(26, 40); table(232, 44);
  // plastic stools
  [[100, '#E8506E'], [120, '#FFC93C'], [320, '#7DC7FF'], [344, '#FF8A3D']].forEach(([x, c]) => {
    grp(b, (t) => { t.ell(x, g - 10, 7, 2.6, c); t.rect(x - 5, g - 9, 3, 9, c); t.rect(x + 3, g - 9, 3, 9, c); t.rect(x - 4, g - 4, 9, 1, c); }, INK);
    b.rect(x - 5, g - 11, 8, 1, P.white);
  });
  // stove with steaming kettle
  grp(b, (t) => {
    t.rect(160, g - 14, 28, 14, '#4B5068');
    t.ell(174, g - 20, 8, 7, (X, Y, nx, ny) => (nx + ny > 0.4 ? '#B5BBCE' : '#E1E6F5'), g - 14);
    t.rect(166, g - 28, 16, 3, '#B5BBCE'); t.rect(172, g - 30, 4, 3, '#FFC93C');
    t.poly([[181, g - 22], [188, g - 29], [190, g - 27], [183, g - 17]], '#B5BBCE');
    t.ring(166, g - 24, 4, 5.3, '#7A8196');
  }, INK);
  b.rect(163, g - 12, 22, 2, '#2B2350'); flame(b, 167, g - 8, 2, 5, 1); flame(b, 174, g - 8, 2, 6, -1); flame(b, 181, g - 8, 2, 5, 1);
  [[190, g - 32], [192, g - 37], [189, g - 42]].forEach(([x, y]) => b.ell(x, y, 2.4, 1.8, '#E1E6F5'));
  // plate stack, trash can, ice cooler
  grp(b, (t) => { for (let i = 0; i < 4; i++) t.ell(211, g - 3 - i * 2.2, 7, 1.7, i % 2 ? '#FFFFFF' : '#DCE0F2'); }, INK);
  grp(b, (t) => { t.rect(292, g - 13, 10, 13, '#168A80'); t.rect(291, g - 14, 12, 2, '#2EC4B6'); }, INK);
  b.rect(293, g - 9, 8, 1, '#0E6A62'); b.rect(293, g - 5, 8, 1, '#0E6A62');
  grp(b, (t) => { t.rect(366, g - 14, 28, 14, '#7DC7FF'); t.rect(364, g - 17, 32, 4, '#FFFFFF'); }, INK);
  b.rect(366, g - 14, 28, 2, '#B8E2FF'); b.rect(370, g - 10, 20, 2, '#FFFFFF'); b.rect(372, g - 6, 16, 1, '#3F8FD0');
  // seated diners (silhouettes)
  [[48, 0], [254, 1]].forEach(([x, k]) => {
    grp(b, (t) => { t.ell(x + 12, g - 22, 4.2, 4.6, P.night); t.ell(x + 12, g - 12, 6, 7, P.night, g - 7); }, INK);
    b.set(x + 11, g - 23, P.white); b.set(x + 14, g - 23, P.white);
    if (k) b.rect(x + 10, g - 20, 4, 1, P.pink);
  });
  // warm light spill under the tables
  for (let y = g - 3; y <= g; y++) for (let x = 14; x < 392; x++) if (!b.get(x, y) && BAYER[y & 3][x & 3] < 3) b.set(x, y, '#FF8A3D');
  return b;
}

// ---------------------------------------------------------------- night (the main stage run)
function drawNightFar() {
  const b = new WBuf(LW, 110);
  const R = rng(61);
  // distant hills + tents with fairy lights
  hill(b, (x) => 92 + 4 * wv(x, 3, 1) + 2 * wv(x, 8, 0.2), '#2A2050', '#3A2F6B');
  [[26, 20, 14], [66, 16, 11], [355, 22, 15], [388, 14, 10]].forEach(([x, w, h]) => {
    grp(b, (t) => { t.poly([[x - w / 2, 96], [x, 96 - h - 3], [x + w / 2, 96]], '#4A3A7A'); t.rect(x - w / 2, 90, w, 6, '#4A3A7A'); }, '#1B1530');
    b.set(x, 96 - h - 5, '#FFC93C');
  });
  lightString(b, 14, 74, 84, 78, 6, 8, ['#FFC93C', '#FF8FC7', '#7DF9FF'], '#1B1530', ['#7A5A22', '#7A3A5A', '#2A5A7A']);
  // crowd light beams (behind the stage structure)
  const bcols = ['#FF8FC7', '#FFC93C', '#7DF9FF', '#FFFFFF', '#C9B0FF', '#FFC93C', '#FF8FC7'];
  const stageL = 124, stageR = 276;
  const lamps = [];
  for (let i = 0; i < 7; i++) lamps.push(stageL + 14 + i * 20.5);
  lamps.forEach((x, i) => beam(b, x, 36, (i - 3) * 0.28, 62, 1.5, 9, bcols[i], 3));
  // stage structure
  grp(b, (t) => {
    t.rect(stageL, 34, stageR - stageL, 9, '#4B5068');
    t.rect(stageL - 4, 40, 10, 58, '#4B5068'); t.rect(stageR - 6, 40, 10, 58, '#4B5068');
    t.rect(stageL - 14, 58, 12, 38, '#2F2A4F'); t.rect(stageR + 6, 58, 12, 38, '#2F2A4F');
    t.rect(stageL - 6, 94, stageR - stageL + 12, 8, '#8E5A35');
  }, '#1B1530');
  b.rect(stageL, 34, stageR - stageL, 2, '#B5BBCE');
  for (let x = stageL; x < stageR; x += 5) { b.line(x, 36, x + 2, 42, '#2B2350'); b.line(x + 2, 42, x + 5, 36, '#7A8196'); }
  for (let y = 44; y < 94; y += 6) { b.line(stageL - 4, y, stageL + 5, y + 5, '#2B2350'); b.line(stageR - 6, y, stageR + 3, y + 5, '#2B2350'); }
  // LED screen
  const sx0 = stageL + 10, sx1 = stageR - 12, sy0 = 46, sy1 = 90;
  b.rect(sx0 - 1, sy0 - 1, sx1 - sx0 + 2, sy1 - sy0 + 2, '#1B1530');
  for (let y = sy0; y < sy1; y++) for (let x = sx0; x < sx1; x++) {
    const t = (y - sy0) / (sy1 - sy0);
    let c = t < 0.35 ? '#5B3FB8' : t < 0.65 ? '#B04AD0' : '#FF6FA8';
    if (BAYER[y & 3][x & 3] < Math.round((t % 0.33) * 40)) c = t < 0.35 ? '#B04AD0' : t < 0.65 ? '#FF6FA8' : '#FFC93C';
    b.set(x, y, c);
  }
  for (let y = sy0; y < sy1; y += 3) b.rect(sx0, y, sx1 - sx0, 1, '#2B2350');
  const cx = (sx0 + sx1) / 2;
  b.poly([[cx, 52], [cx + 4, 61], [cx + 14, 62], [cx + 6, 69], [cx + 9, 79], [cx, 73], [cx - 9, 79], [cx - 6, 69], [cx - 14, 62], [cx - 4, 61]], '#FFC93C');
  b.poly([[cx, 56], [cx + 2, 62], [cx + 8, 63], [cx + 3, 67], [cx, 66], [cx - 3, 67], [cx - 8, 63], [cx - 2, 62]], '#FFF3B0');
  [[sx0 + 8, 56], [sx1 - 10, 54], [sx0 + 12, 82], [sx1 - 14, 84], [sx0 + 4, 70], [sx1 - 4, 72]].forEach(([x, y]) => { b.set(x, y, '#FFFFFF'); b.set(x - 1, y, '#7DF9FF'); b.set(x + 1, y, '#7DF9FF'); b.set(x, y - 1, '#7DF9FF'); b.set(x, y + 1, '#7DF9FF'); });
  // side curtains
  [[stageL + 2, 8], [stageR - 10, 8]].forEach(([x, w]) => { b.rect(x, 44, w, 48, '#B93C5E'); for (let i = 0; i < w; i += 3) b.rect(x + i, 44, 1, 48, '#EE7A92'); b.rect(x, 44, w, 1, INK); });
  // truss lights along the roof
  for (let i = 0; i < 17; i++) bulb(b, stageL + 4 + i * 8.5 | 0, 40, ['#FF8FC7', '#FFC93C', '#7DF9FF'][i % 3], ['#8A4A6A', '#8A6A2A', '#2A6A8A'][i % 3]);
  // lamps themselves
  lamps.forEach((x, i) => { b.rect(x - 3, 43, 7, 5, '#1B1530'); b.rect(x - 2, 44, 5, 3, '#4B5068'); b.rect(x - 1, 46, 3, 2, bcols[i]); });
  // deck + footlights
  b.rect(stageL - 6, 94, stageR - stageL + 12, 8, '#8E5A35'); b.rect(stageL - 6, 94, stageR - stageL + 12, 2, '#D99A5E');
  for (let x = stageL - 4; x < stageR + 4; x += 6) bulb(b, x, 100, ['#FFC93C', '#FF8FC7'][(x / 6 | 0) % 2], '#6A4A2A');
  // speaker stacks
  [[stageL - 14, 58], [stageR + 6, 58]].forEach(([x, y]) => { for (let k = 0; k < 3; k++) { b.rect(x + 1, y + 2 + k * 12, 10, 11, '#3A3F58'); b.circle(x + 6, y + 8 + k * 12, 3.4, '#1B1530'); b.circle(x + 6, y + 8 + k * 12, 2.2, '#7A8196'); } });
  // ferris wheel, fully lit
  const wx = 338, wy = 62, Rw = 34;
  b.line(wx, wy, wx - 20, 108, '#1B1530', 3); b.line(wx, wy, wx + 20, 108, '#1B1530', 3);
  b.line(wx, wy, wx - 20, 108, '#4A3A7A', 1); b.line(wx + 1, wy, wx + 21, 108, '#2B2350', 1);
  b.ring(wx, wy, Rw - 1.2, Rw + 1.2, '#1B1530'); b.ring(wx, wy, 17, 18.2, '#1B1530');
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; b.line(wx + Math.cos(a) * 4, wy + Math.sin(a) * 4, wx + Math.cos(a) * (Rw - 1), wy + Math.sin(a) * (Rw - 1), '#4A3A7A', 1); }
  for (let i = 0; i < 40; i++) { const a = (i / 40) * Math.PI * 2; bulb(b, Math.round(wx + Math.cos(a) * Rw), Math.round(wy + Math.sin(a) * Rw), i % 2 ? '#FFC93C' : '#FF8FC7', i % 2 ? '#8A6A2A' : '#8A4A6A'); }
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2 + 0.2, gx = Math.round(wx + Math.cos(a) * Rw), gy = Math.round(wy + Math.sin(a) * Rw); b.rect(gx - 3, gy + 1, 7, 6, '#1B1530'); b.rect(gx - 2, gy + 2, 5, 4, ['#7DF9FF', '#FF8FC7', '#C6FF4D', '#FFC93C'][i % 4]); b.rect(gx - 2, gy + 2, 5, 1, '#FFFFFF'); }
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; bulb(b, Math.round(wx + Math.cos(a) * 17.5), Math.round(wy + Math.sin(a) * 17.5), '#7DF9FF', '#2A6A8A'); }
  b.circle(wx, wy, 5, '#1B1530'); b.circle(wx, wy, 3.6, '#FFC93C'); b.set(wx - 1, wy - 1, '#FFFFFF');
  // a few stars of confetti high up
  const fr = rng(99);
  for (let i = 0; i < 20; i++) { const x = Math.floor(fr() * LW), y = 4 + Math.floor(fr() * 28); if (!b.get(x, y)) b.set(x, y, [P.gold, P.pink, P.cyan, P.white][i % 4]); }
  return b;
}
function drawNightNear() {
  const b = new WBuf(LW, 40);
  const g = 39;
  const R = rng(71);
  const sticks = ['#C6FF4D', '#FF8FC7', '#7DF9FF', '#FFC93C', '#B79BFF'];
  // back row: smaller, lighter silhouettes
  for (let i = 0; i < 20; i++) {
    const x = Math.round(i * 20 + 5 + R() * 8);
    personSil(b, x, g - 3, 0.72, '#352A66', i % 2 ? '#FF8FC7' : '#7DF9FF', [0, 1, -1, 2, 1][i % 5], sticks[i % 5], [0, 0, 1, 0, 3, 0, 4][i % 7], false);
  }
  // front row: big dark silhouettes with glow sticks and a few weird creatures
  for (let i = 0; i < 14; i++) {
    const x = Math.round(i * (LW / 14) + 6 + R() * 8);
    personSil(b, x, g + 5, 1.0, '#1B1530', i % 2 ? '#FF8FC7' : '#7DF9FF', [2, 0, 1, -1, 2, 1, 0, -1][i % 8], i % 3 === 0 ? [sticks[i % 5], sticks[(i + 2) % 5]] : sticks[(i + 1) % 5], [0, 1, 0, 2, 3, 0, 4, 0, 1, 0][i % 10], true);
  }
  // phone torches
  for (let i = 0; i < 10; i++) { const x = Math.floor(R() * LW), y = 6 + Math.floor(R() * 16); if (!b.get(x, y)) { b.rect(x, y, 2, 3, '#FFF3B0'); b.set(x - 1, y + 1, '#FFC93C'); b.set(x + 2, y + 1, '#FFC93C'); } }
  return b;
}

// ---------------------------------------------------------------- the meeting hall (full 400x180 room)
function drawHall() {
  const b = new Buf(400, 180);
  // wall with soft vertical wallpaper stripes
  for (let y = 0; y < 147; y++) for (let x = 0; x < 400; x++) b.set(x, y, Math.floor(x / 10) % 2 ? '#E9DDF5' : '#E1D3F0');
  b.rect(0, 0, 400, 5, '#6A3FD1'); b.rect(0, 5, 400, 2, '#9B6BFF'); b.rect(0, 7, 400, 1, '#4C2E9E');
  // wainscot panelling
  b.rect(0, 108, 400, 3, '#E8B27C'); b.rect(0, 108, 400, 1, '#FFE0B0'); b.rect(0, 111, 400, 1, '#6F4125');
  b.rect(0, 112, 400, 35, '#A8683C');
  for (let x = 2; x < 400; x += 24) { b.rect(x, 116, 20, 26, '#8E5A35'); b.rect(x + 1, 117, 18, 24, '#B87A4B'); b.rect(x + 1, 117, 18, 1, '#D99A5E'); b.rect(x + 1, 117, 1, 24, '#D99A5E'); }
  b.rect(0, 143, 400, 4, '#6F4125'); b.rect(0, 143, 400, 1, '#B87A4B');
  // floor
  for (let y = 147; y < 180; y++) {
    const row = Math.floor((y - 147) / 6);
    for (let x = 0; x < 400; x++) {
      const seam = (x + (row % 2) * 22) % 44 === 0;
      b.set(x, y, seam ? '#8E5A35' : ((y - 147) % 6 === 0 ? '#E8B27C' : (row % 2 ? '#D99A5E' : '#CF8E52')));
    }
  }
  b.rect(0, 147, 400, 2, '#6F4125'); b.rect(0, 149, 400, 2, '#B87A4B');
  // window light patches on the floor
  [[24, 60], [86, 56]].forEach(([x0, w]) => { for (let y = 152; y < 180; y++) for (let x = x0 + (y - 152) * 0.6; x < x0 + w + (y - 152) * 0.6; x++) if (BAYER[y & 3][Math.floor(x) & 3] < 4) b.set(Math.floor(x), y, '#FFE9A8'); });
  // two windows with sky, sun, clouds and curtains
  const window_ = (x0, y0) => {
    b.rect(x0 - 3, y0 - 3, 46, 66, '#6F4125'); b.rect(x0 - 2, y0 - 2, 44, 64, '#E8B27C');
    b.rect(x0, y0, 40, 60, '#8FD3FF');
    for (let y = 0; y < 60; y++) for (let x = 0; x < 40; x++) if (BAYER[y & 3][x & 3] < Math.max(0, 11 - (y >> 2)) ) b.set(x0 + x, y0 + y, '#C9EEFF');
    b.circle(x0 + 28, y0 + 14, 6, '#FFC93C'); b.circle(x0 + 28, y0 + 14, 4.5, '#FFE27A'); b.set(x0 + 26, y0 + 12, '#FFFFFF');
    cloud(b, x0 + 12, y0 + 22, 0.55);
    // distant campus tree line
    for (let x = 0; x < 40; x++) { const h = 8 + Math.round(2 * Math.sin(x / 3)); for (let y = 60 - h; y < 60; y++) b.set(x0 + x, y0 + y, y === 60 - h ? '#9CE86C' : '#6BCB5A'); }
    b.rect(x0 + 19, y0, 2, 60, '#6F4125'); b.rect(x0, y0 + 29, 40, 2, '#6F4125');
    b.rect(x0 - 5, y0 + 60, 50, 4, '#6F4125'); b.rect(x0 - 5, y0 + 60, 50, 1, '#E8B27C');
    // curtains
    [[x0 - 6, 1], [x0 + 38, 0]].forEach(([cx, side]) => { b.poly([[cx, y0 - 5], [cx + 8, y0 - 5], [cx + (side ? 8 : 7), y0 + 40], [cx + (side ? 5 : 3), y0 + 52], [cx + 1, y0 + 52], [cx, y0 + 40]], '#9B6BFF'); b.rect(cx + 2, y0 - 4, 1, 50, '#C9B0FF'); b.rect(cx + 5, y0 - 4, 1, 50, '#6A3FD1'); });
    b.rect(x0 - 8, y0 - 7, 56, 3, '#4C2E9E'); b.rect(x0 - 8, y0 - 7, 56, 1, '#9B6BFF');
  };
  window_(20, 36); window_(76, 36);
  // fest banner on the wall
  b.rect(128, 40, 62, 26, INK);
  b.rect(129, 41, 60, 24, '#FF4D6D'); b.rect(129, 41, 60, 3, '#FF8FC7'); b.rect(129, 62, 60, 3, '#C21E45');
  text(b, 'FEST', 140, 47, FONT57, 5, INK, 2, 1); text(b, 'FEST', 139, 46, FONT57, 5, P.white, 2, 1);
  for (let i = 0; i < 15; i++) b.rect(129 + i * 4, 65, 2, 3, i % 2 ? '#FFC93C' : '#FF8A3D');
  b.rect(134, 36, 2, 5, INK); b.rect(182, 36, 2, 5, INK);
  [[132, 44], [186, 44], [132, 61], [186, 61]].forEach(([x, y]) => { b.set(x, y, '#FFC93C'); b.set(x + 1, y, '#FFC93C'); });
  // bunting across the top
  bunting(b, 6, 10, 196, 12, 8, 11, [P.pink, P.gold, P.zib, P.orange, P.riya, P.heart]);
  bunting(b, 344, 10, 398, 12, 5, 11, [P.zib, P.pink, P.gold, P.riya], 2);
  // round wall clock
  b.circle(163, 24, 8, INK); b.circle(163, 24, 6.8, '#FFF6E5'); b.circle(163, 24, 6.8, (x, y, nx, ny) => (nx + ny > 0.6 ? '#C9B8E0' : '#FFF6E5'));
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; b.set(163 + Math.cos(a) * 5.4, 24 + Math.sin(a) * 5.4, INK); }
  b.line(163, 24, 163, 19, INK); b.line(163, 24, 166, 25, INK); b.set(163, 24, '#FF4D6D');
  // whiteboard: centre-right, wide empty middle for flying task cards
  b.rect(196, 26, 140, 80, INK);
  b.rect(197, 27, 138, 78, '#B5BBCE'); b.rect(197, 27, 138, 2, '#E1E6F5'); b.rect(197, 103, 138, 2, '#7A8196');
  b.rect(200, 30, 132, 68, '#FBFBFF');
  for (let i = 0; i < 70; i++) { const d = i * 2; for (let k = 0; k < 5; k++) { const x = 202 + ((d + k * 3) % 126), y = 31 + ((i * 5) % 64); if (BAYER[y & 3][x & 3] < 1) b.set(x, y, '#EDEFFC'); } }
  b.rect(200, 30, 132, 1, '#DDE0F5'); b.rect(331, 30, 1, 68, '#DDE0F5');
  // tiny corner doodles (kept at the edge)
  b.circle(207, 37, 3.2, '#FFC93C'); b.set(206, 36, INK); b.set(208, 36, INK); b.set(206, 39, INK); b.set(207, 39, INK); b.set(208, 39, INK);
  b.line(322, 36, 328, 36, '#9B6BFF'); b.line(326, 34, 328, 36, '#9B6BFF'); b.line(326, 38, 328, 36, '#9B6BFF');
  b.line(204, 93, 214, 93, '#2EC4B6'); b.line(204, 95, 210, 95, '#FF8FC7');
  // marker tray with markers
  b.rect(212, 105, 106, 3, '#7A8196'); b.rect(212, 105, 106, 1, '#B5BBCE'); b.rect(212, 107, 106, 1, INK);
  [[222, '#FF4D6D'], [232, '#2EC4B6'], [242, '#9B6BFF'], [300, '#FFC93C']].forEach(([x, c]) => { b.rect(x, 103, 7, 2, c); b.rect(x, 103, 7, 1, '#FFFFFF'); b.rect(x + 7, 103, 1, 2, INK); });
  b.rect(262, 104, 14, 3, '#E1E6F5'); b.rect(262, 104, 14, 1, '#FFFFFF');   // eraser
  // bookshelf on the right wall
  b.rect(346, 46, 50, 101, INK); b.rect(347, 47, 48, 99, '#8E5A35');
  for (let s = 0; s < 4; s++) {
    const y0 = 50 + s * 24;
    b.rect(349, y0, 44, 21, '#4B2E1A'); b.rect(349, y0 + 21, 44, 2, '#D99A5E');
    let x = 351;
    const cols = ['#FF4D6D', '#2EC4B6', '#FFC93C', '#9B6BFF', '#FF8A3D', '#8DBB3A', '#7DC7FF', '#FF8FC7'];
    for (let i = 0; i < 11 && x < 389; i++) { const w = 3 + ((i * 5 + s * 3) % 3), h = 13 + ((i * 7 + s) % 7); b.rect(x, y0 + 21 - h, w, h, cols[(i + s * 2) % cols.length]); b.rect(x, y0 + 21 - h, w, 1, '#FFFFFF'); b.rect(x + w - 1, y0 + 21 - h, 1, h, INK); x += w + 1; }
  }
  // plant on top of the shelf and on the floor
  b.rect(363, 38, 14, 8, '#C21E45'); b.rect(363, 38, 14, 2, '#FF4D6D'); b.rect(364, 46, 12, 1, INK);
  [[-6, -14], [-2, -18], [3, -17], [7, -12], [0, -9]].forEach(([dx, dy]) => { b.line(370, 38, 370 + dx, 38 + dy, '#2F8A63', 2); b.circle(370 + dx, 38 + dy, 2.4, '#58B67C'); });
  b.rect(3, 128, 14, 19, '#FF4D6D'); b.rect(3, 128, 14, 3, '#FF8FC7'); b.rect(5, 145, 10, 2, '#C21E45');
  [[-5, -16], [0, -22], [5, -17], [-8, -8], [8, -9]].forEach(([dx, dy]) => { b.line(10, 128, 10 + dx, 128 + dy, '#2F8A63', 2); b.circle(10 + dx, 128 + dy, 3, '#58B67C'); b.set(9 + dx, 127 + dy, '#9CE86C'); });
  // framed certificate and a pennant between the windows and banner
  b.rect(118, 30, 6, 1, INK);
  b.rect(114, 90, 0, 0, INK);
  // soft vignette at the floor/wall edge
  b.rect(0, 147, 400, 1, INK);
  // rug under the action (muted)
  b.ell(260, 169, 70, 8, '#9B6BFF'); b.ell(260, 169, 66, 6, '#C9B0FF'); b.ell(260, 169, 56, 4, '#9B6BFF');
  for (let x = 210; x < 312; x += 6) b.set(x, 169, '#FFFFFF');
  return b;
}

// ---------------------------------------------------------------- registry
const ST = (name, w, h, frames, draw, anims) => ({ name, w, h, frames, draw, anims });
const CREATURE_ANIMS = {
  idle: { from: 0, to: 1, loop: true, speed: 3 },
  run: { from: 2, to: 3, loop: true, speed: 10 },
  jump: { from: 4, to: 4 },
  happy: { from: 5, to: 5 },
  sad: { from: 6, to: 6 },
};
const DEFS = [
  ST('riya', 24, 24, 7, drawRiya, CREATURE_ANIMS),
  ST('zib', 24, 24, 7, drawZib, CREATURE_ANIMS),
  ST('gorp', 24, 24, 7, drawGorp, CREATURE_ANIMS),
  ST('heart', 9, 8, 3, drawHeart),
  ST('sparkle', 8, 8, 4, drawSparkle, { play: { from: 0, to: 3, speed: 12 } }),
  ST('smoke', 16, 16, 4, drawSmoke, { play: { from: 0, to: 3, speed: 10 } }),
  ST('shield', 28, 28, 2, drawShield, { glow: { from: 0, to: 1, loop: true, speed: 6 } }),
  ST('stormcloud', 32, 16, 2, drawStorm, { rumble: { from: 0, to: 1, loop: true, speed: 4 } }),
  ST('ob_budget', 16, 16, 2, drawBudget, { idle: { from: 0, to: 1, loop: true, speed: 4 } }),
  ST('ob_posters', 16, 16, 2, drawPosters, { idle: { from: 0, to: 1, loop: true, speed: 4 } }),
  ST('ob_stage', 16, 16, 2, drawStageOb, { idle: { from: 0, to: 1, loop: true, speed: 4 } }),
  ST('ob_food', 16, 12, 2, drawFoodOb, { idle: { from: 0, to: 1, loop: true, speed: 6 } }),
  ST('ground', 16, 16, 1, drawGround),
  ST('bg_campus', 320, 180, 1, drawCampus),
  ST('bg_hills', 320, 60, 1, drawHills),
  ST('bg_bushes', 320, 30, 1, drawBushes),
  ST('bg_night', 320, 180, 1, drawNight),
];
['budget', 'posters', 'stage', 'food'].forEach((t) => {
  DEFS.push(ST('prop_' + t + '_good', 48, 48, 1, () => drawProp('prop_' + t + '_good')));
  DEFS.push(ST('prop_' + t + '_bad', 48, 48, 1, () => drawProp('prop_' + t + '_bad')));
});
['situational', 'micromanager', 'ghost', 'frozen'].forEach((t) => DEFS.push(ST('badge_' + t, 24, 24, 1, () => drawBadge('badge_' + t))));
['budget', 'posters', 'stage', 'food'].forEach((t) => DEFS.push(ST('task_' + t, 24, 24, 1, () => drawTask('task_' + t))));

// ---- Fest Boss 2 sprite registry additions
DEFS.push(ST('boss', 24, 24, 7, drawBoss, CREATURE_ANIMS));
DEFS.push(ST('blorb', 32, 32, 7, drawBlorb, CREATURE_ANIMS));
DEFS.push(ST('bunty', 24, 24, 7, drawBunty, CREATURE_ANIMS));
const OB_ANIM = { idle: { from: 0, to: 1, loop: true, speed: 6 } };
DEFS.push(ST('ob_crate', 16, 16, 1, drawCrate));
DEFS.push(ST('ob_speaker', 16, 26, 1, drawSpeakerOb));
DEFS.push(ST('ob_cone', 12, 12, 1, drawConeOb));
DEFS.push(ST('ob_debris', 18, 10, 1, drawDebrisOb));
DEFS.push(ST('ob_light', 16, 12, 2, drawLightOb, OB_ANIM));
DEFS.push(ST('ob_log', 22, 12, 1, drawLogOb));
DEFS.push(ST('ob_rock', 14, 12, 1, drawRockOb));
DEFS.push(ST('ob_tray', 16, 10, 1, drawTrayOb));
DEFS.push(ST('ob_cash', 14, 10, 2, drawCashOb, { idle: { from: 0, to: 1, loop: true, speed: 6 } }));
DEFS.push(ST('gr_grass', 16, 30, 1, drawGrGrass));
DEFS.push(ST('gr_wood', 16, 30, 1, drawGrWood));
DEFS.push(ST('gr_tile', 16, 30, 1, drawGrTile));
DEFS.push(ST('gr_path', 16, 30, 1, drawGrPath));
DEFS.push(ST('gr_stage', 16, 30, 1, drawGrStage));
DEFS.push(ST('scaffold', 48, 140, 3, drawScaffold));
DEFS.push(ST('door', 40, 60, 2, drawDoor));
['direct', 'coach', 'support', 'delegate'].forEach((t) => DEFS.push(ST('sign_' + t, 24, 24, 1, () => drawSign('sign_' + t))));
['icon_skill', 'icon_will', 'icon_walkie', 'buff_sync', 'debuff_resentful', 'debuff_lost'].forEach((n) => DEFS.push(ST(n, 12, 12, 1, () => drawSmallIcon(n))));
DEFS.push(ST('firework', 16, 16, 4, drawFirework, { burst: { from: 0, to: 3, speed: 10 } }));
DEFS.push(ST('confetti', 4, 4, 4, drawConfetti));
DEFS.push(ST('fest_far', 400, 100, 1, drawFestFar));
DEFS.push(ST('fest_near', 400, 36, 1, drawFestNear));
DEFS.push(ST('quad_far', 400, 90, 1, drawQuadFar));
DEFS.push(ST('quad_near', 400, 36, 1, drawQuadNear));
DEFS.push(ST('woods_far', 400, 110, 1, drawWoodsFar));
DEFS.push(ST('woods_near', 400, 40, 1, drawWoodsNear));
DEFS.push(ST('backstage_far', 400, 110, 1, drawBackstageFar));
DEFS.push(ST('backstage_near', 400, 36, 1, drawBackstageNear));
DEFS.push(ST('canteen_far', 400, 100, 1, drawCanteenFar));
DEFS.push(ST('canteen_near', 400, 36, 1, drawCanteenNear));
DEFS.push(ST('night_far', 400, 110, 1, drawNightFar));
DEFS.push(ST('night_near', 400, 40, 1, drawNightNear));
DEFS.push(ST('hall', 400, 180, 1, drawHall));

export const SPRITE_NAMES = DEFS.map((d) => d.name);
export const SPRITE_DEFS = DEFS.map(({ name, w, h, frames, anims }) => ({ name, w, h, frames, anims }));

const cache = {}; // name -> { canvas, def, url }
function sheet(name) {
  let c = cache[name];
  if (c) return c;
  const def = DEFS.find((d) => d.name === name);
  if (!def) throw new Error('unknown sprite ' + name);
  const sb = new Buf(def.w * def.frames, def.h);
  for (let f = 0; f < def.frames; f++) sb.blit(def.draw(f), f * def.w, 0);
  c = { canvas: sb.canvas(), def, url: null };
  cache[name] = c;
  return c;
}
const frameCache = {};

export function registerArt(k) {
  for (const def of DEFS) {
    const c = sheet(def.name);
    if (!c.url) c.url = c.canvas.toDataURL('image/png');
    const opts = {};
    if (def.frames > 1) opts.sliceX = def.frames;
    if (def.anims) opts.anims = def.anims;
    k.loadSprite(def.name, c.url, opts);
  }
}

export function spriteURL(name, frame = 0) {
  const key = name + ':' + frame;
  if (frameCache[key]) return frameCache[key];
  const c = sheet(name);
  const { w, h, frames } = c.def;
  const f = Math.max(0, Math.min(frames - 1, frame | 0));
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  cv.getContext('2d').drawImage(c.canvas, f * w, 0, w, h, 0, 0, w, h);
  return (frameCache[key] = cv.toDataURL('image/png'));
}
