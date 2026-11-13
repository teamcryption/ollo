/**
 * Houses: a street of four houses on a kerb, each with a pitched roof, a door
 * and windows on its street face. The pointer picks a house: its roof lifts
 * off like a lid, as if to look inside, and the roofs beside it rise a
 * little, staggered from it. At rest one roof stands raised, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the house
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HOUSES = [[26, 22, 26], [30, 24, 32], [24, 22, 24], [28, 26, 30]]; // width, wall height, depth
const GAP = 10, OV = 2.5, PITCH = 14, LIFT = 18, FAV = 1;
const xs = []; { let x = 0; for (const [w] of HOUSES) { xs.push(x); x += w + GAP; } }
const X1 = xs[xs.length - 1] + HOUSES[HOUSES.length - 1][0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-8, -8, -3], [X1 + 8, 40, -3], [X1 + 8, -8, -3], [-8, 40, -3], [0, 0, 32 + PITCH + LIFT + 2], [X1, 0, 32 + PITCH + LIFT + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [kr, ki] = rings(-8, -8, X1 + 8, 40, 6, 1.6);
  put(solid(g), prism(P, front, kr, ki, -3, 0));

  const houses = HOUSES.map(([w, h, d], k) => {
    const x0 = xs[k], x1 = x0 + w, y0 = (36 - d) / 2, y1 = y0 + d;
    const walls = solid(g), marks = mk("path", { class: "nf lo" }, walls.g);
    const [r, i] = rings(x0, y0, x1, y1, 1.2, 0.8);
    put(walls, prism(P, front, r, i, 0, h));
    // a door and two windows on the street face (y = y1), a window on the side (x = x1)
    const f = (x, z) => P(x, y1, z), sd = (y, z) => P(x1, y, z);
    const box = (pts) => poly(pts);
    const dx = x0 + w * 0.3;
    marks.setAttribute("d",
      box([f(dx - 3, 0.5), f(dx + 3, 0.5), f(dx + 3, 11), f(dx - 3, 11)]) +
      box([f(x0 + w * 0.62, h * 0.45), f(x0 + w * 0.85, h * 0.45), f(x0 + w * 0.85, h * 0.75), f(x0 + w * 0.62, h * 0.75)]) +
      box([sd(y0 + d * 0.35, h * 0.45), sd(y0 + d * 0.65, h * 0.45), sd(y0 + d * 0.65, h * 0.75), sd(y0 + d * 0.35, h * 0.75)]));
    const roof = mk("path", { class: "sil" }, g), ridge = mk("path", { class: "nf lo" }, g);
    return { k, x0, x1, y0, y1, h, roof, ridge, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN };
  });

  /** A pitched roof lifted z: the hull of its eaves and its ridge, and the ridge with the front slope's edges. */
  function draw(hs, z) {
    if (z === hs.last) return;
    hs.last = z;
    const e = hs.h + z, top = e + PITCH, ym = (hs.y0 + hs.y1) / 2;
    const ax = hs.x0 - OV, bx = hs.x1 + OV, ay = hs.y0 - OV, by = hs.y1 + OV;
    const eaves = [P(ax, ay, e), P(bx, ay, e), P(bx, by, e), P(ax, by, e)], r0 = P(ax, ym, top), r1 = P(bx, ym, top);
    hs.roof.setAttribute("d", poly(hull([...eaves, r0, r1])));
    hs.ridge.setAttribute("d", seg(r0, r1) + seg(r1, P(bx, by, e)) + seg(r1, P(bx, ay, e)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const hs of houses) { draw(hs, tval(hs.z, now)); if (!tdone(hs.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = houses.map((hs) => P((hs.x0 + hs.x1) / 2, hs.y1, hs.h / 2));
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
    houses.forEach((hs, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(hs.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      hs.roof.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "house " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "houses",
  means: "A street of four houses: the roof of the one under the pointer lifts off, and the roofs beside it rise a little.",
  rules: [1, 2, 5, 9],
  range: [0, 45, 90],
  tour: [[124, 166], [165, 182], [245, 224], null],
  mount,
});
