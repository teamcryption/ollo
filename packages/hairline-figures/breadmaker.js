/**
 * Bread maker: a boxy machine with a window in its hinged lid and a loaf pan inside. The pointer over it swings the lid up and back to show the pan; at rest the lid is shut, bright.
 *
 * The pattern: one hinged part tilting open (lid).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, rad,
} = HL;

const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const box = (x0, y0, x1, y1, r = 2) => rrect(x0, y0, x1, y1, r);
const FAV = 0;
function XF(it, x, y, z, t) {
  const a = rad(it.ang * t), dy = y - it.hy, dz = z - it.hz;
  return [x, it.hy + dy * Math.cos(a) - dz * Math.sin(a), it.hz + dy * Math.sin(a) + dz * Math.cos(a)];
}
const ITEMS = [
  { ring: box(0, 0, 70, 50, 6), inner: box(2, 2, 68, 48, 5), z0: 0, z1: 40 },
  { ring: box(14, 10, 56, 40, 3), inner: box(16, 12, 54, 38, 2), z0: 40, z1: 48 },
  { mov: 1, ring: box(0, 0, 70, 50, 6), det: box(14, 10, 56, 40, 4), z0: 40, z1: 52, hy: 0, hz: 46, ang: -100, rest: 0.0, mid: [35, 25] },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 2.3);
  const ext = [];
  for (const it of ITEMS) for (const t of [0, 1]) for (const z of [it.z0, it.z1]) for (const q of it.ring) ext.push(it.mov ? XF(it, q.u, q.v, z, t) : [q.u, q.v, z]);
  fit(C, ext, 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const it of ITEMS) {
    if (!it.mov) { put(solid(g), prism(P, front, it.ring, it.inner, it.z0, it.z1)); continue; }
    const grp = mk("g", {}, g);
    it.sil = mk("path", { class: "sil" }, grp);
    it.top = mk("path", { class: "nf lo" }, grp);
    if (it.det) it.dt = mk("path", { class: "nf lo" }, grp);
    it.tw = tween(it.rest); it.last = NaN;
  }
  const MOVS = ITEMS.filter((it) => it.mov);
  const pt = (it, q, z, t) => P(...XF(it, q.u, q.v, z, t));
  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const pts = it.ring.map((q) => pt(it, q, it.z0, t)).concat(it.ring.map((q) => pt(it, q, it.z1, t)));
    it.sil.setAttribute("d", poly(hull(pts)));
    it.top.setAttribute("d", poly(it.ring.map((q) => pt(it, q, it.z1, t))));
    if (it.dt) it.dt.setAttribute("d", poly(it.det.map((q) => pt(it, q, it.z1, t))));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of MOVS) { draw(it, tval(it.tw, now) * (it.full ? 1 : 1)); if (!tdone(it.tw, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // hit: the rest pose's screen box, and each mover's rest centre for picking by screen x
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const it of ITEMS) for (const z of [it.z0, it.z1]) for (const q of it.ring) {
    const [sx, sy] = P(q.u, q.v, z); x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
  }
  const mids = MOVS.map((it) => { const [a, b] = it.mid; return P(a, b, (it.z0 + it.z1) / 2)[0]; });
  function hit([sx, sy]) {
    if (sx < x0 - 6 || sx > x1 + 6 || sy < y0 - 6 || sy > y1 + 6) return -1;
    let best = 0, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m - sx); if (d < bd) { bd = d; best = k; } });
    return 0;
  }
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now();
    act = a;
    MOVS.forEach((it, k) => {
      const to = a < 0 ? it.rest : 1;
      tset(it.tw, Math.min(1, to * (a < 0 ? 1 : amp)), now, a < 0 ? 0 : Math.abs(k - Math.max(0, a)) * 0);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : FAV));
    });
    read.textContent = a < 0 ? "rest" : "open " + Math.round(100 * amp) + "°";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "breadmaker",
  means: "A bread maker whose windowed lid swings up on its back hinge when the pointer comes over it, showing the loaf pan inside.",
  rules: [1, 2, 3, 4],
  range: [30, 100, 100],
  tour: [[186, 117], [170, 168], [202, 236], null],
  mount,
});
