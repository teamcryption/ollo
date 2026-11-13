/**
 * Window facade: a building's face with twelve casement windows, four across
 * and three high, each a sash hinged on its left jamb over a stone sill. The
 * pointer is a breeze across the face: the windows near it swing open on
 * their springs, falling off with distance, and the one under it opens wide
 * and is bright. At rest a few stand ajar, one half open and bright. The
 * slider is the breeze's reach.
 *
 * The pattern: a field on a face (depositboxes); springs per sash; the hit
 * is read on the facade's plane, which never moves.
 */
const {
  Cam, clamp, facing, fillet, fit, poly, prism, proj, rad, rings, rrect, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NC = 4, NR = 3, CW = 24, CH = 22, M = 8, BASE = 8, D = 10, WW = 14, WH = 15, MAXA = 80;
const W = 2 * M + NC * CW, H = BASE + NR * CH + 4, FAV = [1, 2];
const REST = [[6, 22, 3], [3, 4, 74], [28, 3, 9], [3, 14, 4]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D + WW, BASE], [0, 0, H], [W, 0, H], [0, D + WW, H - 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(0, 0, W, D, 3, 1.4);
  put(solid(g), prism(P, front, wr, wi, 0, H));
  mk("path", { d: seg(P(1.5, D, BASE - 3), P(W - 1.5, D, BASE - 3)) + seg(P(1.5, D, H - 3), P(W - 1.5, D, H - 3)), class: "nf lo" }, g);

  const wins = [];
  for (let c = 0; c < NC; c++) for (let r = 0; r < NR; r++) {
    const x0 = M + c * CW + (CW - WW) / 2, z0 = BASE + r * CH + 4;
    // the opening in the face, painted before any sash swings out over it
    mk("path", { d: poly(rrect(x0 - 0.6, z0, x0 + WW + 0.6, z0 + WH + 0.6, 0.8, 2).map((q) => P(q.u, D, q.v))), class: "nf lo" }, g);
    wins.push({ c, r, x0, z0, rest: rad(REST[c][r]) });
  }
  // left to right, bottom to top: a sash only ever swings out over a window to its left or below it
  for (const w of wins) {
    const [sr, si] = rings(w.x0 - 2, D - 1, w.x0 + WW + 2, D + 3, 0.8, 0.5);
    put(solid(g), prism(P, front, sr, si, w.z0 - 1.8, w.z0));
    w.sash = mk("path", { class: "sil" }, g);
    w.bars = mk("path", { class: "nf lo" }, g);
    w.sp = spring(w.rest);
    w.drawn = NaN;
  }

  function draw(w) {
    const a = w.sp.x;
    if (Math.abs(a - w.drawn) < 1e-4) return;
    w.drawn = a;
    const at = (s, z) => P(w.x0 + s * Math.cos(a), D + s * Math.sin(a), z), z1 = w.z0 + WH;
    w.sash.setAttribute("d", poly(fillet([at(0, w.z0), at(WW, w.z0), at(WW, z1), at(0, z1)], [1.2, 1.2, 1.2, 1.2])));
    const zm = w.z0 + WH / 2;
    w.bars.setAttribute("d", poly([at(1.8, w.z0 + 1.8), at(WW - 1.8, w.z0 + 1.8), at(WW - 1.8, z1 - 1.8), at(1.8, z1 - 1.8)]) + seg(at(1.8, zm), at(WW - 1.8, zm)));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const w of wins) { if (stepS(w.sp, dt)) m = true; draw(w); }
    return m;
  });
  bag.add(B.unregister);

  /** The window under the point, read on the facade's plane (y = D), which never moves. */
  function hit([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + D * s) / c, Y = x * s + D * c, z = (Y * C.k - (sy - C.oy) / C.S) / zf;
    if (x < M || x > W - M || z < BASE || z > BASE + NR * CH + 2) return -1;
    return clamp(Math.floor((x - M) / CW), 0, NC - 1) * NR + clamp(Math.floor((z - BASE) / CH), 0, NR - 1);
  }

  let act = -2;
  const favI = FAV[0] * NR + FAV[1];
  function setActive(a) {
    if (a === act) return;
    act = a;
    const ac = a >= 0 ? wins[a] : null;
    wins.forEach((w, i) => {
      const d = ac ? Math.hypot(w.c - ac.c, w.r - ac.r) : 0;
      w.sp.t = ac ? clamp(rad(MAXA) * Math.exp(-(d * d) / (2 * reach * reach)), rad(3), rad(MAXA)) : w.rest;
      w.sash.classList.toggle("hi", i === (a < 0 ? favI : a));
    });
    read.textContent = a < 0 ? "rest" : `window ${ac.c + 1}·${NR - ac.r}`;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; const a = act; act = -2; setActive(a); }, destroy: bag.dispose };
}

hairline({
  name: "windowfacade",
  means: "A facade of twelve casement windows: the windows near the pointer swing open, and the one under it opens wide and bright.",
  rules: [1, 3, 5, 8],
  range: [0.6, 1, 1.6],
  tour: [[193, 163], [128, 186], [281, 143], null],
  mount,
});
