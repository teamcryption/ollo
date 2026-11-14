/**
 * Cat flap: a door standing on a sill, a framed flap set low in it, hung
 * from its top edge. The pointer, on the floor in front of the door, draws
 * the flap out toward it: the nearer the door, the wider it swings; behind
 * the door it falls shut. At rest the flap hangs a little ajar, bright.
 * The slider is how far the flap can swing.
 *
 * The pattern: one part answering where the pointer stands (spring).
 */
const {
  Cam, clamp, fit, facing, fillet, hull, poly, prism, proj, rings, seg, unproj,
  disposer, mk, pointer, put, register, solid, spring, stepS,
} = HL;

const DW = 64, DH = 104, T = 5, Z0 = 3, FX0 = 18, FX1 = 46, FZ0 = Z0 + 8, FZ1 = Z0 + 38, REST = 18;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.75);
  const Y = T / 2, L = FZ1 - FZ0;
  fit(C, [[-12, -26, 0], [DW + 12, 40, 0], [DW + 12, -26, 0], [-12, 40, 0], [0, 0, Z0 + DH], [DW, Y, Z0 + DH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-12, -26, DW + 12, 40, 5, 2);
  put(solid(g), prism(P, front, fr, fi, 0, Z0));
  const [dr, di] = rings(0, -Y, DW, Y, 1.6, 0.8);
  put(solid(g), prism(P, front, dr, di, Z0, Z0 + DH));

  // on the door's face: two sunk panels above, the flap's frame below, a knob
  const F = (x, z) => P(x, Y, z);
  const rr = (x0, z0, x1, z1, r) => poly(fillet([F(x0, z0), F(x0, z1), F(x1, z1), F(x1, z0)], [r, r, r, r]));
  mk("path", { d: rr(8, Z0 + 54, DW - 8, Z0 + DH - 8, 2) + rr(8, Z0 + 48, DW - 8, Z0 + 50, 1), class: "nf lo" }, g);
  mk("path", { d: rr(FX0 - 3, FZ0 - 3, FX1 + 3, FZ1 + 3, 3), class: "nf lo" }, g);
  mk("path", { d: rr(FX0, FZ0, FX1, FZ1, 2), class: "nf" }, g);
  const kn = [];
  for (const [dx, dz] of [[-2, -2], [2, -2], [2, 2], [-2, 2]]) kn.push(P(DW - 8 + dx, Y, Z0 + 52 + dz), P(DW - 8 + dx, Y + 4, Z0 + 52 + dz * 0.8));
  mk("path", { d: poly(hull(kn)) }, g);

  const flap = mk("path", { class: "sil" }, g), hinge = mk("path", { class: "nf lo" }, g);
  const ang = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180, by = Y + L * Math.sin(a), bz = FZ1 - L * Math.cos(a), t = 1.3;
    const ny = Math.cos(a) * t, nz = Math.sin(a) * t, pts = [];
    for (const x of [FX0 + 0.8, FX1 - 0.8]) pts.push(P(x, Y, FZ1 - 0.8), P(x, by, bz), P(x, Y + ny, FZ1 - 0.8 + nz), P(x, by + ny, bz + nz));
    flap.setAttribute("d", poly(hull(pts)));
    const hy = Y + 3 * Math.sin(a) + ny, hz = FZ1 - 3 * Math.cos(a) + nz;
    hinge.setAttribute("d", seg(P(FX0 + 3, hy, hz), P(FX1 - 3, hy, hz)));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(Math.round(ang.x * 100) / 100); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { ang.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    const inside = x > -12 && x < DW + 12 && y > -26 && y < 70;
    if (!inside) return aim(null);
    const deg = y <= Y ? 0 : clamp((1 - (y - Y) / 64) * reach, 6, reach);
    ang.t = deg;
    read.textContent = y <= Y ? "shut" : Math.round(deg) + "°";
    B.wake();
  }
  flap.classList.add("hi");
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "catflap",
  means: "A cat flap low in a door: the pointer on the floor in front draws the flap out toward it; behind the door it falls shut.",
  rules: [1, 3, 5, 8],
  range: [30, 70, 85],
  tour: [[150, 210], [230, 220], [250, 120], null],
  mount,
});
