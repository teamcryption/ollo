/**
 * Diving board: a long sprung board on its stand, out over the pool's rim.
 * The pointer is where a diver stands: the further out along the board, the
 * deeper the board flexes down about its fulcrum. At rest it holds a slight
 * bow and the pool's rim is bright. The slider is the board's give.
 */
const {
  Cam, facing, fit, hull, open, poly, prism, proj, rings, run, unproj, spring, stepS, clamp, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = -62, X1 = 70, HW = 9, Z = 30, PIV = -46, REST = 2, MAX = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.9);
  const zAt = (x, a) => Z - Math.max(0, x - PIV) * Math.tan(rad(a));
  fit(C, [[X0, -HW, 0], [X1, HW, Z + 3], [X1, HW, zAt(X1, MAX * 1.4)], [110, 44, 0], [20, -44, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // pool: a low rim with the water line inset
  const pool = solid(g);
  put(pool, prism(P, front, ...rings(22, -40, 112, 40, 10, 6), 0, 3));
  // stand at the back, fulcrum under the board
  put(solid(g), prism(P, front, ...rings(X0 - 4, -HW - 3, PIV + 4, HW + 3, 3, 1.4), 0, Z - 1));
  put(solid(g), prism(P, front, ...rings(-26, -HW + 2, -16, HW - 2, 2.5, 1), 0, Z - 0.8));
  const board = solid(g);
  const [ring, inner] = rings(X0, -HW, X1, HW, 4, 1.2);
  const sp = spring(REST);
  let drawn = NaN;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-3) return;
    drawn = a;
    const at = (q, dz) => P(q.u, q.v, zAt(q.u, a) + dz);
    const pts = ring.map((q) => at(q, 0)).concat(ring.map((q) => at(q, 2.6)));
    board.sil.setAttribute("d", poly(hull(pts)));
    board.cr.setAttribute("d", open(run(inner, front).map((q) => at(q, 2.6))));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  let over = null;
  function retarget() {
    const t = over === null ? 0 : clamp((over - PIV) / (X1 - PIV), 0, 1);
    sp.t = over === null ? REST : REST + (MAX * value - REST) * t;
    board.sil.classList.toggle("hi", over !== null);
    pool.sil.classList.toggle("hi", over === null);
    read.textContent = over === null ? "rest" : "flex " + String(Math.round(t * 10)).padStart(2, "0");
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], Z);
      over = x > X0 - 6 && x < X1 + 12 && Math.abs(y) < 34 ? clamp(x, X0, X1) : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { value = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "divingboard",
  means: "A diving board over a pool: the further out the pointer stands along it, the deeper the board flexes down; the board goes bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.4],
  tour: [[138, 62], [218, 102], [280, 133], null],
  mount,
});
