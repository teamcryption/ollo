/**
 * Railway handcar: a flat deck on four small wheels, a tapered post in the
 * middle, and the long pump lever pivoted on top of it with a cross handle at
 * each end. The pointer's place across the frame rocks the lever, one handle
 * down and the other up. At rest the lever stands tipped, bright. The slider
 * is how far it rocks.
 *
 * The pattern: one hinged part (tilt).
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rad, rings, ringAt, rrect, open, run, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 100, W = 60, ZD = 14, ZT = 20, PX = 50, PZ = 64, BL = 64, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-24, 4, 0], [L + 24, W - 4, 0], [PX - BL, 0, PZ + 44], [PX + BL, W, PZ + 44], [PX + BL, W, PZ - 44]], 200, 160);
  const P = proj(C), front = facing(C);
  for (const y of [4, W - 4]) mk("path", { d: seg(P(-24, y, 0), P(L + 24, y, 0)), class: "nf lo" }, svg);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(x + 10 * Math.cos(t), y, 10 + 10 * Math.sin(t))); }
    return pts;
  };
  for (const x of [20, 80]) mk("path", { d: poly(wheel(x, 4)) }, g);
  const [dr, di] = rings(0, 0, L, W, 4, 1.4);
  put(solid(g), prism(P, front, dr, di, ZD, ZT));
  for (const x of [20, 80]) { mk("path", { d: poly(wheel(x, W - 4)) }, g); }
  const foot = rrect(PX - 9, W / 2 - 9, PX + 9, W / 2 + 9, 3, 6), top = rrect(PX - 4, W / 2 - 4, PX + 4, W / 2 + 4, 2, 6), inner = rrect(PX - 3, W / 2 - 3, PX + 3, W / 2 + 3, 1.5, 6);
  put(solid(g), { sil: poly(hull(ringAt(P, foot, ZT).concat(ringAt(P, top, PZ - 2)))), crease: open(ringAt(P, run(inner, front), PZ - 2)) });
  const farH = mk("path", {}, g), beam = mk("path", { class: "sil hi" }, g), nearH = mk("path", {}, g);
  const ang = spring(REST);
  let last = NaN;

  const bp = (a, d, y, n) => P(PX + d * Math.cos(rad(a)) - n * Math.sin(rad(a)), y, PZ + d * Math.sin(rad(a)) + n * Math.cos(rad(a)));
  const box = (a, d0, d1, y0, y1, n0, n1) => {
    const pts = [];
    for (const d of [d0, d1]) for (const y of [y0, y1]) for (const n of [n0, n1]) pts.push(bp(a, d, y, n));
    return poly(hull(pts));
  };
  function draw(a) {
    if (a === last) return;
    last = a;
    farH.setAttribute("d", box(a, -BL - 3, -BL + 3, 2, W - 2, -2, 3));
    beam.setAttribute("d", box(a, -BL, BL, W / 2 - 4, W / 2 + 4, -3, 3));
    nearH.setAttribute("d", box(a, BL - 3, BL + 3, 2, W - 2, -2, 3));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(a, r) { ang.t = a; read.textContent = r ? "rest" : Math.round(a) + "°"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(clamp((200 - sx) / 120, -1, 1) * max), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "handcar",
  means: "A railway handcar with a long pump lever on its post: the pointer rocks the lever, one cross handle pressing down as the other rises.",
  rules: [1, 3, 5, 6],
  range: [18, 30, 40],
  tour: [[267, 175], [136, 180], [264, 314], null],
  mount,
});
