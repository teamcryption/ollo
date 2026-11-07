// Drawing helpers on the 24-unit icon grid. Every helper returns SVG path data,
// so an icon definition is plain, readable geometry - no Figma, no tracing.
//
// Angles are in degrees, 0 = east, 90 = south (screen coordinates), and arcs run
// clockwise from a0 to a1.
import paper from 'paper';

globalThis.paper = paper;
const { PaperOffset } = await import('paperjs-offset');
paper.setup(new paper.Size(24, 24));
export { paper, PaperOffset };

export const n = (v) => {
  const r = Math.round(v * 1000) / 1000;
  return Object.is(r, -0) ? '0' : String(r);
};
const pt = ([x, y]) => `${n(x)} ${n(y)}`;
const rad = (a) => (a * Math.PI) / 180;
const polar = (cx, cy, r, a) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];

/** Straight line. */
export const L = (x1, y1, x2, y2) => `M${pt([x1, y1])}L${pt([x2, y2])}`;

/** Rounded rectangle (r is clamped to half the short side). */
export function R(x, y, w, h, r = 0) {
  r = Math.min(r, w / 2, h / 2);
  if (!r) return `M${pt([x, y])}H${n(x + w)}V${n(y + h)}H${n(x)}Z`;
  const a = (dx, dy) => `A${n(r)} ${n(r)} 0 0 1 ${pt([dx, dy])}`;
  return (
    `M${pt([x + r, y])}H${n(x + w - r)}${a(x + w, y + r)}V${n(y + h - r)}${a(x + w - r, y + h)}` +
    `H${n(x + r)}${a(x, y + h - r)}V${n(y + r)}${a(x + r, y)}Z`
  );
}

/** Circle. */
export const C = (cx, cy, r) =>
  `M${pt([cx - r, cy])}A${n(r)} ${n(r)} 0 1 0 ${pt([cx + r, cy])}A${n(r)} ${n(r)} 0 1 0 ${pt([cx - r, cy])}Z`;

/** Ellipse. */
export const E = (cx, cy, rx, ry) =>
  `M${pt([cx - rx, cy])}A${n(rx)} ${n(ry)} 0 1 0 ${pt([cx + rx, cy])}A${n(rx)} ${n(ry)} 0 1 0 ${pt([cx - rx, cy])}Z`;

/** Circular arc, clockwise from a0 to a1 (degrees). */
export function A(cx, cy, r, a0, a1) {
  const sweep = a1 - a0;
  const p0 = polar(cx, cy, r, a0);
  const p1 = polar(cx, cy, r, a1);
  if (Math.abs(sweep) >= 359.9) return C(cx, cy, r);
  return `M${pt(p0)}A${n(r)} ${n(r)} 0 ${Math.abs(sweep) > 180 ? 1 : 0} ${sweep > 0 ? 1 : 0} ${pt(p1)}`;
}

/**
 * Polyline / polygon with soft corners: each corner is replaced by a quadratic
 * curve that starts and ends `r` units away from the vertex (clamped to half of
 * the adjacent edges), which keeps every join continuous.
 */
export function poly(points, r = 1, closed = false) {
  const P = points;
  const len = P.length;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const toward = (from, to, d) => {
    const L0 = dist(from, to) || 1;
    return [from[0] + ((to[0] - from[0]) * d) / L0, from[1] + ((to[1] - from[1]) * d) / L0];
  };
  const corner = (i) => {
    const prev = P[(i - 1 + len) % len];
    const cur = P[i];
    const next = P[(i + 1) % len];
    const rr = Math.min(r, dist(prev, cur) / 2, dist(cur, next) / 2);
    return { a: toward(cur, prev, rr), c: cur, b: toward(cur, next, rr), flat: rr < 0.01 || sub(prev, cur).every((v, k) => v === sub(cur, next)[k]) };
  };
  let d = '';
  if (closed) {
    const c0 = corner(0);
    d = `M${pt(c0.b)}`;
    for (let i = 1; i < len; i++) {
      const c = corner(i);
      d += `L${pt(c.a)}Q${pt(c.c)} ${pt(c.b)}`;
    }
    d += `L${pt(c0.a)}Q${pt(c0.c)} ${pt(c0.b)}Z`;
  } else {
    d = `M${pt(P[0])}`;
    for (let i = 1; i < len - 1; i++) {
      const c = corner(i);
      d += `L${pt(c.a)}Q${pt(c.c)} ${pt(c.b)}`;
    }
    d += `L${pt(P[len - 1])}`;
  }
  return d;
}

/** Chevron-shaped arrow head with its tip at (x, y), pointing along `angle`. */
export function head(x, y, angle, size = 4, r = 0.8) {
  const a = polar(x, y, size, angle + 180 - 45);
  const b = polar(x, y, size, angle + 180 + 45);
  return poly([a, [x, y], b], r);
}

/** Regular star with rounded points. */
export function star(cx, cy, ro, ri, points = 5, r = 1, rot = -90) {
  const pts = [];
  for (let i = 0; i < points * 2; i++) pts.push(polar(cx, cy, i % 2 ? ri : ro, rot + (i * 180) / points));
  return poly(pts, r, true);
}

/** Gear outline: `teeth` flat-topped teeth between radii ri and ro. */
export function gear(cx, cy, ro, ri, teeth = 8, r = 0.7) {
  const pts = [];
  const step = 360 / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = -90 + i * step;
    pts.push(polar(cx, cy, ri, a - step * 0.5));
    pts.push(polar(cx, cy, ri, a - step * 0.24));
    pts.push(polar(cx, cy, ro, a - step * 0.15));
    pts.push(polar(cx, cy, ro, a + step * 0.15));
    pts.push(polar(cx, cy, ri, a + step * 0.24));
  }
  return poly(pts, r, true);
}

// ---------- transforms (applied through paper.js so arcs are handled) ----------

export function itemOf(d) {
  return new paper.CompoundPath({ pathData: d, insert: false });
}

function transformD(d, fn) {
  const item = itemOf(d);
  fn(item);
  return item.pathData;
}

export const rotateD = (d, deg, cx = 12, cy = 12) => transformD(d, (i) => i.rotate(deg, new paper.Point(cx, cy)));
export const mirrorD = (d, axis = 'x', cx = 12, cy = 12) =>
  transformD(d, (i) => i.scale(axis === 'x' ? -1 : 1, axis === 'y' ? -1 : 1, new paper.Point(cx, cy)));
export const translateD = (d, dx, dy) => transformD(d, (i) => i.translate(new paper.Point(dx, dy)));
export const scaleD = (d, s, cx = 12, cy = 12) => transformD(d, (i) => i.scale(s, new paper.Point(cx, cy)));

/** Clockwise arc (a0 -> a1) with an arrow head at its end. Returns [arcD, headD]. */
export function arcArrow(cx, cy, r, a0, a1, size = 3.2) {
  const [x, y] = polar(cx, cy, r, a1);
  const dir = a1 + (a1 > a0 ? 90 : -90);
  return [A(cx, cy, r, a0, a1), head(x, y, dir, size)];
}

/** A dot: a zero-length line, so round caps draw it at exactly the stroke width in every style. */
export const D = (x, y) => `M${n(x)} ${n(y)}h0.01`;
