/**
 * Cable drums: four flanged reels of cable standing in a yard, each under a
 * hoist line. The pointer picks a drum by where it stands: the hoist lifts
 * it off the yard, and the drums beside it lift a little, staggered from it.
 * At rest one drum hangs raised, bright, and the rest stand at uneven
 * heights. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 40, R = 16, RC = 13, FZ = 2.5, CH = 15, YZ = 5, LIFT = 26, TOP = 92, FAV = 2;
const X1 = (N - 1) * STEP + 2 * R + 12, Y1 = 2 * R + 12;
const REST = [2, 6, LIFT * 0.7, 0];
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.65);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [0, 0, TOP], [X1, Y1, YZ + LIFT + 2 * FZ + CH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [yr, yi] = rings(0, 0, X1, Y1, 6, 2);
  put(solid(g), prism(P, front, yr, yi, 0, YZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 6 + R + k * STEP, y = 6 + R, grp = mk("g", {}, g);
    const line = mk("path", { class: "lo nf" }, grp);
    const lo = solid(grp), mid = solid(grp), hi = solid(grp);
    items.push({ k, x, y, line, lo, mid, hi, z: tween(REST[k]), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const { x, y } = it, z0 = YZ + lift, z1 = z0 + FZ, z2 = z1 + CH, z3 = z2 + FZ;
    put(it.lo, prism(P, front, disc(x, y, R), disc(x, y, R - 1.2), z0, z1));
    put(it.mid, prism(P, front, disc(x, y, RC), disc(x, y, RC - 1.2), z1, z2));
    put(it.hi, prism(P, front, disc(x, y, R), disc(x, y, R - 2), z2, z3));
    it.line.setAttribute("d", seg(P(x, y, z3), P(x, y, TOP)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, YZ + 10));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : dd === 1 ? 7 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.hi.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "drum " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "spoolwinder",
  means: "Four cable drums in a yard: the hoist lifts the drum under the pointer, and the drums beside it rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[130, 175], [177, 199], [270, 245], null],
  mount,
});
