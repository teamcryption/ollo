/**
 * Tea trolley: a two-tier trolley on four small wheels, a teapot and cups on
 * its top tray, standing on a long runner rug. The pointer's place along the
 * rug is where the trolley rolls to, on a spring, and stops at either end.
 * At rest it waits a little left of centre, its top tray bright.
 *
 * The pattern: one value follows the pointer (spring).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 70, D = 40, Z1 = 14, Z2 = 44, RANGE = 34, REST = -14;
const cyl = (x, y, r, z0, z1, P, front, parent) => put(solid(parent), prism(P, front, circ(r, 28).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), circ(r - 1.2, 28).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), z0, z1));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.9);
  const X0 = -RANGE - 8, XE = W + RANGE + 8;
  fit(C, [[X0, -6, 0], [XE, D + 6, 0], [X0, -6, Z2 + 20], [XE, D + 6, Z2 + 20]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(X0, -6, XE, D + 6, 6, 3);
  put(solid(g), prism(P, front, rr, ri, 0, 1.5));
  const car = mk("g", {}, g);
  const legs = [[2, 2], [W - 2, 2], [2, D - 2], [W - 2, D - 2]].sort((a, b) => P(a[0], a[1], 0)[1] - P(b[0], b[1], 0)[1]);
  const leg = ([x, y]) => {
    const wh = [];
    for (const q of circ(4, 20)) for (const dy of [-1.2, 1.2]) wh.push(P(x + q.u, y + dy, 5.5 + q.v));
    mk("path", { d: poly(hull(wh)) }, car);
    const [lr, li] = rings(x - 1.6, y - 1.6, x + 1.6, y + 1.6, 1.2, 0.6);
    put(solid(car), prism(P, front, lr, li, 8, Z2));
  };
  legs.slice(0, 3).forEach(leg);
  const [ar, ai] = rings(0, 0, W, D, 4, 2.5);
  put(solid(car), prism(P, front, ar, ai, Z1, Z1 + 3));
  leg(legs[3]);
  const top = solid(car);
  put(top, prism(P, front, ar, ai, Z2, Z2 + 4));
  top.sil.classList.add("hi");
  cyl(24, 16, 10, Z2 + 2, Z2 + 16, P, front, car);
  cyl(24, 16, 2, Z2 + 16, Z2 + 19, P, front, car);
  cyl(48, 10, 4.5, Z2 + 2, Z2 + 8, P, front, car);
  cyl(52, 26, 4.5, Z2 + 2, Z2 + 8, P, front, car);
  cyl(30, 30, 6, Z1 + 2, Z1 + 5, P, front, car);
  const o0 = P(0, 0, 0), o1 = P(1, 0, 0), ex = o1[0] - o0[0], ey = o1[1] - o0[1];
  const sp = spring(REST);
  let last = NaN;
  function draw() {
    if (sp.x === last) return;
    last = sp.x;
    car.setAttribute("transform", "translate(" + (ex * sp.x).toFixed(2) + " " + (ey * sp.x).toFixed(2) + ")");
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const clamp = (v) => Math.max(-RANGE, Math.min(RANGE, v));
  function aim(t) { sp.t = t; read.textContent = t === REST ? "rest" : "x " + Math.round(t); B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [wx] = unproj(C, sx, sy, 0); aim(clamp(Math.round(wx - W / 2))); },
    leave: () => aim(REST),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
}

hairline({
  name: "teatrolley",
  means: "A two-tier tea trolley on a runner rug: it rolls along the rug to where the pointer stands, and stops at either end.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[113, 169], [200, 210], [274, 250], null],
  mount,
});
