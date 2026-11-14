/**
 * Sharpeners: four desk sharpeners on a tray, a pencil standing in each top
 * hole. The pointer picks a sharpener by where it stands: its pencil draws up
 * out of the hole, and the pencils beside it rise a little, staggered from it.
 * At rest one pencil stands drawn, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 38, BW = 13, BH = 22, PL = 40, LIFT = 36, FAV = 1, TZ = 4;
const X1 = (N - 1) * STEP + 2 * BW + 8;
const disc = (x, y, r, n = 6) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-6, -6, 0], [X1 + 6, 2 * BW + 14, 0], [X1 + 6, -6, 0], [-6, 2 * BW + 14, 0], [BW + 4, BW + 4, TZ + BH + 22 + LIFT], [X1 - BW, BW + 4, TZ + BH + 22 + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [t0, t1] = rings(-6, -6, X1 + 6, 2 * BW + 14, 5, 2);
  put(solid(g), prism(P, front, t0, t1, 0, TZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = BW + 4 + k * STEP, y = BW + 4, grp = mk("g", {}, g);
    const [b0, b1] = rings(x - BW, y - BW, x + BW, y + BW, 4, 1.6);
    put(solid(grp), prism(P, front, b0, b1, TZ, TZ + BH));
    mk("path", { d: poly(ringAt(P, circ(4, 20).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), TZ + BH)), class: "nf lo" }, grp);
    // the crank: a hub on the near face and a short arm
    const hub = P(x + BW + 0.2, y, TZ + BH * 0.55), arm = P(x + BW + 0.2, y + 6, TZ + BH * 0.2);
    mk("path", { d: `M${hub[0]},${hub[1]}L${arm[0]},${arm[1]}`, class: "nf" }, grp);
    mk("ellipse", { cx: arm[0], cy: arm[1], rx: 2.2, ry: 2.2, class: "dot m" }, grp);
    const pencil = solid(grp), tip = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, pencil, tip, z: tween(k === FAV ? LIFT * 0.45 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = TZ + BH, z1 = z0 + 18 + lift, { x, y } = it;
    put(it.pencil, prism(P, front, disc(x, y, 3.6), disc(x, y, 2.6), z0, z1));
    it.tip.setAttribute("d", poly(hull(ringAt(P, disc(x, y, 2.6), z1).concat([P(x, y, z1 + 4)]))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, TZ + BH));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.45 : 0) : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.pencil.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "no. " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "sharpeners",
  means: "Four crank sharpeners on a tray: the pencil in the one under the pointer draws up out of its hole, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[175, 190], [271, 238], [127, 166], null],
  mount,
});
