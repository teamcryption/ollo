/**
 * Promo cube: a branded cube on a spindle above a round plinth. The pointer
 * turns the cube to face it and lifts it up the spindle, its logo panels
 * swinging round. At rest the cube sits low, turned a little, bright.
 * The slider is how far it turns.
 *
 * The pattern: one part turning to face the pointer (officechairs).
 */
const { Cam, circ, facing, fit, hull, poly, prism, proj, rings, spring, stepS, clamp, rad, disposer, mk, pointer, put, register, solid } = HL;

const H = 22, LIFT = 14, BZ = 10, GAP = 4, REST = 22;
const FACES = [[4, 5, 7, 6], [0, 2, 3, 1], [1, 3, 7, 5], [0, 4, 6, 2], [2, 6, 7, 3], [0, 1, 5, 4]];
const area = (q) => { let s = 0; for (let i = 0; i < q.length; i++) { const a = q[i], b = q[(i + 1) % q.length]; s += a[0] * b[1] - b[0] * a[1]; } return s; };
const disc = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-34, -34, 0], [34, 34, 0], [34, -34, 0], [-34, 34, 0], [0, 0, BZ + GAP + LIFT + 2 * H + 4]], 200, 165);
  const P = proj(C), front = facing(C);
  const SG = Math.sign(area([P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)]));
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(32), disc(29), 0, BZ));
  put(solid(g), prism(P, front, disc(3), disc(2), BZ, BZ + GAP + LIFT + H));
  const sil = mk("path", { class: "sil" }, g), faces = mk("path", { class: "nf" }, g), logos = mk("path", { class: "nf lo" }, g);
  const yaw = spring(REST), up = spring(0);

  function draw() {
    const c = Math.cos(rad(yaw.x)), s = Math.sin(rad(yaw.x)), z0 = BZ + GAP + up.x;
    const pts = [];
    for (let i = 0; i < 8; i++) {
      const x = i & 1 ? H : -H, y = i & 2 ? H : -H, z = i & 4 ? z0 + 2 * H : z0;
      pts.push(P(x * c - y * s, x * s + y * c, z));
    }
    sil.setAttribute("d", poly(hull(pts)));
    let fd = "", ld = "";
    for (const f of FACES) {
      const q = f.map((i) => pts[i]);
      if (area(q) * SG <= 0) continue;
      fd += poly(q);
      const m = [0, 1].map((k) => q.reduce((a, p) => a + p[k], 0) / 4);
      ld += poly(q.map((p) => [m[0] + (p[0] - m[0]) * 0.55, m[1] + (p[1] - m[1]) * 0.55]));
    }
    faces.setAttribute("d", fd);
    logos.setAttribute("d", ld);
  }

  const B = register(stage, (dt) => {
    const a = stepS(yaw, dt), b = stepS(up, dt);
    draw();
    return a || b;
  });
  bag.add(B.unregister);

  const cx = P(0, 0, 0)[0];
  function aim(p) {
    if (!p) { yaw.t = REST; up.t = 0; read.textContent = "rest"; }
    else {
      const t = clamp((p[0] - cx) / 110, -1, 1);
      yaw.t = REST + t * reach; up.t = LIFT;
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
  name: "promocube",
  means: "A promo cube on a spindle: it turns to face the pointer and rises, its logo panels swinging round.",
  rules: [1, 3, 4, 5],
  range: [20, 60, 90],
  tour: [[120, 150], [280, 150], [200, 120], null],
  mount,
});
