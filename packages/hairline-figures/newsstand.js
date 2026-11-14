/**
 * Newsstand: a kiosk counter with a back rack and a row of magazines standing
 * on it, a bundle of papers lying in front. The pointer picks a magazine by
 * where it stands: it slides up out of the row, and its neighbours rise a
 * little, staggered from it. At rest one magazine is half drawn, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 25, W = 21, MH = 30, LIFT = 20, FAV = 2, CZ = 26, MY = 6;
const X1 = (N - 1) * STEP + W + 8;
const REST = [4, 9, 12, 2, 7];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-4, -10, 0], [X1, 30, 0], [X1, -10, 0], [-4, 30, 0], [-4, -10, CZ + MH + LIFT + 4], [X1, -10, CZ + MH + LIFT + 4]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // counter, then the rack behind the row
  const [cr, ci] = rings(-4, -10, X1, 30, 5, 2);
  put(solid(g), prism(P, front, cr, ci, 0, CZ));
  const [br, bi] = rings(-4, -10, X1, -5, 2, 0.8);
  put(solid(g), prism(P, front, br, bi, CZ, CZ + MH - 4));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 4 + k * STEP, grp = mk("g", {}, g), s = solid(grp);
    const [r, i] = rings(x, MY, x + W, MY + 3, 1.4, 0.6);
    // the cover's spine fold: one dim mark down its face
    const fold = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, s, r, i, fold, z: tween(REST[k]), last: NaN });
  }
  // a tied bundle of papers in front of the row
  const pg = mk("g", {}, g);
  const [pr, pi] = rings(36, 15, 84, 27, 2, 1);
  put(solid(pg), prism(P, front, pr, pi, CZ, CZ + 6));
  const tie = mk("path", { class: "nf lo" }, pg);
  tie.setAttribute("d", "M" + P(60, 27, CZ).join(",") + "L" + P(60, 27, CZ + 6).join(",") + "L" + P(60, 15, CZ + 6).join(","));

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    put(it.s, prism(P, front, it.r, it.i, CZ + lift, CZ + MH + lift));
    const a = P(it.x + 3, MY + 3, CZ + lift + 3), b = P(it.x + 3, MY + 3, CZ + MH + lift - 3);
    it.fold.setAttribute("d", "M" + a.join(",") + "L" + b.join(","));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + W / 2, MY, CZ + MH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 55 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : dd === 1 ? REST[k] * 0.4 + 3 : REST[k] * 0.3;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "mag " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "newsstand",
  means: "A kiosk counter lined with magazines: the one under the pointer slides up out of the row, its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[152, 139], [205, 148], [258, 160], null],
  mount,
});
