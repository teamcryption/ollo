/**
 * Egg cartons: three cartons in a row, each a tray of six eggs under a lid
 * hinged at its back edge. The pointer picks a carton by where it stands:
 * its lid swings open to show the eggs, and the lids beside it crack open a
 * little, staggered from it. At rest one lid stands half open, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 46, W = 34, D = 24, BZ = 10, TH = 7, OPEN = 105, FAV = 1;
const X1 = (N - 1) * STEP + W;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const LID = rrect(0, 0, W, D, 4, 4), LIN = rrect(2, 2, W - 2, D - 2, 2.5, 4);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-2, -10, 0], [X1 + 2, D + 2, 0], [X1 + 2, -10, 0], [-2, D + 2, 0], [0, 0, BZ + D + 2], [X1, 0, BZ + D + 2]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, grp = mk("g", {}, g);
    const [br, bi] = rings(x0, 0, x0 + W, D, 4, 1.6);
    put(solid(grp), prism(P, front, br, bi, 0, BZ));
    const lidBack = mk("g", {}, grp), eggs = mk("g", {}, grp), lidFront = mk("g", {}, grp);
    for (let j = 0; j < 2; j++) for (let i = 0; i < 3; i++) {
      const ex = x0 + 6 + i * 11, ey = 6 + j * 12, pts = [];
      for (const [r, z] of [[4.6, 0], [4.3, 2], [3.4, 4.2], [1.6, 5.8]]) pts.push(...ringAt(P, disc(ex, ey, r), BZ - 1 + z));
      mk("path", { d: poly(hull(pts)), class: "nf" }, eggs);
    }
    const lid = mk("g", {}, lidFront);
    const sil = mk("path", { class: "sil" }, lid), cr = mk("path", { class: "nf lo" }, lid);
    items.push({ k, x0, lid, lidBack, lidFront, sil, cr, a: tween(k === FAV ? 55 : 0), last: NaN, back: false });
  }

  function lidPts(it, ring, w, a) {
    const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
    return ring.map((q) => P(it.x0 + q.u, q.v * c - w * s, BZ + q.v * s + w * c));
  }
  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    it.sil.setAttribute("d", poly(hull(lidPts(it, LID, 0, a).concat(lidPts(it, LID, TH, a)))));
    it.cr.setAttribute("d", poly(lidPts(it, LIN, TH, a)));
    const back = a > 80;
    if (back !== it.back) { it.back = back; (back ? it.lidBack : it.lidFront).appendChild(it.lid); }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + W / 2, D / 2, BZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), ang = a < 0 ? (k === FAV ? 55 : 0) : dd === 0 ? OPEN : dd === 1 ? 14 : 0;
      tset(it.a, ang, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "box " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "eggcartons",
  means: "Three egg cartons in a row: the lid under the pointer swings open to show six eggs, and its neighbours crack open a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[119, 149], [193, 186], [268, 224], null],
  mount,
});
