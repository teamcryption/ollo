/**
 * Chartboard: a bar chart built as five square columns on a low board, rising
 * left to right like a growth report. The pointer picks a column by where it
 * stands: it grows a step taller, and its neighbours rise a little, staggered
 * from it. At rest the last, tallest column is bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 26, W = 16, BZ = 4, GROW = 26, FAV = N - 1;
const REST = [16, 26, 22, 38, 52];
const X1 = (N - 1) * STEP + W + 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-8, -10, 0], [X1, -10, 0], [-8, W + 14, 0], [X1, W + 14, 0], [STEP * (N - 1), 2, BZ + REST[N - 1] + GROW + 4], [0, 2, BZ + REST[0] + GROW + 8]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-8, -10, X1, W + 14, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const [fr, fi] = rings(-4, -6, X1 - 4, -2, 1.5, 0.6);
  put(solid(g), prism(P, front, fr, fi, BZ, BZ + 1.2));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = 2 + k * STEP, y0 = 2;
    const [ring, inner] = rings(x0, y0, x0 + W, y0 + W, 3, 1.4);
    const s = solid(mk("g", {}, g));
    items.push({ k, ring, inner, s, h: tween(REST[k]), last: NaN, mid: P(x0 + W / 2, y0 + W / 2, BZ + REST[k] / 2) });
  }

  function draw(it, h) {
    if (h === it.last) return;
    it.last = h;
    put(it.s, prism(P, front, it.ring, it.inner, BZ, BZ + h));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.h, now)); if (!tdone(it.h, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const d = Math.abs(it.mid[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 24 && Math.abs(items[best].mid[1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), h = a < 0 ? REST[k] : REST[k] + (d === 0 ? GROW : d === 1 ? 8 : 0);
      tset(it.h, h, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "Q" + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "chartboard",
  means: "Five columns rising on a board like a growth chart: the column under the pointer grows taller and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[150, 150], [220, 140], [260, 120], null],
  mount,
});
