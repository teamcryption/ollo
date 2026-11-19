/**
 * Cotton gin: a wooden box on a base with a row of saw discs standing up
 * through slots in its top, a hinged hopper lid over them and a crank on its
 * near side. The pointer over the gin turns the crank and swings the lid
 * up on its far edge to bare the saws. At rest the lid is bright, just
 * ajar. The slider is how far the lid opens.
 *
 * The pattern: one part on a hinge (lid).
 */
const { Cam, fit, hull, poly, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid, unproj } = HL;

const W = 76, D = 52, H = 38, T = 4, REST = 10, NS = 7, SR = 13, CY = 26, CZ = H - 14, CR = 16;
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = 40 + value * 0.5;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-6, -6, 0], [W + 6, -6, 0], [-6, D + 6, 0], [W + 6, D + 6, 0], [0, -T, H + D + 2], [W, -T, H + D + 2], [W + 18, CY + CR + 4, CZ], [W + 18, CY, CZ + CR + 4]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const all = () => true;
  put(solid(g), prism(P, all, ...rings(-6, -6, W + 6, D + 6, 4, 2), 0, 5));
  put(solid(g), prism(P, all, ...rings(0, 0, W, D, 3, 1.5), 5, H));
  for (let i = 0; i < NS; i++) {
    const x = 10 + i * ((W - 20) / (NS - 1)), pts = [];
    for (let k = 0; k <= 22; k++) { const t = (k / 22) * Math.PI, r = k % 2 ? SR - 2.5 : SR; pts.push(P(x, CY + r * Math.cos(t), H - 5 + r * Math.sin(t))); }
    mk("path", { d: poly(pts), class: "" }, g);
  }
  const lg = mk("g", {}, g);
  const lid = mk("path", { class: "sil hi" }, lg), top = mk("path", { class: "nf lo" }, lg);
  const arm = mk("path", { class: "" }, g), knob = mk("path", { class: "" }, g);
  const ang = tween(REST);
  let last = NaN;
  const L = (x, u, t, a) => P(x, u * Math.cos(a) - t * Math.sin(a), H + u * Math.sin(a) + t * Math.cos(a));
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), pts = [];
    for (const x of [-2, W + 2]) for (const u of [0, D + 2]) for (const t of [0, T]) pts.push(L(x, u, t, a));
    lid.setAttribute("d", poly(hull(pts)));
    top.setAttribute("d", poly([L(1, 2, T, a), L(W - 1, 2, T, a), L(W - 1, D - 1, T, a), L(1, D - 1, T, a)]));
    const c = rad(deg * 3 + 200), hy = CY + CR * Math.cos(c), hz = CZ + CR * Math.sin(c), ap = [], kp = [];
    for (let i = 0; i < 12; i++) {
      const t = (i / 12) * 2 * Math.PI;
      for (const x of [W, W + 4]) ap.push(P(x, CY + 4.5 * Math.cos(t), CZ + 4.5 * Math.sin(t)), P(x, hy + 3 * Math.cos(t), hz + 3 * Math.sin(t)));
      for (const x of [W + 4, W + 18]) kp.push(P(x, hy + 2.6 * Math.cos(t), hz + 2.6 * Math.sin(t)));
    }
    arm.setAttribute("d", poly(hull(ap)));
    knob.setAttribute("d", poly(hull(kp)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(ang, o ? max : REST, performance.now(), 0);
    read.textContent = o ? Math.round(max) + "°" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, H); set(x > -30 && x < W + 30 && y > -30 && y < D + 30); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = 40 + v * 0.5; if (on) { on = null; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "cottongin",
  means: "A cotton gin: the pointer turns the crank and swings the hopper lid up on its far edge to bare the row of saw discs.",
  rules: [1, 3, 4, 5, 6],
  range: [0, 50, 100],
  tour: [[200, 163], [183, 189], [240, 170], null],
  mount,
});
