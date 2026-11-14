/**
 * Key bowl: a wide shallow bowl on a hallway table with three keys lying in
 * it. The pointer picks a key by where it lies: it lifts out of the bowl and
 * turns a little, its neighbours stir, staggered. At rest one key is half
 * raised and bright.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, hull, poly, proj, rings, ringAt, facing, prism, put, tdone, tset, tval, tween,
  disposer, mk, pointer, register, solid,
} = HL;

const T = 6, BH = 12, BR = 34, LIFT = 26, FAV = 2;
const KEYS = [[-16, -10, 30], [-2, 8, -40], [14, -6, 80]];
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-48, -48, 0], [48, 48, 0], [48, -48, 0], [-48, 48, 0], [0, 0, T + BH + LIFT + 14]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-42, -42, 42, 42, 8, 2);
  put(solid(g), prism(P, front, tr, ti, 0, T));
  mk("path", { class: "sil", d: poly(hull(ringAt(P, disc(0, 0, BR * 0.55, 48), T).concat(ringAt(P, disc(0, 0, BR, 48), T + BH)))) }, g);
  mk("path", { class: "lo", d: poly(ringAt(P, disc(0, 0, BR - 2, 48), T + BH)) }, g);

  const items = KEYS.map(([x, y, a], k) => {
    const grp = mk("g", {}, g);
    return { k, x, y, a, grp, blade: mk("path", { class: "nf" }, grp), head: mk("path", { class: "sil" }, grp), hole: mk("path", { class: "nf lo" }, grp), z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN };
  });

  function draw(it, l) {
    if (l === it.last) return;
    it.last = l;
    const z = T + 4 + l, a = ((it.a + l * 2.2) * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a);
    const tw = (u, v) => [it.x + u * ca - v * sa, it.y + u * sa + v * ca];
    const bl = [], tip = 3 + l * 0.35;
    for (const [u, v] of [[6, -2.4], [28, -2.4], [28, 2.4], [22, 3.8], [16, 2.4], [6, 2.4]]) { const [wx, wy] = tw(u, v); bl.push(P(wx, wy, z + (u / 28) * tip), P(wx, wy, z + 1.2 + (u / 28) * tip)); }
    it.blade.setAttribute("d", poly(hull(bl)));
    const h = disc(it.x, it.y, 9, 28);
    it.head.setAttribute("d", poly(hull(ringAt(P, h, z).concat(ringAt(P, h, z + 1.6)))));
    const [hx, hy] = tw(-4, 0);
    it.hole.setAttribute("d", poly(ringAt(P, disc(hx, hy, 2.4, 14), z + 1.6)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + 8, it.y, T + 4));
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
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.head.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    if (a >= 0) items[a].grp.parentNode.appendChild(items[a].grp);
    read.textContent = a < 0 ? "rest" : "key " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "jewellerytree",
  means: "A key bowl on a hallway table: the key under the pointer lifts out of the bowl and turns, and its neighbours stir.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[203, 152], [197, 178], [246, 180], null],
  mount,
});
