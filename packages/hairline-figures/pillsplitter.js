/**
 * Pill splitter: a rounded clamshell case, a blade under its lid and a pill
 * waiting in the cradle. The pointer over the case swings the lid open on its
 * far hinge to show the pill; at rest the lid stands ajar, bright.
 * The slider is how far the lid opens.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, circ, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 70, D = 46, BH = 12, LT = 9, REST = 22;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, -LT, BH + D], [W, -LT, BH + D], [W, D, BH + LT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const lidG = mk("g", {}, g);
  const baseG = mk("g", {}, g);
  const [br, bi] = rings(0, 0, W, D, 9, 2);
  put(solid(baseG), prism(P, front, br, bi, 0, BH));
  // the cradle: a shallow V well with a pill in it
  mk("path", { d: poly(ringAt(P, rrect(12, 14, W - 12, D - 14, 8, 6), BH)), class: "nf lo" }, baseG);
  const pill = [];
  for (const [x, r] of [[W / 2 - 7, 6], [W / 2, 6], [W / 2 + 7, 6]]) pill.push(...ringAt(P, disc(x, D / 2, r), BH), ...ringAt(P, disc(x, D / 2, r), BH + 4));
  mk("path", { d: poly(hull(pill)), class: "nf" }, baseG);
  mk("path", { d: poly(ringAt(P, disc(W / 2, D / 2, 1.4, 12), BH + 4)), class: "nf lo" }, baseG);

  const lid = mk("path", { class: "sil" }, lidG), lcr = mk("path", { class: "nf lo" }, lidG), blade = mk("path", { class: "nf lo" }, lidG);
  const [lr, li] = [rrect(0, 0, W, D, 9, 4), rrect(2, 2, W - 2, D - 2, 7, 4)];
  const ang = tween(REST * open);
  let last = NaN;
  // rotate about the hinge line y = 0, z = BH
  const R = (a) => (q, zl) => { const t = (a * Math.PI) / 180, y = q.v * Math.cos(t) - zl * Math.sin(t), z = BH + q.v * Math.sin(t) + zl * Math.cos(t); return P(q.u, y, z); };
  function draw(a) {
    if (a === last) return;
    last = a;
    const f = R(a);
    lid.setAttribute("d", poly(hull(lr.map((q) => f(q, 0)).concat(lr.map((q) => f(q, LT))))));
    lcr.setAttribute("d", poly(li.map((q) => f(q, a > 90 ? 0 : LT))));
    blade.setAttribute("d", a > 30 ? poly([f({ u: 10, v: D / 2 }, -0.1), f({ u: W - 10, v: D / 2 }, -0.1), f({ u: W - 10, v: D / 2 + 1 }, -0.1), f({ u: 10, v: D / 2 + 1 }, -0.1)]) : "");
    if (a > 88) g.insertBefore(lidG, baseG); else baseG.after(lidG);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a ? 40 + 75 * open : REST, performance.now(), 0);
    lid.classList.add("hi");
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  const hit = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, BH); return x > -6 && x < W + 6 && y > -10 && y < D + 6; };
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; act = null; }, destroy: bag.dispose };
}

hairline({
  name: "pillsplitter",
  means: "A clamshell pill splitter: the pointer over the case swings its lid open on the hinge to show the pill in the cradle.",
  rules: [1, 4, 5, 6],
  range: [0.4, 1, 1],
  tour: [[200, 190], [160, 180], [240, 195], null],
  mount,
});
