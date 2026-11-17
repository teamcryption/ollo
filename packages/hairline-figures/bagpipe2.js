/**
 * Bellows accordion: a bass end and a treble end with the pleated bellows
 * between them. The pointer over it pulls the treble end out, and the
 * pleats open into a long fan of folds; at rest the bellows are half drawn
 * and the treble end is bright. The slider is how far it pulls.
 *
 * The pattern: one part sliding on an axis.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const E = 16, D = 40, Ht = 50, K = 10, IN = 5, REST = 52;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let pull = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[0, 0, 0], [2 * E + 110, D, 0], [2 * E + 110, 0, Ht], [0, D, Ht]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [lr, li] = rings(0, 0, E, D, 5, 2);
  put(solid(g), prism(P, front, lr, li, 0, Ht));
  for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) { const q = P(4 + i * 4, 8 + j * 8, Ht); mk("circle", { cx: q[0], cy: q[1], r: 1.4, class: "dot off" }, g); }
  const bel = mk("path", { class: "sil" }, g), folds = mk("path", { class: "nf lo" }, g), edge = mk("path", { class: "nf" }, g);
  const right = solid(g), keys = mk("path", { class: "nf lo" }, g);
  right.sil.classList.add("hi");

  const gap = spring(REST);
  let last = NaN;
  function draw(G) {
    if (G === last) return; last = G;
    const pts = [], top = [], bot = [], side = [];
    let fl = "";
    for (let i = 0; i <= K; i++) {
      const x = E + (G * i) / K, n = i % 2 ? IN : 0;
      const c = [P(x, n, n), P(x, D - n, n), P(x, D - n, Ht - n), P(x, n, Ht - n)];
      pts.push(...c);
      top.push(P(x, D - n, Ht - n)); bot.push(P(x, D - n, n)); side.push(P(x, n, Ht - n));
      fl += seg(c[1], c[2]);
    }
    bel.setAttribute("d", poly(hull(pts)));
    folds.setAttribute("d", fl);
    edge.setAttribute("d", open(top) + " " + open(side));
    const x0 = E + G, [rr, ri] = rings(x0, 0, x0 + E, D, 5, 2);
    put(right, prism(P, front, rr, ri, 0, Ht));
    let kd = "";
    for (let j = 0; j < 7; j++) kd += seg(P(x0 + 3, 4 + j * 5, Ht), P(x0 + E - 3, 4 + j * 5, Ht));
    keys.setAttribute("d", kd);
  }
  const B = register(stage, (dt) => { const m = stepS(gap, dt); draw(gap.x); return m; });
  bag.add(B.unregister);

  let act = null;
  function set(a) {
    if (a === act) return; act = a;
    gap.t = a ? pull : REST;
    read.textContent = a ? "pull" : "rest";
    B.wake();
  }
  set(false);
  draw(REST);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, Ht); set(x > -12 && x < 2 * E + 120 && y > -12 && y < D + 12); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { pull = v; if (act) { gap.t = v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "bagpipe2",
  means: "A bellows accordion: the pointer over it pulls the treble end out and the pleats open into a long fan of folds.",
  rules: [1, 3, 5, 8],
  range: [80, 105, 110],
  tour: [[152, 81], [183, 96], [102, 56], null],
  mount,
});
