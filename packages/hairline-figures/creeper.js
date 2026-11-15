/**
 * Creeper: a mechanic's low board on six casters with a padded headrest.
 * The pointer's place on the floor rolls the board along its length and
 * swivels it a little to face the pointer. At rest it sits skewed, its
 * headrest bright. The slider is how far it rolls.
 */
const { Cam, circ, clamp, facing, fit, prism, proj, rad, rrect, spring, stepS, unproj, disposer, mk, pointer, put, register, solid } = HL;

const L = 110, W = 40, CZ = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-34, -16, 0], [L + 34, -16, 0], [-34, W + 16, 0], [L + 34, W + 16, 0], [-30, 0, 20], [L + 30, W, 20]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const casters = [[10, 6], [55, 6], [100, 6], [10, 34], [55, 34], [100, 34]].map(([x, y]) => ({ ring: circ(3, 16).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), s: solid(g) }));
  const board = solid(g), pad = solid(g);
  pad.sil.classList.add("hi");
  const bo = rrect(0, 0, L, W, 8, 8), bi = rrect(2, 2, L - 2, W - 2, 6, 8);
  const po = rrect(4, 7, 28, 33, 6, 8), pi = rrect(6, 9, 26, 31, 4, 8);
  const dx = spring(0), yaw = spring(8);
  let last = "";

  function xf(ring, d, a) {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), cx = L / 2, cy = W / 2;
    return ring.map((q) => ({ u: cx + d + (q.u - cx) * c - (q.v - cy) * s, v: cy + (q.u - cx) * s + (q.v - cy) * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
  }
  function draw(d, a) {
    const key = d.toFixed(2) + a.toFixed(2);
    if (key === last) return;
    last = key;
    for (const k of casters) put(k.s, prism(P, front, xf(k.ring, d, a), xf(k.ring, d, a), 0, CZ));
    put(board, prism(P, front, xf(bo, d, a), xf(bi, d, a), CZ, CZ + 4));
    put(pad, prism(P, front, xf(po, d, a), xf(pi, d, a), CZ + 4, CZ + 10));
  }
  const B = register(stage, (dt) => { const m1 = stepS(dx, dt), m2 = stepS(yaw, dt); draw(dx.x, yaw.x); return m1 || m2; });
  bag.add(B.unregister);

  function go(d, a, r) { dx.t = d; yaw.t = a; read.textContent = r ? "rest" : (d >= 0 ? "+" : "") + Math.round(d); B.wake(); }
  draw(0, 8);
  go(0, 8, true);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0); go(clamp(x - L / 2, -reach, reach), clamp((y - W / 2) * 0.4, -10, 10)); },
    leave: () => go(0, 8, true),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "creeper",
  means: "A mechanic's creeper board on six casters: it rolls along the floor toward the pointer and swivels to face it.",
  rules: [1, 3, 4, 5],
  range: [10, 22, 30],
  tour: [[300, 230], [361, 261], [150, 150], null],
  mount,
});
