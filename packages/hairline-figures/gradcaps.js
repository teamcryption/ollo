/**
 * Graduation caps: five mortarboards resting on a row of pegs along a stand,
 * each a round skull under a square board, a tassel hanging from one corner.
 * The pointer picks a cap by where it rests: it tosses up and tilts, and the
 * caps beside it hop a little and lean away, staggered from it. At rest one
 * cap is caught mid-toss, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fillet, fit, facing, hull, open, poly, prism, proj, rings, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, GAP = 34, X1 = (N - 1) * GAP, PEG = 30, HB = 12, SK = 8, LIFT = 34, TILT = 22, FAV = 1;
const YAW = [6, -10, 14, -4, 10];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.8);
  const TOPZ = PEG + LIFT + 14;
  fit(C, [[-14, -12, 0], [X1 + 14, 12, 0], [X1 + 14, -12, 0], [-14, 12, 0], [-14, -14, TOPZ], [X1 + 14, 14, TOPZ], [X1 + 14, -14, TOPZ], [-14, 14, TOPZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-14, -12, X1 + 14, 12, 6, 1.6);
  put(solid(g), prism(P, front, sr, si, 0, 5));
  for (let k = 0; k < N; k++) { const [r, i] = rings(k * GAP - 2.2, -2.2, k * GAP + 2.2, 2.2, 2.2, 0.8); put(solid(g), prism(P, front, r, i, 5, PEG)); }

  const caps = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), skull = mk("path", { class: "sil" }, grp), board = mk("path", { class: "sil" }, grp);
    const top = mk("path", { class: "nf lo" }, grp), cord = mk("path", { class: "nf" }, grp), tassel = mk("path", { class: "sil" }, grp);
    const rest = k === FAV ? 0.45 : 0;
    caps.push({ k, x: k * GAP, grp, skull, board, top, cord, tassel, lift: tween(rest), tilt: tween(rest), last: "" });
  }

  /** A cap's local point: yawed about its own axis, rolled about the view's depth axis, lifted onto its peg. */
  function xf(c, lift, roll) {
    const yw = rad(YAW[c.k]), ro = rad(roll), cy = Math.cos(yw), sy = Math.sin(yw), cr = Math.cos(ro), sr2 = Math.sin(ro);
    const n = [Math.SQRT1_2, Math.SQRT1_2, 0];
    return (u, v, w) => {
      const p = [u * cy - v * sy, u * sy + v * cy, w];
      const d = n[0] * p[0] + n[1] * p[1], cx = [n[1] * p[2], -n[0] * p[2], n[0] * p[1] - n[1] * p[0]];
      const q = p.map((pi, i) => pi * cr + cx[i] * sr2 + n[i] * d * (1 - cr));
      return P(c.x + q[0], q[1], PEG + 1 + lift + q[2]);
    };
  }
  const circle = (r, n = 20) => Array.from({ length: n }, (_, i) => [r * Math.cos((i / n) * Math.PI * 2), r * Math.sin((i / n) * Math.PI * 2)]);
  const square = (h) => fillet([[h, h], [-h, h], [-h, -h], [h, -h]], [1.6, 1.6, 1.6, 1.6]);
  const o0 = P(0, 0, 0), o1 = P(0, 0, 1), UZ = o0[1] - o1[1], UX = (P(1, -1, 0)[0] - o0[0]) / Math.SQRT2;

  function draw(c, lift, roll) {
    const key = lift.toFixed(3) + roll.toFixed(3);
    if (key === c.last) return;
    c.last = key;
    const T = xf(c, lift, roll);
    c.skull.setAttribute("d", poly(hull(circle(SK).flatMap(([u, v]) => [T(u, v, -7), T(u * 1.05, v * 1.05, 0)]))));
    const sq = square(HB);
    c.board.setAttribute("d", poly(hull(sq.flatMap(([u, v]) => [T(u, v, 0), T(u, v, 1.6)]))));
    c.top.setAttribute("d", poly(sq.map(([u, v]) => T(u * 0.92, v * 0.92, 1.6))));
    // the tassel: a cord from the button to the near corner, then hanging straight down
    const corner = T(HB - 1, HB - 1, 1.6), hang = (dz) => [corner[0], corner[1] + dz * UZ];
    c.cord.setAttribute("d", open([T(0, 0, 1.8), T(HB * 0.5, HB * 0.5, 1.8), corner, hang(6)]));
    const tz = [6, 13], tw = [0.9, 2];
    c.tassel.setAttribute("d", poly(hull([[-tw[0], tz[0]], [tw[0], tz[0]], [tw[1], tz[1]], [-tw[1], tz[1]]].map(([dx, dz]) => [corner[0] + dx * UX, corner[1] + dz * UZ]))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of caps) { draw(c, tval(c.lift, now) * LIFT, tval(c.tilt, now) * TILT); if (!tdone(c.lift, now) || !tdone(c.tilt, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = caps.map((c) => P(c.x, 0, PEG));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 20 && sy > mids[best][1] - 90 && sy < mids[best][1] + 30 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    caps.forEach((c, k) => {
      const dd = Math.abs(k - a), up = a < 0 ? (k === FAV ? 0.45 : 0) : dd === 0 ? 1 : dd === 1 ? 0.25 : 0;
      const lean = a < 0 ? (k === FAV ? 0.45 : 0) : dd === 0 ? 1 : dd === 1 ? 0.3 * Math.sign(k - a) : 0;
      const delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(c.lift, up, now, delay); tset(c.tilt, lean, now, delay);
      const on = k === (a < 0 ? FAV : a);
      c.board.classList.toggle("hi", on); c.skull.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "cap " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "gradcaps",
  means: "Five graduation caps on pegs: the cap under the pointer tosses up and tilts, and the caps beside it hop a little.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[135, 146], [244, 200], [200, 178], null],
  mount,
});
