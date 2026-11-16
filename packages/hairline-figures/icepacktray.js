/**
 * Hot water bottle: a ribbed rubber bottle lying on a mat, with a neck and a screw cap. The pointer tips the bottle up from its base edge, neck first. At rest it is tilted a little, its cap bright. The slider is how far it tips.
 *
 * The pattern: one hinged part that answers the pointer (tilt).
 */
const { Cam, fit, proj, hull, poly, open, clamp, lerp, rad, spring, stepS, mk, pointer, register, disposer } = HL;

const REST = 10, MAX = 55;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => { const l = Math.hypot(...a); return a.map((v) => v / l); };
function circAt(p, d, r, n = 24) {
  const w = nrm(d), t = Math.abs(w[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0], u = nrm(crs(w, t)), v = crs(w, u), out = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, c = Math.cos(a) * r, s = Math.sin(a) * r; out.push([p[0] + u[0] * c + v[0] * s, p[1] + u[1] * c + v[1] * s, p[2] + u[2] * c + v[2] * s]); }
  return out;
}
// a cylinder or cone between two points; its far end is its crease
const cyl = (p0, p1, r0, r1 = r0) => { const d = sub(p1, p0), a = circAt(p0, d, r0), b = circAt(p1, d, r1); return { pts: a.concat(b), lines: [b] }; };
function slab(x0, y0, x1, y1, z0, z1, r) {
  const ring = (z) => { const o = []; for (const [cx, cy, a0] of [[x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180], [x1 - r, y0 + r, 270]]) for (let i = 0; i <= 4; i++) { const a = rad(a0 + i * 22.5); o.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, z]); } return o; };
  return { pts: ring(z0).concat(ring(z1)), lines: [ring(z1)] };
}
function ball(c, r) { let pts = []; for (let i = 1; i < 8; i++) { const a = (i / 8) * Math.PI; pts = pts.concat(circAt([c[0], c[1], c[2] - Math.cos(a) * r], [0, 0, 1], Math.sin(a) * r)); } return { pts: pts.concat([[c[0], c[1], c[2] + r], [c[0], c[1], c[2] - r]]), lines: [] }; }

const HINGES = [{ p: [0, 0, 1.5], a: [0, -1, 0], f: 1 }];
const PARTS = [
  { ...slab(-8, -6, 74, 42, 0, 1.5, 6) },
  { ...slab(0, 0, 52, 36, 1.5, 10, 9), chain: [0] },
  { ...cyl([52, 18, 5.5], [59, 18, 5.5], 5.5, 4.5), chain: [0] },
  { ...cyl([59, 18, 5.5], [66, 18, 5.5], 6.5), chain: [0], hi: true },
];
PARTS[1].open = [10, 18, 26, 34, 42].map((x) => [[x, 5, 10], [x + 4, 31, 10]]);
const ANCHOR = [62, 18, 5.5], ANCHOR_CHAIN = [0];

function turn(q, h, th) {
  const a = h.a, v = sub(q, h.p), c = Math.cos(th), s = Math.sin(th), x = crs(a, v), d = a[0] * v[0] + a[1] * v[1] + a[2] * v[2];
  return [0, 1, 2].map((i) => h.p[i] + v[i] * c + x[i] * s + a[i] * d * (1 - c));
}
const pose = (q, part, th) => { let o = q; for (const k of part.chain || []) o = turn(o, HINGES[k], th * HINGES[k].f); return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let k = value / 100;
  const all = [];
  for (const th of [rad(REST), rad(MAX)]) for (const p of PARTS) for (const q of p.pts) all.push(pose(q, p, th));
  const C0 = Cam(45, 0.5, 1); fit(C0, all, 200, 160);
  const P0 = proj(C0), sp0 = all.map((q) => P0(...q));
  const w = Math.max(...sp0.map((s) => s[0])) - Math.min(...sp0.map((s) => s[0])), h = Math.max(...sp0.map((s) => s[1])) - Math.min(...sp0.map((s) => s[1]));
  const C = Cam(45, 0.5, Math.min(300 / w, 236 / h)); fit(C, all, 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const els = PARTS.map((p) => ({ p, sil: mk("path", { class: p.hi ? "sil hi" : "sil" }, g), cr: p.lines.map(() => mk("path", { class: "nf lo" }, g)), ln: (p.open || []).map(() => mk("path", { class: "nf lo" }, g)) }));
  const sp = spring(rad(REST), { k: 90, c: 16 });
  let last = NaN, on = true;
  function draw(th) {
    if (th === last) return;
    last = th;
    for (const e of els) {
      const pr = (q) => P(...pose(q, e.p, th));
      e.sil.setAttribute("d", poly(hull(e.p.pts.map(pr))));
      e.p.lines.forEach((l, i) => e.cr[i].setAttribute("d", poly(l.map(pr))));
      (e.p.open || []).forEach((l, i) => e.ln[i].setAttribute("d", open(l.map(pr))));
    }
    read.textContent = on ? "rest" : Math.round((th * 180) / Math.PI) + "\u00b0";
  }
  draw(sp.x);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const anchor = P(...pose(ANCHOR, { chain: ANCHOR_CHAIN }, rad(REST)));
  function aim([sx, sy]) {
    const near = clamp(1 - Math.hypot(sx - anchor[0], sy - anchor[1]) / 260, 0, 1);
    on = false; last = NaN;
    sp.t = rad(lerp(REST, lerp(REST, MAX, k), 0.45 + 0.55 * near));
    B.wake();
  }
  bag.add(pointer(stage, { move: aim, leave: () => { on = true; last = NaN; sp.t = rad(REST); B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { k = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "icepacktray",
  means: "A ribbed hot water bottle on a mat: the pointer tips it up from its base, the bright cap rising with the neck.",
  rules: [1, 3, 4, 5, 8],
  range: [20, 80, 100],
  tour: [[263, 228], [111, 167], [272, 232], null],
  mount,
});
