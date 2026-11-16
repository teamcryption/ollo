/**
 * Coin funnel: a wide funnel hanging over four coin tubes of rising height.
 * The pointer picks a tube by where it stands and the funnel slides over it.
 *
 * The pattern: one part on a hinge or rail.
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;
const rot = (p, ax, o, a) => {
  const r = (a * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
  let x = p[0] - o[0], y = p[1] - o[1], z = p[2] - o[2];
  if (ax === "x") [y, z] = [y * c - z * s, y * s + z * c];
  else if (ax === "y") [x, z] = [x * c + z * s, -x * s + z * c];
  else [x, y] = [x * c - y * s, x * s + y * c];
  return [x + o[0], y + o[1], z + o[2]];
};
const id = (p) => p;
const corners = ([x0, y0, z0, x1, y1, z1]) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
const FACES = [[4, 5, 6, 7], [3, 2, 1, 0], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
const ring = (x, y, r, z, n = 28) => Array.from({ length: n }, (_, i) => [x + r * Math.cos((i / n) * 2 * Math.PI), y + r * Math.sin((i / n) * 2 * Math.PI), z]);
const area = (q) => q.reduce((s, p, i) => { const n = q[(i + 1) % q.length]; return s + p[0] * n[1] - n[0] * p[1]; }, 0);
// world points of a part at value v
function pts(pt, v) {
  const tf = pt.tf ? (p) => pt.tf(p, v) : id;
  if (pt.box) return corners(pt.box).map(tf);
  if (pt.cyl) { const [x, y, r0, r1, z0, z1] = pt.cyl; return ring(x, y, r0, z0).concat(ring(x, y, r1, z1)).map(tf); }
  return pt.quad.map(tf);
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, SPEC.S);
  const all = [];
  for (const v of SPEC.samples) for (const pt of SPEC.parts) all.push(...pts(pt, v));
  fit(C, all, 200, 162);
  const P = proj(C);
  const sgn = Math.sign(area([[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]].map((p) => P(...p))));
  const g = mk("g", {}, svg);
  const els = SPEC.parts.map((pt) => ({ pt, s: mk("path", { class: pt.quad ? "nf" : "sil" }, g), f: pt.quad ? null : mk("path", { class: "nf" }, g) }));
  const val = tween(SPEC.rest);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    for (const e of els) {
      if (e.pt.still && e.done) continue;
      e.done = true;
      const w = pts(e.pt, v).map((p) => P(...p));
      if (e.pt.quad) { e.s.setAttribute("d", poly(w)); continue; }
      e.s.setAttribute("d", poly(hull(w)));
      if (e.pt.box) e.f.setAttribute("d", FACES.map((f) => f.map((i) => w[i])).filter((q) => Math.sign(area(q)) === sgn).map(poly).join(""));
      else e.f.setAttribute("d", poly(w.slice(w.length / 2)));
    }
  }
  const B = register(stage, (_dt, now) => { draw(tval(val, now)); return !tdone(val, now); });
  bag.add(B.unregister);
  const ctx = { P, mid: P(...SPEC.mid) };
  let act = null;
  function set(t) {
    if (t === act) return;
    act = t;
    tset(val, t === null ? SPEC.rest : SPEC.at(t, amt), performance.now(), 0);
    els.forEach((e) => e.s.classList.toggle("hi", !!e.pt.hi));
    read.textContent = SPEC.read(t);
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, { move: (p) => set(SPEC.hit(p, ctx)), leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act !== null) { const a = act; act = undefined; set(a); } }, destroy: bag.dispose };
}

const SPEC = {
  S: 1.6, rest: 30, samples: [0, 90], mid: [45, 0, 20],
  parts: [
    { box: [-16, -16, 0, 106, 16, 6], still: true },
    { cyl: [0, 0, 8, 8, 6, 26], still: true },
    { cyl: [30, 0, 9.5, 9.5, 6, 32], still: true },
    { cyl: [60, 0, 11, 11, 6, 38], still: true },
    { cyl: [90, 0, 12.5, 12.5, 6, 44], still: true },
    { cyl: [0, 0, 5, 5, 52, 62], tf: (p, v) => [p[0] + v, p[1], p[2]] },
    { cyl: [0, 0, 6, 34, 62, 92], tf: (p, v) => [p[0] + v, p[1], p[2]], hi: true },
  ],
  hit: (p, c) => { let b = 0, d = Infinity; [0, 30, 60, 90].forEach((x) => { const q = c.P(x, 0, 20), e = Math.abs(q[0] - p[0]); if (e < d) { d = e; b = x; } }); return d < 40 ? b : null; },
  at: (t) => t, read: (t) => (t === null ? "rest" : "tube " + (t / 30 + 1)),
};

hairline({
  name: "coinsorter2",
  means: "A coin funnel over four sorting tubes: the funnel slides along to sit over the tube under the pointer.",
  rules: [1, 3, 4, 5, 6],
  range: [0, 0.5, 1],
  tour: [[251, 195], [149, 187], [200, 190], null],
  mount,
});
