/**
 * Windsurf: a board with a mast, wishbone boom and sail on a free joint. The pointer pulls the rig over sideways; the sail is bright.
 */
const { Cam, fit, proj, rrect, hull, poly, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const box = (x0, y0, z0, x1, y1, z1, r = 1.5) => {
  const ring = rrect(x0, y0, x1, y1, Math.min(r, (x1 - x0) / 2.2, (y1 - y0) / 2.2), 4);
  return ring.map((q) => [q.u, q.v, z0]).concat(ring.map((q) => [q.u, q.v, z1]));
};
const FOOT = [-6, 0, 5];
const tiltX = (p, a) => {
  const u = p[1] - FOOT[1], v = p[2] - FOOT[2], s = Math.sin(a), k = Math.cos(a);
  return [p[0], FOOT[1] + u * k - v * s, FOOT[2] + u * s + v * k];
};
const ANG = (t, a) => -(0.14 + t * Math.min(0.85, 0.62 * a));
const R = (pts, t, a) => pts.map((p) => tiltX(p, ANG(t, a)));
const sail = () => [[-5, -0.8, 9], [-5, 0.8, 9], [-5, -0.8, 96], [-5, 0.8, 96], [16, 0, 92], [50, -0.8, 40], [50, 0.8, 40], [44, 0, 28], [10, 0, 12]];
const boom = () => [[-7, -5, 48], [-7, 5, 48], [-7, -5, 51], [-7, 5, 51], [52, -1.5, 40], [52, 1.5, 40], [52, -1.5, 43], [52, 1.5, 43], [22, -7, 46], [22, 7, 46], [22, -7, 48], [22, 7, 48]];
const ITEMS = [
  { cls: "sil", f: () => box(-66, -13, 0, 62, 13, 5, 12) },
  { cls: "sil", f: () => box(-8, -3, 5, -4, 3, 7, 1.2) },
  { cls: "sil hi", f: (t, a) => R(sail(), t, a) },
  { cls: "sil", f: (t, a) => R(box(-7, -1.4, 6, -4, 1.4, 100, 1.2), t, a) },
  { cls: "sil", f: (t, a) => R(boom(), t, a) },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 1.95);
  const all = [];
  for (const it of ITEMS) for (const t of [0, 1]) all.push(...it.f(t, 1.3));
  fit(C, all, 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const els = ITEMS.map((it) => ({ it, el: mk("path", { class: it.cls }, g) }));
  // static hit box: the rest pose on screen
  const rest = [];
  for (const it of ITEMS) for (const p of it.f(0, 1)) rest.push(P(p[0], p[1], p[2]));
  const bx0 = Math.min(...rest.map((q) => q[0])) - 8, bx1 = Math.max(...rest.map((q) => q[0])) + 8;
  const by0 = Math.min(...rest.map((q) => q[1])) - 8, by1 = Math.max(...rest.map((q) => q[1])) + 8;
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
    read.textContent = a ? "rig 50°" : "rest";
    B.wake();
  }
  setActive(0);
  bag.add(pointer(stage, {
    move: (p) => setActive(p[0] > bx0 && p[0] < bx1 && p[1] > by0 && p[1] < by1 ? 1 : 0),
    leave: () => setActive(0),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "windsurf",
  means: "A windsurf board with mast, boom and sail on a free joint: the pointer pulls the whole rig over to one side.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.3],
  tour: [[225,147],[214,162],[238,132],null],
  mount,
});
