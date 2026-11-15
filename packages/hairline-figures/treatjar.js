/**
 * Treat dispenser: a round jar of treats on a base with a chute, and a long
 * press lever across its lid with a wide paddle at the end. The lever tips
 * down as the pointer nears the paddle and a treat slides out of the chute.
 * At rest the lever stands tipped up, bright. The slider is the press depth.
 *
 * The pattern: a continuous reach (a spring on one angle); the hit is on the
 * floor's plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, poly, prism, proj, rings, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const PX = -8, PZ = 52, REST = 0.1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let depth = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-20, -18, 0], [46, 18, 0], [46, -18, 0], [-20, 18, 0], [-14, 0, 64], [46, 0, 66]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-20, -18, 24, 18, 6, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, 12));
  const [cr, ci] = rings(24, -6, 32, 6, 2, 0.8);
  put(solid(g), prism(P, front, cr, ci, 0, 4));
  const treat = flatDot(g, C, 2.4, "dot off");
  put(solid(g), prism(P, front, disc(0, 0, 12, 40), disc(0, 0, 10.8, 40), 12, 44));
  for (const [x, y, z] of [[-4, 4, 18], [3, 6, 22], [5, -2, 17], [-3, -5, 26]]) place(flatDot(g, C, 1.6, "dot m"), P(x, y, z));
  put(solid(g), prism(P, front, disc(0, 0, 13, 40), disc(0, 0, 11.8, 40), 44, 48));
  put(solid(g), prism(P, front, rings(PX - 3, -3, PX + 3, 3, 1.2, 0.5)[0], null, 48, PZ));
  const bar = mk("path", { class: "sil hi" }, g), paddle = mk("path", { class: "sil hi" }, g);
  const sp = spring(REST);
  let drawn = NaN;
  const box = (x0, x1, y0, y1, z0, z1, a) => {
    const c = Math.cos(a), s = Math.sin(a), pts = [];
    for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) pts.push(P(PX + (x - PX) * c - (z - PZ) * s, y, PZ + (x - PX) * s + (z - PZ) * c));
    return poly(hull(pts));
  };
  function draw() {
    const t = sp.x;
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    const a = 0.22 - 0.55 * t * depth;
    bar.setAttribute("d", box(PX - 6, 36, -2.5, 2.5, PZ, PZ + 3, a));
    paddle.setAttribute("d", box(30, 46, -10, 10, PZ, PZ + 4, a));
    place(treat, P(28 + 14 * clamp(t * depth, 0, 1), 0, 0));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function move(p) {
    if (!p) { sp.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], PZ), r = Math.hypot(x - 38, y);
    if (r > 90) return move(null);
    sp.t = clamp(1.2 - r / 45, REST, 1);
    read.textContent = "press " + Math.round(sp.t * 100);
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => move(null) }));
  bag.add(() => svg.replaceChildren());
  move(null);
  return { set: (v) => { depth = v; drawn = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "treatjar",
  means: "A treat dispenser jar: its long lever tips down as the pointer nears the paddle, and a treat slides out of the chute.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1],
  tour: [[200, 200], [230, 150], [255, 121], null],
  mount,
});
