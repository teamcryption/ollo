/**
 * Buoy: a channel marker afloat on a round patch of water, a can hull under a
 * cone, a mast and a ball topmark. The pointer is the swell: the buoy tilts
 * towards it on a spring, further the further off it is. At rest it leans a
 * little, as a buoy on a current does. The slider is how far it can tilt.
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

const REST = [0.16, -0.08], MAXT = 0.42;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-58, -58, 0], [58, 58, 0], [-30, 0, 80], [30, 0, 80], [0, -30, 80]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(58, 72), circ(56, 72), -3, 0));
  const parts = [solid(g), solid(g), solid(g), solid(g)];
  parts[3].sil.classList.add("hi");
  const tx = spring(REST[0]), ty = spring(REST[1]);
  let last = "", over = null, gain = value;
  function draw() {
    const key = tx.x.toFixed(3) + "," + ty.x.toFixed(3);
    if (key === last) return;
    last = key;
    const a = Math.hypot(tx.x, ty.x), ax = a > 1e-4 ? [-ty.x / a, tx.x / a, 0] : [1, 0, 0], o = [0, 0, 0];
    const T = (p) => rot(p, o, ax, a);
    bar(P, parts[0], T([0, 0, -2]), T([0, 0, 18]), 22, 22);
    bar(P, parts[1], T([0, 0, 18]), T([0, 0, 34]), 17, 6);
    bar(P, parts[2], T([0, 0, 34]), T([0, 0, 64]), 2.6, 2.6);
    ball(P, parts[3], T([0, 0, 71]), 7.5);
  }
  const B = register(stage, (dt) => { const m = stepS(tx, dt), n = stepS(ty, dt); draw(); return m || n; });
  bag.add(B.unregister);
  function retarget() {
    const [x, y] = over ?? REST;
    tx.t = x; ty.t = y;
    read.textContent = over ? `${Math.round((Math.hypot(x, y) * 180) / Math.PI)}°` : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      if (r > 100) over = null;
      else { const k = (MAXT * gain * clamp(r / 60, 0.25, 1)) / (r || 1); over = [x * k, y * k]; }
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget(); draw();
  return { set: (v) => { gain = v; }, destroy: bag.dispose };
}

hairline({
  name: "buoy",
  means: "A channel buoy afloat: it tilts towards the pointer like a swell under it, further the further off the pointer is.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[260, 229], [200, 132], [200, 266], null],
  mount,
});
