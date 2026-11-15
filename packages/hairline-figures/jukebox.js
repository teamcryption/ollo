/**
 * Jukebox: the record rack of a jukebox, discs standing on edge in a
 * cradle. The pointer picks a disc by where it stands: discs before it lean
 * back, discs after it lean forward, staggered from it, and it stands alone
 * in the gap. At rest the gap is at disc 4, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle), flipped open like a crate.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, seg, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 7, STEP = 13, R = 22, TH = 2, BZ = 8, YC = 22, FAV = 3;
const X1 = (N - 1) * STEP + 16;
const lean = (k, a, b, f) => (k < a ? -b - (a - k) * 2 : k > a ? f + (k - a) * 2 : 0);
const restA = (k) => lean(k, FAV, 14, 10);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-6, -10, 0], [X1 + 6, 50, 0], [X1 + 6, -10, 0], [-6, 50, 0], [-24, YC, BZ + 2 * R], [X1 + 24, YC, BZ + 2 * R]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-6, 2, X1 + 6, 42, 6, 2);
  put(solid(g), prism(P, front, cr, ci, 0, BZ));
  mk("path", { d: seg(P(0, YC - 3, BZ), P(X1, YC - 3, BZ)) + seg(P(0, YC + 3, BZ), P(X1, YC + 3, BZ)), class: "nf lo" }, g);
  const ring = circ(R, 36), lab = circ(R * 0.36, 20);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 8 + k * STEP, grp = mk("g", {}, g);
    items.push({ k, x, disc: mk("path", { class: "sil" }, grp), label: mk("path", { class: "nf lo" }, grp), a: tween(restA(k)), last: NaN });
  }

  // a disc point: v along y, w up from the cradle, leaned by phi about its lower edge
  const DP = (x, v, w, phi) => P(x + w * Math.sin(phi), YC + v, BZ + w * Math.cos(phi));
  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const phi = rad(deg), pts = [];
    for (const q of ring) { pts.push(DP(it.x, q.u, R + q.v, phi), DP(it.x + TH, q.u, R + q.v, phi)); }
    it.disc.setAttribute("d", poly(hull(pts)));
    it.label.setAttribute("d", poly(lab.map((q) => DP(it.x + TH, q.u, R + q.v, phi))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, YC, BZ + R));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? restA(k) : lean(k, a, 26, 20);
      tset(it.a, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.disc.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "disc " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "jukebox",
  means: "A jukebox record rack: discs before the pointer lean back, discs after it lean forward, and the picked one stands alone.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[139, 86], [177, 105], [255, 144], null],
  mount,
});
