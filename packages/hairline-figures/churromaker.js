/** Churro press: a barrel press on a tray; the plunger pushes down and the press tips as a churro is piped out. */
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
  fit(C, [[-4, 0, 0], [96, 80, 0], [20, 20, 130], [60, 60, 130], [96, 0, 0]], 200, 162);
  const P = proj(C), pr = (f) => (p) => P(...f(p));
  const draw = (el, s, f = id) => { el.s.setAttribute("d", poly(hull(s.pts.map(pr(f))))); el.c.setAttribute("d", s.cr ? poly(s.cr.map(pr(f))) : ""); };
  const g = mk("g", {}, svg);

  const tray = part(g), churro = part(g), nozzle = part(g), barrel = part(g), gl = part(g), gr = part(g), rod = part(g), bar = part(g);
  draw(tray, box(-4, 12, 96, 72, 6, 0, 4, 2));
  const nzS = cyl(40, 40, 6, 12, 22, 2), brS = cyl(40, 40, 13, 22, 84, 3), gL = box(14, 37, 27, 43, 2, 74, 78, 0.6), gR = box(53, 37, 66, 43, 2, 74, 78, 0.6);
  const REST = 0.1, MID = [40, 40, 100];
  function render(v) {
    const f = rotX(40, 12, 0.22 * v), d = 34 * v;
    draw(churro, box(42, 36, 62 + 30 * v, 44, 4, 4, 10, 1.2));
    draw(nozzle, nzS, f); draw(barrel, brS, f); draw(gl, gL, f); draw(gr, gR, f);
    draw(rod, cyl(40, 40, 2.2, 84, 124 - d, 0), f); draw(bar, box(24, 36, 56, 44, 3, 124 - d, 130 - d, 1), f);
  }
  const mark = (a) => { bar.s.classList.toggle("hi", a < 0); churro.s.classList.toggle("hi", a >= 0); };
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
    read.textContent = a < 0 ? "rest" : "press";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 110 && Math.abs(sy - mid[1]) < 95 ? 1 : -1), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
}

hairline({
  name: "churromaker",
  means: "A churro press on a tray: the T handle pushes the plunger down, the barrel tips and a long churro is piped out.",
  rules: [1, 4, 5, 6],
  range: [0, 1, 1],
  tour: [[135, 30], [135, 80], [150, 130], null],
  mount,
});
