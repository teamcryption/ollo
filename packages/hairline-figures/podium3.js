/**
 * Voting booth curtain: a booth with a back wall, a side wall and a writing
 * shelf, a rail across its open front and a pleated curtain hung from it.
 * The pointer's place along the rail is where the curtain's edge goes: the
 * pleats fold up like an accordion as it opens and flatten as it closes.
 * At rest it is part drawn, its leading pleat bright. The slider is the rest opening.
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, clamp, lerp, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 90, D = 40, H = 70, N = 9, PW = W / N, MINE = 3.6 * N;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restE = lerp(MINE, W, value / 100);
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-4, -4, 0], [W + 4, D + 14, 0], [W + 4, -4, 0], [-4, D + 14, 0], [0, 0, H + 6], [W, D, H + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const add = (x0, y0, x1, y1, z0, z1, r, b) => { const [a, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, a, i, z0, z1)); };
  add(-4, -4, W + 4, D + 4, 0, 3, 4, 1.4);
  add(0, 0, W, 3, 3, H, 1.2, 0.6);
  add(0, 3, 3, D, 3, H, 1.2, 0.6);
  add(22, 3, 66, 18, 36, 39, 1.5, 0.8);
  add(28, 6, 46, 15, 39, 40, 1, 0.4);
  // the rail: two posts and a bar along the front
  add(W - 2, D - 2, W + 2, D + 2, 3, H + 4, 2, 0.6);
  const rail = mk("path", { class: "nf" }, g);
  const ra = P(0, D, H + 2), rb = P(W, D, H + 2);
  rail.setAttribute("d", seg(ra, rb) + seg(P(0, D, H + 3.6), P(W, D, H + 3.6)));
  const cg = mk("g", {}, g);
  const pleats = [];
  for (let i = 0; i < N; i++) pleats.push(mk("path", { class: "sil" }, cg));
  const rings2 = mk("path", { class: "nf lo" }, cg);
  add(-2, D - 2, 2, D + 2, 3, H + 4, 2, 0.6);

  const E = spring(restE);
  let last = NaN;
  function draw(e) {
    if (e === last) return;
    last = e;
    const w = e / N, dep = Math.sqrt(Math.max(0, PW * PW - w * w)) * 0.9;
    let hooks = "";
    for (let i = 0; i < N; i++) {
      const xa = i * w, xb = xa + w, ya = D + (i % 2 ? dep : 0), yb = D + (i % 2 ? 0 : dep);
      pleats[i].setAttribute("d", poly([P(xa, ya, H), P(xb, yb, H), P(xb, yb, 6), P(xa, ya, 6)]));
      hooks += seg(P(xa, D, H + 2), P(xa, ya, H));
    }
    rings2.setAttribute("d", hooks);
  }
  draw(restE);
  const B = register(stage, (dt) => { const m = stepS(E, dt); draw(E.x); return m; });
  bag.add(B.unregister);
  pleats[N - 1].classList.add("hi");

  const top = P(0, D, H + 4)[1], bot = P(W, D, 0)[1];
  function hit([sx, sy]) {
    if (sy < top - 20 || sy > bot + 30) return -1;
    return clamp((sx - ra[0]) / (rb[0] - ra[0]), 0, 1);
  }
  function move(p) {
    const t = hit(p);
    E.t = t < 0 ? restE : clamp(t * W, MINE, W);
    read.textContent = t < 0 ? "rest" : Math.round((1 - (E.t - MINE) / (W - MINE)) * 100) + "% open";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { E.t = restE; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restE = lerp(MINE, W, v / 100); E.t = restE; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "podium3",
  means: "A voting booth with a pleated curtain on a rail: the curtain's edge follows the pointer, folding open and flattening shut.",
  rules: [1, 3, 5, 8],
  range: [20, 50, 80],
  tour: [[248, 207], [136, 151], [105, 135], null],
  mount,
});
