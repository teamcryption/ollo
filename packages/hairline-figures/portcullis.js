/**
 * Portcullis: a gatehouse of two towers and a lintel block, an iron grid gate hung between them. The pointer over the gate winches the grid up into the lintel; leaving lets it drop. At rest it hangs a little raised, its bottom rail bright. The slider is how far it rises.
 */
const { Cam, fit, proj, hull, poly, open, fillet, spring, stepS, disposer, mk, pointer, register } = HL;

const bx = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]];
const rotY = (pts, cx, cz, a) => pts.map(([x, y, z]) => { const u = x - cx, w = z - cz, c = Math.cos(a), s = Math.sin(a); return [cx + u * c - w * s, y, cz + u * s + w * c]; });
const up = (pts, d) => pts.map(([x, y, z]) => [x, y, z + d]);
const rad = (d) => (d * Math.PI) / 180;
const A0 = 0, AR = 8, A1 = 50;
function PARTS(L) {
  const out = [];
  for (let i = 0; i < 9; i++) { const x = 26 + i * 11; out.push({ k: "s", cls: "sil", pts: up([[x, 8, 0], [x + 3, 8, 0], [x, 12, 0], [x + 3, 12, 0], [x + 1.5, 10, -5], ...bx(x, 8, 4, x + 3, 12, 88).slice(4)], L) }); }
  [16, 40, 64, 86].forEach((z, i) => out.push({ k: "s", cls: i === 0 ? "sil hi" : "sil", pts: up(bx(24, 7, z, 116, 13, z + 4), L) }));
  out.push({ k: "s", cls: "sil", pts: bx(22, 0, 92, 118, 20, 140) });
  out.push({ k: "s", cls: "sil", pts: bx(0, 0, 0, 22, 20, 146) });
  out.push({ k: "s", cls: "sil", pts: bx(118, 0, 0, 140, 20, 146) });
  out.push({ k: "l", cls: "nf lo", pts: [[[22, 20, 100], [118, 20, 100]], [[2, 20, 120], [20, 20, 120]], [[120, 20, 120], [138, 20, 120]]] });
  return out;
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
    read.textContent = inside ? "raised" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (on) sp.t = AR + (A1 - AR) * (0.35 + 0.65 * amt); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "portcullis",
  means: "A gatehouse with an iron grid gate: the pointer winches the portcullis up into the lintel, and it drops when the pointer leaves.",
  rules: [1, 3, 5, 8],
  range: [0, 70, 100],
  tour: [[200, 205], [170, 180], [230, 160], null],
  mount,
});
