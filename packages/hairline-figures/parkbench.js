/**
 * Bike lift: a garage post with a platform carrying a bike. The pointer raises the platform up the post; the bike's frame is bright.
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
const Z = (t, a) => 6 + t * 46 * a;
const U = (pts, t, a) => pts.map((p) => [p[0], p[1], p[2] + Z(t, a)]);
const wheel = (cx) => { const pts = []; for (let i = 0; i < 28; i++) { const q = (i / 28) * 6.2832; for (const y of [-1.5, 1.5]) pts.push([cx + 17 * Math.cos(q), y, 20 + 17 * Math.sin(q)]); } return pts; };
const bar = (a, b, w = 1.4) => box(a[0] - w, a[1] - w, a[2] - w, a[0] + w, a[1] + w, a[2] + w, 0.5).concat(box(b[0] - w, b[1] - w, b[2] - w, b[0] + w, b[1] + w, b[2] + w, 0.5));
const ITEMS = [
  { cls: "sil", f: () => box(-62, -24, -4, 56, 24, 0, 5) },
  { cls: "sil", f: () => box(-62, -7, 0, -52, 7, 100, 2) },
  { cls: "sil", f: (t, a) => U(box(-50, -12, 0, 50, 12, 3, 2), t, a) },
  { cls: "sil", f: (t, a) => U(wheel(-27), t, a) },
  { cls: "sil hi", f: (t, a) => U(bar([-27, 0, 20], [-6, 0, 44]).concat(bar([0, 0, 20], [24, 0, 44])), t, a) },
  { cls: "sil", f: (t, a) => U(wheel(27), t, a) },
  { cls: "sil", f: (t, a) => U(bar([-10, 0, 46], [-2, 0, 46], 2), t, a) },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 1.75);
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
    read.textContent = a ? "lift" : "rest";
    B.wake();
  }
  setActive(0);
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 30); setActive(Math.hypot(x - 0, y - 0) < 70 ? 1 : 0); },
    leave: () => setActive(0),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "parkbench",
  means: "A garage bike lift: a platform on a post holding a bike, raised up the post when the pointer comes near.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.3],
  tour: [[204,175],[180,150],[220,190],null],
  mount,
});
