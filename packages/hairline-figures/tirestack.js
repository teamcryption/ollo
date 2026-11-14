/**
 * Tyre stack: five tyres piled on a floor pad, each a thick ring with its
 * bead hole. The pointer picks a tyre by its height in the pile; the tyres
 * above it lift off together, staggered from it, to show its top. At rest the
 * top two stand a little apart, the second bright. The slider is the stagger.
 *
 * The pattern: one of many in a stack (riffle, stood upright).
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, R = 30, HOLE = 14, H = 11, GAP = 22, FAV = 3, PZ = 3;
const JIT = [[0, 0], [2, -1.5], [-1.5, 1], [1.5, 2], [-1, -1]];
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-R - 10, -R - 10, 0], [R + 10, R + 10, 0], [R + 10, -R - 10, 0], [-R - 10, R + 10, 0], [0, -R, PZ + N * H + GAP], [0, R, PZ + N * H + GAP]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-R - 10, -R - 10, R + 10, R + 10, 8, 2);
  put(solid(g), prism(P, front, pr, pi, 0, PZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const [x, y] = JIT[k], grp = mk("g", {}, g);
    const body = solid(grp), hole = mk("path", { class: "lo" }, grp), lip = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, grp, body, hole, lip, last: NaN });
  }
  const restLift = (k) => (k > FAV ? 7 : 0);
  items.forEach((it) => { it.z = tween(restLift(it.k)); });

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = PZ + it.k * H + lift, z1 = z0 + H - 1;
    put(it.body, prism(P, front, disc(it.x, it.y, R), disc(it.x, it.y, R - 2.2), z0, z1));
    it.hole.setAttribute("d", poly(ringAt(P, disc(it.x, it.y, HOLE, 32), z1)));
    it.lip.setAttribute("d", poly(ringAt(P, disc(it.x, it.y, HOLE + 5, 32), z1)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, PZ + it.k * H + H / 2));
  function hit([sx, sy]) {
    if (Math.abs(sx - mids[0][0]) > R * 2.05 * 1.2) return -1;
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const z = a < 0 ? restLift(k) : k > a ? GAP : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tyre " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tirestack",
  means: "A pile of five tyres: the tyres above the one under the pointer lift off together, staggered, to show its top.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 205], [200, 183], [200, 140], null],
  mount,
});
