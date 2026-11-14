/**
 * Beer taps: four handles on a bar tower over a drip tray. The pointer picks
 * a tap by where it stands: its handle is pulled forward to pour, and the
 * handles beside it give a little, staggered from it. At rest one tap is
 * half pulled, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, rrect, run, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 24, X0 = 12, X1 = X0 * 2 + (N - 1) * STEP, ZB = 40, ZT = 66, FAV = 2;
const REST = [-5, 3, 20, -2];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-8, -12, 0], [X1 + 8, 28, 0], [X1 + 8, -12, 0], [-8, 28, 0], [X0, 0, ZT + 2], [X1 - X0, 0, ZT + 2], [X0, 22, ZT - 6]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1, parent = g) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(parent); put(s, prism(P, front, o, i, z0, z1)); return s; };

  box(-8, -12, X1 + 8, 28, 5, 2, 0, 4);
  box(5, -4, 13, 4, 3, 1.2, 4, ZB - 6);
  box(X1 - 13, -4, X1 - 5, 4, 3, 1.2, 4, ZB - 6);
  const tray = box(2, 8, X1 - 2, 22, 3, 1.6, 4, 6.5);
  // the tray's grate: a few slats inside its rim
  for (let k = 1; k < 8; k++) { const x = 2 + k * (X1 - 4) / 8; mk("path", { d: open([P(x, 10, 6.5), P(x, 20, 6.5)]), class: "nf lo" }, tray.g); }
  box(0, -5, X1, 5, 4, 1.6, ZB - 6, ZB);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g);
    box(x - 2, 3, x + 2, 9, 1.5, 0.6, ZB - 12, ZB - 4, grp);
    const sil = mk("path", { class: "sil" }, grp), cr = mk("path", { class: "nf lo" }, grp);
    const foot = rrect(x - 2.2, -2.2, x + 2.2, 2.2, 2.2, 6), top = rrect(x - 4, -3, x + 4, 3, 2.5, 6), inner = rrect(x - 3, -2, x + 3, 2, 1.6, 6);
    items.push({ k, x, grp, sil, cr, foot, top, inner, a: tween(REST[k]), last: NaN });
  }

  // a ring tilted about the tower's top edge: the handle swings toward the viewer
  function tilted(ring, z, th) {
    const c = Math.cos(rad(th)), s = Math.sin(rad(th)), dz = z - ZB;
    return ring.map((q) => P(q.u, q.v * c + dz * s, ZB - q.v * s + dz * c));
  }
  function draw(it, th) {
    if (th === it.last) return;
    it.last = th;
    it.sil.setAttribute("d", poly(hull(tilted(it.foot, ZB, th).concat(tilted(it.top, ZT, th)))));
    it.cr.setAttribute("d", open(tilted(run(it.inner, front), ZT, th)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, (ZB + ZT) / 2));
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
      const dd = Math.abs(k - a), th = a < 0 ? REST[k] : dd === 0 ? 50 : dd === 1 ? 10 : -4;
      tset(it.a, th, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tap " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "beertaps",
  means: "Four beer taps on a bar tower: the handle under the pointer is pulled forward to pour, and its neighbours give a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[154, 67], [233, 106], [272, 126], null],
  mount,
});
