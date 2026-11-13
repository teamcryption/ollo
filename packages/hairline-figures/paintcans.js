/**
 * Paint cans: five cans in a row on a crumpled drop cloth, each with a
 * rolled bead round its foot, a wire handle hanging down its front on two
 * ears, and a lid pressed into its rim; one can has run drips, one carries
 * a brush laid across its lid. The pointer picks a can by where it stands:
 * its lid pops up and tilts back, and the lids beside it lift a little,
 * staggered from it. At rest one lid sits ajar, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the can
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, circ, facing, fillet, fit, hull, open, poly, prism, proj, ringAt, rrect, run, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 27, R = 10, H = 22, Y = 14, FAV = 2, BRUSH = 3, DRIP = 1, LIFT = 15, TILT = 28;
const REST = [[0, 0], [0.4, 2], [4, 14], [0, 0], [0.8, -3]];
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const CLOTH = [[-16, -10], [58, -14], [146, -8], [152, 30], [104, 44], [30, 40], [-12, 34]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  const X1 = R + (N - 1) * STEP;
  fit(C, CLOTH.map(([x, y]) => [x, y, 0]).concat([[R, Y - R, H + LIFT + 8], [X1, Y - R, H + LIFT + 8]]), 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the drop cloth: a rounded, uneven sheet with its folds
  mk("path", { d: poly(fillet(CLOTH, [6, 10, 5, 8, 12, 6, 9], 4).map(([x, y]) => P(x, y, 0))) }, g);
  mk("path", { class: "nf lo", d: seg(P(4, 30, 0), P(40, 22, 0)) + seg(P(96, -6, 0), P(128, 4, 0)) + seg(P(112, 36, 0), P(140, 22, 0)) }, g);

  const e = [-Math.SQRT1_2, Math.SQRT1_2], f = [Math.SQRT1_2, Math.SQRT1_2], ZE = H - 4, RC = R + 1.2, PHI = (60 * Math.PI) / 180;
  const cans = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, Y, R), disc(x, Y, R - 1.3), 0, H));
    let marks = open(ringAt(P, run(disc(x, Y, R, 36), front), 3));
    for (const s of [-1, 1]) { const ex = x + s * R * e[0], ey = Y + s * R * e[1]; marks += seg(P(ex, ey, ZE - 1.6), P(ex, ey, ZE + 1.6)); }
    if (k === DRIP) for (const [a, d] of [[30, 7], [52, 4.5]]) {
      const pts = [];
      for (const [da, z] of [[-2, H], [-2, H - d], [0, H - d - 1.4], [2, H - d], [2, H]]) { const t = ((a + da) * Math.PI) / 180; pts.push(P(x + R * Math.cos(t), Y + R * Math.sin(t), z)); }
      marks += open(pts);
    }
    mk("path", { class: "nf lo", d: marks }, grp);
    const lid = solid(grp), parts = k === BRUSH ? [solid(grp), solid(grp), solid(grp)] : [];
    const arc = [];
    for (let i = 0; i <= 20; i++) {
      const t = (i / 20) * Math.PI, a = RC * Math.cos(t), b = RC * Math.sin(t);
      arc.push(P(x + a * e[0] + b * Math.sin(PHI) * f[0], Y + a * e[1] + b * Math.sin(PHI) * f[1], ZE - b * Math.cos(PHI)));
    }
    mk("path", { class: "nf", d: open(arc) }, grp);
    cans.push({ k, x, lid, parts, z: tween(REST[k][0]), a: tween(REST[k][1]), last: "" });
  }

  // a point of the lid's frame: u across, v front to back, w up from the lid's seat, tilted back by a
  const lp = (c, lift, a) => (u, v, w) => P(c.x + u, Y + v * Math.cos(a), H - 0.4 + lift + w * Math.cos(a) - v * Math.sin(a));
  const slab = (L, u0, v0, u1, v1, w0, w1, inset, r) => {
    const at = (w, d) => rrect(u0 + d, v0 + d, u1 - d, v1 - d, Math.max(0.3, r - d), 3).map((q) => L(q.u, q.v, w));
    return { sil: poly(hull(at(w0, 0).concat(at(w1, inset)))), crease: poly(at(w1, inset + 0.5)) };
  };
  function draw(c, lift, deg) {
    const key = lift.toFixed(2) + "," + deg.toFixed(2);
    if (key === c.last) return;
    c.last = key;
    const L = lp(c, lift, (deg * Math.PI) / 180), ring = (r, w) => circ(r, 32).map((q) => L(q.u, q.v, w));
    put(c.lid, { sil: poly(hull(ring(R - 1.2, 0).concat(ring(R - 1.2, 1.4)))), crease: poly(ring(R - 3, 1.4)) });
    if (!c.parts.length) return;
    put(c.parts[0], slab(L, -1.6, -18, 1.6, -1, 1.4, 4, 0, 1.4));
    put(c.parts[1], slab(L, -3.6, -1, 3.6, 5, 1.4, 5, 0, 1));
    put(c.parts[2], slab(L, -3.6, 5, 3.6, 14, 1.6, 4.6, 0.8, 1.2));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of cans) { draw(c, tval(c.z, now), tval(c.a, now)); if (!tdone(c.z, now) || !tdone(c.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = cans.map((c) => P(c.x, Y, H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 50 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cans.forEach((c, k) => {
      const d = Math.abs(k - a), [z, t] = a < 0 ? REST[k] : d === 0 ? [LIFT, TILT] : d === 1 ? [4, 7] : d === 2 ? [1.4, 2] : REST[k];
      const delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(c.z, z, now, delay); tset(c.a, t, now, delay);
      c.lid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
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
  name: "paintcans",
  means: "Five paint cans on a drop cloth: the lid of the can under the pointer pops up and tilts, and its neighbours' lids lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[120, 118], [194, 155], [269, 192], null],
  mount,
});
