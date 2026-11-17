/**
 * Hair straightener: two long flat paddles hinged at the cord end, a heated
 * plate inside the tip of each. The upper paddle swings up about the hinge;
 * the nearer the pointer comes to the tips, the wider the jaws open. At rest
 * the jaws are just ajar, the lower plate bright. The slider is how far the
 * upper paddle can open.
 *
 * The pattern: one part tilting on a hinge (tilt).
 */
const {
  Cam, clamp, fit, hull, open, poly, proj, rad, rrect, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HX = 6, HZ = 11, REST = 7, MAX = 28, L = 120;

// a straight bar between two world points, with a rounded section w × h
function tube(P, p0, p1, w, h) {
  const d = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]], L = Math.hypot(...d), a = d.map((q) => q / L);
  let s = [-a[1], a[0], 0], sl = Math.hypot(s[0], s[1]);
  if (sl < 1e-3) { s = [1, 0, 0]; sl = 1; }
  s = s.map((q) => q / sl);
  let u = [a[1] * s[2] - a[2] * s[1], a[2] * s[0] - a[0] * s[2], a[0] * s[1] - a[1] * s[0]];
  if (u[2] < 0) u = u.map((q) => -q);
  const ring = rrect(-w / 2, -h / 2, w / 2, h / 2, Math.min(w, h) / 2, 4);
  const at = (c, q) => P(c[0] + s[0] * q.u + u[0] * q.v, c[1] + s[1] * q.u + u[1] * q.v, c[2] + s[2] * q.u + u[2] * q.v);
  const k = h / 2 - Math.min(1, h / 4), b = Math.min(1.5, L / 4);
  const q0 = p0.map((v, i) => v + a[i] * b), q1 = p1.map((v, i) => v - a[i] * b);
  return { sil: poly(hull(ring.map((q) => at(p0, q)).concat(ring.map((q) => at(p1, q))))), crease: open([at(q0, { u: 0, v: k }), at(q1, { u: 0, v: k })]) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-22, -12, 0], [L + 4, 12, 0], [L - 20, 0, 88], [L - 20, 12, 88], [-22, 12, 0]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  // the cord leaving the hinge, then the lower paddle and its plate
  put(solid(g), tube(P, [-22, 0, 4], [HX, 0, 7], 4, 4));
  put(solid(g), tube(P, [HX, 0, 6], [L, 0, 6], 18, 8));
  const [pr, pi] = rings(L - 58, -6, L - 4, 6, 3, 1);
  const plate = solid(g);
  plate.sil.classList.add("hi");
  {
    const top = pr.map((q) => P(q.u, q.v, 10.6)), bot = pr.map((q) => P(q.u, q.v, 10));
    put(plate, { sil: poly(hull(top.concat(bot))), crease: poly(pi.map((q) => P(q.u, q.v, 10.6))) });
  }
  // the hinge barrel across the paddles
  put(solid(g), tube(P, [HX, -10, HZ], [HX, 10, HZ], 9, 9));
  const arm = solid(g), cap = mk("path", { class: "nf lo" }, g);

  const sp = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const Q = (x, y, z) => { const dx = x - HX, dz = z - HZ; return P(HX + dx * c - dz * s, y, HZ + dx * s + dz * c); };
    put(arm, tube(Q, [HX, 0, 16], [L, 0, 16], 18, 8));
    const d = [];
    for (let k = 0; k < 12; k++) d.push(Q(L - 70 + 36 * (k < 6 ? k / 5 : (11 - k) / 5), k < 6 ? -4 : 4, 20.2));
    cap.setAttribute("d", poly(d));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function move(p) {
    const [x, y] = unproj(C, p[0], p[1], 0);
    const t = Math.abs(y) > 70 ? 0 : clamp((x + 10) / (L + 10), 0, 1);
    sp.t = REST + MAX * reach * t;
    read.textContent = Math.round(sp.t) + "°";
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  draw(REST);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "hairstraight",
  means: "A hair straightener: the upper paddle swings up on its hinge, the jaws opening wider as the pointer nears the tips.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.4],
  tour: [[315, 207], [250, 180], [190, 150], null],
  mount,
});
