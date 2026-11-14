/**
 * Sewing box: an open box with a row of thread spools standing in its tray.
 * The pointer picks a spool by where it stands: it lifts out of the tray,
 * and the spools beside it lift a little, staggered from it. At rest one
 * spool stands raised, bright, and the others sit at uneven heights. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 16, BH = 14, SH = 8, FL = 1.6, LIFT = 16, FAV = 2;
const REST = [0, 2.5, 9, 1, 4];
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.9);
  const X = (N - 1) * STEP + 26;
  fit(C, [[0, 0, 0], [X, 36, 0], [X, 0, 0], [0, 36, 0], [13, 18, BH + SH + LIFT + 2], [X - 13, 18, BH + SH + LIFT + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, X, 36, 4, 2.2);
  put(solid(g), prism(P, front, br, bi, 0, BH));
  const items = [];
  for (let k = 0; k < N; k++) items.push({ k, x: 13 + k * STEP, body: solid(g), cap: solid(g), z: tween(REST[k]), last: NaN });

  function draw(now) {
    for (const it of items) {
      const h = tval(it.z, now);
      if (h === it.last) continue;
      it.last = h;
      const top = BH + SH + h;
      put(it.body, prism(P, front, disc(it.x, 18, 4.2), disc(it.x, 18, 2.4), BH, top - FL));
      put(it.cap, prism(P, front, disc(it.x, 18, 5.8), disc(it.x, 18, 1.4), top - FL, top));
    }
  }

  const B = register(stage, (_dt, now) => { draw(now); return items.some((it) => !tdone(it.z, now)); });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 18, BH + SH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : dd === 1 ? 5 : 1;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
      it.cap.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "spool " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tailorsdummy",
  means: "An open sewing box with a row of thread spools: the spool under the pointer lifts out of the tray, and its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[233, 174], [134, 124], [266, 190], null],
  mount,
});
