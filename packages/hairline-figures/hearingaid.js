/**
 * Hearing aid case: a rounded clamshell holding two hearing aids, each a
 * bean-shaped body with its ear tube, in moulded wells. The lid opens back on
 * its hinge as the pointer comes over the case, wider the nearer the front.
 * At rest it stands a little open, bright. The slider is the widest opening.
 *
 * The pattern: one lid turning on a hinge (open).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rad, rings, rrect, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const D = 44, W = 64, H = 13, LH = 11, REST = 24;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 3.2);
  fit(C, [[-2, -2, 0], [D + 2, W + 2, 0], [D + 2, -2, 0], [-2, W + 2, 0], [-LH, 0, H + D + 2], [-LH, W, H + D + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, D, W, 18, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  let d = "";
  for (const y of [W * 0.3, W * 0.7]) {
    d += poly(circ(1, 28).map((q) => P(D * 0.55 + q.u * 12, y + q.v * 8, H)));
    d += poly(circ(1, 20).map((q) => P(D * 0.55 + q.u * 6, y + q.v * 4, H + 3)));
    d += open([P(D * 0.45, y + 6, H + 2), P(D * 0.3, y + 9, H + 2), P(D * 0.2, y + 4, H + 2)]);
  }
  mk("path", { d, class: "nf lo" }, g);

  const lid = solid(g);
  lid.sil.classList.add("hi");
  const ring = rrect(0, 0, D, W, 18, 6), inner = rrect(2.5, 2.5, D - 2.5, W - 2.5, 15.5, 6), top = rrect(5, 5, D - 5, W - 5, 13, 6);
  const ang = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    const at = (x, y, dz) => P(x * c - dz * s, y, H + x * s + dz * c);
    lid.sil.setAttribute("d", poly(hull(ring.map((q) => at(q.u, q.v, 0)).concat(ring.map((q) => at(q.u, q.v, LH * 0.6)), top.map((q) => at(q.u, q.v, LH))))));
    lid.cr.setAttribute("d", poly(inner.map((q) => at(q.u, q.v, a > 90 ? 0 : LH * 0.6))));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let tgt = null, lastP = null;
  function lift(p) {
    lastP = p;
    let a = REST;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], H);
      if (wy > -25 && wy < W + 25 && wx > -30 && wx < D + 40) a = maxA * clamp((wx + 25) / (D + 35), 0.35, 1);
    }
    a = Math.round(a);
    if (a === tgt) return;
    tgt = a;
    ang.t = a;
    read.textContent = !p || a === REST ? "rest" : "lid " + a + "°";
    B.wake();
  }
  lift(null);
  bag.add(pointer(stage, { move: lift, leave: () => lift(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; tgt = null; lift(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "hearingaid",
  means: "A rounded hearing aid case whose lid opens back on its hinge as the pointer comes over it, showing the two aids in their wells.",
  rules: [1, 3, 5, 6],
  range: [60, 90, 110],
  tour: [[240, 232], [231, 190], [205, 262], null],
  mount,
});
