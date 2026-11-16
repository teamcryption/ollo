/**
 * Ticket validator: a stamping press on a pad with a ticket under its head. The pointer over it brings the head down on the ticket. At rest the head is raised, bright. The slider is how far it presses.
 *
 * The pattern: one part answers the pointer (a single gesture, clamped).
 */
const { Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween, disposer, pointer, put, register, solid, mk } = HL;

const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const cyl = (x, y, R, b) => [disc(x, y, R), disc(x, y, R - b)];
const box = (x0, y0, x1, y1, r, b) => rings(x0, y0, x1, y1, r, Math.min(b, (Math.min(x1 - x0, y1 - y0)) / 2 - 0.3));
const REST = 0.12, DROP = 30;
const PARTS = [
  { f: () => [...box(28, -12, 44, -2, 2, 1), 0, 66] },
  { f: () => [...box(0, 0, 70, 46, 4, 1.6), 0, 8] },
  { f: () => [...box(14, 12, 56, 34, 0.8, 0.5), 8, 9] },
  { hi: true, f: (t) => { const z = 40 - DROP * t; return [...box(20, 6, 52, 30, 3, 1.4), z, z + 18]; } },
  { f: (t) => { const z = 58 - DROP * t; return [...cyl(36, 18, 3, 0.6), z, 64]; } },
  { f: () => [...box(28, -12, 44, 30, 2.5, 1), 64, 72] },
];
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[0,-10,0],[70,-10,0],[0,46,0],[70,46,8],[28,-10,74],[44,30,74],[70,0,0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const els = PARTS.map((p) => ({ p, s: solid(g) }));
  els.forEach((e) => e.s.sil.classList.toggle("hi", !!e.p.hi));
  const tw = tween(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    for (const e of els) {
      const r = e.p.f(t);
      if (!r) { e.s.sil.setAttribute("d", ""); e.s.cr.setAttribute("d", ""); continue; }
      put(e.s, prism(P, front, r[0], r[1], r[2], r[3]));
    }
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const mid = P(35, 18, 30);
  let on = null;
  function setActive(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? reach : REST, performance.now(), 0);
    read.textContent = a ? "stamp" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], (sy - mid[1]) * 1.3) < 110),
    leave: () => setActive(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; if (on) { on = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "ticketstub",
  means: "A ticket validator: the pointer over it brings the stamp head down on the ticket lying on the pad.",
  rules: [1, 3, 4, 5, 6],
  range: [40, 85, 100],
  tour: [[171, 123], [104, 220], [281, 239], null],
  mount,
});
