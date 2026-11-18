// Exports a motion spec (schema/motion.schema.json) + SVG to:
//   - Lottie JSON (toLottie)
//   - dotLottie zip (toDotLottie)
//   - a static SVG frame at time t (frameSvg), used to rasterise GIF frames
// Same targets as motion.mjs: 'root', a path index (icons) or a data-part name (illustrations).
// Pure JS, no dependencies: runs in Node and in the browser.

/* ------------------------------------------------------------------ easing */

const EASES = {
  linear: [0, 0, 1, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
};
const easeOf = (e) => (Array.isArray(e) ? e : EASES[e] ?? EASES.linear);

function cubicBezier([x1, y1, x2, y2]) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t) => ((ax * t + bx) * t + cx) * t;
  const Y = (t) => ((ay * t + by) * t + cy) * t;
  const dX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = X(t) - x;
      if (Math.abs(err) < 1e-6) break;
      const d = dX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    if (t < 0 || t > 1) {
      let lo = 0, hi = 1;
      t = x;
      for (let i = 0; i < 30; i++) { const v = X(t); if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; }
    }
    return Y(t);
  };
}

/** Normalise tracks: merge translateX/translateY into one 2-D 'translate' track per target. */
function normalise(tracks) {
  const out = [];
  const tx = new Map();
  for (const t of tracks) {
    if (t.property !== 'translateX' && t.property !== 'translateY') { out.push(t); continue; }
    const key = String(t.target);
    const cur = tx.get(key) ?? { target: t.target, property: 'translate', times: t.times, ease: t.ease, origin: t.origin };
    cur[t.property === 'translateX' ? 'x' : 'y'] = t.values;
    tx.set(key, cur);
  }
  for (const t of tx.values()) {
    const z = t.times.map(() => 0);
    out.push({ ...t, values: t.times.map((_, i) => [(t.x ?? z)[i], (t.y ?? z)[i]]) });
  }
  return out;
}

/** Value of a track at progress p (0–1 of the loop). */
function sample(track, p) {
  const { times, values } = track;
  if (p <= times[0]) return values[0];
  for (let j = 0; j < times.length - 1; j++) {
    if (p <= times[j + 1]) {
      const span = times[j + 1] - times[j];
      const k = span <= 0 ? 1 : cubicBezier(easeOf(track.ease?.[j] ?? 'linear'))((p - times[j]) / span);
      const a = values[j], b = values[j + 1];
      return Array.isArray(a) ? a.map((v, i) => v + (b[i] - v) * k) : a + (b - a) * k;
    }
  }
  return values[values.length - 1];
}

/* ------------------------------------------------------------------ SVG parsing */

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`));
  return m ? m[1] : undefined;
};

/** Flat list of drawable elements with their target keys, plus the root attributes. */
function parseSvg(svg) {
  const root = svg.match(/<svg\b[^>]*>/)[0];
  const vb = (attr(root, 'viewBox') ?? '0 0 24 24').split(/[\s,]+/).map(Number);
  const els = [];
  const stack = [];
  let pathIndex = -1;
  for (const m of svg.matchAll(/<(\/?)(\w+)([^>]*?)(\/?)>/g)) {
    const [tag, close, name, , self] = m;
    if (name === 'svg' || name === 'style' || name === 'defs') continue;
    if (name === 'g') {
      if (close) stack.pop();
      else if (!self) stack.push({ part: attr(tag, 'data-part'), tag });
      continue;
    }
    if (close || (name !== 'path' && name !== 'rect' && name !== 'circle' && name !== 'ellipse' && name !== 'line')) continue;
    if (name === 'path') pathIndex++;
    const part = [...stack].reverse().find((g) => g.part)?.part;
    els.push({ name, tag, pathIndex: name === 'path' ? pathIndex : -1, part, groups: stack.map((g) => g.tag) });
  }
  return { root, vb, els };
}

function rectPath(tag) {
  const x = +(attr(tag, 'x') ?? 0), y = +(attr(tag, 'y') ?? 0);
  const w = +attr(tag, 'width'), h = +attr(tag, 'height');
  const r = Math.min(+(attr(tag, 'rx') ?? attr(tag, 'ry') ?? 0), w / 2, h / 2);
  if (!r) return `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
  return `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
}
function elementD(el) {
  const t = el.tag;
  if (el.name === 'path') return attr(t, 'd') ?? '';
  if (el.name === 'rect') return rectPath(t);
  if (el.name === 'line') return `M${attr(t, 'x1')} ${attr(t, 'y1')}L${attr(t, 'x2')} ${attr(t, 'y2')}`;
  const cx = +attr(t, 'cx'), cy = +attr(t, 'cy');
  const rx = +(attr(t, 'rx') ?? attr(t, 'r')), ry = +(attr(t, 'ry') ?? attr(t, 'r'));
  return `M${cx - rx} ${cy}A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}Z`;
}

/* ------------------------------------------------------------------ path → cubic beziers */

function arcToCubics(x1, y1, rx, ry, phi, fa, fs, x2, y2) {
  if (rx === 0 || ry === 0) return [[x1, y1, x2, y2, x2, y2]];
  const s = Math.sin((phi * Math.PI) / 180), c = Math.cos((phi * Math.PI) / 180);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const x1p = c * dx + s * dy, y1p = -s * dx + c * dy;
  rx = Math.abs(rx); ry = Math.abs(ry);
  const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam); }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  let co = Math.sqrt(Math.max(0, num / den));
  if (fa === fs) co = -co;
  const cxp = (co * rx * y1p) / ry, cyp = (-co * ry * x1p) / rx;
  const cx = c * cxp - s * cyp + (x1 + x2) / 2, cy = s * cxp + c * cyp + (y1 + y2) / 2;
  const ang = (ux, uy, vx, vy) => {
    const a = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
    return a;
  };
  let t1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dt = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!fs && dt > 0) dt -= 2 * Math.PI;
  if (fs && dt < 0) dt += 2 * Math.PI;
  const n = Math.max(1, Math.ceil(Math.abs(dt) / (Math.PI / 2)));
  const d = dt / n, k = (4 / 3) * Math.tan(d / 4);
  const pt = (t) => [cx + rx * Math.cos(t) * c - ry * Math.sin(t) * s, cy + rx * Math.cos(t) * s + ry * Math.sin(t) * c];
  const dv = (t) => [-rx * Math.sin(t) * c - ry * Math.cos(t) * s, -rx * Math.sin(t) * s + ry * Math.cos(t) * c];
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = t1 + i * d, b = a + d;
    const [ax, ay] = pt(a), [bx, by] = pt(b), [dax, day] = dv(a), [dbx, dby] = dv(b);
    out.push([ax + k * dax, ay + k * day, bx - k * dbx, by - k * dby, bx, by]);
  }
  return out;
}

/** d → subpaths of { closed, v, i, o } (Lottie shape data; i/o relative to the vertex). */
export function pathToShapes(d) {
  const toks = d.match(/[a-zA-Z]|-?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/gi) ?? [];
  const subs = [];
  let cur = null, x = 0, y = 0, sx = 0, sy = 0, lastC = null, lastQ = null, cmd = '';
  let k = 0;
  const num = () => +toks[k++];
  const start = (nx, ny) => {
    cur = { closed: false, v: [[nx, ny]], i: [[0, 0]], o: [[0, 0]] };
    subs.push(cur);
    x = sx = nx; y = sy = ny;
  };
  const cubic = (c1x, c1y, c2x, c2y, ex, ey) => {
    if (!cur) start(x, y);
    const n = cur.v.length - 1;
    cur.o[n] = [c1x - x, c1y - y];
    cur.v.push([ex, ey]); cur.i.push([c2x - ex, c2y - ey]); cur.o.push([0, 0]);
    x = ex; y = ey;
  };
  const line = (ex, ey) => cubic(x, y, ex, ey, ex, ey);
  while (k < toks.length) {
    if (/[a-zA-Z]/.test(toks[k])) cmd = toks[k++];
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    const ox = rel ? x : 0, oy = rel ? y : 0;
    if (C === 'Z') {
      if (cur) {
        const n = cur.v.length - 1;
        if (n > 0 && Math.hypot(cur.v[n][0] - cur.v[0][0], cur.v[n][1] - cur.v[0][1]) < 1e-3) {
          cur.i[0] = cur.i[n]; cur.v.pop(); cur.i.pop(); const o = cur.o.pop(); cur.o[n - 1] = cur.o[n - 1] ?? o;
        }
        cur.closed = true;
      }
      x = sx; y = sy; cur = null; lastC = lastQ = null;
      continue;
    }
    if (C === 'M') { start(ox + num(), oy + num()); cmd = rel ? 'l' : 'L'; lastC = lastQ = null; continue; }
    if (!cur) start(x, y);
    if (C === 'L') { line(ox + num(), oy + num()); lastC = lastQ = null; }
    else if (C === 'H') { line(rel ? x + num() : num(), y); lastC = lastQ = null; }
    else if (C === 'V') { line(x, rel ? y + num() : num()); lastC = lastQ = null; }
    else if (C === 'C') {
      const a = [ox + num(), oy + num(), ox + num(), oy + num(), ox + num(), oy + num()];
      cubic(...a); lastC = [a[2], a[3]]; lastQ = null;
    } else if (C === 'S') {
      const r1 = lastC ? [2 * x - lastC[0], 2 * y - lastC[1]] : [x, y];
      const a = [ox + num(), oy + num(), ox + num(), oy + num()];
      cubic(r1[0], r1[1], ...a); lastC = [a[0], a[1]]; lastQ = null;
    } else if (C === 'Q' || C === 'T') {
      const q = C === 'Q' ? [ox + num(), oy + num()] : lastQ ? [2 * x - lastQ[0], 2 * y - lastQ[1]] : [x, y];
      const ex = ox + num(), ey = oy + num();
      cubic(x + (2 / 3) * (q[0] - x), y + (2 / 3) * (q[1] - y), ex + (2 / 3) * (q[0] - ex), ey + (2 / 3) * (q[1] - ey), ex, ey);
      lastQ = q; lastC = null;
    } else if (C === 'A') {
      const rx = num(), ry = num(), rot = num(), fa = num(), fs = num();
      const ex = ox + num(), ey = oy + num();
      for (const seg of arcToCubics(x, y, rx, ry, rot, fa, fs, ex, ey)) cubic(...seg);
      lastC = lastQ = null;
    } else k++;
  }
  return subs;
}

function bbox(shapes) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const s of shapes) {
    const n = s.v.length;
    for (let j = 0; j < (s.closed ? n : n - 1); j++) {
      const a = s.v[j], b = s.v[(j + 1) % n];
      const p1 = [a[0] + s.o[j][0], a[1] + s.o[j][1]], p2 = [b[0] + s.i[(j + 1) % n][0], b[1] + s.i[(j + 1) % n][1]];
      for (let t = 0; t <= 1; t += 0.125) {
        const u = 1 - t;
        const px = u * u * u * a[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * b[0];
        const py = u * u * u * a[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * b[1];
        x0 = Math.min(x0, px); y0 = Math.min(y0, py); x1 = Math.max(x1, px); y1 = Math.max(y1, py);
      }
    }
    if (n === 1) { x0 = Math.min(x0, s.v[0][0]); y0 = Math.min(y0, s.v[0][1]); x1 = Math.max(x1, s.v[0][0]); y1 = Math.max(y1, s.v[0][1]); }
  }
  return x0 === Infinity ? [0, 0, 0, 0] : [x0, y0, x1 - x0, y1 - y0];
}

/* ------------------------------------------------------------------ model */

const keyOf = (target) => (target === 'root' ? 'root' : typeof target === 'number' ? `p${target}` : `g:${target}`);

/** Shared model: elements, layers (runs of elements per target), tracks by target, origins. */
function model(svg, spec) {
  const { root, vb, els } = parseSvg(svg);
  const tracks = normalise(spec.tracks);
  const byTarget = new Map();
  for (const t of tracks) {
    const k = keyOf(t.target);
    if (!byTarget.has(k)) byTarget.set(k, []);
    byTarget.get(k).push(t);
  }
  for (const el of els) {
    el.shapes = pathToShapes(elementD(el));
    el.key = byTarget.has(`p${el.pathIndex}`) ? `p${el.pathIndex}` : el.part && byTarget.has(`g:${el.part}`) ? `g:${el.part}` : 'static';
  }
  const origins = new Map();
  for (const [k, ts] of byTarget) {
    const o = ts.find((t) => t.origin)?.origin ?? [50, 50];
    const box = k === 'root' ? [vb[0], vb[1], vb[2], vb[3]] : bbox(els.filter((e) => e.key === k).flatMap((e) => e.shapes));
    origins.set(k, [box[0] + (box[2] * o[0]) / 100, box[1] + (box[3] * o[1]) / 100]);
  }
  return { root, vb, els, byTarget, origins };
}

/* ------------------------------------------------------------------ Lottie */

const hexRgb = (h) => {
  const s = h.replace('#', '');
  const f = s.length === 3 ? s.split('').map((c) => c + c).join('') : s.slice(0, 6);
  return [0, 2, 4].map((i) => +(parseInt(f.slice(i, i + 2), 16) / 255).toFixed(4)).concat(1);
};
const st = (k) => ({ a: 0, k });
const r3 = (n) => Math.round(n * 1000) / 1000;

function animated(track, frames, map, dims) {
  const ks = track.times.map((t, j) => {
    const kf = { t: r3(t * frames), s: [].concat(map(track.values[j])) };
    if (j < track.times.length - 1) {
      const [x1, y1, x2, y2] = easeOf(track.ease?.[j] ?? 'linear');
      kf.o = { x: Array(dims).fill(x1), y: Array(dims).fill(y1) };
      kf.i = { x: Array(dims).fill(x2), y: Array(dims).fill(y2) };
    }
    return kf;
  });
  return { a: 1, k: ks };
}

function transformFor(tracks, origin, frames) {
  const find = (p) => tracks?.find((t) => t.property === p);
  const sc = find('scale'), ro = find('rotate'), tr = find('translate'), op = find('opacity');
  return {
    a: st([origin[0], origin[1], 0]),
    p: tr ? animated(tr, frames, (v) => [origin[0] + v[0], origin[1] + v[1], 0], 3) : st([origin[0], origin[1], 0]),
    s: sc ? animated(sc, frames, (v) => [v * 100, v * 100, 100], 3) : st([100, 100, 100]),
    r: ro ? animated(ro, frames, (v) => v, 1) : st(0),
    o: op ? animated(op, frames, (v) => v * 100, 1) : st(100),
  };
}

function paintOf(el, rootTag, colour) {
  const get = (n) => attr(el.tag, n) ?? el.groups.map((g) => attr(g, n)).filter(Boolean).pop() ?? attr(rootTag, n);
  const col = (v) => hexRgb(!v || v === 'currentColor' ? colour : v);
  const items = [];
  const fill = get('fill');
  const opacity = +(get('opacity') ?? 1);
  if (fill && fill !== 'none') {
    items.push({ ty: 'fl', c: st(col(fill)), o: st(100 * opacity * +(get('fill-opacity') ?? 1)), r: get('fill-rule') === 'evenodd' ? 2 : 1 });
  }
  const stroke = get('stroke');
  if (stroke && stroke !== 'none') {
    items.push({
      ty: 'st', c: st(col(stroke)), o: st(100 * opacity * +(get('stroke-opacity') ?? 1)), w: st(+(get('stroke-width') ?? 1)),
      lc: get('stroke-linecap') === 'round' ? 2 : get('stroke-linecap') === 'square' ? 3 : 1,
      lj: get('stroke-linejoin') === 'round' ? 2 : get('stroke-linejoin') === 'bevel' ? 3 : 1, ml: 4,
    });
  }
  return items;
}

const groupTr = () => ({ ty: 'tr', p: st([0, 0]), a: st([0, 0]), s: st([100, 100]), r: st(0), o: st(100), sk: st(0), sa: st(0) });

/**
 * Lottie JSON for an SVG + motion spec.
 * opts: { colour: '#171729' (replaces currentColor), size: px, background: '#hex' | null, speed: 1, loop: true, fps: 60, name }
 */
export function toLottie(svg, spec, opts = {}) {
  const { colour = '#171729', size, background = null, speed = 1, fps = 60, name = 'animation' } = opts;
  const { root, vb, els, byTarget, origins } = model(svg, spec);
  const frames = Math.max(1, Math.round(((spec.duration / 1000) * fps) / speed));
  const W = size ?? vb[2], H = size ? (size * vb[3]) / vb[2] : vb[3];
  const layers = [];
  let ind = 1;
  const base = { ao: 0, ip: 0, op: frames, st: 0, bm: 0, sr: 1 };
  // Size: scale the viewBox to the requested px size.
  const sizeInd = ind++;
  layers.push({ ...base, ty: 3, ind: sizeInd, nm: 'size', ks: { a: st([vb[0], vb[1], 0]), p: st([0, 0, 0]), s: st([(W / vb[2]) * 100, (H / vb[3]) * 100, 100]), r: st(0), o: st(100) } });
  let parent = sizeInd;
  if (byTarget.has('root')) {
    const rootInd = ind++;
    layers.push({ ...base, ty: 3, ind: rootInd, parent: sizeInd, nm: 'root', ks: transformFor(byTarget.get('root'), origins.get('root'), frames) });
    parent = rootInd;
  }
  // Runs of consecutive elements with the same key become one layer (keeps z-order).
  const runs = [];
  for (const el of els) {
    const last = runs[runs.length - 1];
    if (last && last.key === el.key) last.els.push(el);
    else runs.push({ key: el.key, els: [el] });
  }
  const shapeLayers = runs.map((run) => {
    const tracks = byTarget.get(run.key);
    const origin = origins.get(run.key) ?? [0, 0];
    const shapes = run.els.map((el) => ({
      ty: 'gr', nm: el.name,
      it: [
        ...el.shapes.map((s) => ({ ty: 'sh', ks: st({ c: s.closed, v: s.v.map((p) => p.map(r3)), i: s.i.map((p) => p.map(r3)), o: s.o.map((p) => p.map(r3)) }) })),
        ...paintOf(el, root, colour).reverse(), // stroke above fill, as in SVG
        groupTr(),
      ],
    })).reverse(); // Lottie draws the first shape on top
    const draw = tracks?.find((t) => t.property === 'draw');
    if (draw) shapes.push({ ty: 'tm', s: st(0), e: animated(draw, frames, (v) => v * 100, 1), o: st(0), m: 1 });
    return { ...base, ty: 4, ind: ind++, parent, nm: run.key, ks: transformFor(tracks, origin, frames), shapes };
  });
  layers.push(...shapeLayers.reverse()); // Lottie draws the first layer on top
  if (background) {
    layers.push({
      ...base, ty: 4, ind: ind++, parent: sizeInd, nm: 'background', ks: transformFor(null, [0, 0], frames),
      shapes: [{ ty: 'gr', it: [{ ty: 'rc', p: st([vb[0] + vb[2] / 2, vb[1] + vb[3] / 2]), s: st([vb[2], vb[3]]), r: st(0) }, { ty: 'fl', c: st(hexRgb(background)), o: st(100), r: 1 }, groupTr()] }],
    });
  }
  return { v: '5.7.4', fr: fps, ip: 0, op: frames, w: Math.round(W), h: Math.round(H), nm: name, ddd: 0, assets: [], layers, meta: { g: 'ollo library' } };
}

/* ------------------------------------------------------------------ dotLottie (zip, stored) */

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
const crc32 = (b) => { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };

function zip(files) {
  const enc = new TextEncoder();
  const parts = [], central = [];
  let offset = 0;
  for (const [name, text] of files) {
    const data = enc.encode(text), fn = enc.encode(name), crc = crc32(data);
    const h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint32(14, crc, true);
    h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, fn.length, true);
    parts.push(new Uint8Array(h.buffer), fn, data);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint32(16, crc, true);
    c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, fn.length, true); c.setUint32(42, offset, true);
    central.push(new Uint8Array(c.buffer), fn);
    offset += 30 + fn.length + data.length;
  }
  const cSize = central.reduce((s, p) => s + p.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
  end.setUint32(12, cSize, true); end.setUint32(16, offset, true);
  const all = [...parts, ...central, new Uint8Array(end.buffer)];
  const out = new Uint8Array(all.reduce((s, p) => s + p.length, 0));
  let o = 0;
  for (const p of all) { out.set(p, o); o += p.length; }
  return out;
}

/** dotLottie (.lottie) archive bytes for one animation. */
export function toDotLottie(lottie, { id = 'animation', loop = true, speed = 1 } = {}) {
  const manifest = { version: '1', generator: 'ollo library', animations: [{ id, loop, speed, autoplay: true }] };
  return zip([['manifest.json', JSON.stringify(manifest)], [`animations/${id}.json`, JSON.stringify(lottie)]]);
}

/* ------------------------------------------------------------------ static frame (for GIF) */

/** The SVG as it looks at time `ms` of the loop, with no CSS animation. */
export function frameSvg(svg, spec, ms) {
  const { byTarget, origins } = model(svg, spec);
  const p = ((ms % spec.duration) + spec.duration) % spec.duration / spec.duration;
  const state = (key) => {
    const tracks = byTarget.get(key);
    if (!tracks) return null;
    const o = origins.get(key);
    let tf = '', opacity = 1, draw = null;
    const tr = tracks.find((t) => t.property === 'translate');
    const sc = tracks.find((t) => t.property === 'scale');
    const ro = tracks.find((t) => t.property === 'rotate');
    const op = tracks.find((t) => t.property === 'opacity');
    const dr = tracks.find((t) => t.property === 'draw');
    if (tr) { const [x, y] = sample(tr, p); tf += `translate(${r3(x)} ${r3(y)}) `; }
    if (sc || ro) {
      tf += `translate(${r3(o[0])} ${r3(o[1])}) `;
      if (ro) tf += `rotate(${r3(sample(ro, p))}) `;
      if (sc) { const s = sample(sc, p); tf += `scale(${r3(Math.max(s, 0.0001))}) `; }
      tf += `translate(${r3(-o[0])} ${r3(-o[1])})`;
    }
    if (op) opacity = Math.max(0, Math.min(1, sample(op, p)));
    if (dr) draw = Math.max(0, Math.min(1, sample(dr, p)));
    return { tf: tf.trim(), opacity, draw };
  };
  const wrapAttrs = (s) => `${s.tf ? ` transform="${s.tf}"` : ''}${s.opacity < 1 ? ` opacity="${r3(s.opacity)}"` : ''}`;
  const dash = (tag, d) => d == null ? tag : tag.replace(/<path\b/, `<path pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${r3(1 - d)}"${d === 0 ? ' stroke-opacity="0"' : ''}`);

  let i = -1;
  let out = svg.replace(/<style>[\s\S]*?<\/style>/g, '');
  out = out.replace(/<path\b[^>]*\/>|<path\b[^>]*>[\s\S]*?<\/path>/g, (tag) => {
    i++;
    const s = state(`p${i}`);
    if (!s) return tag;
    return `<g${wrapAttrs(s)}>${dash(tag, s.draw)}</g>`;
  });
  out = out.replace(/<g data-part="([^"]+)"([^>]*)>([\s\S]*?)<\/g>/g, (m, part, rest, inner) => {
    const s = state(`g:${part}`);
    if (!s) return m;
    const body = s.draw == null ? inner : inner.replace(/<path\b[^>]*\/>/g, (t) => (/stroke="(?!none)/.test(t) ? dash(t, s.draw) : t));
    return `<g data-part="${part}"${rest}${wrapAttrs(s)}>${body}</g>`;
  });
  const r = state('root');
  if (r) out = out.replace(/(<svg[^>]*>)([\s\S]*)(<\/svg>)/, `$1<g${wrapAttrs(r)}>$2</g>$3`);
  return out;
}
