/**
 * Bike stand: an A-frame stand holding a rear wheel by its hub. The wheel turns in the clamp toward the pointer.
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const D = Math.PI / 180, cl = (v, a, b) => Math.max(a, Math.min(b, v));
const box = (a, b, c, d, e, f) => [[a, b, c], [d, b, c], [a, e, c], [d, e, c], [a, b, f], [d, b, f], [a, e, f], [d, e, f]];
const ring = (f, n = 28) => Array.from({ length: n }, (_, i) => f(Math.cos((i / n) * 2 * Math.PI), Math.sin((i / n) * 2 * Math.PI)));
const rod = (p, q, r) => [...ring((c, s) => [p[0] + c * r, p[1] + s * r, p[2]], 10), ...ring((c, s) => [q[0] + c * r, q[1] + s * r, q[2]], 10)];


const S0 = 2.7, REST = 22, MIN = -55, MAX = 55, SIGN = 1, PIV = [0, 0, 34];
const rot = ([x, y, z], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z];
const wr = (r, x) => ring((c, s) => [x, c * r, 34 + s * r], 44);
const STAT = [
  { p: rod([-22, -20, 0], [-22, 20, 0], 2) }, { p: rod([22, -20, 0], [22, 20, 0], 2) },
  { p: [...rod([-22, -18, 1], [-9, 0, 34], 1.8)], over: 1 }, { p: rod([-22, 18, 1], [-9, 0, 34], 1.8) },
  { p: rod([22, -18, 1], [9, 0, 34], 1.8) }, { p: [...rod([22, 18, 1], [9, 0, 34], 1.8)], over: 1 },
];
const MOV = [{ p: [...wr(33, -2.2), ...wr(33, 2.2)], c: "sil", hi: 1 }, { p: wr(28, 2.3), c: "nf" },
  ...[0, 1, 2, 3, 4, 5].map((k) => { const t = (k * Math.PI) / 6; return { p: [[0, -27 * Math.cos(t), 34 - 27 * Math.sin(t)], [0, 27 * Math.cos(t), 34 + 27 * Math.sin(t)]], c: "nf" }; }),
  { p: rod([-9, 0, 34], [9, 0, 34], 3).map(([x, y, z]) => [x, y, z]), c: "" }, { p: ring((c, s) => [2.4, c * 9, 34 + s * 9], 20), c: "nf" }];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, S0), ext = [];
  STAT.forEach((s) => ext.push(...s.p));
  for (const a of [MIN, REST, MAX]) MOV.forEach((m) => m.p.forEach((q) => ext.push(rot(q, a * D))));
  fit(C, ext, 200, 160);
  const P = proj(C), g = mk("g", {}, svg), h = (pts) => poly(hull(pts.map((q) => P(q[0], q[1], q[2]))));
  STAT.filter((s) => !s.over).forEach((s) => mk("path", { d: h(s.p), class: s.c || "" }, g));
  const els = MOV.map((m) => mk("path", { class: m.c || "" }, g));
  STAT.filter((s) => s.over).forEach((s) => mk("path", { d: h(s.p), class: s.c || "" }, g));
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    MOV.forEach((m, i) => els[i].setAttribute("d", h(m.p.map((q) => rot(q, a * D)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const cx = P(PIV[0], PIV[1], PIV[2])[0];
  let act = null;
  function setActive(sx) {
    const t = sx == null ? REST : Math.round(cl(REST + SIGN * ((sx - cx) / 90) * amp, MIN, MAX));
    if (t === act) return;
    act = t;
    tset(ang, t, performance.now(), 0);
    els.forEach((e, i) => e.classList.toggle("hi", !!MOV[i].hi));
    read.textContent = sx == null ? "rest" : Math.abs(t) + "°";
    B.wake();
  }
  setActive(null);
  bag.add(pointer(stage, { move: (p) => setActive(p[0]), leave: () => setActive(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "triathlon",
  means: "A bike stand holding a rear wheel at its hub: the wheel turns in the clamp to follow the pointer, the slider sets the turn.",
  rules: [1, 3, 5, 6],
  range: [20, 50, 80],
  tour: [[137,175],[263,112],[200,140],null],
  mount,
});
