/**
 * Shoe shine: a shine box with its footrest on top, and in front of it two
 * polish tins and a brush. The pointer picks a piece by where it stands: a
 * tin's lid lifts off, the brush rises from the floor, and the piece beside
 * it stirs, staggered. At rest the second tin stands open, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const XS = [16, 48, 86], YF = 62, LIFT = 28, FAV = 1;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-4, -4, 0], [104, YF + 12, 0], [104, -4, 0], [-4, YF + 12, 0], [40, 18, 44], [XS[0], YF, 10 + LIFT]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, 100, 40, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, 30));
  // the footrest: a sole-shaped block on the lid
  const [fr, fi] = rings(18, 10, 82, 30, 9, 1.6);
  put(solid(g), prism(P, front, fr, fi, 30, 34));
  const [hr, hi] = rings(26, 13, 74, 27, 6, 1.4);
  put(solid(g), prism(P, front, hr, hi, 34, 40));

  const items = XS.map((x, k) => {
    const grp = mk("g", {}, g), brush = k === 2;
    const body = solid(grp), top = solid(grp);
    return { k, x, brush, body, top, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN };
  });

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const x = it.x;
    if (it.brush) {
      // bristles below, a rounded back above: the whole brush rises
      put(it.body, prism(P, front, rrect(x - 13, YF - 7, x + 13, YF + 7, 4, 4), rrect(x - 11.6, YF - 5.6, x + 11.6, YF + 5.6, 2.6, 4), lift, lift + 4));
      put(it.top, prism(P, front, rrect(x - 15, YF - 8, x + 15, YF + 8, 7, 4), rrect(x - 13.4, YF - 6.4, x + 13.4, YF + 6.4, 5.4, 4), lift + 4, lift + 9));
    } else {
      put(it.body, prism(P, front, disc(x, YF, 11), disc(x, YF, 9.4), 0, 5));
      put(it.top, prism(P, front, disc(x, YF, 11.6), disc(x, YF, 9.6), 5 + lift, 8.5 + lift));
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, YF, 5));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && sy > mids[best][1] - 50 && sy < mids[best][1] + 30 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.top.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : ["tin 1", "tin 2", "brush"][a];
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "shoeshine",
  means: "A shine box with polish tins and a brush: the tin under the pointer opens its lid, the brush rises, neighbours stir.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[101, 167], [153, 193], [215, 224], null],
  mount,
});
