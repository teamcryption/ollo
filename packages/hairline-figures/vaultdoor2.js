/**
 * Gun safe: a tall steel cabinet with a thick door hinged on its left, a
 * three-spoke handle wheel and a dial on the door. The pointer over the safe
 * swings the door open about its hinge, showing the rack of barrels inside.
 * At rest the door stands just ajar, bright. The slider is how far it opens.
 */
const { Cam, circ, clamp, fit, hull, poly, proj, seg, tdone, tset, tval, tween, disposer, mk, pointer, register, solid } = HL;

const W = 40, D = 34, H = 66, T = 5, HX = 1, DW = 38, AJAR = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, D, 0], [W, D, H], [0, 0, H], [HX - 4, D + DW, 0], [HX - 4, D + DW, H]], 200, 160);
  const P = proj(C), c = Math.cos(C.az), s = Math.sin(C.az);
  const near = (q) => q[0] * s + q[1] * c;

  // a box from its 4 plan corners and two heights: silhouette, top outline, nearest vertical edge
  function blk(el, pl, z0, z1) {
    const top = pl.map((q) => P(q[0], q[1], z1)), bot = pl.map((q) => P(q[0], q[1], z0));
    el.sil.setAttribute("d", poly(hull(top.concat(bot))));
    let n = 0;
    pl.forEach((q, i) => { if (near(q) > near(pl[n])) n = i; });
    el.cr.setAttribute("d", poly(top) + seg(top[n], bot[n]));
  }

  const g = mk("g", {}, svg);
  const body = solid(g);
  blk(body, [[0, 0], [W, 0], [W, D], [0, D]], 0, H);
  // plinth and the mouth of the cabinet on its front face, with the rack inside
  const F = (x, z) => P(x, D, z);
  mk("path", { d: seg(P(0, D, 4), P(W, D, 4)) + seg(P(W, 1.5, 4), P(W, D, 4)), class: "nf lo" }, g);
  let rack = poly([F(3, 7), F(W - 3, 7), F(W - 3, H - 3), F(3, H - 3)]) + seg(F(3, H - 18), F(W - 3, H - 18));
  for (let i = 0; i < 6; i++) { const x = 8 + i * 4.8; rack += seg(F(x, 8), F(x, H - 22)) + poly(circ(1.1, 10).map((q) => F(x + q.u, H - 22 + q.v * 0.6))); }
  mk("path", { d: rack, class: "nf lo" }, g);

  const door = solid(g);
  const wheel = mk("path", { class: "nf" }, door.g);
  const dial = mk("path", { class: "nf lo" }, door.g);
  const ang = tween(AJAR);
  let last = NaN;
  function draw(a) {
    const r = a * Math.PI / 180, ca = Math.cos(r), sa = Math.sin(r);
    const at = (u, v) => [HX + u * ca - v * sa, D + u * sa + v * ca];
    blk(door, [at(0, 0), at(DW, 0), at(DW, T), at(0, T)], 1, H - 1);
    // the outer face of the door, in the door's own frame
    const O = (u, z) => { const q = at(u, T); return P(q[0], q[1], z); };
    const cu = DW * 0.62, cz = H * 0.52;
    let w = poly(circ(2, 16).map((q) => O(cu + q.u, cz + q.v)));
    for (let k = 0; k < 3; k++) { const t = k * 2.094 + 0.5; w += seg(O(cu, cz), O(cu + 7 * Math.cos(t), cz + 7 * Math.sin(t))); }
    wheel.setAttribute("d", w);
    dial.setAttribute("d", poly(circ(3.4, 20).map((q) => O(cu + q.u, cz + 13 + q.v))) + seg(O(cu, cz + 13), O(cu, cz + 16.4)) + poly([O(5, 4), O(DW - 4, 4), O(DW - 4, H - 4), O(5, H - 4)]));
  }

  const B = register(stage, (_dt, now) => {
    const a = tval(ang, now);
    if (a !== last) { draw(a); last = a; }
    return !tdone(ang, now);
  });
  bag.add(B.unregister);

  // hit against the rest pose: the cabinet's silhouette plus the door's swing, which never move
  const restHull = hull([[0, 0, 0], [W, 0, 0], [W, D, 0], [0, D, 0], [0, 0, H], [W, 0, H], [W, D, H], [0, D, H], [HX, D + 12, 0], [HX, D + 12, H]].map((q) => P(q[0], q[1], q[2])));
  function inside([x, y]) {
    let o = false;
    for (let i = 0, j = restHull.length - 1; i < restHull.length; j = i++) {
      const [xi, yi] = restHull[i], [xj, yj] = restHull[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) o = !o;
    }
    return o;
  }
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(ang, on ? clamp(maxA, 20, 110) : AJAR, performance.now(), 0);
    door.sil.classList.toggle("hi", true);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act) { tset(ang, clamp(v, 20, 110), performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "vaultdoor2",
  means: "A gun safe: the pointer swings its heavy door open on the hinge, showing the rack of barrels inside; at rest it stands ajar.",
  rules: [1, 3, 5, 6],
  range: [20, 70, 110],
  tour: [[197, 103], [150, 180], [234, 205], null],
  mount,
});
