/**
 * Wheelchairs: three wheelchairs parked in a row, each a seat, a backrest,
 * a footrest, two large wheels and two casters. The pointer picks a chair by
 * where it stands: it rolls forward out of the row, its wheels turning, and
 * the chairs beside it ease forward a little, staggered from it. At rest the
 * middle chair stands half out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 36, R = 11, ROLL = 18, FAV = 1, REST = [4, 11, 1];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.55);
  const X1 = (N - 1) * STEP;
  fit(C, [[-14, -16, 0], [X1 + 14, -16, 0], [-14, 16 + ROLL, 0], [X1 + 14, 16 + ROLL, 0], [0, -12, 30], [X1, -12, 30]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 1.5, b = 0.7) => { const [a, i] = rings(x0, y0, x1, y1, r, b); return prism(P, front, a, i, z0, z1); };

  function wheel(wx, cy, cz, rr, w) {
    const pts = [];
    for (const xx of [wx - w, wx + w]) for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2; pts.push(P(xx, cy + rr * Math.cos(t), cz + rr * Math.sin(t))); }
    return poly(hull(pts));
  }
  function ringYZ(wx, cy, cz, rr) {
    const pts = [];
    for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2; pts.push(P(wx, cy + rr * Math.cos(t), cz + rr * Math.sin(t))); }
    return poly(pts);
  }

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), x = k * STEP;
    const it = { k, x, grp, z: tween(REST[k]), last: NaN, sils: [] };
    it.farW = mk("path", { class: "sil" }, grp);
    it.farC = mk("path", { class: "sil" }, grp);
    it.back = solid(grp); it.seat = solid(grp); it.foot = solid(grp);
    it.nearC = mk("path", { class: "sil" }, grp);
    it.nearW = mk("path", { class: "sil" }, grp);
    it.tyre = mk("path", { class: "nf lo" }, grp);
    it.spoke = mk("path", { class: "lo" }, grp);
    it.sils = [it.farW, it.farC, it.back.sil, it.seat.sil, it.foot.sil, it.nearC, it.nearW];
    items.push(it);
  }

  function draw(it, d) {
    if (d === it.last) return;
    it.last = d;
    const x = it.x, y = d;
    it.farW.setAttribute("d", wheel(x - 11, y - 3, R, R, 1.1));
    it.farC.setAttribute("d", wheel(x - 7, y + 9, 2.6, 2.6, 0.8));
    put(it.back, box(x - 8, y - 11, x + 8, y - 9, 11, 28));
    put(it.seat, box(x - 8, y - 9, x + 8, y + 7, 11, 13));
    put(it.foot, box(x - 6, y + 9, x + 6, y + 13, 3, 4.5, 1, 0.5));
    it.nearC.setAttribute("d", wheel(x + 7, y + 9, 2.6, 2.6, 0.8));
    it.nearW.setAttribute("d", wheel(x + 11, y - 3, R, R, 1.1));
    it.tyre.setAttribute("d", ringYZ(x + 12.1, y - 3, R, R - 2.4));
    const a = d / R, c = Math.cos(a) * (R - 2.4), s = Math.sin(a) * (R - 2.4);
    it.spoke.setAttribute("d", seg(P(x + 12.1, y - 3 - c, R + s), P(x + 12.1, y - 3 + c, R - s)) + seg(P(x + 12.1, y - 3 + s, R + c), P(x + 12.1, y - 3 - s, R - c)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, 14));
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
      const dd = Math.abs(k - a), y = a < 0 ? REST[k] : dd === 0 ? ROLL : dd === 1 ? 5 : 0;
      tset(it.z, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      for (const s of it.sils) s.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "chair " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "wheelchairs",
  means: "Three wheelchairs in a row: the chair under the pointer rolls forward, wheels turning, and its neighbours ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[151, 122], [216, 154], [281, 186], null],
  mount,
});
