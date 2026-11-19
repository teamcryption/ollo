/**
 * Off-road jeep: a boxy body on four big wheels, the rear door hinged at one
 * side with the spare wheel bolted to it. The pointer's place across the
 * frame swings the door open, the spare wheel riding out with it. At rest the
 * door stands just ajar and the spare tyre is bright. The slider is how far
 * the door opens.
 *
 * The pattern: one hinged part (swing).
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rad, rings, ringAt, rrect, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 110, W = 62, Z0 = 12, ZB = 40, ZT = 66, HY = W - 3, GW = W - 6, R = 18, REST = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [L, W, 0], [L + GW + 14, HY, 0], [0, 0, ZT], [L, W, ZT], [L + GW, HY, ZT]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y, r) => {
    const pts = [];
    for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2; pts.push(P(x + r * Math.cos(t), y, 16 + r * Math.sin(t))); }
    return pts;
  };
  for (const x of [24, 88]) mk("path", { d: poly(wheel(x, 2, 16)) }, g);
  const [br, bi] = rings(0, 4, L, W - 4, 6, 1.4);
  put(solid(g), prism(P, front, br, bi, Z0, ZB));
  const foot = rrect(34, 4, L, W - 4, 6, 6), top = rrect(44, 8, L - 2, W - 8, 5, 6), inner = rrect(46, 10, L - 4, W - 10, 4, 6);
  const cab = solid(g);
  cab.sil.setAttribute("d", poly(hull(ringAt(P, foot, ZB).concat(ringAt(P, top, ZT)))));
  mk("path", { d: seg(P(38, W - 4, ZB + 2), P(46, W - 8, ZT - 2)), class: "nf lo" }, g);
  mk("path", { d: seg(P(72, W - 4, ZB + 2), P(72, W - 8, ZT - 2)), class: "nf lo" }, g);
  mk("path", { d: seg(P(4, W - 4, ZB - 3), P(34, W - 4, ZB - 3)), class: "nf lo" }, g);
  for (const x of [24, 88]) { mk("path", { d: poly(wheel(x, W, 16)) }, g); mk("path", { d: poly(wheel(x, W, 7)), class: "nf lo" }, g); }
  const gate = mk("path", {}, g), win = mk("path", { class: "nf lo" }, g);
  const tyre = mk("path", { class: "sil hi" }, g), hub = mk("path", { class: "nf lo" }, g);
  const ang = spring(REST);
  let last = NaN;

  // a point on the door: d along it from the hinge, n out from its face, z up
  const gp = (a, d, n, z) => P(L + d * Math.sin(rad(a)) + n * Math.cos(rad(a)), HY - d * Math.cos(rad(a)) + n * Math.sin(rad(a)), z);
  const ring = (a, n, r) => {
    const pts = [];
    for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2; pts.push(gp(a, GW / 2 + r * Math.cos(t), n, 34 + r * Math.sin(t))); }
    return pts;
  };
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const d of [0, GW]) for (const n of [0, 3]) for (const z of [Z0 + 2, ZT - 4]) pts.push(gp(a, d, n, z));
    gate.setAttribute("d", poly(hull(pts)));
    win.setAttribute("d", poly([gp(a, 6, 3, ZT - 8), gp(a, GW - 6, 3, ZT - 8), gp(a, GW - 6, 3, ZB + 4), gp(a, 6, 3, ZB + 4)]));
    tyre.setAttribute("d", poly(hull(ring(a, 4, R).concat(ring(a, 13, R)))));
    hub.setAttribute("d", poly(ring(a, 13, 8)));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(a, r) { ang.t = a; read.textContent = r ? "rest" : Math.round(a) + "°"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST + clamp((sx - 60) / 240, 0, 1) * (max - REST)), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "jeep",
  means: "An off-road jeep with its spare wheel on a side-hinged rear door: the pointer swings the door open, the wheel riding out on it.",
  rules: [1, 3, 5, 6],
  range: [50, 85, 115],
  tour: [[224, 162], [262, 178], [125, 136], null],
  mount,
});
