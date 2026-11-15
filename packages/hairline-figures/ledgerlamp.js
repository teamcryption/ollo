/**
 * Banker lamp: a desk with a footed brass stem and a long half-round shade.
 * The pointer on the desk tilts the shade toward it, and the dashed pool of
 * light slides across the desk to meet it. At rest the shade tips a little
 * forward, bright.
 *
 * The pattern: one part following the pointer (spring).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, rrect, ringAt, clamp, rad, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 150, D = 110, DZ = 8, LX = 75, LY = 34, PZ = 66, L = 84, R = 15, REST = -16, MAXT = 80;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.78);
  fit(C, [[-4, -4, 0], [W + 4, D + 4, 0], [W + 4, -4, 0], [-4, D + 4, 0], [LX - L / 2, LY - R, PZ + R + 2], [LX + L / 2, LY - R, PZ + R + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-4, -4, W + 4, D + 4, 6, 2);
  put(solid(g), prism(P, front, dr, di, 0, DZ));
  const pool = mk("path", { class: "nf dash" }, g);
  // foot, stem, and the arm that holds the shade
  const foot = rrect(LX - 22, LY - 12, LX + 22, LY + 12, 11, 8), footIn = rrect(LX - 20, LY - 10, LX + 20, LY + 10, 9, 8);
  put(solid(g), prism(P, front, foot, footIn, DZ, DZ + 5));
  const [sr, si] = rings(LX - 2, LY - 2, LX + 2, LY + 2, 2, 0.6);
  put(solid(g), prism(P, front, sr, si, DZ + 5, PZ - 4));
  const [ar, ai] = rings(LX - 14, LY - 1.5, LX + 14, LY + 1.5, 1.5, 0.5);
  put(solid(g), prism(P, front, ar, ai, PZ - 6, PZ - 3));

  const sh = solid(g), rim = mk("path", { class: "nf lo" }, g), chain = mk("path", { class: "nf lo" }, g), bead = mk("circle", { r: 2, class: "dot m" }, g);
  const tilt = spring(REST);
  const W3 = (x, y, z, a) => P(x, LY + y * Math.cos(a) - z * Math.sin(a), PZ + y * Math.sin(a) + z * Math.cos(a));
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), pts = [], near = [];
    for (let i = 0; i <= 16; i++) {
      const t = (i / 16) * Math.PI, y = R * Math.cos(t), z = R * Math.sin(t);
      pts.push(W3(LX - L / 2, y, z, a), W3(LX + L / 2, y, z, a));
      near.push(W3(LX + L / 2, y, z, a));
    }
    put(sh, { sil: poly(hull(pts)), crease: open([W3(LX - L / 2 + 2, R, 0, a), W3(LX + L / 2 - 2, R, 0, a)]) });
    rim.setAttribute("d", open(near));
    const tip = W3(LX + L / 2 - 8, R, 0, a), lo = [tip[0], tip[1] + 16];
    chain.setAttribute("d", open([tip, lo]));
    bead.setAttribute("cx", lo[0]); bead.setAttribute("cy", lo[1] + 2);
    const py = clamp(LY + 4 + 72 * Math.sin(a), 12, D - 14);
    pool.setAttribute("d", poly(ringAt(P, rrect(LX - 46, py - 13, LX + 46, py + 13, 13, 8), DZ)));
  }
  draw(REST);
  sh.sil.classList.add("hi");

  const B = register(stage, (dt) => { const m = stepS(tilt, dt); draw(tilt.x); return m; });
  bag.add(B.unregister);

  function leave() { tilt.t = REST; read.textContent = "rest"; B.wake(); }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, DZ);
    if (x < -10 || x > W + 10 || y < -10 || y > D + 20) return leave();
    const t = clamp((y - LY) / (D - LY), 0, 1);
    tilt.t = clamp(10 + (MAXT - 10) * t * (reach / 100), 0, MAXT);
    read.textContent = Math.round(tilt.t) + "°";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "ledgerlamp",
  means: "A banker lamp on a desk: its long shade tilts toward the pointer and the pool of light slides across the desk to it.",
  rules: [1, 3, 5, 8],
  range: [40, 100, 100],
  tour: [[162, 140], [138, 234], [250, 259], null],
  mount,
});
