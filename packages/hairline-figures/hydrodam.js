/**
 * Hydro dam: a concrete wall across a basin, with four sluice gates on its
 * face. The pointer picks a gate by where it stands: the gate slides up its
 * slot to open the sluice, and the gates beside it crack open a little,
 * staggered from it. At rest one gate stands half raised, bright. The slider
 * is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 38, GW = 28, X0 = 10, WL = X0 * 2 + (N - 1) * STEP + GW, WY = 22, WZ = 54;
const GZ = 5, GH = 20, LIFT = 24, FAV = 2, REST = [2, 0, LIFT * 0.45, 4];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[-8, -8, 0], [WL + 8, WY + 44, 0], [WL + 8, -8, 0], [-8, WY + 44, 0], [0, 0, WZ + 4], [WL, 0, WZ + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // basin floor in front, then the wall with its walkway lip
  const [br, bi] = rings(-8, WY - 4, WL + 8, WY + 44, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 2));
  const [wr, wi] = rings(0, 0, WL, WY, 3, 1.4);
  put(solid(g), prism(P, front, wr, wi, 0, WZ));
  const [lr, li] = rings(-3, -2, WL + 3, 10, 2, 1);
  put(solid(g), prism(P, front, lr, li, WZ, WZ + 4));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = X0 + k * STEP, x1 = x0 + GW, grp = mk("g", {}, g);
    // the slot: guides on the face, from floor to walkway
    mk("path", { d: seg(P(x0 - 1.5, WY, 2), P(x0 - 1.5, WY, WZ - 4)) + seg(P(x1 + 1.5, WY, 2), P(x1 + 1.5, WY, WZ - 4)), class: "nf lo" }, grp);
    mk("path", { d: poly([P(x0, WY, GZ), P(x1, WY, GZ), P(x1, WY, GZ + GH), P(x0, WY, GZ + GH)]), class: "nf lo" }, grp);
    const s = solid(grp), jet = mk("path", { class: "lo" }, grp);
    items.push({ k, x0, x1, s, jet, z: tween(REST[k]), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const [r, i] = rings(it.x0, WY, it.x1, WY + 3, 1.2, 0.6);
    put(it.s, prism(P, front, r, i, GZ + lift, GZ + GH + lift));
    // the water: a sheet that shoots out under the raised gate and falls to the basin
    const a = [], b = [], reach = 1.6 * lift;
    for (let t = 0; t <= 1.001; t += 0.125) { const y = WY + reach * t, z = GZ + 0.3 - (GZ - 1.7) * t * t; a.push(P(it.x0 + 1, y, z)); b.unshift(P(it.x1 - 1, y, z)); }
    it.jet.setAttribute("d", lift < 0.6 ? "" : poly(a.concat(b)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, WY, GZ + GH));
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
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : dd === 1 ? 8 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "gate " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "hydrodam",
  means: "A dam wall with four sluice gates: the gate under the pointer slides up to open, and the gates beside it crack open a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[147, 137], [187, 157], [254, 190], null],
  mount,
});
