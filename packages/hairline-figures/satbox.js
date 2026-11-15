/**
 * TV wall mount: a television on a two-link swing arm from a wall plate. The pointer swings the arm out and turns the screen toward it; at rest the arm is folded a little and the screen is bright. The slider is how quickly it follows.
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
const REST = 0.3, BIAS = [-100];
const mv = (p, d) => p.map((q) => [q[0] + d[0], q[1] + d[1], q[2]]);
function build(t) {
  const a1 = 0.7 * t, a2 = a1 - 1.0 * t, a3 = 0.6 * t, base = [0, -30, 0];
  const wall = bx(-12, -33, 14, 12, -30, 54);
  const arm1 = rot(bx(-2.5, -30, 32, 2.5, -8, 37), base, "z", a1);
  const j1 = [-22 * Math.sin(a1) * -1 * 0 + 22 * -Math.sin(a1), -30 + 22 * Math.cos(a1)];
  const arm2 = rot(mv(bx(-2.5, 0, 31, 2.5, 22, 36), j1), [j1[0], j1[1], 0], "z", a2);
  const j2 = [j1[0] - 22 * Math.sin(a2), j1[1] + 22 * Math.cos(a2)];
  const tv = rot(mv(bx(-38, 0, 12, 38, 4, 56), j2), [j2[0], j2[1], 0], "z", a3);
  return [wall, arm1, arm2, tv];
}
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-55,-35,0],[55,35,0],[55,-35,0],[-55,35,0],[-55,-35,60],[55,35,60],[55,-35,60],[-55,35,60]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const parts = Array.from({ length: 4 }, () => solid(g));
  parts[3].sil.classList.add("hi");
  const sp = spring(REST, { k: 90 * value, c: 17 * Math.sqrt(value) });
  let last = "";
  function draw() {
    const key = sp.x.toFixed(3);
    if (key === last) return;
    last = key;
    const list = build(sp.x);
    list.forEach((pts, i) => paint(P, parts[i], pts));
    // paint order by depth along the view, far first
    const dep = list.map((pts, i) => [pts.reduce((m, p) => m + p[0] * V[0] + p[1] * V[1] + p[2] * V[2], 0) / pts.length + (BIAS[i] || 0), i]);
    dep.sort((a, b) => a[0] - b[0]).forEach(([, i]) => g.appendChild(parts[i].g));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(t, live) { sp.t = t; read.textContent = live ? Math.round(0.6 * t * 57.3) + "°" : "rest"; B.wake(); }
  bag.add(pointer(stage, {
    move: (p) => aim(clamp((p[0] - 200) / 130, -1, 1), true),
    leave: () => aim(REST),
  }));
  bag.add(() => svg.replaceChildren());
  draw(); aim(REST);
  return { set: (v) => { sp.k = 90 * v; sp.c = 17 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "satbox",
  means: "A TV on a wall-mount swing arm: the arm swings out and the screen turns to face the pointer.",
  rules: [1, 3, 4, 5],
  range: [0.5, 1, 1.6],
  tour: [[192, 141], [79, 189], [227, 158], null],
  mount,
});
