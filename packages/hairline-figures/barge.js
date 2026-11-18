/**
 * Barge: a long, low hull with a wheelhouse at the stern and three hatch
 * covers over the hold. The pointer picks a cover by where it is along the
 * barge: that cover swings open on its far hinge, the ones beside it lift a
 * little, staggered from it. At rest the middle cover stands ajar, bright.
 * The slider is how far a cover opens.
 */
const {
  Cam, clamp, facing, fit, fillet, hull, open, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 140, W = 40, HZ = 10, CZ = 15, X0 = 30, CW = 34, GAP = 2, N = 3, REST = [4, 38, 8], FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [8, 8, 32], [80, 4, CZ + W - 6], [80, -20, CZ + 20]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the hull: a long low solid with a rubbing strake
  const hl = solid(g);
  const [hr, hi] = rings(0, 0, L, W, 12, 1.8);
  put(hl, prism(P, front, hr, hi, 0, HZ));
  mk("path", { class: "nf lo", d: seg(P(10, W, 4), P(L - 12, W, 4)) }, hl.g);
  // the wheelhouse at the stern, with a stack
  const wh = solid(g);
  const [wr, wi] = rings(5, 8, 22, W - 8, 3, 0.9);
  put(wh, prism(P, front, wr, wi, HZ, HZ + 18));
  mk("path", { class: "nf lo", d: seg(P(22, 12, HZ + 13), P(22, W - 12, HZ + 13)) }, wh.g);
  // the hold's coaming
  const co = solid(g);
  const [cr, ci] = rings(X0 - 2, 3, X0 + N * (CW + GAP), W - 3, 3, 1);
  put(co, prism(P, front, cr, ci, HZ, CZ));

  // the covers: plates hinged along the far edge (y = 4) at the coaming's top
  const covers = [];
  for (let k = 0; k < N; k++) covers.push({ x: X0 + k * (CW + GAP), s: solid(g), a: tween(REST[k]), last: NaN });
  function draw(c, deg) {
    if (deg === c.last) return;
    c.last = deg;
    const t = rad(deg), D = W - 8, cs = Math.cos(t), sn = Math.sin(t);
    const at = (u, v, h) => P(c.x + u, 4 + v * cs - h * sn, CZ + v * sn + h * cs);
    const pts = [];
    for (const u of [0, CW]) for (const v of [0, D]) for (const h of [0, 2]) pts.push(at(u, v, h));
    c.s.sil.setAttribute("d", poly(fillet(hull(pts), Array(hull(pts).length).fill(1.2))));
    c.s.cr.setAttribute("d", open([at(1, D - 1, 2), at(CW - 1, D - 1, 2)]) + seg(at(CW / 2 - 3, D - 5, 2), at(CW / 2 + 3, D - 5, 2)));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    covers.forEach((c) => { draw(c, tval(c.a, now)); if (!tdone(c.a, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: on the deck's plane, then the cover whose rest centre is nearest on screen x
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, CZ);
    if (x < X0 - 12 || x > L || y < -30 || y > W + 8) return -1;
    let best = -1, bd = Infinity;
    covers.forEach((c, k) => { const d = Math.abs(P(c.x + CW / 2, W / 2, CZ)[0] - sx); if (d < bd) { bd = d; best = k; } });
    return best;
  }
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    covers.forEach((c, k) => {
      const z = a < 0 ? REST[k] : clamp(amp * (1 - 0.42 * Math.abs(k - a)), 0, amp);
      tset(c.a, z, now, from < 0 ? 0 : Math.abs(k - from) * 45);
      c.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "hold " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = clamp(v, 50, 120); setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "barge",
  means: "A barge with three hatch covers over its hold: the cover under the pointer swings open on its hinge, its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [50, 100, 120],
  tour: [[168, 150], [218, 175], [270, 201], null],
  mount,
});
