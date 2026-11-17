/**
 * Carpet sweeper: a low sweeper box on four wheels with its long handle,
 * the hinged lid over the dust pan on top. The pointer near the box tips
 * the lid open on its back hinge to show the pan inside. At rest the lid
 * is shut, bright. The slider is how far it opens.
 *
 * The pattern: one lid swinging on a hinge.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 84, D = 44, H = 16, WZ = 6, CZ = 0;
const disc = (x, y, r, n = 18) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, D + 8, WZ + H + D], [W, D + 8, WZ + H + D], [W / 2, -60, 95]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // handle, from the front face up and away
  const hb = [W / 2, 0, WZ + H / 2], ht = [W / 2, -58, 92];
  mk("path", { d: poly(hull(ringAt(P, disc(hb[0], hb[1], 2.4), hb[2]).concat(ringAt(P, disc(ht[0], ht[1], 2.4), ht[2])))), class: "sil" }, g);
  mk("path", { d: poly(hull(ringAt(P, disc(ht[0], ht[1], 4), ht[2] - 2).concat(ringAt(P, disc(ht[0] - 1, ht[1] - 4, 4), ht[2] + 8)))), class: "sil" }, g);
  for (const [x, y] of [[10, 0], [W - 10, 0], [10, D], [W - 10, D]]) {
    const pts = [];
    for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; for (const yy of [y - 2, y + 2]) pts.push(P(x + 5 * Math.cos(a), yy, WZ + 5 * Math.sin(a) - 0.5)); }
    mk("path", { d: poly(hull(pts)), class: "sil" }, g);
  }
  const [br, bi] = rings(0, 0, W, D, 6, 3);
  put(solid(g), prism(P, front, br, bi, WZ, WZ + H));
  const [ir] = rings(5, 5, W - 5, D - 5, 3, 1.5);
  mk("path", { d: poly(ir.map((q) => P(q.u, q.v, WZ + H))), class: "nf lo" }, g);
  const lid = mk("path", { class: "sil hi" }, g), lc = mk("path", { class: "nf" }, g);
  const a = tween(0);
  let last = NaN;

  function draw(f) {
    if (f === last) return;
    last = f;
    const ang = f * 1.75, T = WZ + H;
    const L = (x, y, dz) => { const r = D - y, c = Math.cos(ang), s = Math.sin(ang); return P(x, D - r * c - dz * s, T + r * s + dz * c); };
    const pts = [];
    for (const x of [1, W - 1]) for (const y of [1, D]) for (const dz of [0, 3]) pts.push(L(x, y, dz));
    lid.setAttribute("d", poly(hull(pts)));
    lc.setAttribute("d", poly([L(1, 1, 3), L(W - 1, 1, 3), L(W - 1, D, 3), L(1, D, 3)]) + " " + poly([L(W / 2 - 8, 6, 3), L(W / 2 + 8, 6, 3)]));
  }

  const B = register(stage, (_dt, now) => { draw(tval(a, now)); return !tdone(a, now); });
  bag.add(B.unregister);

  const c = P(W / 2, D / 2, WZ + H);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(a, on ? reach : 0, performance.now(), 0);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - c[0], sy - c[1]) < 95), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "carpetbeater",
  means: "A carpet sweeper on four wheels with its long handle: near the pointer its hinged lid tips open to show the dust pan.",
  rules: [1, 3, 5, 6],
  range: [0.5, 1, 1],
  tour: [[193, 211], [150, 180], [240, 190], null],
  mount,
});
