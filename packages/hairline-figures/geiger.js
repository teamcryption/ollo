/**
 * Geiger: a counter box with a carry handle and a big dial on its top, its
 * probe lying on the ground in front. The pointer is the source: the nearer
 * it comes to the probe's tip, the higher the probe lifts and the further
 * the needle swings across the dial, on a spring. At rest the needle sits low, bright. The slider is the
 * probe's reach.
 *
 * The pattern: one continuous reading (gauge).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, seg, spring, stepS, unproj, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 76, D = 46, H = 26, DX = 38, DY = 27, R = 19, TIP = [64, 66], REST = 0.14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, 72, 0], [W, 72, 0], [12, 7, H + 16], [W, D, H], [TIP[0], 72, 28]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // body
  const [br, bi] = rings(0, 0, W, D, 6, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // carry handle: two posts and a grip, at the back of the top
  for (const x of [10, W - 16]) { const [pr, pi] = rings(x, 4, x + 6, 10, 2, 0.8); put(solid(g), prism(P, front, pr, pi, H, H + 12)); }
  const [hr, hi] = rings(10, 4, W - 10, 10, 3, 1);
  put(solid(g), prism(P, front, hr, hi, H + 12, H + 16));

  // dial on the top face: an arc, its ticks and a pivot
  const at = (th, r) => P(DX + r * Math.cos(th), DY - r * Math.sin(th), H);
  const TH = (f) => Math.PI * (0.88 - 0.76 * f);
  const arc = []; for (let i = 0; i <= 24; i++) arc.push(at(TH(i / 24), R));
  mk("path", { d: open(arc), class: "nf lo" }, g);
  let ticks = ""; for (let i = 0; i <= 6; i++) ticks += seg(at(TH(i / 6), R + 1.2), at(TH(i / 6), R + (i % 3 ? 3.4 : 5)));
  mk("path", { d: ticks, class: "nf lo" }, g);
  const needle = mk("path", { class: "nf sil hi" }, g);
  const pivot = []; for (let i = 0; i < 12; i++) pivot.push(at((i / 12) * 2 * Math.PI, 2.2));
  mk("path", { d: poly(pivot), class: "nf" }, g);
  // a speaker grille: three slots on the top, right of the dial
  let gr = ""; for (let i = 0; i < 3; i++) gr += seg(P(W - 12 + i * 3, 22, H), P(W - 12 + i * 3, 36, H));
  mk("path", { d: gr, class: "nf lo" }, g);

  // the cable, a dashed lead from the body to the probe's grip; the probe, a cylinder lying along x
  const cable = mk("path", { class: "nf dash" }, g);
  const tube = (x0, x1, r, y, z) => { const pts = []; for (let i = 0; i < 20; i++) { const a = (i / 20) * 2 * Math.PI; for (const x of [x0, x1]) pts.push(P(x, y + r * Math.cos(a), z + r * Math.sin(a))); } return pts; };
  const grip = mk("path", { class: "sil" }, g), head = mk("path", { class: "sil" }, g), cap = mk("path", { class: "nf lo" }, g);
  function probe(f) {
    const z = 22 * f, c = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12; c.push(P(6 + t * 4, D + t * (66 - D), 9 * (1 - t) * (1 - t) + (4 + z) * t)); }
    cable.setAttribute("d", open(c));
    grip.setAttribute("d", poly(hull(tube(10, 34, 3.4, 66, 3.4 + z))));
    head.setAttribute("d", poly(hull(tube(32, TIP[0], 5.4, 66, 5.4 + z))));
    const e = []; for (let i = 0; i < 20; i++) { const a = (i / 20) * 2 * Math.PI; e.push(P(TIP[0], 66 + 4 * Math.cos(a), 5.4 + z + 4 * Math.sin(a))); }
    cap.setAttribute("d", poly(e));
  }

  const sp = spring(REST);
  let last = NaN;
  function draw(f) {
    if (f === last) return;
    last = f;
    const th = TH(clamp(f, 0, 1));
    needle.setAttribute("d", open([at(th + Math.PI, 4), at(th, R - 1.5)]));
    probe(clamp(f, 0, 1));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(REST);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    const d = Math.hypot(x - TIP[0], y - TIP[1]);
    const f = clamp(1 - d / reach, 0.03, 1);
    sp.t = f;
    read.textContent = Math.round(f * 900) + " cpm";
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "geiger",
  means: "A Geiger counter: bring the pointer near the probe and it lifts toward it while the needle on the dial swings up the scale.",
  rules: [3, 5, 8],
  range: [60, 110, 160],
  tour: [[193, 243], [150, 238], [214, 134], null],
  mount,
});
