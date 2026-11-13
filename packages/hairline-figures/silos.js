/**
 * Silos: a farm row of four grain silos of different heights on a concrete
 * pad, each a round bin with a shallow domed roof and a square hatch at its
 * crown, joined by a conveyor gallery running between them. The pointer
 * picks a silo by where it stands: its roof hatch swings open on its hinge,
 * and the hatches beside it lift a little, staggered from it. At rest one
 * hatch is ajar, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the silo
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, circ, facing, fit, hull, open, poly, prism, proj, rad, rings, ringAt, rrect, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 34, R = 12, DH = 6.5, H = [54, 70, 44, 62], OPEN = 80, NEAR = 26, FAV = 2, AJAR = 40, HS = 4.5;
const X1 = (N - 1) * STEP + 2 * R;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-6, -6, -3], [X1 + 6, 2 * R + 6, -3], [X1 + 6, -6, -3], [-6, 2 * R + 6, -3], [R + STEP, R - HS, H[1] + DH + 2 * HS + 1]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-6, -6, X1 + 6, 2 * R + 6, 5, 1.8);
  put(solid(g), prism(P, front, pr, pi, -3, 0));

  const silos = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R, h = H[k], grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, R), disc(x, y, R - 1.2), 0, h));
    // the domed roof and its eave line
    const pts = [];
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(x, y, R * Math.cos(t) + 0.01, 32), h + DH * Math.sin(t))); }
    mk("path", { d: poly(hull(pts)), class: "sil" }, grp);
    mk("path", { d: open(ringAt(P, run(disc(x, y, R - 0.8), front), h + 0.8)) + poly(ringAt(P, rrect(x - HS, y - HS, x + HS, y + HS, 0.8, 3), h + DH - 0.1)), class: "nf lo" }, grp);
    const lid = mk("path", { class: "sil" }, grp);
    silos.push({ k, x, y, h, grp, lid, a: tween(k === FAV ? AJAR : 0), last: NaN });
    // the conveyor gallery to the next silo, eave to eave, painted before it so the next roof covers its end
    if (k < N - 1) {
      const xa = x + R - 3, xb = x + STEP - R + 3, za = h + 2, zb = H[k + 1] + 2, gs = solid(g);
      const sec = (xx, z) => [[xx, y - 2, z], [xx, y + 2, z], [xx, y + 2, z + 3], [xx, y - 2, z + 3]].map((q) => P(...q));
      gs.sil.setAttribute("d", poly(hull(sec(xa, za).concat(sec(xb, zb)))));
      gs.cr.setAttribute("d", open([P(xa, y + 2, za + 2.2), P(xb, y + 2, zb + 2.2)]));
    }
  }
  const lidRing = rrect(-HS, 0, HS, 2 * HS, 0.8, 3);

  function draw(s, deg) {
    if (deg === s.last) return;
    s.last = deg;
    const a = rad(deg), c = Math.cos(a), sn = Math.sin(a), yh = s.y - HS, zh = s.h + DH;
    const pts = [];
    for (const th of [0, 0.9]) for (const q of lidRing) pts.push(P(s.x + q.u, yh + q.v * c - th * sn, zh + q.v * sn + th * c));
    s.lid.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const s of silos) { draw(s, tval(s.a, now)); if (!tdone(s.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = silos.map((s) => P(s.x, s.y, s.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    silos.forEach((s, k) => {
      const d = Math.abs(k - a), deg = a < 0 ? (k === FAV ? AJAR : 0) : d === 0 ? OPEN : d === 1 ? NEAR : 0;
      tset(s.a, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      s.lid.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "silo " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "silos",
  means: "Four grain silos in a row: the roof hatch of the silo under the pointer swings open, its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[121, 66], [226, 138], [279, 130], null],
  mount,
});
