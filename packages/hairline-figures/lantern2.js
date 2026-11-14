/**
 * Tent pegs: four pegs standing in a strip of ground at uneven depths, with a
 * mallet hovering over one. The pointer picks a peg by where it stands: the
 * mallet slides over it and the peg drives down into the ground. At rest the
 * mallet waits over the second peg, its head bright.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, proj, prism, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, XS = [14, 52, 90, 128], Y = 14, GZ = 5, REST = [12, 30, 22, 17], DRIVEN = 5, FAV = 1;

function mount({ stage, svg, read }) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-8, -6, 0], [150, 34, 0], [150, -6, 0], [-8, 34, 0], [XS[0], Y, GZ + 30 + 34], [XS[3] + 46, Y, GZ + 30 + 34]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [gr, gi] = rings(-8, -6, 150, 34, 6, 2);
  put(solid(g), prism(P, front, gr, gi, 0, GZ));

  const pegs = XS.map((x, k) => {
    const grp = mk("g", {}, g);
    return { k, x, shaft: solid(grp), hook: solid(grp), h: tween(REST[k]), last: NaN };
  });
  const mg = mk("g", {}, g), head = solid(mg), handle = solid(mg);
  const mx = tween(XS[FAV]);
  let mlast = "";

  function drawPeg(p, h) {
    if (h === p.last) return;
    p.last = h;
    const [a, b] = rings(p.x - 2.6, Y - 2.6, p.x + 2.6, Y + 2.6, 1, 0.8);
    put(p.shaft, prism(P, front, a, b, GZ, GZ + h));
    const [c, d] = rings(p.x - 5, Y - 4, p.x + 7, Y + 4, 2, 1.2);
    put(p.hook, prism(P, front, c, d, GZ + h, GZ + h + 3));
  }
  function drawMallet(x, z) {
    const key = x.toFixed(2) + z.toFixed(2);
    if (key === mlast) return;
    mlast = key;
    const [a, b] = rings(x - 13, Y - 9, x + 13, Y + 9, 6, 1.8);
    put(head, prism(P, front, a, b, z, z + 18));
    const [c, d] = rings(x + 13, Y - 2, x + 46, Y + 2, 1.8, 0.8);
    put(handle, prism(P, front, c, d, z + 7, z + 11));
  }

  let tgt = FAV;
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of pegs) { drawPeg(p, tval(p.h, now)); if (!tdone(p.h, now)) moving = true; }
    drawMallet(tval(mx, now), GZ + tval(pegs[tgt].h, now) + 10);
    if (!tdone(mx, now)) moving = true;
    return moving;
  });
  bag.add(B.unregister);

  const mids = pegs.map((p) => P(p.x, Y, GZ + 10));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    tgt = a < 0 ? FAV : a;
    pegs.forEach((p, k) => tset(p.h, a >= 0 && k === a ? DRIVEN : REST[k], now, 0));
    tset(mx, XS[tgt], now, 0);
    head.sil.classList.toggle("hi", a < 0);
    pegs.forEach((p, k) => p.hook.sil.classList.toggle("hi", k === a));
    read.textContent = a < 0 ? "rest" : "peg " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
}

hairline({
  name: "lantern2",
  means: "Four tent pegs at uneven depths in a strip of ground: the mallet moves over the peg under the pointer and drives it down.",
  rules: [1, 5, 6, 8],
  range: [0, 1, 1],
  tour: [[121, 143], [223, 195], [274, 220], null],
  mount,
});
