/**
 * Overlocker: a squat serger body with four thread cones standing on the
 * spool pins behind it. At rest the looper cover on the front is a crack
 * open, bright. The pointer over the machine swings the cover down on its
 * bottom hinge to show the loopers; the slider is how far it drops.
 *
 * The pattern: one hinged part (swing).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, open, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 100, D = 56, H = 46, T = 2.5, REST = 10;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[0, 0, 0], [W, D + H, 0], [W, 0, 0], [0, D, 0], [10, 10, H + 44], [W - 10, 10, H + 44]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (let k = 0; k < 4; k++) {
    const x = 16 + k * 22, y = 12, cg = mk("g", {}, g), p = [];
    p.push(...ringAt(P, disc(x, y, 9), H), ...ringAt(P, disc(x, y, 3.5), H + 36));
    mk("path", { d: poly(hull(p)), class: "sil" }, cg);
    mk("path", { d: open([P(x, y, H + 36), P(x, y, H + 44)]), class: "nf lo" }, cg);
  }
  const [br, bi] = rings(0, 0, W, D, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // the loopers behind the cover
  for (const [x0, x1, z] of [[14, 52, 16], [30, 80, 26], [20, 66, 34]]) mk("path", { d: open([P(x0, D, z), P((x0 + x1) / 2, D, z + 6), P(x1, D, z)]), class: "nf lo" }, g);
  const cg = mk("g", {}, g);
  const cover = mk("path", { class: "sil" }, cg), seam = mk("path", { class: "nf lo" }, cg);
  const X0 = 6, X1 = W - 6, Z0 = 4, Z1 = H - 6;
  const R = (x, up, out, a) => { const c = Math.cos(a), s = Math.sin(a); return P(x, D + out * c + up * s, Z0 + up * c - out * s); };
  const ang = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180, pts = [];
    for (const x of [X0, X1]) for (const up of [0, Z1 - Z0]) for (const out of [0, T]) pts.push(R(x, up, out, a));
    cover.setAttribute("d", poly(hull(pts)));
    seam.setAttribute("d", open([R(X0 + 30, 6, T, a), R(X1 - 30, 6, T, a)]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const mid = P(W / 2, D / 2, H / 2);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a > 0 ? maxA : REST, performance.now(), 0);
    cover.classList.add("hi");
    read.textContent = a > 0 ? "cover" : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 140 && Math.abs(sy - mid[1]) < 110 ? 1 : -1),
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act > 0) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "sewingtable",
  means: "An overlocker with four thread cones: the pointer over it swings the front looper cover down on its hinge to show the loopers.",
  rules: [1, 4, 5, 8],
  range: [50, 85, 95],
  tour: [[200, 139], [180, 200], [230, 240], null],
  mount,
});
