/**
 * Glove boxes: three dispenser boxes lying in a row on a clinic shelf, each
 * with an oval slot in its top. The pointer picks a box by where it stands:
 * a glove pulls up out of its slot, and the boxes beside it offer a little,
 * staggered from it. At rest one glove stands half out, bright.
 * The slider is the stagger.
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, circ,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 46, BW = 38, BD = 26, BH = 16, SZ = 4, LIFT = 46, FAV = 1;
const X1 = (N - 1) * STEP + BW;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-6, -6, 0], [X1 + 6, BD + 6, 0], [X1 + 6, -6, 0], [-6, BD + 6, 0], [BW / 2, BD / 2, SZ + BH + LIFT + 8], [X1 - BW / 2, BD / 2, SZ + BH + LIFT + 8]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-6, -6, X1 + 6, BD + 6, 4, 1.6);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, grp = mk("g", {}, g), cx = x0 + BW / 2, cy = BD / 2;
    const [br, bi] = rings(x0, 0, x0 + BW, BD, 3, 1.4);
    put(solid(grp), prism(P, front, br, bi, SZ, SZ + BH));
    const slot = circ(1, 32).map((q) => ({ ...q, u: cx + q.u * 14, v: cy + q.v * 4.5 }));
    mk("path", { d: poly(ringAt(P, slot, SZ + BH)), class: "nf lo" }, grp);
    const glove = solid(grp);
    items.push({ k, cx, cy, glove, z: tween(k === FAV ? LIFT * 0.4 : 1), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const [gr, gi] = rings(it.cx - 15, it.cy - 3, it.cx + 15, it.cy + 3, 3, 1);
    const top = SZ + BH + lift;
  
    put(it.glove, prism(P, front, gr, gi, SZ + BH - 1, top));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.cx, it.cy, SZ + BH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 45 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.4 : 1) : dd === 0 ? LIFT : dd === 1 ? 6 : 1;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.glove.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
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
  name: "maskbox",
  means: "Three glove boxes on a shelf: the box under the pointer gives up a glove through its slot, and its neighbours offer one a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[133, 151], [194, 146], [267, 218], null],
  mount,
});
