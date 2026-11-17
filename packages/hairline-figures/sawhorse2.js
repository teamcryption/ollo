/**
 * Log splitter: a lever splitter, a long beam on the ground with a post at
 * its far end, a round log standing on the beam, and a long lever hinged on
 * the post with a wedge under it above the log. The pointer along the beam
 * sets the lever: toward the handle end it swings down and the wedge bites
 * the log. At rest the lever is raised, its grip bright. The slider is how
 * quickly it follows.
 *
 * The pattern: a continuous lever (a spring on an angle); the hit is the
 * pointer on the ground plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, lerp, poly, prism, proj, rad, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = 35, PZ = 42, LEN = 74, WD = 28, UP = 28, DOWN = -9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-42, -6, 0], [42, 6, 0], [PX - LEN * Math.cos(rad(UP)), 0, PZ + LEN * Math.sin(rad(UP)) + 4], [-42, 6, 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const beam = solid(g);
  const [br, bi] = rings(-40, -6, 42, 6, 2.5, 1);
  put(beam, prism(P, front, br, bi, 0, 7));
  const log = solid(g);
  put(log, prism(P, front, circ(10, 40).map((p) => ({ ...p, u: p.u + 4 })), circ(8.6, 40).map((p) => ({ ...p, u: p.u + 4 })), 7, 26));
  const post = solid(g);
  const [pr, pi] = rings(PX - 3.5, -3.5, PX + 3.5, 3.5, 1.5, 0.7);
  put(post, prism(P, front, pr, pi, 7, PZ + 3));

  const wedge = solid(g), lever = solid(g), grip = solid(g);
  grip.sil.classList.add("hi");
  // a box along the lever: s from s0 to s1 from the hinge, half-width w, from n0 to n1 across it
  function box(th, s0, s1, w, n0, n1) {
    const c = Math.cos(th), s = Math.sin(th), pts = [];
    for (const a of [s0, s1]) for (const n of [n0, n1]) for (const y of [-w, w]) pts.push(P(PX - a * c - n * s, y, PZ + a * s - n * c));
    return poly(hull(pts));
  }
  function put2(sd, d) { sd.sil.setAttribute("d", d); }
  const sp = spring(rad(UP), { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = NaN;
  function draw() {
    const th = sp.x;
    if (th === last) return;
    last = th;
    const c = Math.cos(th), s = Math.sin(th);
    const wp = [];
    for (const a of [WD - 5, WD + 5]) for (const y of [-2.5, 2.5]) wp.push(P(PX - a * c + 2 * s, y, PZ + a * s - 2 * c));
    for (const y of [-0.6, 0.6]) wp.push(P(PX - WD * c + 14 * s, y, PZ + WD * s - 14 * c));
    put2(wedge, poly(hull(wp)));
    put2(lever, box(th, -5, LEN - 12, 2.8, -2.5, 2.5));
    put2(grip, box(th, LEN - 12, LEN, 2.2, -2, 2));
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(p) {
    let t = rad(UP), on = false;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x > -60 && x < 50 && Math.abs(y) < 40) { on = true; t = rad(lerp(DOWN, UP, clamp((x + 40) / 70, 0, 1))); }
    }
    sp.t = t;
    read.textContent = on ? Math.round((t * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sp.k = 100 * clamp(v, 0.3, 3); sp.c = 18 * Math.sqrt(clamp(v, 0.3, 3)); }, destroy: bag.dispose };
}

hairline({
  name: "sawhorse2",
  means: "A lever log splitter: the long lever swings down toward the pointer along the beam and its wedge bites into the log.",
  rules: [1, 3, 5, 6],
  range: [0.5, 1, 1.6],
  tour: [[145, 213], [135, 208], [269, 275], null],
  mount,
});
