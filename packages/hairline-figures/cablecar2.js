/**
 * Chairlift: a haul cable strung between two towers, four chairs hanging
 * from it on long hangers. The pointer picks a chair by where it stands:
 * that chair swings out on its hanger, the ones beside it swing a little
 * less, staggered from it. At rest the chairs hang unevenly and one is
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row, each turning about a pivot.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rad, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const XS = [26, 58, 90, 122], Y = 14, H = 38, X1 = 148, REST = [-6, 20, -14, 6], FAV = 1;
const zc = (x) => 62 + x * 0.12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-6, 0, 0], [X1 + 6, 28, 0], [X1, Y, zc(X1) + 10], [0, Y, zc(0) + 10], [XS[0] - 26, Y, zc(0) - H], [XS[3] + 26, Y, zc(X1) - H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-6, 0, X1 + 6, 28, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, 3));
  // towers with a cross-arm, far one first
  function tower(x) {
    const [r, i] = rings(x - 2.5, Y - 2.5, x + 2.5, Y + 2.5, 1.4, 0.8);
    put(solid(g), prism(P, front, r, i, 3, zc(x) + 4));
    const [ar, ai] = rings(x - 2, Y - 9, x + 2, Y + 9, 1, 0.6);
    put(solid(g), prism(P, front, ar, ai, zc(x) + 4, zc(x) + 7));
  }
  tower(0);
  const cable = mk("path", { d: seg(P(0, Y, zc(0) + 3), P(X1, Y, zc(X1) + 3)), class: "nf" }, g);

  // a chair, swung by a degrees about its grip on the cable (turning in the x-z plane)
  const box = (x0, x1, y0, y1, z0, z1) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push([x, y, z]); return o; };
  const items = XS.map((x, k) => {
    const grp = mk("g", {}, g);
    const hang = mk("path", { class: "nf" }, grp), back = mk("path", {}, grp), seat = mk("path", { class: "sil" }, grp), bar = mk("path", { class: "nf lo" }, grp);
    return { k, x, grp, hang, back, seat, bar, a: tween(REST[k]), last: NaN };
  });
  tower(X1);

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const z0 = zc(it.x) + 3, s = Math.sin(rad(deg)), c = Math.cos(rad(deg));
    const T = ([dx, y, dz]) => P(it.x + dx * c + dz * s, y, z0 - dx * s + dz * c);
    const W = 10;
    it.hang.setAttribute("d", open3([[0, Y, 0], [0, Y, -H + 6], [-4, Y - W, -H + 6], [-4, Y - W, -H], [-4, Y + W, -H + 6], [-4, Y + W, -H]].map(T), [[0, 1], [2, 4], [2, 3], [4, 5]]));
    it.seat.setAttribute("d", poly(hull(box(-10, 4, Y - W - 1, Y + W + 1, -H - 2, -H).map(T))));
    it.back.setAttribute("d", poly(hull(box(-11, -9, Y - W - 1, Y + W + 1, -H, -H + 13).map(T))));
    it.bar.setAttribute("d", seg(T([3, Y - W, -H + 8]), T([3, Y + W, -H + 8])) + seg(T([3, Y - W, -H + 8]), T([-4, Y - W, -H + 8])) + seg(T([3, Y + W, -H + 8]), T([-4, Y + W, -H + 8])));
  }
  const open3 = (pts, pairs) => pairs.map(([a, b]) => seg(pts[a], pts[b])).join("");

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y, zc(it.x) - H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), to = a < 0 ? REST[k] : d === 0 ? 38 : d === 1 ? 16 : 4;
      tset(it.a, to, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.seat.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "chair " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cablecar2",
  means: "A chairlift: the chair under the pointer swings out on its hanger from the cable, and its neighbours swing a little less.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[142, 140], [181, 144], [258, 176], null],
  mount,
});
