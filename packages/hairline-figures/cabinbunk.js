/**
 * Overhead bin: a cabin's luggage bin hung overhead, three doors along its
 * front, each hinged at its top edge with a bag inside. The pointer picks a
 * door by where it stands: that door swings up open, its neighbours crack
 * open after it, staggered. At rest one door is ajar, bright. The slider is
 * the stagger.
 */
const {
  Cam, fillet, fit, facing, hull, poly, prism, proj, rings, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, W = 40, L = N * W, D = 34, Z0 = 30, Z1 = 58, H = Z1 - Z0 - 2, FAV = 0, OPEN = 105, AJAR = 38;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[0, 0, Z0 - 4], [L, D, Z0 - 4], [L, 0, Z1], [0, D + H, Z1], [L, D + H, Z1]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [hr, hi] = rings(0, 0, L, D, 5, 2);
  put(solid(g), prism(P, front, hr, hi, Z0, Z1));
  const face = (x, z) => P(x, D, z);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * W + 2, x1 = (k + 1) * W - 2, grp = mk("g", {}, g);
    const hole = [face(x0 + 1, Z0 + 2), face(x1 - 1, Z0 + 2), face(x1 - 1, Z1 - 3), face(x0 + 1, Z1 - 3)];
    mk("path", { d: poly(fillet(hole, [3, 3, 3, 3])), class: "nf lo" }, grp);
    // the bag: a case on its side, with its handle
    const bx0 = x0 + 7, bx1 = x1 - 9, bz0 = Z0 + 3, bz1 = Z0 + 17;
    const bag2 = [face(bx0, bz0), face(bx1, bz0), face(bx1, bz1), face(bx0, bz1)];
    mk("path", { d: poly(fillet(bag2, [2, 2, 2, 2])), class: "nf" }, grp);
    const hm = (bx0 + bx1) / 2;
    mk("path", { d: poly(fillet([face(hm - 5, bz1), face(hm - 4, bz1 + 4), face(hm + 4, bz1 + 4), face(hm + 5, bz1)], [1, 1, 1, 1])), class: "nf lo" }, grp);
    const door = mk("path", { class: "sil" }, grp);
    items.push({ k, x0, x1, door, a: tween(k === FAV ? AJAR : 0), last: NaN });
  }

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a)), hz = Z1 - 1;
    const q = (t) => {
      const y = D + H * s + t * c, z = hz - H * c + t * s, yh = D + t, zh = hz;
      return [P(it.x0, yh, zh), P(it.x1, yh, zh), P(it.x1, y, z), P(it.x0, y, z)];
    };
    it.door.setAttribute("d", poly(hull(fillet(q(0), [2, 2, 2, 2]).concat(fillet(q(1.8), [2, 2, 2, 2])))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => face((it.x0 + it.x1) / 2, (Z0 + Z1) / 2));
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
      const dd = Math.abs(k - a), t = a < 0 ? (k === FAV ? AJAR : 0) : dd === 0 ? OPEN : dd === 1 ? 30 : 12;
      tset(it.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.door.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bin " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cabinbunk",
  means: "An overhead luggage bin with three doors: the door under the pointer swings up open on its hinge, its neighbours crack open after it.",
  rules: [1, 2, 5, 6],
  range: [0, 50, 100],
  tour: [[194, 153], [135, 123], [253, 182], null],
  mount,
});
