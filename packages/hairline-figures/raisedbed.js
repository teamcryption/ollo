/**
 * Raised bed: a plank bed with three sprouts under a hinged cold-frame cover. The pointer over the bed swings the cover open on its back hinge.
 */
const { Cam, fit, proj, poly, clamp, lerp, rad, spring, stepS, mk, pointer, register, disposer } = HL;

function solidOf(pts, axis, a0, a1, at) {
  const map = (p, w) => (axis === "z" ? [p[0], p[1], w] : axis === "y" ? [p[0], w, p[1]] : [w, p[0], p[1]]);
  const n = pts.length, V = [];
  for (const w of [a0, a1]) for (const p of pts) { const q = map(p, w); V.push([q[0] + at[0], q[1] + at[1], q[2] + at[2]]); }
  const idx = [...Array(n).keys()], F = [idx, idx.map((i) => i + n)];
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; F.push([i, j, j + n, i + n]); }
  const c = V.reduce((s, v) => s.map((x, k) => x + v[k] / V.length), [0, 0, 0]);
  F.forEach((f, k) => {
    let nx = 0, ny = 0, nz = 0;
    f.forEach((ia, i) => { const a = V[ia], b = V[f[(i + 1) % f.length]]; nx += (a[1] - b[1]) * (a[2] + b[2]); ny += (a[2] - b[2]) * (a[0] + b[0]); nz += (a[0] - b[0]) * (a[1] + b[1]); });
    const fc = f.reduce((s, i) => s.map((x, q) => x + V[i][q] / f.length), [0, 0, 0]);
    if (nx * (fc[0] - c[0]) + ny * (fc[1] - c[1]) + nz * (fc[2] - c[2]) < 0) F[k] = f.slice().reverse();
  });
  return { V, F };
}
const box = (x0, y0, z0, x1, y1, z1) => solidOf([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], "z", z0, z1, [0, 0, 0]);
const ngon = (r, n, ph = 0) => Array.from({ length: n }, (_, i) => [r * Math.cos(ph + (2 * Math.PI * i) / n), r * Math.sin(ph + (2 * Math.PI * i) / n)]);
function rot(v, p, ax, deg) {
  const a = rad(deg), c = Math.cos(a), s = Math.sin(a), d = [v[0] - p[0], v[1] - p[1], v[2] - p[2]];
  const i = ax === "x" ? [1, 2] : ax === "y" ? [2, 0] : [0, 1], o = d.slice();
  o[i[0]] = d[i[0]] * c - d[i[1]] * s; o[i[1]] = d[i[0]] * s + d[i[1]] * c;
  return [o[0] + p[0], o[1] + p[1], o[2] + p[2]];
}
const PARTS = () => {
  const lid = (v, t) => rot(v, [0, 0, 20], "x", 6 + t * 74);
  return [
    { s: box(0, 0, 0, 110, 50, 20) },
    { s: box(0, 0, 0, 4, 50, 22) }, { s: box(106, 0, 0, 110, 50, 22) },
    ...[[22, 22], [55, 30], [86, 20]].map(([x, y]) => ({ s: solidOf(ngon(3.5, 6), "z", 20, 31, [x, y, 0]) })),
    { s: solidOf([[0, 0], [50, 0], [50, 5], [0, 17]], "x", 0, 110, [0, 0, 20]), m: lid, hi: 1, bias: 6 },
  ];
};
const LABEL = t => Math.round(6 + t * 74) + "°", SPIN = false, FW = 300, FH = 235;
const area = (q) => q.reduce((s, a, i) => { const b = q[(i + 1) % q.length]; return s + a[0] * b[1] - b[0] * a[1]; }, 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const parts = PARTS();
  const all = (t) => parts.flatMap((p) => p.s.V.map((v) => (p.m ? p.m(v, t) : v)));
  const ext = all(0).concat(all(1));
  let C = Cam(45, 0.5, 1);
  fit(C, ext, 200, 160);
  let Q = ext.map((v) => proj(C)(...v)), xs = Q.map((q) => q[0]), ys = Q.map((q) => q[1]);
  const S = Math.min(FW / (Math.max(...xs) - Math.min(...xs)), FH / (Math.max(...ys) - Math.min(...ys)));
  C = Cam(45, 0.5, S);
  fit(C, ext, 200, 160);
  const P = proj(C);
  const FS = Math.sign(area([[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]].map((v) => P(...v))));
  const g = mk("g", {}, svg);
  parts.forEach((p) => { p.el = mk("path", { class: p.hi ? "sil hi" : "sil" }, g); });
  const R = all(0).map((v) => P(...v)), bx = [Math.min(...R.map((q) => q[0])) - 12, Math.max(...R.map((q) => q[0])) + 12];
  const by = [Math.min(...R.map((q) => q[1])) - 12, Math.max(...R.map((q) => q[1])) + 12];
  const sp = spring(0, { k: 90, c: 16 });
  let last = NaN, order = "";
  function draw(t) {
    if (t === last) return;
    last = t;
    const depth = [];
    parts.forEach((p, k) => {
      const W = p.s.V.map((v) => (p.m ? p.m(v, t) : v)), S2 = W.map((v) => P(...v));
      let d = "";
      for (const f of p.s.F) { const q = f.map((i) => S2[i]); if (Math.sign(area(q)) === FS) d += poly(q); }
      p.el.setAttribute("d", d);
      const c = W.reduce((s, v) => s.map((x, q) => x + v[q] / W.length), [0, 0, 0]);
      depth.push([c[0] + c[1] + 0.8 * c[2] + (p.bias || 0), k]);
    });
    depth.sort((a, b) => a[0] - b[0]);
    const o = depth.map((d) => d[1]).join();
    if (o !== order) { order = o; depth.forEach(([, k]) => g.appendChild(parts[k].el)); }
    read.textContent = t < 0.01 ? "rest" : LABEL(t);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(clamp(sp.x, 0, 1) * amt); return m; });
  bag.add(B.unregister);
  draw(0);
  function move([sx, sy]) {
    const inside = sx > bx[0] && sx < bx[1] && sy > by[0] && sy < by[1];
    sp.t = !inside ? 0 : SPIN ? clamp((sx - bx[0]) / (bx[1] - bx[0]) * 1.4 - 0.1, 0, 1) : 1;
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => { sp.t = 0; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; last = NaN; B.wake(); draw(clamp(sp.x, 0, 1) * amt); }, destroy: bag.dispose };
}

hairline({
  name: "raisedbed",
  means: "A raised garden bed under a cold-frame cover: the pointer swings the cover open on its back hinge to show the sprouts.",
  rules: [1, 3, 4, 5, 6, 7],
  range: [40,80,100],
  tour: [[167, 175], [145, 124], [231, 278], null],
  mount,
});
