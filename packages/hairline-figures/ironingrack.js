/**
 * Drying rack: a low frame on four legs with five rails, a cloth draped over
 * each rail, every cloth a different width and drop. The pointer picks a
 * rail by where it stands: its cloth lifts off the rail, and the cloths
 * beside it twitch up a little, staggered from it. At rest one cloth is half
 * lifted, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, hull, poly, prism, proj, rings, facing, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, GAP = 22, L = 90, RZ = 46, LIFT = 18, FAV = 2, X1 = (N + 1) * GAP;
const CLOTH = [[14, 70, 24], [8, 62, 32], [20, 76, 20], [12, 56, 28], [18, 72, 22]];

function mount({ stage, svg, read }, value) {
  let stag = value;
  const bag = disposer();
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [X1, L, 0], [X1, 0, 0], [0, L, 0], [GAP, 10, RZ + LIFT + 4], [X1 - GAP, L, RZ + LIFT + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, parent = g) => {
    const [r, i] = rings(x0, y0, x1, y1, Math.min(x1 - x0, y1 - y0) / 2.2, 0.5);
    put(solid(parent), prism(P, front, r, i, z0, z1));
  };
  // far legs and far end bar
  box(0, 0, 3, 3, 0, RZ); box(X1 - 3, 0, X1, 3, 0, RZ);
  box(0, 0, X1, 3, RZ, RZ + 3);
  box(0, L - 3, 3, L, 0, RZ);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = (k + 1) * GAP, grp = mk("g", {}, g);
    box(x - 1.2, 3, x + 1.2, L - 3, RZ + 0.5, RZ + 2.5, grp);
    const [y0, y1, drop] = CLOTH[k];
    const sil = mk("path", { class: "sil" }, grp), fold = mk("path", { class: "nf lo" }, grp);
    items.push({ x, y0, y1, drop, sil, fold, z: tween(k === FAV ? LIFT * 0.5 : 0), last: NaN });
  }
  box(X1 - 3, L - 3, X1, L, 0, RZ);
  box(0, L - 3, X1, L, RZ, RZ + 3);

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const top = RZ + 3 + lift, bot = top - it.drop, { x, y0, y1 } = it;
    const pts = [];
    for (const dx of [-2.5, 2.5]) for (const [y, z] of [[y0, top - 1.5], [y0 + 2, top], [y1 - 2, top], [y1, top - 1.5], [y1, bot + 2], [y1 - 2, bot], [y0 + 2, bot], [y0, bot + 2]]) pts.push(P(x + dx, y, z));
    it.sil.setAttribute("d", poly(hull(pts)));
    it.fold.setAttribute("d", poly([P(x + 2.5, y0 + 2, top - 1), P(x + 2.5, y1 - 2, top - 1)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, (it.y0 + it.y1) / 2, RZ - it.drop / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.5 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "rail " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "ironingrack",
  means: "A drying rack with a cloth on each rail: the cloth under the pointer lifts off its rail, and its neighbours twitch up a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[152, 132], [206, 159], [254, 189], null],
  mount,
});
