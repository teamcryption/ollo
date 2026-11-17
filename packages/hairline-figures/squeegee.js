/**
 * Squeegee: a window squeegee lying on a pane of glass, its rubber blade
 * across the pane and its handle raised. The pointer over the pane draws
 * the squeegee along to it, the handle leaning into the pull. At rest it
 * waits at the near end, blade bright. The slider is how far the handle leans.
 *
 * The pattern: one part sliding along a track to the pointer.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, unproj, disposer, mk, pointer, put, register, solid } = HL;

const W = 120, D = 70, BL = 58, X0 = 14, X1 = W - 14, CZ = 4;
const disc = (x, y, z, r, n = 18) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let k = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -4, 0], [W + 4, D + 4, 0], [W + 4, -4, 0], [-4, D + 4, 0], [-30, D / 2, 60], [W, D / 2, 60]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-4, -4, W + 4, D + 4, 5, 2);
  put(solid(g), prism(P, front, pr, pi, 0, CZ));
  const [gr, gi] = rings(4, 4, W - 4, D - 4, 2, 1.5);
  mk("path", { d: poly(gr.map((q) => P(q.u, q.v, CZ + 0.4))), class: "nf lo" }, g);
  const sq = mk("g", {}, g);
  const x = tween(X0);
  let last = NaN;

  function draw(px) {
    if (px === last) return;
    last = px;
    sq.replaceChildren();
    const ys0 = D / 2 - BL / 2, ys1 = D / 2 + BL / 2;
    if (px > X0 + 1) for (const yy of [ys0, ys1]) mk("path", { d: poly([P(X0, yy, CZ + 0.5), P(px - 2, yy, CZ + 0.5)]), class: "nf lo" }, sq);
    const y0 = D / 2 - BL / 2, y1 = D / 2 + BL / 2;
    const [br, bi] = rings(px - 1.6, y0, px + 1.6, y1, 1.2, 0.6);
    put(solid(sq), prism(P, front, br, bi, CZ, CZ + 5));
    const [hr, hi] = rings(px - 4, y0 + 2, px + 4, y1 - 2, 2.5, 1.2);
    put(solid(sq), prism(P, front, hr, hi, CZ + 5, CZ + 12));
    const t = (px - X0) / (X1 - X0), lean = (-22 + t * 8) * k;
    const hp = ringAt(P, disc(px, D / 2, 0, 3.4), CZ + 12).concat(ringAt(P, disc(px + lean, D / 2, 0, 3.4), CZ + 48));
    mk("path", { d: poly(hull(hp)), class: "sil" }, sq);
    mk("path", { d: poly(hull(ringAt(P, disc(px + lean, D / 2, 0, 4.4), CZ + 46).concat(ringAt(P, disc(px + lean * 1.06, D / 2, 0, 4.4), CZ + 52)))), class: "nf" }, sq);
    mk("path", { d: poly([P(px, y0, CZ + 5.2), P(px, y1, CZ + 5.2)]), class: "nf hi" }, sq);
  }

  const B = register(stage, (_dt, now) => { draw(tval(x, now)); return !tdone(x, now); });
  bag.add(B.unregister);

  let act = NaN;
  function go(tx, label) {
    if (Math.abs(tx - act) < 0.5) return;
    act = tx;
    tset(x, tx, performance.now(), 0);
    read.textContent = label;
    B.wake();
  }
  go(X0, "rest");
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [wx, wy] = unproj(C, sx, sy, CZ);
      if (wx < -10 || wx > W + 10 || wy < -20 || wy > D + 20) return go(X0, "rest");
      const tx = Math.max(X0, Math.min(X1, wx));
      go(tx, Math.round(((tx - X0) / (X1 - X0)) * 100) + "%");
    },
    leave: () => go(X0, "rest"),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { k = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "squeegee",
  means: "A window squeegee lying across a pane: it slides along the glass to the pointer, leaving a clean streak, its handle leaning.",
  rules: [1, 3, 5, 6],
  range: [0.5, 1, 1.4],
  tour: [[257, 229], [215, 205], [180, 185], null],
  mount,
});
