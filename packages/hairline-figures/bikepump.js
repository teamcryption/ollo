/**
 * Bike pump: a floor pump, its foot on the ground, a tall barrel, a shaft
 * and a T-handle across the top, the hose looping off the base. The pointer's
 * height presses the handle down on a spring; the read-out gives the pressure
 * that stroke reaches. At rest the handle is drawn up, bright. The slider is
 * the stroke's depth.
 *
 * The pattern: one part pressed along its axis (press).
 */
const {
  Cam, circ, clamp, fit, facing, open, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BH = 64, TOP = 34, HW = 26;
const disc = (r, n = 32, x = 0, y = 0) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  let depth = value;
  const bag = disposer();
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-22, -16, 0], [22, 16, 0], [0, -HW, BH + TOP + 6], [0, HW, BH + TOP + 6], [30, 30, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the hose, behind: from the barrel's foot out and round on the ground
  const hose = [];
  for (let i = 0; i <= 16; i++) { const t = i / 16; hose.push(P(-6 - 18 * Math.sin(t * Math.PI), -8 - 24 * t, 6 - 5 * t)); }
  mk("path", { d: open(hose), class: "nf lo" }, g);
  // the foot: two pads either side of the barrel
  for (const s of [-1, 1]) { const [r, i] = rings(-7, s > 0 ? 4 : -22, 7, s > 0 ? 22 : -4, 3, 1.2); put(solid(g), prism(P, front, r, i, 0, 3)); }
  put(solid(g), prism(P, front, disc(10), disc(8.6), 0, 6));
  put(solid(g), prism(P, front, disc(7), disc(5.8), 6, BH));
  put(solid(g), prism(P, front, disc(8.5), disc(7), BH - 2, BH + 2));
  // the gauge: a short drum on the barrel's front
  put(solid(g), prism(P, front, disc(5, 24, 8, 8), disc(3.8, 24, 8, 8), 12, 16));

  const shaft = solid(mk("g", {}, g)), handle = solid(mk("g", {}, g));
  const z = spring(TOP);
  let last = NaN;
  function draw(h) {
    if (h === last) return;
    last = h;
    put(shaft, prism(P, front, disc(1.8, 16), disc(1.2, 16), BH + 2, BH + h));
    const [r, i] = rings(-3.5, -HW, 3.5, HW, 3.5, 1.2);
    put(handle, prism(P, front, r, i, BH + h, BH + h + 6));
  }
  const B = register(stage, (dt) => { const m = stepS(z, dt); draw(z.x); return m; });
  bag.add(B.unregister);
  handle.sil.classList.add("hi");

  const y0 = P(0, 0, BH + TOP)[1], y1 = P(0, 0, BH)[1] + 40;
  let p = -1;
  function press(t) {
    p = t;
    z.t = t < 0 ? TOP : TOP - (TOP - 6) * t * depth;
    read.textContent = t < 0 ? "rest" : "psi " + Math.round(20 + 90 * t * depth);
    B.wake();
  }
  press(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const c = P(0, 0, 0)[0]; if (Math.abs(sx - c) > 70) press(-1); else press(clamp((sy - y0) / (y1 - y0), 0, 1)); },
    leave: () => press(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { depth = v; press(p); }, destroy: bag.dispose };
}

hairline({
  name: "bikepump",
  means: "A floor pump: the pointer's height presses the T-handle down the barrel, and the read-out gives the pressure the stroke reaches.",
  rules: [1, 3, 5, 8],
  range: [0.5, 0.8, 1],
  tour: [[200, 105], [200, 210], [200, 150], null],
  mount,
});
