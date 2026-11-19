/**
 * Drafting machine: a drawing board with an elbow arm clamped at its far
 * corner; the arm carries a protractor head with two rulers at right angles.
 * The pointer over the board draws the head toward it on a spring, the two
 * arm links fold at the elbow, and the rulers ride along, square to the
 * board. At rest the head sits mid-board and the clamp is bright. The slider
 * is how far toward the pointer the head travels.
 *
 * The pattern: a continuous input on a spring (terrain), carried by a linkage.
 */
const {
  Cam, circ, clamp, fit, facing, hull, lerp, poly, prism, proj, rings, ringAt, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 150, D = 104, BZ = 5, AX = 8, AY = 8, L = 72, REST = [60, 44];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-4, -4, 0], [W, D, 0], [W - 40, D + 10, 0], [W + 4, -4, 0], [-4, D + 4, 0], [AX, AY, 16]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(0, 0, W, D, 5, 2), 0, BZ));
  const clampS = solid(g);
  put(clampS, prism(P, front, ...rings(AX - 7, AY - 7, AX + 7, AY + 7, 3, 1.5), BZ, BZ + 6));
  const rx = solid(g), ry = solid(g), a1 = solid(g), a2 = solid(g), head = solid(g);
  const hz = BZ + 1.5;
  const bar = (s, p, q, w, z0, z1) => {
    const A = disc(p[0], p[1], w), Bq = disc(q[0], q[1], w), a = disc(p[0], p[1], w - 1.2), b = disc(q[0], q[1], w - 1.2);
    s.sil.setAttribute("d", poly(hull(ringAt(P, A, z0).concat(ringAt(P, Bq, z0), ringAt(P, A, z1), ringAt(P, Bq, z1)))));
    s.cr.setAttribute("d", poly(hull(ringAt(P, a, z1).concat(ringAt(P, b, z1)))));
  };
  const hx = spring(REST[0]), hy = spring(REST[1]);
  let lx = NaN, ly = NaN;
  function draw() {
    if (hx.x === lx && hy.x === ly) return;
    lx = hx.x; ly = hy.x;
    let dx = lx - AX, dy = ly - AY, d = Math.hypot(dx, dy);
    const dc = clamp(d, 24, 2 * L - 4), a = Math.atan2(dy, dx), b = Math.acos(dc / (2 * L));
    const H = [AX + dc * Math.cos(a), AY + dc * Math.sin(a)];
    const E = [AX + L * Math.cos(a - b), AY + L * Math.sin(a - b)];
    put(rx, prism(P, front, ...rings(H[0] - 4, H[1] + 7, H[0] + 52, H[1] + 13, 1.5, 1), BZ, hz));
    put(ry, prism(P, front, ...rings(H[0] + 7, H[1] - 4, H[0] + 13, H[1] + 38, 1.5, 1), BZ, hz));
    bar(a1, [AX, AY], E, 3.2, BZ + 6, BZ + 8);
    bar(a2, E, H, 2.8, BZ + 8, BZ + 10);
    put(head, prism(P, front, disc(H[0], H[1], 10, 32), disc(H[0], H[1], 8, 32), BZ + 3, BZ + 11));
  }
  draw();

  const B = register(stage, (dt) => { const m = stepS(hx, dt), n = stepS(hy, dt); draw(); return m || n; });
  bag.add(B.unregister);

  function setTarget(t, on) {
    hx.t = t[0]; hy.t = t[1];
    clampS.sil.classList.toggle("hi", !on);
    for (const s of [head, rx, ry]) s.sil.classList.toggle("hi", on);
    read.textContent = on ? Math.round(t[0] / 10) + "·" + Math.round(t[1] / 10) : "rest";
    B.wake();
  }
  setTarget(REST, false);
  let pp = null;
  const move = (p) => {
    pp = p;
    const [x, y] = unproj(C, p[0], p[1], BZ);
    if (x < -10 || x > W + 10 || y < -10 || y > D + 10) return setTarget(REST, false);
    const cx = clamp(x, 24, W - 56), cy = clamp(y, 24, D - 42);
    setTarget([lerp(REST[0], cx, reach), lerp(REST[1], cy, reach)], true);
  };
  bag.add(pointer(stage, { move, leave: () => { pp = null; setTarget(REST, false); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (pp) move(pp); }, destroy: bag.dispose };
}

hairline({
  name: "draftingmachine",
  means: "A drafting machine: the protractor head and its square rulers glide toward the pointer as the elbow arm folds.",
  rules: [1, 3, 5, 6],
  range: [0.35, 0.75, 1],
  tour: [[209, 179], [172, 117], [250, 165], null],
  mount,
});
