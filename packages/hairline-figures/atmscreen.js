/**
 * Payment pad: a PIN pad on a short stand, its screen lit, leaning back.
 * The pointer over the pad tilts it forward to face the customer; the slider is how far.
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
  S: 2.7, rest: 0, samples: [0, 1], mid: [0, 0, 30],
  parts: [
    { cyl: [0, 0, 24, 24, 0, 5], still: true },
    { box: [-5, -5, 5, 5, 5, 26], still: true },
    { box: [-28, -46, 26, 28, 46, 34], tf: (p, v) => rot(p, "x", [0, 0, 30], 22 - 50 * v) },
    { box: [-22, 16, 34, 22, 38, 35.5], tf: (p, v) => rot(p, "x", [0, 0, 30], 22 - 50 * v), hi: true },
    ...[0, 1, 2, 3].flatMap((r) => [0, 1, 2].map((c) => ({ quad: [[-21 + c * 15, -40 + r * 13, 34], [-9 + c * 15, -40 + r * 13, 34], [-9 + c * 15, -30 + r * 13, 34], [-21 + c * 15, -30 + r * 13, 34]], tf: (p, v) => rot(p, "x", [0, 0, 30], 22 - 50 * v) }))),
  ],
  hit: (p, c) => Math.hypot(p[0] - c.mid[0], p[1] - c.mid[1]) < 120 ? 1 : null, at: (t, a) => a, read: (t) => (t === null ? "rest" : "tilt"),
};

hairline({
  name: "atmscreen",
  means: "A card payment pad on a stand: the pointer over it tilts the keypad and screen forward to face you.",
  rules: [1, 3, 4, 5, 6],
  range: [0.4, 0.8, 1],
  tour: [[148, 176], [200, 170], [230, 160], null],
  mount,
});
