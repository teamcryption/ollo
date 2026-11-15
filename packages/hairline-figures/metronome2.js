/**
 * Music box: a wooden box with a hinged lid, a pinned drum inside and a
 * crank on its side. The pointer's place along the box sets how far the lid
 * swings open, and the crank turns with it. At rest the lid stands ajar,
 * bright. The slider is how far the lid may open.
 *
 * The pattern: one part following the pointer (hinge).
 */
const {
  Cam, fit, facing, fillet, hull, poly, prism, proj, rings, ringAt, open, seg, clamp, rad, spring, stepS, unproj, circ,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 44, H = 26, T = 5, REST = 18;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[0, 0, 0], [W + 12, D, 0], [W, -18, H + D], [0, -18, H + D], [0, D, 0]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // the open well: an inner rim on the top
  const [wr] = rings(3, 3, W - 3, D - 3, 2, 0.8);
  mk("path", { d: poly(ringAt(P, wr, H)), class: "lo" }, g);
  // the drum, lying along x inside the well, and its comb
  const drum = [];
  for (const x of [12, W - 22]) for (let i = 0; i < 20; i++) { const t = (i / 20) * Math.PI * 2; drum.push(P(x, D * 0.55 + 6 * Math.cos(t), H - 7 + 6 * Math.sin(t))); }
  mk("path", { d: poly(hull(drum)), class: "nf" }, g);
  let comb = "";
  for (let i = 0; i < 9; i++) { const x = 13 + i * 3.6; comb += seg(P(x, D * 0.55 + 7, H - 1), P(x, D - 6, H - 1)); }
  mk("path", { d: comb, class: "nf lo" }, g);

  const lid = mk("path", { class: "sil hi" }, g), lidIn = mk("path", { class: "nf lo" }, g);
  const crank = mk("path", { class: "nf sil" }, g), knob = mk("path", { class: "" }, g);
  const LP = (x, yl, hl, a) => P(x, yl * Math.cos(a) - hl * Math.sin(a), H + yl * Math.sin(a) + hl * Math.cos(a));
  const knobRing = circ(2.2, 14);

  const A = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), pts = [];
    for (const x of [0, W]) for (const yl of [0, D]) for (const hl of [0, T]) pts.push(LP(x, yl, hl, a));
    const hp = hull(pts);
    lid.setAttribute("d", poly(fillet(hp, hp.map(() => 3), 3)));
    lidIn.setAttribute("d", open([LP(3, D - 3, T, a), LP(W - 3, D - 3, T, a), LP(W - 3, 3, T, a)]));
    // crank on the +x face: shaft, arm, handle
    const cy = D * 0.55, cz = H * 0.5, ph = a * 3, ay = cy + 9 * Math.cos(ph), az = cz + 9 * Math.sin(ph);
    crank.setAttribute("d", seg(P(W, cy, cz), P(W + 5, cy, cz)) + seg(P(W + 5, cy, cz), P(W + 5, ay, az)));
    knob.setAttribute("d", poly(hull(knobRing.map((q) => P(W + 5, ay + q.u, az + q.v)).concat(knobRing.map((q) => P(W + 11, ay + q.u, az + q.v))))));
  }

  const B = register(stage, (dt) => { const m = stepS(A, dt); draw(A.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    if (wx < -14 || wx > W + 14 || wy < -30 || wy > D + 20) return leave();
    const t = clamp(wx / W, 0, 1);
    A.t = REST + 6 + t * (maxA - REST - 6);
    read.textContent = "lid " + Math.round(A.t) + "°";
    B.wake();
  }
  function leave() { A.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  draw(REST);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "metronome2",
  means: "A music box with a hinged lid: the pointer's place along the box swings the lid open and turns the crank on its side.",
  rules: [1, 3, 5, 8],
  range: [60, 95, 110],
  tour: [[131, 228], [182, 254], [240, 283], null],
  mount,
});
