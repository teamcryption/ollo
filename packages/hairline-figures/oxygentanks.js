/**
 * Oxygen tanks: four tall cylinders standing in a low rack, each with a
 * rounded shoulder, a valve and a round gauge. The pointer picks a tank by
 * where it stands: it lifts out of the rack, and the tanks beside it rise a
 * little, staggered from it. At rest one tank stands raised, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, R = 12, H = 70, LIFT = 22, FAV = 2, RZ = 10;
const X1 = (N - 1) * STEP + 2 * R;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-6, -6, 0], [X1 + 6, 2 * R + 6, 0], [X1 + 6, -6, 0], [-6, 2 * R + 6, 0], [R, R, H + LIFT + 14], [X1 - R, R, H + LIFT + 14]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -6, X1 + 6, 2 * R + 6, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R, grp = mk("g", {}, g);
    const body = mk("path", { class: "sil" }, grp), band = mk("path", { class: "nf lo" }, grp);
    const valve = mk("path", {}, grp), gauge = mk("path", {}, grp);
    items.push({ k, x, y, body, band, valve, gauge, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }
  // the rack's front rail, over the tanks' feet
  const [fr, fi] = rings(-6, 2 * R - 2, X1 + 6, 2 * R + 6, 3, 1);
  put(solid(g), prism(P, front, fr, fi, 3, RZ));

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = 3 + lift, pts = ringAt(P, disc(it.x, it.y, R), z0);
    for (let i = 0; i <= 5; i++) { const t = (i / 5) * (Math.PI / 2); pts.push(...ringAt(P, disc(it.x, it.y, Math.max(3, R * Math.cos(t))), z0 + H - R + R * Math.sin(t))); }
    it.body.setAttribute("d", poly(hull(pts)));
    it.band.setAttribute("d", open(ringAt(P, run(disc(it.x, it.y, R), front), z0 + H - R - 6)));
    const v0 = z0 + H;
    it.valve.setAttribute("d", poly(hull(ringAt(P, disc(it.x, it.y, 3, 16), v0 - 1).concat(ringAt(P, disc(it.x, it.y, 3, 16), v0 + 7)))));
    const c = [];
    for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; c.push(P(it.x + 3.5 * Math.cos(a), it.y + 7 + 3.5 * Math.cos(a), v0 + 5 + 4 * Math.sin(a))); }
    it.gauge.setAttribute("d", poly(hull(c)));
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
    return bd < 24 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
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
    read.textContent = a < 0 ? "rest" : "tank " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "oxygentanks",
  means: "Four oxygen tanks in a rack: the tank under the pointer lifts out with its valve and gauge, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[146, 155], [200, 185], [254, 215], null],
  mount,
});
