/**
 * Speedboat: a planing hull with a raked windscreen and a big outboard on
 * the transom. The pointer near the stern tilts the outboard up out of the
 * water, its leg swinging back; far away it rests trimmed down. The slider
 * is how far the motor tilts. At rest the cowling is bright.
 */
const {
  Cam, fit, hull, poly, proj, clamp, lerp, rad, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const L = 92, B = 34, H = 10, REST = 0.12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-40, -B / 2, 0], [L, B / 2, 0], [0, 0, H + 26], [-40, 0, H + 10], [0, 0, -30]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const half = (u) => (B / 2) * Math.pow(clamp((L - u) / (L * 0.55), 0, 1), 0.6);
  const ring = (z, k, dz) => { const a = []; for (let i = 0; i <= 24; i++) { const u = (i / 24) * L; a.push(P(u, half(u) * k, z + (dz ? dz * (u / L) : 0))); } for (let i = 24; i >= 0; i--) { const u = (i / 24) * L; a.push(P(u, -half(u) * k, z + (dz ? dz * (u / L) : 0))); } return a; };
  const leg = mk("path", { class: "sil" }, g), cowl = mk("path", { class: "sil hi" }, g), cowlCr = mk("path", { class: "nf lo" }, g);
  const body = mk("path", { class: "sil" }, g), rim = mk("path", { class: "nf" }, g), inner = mk("path", { class: "nf lo" }, g);
  const deck = mk("path", { class: "lo" }, g), screen = mk("path", { class: "sil" }, g);
  body.setAttribute("d", poly(hull(ring(0, 0.45, 0).concat(ring(H, 1, 4)))));
  rim.setAttribute("d", poly(ring(H, 1, 4)));
  inner.setAttribute("d", poly(ring(H - 1, 0.78, 4)));
  const ws = L * 0.5, hw = half(ws) * 0.86, zw = H + 2;
  deck.setAttribute("d", poly([P(ws, -hw, zw), P(ws + 26, 0, zw + 1.5), P(ws, hw, zw)]));
  screen.setAttribute("d", poly([P(ws, -hw, zw), P(ws - 6, -hw * 0.8, zw + 9), P(ws - 6, hw * 0.8, zw + 9), P(ws, hw, zw)]));
  const box = (x0, x1, y, z0, z1, a) => {
    const pts = [];
    for (const x of [x0, x1]) for (const yy of [-y, y]) for (const z of [z0, z1]) {
      const c = Math.cos(a), s = Math.sin(a);
      pts.push(P(-2 + x * c + z * s, yy, H + 2 - x * s + z * c));
    }
    return hull(pts);
  };
  const sp = spring(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = rad(lerp(4, amp, t));
    leg.setAttribute("d", poly(box(-4, 3, 2.2, -34, 0, a)));
    cowl.setAttribute("d", poly(box(-14, 4, 7, 0, 18, a)));
    const c = box(-12.5, 2.5, 5.6, 16, 18, a);
    cowlCr.setAttribute("d", poly(c));
  }
  const Bk = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(Bk.unregister);
  const st = P(-6, 0, H + 10);
  function aim(t, label) { sp.t = t; read.textContent = label; Bk.wake(); }
  aim(REST, "rest");
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const t = clamp(1.25 - Math.hypot(sx - st[0], sy - st[1]) / 180, 0, 1); aim(t, t > 0.6 ? "tilt up" : "trim"); },
    leave: () => aim(REST, "rest"),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = clamp(v, 30, 85); last = NaN; draw(sp.x); }, destroy: bag.dispose };
}

hairline({
  name: "speedboat",
  means: "A speedboat: the pointer near the stern tilts the big outboard up out of the water, its leg swinging back behind the transom.",
  rules: [1, 3, 5, 8],
  range: [30, 70, 85],
  tour: [[157, 97], [250, 190], [170, 112], null],
  mount,
});
