/**
 * Platform screen doors: a glass wall at the platform edge, a sill, two
 * fixed glass panels, a header beam and a pair of sliding door leaves in the
 * middle. The pointer near the doors draws the leaves apart on a spring, so
 * they slide behind the fixed panels; the nearer the pointer to the doorway,
 * the wider they open. At rest the leaves stand a little ajar, bright. The
 * slider is how far they open.
 *
 * The pattern: one part following the pointer; the hit is the rest pose's box.
 */
const {
  Cam, clamp, facing, fillet, fit, poly, prism, proj, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 100, Z0 = 3, ZT = 46, ZH = 56, PW = 22, MID = W / 2, LW = 28, SLIDE = 26, REST = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.9);
  const box = [[-4, -2, 0], [W + 4, 8, 0], [W + 4, -2, 0], [-4, 8, 0], [-2, -1, ZH], [W + 2, 7, ZH]];
  fit(C, box, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the sill, with a dim tactile line along its near edge
  const sill = solid(g);
  const [sr, si] = rings(-4, -2, W + 4, 8, 2, 1);
  put(sill, prism(P, front, sr, si, 0, Z0));
  mk("path", { class: "nf lo", d: seg(P(-1, 6, Z0), P(W + 1, 6, Z0)) }, sill.g);

  // a glass pane outline on a face at y, from x0 to x1
  const pane = (x0, x1, y, z0, z1) => poly(fillet([P(x0, y, z0), P(x1, y, z0), P(x1, y, z1), P(x0, y, z1)], [2, 2, 2, 2], 3));

  // the two leaves: thin plates standing behind the fixed panels' plane
  const leaves = [-1, 1].map((s) => {
    const sd = solid(g);
    return { s, sd, glass: mk("path", { class: "nf lo" }, sd.g) };
  });
  // the fixed panels, nearer than the leaves, so a sliding leaf passes behind them
  [[0, PW], [W - PW, W]].forEach(([x0, x1]) => {
    const sd = solid(g);
    const [r, i] = rings(x0, 3, x1, 5.5, 0.9, 0.4);
    put(sd, prism(P, front, r, i, Z0, ZT));
    mk("path", { class: "nf lo", d: pane(x0 + 3, x1 - 3, 5.5, Z0 + 6, ZT - 4) }, sd.g);
  });
  // the header beam over the whole wall, with the door's indicator slot
  const head = solid(g);
  const [hr, hi] = rings(-2, -1, W + 2, 7, 2, 1);
  put(head, prism(P, front, hr, hi, ZT, ZH));
  mk("path", { class: "nf lo", d: pane(MID - 10, MID + 10, 7, ZT + 3, ZH - 3) }, head.g);

  const gap = spring(REST);
  let last = NaN;
  function draw(o) {
    if (o === last) return;
    last = o;
    leaves.forEach(({ s, sd, glass }) => {
      const a = s < 0 ? MID - LW - o : MID + o, b = a + LW;
      const [r, i] = rings(a, 0, b, 2.2, 0.9, 0.4);
      put(sd, prism(P, front, r, i, Z0, ZT));
      glass.setAttribute("d", pane(a + 4, b - 4, 2.2, Z0 + 8, ZT - 5) + seg(P(s < 0 ? b - 1.5 : a + 1.5, 2.2, Z0 + 4), P(s < 0 ? b - 1.5 : a + 1.5, 2.2, ZT - 3)));
    });
  }

  const B = register(stage, (dt) => {
    const m = stepS(gap, dt);
    draw(clamp(gap.x, 0, SLIDE));
    return m;
  });
  bag.add(B.unregister);

  // the hit: the rest pose's screen box; the pointer's distance to the doorway sets the opening
  const pts = box.map((p) => P(...p)), cx = P(MID, 3, Z0)[0];
  const L = Math.min(...pts.map((p) => p[0])), R = Math.max(...pts.map((p) => p[0]));
  const T = Math.min(...pts.map((p) => p[1])), Bm = Math.max(...pts.map((p) => p[1]));
  function hit([sx, sy]) {
    if (sx < L || sx > R || sy < T || sy > Bm) return null;
    return clamp(1 - Math.abs(sx - cx) / (R - L), 0.25, 1);
  }
  function setPointer(f) {
    gap.t = f === null ? REST : clamp(REST + (SLIDE - REST) * reach * f, 0, SLIDE);
    read.textContent = f === null ? "rest" : "open " + Math.round((gap.t / SLIDE) * 100) + "%";
    B.wake();
  }
  leaves.forEach((l) => l.sd.sil.classList.add("hi"));
  setPointer(null);
  bag.add(pointer(stage, { move: (p) => setPointer(hit(p)), leave: () => setPointer(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "platformdoors",
  means: "Platform screen doors: the two glass leaves slide apart behind the fixed panels, wider the nearer the pointer is to the doorway.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[204, 132], [140, 175], [265, 240], null],
  mount,
});
