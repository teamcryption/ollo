/**
 * Cereal boxes: five tall boxes standing in a row on a pantry shelf, each
 * with a window panel on its face and a fold line on its top. The pointer
 * picks a box by where it stands: it slides forward off the row and rises a
 * little, and its neighbours ease out after it, staggered. At rest one box
 * stands pulled out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, fillet, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, BW = 24, GAP = 3, D = 11, OUT = 16, FAV = 2;
const H = [44, 54, 50, 58, 42], REST = [2, 0, 11, 3, 1];
const X1 = N * (BW + GAP) - GAP;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-6, -6, 0], [X1 + 6, -6, 0], [X1 + 6, D + OUT + 8, 0], [-6, D + OUT + 8, -6], [0, 0, 64], [X1, OUT, 64]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-6, -6, X1 + 6, D + OUT + 8, 3, 1.5);
  put(solid(g), prism(P, front, sr, si, -5, 0));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * (BW + GAP), s = solid(g);
    const pan = mk("path", { class: "nf lo" }, s.g), fold = mk("path", { class: "nf lo" }, s.g);
    items.push({ k, x, s, pan, fold, y: tween(REST[k]), last: NaN });
  }

  function draw(it, y) {
    if (y === it.last) return;
    it.last = y;
    const h = H[it.k], z0 = y * 0.25, z1 = z0 + h, x = it.x, yf = y + D;
    const [r, ri] = rings(x, y, x + BW, yf, 2, 1);
    put(it.s, prism(P, front, r, ri, z0, z1));
    it.pan.setAttribute("d", poly(fillet([P(x + 5, yf, z0 + 10), P(x + BW - 5, yf, z0 + 10), P(x + BW - 5, yf, z1 - 14), P(x + 5, yf, z1 - 14)], [3, 3, 3, 3])));
    it.fold.setAttribute("d", seg(P(x + 3, y + D / 2, z1), P(x + BW - 3, y + D / 2, z1)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.y, now)); if (!tdone(it.y, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + BW / 2, D / 2, H[it.k] / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 28 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), y = a < 0 ? REST[k] : dd === 0 ? OUT : dd === 1 ? 4 : 0;
      tset(it.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "box " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cerealboxes",
  means: "Five cereal boxes on a pantry shelf: the box under the pointer slides forward off the row, its neighbours easing after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 150], [210, 170], [260, 190], null],
  mount,
});
