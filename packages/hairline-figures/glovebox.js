/**
 * Shoe box: a long lidded box on the floor with a pair of shoe outlines in
 * tissue inside. At rest the lid sits ajar, bright. The pointer over the box
 * swings the lid open on its back hinge; the slider is how far it opens.
 *
 * The pattern: one hinged part (swing).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, open, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 96, D = 52, H = 26, LH = 10, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-2, -2, 0], [W + 2, D + 2, 0], [W + 2, -2, 0], [-2, D + 2, 0], [0, -14, H + D + 4], [W, -14, H + D + 4], [0, D + 2, H + LH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // tissue fold and two shoe soles on the tissue
  mk("path", { d: open([P(4, D * 0.5, H), P(W - 4, D * 0.45, H)]), class: "nf lo" }, g);
  for (const [x0, y0] of [[14, 8], [52, 26]]) {
    const sole = rrect(x0, y0, x0 + 30, y0 + 16, 7, 6);
    mk("path", { d: poly(ringAt(P, sole, H + 0.5)), class: "nf" }, g);
  }
  const lidG = mk("g", {}, g);
  const lid = mk("path", { class: "sil" }, lidG), crease = mk("path", { class: "nf lo" }, lidG);
  const outer = rrect(-2, -2, W + 2, D + 2, 6, 6), inner = rrect(0.5, 0.5, W - 0.5, D - 0.5, 4, 6);
  const hy = -2;
  const rot = (q, z, a) => {
    const dy = q.v - hy, dz = z, c = Math.cos(a), s = Math.sin(a);
    return P(q.u, hy + dy * c - dz * s, H - dy * s * -1 + dz * c);
  };
  const ang = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180;
    const pts = [];
    for (const q of outer) pts.push(rot(q, 0, a), rot(q, LH, a));
    lid.setAttribute("d", poly(hull(pts)));
    crease.setAttribute("d", poly(inner.map((q) => rot(q, LH, a))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const mid = P(W / 2, D / 2, H);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a > 0 ? maxA : REST, performance.now(), 0);
    lid.classList.add("hi");
    read.textContent = a > 0 ? "lid" : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 130 && Math.abs(sy - mid[1]) < 90 ? 1 : -1),
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act > 0) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "glovebox",
  means: "A shoe box on the floor: the pointer over it swings the lid open on its back hinge to show the shoes in tissue.",
  rules: [1, 4, 5, 8],
  range: [60, 100, 115],
  tour: [[192, 200], [160, 192], [226, 222], null],
  mount,
});
