/**
 * Vortex mixer: a squat base with a rubber cup on top and a test tube held in
 * the cup. The pointer over the mixer presses the tube in, and the cup swings
 * the tube off-centre, leaning it hard over. At rest the tube stands with a
 * slight lean, bright. The slider is how far it swings.
 *
 * The pattern: one part tilting on its body.
 */
const { Cam, circ, fit, hull, poly, prism, proj, facing, rings, ringAt, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 60, D = 54, BZ = 24, CX = 30, CY = 27, CR = 12, TR = 5, TH = 62, REST = 4;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [CX - 30, CY - 30, BZ + TH + 8], [CX + 30, CY + 30, BZ + TH + 8]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 14, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  // the touch pad on the near face
  mk("path", { d: poly(ringAt(P, disc(W - 4, D - 4, 3.5, 16), BZ)), class: "nf lo" }, g);

  const cup = solid(g), tube = mk("path", { class: "sil" }, g), lip = mk("path", { class: "nf lo" }, g), liq = mk("path", { class: "nf lo" }, g);
  tube.classList.add("hi");
  const t = tween(REST);
  let last = NaN;
  function draw(s) {
    if (s === last) return;
    last = s;
    const ox = s * 0.18, oy = -s * 0.12;
    put(cup, prism(P, front, disc(CX + ox, CY + oy, CR), disc(CX + ox, CY + oy, CR - 2), BZ, BZ + 8));
    const bx = CX + ox, by = CY + oy, z0 = BZ + 4;
    const at = (f) => [bx + s * f, by - s * 0.6 * f, z0 + TH * f];
    const [x1, y1, z1] = at(1);
    tube.setAttribute("d", poly(hull(ringAt(P, disc(bx, by, TR, 20), z0).concat(ringAt(P, disc(x1, y1, TR, 20), z1)))));
    lip.setAttribute("d", poly(ringAt(P, disc(x1, y1, TR + 1, 20), z1)));
    const [x2, y2, z2] = at(0.35);
    liq.setAttribute("d", poly(ringAt(P, disc(x2, y2, TR - 0.6, 20), z2)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  const mid = P(W / 2, D / 2, BZ);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(t, on ? swing : REST, performance.now(), 0);
    read.textContent = on ? "on" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], (sy - mid[1]) * 1.4) < 110), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; if (act) { tset(t, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "vortexmixer",
  means: "A vortex mixer: the pointer over it presses the test tube into the cup, which swings the tube hard over off-centre.",
  rules: [1, 5, 6],
  range: [12, 26, 30],
  tour: [[200, 228], [195, 206], [205, 290], null],
  mount,
});
