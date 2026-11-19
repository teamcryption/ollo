/**
 * Canal lock gates: a stone lock chamber, two walls on a floor slab, closed by
 * a pair of mitre gates, each with a long balance beam over its wall. The
 * pointer over the lock swings the gates open against the walls, the nearer
 * one first. At rest they stand almost shut, one a little ajar, its beam bright.
 * The slider is how far they swing open.
 */
const {
  Cam, fit, facing, poly, prism, proj, rad, rings, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = -40, X1 = 40, CH = 20, WD = 13, WH = 8, GH = 19, L = 18.8, BL = 26, OPEN = 78;
const REST = [0.14, 0.03];

function place(ring, a, hx, hy) {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: hx + q.u * c - q.v * s, v: hy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[X0, -CH - WD, -4], [X1, CH + WD, -4], [X1, -CH - WD, -4], [X0, CH + WD, -4], [-6, -CH - BL, GH + 4], [-6, CH + BL, GH + 4], [X0, -CH - WD, GH + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(X0 - 4, -CH - WD - 4, X1 + 4, CH + WD + 4, 3, 1.4);
  put(solid(g), prism(P, front, br, bi, -4, 0));
  const [fr, fi] = rings(X0, -CH - WD, X1, -CH, 2, 1.2);
  put(solid(g), prism(P, front, fr, fi, 0, WH));
  const water = mk("path", { class: "nf", d: poly([P(X0, -CH, 5), P(X1, -CH, 5), P(X1, CH, 5), P(X0, CH, 5)]) }, g);
  water.classList.add("dash");
  const [gr, gi] = rings(0, -1.6, L, 1.6, 1, 0.6);
  const [bmr, bmi] = rings(-BL, -1.2, L - 2, 1.2, 1, 0.5);
  const gates = [-1, 1].map((sd) => ({ sd, hy: sd * (CH - 1.6), gate: solid(g) }));
  const [nr, ni] = rings(X0, CH, X1, CH + WD, 2, 1.2);
  put(solid(g), prism(P, front, nr, ni, 0, WH));
  for (const gt of gates) { gt.beam = solid(g); }
  const tw = gates.map((_, i) => tween(REST[i]));
  const last = [NaN, NaN];

  function draw(i, f) {
    if (f === last[i]) return;
    last[i] = f;
    const gt = gates[i], a = rad(-gt.sd * OPEN * (1 - f));
    put(gt.gate, prism(P, front, place(gr, a, 0, gt.hy), place(gi, a, 0, gt.hy), 0, GH));
    put(gt.beam, prism(P, front, place(bmr, a, 0, gt.hy), place(bmi, a, 0, gt.hy), GH, GH + 3.5));
  }
  const B = register(stage, (_dt, now) => {
    let m = false;
    tw.forEach((t, i) => { draw(i, tval(t, now)); if (!tdone(t, now)) m = true; });
    return m;
  });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    tw.forEach((t, i) => tset(t, a < 0 ? REST[i] : reach, now, a < 0 ? 0 : Math.abs(i - a) * 60));
    const hi = a < 0 ? 1 : a;
    gates.forEach((gt, i) => gt.beam.sil.classList.toggle("hi", i === hi));
    read.textContent = a < 0 ? "rest" : `open ${a + 1}`;
    B.wake();
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, WH);
    const inside = x > X0 - 12 && x < X1 + 12 && Math.abs(y) < CH + WD + 18;
    setActive(inside ? (y < 0 ? 0 : 1) : -1);
  }
  bag.add(pointer(stage, { move, leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  setActive(-1);
  return { set: (v) => { reach = v; if (act >= 0) { const a = act; act = -2; setActive(a); } }, destroy: bag.dispose };
}

hairline({
  name: "canallock",
  means: "A canal lock whose pair of mitre gates, each with a long balance beam, swing open against the walls under the pointer.",
  rules: [1, 2, 3, 4, 5],
  range: [0.3, 1, 1],
  tour: [[262, 148], [86, 179], [314, 190], null],
  mount,
});
