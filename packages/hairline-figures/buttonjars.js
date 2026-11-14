/**
 * Button tins: four round tins of different heights along a sewing table,
 * each full of buttons under a lid. The pointer picks a tin by where it
 * stands: its lid lifts off to show the buttons, the lids beside it easing
 * up a little, staggered from it. At rest one lid sits ajar, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 38, R = 16, LIFT = 26, FAV = 2, TZ = 4;
const HS = [22, 30, 18, 26];
const X1 = (N - 1) * STEP + 2 * R;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-6, -6, 0], [X1 + 6, 2 * R + 6, 0], [X1 + 6, -6, 0], [-6, 2 * R + 6, 0], [R + STEP, R, TZ + 30 + LIFT + 6], [X1 - R, R, TZ + 26 + 8]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-6, -6, X1 + 6, 2 * R + 6, 6, 2);
  put(solid(g), prism(P, front, cr, ci, 0, TZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R, h = HS[k], grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, R), disc(x, y, R - 1.6), TZ, TZ + h));
    // buttons on top of the heap: small discs, each with two holes
    for (const [dx, dy, r] of [[-6, -3, 4], [4, -6, 3.4], [5, 4, 4.2], [-3, 7, 3], [-1, 0, 2.6]]) {
      mk("path", { d: poly(ringAt(P, disc(x + dx, y + dy, r, 18), TZ + h - 0.6)), class: "lo" }, grp);
      mk("path", { d: poly(ringAt(P, disc(x + dx - 0.9, y + dy, 0.5, 6), TZ + h - 0.6)) + poly(ringAt(P, disc(x + dx + 0.9, y + dy, 0.5, 6), TZ + h - 0.6)), class: "nf lo" }, grp);
    }
    const lid = solid(grp), knob = mk("path", { class: "nf" }, grp);
    const z0 = k === FAV ? LIFT * 0.55 : 0;
    items.push({ k, x, y, h, lid, knob, z: tween(z0), base: z0, last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z = TZ + it.h + lift - 1.2;
    put(it.lid, prism(P, front, disc(it.x, it.y, R + 1.2), disc(it.x, it.y, R - 0.4), z, z + 5));
    it.knob.setAttribute("d", poly(hull(ringAt(P, disc(it.x, it.y, 3, 16), z + 5).concat(ringAt(P, disc(it.x, it.y, 3, 16), z + 7.5)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, TZ + it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? it.base : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tin " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "buttonjars",
  means: "Four button tins on a sewing table: the lid under the pointer lifts to show the buttons, and its neighbours ease up a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[119, 130], [173, 148], [281, 210], null],
  mount,
});
