/**
 * Sofa bed: a sofa with its folded mattress lying on the seat, hinged at the seat front. The pointer unfolds the mattress forward into a bed; at rest it lifts a little, bright. The slider is how far it unfolds.
 *
 * The pattern: one hinged part swinging open (lid).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, rad,
} = HL;

const box = (x0, y0, x1, y1, r = 2) => rrect(x0, y0, x1, y1, r);
function XF(it, x, y, z, t) {
  const a = rad(it.ang * t);
  if (it.ax === "z") { const dx = x - it.hx, dy = y - it.hy; return [it.hx + dx * Math.cos(a) - dy * Math.sin(a), it.hy + dx * Math.sin(a) + dy * Math.cos(a), z]; }
  const dy = y - it.hy, dz = z - it.hz;
  return [x, it.hy + dy * Math.cos(a) - dz * Math.sin(a), it.hz + dy * Math.sin(a) + dz * Math.cos(a)];
}
const ITEMS = [
  { ring: box(0, -12, 96, 0, 3), inner: box(2, -10, 94, -2, 2), z0: 0, z1: 54 },
  { ring: box(0, 0, 10, 42, 3), inner: box(2, 2, 8, 40, 2), z0: 0, z1: 34 },
  { ring: box(10, 0, 86, 42, 2), inner: box(12, 2, 84, 40, 1), z0: 0, z1: 22 },
  { mov: 1, ring: box(12, 2, 84, 40, 3), z0: 22, z1: 29, ax: "x", hy: 40, hz: 29, ang: -180, face: [[[30, 2, 29], [30, 40, 29]], [[66, 2, 29], [66, 40, 29]]] },
  { ring: box(86, 0, 96, 42, 3), inner: box(88, 2, 94, 40, 2), z0: 0, z1: 34 },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 1.9);
  const ext = [];
  for (const it of ITEMS) for (const t of [0, 1]) for (const z of [it.z0, it.z1]) for (const q of it.ring) ext.push(it.mov ? XF(it, q.u, q.v, z, t) : [q.u, q.v, z]);
  fit(C, ext, 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const it of ITEMS) {
    if (!it.mov) { const s = solid(g); put(s, prism(P, front, it.ring, it.inner, it.z0, it.z1)); if (it.lines) mk("path", { class: "nf lo", d: it.lines.map((l) => open(l.map((w) => P(...w)))).join(" ") }, g); continue; }
    const grp = mk("g", {}, g);
    it.sil = mk("path", { class: "sil" }, grp);
    it.dt = mk("path", { class: "nf lo" }, grp);
    it.last = NaN;
  }
  const MOVS = ITEMS.filter((it) => it.mov);
  const tw = tween(0.12);
  function draw(t) {
    for (const it of MOVS) {
      const pts = it.ring.map((q) => P(...XF(it, q.u, q.v, it.z0, t))).concat(it.ring.map((q) => P(...XF(it, q.u, q.v, it.z1, t))));
      it.sil.setAttribute("d", poly(hull(pts)));
      it.dt.setAttribute("d", (it.face || []).map((f) => poly(f.map((w) => P(...XF(it, w[0], w[1], w[2], t))))).join(" "));
    }
  }
  let last = NaN;
  const B = register(stage, (_dt, now) => {
    const v = tval(tw, now);
    if (v !== last) { last = v; draw(v); }
    return !tdone(tw, now);
  });
  bag.add(B.unregister);

  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const it of ITEMS) for (const z of [it.z0, it.z1]) for (const q of it.ring) {
    const [sx, sy] = P(q.u, q.v, z); x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
  }
  const hit = ([sx, sy]) => (sx < x0 - 6 || sx > x1 + 6 || sy < y0 - 6 || sy > y1 + 6 ? -1 : 0);
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(tw, a < 0 ? 0.12 : amp, performance.now(), 0);
    MOVS.forEach((it, k) => it.sil.classList.toggle("hi", k === 0));
    read.textContent = a < 0 ? "rest" : "bed " + Math.round(100 * amp) + "%";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "sofabed",
  means: "A sofa bed whose folded mattress flips forward off the seat into a bed when the pointer comes over it.",
  rules: [1, 3, 4, 5],
  range: [30, 100, 100],
  tour: [[209, 165], [240, 150], [180, 185], null],
  mount,
});
