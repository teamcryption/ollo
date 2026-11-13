/**
 * Luggage trolley: a hotel bell cart, a deck on four wheels with an arched
 * rail along its back, carrying four suitcases of different sizes, each with
 * a zip line round its broad face and a handle on top. The pointer picks a
 * case by where it stands: it lifts off the deck, and the cases beside it
 * lift a little, staggered from it. At rest one case is half raised, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the case
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, facing, fit, hull, open, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 104, D = 40, DZ = 11, LIFT = 16, FAV = 1, RY = 3;
// [x0, x1, y0, y1, height]
const BAGS = [[8, 28, 6, 34], [31, 47, 9, 33], [50, 74, 5, 35], [77, 95, 8, 34]].map((b, k) => [...b, [40, 30, 46, 34][k]]);

// a wheel: a short cylinder lying along y, as the hull of its two side circles
const wheel = (P, xc, y0, y1, zc, R) => {
  const ring = (y) => Array.from({ length: 24 }, (_, i) => P(xc + R * Math.cos((i / 24) * 2 * Math.PI), y, zc + R * Math.sin((i / 24) * 2 * Math.PI)));
  return { sil: poly(hull(ring(y0).concat(ring(y1)))), front: poly(ring(y1)) };
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [L, D, 0], [L, 0, 0], [0, D, 0], [L / 2, RY, 74], [62, 20, DZ + 46 + LIFT + 5]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // wheels far to near, then the deck over them
  for (const [x, y] of [[9, 4], [L - 9, 4], [9, D - 7], [L - 9, D - 7]]) {
    const w = wheel(P, x, y, y + 3, 4.2, 4.2), s = solid(g);
    s.sil.setAttribute("d", w.sil); s.cr.setAttribute("d", w.front);
  }
  const [dr, di] = rings(0, 0, L, D, 4, 1.5);
  put(solid(g), prism(P, front, dr, di, 8, DZ));

  // the arched rail along the back: two uprights rising into one long arch, a round tube
  const arch = (y) => {
    const pts = [P(3, y, DZ)];
    for (let i = 0; i <= 24; i++) { const t = Math.PI - (i / 24) * Math.PI; pts.push(P(L / 2 + (L / 2 - 3) * Math.cos(t), y, 54 + 20 * Math.sin(t))); }
    pts.push(P(L - 3, y, DZ));
    return open(pts);
  };
  mk("path", { d: arch(RY - 1.2) + arch(RY + 1.2), class: "nf" }, g);

  const items = BAGS.map(([x0, x1, y0, y1, h], k) => {
    const el = solid(g), zip = mk("path", { class: "nf lo" }, el.g), grip = mk("path", { class: "nf" }, el.g);
    return { k, x0, x1, y0, y1, h, el, zip, grip, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN };
  });

  function draw(b, lift) {
    if (lift === b.last) return;
    b.last = lift;
    const z0 = DZ + lift, z1 = z0 + b.h, ym = (b.y0 + b.y1) / 2, xm = (b.x0 + b.x1) / 2;
    const [r, i] = rings(b.x0, b.y0, b.x1, b.y1, 3, 1.2);
    put(b.el, prism(P, front, r, i, z0, z1));
    b.zip.setAttribute("d", poly(rrect(b.y0 + 3, z0 + 3, b.y1 - 3, z1 - 3, 3, 3).map((q) => P(b.x1, q.u, q.v))));
    b.grip.setAttribute("d", open([P(xm, ym - 5, z1), P(xm, ym - 5, z1 + 3), P(xm, ym - 3.5, z1 + 4), P(xm, ym + 3.5, z1 + 4), P(xm, ym + 5, z1 + 3), P(xm, ym + 5, z1)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of items) { draw(b, tval(b.z, now)); if (!tdone(b.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The case whose resting middle is nearest the pointer's x on screen; -1 off the cart. */
  const mids = items.map((b) => P((b.x0 + b.x1) / 2, b.y1, DZ + b.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 55 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((b, k) => {
      const d = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : d === 0 ? LIFT : d === 1 ? 4 : 0;
      tset(b.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      b.el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
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
  name: "luggagetrolley",
  means: "A hotel luggage trolley with four suitcases: the case under the pointer lifts off the deck, and its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[128, 122], [164, 161], [230, 187], null],
  mount,
});
