/**
 * Sugar pourer: a round glass body, a metal cone top and a short spout with
 * a hinged flap. The pointer over it tips the pourer forward on its front
 * edge, and the flap swings open as it goes; away, it stands with a slight
 * lean, the flap bright. The slider is how far it tips.
 *
 * The pattern: one part tilting on a fixed edge (spotlights' rotated hull).
 */
const {
  Cam, circ, fit, hull, poly, proj, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const CX = 30, CY = 30, R = 17, H = 44, TH = 14, REST = 0.06;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tip = value;
  const C = Cam(45, 0.5, 3.9);
  const Y0 = CY + R;
  const rot = (x, y, z, a) => [x, Y0 + (y - Y0) * Math.cos(a) + z * Math.sin(a), -(y - Y0) * Math.sin(a) + z * Math.cos(a)];
  const ext = [];
  for (const a of [0, 1.1]) for (const [x, y, z] of [[CX - R, CY - R, 0], [CX + R, CY + R, 0], [CX - R, CY + R, 0], [CX + R, CY - R, 0], [CX, CY, H + TH + 10], [CX, CY + 10, H + TH + 8]]) ext.push(rot(x, y, z, a));
  fit(C, ext, 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const body = mk("path", { class: "sil" }, g), band = mk("path", { class: "nf lo" }, g), level = mk("path", { class: "nf lo" }, g);
  const cone = mk("path", { class: "sil" }, g), spout = mk("path", { class: "sil" }, g), flap = mk("path", { class: "sil hi" }, g);
  const sp = spring(REST, { k: 80, c: 16 });
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const W = (x, y, z) => P(...rot(x, y, z, a));
    const ring = (r, z, n = 36, ox = 0, oy = 0) => circ(r, n).map((q) => W(CX + ox + q.u, CY + oy + q.v, z));
    body.setAttribute("d", poly(hull(ring(R, 0).concat(ring(R, H)))));
    band.setAttribute("d", poly(ring(R, 4)));
    level.setAttribute("d", poly(ring(R - 0.5, H * 0.55)));
    cone.setAttribute("d", poly(hull(ring(R + 1, H).concat(ring(R + 1, H + 3), ring(6, H + TH)))));
    // spout leans toward the front edge
    spout.setAttribute("d", poly(hull(ring(4.5, H + TH - 5, 16, 0, 4).concat(ring(3.6, H + TH + 6, 16, 0, 9)))));
    const f = 0.15 + 1.9 * Math.max(0, (a - REST) / 1.1);
    const hz = H + TH + 6, hy = CY + 9 - 3.6;
    const fl = circ(4.2, 16).map((q) => [CX + q.u, q.v + 3.6, 0]).map(([x, v]) => W(x, hy + v * Math.cos(f), hz + v * Math.sin(f)));
    flap.setAttribute("d", poly(hull(fl)));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(REST);
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    sp.t = v ? tip : REST;
    flap.classList.toggle("hi", !v);
    cone.classList.toggle("hi", v);
    read.textContent = v ? "pour" : "rest";
    B.wake();
  }
  setOn(false);
  function hit([sx, sy]) {
    const m = P(CX, CY, H / 2 + 6);
    return Math.abs(sx - m[0]) < 70 && Math.abs(sy - m[1]) < 100;
  }
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tip = v; if (on) { sp.t = v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "sugarshaker",
  means: "A sugar pourer: the pointer over it tips the glass forward on its front edge and the spout flap swings open.",
  rules: [1, 3, 5, 8],
  range: [0.6, 0.95, 1.1],
  tour: [[253, 157], [240, 140], [262, 180], null],
  mount,
});
