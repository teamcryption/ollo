/** Memo clip: a card in a clip on a wire stand swings back on its clip. */
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
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[-12, -12, 0], [52, 52, 0], [-12, -12, 98], [52, 52, 98]], 200, 158);
  const P = proj(C), pr = (f) => (p) => P(...f(p)), id = (p) => p;
  const draw = (el, sh, f) => { el.s.setAttribute("d", poly(hull(sh.pts.map(pr(f))))); if (sh.cr) el.c.setAttribute("d", poly(sh.cr.map(pr(f)))); };
  const g = mk("g", {}, svg), base = part(g), stem = part(g), card = part(g), clip = part(g);
  draw(base, box(4, 6, 36, 34, 6, 0, 9, 3), id);
  draw(stem, cyl(20, 20, 1.6, 9, 52), id);
  const cardSh = box(-10, 18.8, 50, 21.2, 0.6, 54, 96, 0);
  const t = tween(0), REST = 0.2, WORD = "memo"; let last = NaN;
  function render(v) {
    const a = -0.35 + v * 1.1;
    draw(card, cardSh, rotX(20, 55, a));
    draw(clip, box(13, 16, 27, 24, 2, 50, 60 - 4 * v, 0), id);
  }
  const mark = () => { card.s.classList.add("hi"); };
  const mid = P(20, 20, 50), HW = 120, HH = 110;
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
  name: "memoholder",
  means: "A memo clip stand: a card held in the clip on a wire stem swings back on its clip when the pointer comes near.",
  rules: [1, 4, 5, 6],
  range: [0, 1, 1],
  tour: [[200, 59], [196, 233], [204, 277], null],
  mount,
});
