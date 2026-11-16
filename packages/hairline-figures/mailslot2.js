/**
 * Letter sorter: a desk block with a row of slots, a letter standing in
 * each, and a letter opener in the last slot. The pointer picks a slot: the
 * letters from it forward tip toward the reader and the ones behind lean
 * back, opening a gap like a hand flicking through mail. At rest one gap is
 * open, its letter bright. The slider is the stagger.
 */
const { Cam, fit, proj, unproj, hull, poly, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;
const D = Math.PI / 180, cl = (v, a, b) => Math.max(a, Math.min(b, v));
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const ell = (cx, cy, rx, ry, n = 24) => Array.from({ length: n }, (_, i) => [cx + rx * Math.cos((i / n) * 2 * Math.PI), cy + ry * Math.sin((i / n) * 2 * Math.PI)]);
// a convex solid: two rings of the same count, bottom then top
const slab = (b, z0, z1, t = b) => b.map(([x, y]) => [x, y, z0]).concat(t.map(([x, y]) => [x, y, z1]));
function turn(pts, u, a, p) {
  const n = Math.hypot(...u), [ux, uy, uz] = u.map((v) => v / n), c = Math.cos(a), s = Math.sin(a);
  return pts.map(([x, y, z]) => {
    const vx = x - p[0], vy = y - p[1], vz = z - p[2], d = (ux * vx + uy * vy + uz * vz) * (1 - c);
    return [p[0] + vx * c + (uy * vz - uz * vy) * s + ux * d, p[1] + vy * c + (uz * vx - ux * vz) * s + uy * d, p[2] + vz * c + (ux * vy - uy * vx) * s + uz * d];
  });
}
const area = (q) => q.reduce((s, a, i) => { const b = q[(i + 1) % q.length]; return s + a[0] * b[1] - b[0] * a[1]; }, 0);
function part(parent, cls = "sil") {
  const g = mk("g", {}, parent);
  return { g, s: mk("path", { class: cls }, g), c: mk("path", { class: "nf" }, g) };
}
function paint(P, so, pts, ref) {
  const q = pts.map((p) => P(...p)), n = q.length / 2, f = [];
  f.push(q.slice(n), q.slice(0, n).reverse());
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; f.push([q[i], q[j], q[n + j], q[n + i]]); }
  so.s.setAttribute("d", poly(hull(q)));
  so.c.setAttribute("d", f.filter((x) => area(x) * ref > 1e-6).map(poly).join(""));
}
const refOf = (P) => Math.sign(area([[0, 0], [10, 0], [10, 10], [0, 10]].map(([x, y]) => P(x, y, 0))));

const N = 6, STEP = 15, BZ = 12, HT = [40, 33, 44, 36, 30, 58], FAV = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  const X1 = N * STEP + 6;
  fit(C, [[0, 0, 0], [X1, 50, 0], [X1, 0, 0], [0, 50, 0], [0, 25, BZ + 60], [X1 + 34, 25, BZ + 48]], 200, 160);
  const P = proj(C), ref = refOf(P);
  const g = mk("g", {}, svg);
  paint(P, part(g, ""), slab(rect(0, 0, X1, 50), 0, BZ), ref);
  const slots = mk("path", { class: "nf lo" }, g);
  slots.setAttribute("d", Array.from({ length: N }, (_, k) => poly([[8 + k * STEP, 4, BZ], [11 + k * STEP, 4, BZ], [11 + k * STEP, 46, BZ], [8 + k * STEP, 46, BZ]].map((p) => P(...p)))).join(""));
  const rest = (k) => (k < FAV ? -9 : k === FAV ? 20 : 18 + (k - FAV) * 3) * D;
  const items = HT.map((h, k) => {
    const x = 9.5 + k * STEP, opener = k === N - 1;
    const sh = opener
      ? [slab(rect(x - 0.6, 22, x + 0.6, 28), BZ, BZ + 34, rect(x - 0.4, 23, x + 0.4, 27)), slab(rect(x - 1.8, 20, x + 1.8, 30), BZ + 34, BZ + h)]
      : [slab(rect(x - 0.7, 6, x + 0.7, 44), BZ, BZ + h)];
    return { k, x, h, sh, parts: sh.map(() => part(g)), a: tween(rest(k)), last: NaN };
  });
  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    it.sh.forEach((s, i) => paint(P, it.parts[i], turn(s, [0, 1, 0], a, [it.x, 0, BZ]), ref));
  }
  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);
  const mids = items.map((it) => P(it.x, 25, BZ + it.h / 2));
  function hit([sx, sy]) {
    let b = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; b = k; } });
    return bd < 24 && Math.abs(mids[b][1] - sy) < 80 ? b : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const t = a < 0 ? rest(k) : (k < a ? -10 : k === a ? 30 : 28 + (k - a) * 2) * D;
      tset(it.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.parts.forEach((p) => p.s.classList.toggle("hi", k === (a < 0 ? FAV : a)));
    });
    read.textContent = a < 0 ? "rest" : a === N - 1 ? "opener" : "slot " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "mailslot2",
  means: "A desk letter sorter with an opener: letters from the slot under the pointer tip forward, the ones behind lean back.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[182, 135], [139, 117], [245, 135], null],
  mount,
});
