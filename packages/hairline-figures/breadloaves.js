/**
 * Bread loaves: a bakery board with a hanging hole, and six loaves on it, a
 * long baguette at the back, a round boule with a cross cut, a bloomer with
 * slashes across it and three rolls. The pointer is a field: the loaves near
 * it rise and puff on their springs, the one under it most and bright. At
 * rest they are proved unevenly, the bloomer bright. The slider is the reach.
 *
 * The pattern: a field of springs (terrain); the hit unprojects onto each
 * loaf's own rest top and takes the nearest middle.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BT = 4, LIFT = 12, PUFF = 0.3, FAV = 2;
// cx, cy, half length, half width, height, cuts: [u0, v0, u1, v1] in the loaf's unit ellipse
const LOAVES = [
  [64, 13, 52, 6, 8, [[-0.7, 0.5, -0.45, -0.5], [-0.3, 0.5, -0.05, -0.5], [0.1, 0.5, 0.35, -0.5], [0.5, 0.5, 0.75, -0.5]]],
  [22, 44, 16, 16, 15, [[-0.55, 0, 0.55, 0], [0, -0.55, 0, 0.55]]],
  [64, 44, 22, 13, 13, [[-0.45, -0.6, -0.45, 0.6], [-0.15, -0.6, -0.15, 0.6], [0.15, -0.6, 0.15, 0.6], [0.45, -0.6, 0.45, 0.6]]],
  [102, 36, 8, 8, 8, [[-0.4, 0, 0.4, 0]]],
  [100, 58, 8, 7.5, 7.5, [[-0.4, 0, 0.4, 0]]],
  [118, 49, 7.5, 8, 8, [[-0.4, 0, 0.4, 0]]],
];
const REST = [0.12, 0.04, 0.4, 0, 0.22, 0.08];
const oval = (x, y, a, b, n = 32) => circ(1, n).map((q) => ({ ...q, u: x + q.u * Math.max(a, 0.05), v: y + q.v * Math.max(b, 0.05) }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[0, 0, 0], [132, 0, 0], [0, 70, 0], [132, 70, 0], [22, 44, BT + 15 * (1 + PUFF) + LIFT], [64, 13, BT + 8 * (1 + PUFF) + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [bo, bi] = rings(0, 0, 132, 70, 9, 1.6);
  const board = solid(g);
  put(board, prism(P, front, bo, bi, 0, BT));
  mk("path", { class: "nf lo", d: poly(ringAt(P, oval(126, 8, 2.4, 2.4, 20), BT)) }, board.g);

  const loaves = LOAVES.map(([x, y, a, b, h, cuts], k) => ({ k, x, y, a, b, h, cuts, sp: spring(REST[k]), last: NaN }));
  loaves.forEach((l) => { const grp = mk("g", {}, g); l.sil = mk("path", { class: "sil" }, grp); l.cr = mk("path", { class: "nf lo" }, grp); });

  function draw(l) {
    const f = l.sp.x;
    if (Math.abs(f - l.last) < 1e-4) return;
    l.last = f;
    const z = BT + f * LIFT, h = l.h * (1 + PUFF * f), s = 1 + 0.08 * f, a = l.a * s, b = l.b * s;
    const pts = ringAt(P, oval(l.x, l.y, a * 0.9, b * 0.9), z);
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, oval(l.x, l.y, a * Math.cos(t), b * Math.cos(t)), z + h * 0.15 + h * 0.85 * Math.sin(t))); }
    l.sil.setAttribute("d", poly(hull(pts)));
    const surf = (u, v) => P(l.x + u * a, l.y + v * b, z + h * 0.15 + h * 0.85 * Math.sqrt(Math.max(0, 1 - u * u - v * v)));
    l.cr.setAttribute("d", l.cuts.map(([u0, v0, u1, v1]) => open([0, 0.25, 0.5, 0.75, 1].map((t) => surf(u0 + (u1 - u0) * t, v0 + (v1 - v0) * t)))).join(""));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const l of loaves) { if (stepS(l.sp, dt)) m = true; draw(l); }
    return m;
  });
  bag.add(B.unregister);

  // the hit: each loaf tests the pointer on its own rest top, the nearest middle (in loaf sizes) wins
  let pt = null;
  function retarget() {
    const ds = loaves.map((l) => {
      if (!pt) return Infinity;
      const [wx, wy] = unproj(C, pt[0], pt[1], BT + REST[l.k] * LIFT + l.h * (1 + PUFF * REST[l.k]) * 0.8);
      return Math.hypot((wx - l.x) / (l.a + 3), (wy - l.y) / (l.b + 3));
    });
    let a = -1;
    ds.forEach((d, k) => { if (d < 1 && (a < 0 || d < ds[a])) a = k; });
    const [ox, oy] = pt ? unproj(C, pt[0], pt[1], BT) : [0, 0];
    loaves.forEach((l, k) => {
      const w = Math.hypot(ox - l.x, oy - l.y);
      l.sp.t = a < 0 ? REST[k] : k === a ? 1 : clamp(0.6 * Math.exp(-((w / reach) ** 2)), 0.05, 0.6);
      l.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "loaf " + (a + 1);
    B.wake();
  }
  retarget();
  bag.add(pointer(stage, { move: (p) => { pt = p; retarget(); }, leave: () => { pt = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "breadloaves",
  means: "Six loaves on a bakery board: the loaves near the pointer rise and puff, the one under it most and bright.",
  rules: [1, 3, 5, 9],
  range: [14, 30, 50],
  tour: [[116, 112], [232, 136], [260, 207], null],
  mount,
});
