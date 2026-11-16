/**
 * Semaphore: a railway signal post with its arm on a pivot near the top and
 * a counterweight behind. The pointer works the signal: across the figure the
 * arm swings from level (stop) up to clear on a spring. At rest the arm
 * stands a little off level. The slider is how far it can swing.
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

const PIV = [0, -6, 92], REST = 0.12, MAXA = 50;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-14, -14, 0], [14, 14, 0], [62, -6, 92], [42, -6, 142], [-14, -6, 80]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [o, i] = rings(-14, -14, 14, 14, 4, 1.4);
  put(solid(g), prism(P, front, o, i, 0, 7));
  const post = solid(g), cap = solid(g);
  bar(P, post, [0, 0, 7], [0, 0, 104], 3.4, 3);
  ball(P, cap, [0, 0, 108], 4.5);
  const weight = solid(g), arm = solid(g), tip = solid(g);
  arm.sil.classList.add("hi"); tip.sil.classList.add("hi");
  const t = spring(REST);
  let last = "", over = null, gain = value;
  function draw() {
    const key = t.x.toFixed(3);
    if (key === last) return;
    last = key;
    const a = -rad(MAXA) * t.x, T = (p) => rot(p, PIV, [0, 1, 0], a);
    bar(P, weight, T([-4, -6, 92]), T([-14, -6, 90]), 2.4, 6);
    bar(P, arm, T([-2, -6, 92]), T([60, -6, 92]), 5.5, 5);
    ball(P, tip, T([64, -6, 92]), 3);
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
      over = Math.abs(x) < 90 && Math.abs(y) < 90 ? clamp(((x - y) / 120 + 0.5) * gain, 0, 1) : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget(); draw();
  return { set: (v) => { gain = v; }, destroy: bag.dispose };
}

hairline({
  name: "levelxing",
  means: "A railway semaphore: across the figure the pointer swings its arm from level, at stop, up to clear.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[63, 272], [246, 272], [155, 272], null],
  mount,
});
