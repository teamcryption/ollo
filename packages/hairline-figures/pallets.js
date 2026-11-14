/**
 * Pallets: four wooden pallets in a row on a yard slab, each stacked with
 * bricks to a different height, the courses scored on the faces. The pointer
 * picks a pallet by where it stands: it rises as if on forks, and the pallets
 * beside it lift a little, staggered from it. At rest one pallet is raised,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, open, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 40, W = 30, DECK = 5, CO = 4, LIFT = 18, FAV = 2;
const HS = [5, 6, 4, 5];
const X1 = (N - 1) * STEP + W;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-6, -6, 0], [X1 + 6, W + 6, 0], [X1 + 6, -6, 0], [-6, W + 6, 0], [0, 0, DECK + 6 * CO + LIFT + 2], [X1, 0, DECK + 6 * CO + LIFT + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-6, -6, X1 + 6, W + 6, 5, 2);
  put(solid(g), prism(P, front, sr, si, 0, 2));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    const deck = solid(grp), slots = mk("path", { class: "nf lo" }, grp);
    const stack = solid(grp), courses = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, grp, deck, slots, stack, courses, h: HS[k] * CO, z: tween(k === FAV ? LIFT * 0.55 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const x0 = it.x, x1 = it.x + W, z0 = 2 + lift, zd = z0 + DECK;
    const [dr, di] = rings(x0, 0, x1, W, 1.5, 1);
    put(it.deck, prism(P, front, dr, di, z0, zd));
    // the fork slots: two dark openings on each near face of the deck
    let d = "";
    for (const f of [0.22, 0.62]) {
      const a = f * W, b = a + 0.16 * W;
      d += open([P(x0 + a, W, z0 + 1), P(x0 + a, W, zd - 1.2), P(x0 + b, W, zd - 1.2), P(x0 + b, W, z0 + 1)]);
      d += open([P(x1, a, z0 + 1), P(x1, a, zd - 1.2), P(x1, b, zd - 1.2), P(x1, b, z0 + 1)]);
    }
    it.slots.setAttribute("d", d);
    const [br, bi] = rings(x0 + 2, 2, x1 - 2, W - 2, 1.2, 1);
    put(it.stack, prism(P, front, br, bi, zd, zd + it.h));
    // courses, and the staggered joints between bricks
    let c = "";
    for (let i = 1; i * CO < it.h; i++) {
      const z = zd + i * CO;
      c += open([P(x0 + 2, W - 2, z), P(x1 - 2, W - 2, z), P(x1 - 2, 2, z)]);
    }
    for (let i = 0; i * CO < it.h; i++) {
      const z = zd + i * CO, o = i % 2 ? 0.5 : 0.25;
      for (const f of [o, o + 0.5].filter((v) => v < 0.95)) {
        const u = 2 + f * (W - 4);
        c += seg(P(x0 + u, W - 2, z), P(x0 + u, W - 2, z + CO)) + seg(P(x1 - 2, u, z), P(x1 - 2, u, z + CO));
      }
    }
    it.courses.setAttribute("d", c);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + W / 2, W / 2, DECK + it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.55 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.stack.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pallet " + (a + 1) + " · " + HS[a] + "c";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "pallets",
  means: "Brick-stacked pallets in a row: the pallet under the pointer rises as if on forks, its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 150], [228, 185], [272, 205], null],
  mount,
});
