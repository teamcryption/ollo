/**
 * Caravan: a towed caravan on one axle, with a door and window on its near
 * side and an A-frame drawbar out front. The pointer along the caravan pitches
 * the whole body about its axle, lifting or dropping the hitch. At rest the
 * nose dips a little toward the ground, the drawbar bright.
 */
const { Cam, circ, rrect, rings, fit, fillet, hull, poly, proj, clamp, spring, stepS, disposer, mk, pointer, register, solid, unproj } = HL;

const L = 44, W = 32, Z0 = 12, Z1 = 50, AZ = 9, REST = -0.07, MAX = 0.2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-L, 0, 0], [L + 26, W, 0], [-L, W, Z1 + 10], [L, 0, Z1 + 10], [L + 26, W / 2, 26]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const wheel = (y0, y1) => {
    const pts = [];
    for (const y of [y0, y1]) pts.push(...circ(AZ, 28).map((q) => P(q.u, y, AZ + q.v)));
    const s = solid(g);
    s.sil.setAttribute("d", poly(hull(pts)));
    s.cr.setAttribute("d", y1 > W ? poly(circ(3.5, 14).map((q) => P(q.u, y1, AZ + q.v))) : "");
  };
  wheel(-5, -1);
  const body = solid(g), bar = solid(g);
  bar.sil.classList.add("hi");
  const marks = mk("path", { class: "nf lo" }, g);
  wheel(W + 1, W + 5);
  const [ring, inner] = rings(-L, 0, L, W, 9, 2);
  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const T = (x, y, z) => { const dz = z - AZ; return P(x * Math.cos(a) - dz * Math.sin(a), y, AZ + x * Math.sin(a) + dz * Math.cos(a)); };
    const bp = [];
    for (const z of [Z0, Z1]) bp.push(...ring.map((q) => T(q.u, q.v, z)));
    body.sil.setAttribute("d", poly(hull(bp)));
    body.cr.setAttribute("d", poly(inner.map((q) => T(q.u, q.v, Z1))));
    const face = (x0, x1, z0, z1, r) => poly(fillet([T(x0, W, z0), T(x1, W, z0), T(x1, W, z1), T(x0, W, z1)], [r, r, r, r]));
    marks.setAttribute("d", face(8, 22, Z0 + 3, Z1 - 6, 2) + face(11, 19, 34, 41, 1.5) + face(-34, -6, 28, 41, 2.5) + face(L - 14, L - 4, 30, 40, 2));
    const fp = [];
    for (const [x, y] of [[L - 2, 6], [L - 2, W - 6], [L + 22, W / 2 - 1.5], [L + 22, W / 2 + 1.5]]) for (const z of [Z0 - 1, Z0 + 2]) fp.push(T(x, y, z));
    for (const q of circ(2.5, 10)) fp.push(T(L + 24 + q.u, W / 2, Z0 + 2 + q.v));
    bar.sil.setAttribute("d", poly(hull(fp)));
    bar.cr.setAttribute("d", poly(circ(1.6, 10).map((q) => T(L + 24 + q.u, W / 2, Z0 + 2 + q.v))));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function set(p) {
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x > -L - 20 && x < L + 40 && y > -25 && y < W + 25) {
        const t = clamp(x / (L + 10), -1, 1), a = t * MAX * (0.3 + 0.7 * reach / 100);
        ang.t = a;
        const d = Math.round((a * 180) / Math.PI);
        read.textContent = (d > 0 ? "+" : "") + d + "°";
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
  name: "campervan2",
  means: "A towed caravan on one axle: the body pitches about its wheels, raising or lowering the drawbar hitch as the pointer runs along it.",
  rules: [1, 3, 4, 5],
  range: [0, 70, 100],
  tour: [[289, 251], [111, 162], [220, 215], null],
  mount,
});
