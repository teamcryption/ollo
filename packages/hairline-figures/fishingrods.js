/**
 * Fishing rods: a stand on a lakeside bank holding four rods in tubes, each
 * with a reel under its butt and a line running down to a float on the
 * water. The pointer is the bite: each rod bends toward it on its own
 * springs, the one under it bends most and is bright. At rest the rods lean
 * a little apart, one bent, bright. The slider is how far the pull reaches.
 *
 * The pattern: a continuous aim (springs per rod); the pick is the rod whose
 * resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, circ, clamp, facing, fit, open, poly, prism, proj, rings, ringAt, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 22, X0 = 12, BY = 6, BZ = 9, L = 72, FAV = 1;
const X1 = 2 * X0 + (N - 1) * STEP;
const LAT0 = [-0.06, 0.03, -0.02, 0.07], DIP0 = [0.1, 0.45, 0.16, 0.05];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const rodPt = (x, lat, dip, t) => [x + lat * L * t * t, BY + 0.42 * L * t + dip * 14 * t * t, BZ + 0.86 * L * t - dip * 26 * t * t];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, last = null;
  const C = Cam(45, 0.5, 2.15);
  const ext = [[-6, -8, -3], [X1 + 6, 24, -3], [X1 + 6, -8, -3], [-6, 24, -3]];
  for (const x of [X0, X1 - X0]) for (const [lat, dip] of [[-0.25, 1], [0.25, 1], [0, 0]]) { const p = rodPt(x, lat, dip, 1); ext.push(p, [p[0] + 4, p[1] + 20, 0]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -8, X1 + 6, 24, 6, 2);
  put(solid(g), prism(P, front, br, bi, -3, 0));
  const water = mk("g", {}, g);
  const [sr, si] = rings(0, 0, X1, 12, 2.5, 1);
  put(solid(g), prism(P, front, sr, si, 0, 4));

  const rods = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g);
    const ripple = mk("path", { class: "nf lo" }, water), line = mk("path", { class: "nf lo" }, water);
    const flo = flatDot(water, C, 1.3, "dot off");
    put(solid(grp), prism(P, front, disc(x, BY, 2.4, 20), disc(x, BY, 1.5, 20), 4, BZ + 3));
    const rod = mk("path", { class: "nf sil" }, grp), reel = solid(grp);
    rods.push({ k, x, ripple, line, flo, rod, reel, lat: spring(LAT0[k]), dip: spring(DIP0[k]), drawn: "" });
  }
  const mids = rods.map((r) => P(...rodPt(r.x, LAT0[r.k], DIP0[r.k], 0.5)));

  function draw(r) {
    const key = r.lat.x.toFixed(4) + "," + r.dip.x.toFixed(4);
    if (key === r.drawn) return;
    r.drawn = key;
    const pts = [];
    for (let i = 0; i <= 14; i++) pts.push(P(...rodPt(r.x, r.lat.x, r.dip.x, 0.06 + (i / 14) * 0.94)));
    r.rod.setAttribute("d", open(pts));
    const [rx, ry, rz] = rodPt(r.x, r.lat.x, r.dip.x, 0.17);
    const [rr, ri] = rings(rx - 1.3, ry - 2.8, rx + 1.3, ry + 2.8, 1.2, 0.5);
    put(r.reel, prism(P, front, rr, ri, rz - 6, rz - 1));
    const tip = rodPt(r.x, r.lat.x, r.dip.x, 1), fx = tip[0] + 2, fy = tip[1] + 16 - r.dip.x * 4;
    r.line.setAttribute("d", open([P(...tip), P(fx, fy, 0)]));
    r.ripple.setAttribute("d", poly(ringAt(P, disc(fx, fy, 3.5 + r.dip.x * 2), 0)));
    place(r.flo, P(fx, fy, 0));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const r of rods) { if (stepS(r.lat, dt)) m = true; if (stepS(r.dip, dt)) m = true; draw(r); }
    return m;
  });
  bag.add(B.unregister);

  function retarget(p) {
    last = p;
    let near = -1, bd = Infinity;
    if (p) mids.forEach((m, k) => { const d = Math.abs(m[0] - p[0]); if (d < bd) { bd = d; near = k; } });
    if (near >= 0 && bd > 34) near = -1;
    for (const r of rods) {
      if (near < 0) { r.lat.t = LAT0[r.k]; r.dip.t = DIP0[r.k]; continue; }
      const d = p[0] - mids[r.k][0], f = Math.max(Math.exp(-((d / reach) ** 2)), 0.06);
      r.lat.t = clamp(d / reach, -1, 1) * 0.24 * f;
      r.dip.t = f;
    }
    rods.forEach((r) => r.rod.classList.toggle("hi", r.k === (near < 0 ? FAV : near)));
    read.textContent = near < 0 ? "rest" : "rod " + (near + 1);
    B.wake();
  }
  retarget(null);
  bag.add(pointer(stage, { move: (p) => retarget(p), leave: () => retarget(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; retarget(last); }, destroy: bag.dispose };
}

hairline({
  name: "fishingrods",
  means: "Four fishing rods on a lakeside stand: the rods bend toward the pointer, the one under it most.",
  rules: [1, 3, 5, 8],
  range: [20, 40, 70],
  tour: [[155, 103], [188, 120], [255, 154], null],
  mount,
});
