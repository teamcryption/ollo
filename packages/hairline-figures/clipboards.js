/**
 * Clipboards: four boards lying in a row, each with a sheet under its clip.
 * The pointer picks a board by where it stands: it lifts off the desk, and
 * the boards beside it rise a little, staggered from it. At rest one board
 * is raised, its clip bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, flatDot,
} = HL;

const N = 4, STEP = 34, W = 28, D = 42, BZ = 2, LIFT = 20, FAV = 2;
const X1 = (N - 1) * STEP + W;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-2, -2, 0], [X1 + 2, D + 2, 0], [X1 + 2, -2, 0], [-2, D + 2, 0], [W / 2, 8, BZ + 8 + LIFT], [X1 - W / 2, 8, BZ + 8 + LIFT]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const phones = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, x1 = x0 + W, grp = mk("g", {}, g);
    const bs = solid(grp), [br, bi] = rings(x0, 0, x1, D, 3, 1);
    const ps = solid(grp), [sr, si] = rings(x0 + 3, 7, x1 - 3, D - 3, 1, 0.5);
    const hs = solid(grp), [hr, hi] = rings(x0 + 8, 2, x1 - 8, 8, 2, 0.8);
    phones.push({ k, x: (x0 + x1) / 2, bs, br, bi, ps, sr, si, hs, hr, hi, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }

  function draw(p, lift) {
    if (lift === p.last) return;
    p.last = lift;
    put(p.bs, prism(P, front, p.br, p.bi, lift, BZ + lift));
    put(p.ps, prism(P, front, p.sr, p.si, BZ + lift, BZ + 0.6 + lift));
    put(p.hs, prism(P, front, p.hr, p.hi, BZ + lift, BZ + 4 + lift));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of phones) { draw(p, tval(p.z, now)); if (!tdone(p.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = phones.map((p) => P(p.x, D / 2, BZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 45 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    phones.forEach((p, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(p.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      p.hs.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "board " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "clipboards",
  means: "Four clipboards in a row: the board under the pointer lifts with its clip, and the boards beside it rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[132, 142], [200, 176], [268, 210], null],
  mount,
});
