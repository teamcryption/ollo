/**
 * Phone stand: a base plate with a hinged back leaf that folds up, a phone resting
 * on it. The pointer's x folds the leaf from flat to upright; the phone is bright.
 *
 * The pattern: one part answering one axis (a gesture, not a pick).
 */
const {
  Cam, clamp, fit, hull, lerp, poly, proj, rad, seg, spring, stepS, disposer, mk, pointer, register, solid,
} = HL;

const V = [0.612, 0.612, 0.5];
const add = (p, q, s = 1) => [p[0] + q[0] * s, p[1] + q[1] * s, p[2] + q[2] * s];
const rz = (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a), v[2]];
function corners([o, a, b, c]) {
  const r = [];
  for (const i of [0, 1]) for (const j of [0, 1]) for (const k of [0, 1]) r.push(add(add(add(o, a, i), b, j), c, k));
  return r;
}
// one box: its hull as the silhouette, the three edges from its nearest corner as the crease
function drawBox(P, s, box) {
  const cs = corners(box), sp = cs.map((q) => P(...q));
  let bi = 0, bd = -1e9;
  cs.forEach((q, i) => { const d = q[0] * V[0] + q[1] * V[1] + q[2] * V[2]; if (d > bd) { bd = d; bi = i; } });
  s.sil.setAttribute("d", poly(hull(sp)));
  s.cr.setAttribute("d", seg(sp[bi], sp[bi ^ 4]) + seg(sp[bi], sp[bi ^ 2]) + seg(sp[bi], sp[bi ^ 1]));
}

function build(t) {
  const f = rad(8 + t * 70), bd = [0, -Math.cos(f), Math.sin(f)], n = [0, Math.sin(f), Math.cos(f)];
  const o = [4, 44, 5];
  return [
    [[0, 0, 0], [64, 0, 0], [0, 54, 0], [0, 0, 5]],
    [[2, 46, 5], [60, 0, 0], [0, 6, 0], [0, 0, 7]],
    [o, [56, 0, 0], add([0, 0, 0], bd, 48), add([0, 0, 0], n, 3)],
    [add(add(add(o, [8, 0, 0]), bd, 1), n, 3), [40, 0, 0], add([0, 0, 0], bd, 78), add([0, 0, 0], n, 4)],
  ];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const pts = [0, 0.25, 0.5, 0.75, 1].flatMap((t) => build(t).flatMap(corners));
  const C0 = Cam(45, 0.5, 1);
  fit(C0, pts, 200, 160);
  const P0 = proj(C0), sp0 = pts.map((q) => P0(...q));
  const w = Math.max(...sp0.map((p) => p[0])) - Math.min(...sp0.map((p) => p[0]));
  const h = Math.max(...sp0.map((p) => p[1])) - Math.min(...sp0.map((p) => p[1]));
  const C = Cam(45, 0.5, Math.min(300 / w, 240 / h));
  fit(C, pts, 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const sols = build(0).map(() => solid(g));
  sols[3].sil.classList.add("hi");
  const sp = spring(0.4, { k: 90, c: 16 });
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    build(t).forEach((b, i) => drawBox(P, sols[i], b));
  }
  draw(0.4);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function aim(t) {
    sp.t = t;
    read.textContent = Math.round(8 + t * 70) + "°";
    B.wake();
  }
  read.textContent = "rest";
  // the pointer's screen x, not the moving part, sets the answer: nothing moves under it
  bag.add(pointer(stage, {
    move: ([sx]) => aim(lerp(0.4, clamp((sx - 90) / 220, 0, 1), reach)),
    leave: () => { sp.t = 0.4; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "phonestand",
  means: "A folding phone stand: the back leaf rises from flat to upright with the pointer, the phone leaning on it.",
  rules: [1, 3, 5, 6],
  range: [40, 85, 100],
  tour: [[204, 154], [280, 150], [130, 150], null],
  mount,
});
