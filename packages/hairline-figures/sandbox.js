/**
 * Sandbox: a low timber frame full of sand, three upturned buckets standing
 * in a row on it. The pointer picks a bucket by where it stands: it lifts off
 * to show the sand castle it moulded, and the buckets beside it lift a
 * little, staggered from it. At rest one bucket is raised, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, hull, poly, prism, proj, facing, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 46, BR = 15, TR = 10, BH = 20, LIFT = 24, FAV = 2, FZ = 8, SZ = 6;
const X0 = -10, X1 = (N - 1) * STEP + 2 * BR + 10, Y0 = -12, Y1 = 2 * BR + 12;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[X0, Y0, 0], [X1, Y1, 0], [X1, Y0, 0], [X0, Y1, 0], [BR, BR, SZ + BH + LIFT + 4], [X1 - BR, BR, SZ + BH + LIFT + 4]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(X0, Y0, X1, Y1, 5, 2);
  put(solid(g), prism(P, front, fr, fi, 0, FZ));
  // the sand inside the frame, a little below its top edge
  const [sr] = rings(X0 + 5, Y0 + 5, X1 - 5, Y1 - 5, 3, 1);
  mk("path", { d: poly(ringAt(P, sr, SZ)), class: "lo" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = BR + k * STEP, y = BR, grp = mk("g", {}, g);
    // the moulded castle: a squat cone of sand with a flat top
    mk("path", { d: poly(hull(ringAt(P, disc(x, y, BR - 2, 24), SZ).concat(ringAt(P, disc(x, y, TR - 2, 24), SZ + BH - 4)))), class: "nf" }, grp);
    mk("path", { d: poly(ringAt(P, disc(x, y, TR - 2, 24), SZ + BH - 4)), class: "nf lo" }, grp);
    const body = mk("path", { class: "sil" }, grp), rim = mk("path", { class: "nf lo" }, grp), hand = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, body, rim, hand, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = SZ + lift, z1 = z0 + BH;
    it.body.setAttribute("d", poly(hull(ringAt(P, disc(it.x, it.y, BR, 40), z0).concat(ringAt(P, disc(it.x, it.y, TR, 40), z1)))));
    it.rim.setAttribute("d", poly(ringAt(P, disc(it.x, it.y, BR - 0.6, 40), z0 + 3)));
    // the handle: a hoop from one side of the bucket to the other
    const pts = [];
    for (let i = 0; i <= 12; i++) { const t = (i / 12) * Math.PI; pts.push(P(it.x + BR * 0.95 * Math.cos(t + Math.PI / 4), it.y - BR * 0.95 * Math.cos(t + Math.PI / 4), z0 + 4 - 10 * Math.sin(t) * 0.3)); }
    it.hand.setAttribute("d", "M" + pts.map((p) => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L"));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, SZ + BH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pail " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "sandbox",
  means: "Upturned buckets in a sandbox: the one under the pointer lifts to show the sand castle it moulded, its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 169], [137, 137], [263, 200], null],
  mount,
});
