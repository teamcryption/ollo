/**
 * Robot vacuum: a round low robot with a laser turret on its lid and a
 * bumper band at its front. The pointer over the robot flips the lid up on
 * its side hinge to show the bin underneath. At rest the lid sits a little
 * ajar and the turret's dot is bright. The slider is how far the lid opens.
 *
 * The pattern: one part swinging on a hinge; the hit is the robot's rest
 * footprint on the ground, which never moves.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 40, H = 11, T = 2.4, REST = 8, A0 = Math.SQRT1_2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.8);
  // the lid's frame: u runs across the hinge (on the left), v along it toward the viewer, w up
  const W = (u, v, w) => [A0 * (u + v), A0 * (v - u), w];
  const lidPt = (u, v, w, a) => {
    const uu = u + R, c = Math.cos(a), s = Math.sin(a);
    return W(uu * c - w * s - R, v, H + 0.4 + uu * s + w * c);
  };
  const ext = [];
  for (const q of circ(R, 24)) ext.push(lidPt(q.u, q.v, T + 6, (65 * Math.PI) / 180), [q.u, q.v, 0]);
  fit(C, ext, 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(R, 64), circ(R - 2.2, 64), 0, H));
  // the bumper band round the front half
  const band = circ(R + 0.01, 64).filter((q) => q.nu + q.nv > 0.2).map((q) => P(q.u, q.v, H * 0.45));
  mk("path", { d: "M" + band.map((p) => p.join(",")).join("L"), class: "nf lo" }, g);
  // under the lid: the bin and its filter
  const [br, bi] = rings(-16, -16, 16, 16, 5, 2);
  put(solid(g), prism(P, front, br, bi, H - 3, H + 0.3));
  mk("path", { d: poly([[-9, -9], [9, -9], [9, 9], [-9, 9]].map(([x, y]) => P(x, y, H + 0.3))), class: "nf lo" }, g);
  const lid = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g);
  const tur = mk("path", { class: "sil" }, g), turTop = mk("path", { class: "nf lo" }, g);
  const dot = mk("circle", { r: 2.6, class: "dot" }, g);
  const ang = tween(REST);
  let last = NaN;

  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180, ring = circ(R, 64), tr = circ(8, 24);
    const pr = (u, v, w) => P(...lidPt(u, v, w, a));
    const bot = ring.map((q) => pr(q.u, q.v, 0)), top = ring.map((q) => pr(q.u, q.v, T));
    lid.setAttribute("d", poly(hull(bot.concat(top))));
    face.setAttribute("d", poly(circ(R - 2.4, 64).map((q) => pr(q.u, q.v, T))));
    const tc = -14, t0 = tr.map((q) => pr(q.u, q.v + tc, T)), t1 = tr.map((q) => pr(q.u, q.v + tc, T + 6));
    tur.setAttribute("d", poly(hull(t0.concat(t1))));
    turTop.setAttribute("d", poly(circ(6.5, 24).map((q) => pr(q.u, q.v + tc, T + 6))));
    const d = pr(0, tc, T + 6);
    dot.setAttribute("cx", d[0]); dot.setAttribute("cy", d[1]);
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let on = null;
  function setActive(a, force) {
    if (a === on && !force) return;
    on = a;
    tset(ang, a ? 25 + 40 * max : REST, performance.now(), 0);
    lid.classList.toggle("hi", a);
    dot.setAttribute("class", a ? "dot m" : "dot");
    read.textContent = a ? "lid " + Math.round(25 + 40 * max) + "°" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, H); return Math.hypot(x, y) < R + 6; };
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = clamp(v, 0, 1); if (on) setActive(true, true); }, destroy: bag.dispose };
}

hairline({
  name: "robovac",
  means: "A robot vacuum: the pointer over it flips the lid up on its side hinge to show the bin, as far as the slider says.",
  rules: [1, 4, 5, 9],
  range: [0, 0.7, 1],
  tour: [[211, 223], [190, 190], [225, 255], null],
  mount,
});
