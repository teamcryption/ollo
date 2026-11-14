/**
 * Door viewer: a door leaf lying on its back with a viewer set in it, a
 * flanged barrel and a lens, under a round cover on a pivot pin. Bring the
 * pointer over the viewer and the cover swings aside on its pin to bare the
 * lens. At rest the cover is just ajar, bright.
 *
 * The pattern: one thing that opens (a lid on a pivot).
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 120, D = 70, CX = 60, CY = 35, BR = 16, PX = CX + 18, PY = CY;
const DZ = 5, FZ = 8, BZ = 20, OPEN = 160, REST = 18;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [CX, CY, BZ + 8], [PX + 20, PY + 34, BZ + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  let [r, i] = rings(0, 0, W, D, 6, 2);
  put(solid(g), prism(P, front, r, i, 0, DZ));
  // the door's panels, sunk in its face
  [[8, 8, 40, 62], [84, 8, 112, 62]].forEach(([a, b, c, d]) => {
    const [pr] = rings(a, b, c, d, 3, 0);
    mk("path", { d: poly(ringAt(P, pr, DZ)), class: "nf lo" }, g);
  });
  put(solid(g), prism(P, front, disc(CX, CY, BR + 7), disc(CX, CY, BR + 5), DZ, FZ));
  put(solid(g), prism(P, front, disc(CX, CY, BR), disc(CX, CY, BR - 1.6), FZ, BZ));
  mk("path", { d: poly(ringAt(P, disc(CX, CY, BR - 5), BZ)), class: "nf lo" }, g);
  put(solid(g), prism(P, front, disc(PX, PY, 2.6, 14), disc(PX, PY, 1.6, 14), BZ, BZ + 4.5));
  const cover = solid(g);
  const sw = tween(REST);
  let last = NaN;

  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const t = (deg * Math.PI) / 180, R = PX - CX;
    const x = PX - R * Math.cos(t), y = PY + R * Math.sin(t);
    put(cover, prism(P, front, disc(x, y, BR + 1.5), disc(x, y, BR - 0.5), BZ + 1.5, BZ + 4.5));
  }
  cover.sil.classList.add("hi");

  const B = register(stage, (_dt, now) => { draw(tval(sw, now)); return !tdone(sw, now); });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(sw, a > 0 ? OPEN * reach : REST, performance.now(), 0);
    read.textContent = a > 0 ? "open" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, BZ);
    return Math.hypot(x - CX, y - CY) < BR + 16 ? 1 : 0;
  }
  setActive(0);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act > 0) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "peephole",
  means: "A door viewer set in a door: bring the pointer over it and its round cover swings aside on its pin to bare the lens.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[166, 106], [200, 132], [234, 209], null],
  mount,
});
