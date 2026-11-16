/**
 * Shoe buffer: a shoe on the bench and a buffing brush held over it, a
 * block with a band of bristles underneath. The brush slides along the shoe
 * to stand over the pointer and rocks as it goes. At rest it sits over the
 * toe, tilted, bright. The slider is how far it rocks.
 */
const { Cam, fit, proj, rrect, hull, poly, rad, clamp, fillet, unproj, spring, stepS, mk, register, pointer, disposer } = HL;

const OUT = fillet([[0, 10], [30, 4], [92, 2], [122, 14], [122, 32], [92, 44], [30, 42], [0, 36]], [8, 10, 12, 14, 14, 12, 10, 8], 3);
const REST = 84, BZ = 44;
const ring = (x0, y0, x1, y1, r) => rrect(x0, y0, x1, y1, r).map((q) => [q.u, q.v]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let rock = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, 0, 0], [122, 46, 0], [122, 0, 0], [0, 46, 0], [10, 23, BZ + 26], [118, 23, BZ + 26]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const id = (p) => p;
  const slab = (r, z0, z1, T) => { const pts = []; for (const [u, v] of r) pts.push(P(...T([u, v, z0])), P(...T([u, v, z1]))); return poly(hull(pts)); };
  // the shoe: sole, then the upper as one rounded body with its collar
  mk("path", { class: "sil", d: slab(OUT, 0, 5, id) }, g);
  const up = [];
  for (const [u, v] of OUT) up.push(P(u * 0.94 + 4, v * 0.9 + 2.3, 5));
  for (const [u, v] of ring(4, 8, 74, 38, 14)) up.push(P(u, v, 26));
  for (const [u, v] of ring(70, 10, 112, 36, 12)) up.push(P(u, v, 16));
  mk("path", { class: "sil", d: poly(hull(up)) }, g);
  mk("path", { class: "nf lo", d: poly(ring(8, 12, 44, 34, 11).map(([u, v]) => P(u, v, 26))) }, g);
  const bristle = mk("path", {}, g), body = mk("path", { class: "sil hi" }, g), cr = mk("path", { class: "nf lo" }, g);
  const bx = spring(REST), tl = spring(14);
  let lx = NaN, lt = NaN;
  function draw(x, t) {
    if (x === lx && t === lt) return;
    lx = x; lt = t;
    const c = Math.cos(rad(t)), s = Math.sin(rad(t));
    const T = ([u, v, z]) => [x + u * c + z * s, v, BZ - u * s + z * c];
    bristle.setAttribute("d", slab(ring(-22, -9, 22, 9, 4), -7, 0, (p) => { const q = T(p); q[1] += 23; return q; }));
    body.setAttribute("d", slab(ring(-26, -12, 26, 12, 7), 0, 14, (p) => { const q = T(p); q[1] += 23; return q; }));
    cr.setAttribute("d", poly(ring(-24, -10, 24, 10, 5.5).map(([u, v]) => { const q = T([u, v, 14]); return P(q[0], q[1] + 23, q[2]); })));
  }
  const B = register(stage, (dt) => { const a = stepS(bx, dt), b = stepS(tl, dt); draw(bx.x, tl.x); return a || b; });
  bag.add(B.unregister);
  function aim(x, label) { bx.t = x; tl.t = x === REST && label === "rest" ? 14 : clamp((x - 61) / 40, -1, 1) * rock; read.textContent = label; B.wake(); }
  aim(REST, "rest");
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x] = unproj(C, sx, sy, 0); const t = clamp(x, 24, 100); aim(t, "x " + Math.round(t)); },
    leave: () => aim(REST, "rest"),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { rock = v; }, destroy: bag.dispose };
}

hairline({
  name: "shoepolisher",
  means: "A shoe buffer: the bristled brush slides along the shoe to stand over the pointer and rocks as it buffs.",
  rules: [1, 3, 5, 8],
  range: [6, 18, 30],
  tour: [[156, 187], [286, 252], [114, 166], null],
  mount,
});
