/**
 * Ring board: a square hoopla board with nine pegs, rings dropped over
 * three of them, on a low stand. The board turns about its centre to
 * follow the pointer across the frame; the ring on the middle peg is bright
 * at rest. The slider is how far it turns.
 *
 * The pattern: one part turning to follow the pointer (spotlights).
 */
const { Cam, circ, fit, facing, prism, proj, rings, rrect, clamp, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const W = 96, M = W / 2, T = 6, PH = 20, REST = 0.28;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const PEGS = [];
for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) PEGS.push([18 + i * 30, 18 + j * 30, i * 3 + j]);
const RINGED = new Set([4, 0, 7]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-20, -20, 0], [W + 20, W + 20, 0], [W + 20, -20, 0], [-20, W + 20, 0], [M, M, T + 4 + PH]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(M - 30, M - 30, M + 30, M + 30, 8, 1.5);
  put(solid(g), prism(P, front, sr, si, 0, 4));
  const rot = (a) => (u, v) => [M + (u - M) * Math.cos(a) - (v - M) * Math.sin(a), M + (u - M) * Math.sin(a) + (v - M) * Math.cos(a)];
  const turn = (ring, a) => ring.map((q) => { const [u, v] = rot(a)(q.u, q.v); return { u, v, nu: q.nu * Math.cos(a) - q.nv * Math.sin(a), nv: q.nu * Math.sin(a) + q.nv * Math.cos(a) }; });
  const board = solid(g), b0 = rrect(0, 0, W, W, 6, 4), b1 = rrect(1.6, 1.6, W - 1.6, W - 1.6, 5, 4);
  const pg = mk("g", {}, g);
  const parts = PEGS.map(([x, y, k]) => {
    const grp = mk("g", {}, pg);
    const ring = RINGED.has(k) ? solid(grp) : null, peg = solid(grp);
    if (k === 4) ring.sil.classList.add("hi");
    return { x, y, k, grp, ring, peg };
  });
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    put(board, prism(P, front, turn(b0, a), turn(b1, a), 4, 4 + T));
    const R = rot(a);
    for (const p of parts) {
      const [u, v] = R(p.x, p.y);
      p.d = u + v;
      if (p.ring) put(p.ring, prism(P, front, disc(u, v, 10, 32), disc(u, v, 4.5, 32), 4 + T, 4 + T + 2.6));
      put(p.peg, prism(P, front, disc(u, v, 2.6), disc(u, v, 1.6), 4 + T, 4 + T + PH));
    }
    parts.slice().sort((A, Bb) => A.d - Bb.d).forEach((p) => pg.appendChild(p.grp));
  }
  const sp = spring(REST, { k: 90, c: 16 });
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function aim(t, r) { sp.t = t; read.textContent = r ? "rest" : Math.round((t * 180) / Math.PI) + "°"; B.wake(); }
  aim(REST, 1);
  bag.add(pointer(stage, { move: ([sx]) => aim(clamp((sx - 200) / 130, -1, 1) * 0.75 * gain), leave: () => aim(REST, 1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = v; }, destroy: bag.dispose };
}

hairline({
  name: "dartsboard2",
  means: "A hoopla ring board with nine pegs on a stand: the board turns about its centre to follow the pointer, rings riding on it.",
  rules: [3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[100, 150], [310, 170], [230, 120], null],
  mount,
});
