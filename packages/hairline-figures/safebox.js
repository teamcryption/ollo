/**
 * Safebox: a wall safe, a heavy box with a door on its right face, a dial
 * and a handle on the door. The pointer's place across the figure swings
 * the door open on its hinge, and the dial turns with it. At rest the door
 * stands ajar, bright. The slider is how far the door may swing.
 *
 * The outer face stays toward the camera to 135°, so paint order never changes.
 *
 * The pattern: one part following the pointer (spring).
 */
const {
  Cam, clamp, fit, facing, open, poly, prism, proj, rad, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 44, D = 56, H = 60, YA = 6, YB = 50, ZA = 8, ZB = 54, T = 3, REST = 22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[0, 0, 0], [W, D, 0], [W + 46, YB + 16, 0], [0, 0, H], [W + 46, YB + 16, ZB], [W, D, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // the opening on the face, and a shelf inside it
  mk("path", { d: poly([P(W, YA, ZA), P(W, YB, ZA), P(W, YB, ZB), P(W, YA, ZB)]), class: "nf lo" }, g);
  mk("path", { d: open([P(W, YA + 2, 31), P(W - 10, YA + 2, 31), P(W - 10, YB - 2, 31)]), class: "nf lo" }, g);

  const back = mk("path", {}, g), face = mk("path", { class: "sil" }, g);
  const dial = mk("path", { class: "nf" }, g), tick = mk("path", { class: "nf lo" }, g), handle = mk("path", { class: "nf" }, g);
  const a = spring(REST);
  let last = NaN;

  // a point on the door: u along it from the hinge, z up, w out of its face
  function dp(th, u, z, w) {
    const dx = Math.sin(th), dy = -Math.cos(th), nx = Math.cos(th), ny = Math.sin(th);
    return P(W + u * dx + w * nx, YB + u * dy + w * ny, z);
  }
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const th = rad(deg), L = YB - YA;
    const plate = (w) => poly([dp(th, 0, ZA, w), dp(th, L, ZA, w), dp(th, L, ZB, w), dp(th, 0, ZB, w)]);
    back.setAttribute("d", plate(0));
    face.setAttribute("d", plate(T));
    const cu = L * 0.55, cz = (ZA + ZB) / 2 + 4, ring = [];
    for (let i = 0; i < 28; i++) { const f = (i / 28) * Math.PI * 2; ring.push(dp(th, cu + 7 * Math.cos(f), cz + 7 * Math.sin(f), T + 1.2)); }
    dial.setAttribute("d", poly(ring));
    const sp = th * 3;
    tick.setAttribute("d", open([dp(th, cu, cz, T + 1.2), dp(th, cu + 5 * Math.cos(sp), cz + 5 * Math.sin(sp), T + 1.2)]));
    handle.setAttribute("d", poly([dp(th, cu - 2, cz - 22, T), dp(th, cu - 2, cz - 14, T), dp(th, cu - 2, cz - 14, T + 4), dp(th, cu - 2, cz - 22, T + 4)]));
  }

  const B = register(stage, (dt) => {
    const m = stepS(a, dt);
    draw(Math.round(a.x * 10) / 10);
    return m;
  });
  bag.add(B.unregister);

  const x0 = P(0, D, 0)[0], x1 = P(W + 40, 0, 0)[0];
  function setOpen(t) {
    const want = t < 0 ? REST : t * maxA;
    a.t = want;
    face.classList.toggle("hi", true);
    read.textContent = t < 0 ? "rest" : Math.round(want) + "°";
    B.wake();
  }
  setOpen(-1);
  bag.add(pointer(stage, { move: ([sx]) => setOpen(clamp((sx - x0) / (x1 - x0), 0, 1)), leave: () => setOpen(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "safebox",
  means: "A wall safe: the pointer's place across it swings the heavy door open on its hinge, and the dial turns as it goes.",
  rules: [1, 3, 5, 8],
  range: [60, 105, 130],
  tour: [[190, 162], [259, 185], [300, 185], null],
  mount,
});
