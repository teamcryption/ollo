/**
 * Pastry brush: a wide flat brush held over a pie, its handle end resting
 * at the near side. The brush swings on its handle end to follow the
 * pointer across the crust, glazing it. At rest it lies a little to one
 * side, bright. The slider is how far it can swing.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, unproj, ringAt, fillet, clamp, rad, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const QX = -34, QY = 34, CX = 54, CY = 34, PR = 34, BZ = 18, REST = -14;
const disc = (x, y, r, n = 44) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[QX - 8, QY - 50, 0], [CX + PR + 4, CY + PR + 4, 0], [CX + PR, CY - PR - 6, 0], [QX, QY + 50, 0], [CX, CY, BZ + 8]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the pie: a crust with a crimped rim and three vents
  put(solid(g), prism(P, front, disc(CX, CY, PR), disc(CX, CY, PR - 2), 0, 8));
  const crimp = disc(CX, CY, PR - 4, 60).map((q, i) => ({ ...q, u: CX + (q.u - CX) * (i % 2 ? 0.94 : 1), v: CY + (q.v - CY) * (i % 2 ? 0.94 : 1) }));
  mk("path", { d: poly(ringAt(P, crimp, 8)), class: "nf lo" }, g);
  for (const a of [0, 120, 240]) {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const p0 = P(CX + 6 * c, CY + 6 * s, 8), p1 = P(CX + 14 * c, CY + 14 * s, 8);
    mk("path", { d: "M" + p0.join(",") + "L" + p1.join(","), class: "nf lo" }, g);
  }
  const bg = mk("g", {}, g);
  const handle = mk("path", { class: "sil hi" }, bg), ferr = mk("path", { class: "sil hi" }, bg), brist = mk("path", { class: "sil hi" }, bg), tip = mk("path", { class: "nf lo" }, bg);
  const sp = spring(REST);
  let last = NaN;
  function bar(u0, u1, v0, v1, z0, z1, f) {
    const c = Math.cos(rad(f)), s = Math.sin(rad(f)), pts = [];
    for (const [u, v] of [[u0, v0[0]], [u0, -v0[0]], [u1, v1], [u1, -v1]]) for (const z of [z0, z1]) pts.push(P(QX + u * c - v * s, QY + u * s + v * c, z));
    const h = hull(pts); return poly(fillet(h, h.map(() => 1.6), 3));
  }
  function draw(f) {
    if (f === last) return; last = f;
    handle.setAttribute("d", bar(0, 60, [3.2], 2.6, BZ + 2, BZ + 6, f));
    ferr.setAttribute("d", bar(58, 70, [5], 8, BZ, BZ + 7, f));
    brist.setAttribute("d", bar(69, 96, [8], 10, BZ - 6, BZ + 5, f));
    const c = Math.cos(rad(f)), s = Math.sin(rad(f));
    tip.setAttribute("d", "M" + P(QX + 96 * c + 9 * s, QY + 96 * s - 9 * c, BZ - 6).join(",") + "L" + P(QX + 96 * c - 9 * s, QY + 96 * s + 9 * c, BZ - 6).join(","));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 8);
    if (wx < QX + 30 || Math.hypot(wx - CX, wy - CY) > PR + 30) { leave(); return; }
    const f = clamp(Math.atan2(wy - QY, wx - QX) * 180 / Math.PI, -reach, reach);
    sp.t = f;
    read.textContent = Math.round(f) + "°";
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  draw(sp.x);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "pastrybag",
  means: "A pastry brush over a pie: it swings on its handle end to follow the pointer across the crust, glazing it.",
  rules: [1, 3, 5, 6],
  range: [10, 26, 34],
  tour: [[227, 200], [300, 160], [252, 176], null],
  mount,
});
