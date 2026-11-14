/**
 * Nail polish: a row of five polish bottles on a shelf with a back board,
 * square glass bodies of different heights under tall round caps. The
 * pointer picks a bottle by where it stands: it slides out toward the
 * viewer, and the bottles beside it ease forward a little, staggered from
 * it. At rest one bottle stands half out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 22, W = 7, BZ = 5, FAV = 3, OUT = 16, D = 26;
const HS = [16, 20, 13, 18, 15], CAP = [11, 9, 12, 10, 13], REST = [2, 0, 4, 9, 1];
const X1 = (N - 1) * STEP + 2 * W + 8;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-4, -6, 0], [X1 + 4, D + OUT, 0], [X1 + 4, -6, 0], [-4, D + OUT, 0], [-4, -6, 48], [X1 + 4, -6, 48]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -6, X1 + 4, -2, 1.5, 0.8);
  put(solid(g), prism(P, front, br, bi, 0, 48));
  const [sr, si] = rings(-4, -2, X1 + 4, D, 4, 1.5);
  put(solid(g), prism(P, front, sr, si, 0, BZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = W + 4 + k * STEP, grp = mk("g", {}, g);
    const body = solid(grp), neck = solid(grp), cap = solid(grp);
    items.push({ k, x, h: BZ + HS[k], body, neck, cap, s: tween(REST[k]), last: NaN });
  }

  function draw(it, s) {
    if (s === it.last) return;
    it.last = s;
    const y = W + 2 + s, x = it.x, top = it.h;
    const [r0, r1] = rings(x - W, y - W, x + W, y + W, 3, 1.4);
    put(it.body, prism(P, front, r0, r1, BZ, top));
    put(it.neck, prism(P, front, disc(x, y, 2.6), disc(x, y, 1.8), top, top + 2));
    put(it.cap, prism(P, front, disc(x, y, 3.6), disc(x, y, 2.6), top + 2, top + 2 + CAP[it.k]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.s, now)); if (!tdone(it.s, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, W + 2, it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a);
      tset(it.s, a < 0 ? REST[k] : dd === 0 ? OUT : dd === 1 ? 4 : 0, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "shade " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "perfumeorgan",
  means: "Five nail polish bottles on a shelf: the bottle under the pointer slides out toward you, and its neighbours ease forward.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[144, 153], [211, 183], [278, 220], null],
  mount,
});
