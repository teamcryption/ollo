/**
 * Desk riser: a sit-stand riser, a low base and a broad work top joined by
 * two scissor frames, with a release paddle on the top's front edge. The
 * pointer's height over the riser sets how far the top rises; the scissors
 * open under it. At rest the top sits low and the paddle is bright.
 *
 * The pattern: one part following the pointer on a spring (aim).
 */
const {
  Cam, clamp, fit, facing, lerp, open, prism, proj, rings, spring, stepS, seg,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 112, D = 72, BZ = 4, TT = 5, REST = 16, X0 = 18, X1 = W - 18;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxH = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, 72 + TT], [W, 0, 72 + TT], [0, D, 72 + TT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(6, 6, W - 6, D - 6, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const scis = [12, D - 12].map((y) => ({ y, el: mk("path", { class: "nf" }, g), pin: mk("path", { class: "nf lo" }, g) }));
  const top = solid(g);
  const paddle = solid(g);
  const [tr, ti] = rings(0, 0, W, D, 7, 2);
  const h = spring(REST);
  let last = NaN;
  function draw() {
    const z = h.x;
    if (z === last) return;
    last = z;
    for (const s of scis) {
      const a = P(X0, s.y, BZ), b = P(X1, s.y, z), c = P(X0, s.y, z), d = P(X1, s.y, BZ);
      s.el.setAttribute("d", seg(a, b) + seg(c, d) + seg(P(X0 - 4, s.y, BZ), P(X1 + 4, s.y, BZ)) + seg(P(X0 - 4, s.y, z), P(X1 + 4, s.y, z)));
      const m = P((X0 + X1) / 2, s.y, (BZ + z) / 2);
      s.pin.setAttribute("d", open([[m[0] - 2, m[1]], [m[0] + 2, m[1]]]));
    }
    put(top, prism(P, front, tr, ti, z, z + TT));
    const [pr, pi] = rings(W / 2 - 14, D, W / 2 + 14, D + 4, 1.5, 0.8);
    put(paddle, prism(P, front, pr, pi, z + 0.5, z + 3));
  }
  const B = register(stage, (dt) => { const m = stepS(h, dt); draw(); return m; });
  bag.add(B.unregister);

  const L = P(0, D, 0)[0] - 10, R = P(W, 0, 0)[0] + 10, Y0 = P(0, 0, 72)[1], Y1 = P(W, D, 0)[1];
  let on = null;
  function aim(p) {
    const hit = p && p[0] > L && p[0] < R && p[1] > Y0 - 10 && p[1] < Y1 + 10;
    if (hit) {
      const t = clamp((Y1 - p[1]) / (Y1 - Y0), 0, 1);
      h.t = lerp(REST, maxH, t);
      read.textContent = "h " + Math.round(h.t);
    } else {
      h.t = REST;
      read.textContent = "rest";
    }
    if (on !== !!hit) {
      on = !!hit;
      paddle.sil.classList.toggle("hi", !on);
      top.sil.classList.toggle("hi", on);
    }
    B.wake();
  }
  aim(null);
  draw();
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxH = v; }, destroy: bag.dispose };
}

hairline({
  name: "monitorarm2",
  means: "A sit-stand desk riser: the higher the pointer over it, the higher the work top rises on its scissor frames.",
  rules: [1, 3, 5, 8],
  range: [36, 56, 72],
  tour: [[173, 152], [200, 135], [213, 253], null],
  mount,
});
