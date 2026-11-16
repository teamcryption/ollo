/**
 * Harbor bell: a bell buoy on its float, a cage of four bars round a bell. The pointer rocks the buoy over on the swell; the bell is bright.
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
const TL = (t, a) => 0.1 + t * 0.42 * a;
const R = (pts, t, a) => pts.map((p) => rot(p, [0, 0, 0], "x", TL(t, a)));
const ITEMS = [
  { cls: "nf lo", f: () => disc(0, 0, -2, 46, 48) },
  { cls: "sil", f: (t, a) => R(cyl(0, 0, 0, 12, 28, 24), t, a) },
  { cls: "sil", f: (t, a) => R(box(-17, -17, 12, -12, -12, 62), t, a) },
  { cls: "sil", f: (t, a) => R(box(12, -17, 12, 17, -12, 62), t, a) },
  { cls: "sil", f: (t, a) => R(box(-17, 12, 12, -12, 17, 62), t, a) },
  { cls: "sil hi", f: (t, a) => R(cyl(0, 0, 22, 44, 13, 6), t, a) },
  { cls: "sil", f: (t, a) => R(box(12, 12, 12, 17, 17, 62), t, a) },
  { cls: "sil", f: (t, a) => R(box(-19, -19, 60, 19, 19, 66, 4), t, a) },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2);
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
    read.textContent = a ? "bell" : "rest";
    B.wake();
  }
  setActive(0);
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 30); setActive(Math.hypot(x - 0, y - 0) < 60 ? 1 : 0); },
    leave: () => setActive(0),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "buoyring",
  means: "A harbor bell buoy, a bell in a cage on a float: the pointer rocks it over on the swell and the bright bell swings.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.3],
  tour: [[199,142],[180,170],[215,120],null],
  mount,
});
