/**
 * Sliding seat: a rowing machine's seat on its rail, rolling on four wheels
 * between a foot stretcher and the rail's end. The pointer is where the rower
 * sits: the seat slides along the rail to follow it on a spring. At rest the
 * seat waits a little past the middle, bright. The slider is the spring's
 * stiffness.
 *
 * The pattern: a continuous slide (terrain's spring on one number); the hit
 * is on the rail's own top plane, which never moves.
 */
const {
  Cam, fit, facing, prism, proj, rings, unproj, spring, stepS, clamp,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const L = 110, W = 12, RZ = 10, SL = 30, SW = 34, REST = 58;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-4, -14, 0], [L + 4, W + 14, 0], [L + 4, -14, RZ + 14], [-4, W + 14, RZ + 14]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // feet under each end, then the rail beam
  for (const x of [2, L - 12]) { const [a, b] = rings(x, -10, x + 10, W + 10, 3, 1); put(solid(g), prism(P, front, a, b, 0, 3)); }
  const [ra, rb] = rings(0, 0, L, W, 3, 1.2);
  put(solid(g), prism(P, front, ra, rb, 3, RZ));
  // the foot stretcher at the far end, standing up
  const [fa, fb] = rings(-2, -12, 6, W + 12, 2.5, 1);
  put(solid(g), prism(P, front, fa, fb, RZ, RZ + 16));
  const seatG = mk("g", {}, g), wheels = [0, 1, 2, 3].map(() => flatDot(seatG, C, 1.6, "dot off"));
  const seat = solid(seatG), pad = solid(seatG);
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const s = sp.x;
    if (Math.abs(s - drawn) < 1e-3) return;
    drawn = s;
    const y0 = W / 2 - SW / 2, y1 = W / 2 + SW / 2;
    const [a, b] = rings(s, y0 + 6, s + SL, y1 - 6, 4, 1.2);
    put(seat, prism(P, front, a, b, RZ + 1.5, RZ + 4));
    const [c, d] = rings(s - 2, y0, s + SL + 2, y1, 10, 2.2);
    put(pad, prism(P, front, c, d, RZ + 4, RZ + 10));
    [[s + 5, -1.5], [s + SL - 5, -1.5], [s + 5, W + 1.5], [s + SL - 5, W + 1.5]].forEach(([x, y], i) => place(wheels[i], P(x, y, RZ + 1)));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function set(over) {
    sp.t = over == null ? REST : over;
    pad.sil.classList.toggle("hi", true);
    read.textContent = over == null ? "rest" : Math.round((over / (L - SL)) * 100) + "%";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], RZ);
      set(y < -40 || y > W + 40 || x < -30 || x > L + 30 ? null : clamp(x - SL / 2, 8, L - SL));
    },
    leave: () => set(null),
  }));
  bag.add(() => svg.replaceChildren());
  set(null);
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "rowingseat",
  means: "A rowing machine's sliding seat on its rail: the seat rolls along the rail to sit under the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[151, 129], [265, 186], [208, 158], null],
  mount,
});
