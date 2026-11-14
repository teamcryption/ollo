/**
 * Slide: a playground slide on a low pad, a ladder up the back to a small
 * platform and a curved chute running down to the ground. A ball rides the
 * chute: the pointer runs along the chute and the ball follows it there, on
 * a spring. At rest the ball waits near the top, bright. The slider moves
 * where it waits.
 *
 * The pattern: one value along a path (where).
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rings, seg, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = 20, LEN = 84, TOP = 50, LOW = 5, W0 = 2, W1 = 22, WALL = 5, R = 7.5, PZ = 46;
const zAt = (s) => LOW + (TOP - LOW) * (Math.cos(Math.PI * s) + 1) / 2;
const xAt = (s) => X0 + LEN * s;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restS = clamp(value / 100, 0, 0.3);
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-16, -8, 0], [112, 32, 0], [112, -8, 0], [-16, 32, 0], [0, 0, TOP + 4], [20, 24, TOP + 4]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-16, -8, 112, 32, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, 2));

  // ladder up the back
  let lad = "";
  for (const y of [W0, W1]) lad += seg(P(-12, y, 2), P(0, y, PZ));
  mk("path", { d: lad, class: "nf" }, g);
  let rungs = "";
  for (let i = 1; i <= 5; i++) { const t = i / 6; rungs += seg(P(-12 + 12 * t, W0, 2 + (PZ - 2) * t), P(-12 + 12 * t, W1, 2 + (PZ - 2) * t)); }
  mk("path", { d: rungs, class: "nf lo" }, g);
  // posts under the platform and the chute's foot
  let posts = "";
  for (const y of [W0, W1]) { posts += seg(P(X0, y, 2), P(X0, y, PZ)) + seg(P(0, y, 2), P(0, y, PZ)) + seg(P(X0 + LEN - 6, y, 2), P(X0 + LEN - 6, y, zAt(0.93))); }
  mk("path", { d: posts, class: "nf lo" }, g);
  const [pr, pi] = rings(0, 0, X0, 24, 2, 1.2);
  put(solid(g), prism(P, front, pr, pi, PZ, PZ + 4));

  // chute: far wall, bed, ball, near wall
  const N = 40, ss = [...Array(N + 1)].map((_, i) => i / N);
  const edge = (y, dz) => ss.map((s) => P(xAt(s), y, zAt(s) + dz));
  const wall = (y) => poly(edge(y, 0).concat(edge(y, WALL).reverse()));
  mk("path", { d: wall(W0), class: "sil" }, g);
  mk("path", { d: poly(edge(W0, 0).concat(edge(W1, 0).reverse())) }, g);
  mk("path", { d: open(edge((W0 + W1) / 2, 0)), class: "nf lo" }, g);
  const ball = mk("path", { class: "sil hi" }, g);
  mk("path", { d: wall(W1), class: "sil" }, g);
  mk("path", { d: open(edge(W1, WALL - 1.2)), class: "nf lo" }, g);

  const sp = spring(restS);
  let last = NaN;
  function draw(s) {
    if (s === last) return;
    last = s;
    const c = P(xAt(s), (W0 + W1) / 2, zAt(s) + R), e = P(xAt(s), (W0 + W1) / 2, zAt(s) + 2 * R);
    const rr = Math.hypot(e[0] - c[0], e[1] - c[1]) / 0.866, pts = [];
    for (let a = 0; a < 32; a++) { const t = (a / 32) * Math.PI * 2; pts.push([c[0] + rr * Math.cos(t), c[1] + rr * Math.sin(t)]); }
    ball.setAttribute("d", poly(pts));
  }
  draw(restS);

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  const track = ss.map((s) => [s, P(xAt(s), (W0 + W1) / 2, zAt(s))]);
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    for (const [s, q] of track) { const d = Math.hypot(q[0] - sx, q[1] - sy); if (d < bd) { bd = d; best = s; } }
    return bd < 34 ? best : -1;
  }
  function setS(s) {
    sp.t = s < 0 ? restS : s;
    read.textContent = s < 0 ? "rest" : "drop " + Math.round(s * 100);
    B.wake();
  }
  setS(-1);
  bag.add(pointer(stage, { move: (p) => setS(hit(p)), leave: () => setS(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restS = clamp(v / 100, 0, 0.3); if (read.textContent === "rest") setS(-1); }, destroy: bag.dispose };
}

hairline({
  name: "slide",
  means: "A playground slide with a ladder and a curved chute: the ball rides the chute to where the pointer runs along it.",
  rules: [1, 3, 5, 6],
  range: [0, 10, 30],
  tour: [[178, 113], [220, 166], [262, 228], null],
  mount,
});
