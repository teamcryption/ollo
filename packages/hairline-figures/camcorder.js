/**
 * Camcorder: a handheld video camera with its lens out front, a grip strap
 * handle on top and a flip-out screen on its near side. The pointer over the
 * camera swings the screen out on its front hinge. At rest the screen stands
 * a little ajar and the lens rim is bright. The slider is how far it swings.
 *
 * The pattern: one panel swinging on a hinge (open).
 */
const { Cam, fillet, fit, facing, hull, poly, prism, proj, rad, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const BW = 66, BD = 30, BH = 34, HX = 60, LP = 46, TH = 3, Z0 = 4, Z1 = 31, LX = 88, LR = 13;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = 40 + value * 0.6;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-2, 0, 0], [LX, 0, 0], [LX, BD + LP, 0], [0, BD + LP, 0], [0, 0, BH + 12], [LX, BD, BH + 12]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the body, and the handle on top
  const [br, bi] = rings(0, 0, BW, BD, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, BH));
  const [hr, hi] = rings(14, 9, 54, 21, 5, 1.5);
  put(solid(g), prism(P, front, hr, hi, BH, BH + 10));
  const [vr, vi] = rings(-4, 8, 12, 22, 4, 1.4);
  put(solid(g), prism(P, front, vr, vi, BH - 12, BH - 2));
  // the lens: a barrel lying along x, its rim the rest mark
  const disc = (x, r) => Array.from({ length: 32 }, (_, k) => { const a = (k / 32) * Math.PI * 2; return P(x, BD / 2 + r * Math.cos(a), 17 + r * Math.sin(a)); });
  const lens = solid(g);
  lens.sil.setAttribute("d", poly(hull(disc(BW - 2, LR - 2).concat(disc(LX, LR)))));
  const rim = mk("path", { d: poly(disc(LX, LR - 2)), class: "nf" }, g);
  mk("path", { d: poly(disc(LX, LR - 6)), class: "nf lo" }, g);
  // the recess the screen folds into
  mk("path", { d: poly(fillet([[HX - LP + 2, BD, Z0 + 2], [HX - 2, BD, Z0 + 2], [HX - 2, BD, Z1 - 2], [HX - LP + 2, BD, Z1 - 2]].map((q) => P(...q)), [2, 2, 2, 2])), class: "nf lo" }, g);

  // the screen: a thin slab hinged at its front edge
  const scr = solid(g), face = mk("path", { class: "nf lo" }, g);
  const ang = tween(0);
  let last = NaN;
  function draw(t) {
    if (Math.abs(t - last) < 0.02) return;
    last = t;
    const a = rad(t), u = [-Math.cos(a), Math.sin(a)], n = [Math.sin(a), Math.cos(a)];
    const pt = (s, b, z) => P(HX + s * u[0] + b * n[0], BD + s * u[1] + b * n[1], z);
    const pts = [];
    for (const s of [0, LP]) for (const b of [0, TH]) for (const z of [Z0, Z1]) pts.push(pt(s, b, z));
    const h = hull(pts);
    scr.sil.setAttribute("d", poly(fillet(h, h.map(() => 1.5))));
    face.setAttribute("d", poly(fillet([pt(3, TH, Z0 + 3), pt(LP - 3, TH, Z0 + 3), pt(LP - 3, TH, Z1 - 3), pt(3, TH, Z1 - 3)], [2, 2, 2, 2])));
  }

  const B = register(stage, (dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  // hit against the rest pose: the camera's box on screen
  const top = P(0, 0, BH + 10)[1], bot = P(BW, BD + 6, 0)[1] + 4, left = P(0, BD + 20, 0)[0], right = P(LX, 0, 17)[0] + 6;
  let act = null, lastP = null;
  function setActive(p) {
    lastP = p;
    const on = !!p && p[0] > left && p[0] < right && p[1] > top && p[1] < bot;
    tset(ang, on ? max : 16, performance.now(), 0);
    if (on !== act) { act = on; scr.sil.classList.toggle("hi", on); rim.classList.toggle("hi", !on); }
    read.textContent = on ? "lcd " + Math.round(max) : "rest";
    B.wake();
  }
  setActive(null);
  bag.add(pointer(stage, { move: (p) => setActive(p), leave: () => setActive(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = 40 + v * 0.6; setActive(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "camcorder",
  means: "A camcorder with a flip-out screen: the pointer over the camera swings the screen out on its front hinge.",
  rules: [1, 4, 5, 8],
  range: [0, 85, 100],
  tour: [[235, 103], [200, 170], [300, 165], null],
  mount,
});
