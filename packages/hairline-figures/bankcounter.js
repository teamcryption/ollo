/**
 * Teller window: a bank counter with a glass partition of two panes. The pointer over it slides the near pane across, opening the window. At rest the pane stands a little open, bright. The slider is how far it slides.
 *
 * The pattern: one part answers the pointer (a single gesture, clamped).
 */
const { Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween, disposer, pointer, put, register, solid, mk } = HL;

const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const cyl = (x, y, R, b) => [disc(x, y, R), disc(x, y, R - b)];
const box = (x0, y0, x1, y1, r, b) => rings(x0, y0, x1, y1, r, Math.min(b, (Math.min(x1 - x0, y1 - y0)) / 2 - 0.3));
const REST = 0.25, SL = 42;
const PARTS = [
  { f: () => [...box(0, 0, 96, 30, 3, 1.2), 0, 34] },
  { f: () => [...box(0, 12, 5, 18, 1, 0.6), 34, 84] },
  { f: () => [...box(48, 12.5, 90, 14.5, 0.6, 0.4), 34, 80] },
  { hi: true, f: (t) => { const o = SL * t; return [...box(6 + o, 15.5, 48 + o, 17.5, 0.6, 0.4), 34, 80]; } },
  { f: () => [...box(91, 12, 96, 18, 1, 0.6), 34, 84] },
  { f: () => [...box(0, 12, 96, 18, 1.5, 0.8), 84, 89] },
  { f: () => [...box(34, 21, 62, 29, 1.5, 1), 34, 36] },
];
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[0,0,0],[96,0,0],[0,30,0],[96,30,34],[0,12,88],[96,18,88],[96,0,88]], 200, 160);
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
  const mid = P(48, 15, 50);
  let on = null;
  function setActive(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? reach : REST, performance.now(), 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], (sy - mid[1]) * 1.3) < 120),
    leave: () => setActive(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; if (on) { on = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "bankcounter",
  means: "A teller window: the pointer over the counter slides the near glass pane across and opens the window.",
  rules: [1, 3, 4, 5, 6],
  range: [40, 85, 100],
  tour: [[184, 102], [157, 195], [243, 223], null],
  mount,
});
