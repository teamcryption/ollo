/**
 * Backdrop stand: two uprights and a crossbar holding a roll of paper, the
 * paper hanging to the floor and curving out into a sweep. The pointer on the
 * floor is how far the sweep is pulled: the paper unrolls toward it and the
 * roll grows thinner. At rest a short sweep lies out, the roll bright. The
 * slider is the rest pull.
 *
 * The pattern: one value drawn out by the pointer (pull).
 */
const {
  Cam, circ, fit, hull, open, poly, prism, proj, rings, unproj, clamp,
  disposer, mk, pointer, put, register, solid, spring, stepS, facing,
} = HL;

const W = 72, H = 84, RB = 9, MAXL = 66;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restL = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-12, -12, 0], [W + 12, -12, H + 10], [-12, -12, H + 10], [0, MAXL, 0], [W, MAXL, 0], [W + 12, 0, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the stand: a foot and an upright at each end
  for (const x of [-7, W + 7]) {
    const [fr, fi] = rings(x - 2, -16, x + 2, 16, 2, 0.7);
    put(solid(g), prism(P, front, fr, fi, 0, 2.4));
    const [ur, ui] = rings(x - 1.6, -1.6, x + 1.6, 1.6, 1.6, 0.5);
    put(solid(g), prism(P, front, ur, ui, 2.4, H + 7));
  }
  const bar = solid(g), roll = solid(g), paper = mk("path", { class: "sil" }, g), bend = mk("path", { class: "nf lo" }, g);
  const L = spring(restL);
  let last = NaN, act = false;

  const disc = (r, n = 24) => circ(r, n);
  function draw() {
    const l = L.x;
    if (l === last) return;
    last = l;
    const rr = clamp(7 - l * 0.06, 3, 7);
    // the roll and the bar through it, a cylinder lying along x
    const cyl = (x0, x1, r, z) => hull(disc(r).flatMap((q) => [P(x0, q.u, z + q.v), P(x1, q.u, z + q.v)]));
    bar.sil.setAttribute("d", poly(cyl(-9, W + 9, 1.3, H + 5)));
    roll.sil.setAttribute("d", poly(cyl(-2, W + 2, rr, H + 5)));
    roll.cr.setAttribute("d", open(disc(rr - 0.8).map((q) => P(W + 2, q.u, H + 5 + q.v))));
    // the paper's side profile: down from the roll, round the bend, out on the floor
    const prof = [[rr, H + 5]];
    const b = Math.min(RB, l);
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); prof.push([rr + b - b * Math.cos(t), b - b * Math.sin(t)]); }
    prof.push([rr + l, 0]);
    const side = (x) => prof.map(([y, z]) => P(x, y, z));
    paper.setAttribute("d", poly(side(0).concat(side(W).reverse())));
    bend.setAttribute("d", open([P(0, rr, b), P(W, rr, b)]));
    read.textContent = act ? String(Math.round(l)) : "rest";
  }

  const B = register(stage, (dt) => { const m = stepS(L, dt); draw(); return m; });
  bag.add(B.unregister);

  function setActive(on, l) {
    act = on;
    L.t = l;
    paper.classList.toggle("hi", on);
    roll.sil.classList.toggle("hi", !on);
    last = NaN;
    B.wake();
  }
  setActive(false, restL);
  draw();
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [, y] = unproj(C, sx, sy, 0); setActive(true, clamp(y, 4, MAXL - 6)); },
    leave: () => setActive(false, restL),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restL = v; if (!act) setActive(false, v); }, destroy: bag.dispose };
}

hairline({
  name: "greenscreen",
  means: "A backdrop stand with a roll of paper: the sweep unrolls across the floor toward the pointer and the roll thins.",
  rules: [1, 3, 4, 5],
  range: [8, 20, 32],
  tour: [[181, 221], [149, 275], [164, 302], null],
  mount,
});
