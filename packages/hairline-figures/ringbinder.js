/** Ring binder: the cover swings open on its spine to show the rings. */
const { Cam, circ, fit, hull, poly, open, proj, rrect, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;
const R3 = (ring, z) => ring.map((q) => [q.u, q.v, z]);
const box = (x0, y0, x1, y1, r, z0, z1, b = 2) => { const a = rrect(x0, y0, x1, y1, r, 4); return { pts: R3(a, z0).concat(R3(a, z1)), cr: b ? R3(rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(r - b, 0.5), 4), z1 - 0.5) : null }; };
const disc = (cx, cy, R, n = 36) => circ(R, n).map((q) => ({ u: q.u + cx, v: q.v + cy }));
const cyl = (cx, cy, R, z0, z1, b = 0) => ({ pts: R3(disc(cx, cy, R), z0).concat(R3(disc(cx, cy, R), z1)), cr: b ? R3(disc(cx, cy, R - b), z1 - 0.5) : null });
const part = (parent) => { const g = mk("g", {}, parent); return { g, s: mk("path", { class: "sil" }, g), c: mk("path", { class: "nf lo" }, g) }; };
const rotX = (yh, zh, a) => ([x, y, z]) => [x, yh + (y - yh) * Math.cos(a) - (z - zh) * Math.sin(a), zh + (y - yh) * Math.sin(a) + (z - zh) * Math.cos(a)];
const rotY = (xh, zh, a) => ([x, y, z]) => [xh + (x - xh) * Math.cos(a) - (z - zh) * Math.sin(a), y, zh + (x - xh) * Math.sin(a) + (z - zh) * Math.cos(a)];
const shift = (dx, dy, dz) => ([x, y, z]) => [x + dx, y + dy, z + dz];

function mount({ stage, svg, read }) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-74, 0, 0], [72, 92, 0], [-74, 0, 70], [72, 92, 70]], 200, 160);
  const P = proj(C), pr = (f) => (p) => P(...f(p)), id = (p) => p;
  const draw = (el, sh, f) => { el.s.setAttribute("d", poly(hull(sh.pts.map(pr(f))))); if (sh.cr) el.c.setAttribute("d", poly(sh.cr.map(pr(f)))); };
  const g = mk("g", {}, svg), back = part(g), paper = part(g), cover = part(g);
  draw(back, box(-3, 0, 72, 92, 3, 0, 2, 0), id);
  draw(paper, box(14, 5, 68, 87, 1.5, 2, 9, 2), id);
  for (const y of [20, 46, 72]) {
    const pts = []; for (let i = 0; i <= 12; i++) { const q = (i / 12) * Math.PI; pts.push(P(8 + 5 * Math.cos(q), y, 5 + 6 * Math.sin(q))); }
    mk("path", { d: open(pts), class: "nf" }, g);
  }
  const coverSh = box(-3, 0, 72, 92, 3, 13, 15, 0);
  const t = tween(0), REST = 0.25, WORD = "open"; let last = NaN;
  function render(v) { draw(cover, coverSh, rotY(-3, 14, 0.4 + v * 2.2)); }
  const mark = () => { cover.s.classList.add("hi"); };
  const mid = P(35, 46, 10), HW = 150, HH = 110;
  const B = register(stage, (_dt, now) => { const v = tval(t, now); if (v !== last) { last = v; render(v); } return !tdone(t, now); });
  bag.add(B.unregister);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a < 0 ? REST : 1, performance.now(), 0);
    mark(a);
    read.textContent = a < 0 ? "rest" : WORD;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < HW && Math.abs(sy - mid[1]) < HH ? 1 : -1), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
}

hairline({
  name: "ringbinder",
  means: "A ring binder: its cover swings open on the spine to show the three rings and the paper they hold.",
  rules: [1, 4, 5, 6],
  range: [0, 1, 1],
  tour: [[248, 227], [263, 187], [236, 298], null],
  mount,
});
