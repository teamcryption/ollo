/**
 * Token box: a game's token box, three compartments holding round tokens,
 * cubes and a stack of chips, under a hinged lid. The pointer over the box
 * swings the lid open on its back hinge. At rest the lid sits ajar, bright.
 * The slider is how far the lid opens.
 *
 * The pattern: one thing that opens (a hinge turned by a tween).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 84, Y1 = 50, H = 20, T = 5, REST = 12;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, -16, 0], [0, Y1, 0], [0, -16, H + Y1 + 8], [X1, -16, H + Y1 + 8]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, X1, Y1, 8, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // the tray: a rim inset on the top, two walls, and what each cell holds
  mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(3, 3, X1 - 3, Y1 - 3, 6, 8), H)) + seg(P(30, 3, H), P(30, Y1 - 3, H)) + seg(P(57, 3, H), P(57, Y1 - 3, H)) }, g);
  for (const [x, y] of [[10, 11], [20, 13], [12, 26], [22, 30], [14, 40]]) put(solid(g), prism(P, front, disc(x, y, 4.2), disc(x, y, 3.2), H, H + 1.6));
  for (const [x, y] of [[36, 10], [46, 18], [37, 30], [47, 38]]) { const [r, i] = rings(x - 3.5, y - 3.5, x + 3.5, y + 3.5, 1.4, 0.7); put(solid(g), prism(P, front, r, i, H, H + 6)); }
  for (const [x, y, n] of [[70, 14, 4], [68, 34, 2]]) put(solid(g), prism(P, front, disc(x, y, 7, 28), disc(x, y, 5.8, 28), H, H + 1.4 * n));

  const lid = mk("path", { class: "sil hi" }, g), lcr = mk("path", { class: "nf lo" }, g);
  const outer = rrect(-1, -1, X1 + 1, Y1 + 1, 9, 8), inner = rrect(2, 2, X1 - 2, Y1 - 2, 7, 8);
  const ang = tween(REST);
  let last = NaN;
  function L(q, dz, c, s) { const yy = q.v + 1; return P(q.u, -1 + yy * c - dz * s, H + 0.4 + yy * s + dz * c); }
  function draw(a) {
    if (a === last) return;
    last = a;
    const t = (a * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
    const pts = outer.map((q) => L(q, 0, c, s)).concat(outer.map((q) => L(q, T, c, s)));
    lid.setAttribute("d", poly(hull(pts)));
    const up = -0.612 * s + 0.5 * c > 0;
    lcr.setAttribute("d", poly(inner.map((q) => L(q, up ? T : 0, c, s))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    for (const z of [0, H]) { const [x, y] = unproj(C, sx, sy, z); if (x > -6 && x < X1 + 6 && y > -6 && y < Y1 + 6) return 1; }
    return -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a < 0 ? REST : reach, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : "open";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act >= 0) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "tokentray",
  means: "A game token box: the pointer over it swings the hinged lid open on the tokens, cubes and chips inside.",
  rules: [1, 5, 6, 9],
  range: [60, 100, 112],
  tour: [[187, 202], [159, 174], [215, 251], null],
  mount,
});
