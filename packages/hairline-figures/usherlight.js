/**
 * Usher torch: a torch on a short stand, tipped down at the floor, its beam
 * drawn as two lines to a pool of light. The pointer turns the torch to aim
 * the pool at where it stands on the floor. At rest it aims off to one side,
 * the torch bright. The slider is how steeply it points down.
 *
 * The pattern: one part turning to face the pointer (spring on the angle).
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, spring, stepS, clamp, rad, seg, unproj, disposer, mk, pointer, put, register, solid } = HL;

const Z = 64, REST = -40, BL = 40, BH = 20, RB = 10, RH = 15;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let pitch = value;
  const C = Cam(45, 0.5, 1.72);
  const far = Z / Math.tan(rad(44)) + 26;
  fit(C, [[-far, -far, 0], [far, far, 0], [far, -far, 0], [-far, far, 0], [0, 0, Z + 22]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const pool = mk("path", { class: "nf lo" }, g), beam = mk("path", { class: "nf lo" }, g);
  put(solid(g), prism(P, front, circ(22, 40), circ(19, 40), 0, 5));
  const [pr, pi] = rings(-3, -3, 3, 3, 2, 0.8);
  put(solid(g), prism(P, front, pr, pi, 5, Z - 6));
  const body = mk("path", { class: "sil hi" }, g), lens = mk("path", { class: "nf lo" }, g);
  const yaw = spring(REST);
  let last = NaN, lastP = NaN;
  function draw() {
    if (yaw.x === last && pitch === lastP) return;
    last = yaw.x; lastP = pitch;
    const y = rad(yaw.x), p = rad(pitch);
    const d = [Math.cos(y) * Math.cos(p), Math.sin(y) * Math.cos(p), -Math.sin(p)], e1 = [-Math.sin(y), Math.cos(y), 0];
    const e2 = [d[1] * e1[2] - d[2] * e1[1], d[2] * e1[0] - d[0] * e1[2], d[0] * e1[1] - d[1] * e1[0]];
    const ring = (t, r) => circ(r, 24).map((q) => P(d[0] * t + e1[0] * q.u + e2[0] * q.v, d[1] * t + e1[1] * q.u + e2[1] * q.v, Z + d[2] * t + e1[2] * q.u + e2[2] * q.v));
    body.setAttribute("d", poly(hull(ring(-BL, RB).concat(ring(BL - BH, RB), ring(BL - BH + 6, RH), ring(BL, RH)))));
    lens.setAttribute("d", poly(ring(BL, RH - 2.5)));
    const reach = Z / Math.tan(p), cx = Math.cos(y) * reach, cy = Math.sin(y) * reach, rr = 9 + reach * 0.22;
    pool.setAttribute("d", poly(circ(rr, 40).map((q) => P(cx + q.u, cy + q.v, 0))));
    const hx = d[0] * BL, hy = d[1] * BL, hz = Z + d[2] * BL;
    beam.setAttribute("d", seg(P(hx + e1[0] * RH, hy + e1[1] * RH, hz), P(cx + e1[0] * rr, cy + e1[1] * rr, 0)) + seg(P(hx - e1[0] * RH, hy - e1[1] * RH, hz), P(cx - e1[0] * rr, cy - e1[1] * rr, 0)));
  }
  const B = register(stage, (dt) => { const m = stepS(yaw, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(t) {
    yaw.t = t;
    read.textContent = t === REST ? "rest" : Math.round(((t % 360) + 360) % 360) + "°";
    B.wake();
  }
  aim(REST);
  bag.add(pointer(stage, { move: ([sx, sy]) => {
    const [x, y] = unproj(C, sx, sy, 0);
    if (Math.hypot(x, y) < 6) return;
    let a = (Math.atan2(y, x) * 180) / Math.PI;
    while (a - yaw.t > 180) a -= 360;
    while (a - yaw.t < -180) a += 360;
    aim(Math.round(a));
  }, leave: () => aim(REST) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { pitch = v; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "usherlight",
  means: "An usher's torch on a stand, tipped at the floor: the pointer turns it so its pool of light lands where the pointer stands.",
  rules: [1, 3, 5, 8],
  range: [44, 50, 64],
  tour: [[176, 131], [78, 168], [322, 168], null],
  mount,
});
