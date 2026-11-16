/**
 * Veilbox: a bow tie box. A shallow box holds a bow tie on its pad; the lid
 * is hinged along the back edge. The pointer, read on the ground plane,
 * swings the lid open: the further right, the wider it opens. At rest the lid
 * stands ajar, bright. The slider is how far the lid may swing.
 */
const { Cam, fit, proj, poly, hull, clamp, rad, spring, stepS, mk, pointer, register, disposer, unproj } = HL;

const W = 64, D = 44, H = 16, LH = 6, REST = 22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, -LH, H + D], [W, -LH, H + D]], 200, 168);
  const P = proj(C);
  const hp = (pts) => poly(hull(pts.map((p) => P(...p))));
  const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
  const g = mk("g", {}, svg);
  mk("path", { d: hp(box(0, 0, 0, W, D, H)), class: "sil" }, g);
  mk("path", { d: poly([[3, 3], [W - 3, 3], [W - 3, D - 3], [3, D - 3]].map(([x, y]) => P(x, y, H))), class: "nf lo" }, g);
  // the bow tie on its pad
  const z = H - 2;
  const wing = (s) => [[W / 2 + s * 5, D / 2 - 3], [W / 2 + s * 22, D / 2 - 11], [W / 2 + s * 24, D / 2], [W / 2 + s * 22, D / 2 + 11], [W / 2 + s * 5, D / 2 + 3]];
  mk("path", { d: poly(wing(-1).map(([x, y]) => P(x, y, z))), class: "nf" }, g);
  mk("path", { d: poly(wing(1).map(([x, y]) => P(x, y, z))), class: "nf" }, g);
  mk("path", { d: hp(box(W / 2 - 5, D / 2 - 5, z, W / 2 + 5, D / 2 + 5, z + 3)) }, g);
  const lid = mk("path", { class: "sil" }, g), lidTop = mk("path", { class: "nf lo" }, g);
  const a = spring(REST);
  let last = NaN;
  function L(x, v, w, deg) {
    const t = rad(deg);
    return [x, v * Math.cos(t) - w * Math.sin(t), H + v * Math.sin(t) + w * Math.cos(t)];
  }
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const c = [];
    for (const x of [-1, W + 1]) for (const v of [0, D + 1]) for (const w of [0, LH]) c.push(L(x, v, w, deg));
    lid.setAttribute("d", hp(c));
    lidTop.setAttribute("d", poly([[2, 3], [W - 2, 3], [W - 2, D - 2], [2, D - 2]].map(([x, v]) => P(...L(x, v, LH, deg)))));
  }
  const B = register(stage, (dt) => { const m = stepS(a, dt); draw(a.x); return m; });
  bag.add(B.unregister);
  let on = false;
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    const inside = x > -20 && x < W + 20 && y > -30 && y < D + 30;
    const t = clamp(x / W, 0, 1);
    a.t = inside ? REST + t * (reach - REST) : REST;
    if (inside !== on) { on = inside; }
    lid.classList.add("hi");
    read.textContent = inside ? Math.round(a.t) + "°" : "rest";
    B.wake();
  }
  lid.classList.add("hi");
  read.textContent = "rest";
  draw(REST);
  bag.add(pointer(stage, { move, leave: () => { a.t = REST; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "veilbox",
  means: "A bow tie box with its lid ajar: the pointer swings the hinged lid open to show the bow tie inside.",
  rules: [1, 3, 5, 6],
  range: [60, 105, 120],
  tour: [[250, 234], [200, 208], [150, 183], null],
  mount,
});
