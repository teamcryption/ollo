/**
 * Bus shelter: a back wall, an end panel and a flat canopy on two posts,
 * with a row of four tip-up seats on a rail along the wall. The pointer
 * picks a seat by where it stands: it folds down, and the seats beside it
 * tip part way, staggered from it. At rest the seats stand folded at uneven
 * angles and one is down, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row, each turning on a hinge.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, X0 = 10, W = 22, GAP = 4, HY = 12, HZ = 22, D = 14, TOP = 64, SZ = 4, REST = [80, 66, 88, 6], FAV = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-2, -2, 0], [122, 42, 0], [122, -2, 0], [-2, 42, 0], [0, 0, TOP + 3], [120, 34, TOP + 3]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const slab = (x0, y0, x1, y1, z0, z1, r = 2, b = 1) => { const [a, i] = rings(x0, y0, x1, y1, r, b); const s = solid(g); put(s, prism(P, front, a, i, z0, z1)); return s; };
  slab(-2, -2, 122, 42, 0, SZ, 6, 2);
  slab(2, 4, 118, 7, SZ, TOP, 1.2, 0.6);
  slab(2, 7, 5, 32, SZ, TOP, 1.2, 0.6);
  slab(6, 7, 114, 10, HZ - 3, HZ, 1, 0.5);

  const box = (pts) => poly(hull(pts.map((p) => P(...p))));
  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = X0 + k * (W + GAP), x1 = x0 + W, grp = mk("g", {}, g);
    // the bracket under the hinge
    const br = mk("path", { d: box([[x0 + W / 2 - 1, 7, HZ - 9], [x0 + W / 2 + 1, 7, HZ - 9], [x0 + W / 2 - 1, HY, HZ - 3], [x0 + W / 2 + 1, HY, HZ - 3], [x0 + W / 2 - 1, 7, HZ - 3], [x0 + W / 2 + 1, 7, HZ - 3]]) }, grp);
    const seat = mk("path", { class: "sil" }, grp), lip = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x0, x1, grp, br, seat, lip, a: tween(REST[k]), last: NaN });
  }
  slab(115, 30, 119, 34, SZ, TOP, 1.4, 0.7);
  slab(-2, -2, 122, 36, TOP, TOP + 3, 3, 1.4);

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const c = Math.cos(rad(deg)), s = Math.sin(rad(deg));
    const at = (x, d, t) => [x, HY + d * c - t * s, HZ + d * s + t * c];
    const pts = [];
    for (const x of [it.x0, it.x1]) for (const d of [0, D]) for (const t of [0, 2]) pts.push(at(x, d, t));
    it.seat.setAttribute("d", box(pts));
    it.lip.setAttribute("d", "M" + P(...at(it.x0 + 1, D - 1.5, 2)).join(" ") + "L" + P(...at(it.x1 - 1, D - 1.5, 2)).join(" "));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, HY + D / 2, HZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), to = a < 0 ? REST[k] : d === 0 ? 0 : d === 1 ? 52 : 86;
      tset(it.a, to, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.seat.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "seat " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "busstop2",
  means: "A bus shelter with tip-up seats: the seat under the pointer folds down, and the seats beside it tip part way.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[134, 149], [169, 167], [239, 202], null],
  mount,
});
