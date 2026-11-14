/**
 * Sandbags: a flood wall of two courses of filled bags in running bond, a
 * fold across each bag's tied end. The pointer picks a top-course bag by
 * where it stands: that bag lifts off the wall as if being hauled, and its
 * neighbours lift a little, staggered from it. At rest one bag is half
 * raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, open, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 20, L = 34, H = 10, GAP = 1.2, LIFT = 22, FAV = 2;
const NB = 5, NT = 4, X1 = NB * (W + GAP);
const REST = [1.5, 0, 0, 3];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.65);
  fit(C, [[-4, -4, 0], [X1 + 4, L + 4, 0], [X1 + 4, -4, 0], [-4, L + 4, 0], [W, L / 2, 2 * H + LIFT + 4], [X1 - W, L / 2, 2 * H + LIFT + 4]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  function sack(parent, x, z) {
    const [r, i] = rings(x, 1, x + W, L - 1, 8, 1.8);
    const s = solid(parent);
    put(s, prism(P, front, r, i, z, z + H));
    return s;
  }
  // bottom course: fixed, slightly uneven in depth
  for (let k = 0; k < NB; k++) {
    const x = k * (W + GAP), grp = mk("g", {}, g);
    sack(grp, x, 0);
    mk("path", { d: open([P(x + 4, L - 7, H), P(x + W - 4, L - 7, H)]), class: "nf lo" }, grp);
  }
  // top course: the bags that lift
  const items = [];
  for (let k = 0; k < NT; k++) {
    const x = (W + GAP) / 2 + k * (W + GAP), grp = mk("g", {}, g);
    const s = solid(grp), fold = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, s, fold, z: tween(k === FAV ? LIFT * 0.5 : REST[k]), last: NaN });
  }
  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const [r, i] = rings(it.x, 1, it.x + W, L - 1, 8, 1.8), z = H + lift;
    put(it.s, prism(P, front, r, i, z, z + H));
    it.fold.setAttribute("d", open([P(it.x + 4, L - 7, z + H), P(it.x + W - 4, L - 7, z + H)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + W / 2, L / 2, H));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.5 : REST[k]) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bag " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "sandbags",
  means: "Two courses of sandbags in a flood wall: the top bag under the pointer lifts off the wall, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[122, 120], [232, 150], [270, 185], null],
  mount,
});
