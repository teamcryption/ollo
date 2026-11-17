/**
 * Linear actuator: an electric linear actuator lying on the bench, a square
 * tube with its motor alongside and a gearbox joining them at the back, a
 * polished rod in the tube ending in a rod-end eye. The pointer over it runs
 * the motor: the rod drives out of the tube. At rest the rod sits nearly home,
 * bright. The slider is the stroke, how far the rod drives out.
 *
 * The pattern: one part sliding along a fixed axis.
 */
const { Cam, fit, facing, circ, hull, poly, prism, proj, rings, tset, tval, tdone, tween, disposer, flatDot, mk, place, pointer, put, register, solid } = HL;

const ZA = 11, X1 = 18, STROKE = 44;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.05);
  fit(C, [[-50, -9, 0], [-50, 25, 0], [X1 + 12 + STROKE * 1.3, -6, 0], [X1 + 12 + STROKE * 1.3, 6, 18], [-50, -9, 20], [0, 25, 20]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const R = (x0, y0, x1, y1, r, b) => rings(x0, y0, x1, y1, r, b);
  put(solid(g), prism(P, front, ...R(-50, -9, -38, 25, 4, 1.2), 2, 20));
  put(solid(g), prism(P, front, ...R(-38, -7, X1, 7, 3, 1.2), 4, 18));
  put(solid(g), prism(P, front, ...R(-38, 10, -2, 24, 6.5, 1.4), 4, 18));
  for (const x of [-34, -26, -18]) place(flatDot(g, C, 0.9, "dot off"), P(x, 17, 18));
  put(solid(g), prism(P, front, ...R(X1 - 1, -6, X1 + 3, 6, 2, 0.8), 5, 17));

  const rod = solid(g), eye = solid(g);
  rod.sil.classList.add("hi");
  const hole = flatDot(g, C, 1.6, "dot m");
  const ring = circ(3.6, 24), inner = circ(2.4, 24);
  const at = (q, x) => P(x, q.u, ZA + q.v);

  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const e = X1 + 3 + 6 + STROKE * amp * t;
    rod.sil.setAttribute("d", poly(hull(ring.map((q) => at(q, X1 + 3)).concat(ring.map((q) => at(q, e))))));
    rod.cr.setAttribute("d", "");
    put(eye, prism(P, front, ...rings(e - 1, -5.5, e + 11, 5.5, 5.4, 1.3), ZA - 4.5, ZA + 4.5));
    place(hole, P(e + 5.5, 0, ZA + 4.5));
  }
  const tw = tween(0);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 8, 10);
  let on = null;
  function set(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? "extend" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(Math.abs(sx - mid[0]) < 170 && Math.abs(sy - mid[1]) < 110), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; draw(tval(tw, performance.now())); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "linearrail",
  means: "An electric linear actuator, motor alongside its tube: the pointer runs it, and the rod drives out to its rod-end eye.",
  rules: [1, 4, 5, 8],
  range: [0.4, 1, 1.3],
  tour: [[241, 172], [150, 150], [267, 195], null],
  mount,
});
