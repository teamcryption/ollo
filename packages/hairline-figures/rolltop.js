/**
 * Roll-top desk: two drawer pedestals under a writing top, a curved hood
 * above with pigeonholes inside and a slatted tambour that rolls up and back
 * along the curve. The pointer's x across the desk rolls the tambour open;
 * at rest it is part way up, bright. The slider is how far it rolls.
 */
const {
  Cam, fit, proj, hull, poly, seg, open, clamp, lerp, rad, spring, stepS, disposer, mk, pointer, register, solid,
} = HL;

const V = (o, a, b, c) => {
  const r = [];
  for (const i of [0, 1]) for (const j of [0, 1]) for (const k of [0, 1]) r.push([0, 1, 2].map((q) => o[q] + i * a[q] + j * b[q] + k * c[q]));
  return r;
};
const AX = (x0, y0, z0, x1, y1, z1) => V([x0, y0, z0], [x1 - x0, 0, 0], [0, y1 - y0, 0], [0, 0, z1 - z0]);
function box(P, s, cs) {
  const pts = cs.map((c) => P(...c));
  s.sil.setAttribute("d", poly(hull(pts)));
  let n = 0, bd = -Infinity;
  cs.forEach((c, i) => { const d = c[0] * 0.61 + c[1] * 0.61 + c[2] * 0.5; if (d > bd) { bd = d; n = i; } });
  s.cr.setAttribute("d", [4, 2, 1].map((b) => seg(pts[n], pts[n ^ b])).join(""));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const W = 96, D = 42, ZT = 46, R = 34, CY = 4, CZ = ZT + 4;
  const arc = (r, t) => [CY + r * Math.cos(rad(t)), CZ + r * Math.sin(rad(t))];
  const C = Cam(45, 0.5, 2.05);
  const FIT = [[0, 0, 0], [W, 0, 0], [W, D, 0], [0, D, 0], [0, 0, CZ + R + 3], [W, 0, CZ + R + 3], [W, D + 2, ZT + 4], [-2, -2, ZT]];
  fit(C, FIT, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  let d = "";
  const fr = (x0, x1, z0, z1, y) => poly([P(x0, y, z0), P(x1, y, z0), P(x1, y, z1), P(x0, y, z1)]);
  for (const x of [0, W - 26]) {
    box(P, solid(g), AX(x, 0, 0, x + 26, D - 2, ZT));
    for (let i = 0; i < 3; i++) { const z0 = 3 + i * 14; d += fr(x + 3, x + 23, z0, z0 + 11, D - 2) + seg(P(x + 10, D - 2, z0 + 5.5), P(x + 16, D - 2, z0 + 5.5)); }
  }
  mk("path", { d, class: "nf" }, g);
  box(P, solid(g), AX(-2, -2, ZT, W + 2, D + 2, ZT + 4));
  box(P, solid(g), AX(0, 0, CZ, W, CY, CZ + R + 3));
  // a side of the hood: a quarter round with its back strip, two units thick
  const side = (x) => {
    const pts = [];
    for (const xx of [x, x + 2]) {
      pts.push(P(xx, 0, CZ), P(xx, 0, CZ + R + 3));
      for (let t = 0; t <= 90; t += 6) { const [y, z] = arc(R + 2, t); pts.push(P(xx, y, z)); }
    }
    const s = solid(g);
    s.sil.setAttribute("d", poly(hull(pts)));
    return s;
  };
  side(0);
  // pigeonholes inside the hood
  box(P, solid(g), AX(4, CY, CZ, W - 4, CY + 12, CZ + 22));
  d = "";
  for (let i = 0; i < 5; i++) d += fr(7 + i * 17.4, 21 + i * 17.4, CZ + 9, CZ + 20, CY + 12);
  d += fr(7, W - 7, CZ + 2, CZ + 7, CY + 12);
  mk("path", { d, class: "nf" }, g);
  const tam = solid(g);
  tam.sil.classList.add("hi");
  const handle = mk("path", { class: "nf" }, g);
  side(W - 2);
  let last = NaN;
  function draw(th) {
    if (th === last) return;
    last = th;
    const pts = [];
    for (let t = th; t <= 90.01; t += (90 - th) / 12 || 1) for (const x of [2, W - 2]) { const [y, z] = arc(R, t); pts.push(P(x, y, z)); }
    tam.sil.setAttribute("d", poly(hull(pts)));
    let s = "";
    for (let t = th + 7; t < 89; t += 7) { const [y, z] = arc(R, t); s += seg(P(2, y, z), P(W - 2, y, z)); }
    tam.cr.setAttribute("d", s);
    const [y, z] = arc(R + 1, th + 2);
    handle.setAttribute("d", seg(P(W / 2 - 7, y, z), P(W / 2 + 7, y, z)));
  }
  const REST = 22, LO = 34;
  const sp = spring(REST);
  // hit: the rest pose's screen box, fixed; the pointer's x across it sets the amount
  const sx = FIT.map((p) => P(...p)), x0 = Math.min(...sx.map((p) => p[0])), x1 = Math.max(...sx.map((p) => p[0]));
  const y0 = Math.min(...sx.map((p) => p[1])), y1 = Math.max(...sx.map((p) => p[1]));
  const hit = ([x, y]) => (x < x0 || x > x1 || y < y0 || y > y1 ? -1 : clamp((x - x0) / (x1 - x0) * 1.3, 0, 1));
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(clamp(sp.x, 0, 86)); return m; });
  bag.add(B.unregister);
  function setT(t) {
    const v = t < 0 ? REST : clamp(lerp(LO, max, t), Math.min(LO, max), Math.max(LO, max));
    if (v === sp.t) return;
    sp.t = v;
    read.textContent = t < 0 ? "rest" : Math.round((v / 90) * 100) + "%";
    B.wake();
  }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: (p) => setT(hit(p)), leave: () => setT(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "rolltop",
  means: "A roll-top desk: the pointer rolls its slatted tambour up and back along the curved hood, further the further right it goes.",
  rules: [1, 3, 4, 5, 6],
  range: [50, 72, 84],
  tour: [[150, 170], [199, 151], [240, 160], null],
  mount,
});
