/**
 * Grab unloader: a portal crane on the quay, its long boom out over a ship's
 * hold, a trolley on the boom and a clamshell grab hanging from it on two
 * cables. At rest the grab hangs high, jaws barely parted, bright. The
 * pointer over the hold runs the trolley to it, lowers the grab and swings
 * its two jaws wide open. The slider is how wide the jaws open.
 *
 * The pattern: a continuous aim (spotlights' spring); the hit is on the
 * ground plane, which never moves.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rings, seg, unproj, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BZ = 104, REST = { s: 30, h: 86, a: 10 }, JW = 13, K = 1.45;
const JAW = [[0, 0], [-7, -2], [-14, -8], [-16, -17], [-13, -24], [-6, -27], [0, -27]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let wide = value;
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[-96, -30, -4], [96, 30, -4], [96, -30, -4], [-96, 30, -4], [-82, 0, 134], [86, 0, BZ + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 2, b = 1, parent = g) => { const [o, i] = rings(x0, y0, x1, y1, r, b); return put(solid(parent), prism(P, front, o, i, z0, z1)); };
  box(-96, -30, 2, 30, -4, 0, 3, 1.5);
  box(14, -28, 96, 28, -4, 18, 10, 5);
  for (const [x, y] of [[-58, -18], [-28, -18], [-58, 18], [-28, 18]]) box(x - 2.5, y - 2.5, x + 2.5, y + 2.5, 0, BZ, 1.2, 0.6);
  box(-92, -6, 90, 6, BZ, BZ + 8, 2, 1);
  box(-88, -14, -56, 14, BZ + 8, 134, 3, 1.5);
  const mov = mk("g", {}, g);
  const st = { s: spring(REST.s), h: spring(REST.h), a: spring(REST.a) };
  let last = "";

  function jaw(s, h, sign, a) {
    const t = rad(a) * sign, c = Math.cos(t), sn = Math.sin(t), pts = [];
    for (const [u0, z0] of JAW) {
      const u = sign * -u0 * K, uu = u * c + z0 * K * sn, zz = -u * sn + z0 * K * c;
      for (const y of [-JW, JW]) pts.push(P(s + uu, y, h + zz));
    }
    return pts;
  }

  function draw() {
    const s = st.s.x, h = st.h.x, a = st.a.x, key = [s, h, a].map((v) => v.toFixed(2)).join();
    if (key === last) return;
    last = key;
    mov.replaceChildren();
    box(s - 7, -8, s + 7, 8, BZ + 8, BZ + 14, 2, 1, mov);
    mk("path", { class: "nf", d: seg(P(s, -3, BZ), P(s, -3, h + 12)) + seg(P(s, 3, BZ), P(s, 3, h + 12)) }, mov);
    const L = jaw(s, h, -1, a), R = jaw(s, h, 1, a);
    // struts from the head to each jaw's outer shoulder
    mk("path", { class: "nf lo", d: seg(P(s, 0, h + 12), L[4]) + seg(P(s, 0, h + 12), R[4]) }, mov);
    for (const pts of [L, R]) {
      mk("path", { class: "sil hi", d: poly(hull(pts)) }, mov);
      mk("path", { class: "nf lo", d: poly(hull(pts.filter((_, i) => i % 2 === 1))) }, mov);
    }
    box(s - 5, -6, s + 5, 6, h, h + 12, 2, 1, mov);
  }

  const B = register(stage, (dt) => { let m = false; for (const k in st) m = stepS(st[k], dt) || m; draw(); return m; });
  bag.add(B.unregister);

  function aim(p) {
    let x = null;
    if (p) { const [wx, wy] = unproj(C, p[0], p[1], 0); if (wx > 0 && wx < 110 && Math.abs(wy) < 50) x = wx; }
    if (x === null) { st.s.t = REST.s; st.h.t = REST.h; st.a.t = REST.a; read.textContent = "rest"; }
    else { st.s.t = clamp(x, 26, 80); st.h.t = 62; st.a.t = 10 + 55 * wide; read.textContent = Math.round(st.a.t) + "°"; }
    B.wake();
  }
  aim(null);
  draw();
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { wide = v; }, destroy: bag.dispose };
}

hairline({
  name: "grabunloader",
  means: "A grab unloader over a ship's hold: the pointer runs the trolley out, lowers the clamshell grab and swings its jaws open.",
  rules: [1, 3, 4, 5],
  range: [0.2, 1, 1],
  tour: [[274, 276], [248, 236], [269, 300], null],
  mount,
});
