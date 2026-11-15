/**
 * Effects pedal: a rocker pedal, a low housing with a treadle on a centre
 * pivot. The pointer's place along the pedal rocks the treadle, heel down
 * at the back, toe down at the front. At rest it leans a little toe-up,
 * bright. The slider is how far the treadle may rock.
 *
 * The pattern: one part following the pointer (rocker).
 */
const {
  Cam, fit, facing, fillet, hull, poly, prism, proj, rings, seg, clamp, rad, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 40, L = 72, BZ = 6, PZ = 18, T = 4, M = L / 2, REST = 7;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[0, 0, 0], [W, L, 0], [W, 0, 0], [0, L, 0], [W / 2, 0, PZ + 16], [W / 2, L, PZ + 16]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, L, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const [kr, ki] = rings(6, M - 6, W - 6, M + 6, 3, 1.2);
  put(solid(g), prism(P, front, kr, ki, BZ, PZ - 1));
  const tre = mk("path", { class: "sil hi" }, g), top = mk("path", { class: "nf lo" }, g), tread = mk("path", { class: "nf lo" }, g);
  const TP = (x, yl, hl, a) => P(x, M + yl * Math.cos(a) - hl * Math.sin(a), PZ + yl * Math.sin(a) + hl * Math.cos(a));

  const A = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), pts = [];
    for (const x of [2, W - 2]) for (const yl of [-M + 2, M - 2]) for (const hl of [0, T]) pts.push(TP(x, yl, hl, a));
    const hp = hull(pts);
    tre.setAttribute("d", poly(fillet(hp, hp.map(() => 4), 3)));
    const inn = [TP(5, -M + 5, T, a), TP(W - 5, -M + 5, T, a), TP(W - 5, M - 5, T, a), TP(5, M - 5, T, a)];
    top.setAttribute("d", poly(fillet(inn, [3, 3, 3, 3], 3)));
    let d = "";
    for (let i = 0; i < 7; i++) { const yl = -M + 12 + i * 8; d += seg(TP(9, yl, T, a), TP(W - 9, yl, T, a)); }
    tread.setAttribute("d", d);
  }

  const B = register(stage, (dt) => { const m = stepS(A, dt); draw(A.x); return m; });
  bag.add(B.unregister);

  function leave() { A.t = REST; read.textContent = "rest"; B.wake(); }
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    if (wx < -20 || wx > W + 30 || wy < -20 || wy > L + 30) return leave();
    A.t = clamp((M - wy) / M, -1, 1) * maxA;
    read.textContent = (A.t < 0 ? "toe " : "heel ") + Math.abs(Math.round(A.t)) + "°";
    B.wake();
  }
  leave();
  draw(REST);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "guitarpedal",
  means: "A rocker effects pedal: the pointer's place along it rocks the treadle on its pivot, heel down at the back, toe down at the front.",
  rules: [1, 3, 5, 8],
  range: [8, 16, 20],
  tour: [[266, 168], [200, 201], [130, 236], null],
  mount,
});
