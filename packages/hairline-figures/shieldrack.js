/**
 * Shield: a kite shield hung by its strap from a peg on a standing post. The pointer over it swings the shield aside on its strap; leaving lets it settle. At rest it hangs at a slight angle, its rim bright. The slider is how far it swings.
 */
const { Cam, fit, proj, hull, poly, open, fillet, spring, stepS, disposer, mk, pointer, register } = HL;

const bx = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]];
const rotY = (pts, cx, cz, a) => pts.map(([x, y, z]) => { const u = x - cx, w = z - cz, c = Math.cos(a), s = Math.sin(a); return [cx + u * c - w * s, y, cz + u * s + w * c]; });
const up = (pts, d) => pts.map(([x, y, z]) => [x, y, z + d]);
const rad = (d) => (d * Math.PI) / 180;
const A0 = rad(10), AR = rad(9), A1 = rad(-34);
const PV = [0, 132];
const KITE = [[-26, -14], [26, -14], [32, -34], [25, -72], [0, -122], [-25, -72], [-32, -34]];
function PARTS(a) {
  const sh = (y) => KITE.map(([u, w]) => [PV[0] + u, y, PV[1] + w]);
  return [
    { k: "s", cls: "sil", pts: bx(-44, -40, 0, 44, 20, 5) },
    { k: "s", cls: "sil", pts: bx(-4, -12, 5, 4, -4, 150) },
    { k: "s", cls: "sil hi", pts: rotY([...sh(3), ...sh(8)], PV[0], PV[1], a) },
    { k: "l", cls: "nf lo", pts: [rotY([[0, 8, PV[1] - 16], [0, 8, PV[1] - 118]], PV[0], PV[1], a), rotY([[-26, 8, PV[1] - 38], [26, 8, PV[1] - 38]], PV[0], PV[1], a)] },
    { k: "s", cls: "sil", pts: rotY(bx(-3, 4, PV[1] - 16, 3, 9, PV[1] + 2), PV[0], PV[1], a) },
    { k: "s", cls: "sil", pts: bx(-2.5, -4, PV[1] - 2, 2.5, 12, PV[1] + 3) },
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
    read.textContent = inside ? "swung" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (on) sp.t = AR + (A1 - AR) * (0.35 + 0.65 * amt); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "shieldrack",
  means: "A kite shield hanging by its strap from a peg on a post: the pointer swings it aside, and it settles back when the pointer leaves.",
  rules: [1, 3, 5, 8],
  range: [0, 70, 100],
  tour: [[186, 147], [180, 200], [200, 110], null],
  mount,
});
