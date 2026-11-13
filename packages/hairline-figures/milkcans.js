/**
 * Milk churns: five churns of slightly different heights on a raised dairy
 * platform, each a round body that narrows at the shoulder to a neck under a
 * capped lid. The pointer picks a churn by where it stands: its lid lifts
 * off the neck, and the lids beside it rise a little, staggered from it. At
 * rest one lid sits ajar, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (cloches).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 25, R = 9, CZ = 13, LIFT = 13, FAV = 2, HS = [21, 18, 23, 19.5, 22];
const X1 = (N - 1) * STEP + 2 * R;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-4, -4, 0], [X1 + 4, 2 * R + 4, 0], [X1 + 4, -4, 0], [-4, 2 * R + 4, 0], [R, R, CZ + 23 + 9 + LIFT + 5], [X1 - R, R, CZ + 23 + 9 + LIFT + 5]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const [x, y] of [[0, 0], [X1, 0], [0, 2 * R], [X1, 2 * R]]) put(solid(g), prism(P, front, disc(x, y, 1.8, 16), null, 0, CZ - 3));
  const [pr, pi] = rings(-4, -4, X1 + 4, 2 * R + 4, 3, 1.2);
  put(solid(g), prism(P, front, pr, pi, CZ - 3, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R, H = HS[k], grp = mk("g", {}, g), pts = [];
    for (const [z, r] of [[0, R], [H, R], [H + 5, 5.2], [H + 9, 4.6]]) pts.push(...ringAt(P, disc(x, y, r), CZ + z));
    mk("path", { class: "sil", d: poly(hull(pts)) }, grp);
    mk("path", { class: "nf lo", d: open(ringAt(P, run(disc(x, y, R - 0.4), front), CZ + H)) }, grp);
    const lid = mk("path", { class: "sil" }, grp), knob = mk("path", { class: "nf" }, grp);
    items.push({ k, x, y, H, lid, knob, z: tween(k === FAV ? 6 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const L = CZ + it.H + 9 + lift;
    it.lid.setAttribute("d", poly(hull(ringAt(P, disc(it.x, it.y, 5.8), L).concat(ringAt(P, disc(it.x, it.y, 5.8), L + 2.4)))));
    it.knob.setAttribute("d", poly(hull(ringAt(P, disc(it.x, it.y, 1.8, 16), L + 2.4).concat(ringAt(P, disc(it.x, it.y, 1.8, 16), L + 4.6)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, CZ + it.H / 2));
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
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? 6 : 0) : dd === 0 ? LIFT : dd === 1 ? 3 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "churn " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "milkcans",
  means: "Five milk churns on a dairy platform: the lid of the churn under the pointer lifts, and its neighbours' lids rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[122, 84], [200, 123], [278, 162], null],
  mount,
});
