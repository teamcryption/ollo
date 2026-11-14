/**
 * Chafing dish: a rounded pan on a low stand with a fuel cup under it and
 * a hinged lid along its back edge. The nearer the pointer comes to the
 * pan's front, the further the lid swings open. At rest the lid stands
 * slightly ajar, bright.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, rrect, unproj, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 84, D = 52, Z0 = 14, Z1 = 30, LT = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -4, 0], [W + 4, D + 4, 0], [W + 4, -4, 0], [-4, D + 4, 0], [0, -6, Z1 + D + 4], [W, -6, Z1 + D + 4]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, W + 4, D + 4, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  // four legs as thin posts, then the fuel cup, then the pan
  for (const [x, y] of [[4, 4], [W - 4, 4], [4, D - 4]]) mk("path", { d: open([P(x, y, 3), P(x, y, Z0)]), class: "nf lo" }, g);
  const [cr, ci] = rings(W / 2 - 9, D / 2 - 9, W / 2 + 9, D / 2 + 9, 9, 1.5);
  put(solid(g), prism(P, front, cr, ci, 3, 9));
  mk("path", { d: open([P(W - 4, D - 4, 3), P(W - 4, D - 4, Z0)]), class: "nf lo" }, g);
  const [pr, pi] = rings(0, 0, W, D, 10, 2);
  put(solid(g), prism(P, front, pr, pi, Z0, Z1));
  const lidG = solid(g);
  const outer = rrect(2, 2, W - 2, D - 2, 9, 6), inner = rrect(5, 5, W - 5, D - 5, 6, 6);

  const ang = spring(0.22);
  let last = NaN;
  function at(ring, a, lift) {
    const c = Math.cos(a), s = Math.sin(a);
    return ring.map((q) => P(q.u, q.v * c - lift * s, Z1 + q.v * s + lift * c));
  }
  function draw() {
    if (ang.x === last) return;
    last = ang.x;
    const a = ang.x * 1.75;
    lidG.sil.setAttribute("d", poly(hull(at(outer, a, 0).concat(at(outer, a, LT), at(inner, a, LT + 3)))));
    lidG.cr.setAttribute("d", open(at(inner, a, LT + 3)) + "Z");
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();
  lidG.sil.classList.add("hi");

  function rest() { ang.t = 0.22; read.textContent = "rest"; B.wake(); }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, Z1);
    if (x < -30 || x > W + 30 || y < -20) return rest();
    const d = Math.abs(y - D), R = 30 + reach;
    const t = d > R * 1.5 ? 0.09 : d > R ? 0.31 : 1 - 0.69 * (d / R);
    ang.t = clamp(t, 0.09, 1);
    read.textContent = Math.round(ang.t * 100) + "%";
    B.wake();
  }
  rest();
  bag.add(pointer(stage, { move, leave: rest }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "buffetwarmer",
  means: "A chafing dish on its stand: the nearer the pointer to the pan's front, the wider its hinged lid swings open.",
  rules: [3, 5, 8, 9],
  range: [0, 20, 50],
  tour: [[238, 176], [209, 190], [162, 213], null],
  mount,
});
