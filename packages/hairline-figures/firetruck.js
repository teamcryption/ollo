/**
 * Fire engine: a long body with a cab up front and a turntable on its roof
 * carrying a long ladder. The pointer's place across the frame raises the
 * ladder on its turntable hinge, its tip climbing high over the cab. At rest
 * the ladder lies a few degrees up, bright. The slider is how far it raises.
 *
 * The pattern: one hinged part (swing).
 */
const { Cam, clamp, circ, facing, fit, hull, poly, prism, proj, rad, rings, ringAt, rrect, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 150, W = 52, Z0 = 9, ZB = 20, CX = 112, HX = 22, HZ = 54, LL = 132, LW = 16, LH = 6, REST = 4;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [HX + LL * Math.cos(rad(62)), W / 2, HZ + LL * Math.sin(rad(62)) + LH], [HX + LL, W / 2, HZ + 12]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(x + 11 * Math.cos(t), y, 11 + 11 * Math.sin(t))); }
    return pts;
  };
  for (const x of [26, 52, 128]) mk("path", { d: poly(wheel(x, 4)) }, g);
  const [chr, chi] = rings(0, 6, L, W - 6, 3, 1);
  put(solid(g), prism(P, front, chr, chi, Z0, ZB - 1));
  const [br, bi] = rings(0, 2, CX - 2, W - 2, 5, 1.6);
  put(solid(g), prism(P, front, br, bi, ZB - 1, 46));
  for (const x of [30, 60, 90]) mk("path", { d: seg(P(x, W - 2, 24), P(x, W - 2, 42)), class: "nf lo" }, g);
  const foot = rrect(CX, 2, L, W - 2, 7, 6), top = rrect(CX + 2, 5, L - 14, W - 5, 5, 6);
  const cab = solid(g);
  cab.sil.setAttribute("d", poly(hull(ringAt(P, foot, ZB - 2).concat(ringAt(P, foot, 36), ringAt(P, top, 58)))));
  mk("path", { d: seg(P(L - 3, W - 8, 38), P(L - 14, W - 8, 55)), class: "nf lo" }, g);
  put(solid(g), prism(P, front, disc(HX, W / 2, 12), disc(HX, W / 2, 10), 46, HZ - 3));
  for (const x of [26, 52, 128]) mk("path", { d: poly(wheel(x, W - 4)) }, g);
  const lad = mk("path", { class: "sil hi" }, g), rails = mk("path", { class: "nf lo" }, g);
  const ang = spring(REST);
  let last = NaN;
  const lp = (y, d, zl, a) => P(HX + d * Math.cos(rad(a)) - zl * Math.sin(rad(a)), y, HZ + d * Math.sin(rad(a)) + zl * Math.cos(rad(a)));
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [], y0 = W / 2 - LW / 2, y1 = W / 2 + LW / 2;
    for (const y of [y0, y1]) for (const d of [-6, LL]) for (const zl of [0, LH]) pts.push(lp(y, d, zl, a));
    lad.setAttribute("d", poly(hull(pts)));
    let r = seg(lp(y0 + 3, 0, LH, a), lp(y0 + 3, LL - 3, LH, a)) + seg(lp(y1 - 3, 0, LH, a), lp(y1 - 3, LL - 3, LH, a));
    for (let d = 14; d < LL; d += 16) r += seg(lp(y0 + 3, d, LH, a), lp(y1 - 3, d, LH, a));
    rails.setAttribute("d", r);
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function aim(a, r) { ang.t = a; read.textContent = r ? "rest" : Math.round(a) + "°"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST + clamp((330 - sx) / 220, 0, 1) * (max - REST)), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "firetruck",
  means: "A fire engine with a long ladder on a roof turntable: the pointer raises the ladder, its tip climbing high over the cab.",
  rules: [1, 3, 5, 6],
  range: [24, 45, 62],
  tour: [[285, 250], [200, 170], [138, 143], null],
  mount,
});
