/**
 * Funnel stand: a base with a post holding a slotted shelf, three filter
 * funnels sitting in its rings over three beakers. The pointer picks a funnel
 * by where it stands: it lifts out of its ring, and its neighbours rise a
 * little, staggered from it. At rest the middle funnel stands raised, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 34, FR = 13, S0 = 40, LIFT = 20, FAV = 1, Y = 14, BZ = 4;
const X1 = (N - 1) * STEP + 2 * FR;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-14, -4, 0], [X1 + 8, 32, 0], [X1 + 8, -4, 0], [-14, 32, 0], [FR, Y, S0 + LIFT + 18], [X1 - FR, Y, S0 + LIFT + 18]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const cyl = (grp, x, y, r, z0, z1, b = 1.2) => put(solid(grp), prism(P, front, disc(x, y, r), disc(x, y, r - b), z0, z1));
  const [br, bi] = rings(-14, -4, X1 + 8, 32, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  cyl(g, -6, Y, 3, BZ, S0 - 2, 0.8);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = FR + k * STEP, grp = mk("g", {}, g);
    cyl(grp, x, Y, 9, BZ, BZ + 20, 1.4);
    const stemLo = mk("path", { class: "sil" }, grp);
    items.push({ k, x, stemLo, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }
  const [sr, si] = rings(-12, 2, X1 + 2, 26, 4, 1.5);
  put(solid(g), prism(P, front, sr, si, S0 - 2, S0));
  for (const it of items) {
    it.grp = mk("g", {}, g);
    mk("path", { d: poly(ringAt(P, disc(it.x, Y, 3.5), S0)), class: "nf lo" }, it.grp);
    it.stemHi = mk("path", { class: "sil" }, it.grp);
    it.cone = mk("path", { class: "sil" }, it.grp);
    it.rim = mk("path", { class: "nf lo" }, it.grp);
  }

  const tube = (x, z0, z1) => (z1 - z0 < 0.2 ? "" : poly(hull(ringAt(P, disc(x, Y, 1.6, 12), z0).concat(ringAt(P, disc(x, Y, 1.6, 12), z1)))));
  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const lo = S0 - 12 + lift, top = S0 + lift + 17;
    it.stemLo.setAttribute("d", tube(it.x, lo, Math.min(S0 - 2, S0 + lift)));
    it.stemHi.setAttribute("d", tube(it.x, Math.max(S0, lo), S0 + lift));
    it.cone.setAttribute("d", poly(hull(ringAt(P, disc(it.x, Y, 2.2), S0 + lift).concat(ringAt(P, disc(it.x, Y, FR, 40), top)))));
    it.rim.setAttribute("d", poly(ringAt(P, disc(it.x, Y, FR - 1.6, 40), top)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y, S0));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.cone.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "funnel " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "bunsenrack",
  means: "Three filter funnels in a shelf over beakers: the funnel under the pointer lifts out of its ring, its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[156, 120], [204, 130], [252, 144], null],
  mount,
});
