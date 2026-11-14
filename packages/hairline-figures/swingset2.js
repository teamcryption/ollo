/**
 * Rope swing: a tree with one long branch over a grass plate, a plank seat
 * hung from it on two ropes. The pointer pushes the seat away from its side,
 * on a spring, out to a clamped arc. At rest the seat hangs a little
 * forward of plumb, bright. The slider is the reach of the swing.
 *
 * The pattern: one part answering the pointer's position (aim).
 */
const {
  Cam, circ, clamp, fit, facing, prism, proj, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = 62, PZ = 104, L = 78, REST = 0.3;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.6);
  const ext = [];
  for (const s of [-1, 1]) ext.push([PX + s * L * Math.sin(0.9) + s * 12, 0, PZ - L * Math.cos(0.9)]);
  fit(C, [[-34, -34, 0], [118, 34, 0], [118, -34, 0], [-34, 34, 0], [0, 0, 120], ...ext], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [gr, gi] = rings(-34, -34, 118, 34, 14, 2);
  put(solid(g), prism(P, front, gr, gi, 0, 3));
  put(solid(g), prism(P, front, disc(0, 0, 10), disc(0, 0, 8.5), 3, 118));
  const [br, bi] = rings(-6, -5, 92, 5, 4, 1.4);
  put(solid(g), prism(P, front, br, bi, PZ, PZ + 8));
  const ropeB = mk("path", { class: "nf" }, g);
  const seat = solid(g);
  seat.sil.classList.add("hi");
  const ropeF = mk("path", { class: "nf" }, g);

  const th = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const sx = PX + L * Math.sin(a), sz = PZ - L * Math.cos(a);
    const [sr, si] = rings(sx - 9, -15, sx + 9, 15, 3, 1.4);
    put(seat, prism(P, front, sr, si, sz, sz + 3));
    ropeB.setAttribute("d", seg(P(PX, -5, PZ), P(sx, -13, sz + 3)));
    ropeF.setAttribute("d", seg(P(PX, 5, PZ), P(sx, 13, sz + 3)));
  }
  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(th.x); return m; });
  bag.add(B.unregister);
  draw(REST);

  function aim(p) {
    const t = p ? -clamp((p[0] - 200) / 90, -1, 1) * reach : REST;
    th.t = t;
    read.textContent = p ? Math.round((t * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "swingset2",
  means: "A plank seat on two ropes under a tree branch: the pointer pushes the seat away from its side, on a spring.",
  rules: [3, 5, 8],
  range: [0.3, 0.6, 0.9],
  tour: [[249, 209], [322, 236], [110, 200], null],
  mount,
});
