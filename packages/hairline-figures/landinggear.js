/**
 * Landing gear: a main gear leg under a belly section, an oleo strut with a
 * pair of wheels on one axle. At rest the leg hangs down, raked a little,
 * the near wheel bright. The pointer over the figure retracts it: the leg
 * swings up on its hinge and folds the wheels into the bay. The slider is
 * how far the leg swings.
 *
 * The pattern: one part on a hinge, a discrete change on the 700ms tween.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HX = 96, HY = 44, HZ = 70, L1 = 30, L2 = 54, RW = 15, REST = 8;
const YS = [30, 58];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 86], [118, 0, 86], [0, 62, 86], [118, 62, 0], [HX + RW, YS[1] + 4, 0], [HX - RW - 4, YS[1] + 4, 0], [30, 62, 50]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const far = solid(g), strut = mk("path", { class: "sil" }, g), oleo = mk("path", { class: "sil" }, g), axle = mk("path", { class: "sil" }, g);
  const near = solid(g), hub = mk("path", { class: "nf lo" }, g);
  const [br, bi] = rings(0, 0, 118, 62, 10, 2);
  const belly = solid(g);
  put(belly, prism(P, front, br, bi, 70, 86));
  mk("path", { d: poly(hull([P(14, 62, 74), P(84, 62, 74), P(84, 62, 82), P(14, 62, 82)])), class: "nf lo" }, belly.g);

  const ang = tween(REST);
  let last = NaN;
  const along = (t, l) => [HX - l * Math.sin(t), HZ - l * Math.cos(t)];
  const disc = (cx, cz, y, r, n = 30) => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return P(cx + r * Math.cos(a), y, cz + r * Math.sin(a));
  });
  const blob = (pts, r) => pts.flatMap(([x, y, z]) => [[x - r, y, z], [x + r, y, z], [x, y - r, z], [x, y + r, z], [x, y, z - r], [x, y, z + r], [x - r * .7, y, z - r * .7], [x + r * .7, y, z + r * .7], [x - r * .7, y, z + r * .7], [x + r * .7, y, z - r * .7]].map((q) => P(...q)));

  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const t = (deg * Math.PI) / 180;
    const [mx, mz] = along(t, L1), [wx, wz] = along(t, L2);
    strut.setAttribute("d", poly(hull(blob([[HX, HY, HZ], [mx, HY, mz]], 5))));
    oleo.setAttribute("d", poly(hull(blob([[mx, HY, mz], [wx, HY, wz]], 3.2))));
    axle.setAttribute("d", poly(hull(blob([[wx, YS[0], wz], [wx, YS[1], wz]], 2.4))));
    for (const [s, y] of [[far, YS[0]], [near, YS[1]]]) {
      put(s, { sil: poly(hull(disc(wx, wz, y - 5, RW).concat(disc(wx, wz, y + 5, RW)))), crease: poly(disc(wx, wz, y + 5, RW - 2)) });
    }
    hub.setAttribute("d", poly(disc(wx, wz, YS[1] + 5.4, 5, 20)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  // the hit box: the rest pose's screen box, which never moves
  const box = [P(0, 0, 86), P(118, 62, 0), P(0, 62, 86), P(118, 0, 86), P(HX, YS[1] + 5, 0)];
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const inBox = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, v ? reach : REST, performance.now(), 0);
    near.sil.classList.toggle("hi", !v);
    strut.classList.toggle("hi", v);
    read.textContent = v ? "gear up" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inBox(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "landinggear",
  means: "A main landing gear leg under a belly: the pointer retracts it, the leg swinging up and folding its wheels into the bay.",
  rules: [1, 5, 6, 8],
  range: [30, 90, 96],
  tour: [[214, 262], [205, 205], [180, 120], null],
  mount,
});
