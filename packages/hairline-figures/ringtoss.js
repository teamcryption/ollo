/**
 * Ring toss: a board of nine pegs in a three-by-three field, a rope ring
 * round each peg's foot. The pointer picks a peg on the board: its ring is
 * tossed up over the peg's tip, and the rings around it hop a little,
 * staggered by distance. At rest one ring hangs above its peg, bright.
 * The slider is the stagger.
 *
 * The pattern: pick on the ground plane (terrain), lift (cloches).
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, ringAt, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 34, M = 16, BZ = 5, PH = 22, PR = 2.6, RR = 10, LIFT = 30, FAV = 4;
const W = (N - 1) * STEP + 2 * M;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, 0, 0], [W, W, 0], [W, 0, 0], [0, W, 0], [M, M, BZ + PH + LIFT + 4], [W - M, M, BZ + PH + LIFT + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, W, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));

  const items = [];
  const order = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) order.push([i, j]);
  order.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
  const byK = [];
  for (const [i, j] of order) {
    const k = i * N + j, x = M + i * STEP, y = M + j * STEP, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, PR, 16), disc(x, y, PR - 0.8, 16), BZ, BZ + PH));
    const outer = mk("path", { class: "sil nf" }, grp), inner = mk("path", { class: "nf lo" }, grp);
    byK[k] = { k, i, j, x, y, outer, inner, z: tween(k === FAV ? LIFT * 0.8 : 0), last: NaN };
  }
  items.push(...byK);

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z = BZ + 1 + lift;
    it.outer.setAttribute("d", poly(ringAt(P, disc(it.x, it.y, RR, 40), z)));
    it.inner.setAttribute("d", poly(ringAt(P, disc(it.x, it.y, RR - 3, 40), z)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, BZ);
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const d = Math.hypot(it.x - wx, it.y - wy); if (d < bd) { bd = d; best = k; } });
    return bd < STEP * 0.7 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const f = from >= 0 ? items[from] : it, dd = Math.max(Math.abs(it.i - f.i), Math.abs(it.j - f.j));
      const z = a < 0 ? (k === FAV ? LIFT * 0.8 : 0) : k === a ? LIFT : dd === 1 ? 10 : 0;
      tset(it.z, z, now, from < 0 ? 0 : dd * stag);
      it.outer.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "peg " + (items[a].i + 1) + "·" + (items[a].j + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "ringtoss",
  means: "A board of nine pegs: the ring on the peg under the pointer is tossed up over its tip, and the rings around it hop.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 152], [291, 197], [200, 243], null],
  mount,
});
