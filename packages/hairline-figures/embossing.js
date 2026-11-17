/**
 * Heat tool: an embossing heat gun, a round barrel with a slim nozzle on a short
 * handle, standing on a round foot. The pointer tilts the gun up on its foot,
 * swinging the nozzle.
 *
 * The pattern: one part turning about a fixed axis, driven by a spring.
 */
const { Cam, fit, proj, unproj, hull, poly, clamp, r2, spring, stepS, mk, pointer, register, disposer } = HL;

const rz = (x0, y0, x1, y1, z) => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];
const box = (x0, y0, x1, y1, z0, z1) => [rz(x0, y0, x1, y1, z0), rz(x0, y0, x1, y1, z1)];
const alongX = (sec, x0, x1) => [x0, x1].map((x) => sec.map(([y, z]) => [x, y, z]));
const lathe = (cx, cy, prof, n = 20) => prof.map(([r, z]) => Array.from({ length: n }, (_, j) => { const t = (j / n) * 2 * Math.PI; return [cx + r * Math.cos(t), cy + r * Math.sin(t), z]; }));
const turnX = (yc, zc, a) => { const c = Math.cos(a), s = Math.sin(a); return ([x, y, z]) => [x, yc + (y - yc) * c - (z - zc) * s, zc + (y - yc) * s + (z - zc) * c]; };
const same = (p) => p;
const turnY = (xc, zc, a) => { const c = Math.cos(a), s = Math.sin(a); return ([x, y, z]) => [xc + (x - xc) * c - (z - zc) * s, y, zc + (x - xc) * s + (z - zc) * c]; };
const rodX = (x0, x1, yc, zc, r, n = 14) => alongX(Array.from({ length: n }, (_, j) => { const t = (j / n) * 2 * Math.PI; return [yc + r * Math.cos(t), zc + r * Math.sin(t)]; }), x0, x1);

function mesh(rings, smooth) {
  const pts = rings.flat(), n = rings[0].length, m = rings.length, faces = [];
  const id = (i, j) => i * n + ((j + n) % n);
  for (let i = 0; i < m - 1; i++) for (let j = 0; j < n; j++) faces.push([id(i, j), id(i, j + 1), id(i + 1, j + 1), id(i + 1, j)]);
  faces.push(rings[0].map((_, j) => id(0, j)), rings[m - 1].map((_, j) => id(m - 1, j)));
  const avg = (q) => [0, 1, 2].map((k) => q.reduce((s, p) => s + p[k], 0) / q.length), c = avg(pts);
  for (const f of faces) {
    const q = f.map((i) => pts[i]), fc = avg(q);
    let nx = 0, ny = 0, nz = 0;
    q.forEach((a, k) => { const b = q[(k + 1) % q.length]; nx += (a[1] - b[1]) * (a[2] + b[2]); ny += (a[2] - b[2]) * (a[0] + b[0]); nz += (a[0] - b[0]) * (a[1] + b[1]); });
    if (nx * (fc[0] - c[0]) + ny * (fc[1] - c[1]) + nz * (fc[2] - c[2]) < 0) f.reverse();
  }
  return { pts, faces, smooth, n };
}

function drawMesh(P, s0, M, xf, el) {
  const sp = M.pts.map((p) => P(...xf(p)));
  let d = "";
  for (const f of M.faces) {
    let A = 0;
    f.forEach((i, k) => { const a = sp[i], b = sp[f[(k + 1) % f.length]]; A += a[0] * b[1] - b[0] * a[1]; });
    if (A * s0 <= 0) continue;
    f.forEach((i, k) => {
      const j = f[(k + 1) % f.length];
      if (M.smooth && Math.floor(i / M.n) !== Math.floor(j / M.n)) return;
      d += "M" + r2(sp[i][0]) + " " + r2(sp[i][1]) + "L" + r2(sp[j][0]) + " " + r2(sp[j][1]);
    });
  }
  el.sil.setAttribute("d", poly(hull(sp)));
  el.ed.setAttribute("d", d);
  if (el.in) el.in.setAttribute("d", M.inner.map((L) => poly(L.map((p) => P(...xf(p))))).join(""));
}

const rr = (x0, y0, x1, y1, r, z, n = 4) => { const o = []; [[x1 - r, y1 - r, 0], [x0 + r, y1 - r, 1], [x0 + r, y0 + r, 2], [x1 - r, y0 + r, 3]].forEach(([cx, cy, q]) => { for (let i = 0; i <= n; i++) { const t = (q + i / n) * Math.PI / 2; o.push([cx + r * Math.cos(t), cy + r * Math.sin(t), z]); } }); return o; };
const turnZ = (xc, yc, a) => { const c = Math.cos(a), s = Math.sin(a); return ([x, y, z]) => [xc + (x - xc) * c - (y - yc) * s, yc + (x - xc) * s + (y - yc) * c, z]; };
const latheX = (yc, zc, prof, n = 18) => prof.map(([r, x]) => Array.from({ length: n }, (_, j) => { const t = (j / n) * 2 * Math.PI; return [x, yc + r * Math.cos(t), zc + r * Math.sin(t)]; }));

const D = Math.PI / 180;
const XF = (a) => turnY(2, 3, a);
const PARTS = [
  [lathe(2, 0, [[15, 0], [15, 3]], 24), true, false, lathe(2, 0, [[8, 3]], 16)],
  [[rr(-4, -5, 8, 5, 4, 3), rr(-4, -5, 8, 5, 4, 26)], true, true, undefined, false],
  [latheX(0, 32, [[7, -16], [9, -12], [9, 30], [6, 40], [6, 50]], 18), true, true, latheX(0, 32, [[4.5, -16]], 14), false],
  [latheX(0, 32, [[6.6, 50], [6.6, 62]], 18), true, true, latheX(0, 32, [[4, 62]], 14), true],
];
const REST = 0.08, HC = [40, 0, 32], RR = 80;
const ORDER = () => [0, 1, 2, 3];
const FITA = [0.08, 0.45, 0.75];
const READ = (a) => Math.round(a / D) + "°";

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let MAX = value;
  const parts = PARTS.map(([rings, smooth, mov, inner, hi]) => { const M = mesh(rings, smooth); M.mov = mov; M.inner = inner; M.hi = hi === undefined ? mov : hi; return M; });
  const all = [];
  for (const M of parts) for (const a of FITA) for (const p of M.pts) all.push(M.mov ? XF(a)(p) : p);
  const C1 = Cam(45, 0.5, 1), P1 = proj(C1), s1 = all.map((p) => P1(...p));
  const w = Math.max(...s1.map((q) => q[0])) - Math.min(...s1.map((q) => q[0])), h = Math.max(...s1.map((q) => q[1])) - Math.min(...s1.map((q) => q[1]));
  const C = Cam(45, 0.5, Math.min(372 / w, 296 / h));
  fit(C, all, 200, 162);
  const P = proj(C), o = P(0, 0, 0), a1 = P(1, 0, 0), b1 = P(1, 1, 0);
  const s0 = (a1[0] - o[0]) * (b1[1] - o[1]) - (a1[1] - o[1]) * (b1[0] - o[0]);
  const g = mk("g", {}, svg);
  const els = parts.map((M) => {
    const grp = mk("g", {}, g);
    const el = { grp, sil: mk("path", { class: "sil" }, grp), ed: mk("path", { class: "nf" }, grp) };
    if (M.inner) el.in = mk("path", { class: "nf lo" }, grp);
    if (M.hi) el.sil.classList.add("hi");
    return el;
  });
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const xf = XF(a);
    parts.forEach((M, i) => drawMesh(P, s0, M, M.mov ? xf : same, els[i]));
    ORDER(a).forEach((i) => g.appendChild(els[i].grp));
  }
  const sp = spring(REST);
  const B = register(stage, (dt) => { const mv = stepS(sp, dt); draw(sp.x); return mv; });
  bag.add(B.unregister);
  draw(REST);
  function aim(p) {
    let t = 0;
    if (p) { const [wx, wy] = unproj(C, p[0], p[1], HC[2]); t = clamp((RR - Math.hypot(wx - HC[0], wy - HC[1])) / (RR * 0.55), 0, 1); }
    sp.t = REST + t * (MAX - REST);
    read.textContent = t > 0 ? READ(sp.t) : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { MAX = v; }, destroy: bag.dispose };
}

hairline({
  name: "embossing",
  means: "An embossing heat tool on its round foot: the pointer tilts the barrel up on the stand, swinging the slim nozzle.",
  rules: [1, 3, 5, 6],
  range: [0.45, 0.6, 0.75],
  tour: [[107, 113], [291, 205], [359, 239], null],
  mount,
});
