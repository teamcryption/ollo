/**
 * Seed trays: three nursery trays in a row on a bench, each with a grid of
 * cells and a seedling in every cell. The pointer picks a tray by where it
 * stands: it lifts off the bench, and the trays beside it lift a little,
 * staggered from it. At rest one tray is raised, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween, seg, poly, fillet,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, TW = 30, TD = 46, GAP = 6, BZ = 4, TH = 6, LIFT = 18, FAV = 0, CX = 2, CY = 3;
const X1 = N * TW + (N - 1) * GAP;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-6, -6, 0], [X1 + 6, TD + 6, 0], [X1 + 6, -6, 0], [-6, TD + 6, 0], [0, 0, BZ + TH + LIFT + 9], [X1, 0, BZ + TH + LIFT + 9]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -6, X1 + 6, TD + 6, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * (TW + GAP), grp = mk("g", {}, g);
    const tray = solid(grp), grid = mk("path", { class: "nf lo" }, grp), sprouts = mk("path", { class: "nf" }, grp);
    const leaves = mk("path", { class: "nf" }, grp);
    items.push({ k, x0, tray, grid, sprouts, leaves, z: tween(k === FAV ? LIFT * 0.8 : 0), last: NaN });
  }
  const [tr, ti] = rings(0, 0, TW, TD, 3, 1.6);

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = BZ + lift, z1 = z0 + TH, x0 = it.x0;
    const ring = tr.map((q) => ({ ...q, u: q.u + x0 })), inner = ti.map((q) => ({ ...q, u: q.u + x0 }));
    put(it.tray, prism(P, front, ring, inner, z0, z1));
    let d = "", s = "", l = "";
    for (let i = 1; i < CX; i++) { const x = x0 + (i * TW) / CX; d += seg(P(x, 2, z1), P(x, TD - 2, z1)); }
    for (let j = 1; j < CY; j++) { const y = (j * TD) / CY; d += seg(P(x0 + 2, y, z1), P(x0 + TW - 2, y, z1)); }
    for (let i = 0; i < CX; i++) for (let j = 0; j < CY; j++) {
      const x = x0 + ((i + 0.5) * TW) / CX, y = ((j + 0.5) * TD) / CY, h = 7 + ((i + j * 2 + it.k) % 3) * 1.5;
      s += seg(P(x, y, z1), P(x, y, z1 + h));
      const a = P(x, y, z1 + h);
      const leaf = fillet([a, P(x + 5, y - 2, z1 + h + 3), P(x + 2, y, z1 + h + 1)], [0.5, 2, 1], 3);
      const leaf2 = fillet([a, P(x - 2, y + 5, z1 + h + 3), P(x, y + 2, z1 + h + 1)], [0.5, 2, 1], 3);
      l += poly(leaf) + poly(leaf2);
    }
    it.grid.setAttribute("d", d);
    it.sprouts.setAttribute("d", s);
    it.leaves.setAttribute("d", l);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + TW / 2, TD / 2, BZ + TH));
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
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.8 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.tray.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tray " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "seedtrays",
  means: "Three seed trays of seedlings on a bench: the tray under the pointer lifts off, its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 150], [200, 170], [250, 190], null],
  mount,
});
