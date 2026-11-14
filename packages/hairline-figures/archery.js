/**
 * Bow rack: five recurve bows hanging on a rack's crossbar, strings in. The
 * pointer picks a bow by where it hangs: it lifts off its pegs, and the bows
 * beside it rise a little, staggered from it. At rest one bow is raised,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 22, X0 = 14, BZ = 20, LIFT = 24, FAV = 3;
const SIZE = [46, 52, 44, 54, 48];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  const XE = X0 * 2 + (N - 1) * STEP;
  fit(C, [[-4, -14, 0], [XE + 4, 14, 0], [XE + 4, -14, 0], [-4, 14, 0], [0, 0, BZ + 60 + LIFT], [XE, 0, BZ + 60 + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -14, XE + 4, 14, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  const TOP = 86;
  for (const x of [2, XE - 6]) { const [r, i] = rings(x, -3, x + 4, 3, 1.6, 0.8); put(solid(g), prism(P, front, r, i, 4, TOP)); }
  const [cr, ci] = rings(-2, -2.5, XE + 2, 2.5, 2, 0.8);
  put(solid(g), prism(P, front, cr, ci, TOP, TOP + 5));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g);
    const limb = mk("path", { class: "sil" }, grp), grip = mk("path", { class: "nf lo" }, grp), str = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, h: SIZE[k], grp, limb, grip, str, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  // a recurve bow in the plane x = const: its belly bulges toward +y, tips curl back
  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const L = it.h, zc = TOP - 6 - L * 0.55 + lift, D = 9, M = 24, outer = [], inner = [];
    for (let i = 0; i <= M; i++) {
      const t = -1 + (2 * i) / M, curl = Math.pow(Math.abs(t), 6) * 3.5;
      const y = D * (1 - t * t) - curl, w = 1.2 + 1.8 * (1 - t * t);
      outer.push(P(it.x, y + w / 2, zc + t * L * 0.5));
      inner.push(P(it.x, y - w / 2, zc + t * L * 0.5));
    }
    it.limb.setAttribute("d", poly(outer.concat(inner.reverse())));
    const g0 = P(it.x, D + 2.4, zc - 4), g1 = P(it.x, D + 2.4, zc + 4), g2 = P(it.x, D - 1.5, zc + 4), g3 = P(it.x, D - 1.5, zc - 4);
    it.grip.setAttribute("d", poly([g0, g1, g2, g3]));
    it.str.setAttribute("d", seg(P(it.x, -3.5 + 0.6, zc - L * 0.5), P(it.x, -3.5 + 0.6, zc + L * 0.5)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 4, TOP - 6 - it.h * 0.55));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : d === 0 ? LIFT : d === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.limb.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bow " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "archery",
  means: "Five recurve bows hanging on a rack: the bow under the pointer lifts off its pegs, and the bows beside it rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[168, 149], [222, 176], [249, 190], null],
  mount,
});
