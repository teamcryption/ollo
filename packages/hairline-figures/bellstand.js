/**
 * Concierge desk: a low reception counter with a tall arm lamp at one end.
 * At rest the lamp's arm reaches back over the counter, its shade bright.
 * The pointer over the desk swings the arm round on its stem toward the
 * guest side and the shade turns down to light the counter's front.
 * The slider is how far the arm swings.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, seg, unproj, tset, tval, tdone, tween, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 84, D = 32, H = 30, LX = 66, LY = 12, STEM = 42, ARM = 32, REST = 200;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [LX, LY, H + STEM + 6], [LX + ARM, LY + ARM, H + STEM], [LX - ARM, LY, H + STEM]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(0, 0, W, D, 5, 1.6);
  put(solid(g), prism(P, front, dr, di, 0, H));
  mk("path", { d: seg(P(4, D, 6), P(W - 4, D, 6)), class: "nf lo" }, g);
  put(solid(g), prism(P, front, disc(LX, LY, 7), disc(LX, LY, 5.6), H, H + 2.5));
  put(solid(g), prism(P, front, disc(LX, LY, 1.4, 12), disc(LX, LY, 0.8, 12), H + 2.5, H + STEM));
  const arm = mk("path", { class: "nf" }, g), shade = mk("path", { class: "sil" }, g);
  const sw = tween(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const t = rad(a), ex = LX + ARM * Math.cos(t), ey = LY + ARM * Math.sin(t), top = H + STEM;
    arm.setAttribute("d", seg(P(LX, LY, top), P(ex, ey, top + 3)) + seg(P(LX, LY, top - 1), P(ex, ey, top + 2)));
    const pts = [];
    for (const q of circ(10, 28)) pts.push(P(ex + q.u, ey + q.v, top - 12));
    for (const q of circ(3, 16)) pts.push(P(ex + q.u, ey + q.v, top + 3));
    shade.setAttribute("d", poly(hull(pts)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(sw, now)); return !tdone(sw, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(sw, a ? 200 - 120 - 40 * reach : REST, performance.now(), 0);
    shade.classList.toggle("hi", true);
    read.textContent = a ? "lamp" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    for (const z of [0, H, H + STEM]) { const [x, y] = unproj(C, sx, sy, z); if (x > -4 && x < W + 4 && y > -6 && y < D + 10) return true; }
    return false;
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "bellstand",
  means: "A concierge desk with a tall arm lamp: the pointer swings the lamp's arm round on its stem toward the guest side.",
  rules: [1, 3, 5, 6],
  range: [0, 0.6, 1],
  tour: [[200, 159], [156, 110], [244, 208], null],
  mount,
});
