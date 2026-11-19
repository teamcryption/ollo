/**
 * Brace and bit: a cranked brace standing on its bit in a board. The pointer
 * turns the crank about the bit's axis on a spring, the grip sweeping round;
 * at rest it stands a quarter turn off. The slider is how far it turns.
 */
const { Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, unproj, spring, stepS, rad, disposer, mk, pointer, put, register, solid } = HL;

const RC = 38, REST = -60;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.45);
  fit(C, [[-60, -60, 0], [60, 60, 0], [-RC - 8, 0, 100], [RC + 8, 0, 100], [0, 0, 172]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-58, -46, 58, 46, 8, 1.6);
  put(solid(g), prism(P, front, br, bi, -12, 0));
  const cyl = (r, z0, z1, ox = 0, oy = 0) => { const m = (q) => ({ ...q, u: q.u + ox, v: q.v + oy }); return prism(P, front, circ(r, 24).map(m), circ(r - 1, 24).map(m), z0, z1); };
  put(solid(g), cyl(2.5, 0, 34));
  put(solid(g), cyl(7, 34, 58));
  const crank = mk("path", { class: "sil" }, g);
  const grip = solid(g), head = solid(g);
  grip.sil.classList.add("hi");
  const th = spring(REST);
  let amp = value, last = null, over = null;
  function draw() {
    if (last === th.x.toFixed(2)) return;
    last = th.x.toFixed(2);
    const c = Math.cos(rad(th.x)), s = Math.sin(rad(th.x));
    const W = (d, z) => [d * c, d * s, z];
    const path = [W(0, 58), W(0, 66), W(RC, 82), W(RC, 126), W(0, 142), W(0, 150)];
    const tube = (k) => path.map(([x, y, z]) => P(x + k * s, y - k * c, z));
    const side = path.map(([x, y, z], i) => { const sh = i === 0 || i === 5 ? 0 : 0; return P(x, y, z + sh); });
    const a = tube(3), b = tube(-3);
    const pts = side.map((q, i) => [q, a[i], b[i]]);
    let d = "";
    for (let i = 0; i < pts.length - 1; i++) d += poly(hull([pts[i][1], pts[i][2], pts[i + 1][1], pts[i + 1][2], P(path[i][0] + 3 * c, path[i][1] + 3 * s, path[i][2]), P(path[i + 1][0] - 3 * c, path[i + 1][1] - 3 * s, path[i + 1][2])]));
    crank.setAttribute("d", d);
    put(grip, cyl(7, 88, 120, RC * c, RC * s));
    put(head, cyl(15, 150, 162));
  }
  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(B.unregister);
  function retarget() {
    th.t = over == null ? REST : REST + clamp(over, -1, 1) * 150 * amp;
    read.textContent = over == null ? "rest" : `${Math.round(th.t - REST)}°`;
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); over = Math.hypot(x, y) > 140 ? null : (x - y) / 90; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { amp = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "brace",
  means: "A brace and bit in a board: the crank swings round the bit toward the pointer and settles back a quarter turn off.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.4],
  tour: [[313, 279], [87, 207], [200, 243], null],
  mount,
});
