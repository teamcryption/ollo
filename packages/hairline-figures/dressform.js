/**
 * Dress form: a tailor's torso on a pole over a round foot. The pointer
 * stands somewhere on the studio floor and the form turns on its pole to
 * face it, its front seam swinging round to the pointer. At rest it stands
 * a quarter turned, the seam bright. The slider is how far it may turn.
 *
 * The pattern: one part turning to face the pointer (officechairs).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rad, rings, ringAt, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

// the torso's profile: [z, half-width, half-depth], hip to shoulder
const PROF = [[66, 15, 11], [72, 17, 12.5], [80, 15, 11], [88, 12.5, 9.5], [96, 14, 10.5], [104, 17, 12.5], [112, 17.5, 12], [118, 15, 10], [122, 10, 7.5]];
const REST = 70, TOP = 122, NECK = 4.2;
const disc = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxT = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-24, -24, 0], [24, 24, 0], [-24, 24, 0], [24, -24, 0], [0, 0, TOP + 12], [-18, 18, 110], [18, -18, 110]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the foot, a low round plinth, and the pole
  const [fr, fi] = rings(-22, -22, 22, 22, 22, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 5));
  const [pr, pi] = rings(-2.4, -2.4, 2.4, 2.4, 2.4, 0.8);
  put(solid(g), prism(P, front, pr, pi, 5, 68));

  const body = mk("path", { class: "sil" }, g);
  const hem = mk("path", { class: "nf lo" }, g);
  const waist = mk("path", { class: "nf lo" }, g);
  const seam = mk("path", { class: "nf sil hi" }, g);
  const neck = solid(g);
  const [nr, ni] = rings(-NECK, -NECK, NECK, NECK, NECK, 1);
  put(neck, prism(P, front, nr, ni, TOP - 1, TOP + 8));
  const cap = mk("path", { class: "nf" }, g);
  cap.setAttribute("d", poly(ringAt(P, disc(2), TOP + 10.5)));
  const capS = solid(g);
  put(capS, prism(P, front, disc(2.2, 16), disc(1.4, 16), TOP + 8, TOP + 11));

  // one level of the torso as screen points, turned to face phi
  const level = ([z, a, b], phi, n = 36) => {
    const fx = Math.cos(phi), fy = Math.sin(phi), out = [];
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2, s = a * Math.cos(t), f = b * Math.sin(t);
      out.push(P(-fy * s + fx * f, fx * s + fy * f, z));
    }
    return out;
  };
  const lower = (pts) => { const cy = pts.reduce((m, p) => m + p[1], 0) / pts.length; return pts.filter((p) => p[1] >= cy - 0.01).sort((p, q) => p[0] - q[0]); };

  const turn = spring(0);
  let last = NaN;
  function draw() {
    const phi = rad(REST + turn.x);
    if (phi === last) return;
    last = phi;
    const L = [], R = [];
    for (const lv of PROF) {
      const pts = level(lv, phi);
      let lo = pts[0], hi = pts[0];
      for (const p of pts) { if (p[0] < lo[0]) lo = p; if (p[0] > hi[0]) hi = p; }
      L.push(lo); R.push(hi);
    }
    const bot = lower(level(PROF[0], phi)), top = hull(level(PROF[PROF.length - 1], phi));
    const topUp = top.filter((p) => p[1] <= (L[L.length - 1][1] + R[R.length - 1][1]) / 2 + 0.5).sort((p, q) => p[0] - q[0]);
    body.setAttribute("d", poly([...bot.slice().reverse(), ...L, ...topUp, ...R.slice().reverse()]));
    hem.setAttribute("d", open(lower(level([PROF[0][0] + 2.5, PROF[0][1] - 0.4, PROF[0][2] - 0.3], phi))));
    waist.setAttribute("d", open(lower(level(PROF[3], phi))));
    // the front seam shows only while the front faces the viewer
    const facingFront = Math.cos(phi - rad(45)) > 0.05;
    const s = [];
    if (facingFront) for (let z = PROF[0][0] + 1; z <= 120; z += 2) {
      let k = 0; while (k < PROF.length - 2 && PROF[k + 1][0] < z) k++;
      const [z0, , b0] = PROF[k], [z1, , b1] = PROF[k + 1], b = b0 + ((b1 - b0) * clamp((z - z0) / (z1 - z0), 0, 1));
      s.push(P(Math.cos(phi) * b, Math.sin(phi) * b, z));
    }
    seam.setAttribute("d", s.length ? open(s) : "");
  }

  const B = register(stage, (dt) => { const m = stepS(turn, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(t) {
    turn.t = t;
    read.textContent = t === 0 ? "rest" : (t > 0 ? "+" : "−") + Math.abs(Math.round(t)) + "°";
    B.wake();
  }
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    if (Math.hypot(wx, wy) < 6) return;
    let d = (Math.atan2(wy, wx) * 180) / Math.PI - REST;
    d = ((d + 540) % 360) - 180;
    aim(clamp(d, -maxT, maxT) || 0.001);
  }
  draw();
  aim(0);
  bag.add(pointer(stage, { move, leave: () => aim(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxT = v; }, destroy: bag.dispose };
}

hairline({
  name: "dressform",
  means: "A tailor's dress form on a pole: it turns to face the pointer across the floor, its front seam swinging round.",
  rules: [1, 3, 5, 8],
  range: [40, 110, 170],
  tour: [[330, 210], [70, 220], [210, 300], null],
  mount,
});
