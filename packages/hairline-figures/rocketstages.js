/**
 * Rocket stages: a three-stage rocket with a nose cone, standing on a launch
 * pad. The pointer picks a stage by its height on screen: the joint under it
 * opens and everything above lifts away, the joints beside it part a little,
 * staggered from it. At rest the upper stage has already separated, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single column.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 11, PZ = 4, GAP = 18, FAV = 2;
const STAGES = [[0, 42, R], [0, 30, R], [0, 20, R - 1.5], [0, 22, 0]];
const disc = (r, n = 32) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  const TOT = STAGES.reduce((s, q) => s + q[1], 0);
  fit(C, [[-30, -30, 0], [30, 30, 0], [30, -30, 0], [-30, 30, 0], [0, 0, PZ + TOT + GAP + 10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-30, -30, 30, 30, 8, 2);
  put(solid(g), prism(P, front, pr, pi, 0, PZ));
  // the launch ring: a low collar the first stage stands in
  put(solid(g), prism(P, front, disc(R + 5), disc(R + 3), PZ, PZ + 2));

  const parts = [];
  let base = PZ + 2;
  STAGES.forEach(([, h, r], k) => {
    const grp = mk("g", {}, g), s = solid(grp);
    const band = mk("path", { class: "nf lo" }, grp);
    parts.push({ k, z0: base, h, r, grp, s, band, gap: tween(k === FAV ? 7 : 0), last: NaN });
    base += h;
  });
  const top = base;

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = it.z0 + lift, z1 = z0 + it.h;
    if (it.k === 3) {
      // the nose: a cone tapering from the stage's radius to a point
      const foot = disc(R - 1.5), tip = disc(0.8, 12);
      it.s.sil.setAttribute("d", poly(hull(ringAt(P, foot, z0).concat(ringAt(P, tip, z1)))));
      it.s.cr.setAttribute("d", "");
      it.band.setAttribute("d", "");
      return;
    }
    put(it.s, prism(P, front, disc(it.r), disc(it.r - 1.5), z0, z1));
    // an interstage band: one dim ring a few units above the stage's foot
    const bz = z0 + Math.min(6, it.h * 0.2), ring = ringAt(P, disc(it.r), bz);
    it.band.setAttribute("d", "M" + ring.filter((_, i) => front(disc(it.r)[i])).map((p) => p.join(",")).join("L"));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false, acc = 0;
    for (const it of parts) { acc += tval(it.gap, now); draw(it, acc); if (!tdone(it.gap, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = parts.map((it) => P(0, 0, it.z0 + it.h / 2));
  function hit([sx, sy]) {
    if (Math.abs(sx - mids[0][0]) > 45) return -1;
    if (sy > P(0, 0, PZ)[1] + 10 || sy < P(0, 0, top + GAP)[1]) return -1;
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    parts.forEach((it, k) => {
      const d = Math.abs(k - a), z = a < 0 ? (k === FAV ? 7 : 0) : d === 0 ? GAP : d === 1 ? 4 : 0;
      tset(it.gap, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : a === 3 ? "nose" : "stg " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "rocketstages",
  means: "A three-stage rocket on its pad: the stage under the pointer separates from the one below, and the joints beside it part a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 215], [200, 162], [200, 100], null],
  mount,
});
