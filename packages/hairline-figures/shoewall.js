/**
 * Shoe wall: a store wall with nine small floating shelves, three across and
 * three high, a shoe on each: sneakers, a high-top, a low runner, each a
 * sole and an upper with its collar and laces. The pointer picks a shelf on
 * the wall's face: its shoe swings its toe out toward the reader and lifts,
 * and the shoes around it turn out a little, staggered from it. At rest the
 * shoes sit at uneven angles and one stands half turned, bright. The slider
 * is the stagger.
 *
 * The pattern: one of many on a face (lockers); the hit is read on the
 * wall's face plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, fillet, hull, poly, prism, proj, rad, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NC = 3, NR = 3, CW = 36, CH = 26, M = 6, BASE = 6, D = 8, SD = 15, L = 25, WD = 9;
const W = 2 * M + NC * CW, H = BASE + NR * CH + 8, FAV = 4;
const YAW = [8, -4, 3, -6, 18, 5, 2, 10, -3], HC = [13, 18, 12, 14, 13, 12, 17, 12, 14];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D + SD + 14, BASE], [0, 0, H], [W, 0, H], [W, D + SD + 14, BASE]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [wr, wi] = rings(0, 0, W, D, 3, 1.4);
  put(solid(g), prism(P, front, wr, wi, 0, H));

  const sole = rrect(0, 0, L, WD, 3.6, 4), soleIn = rrect(0.8, 0.8, L - 0.8, WD - 0.8, 2.8, 4);
  const shoes = [];
  for (let r = 0; r < NR; r++) for (let c = 0; c < NC; c++) {
    const x0 = M + c * CW + 2, x1 = M + (c + 1) * CW - 2, z = BASE + r * CH;
    const [br, bi] = rings(x0, D, x1, D + SD, 1.4, 0.7);
    put(solid(g), prism(P, front, br, bi, z - 2, z));
    const i = c * NR + (NR - 1 - r), hc = HC[i];
    // heel counter, tongue, vamp: three convex parts keep the collar's dip
    const f = (pts) => fillet(pts, pts.map(() => 1.6), 3);
    const parts = [
      f([[0.3, 2.6], [9, 2.6], [9.5, hc - 3], [6.5, hc], [1.5, hc + 0.3], [0, hc - 2.5]]),
      f([[6.5, 7], [10, 7], [9.4, hc + 1.6], [6.6, hc + 1.2]]),
      f([[6, 2.6], [L - 1, 2.6], [L, 5], [L - 3.5, 8], [L * 0.5, 10], [9, 11], [6, 9.5]]),
    ];
    const el = { g: mk("g", {}, g) };
    el.sole = mk("path", { class: "sil" }, el.g);
    el.welt = mk("path", { class: "nf lo" }, el.g);
    el.up = parts.map(() => mk("path", { class: "sil" }, el.g));
    el.marks = mk("path", { class: "nf lo" }, el.g);
    shoes.push({ i, c, r, cx: (x0 + x1) / 2, cy: D + SD / 2, z, parts, el, s: tween(0), last: NaN });
  }
  shoes.sort((a, b) => a.i - b.i);

  function draw(sh, t) {
    const a = rad(YAW[sh.i] * (1 - t) + 26 * t), co = Math.cos(a), si = Math.sin(a);
    const out = 7 * t, lift = 6 * t;
    const T = (u, w, h) => P(sh.cx + (u - L / 2) * co - (w - WD / 2) * si, sh.cy + out + (u - L / 2) * si + (w - WD / 2) * co, sh.z + lift + h);
    const ring = (rg, h) => rg.map((q) => T(q.u, q.v, h));
    sh.el.sole.setAttribute("d", poly(hull(ring(sole, 0).concat(ring(sole, 2.6)))));
    sh.el.welt.setAttribute("d", poly(ring(soleIn, 2.6)));
    sh.parts.forEach((pr, j) => {
      const w0 = j === 1 ? 2.6 : 1, up = [];
      for (const [w, e] of [[w0, 0.7], [w0 + 1, 0], [WD - w0 - 1, 0], [WD - w0, 0.7]]) for (const [u, h] of pr) up.push(T(u, w, h - e));
      sh.el.up[j].setAttribute("d", poly(hull(up)));
    });
    let m = "";
    for (const u of [11.5, 14, 16.5]) { const h = 10.8 - (u - 9) * 0.1; m += seg(T(u, 2.4, h), T(u + 0.5, WD - 2.4, h)); }
    sh.el.marks.setAttribute("d", m + seg(T(L * 0.62, 1, 5), T(L - 2, 1, 4.2)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const sh of shoes) {
      const t = tval(sh.s, now);
      if (t !== sh.last) { draw(sh, t); sh.last = t; }
      if (!tdone(sh.s, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  /** The shelf under the point, read on the wall's face plane (y = D), which never moves. */
  function hit([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + D * s) / c, Y = x * s + D * c, z = (Y * C.k - (sy - C.oy) / C.S) / zf;
    if (x < M || x > W - M || z < BASE - 4 || z > BASE + NR * CH) return -1;
    const col = clamp(Math.floor((x - M) / CW), 0, NC - 1), row = clamp(Math.floor((z - BASE + 4) / CH), 0, NR - 1);
    return col * NR + (NR - 1 - row);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const ac = a >= 0 ? shoes[a] : null, fc = from >= 0 ? shoes[from] : null;
    shoes.forEach((sh, i) => {
      const dist = ac ? Math.abs(sh.c - ac.c) + Math.abs(sh.r - ac.r) : 0;
      const t = a < 0 ? (i === FAV ? 0.45 : 0) : dist === 0 ? 1 : dist === 1 ? 0.22 : 0.06;
      tset(sh.s, t, now, fc ? (Math.abs(sh.c - fc.c) + Math.abs(sh.r - fc.r)) * stag : 0);
      sh.el.up.forEach((e) => e.classList.toggle("hi", i === (a < 0 ? FAV : a)));
    });
    read.textContent = a < 0 ? "rest" : `shoe ${ac.c + 1}·${NR - ac.r}`;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "shoewall",
  means: "Nine shoes on a store wall: the one under the pointer swings out toward the reader and lifts, and its neighbours turn a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 108], [207, 191], [256, 254], null],
  mount,
});
