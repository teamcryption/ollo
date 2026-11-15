/**
 * Murphy bed: a wall cabinet whose bed panel swings down on its foot hinge.
 * The pointer's distance from the wall on the floor sets how far the bed
 * folds out; a spring follows it. At rest the bed stands a little ajar,
 * its panel bright. The slider is the widest it will open.
 *
 * The pattern: one part swinging on a hinge (swing).
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, prism, proj, rad, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 18, H = 86, ZH = 6, L = 76, T = 7, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -4, 0], [W + 4, -4, H + 6], [W + 4, D + L + T, 0], [-4, D + L + T, 0], [-4, -4, H + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the cabinet: a tall shallow case against the wall, with a dashed recess
  const [cr, ci] = rings(-4, -4, W + 4, D, 3, 1.6);
  put(solid(g), prism(P, front, cr, ci, 0, H + 6));
  const rec = mk("path", { class: "dash nf" }, g);
  rec.setAttribute("d", poly([P(3, D, ZH + 2), P(W - 3, D, ZH + 2), P(W - 3, D, H), P(3, D, H)]));
  for (let k = 0; k < 3; k++) mk("line", { class: "lo", x1: P(10 + k * 22, D, H - 14)[0], y1: P(10 + k * 22, D, H - 14)[1], x2: P(10 + k * 22 + 12, D, H - 14)[0], y2: P(10 + k * 22 + 12, D, H - 14)[1] }, g);
  // the bed: panel, mattress line, pillow and a fold-down leg
  const bed = mk("g", {}, g);
  const leg = mk("path", { class: "nf" }, bed);
  const panel = mk("path", { class: "sil" }, bed);
  const crease = mk("path", { class: "nf lo" }, bed);
  const pillow = mk("path", { class: "nf" }, bed);
  const sp = spring(REST);
  let last = NaN;

  // a point on the panel: x across, l along its length, w through its thickness
  function at(a, x, l, w) {
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    return P(x, D + l * s + w * c, ZH + l * c - w * s);
  }
  function draw(a) {
    if (a === last) return;
    last = a;
    const box = [];
    for (const x of [0, W]) for (const l of [0, L]) for (const w of [0, T]) box.push(at(a, x, l, w));
    panel.setAttribute("d", poly(hull(box)));
    crease.setAttribute("d", open([at(a, 3, 3, T), at(a, W - 3, 3, T), at(a, W - 3, L - 3, T), at(a, 3, L - 3, T), at(a, 3, 3, T)]));
    const pl = [];
    for (const x of [8, W - 8]) for (const l of [L - 20, L - 6]) for (const w of [T, T + 4]) pl.push(at(a, x, l, w));
    pillow.setAttribute("d", poly(hull(pl)));
    // the leg hangs from the foot end and reaches the floor once the bed is down
    const s = Math.sin(rad(a)), c = Math.cos(rad(a)), fy = D + (L - 4) * s, fz = ZH + (L - 4) * c;
    const lg = clamp((a - 50) / 40, 0, 1) * fz;
    leg.setAttribute("d", lg < 1 ? "" : poly(hull([P(6, fy, fz), P(10, fy, fz), P(6, fy, fz - lg), P(10, fy, fz - lg), P(W - 10, fy, fz), P(W - 6, fy, fz), P(W - 10, fy, fz - lg), P(W - 6, fy, fz - lg)])));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  let on = false;
  function move(p) {
    const [, y] = unproj(C, p[0], p[1], 0);
    const inside = y > -10 && y < D + L + 20;
    sp.t = inside ? clamp(((y - D) / L) * maxA * 1.3, 0, maxA) : REST;
    on = inside;
    panel.classList.toggle("hi", true);
    read.textContent = on ? Math.round(sp.t) + "°" : "rest";
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  panel.classList.add("hi");
  read.textContent = "rest";
  draw(REST);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "bunkbed2",
  means: "A Murphy bed in its wall cabinet: the nearer the pointer comes on the floor, the further the bed swings down on its hinge.",
  rules: [1, 3, 5, 8],
  range: [60, 90, 90],
  tour: [[241, 227], [169, 256], [125, 285], null],
  mount,
});
