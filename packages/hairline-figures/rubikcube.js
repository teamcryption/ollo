/**
 * Twist puzzle: a 3 × 3 cube on its base. The top layer turns about the
 * cube's axis to follow the pointer across the frame; at rest it sits a
 * quarter twisted, bright. The slider is how far the twist reaches.
 *
 * The pattern: one part turning to follow the pointer (spotlights).
 */
const { Cam, fit, facing, poly, prism, proj, rings, rrect, seg, clamp, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const U = 22, W = 3 * U, H = 3 * U, REST = 0.32;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-12, -12, 0], [W + 12, W + 12, 0], [W + 12, -12, 0], [-12, W + 12, 0], [W / 2, W / 2, H + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, W, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, 2 * U));
  let d = "";
  for (const t of [U, 2 * U]) {
    d += seg(P(W, t, 0.8), P(W, t, 2 * U - 0.8)) + seg(P(t, W, 0.8), P(t, W, 2 * U - 0.8));
  }
  d += seg(P(W, 1, U), P(W, W - 1, U)) + seg(P(1, W, U), P(W - 1, W, U));
  mk("path", { d, class: "nf lo" }, g);
  const top = solid(g), grid = mk("path", { class: "nf lo" }, g);
  top.sil.classList.add("hi");
  const cx = W / 2, cy = W / 2;
  const rot = (a) => (u, v) => [cx + (u - cx) * Math.cos(a) - (v - cy) * Math.sin(a), cy + (u - cx) * Math.sin(a) + (v - cy) * Math.cos(a)];
  const turn = (ring, a) => ring.map((q) => { const [u, v] = rot(a)(q.u, q.v); return { u, v, nu: q.nu * Math.cos(a) - q.nv * Math.sin(a), nv: q.nu * Math.sin(a) + q.nv * Math.cos(a) }; });
  const r0 = rrect(0, 0, W, W, 3, 4), i0 = rrect(1.2, 1.2, W - 1.2, W - 1.2, 2, 4);
  const z0 = 2 * U + 1, z1 = H;
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    put(top, prism(P, front, turn(r0, a), turn(i0, a), z0, z1));
    const R = rot(a), Q = (u, v, z) => P(...R(u, v), z);
    let s = "";
    for (const t of [U, 2 * U]) s += seg(Q(t, 1, z1), Q(t, W - 1, z1)) + seg(Q(1, t, z1), Q(W - 1, t, z1));
    // side faces that face the camera: two vertical cuts each
    for (const [nu, nv, f] of [[1, 0, (t) => [W, t]], [0, 1, (t) => [t, W]], [-1, 0, (t) => [0, t]], [0, -1, (t) => [t, 0]]]) {
      const n = { u: 0, v: 0, nu: nu * Math.cos(a) - nv * Math.sin(a), nv: nu * Math.sin(a) + nv * Math.cos(a) };
      if (!front(n)) continue;
      for (const t of [U, 2 * U]) { const [u, v] = f(t); s += seg(Q(u, v, z0 + 0.8), Q(u, v, z1 - 0.8)); }
    }
    grid.setAttribute("d", s);
  }
  const sp = spring(REST, { k: 90, c: 16 });
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function aim(t, r) { sp.t = t; read.textContent = r ? "rest" : Math.round((t * 180) / Math.PI) + "°"; B.wake(); }
  aim(REST, 1);
  bag.add(pointer(stage, { move: ([sx]) => aim(clamp((sx - 200) / 130, -1, 1) * 0.78 * gain), leave: () => aim(REST, 1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = v; }, destroy: bag.dispose };
}

hairline({
  name: "rubikcube",
  means: "A twist puzzle cube: its top layer turns about the axis to follow the pointer, and settles a little twisted at rest.",
  rules: [3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[110, 150], [300, 170], [230, 120], null],
  mount,
});
