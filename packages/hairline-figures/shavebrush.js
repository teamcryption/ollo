/**
 * Shaving set: a round stand with a post and a forked arm, a shaving brush
 * hanging knot-down in the fork, the brush bright at rest. Over the stand the
 * brush lifts out of the fork and tips toward the hand. The slider is how far
 * it lifts.
 *
 * The pattern: one object, one part that lifts and tilts.
 */
const { Cam, circ, fit, hull, poly, proj, rad, rings, prism, facing, put, solid, tset, tval, tdone, tween, disposer, mk, pointer, register } = HL;

const FZ = 62, BX = 14, BY = 14;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-30, -30, 0], [32, 32, 0], [-30, 32, 0], [32, -30, 0], [-12, -12, FZ + 8], [BX, BY, FZ + 40]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 30, 48), disc(0, 0, 27, 48), 0, 5));
  put(solid(g), prism(P, front, disc(-12, -12, 3), disc(-12, -12, 2), 5, FZ + 4));
  const [ar, ai] = rings(-15, -15, BX + 11, BY + 11, 8, 1.4);
  put(solid(g), prism(P, front, ar, ai, FZ, FZ + 3));
  mk("path", { d: poly(disc(BX, BY, 6).map((q) => P(q.u, q.v, FZ + 3))), class: "nf lo" }, g);
  const parts = [mk("path", { class: "sil hi" }, g), mk("path", { class: "sil hi" }, g), mk("path", { class: "sil hi" }, g)];
  const band = mk("path", { class: "nf lo" }, g);

  const t = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const a = rad(5 + v * 30), lift = 4 + v * amt;
    const X = (x, y, z) => { const dx = x - BX, dz = z - FZ; return P(BX + dx * Math.cos(a) + dz * Math.sin(a), y, FZ + lift - dx * Math.sin(a) + dz * Math.cos(a)); };
    const cyl = (pr, z0, z1) => poly(hull(pr.flatMap(([r, z]) => disc(BX, BY, r, 36).map((q) => X(q.u, q.v, z)))));
    parts[0].setAttribute("d", cyl([[11, FZ - 30], [8, FZ - 40], [3, FZ - 44], [13, FZ - 22], [9, FZ - 12]]));
    parts[1].setAttribute("d", cyl([[9, FZ - 13], [9, FZ - 10], [6, FZ - 6], [6, FZ + 2]]));
    parts[2].setAttribute("d", cyl([[7, FZ + 2], [9, FZ + 12], [9, FZ + 20], [7, FZ + 22]]));
    band.setAttribute("d", poly(disc(BX, BY, 9).map((q) => X(q.u, q.v, FZ + 14))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  const mid = P(0, 0, FZ / 2);
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(t, o ? 1 : 0, performance.now(), 0);
    read.textContent = o ? "lifted" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(Math.abs(sx - mid[0]) < 90 && Math.abs(sy - mid[1]) < 110), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "shavebrush",
  means: "A shaving brush hung knot-down in a stand's fork: over the stand it lifts out of the fork and tips toward the hand.",
  rules: [1, 4, 5, 8],
  range: [6, 14, 22],
  tour: [[200, 147], [200, 60], [200, 147], null],
  mount,
});
