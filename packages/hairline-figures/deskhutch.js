/**
 * Desk hutch: a cabinet standing on a desk top, an open cubby on its right
 * and a door on its left. The pointer's x across the hutch swings the door
 * open on its hinge; at rest it stands ajar, bright. The slider is how far it opens.
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
  const C = Cam(45, 0.5, 1.75);
  const FIT = [[-8,-8,0],[128,-8,0],[128,62,0],[-8,62,0],[0,0,62],[120,30,62],[4,90,60]];
  fit(C, FIT, 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const REST = 24, LO = 30, W = 78;
  box(P, solid(g), AX(-8, -8, 0, 128, 62, 5));
  box(P, solid(g), AX(0, 0, 5, 120, 28, 62));
  const fr = (x0, x1, z0, z1) => poly([P(x0, 28, z0), P(x1, 28, z0), P(x1, 28, z1), P(x0, 28, z1)]);
  mk("path", { d: fr(2, 2 + W, 8, 59) + fr(82, 118, 8, 59) + fr(84, 116, 33, 35), class: "nf" }, g);
  const door = solid(g);
  door.sil.classList.add("hi");
  const knob = mk("path", { class: "nf" }, g);
  function draw(th) {
    const t = rad(th), a = [Math.cos(t) * W, Math.sin(t) * W, 0], c = [-Math.sin(t) * 2.5, Math.cos(t) * 2.5, 0];
    box(P, door, V([2, 28, 8], a, [0, 0, 51], c));
    const k = [2 + a[0] * 0.88 + c[0], 28 + a[1] * 0.88 + c[1]];
    knob.setAttribute("d", seg(P(k[0], k[1], 30), P(k[0], k[1], 40)));
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
    read.textContent = t < 0 ? "rest" : Math.round(v) + '°';
    B.wake();
  }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: (p) => setT(hit(p)), leave: () => setT(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "deskhutch",
  means: "A hutch on a desk: the pointer swings its cabinet door open on the hinge, further the further right it goes.",
  rules: [1, 3, 4, 5, 6],
  range: [70,105,130],
  tour: [[180, 120], [230, 130], [258, 133], null],
  mount,
});
