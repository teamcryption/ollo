/**
 * Windscreen wiper: a raked windscreen in its frame over the scuttle, one
 * wiper arm parked along its foot. At rest the blade lies low, bright. The
 * pointer over the glass sweeps the arm up across the screen on its pivot;
 * the slider is how far it sweeps.
 *
 * The pattern: one pivoting part (swing).
 */
const { Cam, fit, facing, hull, poly, open, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 120, V = 64, PU = 34, PV = 4, REST = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.1);
  const G = (u, v, n = 0) => [u, 44 - 0.6 * v + 0.8 * n, 0.8 * v + 0.6 * n];
  const Q = (u, v, n) => P(...G(u, v, n));
  let P = null;
  fit(C, [G(-6, -4), G(W + 6, -4), G(-6, V + 4), G(W + 6, V + 4), [-6, 56, -6], [W + 6, 56, -6]], 200, 166);
  P = proj(C);
  const front = facing(C), g = mk("g", {}, svg);
  // frame, glass, scuttle
  mk("path", { d: poly([Q(-5, -2, 0), Q(W + 5, -2, 0), Q(W + 1, V + 4, 0), Q(-1, V + 4, 0)]), class: "sil" }, g);
  mk("path", { d: poly([Q(1, 1, 0.5), Q(W - 1, 1, 0.5), Q(W - 4, V, 0.5), Q(4, V, 0.5)]), class: "nf lo" }, g);
  { const [r, i] = rings(-6, 42, W + 6, 56, 3, 1); put(solid(g), prism(P, front, r, i, -6, 1)); }
  mk("path", { d: poly(hull([0, 1, 2, 3, 4, 5, 6, 7].map((k) => Q(PU + 3 * Math.cos(k * Math.PI / 4), PV + 3 * Math.sin(k * Math.PI / 4), 1.5)))) }, g);
  const arm = mk("path", { class: "sil" }, g), blade = mk("path", { class: "sil" }, g), hub = mk("path", {}, g);
  const ang = tween(REST);
  let last = NaN;
  const at = (r, s, a, n) => Q(PU + r * Math.cos(a) - s * Math.sin(a), PV + r * Math.sin(a) + s * Math.cos(a), n);
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180;
    arm.setAttribute("d", poly(hull([at(0, -1.6, a, 2), at(0, 1.6, a, 2), at(46, -1, a, 2.6), at(46, 1, a, 2.6), at(0, 0, a, 4), at(46, 0, a, 3.6)])));
    blade.setAttribute("d", poly(hull([at(16, -3, a, 1.2), at(16, -0.4, a, 1.2), at(60, -3, a, 1.2), at(60, -0.4, a, 1.2), at(16, -2, a, 2.6), at(60, -2, a, 2.6)])));
    hub.setAttribute("d", poly(hull([0, 1, 2, 3, 4, 5, 6, 7].map((k) => at(2.2 * Math.cos(k * Math.PI / 4), 2.2 * Math.sin(k * Math.PI / 4), a, 4.2)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const mid = Q(W / 2, V / 2, 0);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a > 0 ? maxA : REST, performance.now(), 0);
    blade.classList.add("hi");
    read.textContent = a > 0 ? Math.round(maxA) + "°" : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 150 && Math.abs(sy - mid[1]) < 110 ? 1 : -1),
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act > 0) { tset(ang, v, performance.now(), 0); read.textContent = Math.round(v) + "°"; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "wiperblade",
  means: "A windscreen with one wiper parked at its foot: the pointer over the glass sweeps the arm and blade up across the screen.",
  rules: [1, 4, 5, 8],
  range: [50, 90, 120],
  tour: [[214, 156], [250, 130], [170, 180], null],
  mount,
});
