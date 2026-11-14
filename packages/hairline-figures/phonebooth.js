/**
 * Phone booth: a quiet office pod on a low plinth, a glass door on its front
 * face. The pointer draws the door open: the closer it comes to the pod, the
 * wider the door swings on its hinge, on a spring. At rest the door stands
 * ajar, bright. The slider is how far the door can open.
 *
 * The pattern: one part answering where the pointer is (spring).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, unproj, clamp, rad, spring, stepS, open,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 46, D = 40, H = 72, PZ = 3, DW = 28, HX = 6, REST = 18;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-4, -4, 0], [W + 4, -4, 0], [-4, D + 4 + DW, 0], [W + 4, D + DW, 0], [0, 0, H + 4], [W, D, H + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, W + 4, D + 4, 5, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, PZ));
  const [pr, pi] = rings(0, 0, W, D, 8, 2);
  put(solid(g), prism(P, front, pr, pi, PZ, H - 4));
  const [rr, ri] = rings(-2, -2, W + 2, D + 2, 9, 1.6);
  put(solid(g), prism(P, front, rr, ri, H - 4, H));
  // the doorway, a dim frame on the front face, and a vent strip on the side
  const fz0 = PZ + 3, fz1 = H - 10;
  mk("path", { d: poly([P(HX, D, fz0), P(HX + DW, D, fz0), P(HX + DW, D, fz1), P(HX, D, fz1)]), class: "nf lo" }, g);
  mk("path", { d: open([P(W, 10, H - 14), P(W, D - 10, H - 14)]), class: "nf lo" }, g);
  const door = mk("path", { class: "sil" }, g), pane = mk("path", { class: "nf lo" }, g), grip = mk("path", { class: "nf" }, g);

  const sp = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const at = (t, z, o = 0) => P(HX + t * c - o * s, D + 0.4 + t * s + o * c, z);
    const pts = [];
    for (const t of [0, DW]) for (const o of [0, 1.6]) for (const z of [fz0, fz1]) pts.push(at(t, z, o));
    door.setAttribute("d", poly(hull(pts)));
    pane.setAttribute("d", poly([at(4, fz0 + 4, 1.6), at(DW - 4, fz0 + 4, 1.6), at(DW - 4, fz1 - 4, 1.6), at(4, fz1 - 4, 1.6)]));
    grip.setAttribute("d", poly(hull([at(DW - 3, 30, 1.6), at(DW - 2, 30, 1.6), at(DW - 3, 44, 1.6), at(DW - 2, 44, 1.6), at(DW - 3, 30, 3.2), at(DW - 3, 44, 3.2)])));
  }

  const B = register(stage, (dt) => {
    const m = stepS(sp, dt);
    draw(sp.x);
    return m;
  });
  bag.add(B.unregister);

  function aim(a, on) {
    sp.t = a;
    door.classList.toggle("hi", true);
    read.textContent = on ? "door " + Math.round(a) + "°" : "rest";
    B.wake();
  }
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    const d = Math.hypot(wx - (HX + DW / 2), wy - (D + DW / 2));
    if (d > 90) return aim(REST, false);
    aim(clamp(maxA * (1 - (d - 12) / 78), 4, maxA), true);
  }
  aim(REST, false);
  bag.add(pointer(stage, { move, leave: () => aim(REST, false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "phonebooth",
  means: "A quiet office pod: the closer the pointer comes, the wider its glass door swings open on the hinge.",
  rules: [1, 3, 5, 8],
  range: [40, 95, 130],
  tour: [[218, 127], [190, 215], [159, 258], null],
  mount,
});
