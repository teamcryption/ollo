/**
 * Hanging files: a row of suspension folders in an open drawer, each with a
 * tab at a different place along its top. The pointer picks a folder by
 * where it stands: it lifts out of the drawer, its neighbours rise a little,
 * staggered from it. At rest one folder stands half out, bright.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 7, STEP = 10, X0 = 8, Y1 = 44, H = 26, FZ = 4, FH = 26, LIFT = 18, FAV = 4;
const X1 = X0 * 2 + (N - 1) * STEP;
const REST = [1, 0, 2, 0, LIFT * 0.6, 1, 0];
const TABS = [5, 17, 29, 11, 23, 33, 7];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.65);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [X0, 4, FZ + FH + LIFT + 5], [X1 - X0, Y1 - 4, FZ + FH + LIFT + 5]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, X1, Y1, 3, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, H));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g);
    const body = solid(grp), tab = solid(grp);
    const [fr, fi] = rings(x - 0.9, 3, x + 0.9, Y1 - 3, 0.8, 0.4);
    const [tr, ti] = rings(x - 0.7, TABS[k], x + 0.7, TABS[k] + 9, 0.6, 0.3);
    items.push({ k, x, body, tab, fr, fi, tr, ti, z: tween(REST[k]), last: NaN });
  }
  // the drawer's near walls cover the folders' lower halves
  const [wr, wi] = rings(0, Y1 - 2.4, X1, Y1, 1.2, 0.6);
  put(solid(g), prism(P, front, wr, wi, 0, H));
  const [xr, xi] = rings(X1 - 2.4, 0, X1, Y1, 1.2, 0.6);
  put(solid(g), prism(P, front, xr, xi, 0, H));
  const [pr, pi] = rings(X1 - 0.5, Y1 / 2 - 7, X1 + 3, Y1 / 2 + 7, 1.5, 0.6);
  put(solid(g), prism(P, front, pr, pi, H - 9, H - 5));

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = FZ + lift, z1 = z0 + FH;
    put(it.body, prism(P, front, it.fr, it.fi, z0, z1));
    put(it.tab, prism(P, front, it.tr, it.ti, z1 - 0.5, z1 + 4));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y1 / 2, FZ + FH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 16 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.body.sil.classList.toggle("hi", on);
      it.tab.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "file " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "hangingfiles",
  means: "Suspension folders in an open drawer: the folder under the pointer lifts out by its tab, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[163, 167], [219, 196], [256, 214], null],
  mount,
});
