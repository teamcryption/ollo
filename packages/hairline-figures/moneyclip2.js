/**
 * Card wallet: a bifold lying open, three cards stepped in the slots of its
 * left leaf. The pointer swings the right leaf about the spine: toward the
 * right it lays the wallet flat open, toward the cards it folds shut over
 * them. At rest the leaf stands half open, bright.
 *
 * The pattern: one part following the pointer (spring), a hinge.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, clamp, rad, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid, place,
} = HL;

const LW = 72, D = 64, T = 3.5, REST = 62;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-LW, 0, 0], [LW, D, 0], [LW, 0, 0], [-LW, D, 0], [0, 0, LW + 4], [0, D, LW + 4]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [lr, li] = rings(-LW, 0, 0, D, 5, 1.6);
  put(solid(g), prism(P, front, lr, li, 0, T));
  // three cards in stepped slots, far to near
  for (let k = 0; k < 3; k++) {
    const [cr, ci] = rings(-LW + 7, 7 + k * 11, -7, D - 6, 3, 1);
    put(solid(g), prism(P, front, cr, ci, T + k * 0.7, T + k * 0.7 + 0.8));
  }
  const leaf = solid(g), face = mk("path", { class: "nf lo" }, g), snap = mk("circle", { r: 2.4, class: "dot m" }, g);
  const outer = rrect(0, 0, LW, D, 5, 4), inner = rrect(6, 6, LW - 6, D - 6, 3, 4);
  const ang = spring(REST);
  let last = NaN;
  const at = (u, y, off, a) => P(u * Math.cos(a) - off * Math.sin(a), y, T * 0.5 + u * Math.sin(a) + off * Math.cos(a));
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), pts = [];
    for (const s of outer) pts.push(at(s.u, s.v, 0, a), at(s.u, s.v, T, a));
    const off = deg < 100 ? T : 0;
    put(leaf, { sil: poly(hull(pts)), crease: "" });
    face.setAttribute("d", poly(inner.map((s) => at(s.u, s.v, off, a))));
    place(snap, at(LW - 10, D / 2, off, a));
  }
  draw(REST);
  leaf.sil.classList.add("hi");

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -LW - 12 || x > LW + 12 || y < -12 || y > D + 12) return leave();
    const t = clamp((x + LW) / (2 * LW), 0, 1);
    ang.t = clamp(REST + (lerp2(166, 4, t) - REST) * (reach / 100), 4, 166);
    read.textContent = Math.round(180 - ang.t) + "°";
    B.wake();
  }
  const lerp2 = (a, b, t) => a + (b - a) * t;
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "moneyclip2",
  means: "A bifold card wallet: its free leaf swings about the spine, flat open toward the right, folding shut over the cards toward the left.",
  rules: [1, 3, 5, 8],
  range: [40, 100, 100],
  tour: [[86, 164], [151, 246], [314, 279], null],
  mount,
});
