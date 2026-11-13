/**
 * Chicken coop: a house on four short legs under a gabled roof, a ramp down
 * from its door, and a nesting box along its side with a row of four hinged
 * hatches, an egg in each nest. The pointer picks a hatch by where it stands:
 * that hatch swings up to show its egg, and the hatches beside it lift a
 * little, staggered from it. At rest one hatch is propped open, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), hinged lids.
 */
const {
  Cam, circ, fillet, fit, facing, hull, open, poly, prism, proj, rad, rings, ringAt, run, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, W = 13, X0 = 6, HY = 50.5, HZ = 32, D = 14.5, OPEN = 66, FAV = 1, REST = [4, 40, 0, 9];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const rnd = (pts, r = 1.2) => poly(fillet(pts, pts.map(() => r), 3));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [60, 50, 0], [88, 32, 0], [-4, -4, 43], [-4, 54, 43], [-4, 25, 58], [64, 25, 58], [5, 66, 18], [59, 66, 18]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const Pv = (p) => P(p[0], p[1], p[2]);

  for (const [x, y] of [[3, 3], [57, 3], [3, 47], [57, 47]]) put(solid(g), prism(P, front, disc(x, y, 1.8, 16), null, 0, 11));
  const [br, bi] = rings(0, 0, 60, 50, 3, 1.5);
  put(solid(g), prism(P, front, br, bi, 10, 44));
  mk("path", { d: rnd([P(60, 20, 12.5), P(60, 32, 12.5), P(60, 32, 27), P(60, 20, 27)], 2), class: "nf lo" }, g);
  // the ramp: a plank from the door sill to the ground, with cleats
  const rp = [[60.5, 21, 12], [60.5, 31, 12], [88, 31, 0], [88, 21, 0]];
  const ramp = rp.map(Pv).concat(rp.map((p) => P(p[0], p[1], p[2] - 1.4)));
  mk("path", { d: rnd(hull(ramp), 0.8), class: "sil" }, g);
  let cleats = "";
  for (let i = 1; i < 6; i++) { const t = i / 6, x = 60.5 + 27.5 * t, z = 12 * (1 - t) + 0.3; cleats += seg(P(x, 22, z), P(x, 30, z)); }
  mk("path", { d: cleats, class: "nf lo" }, g);
  // the roof: eaves and a ridge, its gable end facing the ramp
  const roof = [[-4, -4, 43], [64, -4, 43], [64, 54, 43], [-4, 54, 43], [-4, 25, 58], [64, 25, 58]].map(Pv);
  mk("path", { d: rnd(hull(roof), 1.5), class: "sil" }, g);
  mk("path", { d: seg(roof[4], roof[5]) + seg(roof[1], roof[5]) + seg(roof[5], roof[2]), class: "nf lo" }, g);

  // the nesting box, its eggs, then its walls again in front of them
  const [nr, ni] = rings(X0 - 1, 50, X0 + N * W + 1, 64.5, 2, 1);
  const box = prism(P, front, nr, ni, 18, HZ);
  put(solid(g), box);
  const egg = [];
  for (let k = 0; k < N; k++) {
    const pts = [], x = X0 + k * W + W / 2 + (k % 2 ? 0.8 : -0.6);
    for (const [r, z] of [[2.6, 26], [3.3, 28], [3, 30], [1.6, 31.6]]) pts.push(...ringAt(P, disc(x, 57.5, r, 16), z));
    egg.push(mk("path", { d: poly(hull(pts)) }, g));
  }
  const fr = run(nr, front);
  mk("path", { d: poly(ringAt(P, fr, HZ).concat(ringAt(P, fr, 18).reverse())), class: "fo" }, g);
  mk("path", { d: box.sil, class: "nf sil" }, g);
  mk("path", { d: box.crease, class: "nf lo" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    items.push({ k, sil: mk("path", { class: "sil" }, grp), edge: mk("path", { class: "nf lo" }, grp), a: tween(REST[k]), last: NaN });
  }
  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const t = rad(deg), c = Math.cos(t), s = Math.sin(t), x0 = X0 + it.k * W + 0.7, x1 = x0 + W - 1.4;
    const q = (x, d, h) => P(x, HY + d * c - h * s, HZ + d * s + h * c);
    const pts = [q(x0, 0, 0), q(x1, 0, 0), q(x1, D, 0), q(x0, D, 0), q(x0, 0, 1.4), q(x1, 0, 1.4), q(x1, D, 1.4), q(x0, D, 1.4)];
    it.sil.setAttribute("d", rnd(hull(pts), 1));
    it.edge.setAttribute("d", open([q(x0 + 0.8, D, 1.4), q(x1 - 0.8, D, 1.4)]) + seg(q(x0 + 4, D - 0.2, 1.4), q(x1 - 4, D - 0.2, 1.4)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(X0 + it.k * W + W / 2, 57, HZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 13 && Math.abs(mids[best][1] - sy) < 30 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? OPEN : dd === 1 ? 14 : 0;
      tset(it.a, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "nest " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "chickencoop",
  means: "A chicken coop with a row of nest hatches: the hatch under the pointer swings up to show its egg, its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[140, 160], [197, 188], [178, 179], null],
  mount,
});
