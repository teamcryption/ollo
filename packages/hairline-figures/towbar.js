/**
 * Tow hitch: a rear bumper with a swan-neck towbar under it, ending in a ball
 * on a short post. The pointer swings the bar: across the figure it turns on
 * its pivot under the bumper, on a spring, out to the side or straight back.
 * At rest it stands a little off straight. The slider is how far it swings.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, unproj, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

/** p turned by a about the axis ax (a unit vector) through o. */
function rot(p, o, ax, a) {
  const c = Math.cos(a), s = Math.sin(a), [x, y, z] = [p[0] - o[0], p[1] - o[1], p[2] - o[2]], [u, v, w] = ax;
  const d = u * x + v * y + w * z;
  return [o[0] + x * c + (v * z - w * y) * s + u * d * (1 - c), o[1] + y * c + (w * x - u * z) * s + v * d * (1 - c), o[2] + z * c + (u * y - v * x) * s + w * d * (1 - c)];
}
/** A round bar from A (radius ra) to B (radius rb), its crease the ring at B. */
function bar(P, s, A, B, ra, rb) {
  const d = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], n = Math.hypot(...d), e = d.map((q) => q / n);
  let u = [e[1], -e[0], 0]; if (Math.hypot(...u) < 0.1) u = [1, 0, 0];
  const un = Math.hypot(...u); u = u.map((q) => q / un);
  const v = [u[1] * e[2] - u[2] * e[1], u[2] * e[0] - u[0] * e[2], u[0] * e[1] - u[1] * e[0]];
  const ring = (c, r) => circ(r, 24).map((q) => P(...[0, 1, 2].map((j) => c[j] + q.u * u[j] + q.v * v[j])));
  s.sil.setAttribute("d", poly(hull(ring(A, ra).concat(ring(B, rb)))));
  s.cr.setAttribute("d", poly(ring(B, rb * 0.6)));
}
/** A ball's outline: the hull of its three great circles. */
function ball(P, s, c, r) {
  const pts = [];
  for (const q of circ(r, 24)) pts.push(P(c[0] + q.u, c[1] + q.v, c[2]), P(c[0] + q.u, c[1], c[2] + q.v), P(c[0], c[1] + q.u, c[2] + q.v));
  s.sil.setAttribute("d", poly(hull(pts)));
}

const PIV = [0, 0, 18], REST = 0.2, MAXA = 55;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-14, -44, 0], [6, 44, 40], [50, 0, 0], [30, 40, 34], [30, -40, 34]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [o, i] = rings(-14, -44, 4, 44, 6, 1.6);
  put(solid(g), prism(P, front, o, i, 22, 40));
  const neck = solid(g), post = solid(g), hitch = solid(g);
  hitch.sil.classList.add("hi");
  const t = spring(REST);
  let last = "", over = null, gain = value;
  function draw() {
    const key = t.x.toFixed(3);
    if (key === last) return;
    last = key;
    const a = rad(MAXA) * t.x, T = (p) => rot(p, PIV, [0, 0, 1], a);
    bar(P, neck, T([0, 0, 20]), T([40, 0, 14]), 4.5, 4);
    bar(P, post, T([40, 0, 14]), T([42, 0, 26]), 3, 2.4);
    ball(P, hitch, T([42, 0, 31]), 6.5);
  }
  const B = register(stage, (dt) => { const m = stepS(t, dt); draw(); return m; });
  bag.add(B.unregister);
  function retarget() {
    t.t = over === null ? REST : over;
    read.textContent = over === null ? "rest" : `${Math.round(MAXA * over)}°`;
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      over = x > -30 && x < 90 && Math.abs(y) < 80 ? clamp((y / 45) * gain, -1, 1) : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget(); draw();
  return { set: (v) => { gain = v; }, destroy: bag.dispose };
}

hairline({
  name: "towbar",
  means: "A tow hitch under a bumper: the pointer swings the swan-neck bar and its ball out to either side, on its pivot.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[167, 250], [290, 188], [228, 219], null],
  mount,
});
