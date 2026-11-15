/**
 * Otoscope: a ribbed handle standing on a charging cup, its head and long
 * speculum cone on top. The pointer's side swings the head round to look
 * that way. At rest it faces left, bright. The slider is how far it swings.
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
const REST = 200, HZ = 52;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.8);
  const dir = (a) => [Math.cos(a * D), Math.sin(a * D)];
  const ex = [[-34, -34, 0], [34, 34, 0], [34, -34, 0], [-34, 34, 0]];
  for (let a = 0; a < 360; a += 30) { const [c, s] = dir(a); ex.push([c * 44, s * 44, HZ + 8]); }
  fit(C, ex, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 14), disc(0, 0, 11), 0, 12));
  const h = cyl(P, [0, 0, 12], [0, 0, HZ - 8], 7, 8, 32);
  mk("path", { d: h.sil, class: "sil" }, g);
  for (const z of [22, 30, 38]) mk("path", { d: cyl(P, [0, 0, z], [0, 0, z + 0.1], 7.5, 7.5, 32).end, class: "nf lo" }, g);
  const body = mk("path", { class: "sil" }, g), cone = mk("path", { class: "sil hi" }, g), tipR = mk("path", { class: "nf" }, g);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const [c, s] = dir(a), back = [-c * 10, -s * 10, HZ], mid = [c * 8, s * 8, HZ], end = [c * 42, s * 42, HZ];
    const bo = cyl(P, back, mid, 11, 11, 32), co = cyl(P, mid, end, 8, 2.5, 32);
    body.setAttribute("d", bo.sil);
    cone.setAttribute("d", co.sil);
    tipR.setAttribute("d", co.end);
    // paint the nearer piece last
    const fwd = P(c, s, 0)[1] > P(0, 0, 0)[1];
    if (fwd) g.append(body, cone, tipR); else g.append(cone, tipR, body);
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
  name: "otoscope",
  means: "An otoscope standing in its charging cup: the head and its speculum cone swing round to look toward the pointer's side.",
  rules: [1, 3, 4, 5],
  range: [40, 120, 160],
  tour: [[330, 240], [80, 240], [200, 150], null],
  mount,
});
