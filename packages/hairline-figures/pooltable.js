/**
 * Pool table: a felt table on four legs, a rack of balls at the far end, the
 * cue ball on the spot and the cue resting behind it. The cue turns about
 * the cue ball to line up on the pointer, on a spring, so the shot always
 * points where the hand is. At rest it lines up on the rack, bright.
 * The slider is the cue's draw-back from the ball.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, clamp, fit, facing, open, poly, prism, proj, rings, rrect, ringAt, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 120, D = 64, TZ = 26, BX = 32, BY = 32, CL = 52, BR = 2.6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gap = value;
  const C = Cam(45, 0.5, 1.9);
  const reach = [];
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; reach.push([BX + 40 * Math.cos(a), BY + 40 * Math.sin(a), TZ + 3]); }
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, TZ], [0, D, TZ], ...reach], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const [x, y] of [[6, 6], [W - 12, 6], [6, D - 12], [W - 12, D - 12]]) {
    const [r, i] = rings(x, y, x + 6, y + 6, 2, 1);
    put(solid(g), prism(P, front, r, i, 0, 14));
  }
  const [ring, inner] = rings(0, 0, W, D, 6, 2);
  put(solid(g), prism(P, front, ring, inner, 14, TZ));
  mk("path", { d: poly(ringAt(P, rrect(7, 7, W - 7, D - 7, 3, 4), TZ)), class: "nf lo" }, g);
  for (const [x, y] of [[5, 5], [W / 2, 4], [W - 5, 5], [5, D - 5], [W / 2, D - 4], [W - 5, D - 5]]) {
    const p = P(x, y, TZ);
    mk("ellipse", { cx: p[0], cy: p[1], rx: 3.4, ry: 1.9, class: "lo" }, g);
  }
  // the rack: a triangle of balls, apex toward the cue ball, painted far to near
  const rack = [];
  for (let c = 0; c < 4; c++) for (let r = 0; r <= c; r++) rack.push([88 + c * 4.6, BY + (r - c / 2) * 5.4]);
  rack.sort((a, b) => a[0] + a[1] - b[0] - b[1]);
  const R = BR * C.S;
  for (const [x, y] of rack) { const p = P(x, y, TZ + BR); mk("ellipse", { cx: p[0], cy: p[1], rx: R, ry: R }, g); }
  const cb = P(BX, BY, TZ + BR);
  const cueBall = mk("ellipse", { cx: cb[0], cy: cb[1], rx: R, ry: R }, g);
  const cue = mk("path", { class: "sil hi" }, g), tip = mk("path", { class: "nf lo" }, g);
  const ang = spring(0);
  let last = NaN, lastGap = NaN;
  function draw(a) {
    if (a === last && gap === lastGap) return;
    last = a; lastGap = gap;
    const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
    const at = (d, w, z) => P(BX - ux * d + nx * w, BY - uy * d + ny * w, z);
    const d0 = BR + 2 + gap, d1 = d0 + CL;
    cue.setAttribute("d", poly([at(d0, -0.7, TZ + BR), at(d0, 0.7, TZ + BR), at(d1, 1.6, TZ + BR + 7), at(d1, -1.6, TZ + BR + 7)]));
    tip.setAttribute("d", open([at(d0 + 3, -0.9, TZ + BR + 0.4), at(d0 + 3, 0.9, TZ + BR + 0.4)]));
    // keep the cue behind the ball when it reaches away from the viewer
    if (ux + uy > 0) cue.after(cueBall), tip.after(cueBall); else cueBall.after(tip);
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let on = false;
  function aim([sx, sy]) {
    on = true;
    const [wx, wy] = unproj(C, sx, sy, TZ);
    const dx = wx - BX, dy = wy - BY;
    if (Math.hypot(dx, dy) < 6) return;
    let t = Math.atan2(dy, dx);
    while (t - ang.t > Math.PI) t -= 2 * Math.PI;
    while (t - ang.t < -Math.PI) t += 2 * Math.PI;
    ang.t = t;
    let deg = Math.round((t * 180) / Math.PI) % 360;
    if (deg < 0) deg += 360;
    read.textContent = "aim " + deg + "°";
    B.wake();
  }
  function leave() { on = false; ang.t = Math.round(ang.t / (2 * Math.PI)) * 2 * Math.PI; read.textContent = "rest"; B.wake(); }
  draw(0);
  leave();
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gap = clamp(v, 0, 12); draw(ang.x); }, destroy: bag.dispose };
}

hairline({
  name: "pooltable",
  means: "A pool table with a racked set of balls: the cue turns about the cue ball to line up its shot on the pointer.",
  rules: [1, 3, 5, 8],
  range: [0, 4, 12],
  tour: [[200, 120], [120, 200], [290, 210], null],
  mount,
});
