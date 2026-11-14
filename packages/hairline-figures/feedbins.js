/**
 * Feed bins: four lidded grain bins in a row against a barn wall. The
 * pointer picks a bin by where it stands: its lid swings up on the back
 * hinge to show the grain, and the lids beside it crack open, staggered
 * from it. At rest one lid is propped half open, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row (riffle), answered by a hinge.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rad, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, W = 34, GAP = 7, D = 34, H = 30, OPEN = 104, FAV = 2, REST = 72;
const X1 = N * W + (N - 1) * GAP;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[-4, -4, 0], [X1 + 4, D + 4, 0], [X1 + 4, -4, 0], [-4, D + 4, 0], [0, -4, H + D + 4], [X1, -4, H + D + 4]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-4, -4, X1 + 4, D + 4, 4, 1.6);
  put(solid(g), prism(P, front, fr, fi, 0, 2));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * (W + GAP), x1 = x0 + W, grp = mk("g", {}, g);
    const [br, bi] = rings(x0, 0, x1, D, 3, 2);
    put(solid(grp), prism(P, front, br, bi, 2, H));
    // the grain: a low heap inside the mouth
    const heap = [];
    for (const [u, v, z] of [[4, 6, 0], [W - 4, 6, 0], [W - 4, D - 5, 0], [4, D - 5, 0], [W / 2 - 4, D / 2, 4], [W / 2 + 4, D / 2 - 3, 4]]) heap.push(P(x0 + u, v, H - 3 + z));
    mk("path", { d: poly(hull(heap)), class: "nf lo" }, grp);
    const lid = mk("path", { class: "sil" }, grp), face = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x0, x1, lid, face, a: tween(k === FAV ? REST : 0), last: NaN });
  }

  // the lid: a thin plate hinged on the back edge, at angle a above the mouth
  function lidPt(x, l, t, a) {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    return P(x, -1 + l * c - t * s, H + l * s + t * c);
  }
  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const xs = [it.x0 - 1, it.x1 + 1], ls = [0, D + 2], pts = [];
    for (const x of xs) for (const l of ls) for (const t of [0, 2]) pts.push(lidPt(x, l, t, a));
    it.lid.setAttribute("d", poly(hull(pts)));
    const top = [lidPt(xs[0] + 2, 1.5, 2, a), lidPt(xs[1] - 2, 1.5, 2, a), lidPt(xs[1] - 2, D, 2, a), lidPt(xs[0] + 2, D, 2, a)];
    it.face.setAttribute("d", poly(top));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, D / 2, H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), ang = a < 0 ? (k === FAV ? REST : 0) : dd === 0 ? OPEN : dd === 1 ? 14 : 0;
      tset(it.a, ang, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bin " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "feedbins",
  means: "Four grain bins in a row: the lid of the bin under the pointer swings up on its hinge to show the feed, its neighbours crack open.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[125, 162], [175, 187], [275, 236], null],
  mount,
});
