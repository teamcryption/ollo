/**
 * Crayonbox: an open box of eight crayons standing in a row, its lid flap
 * leaning back behind them. Each crayon is a round stick with a wrapper band
 * and a cone tip. The pointer picks a crayon by where it stands: it rises out
 * of the box, and its neighbours rise a little, staggered from it. At rest
 * the crayons stand at uneven heights, one pulled half out, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the crayon
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, circ, facing, fillet, fit, hull, open, poly, prism, proj, rings, ringAt, rrect, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 8, STEP = 6.4, CR = 2.6, BH = 30, L = 40, TIP = 6, LIFT = 20, FAV = 5;
const X1 = N * STEP + 2, Y0 = 0, Y1 = 9, CY = 4.5;
const REST = [3, 0, 5, 1, 2, 9, 0, 4];
const disc = (x, y, r, n = 18) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[0, Y0, 0], [X1, Y1, 0], [0, Y1, 0], [X1, Y0, 0], [0, Y0 - 12, BH + 28], [STEP * 6, CY, LIFT + L + TIP]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the lid flap, leaning back from the box's back edge
  const flap = fillet([[0, Y0, BH], [X1, Y0, BH], [X1, Y0 - 12, BH + 24], [0, Y0 - 12, BH + 24]].map((p) => P(...p)), [0, 0, 3, 3], 4);
  mk("path", { class: "sil", d: poly(flap) }, g);
  const outer = rrect(0, Y0, X1, Y1, 2, 6), inner = rrect(1, Y0 + 1, X1 - 1, Y1 - 1, 1.2, 6);
  put(solid(g), prism(P, front, outer, inner, 0, BH));

  const crayons = [];
  for (let k = 0; k < N; k++) {
    const x = 1 + STEP / 2 + k * STEP, grp = mk("g", {}, g);
    crayons.push({ k, x, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), z: tween(REST[k]), last: NaN });
  }
  // the box's near faces, painted over the crayons' feet
  const nr = run(outer, front);
  mk("path", { class: "sil", d: poly(hull(ringAt(P, nr, 0).concat(ringAt(P, nr, BH)))) }, g);
  mk("path", { class: "nf lo", d: open(ringAt(P, nr, BH - 9)) }, g);

  function draw(c, z) {
    if (z === c.last) return;
    c.last = z;
    const ring = disc(c.x, CY, CR), top = z + L;
    const pts = ringAt(P, ring, z).concat(ringAt(P, ring, top), [P(c.x, CY, top + TIP)], ringAt(P, disc(c.x, CY, 0.8, 8), top + TIP - 0.6));
    c.sil.setAttribute("d", poly(hull(pts)));
    const fr = run(ring, front), band = (zz) => open(ringAt(P, fr, zz));
    c.cr.setAttribute("d", band(top) + band(top - 7) + band(z + 8));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of crayons) { draw(c, tval(c.z, now)); if (!tdone(c.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = crayons.map((c) => P(c.x, CY, BH + 6));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 12 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    crayons.forEach((c, k) => {
      const d = Math.abs(k - a), z = a < 0 ? REST[k] : d === 0 ? LIFT : d === 1 ? 7 : d === 2 ? 3 : 0;
      tset(c.z, z, now, from < 0 ? 0 : d * stag);
      c.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "crayon " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "crayonbox",
  means: "An open box of eight crayons: the crayon under the pointer rises out of the box, its neighbours rise a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[162, 122], [200, 141], [238, 161], null],
  mount,
});
