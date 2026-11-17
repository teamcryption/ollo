/**
 * Rowing boat: a clinker dinghy with a seat across it and a pair of oars
 * in their rowlocks. The pointer's place along the boat is the stroke: the
 * oars sweep from catch to finish, blades dipping, and the boat surges on.
 * At rest the oars hang mid-stroke, bright. The slider is the sweep.
 *
 * The pattern: a continuous input driving one mechanism (a spring).
 */
const {
  Cam, fit, hull, poly, proj, clamp, lerp, rad, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const L = 120, B = 40, H = 13, OUT = 64, IN = 16, REST = 0.35;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-14, -B / 2 - OUT, 0], [L + 14, B / 2 + OUT, 0], [L / 2, 0, H + 12], [-14, B / 2 + OUT, 0], [L + 14, -B / 2 - OUT, 0]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const half = (u) => (B / 2) * Math.pow(Math.max(0, Math.sin((Math.PI * u) / L)), 0.55) * (u > L * 0.75 ? 1 : 1);
  const ring = (dx, z, k) => { const a = []; for (let i = 0; i <= 30; i++) { const u = (i / 30) * L; a.push(P(u + dx, half(u) * k, z)); } for (let i = 30; i >= 0; i--) { const u = (i / 30) * L; a.push(P(u + dx, -half(u) * k, z)); } return a; };
  const farOar = mk("path", { class: "sil hi" }, g);
  const body = mk("path", { class: "sil" }, g), rim = mk("path", { class: "nf" }, g), inner = mk("path", { class: "nf lo" }, g), seat = mk("path", {}, g);
  const nearOar = mk("path", { class: "sil hi" }, g);
  const sp = spring(REST, { k: 60, c: 14 });
  let last = NaN;
  function oar(side, phi, dip, dx) {
    const ox = L / 2 + dx, oy = side * half(L / 2), dxs = Math.sin(rad(phi)), dys = Math.cos(rad(phi));
    const at = (r, w, z) => P(ox - r * dxs + w * dys, oy + side * r * dys + w * dxs * side * -1, z);
    const zt = (r) => H + 2 - (r / OUT) * dip;
    return poly([at(-IN, -1.2, H + 4), at(OUT - 16, -1.2, zt(OUT - 16)), at(OUT - 16, -4, zt(OUT - 16)), at(OUT, -4.5, zt(OUT)), at(OUT, 4.5, zt(OUT)), at(OUT - 16, 4, zt(OUT - 16)), at(OUT - 16, 1.2, zt(OUT - 16)), at(-IN, 1.2, H + 4)]);
  }
  function draw(t) {
    if (t === last) return;
    last = t;
    const phi = lerp(-amp, amp, t), dx = lerp(-8, 10, t), dip = lerp(4, 16, Math.sin(Math.PI * t));
    body.setAttribute("d", poly(hull(ring(dx, 0, 0.55).concat(ring(dx, H, 1)))));
    rim.setAttribute("d", poly(ring(dx, H, 1)));
    inner.setAttribute("d", poly(ring(dx, H - 1, 0.8)));
    seat.setAttribute("d", poly([P(L / 2 + 10 + dx, -half(L / 2) * 0.8, H - 1), P(L / 2 + 22 + dx, -half(L / 2) * 0.8, H - 1), P(L / 2 + 22 + dx, half(L / 2) * 0.8, H - 1), P(L / 2 + 10 + dx, half(L / 2) * 0.8, H - 1)]));
    farOar.setAttribute("d", oar(-1, phi, dip, dx));
    nearOar.setAttribute("d", oar(1, phi, dip, dx));
  }
  const Bk = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(Bk.unregister);
  const x0 = P(0, 0, H)[0] - 40, x1 = P(L, 0, H)[0] + 40;
  function aim(t, label) { sp.t = t; read.textContent = label; Bk.wake(); }
  aim(REST, "rest");
  bag.add(pointer(stage, {
    move: ([sx]) => { const t = clamp((sx - x0) / (x1 - x0), 0, 1); aim(t, t < 0.5 ? "catch" : "drive"); },
    leave: () => aim(REST, "rest"),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = clamp(v, 10, 50); last = NaN; draw(sp.x); }, destroy: bag.dispose };
}

hairline({
  name: "rowboat",
  means: "A rowing boat: the pointer along it sets the stroke, and the oars sweep from catch to finish as the boat surges on.",
  rules: [1, 3, 5, 8],
  range: [10, 32, 50],
  tour: [[287, 180], [113, 117], [200, 150], null],
  mount,
});
