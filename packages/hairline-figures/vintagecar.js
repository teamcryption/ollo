/**
 * Vintage car: an upright old motor car on tall thin wheels, a boxy cabin,
 * a long bonnet split along its ridge and a tall radiator at the nose. The
 * pointer over the car lifts the near half of the butterfly bonnet on its
 * centre hinge, on a spring, to show the engine block. At rest the bonnet
 * is shut, its near half bright. The slider is how far the half swings.
 *
 * The pattern: one part answering, hit on the rest pose's screen box.
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, prism, proj, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const WR = 11, WW = 4, X0 = 0, X1 = 30, RZ = 27;
const WHEELS = [[-26, -17], [22, -17], [-26, 17], [22, 17]];
const HALF = [[0, 0], [11, -4], [11, -15]]; // bonnet half cross-section (dy, dz) from the ridge

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[-40, -21, 0], [40, 21, 0], [40, -21, 0], [-40, 21, 0], [-34, -15, 42], [15, -4, RZ + 12]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = ([u, v]) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; for (const dv of [-WW / 2, WW / 2]) pts.push(P(u + WR * Math.cos(t), v + Math.sign(v) * dv, WR + WR * Math.sin(t))); }
    return poly(hull(pts));
  };
  const wheelSet = (w) => { mk("path", { d: wheel(w), class: "sil" }, g); const s = Math.sign(w[1]); mk("path", { d: poly(hull([0, 1, 2, 3, 4, 5, 6, 7].map((i) => P(w[0] + 3 * Math.cos(i * 0.785), w[1] + s * 2.2, WR + 3 * Math.sin(i * 0.785))))), class: "nf lo" }, g); };
  WHEELS.filter((w) => w[1] < 0).forEach(wheelSet);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  box(-40, -15, 32, 15, 3, 1, 9, 12);
  box(-36, -14, -2, 14, 4, 1.4, 12, 42);
  mk("path", { d: poly([P(-30, 14, 26), P(-20, 14, 26), P(-20, 14, 38), P(-30, 14, 38)]) + poly([P(-15, 14, 26), P(-6, 14, 26), P(-6, 14, 38), P(-15, 14, 38)]), class: "nf lo" }, g);
  const ext = (prof, y0, z0, sign, cls) => {
    const pts = [];
    for (const x of [X0, X1]) prof.forEach(([dy, dz]) => pts.push(P(x, y0 + sign * dy, z0 + dz)));
    return mk("path", { d: poly(hull(pts)), class: cls }, g);
  };
  ext(HALF, 0, RZ, -1, "sil");
  box(4, -9, 26, 9, 2, 1, 12, 23);
  const half = mk("path", { class: "sil hi" }, g), lines = mk("path", { class: "nf lo" }, g);
  box(30, -11, 35, 11, 2, 1, 8, 30);
  mk("path", { d: poly(hull([0, 1, 2, 3, 4, 5, 6, 7].map((i) => P(40, 2 * Math.cos(i * 0.785), 12 + 2 * Math.sin(i * 0.785))).concat([P(35, 0, 12)]))) + seg(P(40, 0, 12), P(40, 0, 4)), class: "nf" }, g);
  WHEELS.filter((w) => w[1] > 0).forEach(wheelSet);
  const sp = spring(0);
  let last = NaN, over = false;

  function draw() {
    const a = clamp(sp.x, 0, 2.7);
    if (Math.abs(a - last) < 0.0005) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a);
    const rot = ([dy, dz]) => [dy * c - dz * s, dy * s + dz * c];
    const prof = HALF.map(rot), pts = [];
    for (const x of [X0, X1]) prof.forEach(([dy, dz]) => pts.push(P(x, dy, RZ + dz)));
    half.setAttribute("d", poly(hull(pts)));
    let d = seg(P(X0, prof[1][0], RZ + prof[1][1]), P(X1, prof[1][0], RZ + prof[1][1]));
    for (let k = 0; k < 6; k++) {
      const x = 6 + k * 3.6, q = rot([11, -7]), r = rot([11, -12]);
      d += seg(P(x, q[0], RZ + q[1]), P(x, r[0], RZ + r[1]));
    }
    lines.setAttribute("d", d);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const bb = [[-40, -21, 0], [40, 21, 0], [40, -21, 0], [-40, 21, 0], [-36, -14, 42], [-36, 14, 42], [35, 11, 30]].map((q) => P(...q));
  const xs = bb.map((q) => q[0]), ys = bb.map((q) => q[1]);
  const bx = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];

  function retarget() {
    sp.t = over ? 0.9 + 1.8 * reach : 0;
    read.textContent = over ? "lift " + Math.round((sp.t * 180) / Math.PI) : "rest";
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
  name: "vintagecar",
  means: "An upright vintage motor car: the pointer over it lifts the near half of the butterfly bonnet on its ridge hinge to show the engine.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[219, 173], [140, 160], [250, 250], null],
  mount,
});
