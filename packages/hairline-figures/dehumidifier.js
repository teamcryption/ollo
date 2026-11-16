/**
 * Dehumidifier: an upright unit with a grille on top and a water tank in its lower front. The pointer over it slides the tank out towards the viewer; at rest the tank sits a little proud, bright.
 *
 * The pattern: one part sliding out from a body (drawer).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, rad,
} = HL;

const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const box = (x0, y0, x1, y1, r = 2) => rrect(x0, y0, x1, y1, r);
const FAV = 0;
function XF(it, x, y, z, t) { return [x, y + 40 * t, z]; }
const ITEMS = [
  { ring: box(0, 0, 50, 36, 5), inner: box(2, 2, 48, 34, 4), z0: 0, z1: 76 },
  { ring: box(8, 6, 42, 30, 3), inner: box(10, 8, 40, 28, 2), z0: 76, z1: 79 },
  { mov: 1, ring: box(3, 10, 47, 38, 3), det: box(9, 16, 41, 34, 2), z0: 4, z1: 36, rest: 0.12, mid: [25, 24] },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 2.5);
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
    read.textContent = a < 0 ? "rest" : "tank " + Math.round(40 * amp);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "dehumidifier",
  means: "A dehumidifier whose water tank slides out of its lower front when the pointer comes over it, ready to be emptied.",
  rules: [1, 2, 3, 4],
  range: [30, 100, 100],
  tour: [[225, 174], [223, 196], [240, 250], null],
  mount,
});
