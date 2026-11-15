/**
 * Phone pod: an office phone booth, a tall rounded cabin on a low plinth,
 * a glazed door on its front face hinged at one side, a vent on the roof.
 * The pointer over the pod swings the door open, wider the further toward
 * its free edge it moves. At rest the door stands ajar, bright.
 *
 * The pattern: one part turning on a hinge (spring).
 */
const {
  Cam, clamp, fit, facing, hull, lerp, open, poly, prism, proj, rad, rings, rrect, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 62, D = 58, H = 112, PZ = 4, HX = 9, DW = 44, Z0 = PZ + 3, Z1 = H - 10, T = 2.2, REST = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-4, -4, 0], [W + 4, D + DW + 4, 0], [W + 4, -4, 0], [-4, D + DW, 0], [0, 0, H + 4], [W, 0, H + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-4, -4, W + 4, D + 4, 5, 1.6);
  put(solid(g), prism(P, front, fr, fi, 0, PZ));
  const [cr, ci] = rings(0, 0, W, D, 6, 2);
  put(solid(g), prism(P, front, cr, ci, PZ, H));
  const [vr, vi] = rings(W / 2 - 12, D / 2 - 8, W / 2 + 12, D / 2 + 8, 3, 1);
  put(solid(g), prism(P, front, vr, vi, H, H + 3));
  // the doorway on the front face
  const fp = (u, z) => P(HX + u, D, z);
  mk("path", { d: poly(rrect(0, Z0, DW, Z1, 3, 4).map((q) => fp(q.u, q.v))), class: "nf lo" }, g);

  const dg = mk("g", {}, g);
  const door = mk("path", { class: "sil" }, dg), glass = mk("path", { class: "nf lo" }, dg), grip = mk("path", { class: "nf" }, dg);
  const outer = rrect(0, Z0, DW, Z1, 3, 4), pane = rrect(5, Z0 + 26, DW - 5, Z1 - 6, 2, 4);
  const ang = spring(REST);
  const Dp = (a, u, z, t) => {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    return P(HX + u * c - s * t, D + u * s + c * t, z);
  };
  let last = NaN;
  function draw() {
    const a = ang.x;
    if (a === last) return;
    last = a;
    const pts = [];
    for (const q of outer) pts.push(Dp(a, q.u, q.v, 0), Dp(a, q.u, q.v, T));
    door.setAttribute("d", poly(hull(pts)));
    const face = a > 60 ? 0 : T;
    glass.setAttribute("d", poly(pane.map((q) => Dp(a, q.u, q.v, face))));
    grip.setAttribute("d", open([Dp(a, DW - 5, 48, T + 1.5), Dp(a, DW - 5, 64, T + 1.5)]));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);

  const L = P(0, D, 0)[0], R = P(W, 0, 0)[0], Yt = P(0, 0, H)[1], Yb = P(W, D, 0)[1];
  let on = null;
  function aim(p) {
    const hit = p && p[0] > L - 6 && p[0] < R + 6 && p[1] > Yt - 6 && p[1] < Yb + 6;
    if (hit) {
      ang.t = lerp(35, maxA, clamp((R - p[0]) / (R - L), 0, 1));
      read.textContent = "door " + Math.round(ang.t) + "°";
    } else {
      ang.t = REST;
      read.textContent = "rest";
    }
    if (on !== !!hit) { on = !!hit; door.classList.add("hi"); }
    B.wake();
  }
  aim(null);
  draw();
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "phonebooth2",
  means: "An office phone pod: the pointer over the cabin swings its door open, wider the further it moves toward the door's free edge.",
  rules: [1, 3, 5, 8],
  range: [60, 95, 120],
  tour: [[289, 92], [225, 225], [154, 147], null],
  mount,
});
