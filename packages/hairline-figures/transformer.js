/**
 * Transformer: a substation tank on its plinth, cooling fins down its front
 * face and three porcelain bushings standing on its lid. The pointer picks a
 * bushing by where it stands: it draws up out of its flange, and the bushings
 * beside it rise a little, staggered from it. At rest the middle bushing is
 * raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, XS = [18, 40, 62], BY = 24, TOP = 52, H = 20, LIFT = 22, FAV = 1, SHEDS = 4;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[-6, -6, 0], [86, 62, 0], [86, -6, 0], [-6, 62, 0], [18, 24, TOP + 2 + H + LIFT + 6], [62, 24, TOP + 2 + H + LIFT + 6]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-6, -6, 86, 62, 4, 2);
  put(solid(g), prism(P, front, pr, pi, 0, 4));
  const [tr, ti] = rings(0, 0, 80, 48, 4, 1.6);
  put(solid(g), prism(P, front, tr, ti, 4, TOP));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = XS[k], grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, BY, 7.5), disc(x, BY, 6), TOP, TOP + 2));
    const core = solid(grp), sheds = [];
    for (let i = 0; i < SHEDS; i++) sheds.push(solid(grp));
    const cap = solid(grp);
    items.push({ k, x, core, sheds, cap, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }
  // cooling fins on the front face, nearer than the bushings, painted last
  for (let i = 0; i < 6; i++) {
    const x = 10 + i * 12, [fr, fi] = rings(x - 1.3, 48, x + 1.3, 60, 1, 0.5);
    put(solid(g), prism(P, front, fr, fi, 10, 44));
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = TOP + 2 + lift;
    put(it.core, prism(P, front, disc(it.x, BY, 3), disc(it.x, BY, 2.2), TOP + 1, z0 + H));
    it.sheds.forEach((s, i) => { const z = z0 + 3 + i * 4.6; put(s, prism(P, front, disc(it.x, BY, 6), disc(it.x, BY, 4.8), z, z + 1.4)); });
    put(it.cap, prism(P, front, disc(it.x, BY, 2), disc(it.x, BY, 1.3), z0 + H, z0 + H + 4));
  }
  function light(it, on) {
    for (const s of [it.core, ...it.sheds, it.cap]) s.sil.classList.toggle("hi", on);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, BY, TOP + 2 + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      light(it, k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "H" + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "transformer",
  means: "A substation transformer with three bushings on its lid: the bushing under the pointer draws up, its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[176, 96], [205, 110], [234, 125], null],
  mount,
});
