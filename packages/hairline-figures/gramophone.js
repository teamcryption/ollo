/**
 * Gramophone: a wooden case with a platter, a crank on its side and a big
 * horn on a post. The pointer over the figure swings the horn round on its
 * post to face the listener. At rest the horn points away, bright. The
 * slider is how far it swings.
 */
const { Cam, circ, fit, hull, poly, proj, clamp, spring, stepS, disposer, mk, pointer, register } = HL;

const HB = [42, 42, 44], HL_ = 58, HR = 24, PH = 0.42;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [50, 50, 0], [50, 0, 0], [0, 50, 0], [-14, 20, 100], [60, 96, 90], [96, 40, 90]], 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const face = (pts) => mk("path", { d: poly(pts.map((p) => P(...p))) }, g);
  face([[50, 0, 0], [50, 50, 0], [50, 50, 18], [50, 0, 18]]);
  face([[0, 50, 0], [50, 50, 0], [50, 50, 18], [0, 50, 18]]);
  face([[0, 0, 18], [50, 0, 18], [50, 50, 18], [0, 50, 18]]);
  const disc = (x, y, r, z) => circ(r, 36).map((q) => P(x + q.u, y + q.v, z));
  mk("path", { d: poly(hull(disc(22, 22, 17, 18).concat(disc(22, 22, 17, 20)))) + poly(disc(22, 22, 17, 20)), class: "" }, g);
  mk("path", { d: poly(disc(22, 22, 3, 20)), class: "nf lo" }, g);
  // the crank on the near side
  const cr = [P(50, 25, 9), P(56, 25, 9), P(56, 25, 9), P(56, 33, 3), P(60, 33, 3)];
  mk("path", { d: "M" + cr.map((p) => p.join(",")).join("L"), class: "nf" }, g);
  mk("path", { d: poly(hull(disc(HB[0], HB[1], 2, 18).concat(disc(HB[0], HB[1], 2, HB[2])))), class: "" }, g);
  const horn = mk("path", { class: "sil" }, g), bell = mk("path", { class: "nf lo" }, g);
  const s = spring(0, { k: 90, c: 17 });
  let last = NaN;
  function draw(o) {
    if (o === last) return;
    last = o;
    const th = (200 - o * 130) * Math.PI / 180, ct = Math.cos(th), st = Math.sin(th), cp = Math.cos(PH), sp = Math.sin(PH);
    const d = [ct * cp, st * cp, sp], e1 = [-st, ct, 0], e2 = [-ct * sp, -st * sp, cp];
    const ring = (t, r) => circ(r, 36).map((q) => P(HB[0] + d[0] * t + (e1[0] * q.u + e2[0] * q.v), HB[1] + d[1] * t + (e1[1] * q.u + e2[1] * q.v), HB[2] + d[2] * t + (e1[2] * q.u + e2[2] * q.v)));
    let pts = [];
    for (const [t, r] of [[0, 3], [HL_ * 0.5, 6], [HL_ * 0.8, 12], [HL_, HR]]) pts = pts.concat(ring(t, r));
    horn.setAttribute("d", poly(hull(pts)));
    bell.setAttribute("d", poly(ring(HL_, HR)) + poly(ring(HL_ - 2, HR * 0.55)));
  }
  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(s.x); return m; });
  bag.add(B.unregister);
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    s.t = v ? clamp(amt, 0.3, 1) : 0;
    read.textContent = v ? "play" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: () => setOn(true), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (on) { s.t = clamp(amt, 0.3, 1); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "gramophone",
  means: "A gramophone with a crank and a big horn on a post: the pointer swings the horn round to face the listener.",
  rules: [1, 3, 5, 6],
  range: [30, 100, 100],
  tour: [[196, 212], [190, 120], [250, 230], null],
  mount,
});
