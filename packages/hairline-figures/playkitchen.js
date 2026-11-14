/**
 * Toy chest: a long chest with a lid hinged along its back edge, a ball and a
 * block inside. The pointer over the chest opens the lid and the toys rise to
 * the rim. At rest the lid stands ajar, bright. The slider is how far it opens.
 *
 * The pattern: one object, one hinge (lid).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 36, H = 30, T = 3.5, AJAR = 22;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, -8, H + D], [W, -8, H + D], [W, D, H + 4]], 200, 170);
  const P = proj(C), front = facing(C);
  const root = mk("g", {}, svg), lidG = mk("g", {}, root), boxG = mk("g", {}, root);
  const [ring, inner] = rings(0, 0, W, D, 4, 3);
  put(solid(boxG), prism(P, front, ring, inner, 0, H));
  const toysG = mk("g", {}, boxG);
  const ball = mk("path", {}, toysG), block = solid(toysG);
  const fr = run(ring, front), top = ringAt(P, fr, H), bot = ringAt(P, fr, 0);
  mk("path", { d: poly(top.concat(bot.slice().reverse())), class: "fo" }, boxG);
  mk("path", { d: open([top[0], ...bot, top[top.length - 1]]), class: "nf sil" }, boxG);
  mk("path", { d: open(top), class: "nf" }, boxG);
  const latch = [[W / 2 - 4, H - 3], [W / 2 + 4, H - 3], [W / 2 + 4, H - 10], [W / 2 - 4, H - 10]].map(([x, z]) => P(x, D, z));
  mk("path", { d: poly(latch), class: "nf lo" }, boxG);

  const lid = solid(lidG);
  lid.sil.classList.add("hi");
  const lr = rrect(0, 0, W, D, 4, 4), li = rrect(2, 2, W - 2, D - 2, 2.5, 4);
  const at = (q, a, t) => P(q.u, q.v * Math.cos(a) - t * Math.sin(a), H + q.v * Math.sin(a) + t * Math.cos(a));
  const ang = tween(AJAR), rise = tween(0);
  let lastA = NaN, lastR = NaN;

  function draw(now) {
    const a = tval(ang, now), r = tval(rise, now);
    if (a !== lastA) {
      lastA = a;
      const ar = (a * Math.PI) / 180;
      lid.sil.setAttribute("d", poly(hull(lr.map((q) => at(q, ar, 0)).concat(lr.map((q) => at(q, ar, T))))));
      lid.cr.setAttribute("d", poly(li.map((q) => at(q, ar, a > 90 ? 0 : T))));
      if (a > 40 && lidG.nextSibling !== boxG) root.insertBefore(lidG, boxG);
      if (a <= 40 && boxG.nextSibling !== lidG) root.append(lidG);
    }
    if (r !== lastR) {
      lastR = r;
      const bz = H - 12 + r * 10, pts = [];
      for (let i = -4; i <= 4; i++) { const t = (i / 4) * (Math.PI / 2); pts.push(...ringAt(P, disc(20, 17, 9 * Math.cos(t)), bz + 9 * Math.sin(t))); }
      ball.setAttribute("d", poly(hull(pts)));
      const [br, bi] = rings(36, 10, 50, 24, 2, 1.2);
      put(block, prism(P, front, br, bi, H - 14 + r * 8, H - 1 + r * 8));
    }
  }
  const B = register(stage, (_dt, now) => { draw(now); return !(tdone(ang, now) && tdone(rise, now)); });
  bag.add(B.unregister);

  const corners = [[0, 0, 0], [W, 0, 0], [W, D, 0], [0, D, 0], [0, 0, H], [W, 0, H], [W, D, H], [0, D, H]].map(([x, y, z]) => P(x, y, z));
  const xs = corners.map((p) => p[0]), ys = corners.map((p) => p[1]);
  const box = [Math.min(...xs), Math.min(...ys) - 20, Math.max(...xs), Math.max(...ys)];
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    const now = performance.now();
    tset(ang, v ? maxA : AJAR, now, 0);
    tset(rise, v ? 1 : 0, now, v ? 120 : 0);
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setOn(sx > box[0] && sx < box[2] && sy > box[1] && sy < box[3]),
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (on) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "playkitchen",
  means: "A toy chest: the pointer over it lifts the lid on its back hinge and the ball and block rise to the rim.",
  rules: [1, 3, 5, 6],
  range: [60, 100, 112],
  tour: [[192, 181], [164, 205], null],
  mount,
});
