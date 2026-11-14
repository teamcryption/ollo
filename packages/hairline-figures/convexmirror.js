/**
 * Convex mirror: a round security mirror on an arm, high in the corner of two
 * walls, looking down at the floor. The pointer stands on the floor and the
 * mirror swings and tips to watch that spot; a dashed sight line runs from
 * the dome to a dot where it looks. At rest it watches the far aisle, bright.
 * The slider is how far the arm may swing either side of the diagonal.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, unproj, clamp, rad, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const W = 96, H = 66, MX = 24, MY = 24, MZ = 48, R = 20, DOME = 8, REST = 30, REACH = 62;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lim = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-5, -5, 0], [W, W, 0], [W, -5, H], [-5, W, H], [-5, -5, H], [W, -5, -4], [-5, W, -4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-5, -5, W, W, 5, 2);
  put(solid(g), prism(P, front, fr, fi, -4, 0));
  const [ar, ai] = rings(-5, -5, -1, W - 18, 1.5, 0.8);
  put(solid(g), prism(P, front, ar, ai, 0, H));
  const [br, bi] = rings(-1, -5, W - 18, -1, 1.5, 0.8);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // the bracket on the corner, and the arm out to the mirror's back
  const [kr, ki] = rings(-1, -1, 5, 5, 2, 1);
  put(solid(g), prism(P, front, kr, ki, MZ + 3, MZ + 9));
  const sight = mk("path", { class: "dash nf" }, g);
  const spot = flatDot(g, C, 3, "dot");
  const arm = mk("path", { class: "nf" }, g);
  const back = mk("path", {}, g), dome = mk("path", { class: "sil hi" }, g), rim = mk("path", { class: "nf lo" }, g);

  const yaw = spring(REST), reach = spring(REACH);
  let last = "";
  function draw(a, d) {
    const key = a.toFixed(2) + "," + d.toFixed(2);
    if (key === last) return;
    last = key;
    const p = 0.45 * Math.atan2(MZ, d), ca = Math.cos(rad(a + 45)), sa = Math.sin(rad(a + 45));
    const n = [ca * Math.cos(p), sa * Math.cos(p), -Math.sin(p)], u = [-sa, ca, 0];
    const w = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
    const at = (h, r, t) => P(MX + n[0] * h + (u[0] * Math.cos(t) + w[0] * Math.sin(t)) * r,
      MY + n[1] * h + (u[1] * Math.cos(t) + w[1] * Math.sin(t)) * r, MZ + n[2] * h + (u[2] * Math.cos(t) + w[2] * Math.sin(t)) * r);
    const ring = (h, r, m = 36) => Array.from({ length: m }, (_, i) => at(h, r, (i / m) * 2 * Math.PI));
    const pts = [];
    for (let i = 0; i <= 6; i++) { const f = (i / 6) * (Math.PI / 2); pts.push(...ring(DOME * Math.sin(f), R * Math.cos(f), 32)); }
    back.setAttribute("d", poly(hull(ring(-4, R * 0.7, 24).concat(ring(0, R * 0.95, 24)))));
    dome.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly(ring(0.6, R - 2.2, 40)));
    const b = at(-4, 0, 0);
    arm.setAttribute("d", open([P(2, 2, MZ + 6), P(MX * 0.5, MY * 0.5, MZ + 4), b]));
    const gx = MX + ca * d, gy = MY + sa * d;
    sight.setAttribute("d", open([at(DOME, 0, 0), P(gx, gy, 0)]));
    place(spot, P(gx, gy, 0));
  }

  const B = register(stage, (dt) => {
    const m1 = stepS(yaw, dt), m2 = stepS(reach, dt);
    draw(yaw.x, reach.x);
    return m1 || m2;
  });
  bag.add(B.unregister);

  function aim(pt) {
    if (!pt) {
      yaw.t = REST; reach.t = REACH; read.textContent = "rest";
    } else {
      const [x, y] = unproj(C, pt[0], pt[1], 0);
      const a = clamp(Math.atan2(y - MY, x - MX) * 180 / Math.PI - 45, -lim, lim);
      yaw.t = a; reach.t = clamp(Math.hypot(x - MX, y - MY), 26, 74);
      read.textContent = Math.round(a + 45) + "°";
    }
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lim = v; }, destroy: bag.dispose };
}

hairline({
  name: "convexmirror",
  means: "A round security mirror high in a corner: it swings and tips to watch the spot on the floor under the pointer.",
  rules: [1, 3, 5, 8],
  range: [10, 35, 42],
  tour: [[231, 231], [299, 219], [101, 219], null],
  mount,
});
