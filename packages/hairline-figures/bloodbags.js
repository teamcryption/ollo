/**
 * Blood bank: five flat bags standing in a fridge drawer, each with a short
 * tube at its top. The pointer picks a bag by where it stands: it lifts out of
 * the drawer, and the bags beside it rise a little, staggered from it. At
 * rest one bag is drawn half out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 14, BW = 9, BH = 30, LIFT = 22, FAV = 3, DZ = 4, Y0 = 4, Y1 = 34;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.8);
  const X1 = N * STEP + 6;
  fit(C, [[0, 0, 0], [X1, Y1 + 4, 0], [X1, 0, 0], [0, Y1 + 4, 0], [10, 6, DZ + BH + LIFT + 8], [X1, Y1, DZ + BH + LIFT + 8]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dR, dI] = rings(0, 0, X1, Y1 + 4, 4, 1.6);
  put(solid(g), prism(P, front, dR, dI, 0, DZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = 5 + k * STEP, grp = mk("g", {}, g), s = solid(grp), tube = mk("path", { class: "nf lo" }, grp);
    const [r, i] = rings(x0, Y0, x0 + BW, Y1, 3, 1.2);
    const rest = k === FAV ? LIFT * 0.6 : [2, 0, 4, 0, 1][k];
    items.push({ k, x0, r, i, s, tube, z: tween(rest), rest, last: NaN });
  }
  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = DZ + lift, z1 = z0 + BH, xm = it.x0 + BW / 2, ym = (Y0 + Y1) / 2;
    put(it.s, prism(P, front, it.r, it.i, z0, z1));
    it.tube.setAttribute("d", seg(P(xm, ym, z1), P(xm, ym, z1 + 6)) + seg(P(xm, ym - 6, z1), P(xm, ym - 6, z1 + 3)));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + BW / 2, (Y0 + Y1) / 2, DZ + BH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 20 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? it.rest : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
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
  name: "bloodbags",
  means: "Five blood bags in a fridge drawer: the bag under the pointer lifts out, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[170, 175], [204, 193], [232, 205], null],
  mount,
});
