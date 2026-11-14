/**
 * Poolbar: a resort cocktail bar, a long counter with four stools along its
 * front. The pointer picks a stool by where it stands: it slides out from
 * the counter, offered, and the stools beside it shift a little, staggered
 * from it. At rest one stool is pulled out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 34, PULL = 22, FAV = 1, CH = 30, SH = 20;
const REST = [3, PULL * 0.7, 1, 5];
const X1 = (N - 1) * STEP;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-18, -34, 0], [X1 + 18, -34, CH + 2], [-18, 12 + PULL + 10, 0], [X1 + 18, 12 + PULL + 10, 0], [-18, 0, CH + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the counter, with a lip of a top overhanging it
  const [br, bi] = rings(-14, -30, X1 + 14, -6, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, CH - 3));
  const [tr, ti] = rings(-18, -34, X1 + 18, -2, 5, 1.8);
  put(solid(g), prism(P, front, tr, ti, CH - 3, CH));

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    items.push({ k, x: k * STEP, grp, base: solid(grp), pole: solid(grp), seat: solid(grp), y: tween(REST[k]), last: NaN });
  }

  function draw(it, off) {
    if (off === it.last) return;
    it.last = off;
    const x = it.x, y = 12 + off;
    put(it.base, prism(P, front, disc(x, y, 7), disc(x, y, 5.5), 0, 1.6));
    put(it.pole, prism(P, front, disc(x, y, 1.6, 16), disc(x, y, 1, 16), 1.6, SH));
    put(it.seat, prism(P, front, disc(x, y, 9), disc(x, y, 7.2), SH, SH + 3.5));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.y, now)); if (!tdone(it.y, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 12, SH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), y = a < 0 ? REST[k] : dd === 0 ? PULL : dd === 1 ? 5 : 0;
      tset(it.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.seat.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "stool " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "poolbar",
  means: "A resort cocktail bar with four stools: the stool under the pointer slides out from the counter, its neighbours shift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[213, 168], [122, 122], [259, 191], null],
  mount,
});
