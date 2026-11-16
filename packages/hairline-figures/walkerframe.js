/**
 * Walking frame: four legs, two side rails with grips, a front bar and two
 * front wheels. At rest it stands nearly level, grips bright; the pointer on
 * the figure tilts it forward onto its wheels. The slider is the tilt.
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

const S = 2.3, AMAX = 1.3, WORDS = ["rest","tilt"];
const AX = [44, 0, 7];
const X = (p, t, a) => rot(p, AX, rad(-2 - 20 * Math.min(1, t * a)), 0, 2);
const W = 50, H = 52;
const leg = (x, y, z0) => ({ pts: cyl(x, y, 1.8, z0, H, 12), mv: 1 });
const wheel = (y) => ({ pts: ring([44, y - 2.5, 7], [1, 0, 0], [0, 0, 1], 7).concat(ring([44, y + 2.5, 7], [1, 0, 0], [0, 0, 1], 7)), mv: 1 });
const parts = () => [
  leg(0, 0, 0),
  { pts: box(-3, -2, H, 46, 2, H + 3), mv: 1 },
  { pts: box(-6, -2.6, H + 1, 16, 2.6, H + 6), mv: 1, c: "sil hi" },
  leg(44, 0, 12), wheel(0),
  leg(0, W, 0),
  { pts: box(42, 0, 30, 46, W, 34), mv: 1 },
  { pts: box(-3, W - 2, H, 46, W + 2, H + 3), mv: 1 },
  { pts: box(-6, W - 2.6, H + 1, 16, W + 2.6, H + 6), mv: 1, c: "sil hi" },
  leg(44, W, 12), wheel(W),
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
  name: "walkerframe",
  means: "A walking frame: the frame tips forward onto its two front wheels, lifting its back legs.",
  rules: [1, 3, 4, 5, 6],
  range: [0.5, 1, 1.3],
  tour: [[202, 80], [113, 230], [184, 252], null],
  mount,
});
