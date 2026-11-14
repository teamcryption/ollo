/**
 * Drum machine: a low rounded box with a four-by-four grid of rubber pads on
 * its top and two knobs along the back. The pointer picks a pad by where it
 * lands on the deck: that pad presses down, its neighbours dip after it,
 * staggered by distance. At rest the pads stand at uneven heights, one lit.
 * The slider is the stagger.
 *
 * The pattern: a grid on one plane; the hit is on the deck's fixed plane.
 */
const {
  Cam, circ, clamp, facing, fit, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, PS = 13, GAP = 3, X0 = 2, Y0 = 2, TOP = 12, H = 4.2, PRESS = 3.6;
const W = X0 * 2 + N * PS + (N - 1) * GAP;
const REST = [0.2, 0.9, 0.4, 1.3, 0.6, 1.1, 0.1, 0.7, 1.2, 0.3, 0.8, 0.5, 0.4, 1.0, 0.6, 0.2];
const FAV = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[-3, -20, 0], [W + 3, W + 3, 0], [W + 3, -20, 0], [-3, W + 3, 0], [W, -14, TOP + 9], [0, 0, TOP + H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [bo, bi] = rings(-3, -20, W + 3, W + 3, 9, 1.4);
  put(solid(g), prism(P, front, bo, bi, 0, TOP));
  // two knobs on the back strip
  [[14, -10, 4.2], [30, -10, 3.2]].forEach(([x, y, r]) => {
    const ring = circ(r, 16).map((s) => ({ ...s, u: s.u + x, v: s.v + y }));
    const inner = circ(r - 0.8, 16).map((s) => ({ ...s, u: s.u + x, v: s.v + y }));
    put(solid(g), prism(P, front, ring, inner, TOP, TOP + 5));
  });

  const pads = [];
  const order = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) order.push([i, j]);
  order.sort((a, b) => a[0] + a[1] - b[0] - b[1]);
  order.forEach(([i, j]) => {
    const k = j * N + i, x = X0 + i * (PS + GAP), y = Y0 + j * (PS + GAP);
    const s = solid(g);
    pads[k] = { i, j, s, rg: rings(x, y, x + PS, y + PS, 3, 1), z: tween(H - REST[k]), last: NaN };
  });
  function draw(p, h) {
    if (h === p.last) return;
    p.last = h;
    put(p.s, prism(P, front, p.rg[0], p.rg[1], TOP, TOP + h));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    pads.forEach((p) => { draw(p, tval(p.z, now)); if (!tdone(p.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TOP + H * 0.7);
    if (x < -2 || x > W + 2 || y < -2 || y > W + 2) return -1;
    const i = clamp(Math.floor((x - X0 + GAP / 2) / (PS + GAP)), 0, N - 1);
    const j = clamp(Math.floor((y - Y0 + GAP / 2) / (PS + GAP)), 0, N - 1);
    return j * N + i;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    pads.forEach((p, k) => {
      let h = H - REST[k];
      let d = 0;
      if (a >= 0) {
        d = Math.hypot(p.i - (a % N), p.j - Math.floor(a / N));
        h = H - PRESS * Math.max(0.12, 1 - d / 2.2);
      } else if (from >= 0) d = Math.hypot(p.i - (from % N), p.j - Math.floor(from / N));
      tset(p.z, h, now, d * stag);
      p.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pad " + ((a % N) + 1) + "·" + (Math.floor(a / N) + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "drummachine",
  means: "A drum machine's pad grid: the pad under the pointer presses down and its neighbours dip after it, by distance.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[182, 137], [182, 92], [182, 188], null],
  mount,
});
