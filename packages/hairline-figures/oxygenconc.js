/**
 * Oxygen concentrator: a tall unit on a wheeled cart with a pull handle and a flow dial
 * on its face. At rest it stands parked, the dial bright. The pointer over it tilts the
 * cart back onto its wheels, ready to pull. The slider is how far it tilts.
 *
 * The pattern: one hinged part answering the pointer; the hit is a fixed plane, never the moving part.
 */

const { Cam, fit, hull, poly, proj, unproj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;
const R = Math.PI / 180;
const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
// a bar between two points, square in y and z
const bar = (a, b, r) => [[a[0], a[1] - r, a[2] - r], [b[0], b[1] - r, b[2] - r], [b[0], b[1] + r, b[2] - r], [a[0], a[1] + r, a[2] - r],
  [a[0], a[1] - r, a[2] + r], [b[0], b[1] - r, b[2] + r], [b[0], b[1] + r, b[2] + r], [a[0], a[1] + r, a[2] + r]];
function rot(pts, ax, o, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return pts.map(([x, y, z]) => {
    x -= o[0]; y -= o[1]; z -= o[2];
    if (ax === "z") [x, y] = [x * c - y * s, x * s + y * c];
    else if (ax === "y") [x, z] = [x * c - z * s, x * s + z * c];
    else [y, z] = [y * c - z * s, y * s + z * c];
    return [x + o[0], y + o[1], z + o[2]];
  });
}
const FACES = [[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
const area = (q) => q.reduce((a, u, i) => { const v = q[(i + 1) % q.length]; return a + u[0] * v[1] - v[0] * u[1]; }, 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const C = Cam(45, 0.5, 1), ext = parts(0).concat(parts(1)).flatMap((b) => b.c);
  fit(C, ext, 0, 0);
  let P = proj(C);
  const xs = ext.map((p) => P(...p));
  const w = Math.max(...xs.map((q) => q[0])) - Math.min(...xs.map((q) => q[0])), h = Math.max(...xs.map((q) => q[1])) - Math.min(...xs.map((q) => q[1]));
  C.S = Math.min(340 / w, 270 / h);
  fit(C, ext, 200, 160);
  P = proj(C);
  const s = Math.sin(C.az), c = Math.cos(C.az), zf = Math.sqrt(1 - C.k * C.k);
  const depth = (b) => b.c.reduce((d, p) => d + (p[0] * s + p[1] * c) * zf + p[2] * C.k, 0);
  const SG = Math.sign(area(FACES[1].map((i) => P(...box(0, 0, 0, 1, 1, 1)[i]))));
  const g = mk("g", {}, svg);
  const els = parts(0).map(() => { const grp = mk("g", {}, g); return { grp, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp) }; });
  const o = tween(0);
  let last = NaN, act = -2;
  function draw(t) {
    if (t === last) return;
    last = t;
    const bs = parts(t);
    bs.map((b, i) => [i, depth(b)]).sort((a, b) => a[1] - b[1]).forEach(([i]) => {
      const b = bs[i], e = els[i], q = b.c.map((p) => P(...p));
      e.sil.setAttribute("d", poly(hull(q)));
      e.cr.setAttribute("d", FACES.map((f) => f.map((k) => q[k])).filter((f) => Math.sign(area(f)) === SG).map(poly).join(""));
      e.sil.classList.toggle("hi", !!b.hi);
      g.appendChild(e.grp);
    });
  }
  const B = register(stage, (_dt, now) => { draw(tval(o, now)); return !tdone(o, now); });
  bag.add(B.unregister);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, HIT[0]);
    return x > HIT[1] && x < HIT[3] && y > HIT[2] && y < HIT[4] ? 1 : -1;
  }
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(o, a < 0 ? 0 : amt, performance.now(), 0);
    read.textContent = READ[a < 0 ? 0 : 1];
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (act > 0) { tset(o, amt, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

const HIT = [30,-70,-50,40,50], READ = ["rest","tilt"];
function parts(t) {
  const a = (2 + 26 * t) * R, H = [-2, 0, 0];
  const r = (bx) => rot(bx, "y", H, a);
  return [
    { c: box(-5, -4, 0, 1, -1, 6) },
    { c: r(box(-4, 2, 6, -1, 5, 64)) },
    { c: r(box(-4, 13, 6, -1, 16, 64)) },
    { c: r(box(-4, 2, 64, -1, 16, 67)) },
    { c: r(box(-2, -2, 2, 26, 20, 7)) },
    { c: r(box(0, 0, 7, 24, 18, 52)) },
    { c: r(box(4, 4, 52, 20, 14, 55)) },
    { c: r(box(24, 6, 36, 26, 12, 42)), hi: 1 },
    { c: r(box(24, 4, 14, 25, 14, 28)) },
    { c: box(-5, 19, 0, 1, 22, 6) },
  ];
}

hairline({
  name: "oxygenconc",
  means: "An oxygen concentrator on a cart: point at it and it tilts back onto its wheels to be pulled.",
  rules: [1, 3, 4, 5],
  range: [30, 85, 100],
  tour: [[269, 169], [250, 200], [230, 130], null],
  mount,
});
