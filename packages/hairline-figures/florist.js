/**
 * Flower bucket: a florist's tapered zinc bucket of stems, standing in a
 * tilting display stand. The pointer over it tips the bucket back on the
 * stand's front pivot to show the blooms. At rest the bucket stands nearly
 * upright, one bloom bright. The slider is the tilt.
 *
 * The pattern: one part following the pointer (swing).
 */
const { Cam, circ, rrect, fit, hull, poly, open, proj, clamp, spring, stepS, mk, pointer, register, disposer } = HL;

const PIV = [18, 0, 12], REST = -0.08, TILT = 0.55;
const rot = (p, o, a) => { const x = p[0] - o[0], z = p[2] - o[2], c = Math.cos(a), s = Math.sin(a); return [o[0] + x * c - z * s, p[1], o[2] + x * s + z * c]; };
const box = (x0, y0, x1, y1, z0, z1, r = 3) => { const g = rrect(x0, y0, x1, y1, r, 5); return g.map((q) => [q.u, q.v, z0]).concat(g.map((q) => [q.u, q.v, z1])); };
const ring = (r, x, y, z, n = 28) => circ(r, n).map((q) => [x + q.u, y + q.v, z]);
const BLOOMS = [[-8, -8, 78, 6], [6, -10, 84, 5.5], [-12, 6, 72, 5], [4, 6, 90, 6.5], [12, -2, 74, 5], [-2, 0, 96, 5.5]];
const FAV = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let sw = value;
  const C = Cam(45, 0.5, 2.35);
  const bucket = ring(15, 0, 0, 12, 36).concat(ring(19, 0, 0, 50, 36));
  const tops = BLOOMS.flatMap(([x, y, z, r]) => ring(r, x, y, z + 3, 8));
  fit(C, box(-26, -26, 26, 26, 0, 12).concat(bucket.map((p) => rot(p, PIV, TILT)), tops.map((p) => rot(p, PIV, TILT)), tops.map((p) => rot(p, PIV, REST))), 200, 166);
  const P = proj(C), T = (p) => P(...p);
  const g = mk("g", {}, svg);
  const path = (pts, cls) => mk("path", { class: cls, d: poly(hull(pts.map(T))) }, g);
  path(box(-26, -26, 26, 26, 0, 4, 6), "sil");
  path(box(-20, -24, -14, -18, 4, 12, 2).concat(box(-20, 18, -14, 24, 4, 12, 2)), "nf lo");
  path(box(-24, -24, 24, 24, 9, 12, 8), "sil");
  mk("path", { class: "nf lo", d: poly(rrect(-20, -20, 20, 20, 6, 5).map((q) => T([q.u, q.v, 12]))) }, g);
  const body = mk("path", { class: "sil" }, g), mouth = mk("path", { class: "lo" }, g), band = mk("path", { class: "nf lo" }, g);
  const stems = mk("path", { class: "nf" }, g);
  const heads = BLOOMS.map((_, i) => ({ s: mk("path", { class: i === FAV ? "sil hi" : "sil" }, g), c: mk("path", { class: "nf lo" }, g) }));
  const sp = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const R = (p) => T(rot(p, PIV, a));
    body.setAttribute("d", poly(hull(bucket.map(R))));
    mouth.setAttribute("d", poly(ring(18.2, 0, 0, 50, 36).map(R)));
    band.setAttribute("d", open(ring(17, 0, 0, 30, 36).filter((p) => p[0] + p[1] > -4).sort((p, q) => Math.atan2(p[1], p[0]) - Math.atan2(q[1], q[0])).map(R)));
    stems.setAttribute("d", BLOOMS.map(([x, y, z]) => "M" + R([x * 0.4, y * 0.4, 50]).join(",") + "L" + R([x, y, z]).join(",")).join(""));
    BLOOMS.forEach(([x, y, z, r], i) => {
      heads[i].s.setAttribute("d", poly(hull(ring(r * 0.5, x, y, z, 12).concat(ring(r, x, y, z + 3, 16), ring(r * 0.7, x, y, z + 5, 12)).map(R))));
      heads[i].c.setAttribute("d", poly(ring(r * 0.35, x, y, z + 5, 10).map(R)));
    });
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const bx = hull(box(-26, -26, 26, 26, 0, 100).map(T)), xs = bx.map((p) => p[0]), ys = bx.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  function aim(p) {
    const inside = p && p[0] > x0 && p[0] < x1 && p[1] > y0 && p[1] < y1;
    const t = inside ? clamp(1.2 - (p[1] - y0) / (y1 - y0), 0.3, 1) : null;
    sp.t = t === null ? REST : REST + t * (TILT - REST) * (sw / 100);
    read.textContent = t === null ? "rest" : "tip " + Math.round(t * 100) + "%";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sw = v; }, destroy: bag.dispose };
}

hairline({
  name: "florist",
  means: "A florist's bucket of blooms in a tilting stand: the bucket tips back on its pivot as the pointer comes over.",
  rules: [1, 3, 4, 5],
  range: [40, 100, 100],
  tour: [[202, 147], [199, 70], [202, 260], null],
  mount,
});
