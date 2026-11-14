/**
 * Shoe boxes: four lidded boxes in a row on a shop floor, each a little
 * different in height. The pointer picks a box by where it stands: its lid
 * lifts straight off, and the lids beside it rise a touch, staggered from
 * it. At rest one lid sits ajar, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 40, W = 30, D = 50, LH = 6, LIFT = 26, FAV = 2;
const HS = [18, 22, 16, 20];
const X1 = (N - 1) * STEP + W;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-4, -4, 0], [X1 + 4, D + 4, 0], [X1 + 4, -4, 0], [-4, D + 4, 0], [0, 0, 22 + LH + LIFT], [X1, 0, 22 + LH + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, h = HS[k], grp = mk("g", {}, g);
    const [br, bi] = rings(x0, 0, x0 + W, D, 1.5, 1.2);
    put(solid(grp), prism(P, front, br, bi, 0, h));
    const lid = solid(grp);
    const [lr, li] = rings(x0 - 1.2, -1.2, x0 + W + 1.2, D + 1.2, 1.8, 1.2);
    items.push({ k, x: x0 + W / 2, h, lid, lr, li, z: tween(k === FAV ? 7 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = it.h - 3 + lift;
    put(it.lid, prism(P, front, it.lr, it.li, z0, z0 + LH));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, D / 2, it.h));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? 7 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "box " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "shoeboxes",
  means: "Four shoe boxes in a row: the lid of the box under the pointer lifts off, and the lids beside it rise a touch.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 150], [240, 190], [290, 215], null],
  mount,
});
