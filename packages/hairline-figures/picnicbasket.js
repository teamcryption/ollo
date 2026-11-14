/**
 * Picnic basket: a woven basket, its weave as dim bands round the front,
 * with a lid hinged along the back edge. The pointer over the basket swings
 * the lid open on its hinge to show the inside; leaving drops it back to
 * rest, where it sits ajar and bright.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rad, rings, ringAt, rrect, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const W = 56, D = 36, Z = 26, T = 3, AJAR = 16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, -4, Z + D + 4], [W, -4, Z + D + 4]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 6, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, Z));
  const fr = run(br, front);
  for (const z of [7, 13, 19]) mk("path", { d: open(ringAt(P, fr, z)), class: "nf lo" }, g);
  // the inside: a dim wall line one weave in from the rim
  mk("path", { d: poly(ringAt(P, rrect(2.5, 2.5, W - 2.5, D - 2.5, 4.5, 6), Z)), class: "nf lo" }, g);

  const lid = solid(g), face = mk("path", { class: "nf lo" }, g), latch = mk("path", { class: "nf" }, g);
  const lr = rrect(-1, -1, W + 1, D + 1, 7, 6);
  const at = (a, t) => {
    const c = Math.cos(a), s = Math.sin(a);
    return lr.map((q) => { const dy = q.v + 1; return P(q.u, -1 + dy * c - t * s, Z + dy * s + t * c); });
  };
  const ang = tween(AJAR);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), lo = at(a, 0), hiR = at(a, T);
    lid.sil.setAttribute("d", poly(hull(lo.concat(hiR))));
    face.setAttribute("d", poly(deg < 54 ? hiR : lo));
    const c = Math.cos(a), s = Math.sin(a), dy = D + 1;
    const lx = W / 2, ly = -1 + dy * c, lz = Z + dy * s;
    latch.setAttribute("d", poly(hull([P(lx - 4, ly, lz), P(lx + 4, ly, lz), P(lx - 4, ly + 2 * s, lz - 5 * c), P(lx + 4, ly + 2 * s, lz - 5 * c)])));
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    for (const z of [0, Z]) {
      const [x, y] = unproj(C, sx, sy, z);
      if (x > -8 && x < W + 8 && y > -8 && y < D + 8) return 1;
    }
    return -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a > 0 ? maxA : AJAR, performance.now(), 0);
    lid.sil.classList.add("hi");
    read.textContent = a > 0 ? "open" : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; act = -2; setActive(-1); }, destroy: bag.dispose };
}

hairline({
  name: "picnicbasket",
  means: "A woven picnic basket: the pointer over it swings the lid open on its back hinge; leaving lets it fall back ajar.",
  rules: [1, 5, 6, 8],
  range: [60, 85, 100],
  tour: [[196, 189], [216, 270], [176, 160], null],
  mount,
});
