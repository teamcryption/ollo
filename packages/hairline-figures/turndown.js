/**
 * Turndown: a pillow menu, four pillows of different lofts laid along a
 * hotel shelf. The pointer picks a pillow by where it stands: it lifts off
 * the shelf, offered, and its neighbours rise a little, staggered from it.
 * At rest one pillow is raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 40, W = 34, D = 30, LIFT = 20, FAV = 2, SZ = 5;
const LOFT = [9, 13, 11, 7];
const X1 = (N - 1) * STEP + W;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-6, -6, 0], [X1 + 6, D + 6, 0], [X1 + 6, -6, 0], [-6, D + 6, 0], [0, 0, SZ + 13 + LIFT], [X1, 0, SZ + 13 + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-6, -6, X1 + 6, D + 6, 4, 1.6);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g), s = solid(grp);
    const [ring, inner] = rings(x, 2, x + W, D - 2, 11, 3.2);
    // the piping seam round the pillow's middle
    const seam = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, s, ring, seam, h: LOFT[k], z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN, inner });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = SZ + lift;
    put(it.s, prism(P, front, it.ring, it.inner, z0, z0 + it.h));
    const pts = it.ring.filter(front).map((q) => P(q.u, q.v, z0 + it.h * 0.5));
    it.seam.setAttribute("d", "M" + pts.map((p) => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L"));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + W / 2, D / 2, SZ + it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pillow " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "turndown",
  means: "A pillow menu on a hotel shelf: the pillow under the pointer lifts off to be chosen, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[236, 174], [117, 119], [283, 243], null],
  mount,
});
