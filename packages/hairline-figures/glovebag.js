/**
 * Sample cooler: an insulated box with a thick hinged lid, side handles and a
 * rack of sample vials inside. The pointer over the box swings the lid up and
 * back to show the vials; leaving lets it settle back, just cracked. At rest
 * the lid is bright. The slider is how far the lid opens.
 *
 * The pattern: one part on a hinge (lid).
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid, unproj } = HL;

const W = 72, D = 48, H = 40, T = 10, REST = 10;
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = 70 + value * 0.4;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, D, 0], [W, D, 0], [0, -24, H + D + 6], [W, -24, H + D + 6], [0, 0, H + 8], [W, 0, H + 8]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 4, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const sq = (x0, y0, x1, y1, z) => [P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)];
  // side handles
  for (const x of [W]) mk("path", { d: poly(hull(sq(x, 16, x + 4, 32, H - 12).concat(sq(x, 16, x + 4, 32, H - 8)))), class: "nf" }, g);
  // rack of vials in the well
  mk("path", { d: poly(sq(8, 8, W - 8, D - 8, H)), class: "nf lo" }, g);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) {
    const x = 14 + i * 13, y = 14 + j * 14, v = [];
    for (const z of [H, H + 12]) v.push(...sq(x, y, x + 7, y + 7, z));
    mk("path", { d: poly(hull(v)), class: "nf" }, g);
    mk("path", { d: poly(sq(x, y, x + 7, y + 7, H + 12)), class: "nf lo" }, g);
  }
  const lg = mk("g", {}, g);
  const lid = mk("path", { class: "sil" }, lg), top = mk("path", { class: "nf" }, lg), grip = mk("path", { class: "nf" }, lg);
  const ang = tween(REST);
  let last = NaN;
  const L = (x, u, t, a) => P(x, u * Math.cos(a) - t * Math.sin(a), H + u * Math.sin(a) + t * Math.cos(a));
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), pts = [];
    for (const x of [0, W]) for (const u of [0, D]) for (const t of [0, T]) pts.push(L(x, u, t, a));
    lid.setAttribute("d", poly(hull(pts)));
    top.setAttribute("d", poly([L(0, 0, T, a), L(W, 0, T, a), L(W, D, T, a), L(0, D, T, a)]));
    grip.setAttribute("d", poly([L(24, 14, T, a), L(48, 14, T, a), L(48, 34, T, a), L(24, 34, T, a)]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(ang, o ? max : REST, performance.now(), 0);
    lid.classList.add("hi");
    read.textContent = o ? Math.round(max) + "°" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, H); set(x > -8 && x < W + 8 && y > -8 && y < D + 30); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = 70 + v * 0.4; if (on) { on = null; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "glovebag",
  means: "An insulated sample cooler: the pointer swings its thick hinged lid up to show the rack of vials inside.",
  rules: [1, 3, 4, 5, 6],
  range: [0, 50, 100],
  tour: [[181, 191], [200, 225], [163, 156], null],
  mount,
});
