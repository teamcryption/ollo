/**
 * Boombox: a portable stereo with two speakers and a tape door; its carry handle lies folded back and bright at rest and swings up toward the pointer. The slider sets how far.
 */
const { Cam, clamp, fit, hull, poly, proj, spring, stepS, disposer, mk, pointer, register, solid } = HL;

const V = [0.612, 0.612, 0.5];
const F = [[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
const bx = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
/** Turns points about an axis ("x", "y" or "z") through o by a radians. */
function rot(pts, o, ax, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return pts.map((p) => {
    const q = [p[0] - o[0], p[1] - o[1], p[2] - o[2]];
    const r = ax === "z" ? [q[0] * c - q[1] * s, q[0] * s + q[1] * c, q[2]]
      : ax === "y" ? [q[0] * c + q[2] * s, q[1], -q[0] * s + q[2] * c]
      : [q[0], q[1] * c - q[2] * s, q[1] * s + q[2] * c];
    return [r[0] + o[0], r[1] + o[1], r[2] + o[2]];
  });
}
/** Paints a box: its hull as the plate, its camera-facing faces as creases. */
function paint(P, s, pts) {
  const sp = pts.map((p) => P(p[0], p[1], p[2]));
  s.sil.setAttribute("d", poly(hull(sp)));
  if (pts.length !== 8) { s.cr.setAttribute("d", poly(sp.slice(0, -1))); return; }
  let d = "";
  for (const f of F) {
    const a = pts[f[0]], b = pts[f[1]], c = pts[f[3]];
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    if (n[0] * V[0] + n[1] * V[1] + n[2] * V[2] > 1e-6) d += poly(f.map((i) => sp[i]));
  }
  s.cr.setAttribute("d", d);
}
const REST = 0.2, BIAS = [0, 30, 33, 30, 33, 30, 0, 0, 0];
const disc = (cx, y, cz, R) => Array.from({ length: 25 }, (_, i) => { const a = i / 24 * 6.2832; return [cx + R * Math.cos(a), y, cz + R * Math.sin(a)]; });
const tilt = (t, v) => Math.max(-0.5, 1.4 - t * 1.4 * v);
function build(t, v) {
  const yaw = (t - REST) * 0.3, o = [0, 0, 0], hg = [0, 0, 41], a = tilt(t, v);
  const body = bx(-54, -15, 0, 54, 15, 40);
  const handle = [bx(-44, -2, 40, -39, 2, 60), bx(39, -2, 40, 44, 2, 60), bx(-44, -2.5, 58, 44, 2.5, 63)].map((b) => rot(b, hg, "x", a));
  const parts = [body, disc(-32, 15.3, 19, 14), disc(-32, 15.6, 19, 5), disc(32, 15.3, 19, 14), disc(32, 15.6, 19, 5), bx(-11, 15, 12, 11, 16, 30), ...handle];
  return parts.map((b) => rot(b, o, "z", yaw));
}
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  fit(C, build(1, 1.6).flat().concat(build(REST, 0.5).flat()), 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const parts = Array.from({ length: 9 }, () => solid(g));
  [6, 7, 8].forEach((i) => parts[i].sil.classList.add("hi"));
  let v = value;
  const sp = spring(REST);
  const home = P(0, -10, 58);
  let last = "";
  function draw() {
    const key = sp.x.toFixed(3) + v;
    if (key === last) return;
    last = key;
    const list = build(sp.x, v);
    list.forEach((pts, i) => paint(P, parts[i], pts));
    const dep = list.map((pts, i) => [pts.reduce((m, p) => m + p[0] * V[0] + p[1] * V[1] + p[2] * V[2], 0) / pts.length + BIAS[i], i]);
    dep.sort((a, b) => a[0] - b[0]).forEach(([, i]) => g.appendChild(parts[i].g));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(t, live) { sp.t = t; read.textContent = live ? Math.round(90 - tilt(t, v) * 57.3) + "°" : "rest"; B.wake(); }
  bag.add(pointer(stage, {
    move: (p) => aim(clamp(1 - Math.hypot(p[0] - home[0], p[1] - home[1]) / 260, 0.35, 1), true),
    leave: () => aim(REST),
  }));
  bag.add(() => svg.replaceChildren());
  draw(); aim(REST);
  return { set: (x) => { v = x; last = ""; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "boombox",
  means: "A boombox: the pointer swings its carry handle up off the top and turns the set; the slider sets how far the handle swings.",
  rules: [1, 3, 4, 5],
  range: [0.5, 1, 1.6],
  tour: [[216, 92], [88, 184], [263, 271], null],
  mount,
});
