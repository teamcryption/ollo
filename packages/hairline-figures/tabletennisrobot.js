/**
 * Ball machine: a court ball machine on a wheeled base, a hopper of balls on
 * top and a launch barrel out of its front. The barrel turns to aim where the
 * pointer stands on the court, along the front arc, on a spring. At rest it
 * aims a little left of centre, bright. The slider is the barrel's tilt.
 *
 * The pattern: one part turning to face the pointer (officechairs).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rad, rings, ringAt, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PZ = 30, R = 7, L0 = 10, L1 = 50, REST = 28;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tilt = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-30, -24, 0], [58, 58, PZ], [30, 24, 0], [-24, 30, 0], [0, 0, 62], [58, 0, PZ + 14], [0, 58, PZ + 14]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // wheels behind the base, then the base, body and hopper
  for (const [x, y] of [[-26, -18], [26, -18], [-26, 18], [26, 18]]) put(solid(g), prism(P, front, disc(x, y, 5, 16), disc(x, y, 3.5, 16), 0, 4));
  const [br, bi] = rings(-30, -22, 30, 22, 8, 2);
  put(solid(g), prism(P, front, br, bi, 4, 10));
  const [mr, mi] = rings(-20, -16, 20, 16, 7, 2);
  put(solid(g), prism(P, front, mr, mi, 10, 40));
  // hopper: wider at the top, with balls heaped in it
  const foot = rings(-14, -11, 14, 11, 5, 1.5)[0], [top, tin] = rings(-19, -15, 19, 15, 6, 2);
  const hs = solid(g);
  put(hs, { sil: poly(hull(ringAt(P, foot, 40).concat(ringAt(P, top, 56)))), crease: poly(ringAt(P, tin, 56)) });
  hs.cr.setAttribute("class", "nf lo");
  for (const [x, y] of [[-9, -6], [0, -7], [9, -5], [-5, 4], [5, 5]]) {
    const b = [];
    for (let i = 0; i <= 4; i++) { const t = (i / 4) * Math.PI; b.push(...ringAt(P, disc(x, y, 4 * Math.sin(t) + 0.3, 14), 53 + 4 * -Math.cos(t))); }
    mk("path", { d: poly(hull(b)), class: "nf lo" }, g);
  }
  // the barrel: a cylinder from the body's front, pivoting on its centre
  const barrel = mk("path", { class: "sil hi" }, g), mouth = mk("path", { class: "nf lo" }, g), ball = mk("circle", { r: 2.4, class: "dot" }, g);
  const yaw = spring(REST);
  let last = NaN, lastT = NaN;
  function draw(a) {
    if (a === last && tilt === lastT) return;
    last = a; lastT = tilt;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), tc = Math.cos(rad(tilt)), ts = Math.sin(rad(tilt));
    const ax = [c * tc, s * tc, ts], px = [-s, c, 0], up = [-c * ts, -s * ts, tc];
    const end = (l) => { const o = []; for (let i = 0; i < 24; i++) { const t = (i / 24) * 2 * Math.PI, k = Math.cos(t) * R, m = Math.sin(t) * R; o.push(P(ax[0] * l + px[0] * k + up[0] * m, ax[1] * l + px[1] * k + up[1] * m, PZ + ax[2] * l + up[2] * m)); } return o; };
    barrel.setAttribute("d", poly(hull(end(L0).concat(end(L1)))));
    mouth.setAttribute("d", poly(end(L1)));
    const m = P(ax[0] * L1, ax[1] * L1, PZ + ax[2] * L1);
    ball.setAttribute("cx", m[0]); ball.setAttribute("cy", m[1]);
  }
  const B = register(stage, (dt) => { const mv = stepS(yaw, dt); draw(yaw.x); return mv; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { yaw.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    const a = clamp((Math.atan2(y, x) * 180) / Math.PI, 0, 90);
    yaw.t = a;
    read.textContent = "aim " + Math.round(a - 45) + "°";
    B.wake();
  }
  read.textContent = "rest";
  draw(REST);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tilt = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "tabletennisrobot",
  means: "A court ball machine with a hopper of balls: its barrel turns to aim where the pointer stands on the court.",
  rules: [1, 3, 5, 8],
  range: [0, 12, 30],
  tour: [[310, 225], [205, 262], [95, 225], null],
  mount,
});
