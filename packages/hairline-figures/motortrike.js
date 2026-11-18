/**
 * Motor trike: two wide-set rear wheels under a rounded rear body, a long
 * tank tube and a single front wheel on a raked fork with wide bars. The
 * pointer to one side of the trike steers the front wheel, fork, lamp and
 * bars round the head toward it. At rest the bars turn a little, bright.
 */
const { Cam, circ, rings, prism, facing, fit, hull, poly, proj, clamp, spring, stepS, disposer, mk, pointer, register, solid, put, unproj } = HL;

const R = 12, HX = 27, REST = 0.25, MAX = 0.75, SC = 3.1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, SC);
  fit(C, [[-44, -24, 0], [46, 24, 0], [-44, 24, 0], [46, -24, 0], [24, -16, 46], [24, 16, 46]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const tube = (s, T, a, b, r) => {
    const A = T(...a), B = T(...b), pts = [];
    for (const q of circ(r * SC, 10)) pts.push([A[0] + q.u, A[1] + q.v], [B[0] + q.u, B[1] + q.v]);
    s.sil.setAttribute("d", poly(hull(pts)));
  };
  const wheel = (s, T, cx, y0, y1, yo) => {
    const pts = [];
    for (const y of [y0, y1]) pts.push(...circ(R, 32).map((q) => T(cx + q.u, y, R + q.v)));
    s.sil.setAttribute("d", poly(hull(pts)));
    s.cr.setAttribute("d", poly(circ(R - 3, 24).map((q) => T(cx + q.u, yo, R + q.v))) + poly(circ(3, 12).map((q) => T(cx + q.u, yo, R + q.v))));
  };
  wheel(solid(g), P, -30, -24, -16, -24);
  const [ring, inner] = rings(-42, -15, -16, 15, 7, 1.5);
  put(solid(g), prism(P, front, ring, inner, 9, 24));
  wheel(solid(g), P, -30, 16, 24, 24);
  const [sr, si] = rings(-26, -8, -10, 8, 4, 1.2);
  put(solid(g), prism(P, front, sr, si, 24, 28));
  tube(solid(g), P, [-16, 0, 16], [HX - 3, 0, 31], 3.4);
  const fr = { w: solid(g), fork: solid(g), lamp: solid(g), bar: solid(g) };
  fr.bar.sil.classList.add("hi");
  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a);
    const T = (x, y, z) => P(HX + (x - HX) * c - y * s, (x - HX) * s + y * c, z);
    wheel(fr.w, T, 34, -3, 3, 3);
    tube(fr.fork, T, [34, 0, R], [HX, 0, 36], 1.6);
    const lp = [];
    for (const x of [HX + 3, HX + 6]) lp.push(...circ(5, 16).map((q) => T(x, q.u, 33 + q.v)));
    fr.lamp.sil.setAttribute("d", poly(hull(lp)));
    fr.lamp.cr.setAttribute("d", poly(circ(3.4, 16).map((q) => T(HX + 6, q.u, 33 + q.v))));
    const pts = [], ends = [T(HX - 6, -16, 44), T(HX - 2, -9, 40), T(HX - 2, 9, 40), T(HX - 6, 16, 44)];
    for (const E of ends) for (const q of circ(1.3 * SC, 8)) pts.push([E[0] + q.u, E[1] + q.v]);
    fr.bar.sil.setAttribute("d", poly(hull(pts.slice(0, 16))) + poly(hull(pts.slice(8, 24))) + poly(hull(pts.slice(16, 32))));
  }
  const L = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(L.unregister);
  function set(p) {
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x > -50 && x < 60 && Math.abs(y) < 45) {
        const a = clamp(y / 24, -1, 1) * MAX * (0.3 + 0.7 * reach / 100);
        ang.t = a;
        const d = Math.round((a * 180) / Math.PI);
        read.textContent = (d > 0 ? "R " : "L ") + Math.abs(d) + "°";
        L.wake();
        return;
      }
    }
    ang.t = REST;
    read.textContent = "rest";
    L.wake();
  }
  set(null);
  draw(REST);
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "motortrike",
  means: "A motor trike: the front wheel, fork, lamp and bars steer round the head toward the side of the trike the pointer is on.",
  rules: [1, 3, 4, 5],
  range: [0, 70, 100],
  tour: [[338, 189], [207, 255], [262, 222], null],
  mount,
});
