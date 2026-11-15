/**
 * Sample centrifuge: a round benchtop drum with sample tubes racked in its
 * rotor, under a hinged lid. The pointer's side swings the lid open on its
 * back hinge. At rest it is ajar, bright. The slider is how far it opens.
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
const REST = 42, R = 30, TOP = 40, DX = -Math.SQRT1_2, DY = -Math.SQRT1_2;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.65);
  const ex = [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [DX * R * 2, DY * R * 2, TOP + 4], [DX * R, DY * R, TOP + 2 * R + 4]];
  fit(C, ex, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, R), disc(0, 0, R - 4), 0, TOP));
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * 2 * Math.PI + 0.3, c = Math.cos(a), s = Math.sin(a);
    const t = cyl(P, [c * 10, s * 10, TOP - 6], [c * 18, s * 18, TOP + 3], 2.6, 2.6, 16);
    mk("path", { d: t.sil, class: "sil" }, g);
    mk("path", { d: t.end, class: "nf lo" }, g);
  }
  const lid = mk("path", { class: "sil hi" }, g), lidR = mk("path", { class: "nf" }, g);
  const hx = DX * R, hy = DY * R;
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(a * D), s = Math.sin(a * D);
    const ctr = [hx - DX * R * c, hy - DY * R * c, TOP + R * s], n = [DX * s * 3, DY * s * 3, c * 3];
    const l = cyl(P, ctr, [ctr[0] + n[0], ctr[1] + n[1], ctr[2] + n[2]], R, R, 48);
    lid.setAttribute("d", l.sil);
    lidR.setAttribute("d", cyl(P, ctr, [ctr[0] + n[0], ctr[1] + n[1], ctr[2] + n[2]], R - 5, R - 5, 48).end);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  function go(t, txt) { tset(ang, t, performance.now(), 0); read.textContent = txt; B.wake(); }
  draw(REST); go(REST, "rest");
  bag.add(pointer(stage, { move: ([sx]) => { const k = cl((sx - 70) / 260, 0, 1), t = REST + k * (reach - REST); go(t, Math.round(t) + "\u00b0"); }, leave: () => go(REST, "rest") }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "bloodtube",
  means: "A benchtop centrifuge with tubes racked in its rotor: the lid swings open on its back hinge as the pointer moves right.",
  rules: [1, 3, 4, 5],
  range: [60, 90, 95],
  tour: [[330, 240], [80, 240], [200, 150], null],
  mount,
});
