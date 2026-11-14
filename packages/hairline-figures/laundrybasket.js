/**
 * Laundry baskets: three woven hampers of different heights on a mat, each
 * with a hinged lid and a hand slot. The pointer picks a hamper by where it
 * stands: its lid swings open on the back hinge to show the folded washing,
 * and the hampers beside it crack theirs, staggered from it. At rest one lid
 * stands ajar, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, fillet, hull, open, poly, prism, proj, rad, rings, ringAt, rrect, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, W = 34, D = 28, GAP = 12, Z0 = 2, HS = [30, 38, 33], FAV = 1, OPEN = 100, AJAR = 68;
const X1 = N * W + (N - 1) * GAP;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  const top = Z0 + Math.max(...HS);
  fit(C, [[-8, -8, 0], [X1 + 8, D + 8, 0], [X1 + 8, -8, 0], [-8, D + 8, 0], [0, -2, top + D + 3], [X1, -2, top + D + 3]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(-8, -8, X1 + 8, D + 8, 6, 2);
  put(solid(g), prism(P, front, mr, mi, 0, Z0));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * (W + GAP), x1 = x0 + W, T = Z0 + HS[k], grp = mk("g", {}, g);
    const [br, bi] = rings(x0, 0, x1, D, 6, 2);
    put(solid(grp), prism(P, front, br, bi, Z0, T));
    // the weave: two bands round the visible faces
    for (const f of [0.33, 0.62]) mk("path", { d: open(ringAt(P, run(br, front), Z0 + HS[k] * f)), class: "nf lo" }, grp);
    // the hand slot on the front face
    const xm = (x0 + x1) / 2, slot = [[xm - 6, D, T - 7], [xm + 6, D, T - 7], [xm + 6, D, T - 3.5], [xm - 6, D, T - 3.5]].map((p) => P(...p));
    mk("path", { d: poly(fillet(slot, [1.5, 1.5, 1.5, 1.5])), class: "nf lo" }, grp);
    // the washing folded inside, seen once the lid lifts
    mk("path", { d: poly(ringAt(P, rrect(x0 + 5, 5, x1 - 5, D - 5, 4, 4), T)), class: "nf lo" }, grp);
    mk("path", { d: open([P(x0 + 6, D / 2 - 2, T), P(x1 - 9, D / 2 + 1, T), P(x1 - 6, D / 2 + 5, T)]), class: "nf lo" }, grp);
    const lid = mk("path", { class: "sil" }, grp), lcr = mk("path", { class: "nf lo" }, grp);
    const ring = rrect(x0 - 1, -1, x1 + 1, D + 1, 7, 6), inner = rrect(x0 + 1.5, 1.5, x1 - 1.5, D - 1.5, 5, 6);
    items.push({ k, x0, x1, T, lid, lcr, ring, inner, a: tween(k === FAV ? AJAR : 0), last: NaN });
  }

  // a lid point (u, v) at thickness dz, swung by ang about the back hinge
  const swing = (it, u, v, dz, ang) => {
    const dy = v + 1, c = Math.cos(rad(ang)), s = Math.sin(rad(ang));
    return P(u, -1 + dy * c - dz * s, it.T + dy * s + dz * c);
  };
  function draw(it, ang) {
    if (ang === it.last) return;
    it.last = ang;
    const pts = [];
    for (const q of it.ring) pts.push(swing(it, q.u, q.v, 0, ang), swing(it, q.u, q.v, 2.2, ang));
    it.lid.setAttribute("d", poly(hull(pts)));
    it.lcr.setAttribute("d", poly(it.inner.map((q) => swing(it, q.u, q.v, 2.2, ang))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, D / 2, it.T / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), ang = a < 0 ? (k === FAV ? AJAR : 0) : dd === 0 ? OPEN : dd === 1 ? 14 : 0;
      tset(it.a, ang, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bin " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "laundrybasket",
  means: "Three woven hampers on a mat: the lid under the pointer swings open on its hinge, and its neighbours crack theirs.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[128, 165], [184, 147], [238, 190], null],
  mount,
});
