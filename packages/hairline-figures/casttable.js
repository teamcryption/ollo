/** Exam stool: a round stool on a castered base spins and rises on its gas column. */
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
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-28, -28, 0], [28, 28, 0], [-28, -28, 70], [28, 28, 70]], 200, 160);
  const P = proj(C), pr = (f) => (p) => P(...f(p)), id = (p) => p;
  const draw = (el, sh, f) => { el.s.setAttribute("d", poly(hull(sh.pts.map(pr(f))))); if (sh.cr) el.c.setAttribute("d", poly(sh.cr.map(pr(f)))); };
  const g = mk("g", {}, svg);
  draw(part(g), cyl(0, 0, 22, 3, 6, 2), id);
  for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2 + 0.3; draw(part(g), cyl(19 * Math.cos(a), 19 * Math.sin(a), 2.6, 0, 3), id); }
  draw(part(g), cyl(0, 0, 3, 6, 28), id);
  const mov = [cyl(0, 0, 20, 30, 38, 3), box(-23, -10, -18, 10, 2, 36, 58, 0), box(12, -2, 26, 2, 1, 26, 29, 0)].map((sh) => ({ sh, el: part(g) }));

  const t = tween(0), REST = 0, WORD = "spin"; let last = NaN;
  const F = (v) => ((p) => shift(0, 0, v * 8)(rotZ(0, 0, v * 2.6)(p)));
  function render(v) { const f = F(v); for (const m of mov) draw(m.el, m.sh, f); }
  const mark = () => { mov[1].el.s.classList.add("hi"); };
  const mid = P(0, 0, 30), HW = 150, HH = 120;
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
  name: "casttable",
  means: "An exam stool on a castered base: the seat and its backrest spin round and rise on the gas column.",
  rules: [1, 4, 5, 6],
  range: [0, 1, 1],
  tour: [[153, 71], [149, 217], [247, 180], null],
  mount,
});
