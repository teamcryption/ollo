/**
 * Meat thermometer: a folding probe thermometer lying on the counter, its
 * long needle hinged at the end of the handle. At rest the needle is half
 * folded, bright. The pointer over the thermometer swings the needle open
 * on its hinge; the slider sets how far it opens.
 *
 * The pattern: one part swinging about a hinge.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, run, unproj, clamp, rad, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BL = 42, BW = 16, BH = 9, L = 74, HX = BL - 3, HY = BW + 3.5, PZ0 = 2, PZ1 = 5.5, REST = 95;

function needle(ang) {
  // a tapered bar, hinged at its root, swung by ang degrees from folded
  const a = rad(ang), dx = -Math.cos(a), dy = Math.sin(a);
  const ring = rrect(0, -3, L, 3, 2.6, 4).map((q) => {
    const t = 1 - 0.72 * clamp(q.u / L, 0, 1) ** 1.4, u = q.u, v = q.v * t;
    return { u: HX + u * dx - v * dy, v: HY + u * dy + v * dx, nu: q.nu * dx - q.nv * dy, nv: q.nu * dy + q.nv * dx };
  });
  return ring;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-4, -4, 0], [BL + 4, BW + 4, BH], [HX + L, HY, 0], [HX + L * 0.7, HY + L * 0.7, 0], [HX + 6, HY + L, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the handle, with its display window and button
  const [br, bi] = rings(0, 0, BL, BW, 6, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BH));
  const [wr] = rings(8, 3, 26, BW - 3, 2.5, 1);
  mk("path", { d: poly(ringAt(P, wr, BH)), class: "nf lo" }, g);
  const btn = mk("ellipse", { class: "dot m" }, g);
  const bp = P(33, BW / 2, BH);
  btn.setAttribute("cx", bp[0]); btn.setAttribute("cy", bp[1]); btn.setAttribute("rx", 1.8); btn.setAttribute("ry", 1.1);

  // the needle and its hinge collar
  const ng = mk("g", {}, g);
  const ns = solid(ng);
  const col = solid(ng);
  const colRing = rrect(HX - 4, HY - 4, HX + 4, HY + 4, 4, 4);
  put(col, prism(P, front, colRing, rrect(HX - 2.6, HY - 2.6, HX + 2.6, HY + 2.6, 2.6, 4), 1, PZ1 + 1.2));
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const ring = needle(a);
    const pts = ringAt(P, ring, PZ0).concat(ringAt(P, ring, PZ1));
    ns.sil.setAttribute("d", poly(hull(pts)));
    ns.cr.setAttribute("d", open(ringAt(P, run(ring, front), PZ1 - 0.6)));
  }
  ns.sil.classList.add("hi");

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, v ? maxA : REST, performance.now(), 0);
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    return x > -12 && x < HX + L * 0.8 && y > -12 && y < HY + L + 6;
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { maxA = v; if (on) { tset(ang, maxA, performance.now(), 0); B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "meatthermo",
  means: "A folding meat thermometer: the long probe swings open on its hinge at the end of the handle.",
  rules: [1, 3, 5, 8],
  range: [120, 180, 180],
  tour: [[117, 174], [42, 219], [200, 120], null],
  mount,
});
