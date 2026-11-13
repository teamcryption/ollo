/**
 * Cloches: four domed covers on plates along a counter, each dome with a
 * knob, each plate holding a dish under it. The pointer picks a cloche by
 * where it stands: its dome lifts off the plate to show the dish, and the
 * domes beside it lift a little, staggered from it. At rest one dome is
 * raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 40, DR = 15, PR = 18, LIFT = 22, FAV = 1, CZ = 4;
const X1 = (N - 1) * STEP + 2 * PR;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[-6, -6, 0], [X1 + 6, 2 * PR + 6, 0], [X1 + 6, -6, 0], [-6, 2 * PR + 6, 0], [PR, PR, CZ + DR + LIFT + 6], [X1 - PR, PR, CZ + DR + LIFT + 6]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-6, -6, X1 + 6, 2 * PR + 6, 6, 2);
  put(solid(g), prism(P, front, cr, ci, 0, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = PR + k * STEP, y = PR, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, PR), disc(x, y, PR - 3), CZ, CZ + 1.6));
    // the dish: a low mound on the plate
    const mound = [];
    for (const [r, z] of [[9, 0], [7.5, 2.5], [5, 4.5], [2, 5.5]]) mound.push(...ringAt(P, disc(x + 1, y, r, 20), CZ + 1.6 + z));
    mk("path", { d: poly(hull(mound)), class: "nf" }, grp);
    const dome = mk("path", { class: "sil" }, grp), rim = mk("path", { class: "nf lo" }, grp), knob = mk("path", { class: "nf" }, grp);
    items.push({ k, x, y, grp, dome, rim, knob, z: tween(k === FAV ? LIFT * 0.75 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const base = CZ + 1.8 + lift, pts = [];
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(it.x, it.y, DR * Math.cos(t), 28), base + DR * 0.9 * Math.sin(t))); }
    it.dome.setAttribute("d", poly(hull(pts)));
    it.rim.setAttribute("d", poly(ringAt(P, disc(it.x, it.y, DR, 40), base + 1.2)));
    const top = base + DR * 0.9;
    it.knob.setAttribute("d", poly(hull(ringAt(P, disc(it.x, it.y, 2.2, 16), top).concat(ringAt(P, disc(it.x, it.y, 2.2, 16), top + 3)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, CZ + DR / 2));
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
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.75 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.dome.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "plate " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cloches",
  means: "Four domed covers on a counter: the dome under the pointer lifts to show the dish, and its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[122, 135], [226, 187], [278, 213], null],
  mount,
});
