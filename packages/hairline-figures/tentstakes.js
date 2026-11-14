/**
 * Trail sign: a post on a stone with one pointed board. The board turns on
 * the post to point at the pointer, on a spring. At rest it points down the
 * trail, bright. The slider is how far the board can turn.
 */
const {
  Cam, fit, facing, fillet, hull, poly, prism, proj, rings, clamp, rad, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PH = 70, BZ = 50, BH = 12, BL = 34, T = 1.6, REST = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 3.2);
  fit(C, [[-12, -10, 0], [12, 10, 0], [0, 0, PH + 2], [-BL * 0.71, -BL * 0.71, BZ + BH], [BL * 0.71, BL * 0.71, BZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-12, -10, 12, 10, 8, 1.5);
  put(solid(g), prism(P, front, sr, si, 0, 6));
  const board = solid(g);
  board.sil.classList.add("hi");
  const [pr, pi] = rings(-3, -3, 3, 3, 2, 0.8);
  const post = solid(g);
  put(post, prism(P, front, pr, pi, 6, PH));
  const ang = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const at = (u, n, z) => P(u * c - n * s, u * s + n * c, z);
    const shape = (n) => [at(3, n, BZ), at(BL - 6, n, BZ), at(BL, n, BZ + BH / 2), at(BL - 6, n, BZ + BH), at(3, n, BZ + BH)];
    const vis = c - s > 0;
    const A = fillet(shape(-T), [1, 1, 1.5, 1, 1]), Bv = fillet(shape(T), [1, 1, 1.5, 1, 1]);
    board.sil.setAttribute("d", poly(hull(A.concat(Bv))));
    board.cr.setAttribute("d", poly(vis ? Bv : A));
    if (c + s > 0) post.g.after(board.g); else board.g.after(post.g);
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, BZ);
    const a = Math.atan2(wy, wx) * 180 / Math.PI;
    ang.t = Math.round(clamp(a, REST - max, REST + max));
    read.textContent = "bear " + ((ang.t + 360) % 360) + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "tentstakes",
  means: "A trail sign: a pointed board on a post turns to point at the pointer, as far as the slider lets it.",
  rules: [1, 3, 5, 6],
  range: [60, 120, 150],
  tour: [[268, 148], [132, 148], [200, 58], null],
  mount,
});
