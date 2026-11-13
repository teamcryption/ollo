/**
 * Curtains: a window on a wall, four panes and a sill, under a rod with two
 * finials and two folded curtain panels. The pointer is where to look out:
 * the panels draw apart around its x, each leading edge on its own spring,
 * and the folds gather as a panel narrows. At rest the curtains stand a
 * little open, off centre, the right leading edge bright. The slider is how
 * wide the opening is.
 *
 * The pattern: a continuous gap (two springs); the hit is on the curtains'
 * hanging plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, open, poly, prism, proj, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const WX = 40, Z0 = 22, Z1 = 92, XR = 60, YC = 7, ZT = 100, ZB = 14, NF = 7, CL = 120;
const REST = [-14, 4];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let HALF = value * 20, over = null;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-70, -4, 0], [70, -4, 0], [-70, 0, 112], [70, 0, 112], [-70, 12, 0], [70, 12, 0]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wo, wi] = rings(-70, -4, 70, 0, 2, 0.8);
  put(solid(g), prism(P, front, wo, wi, 0, 112));
  const F = (x, z) => P(x, 0, z);
  mk("path", { class: "nf", d: poly([F(-WX, Z0), F(WX, Z0), F(WX, Z1), F(-WX, Z1)]) }, g);
  mk("path", { class: "nf lo", d: poly([F(-WX + 3, Z0 + 3), F(WX - 3, Z0 + 3), F(WX - 3, Z1 - 3), F(-WX + 3, Z1 - 3)]) + seg(F(0, Z0 + 3), F(0, Z1 - 3)) + seg(F(-WX + 3, 57), F(WX - 3, 57)) }, g);
  const [so, si] = rings(-WX - 4, 0, WX + 4, 5, 1.2, 0.5);
  put(solid(g), prism(P, front, so, si, Z0 - 3, Z0));

  const panels = [-1, 1].map((s) => ({ s, el: mk("path", { class: "sil" }, g), folds: mk("path", { class: "nf lo" }, g), lead: mk("path", { class: "nf" }, g) }));
  const [ro, ri] = rings(-XR - 2, YC - 1.2, XR + 2, YC + 1.2, 1.2, 0.4);
  put(solid(g), prism(P, front, ro, ri, ZT, ZT + 2.4));
  for (const x of [-XR - 4, XR + 4]) put(solid(g), prism(P, front, circ(2.6, 20).map((q) => ({ ...q, u: q.u + x, v: q.v + YC })), null, ZT - 1.4, ZT + 3.8));

  const eL = spring(REST[0]), eR = spring(REST[1]);
  let drawn = "";
  /** One panel from the outer end xo to its leading edge xe: a zigzag of NF folds, deeper as it gathers. */
  function panel(pn, xo, xe) {
    const w = Math.abs(xe - xo) / NF, amp = Math.min(6, Math.sqrt(Math.max(0, (CL / NF) ** 2 - w * w)) / 2);
    const xs = Array.from({ length: NF + 1 }, (_, i) => xo + (xe - xo) * (i / NF));
    const ys = xs.map((_, i) => YC + (i % 2 ? amp : -amp) * 0.9);
    const top = xs.map((x, i) => P(x, ys[i], ZT - 1)), bot = xs.map((x, i) => P(x, ys[i], ZB)).reverse();
    pn.el.setAttribute("d", poly(top.concat(bot)));
    pn.folds.setAttribute("d", xs.slice(1, -1).map((x, i) => (i % 2 ? "" : seg(P(x, ys[i + 1], ZT - 1), P(x, ys[i + 1], ZB)))).join(""));
    pn.lead.setAttribute("d", open([P(xe, ys[NF], ZT - 1), P(xe, ys[NF], ZB)]));
  }
  function draw() {
    const key = eL.x.toFixed(2) + "," + eR.x.toFixed(2);
    if (key === drawn) return;
    drawn = key;
    panel(panels[0], -XR, clamp(eL.x, -XR + 6, eR.x));
    panel(panels[1], XR, clamp(eR.x, eL.x, XR - 6));
  }
  const B = register(stage, (dt) => { const a = stepS(eL, dt), b = stepS(eR, dt); draw(); return a || b; });
  bag.add(B.unregister);

  function retarget() {
    if (over === null) { eL.t = REST[0]; eR.t = REST[1]; } else {
      const c = clamp(over, -XR + 6 + HALF, XR - 6 - HALF);
      eL.t = c - HALF; eR.t = c + HALF;
    }
    panels[0].lead.classList.toggle("hi", over !== null);
    panels[1].lead.classList.toggle("hi", true);
    const pct = (clamp(eR.t, -WX, WX) - clamp(eL.t, -WX, WX)) / (2 * WX);
    read.textContent = over === null ? "rest" : "open " + Math.round(pct * 100) + "%";
    B.wake();
  }

  // the hanging plane y = YC: P is linear there in x and z, so invert it
  const o = P(0, YC, 0), ex = P(1, YC, 0).map((v, i) => v - o[i]), ez = P(0, YC, 1).map((v, i) => v - o[i]);
  const det = ex[0] * ez[1] - ex[1] * ez[0];
  bag.add(pointer(stage, {
    move: (p) => {
      const dx = p[0] - o[0], dy = p[1] - o[1], x = (dx * ez[1] - dy * ez[0]) / det, z = (ex[0] * dy - ex[1] * dx) / det;
      over = Math.abs(x) < XR + 6 && z > ZB - 8 && z < ZT + 6 ? clamp(x, -XR, XR) : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { HALF = v * 20; if (over !== null) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "curtains",
  means: "A window with two folded curtains: the panels draw apart around the pointer, opening the window there.",
  rules: [1, 3, 5, 8],
  range: [0.6, 1, 1.5],
  tour: [[119, 126], [210, 172], [273, 203], null],
  mount,
});
