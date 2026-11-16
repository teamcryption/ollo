/**
 * Pet scale: a low base with a wide weighing plate held above it. The pointer
 * over the plate presses it down toward the base; at rest the plate floats,
 * bright. The slider is how far it sinks.
 */
const { Cam, fit, facing, poly, prism, proj, rings, ringAt, circ, spring, stepS, mk, solid, put, register, pointer, unproj, disposer } = HL;
const L = 70, D = 50, BZ = 5, UP = 16;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let sink = value;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[0, 0, 0], [L, D, 0], [L, 0, UP + 4], [0, D, UP + 4], [0, 0, UP + 4], [L, D, 0]], 200, 160);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, L, D, 6, 1.5);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const dial = circ(5, 28).map((q) => ({ ...q, u: q.u + L - 10, v: q.v + D - 6 }));
  mk("path", { class: "nf", d: poly(ringAt(P, dial, BZ)) }, g);
  const [pr, pi] = rings(4, 4, L - 4, D - 14, 4, 1.5);
  const plate = solid(g), lines = mk("path", { class: "nf lo" }, g);
  const REST = UP, z = spring(REST);
  function draw(h) {
    put(plate, prism(P, front, pr, pi, h, h + 3));
    let d = "";
    for (let k = 1; k < 5; k++) { const y = 4 + (k * (D - 18)) / 5; d += poly([P(10, y, h + 3), P(L - 10, y, h + 3)]).replace("Z", ""); }
    lines.setAttribute("d", d);
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(z, dt); draw(z.x); return m; });
  bag.add(B.unregister);
  let on = null;
  function set(v) {
    if (v === on) return; on = v;
    z.t = v ? REST - sink : REST;
    plate.sil.classList.toggle("hi", true);
    read.textContent = v ? "4.2" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => { const [wx, wy] = unproj(C, x, y, REST); set(wx > -6 && wx < L + 6 && wy > -6 && wy < D + 6); }, leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sink = v; if (on) { z.t = REST - v; B.wake(); } }, destroy: bag.dispose };
}
hairline({
  name: "petscale",
  means: "A pet weighing scale: the pointer on its wide plate presses it down toward the base, and at rest the plate floats.",
  rules: [1, 3, 4, 5],
  range: [4, 8, 10],
  tour: [[209, 142], [190, 135], [230, 165], null],
  mount,
});
