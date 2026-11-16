/**
 * Herb mill: a rolling herb mill on a chopping board, a row of round blades
 * on one axle under a bow handle, with chopped herbs scattered on the board.
 * The pointer is where the mill goes: it rolls along the board on a spring,
 * the spoke on every blade turning as it rolls. At rest it stands off centre,
 * its handle bright. The slider is how quickly it follows.
 *
 * The pattern: a continuous slide (terrain's spring); the hit is on the
 * board's plane, which never moves.
 */
const {
  Cam, fit, hull, poly, prism, proj, rings, seg, unproj, spring, stepS, clamp,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const L = 150, BW = 56, BH = 4, R = 13, NB = 5, Y0 = 12, GAP = 8, REST = 52, HZ = 34;
const SPOTS = [[18, 10], [34, 44], [70, 14], [96, 40], [118, 20], [132, 46], [24, 30], [84, 26]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [L, BW, 0], [L, 0, 0], [0, BW, 0], [R + 4, 0, BH + R + HZ], [L - R, BW, BH + R + HZ]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, L, BW, 5, 2);
  put(solid(g), prism(P, HL.facing(C), br, bi, 0, BH));
  for (const [x, y] of SPOTS) place(flatDot(g, C, 1.2, "dot off"), P(x, y, BH));
  const mill = mk("g", {}, g);
  const armFar = mk("path", { class: "nf sil" }, mill);
  const blades = [];
  for (let i = 0; i < NB; i++) blades.push({ y: Y0 + 4 + i * GAP, disc: mk("path", {}, mill), spoke: mk("path", { class: "nf lo" }, mill) });
  const armNear = mk("path", { class: "nf sil" }, mill);
  const grip = mk("path", { class: "sil hi" }, mill);
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, over = false;
  const yA = Y0, yB = Y0 + 8 + (NB - 1) * GAP, cz = BH + R;

  function draw() {
    const x = sp.x;
    if (Math.abs(x - drawn) < 1e-3) return;
    drawn = x;
    const phi = -x / R;
    for (const b of blades) {
      const pts = [];
      for (let t = 0; t < 32; t++) { const a = (t / 32) * Math.PI * 2; pts.push(P(x + R * Math.cos(a), b.y, cz + R * Math.sin(a))); }
      b.disc.setAttribute("d", poly(pts));
      b.spoke.setAttribute("d", seg(P(x - (R - 3) * Math.cos(phi), b.y, cz - (R - 3) * Math.sin(phi)), P(x + (R - 3) * Math.cos(phi), b.y, cz + (R - 3) * Math.sin(phi))));
    }
    const top = cz + HZ, tx = x - 4;
    armFar.setAttribute("d", seg(P(x, yA, cz), P(tx, yA, top)));
    armNear.setAttribute("d", seg(P(x, yB, cz), P(tx, yB, top)));
    const gp = [];
    for (const y of [yA - 4, yB + 4]) for (let t = 0; t < 16; t++) { const a = (t / 16) * Math.PI * 2; gp.push(P(tx + 3 * Math.cos(a), y, top + 3 * Math.sin(a))); }
    grip.setAttribute("d", poly(hull(gp)));
    read.textContent = over ? "x " + Math.round(x) : "rest";
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], BH);
      over = y > -30 && y < BW + 30;
      sp.t = over ? clamp(x, R + 2, L - R - 2) : REST; drawn = NaN;
      B.wake();
    },
    leave: () => { over = false; drawn = NaN; sp.t = REST; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "herbmill",
  means: "A rolling herb mill on a chopping board: it rolls along the board to wherever the pointer is.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[262, 218], [200, 175], [150, 140], null],
  mount,
});
