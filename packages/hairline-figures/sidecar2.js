/**
 * Tuk-tuk: an auto rickshaw with a low tub, a short nose over its single
 * front wheel, two rear wheels and a canopy roof on four posts. The pointer
 * toward the near side tips the whole tuk-tuk up onto its far wheels, the
 * way they lean through a corner. At rest it sits almost level, canopy bright.
 */
const { Cam, circ, rings, fit, hull, poly, seg, proj, clamp, spring, stepS, disposer, mk, pointer, register, solid, unproj } = HL;

const WR = 8, YP = -5, REST = 0.04, MAX = 0.36;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-38, -6, 0], [40, 36, 0], [-38, 36, 60], [14, -6, 62], [-38, 20, 70], [14, 20, 70]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const fw = solid(g), rf = solid(g), tub = solid(g), nose = solid(g), rn = solid(g), posts = mk("path", { class: "sil nf" }, g), roof = solid(g);
  roof.sil.classList.add("hi");
  const [tr, ti] = rings(-34, 0, 22, 30, 7, 1.8), [nr, ni] = rings(16, 7, 38, 23, 6, 1.6), [or, oi] = rings(-37, -2, 15, 32, 6, 1.8);
  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const ca = Math.cos(a), sa = Math.sin(a);
    const T = (x, y, z) => P(x, YP + (y - YP) * ca - z * sa, (y - YP) * sa + z * ca);
    const blk = (s, ring, inner, z0, z1) => {
      const pts = [];
      for (const z of [z0, z1]) pts.push(...ring.map((q) => T(q.u, q.v, z)));
      s.sil.setAttribute("d", poly(hull(pts)));
      s.cr.setAttribute("d", poly(inner.map((q) => T(q.u, q.v, z1))));
    };
    const whl = (s, x, y0, y1) => {
      const pts = [];
      for (const y of [y0, y1]) pts.push(...circ(WR, 24).map((q) => T(x + q.u, y, WR + q.v)));
      s.sil.setAttribute("d", poly(hull(pts)));
      s.cr.setAttribute("d", poly(circ(3, 12).map((q) => T(x + q.u, y1, WR + q.v))));
    };
    whl(rf, -22, -4, 0);
    whl(fw, 32, 13, 17);
    blk(tub, tr, ti, 9, 27);
    blk(nose, nr, ni, 9, 36);
    whl(rn, -22, 30, 34);
    posts.setAttribute("d", [[-33, 1], [-33, 29], [12, 1], [12, 29]].map(([x, y]) => seg(T(x, y, 27), T(x, y, 56))).join(""));
    blk(roof, or, oi, 56, 61);
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function set(p) {
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x > -60 && x < 60 && y > -30 && y < 60) {
        const a = clamp(y / 40, 0, 1) * MAX * (0.3 + 0.7 * reach / 100);
        ang.t = a;
        read.textContent = Math.round((a * 180) / Math.PI) + "°";
        B.wake();
        return;
      }
    }
    ang.t = REST;
    read.textContent = "rest";
    B.wake();
  }
  set(null);
  draw(REST);
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "sidecar2",
  means: "A tuk-tuk under its canopy: it tips up onto its far wheels, as through a corner, the further the pointer moves to its near side.",
  rules: [1, 3, 4, 5],
  range: [0, 70, 100],
  tour: [[167, 260], [268, 209], [205, 240], null],
  mount,
});
