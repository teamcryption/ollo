/**
 * Ferry: a car ferry at a quay, its hull wider at the deck than at the
 * water, a cabin and bridge amidships, two cars waiting on deck and a
 * bow ramp hinged at the deck's edge. The pointer's distance along the
 * ferry lowers the ramp: toward the quay it comes down onto it, back
 * toward the stern it swings up shut. At rest the ramp stands half raised,
 * bright.
 *
 * The pattern: one part following the pointer on a spring; the hit is on
 * the ground plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, hull, lerp, open, poly, prism, proj, rad, rings, ringAt, rrect, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ZD = 8, HX = 80, RL = 20, UP = 82, DOWN = -8, REST = 58;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-6, -6, 0], [130, -6, 0], [130, 30, 0], [-6, 30, 0], [34, 12, 28], [HX, 12, ZD + RL]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the water: a few dashed ripples on the surface, painted first
  let w = "";
  [[-6, 30, 26], [10, 34, 44], [60, 32, 90], [-4, -6, 14]].forEach(([x0, y, x1]) => { w += seg(P(x0, y, 0), P(x1, y, 0)); });
  mk("path", { class: "dash", d: w }, g);

  // the hull: a foot narrower than its deck, written as two rings
  const foot = rrect(5, 3, 76, 21, 8, 10), top = rrect(0, -2, HX, 26, 11, 10), inner = rrect(1.4, -0.6, HX - 1.4, 24.6, 9.6, 10);
  const h = solid(g);
  h.sil.setAttribute("d", poly(hull(ringAt(P, foot, 0).concat(ringAt(P, top, ZD)))));
  h.cr.setAttribute("d", open(ringAt(P, inner.filter(front), ZD)));
  // the cabin and bridge, then the cars, back to front
  const block = (x0, y0, x1, y1, r, b, z0, z1) => { const s = solid(g); const [o, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, o, i, z0, z1)); return s; };
  block(14, 3, 44, 21, 5, 1.2, ZD, 19);
  block(20, 6, 38, 18, 4, 1, 19, 25);
  mk("path", { class: "nf lo", d: seg(P(29, 12, 25), P(29, 12, 31)) }, g);
  [[50, 4], [52, 14]].forEach(([x, y]) => { block(x, y, x + 13, y + 7, 2.6, 0.8, ZD, ZD + 4); block(x + 3, y + 1, x + 9, y + 6, 1.8, 0.6, ZD + 4, ZD + 6.5); });

  // the quay the ramp comes down onto
  block(97, -6, 130, 30, 3, 1.4, 0, 5.4);

  // the ramp: a plate hinged at the bow, with a line for its thickness
  const ramp = mk("g", {}, g);
  const rsil = mk("path", { class: "sil" }, ramp), redge = mk("path", { class: "nf lo" }, ramp);
  const a = spring(REST);
  let last = NaN;
  function drawRamp(deg) {
    if (deg === last) return;
    last = deg;
    const c = Math.cos(rad(deg)), s = Math.sin(rad(deg));
    const tip = (y, dz) => P(HX - 1 + RL * c - dz * s, y, ZD + RL * s + dz * c);
    const q = [P(HX - 1, 2, ZD), tip(2, 0), tip(22, 0), P(HX - 1, 22, ZD)];
    const t = [P(HX - 1, 2, ZD - 1.4), tip(2, -1.4), tip(22, -1.4), P(HX - 1, 22, ZD - 1.4)];
    rsil.setAttribute("d", poly(hull(q.concat(t))));
    redge.setAttribute("d", open(deg > 12 ? [q[0], q[1], q[2]] : [q[1], q[2], q[3]]) + seg(P(HX + 2, 12, ZD), P(HX - 1 + (RL - 3) * c, 12, ZD + (RL - 3) * s)));
  }

  const B = register(stage, (dt) => { const m = stepS(a, dt); drawRamp(a.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -8 || x > 132 || y < -10 || y > 34) return leave();
    const t = clamp((x - 10) / (HX + 6 - 10), 0, 1) * reach;
    a.t = lerp(UP, DOWN, t);
    rsil.classList.add("hi");
    read.textContent = Math.round(a.t) + "°";
    B.wake();
  }
  function leave() { a.t = REST; rsil.classList.add("hi"); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "ferry",
  means: "A car ferry at its quay: moving the pointer toward the bow lowers the ramp onto the quay; back toward the stern swings it shut.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1],
  tour: [[110, 128], [190, 165], [243, 194], null],
  mount,
});
