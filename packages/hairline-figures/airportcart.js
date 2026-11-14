/**
 * Baggage cart: a flat airport cart on four wheels with a tow bar, four bags
 * of different sizes standing on its deck. The pointer picks a bag by where it
 * stands: that bag lifts off the deck, and the bags beside it rise a little,
 * staggered from it. At rest one bag is raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const DZ = 14, LIFT = 18, FAV = 2, L = 150, D = 44;
const BAGS = [[6, 30, 26, 34], [42, 26, 30, 24], [74, 34, 24, 38], [114, 28, 28, 22]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-4, -2, 0], [L + 28, D + 4, 0], [L + 28, -2, 0], [-4, D + 4, 0], [0, 0, DZ + 40 + LIFT], [L, D, DZ + 40 + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (xc, y) => {
    const pts = [];
    for (const yy of [y - 3, y + 3]) for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(xc + 6.5 * Math.cos(t), yy, 6.5 + 6.5 * Math.sin(t))); }
    const w = solid(g);
    w.sil.setAttribute("d", poly(hull(pts)));
    const hub = [];
    for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; hub.push(P(xc + 2.2 * Math.cos(t), y + 3, 6.5 + 2.2 * Math.sin(t))); }
    w.cr.setAttribute("d", poly(hub));
  };
  wheel(18, 4); wheel(L - 18, 4);
  // the far end frame
  const [fr, fi] = rings(-3, 2, 2, D - 2, 1.5, 0.8);
  put(solid(g), prism(P, front, fr, fi, DZ, DZ + 30));
  const [dr, di] = rings(-4, -2, L + 4, D + 4, 4, 2);
  put(solid(g), prism(P, front, dr, di, DZ - 4, DZ));

  const items = BAGS.map(([x, w, d, h], k) => {
    const y = (D - d) / 2, grp = mk("g", {}, g);
    const [br, bi] = rings(x, y, x + w, y + d, 3.5, 1.6);
    const [hr, hi] = rings(x + w / 2 - 6, y + d / 2 - 1.5, x + w / 2 + 6, y + d / 2 + 1.5, 1.5, 0.6);
    const body = solid(grp), handle = solid(grp);
    return { k, x, w, h, br, bi, hr, hi, body, handle, mid: P(x + w / 2, y + d / 2, DZ + h / 2), z: tween(k === FAV ? LIFT * 0.75 : 0), last: NaN };
  });
  wheel(18, D - 4); wheel(L - 18, D - 4);
  // tow bar and hitch, out front
  const [tr, ti] = rings(L + 2, D / 2 - 2, L + 26, D / 2 + 2, 1.5, 0.6);
  put(solid(g), prism(P, front, tr, ti, 7, 10));
  const [er, ei] = rings(L + 22, D / 2 - 5, L + 28, D / 2 + 5, 2.5, 1);
  put(solid(g), prism(P, front, er, ei, 6, 11));

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = DZ + lift, z1 = z0 + it.h;
    put(it.body, prism(P, front, it.br, it.bi, z0, z1));
    put(it.handle, prism(P, front, it.hr, it.hi, z1, z1 + 4));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const dd = Math.abs(it.mid[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(items[best].mid[1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.75 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bag " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "airportcart",
  means: "An airport baggage cart with four bags on its deck: the bag under the pointer lifts off, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[126, 139], [206, 178], [248, 199], null],
  mount,
});
