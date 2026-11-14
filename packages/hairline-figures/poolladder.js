/**
 * Pool ladder: a pool's coping wall, the water in front of it, and a ladder
 * of two bent rails with three treads hanging into the water, a ripple round
 * each rail foot. The pointer picks a tread by its rest place: it presses
 * down under a foot, and the treads beside it give a little, staggered from
 * it. At rest the middle tread is bright. The slider is the stagger.
 *
 * The pattern: one of many in a stepped column (picked by rest centres).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const WZ = 14, TOP = 50, RZ = 64, Y0 = 28, Y1 = 62, TX0 = 41, TX1 = 53, TZ = [20, 31, 42], PRESS = 7, FAV = 1;
const disc = (x, y, r, n = 14) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [130, 90, 0], [130, 0, 0], [0, 90, 0], [0, 0, TOP], [30, Y0, RZ + 2], [30, Y1, RZ + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(0, 0, 40, 90, 3, 1.6);
  put(solid(g), prism(P, front, wr, wi, 0, TOP));
  const [qr, qi] = rings(40, 0, 130, 90, 3, 2);
  put(solid(g), prism(P, front, qr, qi, 0, WZ));
  // a ripple round each rail foot
  for (const y of [Y0, Y1]) mk("path", { d: poly(ringAt(P, disc(46, y, 5, 28), WZ)), class: "nf lo" }, g);

  function rail(y) {
    const rg = mk("g", {}, g), r = 1.6;
    put(solid(rg), prism(P, front, disc(31, y, r), disc(31, y, r - 0.6), TOP, RZ));
    const arm = [];
    for (const x of [31, 46]) arm.push(...ringAt(P, disc(x, y, r), RZ - r), ...ringAt(P, disc(x, y, r), RZ + r));
    mk("path", { d: poly(hull(arm)), class: "sil" }, rg);
    put(solid(rg), prism(P, front, disc(46, y, r), disc(46, y, r - 0.6), WZ, RZ));
  }
  rail(Y0);
  const items = TZ.map((z, k) => {
    const s = solid(g), [r, i] = rings(TX0, Y0, TX1, Y1, 1.4, 0.8);
    return { k, z, s, r, i, d: tween(0), last: NaN };
  });
  rail(Y1);

  function draw(it, dz) {
    if (dz === it.last) return;
    it.last = dz;
    put(it.s, prism(P, front, it.r, it.i, it.z - dz, it.z - dz + 2.4));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.d, now)); if (!tdone(it.d, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((TX0 + TX1) / 2, (Y0 + Y1) / 2, it.z + 1.2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, (m[1] - sy) * 1.4); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = a < 0 ? (k === FAV ? 1.5 : 0) : dd === 0 ? PRESS : dd === 1 ? 2.5 : 0;
      tset(it.d, d, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "step " + (TZ.length - a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "poolladder",
  means: "A pool ladder hanging into the water: the tread under the pointer presses down, the treads beside it give a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[178, 129], [178, 146], [178, 162], null],
  mount,
});
