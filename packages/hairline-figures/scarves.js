/**
 * Scarves: a boutique T-stand, one pole on a round foot under a rail, five
 * scarves draped over the rail with fringed ends, each hanging longer on one
 * side than the other. The pointer picks a scarf along the rail: it is
 * pulled down at the front, the back end riding up, and the scarves beside
 * it slip a little, staggered from it. At rest one scarf hangs long, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fillet, fit, facing, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 16, X0 = 13, W = 5.5, YR = 10, ZR = 92, TOT = 104, PULL = 80, FAV = 3;
const REST = [44, 58, 38, 66, 50];
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[45 - 30, YR - 30, 0], [45 + 30, YR + 30, 0], [0, YR, ZR + 3], [90, YR, ZR + 3], [X0, YR + 3, ZR - PULL - 4], [X0 + 4 * STEP, YR + 3, ZR - PULL - 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(45, YR, 28, 48), disc(45, YR, 26, 48), 0, 4));
  const backs = mk("g", {}, g);
  const [pr, pi] = rings(43, YR - 2, 47, YR + 2, 2, 0.7);
  put(solid(g), prism(P, front, pr, pi, 4, ZR));
  const [rr, ri] = rings(-2, YR - 2.2, 92, YR + 2.2, 2.1, 0.8);
  put(solid(g), prism(P, front, rr, ri, ZR, ZR + 3));
  const fronts = mk("g", {}, g);

  const band = (x, y, len) => {
    const z1 = ZR + 1.5, z0 = z1 - len;
    return fillet([[x - W, z1], [x + W, z1], [x + W, z0], [x - W, z0]], [1, 1, 1.4, 1.4], 4).map(([u, z]) => P(u, y, z));
  };
  const fringe = (x, y, len) => {
    const z0 = ZR + 1.5 - len;
    let d = "";
    for (let i = 0; i < 5; i++) { const u = x - W + 1.5 + i * ((2 * W - 3) / 4); d += seg(P(u, y, z0), P(u, y, z0 - 3.5)); }
    return d;
  };

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP;
    const bg = mk("g", {}, backs), fg = mk("g", {}, fronts);
    const bfr = mk("path", { class: "lo nf" }, bg), back = mk("path", { class: "sil" }, bg);
    const ffr = mk("path", { class: "lo nf" }, fg), body = mk("path", { class: "sil" }, fg), fold = mk("path", { class: "lo nf" }, fg);
    items.push({ k, x, back, bfr, body, ffr, fold, L: tween(REST[k]), last: NaN });
  }

  function draw(it, L) {
    if (L === it.last) return;
    it.last = L;
    const yf = YR + 3, yb = YR - 3, Lb = TOT - L;
    it.body.setAttribute("d", poly(band(it.x, yf, L)));
    it.ffr.setAttribute("d", fringe(it.x, yf, L));
    it.back.setAttribute("d", poly(band(it.x, yb, Lb)));
    it.bfr.setAttribute("d", fringe(it.x, yb, Lb));
    it.fold.setAttribute("d", seg(P(it.x - W + 1.2, yf, ZR - 3), P(it.x + W - 1.2, yf, ZR - 3)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.L, now)); if (!tdone(it.L, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, YR, ZR - 30));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 18 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), v = a < 0 ? REST[k] : dd === 0 ? PULL : REST[k] + (dd === 1 ? 6 : 2);
      tset(it.L, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "scarf " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "scarves",
  means: "Five scarves draped over a boutique T-stand: the scarf under the pointer is pulled down at the front, its neighbours slip a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[142, 110], [195, 137], [248, 163], null],
  mount,
});
