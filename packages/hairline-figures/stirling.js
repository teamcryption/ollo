/**
 * Stirling engine: a hot cylinder on a base plate, a small power cylinder on
 * top of it, and a spoked flywheel on a post, joined by a crank and a rod.
 * The pointer warms the engine: the flywheel turns through a broad arc, the
 * rod swings and the piston rises and falls with it. At rest the flywheel
 * waits, bright. The slider is how far the flywheel turns.
 *
 * The pattern: one part answering a discrete choice (a tween on an angle).
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, seg, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const FX = 30, FY = 0, FZ = 44, R = 28, T = 4, CR = 14, ANG = 150, REST = 200;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.65);
  fit(C, [[-46, -22, 0], [48, 22, 0], [48, -22, 0], [-46, 22, 0], [FX, FY, FZ + R], [FX, FY - R, FZ], [FX + T, FY + R, FZ]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-46, -22, 48, 22, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 5));
  // the hot cylinder and the power cylinder on it
  put(solid(g), prism(P, front, disc(-22, 0, 15), disc(-22, 0, 13), 5, 24));
  put(solid(g), prism(P, front, disc(-22, 0, 6), disc(-22, 0, 4.6), 24, 34));
  const piston = solid(g);
  // the post holding the flywheel's axle
  const [pr, pi] = rings(FX - 6, FY - 3, FX - 1, FY + 3, 1.2, 0.6);
  put(solid(g), prism(P, front, pr, pi, 5, FZ + 2));
  const wp = (r, a, x) => P(x, FY + r * Math.cos(a), FZ + r * Math.sin(a));
  const ring = (r, y, n = 56) => Array.from({ length: n }, (_, i) => wp(r, (i / n) * Math.PI * 2, y));
  const wheel = mk("path", { class: "sil hi" }, g);
  const face = mk("path", { class: "lo" }, g);
  const spokes = mk("path", { class: "sil" }, g);
  const hub = mk("path", { class: "" }, g);
  const rod = mk("path", { class: "nf sil" }, g);
  const pin = mk("path", { class: "" }, g);
  wheel.setAttribute("d", poly(hull(ring(R, FX).concat(ring(R, FX + T)))));
  face.setAttribute("d", poly(ring(R - 4, FX + T)));

  const tw = tween(0);
  let last = "";
  function draw(s) {
    const a0 = (REST + s * amp * ANG) * Math.PI / 180;
    const key = a0.toFixed(4);
    if (key === last) return;
    last = key;
    let sp = "";
    for (let i = 0; i < 3; i++) {
      const a = a0 + (i / 3) * Math.PI * 2, w = 0.2, v = 0.07;
      sp += poly([wp(4, a - w, FX + T), wp(R - 3, a - v, FX + T), wp(R - 3, a + v, FX + T), wp(4, a + w, FX + T)]);
    }
    spokes.setAttribute("d", sp);
    hub.setAttribute("d", poly(hull(ring(4, FX + T, 16).concat(ring(4, FX + T + 3, 16)))));
    const cp = [FX + T + 3, FY + CR * Math.cos(a0), FZ + CR * Math.sin(a0)];
    const zp = 36 + 5 * Math.sin(a0);
    put(piston, prism(P, front, disc(-22, 0, 4.4), disc(-22, 0, 3.2), 32, zp));
    rod.setAttribute("d", seg(P(-22, 0, zp), P(cp[0], cp[1], cp[2])));
    pin.setAttribute("d", poly(hull(circ(2.4, 14).map((q) => P(cp[0], cp[1] + q.u, cp[2] + q.v)).concat(circ(2.4, 14).map((q) => P(cp[0] + 2, cp[1] + q.u, cp[2] + q.v))))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(FX, FY, FZ - 8);
  let on = null;
  function choose(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? `turn ${Math.round(amp * ANG)}°` : "rest";
    B.wake();
  }
  choose(false);
  bag.add(pointer(stage, { move: (p) => choose(Math.hypot(p[0] - mid[0], p[1] - mid[1]) < R * 3.4), leave: () => choose(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { amp = v; last = ""; if (on) read.textContent = `turn ${Math.round(amp * ANG)}°`; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "stirling",
  means: "A Stirling engine on its plate: the pointer warms it and the flywheel turns, swinging the rod as the piston rises and falls.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.5],
  tour: [[258, 129], [236, 92], [270, 172], null],
  mount,
});
