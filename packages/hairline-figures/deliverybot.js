/**
 * Delivery robot: a six-wheeled sidewalk cooler with a deep lid hinged at the
 * back and a tall whip flag on its rear. The pointer is the customer: the lid
 * swings up and back on its hinge to show the empty cargo well. At rest the
 * lid sits just ajar and the pennant on the flag is the bright mark.
 * The slider is how far the lid opens.
 *
 * The pattern: one answer on a spring; the hit is the rest pose's screen box.
 */
const {
  Cam, facing, fit, hull, open, poly, proj, prism, rings, run, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = -18, X1 = 18, Y = 12, ZB = 5, ZT = 20, ZL = 28;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.7);
  fit(C, [[X0 - 2, -Y - 2, 0], [X1 + 2, Y + 2, 0], [X1 + 2, -Y - 2, 0], [X0 - 2, Y + 2, 0], [X0 - 8, -Y, ZT + 38], [X0 - 1, -8, 62]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => {
    const pts = [];
    for (const yy of [y - 1.4, y + 1.4]) for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; pts.push(P(x + 5 * Math.cos(a), yy, 5 + 5 * Math.sin(a))); }
    const hub = [];
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; hub.push(P(x + 1.8 * Math.cos(a), y + (y > 0 ? 1.5 : -1.5), 5 + 1.8 * Math.sin(a))); }
    return [poly(hull(pts)), poly(hub)];
  };
  // the flag whip, farthest, then far wheels, body, near wheels, lid
  mk("path", { d: poly(hull([P(X0 - 1, -8, 12), P(X0 - 0.4, -8, 12), P(X0 - 0.4, -8, 62), P(X0 - 1, -8, 62)])), class: "sil" }, g);
  const flag = mk("path", { d: poly([P(X0 - 0.7, -8, 61), P(X0 - 0.7, -8 - 11, 57.5), P(X0 - 0.7, -8, 54)]), class: "nf sil" }, g);
  for (const x of [X0 + 6, 0, X1 - 6]) { const [w] = wheel(x, -Y - 1.6); mk("path", { d: w, class: "sil" }, g); }
  const [br, bi] = rings(X0, -Y, X1, Y, 5, 1.6);
  put(solid(g), prism(P, front, br, bi, ZB, ZT));
  const [wr] = rings(X0 + 2.5, -Y + 2.5, X1 - 2.5, Y - 2.5, 3, 1);
  mk("path", { d: poly(wr.map((q) => P(q.u, q.v, ZT))), class: "nf lo" }, g);
  for (const x of [X0 + 6, 0, X1 - 6]) { const [w, h] = wheel(x, Y + 1.6); mk("path", { d: w, class: "sil" }, g); mk("path", { d: h, class: "nf lo" }, g); }
  const lid = solid(g);
  const [lr, li] = rings(X0, -Y, X1, Y, 5, 1.6);

  const sp = spring(0);
  let drawn = NaN;
  function draw() {
    const t = sp.x;
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    const ph = 0.1 + t * 1.75, c = Math.cos(ph), s = Math.sin(ph);
    const T = (x, y, z) => { const dx = x - X0, dz = z - ZT; return P(X0 + dx * c - dz * s, y, ZT + dx * s + dz * c); };
    const pts = [];
    for (const z of [ZT, ZL]) for (const q of lr) pts.push(T(q.u, q.v, z));
    lid.sil.setAttribute("d", poly(hull(pts)));
    lid.cr.setAttribute("d", open(run(li, front).map((q) => T(q.u, q.v, ZL))));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  const xs = [P(X0, Y, 0)[0], P(X1, -Y, 0)[0]], ys = [P(X0, -Y, ZL + 10)[1], P(X1, Y, 0)[1] + 10];
  let on = false;
  function setOn(v) {
    on = v;
    sp.t = on ? clamp(amp, 0, 1) : 0;
    lid.sil.classList.toggle("hi", on);
    flag.classList.toggle("hi", !on);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setOn(sx > xs[0] - 10 && sx < xs[1] + 10 && sy > ys[0] && sy < ys[1]),
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  setOn(false);
  return {
    set: (v) => { amp = v; if (on) { sp.t = clamp(amp, 0, 1); B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "deliverybot",
  means: "A six-wheeled sidewalk delivery robot with a whip flag: at the pointer its deep lid swings up on its hinge to show the cargo well.",
  rules: [1, 3, 5, 6],
  range: [0.3, 1, 1],
  tour: [[213, 180], [150, 230], [260, 205], null],
  mount,
});
