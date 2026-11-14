/**
 * Rooftop garden: a building block with three planter beds on its roof, each
 * holding a shrub. The pointer picks a bed by where it stands: its shrub grows
 * tall and the beds beside it grow a little, staggered from it. At rest the
 * first shrub stands taller, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, W = 120, D = 70, H = 46, PZ = 9, FAV = 0, GROW = 40;
const BX = [8, 44, 80], BW = 32;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const REST = [16, 2, 6];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [W / 2, D / 2, H + PZ + 20 + GROW]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // parapet ledge round the roof
  const [pr, pi] = rings(2, 2, W - 2, D - 2, 5, 1.2);
  mk("path", { d: poly(ringAt(P, pr, H)), class: "nf lo" }, g);
  // floor lines on the front faces
  for (const z of [H / 3, (2 * H) / 3]) {
    mk("path", { d: "M" + P(W, 6, z) + "L" + P(W, D, z) + "L" + P(6, D, z), class: "nf lo" }, g);
  }

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = BX[k], x = x0 + BW / 2, y = D / 2, grp = mk("g", {}, g);
    const [r, ri] = rings(x0, y - 15, x0 + BW, y + 15, 4, 1.4);
    const bed = solid(grp);
    put(bed, prism(P, front, r, ri, H, H + PZ));
    const bush = mk("path", { class: "nf" }, grp);
    items.push({ k, x, y, bed, bush, h: tween(REST[k]), last: NaN });
  }

  function draw(it, h) {
    if (h === it.last) return;
    it.last = h;
    const z0 = H + PZ - 1, pts = [];
    for (const [rf, zf] of [[0.75, 0], [1, 0.3], [0.85, 0.65], [0.4, 0.92], [0.1, 1]]) {
      pts.push(...ringAt(P, disc(it.x, it.y, (11 + h * 0.12) * rf + 0.01), z0 + (12 + h) * zf));
    }
    it.bush.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.h, now)); if (!tdone(it.h, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, H + PZ));
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
      const dd = Math.abs(k - a), h = a < 0 ? REST[k] : dd === 0 ? GROW : dd === 1 ? 6 : 1;
      tset(it.h, h, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.bed.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bed " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "rooftopgarden",
  means: "Three planter beds on a building's roof: the shrub in the bed under the pointer grows tall, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[155, 112], [200, 134], [245, 156], null],
  mount,
});
