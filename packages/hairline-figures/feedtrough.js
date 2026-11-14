/**
 * Feed hopper: a row of four feed bins on a plinth, each with a hinged lid
 * along its back edge and a trough lip at its foot. The pointer picks a bin
 * by where it stands: its lid swings open, and the lids beside it crack a
 * little, staggered from it. At rest one lid stands half open, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, fillet, hull, poly, prism, proj, rings, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, BW = 26, STEP = 34, W = 30, H = 34, TD = 10, FAV = 1;
const X1 = (N - 1) * STEP + BW;
const REST = [8, 58, 3, 18];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-6, -6, 0], [X1 + 6, W + TD + 6, 0], [X1 + 6, -6, 0], [-6, W + TD + 6, 0], [0, -6, H + W + 4], [X1, -6, H + W + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-6, -6, X1 + 6, W + TD + 6, 5, 2);
  put(solid(g), prism(P, front, pr, pi, 0, 4));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, x1 = x0 + BW, grp = mk("g", {}, g);
    const [br, bi] = rings(x0, 0, x1, W, 3, 1.6);
    put(solid(grp), prism(P, front, br, bi, 4, 4 + H));
    const [tr, ti] = rings(x0 - 1, W - 2, x1 + 1, W + TD, 3, 1.6);
    put(solid(grp), prism(P, front, tr, ti, 4, 12));
    const lid = mk("path", { class: "sil" }, grp), cr = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x0, x1, lid, cr, a: tween(REST[k]), last: NaN });
  }

  function quad(x0, x1, a, off, inset) {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), L = W + 2, zt = 4 + H;
    const ny = -s * off, nz = c * off;
    const at = (x, t) => P(x, -1 + L * c * t + ny, zt + L * s * t + nz);
    const i = inset / L;
    return [at(x0 + inset, i), at(x1 - inset, i), at(x1 - inset, 1 - i), at(x0 + inset, 1 - i)];
  }
  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const lo = quad(it.x0 - 1, it.x1 + 1, a, 0, 0), hi = quad(it.x0 - 1, it.x1 + 1, a, 1.8, 0);
    const h = hull(lo.concat(hi));
    it.lid.setAttribute("d", poly(fillet(h, h.map(() => 2), 3)));
    const q = quad(it.x0 - 1, it.x1 + 1, a, 1.8, 2.2);
    it.cr.setAttribute("d", poly(fillet(q, [1.5, 1.5, 1.5, 1.5], 3)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, W / 2, 4 + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), to = a < 0 ? REST[k] : dd === 0 ? 96 : dd === 1 ? 22 : 4;
      tset(it.a, to, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.classList.toggle("hi", k === (a < 0 ? FAV : a));
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
  name: "feedtrough",
  means: "Four feed bins on a plinth: the lid of the bin under the pointer swings open, and its neighbours' lids crack a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[186, 171], [232, 194], [142, 150], null],
  mount,
});
