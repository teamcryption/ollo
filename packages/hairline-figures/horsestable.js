/**
 * Horse stable: a low block with a gabled roof and four stall doors along
 * its front, each a split door with a braced lower leaf. The pointer picks
 * a stall by where it stands: the top leaf of its door swings open on its
 * hinge, and the leaves beside it crack open, staggered from it. At rest
 * one top leaf stands half open, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, fillet, hull, open, poly, prism, proj, rings, ringAt, rrect, run, seg,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, W = 16, GAP = 27, M = 10, D = 34, H = 34, ZM = 14, ZT = 28, RH = 15, OPEN = 105, FAV = 2;
const X1 = 2 * M + (N - 1) * GAP + W;
const REST = [0, 12, 60, 0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [X1, D, 0], [X1 + 4, -4, H], [-4, D + 4, H], [X1 / 2, D / 2, H + RH], [M, D + W, 0], [X1, D + W, ZT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, X1, D, 3, 1.5);
  put(solid(g), prism(P, front, br, bi, 0, H));

  // the doors on the front face: frame, braced lower leaf
  const F = (x, z) => P(x, D, z);
  const xs = [];
  for (let k = 0; k < N; k++) {
    const x = M + k * GAP; xs.push(x);
    mk("path", { d: poly(fillet([F(x - 1.5, 0), F(x - 1.5, ZT + 1.5), F(x + W + 1.5, ZT + 1.5), F(x + W + 1.5, 0)], [0.5, 1.5, 1.5, 0.5])), class: "nf lo" }, g);
    mk("path", { d: poly(fillet([F(x, 0.8), F(x, ZM), F(x + W, ZM), F(x + W, 0.8)], [0.6, 0.6, 0.6, 0.6])), class: "nf" }, g);
    mk("path", { d: seg(F(x + 1.5, 2), F(x + W - 1.5, ZM - 1.5)) + seg(F(x + 1.5, ZM / 2), F(x + W - 1.5, ZM / 2)), class: "nf lo" }, g);
  }

  // the gabled roof: an eave ring under a ridge ring
  const foot = rrect(-4, -4, X1 + 4, D + 4, 2, 4), top = rrect(-4, D / 2 - 1.2, X1 + 4, D / 2 + 1.2, 1, 4);
  const inner = rrect(-3.2, D / 2 - 0.5, X1 + 3.2, D / 2 + 0.5, 0.4, 4);
  put(solid(g), { sil: poly(hull(ringAt(P, foot, H).concat(ringAt(P, top, H + RH)))), crease: open(ringAt(P, run(inner, front), H + RH)) });

  const items = xs.map((x, k) => {
    const grp = mk("g", {}, g);
    return { k, x, grp, leaf: mk("path", { class: "sil" }, grp), edge: mk("path", { class: "nf lo" }, grp), a: tween(REST[k]), last: NaN };
  });

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a), t = 1.4;
    const ex = it.x + W * c, ey = D + W * s, nx = -s * t, ny = c * t;
    const pts = [];
    for (const z of [ZM + 0.6, ZT]) pts.push(P(it.x, D, z), P(ex, ey, z), P(it.x + nx, D + ny, z), P(ex + nx, ey + ny, z));
    it.leaf.setAttribute("d", poly(hull(pts)));
    const mx = it.x + W * 0.5 * c, my = D + W * 0.5 * s;
    it.edge.setAttribute("d", seg(P(it.x + 1.2 * c + nx, D + 1.2 * s + ny, (ZM + ZT) / 2), P(ex - 1.2 * c + nx, ey - 1.2 * s + ny, (ZM + ZT) / 2)) + seg(P(mx + nx, my + ny, ZM + 2), P(mx + nx, my + ny, ZT - 1.5)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = xs.map((x) => F(x + W / 2, ZM));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), deg = a < 0 ? REST[k] : dd === 0 ? OPEN : dd === 1 ? 30 : 0;
      tset(it.a, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.leaf.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "stall " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "horsestable",
  means: "Four stall doors along a stable: the top leaf under the pointer swings open on its hinge, and its neighbours crack open.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[110, 127], [158, 152], [221, 183], null],
  mount,
});
