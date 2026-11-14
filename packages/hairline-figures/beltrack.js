/**
 * Belt rack: a floor stand with a rail, six belts of different lengths
 * hanging from it, each with its buckle at the foot. The pointer picks a
 * belt by where it stands: it slides up off the rail as if lifted from the
 * hook, the belts beside it rising a little, staggered from it. At rest one
 * belt is drawn half up, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, STEP = 17, X0 = 14, H = 92, RT = 4, LIFT = 30, FAV = 2;
const X1 = X0 * 2 + (N - 1) * STEP;
const LEN = [58, 70, 64, 76, 54, 68];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-8, -12, 0], [X1 + 8, 12, 0], [X1 + 8, -12, 0], [-8, 12, 0], [X0, 6, H + RT + LIFT + 2], [X1, 0, H + RT + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1, par) => { const [a, i] = rings(x0, y0, x1, y1, r, b); const s = solid(par); put(s, prism(P, front, a, i, z0, z1)); return s; };
  // feet and posts at both ends, the rail between
  box(-8, -12, 10, 12, 4, 1.5, 0, 3, g);
  box(X1 - 10, -12, X1 + 8, 12, 4, 1.5, 0, 3, g);
  box(-2, -2, 4, 2, 1.5, 0.6, 3, H + RT, g);
  box(-3, -2.5, X1 + 3, 2.5, 2.4, 0.8, H, H + RT, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g), s = solid(grp);
    const buckle = mk("path", { class: "nf" }, grp), prong = mk("path", { class: "nf lo" }, grp);
    const z0 = k === FAV ? LIFT * 0.6 : (k % 2) * 2;
    items.push({ k, x, s, buckle, prong, len: LEN[k], z: tween(z0), base: z0, last: NaN });
  }
  box(X1 - 4, -2, X1 + 2, 2, 1.5, 0.6, 3, H + RT, g);

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const top = H + RT + 1.2 + lift, bot = top - it.len;
    const [a, i] = rings(it.x - 4, 3, it.x + 4, 5, 1, 0.6);
    put(it.s, prism(P, front, a, i, bot, top));
    const y = 5.4, bz = bot + 3;
    it.buckle.setAttribute("d", poly([P(it.x - 5.5, y, bz), P(it.x + 5.5, y, bz), P(it.x + 5.5, y, bz + 8), P(it.x - 5.5, y, bz + 8)]));
    it.prong.setAttribute("d", seg(P(it.x, y + 0.4, bz + 1.5), P(it.x, y + 0.4, bz + 9)) + seg(P(it.x - 2, y + 0.4, bz + 14), P(it.x + 2, y + 0.4, bz + 14)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 4, H - it.len / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 18 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? it.base : dd === 0 ? LIFT : dd === 1 ? 10 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "belt " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "beltrack",
  means: "Belts hanging from a floor rack: the belt under the pointer slides up off the rail, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[142, 166], [206, 183], [248, 219], null],
  mount,
});
