/**
 * Pencil case: a hard case with three pens laid in its tray and a lid hinged
 * along the back. At rest the lid stands a little open, bright; the pointer
 * over the case lifts it all the way to show the pens. The slider is how far
 * the lid opens.
 *
 * The pattern: one part on a hinge (lid).
 */
const {
  Cam, fit, hull, poly, prism, proj, rings, rrect, clamp, rad, tdone, tset, tval, tween, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const LEN = 120, D = 40, ZT = 12, T = 6, REST = 18;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[0, 0, 0], [LEN, 0, 0], [LEN, D, 0], [0, D, 0], [0, -10, ZT + D + 4], [LEN, -10, ZT + D + 4]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(0, 0, LEN, D, 10, 2);
  put(solid(g), prism(P, front, tr, ti, 0, ZT));
  mk("path", { d: poly(rrect(4, 4, LEN - 4, D - 4, 7, 4).map((q) => P(q.u, q.v, ZT))), class: "nf lo" }, g);
  for (const [x0, x1, y] of [[12, 96, 8], [18, 104, 17], [10, 88, 26]]) {
    const [a, i] = rings(x0, y, x1, y + 6, 3, 0.8);
    put(solid(g), prism(P, front, a, i, ZT, ZT + 4));
  }
  // the lid: a slab turning about the back edge of the tray
  const lid = solid(g);
  const outer = rrect(0, 0, LEN, D, 10, 4), inner = rrect(2, 2, LEN - 2, D - 2, 8, 4);
  const at = (ring, h, a) => ring.map((q) => P(q.u, q.v * Math.cos(rad(a)) - h * Math.sin(rad(a)), ZT + 0.5 + q.v * Math.sin(rad(a)) + h * Math.cos(rad(a))));
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    lid.sil.setAttribute("d", poly(hull(at(outer, 0, a).concat(at(outer, T, a)))));
    lid.cr.setAttribute("d", poly(at(inner, a < 39 ? T : 0, a)));
  }
  lid.cr.setAttribute("class", "nf lo");
  lid.sil.classList.add("hi");
  const ang = tween(REST);
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  // hit: the closed case's silhouette, which never moves
  const shape = hull([0, LEN].flatMap((x) => [0, D].flatMap((y) => [P(x, y, 0), P(x, y, ZT + T)])));
  const inside = ([sx, sy]) => [1, -1].some((s) => shape.every((a, i) => { const b = shape[(i + 1) % shape.length]; return s * ((b[0] - a[0]) * (sy - a[1]) - (b[1] - a[1]) * (sx - a[0])) >= 0; }));
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, v ? clamp(reach, 30, 100) : REST, performance.now(), 0);
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { tset(ang, clamp(v, 30, 100), performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "pencilcase",
  means: "A hard pencil case with pens in its tray: the pointer over it lifts the lid on its back hinge.",
  rules: [1, 4, 5, 6],
  range: [40, 75, 100],
  tour: [[194, 199], [130, 190], [265, 225], null],
  mount,
});
