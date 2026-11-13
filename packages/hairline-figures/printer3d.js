/**
 * 3D printer: an open box frame on a base, a print bed with a half-printed
 * vase on it, a gantry riding two top rails and a nozzle head on the gantry.
 * The pointer is where the nozzle should go: the head runs to the pointer's
 * x/y over the bed on springs, the gantry carrying it. At rest the head is
 * parked over the print, bright. The slider is how quickly it follows.
 *
 * The pattern: a continuous aim (spotlights); the hit is on the bed's plane.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, run, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 80, D = 80, H = 72, BZ = 12, M = 12, VR = 11, VH = 14, REST = [34, 38];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, H + 4], [W, 0, H + 4], [0, D, H + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 1.2, b = 0.6, parent = g) => { const [a, i] = rings(x0, y0, x1, y1, r, b); const s = solid(parent); put(s, prism(P, front, a, i, z0, z1)); return s; };
  box(-2, -2, W + 2, D + 2, 0, 6, 3, 1.4);
  box(0, 0, 5, 5, 6, H);
  box(W - 5, 0, W, 5, 6, H); box(0, D - 5, 5, D, 6, H);
  box(M - 4, M - 4, W - M + 4, D - M + 4, 6, 9, 2, 1);
  box(M - 6, M - 6, W - M + 6, D - M + 6, 9, BZ, 2, 1);
  const vase = circ(VR, 40), cx = REST[0] + 6, cy = REST[1] + 4;
  put(solid(g), prism(P, front, vase.map((q) => ({ ...q, u: q.u + cx, v: q.v + cy })), null, BZ, BZ + VH));
  const vr = vase.map((q) => ({ ...q, u: q.u + cx, v: q.v + cy }));
  mk("path", { class: "nf lo", d: [3, 6, 9, 12].map((z) => open(ringAt(P, run(vr, front), BZ + z))).join("") + poly(ringAt(P, circ(VR - 1.6, 40).map((q) => ({ ...q, u: q.u + cx, v: q.v + cy })), BZ + VH)) }, g);
  box(0, 0, W, 5, H, H + 4); box(0, 0, 5, D, H, H + 4);
  const gantry = solid(g), head = solid(g), nozzle = mk("path", { class: "sil" }, g);
  box(W - 5, 0, W, D, H, H + 4); box(0, D - 5, W, D, H, H + 4);
  box(W - 5, D - 5, W, D, 6, H);
  const sx = spring(REST[0], { k: 100 * value, c: 18 * Math.sqrt(value) }), sy = spring(REST[1], { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = "";
  function draw() {
    const key = sx.x.toFixed(2) + "," + sy.x.toFixed(2);
    if (key === last) return;
    last = key;
    const x = M + sx.x, y = M + sy.x;
    { const [a, i] = rings(4, y - 3, W - 4, y + 3, 1.2, 0.6); put(gantry, prism(P, front, a, i, H - 1, H + 5)); }
    { const [a, i] = rings(x - 6, y - 5, x + 6, y + 5, 2, 0.8); put(head, prism(P, front, a, i, H - 16, H + 7)); }
    nozzle.setAttribute("d", poly(hull(ringAt(P, circ(2.6, 12).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), H - 16).concat([P(x, y, H - 21)]))));
  }
  const B = register(stage, (dt) => { const a = stepS(sx, dt), b = stepS(sy, dt); draw(); return a || b; });
  bag.add(B.unregister);
  head.sil.classList.add("hi");
  let over = null;
  function retarget() {
    const [x, y] = over ?? REST;
    sx.t = x; sy.t = y;
    read.textContent = over ? `x ${Math.round(x)} y ${Math.round(y)}` : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], BZ), S = W - 2 * M;
      over = x < -10 || y < -10 || x > W + 10 || y > D + 10 ? null : [clamp(x - M, 0, S), clamp(y - M, 0, S)];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const s of [sx, sy]) { s.k = 100 * v; s.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "printer3d",
  means: "A frame 3D printer with a half-printed vase on its bed: the nozzle head runs to the pointer over the bed.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[150, 200], [200, 230], [250, 200], null],
  mount,
});
