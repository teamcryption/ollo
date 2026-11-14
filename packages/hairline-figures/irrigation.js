/**
 * Sprinklers: four pop-up sprinkler heads set in a strip of lawn, each in a
 * flush housing. The pointer picks a head by where it stands: it pops up on
 * its riser, and the heads beside it rise a little, staggered from it. At
 * rest one head is up, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, ringAt, poly, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 36, W = 22, LIFT = 24, FAV = 2, CZ = 5, SR = 3, HR = 6;
const X1 = (N - 1) * STEP + 2 * W;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, 0, 0], [X1, 2 * W, 0], [X1, 0, 0], [0, 2 * W, 0], [W, W, CZ + LIFT + 8], [X1 - W, W, CZ + LIFT + 8]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [lr, li] = rings(0, 0, X1, 2 * W, 8, 2);
  put(solid(g), prism(P, front, lr, li, 0, CZ));
  // mown stripes across the lawn
  for (let k = 1; k < 2 * N; k++) {
    const x = (k * X1) / (2 * N);
    if (k % 2) continue;
    mk("path", { d: "M" + P(x, 4, CZ).join(",") + "L" + P(x, 2 * W - 4, CZ).join(","), class: "nf lo" }, g);
  }

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = W + k * STEP, y = W, grp = mk("g", {}, g);
    mk("path", { d: poly(ringAt(P, disc(x, y, HR + 2.5), CZ)), class: "lo" }, grp);
    const stem = solid(grp), head = solid(grp);
    items.push({ k, x, y, stem, head, z: tween(k === FAV ? LIFT * 0.8 : 1), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const top = CZ + lift;
    put(it.stem, prism(P, front, disc(it.x, it.y, SR), disc(it.x, it.y, SR - 1), CZ, top));
    put(it.head, prism(P, front, disc(it.x, it.y, HR), disc(it.x, it.y, HR - 1.6), top, top + 4));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, CZ + 6));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.8 : 1) : dd === 0 ? LIFT : dd === 1 ? 6 : 1;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.head.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "head " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "irrigation",
  means: "Four pop-up sprinklers in a strip of lawn: the head under the pointer rises on its riser, its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[123, 134], [174, 158], [275, 210], null],
  mount,
});
