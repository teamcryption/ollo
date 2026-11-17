/**
 * Film splicer: a block with a strip of film laid across it and a press arm
 * hinged at its back edge. The pointer swings the arm down onto the film,
 * further the further right it stands. At rest the arm stands open, bright.
 * The slider is how far the arm can open.
 *
 * The pattern: one part swinging on a hinge (spring).
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, spring, stepS, clamp, rad, seg, disposer, mk, pointer, put, register, solid } = HL;

const BX = 52, BY = 26, BZ = 16, FX = 92, FY = 11, REST = 62;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-FX, -BY, 0], [FX, BY, 0], [FX, -BY, 0], [-FX, BY, 0], [-BX, -BY - 20, BZ + 54], [BX, -BY - 20, BZ + 54]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-BX, -BY, BX, BY, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const [fr, fi] = rings(-FX, -FY, FX, FY, 2, 0.8);
  put(solid(g), prism(P, front, fr, fi, BZ, BZ + 1));
  let holes = "";
  for (let x = -FX + 6; x < FX; x += 10) for (const y of [-FY + 3, FY - 3]) holes += seg(P(x - 2, y, BZ + 1), P(x + 2, y, BZ + 1));
  mk("path", { d: holes, class: "nf lo" }, g);
  for (const x of [-BX + 8, BX - 8]) { const [pr, pi] = rings(x - 4, -BY, x + 4, -BY + 8, 2, 0.8); put(solid(g), prism(P, front, pr, pi, BZ, BZ + 10)); }
  const arm = mk("path", { class: "sil hi" }, g), crease = mk("path", { class: "nf lo" }, g);
  const [ar, ai] = rings(-BX + 2, 0, BX - 2, 2 * BY - 4, 5, 2);
  const HY = -BY + 4, HZ = BZ + 6;
  const at = (q, h, f) => { const c = Math.cos(f), s = Math.sin(f); return P(q.u, HY + q.v * c - h * s, HZ + q.v * s + h * c); };
  const ang = spring(REST);
  let last = NaN;
  function draw() {
    if (ang.x === last) return;
    last = ang.x;
    const f = rad(ang.x), pts = [];
    for (const q of ar) pts.push(at(q, 0, f), at(q, 5, f));
    arm.setAttribute("d", poly(hull(pts)));
    crease.setAttribute("d", poly(ai.map((q) => at(q, 5, f))));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(t) {
    ang.t = t;
    read.textContent = t === REST ? "rest" : Math.round(t) + "°";
    B.wake();
  }
  aim(REST);
  bag.add(pointer(stage, { move: ([sx]) => aim(Math.round((1 - clamp((sx - 60) / 280, 0, 1)) * max)), leave: () => aim(REST) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "clapperboard2",
  means: "A film splicer with a strip of film across its block: the pointer swings the hinged press arm down onto the film.",
  rules: [3, 5, 6, 8],
  range: [50, 75, 80],
  tour: [[200, 154], [138, 160], [262, 222], null],
  mount,
});
