/**
 * Peg board: a toy board with a five-by-five grid of holes and chunky pegs
 * standing in some of them, of different heights. The pegs lean away from
 * the pointer like grass under a hand, most near it, little beyond; the
 * peg nearest it goes bright. At rest they stand with a slight, uneven lean.
 *
 * The pattern: a field answering a continuous input (terrain); the hit is
 * the board's top plane, one spring per peg.
 */
const { Cam, circ, clamp, fit, hull, open, poly, prism, proj, rings, ringAt, unproj, spring, stepS, facing, disposer, mk, pointer, put, register, solid } = HL;

const G = 5, SP = 13, T = 5, PR = 3.4, MAXL = 9;
const PEGS = [[0, 1, 16], [1, 3, 22], [1, 0, 12], [2, 2, 26], [3, 1, 18], [3, 4, 14], [4, 2, 20], [2, 4, 10], [0, 3, 13], [4, 0, 9]];
const FAV = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.8);
  const E = (G - 1) * SP;
  fit(C, [[-9, -9, 0], [E + 9, E + 9, 0], [E + 9, -9, 0], [-9, E + 9, 0], [2 * SP, 2 * SP, T + 26], [-4, -4, T + 22]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [br, bi] = rings(-9, -9, E + 9, E + 9, 5, 1.6);
  const board = solid(g);
  put(board, prism(P, front, br, bi, 0, T));
  let holes = "";
  for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) holes += poly(ringAt(P, circ(PR * 0.7, 12).map((s) => ({ ...s, u: s.u + i * SP, v: s.v + j * SP })), T));
  mk("path", { class: "nf lo", d: holes }, board.g);

  const ring = circ(PR, 16);
  const pegs = PEGS.map(([i, j, h], k) => ({ k, x: i * SP, y: j * SP, h, s: solid(g), lx: spring(((k * 7) % 5 - 2) * 0.7), ly: spring(((k * 3) % 5 - 2) * 0.6), last: "" }))
    .sort((a, b) => a.x + a.y - (b.x + b.y));
  pegs.forEach((p) => g.appendChild(p.s.g));
  const at = (r, x, y) => r.map((s) => ({ ...s, u: s.u + x, v: s.v + y }));
  function draw(p) {
    const key = p.lx.x.toFixed(2) + p.ly.x.toFixed(2);
    if (key === p.last) return;
    p.last = key;
    const base = ringAt(P, at(ring, p.x, p.y), T), top = ringAt(P, at(ring, p.x + p.lx.x, p.y + p.ly.x), T + p.h);
    p.s.sil.setAttribute("d", poly(hull(base.concat(top))));
    p.s.cr.setAttribute("d", poly(ringAt(P, at(circ(PR - 1, 16), p.x + p.lx.x, p.y + p.ly.x), T + p.h)));
  }
  pegs.forEach((p) => p.s.cr.setAttribute("class", "nf lo"));

  const B = register(stage, (dt) => {
    let m = false;
    pegs.forEach((p) => { if (stepS(p.lx, dt)) m = true; if (stepS(p.ly, dt)) m = true; draw(p); });
    return m;
  });
  bag.add(B.unregister);

  let lastNear = -2;
  function setPoint(pt) {
    let near = -1;
    if (pt) {
      const R = 14 + reach * 0.3;
      let best = 1e9;
      pegs.forEach((p) => {
        const dx = p.x - pt[0], dy = p.y - pt[1], d = Math.hypot(dx, dy) || 1e-3;
        const f = d < R ? 1 - 0.69 * (d / R) : 0.31 * Math.exp(-(d - R) / 8);
        const lean = clamp(MAXL * f, 0, MAXL);
        p.lx.t = (dx / d) * lean; p.ly.t = (dy / d) * lean;
        if (d < best) { best = d; near = p.k; }
      });
    } else pegs.forEach((p) => { p.lx.t = ((p.k * 7) % 5 - 2) * 0.7; p.ly.t = ((p.k * 3) % 5 - 2) * 0.6; });
    if (near !== lastNear) {
      lastNear = near;
      pegs.forEach((p) => p.s.sil.classList.toggle("hi", p.k === (near < 0 ? FAV : near)));
      const q = PEGS[near];
      read.textContent = near < 0 ? "rest" : "peg " + (q[0] + 1) + "·" + (q[1] + 1);
    }
    B.wake();
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, T);
    if (x < -14 || x > E + 14 || y < -14 || y > E + 14) return setPoint(null);
    setPoint([x, y]);
  }
  setPoint(null);
  bag.add(pointer(stage, { move, leave: () => setPoint(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "pegboardkids",
  means: "A toy peg board: the pegs lean away from the pointer, most near it and little beyond, and the nearest one lights.",
  rules: [1, 3, 5, 8],
  range: [0, 45, 90],
  tour: [[174, 145], [200, 184], [251, 209], null],
  mount,
});
