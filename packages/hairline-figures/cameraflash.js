/**
 * Photo booth: a tall booth with a flash on its roof and a curtain hung on a
 * rail across its doorway. The pointer draws the curtain: its leading edge
 * follows the pointer along the rail, the folds bunching toward the far post
 * and showing the seat inside. At rest the curtain hangs half open and the
 * flash is the bright mark. The slider is how far open it rests.
 *
 * The pattern: one part following the pointer along a track (slide).
 */
const {
  Cam, clamp, fillet, fit, facing, lerp, open, poly, prism, proj, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 40, D = 50, H = 92, Y0 = 6, Y1 = 44, CX = W + 1.5, CT = 2.6, CZ0 = 6, CZ1 = 84, MIN = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restOpen = value / 100;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[0, 0, 0], [W + 6, D, 0], [W + 6, 0, 0], [0, D, 0], [0, 0, H + 12], [W, D, H + 12]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [br, bi] = rings(0, 0, W, D, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // the flash on the roof, with its window on the near face
  const flash = solid(g);
  const [fr, fi] = rings(12, 14, 28, 36, 3, 1.2);
  put(flash, prism(P, front, fr, fi, H, H + 10));
  mk("path", { d: poly(fillet([[28, 18, H + 3], [28, 32, H + 3], [28, 32, H + 8], [28, 18, H + 8]].map((q) => P(...q)), [1.5, 1.5, 1.5, 1.5])), class: "nf lo" }, g);
  // the doorway and the seat inside it, on the near face
  const door = [[W, Y0, 4], [W, Y1, 4], [W, Y1, CZ1], [W, Y0, CZ1]].map((q) => P(...q));
  mk("path", { d: poly(fillet(door, [1, 1, 5, 5])), class: "nf lo" }, g);
  mk("path", { d: open([[W, 12, 30], [W, 38, 30], [W, 38, 26], [W, 12, 26]].map((q) => P(...q))) + seg(P(W, 16, 26), P(W, 16, 4)) + seg(P(W, 34, 26), P(W, 34, 4)), class: "nf lo" }, g);
  // the rail
  mk("path", { d: seg(P(CX, Y0 - 3, CZ1 + 3), P(CX, Y1 + 3, CZ1 + 3)), class: "nf" }, g);

  const cur = solid(g), folds = mk("path", { class: "nf lo" }, g);
  const ring = mk("circle", { r: 2.2, class: "nf" }, g);
  const restEdge = () => lerp(Y0, Y1 - MIN, restOpen);
  const edge = spring(restEdge());
  let last = NaN;
  function draw(e) {
    if (Math.abs(e - last) < 0.01) return;
    last = e;
    const [r, i] = rings(CX - CT / 2, e, CX + CT / 2, Y1 + 1, 1.2, 0.5);
    put(cur, prism(P, front, r, i, CZ0, CZ1));
    let d = "";
    for (let k = 1; k < 5; k++) { const y = lerp(e, Y1 + 1, k / 5); d += seg(P(CX + CT / 2, y, CZ0 + 4), P(CX + CT / 2, y, CZ1 - 3)); }
    folds.setAttribute("d", d);
    const [x, y] = P(CX, e + 1.5, CZ1 + 3);
    ring.setAttribute("cx", x); ring.setAttribute("cy", y);
  }

  const B = register(stage, (dt) => { const m = stepS(edge, dt); draw(edge.x); return m; });
  bag.add(B.unregister);

  // hit against the rest pose: the rail's ends on screen, and the booth's box
  const a = P(CX, Y0, CZ1)[0], b = P(CX, Y1 - MIN, CZ1)[0];
  const top = P(0, 0, H + 10)[1], bot = P(W, D, 0)[1], left = P(0, D, 0)[0] - 10, right = P(W, 0, 0)[0] + 10;
  let act = null;
  function setActive(p) {
    const on = p && p[0] > left && p[0] < right && p[1] > top && p[1] < bot;
    const t = on ? clamp((p[0] - a) / (b - a), 0, 1) : restOpen;
    edge.t = lerp(Y0, Y1 - MIN, t);
    if (on !== act) { act = on; cur.sil.classList.toggle("hi", on); flash.sil.classList.toggle("hi", !on); }
    read.textContent = on ? "open " + Math.round(t * 100) : "rest";
    B.wake();
  }
  setActive(null);
  bag.add(pointer(stage, { move: (p) => setActive(p), leave: () => setActive(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restOpen = v / 100; if (!act) setActive(null); }, destroy: bag.dispose };
}

hairline({
  name: "cameraflash",
  means: "A photo booth with a flash on its roof: the pointer draws its curtain along the rail, bunching the folds to show the seat.",
  rules: [1, 3, 5, 8],
  range: [0, 12, 100],
  tour: [[260, 151], [213, 216], [236, 183], null],
  mount,
});
