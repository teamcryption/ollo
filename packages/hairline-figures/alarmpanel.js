/**
 * Alarm sirens: four beacons on a wall rail, each a squat base with a domed
 * lens. The pointer picks a beacon by where it stands: its lens rises out of
 * the base as it sounds, and its neighbours rise a little, staggered from it.
 * At rest one lens is up, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 38, BR = 13, LR = 9, LIFT = 20, FAV = 2, RZ = 5, BH = 7, LH = 8;
const X1 = (N - 1) * STEP + 2 * BR;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  const top = RZ + BH + LH + LIFT + LR;
  fit(C, [[-6, -6, 0], [X1 + 6, 2 * BR + 6, 0], [X1 + 6, -6, 0], [-6, 2 * BR + 6, 0], [BR, BR, top], [X1 - BR, BR, top]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-6, -6, X1 + 6, 2 * BR + 6, 6, 2);
  put(solid(g), prism(P, front, cr, ci, 0, RZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = BR + k * STEP, y = BR, grp = mk("g", {}, g);
    const lens = mk("path", { class: "sil" }, grp), band = mk("path", { class: "nf lo" }, grp);
    const base = solid(grp);
    put(base, prism(P, front, disc(x, y, BR), disc(x, y, BR - 2), RZ, RZ + BH));
    // a vent ring on the base top, with dots to number the beacon
    mk("path", { d: poly(ringAt(P, disc(x, y, LR + 1.5, 32), RZ + BH)), class: "nf lo" }, grp);
    items.push({ k, x, y, grp, lens, band, base, z: tween(k === FAV ? LIFT * 0.8 : 3), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = RZ + BH - 2, z1 = RZ + BH + LH + lift, pts = ringAt(P, disc(it.x, it.y, LR, 28), z0);
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(it.x, it.y, LR * Math.cos(t) + 0.01, 28), z1 + LR * 0.85 * Math.sin(t))); }
    it.lens.setAttribute("d", poly(hull(pts)));
    it.band.setAttribute("d", poly(ringAt(P, disc(it.x, it.y, LR, 28), z1 - LH * 0.45)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, RZ + BH));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.8 : 3) : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lens.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "siren " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "alarmpanel",
  means: "Four alarm beacons on a rail: the lens under the pointer rises out of its base to sound, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[119, 134], [281, 215], [227, 188], null],
  mount,
});
