/**
 * Spark plugs: five plugs standing in a bench rack, each a thread, a hex
 * collar, a ribbed insulator and a terminal tip. The plug under the pointer
 * lifts out of the rack, its neighbours rise a little, staggered from it.
 * At rest one plug stands half out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 22, RZ = 8, LIFT = 24, FAV = 3;
const REST = [2, 0, 4, 15, 1];
const X1 = (N - 1) * STEP + 20;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
// the plug, bottom to top: [radius, z0, z1]
const PARTS = [[2.6, 0, 7], [4.8, 7, 12], [3.4, 12, 15], [3, 15, 31], [1.4, 31, 36]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-2, -2, 0], [X1 + 2, 22, 0], [X1 + 2, -2, 0], [-2, 22, 0], [10, 10, RZ + 36 + LIFT], [X1 - 10, 10, RZ + 36 + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(-2, -2, X1 + 2, 22, 5, 2);
  put(solid(g), prism(P, front, rr, ri, 0, RZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 10 + k * STEP, y = 10, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, 3.6), disc(x, y, 2.8), RZ - 0.01, RZ));
    const parts = PARTS.map(() => solid(grp));
    items.push({ k, x, y, parts, z: tween(REST[k]), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    PARTS.forEach(([r, z0, z1], j) => {
      const b = Math.min(1, r * 0.35);
      put(it.parts[j], prism(P, front, disc(it.x, it.y, r), disc(it.x, it.y, r - b), RZ + lift + z0, RZ + lift + z1));
    });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, RZ + 18));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 18 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.parts.forEach((p) => p.sil.classList.toggle("hi", on));
    });
    read.textContent = a < 0 ? "rest" : "plug " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "sparkplugs",
  means: "Five spark plugs in a bench rack: the plug under the pointer lifts out, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[166, 132], [132, 115], [268, 183], null],
  mount,
});
