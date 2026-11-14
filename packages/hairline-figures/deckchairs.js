/**
 * Deck chairs: four loungers in a row on a deck, each a padded seat with a
 * backrest hinged at its head. The pointer picks a chair by where it stands:
 * its backrest swings up to sit, and the chairs beside it lift theirs a
 * little, staggered from it. At rest the backs lie at uneven angles and one
 * is bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, fillet, hull, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 27, W = 18, DEPTH = 34, L = 26, T = 1.8, CZ = 4, SZ = 9, FAV = 1;
const X1 = (N - 1) * STEP + W;
const REST = [62, 48, 70, 56], UP = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  const top = CZ + SZ;
  fit(C, [[-6, -14, 0], [X1 + 6, DEPTH + 6, 0], [X1 + 6, -14, 0], [-6, DEPTH + 6, 0], [0, 2, top + L], [X1, 2, top + L]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-6, -14, X1 + 6, DEPTH + 6, 6, 2);
  put(solid(g), prism(P, front, dr, di, 0, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, x1 = x0 + W, grp = mk("g", {}, g);
    const back = mk("path", { class: "sil" }, grp);
    const [sr, si] = rings(x0, 0, x1, DEPTH, 3, 1.5);
    put(solid(grp), prism(P, front, sr, si, CZ, top));
    mk("path", { d: seg(P(x0 + 2, 7, top), P(x1 - 2, 7, top)), class: "nf lo" }, grp);
    items.push({ k, x0, x1, back, a: tween(REST[k]), last: NaN });
  }

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const s = Math.sin(rad(deg)), c = Math.cos(rad(deg)), pts = [];
    for (const x of [it.x0 + 1, it.x1 - 1]) for (const l of [0, L]) for (const t of [0, T]) {
      pts.push(P(x, 2 - l * s - t * c, top + l * c - t * s + 0.5));
    }
    const h = hull(pts);
    it.back.setAttribute("d", poly(fillet(h, h.map(() => 1.6))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, DEPTH / 2, top));
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
      const dd = Math.abs(k - a), deg = a < 0 ? REST[k] : dd === 0 ? UP : dd === 1 ? REST[k] - 14 : REST[k];
      tset(it.a, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.back.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "chair " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "deckchairs",
  means: "Four loungers on a deck: the backrest under the pointer swings up to sit, and its neighbours lift theirs a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[135, 145], [214, 184], [253, 204], null],
  mount,
});
