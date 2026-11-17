/**
 * Chess box: a folding wooden chess box, two hinged halves whose insides make
 * the board. At rest the near half stands up on its hinge, half open, and the
 * far half lies flat, bright. The pointer over the box swings the near half
 * down flat to lay out the full board; leaving folds it back up. The slider
 * is where the half rests.
 *
 * The pattern: one part swinging on a hinge (cloches, one item).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween, unproj, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 36, L = 72, T = 6, SQ = W / 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restA = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[0, 0, 0], [2 * W, 0, 0], [0, L, 0], [2 * W, L, 0], [W, 0, T + W], [W, L, T + W]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the far half, lying flat, with its squares
  const fixed = solid(g);
  const [fr, fi] = rings(0, 0, W, L, 3, 1.4);
  put(fixed, prism(P, front, fr, fi, 0, T));
  fixed.sil.classList.add("sil");
  let d = "";
  for (let i = 1; i < 4; i++) d += seg(P(i * SQ, 2, T), P(i * SQ, L - 2, T));
  for (let j = 1; j < 8; j++) d += seg(P(2, j * SQ + 0, T), P(W - 2, j * SQ, T));
  mk("path", { d, class: "nf lo" }, g);

  // the near half, hinged along x = W at the board's height
  const mg = mk("g", {}, g), msil = mk("path", { class: "sil" }, mg), mface = mk("path", { class: "nf lo" }, mg), mgrid = mk("path", { class: "nf lo" }, mg);
  const outer = rrect(0, 0, W, L, 3, 4), face = rrect(1.4, 1.4, W - 1.4, L - 1.4, 1.8, 4);
  const at = (a, u, v, w) => P(W + u * Math.cos(a) + w * Math.sin(a), v, T + u * Math.sin(a) - w * Math.cos(a));
  const ang = tween(restA);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg);
    const top = outer.map((q) => at(a, q.u, q.v, 0)), bot = outer.map((q) => at(a, q.u, q.v, T));
    msil.setAttribute("d", poly(hull(top.concat(bot))));
    const up = deg < 55;
    mface.setAttribute("d", up ? poly(face.map((q) => at(a, q.u, q.v, 0))) : "");
    let gd = "";
    if (up) {
      for (let i = 1; i < 4; i++) gd += seg(at(a, i * SQ, 2, 0), at(a, i * SQ, L - 2, 0));
      for (let j = 1; j < 8; j++) gd += seg(at(a, 2, j * SQ, 0), at(a, W - 2, j * SQ, 0));
    }
    mgrid.setAttribute("d", gd);
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, T);
    return x > -8 && x < 2 * W + 8 && y > -8 && y < L + 8 ? 1 : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a > 0 ? 0 : restA, performance.now(), 0);
    fixed.sil.classList.toggle("hi", a < 0);
    msil.classList.toggle("hi", a > 0);
    read.textContent = a < 0 ? "rest" : "open";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restA = v; if (act < 0) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "chessbox",
  means: "A folding chess box: the pointer swings the standing half down flat to lay out the board, and it folds back up after.",
  rules: [1, 3, 5, 6],
  range: [70, 105, 140],
  tour: [[190, 137], [124, 194], [200, 125], null],
  mount,
});
