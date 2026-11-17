/**
 * Writing bureau: a chest of three drawers with a fall-front writing flap
 * above, pigeonholes behind it. The pointer's x across the bureau lowers the
 * flap on its bottom hinge toward a flat writing surface; at rest it stands
 * a little open, bright. The slider is how far down it falls.
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
  const W = 84, D = 40, ZH = 56, FH = 38, YF = 30;
  const C = Cam(45, 0.5, 2.1);
  const FIT = [[0, 0, -6], [W, 0, -6], [W, D, -6], [0, D, -6], [0, 0, ZH + FH + 4], [W, YF, ZH + FH + 4], [W, YF + FH + 3, ZH], [0, YF + FH + 3, ZH]];
  fit(C, FIT, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  // bun feet, the chest, the upper case set back
  for (const [x, y] of [[4, 4], [W - 10, 4], [4, D - 10], [W - 10, D - 10]]) box(P, solid(g), AX(x, y, -6, x + 6, y + 6, 0));
  box(P, solid(g), AX(0, 0, 0, W, D, ZH));
  box(P, solid(g), AX(0, 0, ZH, W, YF, ZH + FH));
  const fr = (x0, x1, z0, z1, y) => poly([P(x0, y, z0), P(x1, y, z0), P(x1, y, z1), P(x0, y, z1)]);
  let d = "";
  for (let i = 0; i < 3; i++) {
    const z0 = 4 + i * 17, z1 = z0 + 14;
    d += fr(4, W - 4, z0, z1, D) + seg(P(W / 2 - 6, D, (z0 + z1) / 2), P(W / 2 + 6, D, (z0 + z1) / 2));
  }
  // pigeonholes in the upper case, behind the flap
  for (let i = 0; i < 4; i++) d += fr(6 + i * 19, 21 + i * 19, ZH + 18, ZH + FH - 4, YF);
  d += fr(6, W - 6, ZH + 4, ZH + 14, YF);
  mk("path", { d, class: "nf" }, g);
  const flap = solid(g);
  flap.sil.classList.add("hi");
  const knob = mk("path", { class: "nf" }, g);
  let last = NaN;
  function draw(th) {
    if (th === last) return;
    last = th;
    const t = rad(th), a = [0, Math.sin(t) * FH, Math.cos(t) * FH], c = [0, Math.cos(t) * 2.5, -Math.sin(t) * 2.5];
    box(P, flap, V([1, YF, ZH], [W - 2, 0, 0], a, c));
    const k = [YF + a[1] * 0.85 + c[1], ZH + a[2] * 0.85 + c[2]];
    knob.setAttribute("d", seg(P(W / 2 - 5, k[0], k[1]), P(W / 2 + 5, k[0], k[1])));
  }
  const REST = 22, LO = 34;
  const sp = spring(REST);
  // hit: the rest pose's screen box, fixed; the pointer's x across it sets the amount
  const sx = FIT.map((p) => P(...p)), x0 = Math.min(...sx.map((p) => p[0])), x1 = Math.max(...sx.map((p) => p[0]));
  const y0 = Math.min(...sx.map((p) => p[1])), y1 = Math.max(...sx.map((p) => p[1]));
  const hit = ([x, y]) => (x < x0 || x > x1 || y < y0 || y > y1 ? -1 : clamp((x - x0) / (x1 - x0) * 1.3, 0, 1));
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function setT(t) {
    const v = t < 0 ? REST : clamp(lerp(LO, max, t), Math.min(LO, max), Math.max(LO, max));
    if (v === sp.t) return;
    sp.t = v;
    read.textContent = t < 0 ? "rest" : Math.round(v) + "°";
    B.wake();
  }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: (p) => setT(hit(p)), leave: () => setT(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "bureau",
  means: "A writing bureau: the pointer lowers its fall-front flap on the hinge into a desk, further the further right it goes.",
  rules: [1, 3, 4, 5, 6],
  range: [55, 80, 92],
  tour: [[170, 160], [214, 121], [250, 150], null],
  mount,
});
