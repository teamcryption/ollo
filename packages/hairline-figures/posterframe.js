/**
 * Snap frame: a poster held in a mitred clip frame on a low foot. The frame tilts back on its hinge as the pointer moves across. At rest it leans a little, bright. The slider is how far it tilts.
 */
const { Cam, fit, proj, unproj, circ, hull, poly, open, clamp, rad, spring, stepS, disposer, mk, pointer, register, solid } = HL;
const V = [0.612, 0.612, 0.5];
const box = (x0, y0, z0, x1, y1, z1, o = {}) => ({ k: "b", p: [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], ...o });
const cyl = (x, y, z0, z1, r, o = {}) => { const c = circ(r, 28); return { k: "c", p: c.map((q) => [x + q.u, y + q.v, z0]).concat(c.map((q) => [x + q.u, y + q.v, z1])), ...o }; };
const FACES = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const mid = (ps) => ps.reduce((m, q) => [m[0] + q[0] / ps.length, m[1] + q[1] / ps.length, m[2] + q[2] / ps.length], [0, 0, 0]);
const rz = (px, py, d) => { const c = Math.cos(rad(d)), s = Math.sin(rad(d)); return (q) => [px + (q[0] - px) * c - (q[1] - py) * s, py + (q[0] - px) * s + (q[1] - py) * c, q[2]]; };
const rx = (py, pz, d) => { const c = Math.cos(rad(d)), s = Math.sin(rad(d)); return (q) => [q[0], py + (q[1] - py) * c - (q[2] - pz) * s, pz + (q[1] - py) * s + (q[2] - pz) * c]; };
const ry = (px, pz, d) => { const c = Math.cos(rad(d)), s = Math.sin(rad(d)); return (q) => [px + (q[0] - px) * c - (q[2] - pz) * s, q[1], pz + (q[0] - px) * s + (q[2] - pz) * c]; };
const rect = (x0, x1, y, z0, z1) => [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], [x0, y, z0]];
function paths(P, part, T) {
  const w = part.p.map(T), s = w.map((q) => P(q[0], q[1], q[2]));
  let cr = "";
  if (part.k === "b") {
    const c = mid(w);
    for (const f of FACES) {
      let n = cross(sub(w[f[1]], w[f[0]]), sub(w[f[3]], w[f[0]]));
      if (dot(n, sub(mid(f.map((i) => w[i])), c)) < 0) n = n.map((v) => -v);
      if (dot(n, V) > 0) cr += poly(f.map((i) => s[i]));
    }
  } else cr = poly(s.slice(s.length / 2));
  for (const d of part.deco || []) cr += open(d.map(T).map((q) => P(q[0], q[1], q[2])));
  return { sil: poly(hull(s)), cr, z: dot(mid(w), V) };
}

const S = 2.7, REST = 8, D0 = 0, DR = 60, WORD = "tilt";
const MAP = (a, amp) => ((a + 1) / 2) * amp;
const xf = (d) => rx(12, 4, d);
const FIT = [[0, 0, 0], [50, 24, 0], [2, -46, 0], [48, -46, 0], [0, 24, 76], [50, 24, 76]];
const corners = [[2, 4, 5, 7], [48, 4, 45, 7], [2, 76, 5, 73], [48, 76, 45, 73]].map(([a, b, c, d]) => [[a, 14, b], [c, 14, d]]);
const PARTS = [
  box(0, 0, 0, 50, 24, 4, { l: 0 }),
  box(2, 10, 4, 48, 14, 76, { l: 1, m: true, hi: true, deco: [rect(5, 45, 14, 7, 73), rect(9, 41, 14, 11, 69), [[11, 14, 22], [20, 14, 40], [27, 14, 30], [34, 14, 46], [39, 14, 22]], ...corners] }),
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, S);
  fit(C, FIT, 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const items = PARTS.map((pt) => { const s = solid(g); if (pt.hi) s.sil.classList.add("hi"); return { pt, s }; });
  const sp = spring(REST, { k: 90, c: 16 });
  const id = (q) => q;
  function draw() {
    const T = xf(sp.x);
    const out = items.map((it) => ({ it, ...paths(P, it.pt, it.pt.m ? T : id) }));
    out.sort((a, b) => (a.it.pt.l || 0) - (b.it.pt.l || 0) || a.z - b.z);
    for (const o of out) { o.it.s.sil.setAttribute("d", o.sil); o.it.s.cr.setAttribute("d", o.cr); if (g.lastChild !== o.it.s.g) g.appendChild(o.it.s.g); }
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(p) {
    const [wx, wy] = unproj(C, p[0], p[1], 0);
    sp.t = MAP(clamp((wx - wy - D0) / DR, -1, 1), amp);
    read.textContent = WORD + " " + Math.round(Math.abs(sp.t)) + "\u00b0";
    B.wake();
  }
  function rest() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  rest();
  bag.add(pointer(stage, { move: aim, leave: rest }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "posterframe",
  means: "A poster in a mitred clip frame on a low foot: the frame tilts back on its hinge as the pointer moves across.",
  rules: [1, 3, 4, 5, 6],
  range: [10, 30, 50],
  tour: [[154, 66], [110, 39], [198, 83], null],
  mount,
});
