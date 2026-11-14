/**
 * Coinjar: three savings jars of different heights on a shelf, each with a
 * screw lid. The pointer picks a jar by where it stands: its lid lifts and a
 * coin rises out of the mouth, and the jars beside it crack their lids,
 * staggered from it. At rest the middle jar is open, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 40, R = 15, NR = 10, SZ = 3, LIFT = 22, FAV = 1;
const H = [30, 40, 24];
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const X1 = (N - 1) * STEP + 2 * R;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-6, -6, 0], [X1 + 6, -6, 0], [-6, 2 * R + 6, 0], [X1 + 6, 2 * R + 6, 0], [R + STEP, R, SZ + H[1] + 6 + LIFT + 5], [R, R, SZ + H[0] + 6 + LIFT + 5]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-6, -6, X1 + 6, 2 * R + 6, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R, grp = mk("g", {}, g), top = SZ + H[k];
    put(solid(grp), prism(P, front, disc(x, y, R), disc(x, y, R - 2), SZ, top));
    put(solid(grp), prism(P, front, disc(x, y, NR), disc(x, y, NR - 1.5), top, top + 4));
    const coin = solid(grp), lid = solid(grp);
    items.push({ k, x, y, top: top + 4, coin, lid, z: tween(k === FAV ? LIFT * 0.8 : 0), last: NaN, mid: P(x, y, top / 2) });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const cz = it.top + lift * 0.55 - 1;
    put(it.coin, prism(P, front, disc(it.x, it.y, 6, 24), disc(it.x, it.y, 4.6, 24), cz, cz + 1.6));
    put(it.lid, prism(P, front, disc(it.x, it.y, NR + 1.5), disc(it.x, it.y, NR), it.top + lift, it.top + lift + 4));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const d = Math.abs(it.mid[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 32 && Math.abs(items[best].mid[1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.8 : 0) : d === 0 ? LIFT : d === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : d * stag);
      it.lid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "jar " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "coinjar",
  means: "Three savings jars on a shelf: the jar under the pointer lifts its lid and a coin rises out, its neighbours crack theirs.",
  rules: [1, 2, 5, 6],
  range: [0, 50, 100],
  tour: [[130, 170], [200, 150], [270, 160], null],
  mount,
});
