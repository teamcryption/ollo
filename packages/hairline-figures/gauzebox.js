/** Gauze dispenser: the hinged lid of a gauze box swings open at the back to show the stacked pads. */
const { Cam, circ, fit, hull, poly, proj, rrect, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;
const R3 = (ring, z) => ring.map((q) => [q.u, q.v, z]);
const box = (x0, y0, x1, y1, r, z0, z1, b = 2) => { const a = rrect(x0, y0, x1, y1, r, 4); return { pts: R3(a, z0).concat(R3(a, z1)), cr: b ? R3(rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(r - b, 0.5), 4), z1 - 0.5) : null }; };
const disc = (cx, cy, R, n = 36) => circ(R, n).map((q) => ({ u: q.u + cx, v: q.v + cy }));
const cyl = (cx, cy, R, z0, z1, b = 0) => ({ pts: R3(disc(cx, cy, R), z0).concat(R3(disc(cx, cy, R), z1)), cr: b ? R3(disc(cx, cy, R - b), z1 - 0.5) : null });
const part = (parent) => { const g = mk("g", {}, parent); return { g, s: mk("path", { class: "sil" }, g), c: mk("path", { class: "nf lo" }, g) }; };
const rotX = (yh, zh, a) => ([x, y, z]) => [x, yh + (y - yh) * Math.cos(a) - (z - zh) * Math.sin(a), zh + (y - yh) * Math.sin(a) + (z - zh) * Math.cos(a)];
const rotY = (xh, zh, a) => ([x, y, z]) => [xh + (x - xh) * Math.cos(a) - (z - zh) * Math.sin(a), y, zh + (x - xh) * Math.sin(a) + (z - zh) * Math.cos(a)];
const rotZ = (xh, yh, a) => ([x, y, z]) => [xh + (x - xh) * Math.cos(a) - (y - yh) * Math.sin(a), yh + (x - xh) * Math.sin(a) + (y - yh) * Math.cos(a), z];
const rotV = (xh, yh, a) => ([x, y, z]) => [xh + (x - xh) * Math.cos(a) - (y - yh) * Math.sin(a), yh + (x - xh) * Math.sin(a) + (y - yh) * Math.cos(a), z];
const shift = (dx, dy, dz) => ([x, y, z]) => [x + dx, y + dy, z + dz];

function mount({ stage, svg, read }) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[0, -16, 0], [70, 45, 0], [0, -16, 66], [70, 45, 32]], 200, 160);
  const P = proj(C), pr = (f) => (p) => P(...f(p)), id = (p) => p;
  const draw = (el, sh, f) => { el.s.setAttribute("d", poly(hull(sh.pts.map(pr(f))))); if (sh.cr) el.c.setAttribute("d", poly(sh.cr.map(pr(f)))); };
  const g = mk("g", {}, svg);
  draw(part(g), box(0, 0, 70, 45, 4, 0, 16, 3), id);
  draw(part(g), box(8, 7, 62, 38, 2, 14, 19, 2), id);
  const mov = [box(0, 0, 70, 45, 4, 17, 32, 3), box(28, 44, 42, 48, 1.5, 19, 24, 0)].map((sh) => ({ sh, el: part(g) }));

  const t = tween(0), REST = 0.05, WORD = "open"; let last = NaN;
  const F = (v) => rotX(0, 17, v * 1.55);
  function render(v) { const f = F(v); for (const m of mov) draw(m.el, m.sh, f); }
  const mark = () => { mov[0].el.s.classList.add("hi"); };
  const mid = P(35, 22, 16), HW = 150, HH = 120;
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
  name: "gauzebox",
  means: "A gauze dispenser box: its lid swings open on the back hinge to show the stack of folded pads.",
  rules: [1, 4, 5, 6],
  range: [0, 1, 1],
  tour: [[148, 189], [158, 112], [209, 300], null],
  mount,
});
