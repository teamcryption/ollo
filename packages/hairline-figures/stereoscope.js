/**
 * Stereoscope: a hooded pair of lenses on a handle, a long bar running out
 * from the hood and a card holder riding the bar with a double picture in it.
 * The pointer picks one of three stops along the bar and the card holder
 * slides out to it, focusing. At rest it sits near the hood, bright. The
 * slider is how far the holder travels.
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const BX0 = 12, BX1 = 112, BY0 = 18, BY1 = 23, BZ0 = 36, BZ1 = 40, REST = 34;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let travel = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-8, 0, 0], [BX1, BY1, BZ0], [BX1, -4, 62], [-2, 42, 30], [20, 40, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-8, 4, 22, 36, 8, 1.6);
  put(solid(g), prism(P, front, fr, fi, 0, 4));
  const [pr, pi] = rings(4, 17, 11, 24, 3, 1);
  put(solid(g), prism(P, front, pr, pi, 4, 30));
  const [hr, hi] = rings(-2, -2, 14, 42, 6, 1.6);
  put(solid(g), prism(P, front, hr, hi, 28, 50));
  const lens = (y) => poly(circ(6, 20).map((q) => P(14, y + q.u, 39 + q.v)));
  mk("path", { d: lens(10) + lens(30), class: "nf lo" }, g);
  const [sr, si] = rings(-2, 19, 4, 21, 1, 0.4);
  put(solid(g), prism(P, front, sr, si, 50, 53));

  const farBar = solid(g), hold = solid(g), pics = mk("path", { class: "nf lo" }, hold.g), nearBar = solid(g);
  hold.sil.classList.add("hi");
  const sh = tween(REST);
  let last = NaN;
  function draw(s) {
    if (s === last) return;
    last = s;
    const bar = (x0, x1) => { const [r, i] = rings(x0, BY0, x1, BY1, 1.5, 0.6); return prism(P, front, r, i, BZ0, BZ1); };
    put(farBar, bar(BX0, s));
    put(nearBar, bar(s + 3, BX1));
    const [cr, ci] = rings(s, -6, s + 3, 47, 1.2, 0.5);
    put(hold, prism(P, front, cr, ci, 24, 56));
    pics.setAttribute("d", [3, 23].map((y) => poly(rrect(y, 29, y + 17, 51, 3, 4).map((q) => P(s + 3, q.u, q.v)))).join(""));
  }
  const B = register(stage, (_dt, now) => { draw(tval(sh, now)); return !tdone(sh, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -20 || x > BX1 + 30 || y < -40 || y > 80) return -1;
    return x < 40 ? 0 : x < 75 ? 1 : 2;
  }
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(sh, a < 0 ? REST : REST + 6 + (travel * (a + 1)) / 3, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : "focus " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { travel = v; setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "stereoscope",
  means: "A stereoscope: the pointer picks a stop and the card holder slides out along the bar from the hooded lenses.",
  rules: [1, 3, 5, 6],
  range: [20, 50, 66],
  tour: [[224, 152], [285, 182], [335, 210], null],
  mount,
});
