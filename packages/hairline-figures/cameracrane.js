/**
 * Camera crane: a jib on a column standing on a round base, a counterweight
 * at the short end and a camera at the long one. The jib swings round its
 * column to point the camera at the pointer. At rest it looks off to the
 * left, the camera bright. The slider is how high the jib rides.
 *
 * The pattern: aim (spotlights); the hit is the pointer on the ground plane,
 * which never moves, and the swing is a spring.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rad, rings, rrect, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ARM = 46, BACK = 16, REST = 325;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let hz = value;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[-ARM - 6, 0, 0], [ARM + 6, 0, 0], [0, -ARM - 6, 0], [0, ARM + 6, 0], [-ARM - 6, 0, 72], [0, -ARM - 6, 72], [ARM + 6, 0, 72], [0, ARM + 6, 72]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-14, -14, 14, 14, 14, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  const col = solid(g);
  const [cr, ci] = rings(-3, -3, 3, 3, 3, 0.8);
  const arm = solid(g), cw = solid(g), cam = solid(g);
  cam.sil.classList.add("hi");

  const rot = (ring, a, dx) => ring.map((s) => {
    const u = s.u + dx, c = Math.cos(a), si = Math.sin(a);
    return { u: u * c - s.v * si, v: u * si + s.v * c, nu: s.nu * c - s.nv * si, nv: s.nu * si + s.nv * c };
  });
  const yaw = spring(rad(REST));
  let last = "";
  function draw(a) {
    const key = a.toFixed(4) + "," + hz;
    if (key === last) return;
    last = key;
    const z = hz;
    put(col, prism(P, front, cr, ci, 4, z));
    put(arm, prism(P, front, rot(rrect(-BACK, -2, ARM, 2, 2, 4), a, 0), rot(rrect(-BACK + 0.7, -1.3, ARM - 0.7, 1.3, 1.3, 4), a, 0), z, z + 3));
    put(cw, prism(P, front, rot(rrect(-5, -5, 5, 5, 3, 4), a, -BACK + 4), rot(rrect(-4, -4, 4, 4, 2.2, 4), a, -BACK + 4), z - 7, z + 3.5));
    put(cam, prism(P, front, rot(rrect(-7, -4.5, 7, 4.5, 2.5, 4), a, ARM - 4), rot(rrect(-6, -3.5, 6, 3.5, 1.8, 4), a, ARM - 4), z + 3, z + 14));
    // paint order: the nearer end last
    const c = Math.cos(a) + Math.sin(a);
    if (c > 0) { col.g.after(cw.g); cw.g.after(arm.g); arm.g.after(cam.g); }
    else { col.g.after(cam.g); cam.g.after(arm.g); arm.g.after(cw.g); }
  }

  const B = register(stage, (dt) => { const m = stepS(yaw, dt); draw(yaw.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { yaw.t = rad(REST); read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    if (Math.hypot(x, y) < 6) return;
    let t = Math.atan2(y, x), d = t - yaw.t;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    yaw.t = yaw.t + d;
    const deg = Math.round(((t * 180) / Math.PI + 360) % 360);
    read.textContent = "pan " + String(deg).padStart(3, "0");
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { hz = v; last = ""; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "cameracrane",
  means: "A camera crane: the jib swings round its column to point the camera at the pointer, the counterweight swinging opposite.",
  rules: [1, 3, 5, 8],
  range: [36, 48, 58],
  tour: [[301, 285], [99, 285], [200, 300], null],
  mount,
});
