/**
 * Distillation: four round-bottom flasks in cork rings along a bench tray,
 * each holding a level of liquid. The pointer picks a flask by where it
 * stands: it lifts out of its ring, and the flasks beside it rise a little,
 * staggered from it. At rest one flask is raised, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 36, BR = 13, NR = 3.2, NH = 20, LIFT = 22, FAV = 2, TZ = 4;
const X1 = (N - 1) * STEP + 2 * BR;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-6, -6, 0], [X1 + 6, 2 * BR + 6, 0], [X1 + 6, -6, 0], [-6, 2 * BR + 6, 0], [BR, BR, TZ + 2 * BR + NH + LIFT + 2], [X1 - BR, BR, TZ + 2 * BR + NH + LIFT + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-6, -6, X1 + 6, 2 * BR + 6, 6, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = BR + k * STEP, y = BR, grp = mk("g", {}, g);
    const flask = mk("path", { class: "sil" }, grp), liq = mk("path", { class: "nf lo" }, grp), neck = mk("path", { class: "sil" }, grp), lip = mk("path", { class: "nf" }, grp);
    // the cork ring the flask sits in, in front of its foot
    put(solid(grp), prism(P, front, disc(x, y, 8), disc(x, y, 6), TZ, TZ + 3));
    items.push({ k, x, y, flask, neck, liq, lip, lv: 0.35 + 0.15 * ((k * 3) % 4), z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const b = TZ + 1 + lift, cz = b + BR, pts = [];
    for (let i = -6; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(it.x, it.y, Math.max(BR * Math.cos(t), 0.5), 24), cz + BR * Math.sin(t))); }
    const top = cz + BR + NH;
    it.flask.setAttribute("d", poly(hull(pts)));
    it.neck.setAttribute("d", poly(hull(ringAt(P, disc(it.x, it.y, NR, 16), cz + BR * 0.85).concat(ringAt(P, disc(it.x, it.y, NR, 16), top)))));
    const lz = cz - BR + 2 * BR * it.lv * 0.8;
    it.liq.setAttribute("d", poly(ringAt(P, disc(it.x, it.y, Math.sqrt(BR * BR - (lz - cz) ** 2), 28), lz)));
    it.lip.setAttribute("d", poly(ringAt(P, disc(it.x, it.y, NR + 1, 16), top)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, TZ + BR + 6));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 28 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.flask.classList.toggle("hi", k === (a < 0 ? FAV : a));
      it.neck.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "flask " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "beakerset",
  means: "Four round-bottom flasks in cork rings: the flask under the pointer lifts out of its ring, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[126, 141], [175, 166], [274, 216], null],
  mount,
});
