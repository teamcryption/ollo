/**
 * Guardbooth: a guard booth with a window and a flat roof, and a barrier
 * arm on a post beside it. The pointer's height over the figure lifts the
 * arm on its pivot. At rest the arm is tipped up a little, bright. The
 * slider is how high the arm may lift.
 *
 * The pattern: one part following the pointer (spring).
 */
const {
  Cam, clamp, fit, facing, open, poly, prism, proj, rad, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = 44, PY = 34, PZ = 24, L = 84, REST = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[0, 0, 0], [PX + L, PY + 4, 0], [0, 0, 58], [PX, PY, PZ + L], [36, 36, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, 32, 32, 3, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, 48));
  const [rr, ri] = rings(-3, -3, 35, 35, 3, 1.4);
  put(solid(g), prism(P, front, rr, ri, 48, 53));
  mk("path", { d: poly([P(32, 6, 24), P(32, 26, 24), P(32, 26, 40), P(32, 6, 40)]), class: "nf lo" }, g);
  mk("path", { d: poly([P(8, 32, 0), P(20, 32, 0), P(20, 32, 36), P(8, 32, 36)]), class: "nf lo" }, g);
  const [pr, pi] = rings(PX - 3, PY - 3, PX + 3, PY + 3, 2, 0.8);
  put(solid(g), prism(P, front, pr, pi, 0, PZ + 4));

  const arm = mk("path", { class: "sil" }, g), stripes = mk("path", { class: "nf lo" }, g);
  const a = spring(REST);
  let last = NaN;
  function ap(th, u, dz) { return P(PX + u * Math.cos(th), PY + 4, PZ + u * Math.sin(th) + dz); }
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const th = rad(deg);
    arm.setAttribute("d", poly([ap(th, -6, -2), ap(th, L, -2), ap(th, L, 2), ap(th, -6, 2)]));
    let d = "";
    for (let i = 1; i < 6; i++) d += open([ap(th, i * 14, -2), ap(th, i * 14 + 5, 2)]);
    stripes.setAttribute("d", d);
  }
  const B = register(stage, (dt) => {
    const m = stepS(a, dt);
    draw(Math.round(a.x * 10) / 10);
    return m;
  });
  bag.add(B.unregister);

  const y0 = P(PX, PY, PZ)[1], y1 = P(PX, PY, PZ + L)[1];
  function setLift(t) {
    const want = t < 0 ? REST : t * maxA;
    a.t = want;
    arm.classList.add("hi");
    read.textContent = t < 0 ? "rest" : Math.round(want) + "°";
    B.wake();
  }
  setLift(-1);
  bag.add(pointer(stage, { move: ([, sy]) => setLift(clamp((y0 - sy) / (y0 - y1), 0, 1)), leave: () => setLift(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "guardbooth",
  means: "A guard booth and its barrier: the pointer's height over the figure lifts the striped arm on its post.",
  rules: [1, 3, 5, 8],
  range: [45, 80, 88],
  tour: [[150, 205], [150, 140], [150, 70], null],
  mount,
});
