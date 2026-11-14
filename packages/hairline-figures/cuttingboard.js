/**
 * Cutting board: a thick board with a carrot lying along it, cut into
 * rounds, and a chef's knife held over it. The pointer stands on the board:
 * the knife slides along the carrot to it, on a spring, and drops onto the
 * carrot when the pointer is over it. At rest the knife hangs at the cut,
 * bright. The slider is how far the knife lifts.
 *
 * The pattern: a part following the pointer (spring).
 */
const {
  Cam, clamp, fit, facing, poly, prism, proj, rings, rrect, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BT = 5, CT = BT + 7, REST_X = 52;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let hover = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, -14, 0], [80, 44, 0], [80, -14, 0], [0, 44, 0], [40, -14, CT + 30], [40, 20, CT + 30]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [o, i] = rings(0, 0, 80, 44, 6, 2);
  put(solid(g), prism(P, front, o, i, 0, BT));
  mk("path", { d: poly(rrect(70, 18, 75, 26, 2.5, 3).map((q) => P(q.u, q.v, BT))), class: "nf lo" }, g); // hang hole
  // the carrot: rounds on the left, the uncut length on the right
  for (let k = 0; k < 4; k++) {
    const x = 10 + k * 8, [a, b] = rings(x, 16, x + 6, 28, 3, 1);
    put(solid(g), prism(P, front, a, b, BT, CT - k * 0.4));
  }
  const [co, ci] = rings(44, 16, 72, 28, 6, 1.2);
  put(solid(g), prism(P, front, co, ci, BT, CT));

  const handle = solid(g), knife = solid(g);
  knife.sil.classList.add("hi");
  const sx = spring(REST_X), sz = spring(CT + hover);
  let lx = NaN, lz = NaN;
  function draw(x, z) {
    if (x === lx && z === lz) return;
    lx = x; lz = z;
    const [ko, ki] = rings(x - 0.8, 4, x + 0.8, 38, 0.6, 0.3);
    const blade = prism(P, front, ko, ki, z, z + 12);
    put(knife, blade);
    const [ho, hi] = rings(x - 1.6, -14, x + 1.6, 4, 1.4, 0.6);
    put(handle, prism(P, front, ho, hi, z + 7, z + 12));
  }

  const B = register(stage, (dt) => { const m = stepS(sx, dt) | stepS(sz, dt); draw(sx.x, sz.x); return !!m; });
  bag.add(B.unregister);

  function aim(p) {
    const [u, v] = unproj(C, p[0], p[1], 0);
    if (u < -6 || u > 86 || v < -16 || v > 50) return leave();
    sx.t = clamp(u, 8, 74);
    const over = v > 10 && v < 34;
    sz.t = CT + (over ? 0.5 : hover);
    read.textContent = (over ? "cut " : "x ") + Math.round(sx.t);
    B.wake();
  }
  function leave() { sx.t = REST_X; sz.t = CT + hover; read.textContent = "rest"; B.wake(); }
  draw(REST_X, CT + hover);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { hover = v; if (sz.t > CT + 1) sz.t = CT + v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "cuttingboard",
  means: "A cutting board with a carrot: the knife slides along to the pointer and drops onto the carrot to cut.",
  rules: [1, 3, 5, 8],
  range: [4, 9, 16],
  tour: [[132, 178], [169, 196], [242, 233], null],
  mount,
});
