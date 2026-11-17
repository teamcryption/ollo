/**
 * Trophy cup: a two-handled cup on a stepped plinth, its domed lid sitting
 * a little ajar. The pointer over the trophy lifts the lid clear of the rim
 * and tips it back, showing the open cup. The slider is how far it lifts.
 */
const { Cam, fit, proj, hull, poly, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;
const A = (a, b, s = 1) => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
const N3 = (a) => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };
const X3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const ring3 = (c, u, v, r, n = 28) => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI; return A(A(c, u, r * Math.cos(t)), v, r * Math.sin(t)); });
const rot = (q, o, k, a) => {
  const p = [q[0] - o[0], q[1] - o[1], q[2] - o[2]], c = Math.cos(a), s = Math.sin(a), d = p[0] * k[0] + p[1] * k[1] + p[2] * k[2], x = X3(k, p);
  return [0, 1, 2].map((i) => o[i] + p[i] * c + x[i] * s + k[i] * d * (1 - c));
};
const Z = [0, 0, 1], X = [1, 0, 0], Y = [0, 1, 0], E = N3([1, -1, 0]), D = N3([1, 1, 0]);
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const RIM = 62, LIFT = 30;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-24, -24, 0], [24, 24, 0], A([0, 0, 40], E, 40), A([0, 0, 40], E, -40), [0, 0, RIM + LIFT + 26]], 200, 168);
  const P = proj(C);
  const sh = (pts) => poly(hull(pts.map((q) => P(q[0], q[1], q[2]))));
  const ln = (pts, cl = false) => (cl ? poly : (p) => "M" + p.map((q) => q.join(",")).join("L"))(pts.map((q) => P(q[0], q[1], q[2])));
  const g = mk("g", {}, svg);
  const sq = (h, z) => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]];
  const blk = (h, z0, z1) => { mk("path", { class: "sil", d: sh(sq(h, z0).concat(sq(h, z1))) }, g); mk("path", { class: "nf lo", d: ln(sq(h - 1.6, z1), true) }, g); };
  blk(22, 0, 12); blk(15, 12, 18);
  mk("path", { class: "sil", d: sh(ring3([0, 0, 18], X, Y, 9).concat(ring3([0, 0, 24], X, Y, 3.5), ring3([0, 0, 34], X, Y, 3))) }, g);
  // handles: loops out to either side, behind the bowl's edge
  for (const s of [1, -1]) {
    const arc = [];
    for (let i = 0; i <= 12; i++) { const t = -Math.PI / 2 + (i / 12) * Math.PI; arc.push(A([0, 0, 50 + 8 * Math.sin(t)], E, s * (19 + 13 * Math.cos(t)))); }
    mk("path", { class: "nf sil", d: ln(arc) }, g);
    mk("path", { class: "nf lo", d: ln(arc.map((q) => A(q, E, -s * 3.2))) }, g);
  }
  const bowl = [[36, 5], [42, 14], [50, 19], [RIM, 22]].flatMap(([z, r]) => ring3([0, 0, z], X, Y, r, 36));
  mk("path", { class: "sil", d: sh(bowl) }, g);
  mk("path", { class: "nf lo", d: ln(ring3([0, 0, RIM], X, Y, 20.4, 36), true) }, g);
  mk("path", { class: "nf lo", d: ln(ring3([0, 0, 47], X, Y, 17.6, 36).filter((q) => q[0] + q[1] > -2)) }, g);
  const lid = mk("path", { class: "sil hi" }, g), lidLo = mk("path", { class: "nf lo" }, g), fin = mk("path", { class: "sil" }, g);
  const LID = [[0, 23], [3, 22], [8, 18], [13, 11], [15, 5]];
  const tw = tween(0.12);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const o = [0, 0, RIM + LIFT * t], piv = A(o, D, -22), a = -0.75 * t;
    const R = (q) => rot(A(q, [0, 0, LIFT * t]), A(piv, [0, 0, 0]), E, a);
    lid.setAttribute("d", sh(LID.flatMap(([z, r]) => ring3([0, 0, RIM + z], X, Y, r, 36)).map(R)));
    lidLo.setAttribute("d", ln(ring3([0, 0, RIM + 3], X, Y, 20, 36).map(R), true));
    fin.setAttribute("d", sh([15, 17, 19, 21].flatMap((z, i) => ring3([0, 0, RIM + z], X, Y, [2, 3.6, 3.6, 2][i], 16)).map(R)));
  }
  draw(0.12);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const tl = P(-24, 24, RIM + 26), br = P(24, -24, 0), lt = P(...A([0, 0, 40], E, -36)), rt = P(...A([0, 0, 40], E, 36));
  const inside = ([x, y]) => x > lt[0] && x < rt[0] && y > tl[1] - 10 && y < Math.max(br[1], P(24, 24, 0)[1]);
  let act = null;
  function setA(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? 0.35 + 0.65 * amt : 0.12, performance.now(), 0);
    read.textContent = on ? "lid" : "rest";
    B.wake();
  }
  setA(false);
  bag.add(pointer(stage, { move: (p) => setA(inside(p)), leave: () => setA(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (act) { act = null; setA(true); } }, destroy: bag.dispose };
}

hairline({
  name: "trophy",
  means: "A two-handled trophy cup on a plinth: the pointer lifts its domed lid off the rim and tips it back.",
  rules: [1, 4, 5, 8],
  range: [0, 100, 100],
  tour: [[200, 121], [200, 180], [176, 140], null],
  mount,
});
