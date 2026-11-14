/**
 * Scanner: an imaging gantry with its round bore and a patient bed on a
 * pedestal in front of it. The pointer's place along the bed's axis slides
 * the table into the bore or back out. At rest the table sits drawn out,
 * bright. The slider is the table's travel.
 *
 * The pattern: one part following the pointer along an axis (slide).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, unproj, clamp, spring, stepS, rrect,
  disposer, mk, pointer, put, register, solid,
} = HL;

const GX0 = 40, GX1 = 70, GY = 46, GZ = 92, BR = 26, BZ = 46, L = 96;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let travel = value;
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[GX0, -GY, 0], [GX1 + 150, GY, 0], [GX0, GY, GZ], [GX0, -GY, GZ], [GX1 + 160, -14, 30]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // floor plate
  const [fr, fi] = rings(GX0 - 8, -GY - 8, GX1 + 136, GY + 8, 8, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 3));
  // gantry: a deep rounded block, the bore cut in its front face
  const [gr, gi] = rings(GX0, -GY, GX1, GY, 12, 2);
  put(solid(g), prism(P, front, gr, gi, 3, GZ));
  const bore = (x, r) => { const pts = []; for (let i = 0; i < 48; i++) { const t = (i / 48) * Math.PI * 2; pts.push(P(x, r * Math.cos(t), BZ + r * Math.sin(t))); } return pts; };
  mk("path", { d: poly(bore(GX1, BR + 6)), class: "nf lo" }, g);
  mk("path", { d: poly(bore(GX1, BR)), class: "" }, g);
  mk("path", { d: poly(bore(GX0 + 10, BR)), class: "nf lo" }, g);
  // pedestal under the bed
  const [pr, pi] = rings(GX1 + 40, -12, GX1 + 100, 12, 6, 1.5);
  put(solid(g), prism(P, front, pr, pi, 3, BZ - 18));
  // the table
  const bed = solid(g);
  bed.sil.classList.add("hi");
  const s = spring(0.85);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const x0 = GX0 + 4 + v * travel;
    const [br, bi] = rings(x0, -14, x0 + L, 14, 8, 1.5);
    put(bed, prism(P, front, br, bi, BZ - 18, BZ - 13));
  }
  draw(s.x);

  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(s.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [wx] = unproj(C, sx, sy, 0);
    const v = clamp((wx - GX1) / 120, 0, 1);
    s.t = v;
    read.textContent = "bed " + Math.round(v * 100);
    B.wake();
  }
  function leave() { s.t = 0.85; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { travel = v; last = NaN; draw(s.x); }, destroy: bag.dispose };
}

hairline({
  name: "mriscanner",
  means: "A scanner gantry and its bed: the pointer's place along the bed slides the table into the round bore or back out.",
  rules: [1, 3, 5, 8],
  range: [60, 90, 110],
  tour: [[200, 160], [120, 120], [280, 200], null],
  mount,
});
