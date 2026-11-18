/**
 * Skip lorry: a cab and flat chassis on three axles with two lifting arms
 * pivoting at the back, a flared skip hung from their tips on chains. The
 * nearer the pointer comes, the further the arms swing up and over the tail,
 * carrying the skip off the bed and down behind the lorry. At rest the skip
 * rides on the bed, its rim bright. The slider sets how far the arms swing.
 */
const {
  Cam, circ, clamp, fit, facing, hull, lerp, open, poly, prism, proj, rad, rings, ringAt, rrect, run, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = -22, PZ = 20, L = 50, CH = 10, SH = 18, A0 = 32, A1 = 168, REST = 0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-92, -12, 0], [58, 16, 0], [58, -14, 48], [-92, 12, 0], [-22, 0, 72], [-60, -12, 60]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => { const pts = circ(8, 18).map((q) => P(x + q.u, y, 8 + q.v)); return mk("path", { class: "sil", d: poly(pts) + seg(P(x, y, 8), P(x + 2.5, y, 8)) }, g); };
  [-46, -32, 40].forEach((x) => wheel(x, -13));
  const [cr, ci] = rings(-52, -12, 58, 12, 2, 1);
  put(solid(g), prism(P, front, cr, ci, 9, 15));
  const arm = (y) => mk("path", { class: "sil" }, g);
  const farArm = arm(-15), skip = solid(g), chains = mk("path", { class: "nf lo" }, g), nearArm = arm(15);
  const cab = solid(g);
  const [kr, ki] = rings(34, -13, 58, 13, 5, 1.4);
  put(cab, prism(P, front, kr, ki, 15, 48));
  mk("path", { class: "nf lo", d: open([P(58, -10, 30), P(58, -10, 44), P(58, 10, 44), P(58, 10, 30)]) + seg(P(46, 13, 22), P(46, 13, 44)) }, g);
  [-46, -32, 40].forEach((x) => wheel(x, 13));
  skip.sil.classList.add("hi");
  const foot = rrect(-13, -10, 13, 10, 2, 4), top = rrect(-19, -11, 19, 11, 2, 4), inner = rrect(-17.6, -9.6, 17.6, 9.6, 1.2, 4);
  const at = (ring, dx) => ring.map((q) => ({ ...q, u: q.u + dx }));
  const armPath = (y, tx, tz) => {
    const dx = tx - PX, dz = tz - PZ, n = Math.hypot(dx, dz), ox = -dz / n * 2, oz = dx / n * 2;
    return poly([P(PX + ox, y, PZ + oz), P(tx + ox, y, tz + oz), P(tx - ox, y, tz - oz), P(PX - ox, y, PZ - oz)]);
  };

  let last = NaN;
  function draw(p) {
    if (p === last) return;
    last = p;
    const th = rad(lerp(A0, A1, p)), tx = PX + L * Math.cos(th), tz = PZ + L * Math.sin(th);
    const z1 = tz - CH, z0 = z1 - SH;
    farArm.setAttribute("d", armPath(-15, tx, tz));
    nearArm.setAttribute("d", armPath(15, tx, tz));
    skip.sil.setAttribute("d", poly(hull(ringAt(P, at(foot, tx), z0).concat(ringAt(P, at(top, tx), z1)))));
    skip.cr.setAttribute("d", open(ringAt(P, run(at(inner, tx), front), z1)));
    chains.setAttribute("d", [-1, 1].map((s) => seg(P(tx, 15 * s, tz), P(tx - 16, 11 * s, z1)) + seg(P(tx, 15 * s, tz), P(tx + 16, 11 * s, z1))).join(""));
  }

  const swing = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(swing, dt); draw(swing.x); return m; });
  bag.add(B.unregister);
  const ax = P(-10, 0, 24);

  function aim(pt) {
    const d = Math.hypot(pt[0] - ax[0], (pt[1] - ax[1]) * 0.7);
    if (d > 150) return leave();
    swing.t = clamp(1.2 - d / 120, 0.12, 1) * (0.3 + 0.7 * reach / 100);
    read.textContent = Math.round(lerp(A0, A1, swing.t)) + "°";
    B.wake();
  }
  function leave() { swing.t = REST; read.textContent = "rest"; B.wake(); }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "skiplorry",
  means: "A skip lorry: the nearer the pointer, the further its two arms swing up over the tail, lifting the skip off the bed and down behind.",
  rules: [1, 3, 5, 8],
  range: [0, 70, 100],
  tour: [[264, 165], [205, 200], [150, 165], null],
  mount,
});
