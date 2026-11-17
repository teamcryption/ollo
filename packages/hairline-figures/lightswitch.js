/**
 * Light switch: a wall plate standing upright with a bat toggle in its bezel.
 * At rest the toggle stands up, on, its tip bright. The pointer over the
 * plate flips it down past the middle. The slider is how far it throws.
 *
 * The pattern: one part turning on a hinge.
 */
const { Cam, circ, fit, hull, poly, proj, rings, tset, tval, tdone, tween, disposer, mk, place, pointer, register, solid } = HL;

const V = [0.612, 0.612, 0.5], REST = 40, PX = 25, PZ = 40, L = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[0, 0, 0], [50, 0, 0], [0, 0, 80], [50, 4, 80], [0, 4, 0], [25, 40, 40], [25, 26, 72], [25, 26, 8]], 200, 166);
  const P = proj(C);
  function slab(s, ring, inner, f, w0, w1) {
    const a = ring.map((q) => P(...f(q.u, q.v, w0))), b = ring.map((q) => P(...f(q.u, q.v, w1)));
    s.sil.setAttribute("d", poly(hull(a.concat(b))));
    const c0 = f(0, 0, w0), c1 = f(0, 0, w1), vis = (c1[0] - c0[0]) * V[0] + (c1[1] - c0[1]) * V[1] + (c1[2] - c0[2]) * V[2] > 0;
    s.cr.setAttribute("d", poly(inner.map((q) => P(...f(q.u, q.v, vis ? w1 : w0)))));
  }
  const wall = (u, v, w) => [u, w, v];
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(0, 0, 50, 80, 7, 2.4);
  slab(solid(g), pr, pi, wall, 0, 4);
  for (const z of [10, 70]) place(mk("circle", { r: 1.6, class: "dot off" }, g), P(PX, 4, z));
  const [br, bi] = rings(PX - 8, PZ - 13, PX + 8, PZ + 13, 4, 1.4);
  slab(solid(g), br, bi, wall, 4, 7);
  const lg = mk("g", {}, g), tg = mk("g", {}, g);
  const lev = solid(lg), tip = solid(tg);
  tip.sil.classList.add("hi");
  const cr = circ(3.6, 20), ci = circ(2.2, 20), kr = circ(5.4, 20), ki = circ(3.8, 20);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180);
    const f = (u, v, w) => [PX + u, 7 - v * s + w * c, PZ + v * c + w * s];
    slab(lev, cr, ci, f, 0, L);
    slab(tip, kr, ki, f, L - 7, L);
    if (c * V[1] + s * V[2] > 0) lg.after(tg); else tg.after(lg);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const box = [[0, 0, 0], [50, 0, 0], [0, 4, 80], [50, 4, 80]].map((p) => P(...p));
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const X0 = Math.min(...xs) - 6, X1 = Math.max(...xs) + 6, Y0 = Math.min(...ys) - 6, Y1 = Math.max(...ys) + 6;
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(ang, o ? -swing : REST, performance.now(), 0);
    read.textContent = o ? "off" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => set(x > X0 && x < X1 && y > Y0 && y < Y1), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; if (on) { tset(ang, -v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "lightswitch",
  means: "A wall light switch with its bat toggle up: the pointer over the plate flips the toggle down to off.",
  rules: [1, 4, 5, 8],
  range: [20, 50, 70],
  tour: [[151, 148], [205, 200], [175, 80], null],
  mount,
});
