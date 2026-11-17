/**
 * Drawknife: a two-handled drawknife lying across a long plank, its blade
 * across the grain and a handle rising at each end. The pointer along the
 * plank draws the knife to it, on a spring, as a shaving stroke. At rest it
 * sits partway along, its blade bright. The slider is how quickly it follows.
 *
 * The pattern: a continuous slide (a spring on a position); the hit is the
 * pointer on the ground plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L0 = -46, L1 = 46, W = 9, TH = 8, REST = 18, BL = 17;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.45);
  fit(C, [[L0, -W, 0], [L1, W, 0], [L1, -W, 0], [L0, W, 0], [L0, 0, TH + 14], [L1, 0, TH + 14], [0, -32, TH + 14], [0, 32, TH + 14]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const plank = solid(g);
  const [r, i] = rings(L0, -W, L1, W, 2, 1);
  put(plank, prism(P, front, r, i, 0, TH));
  // a shaving curl lifted from the plank's top, where the knife has been
  mk("path", { class: "nf lo", d: poly([P(L1 - 6, -4, TH), P(L1 - 30, -4, TH), P(L1 - 30, 4, TH), P(L1 - 6, 4, TH)]) }, plank.g);

  const hA = solid(g), blade = solid(g), hB = solid(g);
  blade.sil.classList.add("hi");
  const bx = (pts) => poly(hull(pts.map((p) => P(...p))));
  function boxPts(x0, x1, y0, y1, z0, z1) {
    const o = [];
    for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push([x, y, z]);
    return o;
  }
  // a handle: a slim bar from the blade's end, up and out
  function handle(x, sgn) {
    const o = [];
    for (const [y, z] of [[sgn * BL, TH + 1], [sgn * 30, TH + 13]]) for (const dx of [-2.2, 2.2]) for (const dz of [-2, 2]) o.push([x + dx, y, z + dz]);
    return o;
  }
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = NaN;
  function draw() {
    const x = sp.x;
    if (x === last) return;
    last = x;
    hA.sil.setAttribute("d", bx(handle(x, -1)));
    blade.sil.setAttribute("d", bx(boxPts(x - 3.5, x + 3.5, -BL - 1, BL + 1, TH, TH + 1.6)));
    hB.sil.setAttribute("d", bx(handle(x, 1)));
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(p) {
    let t = REST, on = false;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x > L0 - 15 && x < L1 + 15 && Math.abs(y) < 45) { on = true; t = clamp(x, L0 + 5, L1 - 5); }
    }
    sp.t = t;
    read.textContent = on ? Math.round(t - L0) + "" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sp.k = 100 * clamp(v, 0.3, 3); sp.c = 18 * Math.sqrt(clamp(v, 0.3, 3)); }, destroy: bag.dispose };
}

hairline({
  name: "drawknife",
  means: "A drawknife across a plank: the two-handled blade slides along the grain to the pointer, as one shaving stroke.",
  rules: [1, 3, 5, 6],
  range: [0.5, 1, 1.6],
  tour: [[107, 141], [102, 139], [298, 236], null],
  mount,
});
