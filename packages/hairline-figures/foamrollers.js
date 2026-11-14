/**
 * Foam rollers: five upright rollers standing in the holes of a low gym rack,
 * each with two grip bands. The pointer picks a roller by where it stands:
 * it lifts out of its hole, and its neighbours rise a little, staggered from
 * it. At rest one roller is half drawn, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 24, R = 9, H = 46, LIFT = 24, FAV = 2, BZ = 6, X0 = 14;
const RX = X0 * 2 + (N - 1) * STEP;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [RX, 28, 0], [RX, 0, 0], [0, 28, 0], [X0, 14, BZ + H + LIFT], [RX - X0, 14, BZ + H + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, RX, 28, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, y = 14, grp = mk("g", {}, g);
    mk("path", { d: poly(ringAt(P, disc(x, y, R + 1.2), BZ)), class: "nf lo" }, grp);
    const body = solid(grp), bands = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, body, bands, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  const ring = (it) => disc(it.x, it.y, R), inner = (it) => disc(it.x, it.y, R - 1.6);
  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = BZ - 3 + lift, z1 = z0 + H;
    put(it.body, prism(P, front, ring(it), inner(it), z0, z1));
    const half = run(ring(it), front);
    it.bands.setAttribute("d", open(ringAt(P, half, z0 + H * 0.33)) + " " + open(ringAt(P, half, z0 + H * 0.66)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, BZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "roller " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "foamrollers",
  means: "Five foam rollers standing in a gym rack: the roller under the pointer lifts out of its hole, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[130, 139], [200, 156], [270, 209], null],
  mount,
});
