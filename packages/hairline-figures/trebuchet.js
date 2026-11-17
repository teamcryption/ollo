/**
 * Trebuchet: a siege engine on two rails, an A-frame holding an axle, a long throwing arm with a heavy counterweight box at its short end. The pointer over it looses the arm: the weight drops and the long end swings up. At rest the arm is cocked low, bright. The slider is how far it swings.
 */
const { Cam, fit, proj, hull, poly, open, fillet, spring, stepS, disposer, mk, pointer, register } = HL;

const bx = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]];
const rotY = (pts, cx, cz, a) => pts.map(([x, y, z]) => { const u = x - cx, w = z - cz, c = Math.cos(a), s = Math.sin(a); return [cx + u * c - w * s, y, cz + u * s + w * c]; });
const up = (pts, d) => pts.map(([x, y, z]) => [x, y, z + d]);
const rad = (d) => (d * Math.PI) / 180;
const A0 = rad(-38), AR = rad(-34), A1 = rad(62);
const PV = [56, 70];
function PARTS(a) {
  const c = Math.cos(a), s = Math.sin(a), sx = PV[0] - 26 * c, sz = PV[1] - 26 * s, lx = PV[0] + 92 * c, lz = PV[1] + 92 * s;
  return [
    { k: "s", cls: "sil", pts: bx(0, 0, 0, 130, 7, 7) },
    { k: "s", cls: "sil", pts: [...bx(50, 0, 7, 62, 7, 8).slice(0, 4), ...bx(54, 0, 66, 58, 7, 74).slice(4)] },
    { k: "s", cls: "sil", pts: bx(52, 0, 68, 60, 44, 72) },
    { k: "s", cls: "sil hi", pts: rotY(bx(PV[0] - 26, 18, PV[1] - 3, PV[0] + 92, 26, PV[1] + 3), PV[0], PV[1], a) },
    { k: "s", cls: "sil", pts: bx(sx - 13, 12, sz - 30, sx + 13, 32, sz - 4) },
    { k: "l", cls: "nf lo", pts: [[[sx, 22, sz], [sx, 22, sz - 4]], [[lx, 22, lz], [lx + 6, 22, lz - 14]]] },
    { k: "s", cls: "sil", pts: bx(lx + 2, 18, lz - 22, lx + 10, 26, lz - 14) },
    { k: "s", cls: "sil", pts: [...bx(50, 37, 7, 62, 44, 8).slice(0, 4), ...bx(54, 37, 66, 58, 44, 74).slice(4)] },
    { k: "s", cls: "sil", pts: bx(0, 37, 0, 130, 44, 7) },
  ];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const ext = [];
  for (const a of [A0, AR, A1]) for (const p of PARTS(a)) (p.k === "s" ? [p.pts] : p.pts).forEach((l) => ext.push(...l));
  let C = Cam(45, 0.5, 1);
  fit(C, ext, 200, 164);
  let P = proj(C);
  const box = (pts) => { const s = pts.map((q) => P(...q)), xs = s.map((q) => q[0]), ys = s.map((q) => q[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
  const e = box(ext);
  C = Cam(45, 0.5, Math.min(330 / (e[2] - e[0]), 262 / (e[3] - e[1])));
  fit(C, ext, 200, 164);
  P = proj(C);
  const restPts = [];
  for (const p of PARTS(AR)) (p.k === "s" ? [p.pts] : p.pts).forEach((l) => restPts.push(...l));
  const rb = box(restPts);
  const g = mk("g", {}, svg);
  const els = PARTS(AR).map((p) => mk("path", { class: p.cls }, g));
  const sp = spring(AR);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    PARTS(a).forEach((p, i) => {
      if (p.k === "s") { const h = hull(p.pts.map((q) => P(...q))); els[i].setAttribute("d", poly(fillet(h, h.map(() => 2)))); }
      else els[i].setAttribute("d", p.pts.map((l) => open(l.map((q) => P(...q)))).join(" "));
    });
  }
  draw(AR);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  let on = false;
  function aim(p) {
    const inside = !!p && p[0] > rb[0] - 6 && p[0] < rb[2] + 6 && p[1] > rb[1] - 6 && p[1] < rb[3] + 6;
    on = inside;
    sp.t = inside ? AR + (A1 - AR) * (0.35 + 0.65 * amt) : AR;
    read.textContent = inside ? "loosed" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (on) sp.t = AR + (A1 - AR) * (0.35 + 0.65 * amt); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "trebuchet",
  means: "A siege trebuchet on two rails: the pointer looses its arm, the counterweight drops and the long end swings high.",
  rules: [1, 3, 5, 8],
  range: [0, 70, 100],
  tour: [[189, 131], [160, 170], [230, 200], null],
  mount,
});
