/**
 * Tiddlywinks cup: a flared cup on the mat, five winks scattered round it
 * and a squidger lying by. The pointer picks the wink nearest it on the mat:
 * that wink lights and the cup tips toward it, as if to take the shot. At
 * rest the cup leans a little toward one wink, bright. The slider is the tip.
 *
 * The pattern: one of many on the ground (terrain pick), one part turning
 * to answer.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 15, RT = 19, CH = 26, FAV = 0, REST = 8;
const WINKS = [[30, 30], [-34, 16], [38, -10], [8, -40], [-12, 42]];
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tip = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-46, -46, 0], [46, 46, 0], [46, -46, 0], [-46, 46, 0], [0, 0, CH + 4]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const back = mk("g", {}, g), cupg = mk("g", {}, g), fore = mk("g", {}, g);
  const sq = disc(-30, -26, 9), sqi = disc(-30, -26, 7.4);
  put(solid(back), prism(P, front, sq, sqi, 0, 2.4));
  mk("path", { class: "nf lo", d: poly(ringAt(P, disc(-30, -26, 2.5, 16), 2.4)) }, back);
  const winks = WINKS.map(([x, y], k) => {
    const s = solid(x + y < 0 ? back : fore);
    put(s, prism(P, front, disc(x, y, 5), disc(x, y, 4), 0, 1.4));
    return s;
  });
  const sil = mk("path", { class: "sil" }, cupg), rim = mk("path", { class: "nf" }, cupg), lip = mk("path", { class: "nf lo" }, cupg);
  const base = circ(R, 32), top = circ(RT, 40), topIn = circ(RT - 1.8, 40);
  const ph = tween(Math.atan2(WINKS[FAV][1], WINKS[FAV][0])), th = tween(REST);
  let last = "";
  function W(q, z, d, e, c, s) {
    const sd = q.u * d[0] + q.v * d[1], te = q.u * e[0] + q.v * e[1];
    const s2 = R + (sd - R) * c + z * s, z2 = -(sd - R) * s + z * c;
    return P(s2 * d[0] + te * e[0], s2 * d[1] + te * e[1], z2);
  }
  function draw(phi, deg) {
    const key = phi.toFixed(4) + deg.toFixed(3);
    if (key === last) return;
    last = key;
    const d = [Math.cos(phi), Math.sin(phi)], e = [-d[1], d[0]], t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
    const b = base.map((q) => W(q, 0, d, e, c, s)), tp = top.map((q) => W(q, CH, d, e, c, s));
    sil.setAttribute("d", poly(hull(b.concat(tp))));
    rim.setAttribute("d", poly(tp));
    lip.setAttribute("d", poly(topIn.map((q) => W(q, CH, d, e, c, s))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ph, now), tval(th, now)); return !tdone(ph, now) || !tdone(th, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    let best = -1, bd = 22;
    WINKS.forEach(([wx, wy], k) => { const dd = Math.hypot(wx - x, wy - y); if (dd < bd) { bd = dd; best = k; } });
    return best;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), k = a < 0 ? FAV : a;
    act = a;
    let to = Math.atan2(WINKS[k][1], WINKS[k][0]);
    const cur = ph.t !== undefined ? ph.t : tval(ph, now);
    while (to - cur > Math.PI) to -= 2 * Math.PI;
    while (to - cur < -Math.PI) to += 2 * Math.PI;
    tset(ph, to, now, 0);
    tset(th, a < 0 ? REST : tip, now, 0);
    winks.forEach((w, i) => w.sil.classList.toggle("hi", i === k));
    read.textContent = a < 0 ? "rest" : "wink " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tip = v; if (act >= 0) tset(th, v, performance.now(), 0); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "tiddly",
  means: "A tiddlywinks cup among scattered winks: the wink under the pointer lights and the cup tips toward it.",
  rules: [1, 3, 4, 5],
  range: [12, 30, 40],
  tour: [[108, 149], [288, 136], [101, 193], null],
  mount,
});
