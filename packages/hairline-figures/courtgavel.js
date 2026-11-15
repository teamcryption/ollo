/**
 * Podiums: three speaker lecterns on a stage, each a plinth, a column and
 * a slanted reading top. The pointer picks a lectern by where it stands:
 * it turns on its plinth to face the room, and the lecterns beside it turn
 * part of the way, staggered from it. At rest each stands at its own
 * angle and one reading top is bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row, turning (officechairs).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 50, Y = 22, FAV = 1, HB = 46;
const REST = [28, -18, 40], TURN = -70;
const xs = [...Array(N)].map((_, k) => 22 + k * STEP);

function rot(ring, cx, cy, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c, lv: q.v }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.85);
  const X1 = xs[N - 1] + 22;
  fit(C, [[0, 0, 0], [X1, 2 * Y, 0], [X1, 0, 0], [0, 2 * Y, 0], [xs[0], Y, HB + 14], [xs[N - 1], Y, HB + 14]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(0, 0, X1, 2 * Y, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, 4));

  const items = xs.map((x, k) => {
    const grp = mk("g", {}, g);
    return { k, x, plinth: solid(grp), body: solid(grp), top: solid(grp), a: tween(REST[k]), last: NaN };
  });

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const a = (deg * Math.PI) / 180, R = (r) => rot(r, it.x, Y, a);
    put(it.plinth, prism(P, front, R(rrect(-12, -10, 12, 10, 3, 4)), R(rrect(-10.6, -8.6, 10.6, 8.6, 1.6, 4)), 4, 7));
    put(it.body, prism(P, front, R(rrect(-8, -6, 8, 6, 2.5, 4)), R(rrect(-6.8, -4.8, 6.8, 4.8, 1.3, 4)), 7, HB));
    const top = R(rrect(-14, -10, 14, 10, 2.5, 4)), inner = R(rrect(-12.6, -8.6, 12.6, 8.6, 1.2, 4));
    const zt = (q, d) => HB + 6 - q.lv * 0.42 + d;
    const pts = top.map((q) => P(q.u, q.v, zt(q, 0))).concat(top.map((q) => P(q.u, q.v, zt(q, 2.4))));
    it.top.sil.setAttribute("d", poly(hull(pts)));
    it.top.cr.setAttribute("d", poly(inner.map((q) => P(q.u, q.v, zt(q, 2.4)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y, HB / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 45 && Math.abs(mids[best][1] - sy) < 75 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = a < 0 ? REST[k] : dd === 0 ? TURN : dd === 1 ? (REST[k] + TURN) / 2 : REST[k];
      tset(it.a, d, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.top.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "podium " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "courtgavel",
  means: "Three speaker lecterns on a stage: the lectern under the pointer turns on its plinth to face the room, its neighbours part way.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[135, 84], [200, 116], [265, 149], null],
  mount,
});
