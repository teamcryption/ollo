/**
 * Water tower: a round tank on four splayed legs, under a conical roof
 * hinged at one side. The pointer near the roof swings it open, wider the
 * nearer it comes, showing the tank's open mouth. At rest the roof is
 * shut, bright. The slider is the widest swing.
 *
 * The pattern: one lid turning on a hinge (open).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rad, ringAt, run, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 38, LZ = 40, TZ = 84, RZ = 104, LF = 36, LT = 26;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function rot(p, a) {
  const T0 = -(R + 3), d = (p[0] + p[1]) / Math.SQRT2, t = (p[0] - p[1]) / Math.SQRT2 - T0, rz = p[2] - TZ;
  const s = Math.sin(rad(a)), c = Math.cos(rad(a));
  const t2 = t * c - rz * s + T0, z2 = t * s + rz * c;
  return [(d + t2) / Math.SQRT2, (d - t2) / Math.SQRT2, TZ + z2];
}
const roofPts = () => circ(R + 3, 40).map((q) => [q.u, q.v, TZ]).concat([[0, 0, RZ], [0, 0, RZ + 5]]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-LF - 3, -LF - 3, 0], [LF + 3, LF + 3, 0], [LF + 3, -LF - 3, 0], [-LF - 3, LF + 3, 0], [0, 0, RZ + 5]].concat(roofPts().map((p) => rot(p, 85))), 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const post = (x0, y0, x1, y1) => {
    const pts = circ(2.4, 12).map((q) => P(x0 + q.u, y0 + q.v, 0)).concat(circ(2.4, 12).map((q) => P(x1 + q.u, y1 + q.v, LZ)));
    mk("path", { d: poly(hull(pts)) }, g);
  };
  const legs = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  legs.slice(0, 3).forEach(([a, b]) => post(a * LF, b * LF, a * LT, b * LT));
  // cross braces between the legs, two tiers
  let br = "";
  for (const f of [0.35, 0.7]) {
    const at = ([a, b]) => P(a * lerpL(f), b * lerpL(f), LZ * f);
    br += open([at([-1, 1]), at([1, 1]), at([1, -1])]) + open([at([-1, 1]), at([1, -1])]);
  }
  function lerpL(f) { return LF + (LT - LF) * f; }
  mk("path", { d: br, class: "nf lo" }, g);
  post(LF, LF, LT, LT);
  const tank = mk("g", {}, g);
  put(solid(tank), prism(P, front, disc(0, 0, R), disc(0, 0, R - 2.5), LZ, TZ));
  put(solid(tank), prism(P, front, disc(0, 0, R + 2), disc(0, 0, R - 0.5), LZ - 4, LZ));
  mk("path", { d: open(ringAt(P, run(disc(0, 0, R), front), LZ + 14)) + open(ringAt(P, run(disc(0, 0, R), front), LZ + 27)), class: "nf lo" }, tank);
  const mouth = mk("path", { class: "nf lo" }, tank);
  const roof = mk("g", {}, g);
  const rs = mk("path", { class: "sil hi" }, roof);
  const rc = mk("path", { class: "nf lo" }, roof);
  const ang = spring(0);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = roofPts().map((p) => P(...rot(p, a)));
    rs.setAttribute("d", poly(hull(pts)));
    const rim = circ(R + 1, 40);
    const keep = a < 6 ? run(rim, front) : rim;
    const ring = keep.map((q) => P(...rot([q.u, q.v, TZ], a)));
    rc.setAttribute("d", a < 6 ? open(ring) : poly(ring));
    mouth.setAttribute("d", a > 4 ? poly(ringAt(P, disc(0, 0, R - 4), TZ)) : "");
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  const tp = P(0, 0, TZ + 8);
  let tgt = null, lastP = null;
  function turn(p) {
    lastP = p;
    let a = 0;
    if (p) {
      const dd = Math.hypot(p[0] - tp[0], p[1] - tp[1]);
      if (dd < 150) a = maxA * clamp(1.15 - dd / 130, 0.3, 1);
    }
    a = Math.round(a);
    if (a === tgt) return;
    tgt = a;
    ang.t = a;
    read.textContent = !p || a === 0 ? "rest" : "roof " + a + "°";
    B.wake();
  }
  turn(null);
  draw(0);
  bag.add(pointer(stage, { move: turn, leave: () => turn(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; tgt = null; turn(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "watertower",
  means: "A water tower on four legs: the pointer near the top swings its conical roof open on a side hinge, showing the tank's mouth.",
  rules: [1, 3, 5, 6],
  range: [40, 65, 85],
  tour: [[206, 132], [228, 156], [184, 196], null],
  mount,
});
