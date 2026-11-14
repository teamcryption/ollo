/**
 * Skis: five pairs of skis standing in a rack along a low bench, held by a
 * rail near their tips. The pointer picks a pair by where it stands: it
 * lifts up out of the rack, and the pairs beside it rise a little,
 * staggered from it. At rest one pair stands raised, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 16, W = 5, D = 2, H = 92, BZ = 6, LIFT = 22, FAV = 3, RZ = 66;
const X1 = (N - 1) * STEP + 2 * W + 8;
const rest = (k) => (k === FAV ? LIFT * 0.7 : [2, 0, 4, 0, 1][k]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-6, -6, 0], [X1 + 6, 18, 0], [X1 + 6, -6, 0], [-6, 18, 0], [0, 6, H + LIFT + BZ], [X1, 6, H + LIFT + BZ]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -6, X1 + 6, 18, 3, 1.5);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  // the rack's back posts and rail, behind the skis
  const [p0, p0i] = rings(-4, 0, 0, 4, 1, 0.6), [p1, p1i] = rings(X1, 0, X1 + 4, 4, 1, 0.6);
  put(solid(g), prism(P, front, p0, p0i, BZ, RZ + 4));
  put(solid(g), prism(P, front, p1, p1i, BZ, RZ + 4));
  const [rr, ri] = rings(-4, 0, X1 + 4, 4, 1, 0.6);
  put(solid(g), prism(P, front, rr, ri, RZ, RZ + 4));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 8 + k * STEP, grp = mk("g", {}, g);
    const a = solid(grp), b = solid(grp), tip = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, grp, a, b, tip, z: tween(rest(k)), last: NaN });
  }
  // the front rail, in front of the skis
  const fg = mk("g", {}, g);
  const [fr, fi] = rings(-4, 10, X1 + 4, 13, 1, 0.6);
  put(solid(fg), prism(P, front, fr, fi, RZ - 8, RZ - 5));

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = BZ + lift, x = it.x;
    const [r1, i1] = rings(x, 5, x + W, 5 + D, 1.2, 0.5), [r2, i2] = rings(x, 5 + D + 0.6, x + W, 5 + 2 * D + 0.6, 1.2, 0.5);
    put(it.a, prism(P, front, r1, i1, z0, z0 + H));
    put(it.b, prism(P, front, r2, i2, z0, z0 + H - 3));
    // a binding: two short marks across the front ski
    it.tip.setAttribute("d", seg(P(x, 5 + 2 * D + 0.6, z0 + 34), P(x + W, 5 + 2 * D + 0.6, z0 + 34)) + seg(P(x, 5 + 2 * D + 0.6, z0 + 42), P(x + W, 5 + 2 * D + 0.6, z0 + 42)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + W / 2, 6, BZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 16 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? rest(k) : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.a.sil.classList.toggle("hi", on);
      it.b.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "pair " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "skis",
  means: "Five pairs of skis in a rack: the pair under the pointer lifts out of the rack, and the pairs beside it rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[156, 149], [201, 172], [247, 194], null],
  mount,
});
