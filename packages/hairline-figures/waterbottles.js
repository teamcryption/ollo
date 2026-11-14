/**
 * Gym bottles: five water bottles of different sizes standing on a gym
 * shelf, each with a shoulder, a neck and a cap. The pointer picks a bottle
 * by where it stands: it lifts off the shelf, and the bottles beside it rise
 * a little, staggered from it. At rest one bottle is raised, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 28, SZ = 6, LIFT = 26, FAV = 3, D = 30;
const RAD = [10, 8, 11.5, 9, 10.5], HB = [44, 56, 36, 50, 40];
const X1 = (N - 1) * STEP + 2 * 14, Y = D / 2;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-4, -4, 0], [X1 + 4, D + 4, 0], [X1 + 4, -4, 0], [-4, D + 4, 0], [14, Y, SZ + 64 + LIFT], [X1 - 14, Y, SZ + 64]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-4, -4, X1 + 4, D + 4, 4, 1.6);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 14 + k * STEP, s = solid(mk("g", {}, g));
    items.push({ k, x, s, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const r = RAD[it.k], h = HB[it.k], z0 = SZ + 0.4 + lift, x = it.x;
    const prof = [[r, 0], [r, h * 0.72], [r * 0.92, h * 0.8], [r * 0.58, h * 0.9], [r * 0.58, h], [r * 0.66, h], [r * 0.66, h + 8]];
    const pts = [];
    for (const [rr, zz] of prof) pts.push(...ringAt(P, disc(x, Y, rr), z0 + zz));
    it.s.sil.setAttribute("d", poly(hull(pts)));
    const cr = (rr, zz) => open(ringAt(P, run(disc(x, Y, rr), front), z0 + zz));
    it.s.cr.setAttribute("d", cr(r - 0.6, h * 0.72) + " " + cr(r * 0.66 - 0.4, h) + " " + cr(r - 0.6, h * 0.18));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y, SZ + HB[it.k] / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bottle " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "waterbottles",
  means: "Five gym bottles stand on a shelf: the bottle under the pointer lifts off, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[125, 148], [162, 166], [275, 223], null],
  mount,
});
