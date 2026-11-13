/**
 * Pendulums: a frame with eight pendulums of increasing length, each a ball
 * on a string from the top bar. The pointer is a field along the row: the
 * pendulums near it swing out toward the reader, each on its own spring, the
 * one under it furthest and bright. At rest a few hang swung out in a wave,
 * one lit. The slider is the reach, in pendulums.
 *
 * The pattern: a continuous field (terrain) along one row; the hit is each
 * bob's resting screen x, which never moves.
 */
const { Cam, circ, clamp, facing, fit, prism, proj, rad, rings, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const N = 8, STEP = 14, HB = 96, BR = 4.6, MAXA = 42, FAV = 3;
const LEN = Array.from({ length: N }, (_, k) => 34 + k * 7.5);
const RESTA = [6, 12, 20, 26, 18, 9, 4, 0];
const X1 = (N + 1) * STEP;
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.62 : u <= 1 ? 0.38 - ((u - 0.45) / 0.55) * 0.38 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value;
  const C = Cam(45, 0.5, 1.75);
  const swung = LEN.map((L, k) => [(k + 1) * STEP, L * Math.sin(rad(MAXA)) + BR, HB - L * Math.cos(rad(MAXA)) - BR]);
  fit(C, [[-6, -10, -4], [X1 + 6, 22, -4], [X1 + 6, -10, -4], [-6, 22, -4], [-4, 0, HB + 3], [X1 + 4, 0, HB + 3], ...swung], 200, 166);
  const P = proj(C), front = facing(C);
  const sc = Math.hypot(...[0, 1].map((i) => P(BR / Math.SQRT2, -BR / Math.SQRT2, 0)[i] - P(0, 0, 0)[i]));
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1, el = solid(g)) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(el, prism(P, front, o, i, z0, z1)); return el; };
  block(-6, -10, X1 + 6, 22, 3, 1.2, -4, 0);
  block(-3, -2, 1, 2, 1.2, 0.5, 0, HB + 3);
  block(-3, -1.6, X1 + 3, 1.6, 1.2, 0.5, HB, HB + 3);
  const right = { key: X1 + 1, g: mk("g", {}, g) };
  block(X1 - 1, -2, X1 + 3, 2, 1.2, 0.5, 0, HB + 3, solid(right.g));

  const bobs = LEN.map((L, k) => {
    const grp = mk("g", {}, g);
    return { k, L, x: (k + 1) * STEP, g: grp, str: mk("path", { class: "nf" }, grp), ball: mk("ellipse", { class: "sil", rx: sc, ry: sc }, grp), sp: spring(RESTA[k], { eps: 0.02 }), drawn: NaN, key: 0 };
  });
  function draw(b) {
    const a = clamp(b.sp.x, 0, MAXA);
    b.key = b.x + b.L * Math.sin(rad(a));
    if (a === b.drawn) return false;
    b.drawn = a;
    const c = P(b.x, (b.L + BR) * Math.sin(rad(a)), HB - (b.L + BR) * Math.cos(rad(a)));
    b.str.setAttribute("d", seg(P(b.x, 0, HB), P(b.x, b.L * Math.sin(rad(a)), HB - b.L * Math.cos(rad(a)))));
    b.ball.setAttribute("cx", c[0].toFixed(2)); b.ball.setAttribute("cy", c[1].toFixed(2));
    return true;
  }
  let painted = "";
  const B = register(stage, (dt) => {
    let m = false;
    for (const b of bobs) { if (stepS(b.sp, dt)) m = true; draw(b); }
    const order = [...bobs, right].sort((a, c) => a.key - c.key), key = order.map((o) => o.k ?? "r").join();
    if (key !== painted) { painted = key; for (const o of order) g.appendChild(o.g); }
    return m;
  });
  bag.add(B.unregister);

  const mids = bobs.map((b) => P(b.x, 0, HB - b.L - BR)), span = mids[1][0] - mids[0][0];
  let over = null;
  function retarget() {
    let hit = -1, bd = Infinity;
    if (over) mids.forEach((m, k) => { const d = Math.abs(m[0] - over[0]); if (d < bd) { bd = d; hit = k; } });
    if (over && (bd > span * 0.7 || over[1] < P(bobs[hit].x, 0, HB)[1] - 4 || over[1] > mids[hit][1] + 26)) hit = -1;
    for (const b of bobs) {
      b.sp.t = hit < 0 ? RESTA[b.k] : b.k === hit ? MAXA : MAXA * 0.8 * falloff(Math.abs(mids[b.k][0] - over[0]) / (RAD * span));
      b.ball.classList.toggle("hi", b.k === (hit < 0 ? FAV : hit));
    }
    read.textContent = hit < 0 ? "rest" : "bob " + (hit + 1);
    B.wake();
  }
  bag.add(pointer(stage, { move: (p) => { over = p; retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "pendulums",
  means: "A frame of eight pendulums of rising length: those near the pointer swing out, the one under it furthest.",
  rules: [1, 3, 5, 8],
  range: [1, 2.5, 4],
  tour: [[160, 140], [199, 181], [250, 230], null],
  mount,
});
