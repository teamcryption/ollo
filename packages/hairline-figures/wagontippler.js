/**
 * Wagon tippler: a rotary dumper, two big rings on rollers on a pit slab,
 * clamping an open hopper wagon on its rails between them. The pointer,
 * across the pit, is the side to dump on: the rings roll over on a spring
 * and the wagon turns with them. At rest the cradle leans a little and the
 * wagon is bright. The slider is how far the cradle may roll over.
 *
 * The pattern: a continuous aim (spotlights), on the ground plane.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rings, seg, unproj, spring, stepS, rad, fillet,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 96, R = 42, ZC = R + 9, TH = 5, REST = rad(-12), N = 48;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = rad(value);
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-10, -R - 8, 0], [W + 10, R + 8, 0], [W + 10, -R - 8, 0], [-10, R + 8, 0], [0, 0, ZC + R], [W, 0, ZC + R]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-10, -R - 8, W + 10, R + 8, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, 6));
  for (const x of [0, W]) for (const y of [-20, 20]) {
    const [rr, ri] = rings(x - 4, y - 6, x + TH + 4, y + 6, 2.5, 1);
    put(solid(g), prism(P, front, rr, ri, 6, 13));
  }
  const ann = (x, a) => {
    const o = [], i = [];
    for (let k = 0; k < N; k++) { const t = (k / N) * Math.PI * 2; o.push(P(x, R * Math.cos(t), ZC + R * Math.sin(t))); }
    for (let k = N - 1; k >= 0; k--) { const t = (k / N) * Math.PI * 2; i.push(P(x, (R - 7) * Math.cos(t), ZC + (R - 7) * Math.sin(t))); }
    return poly(o) + " " + poly(i);
  };
  // far ring, then the cradle (rails and wagon), then the near ring
  mk("path", { d: ann(0) }, g);
  mk("path", { d: ann(TH), class: "sil" }, g);
  const rails = mk("path", { class: "nf lo" }, g), clamps = mk("path", { class: "nf" }, g);
  const wagon = mk("path", { class: "sil hi" }, g), rim = mk("path", { class: "nf lo" }, g);
  mk("path", { d: ann(W) }, g);
  mk("path", { d: ann(W + TH), class: "sil" }, g);
  const phi = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a);
    const Q = (x, y, z) => P(x, y * c - z * s, ZC + y * s + z * c);
    const sec = fillet([[-17, -22], [17, -22], [19, 14], [-19, 14]], [3, 3, 3, 3], 3);
    const pts = [];
    for (const x of [TH + 6, W - 6]) for (const [y, z] of sec) pts.push(Q(x, y, z));
    wagon.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly(fillet([Q(TH + 7, -18, 13), Q(W - 7, -18, 13), Q(W - 7, 18, 13), Q(TH + 7, 18, 13)], [2, 2, 2, 2], 3)));
    rails.setAttribute("d", seg(Q(TH, -11, -27), Q(W, -11, -27)) + seg(Q(TH, 11, -27), Q(W, 11, -27)));
    clamps.setAttribute("d", seg(Q(TH + 2, -22, 18), Q(TH + 2, 22, 18)) + seg(Q(W - 2, -22, 18), Q(W - 2, 22, 18)));
  }

  const B = register(stage, (dt) => { const m = stepS(phi, dt); draw(phi.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    let t = REST, on = false;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      if (wx > -40 && wx < W + 40 && Math.abs(wy) < R * 2.2) { on = true; t = clamp(wy / (R * 0.9), -1, 1) * reach; }
    }
    phi.t = t;
    read.textContent = on ? "roll " + Math.round(Math.abs((t * 180) / Math.PI)) + "°" : "rest";
    B.wake();
  }
  draw(REST);
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = rad(v); }, destroy: bag.dispose };
}

hairline({
  name: "wagontippler",
  means: "A rotary wagon tippler: the two big rings roll over toward the pointer's side, turning the clamped wagon upside down.",
  rules: [1, 3, 6, 8],
  range: [60, 130, 170],
  tour: [[200, 113], [113, 270], [287, 183], null],
  mount,
});
