/**
 * Car transporter: a cab pulling a long two-deck trailer, a car parked on
 * the upper deck. The pointer's place across the frame tilts the upper deck
 * on its front hinge, its tail sloping down towards the road as a ramp, the
 * car riding with it. At rest it is tilted a little, bright. The slider is
 * how far it tilts.
 *
 * The pattern: one hinged part (swing).
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rad, rings, ringAt, rrect, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const W = 46, HX = 146, ZU = 58, DL = 146, REST = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.3);
  fit(C, [[-2, 0, 0], [196, W, 0], [196, 0, 60], [-2, W, ZU + 26], [-2, 0, ZU + 26], [0, W, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => { const o = []; for (let i = 0; i < 22; i++) { const t = (i / 22) * Math.PI * 2; o.push(P(x + 10 * Math.cos(t), y, 10 + 10 * Math.sin(t))); } return o; };
  for (const x of [14, 36, 120, 176]) mk("path", { d: poly(wheel(x, 3)) }, g);
  const [lr, li] = rings(0, 4, 160, W - 4, 3, 1);
  put(solid(g), prism(P, front, lr, li, 10, 16));
  for (const x of [140]) mk("path", { d: seg(P(x, 4, 16), P(x, 4, ZU)) + seg(P(x, W - 4, 16), P(x, W - 4, ZU)), class: "nf lo" }, g);
  for (const x of [14, 36, 120, 176]) mk("path", { d: poly(wheel(x, W - 3)) }, g);
  const ug = mk("g", {}, g);
  const deck = mk("path", { class: "sil hi" }, ug), rail = mk("path", { class: "nf lo" }, ug);
  const car = mk("path", { class: "sil" }, ug), belt = mk("path", { class: "nf lo" }, ug);
  const cw = [0, 1].map(() => mk("path", {}, ug));
  const foot = rrect(160, 0, 198, W, 6, 6), top = rrect(164, 3, 192, W - 3, 5, 6);
  const cab = solid(g);
  cab.sil.setAttribute("d", poly(hull(ringAt(P, foot, 12).concat(ringAt(P, foot, 34), ringAt(P, top, 58)))));
  mk("path", { d: seg(P(197, W - 6, 36), P(191, W - 6, 55)), class: "nf lo" }, g);

  const ang = spring(REST);
  let last = NaN;
  const dp = (d, y, zl, a) => P(HX - d * Math.cos(rad(a)) - zl * Math.sin(rad(a)), y, ZU - d * Math.sin(rad(a)) + zl * Math.cos(rad(a)));
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const y of [0, W]) for (const d of [0, DL]) for (const zl of [0, 3]) pts.push(dp(d, y, zl, a));
    deck.setAttribute("d", poly(hull(pts)));
    rail.setAttribute("d", poly([dp(4, 3, 3, a), dp(DL - 4, 3, 3, a), dp(DL - 4, W - 3, 3, a), dp(4, W - 3, 3, a)]));
    const cp = [];
    for (const y of [7, W - 7]) {
      for (const d of [70, 132]) for (const zl of [7, 17]) cp.push(dp(d, y, zl, a));
      for (const d of [88, 116]) cp.push(dp(d, y + (y < W / 2 ? 3 : -3), 27, a));
    }
    car.setAttribute("d", poly(hull(cp)));
    belt.setAttribute("d", seg(dp(72, W - 7, 17, a), dp(130, W - 7, 17, a)) + seg(dp(102, W - 7, 17, a), dp(102, W - 10, 27, a)));
    [80, 122].forEach((d, i) => { const o = []; for (let k = 0; k < 18; k++) { const t = (k / 18) * Math.PI * 2; o.push(dp(d + 6 * Math.cos(t), W - 6, 9 + 6 * Math.sin(t), a)); } cw[i].setAttribute("d", poly(o)); });
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
  name: "cartransporter",
  means: "A car transporter: the pointer tilts the upper deck down on its front hinge into a ramp, the car on it riding along.",
  rules: [1, 3, 5, 6],
  range: [12, 18, 23],
  tour: [[129, 106], [291, 193], [220, 150], null],
  mount,
});
