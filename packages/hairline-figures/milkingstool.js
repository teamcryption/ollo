/**
 * Milk churn trolley: a low two-wheeled dairy trolley with a handle at the
 * back and three churns standing on its bed, each a tall drum with a sloped
 * shoulder, a neck and a lid. The pointer picks a churn by where it is along
 * the bed: its lid lifts off, the neighbours' lids rattle up a little after.
 * At rest one lid sits ajar, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the hit is the churn
 * whose rest centre is nearest the pointer's screen x.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, run, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 15, X0 = 8, BED = 6, BODY = 26, NECK = 32, LIFT = 16, BUMP = 6;
const REST = [0, 4, 1], FAV = 1, R = 6.2, RN = 3.6;

function ringOf(R, cx, cy, n) { return circ(R, n).map((s) => ({ ...s, u: s.u + cx, v: s.v + cy })); }

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.5);
  fit(C, [[-12, -10, 0], [48, 10, 0], [48, -10, 0], [-12, 10, 0], [-12, 0, 42], [X0 + STEP, 0, NECK + 2 + LIFT * 1.5]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the handle, behind everything: two rails up to a grip
  mk("path", { class: "nf", d: seg(P(-2, -6, BED), P(-11, -6, 40)) + seg(P(-2, 6, BED), P(-11, 6, 40)) + seg(P(-11, -6.5, 40), P(-11, 6.5, 40)) }, g);
  // a wheel: a disc in the x–z plane, with a hub
  function wheel(y) {
    const w = mk("g", {}, g), pts = [], hub = [];
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      pts.push(P(40 + 5.5 * Math.cos(a), y, 5.5 + 5.5 * Math.sin(a)));
      hub.push(P(40 + 1.4 * Math.cos(a), y, 5.5 + 1.4 * Math.sin(a)));
    }
    mk("path", { class: "sil", d: poly(pts) }, w);
    mk("path", { class: "nf lo", d: poly(hub) }, w);
  }
  wheel(-10.5);
  const [br, bi] = rings(-3, -9, 46, 9, 2.2, 1);
  put(solid(g), prism(P, front, br, bi, BED - 2, BED));
  mk("path", { class: "nf lo", d: seg(P(36, -9, BED - 2), P(36, -9, 1)) }, g);

  const churns = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g);
    const body = solid(grp), sh = solid(grp), band = mk("path", { class: "nf lo" }, grp), lid = solid(grp);
    churns.push({ k, x, body, sh, band, lid, z: tween(REST[k]), last: NaN, sx: P(x, 0, BODY)[0] });
  }
  wheel(10.5);

  function drawLid(c, lift) {
    if (lift === c.last) return;
    c.last = lift;
    const r = Math.max(0, lift - 4) * 0.5, x = c.x, ring = ringOf(R, x, 0, 20);
    put(c.body, prism(P, front, ring, ringOf(R - 0.9, x, 0, 20), BED + r, BODY + r));
    const top = ringOf(RN, x, 0, 20), inner = ringOf(RN - 0.7, x, 0, 20);
    put(c.sh, { sil: poly(hull(ringAt(P, ring, BODY + r).concat(ringAt(P, top, NECK + r)))), crease: open(ringAt(P, run(inner, front), NECK + r)) });
    c.band.setAttribute("d", open(ringAt(P, run(ring, front), BED + 5 + r)));
    const z = NECK + lift + r;
    put(c.lid, prism(P, front, ringOf(RN + 0.9, c.x, 0, 20), ringOf(RN, c.x, 0, 20), z, z + 2.2));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    churns.forEach((c) => { drawLid(c, tval(c.z, now)); if (!tdone(c.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the churn whose rest centre is nearest the pointer's x, inside the trolley's band
  const xs = P(-12, 0, 0)[0], xe = P(48, 0, 0)[0], top = P(X0, 0, 48)[1], bot = P(46, 10, 0)[1];
  function hit([sx, sy]) {
    if (sx < Math.min(xs, xe) - 6 || sx > Math.max(xs, xe) + 6 || sy < top || sy > bot + 6) return -1;
    let best = 0;
    churns.forEach((c, k) => { if (Math.abs(c.sx - sx) < Math.abs(churns[best].sx - sx)) best = k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    churns.forEach((c, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : Math.max(0, BUMP - Math.abs(k - a));
      tset(c.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      c.lid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "churn " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "milkingstool",
  means: "A trolley of milk churns: the lid of the churn under the pointer lifts off, the neighbours' lids rattle up after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[175, 129], [212, 147], [249, 166], null],
  mount,
});
