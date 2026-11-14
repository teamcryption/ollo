/**
 * Ripple tank: a shallow tank of water, its surface drawn as rows of lines,
 * with a dipper standing in it. The pointer moves the dipper over the water
 * and the rings spread out from where it touches, fading with distance. At
 * rest the dipper stands in one corner, bright, rings around it.
 *
 * The pattern: a field answering a point (terrain).
 */
const {
  Cam, circ, clamp, fit, facing, open, prism, proj, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 120, D = 84, RZ = 14, WZ = 13, ROWS = 12, COLS = 36, RX = 34, RY = 30;
const disc = (x, y, r, n = 18) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-4, -4, 0], [W + 4, D + 4, 0], [W + 4, -4, 0], [-4, D + 4, 0], [0, 0, RZ + 26]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  let [r, i] = rings(-4, -4, W + 4, D + 4, 7, 2);
  put(solid(g), prism(P, front, r, i, 0, RZ));
  const lines = [];
  for (let j = 0; j <= ROWS; j++) lines.push(mk("path", { class: "nf lo" }, g));
  const rod = solid(g);
  rod.sil.classList.add("hi");
  const sx = spring(RX), sy = spring(RY), sa = spring(0.6);
  let last = "";

  function draw() {
    const x0 = sx.x, y0 = sy.x, A = sa.x * (0.4 + amp), key = [x0, y0, A].map((n) => n.toFixed(2)).join();
    if (key === last) return;
    last = key;
    lines.forEach((el, j) => {
      const y = 3 + (j * (D - 6)) / ROWS, pts = [];
      for (let c = 0; c <= COLS; c++) {
        const x = 3 + (c * (W - 6)) / COLS, d = Math.hypot(x - x0, y - y0);
        pts.push(P(x, y, WZ + A * 3.2 * Math.cos(d * 0.42) * Math.exp(-d / 38)));
      }
      el.setAttribute("d", open(pts));
    });
    put(rod, prism(P, front, disc(x0, y0, 2.6), disc(x0, y0, 1.6), WZ + 2, WZ + 26));
  }

  const B = register(stage, (dt) => {
    const m = [stepS(sx, dt), stepS(sy, dt), stepS(sa, dt)].some(Boolean);
    draw();
    return m;
  });
  bag.add(B.unregister);

  function move([px, py]) {
    const [x, y] = unproj(C, px, py, WZ);
    if (x < 0 || y < 0 || x > W || y > D) return leave();
    sx.t = clamp(x, 8, W - 8); sy.t = clamp(y, 8, D - 8); sa.t = 1;
    read.textContent = "x" + Math.round(sx.t / 12) + "·y" + Math.round(sy.t / 12);
    B.wake();
  }
  function leave() { sx.t = RX; sy.t = RY; sa.t = 0.6; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = ""; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "pendulumclock",
  means: "A ripple tank: the dipper follows the pointer over the water and rings spread out from where it touches, fading with distance.",
  rules: [1, 3, 5, 8],
  range: [0, 0.6, 1],
  tour: [[178, 125], [215, 200], [221, 227], null],
  mount,
});
