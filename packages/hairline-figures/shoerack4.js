/**
 * Hallway bench: a long storage bench on a plinth, its padded lid hinged at
 * the back. The higher the pointer rises above the bench, the further the
 * lid swings open, on a spring, up to standing past upright. At rest the
 * lid sits just ajar, bright.
 *
 * The pattern: one value follows the pointer (spring).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, rrect, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 96, D = 36, H = 30, REST = 0.24, MAX = 1.75;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-4, -10, 0], [W + 4, D + 4, 0], [-4, -10, H + D + 8], [W + 4, D + 4, H + 4]], 200, 175);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(3, 3, W - 3, D - 3, 3, 1.5);
  put(solid(g), prism(P, front, pr, pi, 0, 5));
  const [br, bi] = rings(0, 0, W, D, 4, 3);
  put(solid(g), prism(P, front, br, bi, 5, H));
  mk("path", { d: poly(bi.map((q) => P(q.u, q.v, H))), class: "nf lo" }, g);
  mk("path", { d: open([P(W / 2, 3, H), P(W / 2, D - 3, H)]), class: "nf lo" }, g);
  const lid = mk("path", { class: "sil hi" }, g), pad = mk("path", { class: "sil" }, g), seam = mk("path", { class: "nf lo" }, g);
  const ring = rrect(-1, -1, W + 1, D + 1, 4, 4), cush = rrect(5, 4, W - 5, D - 3, 6, 4), seamR = rrect(8, 7, W - 8, D - 6, 4, 4);
  const T = (x, y, z, a) => { const dy = y + 1, dz = z - H, c = Math.cos(a), s = Math.sin(a); return P(x, -1 + dy * c - dz * s, H + dy * s + dz * c); };
  const sp = spring(REST);
  let last = NaN;
  function draw() {
    const a = sp.x;
    if (a === last) return;
    last = a;
    const l = [], p = [];
    for (const q of ring) l.push(T(q.u, q.v, H, a), T(q.u, q.v, H + 3, a));
    for (const q of cush) p.push(T(q.u, q.v, H + 3, a), T(q.u, q.v, H + 8, a));
    lid.setAttribute("d", poly(hull(l)));
    pad.setAttribute("d", poly(hull(p)));
    seam.setAttribute("d", poly(seamR.map((q) => T(q.u, q.v, H + 8, a))));
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const edge = P(W / 2, D, H);
  function aim(a) { sp.t = a; read.textContent = a === REST ? "rest" : Math.round((a * 180) / Math.PI) + "°"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, {
    move: ([, sy]) => aim(Math.max(REST + 0.01, Math.min(MAX, REST + ((edge[1] - sy) / 120) * MAX))),
    leave: () => aim(REST),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
}

hairline({
  name: "shoerack4",
  means: "A hallway storage bench with a padded lid: the higher the pointer rises above it, the further the lid swings open.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[195, 191], [239, 93], [239, 55], null],
  mount,
});
