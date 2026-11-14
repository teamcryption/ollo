/**
 * Sand castles: three upturned pails on a patch of sand, each with a castle
 * moulded under it. The pointer picks a pail by where it stands: it lifts off
 * to show the castle, and the pail beside it lifts a little, staggered from
 * it. At rest one pail is half raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 46, RB = 17, RT = 11, H = 26, LIFT = 30, FAV = 1, SZ = 3;
const X1 = (N - 1) * STEP + 2 * RB;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const frustum = (P, x, y, r0, r1, z0, z1) => poly(hull(ringAt(P, disc(x, y, r0), z0).concat(ringAt(P, disc(x, y, r1), z1))));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-8, -8, 0], [X1 + 8, 2 * RB + 8, 0], [X1 + 8, -8, 0], [-8, 2 * RB + 8, 0], [RB, RB, SZ + H + LIFT + 4], [X1 - RB, RB, SZ + H + LIFT + 4]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-8, -8, X1 + 8, 2 * RB + 8, 14, 3);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = RB + k * STEP, y = RB, grp = mk("g", {}, g);
    // the castle: the pail's own shape in sand, with a ring of battlements on top
    mk("path", { d: frustum(P, x, y, RB - 1, RT - 1, SZ, SZ + H - 1), class: "nf" }, grp);
    mk("path", { d: open(run(ringAt(P, disc(x, y, RT - 3), SZ + H - 1), (p, i) => true)), class: "nf lo" }, grp);
    const pail = mk("path", { class: "sil" }, grp), rim = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, pail, rim, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = SZ + lift;
    it.pail.setAttribute("d", frustum(P, it.x, it.y, RB, RT, z0, z0 + H));
    const near = ringAt(P, disc(it.x, it.y, RB, 36), z0 + 4).filter((_, i) => { const a = (i / 36) * Math.PI * 2; return Math.cos(a) + Math.sin(a) > 0; });
    it.rim.setAttribute("d", open(near));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, SZ + H / 2));
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
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.pail.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pail " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "sandpail",
  means: "Upturned pails on sand: the pail under the pointer lifts off the castle it moulded, and the pail beside it lifts a little.",
  rules: [1, 2, 5, 6],
  range: [0, 50, 100],
  tour: [[150, 150], [200, 170], [250, 190], null],
  mount,
});
