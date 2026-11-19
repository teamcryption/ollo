/**
 * Sleigh: a high-backed sleigh tub with a swept front dash on two runners that curl up at the nose, on a slab of snow. The pointer sends it gliding down the slab; the seat is bright.
 */
const { Cam, fit, proj, rrect, hull, poly, unproj, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const box = (x0, y0, z0, x1, y1, z1, r = 1.5) => {
  const ring = rrect(x0, y0, x1, y1, Math.min(r, (x1 - x0) / 2.2, (y1 - y0) / 2.2), 4);
  return ring.map((q) => [q.u, q.v, z0]).concat(ring.map((q) => [q.u, q.v, z1]));
};
const cube = (p, h = 1.4) => box(p[0] - h, p[1] - h, p[2] - h, p[0] + h, p[1] + h, p[2] + h, 0.6);
// the runner's curl: an arc up and back over the nose, as short bars
const CURL = [-90, -50, -10, 30, 70, 110, 150].map((d) => [22 + 11 * Math.cos((d * Math.PI) / 180), 12 + 11 * Math.sin((d * Math.PI) / 180)]);
const X = (t, a) => -20 + t * 34 * a;
const M = (pts, t, a) => pts.map((p) => [p[0] + X(t, a), p[1], p[2]]);
const runner = (y) => [box(-30, y - 1.6, 0, 22, y + 1.6, 2.6, 1)].concat(CURL.slice(1).map((q, i) => cube([CURL[i][0], y, CURL[i][1]]).concat(cube([q[0], y, q[1]]))));
const struts = (y) => [box(-20, y - 1.2, 2, -17, y + 1.2, 13, 0.8), box(8, y - 1.2, 2, 11, y + 1.2, 13, 0.8)];
const parts = (y, cls) => runner(y).concat(struts(y)).map((pts) => ({ cls, f: (t, a) => M(pts, t, a) }));
const ITEMS = [{ cls: "sil", f: () => box(-72, -36, -6, 72, 36, 0, 9) }]
  .concat(parts(-17, "sil"))
  .concat([
    { cls: "sil", f: (t, a) => M(box(-30, -14, 20, -23, 14, 44, 4), t, a) },
    { cls: "sil", f: (t, a) => M(box(-26, -14, 12, 18, 14, 27, 4), t, a) },
    { cls: "sil", f: (t, a) => M(box(14, -14, 12, 19, 14, 27, 2).concat([[31, -12, 40], [31, 12, 40], [28, -12, 42], [28, 12, 42]]), t, a) },
    { cls: "lo", f: (t, a) => M(box(-6, -13, 27, -4, 13, 30, 0.6), t, a) },
    { cls: "sil hi", f: (t, a) => M(box(-23, -13, 27, -8, 13, 31, 3), t, a) },
  ])
  .concat(parts(17, "sil"));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.0);
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
    read.textContent = a ? "glide" : "rest";
    L.wake();
  }
  setActive(0);
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 10); setActive(Math.abs(x) < 80 && Math.abs(y) < 44 ? 1 : 0); },
    leave: () => setActive(0),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; L.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "sleigh",
  means: "A high-backed sleigh on two curled runners, on a slab of snow: the pointer sends it gliding forward down the slab.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.3],
  tour: [[179,120],[215,150],[160,170],null],
  mount,
});
