/**
 * Siphon coffee: a vacuum coffee maker on its stand, a burner under a round
 * lower globe, and a tall upper globe seated in its neck with a long tube
 * down into the lower one. The pointer over the brewer lifts the upper globe
 * out of the neck and tips it aside, its tube sliding out. At rest the upper
 * globe sits a touch askew in the neck, bright. The slider is how far it lifts.
 *
 * The pattern: one part answering the pointer, lifted and tipped on a pivot.
 */
const { Cam, fit, facing, prism, proj, rings, hull, poly, rad, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const GZ = 34, GR = 18, NZ = 56;
const ring = (x, y, z, r, n = 28) => Array.from({ length: n }, (_, i) => [x + r * Math.cos((i / n) * 2 * Math.PI), y + r * Math.sin((i / n) * 2 * Math.PI), z]);
const disc = (r, n = 28) => ring(0, 0, 0, r, n).map(([u, v]) => ({ u, v }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-36, -24, 0], [24, 24, 0], [-36, 24, 0], [24, -24, 0], [0, 0, 150], [0, 30, 140], [0, -18, 104], [0, 24, 60]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the stand: a base plate, a post at the back, an arm to the neck
  const [br, bi] = rings(-36, -22, 24, 22, 10, 3);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  const [pr, pi] = rings(-32, -3, -26, 3, 2.5, 1);
  put(solid(g), prism(P, front, pr, pi, 4, 64));
  const [ar, ai] = rings(-30, -2.5, -4, 2.5, 2, 0.8);
  put(solid(g), prism(P, front, ar, ai, 56, 60));
  // the burner under the lower globe
  put(solid(g), prism(P, front, disc(8), disc(5), 4, 13));
  mk("path", { class: "nf", d: poly(hull(ring(0, 0, 14, 3, 10).concat([[0, 0, 19]]).map((q) => P(...q)))) }, g);
  // the upper globe and its tube: drawn as hulls of world points, tipped about the neck
  const tube = mk("path", { class: "sil" }, g);
  // the lower globe: a sphere with its neck, opaque, so the seated tube hides inside it
  const sph = [];
  for (let k = 0; k <= 8; k++) { const a = rad(-90 + k * 22.5); sph.push(...ring(0, 0, GZ + GR * Math.sin(a), GR * Math.cos(a) + 0.01)); }
  mk("path", { class: "sil", d: poly(hull(sph.map((q) => P(...q)))) }, g);
  const neck = solid(g);
  put(neck, prism(P, front, disc(5), null, GZ + GR - 3, NZ));
  const globe = mk("path", { class: "sil hi" }, g), rim = mk("path", { class: "nf" }, g);
  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const lift = 2 + 26 * amp * t, tip = rad(5 + 30 * amp * t);
    const ct = Math.cos(tip), st = Math.sin(tip);
    // tip about the x axis through the neck, then lift
    const W = ([x, y, z]) => { const dz = z - NZ; return P(x, y * ct - dz * st, NZ + lift + y * st + dz * ct); };
    tube.setAttribute("d", poly(hull(ring(0, 0, NZ - 34, 2).concat(ring(0, 0, NZ + 2, 2.6)).map(W))));
    const pts = [];
    for (const [z, r] of [[NZ, 5], [NZ + 4, 9], [NZ + 10, 14], [NZ + 18, 16], [NZ + 34, 16], [NZ + 42, 14.5], [NZ + 46, 14.5]]) pts.push(...ring(0, 0, z, r));
    globe.setAttribute("d", poly(hull(pts.map(W))));
    rim.setAttribute("d", poly(ring(0, 0, NZ + 46, 14.5).map(W)) + poly(ring(0, 0, NZ + 42, 14.5).map(W)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const mid = P(0, 0, 60);
  let on = null;
  function set(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? "lift" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(Math.abs(sx - mid[0]) < 100 && Math.abs(sy - mid[1]) < 140), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "siphoncoffee",
  means: "A siphon coffee maker: the pointer lifts the upper globe out of the lower globe's neck and tips it aside on its tube.",
  rules: [1, 3, 5, 6],
  range: [0.3, 1, 1],
  tour: [[209, 132], [209, 281], [209, 91], null],
  mount,
});
