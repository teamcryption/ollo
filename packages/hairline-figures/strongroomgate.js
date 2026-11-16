/**
 * Vault grille: a barred gate in a strongroom doorway, a cabinet of boxes
 * behind it. At rest the gate stands ajar, bright. The pointer over the
 * doorway swings it open on its hinge. The slider is how far it swings.
 *
 * The pattern: one part that answers (a swing).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 57, Z0 = 2, Z1 = 70, HX = 1, HY = 1, REST = 22;
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-10, -30, 0], [72, 64, 0], [72, -30, 0], [-10, 64, 0], [-5, -3, 78], [65, 3, 78], [HX, HY + W, Z1]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 1.5, b = 0.6) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  box(-10, -30, 72, 64, -4, 0, 4, 1.6);
  box(10, -26, 50, -14, 0, 44, 2, 0.8);
  let s = "";
  for (const z of [11, 22, 33]) s += seg(P(10, -14, z), P(50, -14, z));
  s += seg(P(30, -14, 0), P(30, -14, 44));
  mk("path", { d: s, class: "nf lo" }, g);
  box(-5, -3, 1, 3, 0, 72);
  box(59, -3, 65, 3, 0, 72);
  box(-5, -3, 65, 3, 72, 78);

  const frame = mk("path", { class: "sil nf hi" }, g), bars = mk("path", { class: "nf" }, g);
  const th = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const c = Math.cos(rad(deg)), n = Math.sin(rad(deg)), Q = (u, z) => P(HX + u * c, HY + u * n, z);
    frame.setAttribute("d", poly([Q(0, Z0), Q(W, Z0), Q(W, Z1), Q(0, Z1)]));
    let b = poly([Q(2.5, Z0 + 2.5), Q(W - 2.5, Z0 + 2.5), Q(W - 2.5, Z1 - 2.5), Q(2.5, Z1 - 2.5)]);
    for (let u = 8; u < W - 4; u += 6.5) b += seg(Q(u, Z0 + 2.5), Q(u, Z1 - 2.5));
    for (const z of [26, 46]) b += seg(Q(2.5, z), Q(W - 2.5, z));
    b += poly([Q(W - 9, 32), Q(W - 2.5, 32), Q(W - 2.5, 40), Q(W - 9, 40)]);
    bars.setAttribute("d", b);
  }

  const B = register(stage, (_dt, now) => { draw(tval(th, now)); return !tdone(th, now); });
  bag.add(B.unregister);

  const pts = [P(-10, -30, 0), P(72, 64, 0), P(72, -30, 0), P(-10, 64, 0), P(-5, -3, 78), P(65, 3, 78)];
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(th, v ? open : REST, performance.now(), 0);
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(sx > x0 && sx < x1 && sy > y0 && sy < y1), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (on) { tset(th, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "strongroomgate",
  means: "A barred grille gate in a strongroom doorway: the pointer over the doorway swings the gate open on its hinge.",
  rules: [1, 3, 5, 6],
  range: [60, 90, 110],
  tour: [[217, 140], [179, 75], [258, 115], null],
  mount,
});
