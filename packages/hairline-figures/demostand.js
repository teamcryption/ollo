/**
 * Demo counter: a product demo counter with a screen on a post above its
 * top. The pointer swings the screen round to face it and tilts it back.
 * At rest the screen stands turned aside, bright.
 * The slider is how far it swings.
 *
 * The pattern: one part turning to face the pointer (officechairs).
 */
const { Cam, circ, facing, fit, hull, poly, prism, proj, rings, spring, stepS, clamp, rad, disposer, mk, pointer, put, register, solid } = HL;

const CW = 30, CD = 18, CH = 34, TOP = CH + 3, POST = 10, SW = 26, SD = 2, SH = 30, REST = -12;
const FACES = [[4, 5, 7, 6], [0, 2, 3, 1], [1, 3, 7, 5], [0, 4, 6, 2], [2, 6, 7, 3], [0, 1, 5, 4]];
const area = (q) => { let s = 0; for (let i = 0; i < q.length; i++) { const a = q[i], b = q[(i + 1) % q.length]; s += a[0] * b[1] - b[0] * a[1]; } return s; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-CW - 2, -CD - 2, 0], [CW + 2, CD + 2, 0], [CW + 2, -CD - 2, 0], [-CW - 2, CD + 2, 0], [0, 0, TOP + POST + SH + 6]], 200, 160);
  const P = proj(C), front = facing(C);
  const SG = Math.sign(area([P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)]));
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-CW, -CD, CW, CD, 3, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, CH));
  const [tr, ti] = rings(-CW - 2, -CD - 2, CW + 2, CD + 2, 4, 1.4);
  put(solid(g), prism(P, front, tr, ti, CH, TOP));
  put(solid(g), prism(P, front, circ(2.4, 24), circ(1.6, 24), TOP, TOP + POST + 4));
  const sil = mk("path", { class: "sil" }, g), faces = mk("path", { class: "nf" }, g), glass = mk("path", { class: "nf lo" }, g);
  const yaw = spring(REST), tilt = spring(4);

  function draw() {
    const c = Math.cos(rad(yaw.x)), s = Math.sin(rad(yaw.x)), cp = Math.cos(rad(tilt.x)), sp = Math.sin(rad(tilt.x));
    const pts = [];
    for (let i = 0; i < 8; i++) {
      const x = i & 1 ? SW : -SW, y0 = i & 2 ? SD : -SD, z0 = i & 4 ? SH : 0;
      const y = y0 * cp - z0 * sp, z = y0 * sp + z0 * cp;
      pts.push(P(x * c - y * s, x * s + y * c, TOP + POST + z));
    }
    sil.setAttribute("d", poly(hull(pts)));
    let fd = "", gd = "";
    FACES.forEach((f, k) => {
      const q = f.map((i) => pts[i]);
      if (area(q) * SG <= 0) return;
      fd += poly(q);
      if (k >= 4) {
        const m = [0, 1].map((j) => q.reduce((a, p) => a + p[j], 0) / 4);
        gd += poly(q.map((p) => [m[0] + (p[0] - m[0]) * 0.86, m[1] + (p[1] - m[1]) * 0.8]));
      }
    });
    faces.setAttribute("d", fd);
    glass.setAttribute("d", gd);
  }

  const B = register(stage, (dt) => {
    const a = stepS(yaw, dt), b = stepS(tilt, dt);
    draw();
    return a || b;
  });
  bag.add(B.unregister);

  const cx = P(0, 0, 0)[0];
  function aim(p) {
    if (!p) { yaw.t = REST; tilt.t = 4; read.textContent = "rest"; }
    else {
      const t = clamp((p[0] - cx) / 110, -1, 1);
      yaw.t = -45 + t * reach; tilt.t = -16;
      read.textContent = Math.round(yaw.t) + "°";
    }
    sil.classList.add("hi");
    B.wake();
  }
  aim(null);
  draw();
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "demostand",
  means: "A product demo counter: its screen swings round on the post to face the pointer and tilts back.",
  rules: [1, 3, 4, 5],
  range: [20, 45, 70],
  tour: [[120, 150], [290, 150], [200, 110], null],
  mount,
});
