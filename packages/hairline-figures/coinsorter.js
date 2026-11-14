/**
 * Coin sorter: a counting tray with four sleeves of different bores, each
 * holding a stack of coins of its own size and height. The pointer picks a
 * sleeve by where it stands: its stack pushes up out of the sleeve, and the
 * stacks beside it rise a little, staggered from it. At rest the second
 * stack is raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const RS = [7, 8.5, 10, 11.5], COUNT = [6, 9, 5, 7], CT = 2.4, Y = 16, BASE = 8, SL = 8, LIFT = 16, FAV = 1;
const XS = [10, 31, 55, 82];
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.55);
  const topZ = BASE + SL + LIFT + 9 * CT + 4;
  fit(C, [[-4, -4, 0], [98, 34, 0], [98, -4, 0], [-4, 34, 0], [10, Y, topZ], [82, Y, topZ]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, 98, 34, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, BASE));

  const items = [];
  for (let k = 0; k < XS.length; k++) {
    const x = XS[k], r = RS[k], grp = mk("g", {}, g), coins = [];
    const sleeve = solid(grp), rod = solid(grp);
    for (let i = 0; i < COUNT[k]; i++) coins.push(solid(grp));
    items.push({ k, x, r, coins, sleeve, rod, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = BASE + SL + lift;
    // the stack rides a push rod out of the sleeve, painted after it
    put(it.rod, prism(P, front, disc(it.x, Y, it.r * 0.45, 20), disc(it.x, Y, it.r * 0.45 - 1, 20), BASE + SL - 1, z0 + 0.5));
    it.coins.forEach((s, i) => { const z = z0 + i * CT; put(s, prism(P, front, disc(it.x, Y, it.r - 0.8), disc(it.x, Y, it.r - 1.6), z, z + CT - 0.3)); });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);
  for (const it of items) put(it.sleeve, prism(P, front, disc(it.x, Y, it.r + 1.2), disc(it.x, Y, it.r), BASE, BASE + SL));

  const mids = items.map((it) => P(it.x, Y, BASE + SL));
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
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      for (const s of it.coins) s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "lane " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "coinsorter",
  means: "A coin sorter with four sleeves of stacked coins: the stack under the pointer pushes up out of its sleeve, its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[131, 118], [213, 158], [261, 182], null],
  mount,
});
