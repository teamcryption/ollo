/**
 * Tow truck: a cab up front, a low deck behind it, and a long boom hinged on
 * the deck that reaches back past the tail, a winch cable and hook hanging
 * from its tip. The pointer's place across the frame raises the boom, the
 * hook climbing with it. At rest the boom lies low, bright. The slider is how
 * high it lifts.
 *
 * The pattern: one hinged part (swing).
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rad, rings, ringAt, rrect, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 140, W = 54, Z0 = 9, ZB = 20, PX = 62, PZ = 36, BL = 104, BW = 7, BT = 11, CAB = 8, REST = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const tip = (a) => [PX - BL * Math.cos(rad(a)), PZ + BL * Math.sin(rad(a))];
  const t1 = tip(60);
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [tip(REST)[0], W, 0], [t1[0], W / 2, t1[1] + 12], [L, W, 60]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const cable = mk("path", { class: "nf" }, g), hook = mk("path", { class: "nf" }, g), hb = mk("path", {}, g);
  const wheel = (x, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(x + 11 * Math.cos(t), y, 11 + 11 * Math.sin(t))); }
    return pts;
  };
  for (const x of [26, 118]) mk("path", { d: poly(wheel(x, 4)) }, g);
  const [chr, chi] = rings(0, 6, L, W - 6, 3, 1);
  put(solid(g), prism(P, front, chr, chi, Z0, ZB - 1));
  const [dr, di] = rings(2, 2, 98, W - 2, 3, 1.2);
  put(solid(g), prism(P, front, dr, di, ZB - 1, ZB + 6));
  const [pr, pi] = rings(PX - 8, W / 2 - 10, PX + 8, W / 2 + 10, 3, 1);
  put(solid(g), prism(P, front, pr, pi, ZB + 6, PZ));
  const boom = mk("path", { class: "sil hi" }, g), rim = mk("path", { class: "nf lo" }, g);
  const foot = rrect(100, 0, L, W, 7, 6), top = rrect(102, 3, L - 12, W - 3, 5, 6);
  const cab = solid(g);
  cab.sil.setAttribute("d", poly(hull(ringAt(P, foot, ZB - 2).concat(ringAt(P, foot, 34), ringAt(P, top, 58)))));
  mk("path", { d: seg(P(L - 2, W - 6, 36), P(L - 12, W - 6, 55)), class: "nf lo" }, g);
  for (const x of [26, 118]) mk("path", { d: poly(wheel(x, W - 4)) }, g);
  const ang = spring(REST);
  let last = NaN;

  const bp = (y, d, zl, a) => P(PX - d * Math.cos(rad(a)) - zl * Math.sin(rad(a)), y, PZ + d * Math.sin(rad(a)) - zl * Math.cos(rad(a)) + BT / 2);
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const y of [W / 2 - BW, W / 2 + BW]) for (const d of [-6, BL]) for (const zl of [0, BT]) pts.push(bp(y, d, zl, a));
    boom.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", seg(bp(W / 2 + BW, 2, 2, a), bp(W / 2 + BW, BL - 4, 2, a)));
    const [tx, tz] = tip(a), hz = Math.max(tz - 30, 6);
    cable.setAttribute("d", seg(P(tx, W / 2, tz), P(tx, W / 2, hz)));
    hb.setAttribute("d", poly(hull([P(tx - 4, W / 2 - 4, hz), P(tx + 4, W / 2 + 4, hz), P(tx - 4, W / 2 - 4, hz - CAB), P(tx + 4, W / 2 + 4, hz - CAB), P(tx + 4, W / 2 - 4, hz), P(tx - 4, W / 2 + 4, hz - CAB)])));
    const hp = [];
    for (let i = 0; i <= 10; i++) { const t = Math.PI * (i / 10) * 1.3; hp.push(P(tx + 6 * Math.sin(t), W / 2, hz - CAB - 6 + 6 * Math.cos(t + Math.PI))); }
    hook.setAttribute("d", "M" + hp.map((p) => p.join(",")).join("L"));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(a, r) { ang.t = a; read.textContent = r ? "rest" : Math.round(a) + "°"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST + clamp((340 - sx) / 220, 0, 1) * (max - REST)), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "towtruck",
  means: "A tow truck with a long boom hinged on its deck: the pointer raises the boom, the winch hook climbing at its tip.",
  rules: [1, 3, 5, 6],
  range: [25, 45, 60],
  tour: [[116, 122], [200, 150], [147, 73], null],
  mount,
});
