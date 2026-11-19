/**
 * Bulk milk tank: a long rounded steel tank on four short legs, the stirrer's
 * motor on its top at the front end and a broad lid hinged along the far edge
 * of the top. The pointer's place across the frame swings the lid up on its
 * hinge, opening the hatch. At rest the lid sits cracked open, bright. The
 * slider is how far it opens.
 *
 * The pattern: one hinged part (swing).
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rad, rings, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const TL = 124, TW = 70, ZL = 14, ZT = 64, X0 = 22, X1 = 84, Y0 = 13, Y1 = 58, LT = 3, REST = 7;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [TL, TW, 0], [TL, 0, 0], [0, TW, 0], [X0, Y0, ZT + (Y1 - Y0) + 4], [X1, Y0, ZT + (Y1 - Y0) + 4]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const leg = (x, y) => { const [r, i] = rings(x - 4, y - 4, x + 4, y + 4, 3, 1); put(solid(g), prism(P, front, r, i, 0, ZL + 2)); };
  leg(16, 14); leg(TL - 16, 14); leg(16, TW - 14);
  const [tr, ti] = rings(0, 0, TL, TW, 32, 2.2);
  put(solid(g), prism(P, front, tr, ti, ZL, ZT));
  leg(TL - 16, TW - 14);
  mk("path", { d: poly([P(X0 + 2, Y0 + 2, ZT), P(X1 - 2, Y0 + 2, ZT), P(X1 - 2, Y1 - 2, ZT), P(X0 + 2, Y1 - 2, ZT)]), class: "nf lo" }, g);
  mk("path", { d: seg(P(X0 + 8, (Y0 + Y1) / 2, ZT), P(X1 - 8, (Y0 + Y1) / 2, ZT)), class: "dash" }, g);
  const lid = mk("path", { class: "sil hi" }, g), lr = mk("path", { class: "nf lo" }, g);
  const [mr, mi] = rings(98, 26, 114, 44, 4, 1);
  put(solid(g), prism(P, front, mr, mi, ZT, ZT + 16));
  const ang = spring(REST);
  let last = NaN;

  const lp = (x, d, zl, a) => P(x, Y0 + d * Math.cos(rad(a)) - zl * Math.sin(rad(a)), ZT + d * Math.sin(rad(a)) + zl * Math.cos(rad(a)));
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [], D = Y1 - Y0;
    for (const x of [X0, X1]) for (const d of [0, D]) for (const zl of [0, LT]) pts.push(lp(x, d, zl, a));
    lid.setAttribute("d", poly(hull(pts)));
    lr.setAttribute("d", seg(lp(X0 + 6, D - 6, LT, a), lp(X1 - 6, D - 6, LT, a)));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(a, r) { ang.t = a; read.textContent = r ? "rest" : Math.round(a) + "°"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST + clamp((330 - sx) / 210, 0, 1) * (max - REST)), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "milktank",
  means: "A bulk milk tank on short legs with a broad lid hinged on its top: the pointer swings the lid up, opening the hatch.",
  rules: [1, 3, 5, 6],
  range: [60, 90, 110],
  tour: [[173, 125], [300, 200], [225, 55], null],
  mount,
});
