/**
 * Band saw: a tall cast frame with a lower and an upper wheel housing, a
 * square table between them and the blade running down through it. The
 * pointer near the saw swings the upper wheel guard open on its hinge, wider
 * the nearer it comes. At rest the guard stands ajar, bright.
 */
const {
  Cam, fit, facing, fillet, poly, prism, proj, rings, seg, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const W = 56, D = 22;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-14, -16, 0], [W + 14, D + 16, 0], [0, 0, 150], [0, D + W, 120], [W, D, 150]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 5, b = 1.4) => { const [a, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, a, i, z0, z1)); };
  box(-14, -16, W + 14, D + 16, 0, 6, 6, 2);
  box(0, 0, W, D, 6, 60, 8, 2);
  box(0, 2, 16, D - 2, 60, 92, 4, 1.4);
  box(0, 0, W, D, 92, 148, 10, 2);
  mk("path", { d: seg(P(W - 12, D / 2, 92), P(W - 12, D / 2, 62)), class: "nf" }, g);
  box(W - 15, D / 2 - 2, W - 9, D / 2 + 2, 74, 92, 1.5, 0.5);
  box(6, -12, W + 12, D + 14, 60, 64, 4, 1.6);
  mk("path", { d: seg(P(W - 12, D / 2, 64), P(W - 12, D / 2, 74)), class: "nf" }, g);
  const door = mk("path", { class: "sil hi" }, g), knob = mk("path", { class: "nf" }, g);
  const sp = spring(0.07);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = t * 1.7, Q = (u, z) => P(u * Math.cos(a), D + 1 + u * Math.sin(a), z);
    const pts = [Q(0, 94), Q(W - 2, 94), Q(W - 2, 146), Q(0, 146)];
    door.setAttribute("d", poly(fillet(pts, [3, 9, 9, 3])));
    knob.setAttribute("d", seg(Q(W - 8, 116), Q(W - 8, 124)));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0), d = Math.hypot(x - W / 2, y - D / 2);
    const near = Math.abs(sx - 200) < 140 && sy > 20 && sy < 318;
    sp.t = near ? clamp(1.3 - d / 200, 0.8, 1) * (0.75 + 0.25 * reach) : 0.07;
    read.textContent = near ? "open " + Math.round(sp.t * 86) : "rest";
    B.wake();
  }
  read.textContent = "rest";
  draw(sp.x);
  bag.add(pointer(stage, { move, leave: () => { sp.t = 0.07; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "bandsaw",
  means: "A band saw: the pointer near it swings the upper wheel guard open on its hinge, wider the nearer it comes.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[235, 95], [215, 150], [250, 120], null],
  mount,
});
