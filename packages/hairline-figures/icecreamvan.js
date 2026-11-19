/**
 * Ice cream van: a tall boxy van with a serving hatch along its near side and
 * a cone standing on its roof. The pointer's place across the frame swings
 * the hatch's awning up and out on its top hinge, opening the counter. At
 * rest the awning is cracked open, bright. The slider is how far it opens.
 *
 * The pattern: one hinged part (swing).
 */
const { Cam, circ, clamp, facing, fit, hull, poly, prism, proj, rad, rings, ringAt, rrect, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 140, W = 56, Z0 = 9, ZB = 20, ZT = 76, HX0 = 14, HX1 = 108, ZH = 66, ZC = 30, AL = 38, REST = 8;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [HX0, W + AL, ZH + 8], [HX1, W + AL, ZH], [60, W / 2, ZT + 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(x + 11 * Math.cos(t), y, 11 + 11 * Math.sin(t))); }
    return pts;
  };
  for (const x of [26, 116]) mk("path", { d: poly(wheel(x, 4)) }, g);
  const [chr, chi] = rings(0, 6, L, W - 6, 3, 1);
  put(solid(g), prism(P, front, chr, chi, Z0, ZB - 1));
  const foot = rrect(0, 0, L, W, 8, 6), top = rrect(0, 2, L - 26, W - 2, 7, 6), inner = rrect(2, 4, L - 28, W - 4, 5, 6);
  const body = solid(g);
  body.sil.setAttribute("d", poly(hull(ringAt(P, foot, ZB - 2).concat(ringAt(P, foot, 50), ringAt(P, top, ZT)))));
  body.cr.setAttribute("d", poly(ringAt(P, inner, ZT)));
  mk("path", { d: poly([P(HX0, W, ZC), P(HX1, W, ZC), P(HX1, W - 1, ZH - 2), P(HX0, W - 1, ZH - 2)]), class: "nf lo" }, g);
  mk("path", { d: seg(P(L - 4, W - 6, 52), P(L - 22, W - 6, 72)), class: "nf lo" }, g);
  const cone = [];
  cone.push(...ringAt(P, disc(60, W / 2, 2, 12), ZT), ...ringAt(P, disc(60, W / 2, 8, 20), ZT + 18));
  mk("path", { d: poly(hull(cone)) }, g);
  const scoop = [];
  for (const [r, z] of [[8, 18], [9, 22], [7, 27], [3, 30]]) scoop.push(...ringAt(P, disc(60, W / 2, r, 20), ZT + z));
  mk("path", { d: poly(hull(scoop)) }, g);
  for (const x of [26, 116]) mk("path", { d: poly(wheel(x, W - 4)) }, g);
  const awn = mk("path", { class: "sil hi" }, g), edge = mk("path", { class: "nf lo" }, g);
  const ang = spring(REST);
  let last = NaN;
  const ap = (x, s, a) => P(x, W + s * Math.sin(rad(a)), ZH - s * Math.cos(rad(a)));
  function draw(a) {
    if (a === last) return;
    last = a;
    awn.setAttribute("d", poly([ap(HX0 - 3, 0, a), ap(HX1 + 3, 0, a), ap(HX1 + 3, AL, a), ap(HX0 - 3, AL, a)]));
    edge.setAttribute("d", seg(ap(HX0, AL - 3, a), ap(HX1, AL - 3, a)) + seg(ap(HX0, AL / 2, a), ap(HX1, AL / 2, a)));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function aim(a, r) { ang.t = a; read.textContent = r ? "rest" : Math.round(a) + "°"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST + clamp((330 - sx) / 160, 0, 1) * (max - REST)), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "icecreamvan",
  means: "An ice cream van with a cone on its roof: the pointer swings the serving hatch's awning up and out over the counter.",
  rules: [1, 3, 5, 6],
  range: [60, 90, 115],
  tour: [[262, 250], [220, 190], [170, 141], null],
  mount,
});
