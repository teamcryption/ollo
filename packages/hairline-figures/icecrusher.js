/** Ice crusher: a hopper on a base with a side crank; the lid tips open, the crank swings and the ice drawer slides out. */
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
  const C = Cam(45, 0.5, 2);
  fit(C, [[0, 0, 0], [86, 90, 0], [0, 0, 110], [86, 60, 80], [0, 3, 128], [60, 3, 128]], 200, 162);
  const P = proj(C), pr = (f) => (p) => P(...f(p));
  const draw = (el, s, f = id) => { el.s.setAttribute("d", poly(hull(s.pts.map(pr(f))))); el.c.setAttribute("d", s.cr ? poly(s.cr.map(pr(f))) : ""); };
  const g = mk("g", {}, svg);

  const base = part(g), hop = part(g), lid = part(g), drawer = part(g), axle = part(g), arm = part(g), knob = part(g);
  draw(base, box(0, 0, 60, 60, 5, 0, 30, 2)); draw(hop, box(6, 6, 54, 54, 4, 30, 70, 3));
  draw(axle, hcyl(30, 50, 3, 60, 66));
  const lidS = box(3, 3, 57, 57, 5, 70, 75, 3), drS = box(10, 40, 50, 64, 3, 5, 24, 2);
  const REST = 0.1, MID = [40, 40, 40];
  function render(v) {
    draw(lid, lidS, rotX(3, 75, 1.2 * v));
    draw(drawer, drS, sh(0, 24 * v, 0));
    const th = 0.6 + 3.2 * v, ey = 30 + 24 * Math.cos(th), ez = 50 + 24 * Math.sin(th), c = Math.cos(th), s = Math.sin(th);
    draw(arm, { pts: [[66, 30 - 3 * s, 50 + 3 * c], [70, 30 - 3 * s, 50 + 3 * c], [66, 30 + 3 * s, 50 - 3 * c], [70, 30 + 3 * s, 50 - 3 * c], [66, ey - 3 * s, ez + 3 * c], [70, ey - 3 * s, ez + 3 * c], [66, ey + 3 * s, ez - 3 * c], [70, ey + 3 * s, ez - 3 * c]], cr: null });
    draw(knob, hcyl(ey, ez, 4, 70, 84));
  }
  const mark = (a) => { lid.s.classList.toggle("hi", a < 0); drawer.s.classList.toggle("hi", a >= 0); };
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
    read.textContent = a < 0 ? "rest" : "crush";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 110 && Math.abs(sy - mid[1]) < 95 ? 1 : -1), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
}

hairline({
  name: "icecrusher",
  means: "An ice crusher: the hopper lid tips open, the side crank swings round and the drawer of crushed ice slides out.",
  rules: [1, 4, 5, 6],
  range: [0, 1, 1],
  tour: [[163, 122], [163, 160], [190, 180], null],
  mount,
});
