/**
 * Steam locomotive: a round boiler on a running board, a chimney and dome on
 * top, the cab at the back, and three driving wheels each side tied together
 * by a coupling rod. The pointer's place across the frame turns the driving
 * wheels, the rod sweeping round on its crank pins. At rest the rod sits
 * bright, a quarter turn in. The slider is how far the wheels turn.
 *
 * The pattern: one linkage turning (turn).
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rad, rings, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 160, W = 40, ZF = 24, ZR = 30, BZ = 50, BR = 17, WR = 15, WZ = 16, PIN = 9, XS = [56, 88, 120], REST = 40;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-48, 0, 0], [L + 48, W + 9, 0], [-34, 0, 92], [L + 34, W, 92]], 200, 160);
  const P = proj(C), front = facing(C);
  for (const y of [0, W]) mk("path", { d: seg(P(-50, y, 0), P(L + 50, y, 0)), class: "nf lo" }, svg);
  const g = mk("g", {}, svg);
  const o = P(0, 0, 0), u = P(1, 0, 0);
  const disc = (x, y, z, r, n) => {
    const pts = [];
    for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; pts.push(P(x + r * Math.cos(t), y, z + r * Math.sin(t))); }
    return pts;
  };
  const yz = (x, r) => {
    const pts = [];
    for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2; pts.push(P(x, W / 2 + r * Math.cos(t), BZ + r * Math.sin(t))); }
    return pts;
  };
  for (const x of XS) mk("path", { d: poly(disc(x, 2, WZ, WR, 28)) }, g);
  mk("path", { d: poly(disc(L - 14, 2, 11, 9, 20)) }, g);
  const [fr, fi] = rings(0, 0, L + 6, W, 2, 0.8);
  put(solid(g), prism(P, front, fr, fi, ZF, ZR));
  const [cr, ci] = rings(2, 1, 40, W - 1, 4, 1.4);
  put(solid(g), prism(P, front, cr, ci, ZR, 82));
  const [rr, ri] = rings(-4, -3, 44, W + 3, 4, 1.2);
  put(solid(g), prism(P, front, rr, ri, 82, 86));
  mk("path", { d: poly([P(14, W + 0.2, 72), P(32, W + 0.2, 72), P(32, W + 0.2, 56), P(14, W + 0.2, 56)]), class: "nf lo" }, g);
  mk("path", { d: poly(hull(yz(40, BR).concat(yz(L, BR)))) }, g);
  mk("path", { d: poly(yz(L, BR)) }, g);
  mk("path", { d: poly(yz(L + 0.1, 8)), class: "nf lo" }, g);
  const [dr, di] = rings(92, W / 2 - 6, 104, W / 2 + 6, 6, 1.2);
  put(solid(g), prism(P, front, dr, di, BZ + 12, BZ + 24));
  const [sr, si] = rings(L - 22, W / 2 - 5, L - 10, W / 2 + 5, 5, 1);
  put(solid(g), prism(P, front, sr, si, BZ + 12, 92));
  mk("path", { d: poly(disc(L - 14, W, 11, 9, 20)) }, g);
  for (const x of XS) mk("path", { d: poly(disc(x, W, WZ, WR, 28)) }, g);
  const [yr, yi] = rings(L - 14, W + 1, L + 8, W + 9, 3, 1);
  put(solid(g), prism(P, front, yr, yi, WZ - 7, WZ + 7));
  const spokes = mk("path", { class: "nf lo" }, g);
  const rod = mk("path", { class: "sil hi" }, g), main = mk("path", {}, g), pist = mk("path", { class: "nf" }, g);
  const ang = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const t = -rad(a), ox = -34 + rad(a - REST) * WR;
    g.setAttribute("transform", "translate(" + ((u[0] - o[0]) * ox).toFixed(2) + " " + ((u[1] - o[1]) * ox).toFixed(2) + ")");
    let d = "";
    for (const x of XS) for (let k = 0; k < 6; k++) {
      const s = t + (k * Math.PI) / 6;
      d += seg(P(x - (WR - 2) * Math.cos(s), W, WZ + (WR - 2) * Math.sin(s)), P(x + (WR - 2) * Math.cos(s), W, WZ - (WR - 2) * Math.sin(s)));
    }
    spokes.setAttribute("d", d);
    const px = PIN * Math.cos(t), pz = -PIN * Math.sin(t);
    const pts = [];
    for (const x of [XS[0] - 3, XS[2] + 3]) for (const dz of [-2.4, 2.4]) pts.push(P(x + px, W + 3, WZ + pz + dz));
    rod.setAttribute("d", poly(hull(pts)));
    const mx = XS[1] + px, mz = WZ + pz, cx = mx + Math.sqrt(52 * 52 - (WZ - mz) * (WZ - mz));
    const bar = (x0, z0, x1, z1, y, h) => poly(hull([P(x0, y, z0 - h), P(x0, y, z0 + h), P(x1, y, z1 - h), P(x1, y, z1 + h)]));
    main.setAttribute("d", bar(mx, mz, cx, WZ, W + 6, 2.6));
    pist.setAttribute("d", bar(cx - 4, WZ, L - 14, WZ, W + 5, 3.2));
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
  name: "steamtrain",
  means: "A steam locomotive on its rails: the pointer rolls it along, the driving wheels turning and the coupling rod sweeping round.",
  rules: [1, 3, 5, 6],
  range: [120, 210, 300],
  tour: [[192, 211], [289, 282], [121, 153], null],
  mount,
});
