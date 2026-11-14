/**
 * Wave buoys: four point-absorber floats in a row on a sea platform, each
 * riding a tall spar. At rest they sit at uneven heights like a passing
 * swell, one bright. The pointer picks a buoy by where it stands: its float
 * rides high up the spar, and the floats beside it rise a little, staggered
 * from it. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 42, FR = 13, FH = 9, SR = 2.2, TOP = 58, LIFT = 26, BZ = 4, FAV = 2;
const REST = [6, 12, 3, 9];
const X1 = (N - 1) * STEP + 2 * FR;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-8, -8, 0], [X1 + 8, 2 * FR + 8, 0], [X1 + 8, -8, 0], [-8, 2 * FR + 8, 0], [FR, FR, TOP + 4], [X1 - FR, FR, TOP + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-8, -8, X1 + 8, 2 * FR + 8, 8, 2);
  put(solid(g), prism(P, front, pr, pi, 0, BZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = FR + k * STEP, y = FR, grp = mk("g", {}, g);
    // the spar, standing through the float, and its foot on the platform
    put(solid(grp), prism(P, front, disc(x, y, 5, 24), disc(x, y, 3.6, 24), BZ, BZ + 2));
    put(solid(grp), prism(P, front, disc(x, y, SR, 16), disc(x, y, SR - 0.8, 16), BZ + 2, TOP));
    const fl = solid(grp), stub = solid(grp);
    fl.sil.classList.add("sil");
    put(solid(grp), prism(P, front, disc(x, y, 3.4, 16), disc(x, y, 2.4, 16), TOP, TOP + 2.4));
    items.push({ k, x, y, fl, stub, z: tween(REST[k] + (k === FAV ? 8 : 0)), last: NaN });
  }

  function draw(it, z) {
    if (z === it.last) return;
    it.last = z;
    const z0 = BZ + 2 + z, z1 = z0 + FH;
    put(it.fl, prism(P, front, disc(it.x, it.y, FR, 40), disc(it.x, it.y, FR - 2, 40), z0, z1));
    put(it.stub, prism(P, front, disc(it.x, it.y, SR, 16), disc(it.x, it.y, SR - 0.8, 16), z1, TOP));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, TOP / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a);
      const z = a < 0 ? REST[k] + (k === FAV ? 8 : 0) : dd === 0 ? LIFT : dd === 1 ? REST[k] + 6 : REST[k];
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.fl.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "buoy " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tidal",
  means: "Four wave buoys on spars: the float under the pointer rides high up its spar, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[122, 116], [226, 152], [278, 194], null],
  mount,
});
