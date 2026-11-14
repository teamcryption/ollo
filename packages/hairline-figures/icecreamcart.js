/**
 * Ice cream cart: a box cart on two wheels under a parasol, three tubs set in
 * its top, each under a round lid. The pointer picks a tub where it stands on
 * the cart's top: its lid lifts off to show the scoop, its neighbours rise a
 * little, staggered from it. At rest one lid is ajar, bright.
 *
 * The pattern: one of many on a plane (terrain pick, riffle lift).
 */
const {
  Cam, circ, fit, facing, hull, poly, open, prism, proj, unproj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 72, D = 36, Z0 = 14, ZT = 46, LR = 9, LH = 6, LIFT = 18, FAV = 1, PZ = 112, CR = 40;
const TUBS = [16, 36, 56];
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[0, 0, 0], [W, D + 2, 0], [W, 0, 0], [0, D, 0], [6 - CR, 6, PZ - 14], [6 + CR, 6, PZ - 14], [6, 6 - CR, PZ - 14], [6, 6 + CR, PZ - 14], [6, 6, PZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y0, y1, r) => {
    const ring = (y, rr) => Array.from({ length: 32 }, (_, i) => { const t = (i / 32) * 2 * Math.PI; return P(x + rr * Math.cos(t), y, Z0 + rr * Math.sin(t)); });
    mk("path", { d: poly(hull(ring(y0, r).concat(ring(y1, r)))), class: "sil" }, g);
    mk("path", { d: poly(ring(y1, r - 2.5)), class: "nf lo" }, g);
    mk("path", { d: poly(ring(y1, 2)), class: "nf" }, g);
  };
  // far wheels first, then the body, then the near wheels
  wheel(16, -1, 1.5, 11); wheel(56, -1, 1.5, 11);
  const [br, bi] = rings(0, 0, W, D, 6, 2);
  put(solid(g), prism(P, front, br, bi, Z0, ZT));
  mk("path", { d: open([P(4, D, Z0 + 10), P(W - 4, D, Z0 + 10)]), class: "nf lo" }, g);
  wheel(16, D - 1.5, D + 2, 11); wheel(56, D - 1.5, D + 2, 11);
  // the parasol's pole, at the far corner
  put(solid(g), prism(P, front, disc(6, 6, 1.4, 12), disc(6, 6, 0.8, 12), ZT, PZ - 4));

  const items = TUBS.map((x, k) => {
    const grp = mk("g", {}, g), y = D / 2;
    mk("path", { d: poly(ringAt(P, disc(x, y, LR + 1), ZT)), class: "nf lo" }, grp);
    const mound = [];
    for (const [r, z] of [[7, 0], [6, 2.5], [4, 4.5], [1.5, 5.4]]) mound.push(...ringAt(P, disc(x, y, r, 20), ZT + z));
    mk("path", { d: poly(hull(mound)), class: "nf" }, grp);
    const lid = solid(grp), knob = solid(grp), rest = k === FAV ? LIFT * 0.55 : 0;
    return { k, x, y, lid, knob, rest, z: tween(rest), last: NaN };
  });

  // the canopy, painted last: it is above everything
  const cg = mk("g", {}, svg), rim = circ(CR, 48).map((q) => ({ ...q, u: q.u + 6, v: q.v + 6 }));
  mk("path", { d: poly(hull(ringAt(P, disc(6, 6, 2, 12), PZ).concat(ringAt(P, rim, PZ - 14)))), class: "sil" }, cg);
  const apex = P(6, 6, PZ);
  for (let i = 0; i < 8; i++) { const t = (i / 8) * 2 * Math.PI + 0.39, q = { u: 6 + CR * Math.cos(t), v: 6 + CR * Math.sin(t) }; if (front({ nu: Math.cos(t), nv: Math.sin(t) })) mk("path", { d: seg(apex, P(q.u, q.v, PZ - 14)), class: "nf lo" }, cg); }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const b = ZT + lift;
    put(it.lid, prism(P, front, disc(it.x, it.y, LR), disc(it.x, it.y, LR - 1.2), b, b + LH));
    put(it.knob, prism(P, front, disc(it.x, it.y, 2.2, 14), disc(it.x, it.y, 1.4, 14), b + LH, b + LH + 2.5));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, ZT);
    if (wy < -6 || wy > D + 6) return -1;
    let best = -1, bd = 14;
    items.forEach((it, k) => { const dd = Math.abs(it.x - wx); if (dd < bd) { bd = dd; best = k; } });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? it.rest : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tub " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "icecreamcart",
  means: "An ice cream cart under a parasol: the lid of the tub under the pointer lifts off to show the scoop.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[178, 166], [202, 178], [227, 191], null],
  mount,
});
