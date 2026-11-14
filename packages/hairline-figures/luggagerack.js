/**
 * Overhead rack: a train's luggage shelf on a wall rail, four bags of
 * different sizes resting on its slats. The pointer picks a bag by screen x:
 * it slides out over the rack's lip and tips toward the reader, and the bags
 * beside it shuffle a little, staggered from it. At rest one bag sits half
 * out, bright. The slider is the stagger.
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 210, D = 44, RZ = 60, OUT = 34, FAV = 2;
const BAGS = [[8, 46, 28, 22], [62, 40, 30, 30], [110, 52, 32, 18], [170, 32, 26, 26]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[0, -6, RZ + 34], [L, -6, 20], [L, D + OUT + 4, RZ], [0, D + OUT + 4, RZ + 30], [0, D, RZ - 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // wall rail behind the rack
  const [wr, wi] = rings(-4, -6, L + 4, -2, 1.5, 1);
  put(solid(g), prism(P, front, wr, wi, RZ - 30, RZ + 34));
  // brackets: dashed stays from rail to the lip
  let dd = "";
  for (const x of [20, L - 20]) dd += seg(P(x, -2, RZ - 26), P(x, D, RZ));
  mk("path", { d: dd, class: "dash nf" }, g);
  // the rack plate and its slats
  const [pr, pi] = rings(0, 0, L, D, 3, 1.2);
  put(solid(g), prism(P, front, pr, pi, RZ - 2, RZ));
  let sl = "";
  for (let y = 8; y < D; y += 8) sl += seg(P(3, y, RZ), P(L - 3, y, RZ));
  mk("path", { d: sl, class: "lo nf" }, g);

  const items = BAGS.map(([x, w, h, dep], k) => {
    const s = solid(mk("g", {}, g));
    return { k, x, w, h, dep, s, t: tween(k === FAV ? 0.55 : 0), last: NaN };
  });

  function draw(it, v) {
    if (v === it.last) return;
    it.last = v;
    const y0 = 3 + v * OUT, z0 = RZ + 0.2 + v * 3;
    const [r, i] = rings(it.x, y0, it.x + it.w, y0 + it.dep, 5, 1.6);
    put(it.s, prism(P, front, r, i, z0, z0 + it.h));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + it.w / 2, 3 + it.dep / 2, RZ + it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), v = a < 0 ? (k === FAV ? 0.55 : 0) : d === 0 ? 1 : d === 1 ? 0.12 : 0;
      tset(it.t, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bag " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "luggagerack",
  means: "A train's overhead rack: the bag under the pointer slides out over the lip, and the bags beside it shuffle a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[136, 115], [198, 139], [302, 198], null],
  mount,
});
