/**
 * Puppet theatre: a booth with a back wall, a playboard in front and two
 * curtains under a valance. Three hand puppets wait behind the playboard.
 * The pointer picks a puppet by where it stands: it rises into the opening,
 * and its neighbours bob up a little, staggered from it. At rest the middle
 * puppet is up, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 30, X0 = 20, W = 100, BOARD = 46, BASE = 22, LIFT = 32, FAV = 1;
const REST = [3, 26, 12];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, -4, 0], [W, -4, 92], [W, 24, 0], [0, 24, 92], [0, 24, 0], [W, -4, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 2, b = 1.2, parent = g) => {
    const [o, i] = rings(x0, y0, x1, y1, r, b);
    return put(solid(parent), prism(P, front, o, i, z0, z1));
  };
  box(0, -4, W, 0, 0, 92, 2, 0.8);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + 10 + k * STEP, y = 8, grp = mk("g", {}, g);
    const body = mk("path", { class: "sil" }, grp), cuff = mk("path", { class: "nf lo" }, grp), head = mk("path", { class: "sil" }, grp);
    items.push({ k, x, y, body, cuff, head, z: tween(REST[k]), last: NaN });
  }

  // the front of the booth: playboard, two curtains, a valance
  box(0, 14, W, 24, 0, BOARD, 3, 1.4);
  box(0, 14, 16, 22, BOARD, 84, 3, 1.2);
  box(W - 16, 14, W, 22, BOARD, 84, 3, 1.2);
  box(0, 13, W, 24, 82, 92, 3, 1.4);

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const zb = BASE + lift, zt = zb + 15, hc = zt + 6, sph = [];
    it.body.setAttribute("d", poly(hull(ringAt(P, disc(it.x, it.y, 7.5), zb).concat(ringAt(P, disc(it.x, it.y, 5), zt)))));
    it.cuff.setAttribute("d", poly(ringAt(P, disc(it.x, it.y, 5.6), zt - 3)));
    for (let i = -3; i <= 3; i++) { const t = (i / 3) * (Math.PI / 2); sph.push(...ringAt(P, disc(it.x, it.y, 6 * Math.cos(t)), hc + 6 * Math.sin(t))); }
    it.head.setAttribute("d", poly(hull(sph)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, BOARD));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.body.classList.toggle("hi", on);
      it.head.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "puppet " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "puppettheatre",
  means: "A puppet booth with curtains: the puppet under the pointer rises into the opening, and its neighbours bob up a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[178, 144], [215, 162], [252, 181], null],
  mount,
});
