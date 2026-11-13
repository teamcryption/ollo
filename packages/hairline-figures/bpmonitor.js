/**
 * Blood pressure monitor: a cuff lying flat, its hose running to a round dial
 * gauge with a needle and to a squeeze bulb with its valve. As the pointer
 * nears the bulb the pressure rises: the cuff swells on a spring and the
 * gauge's needle swings round. At rest the cuff is slack and the needle,
 * bright, sits a little off its stop. The slider is the bulb's reach.
 *
 * The pattern: one continuous value from the pointer's distance to a fixed
 * point (the bulb at rest), read through a spring.
 */
const {
  Cam, circ, clamp, facing, fit, hull, lerp, open, poly, prism, proj, rad, rings, ringAt, rrect, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CX1 = 46, CY1 = 30, H0 = 4, HMAX = 13, GX = 74, GY = 8, GR = 13, GZ = 5, BX = 66, BY = 50;
const BULB = [[0, 3.5], [1.5, 6.5], [5, 8.5], [10, 8.4], [14, 6], [17, 3]];
const A0 = rad(-215), A1 = rad(35), REST = 0.12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.6);
  fit(C, [[0, 0, 0], [0, CY1, 0], [CX1, 0, 0], [CX1, CY1, HMAX], [GX + GR, GY, 0], [GX, GY - GR, GZ], [BX + 9, BY + 9, 0], [BX, BY, 22]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the hose, lying on the ground: from the cuff's port to the gauge, and on to the bulb's valve
  const curve = (pts) => { const out = []; for (let i = 0; i <= 24; i++) { const t = i / 24, u = 1 - t; out.push(P(...[0, 1, 2].map((k) => u * u * u * pts[0][k] + 3 * u * u * t * pts[1][k] + 3 * u * t * t * pts[2][k] + t * t * t * pts[3][k]))); } return out; };
  mk("path", { class: "nf", d: open(curve([[CX1 - 4, 12, 2], [58, 12, 1], [56, 26, 1], [GX - 9, GY + 10, 2]])) + open(curve([[CX1 - 4, 18, 2], [52, 40, 1], [BX - 14, BY - 4, 1], [BX - 3, BY - 2, 20]])) }, g);

  // the cuff: a fabric sleeve laid flat, its seam and hook-and-loop patch on top
  const cuff = solid(g), seam = mk("path", { class: "nf lo" }, cuff.g);
  const [cr, ci] = rings(0, 0, CX1, CY1, 8, 1.6);
  const seamR = rrect(4, 4, CX1 - 4, CY1 - 4, 5, 4), patch = rrect(8, 8, 22, CY1 - 8, 2, 3);

  // the gauge: a squat round case, its face ring, ticks round the dial and the needle
  const gr = circ(GR, 32), gi = circ(GR - 1.4, 32);
  const gauge = solid(g);
  put(gauge, prism(P, front, gr.map((q) => ({ ...q, u: q.u + GX, v: q.v + GY })), gi.map((q) => ({ ...q, u: q.u + GX, v: q.v + GY })), 0, GZ));
  let ticks = poly(ringAt(P, circ(10, 32).map((q) => ({ ...q, u: q.u + GX, v: q.v + GY })), GZ));
  for (let i = 0; i <= 10; i++) {
    const a = lerp(A0, A1, i / 10), r0 = i % 5 === 0 ? 7 : 8.2;
    ticks += seg(P(GX + r0 * Math.cos(a), GY + r0 * Math.sin(a), GZ), P(GX + 9.4 * Math.cos(a), GY + 9.4 * Math.sin(a), GZ));
  }
  mk("path", { class: "nf lo", d: ticks }, gauge.g);
  const needle = mk("path", { class: "nf" }, gauge.g);
  const hub = mk("path", { class: "", d: poly(ringAt(P, circ(1.2, 12).map((q) => ({ ...q, u: q.u + GX, v: q.v + GY })), GZ)) }, gauge.g);

  // the bulb: a lathe of rings, then its valve on top
  const bulb = solid(g);
  const lathe = [];
  for (const [z, r] of BULB) lathe.push(...ringAt(P, circ(r, 24).map((q) => ({ ...q, u: q.u + BX, v: q.v + BY })), z));
  bulb.sil.setAttribute("d", poly(hull(lathe)));
  bulb.cr.setAttribute("d", open(ringAt(P, circ(7.6, 24).map((q) => ({ ...q, u: q.u + BX, v: q.v + BY })), 12).filter((_, i) => i <= 12)));
  const [vr, vi] = rings(BX - 2, BY - 2, BX + 2, BY + 2, 2, 0.5);
  put(solid(g), prism(P, front, vr, vi, 16.5, 21));

  const pr = spring(REST, { eps: 0.002 });
  let last = NaN;
  function draw(p) {
    if (p === last) return;
    last = p;
    const h = lerp(H0, HMAX, clamp(p, 0, 1));
    put(cuff, prism(P, front, cr, ci, 0, h));
    seam.setAttribute("d", poly(ringAt(P, seamR, h)) + poly(ringAt(P, patch, h)));
    const a = lerp(A0, A1, clamp(p, 0, 1.04));
    needle.setAttribute("d", seg(P(GX - 2 * Math.cos(a), GY - 2 * Math.sin(a), GZ + 0.3), P(GX + 8.6 * Math.cos(a), GY + 8.6 * Math.sin(a), GZ + 0.3)));
  }
  cuff.g.after(g.firstChild);
  hub.before(needle);

  const B = register(stage, (dt) => { const m = stepS(pr, dt); draw(pr.x); return m; });
  bag.add(B.unregister);

  const bulbAt = P(BX, BY, 9);
  function set(p) {
    pr.t = p < 0 ? REST : p;
    needle.classList.toggle("hi", p < 0);
    bulb.sil.classList.toggle("hi", p >= 0);
    read.textContent = p < 0 ? "rest" : String(Math.round(40 + 160 * p));
    B.wake();
  }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => set(clamp(1 - Math.hypot(sx - bulbAt[0], sy - bulbAt[1]) / reach, 0, 1)),
    leave: () => set(-1),
  }));
  bag.add(() => svg.replaceChildren());
  set(-1);
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "bpmonitor",
  means: "A blood pressure monitor: as the pointer nears the bulb the cuff swells and the gauge's needle swings round.",
  rules: [1, 3, 5, 8],
  range: [160, 240, 340],
  tour: [[290, 175], [230, 190], [178, 197], null],
  mount,
});
