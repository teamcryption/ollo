/**
 * Game box: a board game's box with its lid hinged at the back. At rest
 * the lid sits ajar, bright. The pointer over the box tilts the lid open
 * to show the folded board and pieces inside. The slider is the opening.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, tset, tval, tdone, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 96, D = 66, H = 18, LH = 6, REST = 10;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-2, -2, 0], [W + 2, D + 2, 0], [W + 2, -2, 0], [-2, D + 2, 0], [0, -6, H + D + 6], [W, -6, H + D + 6]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // inside: the folded board and a few pieces
  const [fr, fi] = rings(4, 4, W - 4, D - 4, 3, 1.5);
  put(solid(g), prism(P, front, fr, fi, H - 6, H - 5));
  mk("path", { d: open([P(W / 2, 4, H - 5), P(W / 2, D - 4, H - 5)]), class: "nf lo" }, g);
  for (const [x, y, h] of [[22, 20, 9], [30, 44, 7], [70, 26, 11], [76, 48, 6]]) put(solid(g), prism(P, front, disc(x, y, 4), disc(x, y, 2.5), H - 5, H - 5 + h));

  const lr = rrect(-2, -2, W + 2, D + 2, 6, 4), li = rrect(1, 1, W - 1, D - 1, 4, 4);
  const lid = solid(g);
  const tw = tween(REST);
  let last = NaN;
  function rot(ring, z, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return ring.map((q) => { const y = q.v + 2, zz = z - H; return P(q.u, -2 + y * c - zz * s, H + y * s + zz * c); });
  }
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180;
    lid.sil.setAttribute("d", poly(hull(rot(lr, H, a).concat(rot(lr, H + LH, a)))));
    lid.cr.setAttribute("d", poly(rot(li, deg < 55 ? H + LH : H, a)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? REST + (100 - REST) * top : REST, performance.now(), 0);
    lid.sil.classList.add("hi");
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    return x > -8 && x < W + 8 && y > -8 && y < D + 8;
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = v; act = null; }, destroy: bag.dispose };
}

hairline({
  name: "boardgame",
  means: "A board game box: the pointer tilts its hinged lid open to show the folded board and the pieces inside.",
  rules: [1, 3, 5, 6],
  range: [0.4, 0.75, 0.9],
  tour: [[175, 231], [250, 205], [130, 200], null],
  mount,
});
