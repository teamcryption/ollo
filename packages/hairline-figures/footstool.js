/**
 * Footstool: a padded cushion on a low wooden frame with four stubby legs
 * and a tufted button in the middle. The pointer over the top presses the
 * cushion down, harder towards its centre, on a spring. At rest the cushion
 * is plump and its edge bright. The slider is how soft the padding is.
 *
 * The pattern: one continuous value read from the pointer (press).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, unproj, clamp, lerp, spring, stepS,
  disposer, mk, pointer, put, register, solid, place,
} = HL;

const S = 70, LEG = 12, FR = 8, CU = 22;
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let soft = value / 100;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [S, S, 0], [S, 0, 0], [0, S, 0], [0, 0, LEG + FR + CU], [S, S, LEG + FR + CU]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const [x, y] of [[8, 8], [S - 8, 8], [8, S - 8], [S - 8, S - 8]]) {
    put(solid(g), prism(P, front, disc(x, y, 3.5), disc(x, y, 2.2), 0, LEG + 1));
  }
  const [fr, fi] = rings(2, 2, S - 2, S - 2, 4, 1.4);
  put(solid(g), prism(P, front, fr, fi, LEG, LEG + FR));
  const cush = solid(g);
  cush.sil.classList.add("hi");
  const btn = mk("ellipse", { class: "dot m", rx: 2.6, ry: 1.5 }, g);
  const s = spring(0);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const top = LEG + FR + CU - d * CU * lerp(0.25, 0.55, soft), inset = d * 3;
    const [cr, ci] = rings(0, 0, S, S, 12 - d * 4, 4 + inset);
    put(cush, prism(P, front, cr, ci, LEG + FR, top));
    place(btn, P(S / 2, S / 2, top - 1 - d * 2));
  }
  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(s.x); return m; });
  bag.add(B.unregister);

  // hit on the cushion's rest top plane, which never moves
  const ZT = LEG + FR + CU;
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, ZT);
    if (x < -6 || y < -6 || x > S + 6 || y > S + 6) return leave();
    const r = Math.hypot(x - S / 2, y - S / 2) / (S / 2);
    s.t = clamp(1 - r * 0.7, 0.2, 1);
    read.textContent = "−" + Math.round(s.t * CU * lerp(0.25, 0.55, soft));
    B.wake();
  }
  function leave() { s.t = 0; read.textContent = "rest"; B.wake(); }
  leave();
  draw(0);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { soft = v / 100; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "footstool",
  means: "A padded footstool: the pointer over the top presses the cushion down, deepest at its tufted centre.",
  rules: [1, 3, 5, 8],
  range: [0, 60, 100],
  tour: [[152, 103], [200, 129], [152, 153], null],
  mount,
});
