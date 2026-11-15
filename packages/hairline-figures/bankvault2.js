/**
 * Bank teller window: a counter with a glazed partition, and the pass-through
 * drawer under the glass. The pointer's distance in front of the window sets
 * how far the drawer slides out toward it; a coin rides in the tray. At rest
 * the drawer sits a little open, bright.
 *
 * The pattern: one part following the pointer (spring).
 */
const {
  Cam, fit, facing, fillet, poly, prism, proj, rings, clamp, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid, flatDot, place,
} = HL;

const W = 120, D = 80, CZ = 10, WY = 26, WT = 5, WH = 92, DX0 = 28, DX1 = 92, DH = 12, REST = 9, MAX = 56;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -4, 0], [W + 4, D + 4, 0], [W + 4, -4, 0], [-4, D + 4, 0], [0, WY, WH], [W, WY, WH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-4, -4, W + 4, D + 4, 5, 2);
  put(solid(g), prism(P, front, cr, ci, 0, CZ));
  // the partition, glass window and drawer slot on its near face
  const [wr, wi] = rings(-2, WY - WT, W + 2, WY, 2, 1.2);
  put(solid(g), prism(P, front, wr, wi, CZ, WH));
  const face = (x0, x1, z0, z1, r) => poly(fillet([P(x0, WY, z0), P(x1, WY, z0), P(x1, WY, z1), P(x0, WY, z1)], [r, r, r, r]));
  mk("path", { d: face(16, W - 16, 40, WH - 10, 4), class: "nf lo" }, g);
  mk("path", { d: face(20, W - 20, 44, WH - 14, 3), class: "nf lo" }, g);
  for (let i = 0; i < 5; i++) { const d = mk("circle", { r: 1.3, class: "dot off" }, g); place(d, P(W / 2 - 8 + i * 4, WY, 34)); }
  mk("path", { d: face(DX0 - 3, DX1 + 3, CZ + 1, CZ + DH + 3, 2), class: "nf lo" }, g);

  const dg = mk("g", {}, g);
  const tray = solid(dg), floor = mk("path", { class: "nf lo" }, dg), lip = mk("path", { class: "nf" }, dg);
  const coin = mk("ellipse", { class: "dot m" }, dg);
  const ext = spring(REST);
  let last = NaN;
  function draw(e) {
    if (e === last) return;
    last = e;
    const y0 = WY, y1 = WY + e;
    const [r1, i1] = rings(DX0, y0, DX1, y1, 3, 1.4);
    put(tray, prism(P, front, r1, i1, CZ, CZ + DH));
    floor.setAttribute("d", poly(fillet([P(DX0 + 3, y0, CZ + 3), P(DX1 - 3, y0, CZ + 3), P(DX1 - 3, y1 - 3, CZ + 3), P(DX0 + 3, y1 - 3, CZ + 3)], [1, 2, 2, 2])));
    // the pull: a low bar on the near face
    lip.setAttribute("d", poly(fillet([P(DX0 + 14, y1 + 2.5, CZ + 5), P(DX1 - 14, y1 + 2.5, CZ + 5), P(DX1 - 14, y1 + 2.5, CZ + 8), P(DX0 + 14, y1 + 2.5, CZ + 8)], [1.5, 1.5, 1.5, 1.5])));
    const c = P(DX0 + 16, y0 + Math.max(4, e - 8), CZ + 3);
    coin.setAttribute("cx", c[0]); coin.setAttribute("cy", c[1]);
    coin.setAttribute("rx", 7); coin.setAttribute("ry", 3.5);
  }
  draw(REST);
  tray.sil.classList.add("hi");

  const B = register(stage, (dt) => { const m = stepS(ext, dt); draw(ext.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, CZ);
    const inside = x > -10 && x < W + 10 && y > WY && y < D + 30;
    if (!inside) return leave();
    const t = clamp((y - WY) / (D - WY), 0, 1);
    ext.t = clamp(REST + (MAX - REST) * t * (reach / 100), 6, MAX);
    read.textContent = "out " + Math.round(ext.t);
    B.wake();
  }
  function leave() { ext.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "bankvault2",
  means: "A teller window: the drawer under the glass slides out toward the pointer as it comes to the counter's front.",
  rules: [1, 3, 5, 8],
  range: [40, 100, 100],
  tour: [[128, 181], [148, 244], [222, 279], null],
  mount,
});
