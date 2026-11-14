/**
 * Troughs: three water troughs standing in a row on a yard slab. The pointer
 * picks a trough by where it stands: its water rises to the brim and the
 * troughs beside it fill a little, staggered from it. At rest the levels are
 * uneven and one surface is bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 36, W = 24, L = 64, H = 18, SZ = 3, FAV = 1, WALL = 2.4;
const REST = [3, 8, 2], FULL = H - 2.5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const X1 = (N - 1) * STEP + W;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-8, -8, 0], [X1 + 8, L + 8, 0], [X1 + 8, -8, 0], [-8, L + 8, 0], [0, 0, SZ + H], [X1, 0, SZ + H]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-8, -8, X1 + 8, L + 8, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, grp = mk("g", {}, g);
    const [outer, crease] = rings(x0, 0, x0 + W, L, 4, 1);
    const [, inner] = rings(x0, 0, x0 + W, L, 4, WALL);
    const z0 = SZ, z1 = SZ + H;
    const body = prism(P, front, outer, crease, z0, z1);
    mk("path", { d: body.sil }, grp);
    mk("path", { d: poly(ringAt(P, inner, z1)), class: "nf lo" }, grp);
    const water = mk("path", { class: "nf" }, grp);
    // the near wall covers the water's near edge
    const nearIn = ringAt(P, run(inner, front), z1), nearOut = ringAt(P, run(outer, front), z0).reverse();
    mk("path", { d: poly(nearIn.concat(nearOut)), class: "fo" }, grp);
    mk("path", { d: body.sil, class: "sil nf" }, grp);
    mk("path", { d: poly(ringAt(P, inner, z1)), class: "nf lo" }, grp);
    // the inlet: a short pipe with a valve on the far end
    const px = x0 + W / 2;
    mk("path", { d: poly([P(px - 2, -6, z1 + 4), P(px + 2, -6, z1 + 4), P(px + 2, 6, z1 + 4), P(px - 2, 6, z1 + 4)]), class: "nf lo" }, grp);
    items.push({ k, inner, water, z0, lvl: tween(REST[k]), last: NaN });
  }

  function draw(it, lv) {
    if (lv === it.last) return;
    it.last = lv;
    it.water.setAttribute("d", poly(ringAt(P, it.inner, it.z0 + lv)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.lvl, now)); if (!tdone(it.lvl, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it, k) => P(k * STEP + W / 2, L / 2, SZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), lv = a < 0 ? REST[k] : dd === 0 ? FULL : FULL - 4;
      tset(it.lvl, lv, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.water.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "trough " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "troughs",
  means: "Three water troughs in a yard: the trough under the pointer fills to the brim, and its neighbours fill a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[165, 136], [215, 176], [262, 200], null],
  mount,
});
