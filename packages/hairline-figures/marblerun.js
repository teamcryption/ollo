/**
 * Marble run: two sloped chutes on a pair of posts, the upper running down
 * to the right, the lower running back down to the left under it. The
 * marble follows the pointer along the run: across the upper chute, over
 * the drop at the end, back along the lower one. At rest it waits partway
 * down the upper chute, bright. The slider is the run's tilt.
 *
 * The pattern: one value along a path (spring).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 110, W = 14, R = 7, REST = 0.22;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-14, -8, 0], [L + 14, W + 8, 0], [-14, W + 8, 0], [L + 14, -8, 0], [0, W / 2, 84], [L, W / 2, 84]], 200, 166);
  const P = proj(C), front = facing(C);
  const tilt = () => 0.6 + value / 100;
  const up = (x) => 72 - (x / L) * 16 * tilt(), lo = (x) => 22 + (x / L) * 16 * tilt();
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-14, -8, L + 14, W + 8, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  const post = (x) => { const [r, i] = rings(x - 3, W / 2 - 3, x + 3, W / 2 + 3, 2.5, 1); put(solid(g), prism(P, front, r, i, 4, 82)); };
  post(-6);
  const chute = (zf) => {
    const s = solid(g), lip = mk("path", { class: "nf lo" }, g);
    return { s, lip, draw() {
      const c = [];
      for (const x of [0, L]) for (const y of [0, W]) for (const dz of [-3, 0]) c.push(P(x, y, zf(x) + dz));
      s.sil.setAttribute("d", poly(hull(c)));
      s.cr.setAttribute("d", seg(P(1, W - 1.5, zf(1) + 1.6), P(L - 1, W - 1.5, zf(L - 1) + 1.6)));
      lip.setAttribute("d", seg(P(1, 1.5, zf(1) + 1.6), P(L - 1, 1.5, zf(L - 1) + 1.6)));
    } };
  };
  const lower = chute(lo);
  const mg = mk("g", {}, g), ball = mk("path", { class: "sil hi" }, mg), eq = mk("path", { class: "nf lo" }, mg);
  const upper = chute(up);
  post(L + 6);

  const t = spring(REST);
  let lastT = NaN, lastV = NaN, ahead = null;
  function draw() {
    if (t.x === lastT && value === lastV) return;
    if (value !== lastV) { lower.draw(); upper.draw(); }
    lastT = t.x; lastV = value;
    const u = clamp(t.x, 0, 1), top = u <= 0.5;
    const x = top ? (u / 0.5) * L : L - ((u - 0.5) / 0.5) * L;
    const zc = (top ? up(x) : lo(x)) + R;
    const pts = [];
    for (let i = -5; i <= 5; i++) { const a = (i / 5) * (Math.PI / 2); pts.push(...ringAt(P, disc(x, W / 2, R * Math.cos(a)), zc + R * Math.sin(a))); }
    ball.setAttribute("d", poly(hull(pts)));
    eq.setAttribute("d", seg(P(x - R * 0.7, W / 2 + R * 0.7, zc), P(x + R * 0.7, W / 2 + R * 0.7, zc)));
    if (ahead !== top) { ahead = top; if (top) upper.lip.after(mg); else lower.lip.after(mg); }
  }

  const B = register(stage, (dt) => { const m = stepS(t, dt); draw(); return m; });
  bag.add(B.unregister);

  const mid = P(L / 2, W / 2, 47)[1], x0 = P(0, W / 2, 0)[0], x1 = P(L, W / 2, 0)[0];
  function move([sx, sy]) {
    const x = clamp(((sx - x0) / (x1 - x0)) * L, 0, L), top = sy < mid;
    t.t = top ? (x / L) * 0.5 : 0.5 + (1 - x / L) * 0.5;
    read.textContent = (top ? "upper " : "lower ") + Math.round((x / L) * 100);
    B.wake();
  }
  function leave() { t.t = REST; read.textContent = "rest"; B.wake(); }
  draw(); read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { value = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "marblerun",
  means: "A two-chute marble run on posts: the marble follows the pointer down the upper chute, drops at the end and rolls back along the lower one.",
  rules: [1, 3, 5, 6],
  range: [0, 40, 100],
  tour: [[138, 71], [262, 157], [255, 187], null],
  mount,
});
