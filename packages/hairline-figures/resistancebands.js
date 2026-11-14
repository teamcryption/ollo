/**
 * Resistance bands: four loop bands hanging from pegs on a gym wall board,
 * each a different weight, so each strap is a different thickness. The
 * pointer picks a band by where it hangs: it is pulled down and stretches
 * long and narrow, and the bands beside it give a little, staggered from it.
 * At rest one band is half stretched, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 34, X0 = 22, H = 112, ZH = 96, PEG = 2.6, BY = 4, PULL = 30, FAV = 2;
const X1 = X0 * 2 + (N - 1) * STEP;
const LEN = [46, 56, 40, 50], THK = [2.2, 3.4, 4.4, 2.8], HW = [9, 10, 11, 9.5];

function stadium(x, zt, zb, hw, n = 8) {
  const out = [];
  for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI; out.push([x + hw * Math.cos(a), zt - hw + hw * Math.sin(a)]); }
  for (let i = 0; i <= n; i++) { const a = Math.PI + (i / n) * Math.PI; out.push([x + hw * Math.cos(a), zb + hw + hw * Math.sin(a)]); }
  return out;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, -4, 0], [X1, 0, 0], [0, -4, H], [X1, 0, H], [X1, BY, ZH - 60 - PULL]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, -4, X1, 0, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // a rail the pegs are screwed into
  const [rr, ri] = rings(6, 0, X1 - 6, 2, 1, 0.6);
  put(solid(g), prism(P, front, rr, ri, ZH - 6, ZH + 6));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g);
    const band = mk("path", { class: "sil" }, grp);
    const pegPts = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2, px = x + PEG * Math.cos(a), pz = ZH + PEG * Math.sin(a);
      pegPts.push(P(px, 2, pz), P(px, BY + 5, pz));
    }
    mk("path", { d: poly(hull(pegPts)) }, grp);
    items.push({ k, x, band, s: tween(k === FAV ? PULL * 0.5 : 0), last: NaN });
  }

  function draw(it, s) {
    if (s === it.last) return;
    it.last = s;
    const t = THK[it.k], hw = HW[it.k] - s * 0.12;
    const zt = ZH + PEG + t, zb = ZH - LEN[it.k] - s;
    const pr = (q) => P(q[0], BY, q[1]);
    const outer = stadium(it.x, zt, zb, hw).map(pr);
    const inner = stadium(it.x, zt - t, zb + t, hw - t).map(pr).reverse();
    it.band.setAttribute("d", poly(outer) + " " + poly(inner));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.s, now)); if (!tdone(it.s, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, BY, ZH - LEN[it.k] / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), s = a < 0 ? (k === FAV ? PULL * 0.5 : 0) : dd === 0 ? PULL : dd === 1 ? 6 : 0;
      tset(it.s, s, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.band.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "band " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "resistancebands",
  means: "Four loop bands hang on a wall board: the band under the pointer is pulled down and stretches, and its neighbours give a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[121, 111], [163, 132], [262, 182], null],
  mount,
});
