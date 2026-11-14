/**
 * Water cooler: three coolers in a row, each a rounded cabinet with two taps
 * and a drip tray, a water bottle standing upside down on top. The pointer
 * picks a cooler by where it stands: its bottle lifts off to be changed, and
 * the bottles beside it rock up a little, staggered from it. At rest one
 * bottle is raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, W = 26, STEP = 40, H = 46, BR = 11, LIFT = 24, FAV = 2;
const X1 = (N - 1) * STEP + W;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-4, -4, 0], [X1 + 4, W + 8, 0], [X1 + 4, -4, 0], [-4, W + 8, 0], [W / 2, W / 2, H + 40 + LIFT], [X1 - W / 2, W / 2, H + 40 + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, cx = x0 + W / 2, cy = W / 2, grp = mk("g", {}, g);
    const [r0, i0] = rings(x0, 0, x0 + W, W, 4, 1.6);
    put(solid(grp), prism(P, front, r0, i0, 0, H));
    // drip tray and two taps on the front (+y) face
    const [tr, ti] = rings(x0 + 5, W, x0 + W - 5, W + 5, 1.5, 0.8);
    put(solid(grp), prism(P, front, tr, ti, 16, 18));
    for (const tx of [x0 + 8, x0 + W - 8]) {
      const [a, b] = rings(tx - 2, W, tx + 2, W + 4, 1, 0.5);
      put(solid(grp), prism(P, front, a, b, 28, 31.5));
    }
    // the collar the bottle sits in
    put(solid(grp), prism(P, front, disc(cx, cy, 7), disc(cx, cy, 5.5), H, H + 2));
    const bottle = mk("path", { class: "sil" }, grp), band = mk("path", { class: "nf lo" }, grp);
    items.push({ k, cx, cy, bottle, band, z: tween(k === FAV ? LIFT * 0.7 : k === 1 ? 4 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const b = H + 2 + lift, pts = [];
    pts.push(...ringAt(P, disc(it.cx, it.cy, 3.5, 16), b), ...ringAt(P, disc(it.cx, it.cy, 3.5, 16), b + 5));
    for (let i = 0; i <= 4; i++) { const t = (i / 4) * (Math.PI / 2); pts.push(...ringAt(P, disc(it.cx, it.cy, 3.5 + (BR - 3.5) * Math.sin(t)), b + 5 + 6 * (1 - Math.cos(t)))); }
    for (let i = 0; i <= 4; i++) { const t = (i / 4) * (Math.PI / 2); pts.push(...ringAt(P, disc(it.cx, it.cy, BR - 3 + 3 * Math.cos(t)), b + 30 + 3 * Math.sin(t))); }
    it.bottle.setAttribute("d", poly(hull(pts)));
    it.band.setAttribute("d", poly(ringAt(P, disc(it.cx, it.cy, BR), b + 21)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.cx, it.cy, H / 2 + 10));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : k === 1 ? 4 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.bottle.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "cooler " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "watercooler",
  means: "Three water coolers in a row: the bottle on the cooler under the pointer lifts off, and its neighbour's rocks up a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[148, 168], [203, 195], [258, 223], null],
  mount,
});
