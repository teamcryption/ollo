/**
 * Foot spa: a low, wide basin with two foot wells and roller ridges, under a
 * splash cover hinged along its back edge. The cover tilts up as the pointer
 * comes over the basin, wider the nearer the front. At rest it sits a little
 * ajar, bright. The slider is the widest opening.
 *
 * The pattern: one lid turning on a hinge (open).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rad, rings, rrect, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const D = 72, W = 116, H = 26, LH = 6, REST = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-3, -3, 0], [D + 3, W + 3, 0], [D + 3, -3, 0], [-3, W + 3, 0], [0, 0, H + D + 8], [0, W, H + D + 8]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, D, W, 16, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const well = rrect(7, 7, D - 7, W - 7, 11, 4);
  let d = poly(well.map((q) => P(q.u, q.v, H)));
  for (const y of [W * 0.3, W * 0.7]) d += poly(circ(1, 28).map((q) => P(D / 2 + q.u * 24, y + q.v * 12, H - 1)));
  mk("path", { d, class: "nf lo" }, g);
  d = "";
  for (const y of [W * 0.3, W * 0.7]) for (const x of [-14, -5, 4, 13]) d += seg(P(D / 2 + x, y - 7, H - 1), P(D / 2 + x, y + 7, H - 1));
  d += seg(P(D, W - 22, 9), P(D, W - 12, 9));
  mk("path", { d, class: "nf lo" }, g);

  const lid = solid(g);
  lid.sil.classList.add("hi");
  const knob = mk("path", { class: "nf" }, lid.g);
  const ring = rrect(-1, -1, D + 1, W + 1, 17, 6), inner = rrect(3, 3, D - 3, W - 3, 13, 6);
  const ang = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    const at = (x, y, dz) => P(x * c - dz * s, y, H + x * s + dz * c);
    lid.sil.setAttribute("d", poly(hull(ring.map((q) => at(q.u, q.v, 0)).concat(ring.map((q) => at(q.u, q.v, LH))))));
    lid.cr.setAttribute("d", poly(inner.map((q) => at(q.u, q.v, LH))));
    const tab = rrect(D - 8, W / 2 - 12, D + 4, W / 2 + 12, 4, 4);
    knob.setAttribute("d", poly(hull(tab.map((q) => at(q.u, q.v, LH)).concat(tab.map((q) => at(q.u, q.v, LH + 3))))));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let tgt = null, lastP = null;
  function lift(p) {
    lastP = p;
    let a = REST;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], H);
      if (wy > -30 && wy < W + 30 && wx > -40 && wx < D + 50) a = maxA * clamp((wx + 30) / (D + 40), 0.3, 1);
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
  name: "footbath",
  means: "A foot spa whose splash cover tilts up on its back hinge as the pointer comes over the basin, showing the foot wells.",
  rules: [1, 3, 5, 6],
  range: [40, 70, 90],
  tour: [[230, 216], [215, 175], [180, 245], null],
  mount,
});
