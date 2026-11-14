/**
 * Flip board: a departures board hung on two rods, three rows of four
 * split-flap cells, each cell a recess with a hinge across its middle and one
 * flap that turns over it, top half to bottom half. The pointer picks a cell:
 * its row turns its flaps over, the rest close up, staggered out from the
 * cell. At rest the board is mid-change, one flap standing out flat, bright.
 *
 * The pattern: a field of parts (pianokeys); the hit is each cell's rest
 * centre on the fixed board face, nearest in screen space.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const M = 4, R = 3, CW = 12, CG = 2.5, RH = 11, RG = 3, MX = 4, MZ = 4;
const BW = MX * 2 + M * CW + (M - 1) * CG, BH = MZ * 2 + R * RH + (R - 1) * RG, Z0 = 10, HY = 1.3, T = 0.8;
const REST = [0, 180, 0, 0, 180, 92, 0, 180, 0, 0, 180, 0], FAV = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.25);
  fit(C, [[0, -4, Z0], [BW, -4, Z0], [0, 7, Z0], [BW, 7, Z0], [0, -4, Z0 + BH + 12], [BW, -4, Z0 + BH + 12]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // two hanging rods, then the board, then the cell recesses on its face
  [8, BW - 8].forEach((x) => {
    const [r, i] = rings(x - 1, -3, x + 1, -1, 1, 0.4);
    put(solid(g), prism(P, front, r, i, Z0 + BH, Z0 + BH + 12));
  });
  const [br, bi] = rings(0, -4, BW, 0, 1.6, 0.7);
  const board = solid(g);
  put(board, prism(P, front, br, bi, Z0, Z0 + BH));
  const cells = [];
  let recess = "";
  for (let r = 0; r < R; r++) for (let c = 0; c < M; c++) {
    const x0 = MX + c * (CW + CG), zb = Z0 + MZ + r * (RH + RG), zc = zb + RH / 2;
    const out = fillet([[x0, zb], [x0 + CW, zb], [x0 + CW, zb + RH], [x0, zb + RH]], [1.2, 1.2, 1.2, 1.2], 3);
    recess += poly(out.map(([x, z]) => P(x, 0, z))) + seg(P(x0 + 0.6, 0, zc), P(x0 + CW - 0.6, 0, zc));
    cells.push({ i: r * M + c, r, c, x0, zc });
  }
  mk("path", { class: "nf lo", d: recess }, board.g);
  // flaps paint bottom row first, so a flap turned out toward us covers the row below it
  cells.forEach((s) => {
    const grp = mk("g", {}, g);
    Object.assign(s, { sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), a: tween(REST[s.i]), last: NaN });
  });
  function flap(x, zc, a) {
    const dy = Math.sin(rad(a)), dz = Math.cos(rad(a)), L = RH / 2 - 0.4;
    const pts = [[0, 0], [L, 0], [L, T], [0, T]].map(([u, v]) => [HY + u * dy + v * dz, zc + u * dz - v * dy]);
    return fillet(pts, [0.3, 0.8, 0.8, 0.3], 3).map(([y, z]) => [x, y, z]);
  }
  function draw(s, a) {
    if (a === s.last) return;
    s.last = a;
    const near = flap(s.x0 + CW - 0.5, s.zc, a), far = flap(s.x0 + 0.5, s.zc, a);
    s.sil.setAttribute("d", poly(hull(near.concat(far).map((p) => P(...p)))));
    s.cr.setAttribute("d", open(far.map((p) => P(...p))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    cells.forEach((s) => { draw(s, tval(s.a, now)); if (!tdone(s.a, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the nearest cell by its rest centre on the board face, which never moves
  const ctr = cells.map((s) => P(s.x0 + CW / 2, 0, s.zc));
  const lim = Math.hypot(ctr[1][0] - ctr[0][0], ctr[1][1] - ctr[0][1]) * 0.9;
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    ctr.forEach(([cx, cy], k) => { const d = Math.hypot(cx - sx, cy - sy); if (d < bd) { bd = d; best = k; } });
    return bd < lim ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? cells[a] : act >= 0 ? cells[act] : null;
    act = a;
    cells.forEach((s) => {
      const to = a < 0 ? REST[s.i] : s.r === cells[a].r ? 180 : 0;
      tset(s.a, to, now, from ? (Math.abs(s.c - from.c) + Math.abs(s.r - from.r)) * stag : 0);
      s.sil.classList.toggle("hi", s.i === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "row " + (cells[a].r + 1) + "·" + (cells[a].c + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = clamp(v, 0, 90); }, destroy: bag.dispose };
}

hairline({
  name: "departures",
  means: "A split-flap departures board: the row under the pointer turns its flaps over, the rest close, rippling out from the cell.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[153, 132], [202, 193], [250, 254], null],
  mount,
});
