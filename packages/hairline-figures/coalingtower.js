/**
 * Coaling tower: a tall concrete bunker on legs beside a length of track,
 * a hopper roof on top. On its track side a wide hinged apron hangs folded
 * against the wall. The pointer near the track lowers the apron out over
 * the rails, a chute for the coal. At rest the apron hangs almost shut,
 * bright. The slider is how far it swings out.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TX = 26, HZ = 50, L = 50, REST = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -10, 0], [84, 50, 0], [0, 0, 92], [TX, 40, 92], [TX + L, 40, HZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (parent, x0, y0, x1, y1, z0, z1) => {
    const [r, i] = rings(x0, y0, x1, y1, 1.5, 0.8), s = solid(parent);
    put(s, prism(P, front, r, i, z0, z1));
    return s;
  };
  box(g, -4, -10, 84, 50, 0, 2);
  for (const [x, y] of [[2, 4], [2, 32], [20, 4], [20, 32]]) box(g, x, y, x + 4, y + 4, 2, 30);
  box(g, 0, 0, TX, 40, 30, 82);
  box(g, 4, 4, TX - 4, 36, 82, 92);
  for (let y = -6; y <= 46; y += 13) box(g, 34, y, 74, y + 4, 2, 4);
  box(g, 40, -10, 42, 50, 4, 7);
  box(g, 66, -10, 68, 50, 4, 7);
  const ap = mk("path", { class: "sil hi" }, g), lip = mk("path", { class: "nf lo" }, g);

  const a = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const t = (deg * Math.PI) / 180, s = Math.sin(t), c = Math.cos(t), pts = [];
    for (const y of [2, 38]) for (const [u, w] of [[0, 0], [L, 0], [0, 2.5], [L, 2.5]]) pts.push(P(TX + u * s + w * c, y, HZ - u * c + w * s));
    ap.setAttribute("d", poly(hull(pts)));
    const e = (u) => [P(TX + u * s + 2.5 * c, 2, HZ - u * c + 2.5 * s), P(TX + u * s + 2.5 * c, 38, HZ - u * c + 2.5 * s)];
    lip.setAttribute("d", poly([...e(L - 6), ...e(L).reverse()]));
  }
  draw(REST);

  const B = register(stage, (dt) => {
    const m = stepS(a, dt);
    draw(a.x);
    return m;
  });
  bag.add(B.unregister);

  function aim(p) {
    let k = 0;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (y > -20 && y < 60 && x > 10 && x < 100) k = clamp(1 - Math.abs(x - 54) / 46, 0, 1);
    }
    a.t = REST + Math.min(1, k * 1.5) * swing;
    read.textContent = k === 0 ? "rest" : "chute " + Math.round(a.t) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; }, destroy: bag.dispose };
}

hairline({
  name: "coalingtower",
  means: "A coaling tower beside the track: the pointer near the rails swings its wide apron down over them as a chute.",
  rules: [1, 3, 5, 6],
  range: [30, 88, 96],
  tour: [[233, 251], [190, 245], [280, 250], null],
  mount,
});
