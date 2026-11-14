/**
 * Ambulance: a box-bodied van with a low cab, a roof beacon and two rear
 * doors. The pointer near the back swings the doors open, the nearer the
 * wider; away from the back they settle ajar. At rest the beacon is bright.
 * The slider is how far the doors may swing.
 *
 * The pattern: one part answering where the pointer stands (spring).
 */
const {
  Cam, fit, facing, fillet, poly, prism, proj, rings, unproj, clamp, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 74, W = 36, Z0 = 8, ZT = 46, DW = 18, AJAR = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-28, -2, 0], [L + DW + 2, W + 2, 0], [L + DW + 2, -2, 0], [-28, W, ZT + 6], [L, W + 2, 0], [0, 0, ZT + 6]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (cx, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(cx + 8 * Math.cos(t), y, 8 + 8 * Math.sin(t))); }
    return poly(pts);
  };
  // far wheels, then the cab, the body, the near wheels
  for (const cx of [-12, 56]) mk("path", { d: wheel(cx, 2), class: "lo" }, g);
  const [cR, cI] = rings(-28, 1, 2, W - 1, 6, 1.6);
  put(solid(g), prism(P, front, cR, cI, Z0, 34));
  const win = [[-26, W - 1, 22], [-10, W - 1, 22], [-10, W - 1, 31], [-22, W - 1, 31]].map((q) => P(...q));
  mk("path", { d: poly(fillet(win, [1, 1, 1, 1])), class: "nf lo" }, g);
  const [bR, bI] = rings(0, 0, L, W, 4, 1.6);
  put(solid(g), prism(P, front, bR, bI, Z0, ZT));
  mk("path", { d: poly([P(4, W, 26), P(L - 4, W, 26)]), class: "nf lo" }, g);
  const [lR, lI] = rings(8, 12, 18, 24, 2, 0.8);
  const beacon = solid(g);
  put(beacon, prism(P, front, lR, lI, ZT, ZT + 5));
  for (const cx of [-12, 56]) mk("path", { d: wheel(cx, W), class: "sil" }, g);

  // two doors on the back face (x = L), hinged at y = 0 and y = W
  const doors = [0, 1].map(() => mk("path", { class: "sil" }, g));
  const ang = spring(AJAR);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    const tips = [[L + DW * s, DW * c], [L + DW * s, W - DW * c]];
    [[L, 0], [L, W]].forEach(([hx, hy], k) => {
      const [tx, ty] = tips[k];
      const pts = [P(hx, hy, Z0 + 2), P(tx, ty, Z0 + 2), P(tx, ty, ZT - 2), P(hx, hy, ZT - 2)];
      doors[k].setAttribute("d", poly(fillet(pts, [1.5, 1.5, 1.5, 1.5])));
    });
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  draw(AJAR);

  let on = null;
  function setOpen(t) {
    const live = t !== null;
    if (live !== on) { on = live; beacon.sil.classList.toggle("hi", !live); doors.forEach((d) => d.classList.toggle("hi", live)); }
    ang.t = live ? AJAR + t * (maxA - AJAR) : AJAR;
    read.textContent = live ? Math.round(ang.t) + "°" : "rest";
    B.wake();
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -30 || x > L + 30 || y < -40 || y > W + 40) return setOpen(null);
    setOpen(clamp((x - 10) / (L - 10), 0, 1));
  }
  setOpen(null);
  bag.add(pointer(stage, { move, leave: () => setOpen(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (on) B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "ambulance",
  means: "An ambulance whose rear doors swing open as the pointer nears the back; the beacon is lit at rest.",
  rules: [1, 3, 5, 8],
  range: [40, 100, 110],
  tour: [[170, 150], [225, 175], [261, 193], null],
  mount,
});
