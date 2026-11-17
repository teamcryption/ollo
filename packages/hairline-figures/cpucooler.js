/**
 * CPU socket: a square socket on a patch of motherboard, a processor seated
 * in it, the hinged load plate over the processor and the retention lever
 * along its side. The pointer over the board lifts the lever and swings the
 * load plate open on its far hinge, baring the chip. At rest everything is
 * latched, the lever just off its hook, bright. The slider is how far the
 * load plate swings.
 *
 * The pattern: one part on a hinge; the hit is the board's fixed plane.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rings, rrect, rad, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HX = -3, PZ = 7.2, PT = 1.4, LX = 47, LY = 48, LZ = 3, LREST = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-14, -14, -4], [58, 58, -4], [58, -14, -4], [-14, 58, -4], [-32, 0, 56], [-32, 44, 56], [LX, LY, 52]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const block = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  block(-14, -14, 58, 58, 5, 1.8, -4, 0);
  block(-6, -6, 46, 46, 3, 1.2, 0, 3);
  const chipG = mk("g", {}, g);
  const [c1, c2] = rings(5, 5, 35, 35, 2, 1);
  put(solid(chipG), prism(P, front, c1, c2, 3, 5));
  const [c3, c4] = rings(10, 10, 30, 30, 2.5, 1);
  put(solid(chipG), prism(P, front, c3, c4, 5, 7));

  // a thin plate turned about a hinge line along y: u runs from the hinge, h is its thickness
  function hinged(x0, z0, sgn, a) {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    return (u, v, h) => P(x0 + sgn * (u * c - h * s), v, z0 + u * s + h * c);
  }
  const area = (pts) => pts.reduce((acc, p, i) => { const q = pts[(i + 1) % pts.length]; return acc + p[0] * q[1] - q[0] * p[1]; }, 0);

  // the load plate: a frame with a window over the processor
  const plateG = mk("g", {}, g);
  const plate = { sil: mk("path", { class: "sil" }, plateG), cr: mk("path", { class: "nf lo" }, plateG), a: tween(0), last: NaN };
  const pOut = rrect(0, -4, 48, 44, 3, 4), pIn = rrect(1, -3, 47, 43, 2, 4), pWin = rrect(11, 8, 35, 32, 3, 4);
  function drawPlate(a) {
    if (a === plate.last) return;
    plate.last = a;
    const f = hinged(HX, PZ, 1, a);
    const outer = hull(pOut.map((q) => f(q.u, q.v, 0)).concat(pOut.map((q) => f(q.u, q.v, PT))));
    let win = pWin.map((q) => f(q.u, q.v, PT));
    if (Math.sign(area(win)) === Math.sign(area(outer))) win = win.reverse();
    plate.sil.setAttribute("d", poly(outer) + poly(win));
    plate.cr.setAttribute("d", poly(pIn.map((q) => f(q.u, q.v, PT))));
    if (a > 30 && plateG.nextSibling !== chipG) g.insertBefore(plateG, chipG);
    if (a <= 30 && chipG.nextSibling !== plateG) chipG.after(plateG);
  }

  // the lever: a rod pivoting at its near end, with a tab at its far end
  const lever = { sil: mk("path", { class: "sil hi" }, g), a: tween(LREST), last: NaN };
  const rod = rrect(0, LY - 1.2, 50, LY + 1.2, 1.1, 4), tab = rrect(44, LY - 1.2, 50, LY + 5, 1.5, 4);
  function drawLever(a) {
    if (a === lever.last) return;
    lever.last = a;
    const f = hinged(LX, LZ, -1, a), pts = (ring) => ring.map((q) => f(q.u, q.v, 0)).concat(ring.map((q) => f(q.u, q.v, 1.6)));
    lever.sil.setAttribute("d", poly(hull(pts(rod))) + poly(hull(pts(tab))));
  }

  const B = register(stage, (_dt, now) => {
    drawPlate(tval(plate.a, now));
    drawLever(tval(lever.a, now));
    return !tdone(plate.a, now) || !tdone(lever.a, now);
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    return x > -20 && x < 62 && y > -20 && y < 62;
  }
  let on = null;
  function apply(o) {
    const now = performance.now();
    tset(lever.a, o ? Math.min(open, 80) : LREST, now, 0);
    tset(plate.a, o ? open : 0, now, o ? 160 : 0);
    read.textContent = o ? "open " + Math.round(open) : "rest";
    B.wake();
  }
  function setOn(o) { if (o === on) return; on = o; apply(o); }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = clamp(v, 70, 125); if (on) apply(true); }, destroy: bag.dispose };
}

hairline({
  name: "cpucooler",
  means: "A CPU socket: the pointer lifts the retention lever and swings the load plate open off the processor.",
  rules: [1, 3, 5, 6],
  range: [70, 100, 125],
  tour: [[204, 172], [204, 213], [204, 298], null],
  mount,
});
