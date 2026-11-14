/**
 * Paper reams: five wrapped reams stacked a little unevenly. The pointer
 * picks a ream by its height in the stack: it slides out toward the viewer,
 * and the reams beside it shift a little, staggered from it. At rest one
 * ream sits pulled half out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single column (riffle, stacked).
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, W = 62, D = 44, H = 10, PULL = 26, FAV = 3;
const JIT = [0, 3, -2, 2, -3];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-6, -6, 0], [W + PULL + 6, -6, 0], [-6, D + 6, 0], [W + PULL + 6, D + 6, 0], [0, 0, N * H + 2], [W + PULL, D, N * H + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // a thin pallet board under the stack
  const [br, bi] = rings(-6, -6, W + 8, D + 6, 4, 1.4);
  const board = solid(g);
  put(board, prism(P, front, br, bi, 0, 2));
  board.cr.setAttribute("class", "lo nf");

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), s = solid(grp);
    const band = mk("path", { class: "nf lo" }, grp);
    const z0 = 2 + k * H;
    items.push({ k, z0, grp, s, band, x: tween(JIT[k] + (k === FAV ? PULL * 0.6 : 0)), last: NaN });
  }

  function draw(it, dx) {
    if (dx === it.last) return;
    it.last = dx;
    const z0 = it.z0, z1 = z0 + H - 0.6;
    const [a, i] = rings(dx, 0, dx + W, D, 2.4, 1.2);
    put(it.s, prism(P, front, a, i, z0, z1));
    // the wrapper's end fold, a seam round the near faces
    const zm = z0 + H * 0.5;
    it.band.setAttribute("d", seg(P(dx + W, 3, zm), P(dx + W, D - 2.4, zm)) + seg(P(dx + W - 2.4, D, zm), P(dx + 8, D, zm)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.x, now)); if (!tdone(it.x, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(W / 2 + JIT[it.k], D / 2, it.z0 + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 14 && Math.abs(mids[best][0] - sx) < 110 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a);
      const x = a < 0 ? (k === FAV ? PULL * 0.6 : 0) : dd === 0 ? PULL : dd === 1 ? 5 : 0;
      tset(it.x, JIT[k] + x, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "ream " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "paperstack",
  means: "A stack of five paper reams: the ream under the pointer slides out of the stack, and the ones beside it shift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[182, 116], [182, 151], [182, 185], null],
  mount,
});
