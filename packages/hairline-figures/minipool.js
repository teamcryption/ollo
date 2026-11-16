/**
 * Mini pool: a small table with a fat cushion, six pockets, a racked
 * triangle of balls and the cue ball, with a tapered cue lying behind it.
 * The cue swings on a spring round the cue ball so that it aims away from
 * the pointer, as if the pointer were where the shot goes. At rest it lines
 * up on the rack, bright. The slider is how quickly it follows.
 */
const {
  Cam, circ, facing, fit, hull, poly, prism, proj, rings, ringAt, rrect, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const TW = 60, TD = 34, TZ = 12, BR = 2.8, CX = -22, L0 = 4, L1 = 62, REST = Math.PI;
const disc = (x, y, r, n = 12) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.95);
  const ext = [[-TW, -TD, 0], [TW, TD, 0], [TW, -TD, 0], [-TW, TD, 0], [-TW, -TD, TZ], [TW, -TD, TZ]];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([CX + L1 * Math.cos(a), clamp2(L1 * Math.sin(a)), TZ + 8]); }
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-TW, -TD, TW, TD, 7, 2.2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));
  mk("path", { class: "lo nf", d: poly(ringAt(P, rrect(-TW + 7, -TD + 7, TW - 7, TD - 7, 3, 4), TZ)) }, g);
  for (const [x, y] of [[-TW + 6, -TD + 6], [0, -TD + 5], [TW - 6, -TD + 6], [-TW + 6, TD - 6], [0, TD - 5], [TW - 6, TD - 6]]) place(flatDot(g, C, 1.8, "dot off"), P(x, y, TZ));
  const R = Math.abs(P(BR / Math.SQRT2, -BR / Math.SQRT2, 0)[0] - P(0, 0, 0)[0]);
  const balls = [[CX, 0]];
  for (let r = 0; r < 4; r++) for (let j = 0; j <= r; j++) balls.push([22 + r * 4.9, (j - r / 2) * 5.7]);
  balls.sort((p, q) => p[0] + p[1] - (q[0] + q[1]));
  for (const [x, y] of balls) { const [sx, sy] = P(x, y, TZ + BR); mk("ellipse", { cx: sx.toFixed(2), cy: sy.toFixed(2), rx: R.toFixed(2), ry: R.toFixed(2) }, g); }
  const cue = mk("path", { class: "sil hi" }, g);
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const c = Math.cos(a), s = Math.sin(a), zt = TZ + BR, zb = TZ + BR + 6;
    const tx = CX + L0 * c, ty = L0 * s, bx = CX + L1 * c, by = L1 * s;
    const pts = [...ringAt(P, disc(tx, ty, 1.5), zt - 1.5), ...ringAt(P, disc(tx, ty, 1.5), zt + 1.5), ...ringAt(P, disc(bx, by, 3.4), zb - 3.4), ...ringAt(P, disc(bx, by, 3.4), zb + 3.4)];
    cue.setAttribute("d", poly(hull(pts)));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(p) {
    let d = 0;
    if (p && Math.hypot(p[0] - CX, p[1]) > 4) {
      const to = Math.atan2(p[1], p[0] - CX);
      sp.t = sp.t + wrap(to + Math.PI - sp.t);
      d = Math.round((to * 180) / Math.PI + 360) % 360;
      read.textContent = "aim " + d;
    } else if (!p) { sp.t = sp.t + wrap(REST - sp.t); read.textContent = "rest"; }
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, TZ); aim(Math.abs(x) < TW + 30 && Math.abs(y) < TD + 30 ? [x, y] : null); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}
function clamp2(v) { return Math.max(-TD - 20, Math.min(TD + 20, v)); }

hairline({
  name: "minipool",
  means: "A mini pool table: the cue swings round the cue ball to aim away from the pointer, as if lining up a shot at it.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[227, 123], [150, 190], [270, 205], null],
  mount,
});
