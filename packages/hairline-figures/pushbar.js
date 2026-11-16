/**
 * Bus handle: a ceiling rail with a strap hanging from it and a triangular grip at its foot. The pointer swings the strap out from the rail; at rest it hangs a little aside, bright.
 *
 * The pattern: one part answers the pointer's screen x (a swing); hit areas never move.
 */
const { Cam, fit, proj, poly, clamp, lerp, rad, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const S = 2.05, A0 = 14, LO = -30, UNIT = "°", RANGE = [20,45,60];
const O = [60,0,93], AX = "x";
const K = 0.5, CE = Math.sqrt(1 - K * K) / Math.SQRT2, V = [CE, CE, K];
const BF = [[0, 2, 3, 1], [4, 5, 7, 6], [0, 4, 6, 2], [1, 3, 7, 5], [0, 1, 5, 4], [2, 6, 7, 3]];
const box = (x0, y0, z0, x1, y1, z1) => ({ v: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => [i & 1 ? x1 : x0, i & 2 ? y1 : y0, i & 4 ? z1 : z0]), f: BF });
const ext = (loop, d) => {
  const n = loop.length, ix = [...Array(n).keys()], f = [ix, ix.map((i) => i + n)];
  for (let i = 0; i < n; i++) f.push([i, (i + 1) % n, ((i + 1) % n) + n, i + n]);
  return { v: loop.concat(loop.map((p) => [p[0] + d[0], p[1] + d[1], p[2] + d[2]])), f };
};
const xz = (pts, y0, w) => ext(pts.map(([x, z]) => [x, y0, z]), [0, w, 0]);
const ngon = (cx, cz, r, n, a0 = 0) => [...Array(n)].map((_, i) => [cx + r * Math.cos(a0 + (i * 2 * Math.PI) / n), cz + r * Math.sin(a0 + (i * 2 * Math.PI) / n)]);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const mid = (ps) => ps.reduce((m, p) => [m[0] + p[0] / ps.length, m[1] + p[1] / ps.length, m[2] + p[2] / ps.length], [0, 0, 0]);
const PARTS = [
  { s: box(0, -3, 90, 120, 3, 96) },
  { s: box(8, -3, 96, 16, 3, 108) },
  { s: box(104, -3, 96, 112, 3, 108) },
  { s: box(55, -4, 84, 65, 4, 97), m: 1 },
  { s: box(57, -1.5, 46, 63, 1.5, 84), m: 1 },
  { s: xz([[40, 18], [80, 18], [80, 26], [40, 26]], -3, 6), m: 1 },
  { s: xz([[40, 26], [48, 26], [64, 48], [56, 48]], -3, 6), m: 1 },
  { s: xz([[72, 26], [80, 26], [64, 48], [56, 48]], -3, 6), m: 1 },
];
// moves a point by the gesture: a turn about the axis through O, or a slide along it
function move(p, a) {
  if (Array.isArray(AX)) return [p[0] + AX[0] * a, p[1] + AX[1] * a, p[2] + AX[2] * a];
  const c = Math.cos(rad(a)), s = Math.sin(rad(a));
  let [x, y, z] = sub(p, O);
  if (AX === "z") [x, y] = [x * c - y * s, x * s + y * c];
  else if (AX === "y") [x, z] = [x * c + z * s, -x * s + z * c];
  else [y, z] = [y * c - z * s, y * s + z * c];
  return [x + O[0], y + O[1], z + O[2]];
}
// the faces of one convex solid that face the camera, as one path, and its depth
function shade(v, f, P) {
  const c = mid(v), ds = [];
  for (const fi of f) {
    const q = fi.map((i) => v[i]), fc = mid(q);
    let n = cross(sub(q[1], q[0]), sub(q[2], q[1]));
    if (dot(n, sub(fc, c)) < 0) n = n.map((x) => -x);
    if (dot(n, V) > 1e-6) ds.push(poly(q.map((p) => P(...p))));
  }
  return { d: ds.join(" "), dep: dot(c, V) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value, aim = A0;
  const C = Cam(45, K, S), pts = [];
  for (const a of [A0, RANGE[2]]) for (const p of PARTS) for (const q of p.s.v) pts.push(p.m ? move(q, a * p.m) : q);
  fit(C, pts, 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const els = PARTS.map((p) => mk("path", p.m ? { class: "hi" } : {}, g));
  const ang = tween(A0);
  let last = NaN;
  const B = register(stage, (_dt, now) => {
    const a = tval(ang, now);
    if (a !== last) {
      last = a;
      const list = PARTS.map((p, i) => ({ i, lay: p.lay || 0, ...shade(p.m ? p.s.v.map((q) => move(q, a * p.m)) : p.s.v, p.s.f, P) }));
      list.sort((u, w) => u.lay - w.lay || u.dep - w.dep);
      for (const it of list) { els[it.i].setAttribute("d", it.d); g.append(els[it.i]); }
    }
    return !tdone(ang, now);
  });
  bag.add(B.unregister);
  let t = -1;
  function aimAt(tt) {
    t = tt;
    aim = t < 0 ? A0 : lerp(LO, top, t);
    tset(ang, aim, performance.now(), 0);
    read.textContent = t < 0 ? "rest" : Math.round(aim) + UNIT;
    B.wake();
  }
  aimAt(-1);
  bag.add(pointer(stage, { move: ([sx]) => aimAt(clamp((sx - 110) / 180, 0, 1)), leave: () => aimAt(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = v; if (t >= 0) aimAt(t); }, destroy: bag.dispose };
}

hairline({
  name: "pushbar",
  means: "A bus grab handle on its rail: the pointer swings the strap and its triangle grip out, like a stop going round a bend.",
  rules: [1, 3, 4, 5, 6],
  range: [20,45,60],
  tour: [[126,78],[242,264],[308,156],null],
  mount,
});
