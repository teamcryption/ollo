/**
 * Post trolley: a deep mail box on four casters with a push handle at the
 * back, its lid hinged along the back edge. The pointer's height is the lid:
 * it swings up and over toward the handle. At rest it stands a crack open,
 * the latch bright. The slider is the rest opening.
 *
 * The pattern: one lid opening on a hinge by the pointer (open).
 */
const {
  Cam, fit, hull, poly, prism, proj, rings, ringAt, clamp, rad, circ,
  disposer, mk, pointer, put, register, solid, spring, stepS, facing, flatDot, place,
} = HL;

const X0 = -20, X1 = 20, Y = 14, Z = 40, AMAX = 115;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restA = value;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[-26, -16, 0], [22, 16, 0], [-26, 0, 62], [X0, -Y, Z + 42], [X0 + 40 * Math.cos(rad(60)), Y, Z + 40 * Math.sin(rad(60))]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => { const [r, i] = rings(x - 3.5, y - 3.5, x + 3.5, y + 3.5, 3.5, 1); put(solid(g), prism(P, front, r, i, 0, 9)); };
  wheel(-15, -10); wheel(15, -10); wheel(-15, 10);
  const bar = (a, b, r) => hull(circ(r, 12).flatMap((q) => [P(a[0] + q.u, a[1] + q.v, a[2]), P(b[0] + q.u, b[1] + q.v, b[2])]));
  for (const y of [-11, 11]) mk("path", { class: "sil", d: poly(bar([-23, y, 30], [-25, y, 60], 1.6)) }, g);
  mk("path", { class: "sil", d: poly(hull([-1, 1].flatMap((s) => circ(1.8, 12).flatMap((q) => [P(-25 + q.u, s * 12, 60 + q.v)])))) }, g);
  const [br, bi] = rings(X0, -Y, X1, Y, 3, 1.4);
  put(solid(g), prism(P, front, br, bi, 9, Z));
  const mouth = mk("path", { class: "nf lo" }, g);
  wheel(15, 10);
  const lid = mk("path", { class: "sil" }, g), lidc = mk("path", { class: "nf lo" }, g);
  const latch = flatDot(g, C, 2.4, "dot");
  const [lr, li] = rings(0, -Y - 1, X1 - X0 + 1, Y + 1, 3, 1.4);
  const A = spring(restA);
  let last = NaN, act = false;

  function draw() {
    const a = A.x;
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const at = (q, t) => P(X0 + q.u * c - t * s, q.v, Z + q.u * s + t * c);
    lid.setAttribute("d", poly(hull(lr.flatMap((q) => [at(q, 0), at(q, 2.2)]))));
    lidc.setAttribute("d", poly(li.map((q) => at(q, a > 100 ? 0 : 2.2))));
    mouth.setAttribute("d", a > 8 ? poly(ringAt(P, bi, Z)) : "");
    place(latch, at({ u: X1 - X0 - 2, v: 0 }, 2.2));
    read.textContent = act ? Math.round(a) + "°" : "rest";
  }

  const B = register(stage, (dt) => { const m = stepS(A, dt); draw(); return m; });
  bag.add(B.unregister);
  function setActive(on, a) {
    act = on; A.t = a;
    lid.classList.toggle("hi", on);
    latch.setAttribute("class", on ? "dot off" : "dot");
    last = NaN; B.wake();
  }
  setActive(false, restA);
  draw();
  bag.add(pointer(stage, {
    move: ([, sy]) => setActive(true, clamp(AMAX - ((sy - 60) / 190) * AMAX, 0, AMAX)),
    leave: () => setActive(false, restA),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restA = v; if (!act) setActive(false, v); }, destroy: bag.dispose };
}

hairline({
  name: "postbike",
  means: "A post trolley: the lid of the mail box swings open on its back hinge as the pointer rises.",
  rules: [1, 3, 4, 5],
  range: [4, 12, 20],
  tour: [[200, 225], [242, 172], [233, 308], null],
  mount,
});
