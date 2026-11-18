/**
 * Scroll saw: a long upper arm hinged on a post at the back of a low base,
 * its fine blade dropping through the table in front. The pointer over the
 * table lifts the arm on its hinge and draws the blade up out of the table,
 * the farther forward the higher. At rest the arm sits down, bright.
 * The slider is how far the arm lifts.
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rings, seg, unproj, spring, stepS, mk, pointer, put, register, solid, disposer } = HL;

const PX = -36, PZ = 58, R = 5, L = 84, TIP = 76, REST = 3, LIFT = 38;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-46, -24, 0], [64, 24, 0], [-46, -6, 118], [34, 6, 118], [80, 6, 60]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const rot = (deg) => {
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    return (dx, dz) => [PX + dx * c - dz * s, PZ + dx * s + dz * c];
  };
  function ext(el, prof, y0, y1) {
    const pts = [], f = [];
    for (const [x, z] of prof) { pts.push(P(x, y0, z), P(x, y1, z)); f.push(P(x, y1, z)); }
    el.setAttribute("d", poly(hull(pts)) + poly(f));
  }
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [a, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, a, i, z0, z1)); };
  box(-46, -18, 26, 18, 5, 1.4, 0, 18);
  box(-44, -8, -28, 8, 4, 1.2, 18, PZ - 2);
  box(14, -24, 64, 24, 4, 1.4, 18, 22);
  const blade = mk("path", { class: "sil" }, g);
  const arm = mk("path", { class: "sil hi" }, g);
  const t = spring(REST);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const q = rot(v), o = [];
    for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + (Math.PI * i) / 10; o.push(q(L + R * Math.cos(a), R * Math.sin(a))); }
    for (let i = 0; i <= 10; i++) { const a = Math.PI / 2 + (Math.PI * i) / 10; o.push(q(-8 + R * 1.4 * Math.cos(a), R * 1.4 * Math.sin(a))); }
    ext(arm, o, -5, 5);
    const [bx, bz] = q(TIP, -R), [cx, cz] = q(TIP, -(PZ - 22 + 1));
    blade.setAttribute("d", seg(P(bx, 0, bz), P(cx, 0, cz)) + seg(P(bx + 2, 0, bz - 2), P(bx - 2, 0, bz - 2)));
  }
  const B = register(stage, (dt) => { const m = stepS(t, dt); draw(t.x); return m; });
  bag.add(B.unregister);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 22);
    if (x < -50 || x > 70 || y < -30 || y > 30) return -1;
    return clamp((x + 10) / 64, 0, 1);
  }
  let cur = -1;
  function set(v) {
    cur = v;
    t.t = v < 0 ? REST : REST + v * reach * LIFT;
    read.textContent = v < 0 ? "rest" : "arm " + Math.round(t.t) + "°";
    B.wake();
  }
  set(-1);
  bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (cur >= 0) set(cur); }, destroy: bag.dispose };
}

hairline({
  name: "scrollsaw",
  means: "A scroll saw: the pointer over the table lifts the long upper arm on its hinge, drawing the fine blade up out of the table.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[205, 248], [256, 274], [230, 261], null],
  mount,
});
