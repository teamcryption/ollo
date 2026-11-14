/**
 * Plyo boxes: three jump boxes of rising height in a row on a gym mat, each
 * with a hand slot cut in its side. The pointer picks a box by where it
 * stands: it hops up off the mat, and the boxes beside it give a small hop,
 * staggered from it. At rest the middle box sits a little raised, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fillet, fit, facing, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HS = [20, 32, 44], W = 30, D = 34, GAP = 8, LIFT = 16, FAV = 1, MZ = 2, M = 10;
const LX = M * 2 + HS.length * W + (HS.length - 1) * GAP, LY = D + M * 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, 0, 0], [LX, LY, 0], [LX, 0, 0], [0, LY, 0], [LX - M, M, MZ + 44 + LIFT], [M, M, MZ + 20 + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(0, 0, LX, LY, 6, 2);
  put(solid(g), prism(P, front, mr, mi, 0, MZ));

  const items = HS.map((h, k) => {
    const x0 = M + k * (W + GAP), y0 = M, grp = mk("g", {}, g);
    const body = solid(grp), slot = mk("path", { class: "lo" }, grp);
    const [ring, inner] = rings(x0, y0, x0 + W, y0 + D, 4, 1.6);
    return { k, h, x0, y0, ring, inner, body, slot, z: tween(k === FAV ? 6 : 0), last: NaN };
  });

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = MZ + lift, z1 = z0 + it.h, y = it.y0 + D, sz = z0 + it.h * 0.72;
    put(it.body, prism(P, front, it.ring, it.inner, z0, z1));
    const q = [P(it.x0 + 8, y, sz + 3), P(it.x0 + W - 8, y, sz + 3), P(it.x0 + W - 8, y, sz - 3), P(it.x0 + 8, y, sz - 3)];
    it.slot.setAttribute("d", poly(fillet(q, [2.5, 2.5, 2.5, 2.5])));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + W / 2, it.y0 + D / 2, MZ + it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? 6 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : HS[a] + " in";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "boxjump",
  means: "Three plyo boxes of rising height on a gym mat: the box under the pointer hops up, and the boxes beside it give a small hop.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[149, 136], [205, 148], [256, 157], null],
  mount,
});
