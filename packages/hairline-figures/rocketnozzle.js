/**
 * Rocket nozzle: one engine hung under its thrust plate, a short combustion
 * chamber and a wide bell, pushed by two actuator rods. The pointer is where
 * the thrust should go: the bell gimbals on its pivot so its mouth swings
 * toward the pointer, on a spring. At rest it leans a little, bright.
 * The slider is the gimbal's reach in degrees.
 *
 * The pattern: a continuous aim (terrain's spring, on an angle).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, open, prism, proj, rings, run, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PZ = 84, REST = [0.16, -0.08];
const disc = (r, n = 32) => circ(r, n);
// bell profile: [radius, height] from the throat down to the mouth
const PROF = [];
for (let i = 0; i <= 8; i++) { const t = i / 8; PROF.push([7 + 22 * Math.pow(t, 0.8), 64 - 62 * t]); }

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-26, -26, PZ + 7], [26, 26, PZ + 7], [26, -26, PZ], [-26, 26, PZ], [-40, 0, 6], [40, 0, 6], [0, 40, 6], [0, -40, 6]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const bell = mk("path", { class: "sil hi" }, g);
  const ribs = [0.45, 0.75].map(() => mk("path", { class: "nf lo" }, g));
  const lip = mk("path", { class: "nf" }, g);
  const chamber = mk("path", { class: "sil" }, g);
  const rods = mk("path", { class: "nf" }, g);
  const [pr, pi] = rings(-22, -22, 22, 22, 7, 2);
  put(solid(g), prism(P, front, pr, pi, PZ, PZ + 7));

  const gx = spring(REST[0], { k: 90, c: 16 }), gy = spring(REST[1], { k: 90, c: 16 });
  function R(x, y, z, a, b) {
    const dz = z - PZ;
    const x1 = x * Math.cos(a) - dz * Math.sin(a), z1 = x * Math.sin(a) + dz * Math.cos(a);
    const y2 = y * Math.cos(b) - z1 * Math.sin(b), z2 = y * Math.sin(b) + z1 * Math.cos(b);
    return P(x1, y2, z2 + PZ);
  }
  const ringR = (r, z, a, b, keep) => (keep ? run(disc(r), front) : disc(r)).map((q) => R(q.u, q.v, z, a, b));
  let la = NaN, lb = NaN;
  function draw() {
    const a = gx.x, b = gy.x;
    if (a === la && b === lb) return;
    la = a; lb = b;
    const pts = [];
    for (const [r, z] of PROF) pts.push(...ringR(r, z, a, b));
    bell.setAttribute("d", poly(hull(pts)));
    [0.45, 0.75].forEach((t, i) => { const [r, z] = PROF[Math.round(t * 8)]; ribs[i].setAttribute("d", open(ringR(r, z, a, b, true))); });
    lip.setAttribute("d", open(ringR(PROF[8][0], PROF[8][1] + 2.5, a, b, true)));
    chamber.setAttribute("d", poly(hull(ringR(9, PZ, a, b).concat(ringR(10, 64, a, b), ringR(7.5, 61, a, b)))));
    rods.setAttribute("d", seg(P(18, 0, PZ), R(13, 0, 48, a, b)) + seg(P(0, 18, PZ), R(0, 13, 48, a, b)));
  }
  draw();
  read.textContent = "rest";

  const B = register(stage, (dt) => { const m1 = stepS(gx, dt), m2 = stepS(gy, dt); draw(); return m1 || m2; });
  bag.add(B.unregister);

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y) || 1;
      const m = (reach * Math.PI / 180) * clamp(r / 40, 0, 1);
      gx.t = (x / r) * m; gy.t = (y / r) * m;
      read.textContent = "tilt " + Math.round(m * 180 / Math.PI) + "°";
      B.wake();
    },
    leave: () => { gx.t = REST[0]; gy.t = REST[1]; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "rocketnozzle",
  means: "A rocket engine's bell under its thrust plate: the nozzle gimbals on its pivot so its mouth swings toward the pointer.",
  rules: [1, 3, 5, 8],
  range: [10, 20, 30],
  tour: [[133, 219], [118, 279], [200, 297], null],
  mount,
});
