/**
 * Grit bin: a squat roadside bin with a humped lid hinged along its back,
 * a heap of grit inside. The pointer over the bin swings the lid up and back
 * to show the grit; at rest the lid sits ajar, bright.
 * The slider is how far the lid opens.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, circ, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 84, D = 52, H = 36, LT = 12, REST = 14;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  let reach = value;
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-4, 0, 0], [W + 4, D, 0], [W, 0, 0], [0, D, 0], [0, -LT, H + D], [W, -LT, H + D], [W, D, H + LT]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const lidG = mk("g", {}, g);
  const baseG = mk("g", {}, g);
  // two low skids, then the body
  for (const x of [6, W - 14]) { const [sr, si] = rings(x, 2, x + 8, D - 2, 3, 1); put(solid(baseG), prism(P, front, sr, si, 0, 4)); }
  const [br, bi] = rings(0, 0, W, D, 8, 2);
  put(solid(baseG), prism(P, front, br, bi, 4, H));
  mk("path", { d: poly(ringAt(P, rrect(5, 5, W - 5, D - 5, 5, 4), H)), class: "nf lo" }, baseG);
  // the grit: a low heap in the mouth
  const heap = [];
  for (const [r, z] of [[20, 0], [14, 4], [7, 7]]) heap.push(...ringAt(P, disc(W / 2 + 4, D / 2, r, 20), H - 3 + z));
  mk("path", { d: poly(hull(heap)), class: "nf lo" }, baseG);
  // a hasp on the front face
  mk("path", { d: poly(hull(ringAt(P, rrect(W / 2 - 6, D, W / 2 + 6, D + 1.5, 1, 2), H - 9).concat(ringAt(P, rrect(W / 2 - 6, D, W / 2 + 6, D + 1.5, 1, 2), H - 3)))), class: "nf" }, baseG);

  const lid = mk("path", { class: "sil" }, lidG), lcr = mk("path", { class: "nf lo" }, lidG);
  const lr = rrect(-2, -2, W + 2, D + 2, 9, 4), top = rrect(10, 8, W - 10, D - 10, 12, 4), ti = rrect(12, 10, W - 12, D - 12, 10, 4);
  const ang = tween(REST);
  let last = NaN;
  // rotate about the hinge line y = 0, z = H
  const R = (a) => (q, zl) => { const t = (a * Math.PI) / 180, y = q.v * Math.cos(t) - zl * Math.sin(t), z = H + q.v * Math.sin(t) + zl * Math.cos(t); return P(q.u, y, z); };
  function draw(a) {
    if (a === last) return;
    last = a;
    const f = R(a);
    lid.setAttribute("d", poly(hull(lr.map((q) => f(q, 0)).concat(lr.map((q) => f(q, 3)), top.map((q) => f(q, LT))))));
    lcr.setAttribute("d", a > 95 ? "" : open(ti.map((q) => f(q, LT))) + "Z");
    if (a > 90) g.insertBefore(lidG, baseG); else baseG.after(lidG);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a ? 30 + 80 * reach : REST, performance.now(), 0);
    lid.classList.add("hi");
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  const hit = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, H); return x > -6 && x < W + 6 && y > -10 && y < D + 6; };
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; act = null; }, destroy: bag.dispose };
}

hairline({
  name: "grit",
  means: "A roadside grit bin: the pointer over it swings the humped lid up on its back hinge to show the heap of grit.",
  rules: [1, 4, 5, 6],
  range: [0.4, 1, 1],
  tour: [[190, 167], [164, 208], [222, 200], null],
  mount,
});
