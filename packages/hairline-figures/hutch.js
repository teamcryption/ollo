/**
 * Rabbit hutch: a box on four legs with a mesh door on its front. The pointer
 * over it swings the door open on its hinge; at rest it stands ajar, bright.
 * The slider is how far it swings.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, seg, spring, stepS, rad, mk, solid, put, register, pointer, disposer } = HL;
const L = 64, D = 30, Z0 = 12, Z1 = 50, DX = 8, DW = 34;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[0, 0, 0], [L, D, 0], [L, 0, Z1 + 4], [0, D, Z1 + 4], [DX, D + DW, Z0], [L, D, 0]], 200, 160);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const leg = (x, y) => { const [r, i] = rings(x, y, x + 4, y + 4, 1, 0.6); put(solid(g), prism(P, front, r, i, 0, Z0)); };
  leg(1, 1); leg(L - 5, 1); leg(1, D - 5); leg(L - 5, D - 5);
  const [br, bi] = rings(0, 0, L, D, 2, 1.2);
  put(solid(g), prism(P, front, br, bi, Z0, Z1));
  const [rr, ri] = rings(-3, -3, L + 3, D + 3, 2, 1.2);
  put(solid(g), prism(P, front, rr, ri, Z1, Z1 + 4));
  const sil = mk("path", { class: "sil" }, g), mesh = mk("path", { class: "nf" }, g);
  const REST = 14, a = spring(REST);
  function draw(deg) {
    const c = Math.cos(rad(deg)), s = Math.sin(rad(deg));
    const at = (u, z, d = 0) => P(DX + u * c - d * s, D + u * s + d * c, z);
    const pts = [];
    for (const u of [0, DW]) for (const z of [Z0 + 4, Z1 - 4]) for (const d of [0, 2]) pts.push(at(u, z, d));
    sil.setAttribute("d", poly(hull(pts)));
    let m = "";
    for (let k = 1; k < 6; k++) m += seg(at((k * DW) / 6, Z0 + 7, 2), at((k * DW) / 6, Z1 - 7, 2));
    for (let k = 1; k < 5; k++) { const z = Z0 + 4 + (k * (Z1 - Z0 - 8)) / 5; m += seg(at(3, z, 2), at(DW - 3, z, 2)); }
    mesh.setAttribute("d", m);
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(a, dt); draw(a.x); return m; });
  bag.add(B.unregister);
  const xs = [P(0, D, 0)[0], P(L, 0, 0)[0]];
  let on = null;
  function set(v) {
    if (v === on) return; on = v;
    a.t = v ? max : REST;
    sil.classList.toggle("hi", true);
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => set(x > xs[0] - 20 && x < xs[1] + 10 && y > 30 && y < 300), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (on) { a.t = v; B.wake(); } }, destroy: bag.dispose };
}
hairline({
  name: "hutch",
  means: "A rabbit hutch on four legs: the pointer swings its mesh door open on the hinge, and it rests a little ajar.",
  rules: [1, 3, 4, 5],
  range: [40, 75, 100],
  tour: [[166, 135], [200, 150], [280, 120], null],
  mount,
});
