/**
 * Kalimba: a wooden board with a fan of metal tines, long in the middle and
 * shorter to each side. The pointer picks a tine by where it stands: it
 * springs up off the bridge and its neighbours rise a little, staggered.
 * At rest one tine is raised, bright. The slider is the stagger.
 */
const { Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const N = 7, STEP = 14, W = 8, BX = N * STEP + 16, BY = 90, BZ = 14, LIFT = 26, FAV = 2;
const LEN = [44, 54, 64, 72, 62, 52, 42];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[0, 0, 0], [BX, BY, 0], [BX, 0, 0], [0, BY, 0], [BX / 2, BY, BZ + LIFT + 8], [0, 0, BZ + LIFT + 8]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, BX, BY, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const [hr, hi] = rings(BX / 2 - 14, 10, BX / 2 + 14, 38, 14, 4);
  put(solid(g), prism(P, front, hr, hi, BZ, BZ + 0.6));
  const [gr, gi] = rings(6, BY - 22, BX - 6, BY - 16, 1, 1);
  put(solid(g), prism(P, front, gr, gi, BZ, BZ + 4));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 8 + k * STEP + (STEP - W) / 2, grp = mk("g", {}, g);
    items.push({ k, x, grp, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    it.grp.replaceChildren();
    const y1 = BY - 10, y0 = y1 - LEN[it.k], z = BZ + 4;
    const tilt = (y) => z + lift * (y1 - y) / LEN[it.k];
    const corners = [[it.x, y0], [it.x + W, y0], [it.x + W, y1], [it.x, y1]];
    const top = corners.map(([x, y]) => P(x, y, tilt(y) + 2.5)), bot = corners.map(([x, y]) => P(x, y, tilt(y)));
    const pts = top.concat(bot);
    const hullp = HL.hull(pts);
    const s = mk("path", { d: HL.poly(hullp), class: "sil" + (it.hi ? " hi" : "") }, it.grp);
    it.sil = s;
    mk("path", { d: HL.poly(top), class: "nf lo" }, it.grp);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + W / 2, BY - 10 - LEN[it.k] / 2, BZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 20 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 8 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.hi = k === (a < 0 ? FAV : a); it.last = NaN;
    });
    read.textContent = a < 0 ? "rest" : "tine " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "kalimba",
  means: "A kalimba's fan of tines: the tine under the pointer springs up off the bridge and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[192, 191], [135, 147], [290, 224], null],
  mount,
});
