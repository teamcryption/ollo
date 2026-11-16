/** Kettle corn pot: a big pot hung between two posts; it tilts forward on its pivots and pours the popcorn out. */
const { Cam, circ, fit, hull, poly, proj, rrect, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;
const R3 = (ring, z) => ring.map((q) => [q.u, q.v, z]);
const box = (x0, y0, x1, y1, r, z0, z1, b = 1.5) => { const a = rrect(x0, y0, x1, y1, r, 4); return { pts: R3(a, z0).concat(R3(a, z1)), cr: R3(rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(r - b, 0.5), 4), z1) }; };
const disc = (cx, cy, R, n = 36) => circ(R, n).map((q) => ({ u: q.u + cx, v: q.v + cy }));
const cyl = (cx, cy, R, z0, z1, b = 2) => ({ pts: R3(disc(cx, cy, R), z0).concat(R3(disc(cx, cy, R), z1)), cr: b ? R3(disc(cx, cy, R - b), z1) : null });
const hcyl = (y, z, R, x0, x1, n = 24) => { const c = circ(R, n); return { pts: c.map((q) => [x0, y + q.u, z + q.v]).concat(c.map((q) => [x1, y + q.u, z + q.v])), cr: c.map((q) => [x1, y + q.u * 0.6, z + q.v * 0.6]) }; };
const part = (parent) => { const g = mk("g", {}, parent); return { g, s: mk("path", { class: "sil" }, g), c: mk("path", { class: "nf lo" }, g) }; };
const rotX = (yh, zh, a) => ([x, y, z]) => [x, yh + (y - yh) * Math.cos(a) - (z - zh) * Math.sin(a), zh + (y - yh) * Math.sin(a) + (z - zh) * Math.cos(a)];
const sh = (dx, dy, dz) => ([x, y, z]) => [x + dx, y + dy, z + dz];
const id = (p) => p;

function mount({ stage, svg, read }) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-4, 0, 0], [90, 96, 0], [0, 10, 72], [86, 70, 72], [0, 96, 40]], 200, 162);
  const P = proj(C), pr = (f) => (p) => P(...f(p));
  const draw = (el, s, f = id) => { el.s.setAttribute("d", poly(hull(s.pts.map(pr(f))))); el.c.setAttribute("d", s.cr ? poly(s.cr.map(pr(f))) : ""); };
  const g = mk("g", {}, svg);

  const tray = part(g), postA = part(g), pot = part(g), puffs = [0, 1, 2, 3, 4].map(() => part(g)), postB = part(g);
  draw(tray, box(-4, 8, 90, 96, 6, 0, 4, 2));
  draw(postA, box(0, 36, 6, 44, 2, 4, 62, 1)); draw(postB, box(80, 36, 86, 44, 2, 4, 62, 1));
  const potS = cyl(43, 40, 30, 28, 64, 3);
  const PF = [[34, 32], [50, 34], [42, 46], [30, 46], [54, 48]];
  const REST = 0.12, MID = [43, 40, 40];
  function render(v) {
    const f = rotX(40, 56, -1.0 * v);
    draw(pot, potS, f);
    PF.forEach(([x, y], k) => draw(puffs[k], cyl(x, y, 5, 64, 70, 0), (p) => { const q = f(p); return [q[0], q[1] + 28 * v * v * (1 + k * 0.15), Math.max(q[2] - 60 * v * v, 5 + k)]; }));
  }
  const mark = () => { pot.s.classList.toggle("hi", true); };
  const t = tween(REST); let last = NaN;
  const B = register(stage, (_dt, now) => { const v = tval(t, now); if (v !== last) { last = v; render(v); } return !tdone(t, now); });
  bag.add(B.unregister);
  const mid = P(...MID);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a < 0 ? REST : 1, performance.now(), 0);
    mark(a);
    read.textContent = a < 0 ? "rest" : "pour";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 110 && Math.abs(sy - mid[1]) < 95 ? 1 : -1), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
}

hairline({
  name: "popcorn2",
  means: "A kettle corn pot hung between two posts: it tilts forward on its pivots and pours the popcorn out onto the tray.",
  rules: [1, 4, 5, 6],
  range: [0, 1, 1],
  tour: [[267, 97], [220, 110], [300, 140], null],
  mount,
});
