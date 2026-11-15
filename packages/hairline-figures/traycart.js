/**
 * Ice machine: a hotel corridor ice machine on short feet, a vent grille
 * up top and a bin below behind a door hinged along its foot, ice cubes
 * heaped inside with a scoop hooked on the wall of the bin. The pointer over
 * the machine tips the bin door down and out on its hinge; the further down
 * the pointer, the further it opens. At rest the door stands a crack ajar,
 * bright. The slider is how far it may open.
 *
 * The pattern: one part swinging on a hinge, following the pointer.
 */
const {
  Cam, clamp, fit, facing, fillet, hull, lerp, poly, prism, proj, rings, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 70, D = 56, Z0 = 6, Z1 = 128, BZ0 = 14, BZ1 = 70, REST = 12, T = 2.4;

function mount({ stage, svg, read }, value) {
  let reach = value;
  const bag = disposer();
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[0, 0, 0], [W, 0, Z1], [W, D + 60, BZ0], [0, D + 60, BZ0], [W, D, 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const [x, y] of [[6, 6], [W - 6, 6], [6, D - 6], [W - 6, D - 6]]) {
    const [fr, fi] = rings(x - 3, y - 3, x + 3, y + 3, 2, 0.8);
    put(solid(g), prism(P, front, fr, fi, 0, Z0));
  }
  const [br, bi] = rings(0, 0, W, D, 6, 2);
  put(solid(g), prism(P, front, br, bi, Z0, Z1));
  const fp = (pts) => pts.map(([x, z]) => P(x, D, z));
  // the vent grille and the bin's opening
  for (let i = 0; i < 5; i++) mk("path", { d: poly(fillet(fp([[12, 92 + i * 6], [W - 12, 92 + i * 6], [W - 12, 94.5 + i * 6], [12, 94.5 + i * 6]]), [1, 1, 1, 1])), class: "nf lo" }, g);
  mk("path", { d: poly(fillet(fp([[6, BZ0], [W - 6, BZ0], [W - 6, BZ1], [6, BZ1]]), [3, 3, 3, 3])), class: "nf lo" }, g);
  // the heap of cubes and the scoop hooked on the bin's wall
  for (const [x, z, s] of [[12, 18, 11], [24, 18, 11], [36, 18, 11], [48, 18, 11], [18, 29, 10], [30, 29, 10], [42, 29, 10], [26, 39, 9], [37, 39, 9]])
    mk("path", { d: poly(fillet(fp([[x, z], [x + s, z], [x + s, z + s], [x, z + s]]), [2.5, 2.5, 2.5, 2.5])), class: "nf" }, g);
  mk("path", { d: poly(fillet(fp([[50, 36], [62, 36], [62, 52], [50, 52]]), [4, 4, 4, 4])), class: "nf" }, g);
  mk("path", { d: poly(fillet(fp([[54, 52], [58, 52], [58, 66], [54, 66]]), [1.5, 1.5, 1.5, 1.5])), class: "nf" }, g);

  const dg = mk("g", {}, g);
  const ds = mk("path", { class: "sil hi" }, dg), df = mk("path", { class: "nf lo" }, dg), dh = mk("path", { class: "nf" }, dg);
  const sp = spring(REST);
  let last = NaN;
  // a point on the door: u across, h up from the hinge, o out along its normal
  const at = (a, u, h, o) => {
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    return P(u, D + 0.4 + h * s + o * c, BZ0 - 4 + h * c - o * s);
  };
  const HD = BZ1 + 4 - (BZ0 - 4);
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const o of [0, T]) for (const [u, h] of [[2, 0], [W - 2, 0], [W - 2, HD], [2, HD]]) pts.push(at(a, u, h, o));
    const hl = hull(pts);
    ds.setAttribute("d", poly(fillet(hl, hl.map(() => 3))));
    const show = a < 88;
    df.setAttribute("d", show ? poly(fillet([[6, 4], [W - 6, 4], [W - 6, HD - 4], [6, HD - 4]].map(([u, h]) => at(a, u, h, T)), [3, 3, 3, 3])) : "");
    dh.setAttribute("d", show ? poly(fillet([[W / 2 - 14, HD - 12], [W / 2 + 14, HD - 12], [W / 2 + 14, HD - 8], [W / 2 - 14, HD - 8]].map(([u, h]) => at(a, u, h, T + 0.8)), [1.5, 1.5, 1.5, 1.5])) : "");
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  const yTop = P(W / 2, D, Z1)[1], yLow = P(W / 2, D, BZ0)[1];
  function move([sx, sy]) {
    const t = clamp((sy - yTop) / (yLow - yTop), 0, 1);
    sp.t = lerp(REST, reach, t);
    read.textContent = "door " + Math.round(sp.t) + "°";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "traycart",
  means: "A hotel ice machine: the pointer tips the bin door down on its hinge to show the heaped ice and the scoop inside.",
  rules: [1, 3, 5, 8],
  range: [50, 90, 95],
  tour: [[202, 59], [202, 140], [202, 219], null],
  mount,
});
