/**
 * Perfume bottles: five bottles on a mirrored tray, each its own shape, a
 * square flacon, a round flask, a slim oval, a faceted octagon and a low
 * wide one, each with a neck and a cap of its own cut, their reflections
 * fading into the mirror. The pointer picks a bottle by where it stands: its
 * cap lifts off the neck and turns, and the caps beside it lift a little,
 * staggered from it. At rest the caps sit at uneven turns and one is raised,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the bottle
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, circ, facing, fillet, fit, hull, open, poly, prism, proj, rad, reflect, rings, rrect, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

// outlines as rings of samples {u, v, nu, nv}, centred on 0
const ringOf = (pts) => pts.map(([u, v], i) => {
  const a = pts[(i + pts.length - 1) % pts.length], b = pts[(i + 1) % pts.length], tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1;
  return { u, v, nu: ty / l, nv: -tx / l };
});
const box = (w, h, r) => ringOf(fillet([[-w, -h], [w, -h], [w, h], [-w, h]], [r, r, r, r], 4));
const gon = (n, R, r, a0 = 0) => ringOf(fillet(Array.from({ length: n }, (_, i) => [R * Math.cos(a0 + (i * 2 * Math.PI) / n), R * Math.sin(a0 + (i * 2 * Math.PI) / n)]), Array(n).fill(r), 3));
const oval = (a, b) => ringOf(Array.from({ length: 28 }, (_, i) => [a * Math.cos((-i * 2 * Math.PI) / 28), b * Math.sin((-i * 2 * Math.PI) / 28)]));
const B5 = [
  { out: box(7, 7, 2), tiers: [[1, 0], [1, 18]], cap: box(3.6, 3.6, 1), ct: [[1, 0], [1, 6]] },
  { out: oval(8, 8), tiers: [[1, 0], [1, 10], [0.8, 13.5], [0.35, 15]], cap: gon(6, 3.4, 0.8), ct: [[1, 0], [1, 8]] },
  { out: oval(5, 3.6), tiers: [[1, 0], [1, 25], [0.8, 26.5]], cap: oval(3.8, 2.4), ct: [[1, 0], [1.1, 3], [0.9, 6], [0.4, 7.5]] },
  { out: gon(8, 8.4, 1.4, Math.PI / 8), tiers: [[0.85, 0], [1, 5], [1, 12], [0.75, 16]], cap: gon(4, 4.4, 0.8), ct: [[1, 0], [1, 3.5], [0.45, 7.5]] },
  { out: box(10, 5.4, 2.6), tiers: [[1, 0], [1, 10]], cap: box(5, 2.6, 1), ct: [[1, 0], [1, 4]] },
];
const GAP = 6, YC = 17, TURN = [0, 12, -10, 18, 6], FAV = 3, LIFT = 16;
const xs = []; { let x = 6; for (const b of B5) { const w = Math.max(...b.out.map((q) => q.u)); xs.push(x + w); x += 2 * w + GAP; } }
const X1 = xs[4] + 10 + 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, 0, -4], [X1, 34, -4], [X1, 0, -4], [0, 34, -4], [xs[2], YC, 26 + 2.5 + 8 + LIFT], [xs[0], YC, 20 + LIFT + 9]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(0, 0, X1, 34, 6, 2.2);
  put(solid(g), prism(P, front, tr, ti, -4, 0));
  mk("path", { d: poly(rrect(4, 4, X1 - 4, 30, 4, 4).map((q) => P(q.u, q.v, 0))), class: "nf lo" }, g);
  const at = (ring, x, k = 1) => ring.map((q) => ({ ...q, u: x + q.u * k, v: YC + q.v * k }));
  B5.forEach((b, k) => reflect(svg, g, P, front, at(b.out, xs[k], b.tiers[0][0]), 0, 7));

  // a solid from a stack of [scale, height] tiers of one outline, turned by a about its axis
  function stack(ring, tiers, x, z0, a) {
    const co = Math.cos(a), si = Math.sin(a);
    const R = ring.map((q) => ({ u: q.u * co - q.v * si, v: q.u * si + q.v * co, nu: q.nu * co - q.nv * si, nv: q.nu * si + q.nv * co }));
    const pts = tiers.flatMap(([s, z]) => R.map((q) => P(x + q.u * s, YC + q.v * s, z0 + z)));
    const [s1, z1] = tiers[tiers.length - 1], [s0] = tiers[0];
    const top = tiers.length === 2 ? s1 : tiers[tiers.length - 2][0], zc = tiers.length === 2 ? z1 : tiers[tiers.length - 2][1];
    const inner = run(R, front).map((q) => P(x + q.u * (top - 0.12) , YC + q.v * (top - 0.12), z0 + zc - (tiers.length === 2 ? 0 : 0.4)));
    return { sil: poly(hull(pts)), crease: s0 > 0 ? open(inner) : "" };
  }

  const items = B5.map((b, k) => {
    const grp = mk("g", {}, g), h = b.tiers[b.tiers.length - 1][1];
    const body = solid(grp);
    put(body, stack(b.out, b.tiers, xs[k], 0, 0));
    put(solid(grp), stack(oval(2.1, 2.1), [[1, 0], [1, 3]], xs[k], h - 0.5, 0));
    return { k, b, h: h + 2.5, body, cap: solid(grp), z: tween(0), t: tween(0), last: "" };
  });

  function draw(it, lift, turn) {
    const key = lift.toFixed(2) + "," + turn.toFixed(2);
    if (key === it.last) return;
    it.last = key;
    put(it.cap, stack(it.b.cap, it.b.ct, xs[it.k], it.h + lift, rad(TURN[it.k] + turn)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now), tval(it.t, now)); if (!tdone(it.z, now) || !tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The bottle whose resting middle is nearest the pointer's x on screen; -1 off the tray. */
  const mids = items.map((it) => P(xs[it.k], YC, it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a);
      const [z, t] = a < 0 ? (k === FAV ? [5, 20] : [0, 0]) : dd === 0 ? [LIFT, 45] : dd === 1 ? [6.5, 18] : [2.5, -8];
      const delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(it.z, z, now, delay); tset(it.t, t, now, delay);
      const on = k === (a < 0 ? FAV : a);
      it.cap.sil.classList.toggle("hi", on); it.body.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "bottle " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "perfumebottles",
  means: "Five perfume bottles on a mirrored tray: the cap of the bottle under the pointer lifts and turns, and its neighbours' caps lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[121, 140], [230, 179], [276, 211], null],
  mount,
});
