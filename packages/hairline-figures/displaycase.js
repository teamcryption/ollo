/**
 * Glass counter: a low cabinet under a glass case, two cakes on the shelf.
 * The glass hood, top pane and sloped front pane, swings up on its back
 * hinge as the pointer comes to the front of the counter. At rest it is
 * open a crack, bright. The slider is how far it can open.
 */
const { Cam, fit, facing, proj, unproj, rings, circ, prism, put, solid, mk, poly, seg, hull, fillet, spring, stepS, clamp, rad, register, pointer, disposer } = HL;

const L = 110, W = 48, CZ = 30, HZ = 66, TY = 26, REST = 6;
const disc = (x, y, r) => circ(r, 24).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const SIDE = [[0, CZ], [0, HZ], [TY, HZ], [W, CZ + 6], [W, CZ]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [L, W, 0], [0, W, 0], [L, 0, 0], [0, 0, HZ + 4], [L, 30, HZ + 50], [L, 0, HZ + 50]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(0, 0, L, W, 4, 2);
  put(solid(g), prism(P, front, cr, ci, 0, CZ));
  for (const x of [1, L - 1]) mk("path", { d: poly(SIDE.map(([y, z]) => P(x, y, z))), class: "nf lo" }, g);
  put(solid(g), prism(P, front, disc(30, 22, 11), disc(30, 22, 9.5), CZ, CZ + 12));
  put(solid(g), prism(P, front, disc(72, 24, 9), disc(72, 24, 7.5), CZ, CZ + 16));
  const hood = mk("path", { class: "nf sil hi" }, g), crease = mk("path", { class: "nf lo" }, g);

  const op = spring(REST);
  let last = NaN;
  const pt = (x, y, z, a) => {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), dz = z - HZ;
    return P(x, y * c - dz * s, HZ + y * s + dz * c);
  };
  function draw(a) {
    if (a === last) return;
    last = a;
    const prof = [[0, HZ], [TY, HZ], [W, CZ + 6]], pts = [];
    for (const x of [1, L - 1]) for (const [y, z] of prof) pts.push(pt(x, y, z, a));
    const h = hull(pts);
    hood.setAttribute("d", poly(fillet(h, h.map(() => 3))));
    crease.setAttribute("d", seg(pt(1, TY, HZ, a), pt(L - 1, TY, HZ, a)));
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(op, dt); draw(op.x); return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x, y] = unproj(C, sx, sy, 0);
      const over = x > -30 && x < L + 30;
      op.t = over ? clamp((y + 10) / (W + 40), 0, 1) * amp : REST;
      read.textContent = Math.round(op.t) + "°";
      B.wake();
    },
    leave: () => { op.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "displaycase",
  means: "A glass display counter: its glass hood swings up on the back hinge as the pointer comes to the front, showing the cakes.",
  rules: [1, 3, 4, 8],
  range: [30, 55, 70],
  tour: [[104, 276], [235, 211], [177, 240], null],
  mount,
});
