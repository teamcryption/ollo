/**
 * Compass set: a long flat case holding a drawing compass and a spare lead,
 * its lid hinged along the back edge. The pointer's x opens the lid about
 * the hinge, on a spring. At rest the lid stands half open, bright. The
 * slider is how far the lid can open.
 */
const {
  Cam, fit, proj, facing, rings, prism, rrect, hull, poly, open, clamp, lerp, rad,
  spring, stepS, mk, solid, put, register, pointer, disposer,
} = HL;

const W = 96, D = 46, BH = 12, LT = 6, REST = 55, PY = 0, PZ = BH;
const LID = [BH, BH + LT].flatMap((z) => rrect(0, 0, W, D, 5, 3).map((s) => [s.u, s.v, z]));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, -10, 0], [W, D, 0], [0, -10, D + 8], [W, D, D + 8]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 5, 2.5);
  put(solid(g), prism(P, front, br, bi, 0, BH));
  const z = BH;
  // the compass: a round head, two legs spread, a needle and a lead tip
  mk("path", { d: poly(rrect(14, 19, 22, 27, 4, 3).map((s) => P(s.u, s.v, z))), class: "nf" }, g);
  mk("path", { d: open([P(22, 21, z), P(70, 11, z), P(76, 10, z)]) + open([P(22, 25, z), P(68, 34, z), P(74, 36, z)]), class: "nf" }, g);
  mk("path", { d: open([P(16, 39, z), P(80, 39, z)]), class: "nf lo" }, g);
  const lid = mk("path", { class: "sil hi" }, g);

  const swing = (pts, a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return pts.map(([x, y, zz]) => { const dy = y - PY, dz = zz - PZ; return P(x, PY + dy * c - dz * s, PZ + dy * s + dz * c); }); };
  const draw = (a) => lid.setAttribute("d", poly(hull(swing(LID, a))));
  const sp = spring(REST);
  let last = NaN;
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); if (sp.x !== last) { last = sp.x; draw(sp.x); } return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    if (sx < 40 || sx > 360 || sy < 20 || sy > 300) return leave();
    const a = lerp(0, amp, clamp((sx - 100) / 200, 0, 1));
    sp.t = a;
    read.textContent = "open " + Math.round(a);
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "protractor2",
  means: "A drawing compass case: the pointer opens the hinged lid to show the compass lying inside.",
  rules: [1, 3, 5, 8],
  range: [0, 95, 100],
  tour: [[200, 205], [158, 141], [228, 241], null],
  mount,
});
