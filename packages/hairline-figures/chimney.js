/**
 * Chimneys: a gabled house with three chimney stacks along its ridge, each
 * topped by a flat cap on a pot. The pointer picks a stack by where it stands:
 * its cap lifts clear of the pot, and the caps beside it lift a little,
 * staggered from it. At rest the middle cap is raised, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, L = 130, D = 60, EAVE = 38, RIDGE = 66, ST0 = 60, ST1 = 88, LIFT = 20, FAV = 1;
const XS = [26, 65, 104], REST = [3, LIFT * 0.7, 0];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[0, 0, 0], [L, D, 0], [L, 0, 0], [0, D, 0], [XS[0], 30, ST1 + LIFT + 4], [XS[2], 30, ST1 + LIFT + 4]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the house: walls and a gable roof, one hull, with its eave and rake as creases
  const pts = [...ringAt(P, rrect(0, 0, L, D, 3, 4), 0), ...ringAt(P, rrect(-3, -3, L + 3, D + 3, 3, 4), EAVE),
    ...ringAt(P, rrect(-3, 29, L + 3, 31, 1, 4), RIDGE)];
  const house = solid(g);
  house.sil.setAttribute("d", poly(hull(pts)));
  house.cr.setAttribute("d", seg(P(0, D + 3, EAVE), P(L + 3, D + 3, EAVE)) + seg(P(L + 3, D + 3, EAVE), P(L + 3, 30, RIDGE)) +
    seg(P(0, D, 2), P(L, D, 2)));
  // a door on the long wall
  mk("path", { d: poly([P(40, D, 0), P(40, D, 22), P(54, D, 22), P(54, D, 0)]), class: "nf lo" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = XS[k], grp = mk("g", {}, g);
    const [r0, i0] = rings(x - 7, 23, x + 7, 37, 2, 1.4);
    put(solid(grp), prism(P, front, r0, i0, ST0, ST1));
    put(solid(grp), prism(P, front, disc(x, 30, 3.4), disc(x, 30, 2.2), ST1, ST1 + 5));
    const cap = solid(grp);
    items.push({ k, x, cap, z: tween(REST[k]), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const [a, b] = rings(it.x - 9, 21, it.x + 9, 39, 2.5, 1.6);
    put(it.cap, prism(P, front, a, b, ST1 + 5 + lift, ST1 + 8 + lift));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 30, ST1));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && sy > mids[best][1] - 70 && sy < mids[best][1] + 50 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : 5;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.cap.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "flue " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "chimney",
  means: "A gabled house with three chimneys on its ridge: the cap on the stack under the pointer lifts off its pot, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[155, 59], [200, 82], [245, 103], null],
  mount,
});
