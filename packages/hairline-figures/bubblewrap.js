/**
 * Packing bench: a workbench on four legs with three cartons on it, each
 * with two top flaps. The pointer picks a carton by where it is along the
 * bench: its flaps fold shut, the other cartons throw their flaps wide,
 * staggered from it. At rest the flaps stand at uneven angles, one carton
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row; nearest rest centre by screen x.
 */
const {
  Cam, clamp, facing, fillet, fit, poly, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, rad,
} = HL;

const W = 86, D = 34, TOP = 30, T = 3.5, ZB = TOP + T, OPEN = 165;
const BOX = [[4, 8, 24, 28, 14], [30, 6, 54, 28, 20], [60, 10, 80, 26, 12]];
const REST = [[12, 30], [22, 8], [35, 15]], FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[0, 0, 0], [W, D, 0], [0, D, 0], [W, 0, 0], [4, 8, ZB + 34], [80, 26, ZB + 24], [30, 6, ZB + 46], [54, 28, ZB + 32]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the legs, back to front, then the bench top over them
  [[3, 3], [W - 7, 3], [3, D - 7], [W - 7, D - 7]].sort((a, b) => a[0] + a[1] - b[0] - b[1]).forEach(([x, y]) => {
    const [r, i] = rings(x, y, x + 4, y + 4, 1.2, 0.6);
    put(solid(g), prism(P, front, r, i, 0, TOP));
  });
  let [r, i] = rings(0, 0, W, D, 2.4, 1.1);
  put(solid(g), prism(P, front, r, i, TOP, ZB));

  // a carton, then its far flap (hinged at x0), then its near flap (hinged at x1)
  const boxes = BOX.map(([x0, y0, x1, y1, h], k) => {
    const s = solid(g);
    [r, i] = rings(x0, y0, x1, y1, 1.4, 0.8);
    const f0 = mk("path", { class: "" }, g), f1 = mk("path", { class: "" }, g);
    return { k, x0, y0, x1, y1, h, r, i, z: ZB + h, s, f: [f0, f1], a: [tween(REST[k][0]), tween(REST[k][1])], last: [NaN, NaN], lz: tween(0), lastz: NaN };
  });
  // a carton lifts off the bench when it is sealed
  function lift(b, z) {
    if (z === b.lastz) return;
    b.lastz = z;
    put(b.s, prism(P, front, b.r, b.i, ZB + z, ZB + b.h + z));
    b.z = ZB + b.h + z;
    b.last = [NaN, NaN];
  }

  function flap(b, side, deg) {
    if (deg === b.last[side]) return;
    b.last[side] = deg;
    const L = (b.x1 - b.x0) / 2 - 0.3, xh = side ? b.x1 : b.x0, dir = side ? -1 : 1;
    const xt = xh + dir * L * Math.cos(rad(deg)), zt = b.z + L * Math.sin(rad(deg));
    const pts = [P(xh, b.y0 + 0.5, b.z), P(xh, b.y1 - 0.5, b.z), P(xt, b.y1 - 0.5, zt), P(xt, b.y0 + 0.5, zt)];
    b.f[side].setAttribute("d", poly(fillet(pts, [0.5, 0.5, 1.5, 1.5], 3)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    boxes.forEach((b) => { lift(b, tval(b.lz, now)); if (!tdone(b.lz, now)) moving = true; });
    boxes.forEach((b) => [0, 1].forEach((sd) => { flap(b, sd, tval(b.a[sd], now)); if (!tdone(b.a[sd], now)) moving = true; }));
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, ZB + 14);
    if (x < -6 || x > W + 6 || y < -16 || y > D + 16) return -1;
    let best = -1, bd = 1e9;
    boxes.forEach((b) => { const d = Math.abs(P((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, b.z)[0] - sx); if (d < bd) { bd = d; best = b.k; } });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    boxes.forEach((b) => {
      const d = from < 0 ? 0 : Math.abs(b.k - from) * stag;
      tset(b.lz, b.k === a ? 12 : 0, now, d + 180);
      [0, 1].forEach((sd) => tset(b.a[sd], a < 0 ? REST[b.k][sd] : b.k === a ? 0 : OPEN, now, d + sd * 90));
      b.s.sil.classList.toggle("hi", b.k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "box " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = clamp(v, 0, 90); }, destroy: bag.dispose };
}

hairline({
  name: "bubblewrap",
  means: "A packing bench: the carton under the pointer folds its flaps shut, the other cartons throw theirs wide after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[149, 112], [198, 114], [244, 164], null],
  mount,
});
