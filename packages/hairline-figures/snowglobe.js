/**
 * Snow globe: a glass sphere on a round base, a little fir tree inside and
 * the snow settled at its foot. The pointer over the globe shakes it: the
 * globe tips over on its base and the snow lifts and swirls round the tree.
 * The slider is how hard it shakes.
 */
const { Cam, fit, proj, hull, poly, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;
const A = (a, b, s = 1) => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
const N3 = (a) => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };
const X3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const ring3 = (c, u, v, r, n = 28) => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI; return A(A(c, u, r * Math.cos(t)), v, r * Math.sin(t)); });
const rot = (q, o, k, a) => {
  const p = [q[0] - o[0], q[1] - o[1], q[2] - o[2]], c = Math.cos(a), s = Math.sin(a), d = p[0] * k[0] + p[1] * k[1] + p[2] * k[2], x = X3(k, p);
  return [0, 1, 2].map((i) => o[i] + p[i] * c + x[i] * s + k[i] * d * (1 - c));
};
const Z = [0, 0, 1], X = [1, 0, 0], Y = [0, 1, 0], E = N3([1, -1, 0]), D = N3([1, 1, 0]);
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const R = 30, CZ = 14 + R * 0.92, TIP = 0.42;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-30, -30, 0], [30, 30, 0], A([0, 0, CZ], E, R + 22), A([0, 0, CZ], E, -R - 22), [0, 0, CZ + R + 4]], 200, 168);
  const P = proj(C);
  const sh = (pts) => poly(hull(pts.map((q) => P(q[0], q[1], q[2]))));
  const g = mk("g", {}, svg);
  const base = mk("path", { class: "sil" }, g), baseLo = mk("path", { class: "nf lo" }, g);
  const glass = mk("path", { class: "sil hi" }, g), mound = mk("path", { class: "nf lo" }, g), trunk = mk("path", { class: "nf" }, g), tree = mk("path", { class: "sil" }, g);
  const flakes = Array.from({ length: 14 }, (_, i) => ({ el: mk("circle", { class: i % 4 === 0 ? "dot m" : "dot off", r: 1.6 }, g), a: i * 2.4, r: 8 + ((i * 7) % 17), h: 6 + ((i * 11) % 34) }));
  const tw = tween(0.06);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const piv = A([0, 0, 0], E, 30), a = TIP * t;
    const T = (q) => rot(q, piv, D, a);
    const Pt = (q) => { const r = T(q); return P(r[0], r[1], r[2]); };
    base.setAttribute("d", sh(ring3([0, 0, 0], X, Y, 30, 40).concat(ring3([0, 0, 14], X, Y, 24, 40)).map(T)));
    baseLo.setAttribute("d", poly(ring3([0, 0, 14], X, Y, 22.4, 40).map(Pt)));
    const c = Pt([0, 0, CZ]), rr = R * C.S;
    glass.setAttribute("d", poly(Array.from({ length: 48 }, (_, i) => [c[0] + rr * Math.cos((i / 48) * 2 * Math.PI), c[1] + rr * Math.sin((i / 48) * 2 * Math.PI)].map((v) => Math.round(v * 100) / 100))));
    const floor = 14 + R * 0.92 - Math.sqrt(R * R - 20 * 20);
    mound.setAttribute("d", poly(ring3([0, 0, floor], X, Y, 20, 32).map(Pt)));
    const tp = [];
    for (const [z, r] of [[4, 11], [14, 2], [12, 8], [22, 1], [20, 5], [30, 0.6]]) tp.push(...ring3([0, 0, floor + z], X, Y, r, 20));
    tree.setAttribute("d", sh(tp.map(T)));
    trunk.setAttribute("d", sh(ring3([0, 0, floor], X, Y, 2, 10).concat(ring3([0, 0, floor + 4], X, Y, 2, 10)).map(T)));
    flakes.forEach((f, i) => {
      const s = Math.min(1, t * 1.6), ang = f.a + s * 2.2, rad = f.r * (1 - 0.25 * s), z = lerpN(floor + 1 + (i % 3), floor + f.h, s);
      const q = Pt([rad * Math.cos(ang), rad * Math.sin(ang), z]);
      f.el.setAttribute("cx", Math.round(q[0] * 100) / 100); f.el.setAttribute("cy", Math.round(q[1] * 100) / 100);
    });
  }
  const lerpN = (a, b, s) => a + (b - a) * s;
  draw(0.06);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const cc = P(0, 0, CZ), bb = P(0, 0, 0);
  const inside = ([x, y]) => Math.abs(x - cc[0]) < 34 * C.S && y > cc[1] - (R + 4) * C.S && y < bb[1] + 18 * C.S;
  let act = null;
  function setA(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? 0.4 + 0.6 * amt : 0.06, performance.now(), 0);
    read.textContent = on ? "shake" : "rest";
    B.wake();
  }
  setA(false);
  bag.add(pointer(stage, { move: (p) => setA(inside(p)), leave: () => setA(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (act) { act = null; setA(true); } }, destroy: bag.dispose };
}

hairline({
  name: "snowglobe",
  means: "A snow globe with a fir tree inside: the pointer shakes it, tipping the globe on its base and lifting the snow round the tree.",
  rules: [1, 4, 5, 8],
  range: [0, 100, 100],
  tour: [[200, 113], [200, 190], [236, 150], null],
  mount,
});
