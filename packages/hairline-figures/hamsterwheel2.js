/**
 * Pet stroller: a deep pet carriage on four wheels with a push handle and a
 * folding canopy hinged over its back half. The canopy swings forward over
 * the carriage as the pointer moves toward its front, and folds back as it
 * moves away. At rest it is half raised, bright. The slider is its reach.
 *
 * The pattern: a continuous reach (a spring on one angle); the hit is on the
 * floor's plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, hull, lerp, poly, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HX = -8, HZ = 38, R = 26, REST = 0.3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-50, -20, 0], [32, 20, 0], [32, -20, 0], [-50, 20, 0], [-50, 0, 66], [18, 0, 60], [-34, 0, 66]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => { const pts = []; for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(x + 7 * Math.cos(t), y, 7 + 7 * Math.sin(t))); } mk("path", { d: poly(pts), class: "sil" }, g); };
  mk("path", { class: "nf sil", d: seg(P(-30, -14, 38), P(-48, -14, 64)) + seg(P(-30, 14, 38), P(-48, 14, 64)) + seg(P(-48, -15, 64), P(-48, 15, 64)) }, g);
  wheel(-22, -18); wheel(22, -18);
  mk("path", { class: "nf lo", d: seg(P(-22, -18, 7), P(-16, -14, 18)) + seg(P(22, -18, 7), P(16, -14, 18)) + seg(P(-22, 18, 7), P(-16, 14, 18)) + seg(P(22, 18, 7), P(16, 14, 18)) }, g);
  const [br, bi] = rings(-30, -16, 30, 16, 8, 2);
  put(solid(g), prism(P, front, br, bi, 18, 38));
  wheel(-22, 18); wheel(22, 18);
  const hood = mk("path", { class: "sil hi" }, g), ribs = mk("path", { class: "nf lo" }, g);
  const sp = spring(REST);
  let drawn = NaN;
  const at = (th, y) => P(HX + R * Math.cos(th), y, HZ + R * Math.sin(th));
  function draw() {
    const t = sp.x;
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    const end = lerp(Math.PI * 0.95, Math.PI * 0.12, clamp(t * reach, 0, 1)), pts = [];
    let d = "";
    for (let i = 0; i <= 12; i++) {
      const th = lerp(Math.PI, end, i / 12);
      pts.push(at(th, -17), at(th, 17));
      if (i % 3 === 0 && i > 0) d += seg(at(th, -17), at(th, 17));
    }
    hood.setAttribute("d", poly(hull(pts)));
    ribs.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function move(p) {
    if (!p) { sp.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    if (Math.abs(y) > 70 || x < -80 || x > 80) return move(null);
    sp.t = clamp((x + 40) / 70, 0, 1);
    read.textContent = "hood " + Math.round(sp.t * 100);
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => move(null) }));
  bag.add(() => svg.replaceChildren());
  move(null);
  return { set: (v) => { reach = v; drawn = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "hamsterwheel2",
  means: "A pet stroller on four wheels: its folding canopy swings forward over the carriage as the pointer moves to the front.",
  rules: [1, 3, 5, 8],
  range: [0.6, 1, 1],
  tour: [[145, 201], [210, 235], [276, 267], null],
  mount,
});
