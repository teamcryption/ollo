/**
 * Bird table: a tray on a post with a gabled roof on four corner posts. The
 * roof is hinged along its back eave: the pointer over the table tilts it up
 * and back, wider the nearer the front the pointer comes. At rest the roof
 * sits a little lifted, bright. The slider is the widest tilt.
 *
 * The pattern: one lid turning on a hinge (open).
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rad, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const T0 = 52, T1 = 56, UP = 80, RX = 30, EZ = 82, RZ = 104, REST = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-24, -24, 0], [28, 28, 0], [-RX, -RX, T0], [RX, RX, T0], [-RX, RX, RZ], [RX, -RX, RZ], [-RX - 20, 0, RZ + 40], [-RX, RX, EZ + 62]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // feet: a low cross on the ground
  const [fa, fai] = rings(-22, -4, 22, 4, 2, 1);
  put(solid(g), prism(P, front, fa, fai, 0, 4));
  const [fb, fbi] = rings(-4, -22, 4, 22, 2, 1);
  put(solid(g), prism(P, front, fb, fbi, 0, 4));
  const [pr, pi] = rings(-3.5, -3.5, 3.5, 3.5, 1.5, 1);
  put(solid(g), prism(P, front, pr, pi, 4, T0));
  // the tray with a raised lip
  const [tr, ti] = rings(-26, -26, 26, 26, 3, 3);
  put(solid(g), prism(P, front, tr, ti, T0, T1));
  let d = "";
  for (const [x, y] of [[-6, 4], [2, -8], [9, 6], [-12, -4], [4, 12]]) d += seg(P(x, y, T1), P(x + 2, y + 1, T1));
  mk("path", { d, class: "nf lo" }, g);
  for (const [x, y] of [[-23, -23], [23, -23], [-23, 23], [23, 23]].sort((a, b) => a[0] + a[1] - b[0] - b[1])) {
    const [ur, ui] = rings(x - 1.6, y - 1.6, x + 1.6, y + 1.6, 0.8, 0.6);
    put(solid(g), prism(P, front, ur, ui, T1, UP));
  }

  const roof = mk("g", {}, g);
  const sil = mk("path", { class: "sil hi" }, roof), faces = mk("path", { class: "nf lo" }, roof);
  const ang = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    // hinge line: x = -RX, z = UP, along y
    const at = (x, y, z) => { const dx = x + RX, dz = z - UP; return P(-RX + dx * c - dz * s, y, UP + dx * s + dz * c); };
    const pts = [];
    for (const y of [-RX - 3, RX + 3]) pts.push(at(-RX - 3, y, EZ - 2), at(-RX - 3, y, EZ), at(0, y, RZ), at(0, y, RZ + 3), at(RX + 3, y, EZ), at(RX + 3, y, EZ - 2));
    sil.setAttribute("d", poly(hull(pts)));
    const Y = RX + 3;
    faces.setAttribute("d",
      seg(at(0, -Y, RZ + 3), at(0, Y, RZ + 3)) +
      seg(at(-RX - 3, Y, EZ), at(0, Y, RZ + 3)) + seg(at(0, Y, RZ + 3), at(RX + 3, Y, EZ)) +
      seg(at(RX + 3, -Y, EZ), at(RX + 3, Y, EZ)));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let tgt = null, lastP = null;
  function lift(p) {
    lastP = p;
    let a = REST;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], T0);
      if (wy > -45 && wy < 45 && wx > -45 && wx < 50) a = maxA * clamp((wx + 40) / 80, 0.35, 1);
    }
    a = Math.round(a);
    if (a === tgt) return;
    tgt = a;
    ang.t = a;
    read.textContent = !p || a === REST ? "rest" : "roof " + a + "°";
    B.wake();
  }
  lift(null);
  bag.add(pointer(stage, { move: lift, leave: () => lift(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; tgt = null; lift(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "birdtable",
  means: "A bird table on a post: its gabled roof is hinged at the back eave and tilts up as the pointer comes over the tray.",
  rules: [1, 3, 5, 6],
  range: [40, 70, 95],
  tour: [[185, 186], [225, 199], [252, 212], null],
  mount,
});
