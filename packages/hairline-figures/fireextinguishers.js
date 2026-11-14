/**
 * Fire extinguishers: four extinguishers of different sizes standing on a
 * low ledge against a wall, each with its hook plate on the wall, a valve
 * lever and a hose down its side. The pointer picks one by where it stands:
 * it lifts off the ledge, ready to grab, and its neighbours rise a little,
 * staggered from it. At rest one is half lifted, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 32, R = 10, LIFT = 16, FAV = 2, CZ = 3, HS = [40, 48, 36, 30], WH = 82;
const X1 = (N - 1) * STEP + 2 * R + 8;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-4, -6, 0], [X1, 2 * R + 6, 0], [X1, -6, WH], [-4, -6, WH], [-4, 2 * R + 6, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the wall, a thin slab behind the row
  const [wr, wi] = rings(-4, -6, X1, -2, 1.5, 0.8);
  put(solid(g), prism(P, front, wr, wi, 0, WH));
  // the ledge they stand on
  const [lr, li] = rings(-4, -2, X1, 2 * R + 6, 4, 1.6);
  put(solid(g), prism(P, front, lr, li, 0, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 4 + R + k * STEP, y = R + 2, H = HS[k], grp = mk("g", {}, g);
    // the hook plate on the wall, above where the handle sits
    const hz = CZ + H + 10;
    const [pr, pi] = rings(x - 4, -2.6, x + 4, -2, 1.2, 0.2);
    put(solid(grp), prism(P, front, pr, pi, hz - 6, hz + 4));
    const body = mk("path", { class: "sil" }, grp), crease = mk("path", { class: "nf lo" }, grp);
    const neck = mk("path", {}, grp), lever = mk("path", { class: "nf" }, grp), hose = mk("path", { class: "nf" }, grp);
    items.push({ k, x, y, H, body, crease, neck, lever, hose, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const { x, y, H } = it, z0 = CZ + lift, z1 = z0 + H, pts = [];
    pts.push(...ringAt(P, disc(x, y, R), z0));
    for (let i = 0; i <= 5; i++) { const t = (i / 5) * (Math.PI / 2); pts.push(...ringAt(P, disc(x, y, R * Math.cos(t) + 0.01), z1 + R * 0.55 * Math.sin(t))); }
    it.body.setAttribute("d", poly(hull(pts)));
    it.crease.setAttribute("d", open(ringAt(P, run(disc(x, y, R - 1.2), front), z1)) + open(ringAt(P, run(disc(x, y, R - 0.6), front), z0 + 5)));
    const nz = z1 + R * 0.55;
    it.neck.setAttribute("d", poly(hull(ringAt(P, disc(x, y, 3, 16), nz - 1).concat(ringAt(P, disc(x, y, 3, 16), nz + 5)))));
    it.lever.setAttribute("d", open([P(x, y, nz + 6), P(x + 11, y, nz + 8)]) + open([P(x + 1, y, nz + 3), P(x + 10, y, nz + 3.5)]));
    it.hose.setAttribute("d", open([P(x + 2, y + 2.5, nz + 2), P(x + 6, y + 8, nz), P(x + 6, y + R + 1, z1 - 6), P(x + 4, y + R + 1, z0 + H * 0.35)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, CZ + it.H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 28 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 3 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "ext " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "fireextinguishers",
  means: "Four extinguishers on a ledge by a wall: the one under the pointer lifts off, ready to grab, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[139, 171], [185, 131], [261, 232], null],
  mount,
});
