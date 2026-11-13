/**
 * Medicine cabinet: a wall cabinet with its door swung open on the left, a
 * mirror panel on the door's inside, and two shelves holding eight bottles
 * and boxes. The pointer picks an item by where it rests: that one slides
 * forward off its shelf toward the reader, the items beside it ease out a
 * little, staggered from it. At rest one bottle stands pulled forward, bright.
 * The slider is the stagger.
 *
 * The pattern: a grid on a face plane (depositboxes); the hit is the nearest
 * resting middle, so a sliding item never takes the pointer with it.
 */
const {
  Cam, circ, facing, fillet, fit, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 20, SH = [31, 0], TOPZ = 60, YC = 10, OUT = 19, LIFT = 3, FAV = 6, OPEN = 14 * (Math.PI / 180);
const XC = [10, 25, 40, 54];
// row (0 the top shelf), column, bottle or box, half-width, half-depth, height
const IT = [
  [0, 0, 0, 5.5, 4, 14], [0, 1, 1, 4.5, 0, 21], [0, 2, 1, 3.5, 0, 15], [0, 3, 0, 6, 5, 19],
  [1, 0, 1, 5, 0, 23], [1, 1, 0, 6, 4.5, 16], [1, 2, 1, 4, 0, 19], [1, 3, 0, 5, 4, 24],
];
const REST = [1, 0, 2, 0, 0, 1.5, 5, 0.5];
const disc = (x, y, r) => circ(r, 28).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.55);
  const dx = -Math.sin(OPEN), dy = Math.cos(OPEN), DW = W + 6;
  fit(C, [[-3, -2, -3], [W + 3, D, -3], [W + 3, -2, TOPZ + 3], [-3 + dx * DW, D + dy * DW, -3], [-3 + dx * DW, D + dy * DW, TOPZ + 3], [10, YC + OUT + 6, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 1.2, b = 0.7) => { const s = solid(g), [o, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, o, i, z0, z1)); return s.g; };

  const order = [];
  order.push(box(-3, -2, W + 3, 0, -3, TOPZ + 3));
  order.push(box(-3, 0, 0, D, -3, TOPZ + 3));
  // the door: a thin plate swung past square on its left hinge, the mirror's frame on its inner face
  const door = solid(g);
  {
    const at = (u, z, v = 0) => P(-3 + dx * u - dy * v, D + dy * u + dx * v, z);
    const pts = (v) => [at(0, -3, v), at(DW, -3, v), at(DW, TOPZ + 3, v), at(0, TOPZ + 3, v)];
    const hullPts = pts(0).concat(pts(1.6));
    door.sil.setAttribute("d", poly(fillet(hull(hullPts), hull(hullPts).map(() => 1.5))));
    const m = fillet([[6, 4], [DW - 6, 4], [DW - 6, TOPZ - 4], [6, TOPZ - 4]], [2, 2, 2, 2]).map(([u, z]) => at(u, z));
    mk("path", { class: "nf lo", d: poly(m) }, door.g);
  }
  order.push(door.g);
  order.push(box(-3, -2, W + 3, D, -3, 0));

  const items = IT.map(([r, c, kind, hw, hd, h], k) => {
    const grp = mk("g", {}, g), body = solid(grp), cap = kind ? solid(grp) : null;
    return { k, r, c, kind, hw, hd, h, z0: SH[r], grp, body, cap, y: tween(REST[k]), z: tween(0), last: "" };
  });
  for (const it of items) if (it.r === 1) order.push(it.grp);
  order.push(box(0, 0, W, D - 1, SH[0] - 2, SH[0]));
  for (const it of items) if (it.r === 0) order.push(it.grp);
  order.push(box(-3, -2, W + 3, D, TOPZ, TOPZ + 3));
  order.push(box(W, 0, W + 3, D, -3, TOPZ + 3));

  function draw(it, y, z) {
    const key = y.toFixed(2) + "," + z.toFixed(2);
    if (key === it.last) return;
    it.last = key;
    const cx = XC[it.c], cy = YC + y, z0 = it.z0 + z;
    if (it.kind) {
      put(it.body, prism(P, front, disc(cx, cy, it.hw), disc(cx, cy, it.hw - 1), z0, z0 + it.h - 5));
      put(it.cap, prism(P, front, disc(cx, cy, it.hw * 0.55), null, z0 + it.h - 5, z0 + it.h));
    } else {
      const [o, i] = rings(cx - it.hw, cy - it.hd, cx + it.hw, cy + it.hd, 1.2, 0.7);
      put(it.body, prism(P, front, o, i, z0, z0 + it.h));
    }
  }

  // an item slid past the front edge is nearer than the shelves and walls: paint it last
  let painted = null;
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.y, now), tval(it.z, now)); if (!tdone(it.y, now) || !tdone(it.z, now)) moving = true; }
    const out = items.filter((it) => tval(it.y, now) > 6);
    const key = out.map((it) => it.k).join();
    if (key !== painted) {
      painted = key;
      for (const n of order) if (!out.some((it) => it.grp === n)) g.appendChild(n);
      for (const n of order) if (out.some((it) => it.grp === n)) g.appendChild(n);
    }
    return moving;
  });
  bag.add(B.unregister);

  /** The item whose resting middle is nearest the pointer; -1 off the shelves. */
  const mids = items.map((it) => P(XC[it.c], YC + 4, it.z0 + it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.hypot(m[0] - sx, (m[1] - sy) * 0.6); if (d < bd) { bd = d; best = k; } });
    const m = mids[best];
    return Math.abs(m[0] - sx) < 16 && Math.abs(m[1] - sy) < 34 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const t = a >= 0 ? items[a] : null, d = t ? Math.abs(it.c - t.c) + 2 * Math.abs(it.r - t.r) : 0;
      const y = a < 0 ? REST[k] : [OUT, 5, 2.5, 1][Math.min(d, 3)];
      const f = from >= 0 ? items[from] : null, delay = f ? (Math.abs(it.c - f.c) + Math.abs(it.r - f.r)) * stag : 0;
      tset(it.y, y, now, delay); tset(it.z, a === k ? LIFT : 0, now, delay);
      const on = k === (a < 0 ? FAV : a);
      it.body.sil.classList.toggle("hi", on);
      if (it.cap) it.cap.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "shelf " + (items[a].r + 1) + "·" + (items[a].c + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "medicinecabinet",
  means: "A wall medicine cabinet, door open: the bottle or box under the pointer slides forward off its shelf, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[235, 155], [289, 105], [314, 126], null],
  mount,
});
