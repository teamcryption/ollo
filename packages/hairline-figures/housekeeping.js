/**
 * Housekeeping: a hotel cart on four castors with a push handle at one end
 * and three stacks of folded towels on its top deck. The pointer picks a
 * stack by where it stands: that stack lifts off the deck, and its
 * neighbours rise a little, staggered from it. At rest one stack is raised,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 40, W = 30, BZ = 50, LIFT = 20, FAV = 1, TH = 6;
const X1 = 130, Y1 = 44;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [-8, Y1 / 2, 74], [X1, Y1 / 2, BZ + 2 * TH + LIFT + 4]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // castors, far ones first
  for (const [x, y] of [[8, 8], [X1 - 8, 8], [8, Y1 - 8], [X1 - 8, Y1 - 8]]) put(solid(g), prism(P, front, disc(x, y, 5), disc(x, y, 3.5), 0, 8));
  // handle at the far end: two posts and a grip
  for (const y of [8, Y1 - 8]) { const [a, b] = rings(-6, y - 2, -2, y + 2, 1.5, 0.6); put(solid(g), prism(P, front, a, b, 30, 72)); }
  { const [a, b] = rings(-7, 4, -1, Y1 - 4, 2.5, 0.8); put(solid(g), prism(P, front, a, b, 68, 74)); }
  // the body: a lower shelf, a cabinet, a top deck
  { const [a, b] = rings(0, 0, X1, Y1, 5, 2); put(solid(g), prism(P, front, a, b, 8, 14)); }
  { const [a, b] = rings(3, 3, X1 - 3, Y1 - 3, 4, 2); put(solid(g), prism(P, front, a, b, 14, BZ - 4)); }
  { const [a, b] = rings(0, 0, X1, Y1, 5, 2); put(solid(g), prism(P, front, a, b, BZ - 4, BZ)); }

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 25 + k * STEP, y = Y1 / 2, grp = mk("g", {}, g);
    const towels = [0, 1].map(() => solid(grp));
    items.push({ k, x, y, grp, towels, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }
  const tr = items.map((it) => [rings(it.x - W / 2, it.y - W / 2, it.x + W / 2, it.y + W / 2, 4, 1.5), rings(it.x - W / 2 + 1, it.y - W / 2 + 2, it.x + W / 2 - 1, it.y + W / 2 - 1, 4, 1.5)]);

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    it.towels.forEach((s, j) => {
      const [a, b] = tr[it.k][j], z0 = BZ + lift + j * (TH + lift * 0.15);
      put(s, prism(P, front, a, b, z0, z0 + TH));
    });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, BZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.towels[1].sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "stack " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "housekeeping",
  means: "A hotel housekeeping cart: the towel stack under the pointer lifts off the top deck, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[151, 104], [200, 129], [249, 154], null],
  mount,
});
