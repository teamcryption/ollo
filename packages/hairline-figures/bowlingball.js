/**
 * Bowling return: a hood at the head of two rails, three balls resting on
 * the rails against it. The pointer rolls the balls down the rack, the one
 * nearest the hood first, spreading out further the further right it sits.
 * At rest the front ball is bright. The slider is how far they roll.
 */
const { Cam, fit, hull, poly, proj, rings, prism, facing, put, solid, clamp, lerp, spring, stepS, disposer, mk, pointer, register } = HL;

const RL = 180, BR = 14, RZ = 10, HX = 36;
const corners = (x0, y0, z0, x1, y1, z1) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push([x, y, z]); return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[0, -22, 0], [RL, 22, 0], [0, -22, 46], [RL, 22, 46]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [hr, hi] = rings(0, -22, HX, 22, 8, 2);
  put(solid(g), prism(P, front, hr, hi, 0, 44));
  mk("path", { class: "nf lo", d: poly([P(HX, -14, 30), P(HX, 14, 30), P(HX, 14, 14), P(HX, -14, 14)]) }, g);
  for (const y of [-7, 7]) mk("path", { class: "sil", d: poly(hull(corners(HX, y - 1.5, 0, RL, y + 1.5, RZ).map((p) => P(...p)))) }, g);
  const rests = [HX + BR, HX + 3 * BR, HX + 5 * BR];
  const balls = rests.map((x, i) => ({ x0: x, s: spring(x), el: mk("ellipse", { class: "sil" + (i === 2 ? " hi" : ""), rx: BR * C.S || 0, ry: 0 }, g), holes: mk("path", { class: "nf lo" }, g) }));
  const r = Math.hypot(P(0, 0, BR)[0] - P(0, 0, 0)[0], P(0, 0, BR)[1] - P(0, 0, 0)[1]);
  for (const b of balls) { b.el.setAttribute("rx", r.toFixed(2)); b.el.setAttribute("ry", r.toFixed(2)); }
  function draw() {
    for (const b of balls) {
      const c = P(b.s.x, 0, RZ + BR * 0.6);
      b.el.setAttribute("cx", c[0].toFixed(2)); b.el.setAttribute("cy", c[1].toFixed(2));
      const ang = (b.s.x - b.x0) / BR;
      const h = [0, 1, 2].map((k) => { const t = ang + k * 0.5; return [c[0] + Math.cos(t) * r * 0.45, c[1] - r * 0.35 + Math.sin(t) * r * 0.2]; });
      b.holes.setAttribute("d", h.map(([x, y]) => `M${(x - 1.6).toFixed(2)},${y.toFixed(2)}a1.6,1.6 0 1,0 3.2,0a1.6,1.6 0 1,0 -3.2,0`).join(""));
    }
  }
  const B = register(stage, (dt) => { let mv = false; for (const b of balls) if (stepS(b.s, dt)) mv = true; draw(); return mv; });
  bag.add(B.unregister);
  const L = P(0, 0, 0)[0], R = P(RL, 0, 0)[0], top = P(0, -22, 50)[1], bot = P(RL, 22, 0)[1];
  function move([sx, sy]) {
    if (sx < L - 20 || sx > R + 20 || sy < top - 20 || sy > bot + 20) return leave();
    const t = clamp((sx - L) / (R - L), 0, 1);
    balls.forEach((b, i) => { b.s.t = b.x0 + t * reach * (RL - BR - rests[2]) * (0.4 + 0.3 * i); });
    read.textContent = Math.round(t * 100) + "%";
    B.wake();
  }
  function leave() { balls.forEach((b) => { b.s.t = b.x0; }); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "bowlingball",
  means: "A bowling ball return: three balls rest against the hood, and the pointer rolls them apart down the rails.",
  rules: [1, 3, 5],
  range: [0.4, 1, 1],
  tour: [[82, 130], [200, 189], [318, 248], null],
  mount,
});
