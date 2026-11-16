/**
 * Wing mirror: the top of a car door with the window line, and the mirror on
 * its stalk at the front corner. At rest it stands out from the door, bright.
 * The pointer over it folds the housing back against the glass on its
 * pivot; the slider is how far it folds.
 *
 * The pattern: one part turning about a pivot (swing).
 */
const { Cam, fit, facing, hull, poly, open, prism, proj, rings, rrect, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 120, D = 8, H = 26, PX = 40, PY = 10, Z0 = 30, Z1 = 54, REST = 0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[0, 0, 0], [W, 0, 0], [W, D, 0], [0, D, 0], [0, 0, 80], [W, 0, 80], [PX, PY + 46, Z0], [PX, PY + 46, Z1], [PX + 46, PY, Z1]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 3, 1.5);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // window glass and its frame above the door
  mk("path", { d: open([P(16, 3, H), P(36, 3, 78), P(W, 3, 78)]), class: "nf" }, g);
  mk("path", { d: open([P(56, 3, 58), P(78, 3, 70)]), class: "nf lo" }, g);
  mk("path", { d: open([P(0, D, H - 8), P(W, D, H - 8)]), class: "nf lo" }, g);
  // the stalk's foot on the door
  const [fr, fi] = rings(PX - 10, D - 2, PX + 8, PY + 2, 3, 1.5);
  put(solid(g), prism(P, front, fr, fi, H, Z0 + 4));
  const shell = mk("path", { class: "sil" }, g), glass = mk("path", { class: "nf" }, g), seam = mk("path", { class: "nf lo" }, g);
  const sec = rrect(-10, 6, 4, 46, 6, 5);
  const R = (dx, dy, z, a) => { const c = Math.cos(a), s = Math.sin(a); return P(PX + dx * c + dy * s, PY - dx * s + dy * c, z); };
  const face = rrect(8, Z0 + 3, 43, Z1 - 3, 6, 5);
  const ang = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180, pts = [];
    for (const q of sec) pts.push(R(q.u, q.v, Z0, a), R(q.u, q.v, Z1, a));
    for (const z of [Z0 + 2, Z0 + 10]) pts.push(R(-6, 0, z, a), R(2, 0, z, a));
    shell.setAttribute("d", poly(hull(pts)));
    glass.setAttribute("d", poly(face.map((q) => R(4.5, q.u, q.v, a))));
    seam.setAttribute("d", open([R(-10, 26, Z0 + 1, a), R(-10, 26, Z1 - 1, a)]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const mid = P(PX, PY + 24, (Z0 + Z1) / 2);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a > 0 ? maxA : REST, performance.now(), 0);
    shell.classList.add("hi");
    read.textContent = a > 0 ? Math.round(maxA) + "°" : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 130 ? 1 : -1),
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act > 0) { tset(ang, v, performance.now(), 0); read.textContent = Math.round(v) + "°"; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "mirror2",
  means: "A car wing mirror on the door: the pointer over it folds the housing back on its pivot until the glass lies against the window.",
  rules: [1, 4, 5, 8],
  range: [50, 80, 90],
  tour: [[108, 143], [90, 160], [140, 130], null],
  mount,
});
