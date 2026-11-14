/**
 * Space station: a long truss with a pair of solar wings at each end and
 * four modules docked along its top, each a different height with a ring of
 * ports. The pointer picks a module by where it stands: it undocks, rising
 * off its berth along a dashed guide, and its neighbours stir a little,
 * staggered from it. At rest one module is half undocked, bright. The slider
 * is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 24, R = 8, LIFT = 24, FAV = 3, TZ = 30, HS = [22, 30, 18, 26];
const X0 = 34, XE = X0 + (N - 1) * STEP;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, -44, TZ], [140, 44, TZ], [0, 44, TZ], [140, -44, TZ], [X0 + STEP, 0, TZ + 4 + 30 + LIFT + 10], [70, 0, TZ - 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  function wing(x0, x1, y0, y1) {
    const [r, i] = rings(x0, y0, x1, y1, 2, 0.7);
    const s = solid(g);
    put(s, prism(P, front, r, i, TZ, TZ + 0.8));
    let d = "";
    for (let t = 1; t < 3; t++) { const x = x0 + ((x1 - x0) * t) / 3; d += seg(P(x, y0 + 1, TZ + 0.8), P(x, y1 - 1, TZ + 0.8)); }
    for (let t = 1; t < 4; t++) { const y = y0 + ((y1 - y0) * t) / 4; d += seg(P(x0 + 1, y, TZ + 0.8), P(x1 - 1, y, TZ + 0.8)); }
    mk("path", { d, class: "nf lo" }, g);
  }
  wing(0, 18, -44, -6); wing(122, 140, -44, -6);
  // the truss
  const [tr, ti] = rings(0, -3, 140, 3, 2, 1);
  put(solid(g), prism(P, front, tr, ti, TZ - 4, TZ + 4));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, y = 0, H = HS[k], grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, R - 3, 20), disc(x, y, R - 4, 20), TZ + 4, TZ + 6));
    const guide = mk("path", { class: "dash nf" }, grp);
    const body = mk("path", { class: "sil" }, grp), cr = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, H, guide, body, cr, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }
  wing(0, 18, 6, 44); wing(122, 140, 6, 44);

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const { x, y, H } = it, z0 = TZ + 6 + lift, z1 = z0 + H, pts = [];
    pts.push(...ringAt(P, disc(x, y, R - 3, 20), z0), ...ringAt(P, disc(x, y, R), z0 + 3));
    pts.push(...ringAt(P, disc(x, y, R), z1 - 3), ...ringAt(P, disc(x, y, R - 3, 20), z1));
    it.body.setAttribute("d", poly(hull(pts)));
    let d = open(ringAt(P, run(disc(x, y, R - 0.8), front), z0 + 3)) + open(ringAt(P, run(disc(x, y, R - 0.8), front), z1 - 3));
    d += open(ringAt(P, run(disc(x, y, R - 0.8), front), (z0 + z1) / 2));
    it.cr.setAttribute("d", d);
    it.guide.setAttribute("d", lift > 0.5 ? seg(P(x, y, TZ + 6), P(x, y, z0)) : "");
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, TZ + 6 + it.H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 50 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "mod " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "spacestation",
  means: "A truss with solar wings and four docked modules: the module under the pointer undocks and rises, and its neighbours stir.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[155, 126], [185, 126], [245, 170], null],
  mount,
});
