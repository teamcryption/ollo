/**
 * Spectrometer: a benchtop case with a sample well and a hinged lid at the
 * back. The pointer over the case swings the lid open on its hinge to show
 * the cuvette standing in the well; leaving lets it settle back ajar. At
 * rest the lid is bright, slightly open. The slider is how far it opens.
 *
 * The pattern: one part on a hinge (lid).
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid, unproj } = HL;

const W = 90, D = 60, H = 26, T = 4, REST = 18;
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = 70 + value * 0.4;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, D, 0], [W, D, 0], [0, -24, H + D + 6], [W, -24, H + D + 6], [0, 0, H + 8], [W, 0, H + 8]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 4, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // display panel and the sample well on the top
  const sq = (x0, y0, x1, y1, z) => [P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)];
  mk("path", { d: poly(sq(12, 10, 40, 22, H)), class: "nf" }, g);
  mk("path", { d: poly(sq(56, 24, 66, 34, H)), class: "nf" }, g);
  // the cuvette standing in the well
  const cuv = [];
  for (const z of [H, H + 14]) cuv.push(...sq(58, 26, 64, 32, z));
  mk("path", { d: poly(hull(cuv)), class: "nf lo" }, g);
  mk("path", { d: poly(sq(58, 26, 64, 32, H + 14)), class: "nf lo" }, g);
  const lg = mk("g", {}, g);
  const lid = mk("path", { class: "sil" }, lg), top = mk("path", { class: "nf" }, lg), grip = mk("path", { class: "nf" }, lg);
  const ang = tween(REST);
  let last = NaN;
  const L = (x, u, t, a) => P(x, u * Math.cos(a) - t * Math.sin(a), H + u * Math.sin(a) + t * Math.cos(a));
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), pts = [];
    for (const x of [0, W]) for (const u of [0, D]) for (const t of [0, T]) pts.push(L(x, u, t, a));
    lid.setAttribute("d", poly(hull(pts)));
    top.setAttribute("d", poly([L(0, 0, T, a), L(W, 0, T, a), L(W, D, T, a), L(0, D, T, a)]));
    grip.setAttribute("d", poly([L(35, D, 0, a), L(55, D, 0, a), L(55, D + 4, 1, a), L(35, D + 4, 1, a)]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(ang, o ? max : REST, performance.now(), 0);
    lid.classList.add("hi");
    read.textContent = o ? Math.round(max) + "°" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, H); set(x > -8 && x < W + 8 && y > -8 && y < D + 30); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = 70 + v * 0.4; if (on) { on = null; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "spectro",
  means: "A benchtop spectrometer: the pointer swings its hinged lid open to show the cuvette in the sample well.",
  rules: [1, 3, 4, 5, 6],
  range: [0, 50, 100],
  tour: [[183, 211], [204, 250], [162, 172], null],
  mount,
});
