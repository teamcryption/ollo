/**
 * Printer: an office printer, a rounded body with a scanner lid on top, an
 * output slot on the front over a tray, and a paper drawer at the foot. Five
 * sheets lie fanned in the tray. As the pointer moves along the front, the
 * sheets nearest its place slide further out of the slot, each on its own
 * spring; low on the front, the paper drawer opens instead. At rest the top
 * sheet is bright. The slider is how far the sheets reach.
 *
 * The pattern: a continuous place along a row (springs), plus one discrete
 * part (a tween); the hit is on the front face's fixed plane.
 */
const {
  Cam, clamp, facing, fillet, fit, poly, prism, proj, rings, ringAt, rrect, seg, spring, stepS, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 64, Y1 = 44, H = 40, N = 5, TZ = 26, SX0 = 12, SX1 = 52, TR = 14;
const REST = [9, 12, 7, 11, 13], DZ = 12, DOUT = 16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[0, 0, 0], [X1, Y1 + 34, 0], [X1, 0, 0], [0, Y1 + 34, 0], [0, 0, H + 5], [X1, 0, H + 5]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the body, the scanner lid on it, and the marks on the front: the output slot and the drawer's seam
  const [br, bi] = rings(0, 0, X1, Y1, 5, 1.6);
  const body = solid(g);
  put(body, prism(P, front, br, bi, 0, H));
  const [lr, li] = rings(1.5, 1.5, X1 - 1.5, Y1 - 4, 4, 1.4);
  put(solid(g), prism(P, front, lr, li, H, H + 4));
  const face = (x0, z0, x1, z1, r) => poly(fillet([[x0, z0], [x1, z0], [x1, z1], [x0, z1]], [r, r, r, r], 3).map(([x, z]) => P(x, Y1, z)));
  mk("path", { class: "nf lo", d: face(SX0 - 2, TZ + 1.5, SX1 + 2, TZ + 5, 1.2) + seg(P(X1 - 14, Y1, H - 6), P(X1 - 6, Y1, H - 6)) }, g);

  // the drawer: a box sliding out along y, with its paper showing once it is out
  const drawer = solid(g), paper = mk("path", { class: "nf lo" }, drawer.g), handle = mk("path", { class: "nf lo" }, drawer.g);
  const dz = tween(0);
  let dLast = NaN;
  function drawDrawer(o) {
    if (o === dLast) return;
    dLast = o;
    const yf = Y1 + 0.8 + o, [r, i] = rings(5, Y1, X1 - 5, yf, 1.2, 0.6);
    put(drawer, prism(P, front, r, i, 2, DZ));
    paper.setAttribute("d", o > 4 ? poly(ringAt(P, rrect(9, Y1 + 1.5, X1 - 9, yf - 1.5, 1, 3), DZ)) : "");
    handle.setAttribute("d", seg(P(X1 / 2 - 7, yf, DZ - 3), P(X1 / 2 + 7, yf, DZ - 3)));
  }

  // the tray under the slot, then the sheets, bottom to top
  const [tr, ti] = rings(SX0 - 3, Y1, SX1 + 3, Y1 + TR, 1.5, 0.8);
  put(solid(g), prism(P, front, tr, ti, TZ - 1.4, TZ));
  const sheets = REST.map((e, k) => ({ k, el: mk("path", { class: "sil" }, g), sp: spring(e, { eps: 0.02 }), last: NaN }));
  function drawSheet(s) {
    const e = Math.round(s.sp.x * 100) / 100;
    if (e === s.last) return;
    s.last = e;
    const z = TZ + 0.4 + s.k * 0.9;
    s.el.setAttribute("d", poly(fillet([[SX0, Y1], [SX1, Y1], [SX1, Y1 + e], [SX0, Y1 + e]], [0, 0, 1.2, 1.2], 3).map(([x, y]) => P(x, y, z))));
  }

  const B = register(stage, (dt, now) => {
    let moving = !tdone(dz, now);
    drawDrawer(tval(dz, now));
    for (const s of sheets) { if (stepS(s.sp, dt)) moving = true; drawSheet(s); }
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the pointer on the front face's plane y = Y1, solved for x along the printer and z up it
  const O = P(0, Y1, 0), ex = P(1, Y1, 0), ez = P(0, Y1, 1);
  const a = ex[0] - O[0], b = ez[0] - O[0], c = ex[1] - O[1], d = ez[1] - O[1], det = a * d - b * c;
  function hit([sx, sy]) {
    const u = sx - O[0], v = sy - O[1], x = (u * d - b * v) / det, z = (a * v - c * u) / det;
    if (x < -2 || x > X1 + 2 || z < 0 || z > H + 20) return null;
    return z < DZ ? "drawer" : clamp((x - SX0) / (SX1 - SX0), 0, 1);
  }

  let act = null, top = -2;
  function setActive(h) {
    const now = performance.now();
    act = h;
    const c0 = typeof h === "number" ? h * (N - 1) : -1;
    sheets.forEach((s, k) => {
      const f = c0 < 0 ? 0 : Math.max(0.12, 1 - Math.abs(N - 1 - k - c0) * 0.42);
      s.sp.t = REST[k] + (16 + 16 * reach) * f;
    });
    const pick = c0 < 0 ? (h === "drawer" ? -1 : 0) : Math.round(c0);
    if (pick !== top) {
      top = pick;
      sheets.forEach((s, k) => s.el.classList.toggle("hi", N - 1 - k === pick));
    }
    drawer.sil.classList.toggle("hi", h === "drawer");
    tset(dz, h === "drawer" ? DOUT : 0, now, 0);
    read.textContent = h === null ? "rest" : h === "drawer" ? "drawer" : "sheet " + (Math.round(c0) + 1);
    B.wake();
  }
  setActive(null);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; setActive(act); }, destroy: bag.dispose };
}

hairline({
  name: "printer",
  means: "An office printer: sheets slide out of the slot where the pointer runs along it; low on the front, the paper drawer opens.",
  rules: [1, 3, 5, 8],
  range: [0, 0.5, 1],
  tour: [[154, 135], [226, 171], [190, 207], null],
  mount,
});
