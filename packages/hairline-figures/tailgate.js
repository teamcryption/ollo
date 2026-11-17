/**
 * Pickup tailgate: a pickup truck, cab in front and an open bed behind,
 * closed at the back by a tailgate hinged along its foot. The pointer's
 * place across the frame lets the tailgate drop outward until it lies flat.
 * At rest the gate leans a little open, bright. The slider is how far it drops.
 *
 * The pattern: one hinged part (swing).
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rad, rings, ringAt, rrect, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 140, W = 54, Z0 = 10, ZF = 14, ZW = 36, BX = 64, GH = ZW - ZF, REST = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[0, 0, 0], [L + GH, W, 0], [L + GH, 0, ZF], [0, W, 0], [8, W / 2, 58]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(x + 10 * Math.cos(t), y, 10 + 10 * Math.sin(t))); }
    return pts;
  };
  const box = (x0, y0, x1, y1, z0, z1, r = 2, b = 0.8) => { const [a, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, a, i, z0, z1)); };
  for (const x of [26, 114]) mk("path", { d: poly(wheel(x, 2)) }, g);
  // cab: bonnet low in front, cabin above
  box(0, 0, BX - 2, W, Z0, 34, 8, 2);
  const foot = rrect(16, 2, BX - 2, W - 2, 6, 6), top = rrect(24, 5, BX - 4, W - 5, 5, 6);
  const cab = solid(g);
  cab.sil.setAttribute("d", poly(hull(ringAt(P, foot, 34).concat(ringAt(P, top, 58)))));
  // bed: floor, far wall, front wall, near wall
  box(BX, 0, L, W, Z0, ZF, 3, 1);
  box(BX, 0, L, 3, ZF, ZW);
  box(BX, 0, BX + 3, W, ZF, ZW);
  box(BX, W - 3, L, W, ZF, ZW);
  for (const x of [26, 114]) mk("path", { d: poly(wheel(x, W)) }, g);
  const gate = mk("path", { class: "sil hi" }, g), lip = mk("path", { class: "nf lo" }, g);
  const ang = spring(REST);
  let last = NaN;

  const gp = (y, h, t, a) => P(L + h * Math.sin(rad(a)) + t * Math.cos(rad(a)), y, ZF + h * Math.cos(rad(a)) - t * Math.sin(rad(a)));
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const y of [0, W]) for (const h of [0, GH]) for (const t of [-3, 0]) pts.push(gp(y, h, t, a));
    gate.setAttribute("d", poly(hull(pts)));
    lip.setAttribute("d", poly(hull([gp(10, GH - 5, 0, a), gp(W - 10, GH - 5, 0, a), gp(10, GH - 9, 0, a), gp(W - 10, GH - 9, 0, a)])));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(a, r) { ang.t = a; read.textContent = r ? "rest" : Math.round(a) + "°"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST + clamp((sx - 60) / 200, 0, 1) * (max - REST)), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "tailgate",
  means: "A pickup truck with its tailgate hinged at the foot of the bed: the pointer drops the gate open until it lies flat.",
  rules: [1, 3, 5, 6],
  range: [45, 70, 90],
  tour: [[107, 65], [278, 188], [269, 249], null],
  mount,
});
