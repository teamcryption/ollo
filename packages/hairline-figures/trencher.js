/**
 * Trencher: a ride-on trencher, a squat wheeled body with its engine up front
 * and the seat behind, and the long chain boom hinged at the tail. The
 * pointer's place across the frame lowers the boom from its carried pose down
 * into the cut, the trench marked dashed behind it. At rest the boom rides
 * raised, bright. The slider is how deep it goes.
 *
 * The pattern: one hinged part (swing).
 */
const { Cam, clamp, facing, fit, hull, open, poly, prism, proj, rad, rings, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 74, W = 48, PZ = 30, BL = 92, BT = 7, BW = 6, REST = 32;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.75);
  const bp = (y, d, h, a) => P0(-d * Math.cos(rad(a)) - h * Math.sin(rad(a)), y, PZ + d * Math.sin(rad(a)) - h * Math.cos(rad(a)));
  let P0 = (x, y, z) => [x, y, z];
  const ext = [];
  for (const a of [REST, REST - 85]) for (const h of [-BT, BT]) ext.push(bp(W / 2, BL, h, a));
  fit(C, [[0, 0, 0], [L, W, 0], [0, W, 0], [L, 0, 0], [40, W / 2, 52], [-BL, W / 2, 0]].concat(ext), 200, 166);
  const P = proj(C), front = facing(C);
  P0 = P;
  const g = mk("g", {}, svg);
  mk("path", { d: poly([P(-BL + 6, W / 2 - 4, 0), P(-4, W / 2 - 4, 0), P(-4, W / 2 + 4, 0), P(-BL + 6, W / 2 + 4, 0)]), class: "nf dash" }, g);
  const boom = mk("path", { class: "sil hi" }, g), chain = mk("path", { class: "nf lo" }, g);
  const wheel = (x, y, r) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(x + r * Math.cos(t), y, r + r * Math.sin(t))); }
    return pts;
  };
  const wheels = (y) => { for (const x of [16, 58]) mk("path", { d: poly(wheel(x, y, 14)) }, g); };
  wheels(2);
  mk("path", { d: open([P(2, W / 2 - 6, 18), P(-3, W / 2 - 6, PZ), P(-3, W / 2 + 6, PZ), P(2, W / 2 + 6, 18)]), class: "nf" }, g);
  const [br, bi] = rings(0, 6, L, W - 6, 5, 1.4);
  put(solid(g), prism(P, front, br, bi, 12, 30));
  const [sr, si] = rings(8, 14, 24, W - 14, 4, 1.2);
  put(solid(g), prism(P, front, sr, si, 30, 38));
  mk("path", { d: seg(P(9, 16, 38), P(5, 16, 50)) + seg(P(9, W - 16, 38), P(5, W - 16, 50)), class: "nf lo" }, g);
  const [er, ei] = rings(36, 9, L - 2, W - 9, 6, 1.4);
  put(solid(g), prism(P, front, er, ei, 30, 50));
  mk("path", { d: seg(P(32, W / 2, 30), P(28, W / 2, 46)), class: "nf lo" }, g);
  wheels(W - 2);
  const ang = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const y of [W / 2 - BW, W / 2 + BW]) for (const d of [-4, BL]) for (const h of [-BT, BT]) pts.push(bp(y, d, h, a));
    boom.setAttribute("d", poly(hull(pts)));
    const yc = W / 2 + BW, ch = [];
    for (let i = 0; i <= 8; i++) { const t = -Math.PI / 2 + (i / 8) * Math.PI; ch.push(bp(yc, BL - 6 + 3.5 * Math.cos(t), 3.5 * Math.sin(t), a)); }
    chain.setAttribute("d", open([bp(yc, 4, -3.5, a)].concat(ch, [bp(yc, 4, 3.5, a)])));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(a, r) { ang.t = a; read.textContent = r ? "rest" : Math.round(a) + "°"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST - clamp((300 - sx) / 200, 0, 1) * max), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "trencher",
  means: "A ride-on trencher with its chain boom hinged at the tail: the pointer lowers the boom from carried down into the cut.",
  rules: [1, 3, 5, 6],
  range: [45, 70, 85],
  tour: [[260, 210], [122, 92], [97, 82], null],
  mount,
});
