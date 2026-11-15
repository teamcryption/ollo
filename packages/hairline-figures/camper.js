/**
 * Camper van: a boxy van on four wheels with a pop-top roof hinged at the
 * rear, a pleated canvas wall under it. The pointer's place along the van
 * sets how far the roof tilts open: over the tail it stays shut, toward
 * the cab it rises. At rest it is cracked open, bright. The slider is the
 * widest the roof may open.
 *
 * The pattern: one part turning on a hinge (continuous).
 */
const {
  Cam, clamp, fillet, fit, facing, hull, lerp, open, poly, prism, proj, rad, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const LX = 96, NX = 122, W = 48, Z0 = 8, ZT = 52, R0 = 4, R1 = 92, T = 4, REST = 7;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.86);
  fit(C, [[0, 0, 0], [NX, W, 0], [NX, 0, 0], [0, W, 0], [R1, 0, 96], [R1, W, 96]], 200, 172);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, LX, W, 7, 2);
  put(solid(g), prism(P, front, br, bi, Z0, ZT));
  const [hr, hi] = rings(LX - 6, 1, NX, W - 1, 8, 2);
  put(solid(g), prism(P, front, hr, hi, Z0, 30));
  const det = mk("path", { class: "nf lo" }, g);
  const sq = (pts) => poly(fillet(pts, pts.map(() => 2), 3));
  det.setAttribute("d", [
    sq([P(LX, 6, 48), P(LX, W - 6, 48), P(LX, W - 6, 33), P(LX, 6, 33)]),
    sq([P(70, W, 48), P(88, W, 48), P(88, W, 34), P(70, W, 34)]),
    sq([P(12, W, 46), P(58, W, 46), P(58, W, 34), P(12, W, 34)]),
  ].join("") + seg(P(64, W, 12), P(64, W, 48)) + seg(P(NX, 8, 22), P(NX, W - 8, 22)));
  for (const wx of [24, 100]) {
    const ring = (r) => { const q = []; for (let i = 0; i < 24; i++) { const t = (i / 24) * 2 * Math.PI; q.push(P(wx + r * Math.cos(t), W + 0.5, 11 + r * Math.sin(t))); } return q; };
    mk("path", { d: poly(ring(11)) }, g);
    mk("path", { d: poly(ring(4.5)), class: "nf lo" }, g);
  }
  const roof = mk("path", { class: "sil" }, g), roofCr = mk("path", { class: "nf lo" }, g);
  const wallF = mk("path", { class: "lo" }, g), wallS = mk("path", { class: "lo" }, g), pleat = mk("path", { class: "nf lo" }, g);
  let last = NaN, on = false;
  function draw(a) {
    a = Math.round(a * 10) / 10;
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), L = R1 - R0;
    const w = (u, y, t) => [R0 + u * c - t * s, y, ZT + u * s + t * c];
    const pt = (u, y, t) => P(...w(u, y, t));
    const pts = [];
    for (const y of [1, W - 1]) for (const u of [0, L]) for (const t of [0, T]) pts.push(pt(u, y, t));
    const h = hull(pts);
    roof.setAttribute("d", poly(fillet(h, h.map(() => 3), 3)));
    roofCr.setAttribute("d", open([pt(4, 3.5, T), pt(L - 4, 3.5, T), pt(L - 4, W - 3.5, T)]));
    const fx = w(L, 0, 0)[0], fz = w(L, 0, 0)[2];
    wallF.setAttribute("d", poly([P(R1, 2, ZT), P(R1, W - 2, ZT), P(fx, W - 2, fz), P(fx, 2, fz)]));
    wallS.setAttribute("d", poly([P(R0, W - 2, ZT), P(R1, W - 2, ZT), P(fx, W - 2, fz)]));
    let pl = "";
    for (const k of [0.35, 0.65]) { const zz = ZT + (fz - ZT) * k; pl += seg(P(R0 + (R1 - R0) * k, W - 2, ZT + (fz - ZT) * k * k), P(R1 + (fx - R1) * k, W - 2, zz)); }
    pleat.setAttribute("d", a > 1.5 ? pl : "");
    read.textContent = on ? "roof " + Math.round(a) + "°" : "rest";
  }
  const ang = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function aim(p) {
    on = !!p; last = NaN;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      if (wy < -40 || wy > W + 40 || wx < -40 || wx > NX + 40) return aim(null);
      ang.t = clamp(lerp(0, maxA, (wx + 10) / (NX + 20)), 0, maxA);
    } else ang.t = REST;
    B.wake();
  }
  roof.classList.add("hi");
  draw(REST);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "camper",
  means: "A camper van with a pop-top roof: the pointer's place along the van tilts the roof open on its rear hinge, over a pleated canvas wall.",
  rules: [1, 3, 5, 8],
  range: [14, 20, 26],
  tour: [[264, 203], [199, 135], [120, 163], null],
  mount,
});
