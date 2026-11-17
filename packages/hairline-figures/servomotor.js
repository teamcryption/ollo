/**
 * Servo: a hobby servo, its case standing on two mounting tabs, the output
 * shaft near one end, a long double-arm horn on the spline. The pointer over
 * the servo drives it: the horn sweeps round on its shaft. At rest the horn
 * sits a little askew, bright. The slider is how far the horn sweeps.
 *
 * The pattern: one part turning about a fixed pivot.
 */
const { Cam, fit, facing, circ, hull, poly, prism, proj, rad, rings, tset, tval, tdone, tween, disposer, flatDot, mk, place, pointer, put, register, solid } = HL;

const SX = 11, HZ = 27, L = 27;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 4.3);
  fit(C, [[-30, -12, 0], [30, 12, 0], [-30, 12, 0], [30, -12, 0], [SX - L - 4, -L, HZ], [SX + L + 4, L, HZ], [SX - L, L, HZ], [SX + L, -L, HZ]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-20, -10, 20, 10, 3, 1.4);
  put(solid(g), prism(P, front, br, null, 0, 15));
  const [tr, ti] = rings(-29, -6, 29, 6, 2.5, 1.1);
  put(solid(g), prism(P, front, tr, ti, 15, 17));
  for (const x of [-25.5, 25.5]) place(flatDot(g, C, 1.3, "dot off"), P(x, 0, 17));
  put(solid(g), prism(P, front, br, bi, 17, 22));
  put(solid(g), prism(P, front, disc(SX, 0, 6.5), disc(SX, 0, 5.3), 22, 24.5));
  put(solid(g), prism(P, front, disc(SX, 0, 4.2, 20), null, 24.5, HZ - 2.5));

  const horn = solid(g);
  horn.sil.classList.add("hi");
  const holes = [8, 13, 18, 23, -8, -13, -18, -23].map(() => flatDot(g, C, 0.9, "dot off"));
  const screw = flatDot(g, C, 1.5, "dot m");
  const plan = [];
  for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; plan.push([6.5 * Math.cos(t), 6.5 * Math.sin(t)], [L + 3.2 * Math.cos(t), 3.2 * Math.sin(t)], [-L + 3.2 * Math.cos(t), 3.2 * Math.sin(t)]); }
  const inner = plan.map(([u, v]) => [u * 0.9, v * 0.78]);

  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = rad(28 + 100 * amp * t), ca = Math.cos(a), sa = Math.sin(a);
    const K = ([u, v], z) => P(SX + u * ca - v * sa, u * sa + v * ca, z);
    horn.sil.setAttribute("d", poly(hull(plan.map((p) => K(p, HZ - 2.5)).concat(plan.map((p) => K(p, HZ))))));
    horn.cr.setAttribute("d", poly(hull(inner.map((p) => K(p, HZ)))));
    [8, 13, 18, 23, -8, -13, -18, -23].forEach((u, i) => place(holes[i], K([u, 0], HZ)));
    place(screw, K([0, 0], HZ));
  }
  const tw = tween(0);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, 12);
  let on = null;
  function set(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? "sweep" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(Math.abs(sx - mid[0]) < 150 && Math.abs(sy - mid[1]) < 110), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; draw(tval(tw, performance.now())); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "servomotor",
  means: "A hobby servo on its mounting tabs: the pointer drives it, and the long horn sweeps round on the output shaft.",
  rules: [1, 4, 5, 8],
  range: [0.4, 1, 1.4],
  tour: [[230, 186], [150, 150], [227, 215], null],
  mount,
});
