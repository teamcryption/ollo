/**
 * Parking barriers: a car park entrance of three lanes, each with a curb
 * island holding a ticket machine and a post whose barrier arm lies across
 * the lane. The pointer picks a lane by where it stands: its arm raises, and
 * the arms beside it raise partly, staggered from it. At rest one arm is half
 * up, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the lane
 * whose resting arm middle is nearest the pointer's x on screen.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 38, ARM = 30, PZ = 17, FAV = 1, REST = [0, 38, 6], UP = [82, 26, 8];
const X1 = (N - 1) * STEP + ARM + 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-12, -14, 0], [X1, 16, 0], [X1, -14, 0], [-12, 16, 0], [0, 0, PZ + ARM + 2], [2 * STEP, 0, PZ + ARM + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  { const [r, i] = rings(-12, -14, X1, 16, 4, 1.6); put(solid(g), prism(P, front, r, i, -3, 0)); }

  const gates = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    { const [r, i] = rings(x - 9, -10, x + 3, 12, 3, 1); put(solid(grp), prism(P, front, r, i, 0, 2)); }
    { const [r, i] = rings(x - 7.5, 3, x - 1.5, 9, 1.4, 0.6); put(solid(grp), prism(P, front, r, i, 2, 16)); }
    mk("path", { d: seg(P(x - 1.5, 4.5, 12), P(x - 1.5, 7.5, 12)) + seg(P(x - 1.5, 4.5, 9), P(x - 1.5, 7.5, 9)), class: "nf lo" }, grp);
    { const [r, i] = rings(x - 2, -2, x + 2, 2, 1.2, 0.5); put(solid(grp), prism(P, front, r, i, 2, PZ + 2)); }
    const arm = mk("path", { class: "sil" }, grp), marks = mk("path", { class: "nf lo" }, grp);
    gates.push({ k, x, arm, marks, a: tween(REST[k]), last: NaN });
  }

  function draw(gt, deg) {
    if (deg === gt.last) return;
    gt.last = deg;
    const t = rad(deg), d = [Math.cos(t), Math.sin(t)], n = [-d[1], d[0]], x0 = gt.x + 1, z0 = PZ;
    const pt = (s, w, y) => P(x0 + d[0] * s + n[0] * w, y, z0 + d[1] * s + n[1] * w);
    const pts = [];
    for (const y of [-1, 1]) for (const [s, w] of [[-2, -1.3], [-2, 1.3], [ARM, -1], [ARM, 1]]) pts.push(pt(s, w, y));
    gt.arm.setAttribute("d", poly(hull(pts)));
    let m = "";
    for (const s of [8, 16, 24]) m += seg(pt(s, -1, 1), pt(s, 1, 1));
    gt.marks.setAttribute("d", m);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const gt of gates) { draw(gt, tval(gt.a, now)); if (!tdone(gt.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = gates.map((gt) => P(gt.x + ARM / 2, 0, PZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    gates.forEach((gt, k) => {
      const deg = a < 0 ? REST[k] : UP[Math.min(2, Math.abs(k - a))];
      tset(gt.a, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      gt.arm.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "gate " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "parkingbarriers",
  means: "A car park entrance with three barrier arms: the arm under the pointer raises, and its neighbours raise partly.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[142, 142], [207, 174], [272, 206], null],
  mount,
});
