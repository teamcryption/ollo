/**
 * Drone remote: a flat controller with two thumb sticks and a pair of wide
 * paddle antennas hinged along its back edge. At rest the antennas lean back
 * low, bright. The pointer over the remote swings them up to stand tall, on
 * a spring. The slider is how far they swing.
 *
 * The pattern: one part answering (aim), hit on the rest footprint.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rad, rings, run, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 32, H = 10, AL = 30, HZ = 6, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[-4, -AL, 0], [W + 4, D + 4, 0], [W + 4, -4, AL + HZ], [-4, -4, AL + HZ], [W + 4, -AL, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the antennas: two paddles on one hinge line behind the body
  const ants = [[6, 26], [W - 26, W - 6]].map(([x0, x1]) => {
    const [o, i] = rings(x0, 0, x1, AL, 4, 1.2);
    return { o, i, el: solid(g) };
  });
  const hinge = mk("path", { class: "nf lo" }, g);
  hinge.setAttribute("d", open([P(4, -1, HZ), P(W - 4, -1, HZ)]));

  // the body, its grips and the sticks
  const [bo, bi] = rings(0, 0, W, D, 9, 1.6);
  put(solid(g), prism(P, front, bo, bi, 0, H));
  const disc = (x, y, r) => circ(r, 24).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
  for (const x of [16, W - 16]) {
    put(solid(g), prism(P, front, disc(x, 14, 5), disc(x, 14, 4), H, H + 2));
    put(solid(g), prism(P, front, disc(x, 14, 1.6), disc(x, 14, 1), H + 2, H + 7));
  }
  const pad = rings(W / 2 - 6, 20, W / 2 + 6, 26, 2, 0.8);
  put(solid(g), prism(P, front, pad[0], pad[1], H, H + 1));

  const sp = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const T = (q, w) => P(q.u, -1 - q.v * c + w * s, HZ + q.v * s + w * c);
    for (const an of ants) {
      const pts = an.o.map((q) => T(q, 0)).concat(an.o.map((q) => T(q, 2.2)));
      an.el.sil.setAttribute("d", poly(hull(pts)));
      an.el.cr.setAttribute("d", open(run(an.i, front).map((q) => T(q, 2.2))));
    }
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(clamp(sp.x, 0, 90)); return m; });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    sp.t = v ? clamp(REST + swing, 0, 90) : REST;
    for (const an of ants) an.el.sil.classList.add("hi");
    read.textContent = v ? "ant " + Math.round(sp.t) + "°" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    return x > -4 && x < W + 4 && y > -12 && y < D + 4;
  }
  setOn(false);
  draw(REST);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; if (on) { sp.t = clamp(REST + v, 0, 90); read.textContent = "ant " + Math.round(sp.t) + "°"; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "dronecontroller",
  means: "A drone remote with two thumb sticks: over it, the paddle antennas on its back edge swing up to stand tall.",
  rules: [1, 3, 5, 8],
  range: [30, 66, 76],
  tour: [[98, 141], [131, 186], [165, 232], null],
  mount,
});
