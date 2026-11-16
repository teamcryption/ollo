/**
 * Milk churn: a tall dairy churn with a shoulder, a narrow neck and a
 * mushroom lid, standing on a low plank. The pointer tips it: the further
 * across the plank it stands, the further the churn rocks onto its rim, as
 * if to pour. At rest it leans a touch, its lid bright. The slider is how
 * far it can tip.
 *
 * The pattern: one part answering where the pointer stands (terrain).
 */
const { Cam, circ, clamp, fit, facing, hull, poly, open, prism, proj, rad, rings, run, spring, stepS, unproj, disposer, mk, pointer, put, register, solid } = HL;

const CX = 40, CY = 30, R = 15, PZ = 4;
const BODY = [[R, 0], [R + 1, 1], [R + 1, 5], [R, 6], [R, 40], [R - 3, 46], [8, 51], [8, 58]];
const LID = [[11, 58], [11, 60], [7, 62], [3, 62], [3, 66], [5, 66]];
const SIDE = [[R + 1, 3], [R, 40], [8, 51]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.3), front = facing(C);
  const ring = circ(1, 36);
  const tilt = (a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return (q, r, z) => { const dx = q.u * r + R, x = CX - R + dx * c + z * s; return [x, CY + q.v * r, PZ - dx * s + z * c]; }; };
  const pts = (T, prof) => prof.flatMap(([r, z]) => ring.map((q) => T(q, r, z)));
  fit(C, [[0, 0, 0], [80, 60, 0], ...pts(tilt(0), BODY.concat(LID)), ...pts(tilt(45), BODY.concat(LID))], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const [p0, p1] = rings(4, 6, 84, 54, 3, 1.2);
  put(solid(g), prism(P, front, p0, p1, 0, PZ));
  const body = mk("path", { class: "sil" }, g), band = mk("path", { class: "nf lo" }, g), lid = mk("path", { class: "sil" }, g), knob = mk("path", { class: "nf" }, g);
  const half = run(ring, front);
  const sp = spring(5);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const T = tilt(a), Q = (prof) => hull(pts(T, prof).map((p) => P(...p)));
    body.setAttribute("d", poly(Q(BODY)));
    band.setAttribute("d", SIDE.map(([r, z]) => open(half.map((q) => P(...T(q, r, z))))).join(""));
    lid.setAttribute("d", poly(Q(LID.slice(0, 3))));
    knob.setAttribute("d", poly(Q(LID.slice(2))));
  }
  lid.classList.add("hi");
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function move([sx, sy]) {
    const [u, v] = unproj(C, sx, sy, 0);
    if (u < -10 || u > 100 || v < -30 || v > 80) return leave();
    const a = clamp((u - 10) / 70, 0.35, 1) * maxA;
    sp.t = a; read.textContent = Math.round(a) + "°"; B.wake();
  }
  function leave() { sp.t = 5; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "milkchurn",
  means: "A milk churn on a plank: the pointer rocks it onto its rim as if to pour, further the further across it goes.",
  rules: [1, 3, 5, 6],
  range: [20, 32, 42],
  tour: [[218, 216], [242, 237], [136, 184], null],
  mount,
});
