/**
 * Armchair: a boxy armchair on four short feet, with a loose seat cushion
 * and a loose back cushion. The pointer picks a cushion by where it lies:
 * it lifts out of the chair, and the other one rises a little, staggered
 * from it. At rest the seat cushion sits slightly proud, bright. The slider
 * is the stagger.
 *
 * The pattern: two parts at different heights, picked by rest pose.
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const LIFT = 20, FAV = 0;
// cushions: [x0, y0, x1, y1, z0, z1, name]
const CU = [[11, 13, 49, 55, 22, 30, "seat"], [11, 12, 49, 21, 30, 56, "back"]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[0, 0, 0], [60, 58, 0], [60, 0, 60 + LIFT], [0, 58, 0], [0, 0, 62]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 3, b = 1.4, cls) => { const s = solid(g); put(s, prism(P, front, ...rings(x0, y0, x1, y1, r, b), z0, z1)); if (cls) s.sil.classList.add(cls); return s; };
  for (const [fx, fy] of [[4, 4], [56, 4], [4, 52], [56, 52]]) box(fx - 2, fy - 2, fx + 2, fy + 2, 0, 4, 1.5, 0.6);
  box(0, 0, 60, 56, 4, 22, 4, 1.6);
  box(0, 0, 60, 12, 4, 60, 4, 1.6);
  box(0, 0, 10, 56, 4, 38, 4, 1.6);
  const cg = mk("g", {}, g), rightArm = mk("g", {}, g);
  { const s = solid(rightArm); put(s, prism(P, front, ...rings(50, 0, 60, 56, 4, 1.6), 4, 38)); }

  const cush = CU.map(([x0, y0, x1, y1, z0, z1, name], k) => {
    const s = solid(mk("g", {}, cg));
    return { k, x0, y0, x1, y1, z0, z1, name, s, z: tween(k === FAV ? 6 : 0), last: NaN };
  });
  // the back cushion is farther: paint it first
  cg.prepend(cush[1].s.g.parentNode);
  function draw(c, lift) {
    if (lift === c.last) return;
    c.last = lift;
    put(c.s, prism(P, front, ...rings(c.x0, c.y0, c.x1, c.y1, 4, 1.8), c.z0 + lift, c.z1 + lift));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of cush) { draw(c, tval(c.z, now)); if (!tdone(c.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = cush.map((c) => P((c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2, (c.z0 + c.z1) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 48 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cush.forEach((c, k) => {
      const z = a < 0 ? (k === FAV ? 6 : 0) : k === a ? LIFT : 4;
      tset(c.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      c.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : cush[a].name;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "armchair",
  means: "An armchair with loose cushions: the cushion under the pointer lifts out of the chair, the other rises a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[192, 181], [222, 130], [156, 131], null],
  mount,
});
