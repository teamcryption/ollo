/**
 * Gelato cabinet: a low display cabinet with three tubs of gelato, each under
 * its own lid hinged along the back. The pointer picks a tub by where it
 * stands: its lid tilts up to show the mound of gelato, and the lids beside it
 * lift a crack, staggered from it. At rest one lid is half open, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), a hinge across the back.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, SW = 44, D = 40, HC = 26, T = 2.5, FAV = 1, OPEN = 1.35;
const REST = [0.1, 0.62, 0.22];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  const X1 = N * SW;
  fit(C, [[0, 0, 0], [X1, D, 0], [X1, 0, 0], [0, D, 0], [0, 0, HC + D], [X1, 0, HC + D]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-2, -2, X1 + 2, D + 2, 4, 2);
  put(solid(g), prism(P, front, cr, ci, 0, HC));
  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * SW, grp = mk("g", {}, g), cx = x0 + SW / 2, cy = D / 2;
    mk("path", { d: poly(ringAt(P, rings(x0 + 4, 4, x0 + SW - 4, D - 4, 3, 1)[0], HC)), class: "nf lo" }, grp);
    const mound = [];
    for (const [r, z] of [[13, 0], [11, 4], [7, 7], [3, 8.5]]) mound.push(...ringAt(P, disc(cx + 1, cy, r), HC + z));
    mk("path", { d: poly(hull(mound)), class: "nf" }, grp);
    const lid = mk("path", { class: "sil" }, grp), face = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x0, lid, face, th: tween(REST[k]), last: NaN });
  }

  function draw(it, th) {
    if (th === it.last) return;
    it.last = th;
    const c = Math.cos(th), s = Math.sin(th);
    const L = (u, v, w) => P(it.x0 + u, v * c - w * s, HC + v * s + w * c);
    const pts = [];
    for (const u of [0.5, SW - 0.5]) for (const v of [0, D]) for (const w of [0, T]) pts.push(L(u, v, w));
    it.lid.setAttribute("d", poly(hull(pts)));
    it.face.setAttribute("d", poly([L(4, 4, T), L(SW - 4, 4, T), L(SW - 4, D - 4, T), L(4, D - 4, T)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.th, now)); if (!tdone(it.th, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + SW / 2, D / 2, HC));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 45 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), th = a < 0 ? REST[k] : dd === 0 ? OPEN : dd === 1 ? 0.2 : 0;
      tset(it.th, th, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tub " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "icecreamscoop",
  means: "A gelato cabinet with three tubs: the lid under the pointer tilts up on its hinge to show the gelato.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[139, 141], [200, 171], [261, 201], null],
  mount,
});
