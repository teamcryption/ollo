/**
 * Mortar and pestle: a flared stone bowl with a heavy pestle resting in it.
 * The pointer's side turns the pestle around the bowl, grinding. At rest it
 * leans over the rim, bright. The slider is how far it turns.
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
const REST = 30, TILT = 34 * D, LEN = 62;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.3);
  const tip = (a) => [Math.cos(a * D) * Math.sin(TILT) * LEN, Math.sin(a * D) * Math.sin(TILT) * LEN, 16 + Math.cos(TILT) * LEN];
  const ex = [];
  for (let a = -90; a <= 150; a += 30) ex.push(tip(a));
  fit(C, ex.concat([[-30, -30, 0], [30, 30, 0], [30, -30, 0], [-30, 30, 0]]), 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 20), disc(0, 0, 17), 0, 4));
  const bowl = mk("path", { class: "sil" }, g);
  const b = cyl(P, [0, 0, 4], [0, 0, 26], 18, 27, 44);
  bowl.setAttribute("d", b.sil);
  mk("path", { d: b.end, class: "nf" }, g);
  mk("path", { d: cyl(P, [0, 0, 26], [0, 0, 26.1], 22, 22, 44).end, class: "nf lo" }, g);
  const pest = mk("path", { class: "sil hi" }, g), cap = mk("path", { class: "nf" }, g);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = cyl(P, [0, 0, 16], tip(a), 4.5, 8, 28);
    pest.setAttribute("d", c.sil);
    cap.setAttribute("d", c.end);
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
  name: "mortarpestle",
  means: "A stone mortar with a pestle resting in it: the pestle turns around the bowl toward the pointer's side, grinding.",
  rules: [1, 3, 4, 5],
  range: [40, 110, 120],
  tour: [[330, 240], [80, 240], [200, 150], null],
  mount,
});
