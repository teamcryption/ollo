/**
 * Bathroom scale: a square base with a thick glass platform floating over it,
 * two foot pads and a round dial on the platform. The pointer steps on the
 * platform: it sinks onto the base and the dial's needle swings round. At
 * rest the platform floats high, bright. The slider is how far it sinks.
 *
 * The pattern: a continuous press on a spring; the hit is on the platform's
 * rest plane, which never moves.
 */
const { Cam, fit, facing, poly, prism, proj, rings, ringAt, circ, rrect, seg, spring, stepS, mk, solid, put, register, pointer, unproj, disposer } = HL;
const L = 64, BZ = 5, UP = 17;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const pad = (x0, y0, x1, y1) => rrect(x0, y0, x1, y1, 5, 4);
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let sink = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[0, 0, 0], [L, L, 0], [L, 0, UP + 4], [0, L, UP + 4], [0, 0, UP + 4], [L, L, 0]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, L, L, 9, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const [pr, pi] = rings(2, 2, L - 2, L - 2, 8, 1.6);
  const plate = solid(g), pads = mk("path", { class: "nf lo" }, g);
  const dial = mk("path", { class: "nf" }, g), needle = mk("path", { class: "nf" }, g);
  const REST = UP, z = spring(REST);
  let last = NaN;
  function draw(h) {
    if (h === last) return; last = h;
    const t = h + 3.5;
    put(plate, prism(P, front, pr, pi, h, t));
    pads.setAttribute("d", poly(ringAt(P, pad(8, 10, 28, 46), t)) + poly(ringAt(P, pad(36, 10, 56, 46), t)));
    dial.setAttribute("d", poly(ringAt(P, disc(L - 12, L / 2, 6.5), t)));
    const a = -2.4 + 4.2 * (REST - h) / 12, cx = L - 12, cy = L / 2;
    needle.setAttribute("d", seg(P(cx, cy, t), P(cx + 5.5 * Math.cos(a), cy + 5.5 * Math.sin(a), t)));
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(z, dt); draw(z.x); return m; });
  bag.add(B.unregister);
  let on = null;
  function set(v) {
    if (v === on) return; on = v;
    z.t = v ? REST - sink : REST;
    plate.sil.classList.toggle("hi", true);
    read.textContent = v ? (60 + sink * 1.5).toFixed(1) + "kg" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => { const [wx, wy] = unproj(C, x, y, REST + 3.5); set(wx > -4 && wx < L + 4 && wy > -4 && wy < L + 4); }, leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sink = v; if (on) { z.t = REST - v; B.wake(); } }, destroy: bag.dispose };
}
hairline({
  name: "bathscale",
  means: "A bathroom scale: the pointer steps on the glass platform, it sinks onto the base and the dial's needle swings round.",
  rules: [1, 3, 4, 5],
  range: [6, 9, 12],
  tour: [[200, 140], [172, 132], [226, 152], null],
  mount,
});
