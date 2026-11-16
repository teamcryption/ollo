/**
 * Capsule toy: a gacha machine, a square base with a chute and a crank, a
 * glass globe full of two-part capsules on a collar. The pointer over the
 * machine turns the crank: the capsules churn round inside the globe and one
 * rolls out into the chute. At rest the crank handle is bright. The slider
 * is how far the capsules turn.
 *
 * The pattern: one thing that turns (a tween), its contents re-sorted by
 * depth every frame into fixed slots.
 */
const {
  Cam, circ, fillet, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BH = 34, GZ = 58, GR = 24, CR = 6.2;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const SEEDS = [];
for (let k = 0; k < 5; k++) SEEDS.push({ r: 13, a: k * 72 + 10, z: 46, w: 1 });
for (let k = 0; k < 4; k++) SEEDS.push({ r: 11, a: k * 90 + 50, z: 59, w: -0.8 });
SEEDS.push({ r: 3, a: 0, z: 70, w: 0.5 });

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let turn = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-26, -26, 0], [26, 36, 0], [26, -26, 0], [-26, 36, 0], [0, 0, GZ + GR + 7]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-24, -24, 24, 24, 8, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BH));
  const chute = fillet([[-9, 5], [9, 5], [9, 18], [-9, 18]], [2, 2, 5, 5], 4).map(([x, z]) => P(x, 24, z));
  mk("path", { class: "nf lo", d: poly(chute) }, g);
  const dialPts = circ(7.5, 28).map((q) => P(24, q.u, 22 + q.v));
  mk("path", { class: "nf lo", d: poly(dialPts) }, g);
  const bar = mk("path", { class: "nf" }, g);
  put(solid(g), prism(P, front, disc(0, 0, 19), disc(0, 0, 17.4), BH, BH + 5));
  // the globe: a sphere above the collar, glass, so the capsules show
  const lat = [];
  for (let z = BH + 5; z <= GZ + GR; z += 2) { const rr = Math.sqrt(Math.max(0, GR * GR - (z - GZ) ** 2)); if (rr > 0.5) lat.push(...ringAt(P, disc(0, 0, rr, 36), z)); }
  lat.push(P(0, 0, GZ + GR));
  mk("path", { class: "sil nf", d: poly(hull(lat)) }, g);
  const slots = SEEDS.map(() => ({ s: mk("path", { class: "nf" }, g), m: mk("path", { class: "nf lo" }, g) }));
  put(solid(g), prism(P, front, disc(0, 0, 6), disc(0, 0, 4.6), GZ + GR - 1.5, GZ + GR + 4));
  const out = { s: mk("path", { class: "nf" }, g), m: mk("path", { class: "nf lo" }, g) };

  function capsule(el, x, y, z) {
    const pts = [];
    for (const dz of [-CR, -CR * 0.7, 0, CR * 0.7, CR]) { const rr = Math.sqrt(Math.max(0, CR * CR - dz * dz)); pts.push(...ringAt(P, disc(x, y, Math.max(rr, 0.3), 20), z + dz)); }
    el.s.setAttribute("d", poly(hull(pts)));
    el.m.setAttribute("d", open(ringAt(P, run(disc(x, y, CR, 24), front), z)));
  }
  const rot = tween(0), crank = tween(0), roll = tween(0);
  let last = "";
  function draw(a, c, o) {
    const key = a.toFixed(3) + c.toFixed(3) + o.toFixed(4);
    if (key === last) return;
    last = key;
    const cs = SEEDS.map((q) => { const t = ((q.a + a * q.w) * Math.PI) / 180; return [q.r * Math.cos(t), q.r * Math.sin(t), q.z]; });
    cs.sort((p, q) => 0.612 * (p[0] + p[1]) + 0.5 * p[2] - (0.612 * (q[0] + q[1]) + 0.5 * q[2]));
    cs.forEach((p, i) => capsule(slots[i], ...p));
    const t = (c * Math.PI) / 180, ct = Math.cos(t), st = Math.sin(t);
    const shape = fillet([[-11, -2.4], [11, -2.4], [11, 2.4], [-11, 2.4]], [2.2, 2.2, 2.2, 2.2], 3);
    bar.setAttribute("d", poly(shape.map(([u, v]) => P(24.6, u * ct - v * st, 22 + u * st + v * ct))));
    if (o < 0.02) { out.s.setAttribute("d", ""); out.m.setAttribute("d", ""); }
    if (o >= 0.02) capsule(out, 0, 22 + 12 * o, CR + 0.2);
  }
  const B = register(stage, (_dt, now) => {
    draw(tval(rot, now), tval(crank, now), tval(roll, now));
    return !tdone(rot, now) || !tdone(crank, now) || !tdone(roll, now);
  });
  bag.add(B.unregister);

  const gc = P(0, 0, GZ);
  function hit([sx, sy]) {
    if (Math.hypot(sx - gc[0], sy - gc[1]) < GR * C.S * 1.05) return 1;
    for (const z of [0, BH]) { const [x, y] = unproj(C, sx, sy, z); if (Math.abs(x) < 28 && Math.abs(y) < 28) return 1; }
    return -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    tset(rot, a < 0 ? 0 : turn, now, 0);
    tset(crank, a < 0 ? 0 : 300, now, 0);
    tset(roll, a < 0 ? 0 : 1, now, a < 0 ? 0 : 200);
    bar.classList.toggle("hi", a < 0);
    out.s.classList.toggle("hi", a >= 0);
    read.textContent = a < 0 ? "rest" : "turn";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { turn = v; if (act >= 0) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "capsuletoy",
  means: "A gacha capsule machine: the pointer turns its crank, the capsules churn in the globe and one rolls out the chute.",
  rules: [1, 4, 5, 6],
  range: [50, 110, 160],
  tour: [[208, 112], [249, 207], [168, 232], null],
  mount,
});
