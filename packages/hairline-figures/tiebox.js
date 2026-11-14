/**
 * Bow ties: three bow ties laid side by side in a shallow presentation box.
 * The pointer picks a tie by where it stands: it lifts out of the box and
 * its neighbours rise a little, staggered from it. At rest the middle tie
 * is raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, fillet, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, register, put, solid,
} = HL;

const N = 3, STEP = 46, BZ = 7, LIFT = 26, FAV = 1, TH = 3.5;
const X1 = N * STEP + 8, Y1 = 64, YC = Y1 / 2;
const asRing = (pts) => pts.map(([u, v]) => ({ u, v, nu: 0, nv: 0 }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [STEP, YC, BZ + LIFT + TH + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, X1, Y1, 7, 3);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const [fr] = rings(4, 4, X1 - 4, Y1 - 4, 5, 1);
  mk("path", { d: poly(ringAt(P, fr, BZ)), class: "nf lo" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 4 + STEP / 2 + k * STEP + 4, grp = mk("g", {}, g);
    const wa = mk("path", { class: "sil" }, grp), wb = mk("path", { class: "sil" }, grp), knot = mk("path", { class: "sil" }, grp);
    const lines = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, wa, wb, knot, lines, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  const wing = (x, s) => asRing(fillet([[x - 3, YC + s * 4], [x - 15, YC + s * 25], [x + 15, YC + s * 25], [x + 3, YC + s * 4]], [2, 4, 4, 2], 3));
  const slab = (ring, z) => poly(hull(ringAt(P, ring, z).concat(ringAt(P, ring, z + TH))));
  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z = BZ + 0.5 + lift, x = it.x;
    it.wa.setAttribute("d", slab(wing(x, -1), z));
    it.wb.setAttribute("d", slab(wing(x, 1), z));
    const kn = asRing(fillet([[x - 6, YC - 6], [x + 6, YC - 6], [x + 6, YC + 6], [x - 6, YC + 6]], [2, 2, 2, 2], 3));
    it.knot.setAttribute("d", slab(kn, z + 1.2));
    // the pleats: two folds on each wing
    let d = "";
    for (const s of [-1, 1]) for (const o of [-5, 5]) {
      const a = P(x + o * 0.4, YC + s * 9, z + TH), b = P(x + o * 1.6, YC + s * 22, z + TH);
      d += "M" + a[0].toFixed(2) + "," + a[1].toFixed(2) + "L" + b[0].toFixed(2) + "," + b[1].toFixed(2);
    }
    it.lines.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, YC, BZ));
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
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      for (const el of [it.wa, it.wb, it.knot]) el.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tie " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tiebox",
  means: "Three bow ties in a presentation box: the tie under the pointer lifts out, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[138, 130], [215, 169], [292, 208], null],
  mount,
});
