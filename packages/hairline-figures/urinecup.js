/** Specimen pass box: a wall box with a door that swings open on its side hinge to show the specimen cup. */
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
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[4, 0, 0], [76, 0, 0], [4, 0, 80], [76, 0, 80], [4, 104, 14], [76, 104, 14], [4, 104, 76], [76, 104, 76]], 200, 160);
  const P = proj(C), pr = (f) => (p) => P(...f(p)), id = (p) => p;
  const draw = (el, sh, f) => { el.s.setAttribute("d", poly(hull(sh.pts.map(pr(f))))); if (sh.cr) el.c.setAttribute("d", poly(sh.cr.map(pr(f)))); };
  const g = mk("g", {}, svg);
  draw(part(g), box(4, 2, 76, 6, 2, 14, 78, 0), id);
  draw(part(g), box(10, 6, 70, 40, 3, 20, 70, 0), id);
  draw(part(g), cyl(40, 26, 8, 21, 40, 1.5), id);
  draw(part(g), cyl(40, 26, 8.6, 40, 44, 1.5), id);
  const mov = [box(10, 40, 70, 43, 2, 20, 70, 0), box(60, 43, 64, 47, 1, 38, 54, 0)].map((sh) => ({ sh, el: part(g) }));

  const t = tween(0), REST = 0, WORD = "open"; let last = NaN;
  const F = (v) => rotV(10, 43, v * 1.5);
  function render(v) { const f = F(v); for (const m of mov) draw(m.el, m.sh, f); }
  const mark = () => { mov[0].el.s.classList.add("hi"); };
  const mid = P(40, 30, 40), HW = 150, HH = 120;
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
  name: "urinecup",
  means: "A specimen pass box set in a wall: its door swings open on the side hinge to show the cup waiting inside.",
  rules: [1, 4, 5, 6],
  range: [0, 1, 1],
  tour: [[215, 127], [223, 40], [333, 218], null],
  mount,
});
