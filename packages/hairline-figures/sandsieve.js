/**
 * Sand sieve: a round riddle held over a heap of sand, its mesh across the floor. The pointer over it tips and shakes the sieve sideways. At rest the heap is bright. The slider is the tilt.
 *
 * The pattern: one object answering the pointer with one gesture.
 */
const {
  Cam, circ, fit, facing, hull, poly, open, prism, proj, rings, ringAt, tdone, tset, tval, tween, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const B = [{"h":[[0,0,36,0],[0,0,24,10],[2,0,12,17],[3,0,4,20]]}];
const M = [{"c":[0,0,38,30,37,2.2]},{"m":[0,0,33,36.5,7]}];
const F = [];
const AMAX = 28;
function rot(p, c, k, th) {
  const x = p[0] - c[0], y = p[1] - c[1], z = p[2] - c[2], co = Math.cos(th), s = Math.sin(th);
  const d = (k[0] * x + k[1] * y + k[2] * z) * (1 - co);
  return [c[0] + x * co + (k[1] * z - k[2] * y) * s + k[0] * d, c[1] + y * co + (k[2] * x - k[0] * z) * s + k[1] * d, c[2] + z * co + (k[0] * y - k[1] * x) * s + k[2] * d];
}
const xf = (p, t, a) => { const q = rot(p, [0, 0, 33], [0.7071, 0.7071, 0], rad(a) * t); return [q[0] + 8 * t, q[1] - 8 * t, q[2]]; };
function box(p) {
  if (p.c) { const [x, y, r, z0, z1] = p.c; return [[x - r, y - r, z0], [x + r, y + r, z1], [x - r, y + r, z1], [x + r, y - r, z0]]; }
  if (p.k) { const [x0, y0, x1, y1, , , z0, z1] = p.k; return [[x0, y0, z0], [x1, y1, z1], [x0, y1, z1], [x1, y0, z0]]; }
  if (p.h) return p.h.flatMap(([x, y, r, z]) => [[x - r, y - r, z], [x + r, y + r, z]]);
  return [];
}
function draw(Pw, front, s, p) {
  if (p.c) { const [x, y, r, z0, z1, b] = p.c; put(s, prism(Pw, front, disc(x, y, r), disc(x, y, r - b), z0, z1)); }
  else if (p.k) { const [x0, y0, x1, y1, r, b, z0, z1] = p.k; const [a, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(Pw, front, a, i, z0, z1)); }
  else if (p.h) { const pts = []; for (const [x, y, r, z] of p.h) pts.push(...ringAt(Pw, disc(x, y, r, 24), z)); s.sil.setAttribute("d", poly(hull(pts))); s.cr.setAttribute("d", ""); }
  else if (p.m) {
    const [x, y, r, z, n] = p.m; let d = "";
    for (let i = 1; i < n; i++) { const u = -r + (2 * r * i) / n, w = Math.sqrt(r * r - u * u); d += open([Pw(x + u, y - w, z), Pw(x + u, y + w, z)]) + open([Pw(x - w, y + u, z), Pw(x + w, y + u, z)]); }
    s.sil.setAttribute("d", ""); s.cr.setAttribute("d", d);
  }
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.9);
  const ext = B.concat(F).flatMap(box);
  for (const p of M) for (const t of [0, 1]) for (const q of box(p)) ext.push(xf(q, t, AMAX, p));
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const sb = B.map(() => solid(g)), sm = M.map(() => solid(g)), sf = F.map(() => solid(g));
  B.forEach((p, i) => draw(P, front, sb[i], p));
  const L = { B: sb, M: sm, F: sf };
  const restS = L.B[0], actS = L.M[0];
  const tw = tween(0);
  let last = NaN;
  function redraw(t) {
    if (t === last) return;
    last = t;
    M.forEach((p, i) => draw((x, y, z) => { const q = xf([x, y, z], t, amt, p); return P(q[0], q[1], q[2]); }, front, sm[i], p));
    F.forEach((p, i) => draw(P, front, sf[i], p));
  }
  const R = register(stage, (_dt, now) => { redraw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(R.unregister);

  const ctr = P(0, 0, 20);
  let act = null;
  function setA(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? 1 : 0, performance.now(), 0);
    restS.sil.classList.toggle("hi", !a);
    actS.sil.classList.toggle("hi", a);
    read.textContent = a ? "sift" : "rest";
    R.wake();
  }
  setA(false);
  bag.add(pointer(stage, { move: (p) => setA(Math.hypot(p[0] - ctr[0], p[1] - ctr[1]) < 120), leave: () => setA(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; R.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "sandsieve",
  means: "A sand sieve over a heap: the pointer tips and shakes the sieve sideways, its mesh sliding over the sand.",
  rules: [1, 4, 5, 8],
  range: [8,20,28],
  tour: [[195, 108], [225, 135], [165, 140], null],
  mount,
});
