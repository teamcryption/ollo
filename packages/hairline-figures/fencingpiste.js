/**
 * Fencing target: a round padded target on a post. It turns on the post to face the pointer.
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const D = Math.PI / 180, cl = (v, a, b) => Math.max(a, Math.min(b, v));
const box = (a, b, c, d, e, f) => [[a, b, c], [d, b, c], [a, e, c], [d, e, c], [a, b, f], [d, b, f], [a, e, f], [d, e, f]];
const ring = (f, n = 28) => Array.from({ length: n }, (_, i) => f(Math.cos((i / n) * 2 * Math.PI), Math.sin((i / n) * 2 * Math.PI)));
const rod = (p, q, r) => [...ring((c, s) => [p[0] + c * r, p[1] + s * r, p[2]], 10), ...ring((c, s) => [q[0] + c * r, q[1] + s * r, q[2]], 10)];


const S0 = 2.3, REST = 28, MIN = -75, MAX = 75, SIGN = 1, PIV = [0, 0, 80];
const rot = ([x, y, z], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z];
const disc = (r, y) => ring((c, s) => [c * r, y, 80 + s * r], 40);
const STAT = [{ p: box(-22, -22, 0, 22, 22, 4) }, { p: rod([0, 0, 4], [0, 0, 50], 2.6) }];
const MOV = [{ p: [...rod([0, 0, 46], [0, 0, 54], 4)] }, { p: [...disc(34, -2.5), ...disc(34, 2.5)], c: "sil", hi: 1 }, { p: disc(23, 2.6), c: "nf" }, { p: disc(12, 2.6), c: "nf" }, { p: disc(3, 2.6), c: "nf" }];

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
  name: "fencingpiste",
  means: "A round fencing target on a post: it turns on its post to face the pointer, the slider sets how far it turns.",
  rules: [1, 3, 5, 6],
  range: [20, 50, 80],
  tour: [[151,77],[249,126],[200,100],null],
  mount,
});
