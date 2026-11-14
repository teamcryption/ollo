/**
 * Docking port: a round docking collar on a hull plate, latches round its
 * rim, a hatch hinged at the far edge. The pointer swings the hatch open:
 * the nearer it comes to the port, the wider the hatch stands. At rest the
 * hatch is ajar and the collar is bright.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, unproj, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid, flatDot, place,
} = HL;

const R = 30, RIM = 50, CZ = 4, CH = 12, OPEN = 105, AJAR = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-RIM, -RIM, 0], [RIM, RIM, 0], [-R, 0, CZ + CH + 2 * R + 4], [-R - 10, -R, CZ + CH + 2 * R]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-RIM, -RIM, RIM, RIM, 14, 2);
  put(solid(g), prism(P, front, pr, pi, 0, CZ));
  const collar = solid(g);
  put(collar, prism(P, front, circ(R + 6, 40), circ(R + 3.5, 40), CZ, CZ + CH));
  mk("path", { d: poly(ringAt(P, circ(R, 40), CZ + CH)), class: "nf lo" }, g);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3, d = mk("circle", { r: 1.6, class: "dot off" }, g);
    place(d, P((R + 4.8) * Math.cos(a), (R + 4.8) * Math.sin(a), CZ + CH));
  }
  const hatch = mk("path", { class: "sil" }, g), wheel = mk("path", { class: "nf lo" }, g);
  const ang = spring(AJAR);
  let last = NaN;

  const tilt = (q, z, th) => { const s = q.u + R; return [-R + s * Math.cos(th), q.v, CZ + CH + 1 + s * Math.sin(th) + z * Math.cos(th)]; };
  function draw(deg) {
    const k = Math.round(deg * 10);
    if (k === last) return;
    last = k;
    const th = (deg * Math.PI) / 180, ring = circ(R - 1, 40), pts = [];
    for (const z of [0, 3]) for (const q of ring) pts.push(P(...tilt(q, z, th)));
    hatch.setAttribute("d", poly(hull(pts)));
    wheel.setAttribute("d", poly(circ(10, 24).map((q) => P(...tilt(q, 3.4, th)))));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function set(p) {
    let o = 0;
    if (p) { const [wx, wy] = unproj(C, p[0], p[1], 0); o = clamp(1.3 - Math.hypot(wx, wy) / (RIM * 1.4), 0, 1) * (0.4 + 0.6 * reach); }
    ang.t = o > 0 ? AJAR + (OPEN - AJAR) * o : AJAR;
    hatch.classList.toggle("hi", o > 0.05);
    collar.sil.classList.toggle("hi", o <= 0.05);
    read.textContent = o > 0.05 ? Math.round(ang.t) + "°" : "rest";
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "dockingport",
  means: "A docking collar on a hull plate: the pointer near the port swings its hatch open on the far hinge.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[283, 191], [221, 222], [221, 270], null],
  mount,
});
