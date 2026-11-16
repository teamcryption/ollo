/**
 * Windsock: a pole with a cone of cloth on a ring at its top. The pointer turns the sock round the pole as the wind shifts; the sock is bright.
 */
const { Cam, fit, proj, rrect, hull, poly, unproj, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const box = (x0, y0, z0, x1, y1, z1, r = 1.5) => {
  const ring = rrect(x0, y0, x1, y1, Math.min(r, (x1 - x0) / 2.2, (y1 - y0) / 2.2), 4);
  return ring.map((q) => [q.u, q.v, z0]).concat(ring.map((q) => [q.u, q.v, z1]));
};
const disc = (cx, cy, z, r, n = 28) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * 6.2832), cy + r * Math.sin((i / n) * 6.2832), z]);
const cyl = (cx, cy, z0, z1, r0, r1 = r0) => disc(cx, cy, z0, r0).concat(disc(cx, cy, z1, r1));
const rot = (p, c, ax, a) => {
  const [i, j] = ax === "x" ? [1, 2] : ax === "y" ? [0, 2] : [0, 1], q = p.slice(), s = Math.sin(a), k = Math.cos(a);
  const u = p[i] - c[i], v = p[j] - c[j];
  q[i] = c[i] + u * k - v * s; q[j] = c[j] + u * s + v * k;
  return q;
};
const A = (t, a) => 0.3 + t * 2.0 * a;
const ring = (d, r, z) => Array.from({ length: 24 }, (_, i) => { const q = (i / 24) * 6.2832; return [d, r * Math.cos(q), z + r * Math.sin(q)]; });
const T = (pts, t, a) => pts.map((p) => rot(p, [0, 0, 0], "z", A(t, a)));
const ITEMS = [
  { cls: "sil", f: () => cyl(0, 0, -4, 0, 22) },
  { cls: "sil", f: () => box(-2.5, -2.5, 0, 2.5, 2.5, 108, 1.2) },
  { cls: "sil hi", f: (t, a) => T(ring(4, 13, 96).concat(ring(66, 6, 88)), t, a) },
  { cls: "nf lo", f: (t, a) => T(ring(26, 10.8, 93).concat(ring(27, 10.6, 93)), t, a) },
  { cls: "nf lo", f: (t, a) => T(ring(47, 8.6, 90).concat(ring(48, 8.4, 90)), t, a) },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.3);
  const all = [];
  for (const it of ITEMS) for (const t of [0, 1]) all.push(...it.f(t, 1));
  fit(C, all, 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const els = ITEMS.map((it) => ({ it, el: mk("path", { class: it.cls }, g) }));
  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    for (const e of els) e.el.setAttribute("d", poly(hull(e.it.f(t, amp).map((p) => P(p[0], p[1], p[2])))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  let act = -1;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a, performance.now(), 0);
    read.textContent = a ? "sock" : "rest";
    B.wake();
  }
  setActive(0);
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 60); setActive(Math.hypot(x - 0, y - 0) < 80 ? 1 : 0); },
    leave: () => setActive(0),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "windsock",
  means: "A windsock on a pole: when the pointer comes near, the wind shifts and the bright cone turns round the pole.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.3],
  tour: [[251,125],[225,140],[205,110],null],
  mount,
});
