/**
 * Metal detector: a walk-through arch of two sensor pillars under a
 * crossbeam, with a traveller waiting at its mouth. The pointer over the
 * arch walks the traveller into it, through the sensor field. At rest the
 * traveller stands a step short of the arch, bright. The slider is how far
 * into the arch they walk.
 */
const { Cam, clamp, fit, hull, poly, proj, seg, tdone, tset, tval, tween, disposer, mk, pointer, register, solid } = HL;

const W = 40, PW = 6, PD = 12, H = 74, BH = 9, REST = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let goal = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[0, 0, 0], [W, 0, 0], [W, PD, 0], [0, PD, 0], [0, 0, H], [W, PD, H], [14, REST + 8, 0], [26, REST + 8, 0]], 200, 160);
  const P = proj(C), c = Math.cos(C.az), s = Math.sin(C.az);
  const near = (q) => q[0] * s + q[1] * c;
  function blk(el, x0, y0, x1, y1, z0, z1) {
    const pl = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
    const top = pl.map((q) => P(q[0], q[1], z1)), bot = pl.map((q) => P(q[0], q[1], z0));
    el.sil.setAttribute("d", poly(hull(top.concat(bot))));
    el.cr.setAttribute("d", poly(top) + seg(top[2], bot[2]));
  }
  const g = mk("g", {}, svg);
  // floor mat under the arch
  mk("path", { d: poly([P(-6, -6, 0), P(W + 6, -6, 0), P(W + 6, PD + 6, 0), P(-6, PD + 6, 0)]), class: "nf lo" }, g);
  const left = solid(g);
  blk(left, 0, 0, PW, PD, 0, H - BH);
  // the sensor zones on the inner face of the left pillar
  let z = "";
  for (let k = 1; k < 6; k++) z += seg(P(PW, 2, k * 10), P(PW, PD - 2, k * 10));
  mk("path", { d: z, class: "nf lo" }, g);

  const parts = [[15, 19, 0, 24], [21, 25, 0, 24], [13.5, 26.5, 22, 46], [17, 23, 47.5, 56]].map((p) => ({ p, el: solid(g) }));
  const right = solid(g);
  blk(right, W - PW, 0, W, PD, 0, H - BH);
  const beam = solid(g);
  blk(beam, 0, 0, W, PD, H - BH, H);
  mk("path", { d: poly([P(14, PD, H - 3), P(26, PD, H - 3), P(26, PD, H - 6), P(14, PD, H - 6)]), class: "nf lo" }, g);

  const walk = tween(REST);
  let last = NaN;
  function draw(y) {
    for (const { p, el } of parts) blk(el, p[0], y, p[1], y + (p[2] > 40 ? 5 : 6), p[2], p[3]);
  }
  const B = register(stage, (_dt, now) => {
    const y = tval(walk, now);
    if (y !== last) { draw(y); last = y; }
    return !tdone(walk, now);
  });
  bag.add(B.unregister);

  const restHull = hull([[0, 0, 0], [W, 0, 0], [W, PD, 0], [0, PD, 0], [0, 0, H], [W, 0, H], [W, PD, H], [0, PD, H], [14, REST + 6, 0], [26, REST + 6, 0], [14, REST + 6, 56], [26, REST + 6, 56]].map((q) => P(q[0], q[1], q[2])));
  function inside([x, y]) {
    let o = false;
    for (let i = 0, j = restHull.length - 1; i < restHull.length; j = i++) {
      const [xi, yi] = restHull[i], [xj, yj] = restHull[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) o = !o;
    }
    return o;
  }
  let act = null;
  const tgt = () => clamp(REST - goal, 3, REST - 8);
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(walk, on ? tgt() : REST, performance.now(), 0);
    for (const { el } of parts) el.sil.classList.toggle("hi", true);
    read.textContent = on ? "scan" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { goal = v; if (act) { tset(walk, tgt(), performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "walkthrough",
  means: "A walk-through metal detector arch: the pointer walks the waiting traveller into the arch, through the sensor pillars.",
  rules: [1, 3, 5, 6],
  range: [10, 20, 27],
  tour: [[160, 136], [185, 216], [238, 93], null],
  mount,
});
