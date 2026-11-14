/**
 * Bag drop scale: a check-in belt with its weighing plate, a post behind it
 * with a gauge, and a suitcase on the belt. The pointer slides the suitcase
 * along the belt: the more of it stands on the plate, the lower the plate
 * sits and the higher the gauge reads. At rest the suitcase stands half on
 * the plate, bright. The slider is the plate's give.
 *
 * The pattern: one continuous input (a spring), the hit on the fixed plane of
 * the belt's top, which never moves.
 */
const {
  Cam, clamp, facing, fit, open, poly, prism, proj, rings, rrect, stepS, spring, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TOP = 6, BL = 30, BW = [6, 24], BH = 22, XMIN = -34, XMAX = 6, REST = -12, PX = [34, 46], PY = [-12, -3], PZ = 48;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let give = value;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[-42, -2, 0], [42, -2, 0], [42, 32, 0], [-42, 32, 0], [PX[0], PY[0], PZ], [XMIN, BW[0], TOP + BH + 3]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const post = solid(g);
  { const [r, i] = rings(PX[0], PY[0], PX[1], PY[1], 3, 1); put(post, prism(P, front, r, i, 0, PZ)); }
  const face = (x0, z0, x1, z1, r) => poly(rrect(x0, z0, x1, z1, r, 4).map((s) => P(s.u, PY[1], s.v)));
  mk("path", { class: "nf lo", d: face(PX[0] + 2.5, 26, PX[1] - 2.5, 44, 1.5) }, post.g);
  const gauge = mk("path", { class: "nf lo" }, post.g);

  const apron = solid(g);
  { const [r, i] = rings(-42, -2, -1, 32, 3, 1.2); put(apron, prism(P, front, r, i, 0, TOP)); }
  mk("path", { class: "nf lo", d: [8, 16, 24].map((y) => open([P(-40, y, TOP), P(-3, y, TOP)])).join("") }, apron.g);
  const plate = solid(g);
  const [pr, pi] = rings(1, -2, 42, 32, 3, 1.2);

  const suit = solid(g), handle = solid(g);
  const x = spring(REST);
  let last = NaN;

  function draw(bx) {
    if (bx === last) return;
    last = bx;
    const f = clamp((bx + BL - 1) / BL, 0, 1), sink = f * give;
    put(plate, prism(P, front, pr, pi, 0, TOP - sink));
    const z0 = TOP - (bx > 1 ? sink : 0);
    const [r, i] = rings(bx, BW[0], bx + BL, BW[1], 4, 1.4);
    put(suit, prism(P, front, r, i, z0, z0 + BH));
    const [hr, hi] = rings(bx + BL / 2 - 5, 13, bx + BL / 2 + 5, 17, 1.6, 0.6);
    put(handle, prism(P, front, hr, hi, z0 + BH, z0 + BH + 2.6));
    const xm = (PX[0] + PX[1]) / 2;
    gauge.setAttribute("d", open([P(xm, PY[1], 28), P(xm, PY[1], 28 + 14 * f)]));
    read.textContent = active ? "kg " + Math.round(23 * f) : "rest";
  }

  let active = false;
  const B = register(stage, (dt) => { const m = stepS(x, dt); draw(x.x); return m; });
  bag.add(B.unregister);

  // the hit: the pointer on the belt's top plane, which never moves
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, TOP);
    const on = wx > -46 && wx < 46 && wy > -8 && wy < 38;
    active = on;
    x.t = on ? clamp(wx - BL / 2, XMIN, XMAX) : REST;
    suit.sil.classList.toggle("hi", !on);
    gauge.setAttribute("class", on ? "nf hi" : "nf lo");
    last = NaN;
    B.wake();
  }
  move([-999, -999]);
  bag.add(pointer(stage, { move, leave: () => move([-999, -999]) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { give = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "luggagescale",
  means: "A bag drop scale: the pointer slides the suitcase onto the plate, which sinks as the gauge behind it climbs.",
  rules: [1, 3, 5, 8],
  range: [0, 1.5, 3],
  tour: [[139, 151], [198, 181], [257, 211], null],
  mount,
});
