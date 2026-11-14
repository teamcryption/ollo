/**
 * Torches: four flashlights standing head-up in a charging dock, each a
 * slim barrel flaring into a wide head with a lens. The pointer picks a
 * torch by where it stands: it lifts out of its socket, the ones beside it
 * rise a little, staggered from it. At rest one torch is half out, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, BR = 6, HR = 11, BODY = 34, HEAD = 12, LIFT = 24, FAV = 2, DZ = 8;
const X1 = (N - 1) * STEP + 2 * HR;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-4, -4, 0], [X1 + 4, 2 * HR + 4, 0], [X1 + 4, -4, 0], [-4, 2 * HR + 4, 0], [HR, HR, BODY + HEAD + LIFT], [X1 - HR, HR, BODY + HEAD + LIFT]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-4, -4, X1 + 4, 2 * HR + 4, 7, 2);
  put(solid(g), prism(P, front, dr, di, 0, DZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = HR + k * STEP, y = HR, grp = mk("g", {}, g);
    mk("path", { d: poly(ringAt(P, disc(x, y, BR + 1.5), DZ)), class: "nf lo" }, grp);
    const sil = mk("path", { class: "sil" }, grp), cr = mk("path", { class: "nf lo" }, grp);
    const lens = mk("path", { class: "nf lo" }, grp), sw = mk("path", { class: "nf" }, grp);
    items.push({ k, x, y, grp, sil, cr, lens, sw, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = DZ - 6 + lift, zb = z0 + BODY, zt = zb + HEAD;
    const pts = ringAt(P, disc(it.x, it.y, BR), Math.max(z0, DZ)).concat(ringAt(P, disc(it.x, it.y, BR), zb), ringAt(P, disc(it.x, it.y, HR), zb + HEAD * 0.6), ringAt(P, disc(it.x, it.y, HR), zt));
    it.sil.setAttribute("d", poly(hull(pts)));
    it.cr.setAttribute("d", open(ringAt(P, run(disc(it.x, it.y, BR + 0.4), front), zb)));
    it.lens.setAttribute("d", poly(ringAt(P, disc(it.x, it.y, HR - 2.4), zt)));
    const sx = it.x + BR * 0.72, sy = it.y + BR * 0.72;
    it.sw.setAttribute("d", poly(hull(ringAt(P, disc(sx, sy, 1.6, 12), zb - 12).concat(ringAt(P, disc(sx, sy, 1.6, 12), zb - 6)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, DZ + BODY / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "torch " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "flashlight",
  means: "Four torches standing in a charging dock: the one under the pointer lifts out of its socket, its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[132, 132], [177, 155], [268, 200], null],
  mount,
});
