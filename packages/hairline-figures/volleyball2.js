/**
 * Referee stand: a tall platform with a back rail and a hinged ladder. The ladder swings out under the pointer.
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const D = Math.PI / 180, cl = (v, a, b) => Math.max(a, Math.min(b, v));
const box = (a, b, c, d, e, f) => [[a, b, c], [d, b, c], [a, e, c], [d, e, c], [a, b, f], [d, b, f], [a, e, f], [d, e, f]];
const ring = (f, n = 28) => Array.from({ length: n }, (_, i) => f(Math.cos((i / n) * 2 * Math.PI), Math.sin((i / n) * 2 * Math.PI)));
const rod = (p, q, r) => [...ring((c, s) => [p[0] + c * r, p[1] + s * r, p[2]], 10), ...ring((c, s) => [q[0] + c * r, q[1] + s * r, q[2]], 10)];


const S0 = 2.2, REST = 18, MIN = 4, MAX = 62, SIGN = -1, PIV = [16, 30, 62];
const rot = ([x, y, z], a) => { const dy = y - 30, dz = z - 62; return [x, 30 + dy * Math.cos(a) - dz * Math.sin(a), 62 + dy * Math.sin(a) + dz * Math.cos(a)]; };
const STAT = [
  { p: box(-2, -6, 0, 3, -1, 60) }, { p: box(29, -6, 0, 34, -1, 60) }, { p: box(-2, 25, 0, 3, 30, 60) }, { p: box(29, 25, 0, 34, 30, 60) },
  { p: box(3, -5, 22, 29, -2, 25) }, { p: box(0, -1, 22, 3, 25, 25) }, { p: box(29, -1, 22, 32, 25, 25) },
  { p: box(-4, -8, 60, 36, 31, 63) }, { p: box(-4, -8, 63, 36, -5, 92) }, { p: box(-4, -5, 80, -1, 31, 83) }, { p: box(33, -5, 80, 36, 31, 83) },
  { p: box(8, 2, 63, 24, 16, 72) },
];
const MOV = [{ p: box(1, 30, 0, 5, 33, 60), c: "sil", hi: 1 }, { p: box(27, 30, 0, 31, 33, 60), c: "sil", hi: 1 },
  ...[10, 22, 34, 46].map((z) => ({ p: box(5, 30.5, z, 27, 32.5, z + 2.5) }))];

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
  name: "volleyball2",
  means: "A volleyball referee stand: its hinged ladder swings out from the platform as the pointer moves, the slider sets the swing.",
  rules: [1, 3, 5, 6],
  range: [20, 50, 80],
  tour: [[235,197],[184,248],[227,254],null],
  mount,
});
