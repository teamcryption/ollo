/**
 * Greenhouse: a small glass house on a plinth, pitched roof, glazing bars on
 * every face and seed trays inside, four vents in the near roof slope hinged
 * at the ridge. The pointer is where the air should go: the vents near it
 * open, each on its own spring, the one under it widest and bright. At rest
 * the vents stand a little ajar, unevenly, one bright. The slider is the
 * reach, in vent widths.
 *
 * The pattern: a continuous field (terrain) along one row; the hit is on the
 * plane of the near roof slope at rest, which never moves.
 */
const {
  Cam, clamp, fillet, fit, facing, poly, prism, proj, rad, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 120, WD = 60, H = 36, R = 22, Z0 = 6, VW = 18, VT = 4, VL = 26, OPEN = 50;
const VX = [18, 46, 74, 102], REST = [8, 0, 24, 4], FAV = 2;
const TH = Math.atan2(R, WD / 2);
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.62 : u <= 1 ? 0.38 - ((u - 0.45) / 0.55) * 0.38 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value * 28, over = null;
  const C = Cam(45, 0.5, 2.0);
  const ridge = (x, t, a) => [x, WD / 2 + t * Math.cos(TH - rad(a)), H + R - t * Math.sin(TH - rad(a))];
  fit(C, [[-3, -3, 0], [L + 3, WD + 3, 0], [L + 3, -3, 0], [-3, WD + 3, 0], [0, WD / 2, H + R], [L, WD / 2, H + R], ridge(VX[0], VL, OPEN), ridge(VX[3], VL, OPEN)], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const S = (a, b) => seg(P(...a), P(...b));
  const block = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const el = solid(g); put(el, prism(P, front, o, i, z0, z1)); return el; };

  block(-3, -3, L + 3, WD + 3, 3, 1.2, 0, Z0);
  // the far glass: back wall, far gable, far roof slope and their bars
  let far = S([0, 0, Z0], [0, 0, H]) + S([0, 0, H], [L, 0, H]) + S([0, 0, H], [0, WD / 2, H + R]) + S([0, WD / 2, H + R], [0, WD, H]) + S([0, WD / 2, Z0], [0, WD / 2, H + R]);
  for (let x = 20; x < L; x += 20) far += S([x, 0, Z0], [x, 0, H]) + S([x, 0, H], [x, WD / 2, H + R]);
  mk("path", { class: "nf lo", d: far }, g);
  // seed trays on the floor, each with its cells
  [[8, 18], [36, 24], [64, 16], [92, 22]].forEach(([x, y]) => {
    const el = block(x, y, x + 22, y + 16, 1.5, 0.6, Z0, Z0 + 4);
    let cells = "";
    for (const u of [5.5, 11, 16.5]) cells += S([x + u, y + 1, Z0 + 4], [x + u, y + 15, Z0 + 4]);
    cells += S([x + 1, y + 8, Z0 + 4], [x + 21, y + 8, Z0 + 4]);
    mk("path", { class: "nf lo", d: cells }, el.g);
  });
  // the near glass: front wall, near gable, near slope's bars between the vents and the openings' frames
  let near = S([L, 0, Z0], [L, WD / 2, Z0]) + S([L, WD / 2, Z0], [L, WD / 2, H + R]);
  for (let x = 20; x < L; x += 20) near += S([x, WD, Z0], [x, WD, H]);
  for (const x of [32, 60, 88]) near += S([x, WD / 2, H + R], [x, WD, H]);
  for (const vx of VX) near += poly([ridge(vx - VW / 2, VT, 0), ridge(vx + VW / 2, VT, 0), ridge(vx + VW / 2, VL, 0), ridge(vx - VW / 2, VL, 0)].map((q) => P(...q)));
  mk("path", { class: "nf lo", d: near }, g);
  const frame = [[0, 0, H], [0, WD / 2, H + R], [L, WD / 2, H + R], [L, 0, H], [L, 0, Z0], [L, WD, Z0], [L, WD, H], [0, WD, H], [0, WD, Z0], [L, WD, Z0]];
  mk("path", { class: "nf sil", d: S([0, WD, Z0], [0, WD, H]) + S([0, WD, H], [0, WD / 2, H + R]) + S([L, WD, H], [L, WD / 2, H + R]) + S([L, 0, H], [L, WD, H]) + frame.slice(0, 6).reduce((d, q, i, a) => (i ? d + seg(P(...a[i - 1]), P(...q)) : d), "") + S([0, WD, H], [L, WD, H]) + S([0, WD, Z0], [L, WD, Z0]) }, g);

  const vents = VX.map((x, k) => {
    const grp = mk("g", {}, g);
    return { k, x, stay: mk("path", { class: "nf lo" }, grp), pane: mk("path", { class: "nf sil" }, grp), sp: spring(REST[k], { eps: 0.05 }), drawn: NaN };
  });
  function draw(v) {
    const a = clamp(v.sp.x, 0, OPEN);
    if (a === v.drawn) return;
    v.drawn = a;
    const pts = [ridge(v.x - VW / 2, VT, a), ridge(v.x + VW / 2, VT, a), ridge(v.x + VW / 2, VL, a), ridge(v.x - VW / 2, VL, a)].map((q) => P(...q));
    v.pane.setAttribute("d", poly(fillet(pts, [1.2, 1.2, 1.2, 1.2])));
    v.stay.setAttribute("d", S(ridge(v.x, VL - 1, 0), ridge(v.x, VL - 1, a)) + S(ridge(v.x - VW / 2 + 1.5, (VT + VL) / 2, a), ridge(v.x + VW / 2 - 1.5, (VT + VL) / 2, a)));
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const v of vents) { if (stepS(v.sp, dt)) m = true; draw(v); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    const hit = over && over[1] ? vents.find((v) => Math.abs(v.x - over[0]) <= VW / 2 + 5) : null;
    for (const v of vents) {
      v.sp.t = !over ? REST[v.k] : v === hit ? OPEN : OPEN * 0.8 * falloff(Math.abs(v.x - over[0]) / RAD);
      v.pane.classList.toggle("hi", over ? v === hit : v.k === FAV);
    }
    read.textContent = hit ? "vent " + (hit.k + 1) : "rest";
    B.wake();
  }

  /** The pointer on the near roof slope at rest: where its ray meets that plane. */
  function onRoof([sx, sy]) {
    const [, ya] = unproj(C, sx, sy, 0), [, yb] = unproj(C, sx, sy, 100), b = (yb - ya) / 100;
    const z = (H + 2 * R - (2 * R / WD) * ya) / (1 + (2 * R / WD) * b), y = ya + b * z, [x] = unproj(C, sx, sy, z);
    return [x, y];
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = onRoof(p);
      const roof = y > WD / 2 - 2 && y < WD + 2;
      over = x > -6 && x < L + 6 && y > -10 && y < WD + 30 ? [clamp(x, 0, L), roof] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v * 28; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "greenhouse",
  means: "A glass greenhouse with four roof vents: the vents near the pointer open, the one under it widest.",
  rules: [1, 3, 5, 9],
  range: [1, 2, 3.5],
  tour: [[124, 99], [163, 119], [242, 159], null],
  mount,
});
