/**
 * Espresso machine: a two-group machine, a body under a deep top that hangs
 * over the drip tray, two group heads with their spouts and portafilter
 * handles, a pressure gauge on the top's face, a steam wand at the end, and
 * four cups on the tray. The pointer picks a cup by where it is along the
 * tray: it slides back under the nearer spout and fills, its level rising in
 * the cup; its neighbours fill a little, staggered from it. At rest one cup
 * stands under a spout half full, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the hit is the cups'
 * rest centres along the screen's x.
 */
const {
  Cam, circ, facing, fit, hull, open, poly, prism, proj, rings, ringAt, run, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const XS = [12, 34, 56, 78], SPOUT = [30, 62], CY = 49, SY = 37, TRAY = 5, CR = 5.6, CF = 4, CH = 8;
const REST = [[0, 0.3], [0, 0], [1, 0.55], [0, 0.15]], FAV = 2;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [96, 0, 56], [0, 60, 0], [96, 60, 0], [0, 46, 56], [96, 46, 56]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the body, the group heads under the top, the top, the handles, the tray, the wand
  const [br, bi] = rings(2, 0, 94, 30, 5, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, 38));
  for (const x of SPOUT) {
    put(solid(g), prism(P, front, disc(x, SY, 5.5, 32), disc(x, SY, 4.6, 32), 30, 38));
    put(solid(g), prism(P, front, disc(x, SY, 1.4, 16), null, 25, 30));
  }
  const [tr, ti] = rings(0, 0, 96, 46, 6, 1.4);
  const top = solid(g);
  put(top, prism(P, front, tr, ti, 38, 54));
  const gauge = [];
  for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; gauge.push(P(46 + 4.5 * Math.cos(a), 46, 46 + 4.5 * Math.sin(a))); }
  mk("path", { class: "nf lo", d: poly(gauge) + seg(P(46, 46, 46), P(48.5, 46, 48.5)) }, top.g);
  for (const x of SPOUT) {
    const [hr, hi] = rings(x - 1.6, SY + 4, x + 1.6, 56, 1.2, 0.5);
    put(solid(g), prism(P, front, hr, hi, 30, 32.4));
  }
  const [yr, yi] = rings(4, 32, 92, 60, 4, 1.4);
  const tray = solid(g);
  put(tray, prism(P, front, yr, yi, 0, TRAY));
  mk("path", { class: "sil", d: poly(hull(ringAt(P, disc(93, 43, 1.4, 16), 37).concat(ringAt(P, disc(94.5, 47, 1.2, 16), 22)))) }, g);
  mk("path", { class: "nf lo", d: [10, 20, 30, 40, 50, 60, 70, 80].map((x) => seg(P(x, 36, TRAY), P(x, 56, TRAY))).join("") }, tray.g);

  const cups = XS.map((x, k) => {
    const grp = mk("g", {}, g);
    return {
      k, x, grp, handle: mk("path", { class: "nf sil" }, grp), sil: mk("path", { class: "sil" }, grp),
      rim: mk("path", { class: "nf lo" }, grp), lvl: mk("path", { class: "nf lo" }, grp),
      s: tween(REST[k][0]), f: tween(REST[k][1]), last: "",
    };
  });
  const near = (x) => (Math.abs(x - SPOUT[0]) < Math.abs(x - SPOUT[1]) ? SPOUT[0] : SPOUT[1]);

  function draw(c, s, f) {
    const key = s.toFixed(3) + "," + f.toFixed(3);
    if (key === c.last) return;
    c.last = key;
    const x = c.x + (near(c.x) - c.x) * s, y = CY + (SY - CY) * s, z0 = TRAY, z1 = TRAY + CH;
    c.sil.setAttribute("d", poly(hull(ringAt(P, disc(x, y, CF), z0).concat(ringAt(P, disc(x, y, CR), z1)))));
    c.rim.setAttribute("d", poly(ringAt(P, disc(x, y, CR - 0.6), z1)));
    const h = [];
    for (let i = 0; i <= 12; i++) { const a = (i / 12) * Math.PI * 2; h.push(P(x + (CF + 2.6 + 2 * Math.cos(a)) * 0.707, y - (CF + 2.6 + 2 * Math.cos(a)) * 0.707, z0 + 4.2 + 2.2 * Math.sin(a))); }
    c.handle.setAttribute("d", poly(h));
    // the level: the part of the liquid's ring seen through the rim's opening
    const zl = z0 + 1 + f * (CH - 2.2), rl = CF + (CR - 0.6 - CF) * ((zl - z0) / CH);
    const seen = (q) => { const [wx, wy] = unproj(C, ...P(q.u, q.v, zl), z1); return Math.hypot(wx - x, wy - y) < CR - 0.7; };
    c.lvl.setAttribute("d", f > 0.02 ? open(ringAt(P, run(disc(x, y, rl, 40), seen), zl)) : "");
  }

  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const c of cups) { draw(c, tval(c.s, now), tval(c.f, now)); if (!tdone(c.s, now) || !tdone(c.f, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  // the hit: the nearest cup by its rest centre along the screen's x, inside the tray's band
  const mids = cups.map((c) => P(c.x, CY, TRAY + CH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 28 && Math.abs(mids[best][1] - sy) < 34 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cups.forEach((c, k) => {
      const dd = Math.abs(k - a), delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(c.s, a < 0 ? REST[k][0] : dd === 0 ? 1 : 0, now, delay);
      tset(c.f, a < 0 ? REST[k][1] : dd === 0 ? 0.9 : dd === 1 ? Math.max(0.35, REST[k][1]) : REST[k][1], now, delay + (dd === 0 ? 250 : 0));
      const on = k === (a < 0 ? FAV : a);
      c.sil.classList.toggle("hi", on);
      c.handle.classList.toggle("hi", on);
    });
    // paint order follows where each cup is going
    const depth = (c) => { const t = tTarget(c); return c.x + (near(c.x) - c.x) * t + CY + (SY - CY) * t; };
    [...cups].sort((p, q) => depth(p) - depth(q)).forEach((c) => g.appendChild(c.grp));
    read.textContent = a < 0 ? "rest" : "cup " + (a + 1);
    B.wake();
  }
  function tTarget(c) { return act < 0 ? REST[c.k][0] : c.k === act ? 1 : 0; }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "espressomachine",
  means: "A two-group espresso machine: the cup under the pointer slides under a spout and fills; its neighbours fill a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[111, 163], [146, 181], [218, 217], null],
  mount,
});
