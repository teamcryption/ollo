/**
 * Milkshakes: three tulip glasses on a diner counter, each topped with a
 * dome of cream, a cherry and a leaning straw. The pointer picks a glass by
 * where it stands at rest: that glass slides forward across the counter,
 * served, and the glasses beside it nudge a little, staggered from it. At
 * rest the middle glass is half served, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 44, Y0 = 16, SLIDE = 22, FAV = 1, CZ = 3;
const RB = 6, RT = 12, ZB = 10, ZT = 34, X1 = 2 * 16 + (N - 1) * STEP, Y1 = Y0 + SLIDE + 16;
const LEAN = [[-5, -2], [4, -3], [-2, -4]];
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [16, Y0, CZ + ZT + 26], [X1 - 16, Y0 + SLIDE, CZ + ZT + 20]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(0, 0, X1, Y1, 7, 2);
  put(solid(g), prism(P, front, cr, ci, 0, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), el = {};
    el.foot = solid(grp);
    el.stem = solid(grp);
    el.straw = mk("path", { class: "sil" }, grp);
    el.bowl = mk("path", { class: "sil" }, grp);
    el.rim = mk("path", { class: "nf lo" }, grp);
    el.band = mk("path", { class: "nf lo" }, grp);
    el.cream = mk("path", { class: "sil" }, grp);
    el.swirl = mk("path", { class: "nf lo" }, grp);
    el.cherry = mk("path", { class: "sil" }, grp);
    items.push({ k, x: 16 + k * STEP, el, s: tween(k === FAV ? SLIDE * 0.55 : k === 2 ? 3 : 0), last: NaN });
  }

  function draw(it, s) {
    if (s === it.last) return;
    it.last = s;
    const { x, el, k } = it, y = Y0 + s, z0 = CZ;
    put(el.foot, prism(P, front, disc(x, y, 8), disc(x, y, 6.6), z0, z0 + 1.6));
    put(el.stem, prism(P, front, disc(x, y, 2.2, 16), disc(x, y, 1.4, 16), z0 + 1.6, z0 + ZB));
    // the bowl: narrow at the stem, flared at the rim
    el.bowl.setAttribute("d", poly(hull(ringAt(P, disc(x, y, RB), z0 + ZB).concat(ringAt(P, disc(x, y, RT, 44), z0 + ZT)))));
    el.rim.setAttribute("d", open(ringAt(P, run(disc(x, y, RT - 1.4, 44), front), z0 + ZT - 0.6)));
    el.band.setAttribute("d", open(ringAt(P, run(disc(x, y, RB + (RT - RB) * 0.35, 36), front), z0 + ZB + (ZT - ZB) * 0.35)));
    // the straw leans out of the cream, its foot hidden behind the dome
    const [lx, ly] = LEAN[k], b = [x + 1, y - 3, z0 + ZT], t = [x + 1 + lx, y - 3 + ly, z0 + ZT + 22];
    el.straw.setAttribute("d", poly(hull(ringAt(P, disc(b[0], b[1], 1.5, 12), b[2]).concat(ringAt(P, disc(t[0], t[1], 1.5, 12), t[2])))));
    const dome = [];
    for (let i = 0; i <= 6; i++) { const a = (i / 6) * (Math.PI / 2); dome.push(...ringAt(P, disc(x, y, (RT + 0.6) * Math.cos(a), 36), z0 + ZT + 9 * Math.sin(a))); }
    el.cream.setAttribute("d", poly(hull(dome)));
    el.swirl.setAttribute("d", open(ringAt(P, run(disc(x, y, RT * 0.72, 36), front), z0 + ZT + 6.3)));
    const cz = z0 + ZT + 9;
    el.cherry.setAttribute("d", poly(hull(ringAt(P, disc(x, y, 1.6, 12), cz).concat(ringAt(P, disc(x, y, 2.6, 16), cz + 2.2), ringAt(P, disc(x, y, 1.6, 12), cz + 4.4)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.s, now)); if (!tdone(it.s, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y0, CZ + ZT / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 36 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), s = a < 0 ? (k === FAV ? SLIDE * 0.55 : k === 2 ? 3 : 0) : dd === 0 ? SLIDE : dd === 1 ? 4 : 0;
      tset(it.s, s, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.el.bowl.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "glass " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "milkshakes",
  means: "Three milkshakes on a diner counter: the glass under the pointer slides forward, served, and its neighbours nudge.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[154, 140], [276, 160], [215, 150], null],
  mount,
});
