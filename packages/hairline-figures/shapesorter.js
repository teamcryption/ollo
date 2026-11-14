/**
 * Shape sorter: a toy box with three holes in its lid, a round, a square and
 * a long one, each with its block sitting in it. The pointer picks a block by
 * where it stands: it lifts out of its hole to show the hole's outline, and
 * the block beside it lifts a little, staggered from it. At rest one block is
 * half raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 120, BY = 44, BH = 26, LIFT = 26, FAV = 1, D = 22;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const SHAPES = [
  { x: 22, h: 12, ring: () => disc(22, 22, 11), inner: () => disc(22, 22, 9) },
  { x: 60, h: 10, ring: () => rings(49, 11, 71, 33, 3, 2)[0], inner: () => rings(49, 11, 71, 33, 3, 2)[1] },
  { x: 98, h: 14, ring: () => rings(92, 6, 104, 38, 3, 2)[0], inner: () => rings(92, 6, 104, 38, 3, 2)[1] },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[0, 0, 0], [BX, BY, 0], [BX, 0, 0], [0, BY, 0], [0, 0, BH + LIFT + 16], [BX, 0, BH + LIFT + 16]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, BX, BY, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, BH));

  const items = SHAPES.map((s, k) => {
    // the hole in the lid, painted before its block
    mk("path", { d: poly(ringAt(P, s.ring(), BH)), class: "nf lo" }, g);
    const grp = mk("g", {}, g), sd = solid(grp);
    sd.sil.classList.add("sil");
    return { k, s, sd, z: tween(k === FAV ? LIFT * 0.55 : [2, 0, 4][k]), last: NaN };
  });

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    put(it.sd, prism(P, front, it.s.ring(), it.s.inner(), BH + lift, BH + lift + it.s.h));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.s.x, BY / 2, BH));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.55 : [2, 0, 4][k]) : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sd.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : ["round", "square", "long"][a];
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "shapesorter",
  means: "A toy box with shaped holes: the block under the pointer lifts out of its hole, and the block beside it lifts a little.",
  rules: [1, 2, 5, 6],
  range: [0, 50, 100],
  tour: [[150, 150], [200, 170], [250, 190], null],
  mount,
});
