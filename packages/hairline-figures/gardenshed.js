/**
 * Garden shed: a small gabled shed on a paving slab, its door standing ajar.
 * The pointer on the ground draws the door open: the nearer it comes to the
 * doorway, the wider the door swings on its hinge, up to a clamped stop. At
 * rest the door is a crack open, bright. The slider is the widest swing.
 *
 * The pattern: one part swinging toward the pointer.
 */
const {
  Cam, fit, open, poly, hull, proj, rings, prism, facing, unproj, rad, clamp, seg,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const W = 60, D = 44, HW = 38, HR = 58, OV = 4, DX0 = 22, DX1 = 42, DH = 30, REST = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-14, -14, 0], [W + 14, D + 34, 0], [W + 14, -14, 0], [-14, D + 34, 0], [-OV, D / 2, HR], [W + OV, D / 2, HR]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-14, -14, W + 14, D + 34, 6, 2);
  put(solid(g), prism(P, front, sr, si, -4, 0));
  const [br, bi] = rings(0, 0, W, D, 2, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, HW));
  // the roof: two pitched planes over the walls, eaves out past them
  const e0 = [-OV, -OV, HW - 2], e1 = [W + OV, -OV, HW - 2], e2 = [W + OV, D + OV, HW - 2], e3 = [-OV, D + OV, HW - 2];
  const r0 = [-OV, D / 2, HR], r1 = [W + OV, D / 2, HR];
  const pp = (q) => P(q[0], q[1], q[2]);
  mk("path", { d: poly(hull([e0, e1, e2, e3, r0, r1].map(pp))), class: "sil" }, g);
  mk("path", { d: seg(pp(r0), pp(r1)) + open([pp(e1), pp(r1), pp(e2)]), class: "nf lo" }, g);
  // the window on the gable-end wall
  mk("path", { d: poly([P(W, 12, 16), P(W, 30, 16), P(W, 30, 28), P(W, 12, 28)]) + seg(P(W, 21, 16), P(W, 21, 28)), class: "nf lo" }, g);
  // the doorway on the long wall, and the door hung on its left jamb
  mk("path", { d: open([P(DX0, D, 0), P(DX0, D, DH), P(DX1, D, DH), P(DX1, D, 0)]), class: "nf lo" }, g);
  const door = mk("path", { class: "sil hi" }, g), edge = mk("path", { class: "nf lo" }, g), knob = mk("path", { class: "nf" }, g);

  const sp = spring(REST);
  let last = NaN;
  function draw(A) {
    if (Math.abs(A - last) < 0.01) return;
    last = A;
    const L = DX1 - DX0, c = Math.cos(rad(A)), s = Math.sin(rad(A));
    const at = (t, z, n = 0) => P(DX0 + t * c - n * s, D + t * s + n * c, z);
    door.setAttribute("d", poly([at(0, 0.5), at(L, 0.5), at(L, DH - 0.5), at(0, DH - 0.5)]));
    edge.setAttribute("d", open([at(L, 0.5), at(L, 0.5, 1.6), at(L, DH - 0.5, 1.6), at(L, DH - 0.5)]));
    knob.setAttribute("d", seg(at(L - 3.5, DH * 0.45, 0.3), at(L - 3.5, DH * 0.55, 0.3)));
  }

  const B = register(stage, (dt) => {
    const m = stepS(sp, dt);
    draw(sp.x);
    return m;
  });
  bag.add(B.unregister);

  function aim([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -14 || x > W + 14 || y < -14 || y > D + 34) return -1;
    const d = Math.hypot(x - (DX0 + DX1) / 2, Math.max(0, y - D) * 1.0 + Math.max(0, D - y) * 2);
    return clamp(maxA - d * 0.8, REST, maxA);
  }

  function set(A) {
    sp.t = A < 0 ? REST : A;
    read.textContent = A < 0 ? "rest" : Math.round(sp.t) + "°";
    B.wake();
  }
  set(-1);
  bag.add(pointer(stage, { move: (p) => set(aim(p)), leave: () => set(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "gardenshed",
  means: "A gabled garden shed with its door ajar: the nearer the pointer comes to the doorway, the wider the door swings open.",
  rules: [1, 3, 5, 8],
  range: [90, 120, 150],
  tour: [[230, 250], [203, 255], [175, 216], null],
  mount,
});
