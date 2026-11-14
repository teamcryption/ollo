/**
 * Bangles: a jewellery stand, a rod between two posts on a slab, with five
 * bangles of different sizes hanging from it. The pointer picks a bangle by
 * where it stands: it swings out on the rod, and the bangles beside it swing
 * a little, staggered from it. At rest one bangle hangs swung out, bright,
 * and the others hang unevenly. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, poly, prism, proj, rad, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 12, X = (N + 1) * STEP, RZ = 36, FAV = 2;
const RAD = [11, 12.5, 10, 12, 11.5], REST = [-5, 4, 26, 2, -3];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.2);
  fit(C, [[-6, -18, 0], [X + 6, 18, 0], [X + 6, -18, 0], [-6, 18, 0], [-6, 0, RZ + 3], [X + 6, 0, RZ + 3], [X / 2, 14, RZ - 2], [X / 2, -14, RZ - 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -18, X + 6, 18, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  for (const x of [-1, X + 1]) { const [pr, pi] = rings(x - 1.6, -1.6, x + 1.6, 1.6, 0.6, 0.5); put(solid(g), prism(P, front, pr, pi, 4, RZ + 2)); }
  const [rr, ri] = rings(-2, -0.8, X + 2, 0.8, 0.4, 0.3);
  put(solid(g), prism(P, front, rr, ri, RZ - 0.8, RZ + 0.8));
  const items = [];
  for (let k = 0; k < N; k++) items.push({ k, x: (k + 1) * STEP, R: RAD[k], el: mk("path", { class: "sil" }, g), a: tween(REST[k]), last: NaN });

  function draw(now) {
    for (const it of items) {
      const f = tval(it.a, now);
      if (f === it.last) continue;
      it.last = f;
      const p = rad(f), cy = (it.R - 1) * Math.sin(p), cz = RZ - (it.R - 1) * Math.cos(p);
      const outer = [], inner = [];
      for (let i = 0; i < 40; i++) {
        const t = (i / 40) * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t);
        outer.push(P(it.x, cy + it.R * c, cz + it.R * s));
        inner.push(P(it.x, cy + (it.R - 2.2) * c, cz + (it.R - 2.2) * s));
      }
      it.el.setAttribute("d", poly(outer) + poly(inner.reverse()));
    }
  }

  const B = register(stage, (_dt, now) => { draw(now); return items.some((it) => !tdone(it.a, now)); });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, RZ - it.R));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), f = a < 0 ? REST[k] : dd === 0 ? 40 : dd === 1 ? 14 : 4;
      tset(it.a, f, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.el.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bangle " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "bracelets",
  means: "Bangles hanging from a jewellery stand's rod: the bangle under the pointer swings out, and the bangles beside it swing a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[227, 153], [146, 115], [254, 170], null],
  mount,
});
