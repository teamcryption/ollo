/**
 * Dog bowls: a raised wooden stand on four legs holding three steel bowls in
 * round cut-outs. The pointer picks a bowl by where it stands: that bowl
 * lifts out of its ring, and the bowls beside it rise a little, staggered
 * from it. At rest the middle bowl sits half out, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 44, BR = 17, BF = 11, BH = 9, LIFT = 16, FAV = 1, LZ = 16, TZ = 21;
const X1 = (N - 1) * STEP + 2 * BR + 12;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  let stag = value;
  const bag = disposer();
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, 0, 0], [X1, 2 * BR + 12, 0], [X1, 0, 0], [0, 2 * BR + 12, 0], [BR + 6, BR + 6, TZ + LIFT + BH], [X1 - BR - 6, BR + 6, TZ + LIFT + BH]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const W = 2 * BR + 12;
  // legs, far to near
  for (const [x, y] of [[4, 4], [X1 - 8, 4], [4, W - 8], [X1 - 8, W - 8]]) {
    const [r, i] = rings(x, y, x + 4, y + 4, 1.6, 0.8);
    put(solid(g), prism(P, front, r, i, 0, LZ));
  }
  const [tr, ti] = rings(0, 0, X1, W, 6, 2);
  put(solid(g), prism(P, front, tr, ti, LZ, TZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = BR + 6 + k * STEP, y = BR + 6, grp = mk("g", {}, g);
    mk("path", { d: poly(ringAt(P, disc(x, y, BR - 2, 40), TZ)), class: "lo" }, grp);
    const body = mk("path", { class: "sil" }, grp), lip = mk("path", { class: "nf lo" }, grp), well = mk("path", { class: "nf lo" }, grp);
    items.push({ x, y, body, lip, well, z: tween(k === FAV ? LIFT * 0.55 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const base = TZ - BH * 0.6 + lift, top = base + BH;
    const foot = ringAt(P, disc(it.x, it.y, BF, 28), Math.max(base, TZ - 0.01)), rim = ringAt(P, disc(it.x, it.y, BR - 0.5, 40), top);
    it.body.setAttribute("d", poly(hull(foot.concat(rim))));
    it.lip.setAttribute("d", poly(ringAt(P, disc(it.x, it.y, BR - 2.5, 40), top)));
    it.well.setAttribute("d", poly(ringAt(P, disc(it.x, it.y, BF - 2, 28), top - BH * 0.7)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, TZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.55 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
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
  name: "dogbowl",
  means: "Three steel bowls in a raised stand: the bowl under the pointer lifts out of its ring, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[141, 120], [200, 149], [259, 179], null],
  mount,
});
