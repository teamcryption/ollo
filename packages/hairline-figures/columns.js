/**
 * Columns: a portico of five columns on a stepped plinth, each with a square
 * base and a square capital. The pointer picks a column by where it stands:
 * it rises out of the row as if set into place, and its neighbours rise a
 * little, staggered from it. At rest the middle column stands raised, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 30, R = 6.5, H = 62, LIFT = 18, FAV = 2, PZ = 8;
const X1 = (N - 1) * STEP + 24;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-8, -8, 0], [X1 + 8, 32, 0], [X1 + 8, -8, 0], [-8, 32, 0], [12, 12, PZ + H + LIFT + 6], [X1 - 12, 12, PZ + H + LIFT + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [a0, a1] = rings(-8, -8, X1 + 8, 32, 4, 2);
  put(solid(g), prism(P, front, a0, a1, 0, 4));
  const [b0, b1] = rings(-3, -3, X1 + 3, 27, 3, 1.6);
  put(solid(g), prism(P, front, b0, b1, 4, PZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 12 + k * STEP, y = 12, grp = mk("g", {}, g);
    const base = solid(grp), shaft = solid(grp), cap = solid(grp);
    items.push({ k, x, y, base, shaft, cap, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = PZ + lift, { x, y } = it;
    const [r0, r1] = rings(x - 10, y - 10, x + 10, y + 10, 2, 1);
    put(it.base, prism(P, front, r0, r1, z0, z0 + 4));
    put(it.shaft, prism(P, front, disc(x, y, R), disc(x, y, R - 1.2), z0 + 4, z0 + H - 4));
    const [c0, c1] = rings(x - 11, y - 11, x + 11, y + 11, 2, 1);
    put(it.cap, prism(P, front, c0, c1, z0 + H - 4, z0 + H));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, PZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      for (const s of [it.base, it.shaft, it.cap]) s.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "col " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "columns",
  means: "A portico of five columns on a plinth: the column under the pointer rises out of the row, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[163, 191], [237, 228], [126, 173], null],
  mount,
});
