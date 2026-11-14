/**
 * Kettles: three kettles on a stove top, each a tapered body with a spout and
 * a bail handle. The pointer picks a kettle by where it stands: it tips
 * forward on its spout-side foot as if to pour, and the kettles beside it
 * rock a little, staggered from it. At rest the middle kettle leans, bright.
 *
 * The pattern: one of many in a single row (riffle), tilting about an edge.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SZ = 6, Y = 22, KS = [[24, 14], [72, 17], [120, 13]], FAV = 1, TIP = 34;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, -4, 0], [144, 48, 0], [144, -4, 0], [0, 48, 0], [72, Y, SZ + 46], [24, Y, SZ + 40]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(0, -4, 144, 48, 8, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));
  for (const [x, r] of KS) mk("path", { d: poly(disc(x, Y, r + 3, 40).map((q) => P(q.u, q.v, SZ))), class: "nf lo" }, g);

  const items = KS.map(([x, r], k) => {
    const grp = mk("g", {}, g);
    const handle = mk("path", { class: "nf" }, grp), body = mk("path", { class: "sil" }, grp), crease = mk("path", { class: "nf lo" }, grp);
    const spout = mk("path", {}, grp), knob = mk("path", {}, grp);
    return { k, x, r, h: r * 1.3, handle, body, crease, spout, knob, a: tween(k === FAV ? 12 : 0), last: NaN };
  });

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const c = Math.cos(deg * Math.PI / 180), s = Math.sin(deg * Math.PI / 180), hx = it.x + it.r;
    const T = (x, y, z) => { const dx = x - hx, dz = z - SZ; return P(hx + dx * c + dz * s, y, SZ - dx * s + dz * c); };
    const ring = (rr, z, n) => disc(it.x, Y, rr, n).map((q) => T(q.u, q.v, z));
    const top = SZ + it.h, tr = it.r * 0.62;
    it.body.setAttribute("d", poly(hull(ring(it.r, SZ, 40).concat(ring(it.r, SZ + 2, 40), ring(tr, top, 32), ring(tr * 0.7, top + 3, 24)))));
    const cr = disc(it.x, Y, tr - 1, 32);
    it.crease.setAttribute("d", open(run(cr, front).map((q) => T(q.u, q.v, top))));
    const kb = (z) => disc(it.x, Y, 2, 12).map((q) => T(q.u, q.v, z));
    it.knob.setAttribute("d", poly(hull(kb(top + 3).concat(kb(top + 5.5)))));
    const sp = (x, z, rr) => disc(x, Y, rr, 12).map((q) => T(q.u, q.v + 0, z));
    it.spout.setAttribute("d", poly(hull(sp(it.x + it.r * 0.8, SZ + it.h * 0.35, 3).concat(sp(it.x + it.r + 9, SZ + it.h * 0.8, 1.8)))));
    const arc = [];
    for (let i = 0; i <= 12; i++) { const t = Math.PI * i / 12; arc.push(T(it.x, Y - tr * 0.95 * Math.cos(t), top + 2 + 11 * Math.sin(t))); }
    it.handle.setAttribute("d", open(arc));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y, SZ + it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 50 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), deg = a < 0 ? (k === FAV ? 12 : 0) : dd === 0 ? TIP : dd === 1 ? 6 : 0;
      tset(it.a, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "kettle " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "kettles",
  means: "Three kettles on a stove: the one under the pointer tips forward on its spout side to pour, and the ones beside it rock a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[130, 131], [200, 162], [270, 201], null],
  mount,
});
