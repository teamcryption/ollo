/**
 * Sketch box: a French easel box on its short legs, a wooden case with paint
 * compartments inside and a lid hinged on its back edge. The pointer opens
 * it: the nearer the pointer comes to the box, the wider the lid swings up
 * on a spring. At rest the lid stands ajar, bright. The slider is how quickly
 * the lid follows.
 *
 * The pattern: a continuous swing (a spring on an angle); the hit is on the
 * ground plane, which never moves.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 84, D = 52, H = 24, LEG = 12, LT = 4, REST = 22, MAX = 84;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [L, D, 0], [L, 0, 0], [0, D, 0], [0, 0, LEG + H + D + 4], [L, 0, LEG + H + D + 4]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const [x, y] of [[4, 4], [L - 8, 4], [4, D - 8], [L - 8, D - 8]]) {
    const [r, i] = rings(x, y, x + 4, y + 4, 1, 0.6);
    put(solid(g), prism(P, front, r, i, 0, LEG));
  }
  const [br, bi] = rings(0, 0, L, D, 3, 1.4);
  put(solid(g), prism(P, front, br, bi, LEG, LEG + H));
  const top = LEG + H;
  for (const [x0, y0, x1, y1] of [[4, 4, 30, 48], [33, 4, 80, 22], [33, 25, 56, 48], [59, 25, 80, 48]]) {
    mk("path", { d: poly([P(x0, y0, top), P(x1, y0, top), P(x1, y1, top), P(x0, y1, top)]), class: "nf lo" }, g);
  }
  const lid = mk("path", { class: "sil hi" }, g), lidIn = mk("path", { class: "nf lo" }, g), lidEdge = mk("path", { class: "nf" }, g);
  const ang = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = NaN;

  function corner(x, yp, zp, th) {
    const c = Math.cos(th), s = Math.sin(th);
    return P(x, yp * c - zp * s, top + yp * s + zp * c);
  }
  function draw() {
    const a = ang.x;
    if (a === last) return;
    last = a;
    const th = (a * Math.PI) / 180, pts = [];
    for (const x of [0, L]) for (const yp of [0, D]) for (const zp of [0, LT]) pts.push(corner(x, yp, zp, th));
    lid.setAttribute("d", poly(hull(pts)));
    lidIn.setAttribute("d", poly([corner(6, 6, 0, th), corner(L - 6, 6, 0, th), corner(L - 6, D - 6, 0, th), corner(6, D - 6, 0, th)]));
    lidEdge.setAttribute("d", seg(corner(0, D, LT, th), corner(L, D, LT, th)));
    read.textContent = Math.round(a) + "°";
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    const d = Math.hypot(x - L / 2, y - D / 2);
    ang.t = clamp(MAX - (d - 20) * 0.6, 30, MAX);
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => { ang.t = REST; B.wake(); } }));
  draw();
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { ang.k = 100 * v; ang.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "sketchbox",
  means: "A French easel box on short legs: its hinged lid swings open wider the nearer the pointer comes, showing the paint compartments.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1.6],
  tour: [[200, 150], [100, 100], [300, 220], null],
  mount,
});
