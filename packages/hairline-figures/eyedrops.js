/**
 * Eye drops: five small squeeze bottles in a tray, each with a shoulder and
 * a tapered dropper tip. The pointer picks a bottle by where it stands: it
 * lifts out of the tray, and the bottles beside it rise a little, staggered
 * from it. At rest one bottle stands raised, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 20, R = 8, H = 30, LIFT = 18, FAV = 1, RZ = 6;
const X1 = (N - 1) * STEP + 2 * R;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-6, -6, 0], [X1 + 6, 2 * R + 6, 0], [X1 + 6, -6, 0], [-6, 2 * R + 6, 0], [R, R, H + LIFT + 16], [X1 - R, R, H + LIFT + 16]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -6, X1 + 6, 2 * R + 6, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R, grp = mk("g", {}, g);
    const body = mk("path", { class: "sil" }, grp), band = mk("path", { class: "nf lo" }, grp);
    const valve = mk("path", {}, grp), gauge = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, body, band, valve, gauge, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }
  // the rack's front rail, over the tanks' feet
  const [fr, fi] = rings(-6, 2 * R - 2, X1 + 6, 2 * R + 6, 3, 1);
  put(solid(g), prism(P, front, fr, fi, 3, RZ));

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = 3 + lift, pts = ringAt(P, disc(it.x, it.y, R), z0);
    for (let i = 0; i <= 5; i++) { const t = (i / 5) * (Math.PI / 2); pts.push(...ringAt(P, disc(it.x, it.y, Math.max(3.2, R * Math.cos(t))), z0 + H - R + R * Math.sin(t))); }
    it.body.setAttribute("d", poly(hull(pts)));
    it.band.setAttribute("d", open(ringAt(P, run(disc(it.x, it.y, R), front), z0 + H * 0.35)));
    const v0 = z0 + H - 2;
    it.valve.setAttribute("d", poly(hull(ringAt(P, disc(it.x, it.y, 3.2, 16), v0).concat(ringAt(P, disc(it.x, it.y, 0.8, 12), v0 + 11)))));
    it.gauge.setAttribute("d", open(ringAt(P, run(disc(it.x, it.y, 3.2, 16), front), v0 + 2.5)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 18 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
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
    read.textContent = a < 0 ? "rest" : "no. " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "eyedrops",
  means: "Five eye drop bottles in a tray: the bottle under the pointer lifts out by its dropper tip, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[146, 155], [200, 185], [254, 215], null],
  mount,
});
