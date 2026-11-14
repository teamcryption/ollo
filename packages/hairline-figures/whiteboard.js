/**
 * Whiteboard: a board on two legs with a marker tray under it, four markers
 * lying in the tray. The pointer picks a marker by where it stands: it lifts
 * out of the tray, and the markers beside it rise a little, staggered from
 * it. At rest one marker is raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rings, rrect, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, ML = 18, MW = 4.2, MX0 = 26, MSTEP = 21, TZ = 42, LIFT = 22, FAV = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -16, 0], [134, 20, 0], [134, -16, 0], [-4, 20, 0], [0, 0, 112], [130, 3, 112], [MX0, 8, TZ + LIFT + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1, parent = g) => { const [o, i] = rings(x0, y0, x1, y1, r, b); return put(solid(parent), prism(P, front, o, i, z0, z1)); };

  // legs and feet, then the board, then the tray in front of it
  for (const lx of [10, 120]) { box(lx - 4, -16, lx + 4, 20, 2, 0.8, 0, 3); box(lx - 2, -0.5, lx + 2, 3.5, 1, 0.6, 3, 44); }
  box(0, 0, 130, 3, 1.4, 0.7, 40, 110);
  // what is drawn on the board: two notes and a bar sketch, dim
  const face = (x0, z0, x1, z1) => poly([P(x0, 3.05, z0), P(x1, 3.05, z0), P(x1, 3.05, z1), P(x0, 3.05, z1)]);
  mk("path", { d: face(14, 82, 30, 98), class: "nf lo" }, g);
  mk("path", { d: face(34, 86, 48, 100), class: "nf lo" }, g);
  for (const [x, h] of [[70, 12], [82, 22], [94, 16], [106, 30]]) mk("path", { d: face(x, 54, x + 7, 54 + h), class: "nf lo" }, g);
  box(20, 3, 110, 12, 1.6, 0.8, TZ - 4, TZ);
  mk("path", { d: poly(ringAt(P, rrect(21.5, 4.5, 108.5, 10.5, 1.2, 3), TZ)), class: "nf lo" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = MX0 + k * MSTEP, grp = mk("g", {}, g);
    const body = solid(grp), cap = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, body, cap, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }
  const [mo, mi] = rings(0, 0, ML, MW, 1.8, 0.6);
  const sh = (ring, dx) => ring.map((q) => ({ ...q, u: q.u + dx, v: q.v + 5.7 }));

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = TZ + lift;
    put(it.body, prism(P, front, sh(mo, it.x), sh(mi, it.x), z0, z0 + MW));
    // the cap: a seam two thirds of the way along
    const c0 = it.x + ML * 0.68;
    it.cap.setAttribute("d", open([P(c0, 5.7 + MW, z0), P(c0, 5.7 + MW, z0 + MW), P(c0, 5.7, z0 + MW)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + ML / 2, 7.5, TZ + 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 40 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pen " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "whiteboard",
  means: "A whiteboard with a marker tray: the marker under the pointer lifts out of the tray, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[149, 162], [209, 192], [240, 207], null],
  mount,
});
