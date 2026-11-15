/**
 * Exam lamp: a rolling floor stand with a tall pole, a long arm and a wide
 * lamp head hanging from its end. The pointer's side swings the arm round to
 * light that part of the room. At rest it reaches left, bright.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;
const D = Math.PI / 180, cl = (v, a, b) => Math.max(a, Math.min(b, v));
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const cr3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nz = (a) => { const l = Math.hypot(...a); return a.map((q) => q / l); };
// a solid of revolution between two 3D points: silhouette hull and the far end ring
function cyl(P, a, b, r1, r2, n = 28) {
  const w = nz([b[0] - a[0], b[1] - a[1], b[2] - a[2]]);
  const u = nz(cr3(w, Math.abs(w[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), v = cr3(w, u);
  const ring = (c, r) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI, cs = Math.cos(t) * r, sn = Math.sin(t) * r; o.push(P(c[0] + u[0] * cs + v[0] * sn, c[1] + u[1] * cs + v[1] * sn, c[2] + u[2] * cs + v[2] * sn)); } return o; };
  const A = ring(a, r1), B = ring(b, r2);
  return { sil: poly(hull(A.concat(B))), end: poly(B), start: poly(A) };
}
const REST = 160, PZ = 70, ARM = 40;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.6);
  const ex = [[-22, -22, 0], [22, 22, 0], [22, -22, 0], [-22, 22, 0]];
  for (let a = 0; a < 360; a += 30) ex.push([Math.cos(a * D) * (ARM + 14), Math.sin(a * D) * (ARM + 14), PZ + 4], [Math.cos(a * D) * (ARM + 14), Math.sin(a * D) * (ARM + 14), PZ - 22]);
  fit(C, ex, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (let k = 0; k < 5; k++) { const a = (k / 5) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a); mk("path", { d: cyl(P, [0, 0, 3], [c * 20, s * 20, 2], 2, 2, 12).sil, class: "sil" }, g); }
  put(solid(g), prism(P, front, disc(0, 0, 6), disc(0, 0, 4), 0, 6));
  mk("path", { d: cyl(P, [0, 0, 6], [0, 0, PZ], 2.2, 2.2, 16).sil, class: "sil" }, g);
  const arm = mk("path", { class: "sil" }, g), stem = mk("path", { class: "sil" }, g), head = mk("path", { class: "sil hi" }, g), mouth = mk("path", { class: "nf" }, g);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(a * D), s = Math.sin(a * D), e = [c * ARM, s * ARM, PZ];
    arm.setAttribute("d", cyl(P, [0, 0, PZ], e, 2.4, 2.4, 16).sil);
    stem.setAttribute("d", cyl(P, e, [e[0], e[1], PZ - 8], 1.8, 1.8, 12).sil);
    const h = cyl(P, [e[0], e[1], PZ - 8], [e[0] + c * 4, e[1] + s * 4, PZ - 22], 5, 13, 36);
    head.setAttribute("d", h.sil);
    mouth.setAttribute("d", h.end);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  function go(t, txt) { tset(ang, t, performance.now(), 0); read.textContent = txt; B.wake(); }
  draw(REST); go(REST, "rest");
  bag.add(pointer(stage, { move: ([sx]) => { const k = cl((sx - 200) / 130, -1, 1), t = REST + k * reach; go(t, Math.round(t) + "\u00b0"); }, leave: () => go(REST, "rest") }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "physioball",
  means: "An exam room lamp on a rolling stand: its long arm swings round so the wide lamp head hangs over the pointer's side.",
  rules: [1, 3, 4, 5],
  range: [40, 120, 160],
  tour: [[330, 240], [80, 240], [200, 150], null],
  mount,
});
