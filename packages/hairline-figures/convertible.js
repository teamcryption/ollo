/**
 * Convertible: a low two-door car on four wheels with a fabric soft top
 * over the cabin, its bows showing as dim ribs. The pointer over the car
 * folds the top back: the front bow travels rearward and the fabric bunches
 * into a stack behind the seats, on a spring. At rest the top is up, bright.
 * The slider is how far the top folds.
 *
 * The pattern: one part answering, hit on the rest pose's screen box.
 */
const {
  Cam, clamp, fit, facing, hull, lerp, open, poly, prism, proj, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const WR = 9, WW = 6, YW = 15;
const WHEELS = [[-27, -18], [29, -18], [-27, 18], [29, 18]];
// soft top profile, front to back, in (x, z): up and folded
const UP = [[12, 18], [6, 31], [-14, 32], [-26, 28], [-32, 18]];
const DOWN = [[-20, 18], [-22, 23], [-26, 24], [-31, 22], [-34, 18]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.15);
  fit(C, [[-46, -22, 0], [46, 22, 0], [46, -22, 0], [-46, 22, 0], [-14, -17, 33], [6, 17, 33]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = ([u, v]) => {
    const pts = [];
    for (let i = 0; i < 20; i++) { const t = (i / 20) * Math.PI * 2; for (const dv of [-WW / 2, WW / 2]) pts.push(P(u + WR * Math.cos(t), v + Math.sign(v) * dv, WR + WR * Math.sin(t))); }
    return poly(hull(pts));
  };
  WHEELS.filter((w) => w[1] < 0).forEach((w) => mk("path", { d: wheel(w), class: "sil" }, g));
  const [br, bi] = rings(-46, -17, 46, 17, 11, 2);
  put(solid(g), prism(P, front, br, bi, 6, 17));
  mk("path", { d: poly([P(-20, -13, 17), P(8, -13, 17), P(8, 13, 17), P(-20, 13, 17)]), class: "nf lo" }, g);
  mk("path", { d: seg(P(-4, -13, 17), P(-4, 13, 17)) + seg(P(26, -10, 17), P(26, 10, 17)), class: "nf lo" }, g);
  const top = mk("path", { class: "sil hi" }, g), ribs = mk("path", { class: "nf lo" }, g);
  mk("path", { d: poly([P(12, -15, 17), P(12, 15, 17), P(6, 15, 31), P(6, -15, 31)]), class: "nf" }, g);
  WHEELS.filter((w) => w[1] > 0).forEach((w) => mk("path", { d: wheel(w), class: "sil" }, g));
  const sp = spring(0);
  let last = NaN, over = false;

  function draw() {
    const t = clamp(sp.x, 0, 1);
    if (Math.abs(t - last) < 0.0005) return;
    last = t;
    const prof = UP.map((q, i) => [lerp(q[0], DOWN[i][0], t), lerp(q[1], DOWN[i][1], t)]);
    const pts = [];
    prof.forEach(([x, z]) => { pts.push(P(x, -YW, z), P(x, YW, z)); });
    top.setAttribute("d", poly(hull(pts)));
    let d = open(prof.map(([x, z]) => P(x, YW, z)));
    for (let i = 1; i < 4; i++) d += seg(P(prof[i][0], -YW, prof[i][1]), P(prof[i][0], YW, prof[i][1]));
    ribs.setAttribute("d", d);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const box = hull([[-46, -18, 0], [46, -18, 0], [46, 18, 0], [-46, 18, 0], [-14, -15, 32], [6, 15, 32], [-46, 18, 17], [46, -18, 17]].map((q) => P(...q)));
  const xs = box.map((q) => q[0]), ys = box.map((q) => q[1]);
  const bx = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];

  function retarget() {
    sp.t = over ? 0.25 + 0.75 * reach : 0;
    read.textContent = over ? "fold " + Math.round(sp.t * 100) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { over = sx > bx[0] && sx < bx[1] && sy > bx[2] && sy < bx[3]; retarget(); },
    leave: () => { over = false; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  draw();
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "convertible",
  means: "A low two-door car with a fabric soft top: the pointer over the car folds the top back into a stack behind the seats.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[191, 103], [235, 200], [150, 160], null],
  mount,
});
