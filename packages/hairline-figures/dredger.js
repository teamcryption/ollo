/**
 * Dredger: a flat hull with a tall gantry carrying a long bucket ladder.
 * The pointer near the bow swings the ladder down into the water, steeper
 * the nearer it comes, and the bucket chain runs on along it. At rest the
 * ladder is raised, bright. The slider is the steepest swing.
 *
 * The pattern: one long arm turning on a pivot (tilt).
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, prism, proj, rad, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = 0, PZ = 50, L = 96, REST = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.6);
  const tipAt = (a) => [PX + L * Math.cos(rad(a)), 0, PZ - L * Math.sin(rad(a))];
  fit(C, [[-70, -26, 0], [40, 26, 0], [-70, 26, 0], [40, -26, 0], [0, 0, PZ + 8], tipAt(REST), tipAt(60), [PX + 30, 0, -10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  mk("path", { d: poly([P(-80, -36, 0), P(52, -36, 0), P(52, 36, 0), P(-80, 36, 0)]), class: "nf dash" }, g);
  const [hr, hi] = rings(-66, -22, 34, 22, 10, 1.8);
  put(solid(g), prism(P, front, hr, hi, 0, 14));
  const [cr, ci] = rings(-58, -14, -30, 14, 4, 1.4);
  put(solid(g), prism(P, front, cr, ci, 14, 34));
  const box = (x0, y0, z0, x1, y1, z1) => {
    const pts = [];
    for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) pts.push(P(x, y, z));
    return poly(hull(pts));
  };
  mk("path", { d: box(PX - 3, -16, 14, PX + 3, -12, PZ + 4) }, g);
  mk("path", { d: box(PX - 3, -16, PZ, PX + 3, 16, PZ + 5) }, g);
  const arm = mk("g", {}, g);
  const lad = mk("path", { class: "sil hi" }, arm);
  const rail = mk("path", { class: "nf lo" }, arm);
  const bk = mk("path", { class: "" }, arm);
  mk("path", { d: box(PX - 3, 12, 14, PX + 3, 16, PZ + 4) }, g);
  const ang = spring(REST), run = spring(0);
  let last = NaN;
  function draw(a, r) {
    const key = a.toFixed(2) + r.toFixed(2);
    if (key === last) return;
    last = key;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const at = (u, y, w) => P(PX + u * c + w * s, y, PZ - u * s + w * c);
    const pts = [];
    for (const u of [-4, L]) for (const y of [-6, 6]) for (const w of [-4, 2]) pts.push(at(u, y, w));
    lad.setAttribute("d", poly(hull(pts)));
    rail.setAttribute("d", open([at(0, -6, -4), at(L, -6, -4)]) + open([at(0, 6, 2), at(L - 4, 6, 2)]));
    let d = "";
    for (let i = 0; i < 6; i++) {
      const u = 10 + ((i * 16 + r) % 90);
      const q = [];
      for (const du of [-5, 5]) for (const y of [-7, 7]) for (const w of [-4, -13]) q.push(at(u + du * (w < -5 ? 1.3 : 1), y, w));
      d += poly(hull(q));
    }
    bk.setAttribute("d", d);
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); const n = stepS(run, dt); draw(ang.x, run.x); return m || n; });
  bag.add(B.unregister);

  const tp = P(...tipAt(REST + 10));
  let tgt = null, lastP = null;
  function turn(p) {
    lastP = p;
    let a = REST;
    if (p) {
      const dd = Math.hypot(p[0] - tp[0], p[1] - tp[1]);
      if (dd < 160) a = REST + (maxA - REST) * clamp(1.15 - dd / 140, 0.3, 1);
    }
    a = Math.round(a);
    if (a === tgt) return;
    tgt = a;
    ang.t = a;
    run.t = (a - REST) * 0.6;
    read.textContent = !p || a === REST ? "rest" : "ladder " + a + "°";
    B.wake();
  }
  turn(null);
  draw(REST, 0);
  bag.add(pointer(stage, { move: turn, leave: () => turn(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; tgt = null; turn(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "dredger",
  means: "A bucket-ladder dredger: the pointer near the bow swings the long ladder down into the water and the bucket chain runs on.",
  rules: [1, 3, 5, 6],
  range: [35, 48, 60],
  tour: [[292, 171], [254, 150], [196, 128], null],
  mount,
});
