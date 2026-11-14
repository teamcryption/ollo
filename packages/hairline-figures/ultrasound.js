/**
 * Ultrasound cart: a wheeled base, a column, a console with a probe resting
 * in its holster, and a screen on a swivel at the top. The screen turns to
 * face the pointer, the way a sonographer swings it toward the patient. At
 * rest it is turned a little aside, its frame bright. The slider is the
 * screen's tilt back.
 *
 * The pattern: a part turning to face the pointer (single object).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, rrect, unproj, hull, ringAt, circ, spring, stepS, clamp, lerp, rad,
  disposer, mk, pointer, put, register, solid, flatDot, place,
} = HL;

const CX = 0, CY = 0, CZ = 58, SZ = 76, REST = 25;
const rot = (ring, a, cx, cy) => ring.map((q) => ({
  u: cx + q.u * Math.cos(a) - q.v * Math.sin(a), v: cy + q.u * Math.sin(a) + q.v * Math.cos(a),
  nu: q.nu * Math.cos(a) - q.nv * Math.sin(a), nv: q.nu * Math.sin(a) + q.nv * Math.cos(a),
}));
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tilt = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-26, -26, 0], [26, 26, 0], [26, -26, 0], [-26, 26, 0], [0, 0, SZ + 34], [24, 0, SZ + 30], [0, 24, SZ + 30]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // base, castors, column
  const [br, bi] = rings(-22, -22, 22, 22, 9, 2);
  for (const [x, y] of [[-18, -18], [18, -18], [-18, 18]]) put(solid(g), prism(P, front, disc(x, y, 3.5), disc(x, y, 2.5), 0, 4));
  put(solid(g), prism(P, front, br, bi, 4, 9));
  put(solid(g), prism(P, front, disc(18, 18, 3.5), disc(18, 18, 2.5), 0, 4));
  const [cr, ci] = rings(-6, -6, 6, 6, 4, 1.2);
  put(solid(g), prism(P, front, cr, ci, 9, CZ));
  // console with keys and a probe holster on its right
  const [kr, ki] = rings(-16, -20, 20, 18, 5, 1.6);
  put(solid(g), prism(P, front, kr, ki, CZ, CZ + 6));
  mk("path", { d: poly(hull(ringAt(P, disc(8, 4, 4), CZ + 6).concat(ringAt(P, disc(8, 4, 4), CZ + 7.5)))), class: "nf lo" }, g);
  for (let i = 0; i < 4; i++) place(flatDot(g, C, 1.3, "dot off"), P(-8 + i * 5, 10, CZ + 6));
  put(solid(g), prism(P, front, disc(14, 21, 3), disc(14, 21, 2), CZ - 6, CZ + 2));
  put(solid(g), prism(P, front, disc(14, 21, 1.4, 12), disc(14, 21, 0.8, 12), CZ + 2, CZ + 14));
  // swivel post, then the screen: a thin rounded plate, turned by a spring
  put(solid(g), prism(P, front, disc(-6, -6, 2.5), disc(-6, -6, 1.6), CZ + 6, SZ));
  const scr = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g);
  const plate = rrect(-17, -1.5, 17, 1.5, 1.4, 4), glass = rrect(-14, -0.2, 14, 0.2, 0.2, 2);
  const ang = spring(rad(REST));
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const lean = rad(tilt) / 6, pts = [];
    const ring = rot(plate, a, -6, -6);
    for (const [z, sh] of [[SZ, 0], [SZ + 26, lean * 26]]) pts.push(...ringAt(P, ring.map((q) => ({ ...q, u: q.u - Math.sin(a + Math.PI / 2) * -sh, v: q.v + Math.cos(a + Math.PI / 2) * sh })), z));
    scr.setAttribute("d", poly(hull(pts)));
    // the glass: the plate's facing side, inset
    const n = [-Math.sin(a), Math.cos(a)], t = [Math.cos(a), Math.sin(a)], o = [-6 + n[0] * 1.6, -6 + n[1] * 1.6];
    const facesUs = n[0] + n[1] > 0 ? 1 : -1, ox = o[0] - n[0] * (facesUs < 0 ? 3.2 : 0), oy = o[1] - n[1] * (facesUs < 0 ? 3.2 : 0);
    const q = (s, z) => P(ox + t[0] * s + n[0] * lean * (z - SZ), oy + t[1] * s + n[1] * lean * (z - SZ), z);
    face.setAttribute("d", poly([q(-13, SZ + 3), q(13, SZ + 3), q(13, SZ + 23), q(-13, SZ + 23)]));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function aim(p) {
    let a = rad(REST);
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      a = clamp(Math.atan2(wy + 6, wx + 6) - Math.PI / 2, rad(-80), rad(80));
    }
    ang.t = a;
    read.textContent = p ? Math.round((a * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  scr.classList.add("hi");
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tilt = clamp(v, 0, 30); last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "ultrasound",
  means: "An ultrasound cart with a probe in its holster: the screen on top swivels to face the pointer.",
  rules: [1, 3, 5, 8],
  range: [0, 12, 30],
  tour: [[302, 273], [125, 256], [215, 292], null],
  mount,
});
