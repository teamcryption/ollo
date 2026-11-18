/**
 * Side-by-side UTV: two seats under a tubular roll cage, a short hood up front
 * and a dump bed behind the cage, hinged at its tail. The pointer's place
 * across the frame tips the bed up on its hinge, its front rising over the
 * cage. At rest the bed is cracked up a few degrees, bright. The slider is
 * how far it tips.
 *
 * The pattern: one hinged part (swing).
 */
const { Cam, clamp, facing, fit, hull, open, poly, prism, proj, rad, rings, ringAt, rrect, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 136, W = 60, Z0 = 14, ZB = 24, BL = 62, BH = 20, R = 14, REST = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [2 + BL * Math.cos(rad(55)), 0, ZB + BL * Math.sin(rad(55)) + BH * Math.cos(rad(55))], [0, W, ZB + BH], [100, 0, 70]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(x + R * Math.cos(t), y, R + R * Math.sin(t))); }
    return pts;
  };
  const hub = (x, y) => {
    const pts = [];
    for (let i = 0; i < 12; i++) { const t = (i / 12) * Math.PI * 2; pts.push(P(x + 5 * Math.cos(t), y, R + 5 * Math.sin(t))); }
    return pts;
  };
  for (const x of [26, 112]) mk("path", { d: poly(wheel(x, 6)) }, g);
  const [chr, chi] = rings(0, 8, L, W - 8, 4, 1.2);
  put(solid(g), prism(P, front, chr, chi, Z0, ZB - 1));
  const bed = mk("path", { class: "sil hi" }, g), rim = mk("path", { class: "nf lo" }, g);
  const seats = solid(g);
  put(seats, prism(P, front, ...rings(70, 10, 88, W - 10, 3, 1), ZB - 1, 36));
  for (const y of [12, W - 12]) mk("path", { d: seg(P(70, y, 36), P(66, y, 50)), class: "nf lo" }, g);
  const foot = rrect(104, 6, L, W - 6, 8, 6), top = rrect(106, 9, L - 6, W - 9, 6, 6);
  const hood = solid(g);
  hood.sil.setAttribute("d", poly(hull(ringAt(P, foot, ZB - 2).concat(ringAt(P, top, 36)))));
  mk("path", { d: open(ringAt(P, rrect(108, 12, L - 9, W - 12, 4, 4), 36)), class: "nf lo" }, g);
  for (const y of [6, W - 6]) mk("path", { d: open([P(66, y, ZB), P(70, y, 66), P(102, y, 66), P(108, y, 38)]), class: "nf" }, g);
  for (const x of [70, 102]) mk("path", { d: seg(P(x, 6, 66), P(x, W - 6, 66)), class: "nf" }, g);
  for (const x of [26, 112]) { mk("path", { d: poly(wheel(x, W - 6)) }, g); mk("path", { d: poly(hub(x, W - 6)), class: "nf lo" }, g); }
  const ang = spring(REST);
  let last = NaN;

  const bp = (y, d, zl, a) => P(2 + d * Math.cos(rad(a)) - zl * Math.sin(rad(a)), y, ZB + d * Math.sin(rad(a)) + zl * Math.cos(rad(a)));
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const y of [4, W - 4]) for (const d of [0, BL]) for (const zl of [0, BH]) pts.push(bp(y, d, zl, a));
    bed.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly([bp(8, 4, BH, a), bp(8, BL - 4, BH, a), bp(W - 8, BL - 4, BH, a), bp(W - 8, 4, BH, a)]));
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
  name: "utv",
  means: "A side-by-side UTV with a dump bed hinged behind its roll cage: the pointer tips the bed up, its front rising over the cage.",
  rules: [1, 3, 5, 6],
  range: [24, 42, 55],
  tour: [[260, 250], [190, 160], [140, 140], null],
  mount,
});
