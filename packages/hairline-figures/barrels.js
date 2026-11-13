/**
 * Barrels: six oil drums lying in a pyramid, three, two and one, on a pallet,
 * each a hooped can with a bung in its end. The pointer picks a drum by where
 * it rests: that drum slides forward out of the stack toward the reader, and
 * the drums it touches shift a little, staggered from it. At rest the top
 * drum stands proud, bright. The slider is the stagger.
 *
 * The pattern: one of many at different heights (riffle, stepped): the hit
 * reads each drum's rest centre, never the pose on screen.
 */
const {
  Cam, facing, fit, hull, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 12, LD = 30, DECK = 9, SLIDE = 20, NB = 5, FAV = 5, X0 = 3;
const H3 = R * Math.sqrt(3);
// the stack, as [x, z] of each axis: the bottom row, the middle, the top
const AX = [[X0 + R, DECK + R], [X0 + 3 * R, DECK + R], [X0 + 5 * R, DECK + R],
  [X0 + 2 * R, DECK + R + H3], [X0 + 4 * R, DECK + R + H3], [X0 + 3 * R, DECK + R + 2 * H3]];
const REST = [1.5, -1, 3, 2.5, 0, 11];
const PX0 = -2, PX1 = X0 + 6 * R + 5, PY0 = -4, PY1 = LD + 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  const top = DECK + R + 2 * H3 + R;
  fit(C, [[PX0, PY0, 0], [PX1, PY1, 0], [PX1, PY0, 0], [PX0, PY1 + SLIDE - 6, 0], [X0 + 3 * R, 0, top], [X0 + 3 * R, LD + SLIDE, top], [X0 + R - R, LD + SLIDE, DECK + R]], 200, 166);
  const P = proj(C), front = facing(C);
  // the view direction, for the half of each hoop that faces the reader
  const vx = Math.sin(C.az) * Math.sqrt(1 - C.k * C.k), vz = C.k, phi = Math.atan2(vz, vx);
  const g = mk("g", {}, svg);

  // the pallet: three runners along x, far to near, then the deck and its board seams
  for (const [a, b] of [[PY0, PY0 + 6], [(PY0 + PY1) / 2 - 3, (PY0 + PY1) / 2 + 3], [PY1 - 6, PY1]]) {
    const [r, i] = rings(PX0 + 1, a, PX1 - 1, b, 1.2, 0.6);
    put(solid(g), prism(P, front, r, i, 0, DECK - 3));
  }
  const [dr, di] = rings(PX0, PY0, PX1, PY1, 2, 1.2);
  put(solid(g), prism(P, front, dr, di, DECK - 3, DECK));
  let seams = "";
  for (let k = 1; k < 4; k++) { const y = PY0 + ((PY1 - PY0) * k) / 4; seams += open([P(PX0 + 2.5, y, DECK), P(PX1 - 2.5, y, DECK)]); }
  mk("path", { class: "nf lo", d: seams }, g);

  // the drums, painted far to near: their axes all run along y, so depth is x and z alone
  const drums = AX.map(([x, z], k) => ({ k, x, z, o: tween(REST[k]), last: NaN }));
  const order = drums.slice().sort((a, b) => (0.61 * a.x + 0.5 * a.z) - (0.61 * b.x + 0.5 * b.z));
  for (const d of order) {
    d.grp = mk("g", {}, g);
    d.body = mk("path", { class: "sil" }, d.grp);
    d.marks = mk("path", { class: "nf lo" }, d.grp);
  }

  const around = (x, y, z, r, n, t0 = 0, t1 = Math.PI * 2, closed = true) =>
    Array.from({ length: n + (closed ? 0 : 1) }, (_, i) => { const t = t0 + ((t1 - t0) * i) / n; return P(x + r * Math.cos(t), y, z + r * Math.sin(t)); });

  /** The run of a closed ring off the hull, with the hull point at each end: the edge of the end not already on the silhouette. */
  function inside(ring, sil) {
    const n = ring.length, on = ring.map((p) => sil.some((q) => Math.abs(q[0] - p[0]) + Math.abs(q[1] - p[1]) < 1e-6));
    const s = on.findIndex((v, i) => v && !on[(i + 1) % n]);
    if (s < 0) return ring;
    const out = [ring[s]];
    for (let i = 1; i <= n; i++) { const j = (s + i) % n; out.push(ring[j]); if (on[j]) break; }
    return out;
  }

  /** A drum slid o along its axis: its body, then its end, two bungs and the two hoops' near halves. */
  function draw(d, o) {
    if (o === d.last) return;
    d.last = o;
    const y0 = o, y1 = o + LD, end = around(d.x, y1, d.z, R, 48), sil = hull(around(d.x, y0, d.z, R, 48).concat(end));
    d.body.setAttribute("d", poly(sil));
    let m = open(inside(end, sil));
    m += poly(around(d.x + 0.62 * R * Math.cos(1.05), y1, d.z + 0.62 * R * Math.sin(1.05), 2, 12));
    m += poly(around(d.x + 0.62 * R * Math.cos(2.4), y1, d.z + 0.62 * R * Math.sin(2.4), 1.1, 10));
    for (const f of [1 / 3, 2 / 3]) m += open(around(d.x, y0 + LD * f, d.z, R + 0.3, 16, phi - Math.PI / 2, phi + Math.PI / 2, false));
    d.marks.setAttribute("d", m);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const d of drums) { draw(d, tval(d.o, now)); if (!tdone(d.o, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // the hit: each drum's rest centre on screen, the nearest within reach
  const mids = drums.map((d) => P(d.x, LD * 0.55, d.z));
  const reach = R * C.S * 1.25;
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < reach ? best : -1;
  }
  const apart = (a, b) => Math.round(Math.hypot(drums[a].x - drums[b].x, drums[a].z - drums[b].z) / (2 * R));

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    drums.forEach((d, k) => {
      const n = a < 0 ? -1 : apart(k, a);
      const o = a < 0 ? REST[k] : n === 0 ? SLIDE : n === 1 ? NB + REST[k] * 0.4 : REST[k] * 0.3;
      tset(d.o, o, now, from < 0 ? 0 : apart(k, from) * stag);
      d.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "drum " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "barrels",
  means: "Six oil drums stacked on a pallet: the one under the pointer slides out toward you, and the drums it touches shift a little.",
  rules: [1, 2, 5, 9],
  range: [0, 45, 90],
  tour: [[193, 128], [213, 179], [229, 210], null],
  mount,
});
