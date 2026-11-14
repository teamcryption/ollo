/**
 * Seat row: a gate's row of four seats on one long beam, two feet under it,
 * each seat a tall back and a pan hinged at its foot. Empty pans stand folded
 * up against their backs. The pointer picks a seat by where it is along the
 * row: its pan folds down flat, the others fold up, staggered from it. At rest
 * one pan is down, bright, and the rest stand at uneven angles.
 *
 * The pattern: one of many in a single row (riffle); the hit is each seat's
 * rest centre, nearest along screen x.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rad, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, W = 14, GAP = 2.5, X1 = N * (W + GAP) - GAP, YB = 0, PZ = 17, D = 15, T = 2.2;
const REST = [86, 0, 72, 90], FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.35);
  fit(C, [[-3, -2, 0], [X1 + 3, D + 6, 0], [X1 + 3, -2, 0], [-3, D + 6, 0], [0, YB, 44], [X1, YB, 44]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // two feet and the beam
  [[2, 10], [X1 - 10, X1 - 2]].forEach(([a, b]) => {
    const [r, i] = rings(a, 1, b, 13, 2.5, 0.8);
    put(solid(g), prism(P, front, r, i, 0, 2));
    const [r2, i2] = rings((a + b) / 2 - 1.5, 5, (a + b) / 2 + 1.5, 8, 1.4, 0.5);
    put(solid(g), prism(P, front, r2, i2, 2, 12));
  });
  const [br, bi] = rings(-2, 3, X1 + 2, 10, 3, 0.9);
  put(solid(g), prism(P, front, br, bi, 12, 15.5));

  const seats = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * (W + GAP), grp = mk("g", {}, g);
    const back = solid(grp), [r, i] = rings(x0, YB, x0 + W, YB + 2.6, 1.2, 0.5);
    put(back, prism(P, front, r, i, PZ, 44));
    seats.push({ k, x0, back, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), a: tween(REST[k]), last: NaN });
  }
  // a pan: a rounded slab in the y–z plane, turned about its hinge by angle a, given its width along x
  function pan(x, a) {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), hy = YB + 3.4, hz = PZ;
    const pts = [[0, 0], [D, 0], [D, T], [0, T]].map(([u, v]) => [hy + u * c - v * s, hz + u * s + v * c]);
    return fillet(pts, [1, 1, 1, 1], 3).map(([y, z]) => [x, y, z]);
  }
  function draw(s, a) {
    if (a === s.last) return;
    s.last = a;
    const near = pan(s.x0 + W - 0.6, a), far = pan(s.x0 + 0.6, a);
    s.sil.setAttribute("d", poly(hull(near.concat(far).map((p) => P(...p)))));
    s.cr.setAttribute("d", open(near.map((p) => P(...p))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    seats.forEach((s) => { draw(s, tval(s.a, now)); if (!tdone(s.a, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest seat by its rest centre's screen x, inside the row's band
  const cxs = seats.map((s) => P(s.x0 + W / 2, YB + 8, PZ)[0]);
  const box = [P(0, D + 6, 0)[0] - 6, P(X1, 0, 0)[0] + 6, P(0, 0, 46)[1], P(X1, D + 6, 0)[1] + 6];
  function hit([sx, sy]) {
    if (sx < box[0] || sx > box[1] || sy < box[2] || sy > box[3]) return -1;
    let best = 0;
    cxs.forEach((c, k) => { if (Math.abs(c - sx) < Math.abs(cxs[best] - sx)) best = k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    seats.forEach((s, k) => {
      tset(s.a, a < 0 ? REST[k] : k === a ? 0 : 90, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      s.sil.classList.toggle("hi", on);
      s.back.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "seat " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = clamp(v, 0, 90); }, destroy: bag.dispose };
}

hairline({
  name: "neckpillow",
  means: "A gate's row of four seats on a beam: the seat under the pointer folds its pan down, the others fold up after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[140, 149], [197, 177], [256, 207], null],
  mount,
});
