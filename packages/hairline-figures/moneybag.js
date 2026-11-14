/**
 * Cash bags: three sealed sacks on a courier's tray, each a round belly cinched
 * at the neck under a tuft. The pointer picks a bag by where it stands: it tips
 * over toward the viewer on its foot, and its neighbours lean a little,
 * staggered from it. At rest the middle bag leans, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row, tipping (tilt).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rad, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 34, BR = 14, TZ = 4, TIP = 48, FAV = 1;
const PROF = [[9, 0], [13.5, 5], [15, 11], [14, 16], [10, 21], [4, 25], [3.4, 27], [6, 31], [7, 34]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.7);
  const Y = BR + 4, X1 = (N - 1) * STEP + 2 * Y;
  fit(C, [[-2, -2, 0], [X1 + 2, 2 * Y + 2, 0], [X1 + 2, -2, 0], [-2, 2 * Y + 2, 0], [Y, Y, TZ + 36], [X1 - Y, Y + 30, TZ + 20]], 200, 168);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const [tr, ti] = rings(-2, -2, X1 + 2, 2 * Y + 2, 5, 1.8);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = Y + k * STEP, grp = mk("g", {}, g);
    const body = mk("path", { class: "sil" }, grp), tie = mk("path", { class: "nf lo" }, grp), tuft = mk("path", { class: "lo" }, grp);
    items.push({ k, x, body, tie, tuft, a: tween(k === FAV ? 14 : 0), last: NaN });
  }
  // a ring of the bag at height h, tipped by a toward +y about its foot's near edge
  function ring(it, r, h, a) {
    const c = Math.cos(a), s = Math.sin(a), py = Y + 9;
    return circ(r, 24).map((q) => { const yy = Y + q.v - py; return P(it.x + q.u, py + yy * c + h * s, TZ + h * c - yy * s); });
  }
  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const a = rad(deg), pts = [];
    PROF.slice(0, 6).forEach(([r, h]) => pts.push(...ring(it, r, h, a)));
    it.body.setAttribute("d", poly(hull(pts)));
    it.tie.setAttribute("d", poly(ring(it, 3.6, 26, a)));
    it.tuft.setAttribute("d", poly(hull(ring(it, 3.4, 27, a).concat(ring(it, 7, 34, a)))));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, Math.round(tval(it.a, now) * 10) / 10); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y, TZ + 14));
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
      const dd = Math.abs(k - a), to = a < 0 ? (k === FAV ? 14 : 0) : dd === 0 ? TIP : dd === 1 ? 8 : 0;
      tset(it.a, to, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
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
  name: "moneybag",
  means: "Three sealed cash bags on a tray: the bag under the pointer tips forward on its foot, its neighbours lean a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[135, 121], [200, 154], [265, 186], null],
  mount,
});
