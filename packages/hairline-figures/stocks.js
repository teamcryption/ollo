/**
 * Pillory: a post on a footing carrying two heavy boards with three half-round cut-outs, the upper board hinged at one end. The pointer over it swings the upper board open on its hinge; leaving drops it shut. At rest it sits barely open, bright. The slider is how far it swings.
 */
const { Cam, fit, proj, hull, poly, open, fillet, spring, stepS, disposer, mk, pointer, register } = HL;

const bx = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]];
const rotY = (pts, cx, cz, a) => pts.map(([x, y, z]) => { const u = x - cx, w = z - cz, c = Math.cos(a), s = Math.sin(a); return [cx + u * c - w * s, y, cz + u * s + w * c]; });
const up = (pts, d) => pts.map(([x, y, z]) => [x, y, z + d]);
const rad = (d) => (d * Math.PI) / 180;
const A0 = 0, AR = rad(5), A1 = rad(42);
const HX = -52, HZ = 58;
const half = (cx, z, s) => { const o = []; for (let i = 0; i <= 10; i++) { const t = (i / 10) * Math.PI; o.push([cx + 8 * Math.cos(t), 4, z + s * 8 * Math.sin(t)]); } return o; };
function PARTS(a) {
  const hl = [half(-30, HZ, 1), half(0, HZ, 1.25), half(30, HZ, 1)];
  return [
    { k: "s", cls: "sil", pts: bx(-34, -34, 0, 34, 34, 6) },
    { k: "s", cls: "sil", pts: bx(-5, -5, 6, 5, 5, 40) },
    { k: "s", cls: "sil", pts: bx(-52, -4, 40, 52, 4, 58) },
    { k: "l", cls: "nf lo", pts: [half(-30, HZ, -1), half(0, HZ, -1.25), half(30, HZ, -1)] },
    { k: "s", cls: "sil hi", pts: rotY(bx(-52, -4, 58, 52, 4, 78), HX, HZ, a) },
    { k: "l", cls: "nf lo", pts: hl.map((l) => rotY(l, HX, HZ, a)) },
    { k: "s", cls: "sil", pts: bx(-58, -6, 52, -50, 6, 64) },
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
    read.textContent = inside ? "open" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (on) sp.t = AR + (A1 - AR) * (0.35 + 0.65 * amt); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "stocks",
  means: "A pillory: two heavy boards on a post, the upper board swings open on its hinge under the pointer and drops shut when it leaves.",
  rules: [1, 3, 5, 8],
  range: [0, 70, 100],
  tour: [[201, 145], [180, 165], [230, 150], null],
  mount,
});
