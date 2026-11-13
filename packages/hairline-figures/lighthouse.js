/**
 * Lighthouse: a tapered tower with two bands, a gallery deck and rail, a
 * lantern room with mullions under a conical roof, and a keeper's cottage
 * with a gabled roof beside it, all on a rocky base. The lamp's beam, two
 * lines out from the lantern, turns to point where the pointer is, on a
 * spring; the lantern is the bright mark. At rest the beam sweeps out front
 * left. The slider is how quickly the beam follows.
 *
 * The pattern: a continuous aim (spotlights); the hit is the pointer on the
 * beam's own plane, which never moves.
 */
const {
  Cam, circ, fillet, fit, facing, hull, open, poly, prism, proj, ringAt, run, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ZT = 74, ZB = 83, LEN = 60, HALF = 7, REST = 100;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  const ext = [[0, 0, 101], [-30, -30, -6], [50, 30, -6], [50, -30, -6], [-30, 30, -6]];
  for (let a = 0; a < 360; a += 30) ext.push([LEN * Math.cos((a * Math.PI) / 180), LEN * Math.sin((a * Math.PI) / 180), ZB]);
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);

  // the rock: an uneven footprint, its top a little smaller, its front edge a crease
  const rock = (k, z) => Array.from({ length: 36 }, (_, i) => {
    const t = (i / 36) * Math.PI * 2, b = 1 + 0.07 * Math.sin(3 * t + 1) + 0.05 * Math.sin(5 * t);
    return { t, p: P(10 + 38 * k * b * Math.cos(t), 2 + 29 * k * b * Math.sin(t), z) };
  });
  const rh = hull(rock(1, -6).concat(rock(0.9, 6)).map((q) => q.p));
  mk("path", { class: "sil", d: poly(fillet(rh, rh.map(() => 4))) }, g);
  mk("path", { class: "nf lo", d: open(rock(0.86, 6).filter((q) => Math.cos(q.t - Math.PI / 4) > 0.05).map((q) => q.p)) }, g);

  // the tower: a tapered round, a crease at its top and two bands
  const foot = circ(13, 48), top = circ(8.5, 48);
  const tw = solid(g);
  put(tw, { sil: poly(hull(ringAt(P, foot, 6).concat(ringAt(P, top, ZT)))), crease: open(ringAt(P, run(circ(7.6, 48), front), ZT)) });
  const band = (z) => open(ringAt(P, run(circ(13 - (4.5 * (z - 6)) / (ZT - 6), 48), front), z));
  mk("path", { class: "nf lo", d: band(26) + band(33) + band(48) + band(55) }, g);
  put(solid(g), prism(P, front, circ(12.5, 48), circ(11.4, 48), ZT, ZT + 3));
  const rail = circ(11.6, 48), posts = (keep) => rail.filter((s, i) => i % 6 === 0 && keep(s)).map((s) => seg(P(s.u, s.v, ZT + 3), P(s.u, s.v, ZT + 9))).join("");
  mk("path", { class: "nf lo", d: open(ringAt(P, run(rail, (s) => !front(s)), ZT + 9)) + posts((s) => !front(s)) }, g);
  const beam = mk("path", { class: "nf" }, g);
  const lan = solid(g);
  put(lan, prism(P, front, circ(6.5, 32), circ(5.6, 32), ZT + 3, ZT + 15));
  lan.sil.classList.add("hi");
  const mull = [20, 45, 70].map((d) => { const a = (d * Math.PI) / 180; return seg(P(6.5 * Math.cos(a), 6.5 * Math.sin(a), ZT + 4), P(6.5 * Math.cos(a), 6.5 * Math.sin(a), ZT + 14)); }).join("");
  mk("path", { class: "nf lo", d: mull }, lan.g);
  const roof = ringAt(P, circ(8, 32), ZT + 15).concat([P(0, 0, ZT + 23)]);
  mk("path", { class: "sil", d: poly(fillet(hull(roof), hull(roof).map(() => 1.5))) + seg(P(0, 0, ZT + 23), P(0, 0, ZT + 27)) }, g);
  const railF = mk("path", { class: "nf lo", d: open(ringAt(P, run(rail, front), ZT + 9)) + posts(front) }, g);

  // the keeper's cottage: a box and a gable roof, its ridge along x, a door on its front
  const cot = solid(g);
  { const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
    const pts = [];
    for (const [x, y] of box(18, -8, 40, 12)) pts.push(P(x, y, 6), P(x, y, 20));
    const ch = hull(pts);
    cot.sil.setAttribute("d", poly(fillet(ch, ch.map(() => 1.5))));
    cot.cr.setAttribute("d", poly([P(26, 12, 6), P(31, 12, 6), P(31, 12, 14), P(26, 12, 14)]));
    const rp = [];
    for (const x of [17, 41]) rp.push(P(x, -9.5, 20), P(x, 13.5, 20), P(x, 2, 30));
    const rhull = hull(rp);
    mk("path", { class: "sil", d: poly(fillet(rhull, rhull.map(() => 1.5))) }, g);
    mk("path", { class: "nf lo", d: seg(P(41, 2, 30), P(41, 13.5, 20)) }, g);
  }

  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = "", over = false, behind = null;
  function draw() {
    const key = sp.x.toFixed(2);
    if (key === last) return;
    last = key;
    const r = (deg, d, z) => { const a = (deg * Math.PI) / 180; return P(d * Math.cos(a), d * Math.sin(a), z); };
    beam.setAttribute("d", seg(r(sp.x - 25, 6.8, ZB), r(sp.x - HALF, LEN, ZB)) + seg(r(sp.x + 25, 6.8, ZB), r(sp.x + HALF, LEN, ZB)));
    const back = Math.cos(((sp.x - 45) * Math.PI) / 180) < 0;
    if (back !== behind) { behind = back; if (back) lan.g.before(beam); else railF.after(beam); }
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(deg) {
    sp.t = sp.x + ((((deg - sp.x) % 360) + 540) % 360) - 180;
    read.textContent = over ? "beam " + (Math.round(((deg % 360) + 360) % 360) % 360) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], ZB);
      if (Math.hypot(x, y) < 4) return;
      over = true;
      aim((Math.atan2(y, x) * 180) / Math.PI);
    },
    leave: () => { over = false; aim(REST); },
  }));
  bag.add(() => svg.replaceChildren());
  aim(REST);
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "lighthouse",
  means: "A lighthouse on a rock: the lamp's beam turns on a spring to point where the pointer is, the lantern bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[320, 120], [200, 230], [80, 110], null],
  mount,
});
