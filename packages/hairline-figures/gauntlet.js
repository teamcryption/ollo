/**
 * Helm visor: a great helm with a domed crown, a face opening, and a hinged visor pinned at its sides. The pointer over the helm lifts the visor on its pivots to show the opening; leaving drops it shut. At rest the visor is barely cracked, bright. The slider is how far it lifts.
 */
const { Cam, fit, proj, hull, poly, open, fillet, spring, stepS, disposer, mk, pointer, register } = HL;

const bx = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]];
const rotY = (pts, cx, cz, a) => pts.map(([x, y, z]) => { const u = x - cx, w = z - cz, c = Math.cos(a), s = Math.sin(a); return [cx + u * c - w * s, y, cz + u * s + w * c]; });
const up = (pts, d) => pts.map(([x, y, z]) => [x, y, z + d]);
const rad = (d) => (d * Math.PI) / 180;
const A0 = rad(0), AR = rad(10), A1 = rad(78);
const R = 30, ZP = 46, F = [Math.SQRT1_2, Math.SQRT1_2], D = [Math.SQRT1_2, -Math.SQRT1_2];
const cyl = (r, z, a0, a1, n = 24) => { const o = []; for (let i = 0; i <= n; i++) { const t = a0 + ((a1 - a0) * i) / n; o.push([r * Math.cos(t), r * Math.sin(t), z]); } return o; };
const lift = (pts, a) => pts.map(([x, y, z]) => { const pf = x * F[0] + y * F[1], pd = x * D[0] + y * D[1], w = z - ZP, c = Math.cos(a), s = Math.sin(a), f2 = pf * c - w * s; return [f2 * F[0] + pd * D[0], f2 * F[1] + pd * D[1], ZP + pf * s + w * c]; });
const FA = rad(45);
function PARTS(a) {
  const dome = [];
  for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); dome.push(...cyl(R * Math.cos(t), 62 + 24 * Math.sin(t), 0, 2 * Math.PI)); }
  const vis = [...cyl(R + 3, 14, FA - 1.1, FA + 1.1), ...cyl(R + 3, 54, FA - 1.1, FA + 1.1), ...cyl(R - 2, 14, FA - 1.1, FA + 1.1)];
  return [
    { k: "s", cls: "sil", pts: [...cyl(R + 4, -8, 0, 2 * Math.PI), ...cyl(R + 4, 0, 0, 2 * Math.PI)] },
    { k: "s", cls: "sil", pts: [...cyl(R, 0, 0, 2 * Math.PI), ...dome] },
    { k: "l", cls: "nf lo", pts: [[...cyl(R, 50, FA - 0.7, FA + 0.7, 10), ...cyl(R, 20, FA + 0.7, FA - 0.7, 10), [R * Math.cos(FA - 0.7), R * Math.sin(FA - 0.7), 50]]] },
    { k: "s", cls: "sil hi", pts: lift(vis, a) },
    { k: "l", cls: "nf lo", pts: [lift(cyl(R + 3, 42, FA - 0.8, FA - 0.1, 8), a), lift(cyl(R + 3, 42, FA + 0.1, FA + 0.8, 8), a), lift(cyl(R + 3, 28, FA - 0.5, FA + 0.5, 10), a)] },
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
    read.textContent = inside ? "lifted" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (on) sp.t = AR + (A1 - AR) * (0.35 + 0.65 * amt); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "gauntlet",
  means: "A knight's helm with a hinged visor: the pointer lifts the visor on its side pivots, and it drops shut when the pointer leaves.",
  rules: [1, 3, 5, 8],
  range: [0, 70, 100],
  tour: [[200, 186], [190, 150], [210, 110], null],
  mount,
});
