/**
 * Beer tap: three tall handles on a bar-top tower over a drip tray. The
 * pointer picks a handle by where it stands: it swings forward to pour, and
 * the handles beside it give a little, staggered. At rest the middle tap is
 * half pulled, bright. The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 38, BZ = 46, H = 50, A = 0.75, FAV = 1;
const X1 = (N - 1) * STEP;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-14, -16, 0], [X1 + 14, 16, 0], [-6, 0, BZ + 14 + H], [X1 + 6, H * Math.sin(A) + 6, BZ + 14 + H * Math.cos(A)]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-14, -16, X1 + 14, 16, 6, 2);
  put(solid(g), prism(P, front, tr, ti, 0, 5));
  const cx = X1 / 2;
  put(solid(g), prism(P, front, disc(cx, -4, 7), disc(cx, -4, 5.5), 5, BZ));
  for (let k = 0; k < N; k++) put(solid(g), prism(P, front, disc(k * STEP, 4, 2.6, 16), disc(k * STEP, 4, 1.6, 16), BZ - 9, BZ));
  const [br, bi] = rings(-10, -8, X1 + 10, 8, 7, 2);
  put(solid(g), prism(P, front, br, bi, BZ, BZ + 12));

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, grp), cr = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x: k * STEP, sil, cr, t: tween(k === FAV ? 0.55 : 0), last: NaN });
  }
  const z0 = BZ + 12;
  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const a = t * A, s = Math.sin(a), c = Math.cos(a), pts = [];
    for (const [f, r] of [[0, 3.2], [0.12, 3.2], [0.2, 4.4], [0.85, 6.4], [1, 6.4]]) pts.push(...ringAt(P, disc(it.x, f * H * s, r), z0 + f * H * c));
    it.sil.setAttribute("d", poly(hull(pts)));
    it.cr.setAttribute("d", poly(ringAt(P, disc(it.x, H * s, 5), z0 + H * c)));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, z0 + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), v = a < 0 ? (k === FAV ? 0.55 : 0) : dd === 0 ? 1 : dd === 1 ? 0.18 : 0;
      tset(it.t, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
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
  name: "beertap",
  means: "Three beer tap handles on a tower: the handle under the pointer swings forward to pour, its neighbours give a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[152, 79], [205, 106], [259, 133], null],
  mount,
});
