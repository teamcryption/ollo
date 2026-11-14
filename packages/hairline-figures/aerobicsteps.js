/**
 * Aerobic steps: a class row of step platforms, each a long deck on two
 * riser blocks. The pointer picks a step by where it stands: its deck
 * rises to the high setting, and the steps beside it rise a little,
 * staggered from it. At rest one step stands high, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 34, DW = 22, DL = 70, DT = 4, RZ = 6, LIFT = 12, FAV = 1;
const X1 = (N - 1) * STEP + DW;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, 0, 0], [X1, DL, 0], [X1, 0, 0], [0, DL, 0], [0, 0, RZ + LIFT + DT], [X1, DL, RZ + LIFT + DT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    const parts = [solid(grp), solid(grp), solid(grp)];
    items.push({ k, x, parts, z: tween(k === FAV ? LIFT : 0), last: NaN });
  }
  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const x = it.x, h = RZ + lift;
    [[6, 18], [DL - 18, DL - 6]].forEach(([y0, y1], i) => {
      const [r, ri] = rings(x + 2, y0, x + DW - 2, y1, 2, 1);
      put(it.parts[i], prism(P, front, r, ri, 0, h));
    });
    const [dr, di] = rings(x, 0, x + DW, DL, 5, 1.6);
    put(it.parts[2], prism(P, front, dr, di, h, h + DT));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + DW / 2, DL / 2, RZ + DT));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 50 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.parts[2].sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "step " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "aerobicsteps",
  means: "A row of aerobic step platforms: the step under the pointer rises to its high setting, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 140], [210, 170], [250, 190], null],
  mount,
});
