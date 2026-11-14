/**
 * Game controllers: three gamepads lying on a low table, each a rounded body
 * with two grips, a cross pad, two sticks and four face buttons. The pointer
 * picks a pad by its resting middle on screen: it lifts and tilts its face
 * toward the reader, and the pads beside it stir a little, staggered from
 * it. At rest the middle pad is half raised, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle), parts turned (chairs).
 */
const {
  Cam, circ, facing, fit, hull, open, poly, proj, rings, run, seg, tdone, tset, tval, tween,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const XS = [22, 64, 106], YC = 18, TW = 128, TD = 36, TZ = 14, LIFT = 16, TILT = 32, FAV = 1;
const YAW = [-12, 4, 14];
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-2, -4, 0], [TW + 2, TD + 4, 0], [TW + 2, -4, 0], [-2, TD + 4, 0], [XS[0], YC, TZ + LIFT + 14], [XS[2], YC, TZ + LIFT + 14]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const [x, y] of [[4, 4], [TW - 4, 4], [4, TD - 4], [TW - 4, TD - 4]]) {
    const [r, i] = rings(x - 3, y - 3, x + 3, y + 3, 1.5, 0.8);
    put(solid(g), { sil: poly(hull(r.map((q) => P(q.u, q.v, 0)).concat(r.map((q) => P(q.u, q.v, TZ - 4))))), crease: "" });
  }
  const [tr, ti] = rings(-2, -4, TW + 2, TD + 4, 4, 1.4);
  put(solid(g), { sil: poly(hull(tr.map((q) => P(q.u, q.v, TZ - 4)).concat(tr.map((q) => P(q.u, q.v, TZ))))), crease: open(run(ti, front).map((q) => P(q.u, q.v, TZ))) });

  const pads = XS.map((xc, k) => {
    const grp = mk("g", {}, g);
    const parts = [solid(grp), solid(grp), solid(grp)];
    const marks = mk("path", { class: "nf lo" }, grp);
    const btn = [0, 1, 2, 3].map(() => flatDot(grp, C, 1.1, "dot off"));
    return { k, xc, parts, marks, btn, t: tween(k === FAV ? 0.5 : 0), last: NaN };
  });

  // local (u, v, z) on the pad -> world: tilt about the pad's long axis, then yaw, then lift
  function xf(pd, t) {
    const a = (TILT * t * Math.PI) / 180, w = (YAW[pd.k] * Math.PI) / 180, lift = LIFT * t;
    const ca = Math.cos(a), sa = Math.sin(a), cw = Math.cos(w), sw = Math.sin(w);
    return (u, v, z) => {
      const v1 = v * ca + (z - 3) * sa, z1 = -v * sa + (z - 3) * ca + 3;
      return P(pd.xc + u * cw - v1 * sw, YC + u * sw + v1 * cw, TZ + lift + z1);
    };
  }
  function shell(f, ring, inner, z0, z1) {
    return { sil: poly(hull(ring.map((q) => f(q.u, q.v, z0)).concat(ring.map((q) => f(q.u, q.v, z1))))), crease: open(run(inner, front).map((q) => f(q.u, q.v, z1))) };
  }
  const BODY = rings(-14, -8, 14, 4, 5, 1.2);
  function draw(pd, t) {
    if (t === pd.last) return;
    pd.last = t;
    const f = xf(pd, t);
    put(pd.parts[0], shell(f, disc(-9.5, 4, 6.2), disc(-9.5, 4, 5), 0, 4.6));
    put(pd.parts[1], shell(f, disc(9.5, 4, 6.2), disc(9.5, 4, 5), 0, 4.6));
    put(pd.parts[2], shell(f, BODY[0], BODY[1], 0.6, 6));
    const z = 6;
    let d = seg(f(-10.5, -2, z), f(-5.5, -2, z)) + seg(f(-8, -4.5, z), f(-8, 0.5, z));
    for (const u of [-4, 4]) d += poly(disc(u, 2, 1.9, 14).map((q) => f(q.u, q.v, z)));
    pd.marks.setAttribute("d", d);
    [[8, -4.3], [10.3, -2], [8, 0.3], [5.7, -2]].forEach(([u, v], i) => place(pd.btn[i], f(u, v, z)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const pd of pads) { draw(pd, tval(pd.t, now)); if (!tdone(pd.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = pads.map((pd) => P(pd.xc, YC, TZ + 3));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.hypot(m[0] - sx, m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 44 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    pads.forEach((pd, k) => {
      const d = Math.abs(k - a), t = a < 0 ? (k === FAV ? 0.5 : 0) : d === 0 ? 1 : d === 1 ? 0.2 : 0;
      tset(pd.t, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      pd.parts.forEach((p) => p.sil.classList.toggle("hi", on));
      pd.btn.forEach((b) => b.setAttribute("class", on ? "dot" : "dot off"));
    });
    read.textContent = a < 0 ? "rest" : "pad " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "gamecontrollers",
  means: "Three gamepads on a low table: the pad under the pointer lifts and tilts its face toward you, and its neighbours stir.",
  rules: [1, 2, 5, 8],
  range: [0, 50, 100],
  tour: [[142, 126], [200, 155], [258, 184], null],
  mount,
});
