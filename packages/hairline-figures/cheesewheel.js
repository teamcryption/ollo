/**
 * Cheese wheels: four wheels lying on an aging board, each a thick round
 * with a rind crease and a wedge already cut. The pointer picks a wheel by
 * where it stands: it lifts off the board to be turned, and the wheels beside
 * it rise a little, staggered from it. At rest one wheel is raised, bright.
 * The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, poly, open, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 42, R = 19, H = 13, BZ = 4, LIFT = 30, FAV = 2;
const X1 = (N - 1) * STEP + 2 * R;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-6, -6, 0], [X1 + 6, 2 * R + 6, 0], [X1 + 6, -6, 0], [-6, 2 * R + 6, 0], [R, R, BZ + H + LIFT + 4], [X1 - R, R, BZ + H + LIFT + 4]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -6, X1 + 6, 2 * R + 6, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R, grp = mk("g", {}, g);
    const s = solid(grp), mid = mk("path", { class: "nf lo" }, grp), cut = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, s, mid, cut, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = BZ + lift, z1 = z0 + H;
    put(it.s, prism(P, front, disc(it.x, it.y, R), disc(it.x, it.y, R - 2), z0, z1));
    // the rind's waist, on the near side only
    const waist = disc(it.x, it.y, R).filter(front);
    it.mid.setAttribute("d", open(ringAt(P, waist, z0 + H / 2)));
    // a wedge cut into the top, pointing at the far corner
    const c = P(it.x, it.y, z1), a = P(it.x - R + 4, it.y - 6, z1), b = P(it.x - 6, it.y - R + 4, z1);
    it.cut.setAttribute("d", seg(c, a) + seg(c, b));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, BZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 65 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "wheel " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cheesewheel",
  means: "Four cheese wheels on an aging board: the wheel under the pointer lifts to be turned, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[122, 137], [174, 133], [278, 215], null],
  mount,
});
