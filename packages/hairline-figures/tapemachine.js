/**
 * Cassette deck: a tape deck whose front door holds the cassette. The pointer turns the deck and swings the door open, cassette riding in it; at rest the door is ajar and bright. The slider is how quickly it follows.
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
const REST = 0.3, BIAS = [];
const open = (t) => 0.2 + 0.85 * (t + 1) / 2;
function build(t) {
  const yaw = t * 0.35, hg = [0, 25, 4], a = -open(t);
  const deck = bx(-40, -25, 0, 40, 25, 22);
  const door = rot(bx(-32, 25, 4, 0, 27, 19), hg, "x", a), tape = rot(bx(-28, 22, 7, -4, 25, 16), hg, "x", a);
  const keys = [0, 1, 2].map((i) => bx(6 + i * 10, 12, 22, 13 + i * 10, 21, 25));
  return [deck, door, tape, ...keys].map((b) => rot(b, [0, 0, 0], "z", yaw));
}
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3);
  fit(C, [[-45,-45,0],[45,45,0],[45,-45,0],[-45,45,0],[-45,-45,34],[45,45,34],[45,-45,34],[-45,45,34]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const parts = Array.from({ length: 6 }, () => solid(g));
  parts[1].sil.classList.add("hi");
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
  function aim(t, live) { sp.t = t; read.textContent = live ? Math.round(open(t) * 57.3) + "°" : "rest"; B.wake(); }
  bag.add(pointer(stage, {
    move: (p) => aim(clamp((p[0] - 200) / 130, -1, 1), true),
    leave: () => aim(REST),
  }));
  bag.add(() => svg.replaceChildren());
  draw(); aim(REST);
  return { set: (v) => { sp.k = 90 * v; sp.c = 17 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "tapemachine",
  means: "A cassette deck: it turns toward the pointer and its front door swings open with the cassette riding in it.",
  rules: [1, 3, 4, 5],
  range: [0.5, 1, 1.6],
  tour: [[109, 166], [62, 188], [338, 163], null],
  mount,
});
