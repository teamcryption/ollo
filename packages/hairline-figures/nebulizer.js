/**
 * Nebulizer: a compressor box with a medicine cup on top and a mask on
 * its tube. At rest the mask lies over the box, bright; the pointer on the
 * figure swings the mask round on its tube. The slider is the swing.
 */
const { Cam, fit, hull, poly, proj, tween, tset, tval, tdone, disposer, mk, pointer, register, rad, lerp } = HL;

const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]];
const top = (x0, y0, x1, y1, z) => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];
const ring = (o, u, v, r, n = 28) => Array.from({ length: n }, (_, i) => {
  const a = (i / n) * Math.PI * 2, c = Math.cos(a) * r, s = Math.sin(a) * r;
  return [o[0] + u[0] * c + v[0] * s, o[1] + u[1] * c + v[1] * s, o[2] + u[2] * c + v[2] * s];
});
const cyl = (x, y, r, z0, z1, n) => ring([x, y, z0], [1, 0, 0], [0, 1, 0], r, n).concat(ring([x, y, z1], [1, 0, 0], [0, 1, 0], r, n));
const rot = (p, o, a, i, j) => {
  const q = p.slice(), c = Math.cos(a), s = Math.sin(a), di = p[i] - o[i], dj = p[j] - o[j];
  q[i] = o[i] + di * c - dj * s; q[j] = o[j] + di * s + dj * c; return q;
};

const S = 3.1, AMAX = 1.3, WORDS = ["rest","mask"];
const PV = [10, 10, 36];
const X = (p, t, a) => rot(p, PV, rad(-8 + 84 * Math.min(1, t * a) ), 0, 1);
const parts = () => [
  { pts: box(-6, -6, 0, 40, 30, 18) },
  { pts: top(-6, -6, 40, 30, 18), face: true, c: "nf lo" },
  { pts: box(18, 30, 4, 34, 30.5, 12), face: false, c: "nf lo" },
  { pts: cyl(10, 10, 6, 18, 36) },
  { pts: ring([10, 10, 30], [1, 0, 0], [0, 1, 0], 6), face: true, c: "nf lo" },
  { pts: box(10, 8.6, 34.6, 34, 11.4, 37.4), mv: 1 },
  { pts: ring([34, 10, 36], [0, 1, 0], [0, 0, 1], 5).concat(ring([48, 10, 36], [0, 1, 0], [0, 0, 1], 15)), mv: 1, c: "sil hi" },
  { pts: ring([48, 10, 36], [0, 1, 0], [0, 0, 1], 12.5), mv: 1, face: true, c: "nf lo" },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const shapes = parts();
  const C = Cam(45, 0.5, S);
  const all = [];
  for (const s of shapes) for (const p of s.pts) { all.push(p); if (s.mv) all.push(X(p, 1, AMAX)); }
  fit(C, all, 200, 162);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const path = (s, t) => {
    const q = s.pts.map((p) => P(...(s.mv ? X(p, t, amp) : p)));
    return poly(s.face ? q : hull(q));
  };
  for (const s of shapes) { s.el = mk("path", { class: s.c || "sil" }, g); s.el.setAttribute("d", path(s, 0)); }
  // the hit box is the rest pose's screen box, which never moves
  const rest = shapes.flatMap((s) => s.pts.map((p) => P(...(s.mv ? X(p, 0, 1) : p))));
  const xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
  const hb = [Math.min(...xs) - 6, Math.min(...ys) - 6, Math.max(...xs) + 6, Math.max(...ys) + 6];
  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    for (const s of shapes) if (s.mv) s.el.setAttribute("d", path(s, t));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  let on = null;
  function set(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? WORDS[1] : WORDS[0];
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, {
    move: ([x, y]) => set(x > hb[0] && x < hb[2] && y > hb[1] && y < hb[3]),
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; draw(tval(tw, performance.now())); }, destroy: bag.dispose };
}

hairline({
  name: "nebulizer",
  means: "A nebulizer: the mask on its tube swings round from the medicine cup on top of the compressor.",
  rules: [1, 3, 4, 5, 6],
  range: [0.5, 1, 1.3],
  tour: [[275, 117], [113, 192], [293, 176], null],
  mount,
});
