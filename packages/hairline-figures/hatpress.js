/**
 * Hat block: a milliner's wooden crown block seated in its brim board, a
 * wide round flange on a low foot. The pointer draws the crown block up out
 * of the brim, higher the nearer it comes to the middle, and the brim stays
 * put. At rest the crown sits a little proud, its tie groove bright. The
 * slider is how high the crown may lift.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, ringAt, run, clamp, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BR = 50, CR = 27, FZ = 5, BZ = 11, CH = 30, REST = 7;
const disc = (r, n = 48) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxLift = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-BR, -BR, 0], [BR, BR, 0], [-BR, BR, 0], [BR, -BR, 0], [0, 0, BZ + 70 + CH + 12]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(34), disc(31), 0, FZ));
  put(solid(g), prism(P, front, disc(BR), disc(BR - 3), FZ, BZ));
  mk("path", { d: poly(ringAt(P, disc(CR + 3), BZ)), class: "nf lo" }, g);
  const cg = solid(g), groove = mk("path", { class: "nf hi" }, g), seam = mk("path", { class: "nf lo" }, g);

  const lift = spring(REST);
  let last = NaN;
  function draw(z) {
    if (Math.abs(z - last) < 0.01) return;
    last = z;
    const z0 = BZ + z, pts = [];
    pts.push(...ringAt(P, disc(CR), z0));
    const prof = [[CR, 0], [CR, CH * 0.6], [CR - 1.5, CH * 0.78], [CR - 5, CH * 0.92], [CR - 11, CH * 1.0], [CR - 19, CH * 1.05], [4, CH * 1.08]];
    for (const [r, h] of prof) pts.push(...ringAt(P, disc(r), z0 + h));
    put(cg, { sil: poly(hull(pts)), crease: "" });
    groove.setAttribute("d", open(ringAt(P, run(disc(CR), front), z0 + 8)));
    seam.setAttribute("d", open(ringAt(P, run(disc(CR - 1.5), front), z0 + CH * 0.78)));
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(lift, dt); draw(lift.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [gx, gy] = unproj(C, sx, sy, BZ);
    const d = Math.hypot(gx, gy);
    if (d > 110) return leave();
    const f = clamp(1 - (d - 10) / 90, 0.12, 1);
    lift.t = REST + (maxLift - REST) * f;
    read.textContent = "lift " + Math.round(lift.t);
    B.wake();
  }
  function leave() { lift.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxLift = v; }, destroy: bag.dispose };
}

hairline({
  name: "hatpress",
  means: "A milliner's crown block seated in its brim board: the pointer draws the crown up out of the brim, higher toward the middle.",
  rules: [1, 3, 5, 8],
  range: [30, 55, 70],
  tour: [[248, 251], [200, 227], [136, 259], null],
  mount,
});
