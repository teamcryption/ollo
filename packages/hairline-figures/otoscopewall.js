/**
 * Wall diagnostic: a wall board with a transformer bar and three instrument
 * handles standing in its cradles, coiled cords hanging beneath. The pointer
 * picks a handle by where it stands: it tilts forward out of its cradle, and
 * the handles beside it tilt a little, staggered from it. At rest the first
 * handle leans out, bright.
 */
const { Cam, circ, fit, hull, open, poly, proj, rings, tset, tval, tdone, tween, disposer, mk, pointer, register, solid } = HL;

const N = 3, STEP = 38, TILT = 0.75, REST = [0.5, 0.1, 0.2], FAV = 0, AMT = [1, 0.4, 0.15];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-6, -10, 104], [126, -10, 104], [-6, -10, 4], [126, 30, 8], [-6, 30, 60], [126, 30, 100]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const W = (tf, ring, z) => ring.map((q) => P(...tf([q.u, q.v, z])));
  const body = (s, [o, i], z0, z1, tf, o1 = o) => {
    s.sil.setAttribute("d", poly(hull(W(tf, o, z0).concat(W(tf, o1, z1)))));
    s.cr.setAttribute("d", poly(W(tf, i, z1)));
  };
  const id = (p) => p;
  body(solid(g), rings(-6, -10, 126, -4, 3, 1), 4, 104, id);
  body(solid(g), rings(2, -4, 118, 14, 4, 1.5), 36, 52, id);
  for (let k = 0; k < N; k++) {
    const x = 22 + k * STEP, pts = [];
    for (let t = 0; t <= 60; t++) { const a = t * 0.63; pts.push(P(x + 4 * Math.cos(a), 6 + 4 * Math.sin(a), 36 - t * 0.45)); }
    mk("path", { d: open(pts), class: "nf lo" }, g);
  }

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 22 + k * STEP, y = 5, grp = mk("g", {}, g);
    const h = solid(grp), head = solid(grp);
    const H = [disc(x, y, 5.5), disc(x, y, 4)];
    const heads = [
      [disc(x, y, 6.5), disc(x, y, 5), 86, 96, disc(x, y, 2.2)],
      [disc(x, y, 8), disc(x, y, 6.5), 86, 92, disc(x, y, 8)],
      [disc(x, y, 4.5), disc(x, y, 3), 86, 98, disc(x, y, 4.5)],
    ][k];
    const draw = (v) => {
      const a = -v * TILT, c = Math.cos(a), s = Math.sin(a), lift = v * 5;
      const tf = ([px, py, pz]) => { const dy = py - 11, dz = pz - 52; return [px, 11 + dy * c - dz * s, 52 + lift + dy * s + dz * c]; };
      body(h, H, 52, 86, tf);
      body(head, [heads[0], heads[1]], heads[2], heads[3], tf, heads[4]);
    };
    items.push({ s: h, draw, tw: tween(REST[k]), last: NaN, mid: P(x, y, 70) });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { const v = tval(it.tw, now); if (v !== it.last) { it.last = v; it.draw(v); } if (!tdone(it.tw, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const d = Math.abs(it.mid[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 40 && Math.abs(items[best].mid[1] - sy) < 90 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      tset(it.tw, a < 0 ? REST[k] : AMT[Math.abs(k - a)], now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : ["oto", "ophth", "lamp"][a];
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "otoscopewall",
  means: "A wall diagnostic board with three instrument handles: the handle under the pointer tilts out of its cradle, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[158, 92], [206, 116], [254, 140], null],
  mount,
});
