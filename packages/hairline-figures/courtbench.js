/**
 * Witness stand: a raised panelled box on a step, a chair inside, a rail
 * capping its walls and a gate in its front. The gate swings out on its
 * hinge as the pointer comes near it and closes as it goes; at rest it
 * stands ajar, bright. The slider is how far it rests open.
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, unproj, clamp, rad, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 44, Z0 = 6, Z1 = 44, GX = 14, HX = W - 3, GL = HX - GX, MAX = 100;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let rest = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-5, -5, 0], [W + 5, D + 5, 0], [W + 5, -5, 0], [-5, D + GL + 2, 0], [0, 0, Z1 + 3], [W, D, Z1 + 3]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const add = (x0, y0, x1, y1, z0, z1, r, b) => { const [a, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, a, i, z0, z1)); };
  add(-5, -5, W + 5, D + 5, 0, Z0, 4, 1.4);
  add(0, 0, W, 3, Z0, Z1, 1.2, 0.6);
  add(-1, -1, W + 1, 4, Z1, Z1 + 3, 1.6, 0.8);
  add(0, 3, 3, D, Z0, Z1, 1.2, 0.6);
  add(-1, 3, 4, D + 1, Z1, Z1 + 3, 1.6, 0.8);
  // the chair: seat and back
  add(22, 10, 40, 14, Z0, Z0 + 34, 1.5, 0.7);
  add(22, 14, 40, 30, Z0 + 14, Z0 + 18, 1.5, 0.7);
  add(W - 3, 3, W, D, Z0, Z1, 1.2, 0.6);
  add(W - 4, 3, W + 1, D + 1, Z1, Z1 + 3, 1.6, 0.8);
  add(0, D - 3, GX, D, Z0, Z1, 1.2, 0.6);
  add(-1, D - 4, GX + 1, D + 1, Z1, Z1 + 3, 1.6, 0.8);
  const gate = mk("path", { class: "sil hi" }, g), bars = mk("path", { class: "nf lo" }, g);

  const A = spring(rest);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), ex = HX - GL * Math.cos(a), ey = D - 1.5 + GL * Math.sin(a);
    const hz = Z1 - 4, h = [HX, D - 1.5], e = [ex, ey];
    gate.setAttribute("d", poly([P(h[0], h[1], Z0 + 2), P(e[0], e[1], Z0 + 2), P(e[0], e[1], hz), P(h[0], h[1], hz)]));
    let d = seg(P(h[0], h[1], hz - 3), P(e[0], e[1], hz - 3)) + seg(P(h[0], h[1], Z0 + 12), P(e[0], e[1], Z0 + 12));
    for (const t of [0.33, 0.66]) { const x = h[0] + (e[0] - h[0]) * t, y = h[1] + (e[1] - h[1]) * t; d += seg(P(x, y, Z0 + 12), P(x, y, hz - 3)); }
    bars.setAttribute("d", d);
  }
  draw(rest);
  const B = register(stage, (dt) => { const m = stepS(A, dt); draw(A.x); return m; });
  bag.add(B.unregister);

  const mid = [(GX + HX) / 2, D + 10];
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    const dist = Math.hypot(x - mid[0], y - mid[1]);
    const t = clamp(1 - dist / 90, 0, 1);
    A.t = clamp(rest + (MAX - rest) * t * 1.4, rest, MAX);
    read.textContent = "gate " + Math.round(A.t) + "°";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { A.t = rest; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { rest = v; A.t = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "courtbench",
  means: "A witness stand on its step: the gate in its front swings open as the pointer nears it and settles ajar as it leaves.",
  rules: [1, 3, 5, 8],
  range: [6, 16, 32],
  tour: [[336, 289], [182, 245], [70, 240], null],
  mount,
});
