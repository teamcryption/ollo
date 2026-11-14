/**
 * Cooler: a cool box with its lid stood open at the back and a row of cans
 * on ice inside. The pointer picks a can by where it stands: it lifts out of
 * the box, bright, and the cans beside it rise a little, staggered from it.
 * At rest one can stands half out. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, W = 104, D = 52, H = 40, CR = 8, STEP = 22, LIFT = 40, FAV = 3;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, -4, 0], [W, D, 0], [W, -4, H + D], [0, -4, H + D], [0, D, 0], [W / 2, D / 2, H + 18 + LIFT]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the lid, stood open on its back hinge
  const [lr, li] = rings(-1, -5, W + 1, -1, 1.5, 0.8);
  const lid = put(solid(g), prism(P, front, lr, li, H, H + D - 6));
  mk("path", { d: seg(P(10, -1, H + D - 14), P(W - 10, -1, H + D - 14)), class: "lo nf" }, g);
  // the body and its opening
  const [br, bi] = rings(0, 0, W, D, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const [or] = rings(6, 6, W - 6, D - 6, 5, 1);
  mk("path", { d: poly(ringAt(P, or, H)), class: "nf lo" }, g);
  // a handle on the near end, a drain on the front
  mk("path", { d: seg(P(W, 16, H - 8), P(W, D - 16, H - 8)), class: "nf" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 19 + k * STEP, y = D / 2 + (k % 2 ? 3 : -3), grp = mk("g", {}, g);
    const s = solid(grp), tab = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, s, tab, z: tween(k === FAV ? LIFT * 0.45 : (k === 0 ? 5 : 2)), last: NaN });
  }
  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const top = H + 6 + lift;
    put(it.s, prism(P, front, disc(it.x, it.y, CR), disc(it.x, it.y, CR - 2), H, top));
    it.tab.setAttribute("d", poly(hull(ringAt(P, disc(it.x - 3, it.y, 2, 10), top))));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, H));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.45 : (k === 0 ? 5 : 2)) : dd === 0 ? LIFT : dd === 1 ? 12 : 1;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "can " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cooler",
  means: "A cool box with its lid open: the can under the pointer lifts out of the ice, and the cans beside it rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[160, 156], [180, 173], [235, 201], null],
  mount,
});
