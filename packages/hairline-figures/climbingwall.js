/**
 * Climbing wall: a tall panel standing on a crash mat, a route of holds
 * bolted up its face. The pointer picks the nearest hold: it pushes out of
 * the wall toward the hand, and the holds beside it on the route ease out a
 * little, staggered from it. At rest one hold stands out, bright.
 *
 * The pattern: one of many on a face plane.
 */
const { Cam, fit, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 120, T = 8, H = 112, FAV = 5;
const HOLDS = [[22, 16, 13, 7], [50, 30, 10, 6], [30, 48, 14, 8], [72, 56, 12, 7], [52, 76, 13, 6], [94, 82, 10, 7], [76, 100, 14, 8]];
const REST = [4, 3, 5, 3, 4, 11, 3], OUT = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-8, -8, 0], [W + 8, 44, 0], [W + 8, -8, 0], [-8, 44, 0], [0, 0, H], [W, 0, H], [W, T + OUT, H]], 200, 166);
  const P = proj(C), front = HL.facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(-8, -8, W + 8, 44, 6, 2);
  put(solid(g), prism(P, front, mr, mi, 0, 4));
  const [wr, wi] = rings(0, 0, W, T, 3, 1.4);
  put(solid(g), prism(P, front, wr, wi, 4, H));

  const items = HOLDS.map(([x, z, w, h], k) => {
    const s = solid(g);
    return { k, x, z, w, h, s, d: tween(REST[k]), last: NaN };
  });

  function draw(it, d) {
    if (d === it.last) return;
    it.last = d;
    const [r, i] = rings(it.x - it.w / 2, T - 1, it.x + it.w / 2, T + d, Math.min(it.w, d) / 2.2, 1);
    put(it.s, prism(P, front, r, i, it.z - it.h / 2, it.z + it.h / 2));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.d, now)); if (!tdone(it.d, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, T, it.z));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 28 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = a < 0 ? REST[k] : dd === 0 ? OUT : dd === 1 ? 11 : 2;
      tset(it.d, d, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "hold " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "climbingwall",
  means: "A climbing wall on a crash mat: the hold under the pointer pushes out toward the hand, and its neighbours on the route ease out.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[168, 190], [225, 163], [230, 103], null],
  mount,
});
