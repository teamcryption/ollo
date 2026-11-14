/**
 * Drillbits: a drill bit case, a low block with a row of bits standing in
 * graded sizes. The pointer picks a bit by where it stands: it lifts out of
 * its hole, and the bits beside it rise a little, staggered from it. At rest
 * one bit is half drawn, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, STEP = 24, CZ = 10, LIFT = 34, FAV = 3;
const RS = [3, 3.6, 4.2, 4.8, 5.4, 6], HS = [30, 36, 42, 48, 54, 60];
const X1 = (N - 1) * STEP + 28;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, 0, 0], [X1, 30, 0], [X1, 0, 0], [0, 30, 0], [14, 15, CZ + HS[0] + LIFT], [X1 - 14, 15, CZ + HS[5] + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(0, 0, X1, 30, 5, 2);
  put(solid(g), prism(P, front, cr, ci, 0, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 14 + k * STEP, y = 15, r = RS[k], h = HS[k];
    mk("path", { d: poly(ringAt(P, disc(x, y, r + 1.5), CZ)), class: "nf lo" }, g);
    const grp = mk("g", {}, g);
    const body = mk("path", { class: "sil" }, grp), flute = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, r, h, body, flute, z: tween(k === FAV ? LIFT * 0.45 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const b = CZ - 4 + lift, top = b + it.h, ring = disc(it.x, it.y, it.r);
    const pts = ringAt(P, ring, b).concat(ringAt(P, ring, top - it.r * 2.2), [P(it.x, it.y, top)]);
    it.body.setAttribute("d", poly(hull(pts)));
    let d = "";
    const z0 = Math.max(b + it.h * 0.45, CZ + 1);
    for (let i = 0; i < 3; i++) {
      const pa = P(it.x - it.r * 0.7, it.y + it.r * 0.7, z0 + i * it.h * 0.14), pb = P(it.x + it.r * 0.7, it.y - it.r * 0.7, z0 + i * it.h * 0.14 + it.r * 1.6);
      d += "M" + pa[0].toFixed(2) + " " + pa[1].toFixed(2) + "L" + pb[0].toFixed(2) + " " + pb[1].toFixed(2);
    }
    it.flute.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, CZ + it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.45 : 0) : dd === 0 ? LIFT : dd === 1 ? 10 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bit " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "drillbits",
  means: "A drill bit case with bits in graded sizes: the bit under the pointer lifts out of its hole, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[119, 131], [216, 163], [281, 163], null],
  mount,
});
