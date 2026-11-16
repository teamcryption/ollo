/**
 * Footrest: a tilting foot plate, ridged, rocking on two supports over a
 * low base. The pointer's x across it rocks the plate from heel to toe; at
 * rest it leans back, bright. The slider is the furthest tilt forward.
 */
const {
  Cam, fit, proj, hull, poly, seg, clamp, lerp, rad, spring, stepS, disposer, mk, pointer, register, solid,
} = HL;

const V = (o, a, b, c) => {
  const r = [];
  for (const i of [0, 1]) for (const j of [0, 1]) for (const k of [0, 1]) r.push([0, 1, 2].map((q) => o[q] + i * a[q] + j * b[q] + k * c[q]));
  return r;
};
const AX = (x0, y0, z0, x1, y1, z1) => V([x0, y0, z0], [x1 - x0, 0, 0], [0, y1 - y0, 0], [0, 0, z1 - z0]);
// a box as a hull, with the three edges that meet at its nearest corner as creases
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
  const C = Cam(45, 0.5, 1.85);
  const FIT = [[-8,-6,0],[108,-6,0],[108,66,0],[-8,66,0],[-6,-4,44],[106,64,44]];
  fit(C, FIT, 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const REST = -9, LO = -18, PX = 50, PZ = 25, HL_ = 56, HW = 34;
  box(P, solid(g), AX(0, 0, 0, 100, 60, 4));
  box(P, solid(g), AX(40, 4, 4, 60, 9, PZ - 1));
  box(P, solid(g), AX(40, 51, 4, 60, 56, PZ - 1));
  const plate = solid(g), ridges = mk("path", { class: "nf" }, g);
  plate.sil.classList.add("hi");
  function draw(ps) {
    const t = rad(ps), u = [Math.cos(t), 0, -Math.sin(t)], n = [Math.sin(t), 0, Math.cos(t)];
    const o = [PX - u[0] * HL_, 30 - HW, PZ - u[2] * HL_];
    box(P, plate, V(o, u.map((q) => q * 2 * HL_), [0, 2 * HW, 0], n.map((q) => q * 3)));
    let d = "";
    for (let s = 16; s < 2 * HL_ - 8; s += 16) {
      const p = [o[0] + u[0] * s + n[0] * 3, o[2] + u[2] * s + n[2] * 3];
      d += seg(P(p[0], 30 - HW + 5, p[1]), P(p[0], 30 + HW - 5, p[1]));
    }
    ridges.setAttribute("d", d);
  }
  const sp = spring(REST);
  // hit: the rest pose's screen box, fixed; the pointer's x across it sets the amount
  const sx = FIT.map((p) => P(...p)), x0 = Math.min(...sx.map((p) => p[0])), x1 = Math.max(...sx.map((p) => p[0]));
  const y0 = Math.min(...sx.map((p) => p[1])), y1 = Math.max(...sx.map((p) => p[1]));
  const hit = ([x, y]) => (x < x0 || x > x1 || y < y0 || y > y1 ? -1 : clamp((x - x0) / (x1 - x0) * 1.25, 0, 1));
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function setT(t) {
    const v = t < 0 ? REST : clamp(lerp(LO, max, t), Math.min(LO, max), Math.max(LO, max));
    if (v === sp.t) return;
    sp.t = v;
    read.textContent = t < 0 ? "rest" : (v > 0 ? '+' : '') + Math.round(v) + '°';
    B.wake();
  }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: (p) => setT(hit(p)), leave: () => setT(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "chairmat",
  means: "An adjustable footrest: the pointer rocks its ridged foot plate on the pivot, from leaning back to tipped forward.",
  rules: [1, 3, 4, 5, 6],
  range: [8,16,20],
  tour: [[190, 150], [230, 170], [259, 183], null],
  mount,
});
