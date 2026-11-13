/**
 * Pet bowls: a rounded mat holding three tapered bowls of different sizes,
 * food, water and treats, each with a level inside, and a scoop lying by
 * them. The pointer picks a bowl by where it stands: its level rises and it
 * lifts off the mat, and the bowls beside it lift a little, staggered from
 * it. At rest the water bowl is bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, facing, fit, hull, lerp, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = [24, 68, 110], BY = [26, 30, 25], RT = [16, 18, 12], RF = [11, 13, 8], BH = [10, 12, 8];
const LV = [0.35, 0.6, 0.2], LIFT = 8, FAV = 1, MZ = 1.6, MX = 136, MY = 56;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [MX, MY, 0], [MX, 0, 0], [0, MY, 0], [BX[1], BY[1], MZ + BH[1] + LIFT + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(0, 0, MX, MY, 9, 2.2);
  put(solid(g), prism(P, front, mr, mi, 0, MZ));

  const bowls = BX.map((x, k) => {
    const el = solid(g), level = mk("path", { class: "nf lo" }, el.g);
    return { k, x, y: BY[k], el, level, z: tween(k === FAV ? 4 : 0), l: tween(LV[k]), last: "", mid: P(x, BY[k], MZ + BH[k] / 2) };
  });
  // the scoop: a small cup lying near the front corner, its handle running off to the right
  {
    const sx = 108, sy = 47;
    const [hr, hi] = rings(sx + 3, sy - 1.6, sx + 22, sy + 1.6, 1.6, 0.6);
    put(solid(g), prism(P, front, hr, hi, MZ, MZ + 1.6));
    put(solid(g), { sil: poly(hull(ringAt(P, disc(sx, sy, 3.5, 20), MZ).concat(ringAt(P, disc(sx, sy, 5.5, 20), MZ + 5)))), crease: poly(ringAt(P, disc(sx, sy, 4.4, 20), MZ + 5)) });
  }

  function draw(b, z, l) {
    const key = z.toFixed(2) + "," + l.toFixed(3);
    if (key === b.last) return;
    b.last = key;
    const k = b.k, z0 = MZ + z, z1 = z0 + BH[k];
    const foot = disc(b.x, b.y, RF[k]), top = disc(b.x, b.y, RT[k]);
    b.el.sil.setAttribute("d", poly(hull(ringAt(P, foot, z0).concat(ringAt(P, top, z1)))));
    b.el.cr.setAttribute("d", poly(ringAt(P, disc(b.x, b.y, RT[k] - 1.6), z1)));
    const lz = z0 + 1.5 + l * (BH[k] - 3), lr = lerp(RF[k] - 2, RT[k] - 2.2, (lz - z0) / BH[k]);
    b.level.setAttribute("d", open(ringAt(P, run(disc(b.x, b.y, lr), (s) => !front(s)), lz)));
  }

  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const b of bowls) { draw(b, tval(b.z, now), tval(b.l, now)); if (!tdone(b.z, now) || !tdone(b.l, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    bowls.forEach((b, k) => { const d = Math.abs(b.mid[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 28 && Math.abs(bowls[best].mid[1] - sy) < 45 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    bowls.forEach((b, k) => {
      const d = Math.abs(k - a), delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(b.z, a < 0 ? (k === FAV ? 4 : 0) : d === 0 ? LIFT : d === 1 ? 2.5 : 0, now, delay);
      tset(b.l, a < 0 ? LV[k] : d === 0 ? 0.92 : Math.min(0.92, LV[k] + 0.12), now, delay);
      b.el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bowl " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "petbowls",
  means: "Three pet bowls and a scoop on a mat: the bowl under the pointer fills and lifts, its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[139, 114], [197, 145], [265, 179], null],
  mount,
});
