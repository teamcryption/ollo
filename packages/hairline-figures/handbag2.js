/**
 * Clutch bag: a slim envelope clutch lying on a table, its pointed flap
 * folded over the front and held by a round clasp. At rest the clasp is
 * bright. The pointer over the bag swings the flap open on its back fold;
 * the slider is how far it opens.
 *
 * The pattern: one hinged part (swing).
 */
const {
  Cam, fit, facing, fillet, hull, poly, prism, proj, rings, ringAt, rrect, open, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 120, D = 62, H = 16, T = 2.4, REST = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-2, -2, 0], [W + 2, D + 2, 0], [W + 2, -2, 0], [-2, D + 2, 0], [0, -6, H + D], [W, -6, H + D]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 9, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // the bag's mouth, seen once the flap lifts
  mk("path", { d: poly(ringAt(P, rrect(5, 5, W - 5, 14, 4, 4), H)), class: "nf lo" }, g);
  mk("path", { d: open([P(6, D - 6, H * 0.45), P(W - 6, D - 6, H * 0.45)]), class: "nf lo" }, g);
  const flapG = mk("g", {}, g);
  const flap = mk("path", { class: "sil" }, flapG), seam = mk("path", { class: "nf lo" }, flapG), clasp = mk("path", { class: "nf" }, flapG);
  const shape = fillet([[-1, -1], [W + 1, -1], [W + 1, D * 0.42], [W / 2, D * 0.86], [-1, D * 0.42]], [6, 6, 8, 10, 8], 5);
  const inset = fillet([[3, 3], [W - 3, 3], [W - 3, D * 0.4], [W / 2, D * 0.8], [3, D * 0.4]], [4, 4, 6, 8, 6], 5);
  const knob = rrect(W / 2 - 6, D * 0.66, W / 2 + 6, D * 0.66 + 10, 5, 5).map((q) => [q.u, q.v]);
  const hy = -1;
  const rot = ([u, v], z, a) => {
    const dy = v - hy, c = Math.cos(a), s = Math.sin(a);
    return P(u, hy + dy * c - z * s, H + dy * s + z * c);
  };
  const ang = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180, pts = [];
    for (const q of shape) pts.push(rot(q, 0, a), rot(q, T, a));
    flap.setAttribute("d", poly(hull(pts)));
    seam.setAttribute("d", poly(inset.map((q) => rot(q, T, a))));
    const kp = [];
    for (const q of knob) kp.push(rot(q, T, a), rot(q, T + 3, a));
    clasp.setAttribute("d", poly(hull(kp)));
    if (deg > 90) flapG.prepend(clasp); else flapG.append(clasp);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const mid = P(W / 2, D / 2, H);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a > 0 ? maxA : REST, performance.now(), 0);
    flap.classList.toggle("hi", a > 0);
    clasp.classList.toggle("hi", a < 0);
    read.textContent = a > 0 ? "flap" : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 140 && Math.abs(sy - mid[1]) < 90 ? 1 : -1),
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act > 0) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "handbag2",
  means: "An envelope clutch on a table: the pointer over it swings the pointed flap up off the clasp to open the bag's mouth.",
  rules: [1, 4, 5, 8],
  range: [50, 95, 110],
  tour: [[198, 212], [160, 192], [240, 244], null],
  mount,
});
