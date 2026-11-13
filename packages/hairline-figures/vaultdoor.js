/**
 * Vault door: a round bank vault door set in a thick wall, hung on two hinge
 * barrels, with a ring of bolts round its face and a spoked handle wheel in
 * the middle. The wheel turns on a spring to follow the pointer's angle
 * round it, and near the door's edge the door swings open a little on its
 * hinges. At rest the wheel sits a little turned, bright, the door just
 * ajar. The slider is how quickly they follow (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (terrain's spring, on an angle); the hit is
 * on the door's resting face, a plane that never moves.
 */
const {
  Cam, clamp, fillet, fit, hull, open, poly, prism, proj, circ, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 36, T = 5, ZC = 50, RH = R + 3, WX = 54, WZ = 100, WD = 10;
const REST_W = rad(24), REST_D = rad(3), OPEN = rad(24);
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-WX, -WD, 0], [WX, -WD, 0], [WX, 0, 0], [-WX, 0, 0], [-WX, -WD, WZ], [WX, 0, WZ], [R, 2 * R * Math.sin(OPEN), ZC]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);

  // the wall: a thick slab, its front face a crease; the door's frame ring on it
  const face = (y) => fillet([[-WX, 0], [WX, 0], [WX, WZ], [-WX, WZ]], [3, 3, 3, 3], 4).map(([x, z]) => P(x, y, z));
  mk("path", { class: "sil", d: poly(hull(face(0).concat(face(-WD)))) }, g);
  const ringW = (r, y) => Array.from({ length: 48 }, (_, i) => { const t = (i / 48) * Math.PI * 2; return P(r * Math.cos(t), y, ZC + r * Math.sin(t)); });
  mk("path", { class: "nf lo", d: open(face(0).concat([face(0)[0]])) + poly(ringW(R + 4, 0)) }, g);
  mk("path", { class: "nf lo", d: poly(ringW(R - 1, -WD * 0.6)) }, g);

  const door = mk("path", { class: "sil" }, g), doorCr = mk("path", { class: "nf lo" }, g);
  const straps = mk("path", { class: "sil" }, g);
  for (const s of [-1, 1]) put(solid(g), prism(P, () => true, circ(2.8, 16).map((q) => ({ ...q, u: q.u - RH, v: q.v + 1 })), null, ZC + s * R * 0.55 - 7, ZC + s * R * 0.55 + 7));
  const hub = mk("path", { class: "sil" }, g), spokes = mk("path", { class: "nf sil" }, g), rim = mk("path", { class: "nf sil" }, g), knobs = mk("path", {}, g);

  const opts = { k: 100 * value, c: 18 * Math.sqrt(value) };
  const wh = spring(REST_W, opts), dr = spring(REST_D, opts);
  let last = "";

  function draw() {
    const key = wh.x.toFixed(4) + "," + dr.x.toFixed(4);
    if (key === last) return;
    last = key;
    const cf = Math.cos(dr.x), sf = Math.sin(dr.x);
    const W = (lx, ly, lz) => { const dx = lx + RH; return P(-RH + dx * cf - ly * sf, dx * sf + ly * cf, ZC + lz); };
    const ring = (r, ly, n = 48, a0 = 0, cx = 0, cz = 0) => Array.from({ length: n }, (_, i) => { const t = a0 + (i / n) * Math.PI * 2; return W(cx + r * Math.cos(t), ly, cz + r * Math.sin(t)); });
    door.setAttribute("d", poly(hull(ring(R, 0, 64).concat(ring(R, T, 64)))));
    let cr = poly(ring(R - 3, T, 64));
    for (let i = 0; i < 12; i++) { const t = (i / 12) * Math.PI * 2; cr += poly(ring(1.3, T, 10, 0, (R - 7.5) * Math.cos(t), (R - 7.5) * Math.sin(t))); }
    doorCr.setAttribute("d", cr);
    straps.setAttribute("d", [-1, 1].map((s) => poly([[-RH, s * R * 0.55 - 3], [-R * 0.62, s * R * 0.55 - 3], [-R * 0.62, s * R * 0.55 + 3], [-RH, s * R * 0.55 + 3]].map(([x, z]) => W(x, T + 0.4, z)))).join(""));
    const a = wh.x, F = T + 5;
    hub.setAttribute("d", poly(hull(ring(4, T, 20).concat(ring(4, F + 1, 20)))));
    let sp = "", kn = "";
    for (let i = 0; i < 6; i++) {
      const t = a + (i / 6) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t);
      const p0 = W(4 * c, F, 4 * s), p1 = W(18 * c, F, 18 * s);
      sp += `M${p0[0]},${p0[1]}L${p1[0]},${p1[1]}`;
      kn += poly(ring(1.9, F, 12, 0, 19.5 * c, 19.5 * s));
    }
    spokes.setAttribute("d", sp);
    rim.setAttribute("d", poly(ring(13, F, 40)) + poly(ring(11.4, F, 40)));
    knobs.setAttribute("d", kn);
  }

  const B = register(stage, (dt) => { const m1 = stepS(wh, dt), m2 = stepS(dr, dt); draw(); return m1 || m2; });
  bag.add(B.unregister);

  // the hit: the pointer on the door's resting front face, a fixed vertical plane
  const o = P(0, T, ZC), ex = P(1, T, ZC), ez = P(0, T, ZC + 1);
  const a1 = ex[0] - o[0], b1 = ez[0] - o[0], a2 = ex[1] - o[1], b2 = ez[1] - o[1], det = a1 * b2 - b1 * a2;
  function onDoor([sx, sy]) {
    const u = sx - o[0], v = sy - o[1];
    return [(u * b2 - b1 * v) / det, (a1 * v - u * a2) / det];
  }

  function aim(p) {
    let zone = "rest";
    if (p) {
      const [lx, lz] = onDoor(p), r = Math.hypot(lx, lz);
      if (r < R + 14) {
        if (r > 3) { const t = Math.atan2(lz, lx); wh.t = wh.t + wrap(t - wh.t); }
        dr.t = OPEN * clamp((r - 0.7 * R) / (0.3 * R), 0, 1);
        zone = r > 0.7 * R ? "door" : "wheel";
      }
    }
    if (zone === "rest") { wh.t = wh.t + wrap(REST_W - wh.t); dr.t = REST_D; }
    rim.classList.toggle("hi", zone !== "door");
    door.classList.toggle("hi", zone === "door");
    const deg = (x) => Math.round((((x * 180) / Math.PI) % 360 + 360) % 360);
    read.textContent = zone === "rest" ? "rest" : zone === "door" ? `door ${deg(dr.t)}°` : `wheel ${deg(wh.t)}°`;
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { for (const s of [wh, dr]) { s.k = 100 * v; s.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "vaultdoor",
  means: "A round vault door in a wall: its spoked wheel turns to follow the pointer, and near the edge the door swings ajar.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[197, 158], [233, 196], [176, 176], null],
  mount,
});
