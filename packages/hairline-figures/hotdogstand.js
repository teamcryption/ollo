/**
 * Hot dog stand: a counter with a griddle, four hot dogs in buns lying across
 * it. The pointer picks one by where it stands: it lifts off the griddle, its
 * neighbours rise a little, staggered from it. At rest one is half served,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, poly, open, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 20, W = (N - 1) * STEP + 32, D = 40, ZC = 34, ZG = 37, LIFT = 18, FAV = 2, BL = 26;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [16, 20, ZG + LIFT + 14], [W - 16, 20, ZG + LIFT + 14]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, ZC));
  mk("path", { d: open([P(5, D, ZC - 8), P(W - 5, D, ZC - 8)]), class: "nf lo" }, g);
  const [gr, gi] = rings(5, 5, W - 5, D - 5, 3, 1.5);
  put(solid(g), prism(P, front, gr, gi, ZC, ZG));
  for (let i = 1; i < 6; i++) { const y = 5 + (i * (D - 10)) / 6; mk("path", { d: open([P(8, y, ZG), P(W - 8, y, ZG)]), class: "nf lo" }, g); }

  // a capsule lying along y: circles in the x-z plane at each end, hulled
  const capsule = (x, y0, y1, zc, r) => {
    const pts = [];
    for (const y of [y0, y1]) for (let i = 0; i < 20; i++) { const t = (i / 20) * 2 * Math.PI; pts.push(P(x + r * Math.cos(t), y, zc + r * Math.sin(t))); }
    for (const [y, s] of [[y0 - r, 0.4], [y1 + r, 0.4]]) for (let i = 0; i < 12; i++) { const t = (i / 12) * 2 * Math.PI; pts.push(P(x + r * s * Math.cos(t), y, zc + r * s * Math.sin(t))); }
    return poly(hull(pts));
  };

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), x = 16 + k * STEP;
    const bun = solid(grp), dog = mk("path", { class: "sil" }, grp), lip = mk("path", { class: "nf lo" }, grp);
    const rest = k === FAV ? LIFT * 0.6 : [2, 0, 0, 1][k];
    items.push({ k, x, bun, dog, lip, rest, z: tween(rest), last: NaN });
  }
  const y0 = (D - BL) / 2, y1 = y0 + BL;

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const b = ZG + lift, x = it.x;
    const [r, ri] = rings(x - 7, y0 - 2, x + 7, y1 + 2, 6, 1.6);
    put(it.bun, prism(P, front, r, ri, b, b + 5));
    it.dog.setAttribute("d", capsule(x, y0 + 1, y1 - 1, b + 6, 3.4));
    it.lip.setAttribute("d", open([P(x - 2.4, y0 + 1, b + 7.5), P(x - 2.4, y1 - 1, b + 7.5)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, D / 2, ZG));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? it.rest : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.dog.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "dog " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "hotdogstand",
  means: "Four hot dogs in buns across a stand's griddle: the one under the pointer lifts off to be served.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[150, 123], [183, 140], [250, 173], null],
  mount,
});
