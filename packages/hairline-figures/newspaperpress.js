/**
 * Newspaper rack: four papers standing in the pockets of a low rack, each
 * pocket a back board and a front lip. The pointer picks a paper by where it
 * stands: it slides up out of its pocket, and the papers beside it rise a
 * little, staggered from it. At rest one paper is half drawn, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 36, PW = 28, LIFT = 34, FAV = 2, BZ = 6, PH = 38, LIP = 16;
const X1 = (N - 1) * STEP + PW + 8, Y = 10;
const REST = [3, 0, LIFT * 0.6, 6];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -4, 0], [X1 + 4, 24, 0], [X1 + 4, -4, 0], [-4, 24, 0], [4, Y, BZ + PH + LIFT + 2], [X1 - 4, Y, BZ + PH + LIFT + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, X1 + 4, 24, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 4 + k * STEP, grp = mk("g", {}, g);
    const [kr, ki] = rings(x - 2, Y - 4, x + PW + 2, Y - 2.4, 0.8, 0.5);
    put(solid(grp), prism(P, front, kr, ki, BZ, BZ + LIP + 8));
    const paper = solid(grp), fold = mk("path", { class: "nf lo" }, grp);
    const [lr, li] = rings(x - 2, Y + 3.4, x + PW + 2, Y + 5, 0.8, 0.5);
    put(solid(grp), prism(P, front, lr, li, BZ, BZ + LIP));
    const [pr, pi] = rings(x, Y - 1.6, x + PW, Y + 2.6, 1, 0.7);
    items.push({ k, x, paper, fold, pr, pi, z: tween(REST[k]), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = BZ + 1 + lift, z1 = z0 + PH;
    put(it.paper, prism(P, front, it.pr, it.pi, z0, z1));
    const zm = z0 + PH * 0.62;
    it.fold.setAttribute("d", seg(P(it.x + 2, Y + 2.6, zm), P(it.x + PW - 2, Y + 2.6, zm)) + seg(P(it.x + 4, Y + 2.6, zm + 6), P(it.x + PW - 4, Y + 2.6, zm + 6)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + PW / 2, Y, BZ + PH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : dd === 1 ? 10 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.paper.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "paper " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "newspaperpress",
  means: "Four papers in the pockets of a rack: the paper under the pointer slides up out of its pocket, its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[124, 139], [225, 190], [276, 216], null],
  mount,
});
