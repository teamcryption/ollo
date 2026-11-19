/**
 * Hook lift truck: a cab up front and a roll-off container on the chassis,
 * held by an L-shaped hook arm pivoted at the tail. The pointer swings the
 * arm back: the container tips up and rolls off past the tail, its rear
 * dipping to the ground. At rest the hook arm is bright. The slider is how
 * far the arm swings.
 *
 * The pattern: one hinged part (swing) carrying a sliding load.
 */
const { Cam, clamp, facing, fit, hull, open, poly, prism, proj, rad, rings, ringAt, rrect, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 150, W = 54, Z0 = 9, ZB = 20, BL = 100, BH = 28, REST = 4, SLIDE = 20;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.75);
  const bp = (y, d, zl, a, s) => P0(4 + (d - s) * Math.cos(rad(a)) - zl * Math.sin(rad(a)), y, ZB + 2 + (d - s) * Math.sin(rad(a)) + zl * Math.cos(rad(a)));
  let P0 = (x, y, z) => [x, y, z];
  const ext = [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [L, W, 60]];
  for (const a of [REST, 50]) for (const y of [0, W]) for (const d of [0, BL + 10]) for (const zl of [0, BH + 18]) ext.push(bp(y, d, zl, a, SLIDE * clamp((a - REST) / 46, 0, 1)));
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  P0 = P;
  const g = mk("g", {}, svg);
  const wheel = (x, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(x + 11 * Math.cos(t), y, 11 + 11 * Math.sin(t))); }
    return pts;
  };
  for (const x of [22, 46, 128]) mk("path", { d: poly(wheel(x, 4)) }, g);
  const [chr, chi] = rings(0, 6, L, W - 6, 3, 1);
  put(solid(g), prism(P, front, chr, chi, Z0, ZB - 1));
  const box = mk("path", { class: "sil" }, g), rim = mk("path", { class: "nf lo" }, g);
  const post = mk("path", { class: "sil hi" }, g), hook = mk("path", { class: "nf hi" }, g);
  const foot = rrect(112, 0, L, W, 7, 6), top = rrect(114, 3, L - 12, W - 3, 5, 6);
  const cab = solid(g);
  cab.sil.setAttribute("d", poly(hull(ringAt(P, foot, ZB - 2).concat(ringAt(P, foot, 36), ringAt(P, top, 60)))));
  mk("path", { d: seg(P(L - 2, W - 6, 38), P(L - 12, W - 6, 57)), class: "nf lo" }, g);
  for (const x of [22, 46, 128]) mk("path", { d: poly(wheel(x, W - 4)) }, g);
  const ang = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const s = SLIDE * clamp((a - REST) / 46, 0, 1), pts = [], pp = [];
    for (const y of [2, W - 2]) for (const d of [2, BL]) for (const zl of [0, BH]) pts.push(bp(y, d, zl, a, s));
    box.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly([bp(6, 6, BH, a, s), bp(6, BL - 4, BH, a, s), bp(W - 6, BL - 4, BH, a, s), bp(W - 6, 6, BH, a, s)]) + open([bp(W - 2, 34, 2, a, s), bp(W - 2, 34, BH - 2, a, s)]) + open([bp(W - 2, 68, 2, a, s), bp(W - 2, 68, BH - 2, a, s)]));
    for (const y of [W / 2 - 7, W / 2 + 7]) for (const d of [BL + 2, BL + 10]) for (const zl of [0, BH + 16]) pp.push(bp(y, d, zl, a, 0));
    post.setAttribute("d", poly(hull(pp)));
    hook.setAttribute("d", open([bp(W / 2, BL + 6, BH + 16, a, 0), bp(W / 2, BL - 4, BH + 16, a, 0), bp(W / 2, BL - 7, BH + 10, a, 0), bp(W / 2, BL - 2, BH + 8, a, 0)]));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  const HX = P(BL + 4, W / 2, ZB + BH + 16)[0];

  function aim(a, r) { ang.t = a; read.textContent = r ? "rest" : Math.round(a) + "°"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST + clamp((HX + 90 - sx) / 90, 0, 1) * (max - REST)), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "hooklift",
  means: "A hook lift truck with an L-shaped arm at the tail: the pointer swings the arm back, tipping the container up and rolling it off.",
  rules: [1, 3, 5, 6],
  range: [20, 40, 50],
  tour: [[263, 170], [168, 186], [287, 221], null],
  mount,
});
