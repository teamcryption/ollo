/**
 * Map roll: a wall map in its roller case, pulled down by its bottom rod. The
 * pointer's height on the sheet's plane is how far the map comes down; the
 * sheet slides on one spring and its fold lines appear as it unrolls. At rest
 * it hangs half down, the rod bright.
 *
 * The pattern: a continuous slide (one spring on a length); the hit is the
 * sheet's own plane, which never moves.
 */
const {
  Cam, fit, proj, poly, open, hull, fillet, clamp, spring, stepS,
  disposer, flatDot, mk, place, pointer, register,
} = HL;

const X0 = -46, X1 = 46, TOP = 96, R = 6, Y = 0, LMIN = 12, LMAX = 84, REST = 50;
const FOLDS = [16, 32, 48, 64, 80];
const COAST = [[-30, 20], [-14, 14], [-6, 26], [-18, 38], [-32, 34]];
const ISLE = [[8, 40], [26, 30], [34, 46], [20, 62], [10, 56]];

function mount({ stage, svg, read }) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[X0 - 4, Y, TOP + R + 3], [X1 + 4, Y, TOP + R + 3], [X0, Y, TOP - LMAX - 4], [X1, Y, TOP - LMAX - 4]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const Pw = (x, z) => P(x, Y + R - 1, z);
  const sheet = mk("path", { class: "sil", d: "" }, g);
  const art = mk("path", { class: "nf lo", d: "" }, g);
  const folds = mk("path", { class: "nf dash", d: "" }, g);
  const rod = mk("path", { class: "sil hi", d: "" }, g);
  const ring = flatDot(g, C, 1.8, "dot");
  // the roller case: a horizontal round bar, hull of its two end circles, then its end caps
  const end = (x, r) => Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; return P(x, Y + r * Math.cos(a), TOP + 2 + r * Math.sin(a)); });
  mk("path", { class: "sil", d: poly(hull(end(X0 - 3, R).concat(end(X1 + 3, R)))) }, g);
  mk("path", { class: "nf lo", d: poly(end(X1 + 3, R)) + poly(end(X1 + 3, R - 2.4)) }, g);
  mk("path", { class: "nf lo", d: open([P(X0 - 1, Y + R * 0.7, TOP + 2 - R * 0.7), P(X1 + 1, Y + R * 0.7, TOP + 2 - R * 0.7)]) }, g);

  const o = Pw(0, 0), ex = Pw(1, 0), ez = Pw(0, 1);
  const a = ex[0] - o[0], b = ez[0] - o[0], c = ex[1] - o[1], d = ez[1] - o[1], det = a * d - b * c;
  const onSheet = (sx, sy) => { const u = sx - o[0], v = sy - o[1]; return [(d * u - b * v) / det, (a * v - c * u) / det]; };

  const sp = spring(REST);
  let drawn = NaN;
  function draw() {
    const len = sp.x;
    if (Math.abs(len - drawn) < 1e-3) return;
    drawn = len;
    const zb = TOP - len;
    sheet.setAttribute("d", poly(fillet([[X0, TOP], [X1, TOP], [X1, zb], [X0, zb]], [0.5, 0.5, 2, 2]).map(([x, z]) => Pw(x, z))));
    const vis = (pts) => pts.every(([, z]) => z < len - 3) ? poly(fillet(pts, pts.map(() => 4)).map(([x, z]) => Pw(x, TOP - z))) : "";
    art.setAttribute("d", vis(COAST) + vis(ISLE));
    folds.setAttribute("d", FOLDS.filter((f) => f < len - 2).map((f) => open([Pw(X0 + 3, TOP - f), Pw(X1 - 3, TOP - f)])).join(""));
    rod.setAttribute("d", poly(fillet([[X0 - 3, zb + 1.6], [X1 + 3, zb + 1.6], [X1 + 3, zb - 1.6], [X0 - 3, zb - 1.6]], [1.2, 1.2, 1.2, 1.2]).map(([x, z]) => P(x, Y + R, z))));
    place(ring, P(0, Y + R, zb - 5));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function pull(z) {
    sp.t = z == null ? REST : clamp(TOP - z, LMIN, LMAX);
    read.textContent = z == null ? "rest" : Math.round((sp.t / LMAX) * 100) + "%";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (s) => {
      const [x, z] = onSheet(s[0], s[1]);
      pull(x < X0 - 16 || x > X1 + 16 || z > TOP + 12 || z < TOP - LMAX - 16 ? null : z);
    },
    leave: () => pull(null),
  }));
  bag.add(() => svg.replaceChildren());
  pull(null);
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "globe2",
  means: "A pull-down wall map in its roller case: the map unrolls to the pointer's height, its fold lines showing as it comes down.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[233, 259], [135, 62], [265, 227], null],
  mount,
});
