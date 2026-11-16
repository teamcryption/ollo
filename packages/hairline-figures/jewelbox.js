/** Jewelry box: the lid swings open on its back hinge and the ballerina rises out, turning. */
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
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[0, 0, 0], [70, 46, 0], [0, 0, 70], [70, 46, 70]], 200, 166);
  const P = proj(C), pr = (f) => (p) => P(...f(p)), id = (p) => p;
  const draw = (el, sh, f) => { el.s.setAttribute("d", poly(hull(sh.pts.map(pr(f))))); if (sh.cr) el.c.setAttribute("d", poly(sh.cr.map(pr(f)))); };
  const back = P(35, 0, 0)[1] < P(35, 46, 0)[1] ? 0 : 46, sgn = back ? 1 : -1;
  const g = mk("g", {}, svg), lid = part(g), body = part(g), dancer = mk("g", {}, g);
  draw(body, box(0, 0, 70, 46, 6, 0, 24, 3), id);
  const post = part(dancer), tutu = part(dancer), torso = part(dancer), head = part(dancer), arms = mk("path", { class: "nf" }, dancer);
  const lidSh = box(0, 0, 70, 46, 6, 24, 31);
  const t = tween(0), REST = 0.2; let last = NaN;
  function render(v) {
    const a = -sgn * v * 1.9;
    draw(lid, lidSh, rotX(back, 24, a));
    if (a * -sgn > 1.0) g.insertBefore(lid.g, body.g); else g.append(lid.g);
    const h = 26 * v, up = shift(0, 0, h), sp = v * Math.PI * 1.5;
    draw(post, cyl(35, 23, 1.2, 22, 18 + h, 0), id);
    draw(tutu, cyl(35, 23, 9, 17 + h, 19.5 + h, 0), id);
    draw(torso, cyl(35, 23, 2.4, 19.5 + h, 30 + h, 0), id);
    draw(head, cyl(35, 23, 2.8, 31 + h, 36 + h, 0), id);
    arms.setAttribute("d", open([P(35 + 8 * Math.cos(sp), 23 + 8 * Math.sin(sp), 31 + h), P(35, 23, 28 + h), P(35 - 8 * Math.cos(sp), 23 - 8 * Math.sin(sp), 31 + h)]));
  }
  const mark = (a) => { lid.s.classList.toggle("hi", a < 0); tutu.s.classList.toggle("hi", a >= 0); };
  const mid = P(35, 23, 20), HW = 120, HH = 100;
  const B = register(stage, (_dt, now) => { const v = tval(t, now); if (v !== last) { last = v; render(v); } return !tdone(t, now); });
  bag.add(B.unregister);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a < 0 ? REST : 1, performance.now(), 0);
    mark(a);
    read.textContent = a < 0 ? "rest" : "open";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < HW && Math.abs(sy - mid[1]) < HH ? 1 : -1), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
}

hairline({
  name: "jewelbox",
  means: "A jewelry box: the lid swings back on its hinge and the little ballerina rises from inside, turning her arms.",
  rules: [1, 4, 5, 6],
  range: [0, 1, 1],
  tour: [[200, 192], [132, 215], [268, 283], null],
  mount,
});
