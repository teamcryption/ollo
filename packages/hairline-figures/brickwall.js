/**
 * Brick wall: a garden wall of thirty bricks in running bond on a footing,
 * with a coping course on top. The pointer presses on the wall's face: the
 * bricks near it push out toward the reader, the farther the less, each on
 * its own spring. At rest a few bricks stand proud near one corner, as if
 * the wall were half built. The slider is the reach, in bricks.
 *
 * The pattern: a continuous field on a face (terrain, turned upright); the hit
 * is read on the wall's face plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const COLS = 6, ROWS = 5, BW = 20, BH = 8, D = 10, J = 0.9, OUT = 9, FOOT = 4;
const W = COLS * BW, H = FOOT + ROWS * BH;
const fall = (u) => (u <= 0.35 ? 1 : u <= 1 ? 1 - ((u - 0.35) / 0.65) * 0.9 : 0.1);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, over = null;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-4, -2, 0], [W + 4, D + OUT + 2, 0], [W + 4, -2, 0], [-4, D + OUT, 0], [-4, 0, H + 6], [W + 4, 0, H + 6]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-4, -2, W + 4, D + 3, 1.5, 0.8);
  put(solid(g), prism(P, front, fr, fi, 0, FOOT));

  const bricks = [];
  for (let r = 0; r < ROWS; r++) {
    const off = r % 2 ? -BW / 2 : 0;
    for (let c = 0; c <= COLS; c++) {
      let x0 = c * BW + off, x1 = x0 + BW;
      x0 = Math.max(0, x0); x1 = Math.min(W, x1);
      if (x1 - x0 < 4) continue;
      const z0 = FOOT + r * BH, cx = (x0 + x1) / 2, cz = z0 + BH / 2;
      const rest = Math.max(0, 6 - Math.hypot((cx - W * 0.85) / BW, (cz - H * 0.8) / BH) * 2.4);
      bricks.push({ r, x0, x1, z0, cx, cz, rest, el: solid(g), sp: spring(rest, { eps: 0.03 }), drawn: NaN });
    }
  }
  const coping = solid(g);
  { const [r, i] = rings(-2, -1.5, W + 2, D + 1.5, 1.2, 0.7); put(coping, prism(P, front, r, i, H + 0.4, H + 3.6)); }

  // proud bricks paint after flush ones; within a course, left to right
  let painted = "";
  function order() {
    const o = bricks.slice().sort((a, b) => a.sp.x - b.sp.x || a.cx + a.cz * 0.01 - (b.cx + b.cz * 0.01));
    const key = o.map((b) => bricks.indexOf(b)).join();
    if (key !== painted) { painted = key; for (const b of o) g.appendChild(b.el.g); g.appendChild(coping.g); }
  }
  function draw(b) {
    const s = Math.max(0, b.sp.x);
    if (s === b.drawn) return;
    b.drawn = s;
    const [r, i] = rings(b.x0 + J / 2, s, b.x1 - J / 2, D + s, 1, 0.5);
    put(b.el, prism(P, front, r, i, b.z0 + J / 2, b.z0 + BH - J / 2));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const b of bricks) { if (stepS(b.sp, dt)) m = true; draw(b); }
    order();
    return m;
  });
  bag.add(B.unregister);

  /** Where the point lands on the wall's face (y = D), which never moves; null off the wall. */
  function onFace([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + D * s) / c, Y = x * s + D * c, z = (Y * C.k - (sy - C.oy) / C.S) / zf;
    return x < -6 || x > W + 6 || z < FOOT - 4 || z > H + 6 ? null : [x, z];
  }

  const restMark = bricks.reduce((a, b) => (b.rest > a.rest ? b : a));
  function retarget() {
    let mark = restMark;
    for (const b of bricks) b.sp.t = over ? OUT * fall(Math.hypot((b.cx - over[0]) / BW, (b.cz - over[1]) / BH) / reach) : b.rest;
    if (over) {
      mark = bricks.reduce((a, b) => (Math.hypot(b.cx - over[0], (b.cz - over[1]) * 2) < Math.hypot(a.cx - over[0], (a.cz - over[1]) * 2) ? b : a));
      read.textContent = `brick ${ROWS - mark.r}·${clamp(Math.floor(mark.cx / BW) + 1, 1, COLS + 1)}`;
    } else read.textContent = "rest";
    for (const b of bricks) b.el.sil.classList.toggle("hi", b === mark);
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => { over = onFace(p); retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "brickwall",
  means: "A brick wall: the bricks near the pointer push out toward you, the nearest furthest.",
  rules: [1, 3, 5, 6],
  range: [1, 1.8, 3],
  tour: [[140, 150], [210, 200], [260, 190], null],
  mount,
});
