/**
 * Baby incubator: a cabinet on a pillar stand, a mattress and pillow on its
 * tray and a clear hood over them with two round hand ports on its front.
 * The pointer opens the hood: it tips up and back on its rear hinge to show
 * the bed. At rest it sits a little open, bright. The slider is how far the
 * hood opens.
 *
 * The pattern: one hinged part swinging open (lid).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, rad,
} = HL;

const box = (x0, y0, x1, y1, r = 2) => rrect(x0, y0, x1, y1, r);
function XF(it, x, y, z, t) {
  const a = rad(it.ang * t), dy = y - it.hy, dz = z - it.hz;
  return [x, it.hy + dy * Math.cos(a) - dz * Math.sin(a), it.hz + dy * Math.sin(a) + dz * Math.cos(a)];
}
const port = (cx, cz, r) => { const o = []; for (let i = 0; i <= 16; i++) { const a = (i / 16) * Math.PI * 2; o.push([cx + r * Math.cos(a), 44 - (cz + r * Math.sin(a) - 56) * 0.18, cz + r * Math.sin(a)]); } return o; };
const ITEMS = [
  { ring: box(6, 6, 70, 42, 6), inner: box(8, 8, 68, 40, 5), z0: 0, z1: 6 },
  { ring: box(32, 18, 44, 30, 4), inner: box(33.5, 19.5, 42.5, 28.5, 3), z0: 6, z1: 40 },
  { ring: box(0, 0, 76, 48, 5), inner: box(2, 2, 74, 46, 4), z0: 40, z1: 56 },
  { ring: box(6, 6, 70, 42, 4), inner: box(8, 8, 68, 40, 3), z0: 56, z1: 60 },
  { ring: box(10, 12, 24, 36, 5), inner: box(12, 14, 22, 34, 4), z0: 60, z1: 64 },
  { mov: 1, hi: 1, ring: box(2, 2, 74, 44, 9), top: box(10, 8, 66, 38, 9), z0: 56, z1: 90, hy: 2, hz: 56, ang: 62,
    face: [port(24, 73, 7), port(52, 73, 7), [[12, 39, 84], [64, 39, 84]]] },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 2.0);
  const ext = [];
  for (const it of ITEMS) for (const t of [0, 1]) for (const z of [it.z0, it.z1]) for (const q of it.ring) ext.push(it.mov ? XF(it, q.u, q.v, z, t) : [q.u, q.v, z]);
  fit(C, ext, 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const it of ITEMS) {
    if (!it.mov) { put(solid(g), prism(P, front, it.ring, it.inner, it.z0, it.z1)); continue; }
    const grp = mk("g", {}, g);
    it.sil = mk("path", { class: "sil" }, grp);
    it.dt = mk("path", { class: "nf lo" }, grp);
  }
  const MOVS = ITEMS.filter((it) => it.mov);
  const tw = tween(0.2);
  function draw(t) {
    for (const it of MOVS) {
      const pts = it.ring.map((q) => P(...XF(it, q.u, q.v, it.z0, t))).concat((it.top || it.ring).map((q) => P(...XF(it, q.u, q.v, it.z1, t))));
      it.sil.setAttribute("d", poly(hull(pts)));
      it.dt.setAttribute("d", it.face.map((f) => open(f.map((w) => P(...XF(it, w[0], w[1], w[2], t))))).join(" "));
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
    tset(tw, a < 0 ? 0.2 : amp, performance.now(), 0);
    MOVS.forEach((it) => it.sil.classList.toggle("hi", !!it.hi));
    read.textContent = a < 0 ? "rest" : "hood " + Math.round(62 * amp) + "°";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "babyincubator",
  means: "An infant incubator whose clear hood, with two round hand ports, tips up and back on its hinge as the pointer comes over it.",
  rules: [1, 3, 4, 5],
  range: [30, 100, 100],
  tour: [[185, 110], [154, 182], [230, 160], null],
  mount,
});
