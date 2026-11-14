/**
 * Snowboards: four boards standing in a floor rack, tails in the slotted
 * base, noses against a rail. The pointer picks a board by where it stands:
 * it slides up out of its slot and its neighbours rise a little, staggered
 * from it. At rest one board stands half drawn, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 24, W = 30, L = 118, T = 3, CZ = 8, LIFT = 30, FAV = 2;
const X0 = 8, X1 = X0 + (N - 1) * STEP + T;
const REST = [4, 0, LIFT * 0.6, 7];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-4, -10, 0], [X1 + 8, W + 8, 0], [X1 + 8, -10, 0], [-4, W + 8, 0], [X0, W, CZ + L + LIFT], [X1, -6, CZ + L + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the rack: two posts and a rail behind, then the slotted base
  const RZ = CZ + L * 0.72;
  for (const px of [-2, X1 + 2]) {
    const [r, i] = rings(px - 3, -10, px + 3, -4, 2, 1);
    put(solid(g), prism(P, front, r, i, 0, RZ + 4));
  }
  const [rr, ri] = rings(-4, -10, X1 + 4, -4, 2, 1);
  const rail = solid(g);
  put(rail, { sil: poly(hull(rr.map((q) => P(q.u, q.v, RZ)).concat(rr.map((q) => P(q.u, q.v, RZ + 6))))), crease: "" });
  const [br, bi] = rings(-4, -4, X1 + 8, W + 8, 4, 2);
  put(solid(g), prism(P, front, br, bi, 0, CZ));

  const outline = rrect(0, 0, W, L, 14, 8);
  const strap = (v) => rrect(5, v, W - 5, v + 9, 3, 3);
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g);
    const slot = mk("path", { class: "lo nf" }, grp);
    slot.setAttribute("d", poly([P(x - 1, 2, CZ), P(x + T + 1, 2, CZ), P(x + T + 1, W - 2, CZ), P(x - 1, W - 2, CZ)]));
    const sil = mk("path", { class: "sil" }, grp), face = mk("path", { class: "nf lo" }, grp);
    const b1 = mk("path", { class: "nf lo" }, grp), b2 = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, sil, face, b1, b2, z: tween(k === FAV ? REST[k] : REST[k]), last: NaN });
  }

  function at(x, ring, z0) { return ring.map((q) => P(x, q.u, z0 + q.v)); }
  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = CZ - 6 + lift;
    it.sil.setAttribute("d", poly(hull(at(it.x, outline, z0).concat(at(it.x + T, outline, z0)))));
    it.face.setAttribute("d", poly(at(it.x + T, rrect(2, 2, W - 2, L - 2, 12, 8), z0)));
    it.b1.setAttribute("d", poly(at(it.x + T, strap(L * 0.3), z0)));
    it.b2.setAttribute("d", poly(at(it.x + T, strap(L * 0.62), z0)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + T / 2, W / 2, CZ + L / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 110 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "board " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "snowboards",
  means: "Four snowboards in a floor rack: the board under the pointer slides up out of its slot, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[158, 115], [213, 142], [244, 157], null],
  mount,
});
