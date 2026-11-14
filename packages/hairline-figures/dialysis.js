/**
 * Drip monitor: a bedside monitor on a wheeled pole, a drip bag hung from
 * the pole's crossbar. The monitor head turns about the pole to face the
 * pointer, read on the ground plane, on a spring, its trace turning with it.
 * At rest it faces a little off the viewer, bright. The slider is the swing.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, circ, clamp, fit, facing, open, poly, prism, proj, rad, rings, rrect, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PZ = 104, MZ0 = 46, MZ1 = 82, HW = 27, DP = 10, OFF = 6, REST = 22;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const turn = (ring, th) => {
  const c = Math.cos(th), s = Math.sin(th);
  // local u runs across the screen, local v is depth toward the face
  return ring.map((q) => ({ u: (q.v + OFF) * c - q.u * s, v: (q.v + OFF) * s + q.u * c, nu: q.nv * c - q.nu * s, nv: q.nv * s + q.nu * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let sw = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-26, -26, 0], [26, 26, 0], [-26, 26, 0], [26, -26, 0], [0, -26, PZ], [0, 26, PZ], [36, 0, MZ0], [0, 36, MZ0]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 24, 40), disc(0, 0, 22, 40), 3, 7));
  for (let k = 0; k < 5; k++) { const a = rad(k * 72 + 20); put(solid(g), prism(P, front, disc(20 * Math.cos(a), 20 * Math.sin(a), 3, 12), disc(20 * Math.cos(a), 20 * Math.sin(a), 2, 12), 0, 3)); }
  // crossbar, the bag on its far end with a dashed line down, the pole
  mk("path", { d: seg(P(0, -22, PZ), P(0, 22, PZ)), class: "nf" }, g);
  mk("path", { d: seg(P(0, -18, 72), P(0, -18, 52)), class: "dash nf" }, g);
  const [br, bi] = rings(-4, -25, 4, -11, 4, 1.2);
  put(solid(g), prism(P, front, br, bi, 72, PZ - 4));
  const [pr, pi] = rings(-2, -2, 2, 2, 2, 0.6);
  put(solid(g), prism(P, front, pr, pi, 7, PZ + 3));
  const [hr, hi] = rings(-4, 18, 4, 26, 4, 1.2);
  put(solid(g), prism(P, front, hr, hi, 80, PZ - 6));

  const head = solid(g), screen = mk("path", { class: "nf lo" }, g), trace = mk("path", { class: "nf" }, g);
  head.sil.classList.add("hi");
  const ring = rrect(-HW, 0, HW, DP, 4, 4), inner = rrect(-HW + 1.5, 1.5, HW - 1.5, DP - 1.5, 2.5, 4);
  const face = (u, z, th) => P((OFF + DP) * Math.cos(th) - u * Math.sin(th), (OFF + DP) * Math.sin(th) + u * Math.cos(th), z);
  const wave = [[-20, 0], [-10, 0], [-7, 3], [-4, -10], [-1, 9], [2, 0], [20, 0]];
  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const th = rad(a);
    put(head, prism(P, front, turn(ring, th), turn(inner, th), MZ0, MZ1));
    screen.setAttribute("d", poly([[-22, MZ0 + 5], [22, MZ0 + 5], [22, MZ1 - 5], [-22, MZ1 - 5]].map(([u, z]) => face(u, z, th))));
    trace.setAttribute("d", open(wave.map(([u, z]) => face(u, (MZ0 + MZ1) / 2 + z, th))));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    const a = Math.round(clamp((Math.atan2(wy, wx) * 180) / Math.PI, 45 - sw, 45 + sw));
    ang.t = a;
    read.textContent = "turn " + (a - 45) + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  draw(REST);
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sw = v; }, destroy: bag.dispose };
}

hairline({
  name: "dialysis",
  means: "A bedside monitor on a drip pole: the monitor head turns about the pole to face the pointer, its vitals trace turning with it.",
  rules: [1, 3, 5, 8],
  range: [30, 60, 80],
  tour: [[290, 150], [200, 260], [110, 150], null],
  mount,
});
