/**
 * Dial safe: a squat safe on a plinth, its door on the near-left face with a
 * combination dial and a lever. The pointer's screen x swings the door on its
 * hinge, from shut to wide open, showing the shelf inside. At rest the door
 * stands ajar and the dial is the bright mark. The slider is the widest swing.
 *
 * The pattern: one part turning on a hinge (swing).
 */
const {
  Cam, circ, clamp, fit, facing, lerp, poly, prism, proj, rad, rings, rrect, unproj,
  disposer, mk, pointer, put, register, solid, spring, stepS,
} = HL;

const W = 44, D = 40, H = 46, PZ = 4, M = 4, T = 3, REST = 22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-4, -4, 0], [W + 4, D + 4, 0], [W + 4, -4, 0], [-4, D + 30, 0], [M, D + W, PZ + H], [W + 4, -4, PZ + H]], 200, 170);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const [pr, pi] = rings(-4, -4, W + 4, D + 4, 3, 1.5);
  put(solid(g), prism(P, front, pr, pi, 0, PZ));
  const [br, bi] = rings(0, 0, W, D, 4, 1.8);
  put(solid(g), prism(P, front, br, bi, PZ, PZ + H));
  // the opening on the y = D face, and a shelf inside it
  const z0 = PZ + M, z1 = PZ + H - M, x0 = M, x1 = W - M;
  const face = (x, z) => P(x, D, z);
  mk("path", { d: poly([face(x0, z0), face(x1, z0), face(x1, z1), face(x0, z1)]), class: "lo" }, g);
  mk("path", { d: poly([P(x0 + 2, D - 10, z0 + 18), P(x1 - 2, D - 10, z0 + 18), P(x1 - 2, D, z0 + 18), P(x0 + 2, D, z0 + 18)]), class: "lo nf" }, g);
  mk("path", { d: poly([P(x0 + 6, D - 8, z0), P(x0 + 18, D - 8, z0), P(x0 + 18, D - 8, z0 + 7), P(x0 + 6, D - 8, z0 + 7)]), class: "lo nf" }, g);

  const door = solid(g), dial = mk("path", { class: "nf" }, g), tick = mk("path", { class: "nf" }, g), lever = mk("path", { class: "nf" }, g);
  const DW = x1 - x0, hx = x0, hy = D;
  const local = rrect(0, 0, DW, T, 1.2, 4), inner = rrect(0.8, 0.8, DW - 0.8, T - 0.8, 0.6, 4);
  // a point on the door: u along it from the hinge, v outward, at height z
  const at = (a, u, v, z) => { const c = Math.cos(a), s = Math.sin(a); return P(hx + u * c - v * s, hy + u * s + v * c, z); };
  const turn = (ring, a) => { const c = Math.cos(a), s = Math.sin(a);
    return ring.map((q) => ({ u: hx + q.u * c - (q.v) * s, v: hy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };
  const ang = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg);
    put(door, prism(P, front, turn(local, a), turn(inner, a), z0 + 0.5, z1 - 0.5));
    const cu = DW * 0.45, cz = (z0 + z1) / 2, R = 7;
    const ring = circ(R, 28).map((q) => at(a, cu + q.u, T + 0.2, cz + q.v));
    dial.setAttribute("d", poly(ring));
    tick.setAttribute("d", poly(circ(2, 12).map((q) => at(a, cu + q.u, T + 1.2, cz + q.v))) + " M" + at(a, cu, T + 0.2, cz + R - 1).join(",") + " L" + at(a, cu, T + 0.2, cz + R + 2).join(","));
    lever.setAttribute("d", "M" + at(a, DW - 6, T + 0.2, cz - 8).join(",") + " L" + at(a, DW - 6, T + 3, cz - 8).join(",") + " L" + at(a, DW - 6, T + 3, cz + 6).join(","));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(Math.round(ang.x * 10) / 10); return m; });
  bag.add(B.unregister);

  const L = P(-4, D + 4, 0)[0] - 10, R = P(W + 4, -4, 0)[0] + 10;
  let on = null;
  function setOpen(p) {
    let hitIt = false;
    if (p) { const [wx, wy] = unproj(C, p[0], p[1], 0); hitIt = wx > -14 && wx < W + 14 && wy > -14 && wy < D + 46; }
    if (hitIt) ang.t = lerp(0, maxA, clamp((p[0] - L) / (R - L), 0, 1));
    else ang.t = REST;
    if (hitIt !== on) {
      on = hitIt;
      door.sil.classList.toggle("hi", hitIt);
      dial.classList.toggle("hi", !hitIt);
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
  name: "interestdial",
  means: "A dial safe: the pointer's sideways reach swings the door on its hinge, from shut to wide open, showing the shelf inside.",
  rules: [1, 3, 5, 8],
  range: [60, 105, 130],
  tour: [[130, 212], [227, 222], [324, 212], null],
  mount,
});
