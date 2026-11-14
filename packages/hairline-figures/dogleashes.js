/**
 * Dog leashes: a wall board with five hooks, a leash hung on each by its
 * handle loop, strap and clasp hanging below. The pointer picks a leash by
 * where it stands: it lifts off its hook, ready for a walk, and its
 * neighbours sway a little, staggered from it. At rest one leash is lifted,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, open, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 30, HZ = 92, LIFT = 12, FAV = 3;
const X1 = (N + 1) * STEP;
const LEN = [38, 52, 30, 46, 40];
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, -6, 0], [X1, 0, 0], [X1, -6, HZ + 14], [0, -6, HZ + 14], [X1, 14, 0], [0, 14, HZ + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, -6, X1, 0, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, HZ + 14));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = STEP * (k + 1), grp = mk("g", {}, g);
    const [hr, hi] = rings(x - 2.5, 0, x + 2.5, 9, 2.4, 0.6);
    put(solid(grp), prism(P, front, hr, hi, HZ - 3, HZ + 2));
    const loop = mk("path", { class: "nf sil" }, grp), strap = mk("path", { class: "nf sil" }, grp);
    const clasp = solid(grp);
    items.push({ k, x, grp, loop, strap, clasp, z: tween(k === FAV ? LIFT : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const sway = (lift / LIFT) * 4, top = HZ + lift, y = 6, lp = [];
    for (let i = 0; i <= 24; i++) {
      const t = (i / 24) * Math.PI * 2;
      lp.push(P(it.x + 5.5 * Math.sin(t) + sway * (1 - Math.cos(t)) * 0.5, y, top - 11 + 11 * Math.cos(t)));
    }
    it.loop.setAttribute("d", poly(lp));
    const z0 = top - 22, z1 = z0 - LEN[it.k], sp = [];
    for (let i = 0; i <= 10; i++) { const s = i / 10; sp.push(P(it.x + sway * (1 + s * 1.5), y, lerpZ(z0, z1, s))); }
    it.strap.setAttribute("d", open(sp));
    const cx = it.x + sway * 2.5;
    put(it.clasp, prism(P, front, disc(cx, y, 3), disc(cx, y, 2.2), z1 - 9, z1));
  }
  const lerpZ = (a, b, s) => a + (b - a) * s;

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 6, HZ - 30));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT : 0) : dd === 0 ? LIFT : dd === 1 ? 3 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.loop.classList.toggle("hi", on); it.strap.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "leash " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "dogleashes",
  means: "Five leashes on wall hooks: the leash under the pointer lifts off its hook, and its neighbours sway a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[123, 116], [160, 135], [272, 191], null],
  mount,
});
