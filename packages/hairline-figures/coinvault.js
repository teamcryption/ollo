/**
 * Coin cabinet: a squat cabinet with a deep coin drawer. The pointer over it slides the drawer out, coin stacks riding in it. At rest the drawer stands a little open, bright. The slider is how far it opens.
 *
 * The pattern: one part answers the pointer (a single gesture, clamped).
 */
const { Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween, disposer, pointer, put, register, solid, mk } = HL;

const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const cyl = (x, y, R, b) => [disc(x, y, R), disc(x, y, R - b)];
const box = (x0, y0, x1, y1, r, b) => rings(x0, y0, x1, y1, r, Math.min(b, (Math.min(x1 - x0, y1 - y0)) / 2 - 0.3));
const REST = 0.4, OUT = 34;
const PARTS = [
  { f: () => [...box(0, 0, 60, 44, 3, 1.2), 0, 70] },
  { f: () => [...box(6, 44, 54, 47, 1, 0.6), 6, 30] },
  { hi: true, f: (t) => { const o = OUT * t; return [...box(6, Math.max(4 + o, 44), 54, 48 + o, 2, 2.5), 36, 64]; } },
  { f: (t) => { const o = OUT * t, y = 33 + o; return y - 5 < 45 ? null : [...cyl(20, y, 5, 1), 63, 68]; } },
  { f: (t) => { const o = OUT * t, y = 35 + o; return y - 5 < 45 ? null : [...cyl(36, y, 5, 1), 63, 71]; } },
];
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[0,0,0],[60,0,0],[0,82,0],[60,82,70],[0,0,70],[60,0,70],[0,82,64]], 200, 160);
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
  const mid = P(30, 40, 40);
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
    move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], (sy - mid[1]) * 1.3) < 110),
    leave: () => setActive(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; if (on) { on = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "coinvault",
  means: "A coin cabinet: the pointer over it slides the deep drawer out with its coin stacks; at rest it stands slightly open.",
  rules: [1, 3, 4, 5, 6],
  range: [40, 85, 100],
  tour: [[183, 137], [217, 61], [183, 183], null],
  mount,
});
