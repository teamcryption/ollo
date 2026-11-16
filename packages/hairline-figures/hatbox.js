/** Hat box: a round box whose lid tips back on its hinge as the hat inside rises. */
const { Cam, circ, fit, hull, poly, open, proj, rrect, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;
const R3 = (ring, z) => ring.map((q) => [q.u, q.v, z]);
const box = (x0, y0, x1, y1, r, z0, z1, b = 2) => { const a = rrect(x0, y0, x1, y1, r, 4); return { pts: R3(a, z0).concat(R3(a, z1)), cr: R3(rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(r - b, 0.5), 4), z1 - 0.5) }; };
const disc = (cx, cy, R, n = 36) => circ(R, n).map((q) => ({ u: q.u + cx, v: q.v + cy }));
const cyl = (cx, cy, R, z0, z1, b = 2) => ({ pts: R3(disc(cx, cy, R), z0).concat(R3(disc(cx, cy, R), z1)), cr: b ? R3(disc(cx, cy, R - b), z1 - 0.5) : null });
const part = (parent) => { const g = mk("g", {}, parent); return { g, s: mk("path", { class: "sil" }, g), c: mk("path", { class: "nf lo" }, g) }; };
const rotX = (yh, zh, a) => ([x, y, z]) => [x, yh + (y - yh) * Math.cos(a) - (z - zh) * Math.sin(a), zh + (y - yh) * Math.sin(a) + (z - zh) * Math.cos(a)];
const shift = (dx, dy, dz) => ([x, y, z]) => [x + dx, y + dy, z + dz];

function mount({ stage, svg, read }) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.42);
  fit(C, [[0, 0, 0], [80, 80, 0], [0, 0, 104], [80, 80, 104]], 200, 166);
  const P = proj(C), pr = (f) => (p) => P(...f(p)), id = (p) => p;
  const draw = (el, sh, f) => { el.s.setAttribute("d", poly(hull(sh.pts.map(pr(f))))); if (sh.cr) el.c.setAttribute("d", poly(sh.cr.map(pr(f)))); };
  const back = P(40, 0, 0)[1] < P(40, 80, 0)[1] ? 4 : 76, sgn = back > 40 ? 1 : -1;
  const g = mk("g", {}, svg), lid = part(g), body = part(g), brim = part(g), crown = part(g);
  draw(body, cyl(40, 40, 34, 0, 38, 3), id);
  const lidSh = cyl(40, 40, 36, 38, 48, 3);
  const t = tween(0), REST = 0.18; let last = NaN;
  function render(v) {
    const a = -sgn * v * 1.5;
    draw(lid, lidSh, rotX(back, 38, a));
    if (a * -sgn > 0.9) g.insertBefore(lid.g, body.g); else g.append(lid.g);
    const h = 20 * v;
    draw(brim, cyl(40, 40, 29, 30 + h, 32 + h, 0), id);
    draw(crown, cyl(40, 40, 15, 32 + h, 47 + h, 2), id);
  }
  const mark = (a) => { lid.s.classList.toggle("hi", a < 0); crown.s.classList.toggle("hi", a >= 0); };
  const mid = P(40, 40, 24), HW = 120, HH = 100;
  const B = register(stage, (_dt, now) => { const v = tval(t, now); if (v !== last) { last = v; render(v); } return !tdone(t, now); });
  bag.add(B.unregister);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a < 0 ? REST : 1, performance.now(), 0);
    mark(a);
    read.textContent = a < 0 ? "rest" : "hat";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < HW && Math.abs(sy - mid[1]) < HH ? 1 : -1), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
}

hairline({
  name: "hatbox",
  means: "A round hat box: its lid tips back on the hinge and the hat inside rises up to be taken out.",
  rules: [1, 4, 5, 6],
  range: [0, 1, 1],
  tour: [[200, 212], [132, 241], [268, 309], null],
  mount,
});
