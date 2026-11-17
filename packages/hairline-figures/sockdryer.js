/**
 * Peg basket: a squat basket of clothes pegs with a hinged lid. The
 * pointer's place along the basket swings the lid open to show the pegs;
 * at rest it stands a little open and bright. The slider is how far it opens.
 */
const { Cam, fit, hull, poly, proj, rrect, rings, prism, facing, unproj, clamp, rad, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const W = 64, D = 44, H = 30;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-4, -4, 0], [W + 4, D + 4, 0], [-4, D + 4, H + 70], [W, -4, H], [-4, -4, H + 70], [-25, D, H + 62]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 6, 2.2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  for (let i = 0; i < 4; i++) mk("path", { d: poly(hull([P(W, 8 + i * 9, 6), P(W, 12 + i * 9, 6), P(W, 8 + i * 9, H - 6), P(W, 12 + i * 9, H - 6)])), class: "nf lo" }, g);
  for (const [x, y, a] of [[14, 10, 30], [24, 26, -20], [38, 14, 60], [46, 30, 10], [30, 18, 100]]) {
    const c = Math.cos(rad(a)) * 9, s = Math.sin(rad(a)) * 9;
    mk("path", { d: poly(hull([P(x - c, y - s, H), P(x + c, y + s, H), P(x - c + 2, y - s + 2, H), P(x + c + 2, y + s + 2, H)])), class: "lo" }, g);
  }
  const lid = mk("path", { class: "sil" }, g), knob = mk("path", { class: "nf" }, g);
  const lring = rrect(0, -1, W + 1, D + 1, 6, 4), kring = rrect(W - 8, D / 2 - 6, W - 3, D / 2 + 6, 2, 3);
  const tilt = (ring, t, w0, w1) => {
    const c = Math.cos(rad(t)), s = Math.sin(rad(t)), pts = [];
    for (const w of [w0, w1]) for (const q of ring) pts.push(P(q.u * c - w * s, q.v, H + q.u * s + w * c));
    return poly(hull(pts));
  };
  const REST = 42, sp = spring(REST);
  let last = NaN;
  function draw() {
    if (sp.x === last) return;
    last = sp.x;
    lid.setAttribute("d", tilt(lring, sp.x, 0, 3));
    knob.setAttribute("d", tilt(kring, sp.x, 3, 7));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();
  lid.classList.add("hi");
  read.textContent = "rest";
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    if (wx < -60 || wx > W + 50 || wy < -50 || wy > D + 50) return leave();
    const t = clamp((W + 40 - wx) * 1.1, 0, maxA);
    sp.t = t;
    read.textContent = Math.round(t) + "°";
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "sockdryer",
  means: "A basket of clothes pegs: its lid swings open toward the pointer to show the pegs, and rests a little ajar.",
  rules: [1, 3, 5, 8],
  range: [60, 100, 110],
  tour: [[250, 280], [170, 245], [130, 224], null],
  mount,
});
