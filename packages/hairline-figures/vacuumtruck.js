/**
 * Vacuum truck: a cab up front and a long round tank on the chassis, with a
 * boom on a turret over the tank's front and a suction hose hanging from its
 * tip. The pointer swings the boom out round the turret, the hose swinging
 * with it. At rest the boom lies back over the tank, bright. The slider is
 * how far it swings.
 *
 * The pattern: one part turning about a vertical axis (swing).
 */
const { Cam, clamp, facing, fit, hull, open, poly, prism, proj, rad, rings, ringAt, rrect, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 164, W = 52, Z0 = 9, ZB = 20, R = 23, TX0 = 6, TX1 = 118, TX = 104, TZ = ZB + 2 * R + 2, BL = 88, REST = 160;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.5);
  const tip = (f) => [TX + BL * Math.cos(rad(f)) * Math.cos(rad(12)), W / 2 + BL * Math.sin(rad(f)) * Math.cos(rad(12)), TZ + 8 + BL * Math.sin(rad(12))];
  const ext = [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [0, 0, TZ + 30]];
  for (const f of [REST, 130, 100, 80, 60]) { const t = tip(f); ext.push(t, [t[0], t[1], 2]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(x + 11 * Math.cos(t), y, 11 + 11 * Math.sin(t))); }
    return pts;
  };
  const ringX = (x, a0, a1) => { const pts = []; for (let i = 0; i <= 24; i++) { const t = rad(a0 + ((a1 - a0) * i) / 24); pts.push(P(x, W / 2 + R * Math.cos(t), ZB + R + 1 + R * Math.sin(t))); } return pts; };
  for (const x of [22, 46, 138]) mk("path", { d: poly(wheel(x, 4)) }, g);
  const [chr, chi] = rings(0, 6, L, W - 6, 3, 1);
  put(solid(g), prism(P, front, chr, chi, Z0, ZB - 1));
  const tank = solid(g);
  tank.sil.setAttribute("d", poly(hull(ringX(TX0, 0, 360).concat(ringX(TX1, 0, 360)))));
  tank.cr.setAttribute("d", open(ringX(TX1 - 3, -60, 140)) + open(ringX(40, -60, 140)) + open(ringX(80, -60, 140)));
  const [tr, ti] = rings(TX - 8, W / 2 - 8, TX + 8, W / 2 + 8, 8, 1.4);
  put(solid(g), prism(P, front, tr, ti, TZ - 4, TZ + 6));
  const foot = rrect(124, 0, L, W, 7, 6), top = rrect(126, 3, L - 12, W - 3, 5, 6);
  const cab = solid(g);
  cab.sil.setAttribute("d", poly(hull(ringAt(P, foot, ZB - 2).concat(ringAt(P, foot, 36), ringAt(P, top, 60)))));
  mk("path", { d: seg(P(L - 2, W - 6, 38), P(L - 12, W - 6, 57)), class: "nf lo" }, g);
  for (const x of [22, 46, 138]) mk("path", { d: poly(wheel(x, W - 4)) }, g);
  const hose = mk("path", { class: "nf" }, g), boom = mk("path", { class: "sil hi" }, g);
  const ang = spring(REST);
  let last = NaN;

  function draw(f) {
    if (f === last) return;
    last = f;
    const c = Math.cos(rad(f)), s = Math.sin(rad(f)), pts = [];
    for (const d of [0, BL]) for (const w of [-3, 3]) for (const h of [-3, 3]) pts.push(P(TX + d * c * Math.cos(rad(12)) - w * s, W / 2 + d * s * Math.cos(rad(12)) + w * c, TZ + 8 + d * Math.sin(rad(12)) + h));
    boom.setAttribute("d", poly(hull(pts)));
    const [x, y, z] = tip(f), hp = [];
    for (let i = 0; i <= 10; i++) { const u = i / 10; hp.push(P(x + 10 * c * Math.sin(u * Math.PI) , y + 10 * s * Math.sin(u * Math.PI), z - 3 - u * (z - 8))); }
    hose.setAttribute("d", open(hp) + seg(hp[10], P(x + 6 * c, y + 6 * s, 2)));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  const XT = P(TX, W / 2, TZ)[0];

  function aim(f, r) { ang.t = f; read.textContent = r ? "rest" : Math.round(REST - f) + "°"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST - clamp((XT + 20 - sx) / 70, 0, 1) * max), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "vacuumtruck",
  means: "A vacuum truck with a boom on a turret over its tank: the pointer swings the boom out round the turret, its suction hose swinging along.",
  rules: [1, 3, 5, 6],
  range: [50, 80, 100],
  tour: [[160, 127], [141, 165], [250, 220], null],
  mount,
});
