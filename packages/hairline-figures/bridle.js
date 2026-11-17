/**
 * Grooming box: a stable tote for brushes and picks, with a hinged lid on
 * its back edge and a latch tab at the front. The pointer over the box lifts
 * the lid on a spring, further the more to the right it stands. At rest the
 * lid sits a little ajar, bright. The slider is how far the lid can open.
 *
 * The pattern: a lid that opens.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rad, rings, ringAt, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 92, D = 52, H = 36, LT = 4, REST = 24;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, -LT, H + D + 2], [W, -LT, H + D + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [r0, i0] = rings(0, 0, W, D, 5, 2);
  put(solid(g), prism(P, front, r0, i0, 0, H));
  const [r1] = rings(4, 4, W - 4, D - 4, 3, 1);
  mk("path", { d: poly(ringAt(P, r1, H)), class: "nf lo" }, g);
  // brush backs peeking above the rim
  const [b1, bi1] = rings(14, 12, 44, 26, 5, 1.2);
  put(solid(g), prism(P, front, b1, bi1, H - 6, H + 3));
  // front latch tab
  const lid = mk("path", { class: "sil hi" }, g), top = mk("path", { class: "nf lo" }, g), tab = mk("path", { class: "nf" }, g);
  const ang = spring(REST, { k: 90, c: 15 });
  let last = NaN;

  function rot(a) {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    return (x, y, z) => { const dz = z - H; return P(x, y * c - dz * s, H + y * s + dz * c); };
  }
  function draw(a) {
    if (a === last) return;
    last = a;
    const R = rot(a), pts = [];
    for (const x of [-2, W + 2]) for (const y of [0, D + 2]) for (const z of [H, H + LT]) pts.push(R(x, y, z));
    lid.setAttribute("d", poly(hull(pts)));
    top.setAttribute("d", poly([R(2, 3, H + LT), R(W - 2, 3, H + LT), R(W - 2, D - 1, H + LT), R(2, D - 1, H + LT)]));
    const tp = [];
    for (const x of [W / 2 - 8, W / 2 + 8]) for (const y of [D + 2, D + 4]) for (const z of [H - 8, H + LT]) tp.push(R(x, y, z));
    tab.setAttribute("d", poly(hull(tp)));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  const lo = P(0, D, 0), hi = P(W, 0, H);
  let state = -1;
  function move([sx, sy]) {
    const inside = sx > lo[0] - 20 && sx < hi[0] + 20 && sy > 30 && sy < lo[1] + 30;
    if (!inside) return leave();
    const t = clamp((sx - lo[0]) / (hi[0] - lo[0]), 0, 1);
    ang.t = max * (0.7 + 0.3 * t);
    read.textContent = Math.round(ang.t) + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  draw(REST);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "bridle",
  means: "A horse grooming box: the pointer over it swings the hinged lid up on a spring; at rest it sits a little ajar.",
  rules: [1, 3, 5, 8],
  range: [60, 100, 115],
  tour: [[171, 159], [235, 150], [130, 165], null],
  mount,
});
