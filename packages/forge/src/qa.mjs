// Automated review for generated icons. Runs on every generate, so scaling up never
// skips the checks a designer would make by eye.
//
//   grid         nothing (incl. the Bold stroke) leaves the 24 canvas; centre-lines stay in the live area
//   accent       the floating accent never touches anything (at Bold weight, with a visible gap)
//   fill         the Fill style is a real shape (not empty, not swallowed by knockouts)
//   duplicate    perceptual hash of the Regular style vs every other icon in the set
//   meta         name format, unique names, 3+ tags, known category
import { Resvg } from '@resvg/resvg-js';
import { itemOf } from './geo.mjs';
import { band, SPEC, strokeGeometry } from './render.mjs';

const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const LIVE = [2.5, 21.5]; // centre-line live area (warning)
const CANVAS = [0.75, 23.25]; // hard limit incl. Bold half-stroke
const ACCENT_CLEARANCE = SPEC.stroke.bold + 0.35; // centre-line distance -> 0.35 visible gap at Bold

function bounds(els) {
  let b = null;
  for (const el of els) {
    if (el.role === 'tint') continue;
    const r = itemOf(el.d).bounds;
    b = b ? b.unite(r) : r;
  }
  return b;
}

export function checkGeometry(icon, { requireAccent = true } = {}) {
  const errors = [];
  const warnings = [];
  const b = bounds(icon.els);
  const half = SPEC.stroke.bold / 2;
  if (b.left - half < CANVAS[0] || b.top - half < CANVAS[0] || b.right + half > CANVAS[1] || b.bottom + half > CANVAS[1]) {
    errors.push(`grid: drawing leaves the canvas (${[b.left, b.top, b.right, b.bottom].map((v) => v.toFixed(2)).join(', ')})`);
  } else if (b.left < LIVE[0] || b.top < LIVE[0] || b.right > LIVE[1] || b.bottom > LIVE[1]) {
    warnings.push(`grid: outside the 3-21 live area (${[b.left, b.top, b.right, b.bottom].map((v) => v.toFixed(2)).join(', ')})`);
  }
  const accents = icon.els.map((e, i) => [e, i]).filter(([e]) => e.role === 'accent' && !e.badge);
  if (!accents.length && requireAccent && !icon.noAccent) warnings.push('accent: no floating accent');
  const geo = strokeGeometry(icon.els); // after cover cuts - what is actually drawn
  for (const [a, i] of accents) {
    if (!geo[i]) continue;
    const zone = band(itemOf(geo[i]), ACCENT_CLEARANCE);
    icon.els.forEach((o, j) => {
      if (j === i || o.role === 'tint' || o.badge || !geo[j]) return;
      const other = itemOf(geo[j]);
      const touches = zone.getIntersections(other).length > 0 || (other.firstSegment ?? other.children?.[0]?.firstSegment) && zone.contains((other.firstSegment ?? other.children[0].firstSegment).point);
      if (touches) errors.push(`accent: element ${i} is within ${ACCENT_CLEARANCE} of element ${j}`);
    });
  }
  return { errors, warnings };
}

export function checkFill(svg) {
  const d = svg.match(/ d="([^"]*)"/)?.[1] ?? '';
  if (!d) return ['fill: empty'];
  const area = Math.abs(itemOf(d).area);
  return area < 6 ? [`fill: only ${area.toFixed(1)} units² of ink`] : [];
}

/** Share of dark pixels at 32px - Fill should never carry less ink than Bold (catches failed boolean ops). */
export function ink(svg) {
  const img = new Resvg(svg.replace(/#171729/g, '#000'), { fitTo: { mode: 'width', value: 32 }, background: '#fff' }).render();
  let sum = 0;
  for (let i = 0; i < img.pixels.length; i += 4) sum += 255 - img.pixels[i];
  return sum / (255 * 32 * 32);
}

export function checkInk(svgs) {
  const f = ink(svgs.fill);
  const b = ink(svgs.bold);
  return f < b * 0.75 ? [`fill: carries less ink than bold (${(f * 100).toFixed(1)}% vs ${(b * 100).toFixed(1)}%) - likely a broken boolean`] : [];
}

// ---------- duplicate detection ----------
// Two stages: a 16x16 average hash finds candidates cheaply (LSH buckets past a few
// thousand icons), then the 32px rasters are compared by shape distance. Icons that share
// a frame (circle + different glyph) are close in the hash but clearly apart in pixels.
const HASH_SIZE = 16;
export function fingerprint(svg) {
  const img = new Resvg(svg.replace(/#171729/g, '#000'), { fitTo: { mode: 'width', value: 32 }, background: '#fff' }).render();
  const px = new Uint8Array(32 * 32);
  for (let i = 0; i < px.length; i++) px[i] = 255 - img.pixels[i * 4];
  const cells = new Float64Array(HASH_SIZE * HASH_SIZE);
  for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) cells[(y >> 1) * HASH_SIZE + (x >> 1)] += px[y * 32 + x];
  const mean = cells.reduce((a, c) => a + c, 0) / cells.length;
  const hash = new Uint32Array((HASH_SIZE * HASH_SIZE) / 32);
  cells.forEach((v, i) => { if (v > mean) hash[i >> 5] |= 1 << (i & 31); });
  return { hash, px };
}
const popcnt = (v) => { v -= (v >>> 1) & 0x55555555; v = (v & 0x33333333) + ((v >>> 2) & 0x33333333); return (((v + (v >>> 4)) & 0xf0f0f0f) * 0x1010101) >>> 24; };
export const hamming = (a, b) => a.reduce((s, w, i) => s + popcnt(w ^ b[i]), 0);
/**
 * Shape distance in pixels at 32px: for every inked pixel of one icon, the distance to
 * the nearest inked pixel of the other (and back); the largest of those (Hausdorff). A copy
 * nudged half a unit stays under ~1px, while a different glyph inside the same frame
 * leaves pixels 2-4px away from anything.
 */
const dt = (px) => {
  // Two-pass chamfer distance transform to the nearest inked pixel.
  const N = 32;
  const INF = 1e9;
  const d = new Float64Array(N * N).fill(INF);
  for (let i = 0; i < d.length; i++) if (px[i] > 96) d[i] = 0;
  const S = Math.SQRT2;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const i = y * N + x;
    if (x > 0) d[i] = Math.min(d[i], d[i - 1] + 1);
    if (y > 0) d[i] = Math.min(d[i], d[i - N] + 1);
    if (x > 0 && y > 0) d[i] = Math.min(d[i], d[i - N - 1] + S);
    if (x < N - 1 && y > 0) d[i] = Math.min(d[i], d[i - N + 1] + S);
  }
  for (let y = N - 1; y >= 0; y--) for (let x = N - 1; x >= 0; x--) {
    const i = y * N + x;
    if (x < N - 1) d[i] = Math.min(d[i], d[i + 1] + 1);
    if (y < N - 1) d[i] = Math.min(d[i], d[i + N] + 1);
    if (x < N - 1 && y < N - 1) d[i] = Math.min(d[i], d[i + N + 1] + S);
    if (x > 0 && y < N - 1) d[i] = Math.min(d[i], d[i + N - 1] + S);
  }
  return d;
};
const directed = (a, distB) => {
  const v = [];
  for (let i = 0; i < a.length; i++) if (a[i] > 96) v.push(distB[i]);
  if (!v.length) return 0;
  return Math.max(...v);
};
export function shapeDistance(A, B) {
  A.dt ??= dt(A.px);
  B.dt ??= dt(B.px);
  return Math.max(directed(A.px, B.dt), directed(B.px, A.dt));
}

export function nearDuplicates(entries, { hashThreshold = 48, maxShape = 1.5 } = {}) {
  const pairs = [];
  const seen = new Set();
  const consider = (i, j) => {
    const key = i < j ? `${i},${j}` : `${j},${i}`;
    if (seen.has(key)) return;
    seen.add(key);
    if (hamming(entries[i].hash, entries[j].hash) > hashThreshold) return;
    const d = shapeDistance(entries[i], entries[j]);
    if (d <= maxShape) pairs.push([entries[i].name, entries[j].name, Math.round(d * 100) / 100]);
  };
  if (entries.length <= 4000) {
    for (let i = 0; i < entries.length; i++) for (let j = i + 1; j < entries.length; j++) consider(i, j);
  } else {
    const buckets = new Map();
    entries.forEach((e, i) => e.hash.forEach((w, band) => {
      const key = `${band}:${w}`;
      (buckets.get(key) ?? buckets.set(key, []).get(key)).push(i);
    }));
    for (const ids of buckets.values()) for (let a = 0; a < ids.length; a++) for (let b = a + 1; b < ids.length; b++) consider(ids[a], ids[b]);
  }
  return pairs;
}

export function checkMeta(icon, categories) {
  const e = [];
  if (!NAME_RE.test(icon.name)) e.push(`meta: name "${icon.name}" is not kebab-case`);
  if ((icon.tags ?? []).length < 3) e.push('meta: needs at least 3 tags');
  if (!categories.has(icon.category)) e.push(`meta: unknown category "${icon.category}"`);
  return e;
}
