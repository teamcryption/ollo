/**
 * Loanstamp: a rubber stamp over a sheet: a rubber block, a short neck and a
 * round knob, held above the paper with an earlier print beside it. At rest
 * the knob is bright. The pointer over the sheet brings the stamp down onto
 * the paper and its rubber block takes the bright. The slider is the hover height.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 84, D = 64, CX = 50, CY = 30;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let up = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [CX, CY, 70]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(0, 0, W, D, 3, 1.2);
  put(solid(g), prism(P, front, pr, pi, 0, 1.2));
  mk("path", { class: "nf lo", d: poly(ringAt(P, rings(8, 40, 34, 58, 3, 1)[0], 1.2)) }, g);
  mk("path", { class: "nf lo", d: poly(ringAt(P, disc(21, 49, 4), 1.2)) }, g);
  const print = mk("path", { class: "nf", d: poly(ringAt(P, rings(CX - 16, CY - 12, CX + 16, CY + 12, 3, 1)[0], 1.2)) }, g);
  const blk = solid(g), neck = solid(g), knob = mk("path", { class: "sil" }, g), kcr = mk("path", { class: "nf lo" }, g);
  const [br, bi] = rings(CX - 16, CY - 12, CX + 16, CY + 12, 3, 1.5);
  const z = tween(up);
  let last = NaN;
  function draw(z0) {
    if (z0 === last) return;
    last = z0;
    put(blk, prism(P, front, br, bi, z0, z0 + 9));
    put(neck, prism(P, front, disc(CX, CY, 4.5), disc(CX, CY, 3.5), z0 + 9, z0 + 22));
    const pts = [];
    for (const [r, h] of [[6, 0], [10, 3], [11, 6], [9.5, 10], [5, 13]]) pts.push(...ringAt(P, disc(CX, CY, r), z0 + 22 + h));
    knob.setAttribute("d", poly(hull(pts)));
    kcr.setAttribute("d", poly(ringAt(P, disc(CX, CY, 9), z0 + 32)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(z, v ? 1.2 : up, performance.now(), 0);
    knob.classList.toggle("hi", !v);
    blk.sil.classList.toggle("hi", v);
    read.textContent = v ? "press" : "rest";
    B.wake();
  }
  setOn(false);
  function hit([sx, sy]) { const [x, y] = unproj(C, sx, sy, 0); return x > -6 && x < W + 6 && y > -6 && y < D + 6; }
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { up = v; if (!on) { tset(z, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "loanstamp",
  means: "A rubber stamp held over a sheet: the pointer over the paper brings it down to press a fresh print.",
  rules: [1, 4, 5, 6],
  range: [18, 26, 34],
  tour: [[167, 211], [184, 150], [216, 250], null],
  mount,
});
