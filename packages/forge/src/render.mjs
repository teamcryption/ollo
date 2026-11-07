// One drawing -> five styles.
//
// An icon is an ordered list of elements:
//   body    closed main shape. Outlined in Light/Regular/Bold, tinted at 25% in Duotone,
//           solid in Fill.
//   line    a stroke (open or closed). In Fill it becomes a knocked-out gap when it sits
//           inside a body, or a solid 1.5-unit bar when it sits outside.
//   accent  the floating accent: a line that never touches anything (checked by QA).
//   tint    duotone-only area (for icons with no natural body).
// `cover: true` on a body or line means "this sits in front": everything drawn before it
// is cut back by a gap, so overlaps read as layers instead of tangles.
import { paper, PaperOffset, itemOf } from './geo.mjs';

export const STYLES = ['light', 'regular', 'bold', 'duotone', 'fill'];
export const SPEC = {
  stroke: { light: 0.75, regular: 1, bold: 1.5, duotone: 1 },
  duotoneOpacity: 0.25,
  fillLine: 1.5, // solid bar width for lines that sit outside a body in Fill
  knockout: 1.3, // gap width for details inside a body in Fill
  fillGap: 1.1, // separation between layers in Fill
  coverGap: 2.25, // distance from a front shape's centreline to where back lines stop
};
const INK = '#171729';
const STROKE_ATTRS = `stroke="${INK}" stroke-linecap="round" stroke-linejoin="round"`;

const isEmpty = (it) => !it || !it.pathData || Math.abs(it.area ?? 0) < 1e-4 && !it.length;
const unite = (a, b) => (a ? a.unite(b, { insert: false }) : b);
const subtract = (a, b, opts = {}) => (a && b ? a.subtract(b, { insert: false, ...opts }) : a);

/**
 * Stroke expansion with round caps. paperjs-offset's own round caps come out inverted
 * on straight segments, so caps are butt + a disc at each open end.
 */
// Boolean ops misbehave when operands wind in opposite directions.
function orient(item) {
  // Only single outlines are flipped; a compound's inner rings are holes and must keep
  // their opposite winding.
  if (!item.children && Math.abs(item.area) > 1e-6 && item.area < 0) item.reverse();
  return item;
}

export function band(it, r) {
  const kids = it.children ?? [it];
  let acc = null;
  for (const k of kids) {
    if (k.length < 0.05) {
      acc = unite(acc, new paper.Path.Circle({ center: k.firstSegment.point, radius: r, insert: false }));
      continue;
    }
    let b = PaperOffset.offsetStroke(k, r, { cap: 'butt', join: 'round', insert: false });
    orient(b);
    if (!k.closed) {
      for (const p of [k.firstSegment.point, k.lastSegment.point]) {
        b = b.unite(orient(new paper.Path.Circle({ center: p, radius: r * 0.998, insert: false })), { insert: false });
      }
    }
    acc = unite(acc, b);
  }
  return acc;
}

function coverRegion(el) {
  const it = itemOf(el.d);
  if (el.role === 'body') return PaperOffset.offset(it, SPEC.coverGap, { insert: false });
  return band(it, SPEC.coverGap);
}

/** For each element, the union of every cover region drawn after it. */
function coversAfter(els) {
  const out = new Array(els.length).fill(null);
  let acc = null;
  for (let i = els.length - 1; i >= 0; i--) {
    out[i] = acc;
    if (els[i].cover) acc = unite(acc, coverRegion(els[i]));
  }
  return out;
}

/** Centre-line geometry per element after cover cuts (shared by every stroke style). */
export function strokeGeometry(els) {
  const covers = coversAfter(els);
  return els.map((el, i) => {
    if (el.role === 'tint') return null;
    if (!covers[i]) return el.d;
    const cut = subtract(itemOf(el.d), covers[i], { trace: false });
    return cut && cut.pathData ? cut.pathData : '';
  });
}

function tintGeometry(els) {
  const covers = coversAfter(els);
  let acc = null;
  els.forEach((el, i) => {
    if (el.role !== 'body' && el.role !== 'tint') return;
    let it = itemOf(el.d);
    if (covers[i]) it = subtract(it, covers[i]);
    acc = unite(acc, it);
  });
  return acc?.pathData || '';
}

function insideFraction(it, region) {
  let hits = 0;
  let total = 0;
  const paths = it.children ?? [it];
  for (const p of paths) {
    const len = p.length;
    for (let k = 0; k <= 20; k++) {
      const q = p.getPointAt((len * k) / 20);
      if (!q) continue;
      total++;
      if (region.contains(q)) hits++;
    }
  }
  return total ? hits / total : 0;
}

/** Fill style as a single solid geometry (true paths, no masks). */
export function fillGeometry(els) {
  let mass = null; // bodies, minus knockouts
  let solids = null; // lines outside bodies
  let hull = null; // bodies without knockouts - decides whether a line sits inside
  for (const el of els) {
    if (el.role === 'tint') continue;
    let it = itemOf(el.d);
    if (el.role === 'body') {
      // Grow to the outer edge of the Regular outline so Fill and Regular share a silhouette.
      it = PaperOffset.offset(it, SPEC.stroke.regular / 2, { insert: false });
      // A body sitting wholly inside another (a lock on a page) is kept visible by
      // knocking out its outline instead of merging into the mass.
      if (!el.cover && hull && insideFraction(it, hull) >= 0.95) {
        mass = subtract(mass, band(it, SPEC.knockout / 2));
        continue;
      }
      if (el.cover) {
        const ring = PaperOffset.offset(it, SPEC.fillGap, { insert: false });
        mass = subtract(mass, ring);
        solids = subtract(solids, ring);
      }
      mass = unite(mass, it);
      hull = el.cover && hull ? subtract(hull, PaperOffset.offset(it, SPEC.fillGap, { insert: false })) : hull;
      hull = unite(hull, it);
      continue;
    }
    if (hull && insideFraction(it, hull) >= 0.8) {
      mass = subtract(mass, band(it, SPEC.knockout / 2));
    } else {
      const sep = band(it, SPEC.fillLine / 2 + SPEC.fillGap);
      if (mass && el.cover) mass = subtract(mass, sep);
      if (el.cover) solids = subtract(solids, sep);
      solids = unite(solids, band(it, SPEC.fillLine / 2));
    }
  }
  const all = mass && solids ? mass.unite(solids, { insert: false }) : mass ?? solids;
  return all?.pathData || '';
}

const svgDoc = (inner) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n${inner}\n</svg>\n`;

/** Renders all five styles. Returns { svgs, paths } where paths lists regular-style path roles (for motion). */
export function renderIcon(els) {
  const geo = strokeGeometry(els);
  const strokeEls = els.map((el, i) => ({ el, d: geo[i] })).filter((x) => x.d);
  const hasMass = els.some((e) => e.role === 'body' || e.role === 'tint');
  const strokes = (w, { dimAccents = false } = {}) =>
    strokeEls
      .map(({ el, d }) => {
        const dim = dimAccents && el.role === 'accent' ? ' stroke-opacity="0.4"' : '';
        return `<path d="${d}" ${STROKE_ATTRS} stroke-width="${w}"${dim}/>`;
      })
      .join('\n');

  const svgs = {
    light: svgDoc(strokes(SPEC.stroke.light)),
    regular: svgDoc(strokes(SPEC.stroke.regular)),
    bold: svgDoc(strokes(SPEC.stroke.bold)),
    duotone: svgDoc(
      (hasMass ? `<path d="${tintGeometry(els)}" fill="${INK}" fill-opacity="${SPEC.duotoneOpacity}"/>\n` : '') +
        strokes(SPEC.stroke.duotone, { dimAccents: !hasMass })
    ),
    fill: svgDoc(`<path d="${fillGeometry(els)}" fill="${INK}"/>`),
  };
  return { svgs, paths: strokeEls.map(({ el }) => el.role) };
}

export { isEmpty };
