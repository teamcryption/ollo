/**
 * Ink rollers: three brayers resting on an inking slab, each a long roller
 * with a grip on its near end. The pointer picks a roller by where it
 * stands: it lifts off the slab, and the rollers beside it rise a little,
 * staggered from it. At rest the middle roller is raised, bright. The slider
 * is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 30, R = 10, L0 = 4, L1 = 56, G0 = 60, G1 = 76, GR = 4, LIFT = 24, FAV = 1, SZ = 5;
const X1 = (N - 1) * STEP + 2 * R + 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-6, -6, 0], [X1 + 6, G1 + 2, 0], [X1 + 6, -6, 0], [-6, G1 + 2, 0], [R, 30, SZ + 2 * R + LIFT], [X1 - R, 30, SZ + 2 * R + LIFT]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-6, -6, X1 + 6, L1 + 6, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));
  // a rolled-out patch of ink on the slab
  mk("path", { d: poly([[6, 10], [X1 - 6, 10], [X1 - 6, L1 - 8], [6, L1 - 8]].map(([x, y]) => P(x, y, SZ))), class: "nf lo" }, g);

  const disc = (x, y, z, r, n = 24) => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI; return P(x + r * Math.cos(t), y, z + r * Math.sin(t)); });
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + 4 + k * STEP, grp = mk("g", {}, g);
    const body = mk("path", { class: "sil" }, grp), cap = mk("path", { class: "nf lo" }, grp);
    const stem = mk("path", { class: "nf" }, grp), grip = mk("path", {}, grp), end = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, body, cap, stem, grip, end, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const cz = SZ + R + lift;
    it.body.setAttribute("d", poly(hull(disc(it.x, L0, cz, R).concat(disc(it.x, L1, cz, R)))));
    it.cap.setAttribute("d", poly(disc(it.x, L1 - 1.5, cz, R - 1.5)));
    it.stem.setAttribute("d", seg(P(it.x, L1, cz), P(it.x, G0, cz)));
    it.grip.setAttribute("d", poly(hull(disc(it.x, G0, cz, GR, 16).concat(disc(it.x, G1, cz, GR, 16)))));
    it.end.setAttribute("d", open(disc(it.x, G1 - 1, cz, GR - 1, 16).concat([disc(it.x, G1 - 1, cz, GR - 1, 16)[0]])));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 30, SZ + R));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "roller " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "printrollers",
  means: "Three ink rollers on an inking slab: the roller under the pointer lifts off the ink, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[252,183],[165,140],[209,162], null],
  mount,
});
