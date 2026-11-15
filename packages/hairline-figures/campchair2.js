/**
 * Camp chair: a folding chair on crossed legs. Over it, the canvas back swings forward and folds down onto the seat.
 */
const { Cam, fit, proj, hull, poly, open, run, seg, spring, stepS, mk, pointer, register, disposer, solid, rings, prism, facing, put } = HL;

const corners = (x0, y0, z0, x1, y1, z1) => [0, 1, 2, 3, 4, 5, 6, 7].map((i) => [i & 1 ? x1 : x0, i & 2 ? y1 : y0, i & 4 ? z1 : z0]);
const rotY = (p, cx, cz, a) => { const dx = p[0] - cx, dz = p[2] - cz; return [cx + dx * Math.cos(a) + dz * Math.sin(a), p[1], cz - dx * Math.sin(a) + dz * Math.cos(a)]; };
const rotX = (p, cy, cz, a) => { const dy = p[1] - cy, dz = p[2] - cz; return [p[0], cy + dy * Math.cos(a) - dz * Math.sin(a), cz + dy * Math.sin(a) + dz * Math.cos(a)]; };
function drawBox(P, s, w) {
  const q = w.map((p) => P(p[0], p[1], p[2]));
  let n = 0, bd = -Infinity;
  w.forEach((p, i) => { const d = (p[0] + p[1]) * 0.61 + p[2] * 0.5; if (d > bd) { bd = d; n = i; } });
  s.sil.setAttribute("d", poly(hull(q)));
  s.cr.setAttribute("d", seg(q[n], q[n ^ 1]) + seg(q[n], q[n ^ 2]) + seg(q[n], q[n ^ 4]));
}
const REST = 0, D = 44, W = 44, H = 30;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.35);
  const REST_PTS = [[0, 0, 0], [D, W, 0], [D, 0, 0], [0, W, 0], [-10, 0, H + 46], [-10, W, H + 46]];
  fit(C, REST_PTS.concat([[D + 4, 0, H + 6]]), 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const legs = mk("path", { class: "nf" }, g);
  let d = "";
  for (const y of [2, W - 2]) d += seg(P(0, y, 0), P(D, y, H)) + seg(P(D, y, 0), P(0, y, H));
  d += seg(P(0, 2, 0), P(0, W - 2, 0)) + seg(P(D, 2, 0), P(D, W - 2, 0));
  legs.setAttribute("d", d);
  const seat = solid(g);
  drawBox(P, seat, corners(0, 0, H, D, W, H + 3));
  const back = solid(g);
  back.sil.classList.add("hi");
  function draw(a) {
    const ang = -0.22 + a * 1.75;
    drawBox(P, back, corners(-3, 0, H + 3, 0, W, H + 47).map((p) => rotY(p, 0, H + 3, ang)));
  }
  const rq = REST_PTS.map((p) => P(p[0], p[1], p[2]));
  const box = [Math.min(...rq.map((q) => q[0])) - 8, Math.min(...rq.map((q) => q[1])) - 8, Math.max(...rq.map((q) => q[0])) + 8, Math.max(...rq.map((q) => q[1])) + 8];

  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  let on = null;
  function setOn(a) {
    if (a === on) return;
    on = a;
    sp.t = a ? amt : REST;
    read.textContent = a ? "folded" : "rest";
    B.wake();
  }
  draw(REST); setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(sx > box[0] && sx < box[2] && sy > box[1] && sy < box[3]), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (on) { sp.t = v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "campchair2",
  means: "A folding camp chair on crossed legs: the pointer folds its canvas back forward, swinging down onto the seat.",
  rules: [1, 3, 4, 5, 6],
  range: [0.5,0.85,1],
  tour: [[205, 205], [158, 106], [175, 120], null],
  mount,
});
