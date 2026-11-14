/**
 * Cable organiser: a weighted block on the desk with five slots, a charging
 * plug standing in each, its cable trailing off the back across the desk.
 * The pointer picks a plug by where it stands: that plug lifts out of its
 * clip, bright, and its neighbours rise a little, staggered from it. At rest
 * one plug is half out. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, open, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 24, BZ = 12, BD = 22, LIFT = 20, FAV = 2;
const X1 = (N - 1) * STEP + 24;
const PLUGS = [[10, 7, 16], [8, 6, 13], [12, 8, 18], [9, 6, 14], [11, 7, 15]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, -46, 0], [X1, BD, 0], [X1, -46, 0], [0, BD, 0], [12, BD / 2, BZ + LIFT + 26], [X1 - 12, BD / 2, BZ + LIFT + 26]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // cables first: they run off the back of the block and lie on the desk behind it
  PLUGS.forEach((_, k) => {
    const x = 12 + k * STEP, pts = [];
    for (let i = 0; i <= 14; i++) {
      const t = i / 14, y = BD / 2 - t * (BD / 2 + 40), z = Math.max(0, (BZ - 2) * (1 - t * 1.6));
      pts.push(P(x + Math.sin(t * 3 + k) * 6 * t, y, z));
    }
    mk("path", { d: open(pts), class: "nf lo" }, g);
  });

  const [br, bi] = rings(0, 0, X1, BD, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));

  const items = PLUGS.map(([w, d, h], k) => {
    const x = 12 + k * STEP, y = BD / 2, grp = mk("g", {}, g);
    const slot = rings(x - w / 2 - 1.5, y - d / 2 - 1.5, x + w / 2 + 1.5, y + d / 2 + 1.5, 1.5, 0.6)[0];
    mk("path", { d: open(slot.map((q) => P(q.u, q.v, BZ)).concat([P(slot[0].u, slot[0].v, BZ)])), class: "nf lo" }, grp);
    const wire = mk("path", { class: "nf" }, grp);
    const head = solid(grp), tip = solid(grp);
    const rest = k === FAV ? LIFT * 0.6 : [2, 0, 0, 3, 1][k];
    return { k, x, y, w, d, h, wire, head, tip, rest, z: tween(rest), last: NaN };
  });

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = BZ - 3 + lift, z1 = z0 + it.h, { x, y, w, d } = it;
    it.wire.setAttribute("d", seg(P(x, y, BZ - 1), P(x, y, z0)));
    const [hr, hi] = rings(x - w / 2, y - d / 2, x + w / 2, y + d / 2, 2.5, 1);
    put(it.head, prism(P, front, hr, hi, z0, z1));
    const tw = Math.min(w - 4, 6), [tr, ti] = rings(x - tw / 2, y - 1.4, x + tw / 2, y + 1.4, 0.8, 0.5);
    put(it.tip, prism(P, front, tr, ti, z1, z1 + 5));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, BZ + 6));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? it.rest : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.head.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
      it.tip.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "clip " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "chargecable",
  means: "A cable organiser on a desk: the plug under the pointer lifts out of its clip, and the plugs beside it rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[200, 160], [150, 135], [250, 190], null],
  mount,
});
