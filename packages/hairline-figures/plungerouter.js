/**
 * Plunge router: a round base, two posts standing on it, the motor riding
 * them on a collar with a knob at each end, its bit pointing down. The
 * pointer over the base plunges the motor down the posts and the bit through
 * the base, the nearer the front the deeper, on a spring. At rest it is
 * raised, the motor bright. The slider is how deep it plunges.
 */
const { Cam, circ, rings, clamp, facing, fit, prism, proj, seg, unproj, spring, stepS, mk, pointer, put, register, solid, disposer } = HL;

const BR = 34, PY = 24, PR = 2.6, TOP = 74, REST = 36, DEEP = 30, MR = 15, MH = 34;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.65);
  fit(C, [[-BR, -BR, 0], [BR, BR, 0], [BR, -BR, 0], [-BR, BR, 0], [0, 0, REST + MH + 10], [0, -PY, TOP], [0, PY, TOP]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, BR, 64), disc(0, 0, BR - 2, 64), 0, 4));
  const farLow = solid(g), farHigh = solid(g), farKnob = solid(g);
  const nearLow = solid(g), bit = mk("path", { class: "nf sil" }, g), collar = solid(g);
  const motor = solid(g), cap = solid(g), nearKnob = solid(g), nearHigh = solid(g);
  motor.sil.classList.add("hi");
  const t = spring(REST);
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    const post = (s, y, z0, z1) => put(s, prism(P, front, disc(0, y, PR, 16), null, z0, z1));
    post(farLow, -PY, 4, z); post(farHigh, -PY, z + 5, TOP); post(nearLow, PY, 4, z); post(nearHigh, PY, z + 5, TOP);
    put(collar, prism(P, front, ...rings(-5.5, -PY - 9, 5.5, PY + 9, 5.5, 1.2), z, z + 5));
    put(farKnob, prism(P, front, disc(0, -PY - 9, 5, 20), disc(0, -PY - 9, 3.6, 20), z + 5, z + 14));
    put(nearKnob, prism(P, front, disc(0, PY + 9, 5, 20), disc(0, PY + 9, 3.6, 20), z + 5, z + 14));
    put(motor, prism(P, front, disc(0, 0, MR, 40), disc(0, 0, MR - 2, 40), z + 5, z + 5 + MH));
    put(cap, prism(P, front, disc(0, 0, 9, 28), disc(0, 0, 7.6, 28), z + 5 + MH, z + 10 + MH));
    bit.setAttribute("d", seg(P(0, 0, z), P(0, 0, Math.max(4.4, z - 16))));
  }
  const B = register(stage, (dt) => { const m = stepS(t, dt); draw(t.x); return m; });
  bag.add(B.unregister);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 4);
    if (Math.hypot(x, y) > BR + 6) return -1;
    return clamp(0.35 + (x + y + BR) / (2 * BR) * 0.65, 0.35, 1);
  }
  let cur = -1;
  function set(v) {
    cur = v;
    t.t = v < 0 ? REST : REST - v * reach * DEEP;
    read.textContent = v < 0 ? "rest" : "depth " + Math.round(REST - t.t);
    B.wake();
  }
  set(-1);
  bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (cur >= 0) set(cur); }, destroy: bag.dispose };
}

hairline({
  name: "plungerouter",
  means: "A plunge router: the pointer over the base plunges the motor down its two posts and drives the bit through the base.",
  rules: [1, 3, 5, 6],
  range: [0.3, 1, 1],
  tour: [[178, 232], [222, 236], [200, 259], null],
  mount,
});
