/**
 * Cake boxes: three square bakery boxes in a row on a counter, each tied with
 * a ribbon across its lid, a round cake inside. The pointer picks a box by
 * where it stands: its lid lifts off to show the cake, and the lids beside it
 * lift a little, staggered from it. At rest one lid is raised, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, open, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, W = 40, GAP = 10, H = 20, LH = 7, LIFT = 26, FAV = 1, CZ = 3;
const X1 = N * W + (N - 1) * GAP;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-6, -6, 0], [X1 + 6, W + 6, 0], [X1 + 6, -6, 0], [-6, W + 6, 0], [0, 0, CZ + H + LIFT + 2], [X1, 0, CZ + H + LIFT + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-6, -6, X1 + 6, W + 6, 6, 2);
  put(solid(g), prism(P, front, cr, ci, 0, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * (W + GAP), grp = mk("g", {}, g), cx = x0 + W / 2, cy = W / 2;
    const [br, bi] = rings(x0, 0, x0 + W, W, 3, 1.4);
    put(solid(grp), prism(P, front, br, bi, CZ, CZ + H - 4));
    // the cake: a round tier standing proud of the box
    put(solid(grp), prism(P, front, disc(cx, cy, 14, 40), disc(cx, cy, 12.6, 40), CZ + H - 4, CZ + H + 3));
    const lid = solid(grp), rib = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x0, cx, cy, grp, lid, rib, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = CZ + H - LH + 1 + lift, z1 = z0 + LH, [r, i] = rings(it.x0 - 1, -1, it.x0 + W + 1, W + 1, 3.4, 1.4);
    put(it.lid, prism(P, front, r, i, z0, z1));
    // the ribbon: a cross over the lid and down its two near faces
    it.rib.setAttribute("d", seg(P(it.cx, -1, z1), P(it.cx, W + 1, z1)) + seg(P(-1 + it.x0, it.cy, z1), P(it.x0 + W + 1, it.cy, z1))
      + open([P(it.cx, W + 1, z1), P(it.cx, W + 1, z0)]) + open([P(it.x0 + W + 1, it.cy, z1), P(it.x0 + W + 1, it.cy, z0)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.cx, it.cy, CZ + H / 2));
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
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
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
  name: "cakeboxes",
  means: "Three ribboned cake boxes in a row: the lid under the pointer lifts to show the cake, and its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[136, 141], [200, 173], [264, 205], null],
  mount,
});
