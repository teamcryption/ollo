/**
 * Toolbelt: a leather belt with a buckle and three pouches hung along it, a
 * hammer, a tape measure and a screwdriver standing in them. The pointer
 * picks a pouch by where it stands: its tool lifts out, and the tools beside
 * it rise a little, staggered from it. At rest the hammer sits half drawn,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const STEP = 46, X0 = 18, PY = 12, LIFT = 24, FAV = 0;
const NAMES = ["hammer", "tape", "driver"];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const shift = (ring, x, y) => ring.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  const XE = X0 + 2 * STEP + 22;
  fit(C, [[-10, -2, 0], [XE + 8, -2, 0], [XE + 8, 20, 0], [-10, 20, 0], [X0, PY, 40 + LIFT], [X0 + 2 * STEP, PY, 38 + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const box = (x0, y0, x1, y1, z0, z1, r, b) => { const [o, i] = rings(x0, y0, x1, y1, r, b); return prism(P, front, o, i, z0, z1); };
  const g = mk("g", {}, svg);

  // the belt: a standing strap, its buckle at the far end
  put(solid(g), box(-8, 0, XE, 4, 6, 17, 2, 0.8));
  put(solid(g), box(XE - 4, -1.5, XE + 8, 5.5, 3, 20, 2.5, 1.2));
  const pin = mk("path", { class: "lo nf" }, g);
  const pa = P(XE + 2, 5.5, 11.5), pb = P(XE + 8, 5.5, 11.5);
  pin.setAttribute("d", "M" + pa + "L" + pb);

  // each tool as a few rings: [outer, inner, z0, z1]
  const tools = [
    (x) => [[...rings(x - 1.4, PY - 1.4, x + 1.4, PY + 1.4, 1.4, 0.5), 6, 34], [...rings(x - 10, PY - 2.4, x + 7, PY + 2.4, 2, 0.8), 34, 40]],
    (x) => [[...rings(x - 8, PY - 5, x + 8, PY + 5, 4.5, 1.4), 8, 28], [...rings(x - 2.5, PY + 4, x + 2.5, PY + 6.5, 1, 0.5), 21, 26]],
    (x) => [[disc(x, PY, 1, 12), disc(x, PY, 0.6, 12), 6, 22], [disc(x, PY, 3.4), disc(x, PY, 2.4), 22, 37]],
  ];

  const items = [];
  for (let k = 0; k < 3; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g);
    const parts = tools[k](x).map((t) => ({ t, s: solid(grp) }));
    const pouch = solid(grp);
    put(pouch, box(x - 13, 4, x + 13, 20, 2, 23, 4, 1.6));
    const stitch = mk("path", { class: "lo nf dash" }, grp);
    const sa = P(x - 9, 20, 18), sb = P(x + 9, 20, 18);
    stitch.setAttribute("d", "M" + sa + "L" + sb);
    items.push({ k, x, parts, sil: parts.map((p) => p.s.sil), z: tween(k === FAV ? LIFT * 0.55 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    for (const p of it.parts) { const [o, i, z0, z1] = p.t; put(p.s, prism(P, front, o, i, z0 + lift, z1 + lift)); }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, PY, 22));
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
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.55 : 0) : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      for (const s of it.sil) s.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : NAMES[a];
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "toolbelt",
  means: "A tool belt with three pouches: the tool under the pointer lifts out of its pouch, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[128, 126], [194, 174], [261, 193], null],
  mount,
});
