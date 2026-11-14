/**
 * Prize wheel: a fairground wheel of eight wedges on a post, with a flapper
 * at its top. The pointer picks a wedge by where it sits at rest: the wheel
 * spins forward until that wedge stops under the flapper, and its edge goes
 * bright. At rest the wheel is still, one wedge up top, bright. The slider is
 * how many extra laps a spin takes.
 *
 * The pattern: one dial, turned to a chosen stop.
 */
const {
  Cam, fit, hull, poly, proj, rings, prism, facing, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 8, R = 46, CX = 50, CZ = 70, BY = 20, FY = 25, FAV = 2, TAU = Math.PI * 2;
// uneven wedges, as on a real prize wheel: the narrow one is the jackpot
const WT = [1, 1.6, 0.55, 1.2, 0.9, 1.4, 0.8, 1.3], SUM = WT.reduce((a, b) => a + b, 0);
const SPAN = WT.map((w) => (w / SUM) * TAU), START = [];
SPAN.reduce((a, w, k) => { START[k] = a; return a + w; }, 0);
const OFF = Math.PI / 2 - START[FAV] - SPAN[FAV] / 2;
const MID = SPAN.map((w, k) => OFF + START[k] + w / 2);

function mount({ stage, svg, read }, value) {
  let laps = value;
  const bag = disposer();
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[CX - R, FY, CZ - R], [CX + R, FY, CZ + R], [CX - R, BY, CZ], [CX + R, FY, CZ], [CX, FY, CZ + R + 8], [CX - 26, 4, 0], [CX + 26, 44, 0]], 200, 164);
  const P = proj(C), front = facing(C);
  const W = (r, a, y) => P(CX + r * Math.cos(a), y, CZ + r * Math.sin(a));
  const ring = (r, y, n = 48, a0 = 0) => Array.from({ length: n }, (_, i) => W(r, a0 + (i / n) * TAU, y));
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(CX - 26, 4, CX + 26, 44, 6, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 4));
  const [pr, pi] = rings(CX - 4, BY - 10, CX + 4, BY - 2, 2.5, 1);
  put(solid(g), prism(P, front, pr, pi, 4, CZ));
  mk("path", { d: poly(hull(ring(R, BY).concat(ring(R, FY)))), class: "sil" }, g);
  mk("path", { d: poly(ring(R - 2.5, FY)), class: "nf lo" }, g);
  const wedges = Array.from({ length: N }, () => mk("path", { class: "nf" }, g));
  mk("path", { d: poly(hull(ring(6, FY, 24).concat(ring(6, FY + 3, 24)))), class: "sil" }, g);
  // the flapper: a small tab standing at the top of the rim
  const t = CZ + R;
  mk("path", { d: poly([P(CX - 3, FY + 1, t + 9), P(CX + 3, FY + 1, t + 9), P(CX, FY + 1, t - 4)]), class: "sil" }, g);

  const rot = tween(0);
  let last = NaN;
  function draw(r) {
    if (r === last) return;
    last = r;
    wedges.forEach((w, k) => {
      const a0 = OFF + START[k] + r, A = SPAN[k], pts = [];
      for (let i = 0; i <= 8; i++) pts.push(W(R - 4, a0 + (i / 8) * A, FY));
      pts.push(W(8, a0 + A, FY), W(8, a0, FY));
      w.setAttribute("d", poly(pts));
    });
  }

  const B = register(stage, (_dt, now) => { draw(tval(rot, now)); return !tdone(rot, now); });
  bag.add(B.unregister);

  // rule 01: pick in the wheel's rest frame, by the pointer's angle on its face
  const o = P(CX, FY, CZ), ex = P(CX + 1, FY, CZ), ez = P(CX, FY, CZ + 1);
  const a1 = ex[0] - o[0], b1 = ex[1] - o[1], a2 = ez[0] - o[0], b2 = ez[1] - o[1], det = a1 * b2 - a2 * b1;
  function hit([sx, sy]) {
    const dx = sx - o[0], dy = sy - o[1], u = (dx * b2 - a2 * dy) / det, v = (a1 * dy - dx * b1) / det;
    if (Math.hypot(u, v) > R + 4 || Math.hypot(u, v) < 8) return -1;
    const t = ((Math.atan2(v, u) - OFF) % TAU + TAU) % TAU;
    return START.findIndex((s0, k) => t >= s0 && t < s0 + SPAN[k]);
  }

  let act = -2, goal = 0;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const k = a < 0 ? FAV : a;
    // spin forward (clockwise) to bring wedge k under the flapper, plus extra laps
    let want = Math.PI / 2 - MID[k], d = ((goal - want) % TAU + TAU) % TAU;
    if (a >= 0) d += Math.round(laps) * TAU;
    goal -= d;
    tset(rot, goal, performance.now(), 0);
    wedges.forEach((w, i) => w.classList.toggle("hi", i === k));
    wedges[N - 1].after(wedges[k]);
    read.textContent = a < 0 ? "rest" : "slot " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { laps = v; }, destroy: bag.dispose };
}

hairline({
  name: "pinwheels",
  means: "A prize wheel of eight uneven wedges on a post: point at a wedge and the wheel spins until it stops under the flapper.",
  rules: [1, 3, 5, 6],
  range: [0, 1, 2],
  tour: [[200, 76], [246, 155], [154, 128], null],
  mount,
});
