/**
 * Mandoline: a slicing deck on a stand with a blade across its middle and
 * a hand guard riding the deck. The pointer over the deck slides the guard
 * along toward the blade. At rest the guard waits at the near end,
 * bright. The slider is how far it slides.
 */
const { Cam, fit, facing, prism, proj, circ, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const L = 96, D = 34, DZ = 12, REST = 4;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[0, 0, 0], [L, D, 0], [L, 0, 0], [0, D, 0], [0, D / 2, 34], [L, D / 2, 34]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [lr, li] = rings(L - 14, 2, L - 8, D - 2, 1, 0.5);
  put(solid(g), prism(P, front, lr, li, 0, DZ));
  const [fr, fi] = rings(6, 2, 12, D - 2, 1, 0.5);
  put(solid(g), prism(P, front, fr, fi, 0, DZ));
  const [dr, di] = rings(0, 0, L, D, 4, 3);
  put(solid(g), prism(P, front, dr, di, DZ, DZ + 3));
  const [br, bi] = rings(L / 2 + 6, 4, L / 2 + 10, D - 4, 0.5, 0.3);
  put(solid(g), prism(P, front, br, bi, DZ + 3, DZ + 4.5));
  const guard = solid(g), knob = solid(g);
  const x = tween(REST);
  let last = NaN;
  function draw(gx) {
    if (gx === last) return;
    last = gx;
    const [gr, gi] = rings(gx, 5, gx + 26, D - 5, 4, 2);
    put(guard, prism(P, front, gr, gi, DZ + 3, DZ + 12));
    put(knob, prism(P, front, disc(gx + 13, D / 2, 5), disc(gx + 13, D / 2, 3.5), DZ + 12, DZ + 20));
  }
  guard.sil.classList.add("hi");
  const B = register(stage, (_dt, now) => { draw(tval(x, now)); return !tdone(x, now); });
  bag.add(B.unregister);
  const mid = P(L / 2, D / 2, DZ);
  let act = null;
  const far = () => 14 + reach * 0.36;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(x, a ? far() : REST, performance.now(), 0);
    read.textContent = a ? "slice" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 100), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { tset(x, far(), performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "mandoline",
  means: "A mandoline slicer: the pointer over the deck slides the hand guard along it toward the blade.",
  rules: [1, 3, 5, 6],
  range: [0, 70, 100],
  tour: [[141, 123], [259, 227], [141, 138], null],
  mount,
});
