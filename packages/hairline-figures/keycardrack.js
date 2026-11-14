/**
 * Bell desk: a reception counter with a raised back ledge, a guest book
 * lying open on the top and a call bell beside it. The nearer the pointer
 * to the bell, the further its plunger presses and its dome dips. At rest
 * the plunger stands up, the dome bright.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, unproj, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 110, D = 40, H = 34, BXc = 78, BYc = 22, BR = 15;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, -10, 0], [W, D, 0], [W, -10, 0], [0, D, 0], [0, -10, H + 14], [W, -10, H + 14], [BXc, BYc, H + 44]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [lr, li] = rings(0, -10, W, 0, 4, 1.2);
  put(solid(g), prism(P, front, lr, li, 0, H + 10));
  const [cr, ci] = rings(0, 0, W, D, 6, 2);
  put(solid(g), prism(P, front, cr, ci, 0, H));
  // a guest book lying open: two thin plates meeting at the spine
  const [kr, ki] = rings(14, 10, 54, 32, 2, 1);
  put(solid(g), prism(P, front, kr, ki, H, H + 2));
  mk("path", { d: open([P(34, 10, H + 2), P(34, 32, H + 2)]), class: "nf lo" }, g);
  put(solid(g), prism(P, front, disc(BXc, BYc, BR + 2), disc(BXc, BYc, BR), H, H + 2.5));
  const dome = solid(g), plunger = mk("path", { class: "nf" }, g);

  const p = spring(0.1);
  let last = NaN;
  function draw() {
    if (p.x === last) return;
    last = p.x;
    const z0 = H + 2.5 + 5 - 5 * p.x, pts = [];
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * Math.PI / 2; pts.push(...ringAt(P, disc(BXc, BYc, BR * Math.cos(t), 28), z0 + BR * 0.85 * Math.sin(t))); }
    dome.sil.setAttribute("d", poly(hull(pts)));
    dome.cr.setAttribute("d", poly(ringAt(P, disc(BXc, BYc, BR - 1.2, 32), z0 + 1)));
    const top = z0 + BR * 0.85, h = 14 - 11 * p.x;
    plunger.setAttribute("d", poly(hull(ringAt(P, disc(BXc, BYc, 1.2, 12), top).concat(ringAt(P, disc(BXc, BYc, 2.8, 16), top + h), ringAt(P, disc(BXc, BYc, 2.8, 16), top + h + 1.5)))));
  }
  const B = register(stage, (dt) => { const m = stepS(p, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();
  dome.sil.classList.add("hi");

  function rest() { p.t = 0.1; read.textContent = "rest"; B.wake(); }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    const d = Math.hypot(x - BXc, y - BYc), R = 24 + reach;
    if (d > R * 2) return rest();
    p.t = clamp(d > R ? 0.31 - 0.22 * (d - R) / R : 1 - 0.69 * d / R, 0.09, 1);
    read.textContent = "ding " + Math.round(p.t * 100);
    B.wake();
  }
  rest();
  bag.add(pointer(stage, { move, leave: rest }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "keycardrack",
  means: "A reception desk with a call bell: the nearer the pointer to the bell, the further its plunger presses and its dome dips.",
  rules: [3, 5, 8, 9],
  range: [0, 16, 40],
  tour: [[131, 124], [186, 151], [222, 172], null],
  mount,
});
