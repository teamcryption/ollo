/**
 * Vault drawers: a steel vault cabinet holding a column of four long
 * drawers, each with a pull bar. The pointer picks a drawer by its height:
 * it slides out of the cabinet, and the drawers beside it ease out a little,
 * staggered from it. At rest one drawer stands open a hand's width, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single column.
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, D = 44, W = 56, H = 19, GAP = 2, OUT = 34, BZ = 6, FAV = 2;
const REST = [0, 2, 12, 0];
const TOPZ = BZ + N * (H + GAP) + 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -4, 0], [D + OUT + 4, W + 4, 0], [-4, W + 4, 0], [D + OUT + 4, -4, 0], [0, 0, TOPZ], [D + OUT, W, TOPZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-4, -4, D + 6, W + 4, 4, 1.6);
  put(solid(g), prism(P, front, pr, pi, 0, BZ));
  const [cr, ci] = rings(0, 0, D, W, 3, 1.8);
  put(solid(g), prism(P, front, cr, ci, BZ, TOPZ));
  for (let k = 0; k < N; k++) {
    const z0 = BZ + 2 + k * (H + GAP);
    const a = P(D, 3, z0), b = P(D, W - 3, z0), c = P(D, W - 3, z0 + H), d = P(D, 3, z0 + H);
    mk("path", { d: "M" + a + "L" + b + "L" + c + "L" + d + "Z", class: "nf lo" }, g);
  }

  const items = [];
  for (let k = 0; k < N; k++) {
    const z0 = BZ + 2 + k * (H + GAP), grp = mk("g", {}, g), box = solid(grp);
    box.sil.classList.add("sil");
    const bar = mk("path", { class: "nf" }, grp);
    items.push({ k, z0, box, bar, x: tween(REST[k]), last: NaN });
  }

  function draw(it, x) {
    if (x === it.last) return;
    it.last = x;
    const [r, i] = rings(D - 1, 3, D + 2.4 + x, W - 3, 1.4, 1);
    put(it.box, prism(P, front, r, i, it.z0, it.z0 + H));
    const hx = D + 2.4 + x, zc = it.z0 + H / 2;
    it.bar.setAttribute("d", seg(P(hx, W / 2 - 9, zc), P(hx + 2.6, W / 2 - 9, zc)) + seg(P(hx + 2.6, W / 2 - 9, zc), P(hx + 2.6, W / 2 + 9, zc)) + seg(P(hx + 2.6, W / 2 + 9, zc), P(hx, W / 2 + 9, zc)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.x, now)); if (!tdone(it.x, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(D, W / 2, it.z0 + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][0] - sx) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), x = a < 0 ? REST[k] : dd === 0 ? OUT : dd === 1 ? 5 : 0;
      tset(it.x, x, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.box.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "row " + (N - a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "safedeposit2",
  means: "A vault cabinet of four long drawers: the drawer at the pointer's height slides out, and the drawers beside it ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[210, 110], [210, 179], [210, 221], null],
  mount,
});
