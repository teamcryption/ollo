/**
 * Storage ottoman: a padded box on four short feet with a hinged lid. At rest
 * the lid sits a little ajar and its front pull is the bright mark. With the
 * pointer over it the lid swings up on its back hinge and shows the folded
 * throw stored inside. The slider is how far the lid opens.
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid, flatDot, place, hull, rad, clamp,
} = HL;

const W = 96, Dp = 56, H = 36, LT = 7, FT = 4, REST = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, 0, 0], [W, Dp, 0], [W, 0, 0], [0, Dp, 0], [0, 0, H + 40], [W, 0, H + 40]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const [x, y] of [[8, 8], [W - 14, 8], [8, Dp - 14], [W - 14, Dp - 14]]) {
    const [r, i] = rings(x, y, x + 6, y + 6, 3, 1);
    put(solid(g), prism(P, front, r, i, 0, FT));
  }
  const [br, bi] = rings(0, 0, W, Dp, 9, 4);
  put(solid(g), prism(P, front, br, bi, FT, H));
  mk("path", { d: poly(ringAt(P, bi, H)), class: "lo" }, g);
  const [tr] = rings(10, 10, W - 10, Dp - 10, 6, 1);
  mk("path", { d: poly(ringAt(P, tr, H - 2)), class: "lo" }, g);
  mk("path", { d: seg(P(12, Dp / 2, H - 2), P(W - 12, Dp / 2 + 2, H - 2)), class: "nf lo" }, g);

  const lid = solid(g), pull = flatDot(g, C, 2.2, "dot");
  const [lr, li] = rings(0, 0, W, Dp, 9, 3);
  const rot = (a) => (u, v, dz) => { const c = Math.cos(a), s = Math.sin(a); return P(u, v * c - dz * s, H + v * s + dz * c); };
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const R = rot(rad(deg));
    const pts = lr.map((q) => R(q.u, q.v, 0)).concat(lr.map((q) => R(q.u, q.v, LT)));
    lid.sil.setAttribute("d", poly(hull(pts)));
    lid.cr.setAttribute("d", poly(li.map((q) => R(q.u, q.v, LT))));
    place(pull, R(W / 2, Dp + 1.5, LT * 0.45));
  }
  const ang = tween(REST);
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    return x > -6 && x < W + 6 && y > -30 && y < Dp + 8;
  }
  let on = null;
  function setOn(v, force) {
    if (v === on && !force) return;
    on = v;
    tset(ang, v ? clamp(open, 8, 34) : REST, performance.now(), 0);
    lid.sil.classList.toggle("hi", v);
    pull.setAttribute("class", v ? "dot off" : "dot");
    read.textContent = v ? "open " + Math.round(clamp(open, 8, 34)) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (on) setOn(true, true); }, destroy: bag.dispose };
}

hairline({
  name: "ottoman",
  means: "A storage ottoman: with the pointer over it the lid swings up on its back hinge to show the throw folded inside.",
  rules: [1, 4, 5, 8],
  range: [12, 30, 34],
  tour: [[172, 120], [200, 167], [228, 227], null],
  mount,
});
