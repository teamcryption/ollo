/**
 * Sushi platter: a long low platter holding eight pieces in a row, nigiri
 * (a rice block under a slice of fish) and maki (a roll with its filling on
 * top), with a pair of chopsticks laid on a rest behind it. The pointer picks
 * a piece by where it stands: it lifts off the platter and the pieces beside
 * it lift a little, staggered from it. At rest one roll is raised, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (cloches); the pick is the piece
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, circ, facing, fit, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const KIND = "NMNMMNMN", N = 8, STEP = 22, X0 = 16, PY = 22, PZ = 4, LIFT = 14, FAV = 3;
const X1 = X0 * 2 + STEP * (N - 1);
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[0, -30, 0], [X1, 44, 0], [X1, -30, 0], [0, 44, 0], [X0, PY, PZ + 10 + LIFT], [X1 - X0, PY, PZ + 10 + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // behind the platter: a rest, and chopsticks from the table up onto it
  { const [r, i] = rings(24, -29, 31, -19, 2, 0.8); put(solid(g), prism(P, front, r, i, 0, 4)); }
  for (const y of [-26.6, -22.4]) {
    const a = ringAt(P, disc(26, y, 0.9, 12), 4), b = ringAt(P, disc(118, y + 1.2, 1.2, 12), 0);
    mk("path", { class: "sil", d: poly(hull(a.concat(b, ringAt(P, disc(118, y + 1.2, 1.2, 12), 2.2), ringAt(P, disc(26, y, 0.9, 12), 5.6)))) }, g);
  }
  const [pr, pi] = rings(0, 0, X1, 44, 5, 2.2);
  put(solid(g), prism(P, front, pr, pi, 0, PZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g), kind = KIND[k];
    const it = { k, x, kind, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN, a: solid(grp) };
    if (kind === "N") it.b = solid(grp);
    else { it.fill = mk("path", { class: "nf lo" }, grp); it.dot = flatDot(grp, C, 1.2, "dot off"); }
    items.push(it);
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z = PZ + lift, x = it.x;
    if (it.kind === "N") {
      const [r, i] = rings(x - 5, PY - 9, x + 5, PY + 9, 4, 1);
      put(it.a, prism(P, front, r, i, z, z + 6));
      const [fr, fi] = rings(x - 6.2, PY - 11, x + 6.2, PY + 11, 4.5, 1.6);
      put(it.b, prism(P, front, fr, fi, z + 6, z + 8.4));
    } else {
      put(it.a, prism(P, front, disc(x, PY, 7.5, 40), disc(x, PY, 6.4, 40), z, z + 10));
      it.fill.setAttribute("d", poly(ringAt(P, disc(x, PY, 3.8, 28), z + 10)));
      place(it.dot, P(x, PY, z + 10));
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, PY, PZ + 5));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 16 && Math.abs(mids[best][1] - sy) < 45 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : d === 0 ? LIFT : d === 1 ? 4 : d === 2 ? 1.2 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.a.sil.classList.toggle("hi", on);
      if (it.b) it.b.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "piece " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "sushiplatter",
  means: "Eight pieces of sushi on a long platter: the piece under the pointer lifts, and its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[115, 121], [222, 175], [275, 201], null],
  mount,
});
