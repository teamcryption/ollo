/**
 * Oil rig: a deck on four legs standing in the water, a tapering derrick at
 * its far corner, a quarters block, and a crane on the near corner. The
 * pointer stands on the sea: the crane's boom swings to face it, clamped to
 * the open water side so it never sweeps the derrick. At rest the boom is
 * turned a little off the deck, bright. The slider is the boom's length.
 *
 * The pattern: one part turns to face the pointer (aim).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rad, rings, ringAt, rrect, run, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const D = 60, DZ0 = 30, DZ1 = 36, PX = 50, PY = 50, PZ = 48, REST = -8, LO = -15, HI = 105;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let len = value;
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-14, -14, 0], [D + 14, D + 14, 0], [D + 14, -14, 0], [-14, D + 14, 0], [17, 17, 98], [PX + 48, PY + 8, 62], [PX + 8, PY + 48, 62]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the sea: a water line round the legs, and a ripple at each
  mk("path", { d: poly(ringAt(P, rrect(-14, -14, D + 14, D + 14, 14, 6), 0)), class: "nf lo" }, g);
  const legs = [[6, 6], [D - 6, 6], [6, D - 6], [D - 6, D - 6]];
  for (const [x, y] of legs) mk("path", { d: poly(ringAt(P, disc(x, y, 7), 0)), class: "nf lo" }, g);
  for (const [x, y] of legs) put(solid(g), prism(P, front, disc(x, y, 3.2), disc(x, y, 2.2), 0, DZ0));

  const [dr, di] = rings(0, 0, D, D, 5, 1.6);
  put(solid(g), prism(P, front, dr, di, DZ0, DZ1));

  // the derrick: a tower whose top is smaller than its foot
  const foot = rrect(6, 6, 28, 28, 2, 4), top = rrect(14, 14, 20, 20, 1, 4), inner = rrect(15, 15, 19, 19, 0.5, 4);
  const der = solid(g);
  put(der, { sil: poly(hull(ringAt(P, foot, DZ1).concat(ringAt(P, top, 96)))), crease: open(ringAt(P, run(inner, front), 96)) });
  for (const z of [56, 76]) {
    const t = (z - DZ1) / 60, a = 6 + 8 * t, b = 28 - 8 * t;
    mk("path", { d: open([P(a, b, z), P(b, b, z), P(b, a, z)]), class: "nf lo" }, g);
  }

  // the quarters block and the crane's pedestal
  const [qr, qi] = rings(34, 6, 56, 26, 2.5, 1.4);
  put(solid(g), prism(P, front, qr, qi, DZ1, 50));
  put(solid(g), prism(P, front, disc(PX, PY, 4.5), disc(PX, PY, 3.4), DZ1, PZ));

  const boom = mk("path", { class: "sil hi" }, g), crease = mk("path", { class: "nf lo" }, g);
  const hook = mk("path", { class: "nf dash" }, g), dot = mk("circle", { r: 2.2, class: "dot" }, g);
  const ang = spring(REST);
  let last = NaN, lastLen = NaN;

  function draw(a) {
    if (a === last && len === lastLen) return;
    last = a; lastLen = len;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), w = 2;
    const at = (t, side, dz) => P(PX + c * t * len - s * side * w, PY + s * t * len + c * side * w, PZ + 1 + t * 14 + dz);
    const pts = [];
    for (const t of [0, 1]) for (const side of [-1, 1]) for (const dz of [-1.6, 1.6]) pts.push(at(t, side, dz));
    boom.setAttribute("d", poly(hull(pts)));
    crease.setAttribute("d", open([at(0.05, 0, 0.6), at(0.95, 0, 0.6)]));
    const tip = at(1, 0, -1.6), low = P(PX + c * len, PY + s * len, PZ + 1);
    hook.setAttribute("d", open([tip, low]));
    dot.setAttribute("cx", low[0]); dot.setAttribute("cy", low[1]);
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { ang.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [wx, wy] = unproj(C, p[0], p[1], PZ);
    const a = clamp((Math.atan2(wy - PY, wx - PX) * 180) / Math.PI, LO, HI);
    ang.t = a;
    read.textContent = String(Math.round((a + 360) % 360)).padStart(3, "0") + "°";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { len = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "oilrig",
  means: "An offshore rig on four legs: the crane on its near corner swings its boom to face the pointer over the water.",
  rules: [1, 3, 5, 8],
  range: [30, 40, 46],
  tour: [[310, 180], [240, 240], [150, 235], null],
  mount,
});
