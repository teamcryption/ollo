/**
 * Multitool: an oscillating multi-tool, a long motor body with a narrow head
 * and a wide plunge blade clamped flat under it. The blade swings round the
 * spindle to point at the pointer, as its oscillation sweeps side to side.
 * At rest it points a little to the near side, bright.
 * The slider is how far the blade can swing.
 *
 * The pattern: a continuous aim (a spring on an angle); the hit is on the
 * blade's plane, which never moves.
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CX = 14, ZB = 18, L0 = 5, L1 = 58, REST = 25;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-84, -12, 50], [-84, 12, 28], [CX + L1, 0, ZB], [CX + 40, 40, ZB], [CX + 40, -40, ZB]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const blade = solid(g);
  blade.sil.classList.add("hi");
  put(solid(g), prism(P, front, circ(8, 24), circ(6.5, 24), ZB + 2, 28));
  let [r, i] = rings(-84, -11, 4, 11, 10, 1.6);
  put(solid(g), prism(P, front, r, i, 28, 48));
  [r, i] = rings(-84, -4, -78, 4, 2, 0.8);
  put(solid(g), prism(P, front, r, i, 34, 42));
  [r, i] = rings(0, -10, 24, 10, 8, 1.4);
  put(solid(g), prism(P, front, r, i, 27, 46));

  const A = spring(REST);
  let reach = 70 * value, over = null, last = NaN;
  // the blade's outline, in its own frame: u along the blade, v across
  const shape = [[L0, -7], [L1 - 10, -12], [L1, -12], [L1, 12], [L1 - 10, 12], [L0, 7]];

  function draw() {
    if (Math.abs(A.x - last) < 0.01) return;
    last = A.x;
    const a = (A.x * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    const at = (pts, z) => pts.map(([u, v]) => P(CX + u * c - v * s, u * s + v * c, z));
    const top = at(shape, ZB + 2), bot = at(shape, ZB);
    const teeth = at(Array.from({ length: 13 }, (_, k) => [L1 + (k % 2 ? 0 : -2.2), -12 + 2 * k]), ZB + 2);
    blade.sil.setAttribute("d", poly(hull(top.concat(bot))));
    blade.cr.setAttribute("d", open(at([[L1 - 4, -11], [L1 - 4, 11]], ZB + 2)) + open(teeth));
  }

  const B = register(stage, (dt) => { const m = stepS(A, dt); draw(); return m; });
  bag.add(B.unregister);

  function retarget() {
    const t = over === null ? REST : clamp(over, -reach, reach);
    A.t = t;
    read.textContent = over === null ? "rest" : `${Math.round(t)}°`;
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], ZB), dx = x - CX, rr = Math.hypot(dx, y);
      over = rr > L1 + 40 || rr < 4 || dx < -10 ? null : (Math.atan2(y, dx) * 180) / Math.PI;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  retarget();
  return {
    set: (v) => { reach = 70 * v; retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "multitool",
  means: "An oscillating multi-tool: the wide plunge blade under its head swings round the spindle to point at the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1.2],
  tour: [[328, 203], [194, 259], [290, 240], null],
  mount,
});
