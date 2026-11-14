/**
 * Barcode scanner: a checkout counter with a scanner tower at its end, its
 * window facing the belt, and four packs of different sizes in a row, each
 * with a barcode on its near face. The pointer picks a pack by where it is
 * along the counter: that pack lifts high to be scanned, the others lift a
 * little after it, less the farther they stand. At rest one pack sits raised,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row, stepped heights; the hit is the
 * nearest rest centre along screen x.
 */
const {
  Cam, facing, fillet, fit, open, poly, prism, proj, rings, rrect, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TOP = 6, LIFT = 22, Y0 = 9, Y1 = 25;
const PK = [[4, 14, 16], [18, 29, 24], [33, 41, 12], [45, 56, 19]]; // x0, x1, height
const BAR = [0, 1, 1.6, 3, 3.6, 4.8, 6, 6.6];
const REST = [1, 6, 0, 2], FAV = 1, N = PK.length;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.15);
  fit(C, [[0, 0, 0], [84, 32, 0], [84, 0, 0], [0, 32, 0], [18, Y0, TOP + 24 + LIFT], [74, 4, 34]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the counter, with the belt's two seams on its top
  const counter = solid(g);
  put(counter, prism(P, front, ...rings(0, 0, 84, 32, 5, 1.2), 0, TOP));
  mk("path", { class: "nf lo", d: seg(P(2, Y0 - 2, TOP), P(60, Y0 - 2, TOP)) + seg(P(2, Y1 + 2, TOP), P(60, Y1 + 2, TOP)) }, counter.g);

  const packs = PK.map(([x0, x1, h], k) => {
    const s = solid(g);
    return { k, x0, x1, h, s, bars: mk("path", { class: "nf lo" }, s.g), z: tween(REST[k]), last: NaN };
  });

  // the scanner tower, nearest along x, so painted last; its window on its near face
  const tower = solid(g);
  put(tower, prism(P, front, ...rings(64, 4, 80, 26, 4, 1.2), TOP, 34));
  const win = [P(67, 26, 15), P(77, 26, 15), P(77, 26, 29), P(67, 26, 29)];
  mk("path", { class: "nf lo", d: poly(fillet(win, [1.5, 1.5, 1.5, 1.5], 3)) }, tower.g);

  function draw(p, lift) {
    if (lift === p.last) return;
    p.last = lift;
    const z0 = TOP + lift, z1 = z0 + p.h;
    put(p.s, prism(P, front, ...rings(p.x0, Y0, p.x1, Y1, 2, 0.9), z0, z1));
    // the barcode on the near (+y) face
    const w = p.x1 - p.x0 - 3, sc = w / 6.6;
    let d = "";
    BAR.forEach((b) => { const x = p.x0 + 1.5 + b * sc; d += seg(P(x, Y1, z0 + 2), P(x, Y1, z0 + 2 + Math.min(6, p.h * 0.4))); });
    p.bars.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    packs.forEach((p) => { draw(p, tval(p.z, now)); if (!tdone(p.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the pack whose rest centre is nearest the pointer along screen x, inside the counter's band
  const cx = packs.map((p) => P((p.x0 + p.x1) / 2, (Y0 + Y1) / 2, TOP + REST[p.k] + p.h / 2)[0]);
  const cy = packs.map((p) => P((p.x0 + p.x1) / 2, (Y0 + Y1) / 2, TOP + REST[p.k] + p.h / 2)[1]);
  function hit([sx, sy]) {
    let best = 0;
    cx.forEach((x, k) => { if (Math.abs(sx - x) < Math.abs(sx - cx[best])) best = k; });
    if (Math.abs(sx - cx[best]) > 30 || Math.abs(sy - cy[best]) > 50) return -1;
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    packs.forEach((p, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : Math.max(2, 10 - 4 * Math.abs(k - a));
      tset(p.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      p.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "item " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tillroll",
  means: "A checkout counter with a barcode scanner: the pack under the pointer lifts to be scanned, the others lift a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[124, 152], [157, 157], [217, 196], null],
  mount,
});
