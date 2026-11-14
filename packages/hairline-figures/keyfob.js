/**
 * Key fobs: a key board standing on its foot, a peg for each of four fobs,
 * each fob hanging on its peg. The pointer picks a fob by where it stands:
 * it lifts off its peg, and the fobs beside it rise a little, staggered from
 * it. At rest one fob is half lifted, bright.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 34, LIFT = 20, FAV = 2, FZ = 12, FH = 26, PZ = 44;
const REST = [0, 3, LIFT * 0.6, 1];
const X1 = (N - 1) * STEP + 24;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-6, -10, 0], [X1 + 6, 16, 0], [X1 + 6, -10, 0], [-6, 16, 0], [-4, -3, 60], [X1 + 4, 2, 60]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  let [r, i] = rings(-6, -10, X1 + 6, 16, 5, 2);
  put(solid(g), prism(P, front, r, i, 0, 3));
  [r, i] = rings(-4, -3, X1 + 4, 2, 2.4, 1);
  put(solid(g), prism(P, front, r, i, 3, 58));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 12 + k * STEP, grp = mk("g", {}, g);
    [r, i] = rings(x - 1.8, 2, x + 1.8, 9, 1.2, 0.6);
    put(solid(grp), prism(P, front, r, i, PZ, PZ + 3.6));
    const fob = solid(grp), btn = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, fob, btn, z: tween(REST[k]), last: NaN });
  }
  const [fr, fi] = rings(-8, 3.5, 8, 9.5, 3, 1.4);
  const off = (ring, x) => ring.map((q) => ({ ...q, u: q.u + x }));

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = FZ + lift;
    put(it.fob, prism(P, front, off(fr, it.x), off(fi, it.x), z0, z0 + FH));
    // the button: a rounded square drawn on the fob's front face
    const pts = [[-3.5, 7], [3.5, 7], [3.5, 14], [-3.5, 14]].map(([dx, dz]) => P(it.x + dx, 9.5, z0 + dz));
    it.btn.setAttribute("d", "M" + pts.map((p) => p.join(",")).join("L") + "Z");
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 6, FZ + FH / 2));
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
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.fob.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "fob " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "keyfob",
  means: "Four key fobs on pegs along a key board: the fob under the pointer lifts off its peg, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[122, 137], [171, 161], [270, 211], null],
  mount,
});
