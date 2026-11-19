/**
 * Teleprompter: a monitor lying face up under a sheet of glass hinged at its
 * far edge, with the camera hood behind. The pointer's depth over the frame
 * tilts the glass, on a spring, from leaning low to standing up. At rest
 * the glass leans low, bright. The slider is how far up it can tilt.
 */
const {
  Cam, fit, facing, fillet, poly, prism, proj, rings, clamp, lerp, rad, unproj,
  disposer, mk, pointer, put, register, solid, spring, stepS,
} = HL;

const W = 90, D = 70, MZ = 10, G = 74, X0 = 4, X1 = W - 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-2, -30, 0], [W + 2, D + 2, 0], [W + 2, -30, 0], [-2, D + 2, 0], [X0, 0, MZ + G], [X1, G * 0.1, MZ + G], [X1, G, MZ + 10]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  let a, b;
  [a, b] = rings(W / 2 - 22, -30, W / 2 + 22, -6, 6, 1.6); put(solid(g), prism(P, front, a, b, 0, 4));
  [a, b] = rings(W / 2 - 18, -28, W / 2 + 18, -8, 5, 1.6); put(solid(g), prism(P, front, a, b, 4, 52));
  [a, b] = rings(W / 2 - 8, -6, W / 2 + 8, 2, 3, 1); put(solid(g), prism(P, front, a, b, 30, 42));
  [a, b] = rings(0, 0, W, D, 6, 1.8); put(solid(g), prism(P, front, a, b, 0, MZ));
  const scr = [[10, 10], [W - 10, 10], [W - 10, D - 10], [10, D - 10]].map(([x, y]) => P(x, y, MZ));
  mk("path", { d: poly(fillet(scr, [3, 3, 3, 3])), class: "nf lo" }, g);
  for (const x of [X0, X1]) {
    [a, b] = rings(x - 3, -3, x + 3, 3, 2, 0.8); put(solid(g), prism(P, front, a, b, MZ, MZ + 5));
  }
  const edge = mk("path", { class: "lo" }, g), glass = mk("path", { class: "sil hi" }, g), inner = mk("path", { class: "nf lo" }, g);
  const REST = 20, sp = spring(REST);
  let last = NaN;

  function plate(deg, dz, ins) {
    const c = Math.cos(rad(deg)), s = Math.sin(rad(deg)), q = (x, t) => P(x, t * c, MZ + 3 + dz + t * s);
    return fillet([q(X0 + ins, ins), q(X1 - ins, ins), q(X1 - ins, G - ins), q(X0 + ins, G - ins)], [3, 3, 3, 3]);
  }
  function draw(deg) {
    deg = Math.round(deg * 10) / 10;
    if (deg === last) return;
    last = deg;
    edge.setAttribute("d", poly(plate(deg, -2, 0)));
    glass.setAttribute("d", poly(plate(deg, 0, 0)));
    inner.setAttribute("d", poly(plate(deg, 0, 9)));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(sp.x);

  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, MZ);
    if (wx < -50 || wx > W + 50 || wy < -60 || wy > D + 60) return leave();
    const f = clamp(1 - (wy + 20) / (D + 20), 0, 1);
    sp.t = lerp(REST, lerp(40, 84, reach), f);
    read.textContent = Math.round(sp.t) + "°";
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "teleprompter",
  means: "A teleprompter: the glass over the face-up monitor tilts on its hinge with the pointer's depth, from folded to upright.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[230, 150], [188, 182], [146, 237], null],
  mount,
});
