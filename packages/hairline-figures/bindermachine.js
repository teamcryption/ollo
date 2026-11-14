/**
 * Binding machine: a low machine with a sheaf of paper standing in its slot
 * and a lever on its near side. The pointer presses the lever: the further
 * toward the near edge it stands, the further the lever swings down, and the
 * sheaf sinks into the slot to be punched. At rest the lever stands half up,
 * bright. The slider is how far the lever can travel.
 *
 * The pattern: one part following the pointer on a spring.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, unproj, clamp, lerp, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 80, BY = 46, BZ = 18, L = 40, PX = BX + 3, PY = 26, PZ = 12, REST = 0.3;
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-2, -2, 0], [BX + 8, BY + 2, 0], [BX + 8, -2, 0], [-2, BY + 2, 0], [PX, PY, PZ + L + 6], [PX, PY + L + 6, PZ], [40, 12, BZ + 22]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, BX, BY, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  // the slot the sheaf drops into, a dim groove on the top
  const [sr] = rings(10, 10, BX - 10, 15, 2, 0.5);
  mk("path", { d: poly(ringAt(P, sr, BZ)), class: "nf lo" }, g);
  const sheaf = solid(g), [pr, pi] = rings(12, 11, BX - 12, 14, 1, 0.5);
  const pivot = solid(g), [vr, vi] = rings(PX - 3, PY - 6, PX, PY + 6, 3, 1);
  put(pivot, prism(P, front, vr, vi, PZ - 6, PZ + 6));
  const arm = mk("path", { class: "sil" }, g), knob = mk("path", { class: "sil" }, g);

  const sp = spring(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    put(sheaf, prism(P, front, pr, pi, BZ - 2, BZ + 22 - 14 * t));
    const a = rad(lerp(-15, 95, t)), ex = PX + 3, ey = PY + L * Math.sin(a), ez = PZ + L * Math.cos(a), pts = [];
    for (let i = 0; i <= 8; i++) { const f = i / 8; pts.push(...ringAt(P, disc(ex, lerp(PY, ey, f), 1.8, 10), lerp(PZ, ez, f))); }
    arm.setAttribute("d", poly(hull(pts)));
    const ball = [];
    for (const [r, dz] of [[2.5, -4], [4.5, -2], [5, 0], [4.5, 2], [2.5, 4]]) ball.push(...ringAt(P, disc(ex, ey, r), ez + dz));
    knob.setAttribute("d", poly(hull(ball)));
  }

  const B = register(stage, (dt) => {
    const moving = stepS(sp, dt);
    draw(sp.x);
    return moving;
  });
  bag.add(B.unregister);

  function aim(t) {
    sp.t = t;
    read.textContent = t === REST ? "rest" : "press " + Math.round(t * 100);
    B.wake();
  }
  aim(REST);
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -20 || x > BX + 40 || y < -30 || y > BY + 50) return aim(REST);
    aim(clamp((y + 10) / 80, 0, 1) * reach);
  }
  bag.add(pointer(stage, { move, leave: () => aim(REST) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "bindermachine",
  means: "A binding machine: the pointer presses its side lever down, and the sheaf of paper in the slot sinks in to be punched.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[239, 150], [206, 233], [165, 270], null],
  mount,
});
