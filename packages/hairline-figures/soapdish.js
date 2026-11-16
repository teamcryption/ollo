/**
 * Soap dispenser: three pump bottles on a counter, each a round bottle with
 * a shoulder, a stem and a pump head with a spout. The pointer picks a
 * bottle by where it stands: its pump presses down and the spout swings
 * round to face you, and the spouts beside it turn part way, staggered from
 * it. At rest one pump is pressed, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row, each head turning on its stem.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, R = 13, STEP = 44, ZB = 28, ZS = 35, ZH = 56, PRESS = 14, FAV = 1, CZ = 3;
const X1 = (N - 1) * STEP + 2 * R;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const RESTA = [205, 45, 130];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-8, -8, 0], [X1 + 8, -8, 0], [X1 + 8, 2 * R + 8, 0], [-8, 2 * R + 8, 0], [R - 24, R - 24, ZH + 10], [X1 - R + 24, R + 24, ZH + 10], [R, R, ZH + 12]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-8, -8, X1 + 8, 2 * R + 8, 6, 2);
  put(solid(g), prism(P, front, cr, ci, 0, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, R), disc(x, y, R - 2.5), CZ, ZB));
    mk("path", { d: poly(hull(ringAt(P, disc(x, y, R), ZB).concat(ringAt(P, disc(x, y, 5.5), ZS)))) }, grp);
    put(solid(grp), prism(P, front, disc(x, y, 5.5), disc(x, y, 4), ZS, ZS + 4));
    const stem = mk("path", { class: "nf" }, grp), back = mk("path", { class: "sil" }, grp), head = mk("path", {}, grp), cap = mk("path", { class: "nf lo" }, grp), fore = mk("path", { class: "sil" }, grp);
    const rest = { a: RESTA[k], p: k === FAV ? PRESS * 0.7 : 0 };
    items.push({ k, x, y, stem, back, head, cap, fore, rest, a: tween(rest.a), p: tween(rest.p), la: NaN, lp: NaN });
  }

  function draw(it, a, p) {
    if (a === it.la && p === it.lp) return;
    it.la = a; it.lp = p;
    const zb = ZH - p, s = Math.sin(rad(a)), c = Math.cos(rad(a));
    it.stem.setAttribute("d", poly(hull(ringAt(P, disc(it.x, it.y, 2.2, 12), ZS + 4).concat(ringAt(P, disc(it.x, it.y, 2.2, 12), zb)))));
    it.head.setAttribute("d", poly(hull(ringAt(P, disc(it.x, it.y, 6), zb).concat(ringAt(P, disc(it.x, it.y, 6), zb + 7)))));
    it.cap.setAttribute("d", poly(ringAt(P, disc(it.x, it.y, 6), zb + 7)));
    const pts = [];
    for (const d of [0, 22]) for (const w of [-2.6, 2.6]) for (const h of [zb + 1.5, zb + 6.5]) pts.push(P(it.x + d * c - w * s, it.y + d * s + w * c, h - (d > 0 ? 1.5 : 0)));
    const sp = poly(hull(pts)), toward = c + s > 0;
    it.back.setAttribute("d", toward ? "" : sp);
    it.fore.setAttribute("d", toward ? sp : "");
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now), tval(it.p, now)); if (!tdone(it.a, now) || !tdone(it.p, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, ZB));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(it.a, a < 0 ? it.rest.a : dd === 0 ? 45 : k < a ? 0 : 90, now, d);
      tset(it.p, a < 0 ? it.rest.p : dd === 0 ? PRESS : dd === 1 ? 5 : 2, now, d);
      const on = k === (a < 0 ? FAV : a);
      it.back.classList.toggle("hi", on); it.fore.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "pump " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "soapdish",
  means: "Three pump soap bottles on a counter: the pump under the pointer presses and its spout swings round; its neighbours turn part way.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[125, 137], [275, 191], [200, 216], null],
  mount,
});
