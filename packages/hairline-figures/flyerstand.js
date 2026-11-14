/**
 * Flyer rack: a counter rack of five pockets in a row, each holding a stack
 * of leaflets. The pointer picks a pocket by where it stands: its leaflet
 * slides up out of the pocket, and the leaflets beside it rise a little,
 * staggered from it. At rest the leaflets stand at uneven heights and one
 * is drawn up, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 30, W = 26, D = 14, PH = 16, LH = 30, LIFT = 32, FAV = 2, BZ = 5;
const REST = [4, 8, 14, 2, 6];
const X1 = (N - 1) * STEP + W;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-6, -6, 0], [X1 + 6, D + 6, 0], [X1 + 6, -6, 0], [-6, D + 6, 0], [0, 4, BZ + LH + LIFT + 4], [X1, 4, BZ + LH + LIFT + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -6, X1 + 6, D + 6, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    // back wall, then the leaflet, then the front lip that hides its foot
    const [r0, i0] = rings(x, 0, x + W, 2.4, 1, 0.6);
    put(solid(grp), prism(P, front, r0, i0, BZ, BZ + PH + 6));
    const leaf = solid(grp);
    leaf.sil.classList.add("sil");
    const [r1, i1] = rings(x, D - 2.4, x + W, D, 1, 0.6);
    const [s0, si0] = rings(x, 0, x + 2, D, 0.8, 0.5);
    put(solid(grp), prism(P, front, s0, si0, BZ, BZ + PH));
    const [s1, si1] = rings(x + W - 2, 0, x + W, D, 0.8, 0.5);
    put(solid(grp), prism(P, front, s1, si1, BZ, BZ + PH));
    put(solid(grp), prism(P, front, r1, i1, BZ, BZ + PH * 0.6));
    items.push({ k, x, leaf, z: tween(rest(k)), last: NaN });
  }
  function rest(k) { return k === FAV ? LIFT * 0.7 : REST[k]; }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const [r, i] = rings(it.x + 4, 4, it.x + W - 4, 6, 0.8, 0.5);
    put(it.leaf, prism(P, front, r, i, BZ + 1, BZ + LH * 0.55 + lift));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + W / 2, D / 2, BZ + PH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 28 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? rest(k) : dd === 0 ? LIFT : dd === 1 ? 8 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.leaf.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "slot " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "flyerstand",
  means: "A counter rack of five leaflet pockets: the leaflet under the pointer slides up out of its slot, its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[115, 157], [242, 221], [285, 242], null],
  mount,
});
