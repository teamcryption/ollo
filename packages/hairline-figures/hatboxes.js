/**
 * Hat boxes: three round boxes of different sizes standing in a row on a
 * boutique shelf, each with a deep lid. The pointer picks a box by where it
 * stands: its lid lifts and tips open, and the lids beside it lift a crack,
 * staggered from it. At rest the middle lid sits ajar, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, run, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BOX = [[16, 26], [21, 34], [13, 20]], GAP = 6, LH = 7, LIFT = 20, FAV = 1, SZ = 3;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  let x = 0;
  const pos = BOX.map(([r]) => { const c = x + r; x += 2 * r + GAP; return c; });
  const W = x - GAP, Y = 22;
  fit(C, [[-6, -6, 0], [W + 6, 2 * Y + 6, 0], [W + 6, -6, 0], [-6, 2 * Y + 6, 0], [pos[1], Y, SZ + 34 + LIFT + 14], [pos[0], Y, SZ + 26 + LIFT + 14]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-6, -6, W + 6, 2 * Y + 6, 5, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const items = BOX.map(([r, h], k) => {
    const cx = pos[k], grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(cx, Y, r), disc(cx, Y, r - 1.5), SZ, SZ + h - LH + 2));
    const lid = solid(grp);
    return { k, cx, r, h, grp, lid, z: tween(k === FAV ? 0.45 : 0), last: NaN };
  });

  // the lid: a short drum, tipped about the far rim as it lifts
  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const base = SZ + it.h - LH + t * LIFT, tip = t * 0.5, R = it.r + 1.2;
    const at = (rr, dz) => disc(it.cx, Y, rr, 44).map((q) => ({ ...q, z: base + dz + Math.max(0, (q.u - it.cx) + (q.v - Y)) * tip * 0.5 }));
    const ringZ = (rr, dz) => at(rr, dz).map((q) => P(q.u, q.v, q.z));
    const s = hull(ringZ(R, 0).concat(ringZ(R, LH)));
    const inner = run(at(R - 1.6, LH), front).map((q) => P(q.u, q.v, q.z));
    it.lid.sil.setAttribute("d", poly(s));
    it.lid.cr.setAttribute("d", open(inner));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.cx, Y, SZ + it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return best >= 0 && bd < 45 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? 0.45 : 0) : dd === 0 ? 1 : dd === 1 ? 0.15 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "box " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "hatboxes",
  means: "Three round hat boxes on a shelf: the box under the pointer lifts and tips its lid open, and its neighbours lift a crack.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[136, 150], [204, 157], [262, 205], null],
  mount,
});
