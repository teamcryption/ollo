/**
 * Monitor lamp: a monitor on a swivel stand with a light bar clipped on its top
 * edge. The pointer's x turns the monitor; the light bar is the bright mark.
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
  const th = rad(-15 + t * 120), L = (o, a, b, c) => [rz(o, th), rz(a, th), rz(b, th), rz(c, th)];
  return [
    [[-24, -24, 0], [48, 0, 0], [0, 48, 0], [0, 0, 3]],
    L([-8, -4, 3], [6, 0, 0], [0, 8, 0], [0, 0, 34]),
    L([-3, -60, 24], [5, 0, 0], [0, 120, 0], [0, 0, 66]),
    L([-7, -4, 86], [6, 0, 0], [0, 8, 0], [0, 0, 6]),
    L([-1, -48, 90], [10, 0, 0], [0, 96, 0], [0, 0, 5]),
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
  sols[4].sil.classList.add("hi");
  const sp = spring(0.35, { k: 90, c: 16 });
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    build(t).forEach((b, i) => drawBox(P, sols[i], b));
  }
  draw(0.35);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function aim(t) {
    sp.t = t;
    read.textContent = "turn " + Math.round(-15 + t * 120) + "°";
    B.wake();
  }
  read.textContent = "rest";
  // the pointer's screen x, not the moving part, sets the answer: nothing moves under it
  bag.add(pointer(stage, {
    move: ([sx]) => aim(lerp(0.35, clamp((sx - 90) / 220, 0, 1), reach)),
    leave: () => { sp.t = 0.35; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "kbdlight",
  means: "A monitor with a light bar on its top edge: the screen turns on its stand with the pointer, the bar riding along.",
  rules: [1, 3, 5, 6],
  range: [40, 85, 100],
  tour: [[200, 90], [290, 120], [120, 120], null],
  mount,
});
