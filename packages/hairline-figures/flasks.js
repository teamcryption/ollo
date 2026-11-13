/**
 * Flasks: six lab flasks in a row on a bench, conical, round-bottom on a cork
 * ring and volumetric with a mark on its long neck, each holding liquid. The
 * pointer is a field along the row: liquid rises in the flasks near it, each
 * level on its own spring, and the flask under it fills and is bright, with
 * bubbles over its liquid. At rest the levels are uneven and one flask is
 * bright. The slider is the field's reach.
 *
 * The pattern: one of many in a single row (bookshelf's pick by screen x) and
 * a field with a floor (terrain), on springs.
 */
const {
  Cam, circ, clamp, fit, hull, lerp, open, poly, prism, proj, rings, spring, stepS,
  disposer, mk, place, pointer, put, register, solid,
} = HL;

// kind, body radius, neck radius, neck height, rest level (0 to 1), size
const F = [["cone", 12, 3.2, 10, 0.45], ["round", 10, 2.8, 14, 0.3], ["vol", 9, 2, 24, 0.6], ["cone", 9, 2.6, 8, 0.25], ["round", 8, 2.4, 11, 0.55], ["vol", 11, 2.4, 26, 0.35]];
const GAP = 26, FAV = 2, X0 = 12;
const D = Math.PI / 180;

/** A flask's profile: z0 (bottom of glass), zs (shoulder: where the neck starts), zt (rim), r(z). */
function profile([kind, R, rn, nh]) {
  if (kind === "cone") { const H = R * 2.1; return { z0: 0, zs: H, zt: H + nh, r: (z) => (z < H ? lerp(R, rn, z / H) : rn) }; }
  const zc = kind === "round" ? 2 + R * 0.92 : R * 0.72, z0 = kind === "round" ? zc - R : 0, zs = zc + Math.sqrt(R * R - rn * rn);
  return { z0, zs, zt: zs + nh, zc, r: (z) => (z < zs ? Math.sqrt(Math.max(0, R * R - (z - zc) ** 2)) : rn) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const X1 = X0 * 2 + GAP * (F.length - 1);
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, -14, -5], [X1, 14, -5], [X1, -14, -5], [0, 14, -5], [X0, 0, 48], [X1 - X0, 0, 52]], 200, 170);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, -16, X1, 16, 3, 1.4);
  put(solid(g), prism(P, (q) => q.nu + q.nv > 0, br, bi, -5, 0));

  const ring = (cx, r, z, a0, a1, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const a = lerp(a0, a1, i / n) * D; return P(cx + r * Math.cos(a), r * Math.sin(a), z); });
  const flasks = F.map((f, k) => {
    const cx = X0 + k * GAP, pr = profile(f), [kind, R, rn] = f, fg = mk("g", {}, g);
    if (kind === "round") put(solid(fg), prism(P, (q) => q.nu + q.nv > 0, ...[R * 0.55, R * 0.55 - 1].map((r) => circ(r, 32).map((q) => ({ ...q, u: q.u + cx }))), 0, 2.4));
    // the body is convex: the hull of its rings; then the liquid, then the neck over it, filled, its sides and rim stroked
    const pts = [];
    for (let z = pr.z0; z <= pr.zs + 0.01; z += (pr.zs - pr.z0) / 20) pts.push(...ring(cx, pr.r(z), z, 0, 360, 32));
    const body = mk("path", { class: "sil", d: poly(hull(pts)) }, fg);
    const liq = mk("path", { class: "nf lo" }, fg);
    mk("path", { class: "fo", d: poly(hull(ring(cx, rn, pr.zs - 0.3, 0, 360).concat(ring(cx, rn, pr.zt, 0, 360)))) }, fg);
    const neck = mk("path", { class: "nf sil", d: open([ring(cx, rn, pr.zs, 135, 135, 1)[0], ...ring(cx, rn, pr.zt, 135, 315)].concat([ring(cx, rn, pr.zs, 315, 315, 1)[0]])) }, fg);
    mk("path", { class: "nf lo", d: open(ring(cx, rn, pr.zt, -45, 135)) + open(ring(cx, rn + 0.1, pr.zs, -45, 135)) + (kind === "vol" ? open(ring(cx, rn, lerp(pr.zs, pr.zt, 0.55), -45, 135)) : "") }, fg);
    const liqN = mk("path", { class: "nf lo" }, fg);
    const full = kind === "vol" ? lerp(pr.zs, pr.zt, 0.55) : lerp(pr.zs, pr.zt, 0.4), lo = pr.z0 + (pr.zs - pr.z0) * 0.12;
    return { k, cx, pr, rn, body, neck, liq, liqN, full, lo, rest: f[4], sp: spring(f[4]), drawn: NaN, mid: P(cx, 0, pr.zt / 2) };
  });
  const bubbles = [0, 1, 2].map(() => mk("circle", { r: 1.1, class: "dot" }, g));

  function draw(f) {
    const lv = f.sp.x;
    if (Math.abs(lv - f.drawn) < 1e-3) return;
    f.drawn = lv;
    // the liquid: the body's shape inset below the level, its surface, and up the neck once it is past the shoulder
    const pr = f.pr, z = lerp(f.lo, f.full, clamp(lv, 0, 1)), inNeck = z > pr.zs, top = Math.min(z, pr.zs), pts = [];
    for (let i = 0; i <= 12; i++) { const zz = lerp(pr.z0 + 1.6, top, i / 12); pts.push(...ring(f.cx, Math.max(0.3, pr.r(zz) - 1.8), zz, 0, 360, 32)); }
    const rs = inNeck ? f.rn - 0.9 : Math.max(0.3, pr.r(z) - 1.8), surf = poly(ring(f.cx, rs, z, 0, 360, 40));
    f.liq.setAttribute("d", poly(hull(pts)) + (inNeck ? "" : surf));
    f.liqN.setAttribute("d", inNeck ? surf : "");
  }
  let bright = FAV;
  function placeBubbles() {
    const f = flasks[bright], z = lerp(f.lo, f.full, clamp(f.sp.t, 0, 1)), top = f.sp.t >= 0.99 ? f.pr.zt : Math.max(z, f.pr.zs);
    bubbles.forEach((b, j) => place(b, P(f.cx + [-0.8, 0.9, -0.2][j], 0, top + 3 + j * 3.6)));
  }

  const B = register(stage, (dt) => { let m = false; for (const f of flasks) { if (stepS(f.sp, dt)) m = true; draw(f); } return m; });
  bag.add(B.unregister);

  /** The flask whose resting middle is nearest the pointer's x on screen; the field reads the same distance. */
  const step = Math.abs(flasks[1].mid[0] - flasks[0].mid[0]);
  function aim(p) {
    let best = -1, bd = Infinity;
    flasks.forEach((f) => { const d = Math.abs(f.mid[0] - p[0]); if (d < bd) { bd = d; best = f.k; } });
    const on = bd < 26 && Math.abs(flasks[best].mid[1] - p[1]) < 80;
    flasks.forEach((f) => {
      const t = on ? Math.abs(f.mid[0] - p[0]) / (step * reach) : Infinity;
      const pull = f.k === best ? 1 : Math.max(0.1, Math.exp(-(t * t) / 3.5));
      f.sp.t = on ? Math.max(f.rest, pull) : f.rest;
    });
    bright = on ? best : FAV;
    for (const f of flasks) {
      for (const el of [f.body, f.neck, f.liq, f.liqN]) el.classList.toggle("hi", f.k === bright);
      for (const el of [f.liq, f.liqN]) el.classList.toggle("lo", f.k !== bright);
    }
    placeBubbles();
    read.textContent = on ? "flask " + (best + 1) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, { move: aim, leave: () => aim([-999, -999]) }));
  bag.add(() => svg.replaceChildren());
  aim([-999, -999]);
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "flasks",
  means: "Six lab flasks on a bench: liquid rises in the flasks near the pointer, and the one under it fills and bubbles.",
  rules: [1, 2, 3, 5, 8],
  range: [0.6, 1, 1.6],
  tour: [[144, 135], [219, 173], [295, 210], null],
  mount,
});
