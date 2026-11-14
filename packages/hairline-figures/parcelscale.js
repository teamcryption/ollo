/**
 * Parcel scale: a low platform scale with a box on its platter and a round
 * dial on a post behind it. The pointer presses on the parcel: the closer
 * to its middle, the deeper the platter sinks into the base and the further
 * the dial's needle swings. At rest the parcel sits a touch proud and the
 * dial is the bright mark; a press hands the bright to the parcel. The
 * slider is how soft the platter is.
 *
 * Hit read on the parcel's rest top (z = TOP), which never moves; one spring.
 */
const {
  Cam, circ, clamp, facing, fit, lerp, poly, prism, proj, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX0 = -4, BX1 = 64, BY0 = -14, BY1 = 46, BZ = 6, PZ = 3;
const PX0 = 14, PX1 = 44, PY0 = 8, PY1 = 34, PH = 20, TOP = BZ + PZ + PH;
const POST = [27, -11, 33, -7], DR = 10, DZ = 46;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let soft = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[BX0, BY0, 0], [BX1, BY1, 0], [BX1, BY0, 0], [BX0, BY1, 0], [30, -9, DZ + DR], [PX0, PY0, TOP]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [br, bi] = rings(BX0, BY0, BX1, BY1, 6, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  // the post and the dial, behind the platter
  const [pr, pi] = rings(...POST, 2, 0.6);
  put(solid(g), prism(P, front, pr, pi, BZ, DZ - DR + 1));
  const ring = circ(DR, 28), face = circ(DR - 1.6, 28);
  const dial = mk("path", { d: poly(ring.map((q) => P(30 + q.u, -7, DZ + q.v))), class: "sil" }, g);
  mk("path", { d: poly(face.map((q) => P(30 + q.u, -6.6, DZ + q.v))), class: "nf lo" }, g);
  let ticks = "";
  for (let i = 0; i <= 8; i++) {
    const a = Math.PI * (1.15 - i * 0.1625), c = Math.cos(a), s = Math.sin(a);
    ticks += seg(P(30 + c * (DR - 2.4), -6.6, DZ + s * (DR - 2.4)), P(30 + c * (DR - 3.8), -6.6, DZ + s * (DR - 3.8)));
  }
  mk("path", { d: ticks, class: "nf lo" }, g);
  const needle = mk("path", { class: "nf" }, g);
  const hub = mk("circle", { r: 1.3, class: "dot" }, g);
  const hp = P(30, -6.6, DZ);
  hub.setAttribute("cx", hp[0]); hub.setAttribute("cy", hp[1]);

  // the platter and the parcel ride together
  const [lr, li] = rings(0, 0, 60, 42, 4, 1.2);
  const plat = solid(g);
  const [cr, ci] = rings(PX0, PY0, PX1, PY1, 1.6, 1.4);
  const box = solid(g);
  const tape = mk("path", { class: "nf lo" }, g);

  const sp = spring(0.3);
  let last = NaN;
  function draw(s) {
    const z0 = BZ - s;
    put(plat, prism(P, front, lr, li, z0, z0 + PZ));
    put(box, prism(P, front, cr, ci, z0 + PZ, z0 + PZ + PH));
    const t = z0 + PZ + PH, xm = (PX0 + PX1) / 2;
    tape.setAttribute("d", seg(P(xm, PY0 + 1.4, t), P(xm, PY1, t)) + seg(P(xm, PY1, t), P(xm, PY1, t - 6)));
    const a = Math.PI * (1.0 - s * 0.16), c = Math.cos(a), si = Math.sin(a);
    needle.setAttribute("d", seg(P(30, -6.4, DZ), P(30 + c * (DR - 2.6), -6.4, DZ + si * (DR - 2.6))));
    read.textContent = s < 0.32 ? "rest" : `${(1.2 + s * 0.9).toFixed(1)}kg`;
  }

  const B = register(stage, (dt) => {
    const moving = stepS(sp, dt);
    if (sp.x !== last) { draw(sp.x); last = sp.x; }
    return moving;
  });
  bag.add(B.unregister);

  function press(on) {
    dial.classList.toggle("hi", !on);
    box.sil.classList.toggle("hi", on);
  }
  /** The press, read on the parcel's rest top, which never moves. */
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TOP);
    const d = Math.hypot((x - 29) / 15, (y - 21) / 13) / 1.42;
    const on = x > PX0 && x < PX1 && y > PY0 && y < PY1;
    const deep = lerp(2, 5, soft / 100);
    sp.t = on ? 0.3 + deep * clamp(1.1 - d, 0.3, 1) : 0.3;
    press(on);
    B.wake();
  }
  function leave() { sp.t = 0.3; press(false); B.wake(); }
  press(false);
  draw(sp.x); last = sp.x;
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { soft = v; }, destroy: bag.dispose };
}

hairline({
  name: "parcelscale",
  means: "A platform scale weighing a parcel: press on the box and the platter sinks while the dial's needle swings round.",
  rules: [1, 3, 4, 8],
  range: [0, 50, 100],
  tour: [[185, 127], [189, 150], [193, 172], null],
  mount,
});
