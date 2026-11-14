/**
 * Warehouse robots: three low drive units, each parked under a shelf pod on
 * four legs. The pointer picks a robot by where it stands: its lift column
 * rises and carries the pod off the floor, and the pods beside it lift a
 * little, staggered from it. At rest one pod is raised, bright. The slider
 * is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 46, H = 16, RB = 11, RZ = 7, LEG = 10, BODY = 30, LIFT = 16, FAV = 0;
const X1 = (N - 1) * STEP + 2 * H;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-4, -4, 0], [X1 + 4, 2 * H + 4, 0], [X1 + 4, -4, 0], [-4, 2 * H + 4, 0], [H, H, LEG + BODY + LIFT + 2], [X1 - H, H, LEG + BODY + LIFT + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = H + k * STEP, y = H, grp = mk("g", {}, g);
    // the floor mark the robot parks on, behind everything of its own
    mk("path", { d: poly(ringAt(P, rings(x - H - 2, y - H - 2, x + H + 2, y + H + 2, 4, 1)[0], 0)), class: "nf dash" }, grp);
    const legsBack = mk("path", { class: "nf lo" }, grp);
    const [br, bi] = rings(x - RB, y - RB, x + RB, y + RB, 5, 1.6);
    const bot = solid(grp);
    put(bot, prism(P, front, br, bi, 0, RZ));
    const col = solid(grp), legFront = mk("path", { class: "nf lo" }, grp), pod = solid(grp);
    const shelves = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, col, legsBack, legFront, pod, shelves, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const { x, y } = it, b0 = LEG + lift, b1 = b0 + BODY, c = H - 2;
    const leg = (u, v) => seg(P(x + u, y + v, lift), P(x + u, y + v, b0));
    it.legsBack.setAttribute("d", leg(-c, -c) + leg(c, -c) + leg(-c, c));
    it.legFront.setAttribute("d", leg(c, c));
    put(it.col, prism(P, front, disc(x, y, 5), disc(x, y, 3.6), RZ, b0));
    const [pr, pi] = rings(x - H, y - H, x + H, y + H, 4, 1.6);
    put(it.pod, prism(P, front, pr, pi, b0, b1));
    const fr = run(pr, front);
    it.shelves.setAttribute("d", open(ringAt(P, fr, b0 + BODY / 3)) + open(ringAt(P, fr, b0 + (2 * BODY) / 3)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, LEG + BODY / 2));
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
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.pod.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bot " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "robotcart",
  means: "Three warehouse robots under shelf pods: the robot under the pointer lifts its pod off the floor, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 140], [200, 165], [250, 190], null],
  mount,
});
