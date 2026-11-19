/**
 * Confetti cannon: a squat base with a long barrel on a pivot. The pointer
 * aims it: the barrel tilts up toward the pointer's height and swings toward
 * its side, on a spring, and the confetti at the mouth spreads further the
 * higher it points. At rest the barrel leans low, bright. The slider is how
 * far the barrel can tilt.
 *
 * The pattern: a continuous aim on one part; the hit is the screen point,
 * read against a fixed frame, never the moving barrel.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rad, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PIV = [0, 0, 22], BACK = 14, LEN = 70, R0 = 8, R1 = 11, REST_E = 18, REST_A = -90;
const BITS = [[0, 0], [1, 1.2], [-1, 0.8], [0.6, -1], [-0.7, -1.3], [1.4, -0.2], [-1.3, 0.3]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-22, -22, 0], [22, 22, 0], [0, -LEN, 30], [0, -20, PIV[2] + 62], [-30, -40, 50], [30, -40, 50]], 200, 200);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-20, -20, 20, 20, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, 10));
  const [kr, ki] = rings(-9, -9, 9, 9, 4, 1.2);
  put(solid(g), prism(P, front, kr, ki, 10, PIV[2] - 4));
  const body = mk("path", { class: "sil hi" }, g), mouth = mk("path", { class: "nf" }, g), band = mk("path", { class: "nf lo" }, g);
  const bits = BITS.map(() => mk("ellipse", { class: "dot m", rx: 1.8, ry: 1.2 }, g));
  const el = spring(REST_E), az = spring(REST_A);
  let last = "";

  function basis(d) {
    let u = [d[1], -d[0], 0];
    const un = Math.hypot(...u) || 1; u = u.map((x) => x / un);
    const v = [u[1] * d[2] - u[2] * d[1], u[2] * d[0] - u[0] * d[2], u[0] * d[1] - u[1] * d[0]];
    return [u, v];
  }
  function ring(d, u, v, off, r, n = 28) {
    return Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2, q = (j) => PIV[j] + d[j] * off + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]);
      return P(q(0), q(1), q(2));
    });
  }
  function draw() {
    const key = el.x.toFixed(2) + "," + az.x.toFixed(2);
    if (key === last) return;
    last = key;
    const e = rad(el.x), a = rad(az.x);
    const d = [Math.cos(e) * Math.cos(a), Math.cos(e) * Math.sin(a), Math.sin(e)];
    const [u, v] = basis(d);
    const back = ring(d, u, v, -BACK, R0), tip = ring(d, u, v, LEN - BACK, R1);
    body.setAttribute("d", poly(hull(back.concat(tip))));
    mouth.setAttribute("d", poly(tip));
    band.setAttribute("d", poly(ring(d, u, v, 0, R0 + 1.5)));
    const spread = 6 + (el.x - REST_E) * 0.5;
    bits.forEach((b, k) => {
      const [p, q] = BITS[k], off = LEN - BACK + 5 + spread * (0.5 + 0.25 * ((k * 3) % 4));
      const s = (j) => PIV[j] + d[j] * off + (spread * 0.35) * (p * u[j] + q * v[j]);
      const pt = P(s(0), s(1), s(2));
      b.setAttribute("cx", pt[0]); b.setAttribute("cy", pt[1]);
    });
  }

  const B = register(stage, (dt) => {
    const m1 = stepS(el, dt), m2 = stepS(az, dt);
    draw();
    return m1 || m2;
  });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { el.t = REST_E; az.t = REST_A; read.textContent = "rest"; B.wake(); return; }
    const fy = clamp((250 - p[1]) / 190, 0, 1), fx = clamp((p[0] - 200) / 160, -1, 1);
    el.t = REST_E + amp * (0.45 + 0.55 * fy);
    az.t = REST_A + fx * 30;
    read.textContent = "tilt " + Math.round(el.t) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "confetti",
  means: "A confetti cannon on a pivot: the barrel tilts up and swings toward the pointer, and the confetti at its mouth spreads further.",
  rules: [1, 3, 4, 5, 8],
  range: [24, 34, 44],
  tour: [[191,185], [226,151], [209,117], null],
  mount,
});
