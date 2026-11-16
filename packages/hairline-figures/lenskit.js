/** lenskit, built by b98g3. */
const { Cam, fit, proj, hull, poly, mk, pointer, register, solid, disposer, spring, stepS } = HL;
const rr = (x0, y0, x1, y1, r, n = 3) => { const o = []; for (const [cx, cy, q] of [[x1 - r, y1 - r, 0], [x0 + r, y1 - r, 1], [x0 + r, y0 + r, 2], [x1 - r, y0 + r, 3]]) for (let i = 0; i <= n; i++) { const a = (q + i / n) * Math.PI / 2; o.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return o; };
const ci = (cx, cy, r, n = 24) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * 2 * Math.PI), cy + r * Math.sin((i / n) * 2 * Math.PI)]);
const ID = (p) => p, cl = (v, a, b) => Math.max(a, Math.min(b, v));
function shape(P, base, inner, z0, z1, xf = ID) {
  const pr = (r, z) => r.map(([u, v]) => { const q = xf([u, v, z]); return P(q[0], q[1], q[2]); });
  return { sil: poly(hull(pr(base, z0).concat(pr(base, z1)))), cr: poly(pr(inner, z1)) };
}
const box = (P, x0, y0, x1, y1, z0, z1, r, xf) => shape(P, rr(x0, y0, x1, y1, r), rr(x0 + 1.5, y0 + 1.5, x1 - 1.5, y1 - 1.5, Math.max(r - 1.5, 0.5)), z0, z1, xf);
const cyl = (P, cx, cy, r, z0, z1, xf) => shape(P, ci(cx, cy, r), ci(cx, cy, Math.max(r - 1.5, r * 0.6)), z0, z1, xf);
const paint = (s, d) => { s.sil.setAttribute("d", d.sil); s.cr.setAttribute("d", d.cr); };
const fixed = (g, d) => { const s = solid(g); paint(s, d); return s; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-2, -14, 0], [162, 14, 0], [30, -18, 56], [120, 18, 56], [150, -16, 46], [2, -10, 30]], 200, 168);
  const P = proj(C), g = mk("g", {}, svg);
  fixed(g, box(P, -2, -6, 162, 6, 0, 5, 3));
  fixed(g, box(P, 0, -11, 22, 11, 5, 30, 4));
  fixed(g, cyl(P, 0, 0, 7, 22, 24, ([u, v, w]) => [w, u, 18 + v]));
  const mv = mk("g", {}, g), car = solid(mv), post = solid(mv), lens = solid(mv);
  lens.sil.classList.add("hi");
  fixed(g, box(P, 148, -18, 152, 18, 5, 46, 2));
  const sp = spring(70, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = NaN;
  function draw(L) {
    if (L === last) return; last = L;
    paint(car, box(P, L - 8, -8, L + 8, 8, 5, 10, 3));
    paint(post, cyl(P, L, 0, 2.2, 10, 22));
    paint(lens, cyl(P, 0, 0, 17, -2.5, 2.5, ([u, v, w]) => [L + w, u, 38 + v]));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const A = P(30, 0, 0), Z = P(120, 0, 0), dx = Z[0] - A[0], dy = Z[1] - A[1];
  function move([sx, sy]) {
    const t = cl(((sx - A[0]) * dx + (sy - A[1]) * dy) / (dx * dx + dy * dy), 0, 1);
    sp.t = 30 + t * 90; read.textContent = "f " + Math.round(sp.t); B.wake();
  }
  read.textContent = "rest";
  draw(70);
  bag.add(pointer(stage, { move, leave: () => { sp.t = 70; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "lenskit",
  means: "An optical bench: a lamp, a screen and a round lens on a carriage that slides along the rail to follow the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 2],
  tour: [[121, 138], [190, 172], [239, 197], null],
  mount,
});
