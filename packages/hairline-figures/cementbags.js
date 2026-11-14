/**
 * Cement bags: two layers of bags on a site pallet. The pointer picks a bag
 * in the top layer by where it stands: that bag is hoisted off the stack, and
 * the bags beside it shift up a little, staggered from it. At rest one bag is
 * half-lifted, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, BW = 24, GAP = 2, STEP = BW + GAP, BD = 40, BH = 9, PH = 6, LIFT = 26, FAV = 2;
const X1 = N * STEP - GAP;
const REST = [1.5, 0, LIFT * 0.6, 3];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-4, -4, 0], [X1 + 4, BD + 4, 0], [X1 + 4, -4, 0], [-4, BD + 4, 0], [0, 0, PH + 2 * BH + LIFT], [X1, BD, PH + 2 * BH + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the pallet: a deck on three runners
  for (const y of [-2, BD / 2 - 3, BD - 4]) {
    const [r, i] = rings(-2, y, X1 + 2, y + 6, 1.2, 0.8);
    put(solid(g), prism(P, front, r, i, 0, PH - 2));
  }
  const [dr, di] = rings(-4, -4, X1 + 4, BD + 4, 2, 1.2);
  put(solid(g), prism(P, front, dr, di, PH - 2, PH));

  // bottom layer: laid crosswise, two long bags
  for (let j = 0; j < 2; j++) {
    const y0 = j * (BD / 2 + 1) - 1, y1 = y0 + BD / 2 - 1;
    const [r, i] = rings(0, y0, X1, y1, 6, 2);
    put(solid(g), prism(P, front, r, i, PH, PH + BH));
  }

  // top layer: the bags that lift
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g), s = solid(grp);
    const [r, i] = rings(x, 0, x + BW, BD, 6, 2);
    const [vr, vi] = rings(x + 4, BD - 7, x + BW - 4, BD - 4, 1.2, 0.5);
    const valve = solid(grp);
    items.push({ k, x, s, r, i, vr, vi, valve, z: tween(REST[k]), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = PH + BH + lift;
    put(it.s, prism(P, front, it.r, it.i, z0, z0 + BH));
    put(it.valve, prism(P, front, it.vr, it.vi, z0 + BH, z0 + BH + 0.8));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + BW / 2, BD / 2, PH + BH * 1.5));
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
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bag " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cementbags",
  means: "Cement bags stacked on a pallet: the top bag under the pointer is hoisted off, and the bags beside it shift up a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[122, 119], [218, 148], [273, 194], null],
  mount,
});
