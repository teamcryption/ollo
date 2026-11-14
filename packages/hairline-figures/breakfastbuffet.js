/**
 * Breakfast buffet: three oblong chafing dishes on a long serving table, each
 * pan standing on a low frame with a lid hinged at its back edge. The pointer
 * picks a pan by where it stands along the row: its lid swings open to show
 * the food tray, and the lids beside it crack open a little, staggered from
 * it. At rest the middle lid stands half open, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), a hinged lid per item.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, PW = 44, PD = 30, GAP = 10, TZ = 8, FZ = 6, PZ = 10, OPEN = 105, FAV = 1;
const X1 = N * PW + (N + 1) * GAP, Y1 = PD + 2 * GAP;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  const topZ = TZ + FZ + PZ;
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [GAP, GAP, topZ + PD + 4], [X1 - GAP, GAP, topZ + PD + 4]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(0, 0, X1, Y1, 5, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = GAP + k * (PW + GAP), y0 = GAP, x1 = x0 + PW, y1 = y0 + PD, grp = mk("g", {}, g);
    // the frame: a low stand under the pan
    const [fr, fi] = rings(x0 + 3, y0 + 3, x1 - 3, y1 - 3, 3, 1);
    put(solid(grp), prism(P, front, fr, fi, TZ, TZ + FZ));
    const [pr, pi] = rings(x0, y0, x1, y1, 5, 1.6);
    put(solid(grp), prism(P, front, pr, pi, TZ + FZ, topZ));
    // the food tray inside, seen when the lid opens
    mk("path", { d: poly(ringAt(P, rrect(x0 + 4, y0 + 4, x1 - 4, y1 - 4, 3, 4), topZ)), class: "nf lo" }, grp);
    for (let j = 0; j < 3; j++) mk("path", { d: poly(hull(ringAt(P, rrect(x0 + 9 + j * 10, y0 + 10, x0 + 15 + j * 10, y1 - 10, 3, 3), topZ).concat(ringAt(P, rrect(x0 + 10 + j * 10, y0 + 11, x0 + 14 + j * 10, y1 - 11, 2, 3), topZ + 2)))), class: "nf lo" }, grp);
    const lid = mk("path", { class: "sil" }, grp), lcr = mk("path", { class: "nf lo" }, grp), knob = mk("path", { class: "nf" }, grp);
    items.push({ k, x0, y0, x1, y1, lid, lcr, knob, a: tween(k === FAV ? OPEN * 0.5 : 0), last: NaN });
  }

  const outer = (it) => rrect(it.x0, it.y0, it.x1, it.y1, 5, 4), inner = (it) => rrect(it.x0 + 2, it.y0 + 2, it.x1 - 2, it.y1 - 2, 3, 4);
  // a point of the lid, rotated about the hinge on the back edge (y = y0, z = topZ)
  const rot = (it, a) => { const c = Math.cos(a), s = Math.sin(a); return (u, v, h) => { const dy = v - it.y0; return P(u, it.y0 + dy * c - h * s, topZ + dy * s + h * c); }; };
  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const R = rot(it, (deg * Math.PI) / 180), o = outer(it), ii = inner(it);
    const pts = o.map((q) => R(q.u, q.v, 0)).concat(o.map((q) => R(q.u, q.v, 2)));
    for (const q of rrect(it.x0 + 6, it.y0 + 5, it.x1 - 6, it.y1 - 5, 6, 4)) pts.push(R(q.u, q.v, 6));
    it.lid.setAttribute("d", poly(hull(pts)));
    it.lcr.setAttribute("d", poly(rrect(it.x0 + 8, it.y0 + 7, it.x1 - 8, it.y1 - 7, 5, 4).map((q) => R(q.u, q.v, 6))));
    const mx = (it.x0 + it.x1) / 2, my = (it.y0 + it.y1) / 2, kn = rrect(mx - 5, my - 1.5, mx + 5, my + 1.5, 1.5, 3);
    it.knob.setAttribute("d", poly(hull(kn.map((q) => R(q.u, q.v, 6)).concat(kn.map((q) => R(q.u, q.v, 9))))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, (it.y0 + it.y1) / 2, topZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 50 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), v = a < 0 ? (k === FAV ? OPEN * 0.5 : 0) : dd === 0 ? OPEN : dd === 1 ? 14 : 0;
      tset(it.a, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tray " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "breakfastbuffet",
  means: "Three chafing dishes on a buffet table: the lid under the pointer swings open on its hinge, and its neighbours crack open.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[127, 135], [271, 207], [199, 171], null],
  mount,
});
