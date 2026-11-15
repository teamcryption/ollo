/**
 * Storage bed: a base, a headboard and a mattress platform hinged at the
 * head. The pointer's place along the bed sets the lift: nearer the foot,
 * the platform rises higher on its hinge and opens the storage well under
 * it. At rest the platform stands just ajar, bright. The slider is the
 * highest lift.
 *
 * The pattern: a single part following the pointer, a tilting answer.
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, prism, proj, rad, rings, ringAt, rrect, run, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const LN = 100, WD = 66, BZ = 24, HX = 4, REST = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 1.58);
  const up = rad(55);
  fit(C, [[-8, 0, 0], [LN, WD, 0], [LN, 0, 0], [-8, WD, 64], [HX + 100 * Math.cos(up), WD, BZ + 100 * Math.sin(up)], [HX + 100 * Math.cos(up), 0, BZ + 100 * Math.sin(up)]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [hr, hi] = rings(-8, -2, 0, WD + 2, 3, 1.4);
  put(solid(g), prism(P, front, hr, hi, 0, 64));
  const [br, bi] = rings(0, 0, LN, WD, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  // the storage well: its rim and a folded duvet inside
  mk("path", { d: poly(ringAt(P, rrect(5, 5, LN - 5, WD - 5, 2, 3), BZ)), class: "nf" }, g);
  mk("path", { d: poly(ringAt(P, rrect(40, 10, 80, 40, 3, 3), BZ - 0.1)) + poly(ringAt(P, rrect(44, 14, 76, 36, 2, 3), BZ - 0.1)), class: "nf lo" }, g);

  const lid = solid(mk("g", {}, g));
  const seam = mk("path", { class: "nf lo" }, lid.g);
  const pil = solid(lid.g);
  const ring = rrect(1, 1, LN - 1, WD - 1, 4, 4), inner = rrect(3, 3, LN - 3, WD - 3, 2.4, 4);
  const pr = rrect(8, 8, 26, WD - 8, 5, 4), pi = rrect(10, 10, 24, WD - 10, 3.4, 4);
  const a = spring(REST);
  let last = NaN;

  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const t = rad(deg), c = Math.cos(t), s = Math.sin(t);
    const R = (q, z) => P(HX + (q.u - HX) * c - (z - BZ) * s, q.v, BZ + (q.u - HX) * s + (z - BZ) * c);
    const at = (rg, z) => rg.map((q) => R(q, z));
    put(lid, { sil: poly(hull(at(ring, BZ + 0.4).concat(at(ring, BZ + 15)))), crease: poly(at(inner, BZ + 15)) });
    seam.setAttribute("d", open(run(ring, front).map((q) => R(q, BZ + 4))));
    put(pil, { sil: poly(hull(at(pr, BZ + 15).concat(at(pr, BZ + 20)))), crease: poly(at(pi, BZ + 20)) });
  }

  const B = register(stage, (dt) => {
    const moving = stepS(a, dt);
    draw(a.x);
    return moving;
  });
  bag.add(B.unregister);
  lid.sil.classList.add("hi");

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -20 || x > LN + 30 || y < -20 || y > WD + 20) return leave();
    const f = clamp(x / LN, 0, 1);
    a.t = REST + (clamp(top, 20, 55) - REST) * f;
    read.textContent = Math.round(a.t) + "°";
    B.wake();
  }
  function leave() { a.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = v; }, destroy: bag.dispose };
}

hairline({
  name: "bedframe",
  means: "A storage bed: the platform lifts on its head hinge, higher the nearer the pointer stands to the foot, opening the well under it.",
  rules: [1, 3, 5, 8],
  range: [20, 45, 55],
  tour: [[260, 255], [204, 227], [160, 205], null],
  mount,
});
