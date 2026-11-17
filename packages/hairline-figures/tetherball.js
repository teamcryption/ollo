/**
 * Tetherball: a tall pole on a round weighted base, a rope from its top and
 * the ball on the rope. The pointer around the pole swings the ball out
 * towards it: the rope turns to the pointer's side and lifts the ball out on a
 * spring. At rest the ball hangs a little out from the pole, bright. The
 * slider is how far out the ball swings.
 *
 * The pattern: a continuous aim on two numbers (side and swing); the hit is on
 * the ground plane, which never moves.
 */
const {
  Cam, circ, facing, fit, prism, proj, poly, open, run, ringAt, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 84, L = 50, BR = 8, AZ0 = -0.6, TH0 = 0.7, TH1 = 1.15;
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.8);
  const ext = [[0, 0, H + 3]];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2, r = L * Math.sin(TH1) + BR; ext.push([r * Math.cos(a), r * Math.sin(a), H - L * Math.cos(TH1)], [20 * Math.cos(a), 20 * Math.sin(a), 0]); }
  fit(C, ext, 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(20, 48), circ(18, 48), 0, 5));
  const far = mk("g", {}, g);
  put(solid(g), prism(P, front, circ(1.8, 16), null, 5, H));
  put(solid(g), prism(P, front, circ(2.6, 16), circ(1.8, 16), H, H + 2));
  const near = mk("g", {}, g);
  const ballG = mk("g", {}, far);
  const rope = mk("path", { class: "nf sil" }, ballG);
  const ball = mk("path", { class: "sil hi" }, ballG);
  const seam = mk("path", { class: "nf lo" }, ballG);
  let side = far;

  const az = spring(AZ0), th = spring(TH0);
  let dA = NaN, dT = NaN;
  function draw() {
    if (Math.abs(az.x - dA) < 1e-4 && Math.abs(th.x - dT) < 1e-4) return;
    dA = az.x; dT = th.x;
    const r = L * Math.sin(th.x), c = Math.cos(az.x), s = Math.sin(az.x);
    const bx = r * c, by = r * s, bz = H - L * Math.cos(th.x);
    const top = H - 1, k = (L - BR) / L;
    rope.setAttribute("d", open([P(0, 0, top), P(bx * k, by * k, top + (bz - top) * k)]));
    const ctr = P(bx, by, bz), R = BR * C.S, pts = [];
    for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2; pts.push([ctr[0] + R * Math.cos(t), ctr[1] + R * Math.sin(t)]); }
    ball.setAttribute("d", poly(pts));
    seam.setAttribute("d", open(ringAt(P, run(disc(bx, by, BR), front), bz)));
    const want = bx + by > 0 ? near : far;
    if (want !== side) { want.appendChild(ballG); side = want; }
  }

  const B = register(stage, (dt) => { const m1 = stepS(az, dt), m2 = stepS(th, dt); draw(); return m1 || m2; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    if (over) {
      az.t = az.t + wrap(Math.atan2(over[1], over[0]) - az.t);
      th.t = TH0 + amt * (TH1 - TH0);
    } else { az.t = az.t + wrap(AZ0 - az.t); th.t = TH0; }
    read.textContent = over ? "out " + Math.round((th.t * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      over = r > 70 || r < 6 ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { amt = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "tetherball",
  means: "A tetherball pole: the ball on its rope swings out round the pole towards the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.2, 1, 1],
  tour: [[111, 290], [300, 245], [150, 215], null],
  mount,
});
