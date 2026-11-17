/**
 * Bookshelf speaker: a tall cabinet whose fabric grille stands ajar and bright at rest; the pointer pulls it off the front and tips it forward, baring woofer and tweeter. The slider sets how far.
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
const REST = 0.3;
const disc = (cx, y, cz, R) => Array.from({ length: 25 }, (_, i) => { const a = i / 24 * 6.2832; return [cx + R * Math.cos(a), y, cz + R * Math.sin(a)]; });
const pull = (t, v) => Math.min(64, 8 + 40 * t * v);
function build(t, v) {
  const d = pull(t, v), a = -Math.min(0.55, 0.08 + 0.4 * t * v);
  const grille = rot(bx(-21, 21 + d, 1, 21, 24 + d, 61), [0, 24 + d, 1], "x", a);
  return [bx(-23, -20, 0, 23, 20, 63), disc(0, 20.3, 22, 15), disc(0, 20.6, 22, 6), disc(0, 20.3, 48, 6), disc(0, 20.6, 48, 2.5), grille];
}
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.1);
  fit(C, build(1, 1.6).flat().concat(build(REST, 0.5).flat()), 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const parts = Array.from({ length: 6 }, () => solid(g));
  parts[5].sil.classList.add("hi");
  let v = value;
  const sp = spring(REST);
  const home = P(0, 40, 40);
  let last = "";
  function draw() {
    const key = sp.x.toFixed(3) + v;
    if (key === last) return;
    last = key;
    build(sp.x, v).forEach((pts, i) => paint(P, parts[i], pts));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(t, live) { sp.t = t; read.textContent = live ? Math.round(pull(t, v)) + "mm" : "rest"; B.wake(); }
  bag.add(pointer(stage, {
    move: (p) => aim(clamp(1 - Math.hypot(p[0] - home[0], p[1] - home[1]) / 260, 0.35, 1), true),
    leave: () => aim(REST),
  }));
  bag.add(() => svg.replaceChildren());
  draw(); aim(REST);
  return { set: (x) => { v = x; last = ""; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "speakergrille",
  means: "A bookshelf speaker: the pointer pulls its grille off the front and tips it forward, baring the drivers; the slider sets how far.",
  rules: [1, 3, 4, 5],
  range: [0.5, 1, 1.6],
  tour: [[213, 157], [336, 87], [208, 197], null],
  mount,
});
