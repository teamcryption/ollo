/**
 * Draughts box: a square box whose lid is the board, ruled on top, with
 * stacks of round pieces sitting on the tray inside. At rest the lid sits a
 * little ajar, bright, showing the first stacks. The pointer over the box
 * slides the lid off to show every stack. The slider is how far it opens.
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 84, D = 84, BZ = 10, LZ = 17, AJAR = 16, OPEN = 54, PH = 2.2;
const STACKS = [[14, 22, 3], [32, 22, 2], [50, 22, 3], [14, 62, 2], [32, 62, 3], [50, 62, 1]];
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.02);
  fit(C, [[0, 0, 0], [W + OPEN, 0, 0], [W + OPEN, D, 0], [0, D, 0], [W + OPEN, D, LZ], [0, 0, LZ], [W + OPEN, 0, LZ]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  for (const [x, y, n] of STACKS) for (let j = 0; j < n; j++) put(solid(g), prism(P, front, disc(x, y, 7), disc(x, y, 5.6), BZ + j * PH, BZ + (j + 1) * PH));

  const lid = solid(g);
  lid.sil.classList.add("hi");
  const rule = mk("path", { class: "lo nf" }, g);
  const dx = tween(AJAR);
  let last = NaN;
  function draw(x) {
    if (x === last) return;
    last = x;
    const [lr, li] = rings(x, 0, x + W, D, 6, 2);
    put(lid, prism(P, front, lr, li, BZ, LZ));
    let d = "";
    for (let i = 1; i < 4; i++) {
      d += seg(P(x + (i * W) / 4, 5, LZ), P(x + (i * W) / 4, D - 5, LZ));
      d += seg(P(x + 5, (i * D) / 4, LZ), P(x + W - 5, (i * D) / 4, LZ));
    }
    rule.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(dx, now)); return !tdone(dx, now); });
  bag.add(B.unregister);

  let open = null;
  function setOpen(o) {
    if (o === open) return;
    open = o;
    tset(dx, o ? AJAR + (OPEN - AJAR) * reach : AJAR, performance.now(), 0);
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  setOpen(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0); setOpen(x > -10 && x < W + AJAR + 10 && y > -10 && y < D + 10); },
    leave: () => setOpen(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (open) { open = null; setOpen(true); } }, destroy: bag.dispose };
}

hairline({
  name: "boardpieces2",
  means: "A draughts box whose lid is the board: the pointer over it slides the lid off to show the stacks of pieces inside.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[161, 126], [120, 150], [196, 168], null],
  mount,
});
