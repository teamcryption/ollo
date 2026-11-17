/**
 * Fingertip oximeter: a rounded clip with a sprung upper shell hinged at its
 * far end and a screen on its top. The pointer over the clip swings the upper
 * shell open to show the finger pad; at rest it stands a little ajar, bright.
 * The slider is how far the clip opens.
 */
const {
  Cam, fit, facing, hull, poly, open, prism, proj, rings, ringAt, rrect, circ, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 36, BH = 11, LT = 13, REST = 12;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let wide = value;
  const C = Cam(45, 0.5, 3.15);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [-LT, 0, BH + 1 + W * 0.79 + LT * 0.62], [-LT, D, BH + 1 + W * 0.79 + LT * 0.62], [W, D, BH + LT]], 200, 150);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const baseG = mk("g", {}, g);
  const lidG = mk("g", {}, g);
  const [br, bi] = rings(0, 0, W, D, 12, 2);
  put(solid(baseG), prism(P, front, br, bi, 0, BH));
  // the finger pad and the sensor window in it
  mk("path", { d: poly(ringAt(P, rrect(8, 7, W - 4, D - 7, 10, 6), BH)), class: "nf lo" }, baseG);
  mk("path", { d: poly(ringAt(P, disc(W * 0.42, D / 2, 3.2), BH)), class: "nf lo" }, baseG);

  const lid = mk("path", { class: "sil" }, lidG), lcr = mk("path", { class: "nf lo" }, lidG);
  const scr = mk("path", { class: "nf lo" }, lidG), btn = mk("path", { class: "nf lo" }, lidG), bars = mk("path", { class: "nf lo" }, lidG);
  const lr = rrect(0, 0, W, D, 12, 4), li = rrect(2, 2, W - 2, D - 2, 10, 4);
  const sr = rrect(10, 8, 40, D - 8, 3, 3), bt = disc(W - 11, D / 2, 4, 16);
  const ang = tween(REST);
  let last = NaN;
  // rotate about the hinge line x = 0, z = BH
  const R = (a) => (q, zl) => { const t = (a * Math.PI) / 180, x = q.u * Math.cos(t) - zl * Math.sin(t), z = BH + 0.6 + q.u * Math.sin(t) + zl * Math.cos(t); return P(x, q.v, z); };
  function draw(a) {
    if (a === last) return;
    last = a;
    const f = R(a);
    lid.setAttribute("d", poly(hull(lr.map((q) => f(q, 0)).concat(lr.map((q) => f(q, LT))))));
    lcr.setAttribute("d", poly(li.map((q) => f(q, LT))));
    scr.setAttribute("d", poly(sr.map((q) => f(q, LT))));
    btn.setAttribute("d", poly(bt.map((q) => f(q, LT))));
    bars.setAttribute("d", [16, 22, 28, 34].map((u, i) => open([f({ u, v: D / 2 + 4 }, LT), f({ u, v: D / 2 - 1 - i * 1.5 }, LT)])).join(""));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let act = null;
  function aim(now) { tset(ang, act ? 20 + 32 * wide : REST, now, 0); B.wake(); }
  function setActive(a) {
    if (a === act) return;
    act = a;
    lid.classList.add("hi");
    read.textContent = a ? "open" : "rest";
    aim(performance.now());
  }
  const hit = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, BH); return x > -6 && x < W + 6 && y > -6 && y < D + 6; };
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { wide = v; aim(performance.now()); }, destroy: bag.dispose };
}

hairline({
  name: "pulseoxi",
  means: "A fingertip oximeter: the pointer over the clip swings its upper shell open on the hinge to show the finger pad.",
  rules: [1, 4, 5, 6],
  range: [0.3, 1, 1],
  tour: [[232, 197], [205, 188], [256, 214], null],
  mount,
});
