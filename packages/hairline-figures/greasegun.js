/**
 * Grease gun: a barrel lying on its side, a head at the front with a bent
 * nozzle, and a long lever hinged on the head. The pointer along the gun
 * pumps the lever up on a spring, higher toward the barrel's back; at rest
 * the lever lies cocked a little, bright. The slider is the lever's throw.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, clamp, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = 0, X1 = 80, R = 13, CY = 0, CZ = R + 2, HL0 = 14, LL = 78, REST = 9;
const ringX = (x, y, z, r, n = 32) => circ(r, n).map((q) => [x, y + q.u, z + q.v]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[X0, -R, 0], [X1 + 34, R, 0], [X1 + 10 - LL * Math.cos(1.1), 0, CZ + R + 6 + LL * Math.sin(1.1)], [X0, R, 0]], 200, 170);
  const P = proj(C), front = facing(C);
  const pr = (pts) => pts.map((p) => P(p[0], p[1], p[2]));
  const g = mk("g", {}, svg);
  const cap = (a, b, r, cls) => mk("path", { d: poly(hull(pr(ringX(...a, r, 16).concat(ringX(...b, r, 16))))), class: cls }, g);
  mk("path", { d: poly(hull(pr(ringX(X0, CY, CZ, R).concat(ringX(X1, CY, CZ, R))))), class: "sil" }, g);
  for (const x of [X0 + 8, X1 - 10]) mk("path", { d: poly(pr(ringX(x, CY, CZ, R + 0.01))).replace(/Z$/, ""), class: "nf lo" }, g);
  cap([X0 - 4, CY, CZ], [X0, CY, CZ], 4, "sil");
  const [hr, hi] = rings(X1, CY - R - 2, X1 + HL0, CY + R + 2, 4, 1.5);
  put(solid(g), prism(P, front, hr, hi, 1, CZ + R + 4));
  cap([X1 + HL0, CY, CZ + 6], [X1 + 26, CY, CZ + 6], 2.6, "sil");
  cap([X1 + 26, CY, CZ + 6], [X1 + 32, CY, CZ - 6], 2.6, "sil");
  const lever = mk("path", { class: "sil hi" }, g), grip = mk("path", { class: "nf lo" }, g);
  const pv = [X1 + 8, CY, CZ + R + 6];
  const ang = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180, end = [pv[0] - LL * Math.cos(a), CY, pv[2] + LL * Math.sin(a)];
    lever.setAttribute("d", poly(hull(pr(ringX(...pv, 4, 16).concat(ringX(...end, 3.2, 16))))));
    const m = [pv[0] - LL * 0.62 * Math.cos(a), CY, pv[2] + LL * 0.62 * Math.sin(a)];
    grip.setAttribute("d", poly(pr(ringX(...m, 3.6, 16))));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, CZ);
    if (x < X0 - 10 || x > X1 + 36 || Math.abs(y) > 40) return leave();
    const t = clamp(1 - (x - X0) / (X1 + 30 - X0), 0, 1);
    ang.t = REST + (maxA - REST) * (0.4 + 0.6 * t);
    read.textContent = Math.round(ang.t) + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "greasegun",
  means: "A lever grease gun on its side: the pointer along the barrel pumps the long lever up, higher toward the back.",
  rules: [1, 3, 5, 8],
  range: [30, 55, 63],
  tour: [[125, 142], [176, 168], [295, 227], null],
  mount,
});
