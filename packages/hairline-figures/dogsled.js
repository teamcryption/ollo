/**
 * Dogsled: a basket sled on long runners with a curled brushbow, a tall handlebar over the runner tails and a claw brake between them, on a snow trail. The pointer lifts the brake and the sled glides off; the handlebar is bright.
 */
const { Cam, fit, proj, rrect, hull, poly, unproj, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const box = (x0, y0, z0, x1, y1, z1, r = 1.5) => {
  const ring = rrect(x0, y0, x1, y1, Math.min(r, (x1 - x0) / 2.2, (y1 - y0) / 2.2), 4);
  return ring.map((q) => [q.u, q.v, z0]).concat(ring.map((q) => [q.u, q.v, z1]));
};
const cube = (p, h = 1.3) => box(p[0] - h, p[1] - h, p[2] - h, p[0] + h, p[1] + h, p[2] + h, 0.6);
const rot = (p, c, a) => { const u = p[0] - c[0], v = p[2] - c[2], s = Math.sin(a), k = Math.cos(a); return [c[0] + u * k - v * s, p[1], c[2] + u * s + v * k]; };
const BOW = [-90, -45, 0, 45, 90, 130].map((d) => [26 + 9 * Math.cos((d * Math.PI) / 180), 9 + 9 * Math.sin((d * Math.PI) / 180)]);
const X = (t, a) => -14 + t * 28 * a;
const M = (pts, t, a) => pts.map((p) => [p[0] + X(t, a), p[1], p[2]]);
const side = (y) => [box(-46, y - 1.4, 0, 26, y + 1.4, 2.2, 1), box(-46, y - 2.6, 2.2, -33, y + 2.6, 3.2, 1)]
  .concat(BOW.slice(1).map((q, i) => cube([BOW[i][0], y, BOW[i][1]]).concat(cube([q[0], y, q[1]]))))
  .concat([-22, -2, 16].map((x) => box(x - 1.3, y - 1.1, 2, x + 1.3, y + 1.1, 18, 0.6)))
  .concat([box(-30, y - 1.2, 2, -27, y + 1.2, 5, 0.6).concat(box(-36, y - 1.2, 40, -33, y + 1.2, 43, 0.6))]);
const group = (y, cls) => side(y).map((pts) => ({ cls, f: (t, a) => M(pts, t, a) }));
// the claw brake hinges under the bed; at rest it bites the snow, the pointer lifts it
const BRAKE = box(-42, -5, 5, -26, 5, 7, 1).concat(box(-42, -5, -1, -40, -3, 5, 0.5), box(-42, 3, -1, -40, 5, 5, 0.5));
const ITEMS = [{ cls: "sil", f: () => box(-80, -30, -6, 80, 30, 0, 9) }]
  .concat(group(-10, "sil"))
  .concat([
    { cls: "sil", f: (t, a) => M(BRAKE.map((p) => rot(p, [-26, 0, 6], 0.08 - t * 0.6 * a)), t, a) },
    { cls: "sil", f: (t, a) => M(box(-26, -11, 10, 22, 11, 12.5, 1.5), t, a) },
    { cls: "lo", f: (t, a) => M(box(-24, -9, 12.5, 20, 9, 13, 0.5), t, a) },
    { cls: "sil", f: (t, a) => M(box(-26, -11.5, 17, 22, -9.5, 19, 0.8), t, a) },
  ])
  .concat(group(10, "sil"))
  .concat([
    { cls: "sil", f: (t, a) => M(box(-26, 9.5, 17, 22, 11.5, 19, 0.8), t, a) },
    { cls: "sil hi", f: (t, a) => M(box(-38, -12, 40, -33, 12, 44, 2), t, a) },
  ]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 1.95);
  const all = [];
  for (const it of ITEMS) for (const t of [0, 1]) all.push(...it.f(t, 1.3));
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
  const L = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(L.unregister);
  let act = -1;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a, performance.now(), 0);
    read.textContent = a ? "mush" : "rest";
    L.wake();
  }
  setActive(0);
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 10); setActive(Math.abs(x) < 95 && Math.abs(y) < 60 ? 1 : 0); },
    leave: () => setActive(0),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; L.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "dogsled",
  means: "A dog sled on long curled runners with a tall handlebar and a claw brake: the pointer lifts the brake and the sled glides off.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.3],
  tour: [[152,85],[200,150],[232,172],null],
  mount,
});
