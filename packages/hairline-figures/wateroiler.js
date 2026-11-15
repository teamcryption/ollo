/**
 * Water jug: a square jug with a carry handle and a spigot, standing on a crate. Over it, the jug tilts forward on its front edge to pour.
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
const REST = 0.08, X = 40, Y = 34, Z = 46;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.5);
  const REST_PTS = [[-6, -6, -14], [X + 6, Y + 6, -14], [X + 6, -6, -14], [-6, Y + 6, -14], [0, 0, Z + 12], [X, Y, Z + 12]];
  fit(C, REST_PTS.concat([[X + 30, Y / 2, Z - 10]]), 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  drawBox(P, solid(g), corners(-6, -6, -14, X + 6, Y + 6, 0));
  const jug = solid(g), cap = solid(g), spig = solid(g), hand = mk("path", { class: "nf" }, g);
  spig.sil.classList.add("hi");
  function draw(a) {
    const ang = a * 0.75, r = (p) => rotY(p, X, 0, ang);
    drawBox(P, jug, corners(0, 0, 0, X, Y, Z).map(r));
    drawBox(P, cap, corners(6, 6, Z, 14, 14, Z + 4).map(r));
    drawBox(P, spig, corners(X, Y / 2 - 4, 4, X + 8, Y / 2 + 4, 11).map(r));
    const h = [[16, Y / 2, Z], [18, Y / 2, Z + 10], [32, Y / 2, Z + 10], [34, Y / 2, Z]].map((p) => P(...r(p)));
    hand.setAttribute("d", seg(h[0], h[1]) + seg(h[1], h[2]) + seg(h[2], h[3]));
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
    read.textContent = a ? "pour" : "rest";
    B.wake();
  }
  draw(REST); setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(sx > box[0] && sx < box[2] && sy > box[1] && sy < box[3]), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (on) { sp.t = v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "wateroiler",
  means: "A square water jug on a crate: the pointer tips it forward on its front edge, spigot first, to pour.",
  rules: [1, 3, 4, 5, 6],
  range: [0.5,0.85,1],
  tour: [[194, 189], [199, 103], [215, 140], null],
  mount,
});
