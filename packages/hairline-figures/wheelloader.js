/**
 * Wheel loader: a big-wheeled loader with an engine at the back, a tall cab
 * in the middle and a front frame carrying two lift arms and a wide bucket.
 * The pointer stands on the ground: the nearer it comes to the bucket end,
 * the higher the arms lift and the further the bucket tips forward to dump,
 * on a spring, bucket bright. At rest the bucket lies on the ground. The
 * slider is how far the arms lift and the bucket tips.
 *
 * The pattern: a part following the pointer (spring), lift and tip together.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = 36, PZ = 24, L = 30, A0 = -0.5, YS = [3, 23];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[-4, -6, 0], [-4, 32, 0], [64, -6, 0], [64, 32, 0], [74, 13, 0], [66, 13, 58], [20, 13, 42]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  function bar(a, b, r, n = 18) {
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], Ln = Math.hypot(...d) || 1, e = d.map((x) => x / Ln);
    let u = Math.abs(e[2]) > 0.9 ? [1, 0, 0] : [e[1], -e[0], 0]; const un = Math.hypot(...u) || 1; u = u.map((x) => x / un);
    const v = [e[1] * u[2] - e[2] * u[1], e[2] * u[0] - e[0] * u[2], e[0] * u[1] - e[1] * u[0]];
    const ring = (c) => Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2, co = Math.cos(t), si = Math.sin(t);
      return P(c[0] + r * (co * u[0] + si * v[0]), c[1] + r * (co * u[1] + si * v[1]), c[2] + r * (co * u[2] + si * v[2]));
    });
    return poly(hull(ring(a).concat(ring(b))));
  }
  const block = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  const path = (d, cls = "sil") => mk("path", { class: cls, d }, g);
  const wheel = (x, y0, y1) => path(bar([x, y0, 10], [x, y1, 10], 10));

  wheel(10, -5, 2); wheel(46, -5, 2);
  const farArm = path("");
  block(0, 3, 30, 23, 5, 1.6, 9, 24);          // engine body
  block(28, 6, 50, 20, 3, 1.3, 9, 19);         // front frame
  block(16, 4, 32, 22, 3, 1.4, 24, 44);        // cab
  const nearArm = path("");
  wheel(10, 24, 31); wheel(46, 24, 31);
  const bucket = path("", "sil hi");

  const s = spring(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = A0 + t, q = -1.15 * t, tip = (y) => [PX + L * Math.cos(a), y, PZ + L * Math.sin(a)];
    farArm.setAttribute("d", bar([PX, YS[0], PZ], tip(YS[0]), 2.8));
    nearArm.setAttribute("d", bar([PX, YS[1], PZ], tip(YS[1]), 2.8));
    const T = tip(0), pts = [];
    for (const y of [-6, 32]) for (const [h, k] of [[-2, 5], [10, 3], [15, -6], [4, -9], [-3, -3]]) {
      pts.push(P(T[0] + h * Math.cos(q) - k * Math.sin(q), y, T[2] + h * Math.sin(q) + k * Math.cos(q)));
    }
    bucket.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(s.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    const [u, v] = unproj(C, p[0], p[1], 0);
    if (u < -14 || u > 84 || v < -20 || v > 46) return leave();
    const t = clamp((u - 6) / 60, 0, 1);
    s.t = t * max;
    read.textContent = "lift " + Math.round(t * 100) + "%";
    B.wake();
  }
  function leave() { s.t = 0; read.textContent = "rest"; B.wake(); }
  draw(0);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (s.t > 0) s.t = Math.min(s.t, max); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "wheelloader",
  means: "A wheel loader: the nearer the pointer comes to the bucket end, the higher the arms lift and the further the bucket tips to dump.",
  rules: [1, 3, 5, 8],
  range: [0.6, 1, 1.25],
  tour: [[187, 192], [261, 230], [283, 240], null],
  mount,
});
