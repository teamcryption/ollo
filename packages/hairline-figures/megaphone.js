/**
 * Megaphone: a flared horn on a short stand, with a grip under its throat.
 * The pointer, met on the ground, turns the horn to face it: the yaw is a
 * spring, clamped to a front sector, and the mouth's rim shows while it
 * faces the viewer. At rest it points off to the right, bright.
 * The slider is how far the flare opens.
 *
 * The pattern: one part turning to face the pointer (officechairs).
 */
const {
  Cam, circ, fit, clamp, hull, open, poly, prism, proj, rad, ringAt, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid, facing,
} = HL;

const Z = 34, L = 46, BACK = 6, RT = 5, REST = 10, LO = -40, HI = 130;
const disc = (r, n = 36) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let flare = 14 + value / 9;
  const C = Cam(45, 0.5, 3.6);
  fit(C, [[-20, -20, 0], [20, 20, 0], [-6, 50, Z], [50, -6, Z], [0, 0, Z + 26]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-16, -16, 16, 16, 16, 2);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  put(solid(g), prism(P, front, disc(2.2, 20), disc(1.4, 20), 4, Z - 6));
  const grip = mk("path", {}, g);
  const hg = mk("g", {}, g), sil = mk("path", { class: "sil hi" }, hg), bellS = mk("path", { class: "sil hi" }, hg), rim = mk("path", { class: "nf lo" }, hg), bell = mk("path", { class: "nf lo" }, hg);
  const yaw = spring(REST);
  let last = NaN, lastF = NaN;

  function ring(t, d, r, z = Z) {
    const c = Math.cos(t), s = Math.sin(t), out = [];
    for (let i = 0; i < 40; i++) { const f = (i / 40) * Math.PI * 2, a = Math.cos(f) * r, b = Math.sin(f) * r; out.push(P(c * d - s * a, s * d + c * a, z + b)); }
    return out;
  }
  function draw(deg) {
    if (deg === last && flare === lastF) return;
    last = deg; lastF = flare;
    const t = rad(deg), c = Math.cos(t), s = Math.sin(t);
    const mouth = ring(t, L, flare), throat = ring(t, -BACK, RT), mid = ring(t, L * 0.45, RT + 1.5);
    sil.setAttribute("d", poly(hull(throat.concat(mid))));
    bellS.setAttribute("d", poly(hull(mid.concat(mouth))));
    const faces = c + s > 0.15;
    // paint the nearer end last: the bell when it faces the viewer, the throat otherwise
    if (faces) hg.append(sil, bell, bellS, rim); else hg.append(bellS, bell, sil, rim);
    rim.setAttribute("d", faces ? poly(ring(t, L - 1.5, flare - 2.2)) + poly(ring(t, L - 5, RT + 2)) : "M0 0");
    bell.setAttribute("d", open(ring(t, L * 0.45, RT + 1.5).slice(0, 21)));
    const gx = c * 4, gy = s * 4;
    grip.setAttribute("d", poly(hull(ringAt(P, disc(2.4, 16).map((q) => ({ ...q, u: q.u + gx, v: q.v + gy })), Z - 14).concat(ringAt(P, disc(2.4, 16).map((q) => ({ ...q, u: q.u + gx, v: q.v + gy })), Z - 2)))));
  }

  const B = register(stage, (dt) => { const m = stepS(yaw, dt); draw(yaw.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { yaw.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [wx, wy] = unproj(C, p[0], p[1], 0);
    const d = clamp((Math.atan2(wy, wx) * 180) / Math.PI, LO, HI);
    yaw.t = Math.round(d);
    read.textContent = "aim " + Math.round(d) + "°";
    B.wake();
  }
  aim(null);
  draw(REST);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { flare = 14 + v / 9; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "megaphone",
  means: "A flared megaphone on a stand: the horn turns on its post to face the pointer, and the mouth's rim shows when it faces you.",
  rules: [1, 3, 5, 8],
  range: [0, 45, 90],
  tour: [[300, 190], [200, 280], [110, 210], null],
  mount,
});
