/**
 * Catamaran: two slim hulls joined by beams and a trampoline, one mast in
 * the middle. The pointer's x swings the boom and mainsail round the mast;
 * the sail is the bright mark. The slider is how far the boom may swing.
 */
const { Cam, fit, proj, rrect, hull, poly, clamp, spring, stepS, disposer, mk, pointer, register } = HL;

const box = (x0, y0, z0, x1, y1, z1, r = 1.5) => {
  const ring = rrect(x0, y0, x1, y1, Math.min(r, (x1 - x0) / 2.2, (y1 - y0) / 2.2), 6);
  return ring.map((q) => [q.u, q.v, z0]).concat(ring.map((q) => [q.u, q.v, z1]));
};
const MX = 8, REST = 0.3;
const swing = (pts, a) => pts.map((p) => {
  const dx = p[0] - MX, dy = p[1], c = Math.cos(a), s = Math.sin(a);
  return [MX + dx * c - dy * s, dx * s + dy * c, p[2]];
});
const sail = () => [[MX, -0.8, 18], [MX, 0.8, 18], [MX, 0, 118], [MX - 8, 0, 100], [MX - 50, -0.8, 20], [MX - 50, 0.8, 20]];
const boom = () => box(MX - 54, -1.6, 14, MX + 2, 1.6, 18, 1.2);
const ITEMS = [
  { cls: "sil", f: () => box(-64, 18, 0, 62, 30, 12, 6) },
  { cls: "sil", f: () => box(-40, -26, 10, -34, 26, 14, 1) },
  { cls: "sil", f: () => box(26, -26, 10, 32, 26, 14, 1) },
  { cls: "lo", f: () => box(-36, -22, 11, 28, 22, 12, 1) },
  { cls: "sil", f: () => box(-64, -30, 0, 62, -18, 12, 6) },
  { cls: "sil", f: () => box(MX - 2, -2, 12, MX + 2, 2, 122, 1) },
  { cls: "sil", f: (a) => swing(boom(), a) },
  { cls: "sil hi", f: (a) => swing(sail(), a) },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.25);
  const all = [];
  for (const it of ITEMS) for (const a of [-1.4, 0, 1.4]) all.push(...it.f(a));
  fit(C, all, 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const els = ITEMS.map((it) => ({ it, el: mk("path", { class: it.cls }, g) }));
  const ang = spring(REST, { k: 70, c: 14 });
  let last = NaN, on = false;
  function draw() {
    if (ang.x === last) return;
    last = ang.x;
    for (const e of els) e.el.setAttribute("d", poly(hull(e.it.f(ang.x).map((p) => P(p[0], p[1], p[2])))));
    read.textContent = on ? "boom " + Math.round((ang.t * 180) / Math.PI) + "°" : "rest";
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();
  const aim = (u) => { on = true; last = NaN; ang.t = clamp(u, -1, 1) * 1.4 * amp; B.wake(); };
  let lastU = REST / 1.4;
  bag.add(pointer(stage, {
    move: (p) => { lastU = (p[0] - 200) / 130; aim(lastU); },
    leave: () => { on = false; last = NaN; ang.t = REST; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (on) aim(lastU); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "catamaran",
  means: "A catamaran on twin hulls with a trampoline between: the pointer swings the boom and mainsail round the mast.",
  rules: [1, 3, 4, 5],
  range: [0.3, 0.8, 1],
  tour: [[135, 169], [214, 18], [68, 201], null],
  mount,
});
