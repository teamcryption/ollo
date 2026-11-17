/**
 * Lens meter: an optician's lensometer, a base and column carrying a head
 * with an eyepiece on top and a lens stage at its nose. The pointer over the
 * instrument tilts the whole head forward on its pivot, as for reading a lens
 * held flat. At rest the head leans back a little, its eyepiece bright. The
 * slider is the tilt.
 *
 * The pattern: one part following the pointer (swing).
 */
const { Cam, circ, rrect, fit, hull, poly, proj, clamp, spring, stepS, mk, pointer, register, disposer } = HL;

const PIV = [-14, 0, 42], REST = 0.18, TILT = -0.62;
const rot = (p, o, a) => { const x = p[0] - o[0], z = p[2] - o[2], c = Math.cos(a), s = Math.sin(a); return [o[0] + x * c - z * s, p[1], o[2] + x * s + z * c]; };
const box = (x0, y0, x1, y1, z0, z1, r = 3) => { const g = rrect(x0, y0, x1, y1, r, 5); return g.map((q) => [q.u, q.v, z0]).concat(g.map((q) => [q.u, q.v, z1])); };
const cyl = (r, x, y, z0, z1) => { const c = circ(r, 24); return c.map((q) => [x + q.u, y + q.v, z0]).concat(c.map((q) => [x + q.u, y + q.v, z1])); };
const HEAD = [box(-30, -13, 22, 13, 36, 62, 6), box(18, -9, 40, 9, 38, 48, 3), cyl(8, 34, 0, 48, 50), cyl(6, -20, 0, 60, 80), cyl(7.5, -20, 0, 80, 86)];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let sw = value;
  const C = Cam(45, 0.5, 2.35);
  const all = (a) => HEAD.flat().map((p) => rot(p, PIV, a));
  fit(C, box(-34, -26, 34, 26, 0, 8).concat(all(REST), all(TILT)), 200, 166);
  const P = proj(C), T = (p) => P(...p);
  const g = mk("g", {}, svg);
  const path = (pts, cls) => mk("path", { class: cls, d: poly(hull(pts.map(T))) }, g);
  path(box(-34, -26, 34, 26, 0, 8, 7), "sil");
  mk("path", { class: "nf lo", d: poly(rrect(-31, -23, 31, 23, 5, 5).map((q) => T([q.u, q.v, 8]))) }, g);
  path(box(-22, -8, -6, 8, 8, 44, 4), "sil");
  path(cyl(5, -14, 0, 38, 46), "sil");
  const parts = HEAD.map((_, i) => mk("path", { class: i >= 3 ? "sil hi" : "sil" }, g));
  const crease = mk("path", { class: "nf lo" }, g);
  g.insertBefore(crease, parts[1]);
  const sp = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    HEAD.forEach((pts, i) => parts[i].setAttribute("d", poly(hull(pts.map((p) => T(rot(p, PIV, a)))))));
    crease.setAttribute("d", poly(rrect(-27, -10, 19, 10, 4, 5).map((q) => T(rot([q.u, q.v, 62], PIV, a)))));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const bx = hull(box(-34, -26, 40, 26, 0, 86).map(T)), xs = bx.map((p) => p[0]), ys = bx.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  function aim(p) {
    const inside = p && p[0] > x0 && p[0] < x1 && p[1] > y0 && p[1] < y1;
    const t = inside ? clamp(1.2 - (p[1] - y0) / (y1 - y0), 0.3, 1) : null;
    sp.t = t === null ? REST : REST + t * (TILT - REST) * (sw / 100);
    read.textContent = t === null ? "rest" : "tilt " + Math.round(t * 100) + "%";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sw = v; }, destroy: bag.dispose };
}

hairline({
  name: "lensmeter",
  means: "An optician's lens meter: the head with its eyepiece and lens stage tilts forward on its pivot as the pointer comes over.",
  rules: [1, 3, 4, 5],
  range: [40, 100, 100],
  tour: [[200, 116], [210, 200], [167, 60], null],
  mount,
});
