/**
 * Seedsower: a seed drill on soil, a long toolbar carrying five seed hoppers,
 * each with a lid and a coulter running down into a furrow. The pointer picks
 * a hopper by where it stands: its lid lifts open, and the lids beside it
 * crack a little, staggered from it. At rest one lid is up, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 30, W = 20, BAR = 10, HZ = 16, HH = 18, LIFT = 12, FAV = 1;
const X1 = (N - 1) * STEP + W;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-8, -10, 0], [X1 + 8, W + 10, 0], [X1 + 8, -10, 0], [-8, W + 10, 0], [0, 0, HZ + HH + LIFT + 4], [X1, 0, HZ + HH + LIFT + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-8, -10, X1 + 8, W + 10, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, 3));
  // furrows under each hopper, dashed, then the coulters and the toolbar
  let f = "";
  for (let k = 0; k < N; k++) f += seg(P(k * STEP + W / 2, -8, 3), P(k * STEP + W / 2, W + 8, 3));
  mk("path", { d: f, class: "nf dash" }, g);
  for (let k = 0; k < N; k++) {
    const cx = k * STEP + W / 2, [r, i] = rings(cx - 1.2, W / 2 - 5, cx + 1.2, W / 2 + 5, 1, 0.4);
    put(solid(g), prism(P, front, r, i, 3, BAR));
  }
  const [br, bi] = rings(-6, W / 2 - 2.5, X1 + 6, W / 2 + 2.5, 2, 0.8);
  put(solid(g), prism(P, front, br, bi, BAR, BAR + 3));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    const [tr, ti] = rings(x + 7, W / 2 - 1.5, x + W - 7, W / 2 + 1.5, 1, 0.5);
    put(solid(grp), prism(P, front, tr, ti, BAR + 3, HZ));
    const [hr, hi] = rings(x, 0, x + W, W, 3, 1.5);
    put(solid(grp), prism(P, front, hr, hi, HZ, HZ + HH * (k % 2 ? 0.85 : 1)));
    const lid = solid(grp);
    items.push({ k, x, lid, top: HZ + HH * (k % 2 ? 0.85 : 1), z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const [lr, li] = rings(it.x - 1, -1, it.x + W + 1, W + 1, 3.5, 1.5);
    put(it.lid, prism(P, front, lr, li, it.top + lift, it.top + lift + 1.6));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + W / 2, W / 2, HZ + HH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 3 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "row " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "seedsower",
  means: "A seed drill with five hoppers on a toolbar: the hopper under the pointer opens its lid, its neighbours crack open.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 135], [200, 152], [250, 175], null],
  mount,
});
