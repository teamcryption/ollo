/**
 * Stackrings: a ring stacker, five rings of shrinking size on a cone peg on a
 * round base. The pointer picks a ring by its height: it and every ring above
 * it slide up the peg together, staggered from it. At rest the top ring sits
 * raised, bright. The slider is the stagger.
 *
 * The pattern: a stack, picked by rest height.
 */
const { Cam, fit, facing, hull, poly, prism, proj, ringAt, circ, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const N = 5, TH = 8, BZ = 6, LIFT = 22, PH = BZ + N * TH + LIFT + 4;
const RS = [30, 26, 22, 18, 14];
const disc = (r, n = 40) => circ(r, n);
const pr = (z) => 8 - (4 * (z - BZ)) / (PH - BZ);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-36, -36, 0], [36, 36, 0], [36, -36, 0], [-36, 36, 0], [0, 0, PH + LIFT + 6]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(36), disc(34), 0, BZ));
  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), s = solid(grp), hole = mk("path", { class: "nf lo" }, grp), peg = mk("path", { class: "sil" }, grp);
    items.push({ k, s, hole, peg, z: tween(0), last: NaN });
  }
  const tipEl = mk("path", { class: "sil" }, g);
  const pegPath = (z0) => poly(hull(ringAt(P, disc(pr(z0), 20), z0).concat(ringAt(P, disc(pr(PH), 20), PH))));
  function drawAll(now) {
    let moving = false;
    for (const it of items) {
      const lift = tval(it.z, now); if (!tdone(it.z, now)) moving = true;
      if (lift === it.last) continue;
      it.last = lift;
      const z0 = BZ + it.k * TH + lift, r = RS[it.k];
      put(it.s, prism(P, front, disc(r), disc(r - 2), z0, z0 + TH));
      it.hole.setAttribute("d", poly(ringAt(P, disc(pr(z0 + TH) + 1.5, 24), z0 + TH)));
      it.peg.setAttribute("d", pegPath(z0 + TH));
    }
    return moving;
  }
  tipEl.setAttribute("d", poly(ringAt(P, disc(pr(PH), 16), PH)));
  const B = register(stage, (_dt, now) => drawAll(now));
  bag.add(B.unregister);

  const mids = items.map((it) => P(0, 0, BZ + it.k * TH + TH / 2));
  function hit([sx, sy]) {
    if (Math.abs(sx - mids[0][0]) > 90) return -1;
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 40 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    items.forEach((it, k) => {
      const z = a < 0 ? (k === N - 1 ? LIFT * 0.6 : 0) : k >= a ? LIFT : 0;
      tset(it.z, z, now, a < 0 ? 0 : (k - a >= 0 ? k - a : 0) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? N - 1 : a));
    });
    read.textContent = a < 0 ? "rest" : "ring " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "stackrings",
  means: "A ring stacker: the ring under the pointer and every ring above it slide up the cone peg together.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 90],
  tour: [[149, 238], [156, 193], [176, 162], null],
  mount,
});
