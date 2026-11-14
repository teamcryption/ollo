/**
 * Shipping crates: three slatted crates of different heights in a row on a
 * pallet. The pointer picks a crate by where it stands: its lid lifts off,
 * and the crates beside it ease their lids a little, staggered from it. At
 * rest one lid sits ajar, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const D = 34, GAP = 6, LIFT = 20, FAV = 0, PZ = 5;
const CR = [[0, 30, 34], [36, 34, 26], [76, 28, 38]]; // [x0, width, height]
const X1 = 104;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-4, -4, 0], [X1 + 4, -4, 0], [X1 + 4, D + 4, 0], [-4, D + 4, 0], [0, 0, PZ + 34 + LIFT + 4], [X1, D, PZ + 38 + LIFT + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-4, -4, X1 + 4, D + 4, 2, 1);
  put(solid(g), prism(P, front, pr, pi, 0, PZ));

  const items = CR.map(([x0, w, h], k) => {
    const grp = mk("g", {}, g), x1 = x0 + w, z1 = PZ + h;
    const [br, bi] = rings(x0, 0, x1, D, 1.5, 1);
    put(solid(grp), prism(P, front, br, bi, PZ, z1));
    // slats on the two seen faces
    let d = "";
    for (let i = 1; i < 3; i++) {
      const z = PZ + (h * i) / 3;
      d += seg(P(x0 + 1, D, z), P(x1, D, z)) + seg(P(x1, 1, z), P(x1, D, z));
    }
    d += seg(P(x0 + 1, D, PZ + 1), P(x1 - 1, D, z1 - 1));
    mk("path", { d, class: "nf lo" }, grp);
    const lid = solid(grp);
    return { k, x0, x1, z1, lid, t: tween(k === FAV ? 0.45 : 0), last: NaN };
  });

  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const z = it.z1 + 1 + LIFT * t;
    const [lr, li] = rings(it.x0 - 1.5, -1.5, it.x1 + 1.5, D + 1.5, 2, 1.2);
    put(it.lid, prism(P, front, lr, li, z, z + 3));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, D / 2, PZ + (it.z1 - PZ) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? (k === FAV ? 0.45 : 0) : dd === 0 ? 1 : dd === 1 ? 0.2 : 0;
      tset(it.t, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "crate " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "crates3",
  means: "Three slatted shipping crates on a pallet: the crate under the pointer lifts its lid, its neighbours ease theirs.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[145, 156], [199, 183], [256, 212], null],
  mount,
});
