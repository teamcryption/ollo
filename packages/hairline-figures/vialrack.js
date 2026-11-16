/** Vial rack: four capped vials stand in a rack and tilt forward together on the rack's front lip. */
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
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[0, -4, 0], [90, 46, 0], [0, -4, 52], [90, 46, 52]], 200, 160);
  const P = proj(C), pr = (f) => (p) => P(...f(p)), id = (p) => p;
  const draw = (el, sh, f) => { el.s.setAttribute("d", poly(hull(sh.pts.map(pr(f))))); if (sh.cr) el.c.setAttribute("d", poly(sh.cr.map(pr(f)))); };
  const g = mk("g", {}, svg);
  draw(part(g), box(0, -4, 90, 0, 2, 0, 34, 0), id);
  draw(part(g), box(0, 0, 90, 30, 3, 0, 8, 2), id);
  const mov = [cyl(15, 15, 6, 4, 40, 1), cyl(35, 15, 6, 4, 40, 1), cyl(55, 15, 6, 4, 40, 1), cyl(75, 15, 6, 4, 40, 1), cyl(15, 15, 6.6, 40, 48, 1.5), cyl(35, 15, 6.6, 40, 48, 1.5), cyl(55, 15, 6.6, 40, 48, 1.5), cyl(75, 15, 6.6, 40, 48, 1.5)].map((sh) => ({ sh, el: part(g) }));

  const t = tween(0), REST = 0, WORD = "tilt"; let last = NaN;
  const F = (v) => rotX(22, 8, -v * 0.55);
  function render(v) { const f = F(v); for (const m of mov) draw(m.el, m.sh, f); }
  const mark = () => { mov[5].el.s.classList.add("hi"); };
  const mid = P(45, 15, 24), HW = 150, HH = 120;
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
  name: "vialrack",
  means: "A rack of four capped medicine vials: the vials tilt forward together on the rack's lip, one cap bright.",
  rules: [1, 4, 5, 6],
  range: [0, 1, 1],
  tour: [[228, 116], [158, 93], [264, 264], null],
  mount,
});
