/**
 * Hoverboard: two wheels on one axle, each with its own foot platform and
 * fender. The pointer over one half tilts that platform forward or back about
 * the axle, the other half follows a little. At rest the near half leans
 * forward, bright.
 */
const { Cam, circ, rrect, fit, hull, poly, proj, clamp, spring, stepS, disposer, mk, pointer, register, solid, unproj } = HL;

const R = 11, MAX = 0.55, REST = [-0.06, 0.2];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.6);
  fit(C, [[-20, -36, 0], [20, 36, 0], [-14, -36, 2 * R + 10], [14, 36, 2 * R + 10]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const wheel = (s) => {
    const pts = [];
    for (const y of [s * 25, s * 33]) pts.push(...circ(R, 32).map((q) => P(q.u, y, R + q.v)));
    const w = solid(g);
    w.sil.setAttribute("d", poly(hull(pts)));
    const yo = s > 0 ? s * 33 : s * 25;
    w.cr.setAttribute("d", poly(circ(R - 3, 24).map((q) => P(q.u, yo, R + q.v))) + poly(circ(3, 12).map((q) => P(q.u, yo, R + q.v))));
  };
  const halves = [];
  wheel(-1);
  halves.push({ s: -1, b: solid(g), sp: spring(REST[0]), last: NaN });
  halves.push({ s: 1, b: solid(g), sp: spring(REST[1]), last: NaN });
  wheel(1);
  halves[1].b.sil.classList.add("hi");
  const rot = (a) => (x, y, z) => { const dz = z - R; return P(x * Math.cos(a) + dz * Math.sin(a), y, R - x * Math.sin(a) + dz * Math.cos(a)); };
  function draw(h) {
    const a = h.sp.x;
    if (a === h.last) return;
    h.last = a;
    const T = rot(a), s = h.s, pts = [];
    const y0 = Math.min(s * 2, s * 24), y1 = Math.max(s * 2, s * 24);
    for (const z of [R - 4, R + 3]) pts.push(...rrect(-10, y0, 10, y1, 5, 4).map((q) => T(q.u, q.v, z)));
    for (const y of [s * 22, s * 30]) pts.push(...circ(R + 3, 32).filter((q) => q.v > 0).map((q) => T(q.u, y, R + q.v)));
    h.b.sil.setAttribute("d", poly(hull(pts)));
    const p0 = Math.min(s * 5, s * 20), p1 = Math.max(s * 5, s * 20);
    h.b.cr.setAttribute("d", poly(rrect(-7, p0, 7, p1, 3, 4).map((q) => T(q.u, q.v, R + 3))));
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const h of halves) { m = stepS(h.sp, dt) || m; draw(h); }
    return m;
  });
  bag.add(B.unregister);
  function set(p) {
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], R);
      if (Math.abs(x) < 40 && Math.abs(y) < 44) {
        const i = y < 0 ? 0 : 1, t = clamp(x / 12, -1, 1), a = t * MAX * (0.25 + 0.75 * reach / 100);
        halves.forEach((h, j) => { h.sp.t = j === i ? a : a * 0.3; h.b.sil.classList.toggle("hi", j === i); });
        const d = Math.round((a * 180) / Math.PI);
        read.textContent = (i ? "R " : "L ") + (d > 0 ? "+" : "") + d + "°";
        B.wake();
        return;
      }
    }
    halves.forEach((h, j) => { h.sp.t = REST[j]; h.b.sil.classList.toggle("hi", j === 1); });
    read.textContent = "rest";
    B.wake();
  }
  set(null);
  halves.forEach(draw);
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "hoverboard",
  means: "A hoverboard: the pointer over one foot platform tilts it forward or back about the axle, and the other half follows a little.",
  rules: [1, 3, 4, 5],
  range: [0, 70, 100],
  tour: [[261, 163], [190, 199], [214, 176], null],
  mount,
});
