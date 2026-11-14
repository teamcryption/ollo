/**
 * Model house: an architect's model on a board, a box house with a door and
 * windows under a pitched roof, an inside wall drawn across its open top. The
 * pointer near the model lifts the roof off to show the plan: the closer, the
 * higher, on a spring. At rest the roof sits a little raised, bright. The
 * slider is the highest lift.
 *
 * The pattern: one part answering the pointer's distance (terrain).
 */
const {
  Cam, clamp, fit, facing, fillet, open, poly, prism, proj, rings, seg, spring, stepS, unproj, hull,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = 0, X1 = 70, Y0 = 0, Y1 = 46, H = 34, RH = 22, E = 4, REST = 5, RAD = 90;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-14, -14, 0], [X1 + 14, Y1 + 14, 0], [X1 + 14, -14, 0], [-14, Y1 + 14, 0], [X0, (Y0 + Y1) / 2, H + 40 + RH], [X1, (Y0 + Y1) / 2, H + 40 + RH]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-14, -14, X1 + 14, Y1 + 14, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  const [hr, hi] = rings(X0, Y0, X1, Y1, 2, 1.4);
  put(solid(g), prism(P, front, hr, hi, 3, 3 + H));
  // the plan: an inside wall across the open top
  mk("path", { d: seg(P(28, Y0 + 1.4, 3 + H), P(28, Y1 - 1.4, 3 + H)) + seg(P(28, 26, 3 + H), P(X1 - 1.4, 26, 3 + H)), class: "nf lo" }, g);
  const rect = (pts) => poly(fillet(pts, [0.8, 0.8, 0.8, 0.8], 2));
  // door and windows on the +y face, the one facing the viewer
  mk("path", { d: rect([P(44, Y1, 3), P(54, Y1, 3), P(54, Y1, 23), P(44, Y1, 23)]), class: "nf lo" }, g);
  for (const wx of [10, 26]) mk("path", { d: rect([P(wx, Y1, 16), P(wx + 9, Y1, 16), P(wx + 9, Y1, 26), P(wx, Y1, 26)]), class: "nf lo" }, g);
  mk("path", { d: rect([P(X1, 16, 14), P(X1, 30, 14), P(X1, 30, 25), P(X1, 16, 25)]), class: "nf lo" }, g);

  const roof = mk("path", { class: "sil hi" }, g), ridge = mk("path", { class: "nf lo" }, g);
  const sp = spring(REST);
  let last = NaN;
  const ym = (Y0 + Y1) / 2;
  function draw(z) {
    if (z === last) return;
    last = z;
    const b = 3 + H + z, a = [X0 - E, Y0 - E, b], c = [X1 + E, Y0 - E, b], d = [X1 + E, Y1 + E, b], e = [X0 - E, Y1 + E, b];
    const r0 = [X0 - E, ym, b + RH], r1 = [X1 + E, ym, b + RH];
    const pts = [a, c, d, e, r0, r1].map((q) => P(...q));
    roof.setAttribute("d", poly(hull(pts)));
    ridge.setAttribute("d", seg(P(...r0), P(...r1)) + open([P(...d), P(...r1)]) + seg(P(...c), P(...r1)));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    const d = Math.hypot(x - (X0 + X1) / 2, y - ym);
    sp.t = d > RAD ? REST : clamp(REST + (top - REST) * (1 - d / RAD) * 1.4, REST, top);
    read.textContent = d > RAD ? "rest" : "lift " + Math.round(sp.t);
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  draw(REST);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = v; }, destroy: bag.dispose };
}

hairline({
  name: "modelhouse",
  means: "An architect's model house on a board: the pointer's nearness lifts the pitched roof off to show the plan inside.",
  rules: [1, 3, 5, 8],
  range: [20, 36, 40],
  tour: [[84, 229], [200, 235], [211, 293], null],
  mount,
});
