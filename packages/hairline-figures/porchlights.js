/**
 * Porch lights: four lanterns hanging on short chains from the beam of a
 * porch, in front of a house wall with its door. The pointer picks a lantern
 * by where it stands: it swings out on its chain and lights, and the lanterns
 * beside it sway a little, staggered from it. At rest one lantern hangs a
 * little swung, lit. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), each part turning on a pivot.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, seg, tdone, tset, tval, tween, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 96, N = 4, PZ = 58, BY = 26, FAV = 2, SWING = 36;
const REST = [-3, 4, 12, -6];
const XS = [18, 38, 58, 78];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-6, -6, 0], [W + 6, 36, 0], [W + 6, -6, 0], [-6, 36, 0], [0, 0, 72], [W, 3, 72]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r, b, parent = g) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(parent); put(s, prism(P, front, o, i, z0, z1)); return s; };
  box(-6, -6, W + 6, 36, 0, 3, 4, 1.6);
  box(0, -2, W, 2, 3, 72, 1.5, 0.8);
  // the door, set in the wall between the second and third lanterns
  mk("path", { d: seg(P(40, 2, 3), P(40, 2, 36)) + seg(P(40, 2, 36), P(56, 2, 36)) + seg(P(56, 2, 36), P(56, 2, 3)), class: "nf lo" }, g);
  box(0, BY - 2, 4, BY + 2, 3, PZ, 1.2, 0.6);
  box(0, BY - 2.5, W, BY + 2.5, PZ, PZ + 4, 1.5, 0.8);

  const rot = (px, k, a) => (x, y, z) => { const dx = x - px, dz = z - PZ, c = Math.cos(a), s = Math.sin(a); return P(px + dx * c + dz * s, y, PZ - dx * s + dz * c); };
  const items = XS.map((x, k) => {
    const grp = mk("g", {}, g), chain = mk("path", { class: "nf lo" }, grp), s = solid(grp);
    return { k, x, chain, s, a: tween(REST[k]), last: NaN };
  });
  g.appendChild(box(W - 4, BY - 2, W, BY + 2, 3, PZ, 1.2, 0.6).g);

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const R = rot(it.x, it.k, rad(deg)), x = it.x, h = 5, pts = [];
    for (const z of [33, 49]) for (const [u, v] of [[-h, -h], [h, -h], [h, h], [-h, h]]) pts.push(R(x + u, BY + v, z));
    for (const [u, v] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) pts.push(R(x + u, BY + v, 52.5));
    for (const [u, v] of [[-3, -3], [3, -3], [3, 3], [-3, 3]]) pts.push(R(x + u, BY + v, 31));
    it.s.sil.setAttribute("d", poly(hull(pts)));
    it.s.cr.setAttribute("d", poly([R(x - 3, BY + h, 36), R(x + 3, BY + h, 36), R(x + 3, BY + h, 47), R(x - 3, BY + h, 47)]) + " " + poly([R(x + h, BY - 3, 36), R(x + h, BY + 3, 36), R(x + h, BY + 3, 47), R(x + h, BY - 3, 47)]));
    it.chain.setAttribute("d", seg(R(x, BY, PZ), R(x, BY, 52.5)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = XS.map((x) => P(x, BY, 45));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 20 && Math.abs(mids[best][1] - sy) < 40 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = a < 0 ? REST[k] : dd === 0 ? SWING : dd === 1 ? (k < a ? -10 : 12) : 0;
      tset(it.a, d, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "lamp " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "porchlights",
  means: "Four lanterns on a porch beam: the one under the pointer swings out on its chain and lights, its neighbours sway a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[143, 139], [199, 166], [226, 180], null],
  mount,
});
