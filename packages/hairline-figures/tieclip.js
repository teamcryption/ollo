/**
 * Cufflink box: three small velvet boxes on a dresser tray, each holding a
 * pair of cufflinks in a cushion slit. The pointer picks a box by where it
 * stands: its lid swings open on the back hinge, and the boxes beside it
 * crack their lids, staggered from it. At rest one lid stands ajar, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), swinging on a hinge.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, seg,
} = HL;

const N = 3, STEP = 54, W = 40, D = 32, H = 14, LH = 7, TZ = 4, OPEN = 1.85, FAV = 2;
const X1 = (N - 1) * STEP + W;
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-8, -8 - LH, 0], [X1 + 8, D + 8, 0], [X1 + 8, -8 - LH, 0], [-8, D + 8, 0], [0, 0, TZ + H + D + 4], [X1, 0, TZ + H + D + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-8, -8, X1 + 8, D + 8, 7, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    const [r0, r1] = rings(x, 0, x + W, D, 4, 1.4);
    put(solid(grp), prism(P, front, r0, r1, TZ, TZ + H));
    const [c0] = rings(x + 3, 3, x + W - 3, D - 3, 3, 1);
    mk("path", { d: poly(ringAt(P, c0, TZ + H)), class: "nf lo" }, grp);
    mk("path", { d: seg(P(x + 7, D / 2, TZ + H), P(x + W - 7, D / 2, TZ + H)), class: "nf lo" }, grp);
    for (const cx of [x + W * 0.33, x + W * 0.67]) {
      const s = solid(grp);
      put(s, prism(P, front, disc(cx, D / 2, 4.2), disc(cx, D / 2, 3), TZ + H, TZ + H + 2.2));
    }
    const lid = solid(grp);
    items.push({ k, x, r0, r1, lid, t: tween(k === FAV ? 0.3 : 0), last: NaN });
  }

  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const a = OPEN * t, ca = Math.cos(a), sa = Math.sin(a), hz = TZ + H;
    // hinge along x at the back top edge (y = 0, z = hz); the lid turns up and back
    const R = (q, dz) => P(q.u, -(dz) * sa + q.v * ca, hz + q.v * sa + dz * ca);
    const pts = it.r0.map((q) => R(q, 0)).concat(it.r0.map((q) => R(q, LH)));
    put(it.lid, { sil: poly(hull(pts)), crease: a < 1.1 ? poly(it.r1.map((q) => R(q, LH))) : "" });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + W / 2, D / 2, TZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 45 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? (k === FAV ? 0.3 : 0) : dd === 0 ? 1 : dd === 1 ? 0.12 : 0;
      tset(it.t, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "box " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tieclip",
  means: "Three velvet cufflink boxes on a tray: the lid under the pointer swings open on its hinge; its neighbours crack open.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[129, 141], [196, 175], [262, 208], null],
  mount,
});
