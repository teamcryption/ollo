/**
 * Motion sensors: four sensor heads on stalks along a rail, each a rounded
 * box with a lens on its face. The pointer picks a sensor by where it stands:
 * its head swings round to look out at the reader, and its neighbours turn a
 * little, staggered from it. At rest one head is turned, bright.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 40, CZ = 4, Z0 = 20, Z1 = 34, FAV = 1, TURN = -85;
const REST = [12, -38, 4, -14];
const X1 = (N - 1) * STEP + 24;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const rot = (ring, x, y, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: x + q.u * c - q.v * s, v: y + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-6, -6, 0], [X1 + 6, 30, 0], [X1 + 6, -6, 0], [-6, 30, 0], [12, 12, Z1 + 2], [X1 - 12, 12, Z1 + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-6, 0, X1 + 6, 24, 5, 2);
  put(solid(g), prism(P, front, cr, ci, 0, CZ));
  const headR = rrect(-10, -8, 10, 8, 3.5, 4), headI = rrect(-8.4, -6.4, 8.4, 6.4, 2.2, 4);
  const lensR = rrect(-6, 7, 6, 13, 2.6, 4), lensI = rrect(-5, 7, 5, 12, 1.8, 4);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 12 + k * STEP, y = 12, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, 6), disc(x, y, 4.5), CZ, CZ + 1.5));
    put(solid(grp), prism(P, front, disc(x, y, 2.4, 12), disc(x, y, 1.6, 12), CZ + 1.5, Z0));
    const head = solid(grp), lens = solid(grp);
    items.push({ k, x, y, head, lens, a: tween(REST[k]), last: NaN });
  }

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const a = (deg * Math.PI) / 180;
    put(it.head, prism(P, front, rot(headR, it.x, it.y, a), rot(headI, it.x, it.y, a), Z0, Z1));
    put(it.lens, prism(P, front, rot(lensR, it.x, it.y, a), rot(lensI, it.x, it.y, a), Z0 + 3, Z1 - 3));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, (Z0 + Z1) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), to = a < 0 ? REST[k] : dd === 0 ? TURN : dd === 1 ? REST[k] - 34 : REST[k];
      tset(it.a, to, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.head.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pir " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "motionsensor",
  means: "Four motion sensors on a rail: the head under the pointer swings round to look at you, and its neighbours turn a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[115, 99], [172, 128], [285, 184], null],
  mount,
});
