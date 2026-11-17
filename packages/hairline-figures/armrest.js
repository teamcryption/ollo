/**
 * Armrest console: a car's centre console with a padded armrest lid over a
 * storage bin, and a pair of cup rings ahead of it. At rest the lid sits
 * ajar, bright. The pointer over the console lifts the lid on its rear
 * hinge to show the bin; the slider is how far it opens.
 *
 * The pattern: one hinged part (swing).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 50, D = 104, H = 36, LD = 74, LH = 10, REST = 12;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-2, -2, 0], [W + 2, D + 2, 0], [W + 2, -2, 0], [-2, D + 2, 0], [0, -14, H + LD + 4], [W, -14, H + LD + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // the bin under the lid, and two cup rings ahead of it
  mk("path", { d: poly(ringAt(P, rrect(5, 5, W - 5, LD - 5, 5, 6), H)), class: "nf lo" }, g);
  for (const x of [W * 0.28, W * 0.72]) {
    mk("path", { d: poly(ringAt(P, disc(x, LD + 14, 8.5), H)), class: "nf" }, g);
    mk("path", { d: poly(ringAt(P, disc(x, LD + 14, 6), H - 2)), class: "nf lo" }, g);
  }
  const lidG = mk("g", {}, g);
  const lid = mk("path", { class: "sil" }, lidG), crease = mk("path", { class: "nf lo" }, lidG), seam = mk("path", { class: "nf lo" }, lidG);
  const outer = rrect(-1, -1, W + 1, LD, 9, 8), inner = rrect(2, 2, W - 2, LD - 3, 7, 8), pad = rrect(8, 10, W - 8, LD - 12, 6, 8);
  const hy = -1;
  const rot = (q, z, a) => {
    const dy = q.v - hy, c = Math.cos(a), s = Math.sin(a);
    return P(q.u, hy + dy * c - z * s, H + dy * s + z * c);
  };
  const ang = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180, pts = [];
    for (const q of outer) pts.push(rot(q, 0, a), rot(q, LH, a));
    lid.setAttribute("d", poly(hull(pts)));
    crease.setAttribute("d", poly(inner.map((q) => rot(q, LH, a))));
    seam.setAttribute("d", poly(pad.map((q) => rot(q, LH, a))));
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
    move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 120 && Math.abs(sy - mid[1]) < 90 ? 1 : -1),
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act > 0) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "armrest",
  means: "A car's centre console: the pointer over it lifts the padded armrest lid on its rear hinge to show the storage bin.",
  rules: [1, 4, 5, 8],
  range: [60, 100, 115],
  tour: [[200, 170], [170, 160], [230, 190], null],
  mount,
});
