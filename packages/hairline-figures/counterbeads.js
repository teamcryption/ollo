/**
 * Counting rods: seven rods lying in lanes on a wooden tray. The pointer
 * picks a lane: its rod slides out along its length and the rods beside it
 * slide a little, staggered from it. At rest the rods sit unevenly, one
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the hit is the rods'
 * rest top plane, picked by lane.
 */
const {
  Cam, fit, facing, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 7, LANE = 9, L = 74, W = 112, TZ = 4, RH = 4, OUT = 34, FAV = 3;
const REST = [16, 4, 0, 8, 2, 0, 12];
const D = N * LANE + 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -4, 0], [W + OUT, D + 4, 0], [W + OUT, -4, 0], [-4, D + 4, 0], [W, D, TZ + RH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-4, -4, W, D + 4, 6, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));
  const rods = [];
  for (let k = 0; k < N; k++) {
    const y = 6 + k * LANE, s = solid(g);
    rods.push({ k, y, s, x: tween(REST[k]), last: NaN });
  }
  function draw(r, x) {
    if (x === r.last) return;
    r.last = x;
    const [a, b] = rings(4 + x, r.y, 4 + x + L, r.y + 5, 2.5, 1);
    put(r.s, prism(P, front, a, b, TZ, TZ + RH));
  }
  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const r of rods) { draw(r, tval(r.x, now)); if (!tdone(r.x, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TZ + RH);
    if (x < -10 || x > W + OUT + 6 || y < -6 || y > D + 6) return -1;
    return Math.max(0, Math.min(N - 1, Math.floor((y - 4) / LANE)));
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    rods.forEach((r, k) => {
      const dd = Math.abs(k - a), x = a < 0 ? REST[k] : dd === 0 ? OUT : dd === 1 ? 24 : dd === 2 ? 14 : dd === 3 ? 6 : 0;
      tset(r.x, x, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      r.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "rod " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "counterbeads",
  means: "Seven counting rods in a tray: the rod under the pointer slides out along its lane, and its neighbours slide a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[205, 140], [249, 172], [240, 205], null],
  mount,
});
