/**
 * Game cartridge: a low console with a slot across its top and one cartridge
 * seated in it. The pointer is the hand: the nearer it comes, the further the
 * cartridge slides up out of the slot, on a spring. At rest it sits a little
 * proud of the slot, bright. The slider is how far it may rise.
 *
 * The pattern: a continuous lift (terrain's spring); the hit is the floor's plane.
 */
const {
  Cam, clamp, fit, facing, lerp, prism, proj, rings, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const TOP = 14, H = 30, REST = 8, MAX = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-40, -28, 0], [40, 28, 0], [40, -28, 0], [-40, 28, 0], [0, 0, TOP + H + MAX * 1.2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-40, -28, 40, 28, 9, 2);
  put(solid(g), prism(P, front, br, bi, 0, TOP));
  const [sr, si] = rings(-21, -5, 21, 5, 2, 1);
  put(solid(g), prism(P, front, sr, si, TOP - 0.01, TOP));
  for (const x of [-28, -22]) place(flatDot(g, C, 1.6, x === -28 ? "dot m" : "dot off"), P(x, 18, TOP));
  const cart = solid(g), label = mk("path", { class: "nf lo" }, g);
  cart.sil.classList.add("hi");
  const [cr, ci] = rings(-18, -3, 18, 3, 1.5, 0.8);
  const sp = spring(REST);
  let last = NaN;

  function draw() {
    const z = Math.round(sp.x * 100) / 100;
    if (z === last) return;
    last = z;
    const z1 = TOP - H + 8 + z + H;
    put(cart, prism(P, front, cr, ci, TOP, z1));
    const a = P(-12, 3, z1 - 4), b = P(12, 3, z1 - 4), c = P(12, 3, Math.max(TOP + 1, z1 - 16)), d = P(-12, 3, Math.max(TOP + 1, z1 - 16));
    label.setAttribute("d", `M${a}L${b}L${c}L${d}Z`);
  }
  const R = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(R.unregister);

  function aim(p) {
    let r = Infinity;
    if (p) { const [x, y] = unproj(C, p[0], p[1], 0); r = Math.hypot(x, y * 1.4); }
    const over = r < 110;
    sp.t = over ? lerp(REST, MAX * gain, clamp(1 - (r - 20) / 80, 0, 1)) : REST;
    read.textContent = over ? `${Math.round((sp.t / (MAX * 1.2)) * 100)}%` : "rest";
    R.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = v; }, destroy: bag.dispose };
}

hairline({
  name: "cartridge",
  means: "A console with one game cartridge in its slot: the nearer the pointer comes, the further the cartridge slides up out.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.2],
  tour: [[200, 194], [70, 216], [330, 239], null],
  mount,
});
