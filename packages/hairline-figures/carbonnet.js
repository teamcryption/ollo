/**
 * Car bonnet: a small car, wheels, cabin and a long bonnet hinged at the
 * windscreen over the engine bay. The pointer's place across the frame lifts
 * the bonnet up off the bay toward the glass. At rest the bonnet sits ajar,
 * bright. The slider is how far it can lift.
 *
 * The pattern: one hinged part (swing).
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rad, rings, ringAt, rrect, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 120, W = 54, Z0 = 8, ZB = 26, HX = 62, REST = 7;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.0);
  const BL = L - HX;
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [0, W / 2, 44], [HX + BL * Math.cos(rad(80)), 0, ZB + BL * Math.sin(rad(80))]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(x + 9 * Math.cos(t), y, 9 + 9 * Math.sin(t))); }
    return pts;
  };
  for (const x of [22, 98]) mk("path", { d: poly(wheel(x, 2)) }, g);
  const [br, bi] = rings(0, 0, L, W, 10, 2);
  put(solid(g), prism(P, front, br, bi, Z0, ZB));
  const foot = rrect(18, 3, HX + 2, W - 3, 6, 6), top = rrect(28, 7, HX - 12, W - 7, 5, 6);
  const cab = solid(g);
  cab.sil.setAttribute("d", poly(hull(ringAt(P, foot, ZB).concat(ringAt(P, top, 46)))));
  // engine bay under the bonnet
  const [er] = rings(HX + 8, 10, L - 10, W - 10, 4, 1);
  mk("path", { d: poly(ringAt(P, er, ZB + 0.3)), class: "nf lo" }, g);
  mk("path", { d: poly(hull(ringAt(P, rrect(HX + 18, 18, HX + 40, W - 18, 3, 4), ZB).concat(ringAt(P, rrect(HX + 18, 18, HX + 40, W - 18, 3, 4), ZB + 8)))), class: "lo" }, g);
  for (const x of [22, 98]) mk("path", { d: poly(wheel(x, W - 2)) }, g);
  const hood = mk("path", { class: "sil hi" }, g), ridge = mk("path", { class: "nf lo" }, g);
  const ang = spring(REST);
  let last = NaN;

  const hp = (y, d, zl, a) => P(HX + d * Math.cos(rad(a)) - zl * Math.sin(rad(a)), y, ZB + 0.5 + d * Math.sin(rad(a)) + zl * Math.cos(rad(a)));
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const y of [1, 4, W - 4, W - 1]) for (const d of [0, BL - 4, BL]) for (const zl of [0, 2]) {
      const yy = d === BL && (y === 1 || y === W - 1) ? (y === 1 ? 6 : W - 6) : y;
      pts.push(hp(yy, d, zl, a));
    }
    hood.setAttribute("d", poly(hull(pts)));
    ridge.setAttribute("d", seg(hp(W / 2 - 8, 3, 2, a), hp(W / 2 - 8, BL - 6, 2, a)) + seg(hp(W / 2 + 8, 3, 2, a), hp(W / 2 + 8, BL - 6, 2, a)));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(a, r) { ang.t = a; read.textContent = r ? "rest" : Math.round(a) + "°"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST + clamp((sx - 60) / 260, 0, 1) * (max - REST)), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "carbonnet",
  means: "A small car with a long bonnet hinged at the windscreen: the pointer lifts the bonnet off the engine bay.",
  rules: [1, 3, 5, 6],
  range: [40, 62, 80],
  tour: [[238, 128], [271, 205], [247, 278], null],
  mount,
});
