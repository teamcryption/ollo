/**
 * Pill organiser: a weekly tray of seven compartments, each with its own
 * hinged lid. The pointer picks a day by where it stands: that lid swings
 * open on its back hinge to show the pills, and the lids beside it crack
 * open a little, staggered from it. At rest one lid stands half open,
 * bright. The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, hull, poly, open, prism, proj, rings, ringAt, tdone, tset, tval, tween, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 7, W = 22, D = 26, H = 12, T = 1.6, OPEN = 105, FAV = 2;
const X1 = N * W;
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[0, 0, 0], [X1, D, 0], [X1, 0, 0], [0, D, 0], [0, 0, H + D + 2], [X1, 0, H + D + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, X1, D, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, H));

  // lid corner in world space: s along depth from the hinge, t through the thickness
  const lidPt = (x, s, t, a) => {
    const c = Math.cos(rad(a)), n = Math.sin(rad(a));
    return P(x, s * c - t * n, H + s * n + t * c);
  };
  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * W + 1.2, x1 = (k + 1) * W - 1.2, grp = mk("g", {}, g);
    // the pills: two capsules and a round tablet sitting in the well
    const pills = [[x0 + 6, D * 0.45, 2.6], [x0 + 13, D * 0.62, 2.2], [x0 + 9, D * 0.78, 2.4]].slice(0, 1 + (k % 3));
    for (const [px, py, r] of pills) mk("path", { d: poly(hull(ringAt(P, disc(px, py, r), H - 0.4).concat(ringAt(P, disc(px, py, r), H + 1.2)))), class: "lo" }, grp);
    const lid = mk("path", { class: "sil" }, grp), top = mk("path", { class: "nf lo" }, grp), tab = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x0, x1, lid, top, tab, a: tween(k === FAV ? 55 : 0), last: NaN });
  }

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const pts = [];
    for (const x of [it.x0, it.x1]) for (const s of [0, D]) for (const t of [0, T]) pts.push(lidPt(x, s, t, a));
    it.lid.setAttribute("d", poly(hull(pts)));
    it.top.setAttribute("d", open([lidPt(it.x0 + 1, D - 1, T, a), lidPt(it.x1 - 1, D - 1, T, a)]));
    const m = (it.x0 + it.x1) / 2;
    it.tab.setAttribute("d", poly([lidPt(m - 4, D, 0, a), lidPt(m - 3, D + 3, 0, a), lidPt(m + 3, D + 3, 0, a), lidPt(m + 4, D, 0, a)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, D / 2, H));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), to = a < 0 ? (k === FAV ? 55 : 0) : dd === 0 ? OPEN : dd === 1 ? 18 : 0;
      tset(it.a, to, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : DAYS[a];
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "bloodpressure",
  means: "A weekly pill organiser: the day's lid under the pointer swings open on its hinge, and the lids beside it crack open.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[102, 136], [265, 217], [298, 234], null],
  mount,
});
