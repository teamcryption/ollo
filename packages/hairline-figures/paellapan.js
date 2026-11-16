/** Paella burner: a wide paella pan on a gas ring; the pan tilts up off the burner to show the flame ring. */
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
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, 0, 0], [100, 100, 0], [0, 0, 70], [100, 100, 30], [0, 100, 0], [100, 0, 70]], 200, 162);
  const P = proj(C), pr = (f) => (p) => P(...f(p));
  const draw = (el, s, f = id) => { el.s.setAttribute("d", poly(hull(s.pts.map(pr(f))))); el.c.setAttribute("d", s.cr ? poly(s.cr.map(pr(f))) : ""); };
  const g = mk("g", {}, svg);

  const legs = [0, 1, 2].map(() => part(g)), ring = part(g), pan = part(g), hl = part(g), hr = part(g);
  [[50, 22], [26, 72], [76, 74]].forEach(([x, y], k) => draw(legs[k], cyl(x, y, 2.4, 0, 15, 0)));
  draw(ring, cyl(50, 50, 28, 12, 17, 7));
  const panS = cyl(50, 50, 44, 19, 25, 3), hL = box(0, 46, 8, 54, 2, 21, 24, 1), hR = box(92, 46, 100, 54, 2, 21, 24, 1);
  const REST = 0.12, MID = [50, 50, 20];
  function render(v) { const f = rotX(94, 19, -0.6 * v); draw(pan, panS, f); draw(hl, hL, f); draw(hr, hR, f); }
  const mark = (a) => { pan.s.classList.toggle("hi", a < 0); ring.s.classList.toggle("hi", a >= 0); };
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
    read.textContent = a < 0 ? "rest" : "ring";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 110 && Math.abs(sy - mid[1]) < 95 ? 1 : -1), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
}

hairline({
  name: "paellapan",
  means: "A paella burner: the wide pan tilts up off its gas ring on the near edge and shows the flame ring under it.",
  rules: [1, 4, 5, 6],
  range: [0, 1, 1],
  tour: [[200, 185], [150, 165], [250, 200], null],
  mount,
});
