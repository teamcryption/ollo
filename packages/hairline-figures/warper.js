/**
 * Warping board: a broad frame board on a low stand with rows of pegs down
 * both sides for measuring out warp threads. The pointer near it tips the
 * board up on its hinge toward upright, further the nearer it comes. At rest
 * the board leans back, bright.
 */
const {
  Cam, fit, fillet, poly, prism, proj, rings, seg, clamp, spring, stepS, facing,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const W = 120, L = 80, Z = 12;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-6, -L, 0], [W + 6, 16, 0], [0, 0, Z + L + 8], [W, 0, Z + L + 8]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [a0, i0] = rings(-6, -L * 0.6, W + 6, 16, 6, 2);
  put(solid(g), prism(P, front, a0, i0, 0, Z - 4));
  const brd = mk("path", { class: "sil hi" }, g), win = mk("path", { class: "nf lo" }, g), pegs = mk("path", { class: "nf" }, g);
  const sp = spring(0.35);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = 0.35 + t * 1.05, ca = Math.cos(a), sa = Math.sin(a);
    const Q = (x, v, n = 0) => P(x, -v * ca + n * sa, Z + v * sa + n * ca);
    brd.setAttribute("d", poly(fillet([Q(0, 0), Q(W, 0), Q(W, L), Q(0, L)], [4, 4, 4, 4])));
    win.setAttribute("d", poly(fillet([Q(18, 14), Q(W - 18, 14), Q(W - 18, L - 14), Q(18, L - 14)], [3, 3, 3, 3])));
    let d = "";
    for (let k = 0; k < 4; k++) for (const x of [8, W - 8]) d += seg(Q(x, 10 + k * 20), Q(x, 10 + k * 20, 9));
    for (const x of [40, 80]) d += seg(Q(x, L - 7), Q(x, L - 7, 9));
    pegs.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function move([sx, sy]) {
    const near = Math.abs(sx - 200) < 170 && sy > 30 && sy < 300;
    sp.t = near ? 0.75 + 0.25 * reach : 0.0;
    read.textContent = near ? "tip " + Math.round(20 + sp.t * 60) : "rest";
    B.wake();
  }
  sp.t = 0; sp.x = 0;
  read.textContent = "rest";
  draw(0);
  bag.add(pointer(stage, { move, leave: () => { sp.t = 0; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "warper",
  means: "A warping board with pegs down both sides: the pointer near it tips the board up on its hinge toward upright.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[224, 181], [190, 195], [255, 170], null],
  mount,
});
