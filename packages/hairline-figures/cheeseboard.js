/**
 * Cheese board: a wooden board holding five cheeses in a row, wedges with a
 * rind line and blocks with holes, a knife and a bunch of grapes behind
 * them. The pointer picks a cheese by where it stands: it slides out toward
 * the reader and lifts, and the cheeses beside it ease out a little,
 * staggered from it. At rest one wedge is half out, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row (bookshelf); the pick is the
 * cheese whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, fillet, facing, fit, open, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const S = 2.05, BX = 136, BY = 58, BZ = 4, Y0 = 24, OUT = 16, LIFT = 6, FAV = 2;
const CH = [{ x: 16, w: "wedge", h: 9 }, { x: 42, w: "block", h: 11 }, { x: 68, w: "wedge", h: 8 }, { x: 94, w: "block", h: 9 }, { x: 120, w: "wedge", h: 10 }];
// a ring of samples with outward normals, from a closed polygon
const toRing = (pts) => {
  const n = pts.length; let a = 0;
  for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n]; a += p[0] * q[1] - q[0] * p[1]; }
  const sg = a > 0 ? 1 : -1;
  return pts.map((p, i) => {
    const b = pts[(i - 1 + n) % n], c = pts[(i + 1) % n], tx = c[0] - b[0], ty = c[1] - b[1], l = Math.hypot(tx, ty) || 1;
    return { u: p[0], v: p[1], nu: (sg * ty) / l, nv: (-sg * tx) / l };
  });
};
const tri = (cx, y, d) => toRing(fillet([[cx - 9 + d, y + 18 - d], [cx + d * 0.2, y + d * 1.6], [cx + 9 - d, y + 18 - d]], [1.6 - d * 0.3, 1.2, 1.6 - d * 0.3], 4));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, S);
  fit(C, [[0, 0, 0], [BX, BY + 6, 0], [BX, 0, 0], [0, BY + 6, 0], [16, Y0 + OUT, BZ + 16], [120, Y0, BZ + 16]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, BX, BY, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  mk("path", { class: "nf lo", d: open([P(10, BY - 6, BZ), P(BX - 10, BY - 6, BZ)]) }, g);

  // behind the row: grapes on the left, a knife on the right
  const GR = [[14, 9, 2], [20, 7, 2], [26, 10, 2], [17, 13, 2], [23, 14, 2], [29, 15, 2], [20, 10, 5.6], [25, 12, 5.4]];
  mk("path", { class: "nf lo", d: open([P(12, 6, BZ + 6), P(17, 9, BZ + 7), P(20, 10, BZ + 8)]) }, g);
  GR.slice().sort((p, q) => p[0] + p[1] - q[0] - q[1] + (p[2] - q[2]) * 2).forEach(([x, y, z]) => {
    const [sx, sy] = P(x, y, BZ + z + 1.6);
    mk("ellipse", { cx: sx, cy: sy, rx: 3.3 * S, ry: 3.3 * S, class: "sil" }, g);
  });
  { const [r, i] = rings(54, 8, 100, 13, 2.4, 0.8); put(solid(g), prism(P, front, r, i, BZ, BZ + 0.8)); }
  { const [r, i] = rings(100, 8.6, 124, 12.4, 1.6, 0.6); put(solid(g), prism(P, front, r, i, BZ, BZ + 3.4)); }

  const items = CH.map((c, k) => {
    const el = solid(g), rind = mk("path", { class: "nf lo" }, el.g);
    const holes = c.w === "block" ? [0, 1, 2].map(() => flatDot(el.g, C, 1.1, "dot off")) : [];
    return { k, ...c, el, rind, holes, y: tween(k === FAV ? OUT * 0.55 : 0), z: tween(0), last: "" };
  });

  function draw(it, y, z) {
    const key = y.toFixed(2) + "," + z.toFixed(2);
    if (key === it.last) return;
    it.last = key;
    const yy = Y0 + y, z0 = BZ + z, z1 = z0 + it.h;
    if (it.w === "wedge") {
      put(it.el, prism(P, front, tri(it.x, yy, 0), tri(it.x, yy, 1.4), z0, z1));
      it.rind.setAttribute("d", seg(P(it.x - 7.6, yy + 18, z1 - 2), P(it.x + 7.6, yy + 18, z1 - 2)));
    } else {
      const [r, i] = rings(it.x - 8, yy + 1, it.x + 8, yy + 17, 2.4, 1.2);
      put(it.el, prism(P, front, r, i, z0, z1));
      [[-3, 6], [3, 9], [-1, 13]].forEach(([dx, dy], j) => place(it.holes[j], P(it.x + dx, yy + dy, z1)));
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.y, now), tval(it.z, now)); if (!tdone(it.y, now) || !tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y0 + 9, BZ + it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 20 && Math.abs(mids[best][1] - sy) < 45 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a);
      const y = a < 0 ? (k === FAV ? OUT * 0.55 : 0) : d === 0 ? OUT : d === 1 ? 3.5 : 0;
      const delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(it.y, y, now, delay); tset(it.z, a === k ? LIFT : d === 1 ? 1 : 0, now, delay);
      it.el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "cheese " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cheeseboard",
  means: "Five cheeses on a wooden board: the one under the pointer slides out and lifts, and its neighbours ease out a little.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[161, 123], [236, 163], [123, 108], null],
  mount,
});
