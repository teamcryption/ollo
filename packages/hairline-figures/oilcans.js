/**
 * Oil cans: four round cans of motor oil of different heights on a garage
 * shelf, each with a seam near its top, a screw cap and a slanted spout. The
 * pointer picks a can by where it stands: it lifts off the shelf, and the
 * cans beside it rise a little, staggered from it. At rest one can is
 * raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = [30, 40, 26, 35], N = 4, STEP = 34, R = 12, SZ = 5, LIFT = 20, FAV = 1;
const X1 = (N - 1) * STEP + 2 * R;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-6, -6, 0], [X1 + 6, 2 * R + 6, 0], [X1 + 6, -6, 0], [-6, 2 * R + 6, 0], [R + STEP, R, SZ + 40 + LIFT + 6], [X1 - R + 10, R, SZ + 35 + 14]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-6, -6, X1 + 6, 2 * R + 6, 5, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R, grp = mk("g", {}, g);
    const spout = mk("path", { class: "nf" }, grp), body = solid(grp), seam = mk("path", { class: "nf lo" }, grp), cap = solid(grp);
    items.push({ k, x, y, h: H[k], spout, body, seam, cap, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = SZ + lift, top = z0 + it.h, { x, y } = it;
    it.spout.setAttribute("d", poly(hull(ringAt(P, disc(x + 5, y - 3, 2.2, 12), top).concat(ringAt(P, disc(x + 13, y - 3, 1.3, 12), top + 11)))));
    put(it.body, prism(P, front, disc(x, y, R), disc(x, y, R - 2), z0, top));
    it.seam.setAttribute("d", open(ringAt(P, run(disc(x, y, R), front), top - 4)));
    put(it.cap, prism(P, front, disc(x - 4, y + 3, 3.4, 20), disc(x - 4, y + 3, 2.4, 20), top, top + 3.5));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, SZ + it.h / 2));
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
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "can " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "oilcans",
  means: "Four oil cans of different heights on a shelf: the can under the pointer lifts off, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[128, 134], [224, 182], [272, 206], null],
  mount,
});
