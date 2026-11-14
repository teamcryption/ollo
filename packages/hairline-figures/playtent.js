/**
 * Play tent: a kids' teepee on a play mat, poles crossing above its peak,
 * a door cut into its front face. The pointer's distance to the tent opens
 * the door flap: it swings out on its hinge edge the nearer the hand comes.
 * At rest the flap stands a little open, bright. The slider is the reach.
 *
 * The pattern: one part answering a continuous value (spring).
 */
const {
  Cam, fit, facing, hull, open, poly, proj, rrect, ringAt, run, seg, spring, stepS, unproj, clamp, rings, prism,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 60, H = 70, T0 = 26, T1 = 34, REST = 0.15;
const yAt = (z) => W - (W - T1) * z / H;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-14, -14, 0], [W + 14, W + 14, 0], [W + 14, -14, 0], [-14, W + 14, 0], [30, 30, H + 18]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(-14, -14, W + 14, W + 14, 8, 2);
  put(solid(g), prism(P, front, mr, mi, 0, 1.5));

  // poles, behind the cover where they cross above it
  const poles = mk("path", { class: "nf" }, g);
  let pd = "";
  for (const [x, y] of [[0, 0], [W, 0], [0, W], [W, W]]) {
    const a = [x, y, 1.5], b = [30 + (30 - x) * -0.32, 30 + (30 - y) * -0.32, H + 16];
    const tx = T0 + (x ? T1 - T0 : 0), ty = T0 + (y ? T1 - T0 : 0);
    pd += seg(P(tx, ty, H), P(b[0], b[1], b[2]));
  }
  poles.setAttribute("d", pd);

  // the cover: a tapered solid, foot to top
  const foot = rrect(0, 0, W, W, 8, 4), top = rrect(T0, T0, T1, T1, 2, 4), inner = rrect(T0 + 1.2, T0 + 1.2, T1 - 1.2, T1 - 1.2, 1, 4);
  put(solid(g), {
    sil: poly(hull(ringAt(P, foot, 1.5).concat(ringAt(P, top, H)))),
    crease: open(ringAt(P, run(inner, front), H)),
  });

  // the doorway on the +y face, then its flap hinged on the right edge
  const L = [12, W, 1.5], R = [48, W, 1.5], A = [30, yAt(52), 52];
  mk("path", { d: poly([P(...L), P(...R), P(...A)]), class: "nf lo" }, g);
  const flap = mk("path", { class: "sil hi" }, g);

  const ax = [R[0] - A[0], R[1] - A[1], R[2] - A[2]], al = Math.hypot(...ax), u = ax.map((v) => v / al);
  function rot(p, th) {
    const v = [p[0] - A[0], p[1] - A[1], p[2] - A[2]], c = Math.cos(th), s = Math.sin(th);
    const d = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
    const cx = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    return [0, 1, 2].map((i) => A[i] + v[i] * c + cx[i] * s + u[i] * d * (1 - c));
  }
  const sign = rot(L, 0.3)[1] > rot(L, -0.3)[1] ? 1 : -1;

  const open_ = spring(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const F = rot(L, sign * t * 2.4);
    flap.setAttribute("d", poly([P(...F), P(...R), P(...A)]));
  }
  const B = register(stage, (dt) => { const m = stepS(open_, dt); draw(open_.x); return m; });
  bag.add(B.unregister);
  draw(REST);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0), d = Math.hypot(x - 30, y - 30);
    const t = clamp(1 - (d - 20) / (40 + reach), 0.08, 1);
    open_.t = t;
    read.textContent = "door " + Math.round(t * 100);
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => { open_.t = REST; read.textContent = "rest"; B.wake(); } }));
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "playtent",
  means: "A kids' teepee on a play mat: the nearer the pointer comes, the wider its door flap swings open on its hinge.",
  rules: [1, 3, 5, 8],
  range: [0, 40, 80],
  tour: [[155, 234], [200, 149], [200, 273], null],
  mount,
});
