/**
 * Beehive: two wooden hive boxes stacked on a stand with a landing board, the
 * lid off and eight frames hanging in the top box, their top bars on the rim.
 * The pointer picks a frame by where it hangs: it lifts up out of the box,
 * showing its comb, and the frames beside it rise a little, staggered from
 * it. At rest one frame stands half drawn, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 8, STEP = 7.5, W = N * STEP + 4, D = 46, BH = 26, Z0 = 12, RIM = Z0 + 2 * BH;
const BAR = 2.4, HF = 22, LIFT = 30, FAV = 4;
const TOP = RIM + BAR + LIFT + 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-3, -3, 0], [W + 3, D + 10, 0], [W + 3, -3, 0], [-3, D + 10, 0], [0, 0, TOP], [W, 0, TOP], [0, D, TOP], [W, D, TOP]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1) => { const s = solid(g); const [o, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, o, i, z0, z1)); return s; };

  // the stand: four legs, then the bottom board running out to a landing board
  for (const [x, y] of [[-1, -1], [W - 5, -1], [-1, D + 3], [W - 5, D + 3]]) block(x, y, x + 6, y + 6, 1.2, 0.8, 0, 7.5);
  block(-3, -3, W + 3, D + 10, 2.5, 1.4, 7.5, Z0);
  // two boxes: the top one's crease is its open rim
  const handle = (box, z) => {
    const m = mk("path", { class: "nf lo" }, box.g), fx = (y, zz) => P(W, y, zz), fy = (x, zz) => P(x, D, zz);
    return (d) => m.setAttribute("d", d +
      poly([fx(D / 2 - 7, z - 1.4), fx(D / 2 + 7, z - 1.4), fx(D / 2 + 7, z + 1.4), fx(D / 2 - 7, z + 1.4)]) +
      poly([fy(W / 2 - 8, z - 1.4), fy(W / 2 + 8, z - 1.4), fy(W / 2 + 8, z + 1.4), fy(W / 2 - 8, z + 1.4)]));
  };
  const b1 = block(0, 0, W, D, 2.2, 1.4, Z0, Z0 + BH);
  // the entrance: a slot at the foot of the lower box, over the landing board
  handle(b1, Z0 + BH * 0.62)(poly([P(12, D, Z0 + 0.6), P(W - 12, D, Z0 + 0.6), P(W - 12, D, Z0 + 3), P(12, D, Z0 + 3)]));
  const b2 = block(0, 0, W, D, 2.2, 1.4, Z0 + BH, RIM);
  handle(b2, Z0 + BH * 1.62)("");

  const [barR, barI] = rings(-1.5, 0.8, 1.5, D - 0.8, 0.8, 0.5);
  const [bodR, bodI] = rings(-1, 3, 1, D - 3, 0.5, 0.3);
  const shift = (ring, x) => ring.map((q) => ({ ...q, u: q.u + x }));
  const frames = [];
  for (let k = 0; k < N; k++) {
    const x = 2 + STEP / 2 + k * STEP, grp = mk("g", {}, g);
    const body = solid(grp), comb = mk("path", { class: "nf lo" }, grp), bar = solid(grp);
    frames.push({ k, x, body, comb, bar, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN,
      rings: [shift(barR, x), shift(barI, x), shift(bodR, x), shift(bodI, x)] });
  }

  /** A frame lifted L: only what stands above the rim is drawn; the box hides the rest. */
  function draw(f, L) {
    if (L === f.last) return;
    f.last = L;
    const zt = RIM + BAR + L, zbar = zt - BAR, zb = zbar - HF, [br, bi, dr, di] = f.rings;
    put(f.bar, prism(P, front, br, bi, Math.max(zbar, RIM), zt));
    if (zbar > RIM + 0.3) put(f.body, prism(P, front, dr, di, Math.max(zb, RIM), zbar));
    else put(f.body, { sil: "", crease: "" });
    // the comb: an inset panel on the frame's face, open at the rim while the box still hides its foot
    const lo = Math.max(zb + 2.5, RIM + 0.4), hi = zbar - 2, fx = f.x + 1;
    if (hi - lo < 1) { f.comb.setAttribute("d", ""); return; }
    const a = P(fx, 6, lo), b = P(fx, 6, hi), c = P(fx, D - 6, hi), d = P(fx, D - 6, lo);
    let s = open([a, b, c, d]) + (lo > RIM + 0.4 ? seg(d, a) : "");
    for (const t of [0.35, 0.65]) { const zz = lo + (hi - lo) * t; if (zz > lo + 1) s += seg(P(fx, 6, zz), P(fx, D - 6, zz)); }
    f.comb.setAttribute("d", s);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const f of frames) { draw(f, tval(f.z, now)); if (!tdone(f.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // the hit test reads each frame's resting top bar, which never moves
  const mids = frames.map((f) => P(f.x, D / 2, RIM));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 9 && sy > mids[best][1] - 110 && sy < mids[best][1] + 40 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    frames.forEach((f, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 8 : dd === 2 ? 3 : 0;
      tset(f.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      f.bar.sil.classList.toggle("hi", on); f.body.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "frame " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "beehive",
  means: "A beehive with its lid off: the frame under the pointer lifts out of the box, and the frames beside it rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[176, 116], [235, 146], [200, 128], null],
  mount,
});
