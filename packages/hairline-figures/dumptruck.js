/**
 * Dump truck: a cab up front and a deep tipper bed behind it on the chassis,
 * hinged at its tail. The pointer's place across the frame tips the bed up
 * on its hinge, its front rising high over the chassis. At rest the bed is
 * cracked up a few degrees, bright. The slider is how far it tips.
 *
 * The pattern: one hinged part (swing).
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rad, rings, ringAt, rrect, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 140, W = 54, Z0 = 9, ZB = 20, BL = 92, BH = 24, CX = 102, REST = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [2 + BL * Math.cos(rad(50)), 0, ZB + BL * Math.sin(rad(50)) + BH * Math.cos(rad(50))], [0, W, ZB + BH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(x + 11 * Math.cos(t), y, 11 + 11 * Math.sin(t))); }
    return pts;
  };
  for (const x of [22, 46, 120]) mk("path", { d: poly(wheel(x, 4)) }, g);
  const [chr, chi] = rings(0, 6, L, W - 6, 3, 1);
  put(solid(g), prism(P, front, chr, chi, Z0, ZB - 1));
  mk("path", { d: seg(P(14, W / 2, ZB - 1), P(40, W / 2, ZB + 4)), class: "nf lo" }, g);
  const bed = mk("path", { class: "sil hi" }, g), rim = mk("path", { class: "nf lo" }, g);
  const foot = rrect(CX, 0, L, W, 7, 6), top = rrect(CX + 2, 3, L - 12, W - 3, 5, 6);
  const cab = solid(g);
  cab.sil.setAttribute("d", poly(hull(ringAt(P, foot, ZB - 2).concat(ringAt(P, foot, 34), ringAt(P, top, 58)))));
  mk("path", { d: seg(P(L - 2, W - 6, 36), P(L - 12, W - 6, 55)), class: "nf lo" }, g);
  for (const x of [22, 46, 120]) mk("path", { d: poly(wheel(x, W - 4)) }, g);
  const ang = spring(REST);
  let last = NaN;

  const bp = (y, d, zl, a) => P(2 + d * Math.cos(rad(a)) - zl * Math.sin(rad(a)), y, ZB + d * Math.sin(rad(a)) + zl * Math.cos(rad(a)));
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const y of [0, W]) for (const d of [0, BL]) for (const zl of [0, BH]) pts.push(bp(y, d, zl, a));
    bed.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly([bp(4, 4, BH, a), bp(4, BL - 4, BH, a), bp(W - 4, BL - 4, BH, a), bp(W - 4, 4, BH, a)]));
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
  name: "dumptruck",
  means: "A dump truck with its tipper bed hinged at the tail: the pointer tips the bed up, its front rising over the cab.",
  rules: [1, 3, 5, 6],
  range: [20, 38, 50],
  tour: [[249, 277], [177, 150], [151, 139], null],
  mount,
});
