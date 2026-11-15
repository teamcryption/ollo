/**
 * Steam iron: a pointed soleplate under a domed body and a looped handle,
 * standing on a pressing board. The iron turns on the board so its nose
 * points at the pointer; a spring follows the heading. At rest it sits at
 * an angle, its body bright. The slider is how hard the spring pulls.
 *
 * The pattern: one part turning to face the pointer (turn).
 */
const {
  Cam, clamp, fillet, fit, facing, hull, open, poly, prism, proj, rad, rings, ringAt, run, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 0, BY = 0, BW = 110, BD = 80, BZ = 5, CX = 55, CY = 40, REST = -150, K = 1.55;

// a closed outline with outward normals, rotated by a about the board's centre
function shape(pts, a) {
  const c = Math.cos(rad(a)), s = Math.sin(rad(a));
  const q = pts.map(([u, v]) => [CX + K * (u * c - v * s), CY + K * (u * s + v * c)]);
  let A = 0;
  q.forEach((p, i) => { const n = q[(i + 1) % q.length]; A += p[0] * n[1] - n[0] * p[1]; });
  const sg = A > 0 ? 1 : -1;
  return q.map((p, i) => {
    const a0 = q[(i + q.length - 1) % q.length], a1 = q[(i + 1) % q.length];
    const dx = a1[0] - a0[0], dy = a1[1] - a0[1], l = Math.hypot(dx, dy) || 1;
    return { u: p[0], v: p[1], nu: (sg * dy) / l, nv: (-sg * dx) / l };
  });
}
const foot = (k, sc) => fillet([[34 * sc, 0], [-20 * sc, 17 * sc], [-20 * sc, -17 * sc]].map(([u, v]) => [u - k, v]), [10 * sc, 6 * sc, 6 * sc], 6);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stiff = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[BX, BY, 0], [BW, BY, 0], [BW, BD, 0], [BX, BD, 0], [CX, CY, BZ + 34 * K]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(BX, BY, BW, BD, 10, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  // a dashed seam on the board's cover
  mk("path", { class: "dash nf", d: poly(ringAt(P, rings(BX + 8, BY + 8, BW - 8, BD - 8, 6, 1)[0], BZ)) }, g);
  const sole = solid(g), body = solid(g);
  const post = mk("path", {}, g), grip = mk("path", { class: "sil" }, g), dial = mk("path", { class: "nf lo" }, g);
  body.sil.classList.add("hi");
  const sp = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const s0 = shape(foot(0, 1), a), s1 = shape(foot(1.6, 0.9), a);
    put(sole, prism(P, front, s0, s1, BZ, BZ + 3 * K));
    const b0 = shape(foot(2, 0.86), a), b1 = shape(foot(3, 0.72), a);
    // the body tapers: its silhouette is the hull of the wide foot and the narrow top
    put(body, { sil: poly(hull(ringAt(P, b0, BZ + 3 * K).concat(ringAt(P, b1, BZ + 14 * K)))), crease: open(ringAt(P, run(shape(foot(4, 0.64), a), front), BZ + 14 * K)) });
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const W = (u, v, z) => P(CX + K * (u * c - v * s), CY + K * (u * s + v * c), BZ + K * (z - BZ));
    const hz0 = BZ + 14, hz1 = BZ + 28;
    post.setAttribute("d", poly(hull([W(-14, -2, hz0), W(-14, 2, hz0), W(-8, -2, hz0), W(-8, 2, hz0), W(-14, -2, hz1), W(-14, 2, hz1), W(-8, -2, hz1), W(-8, 2, hz1)])));
    grip.setAttribute("d", poly(hull([W(-16, -3, hz1), W(-16, 3, hz1), W(20, -3, hz0 + 4), W(20, 3, hz0 + 4), W(-16, -3, hz1 + 5), W(-16, 3, hz1 + 5), W(22, -3, hz0 + 8), W(22, 3, hz0 + 8)])));
    const d = [];
    for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; d.push(W(2 + 4 * Math.cos(t), 4 * Math.sin(t), BZ + 14)); }
    dial.setAttribute("d", poly(d));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt * clamp(stiff, 0.5, 2)); draw(sp.x); return m; });
  bag.add(B.unregister);

  function aim(t) { let d = t - sp.t; d -= 360 * Math.round(d / 360); sp.t += d; }
  function move(p) {
    const [x, y] = unproj(C, p[0], p[1], 0), dx = x - CX, dy = y - CY;
    if (Math.hypot(dx, dy) < 8) return;
    const h = (Math.atan2(dy, dx) * 180) / Math.PI;
    aim(h);
    read.textContent = ((Math.round(h) + 360) % 360) + "°";
    B.wake();
  }
  function leave() { aim(REST); read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  draw(REST);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stiff = v; }, destroy: bag.dispose };
}

hairline({
  name: "ironing2",
  means: "A steam iron on a pressing board: it turns on its soleplate so the pointed nose follows the pointer around the board.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 2],
  tour: [[278, 227], [136, 220], [122, 149], null],
  mount,
});
