/**
 * Garbage truck: a front loader, cab up front and the tall refuse body
 * behind it, with two long lift arms pivoting on the body's nose and a
 * container held on their forks ahead of the cab. The pointer's place across
 * the frame swings the arms: the container climbs over the cab and turns
 * upside down above the hopper. At rest it hangs just lifted, bright. The
 * slider is how far the arms swing.
 *
 * The pattern: one hinged part (swing).
 */
const { Cam, clamp, facing, fillet, fit, hull, poly, prism, proj, rad, rings, ringAt, rrect, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const W = 50, PX = 86, PZ = 74, AL = 62, A0 = -38, REST = 6, MAXA = 135;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const end = (a) => [PX + AL * Math.cos(rad(A0 + a)), PZ + AL * Math.sin(rad(A0 + a))];
  const cp = (y, dx, dz, a) => { const [ex, ez] = end(a), c = Math.cos(rad(a)), s = Math.sin(rad(a)); return [ex + dx * c - dz * s, y, ez + dx * s + dz * c]; };
  const corners = (a) => { const o = []; for (const y of [4, W - 4]) for (const dx of [-2, 30]) for (const dz of [-30, 4]) o.push(cp(y, dx, dz, a)); return o; };
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[0, 0, 0], [134, W, 0], [0, W, 0], [134, 0, 0]].concat(corners(0), corners(MAXA)), 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(x + 11 * Math.cos(t), y, 11 + 11 * Math.sin(t))); }
    return pts;
  };
  const wheels = (y) => { for (const x of [22, 46, 114]) mk("path", { d: poly(wheel(x, y)) }, g); };
  wheels(4);
  const farArm = mk("path", { class: "nf" }, g);
  const [chr, chi] = rings(0, 6, 134, W - 6, 3, 1);
  put(solid(g), prism(P, front, chr, chi, 9, 19));
  const [br, bi] = rings(2, 0, 92, W, 8, 2);
  put(solid(g), prism(P, front, br, bi, 18, 70));
  mk("path", { d: poly(ringAt(P, rrect(58, 9, 84, W - 9, 4, 4), 70)), class: "nf lo" }, g);
  mk("path", { d: seg(P(20, W, 26), P(20, W, 64)), class: "nf lo" }, g);
  const foot = rrect(94, 2, 132, W - 2, 6, 6), top = rrect(96, 5, 118, W - 5, 5, 6);
  const cab = solid(g);
  cab.sil.setAttribute("d", poly(hull(ringAt(P, foot, 18).concat(ringAt(P, foot, 36), ringAt(P, top, 56)))));
  mk("path", { d: seg(P(129, W - 6, 38), P(117, W - 6, 53)), class: "nf lo" }, g);
  wheels(W - 4);
  const nearArm = mk("path", { class: "nf" }, g);
  const box = mk("path", { class: "sil hi" }, g), rim = mk("path", { class: "nf lo" }, g);
  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const [ex, ez] = end(a);
    const arm = (y) => seg(P(PX, y, PZ), P(ex, y, ez)) + seg(P(ex, y, ez), P(...cp(y, 0, -26, a)));
    farArm.setAttribute("d", arm(-3));
    nearArm.setAttribute("d", arm(W + 3));
    const h = hull(corners(a).map((p) => P(...p)));
    box.setAttribute("d", poly(fillet(h, h.map(() => 5), 3)));
    rim.setAttribute("d", seg(P(...cp(4, 2, 0, a)), P(...cp(W - 4, 2, 0, a))) + seg(P(...cp(W - 4, 2, 0, a)), P(...cp(W - 4, 28, 0, a))));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function aim(a, r) { ang.t = a; read.textContent = r ? "rest" : Math.round(a) + "°"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST + clamp((sx - 120) / 170, 0, 1) * (max - REST)), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = clamp(v, 40, MAXA); }, destroy: bag.dispose };
}

hairline({
  name: "garbagetruck",
  means: "A front-loading garbage truck: the pointer swings its lift arms, carrying the container over the cab to tip into the hopper.",
  rules: [1, 3, 5, 6],
  range: [70, 115, 135],
  tour: [[276, 250], [225, 205], [170, 160], null],
  mount,
});
