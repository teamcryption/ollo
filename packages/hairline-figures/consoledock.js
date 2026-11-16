/**
 * Console dock: a handheld console standing in its dock, a controller on each end.
 * The pointer's x tilts the console back in its slot; the console body is bright.
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
  const p = rad(-12 + t * 60), up = [0, -Math.sin(p), Math.cos(p)], n = [0, Math.cos(p), Math.sin(p)];
  const o = [-6, 12, 6], at = (x) => add(o, [x, 0, 0]);
  return [
    [[0, 0, 0], [72, 0, 0], [0, 30, 0], [0, 0, 14]],
    [add(at(-16), n, -0.5), [16, 0, 0], add([0, 0, 0], n, 7), add([0, 0, 0], up, 52)],
    [at(0), [84, 0, 0], add([0, 0, 0], n, 6), add([0, 0, 0], up, 52)],
    [add(at(84), n, -0.5), [16, 0, 0], add([0, 0, 0], n, 7), add([0, 0, 0], up, 52)],
    [[0, 22, 0], [72, 0, 0], [0, 8, 0], [0, 0, 16]],
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
  sols[2].sil.classList.add("hi");
  const sp = spring(0.3, { k: 90, c: 16 });
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    build(t).forEach((b, i) => drawBox(P, sols[i], b));
  }
  draw(0.3);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function aim(t) {
    sp.t = t;
    read.textContent = "tilt " + Math.round(-12 + t * 60) + "°";
    B.wake();
  }
  read.textContent = "rest";
  // the pointer's screen x, not the moving part, sets the answer: nothing moves under it
  bag.add(pointer(stage, {
    move: ([sx]) => aim(lerp(0.3, clamp((sx - 90) / 220, 0, 1), reach)),
    leave: () => { sp.t = 0.3; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "consoledock",
  means: "A handheld console in its dock: the console tilts back in its slot with the pointer, a controller on each side.",
  rules: [1, 3, 5, 6],
  range: [40, 85, 100],
  tour: [[184, 103], [290, 140], [110, 140], null],
  mount,
});
