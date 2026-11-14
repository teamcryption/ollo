/**
 * Night safe: a thick bank wall with a deposit hopper set into it. The hopper's
 * front plate is hinged at its foot; the pointer's height tips it out and down
 * into an open chute, its two wedge cheeks folding out with it. At rest the
 * hopper stands just ajar and its pull bar is the bright mark. The slider is the widest tilt.
 *
 * The pattern: one plate tipping on a bottom hinge (tilt).
 */
const {
  Cam, clamp, fit, facing, lerp, poly, prism, proj, rad, rings, unproj,
  disposer, mk, pointer, put, register, solid, spring, stepS,
} = HL;

const WX = 64, WY = 10, WZ = 74, X0 = 14, X1 = 50, Z0 = 32, HH = 22, PT = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-4, -4, 0], [WX + 4, WY + 4, 0], [WX + 4, -4, 0], [-4, WY + 4, 0], [0, 0, WZ], [WX, WY + HH, Z0], [X0, WY + HH, Z0]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const [fr, fi] = rings(-4, -4, WX + 4, WY + 18, 3, 1.5);
  put(solid(g), prism(P, front, fr, fi, 0, 3));
  const [wr, wi] = rings(0, 0, WX, WY, 3, 1.4);
  put(solid(g), prism(P, front, wr, wi, 3, WZ));
  // the opening in the wall's near face, and the chute's dark throat behind it
  const F = (x, z) => P(x, WY, z);
  mk("path", { d: poly([F(X0 - 3, Z0 - 3), F(X1 + 3, Z0 - 3), F(X1 + 3, Z0 + HH + 3), F(X0 - 3, Z0 + HH + 3)]), class: "lo" }, g);
  mk("path", { d: poly([F(X0, Z0 + HH - 4), F(X1, Z0 + HH - 4), P(X1, WY - 6, Z0 + HH - 2), P(X0, WY - 6, Z0 + HH - 2)]), class: "lo nf" }, g);
  mk("path", { d: poly([F(X0 + 10, Z0 + HH + 14), F(X1 - 10, Z0 + HH + 14), F(X1 - 10, Z0 + HH + 18), F(X0 + 10, Z0 + HH + 18)]), class: "lo" }, g);

  const far = mk("path", {}, g), plate = mk("path", { class: "sil" }, g), edge = mk("path", { class: "nf lo" }, g);
  const bar = mk("path", { class: "nf" }, g), near = mk("path", {}, g);
  // a point on the plate: x across, h up it from the hinge, out from its face
  const at = (a, x, h, o = 0) => P(x, WY + h * Math.sin(a) + o * Math.cos(a), Z0 + h * Math.cos(a) - o * Math.sin(a));
  const ang = spring(10);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), cheek = (x) => poly([F(x, Z0), at(a, x, HH), F(x, Z0 + HH)]);
    far.setAttribute("d", cheek(X0));
    plate.setAttribute("d", poly([at(a, X0, 0, PT), at(a, X1, 0, PT), at(a, X1, HH, PT), at(a, X0, HH, PT), at(a, X0, HH), at(a, X0, 0)]));
    edge.setAttribute("d", "M" + at(a, X0, HH, PT).join(",") + " L" + at(a, X0, HH).join(",") + " L" + at(a, X1, HH).join(","));
    bar.setAttribute("d", poly([at(a, X0 + 9, HH - 6, PT), at(a, X1 - 9, HH - 6, PT), at(a, X1 - 9, HH - 6, PT + 3), at(a, X0 + 9, HH - 6, PT + 3)]));
    near.setAttribute("d", cheek(X1));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(Math.round(ang.x * 10) / 10); return m; });
  bag.add(B.unregister);

  const top = P(X0, WY, Z0 + HH + 10)[1], bot = P(X1, WY + 20, 0)[1];
  let on = null;
  function setOpen(p) {
    let hitIt = false;
    if (p) { const [wx, wy] = unproj(C, p[0], p[1], 0); hitIt = wx > -16 && wx < WX + 16 && wy > -60 && wy < WY + 40; }
    ang.t = hitIt ? lerp(0, maxA, clamp((p[1] - top) / (bot - top), 0, 1)) : 10;
    if (hitIt !== on) {
      on = hitIt;
      plate.classList.toggle("hi", hitIt);
      bar.classList.toggle("hi", !hitIt);
    }
    read.textContent = hitIt ? Math.round(ang.t) + "°" : "rest";
    B.wake();
  }
  setOpen(null);
  bag.add(pointer(stage, { move: (p) => setOpen(p), leave: () => setOpen(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "passbook",
  means: "A night safe in a bank wall: the pointer's height tips the hopper plate out and down into an open chute.",
  rules: [1, 3, 5, 8],
  range: [40, 70, 85],
  tour: [[187, 193], [206, 239], [150, 285], null],
  mount,
});
