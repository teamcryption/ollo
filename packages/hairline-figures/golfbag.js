/**
 * Golf bag: a round bag on its foot with a pocket on the near side and four
 * clubs standing in its mouth. The pointer picks a club by where it stands:
 * that club draws up out of the bag, its neighbours rise a little, staggered.
 * At rest one club is pulled half out, bright. The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, ringAt, poly, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BR = 25, BH = 60, CL = 20, LIFT = 28, FAV = 2;
const XS = [-13, -4.5, 4.5, 13], YS = [2, -2, 2, -2];
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-BR - 4, -BR - 4, 0], [BR + 4, BR + 4, 0], [-14, 0, BH + CL + LIFT + 8], [14, 0, BH + CL + LIFT + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // foot ring, body, pocket
  put(solid(g), prism(P, front, disc(0, 0, BR + 2), disc(0, 0, BR), 0, 4));
  put(solid(g), prism(P, front, disc(0, 0, BR), disc(0, 0, BR - 2), 4, BH));
  const [pr, pi] = rings(BR - 6, -8, BR + 4, 8, 4, 1.4);
  put(solid(g), prism(P, front, pr.map((q) => ({ ...q, u: q.u - 2, v: q.v + 2 })), pi.map((q) => ({ ...q, u: q.u - 2, v: q.v + 2 })), 14, 44));
  mk("path", { d: poly(ringAt(P, disc(0, 0, BR - 1.5, 40), BH)), class: "lo" }, g);

  const order = XS.map((x, k) => k).sort((a, b) => XS[a] + YS[a] - (XS[b] + YS[b]));
  const items = [];
  for (const k of order) {
    const x = XS[k], y = YS[k], grp = mk("g", {}, g);
    const shaft = mk("path", { class: "nf" }, grp), head = solid(grp);
    const [hr, hi] = rings(x - 2.5, y - 4.5, x + 2.5, y + 4.5, 2, 0.9);
    items[k] = { k, x, y, shaft, head, hr, hi, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN };
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const top = BH + CL - 6 + lift + it.k % 2 * 3;
    it.shaft.setAttribute("d", seg(P(it.x, it.y, BH - 2), P(it.x, it.y, top)));
    put(it.head, prism(P, front, it.hr, it.hi, top, top + 6));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, BH + CL));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 30 && sy > mids[best][1] - 70 && sy < mids[best][1] + 150 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : d === 0 ? LIFT : d === 1 ? 10 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.head.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "club " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "golfbag",
  means: "A round golf bag with four clubs in its mouth: the club under the pointer draws up out of the bag, its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[174, 80], [196, 84], [219, 103], null],
  mount,
});
