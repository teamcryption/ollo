/**
 * Clock tower: a square tower on a plinth, a clock block under a pyramid
 * roof, a dial on each of the two faces we see. The pointer turns the
 * minute hand on both dials to point at it, the hour hand creeping along
 * with it. At rest the clock reads ten past ten, its near minute hand
 * bright. The slider is the hour.
 *
 * The pattern: one part turning to face the pointer.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, run, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const DZ = 92, DR = 18, REST = Math.PI / 3, TAU = Math.PI * 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let hour = value;
  const C = Cam(45, 0.5, 1.82);
  fit(C, [[-6, -6, 0], [46, 46, 0], [46, -6, 0], [-6, 46, 0], [20, 20, 156]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, x1, r, b, z0, z1) => { const [o, i] = rings(x0, x0, x1, x1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  block(-6, 46, 4, 2, 0, 6);
  block(3, 37, 3, 1.5, 6, 70);
  block(-1, 41, 3, 1.5, 70, 113);
  // the roof: a pyramid, its foot wider than the block, a finial on top
  const foot = rrect(-4, -4, 44, 44, 3, 6), tip = rrect(19, 19, 21, 21, 1, 4);
  put(solid(g), { sil: poly(hull(ringAt(P, foot, 113).concat(ringAt(P, tip, 146)))), crease: open(ringAt(P, run(rrect(-2, -2, 42, 42, 2, 6), front), 115)) });
  mk("path", { d: seg(P(20, 20, 146), P(20, 20, 156)), class: "nf" }, g);

  // the two dials: on face x = 41 the viewer's right is -y; on face y = 41 it is +x
  const faces = [
    (r, a, d = 0.3) => [41 + d, 20 - r * Math.sin(a), DZ + r * Math.cos(a)],
    (r, a, d = 0.3) => [20 + r * Math.sin(a), 41 + d, DZ + r * Math.cos(a)],
  ];
  const ring = (f, r) => { const pts = []; for (let i = 0; i < 40; i++) pts.push(P(...f(r, (i / 40) * TAU))); return pts; };
  const hands = faces.map((f, k) => {
    mk("path", { d: poly(ring(f, DR)) }, g);
    mk("path", { d: poly(ring(f, DR - 2.5)), class: "nf lo" }, g);
    let ticks = "";
    for (let i = 0; i < 12; i++) ticks += seg(P(...f(DR - 2.5, (i / 12) * TAU)), P(...f(i % 3 ? DR - 4 : DR - 6, (i / 12) * TAU)));
    mk("path", { d: ticks, class: "nf lo" }, g);
    const h = mk("path", { class: "nf" }, g), m = mk("path", { class: "nf" + (k === 0 ? " hi" : "") }, g);
    return { f, h, m };
  });

  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const mins = (((a / TAU) % 1) + 1) % 1, ha = ((hour + mins) / 12) * TAU;
    for (const { f, h, m } of hands) {
      h.setAttribute("d", seg(P(...f(0, 0, 0.6)), P(...f(10, ha, 0.6))));
      m.setAttribute("d", seg(P(...f(0, 0, 0.8)), P(...f(15.5, a, 0.8))));
    }
  }
  const B = register(stage, (dt) => { const mv = stepS(ang, dt); draw(ang.x); return mv; });
  bag.add(B.unregister);

  // the near dial's basis on screen, to turn a pointer into an angle on that face
  const c0 = P(...faces[0](0, 0)), ey = P(...faces[0](1, Math.PI / 2)), ez = P(...faces[0](1, 0));
  const u = [ey[0] - c0[0], ey[1] - c0[1]], w = [ez[0] - c0[0], ez[1] - c0[1]], det = u[0] * w[1] - u[1] * w[0];
  function aim([sx, sy]) {
    const dx = sx - c0[0], dy = sy - c0[1];
    if (Math.hypot(dx, dy) > 150) return null;
    const a = (dx * w[1] - dy * w[0]) / det, b = (u[0] * dy - u[1] * dx) / det;
    return Math.atan2(a, b);
  }
  function setAim(t) {
    let target = t === null ? REST : t;
    target += Math.round((ang.t - target) / TAU) * TAU;
    ang.t = target;
    const mins = Math.round(((((t === null ? REST : t) / TAU) % 1) + 1) % 1 * 60) % 60;
    read.textContent = t === null ? "rest" : hour + ":" + String(mins).padStart(2, "0");
    B.wake();
  }
  setAim(null);
  draw(REST);
  bag.add(pointer(stage, { move: (p) => setAim(aim(p)), leave: () => setAim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { hour = Math.round(v); last = NaN; draw(ang.x); }, destroy: bag.dispose };
}

hairline({
  name: "clocktower",
  means: "A clock tower over a square: the minute hands on both dials turn to point at the pointer, the hour hands creeping after.",
  rules: [1, 3, 5, 8],
  range: [1, 10, 12],
  tour: [[250, 100], [224, 177], [173, 112], null],
  mount,
});
