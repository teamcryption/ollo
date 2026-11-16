/**
 * Raclette grill: a hot plate on a back stand over a base, four small pans
 * with long handles tucked in a row beneath. The pointer picks a pan by
 * where it stands: that pan slides out toward the viewer, its neighbours
 * ease out a little, staggered from it. At rest one pan is half out,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, PW = 12, PL = 34, X1 = N * STEP + 4, Y1 = 46, OUT = 30, FAV = 2;
const box = (P, front, x0, y0, x1, y1, z0, z1, r = 2, b = 1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); return prism(P, front, o, i, z0, z1); };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -4, 0], [X1, Y1 + OUT + 16, 0], [X1, -4, 0], [-4, Y1 + OUT + 16, 0], [-4, -4, 28], [X1, Y1, 28]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), box(P, front, -4, -4, X1, Y1, 0, 5, 4, 1.5));
  put(solid(g), box(P, front, -2, -2, X1 - 2, 6, 5, 20, 2, 1));
  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), x = 2 + STEP / 2 + k * STEP;
    items.push({ k, x, grp, pan: solid(grp), handle: solid(grp), y: tween(k === FAV ? OUT * 0.55 : 6), last: NaN });
  }
  put(solid(g), box(P, front, -4, -4, X1, Y1, 20, 26, 4, 2));

  function draw(it, off) {
    if (off === it.last) return;
    it.last = off;
    const y0 = 8 + off;
    put(it.pan, box(P, front, it.x - PW, y0, it.x + PW, y0 + PL - 14, 7, 11, 2.5, 1.5));
    put(it.handle, box(P, front, it.x - 2, y0 + PL - 14, it.x + 2, y0 + PL + 6, 9, 10.5, 1, 0.4));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.y, now)); if (!tdone(it.y, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y1, 10));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), y = a < 0 ? (k === FAV ? OUT * 0.55 : 6) : d === 0 ? OUT : d === 1 ? 12 : 6;
      tset(it.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.pan.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pan " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "raclette",
  means: "A raclette grill: the pan under the pointer slides out from beneath the hot plate, and its neighbours ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[135, 137], [200, 170], [265, 203], null],
  mount,
});
