/**
 * Hospital beds: a ward of three beds side by side under a ceiling curtain
 * rail, each bed on four casters with a headboard, a footboard, side rails, a
 * mattress in two sections and a pillow on the head section. The pointer
 * picks a bed: its head section raises, and the beds beside it raise a
 * little, staggered from it. At rest the heads sit at different angles, the
 * middle one bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the hit is each bed's
 * rest box, the nearest bed first, which never moves.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, run, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, W = 26, L = 58, SP = 42, HS = 27, ZF = 12, ZM = 15, MT = 5, X1 = (N - 1) * SP + W;
const REST = [16, 40, 6], FAV = 1, UP = 68;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[-8, -12, 0], [X1 + 4, L + 4, 0], [X1 + 4, -12, 0], [-8, L + 4, 0], [-8, -12, 74], [X1 + 6, -12, 74]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1, parent = g) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const el = solid(parent); put(el, prism(P, front, o, i, z0, z1)); return el; };

  // the curtain rail on the ceiling, its hangers, and a curtain gathered at its far end
  const hang = [];
  for (const hx of [4, X1 / 2, X1 - 2]) hang.push(seg(P(hx, -10, 66), P(hx, -10, 74)));
  mk("path", { class: "nf lo", d: hang.join("") }, g);
  const cur = block(-6, -12, 6, -9, 2, 0.8, 20, 64);
  const folds = [];
  for (const fx of [-2, 2]) folds.push(seg(P(fx, -9, 61), P(fx, -9, 23)));
  mk("path", { class: "nf lo", d: folds.join("") }, cur.g);
  block(-8, -11, X1 + 6, -9, 1, 0.4, 64, 66.5);

  const beds = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * SP, x1 = x0 + W, grp = mk("g", {}, g);
    for (const [lx, ly] of [[x0 + 3, 3], [x1 - 3, 3], [x0 + 3, L - 3], [x1 - 3, L - 3]].sort((p, q) => p[0] + p[1] - q[0] - q[1])) {
      put(solid(grp), prism(P, front, disc(lx, ly, 2.4), null, 0, 3.6));
      put(solid(grp), prism(P, front, disc(lx, ly, 1, 12), null, 3.6, ZF));
    }
    block(x0, 0, x1, L, 2, 0.8, ZF, ZM, grp);
    block(x0 - 1, -3, x1 + 1, 0, 1.2, 0.6, ZF, ZF + 24, grp);
    block(x0 - 3, HS + 3, x0 - 1.4, L - 8, 0.7, 0.4, ZM + 1, ZM + 9, grp);
    block(x0 + 1, HS + 0.6, x1 - 1, L - 1, 2, 0.9, ZM, ZM + MT, grp);
    const head = solid(grp), pillow = solid(grp);
    block(x1 + 1.4, HS + 3, x1 + 3, L - 8, 0.7, 0.4, ZM + 1, ZM + 9, grp);
    block(x0 - 1, L, x1 + 1, L + 3, 1.2, 0.6, ZF, ZF + 17, grp);
    const hr = rings(x0 + 1, 0, x1 - 1, HS - 0.6, 2, 0.9), pr = rings(x0 + 4, HS - 14, x1 - 4, HS - 3, 4, 1.4);
    const box = [];
    for (const [bx, by] of [[x0 - 3, -3], [x1 + 3, -3], [x0 - 3, L + 3], [x1 + 3, L + 3]]) box.push(P(bx, by, 0), P(bx, by, 44));
    beds.push({ k, head, pillow, hr, pr, hit: hull(box), t: tween(REST[k]), last: NaN });
  }

  /** A plate on the head section: local u is x, v runs from the hinge to the head, h is height off the section's base. */
  function slab(el, [ring, inner], a, h0, h1) {
    const c = Math.cos(a), s = Math.sin(a);
    const at = (q, h) => P(q.u, HS - q.v * c + h * s, ZM + q.v * s + h * c);
    const sil = poly(hull(ring.map((q) => at(q, h0)).concat(ring.map((q) => at(q, h1)))));
    put(el, { sil, crease: open(run(inner, (q) => front({ ...q, nv: -q.nv })).map((q) => at(q, h1))) });
  }
  function draw(bed, deg) {
    if (deg === bed.last) return;
    bed.last = deg;
    const a = (deg * Math.PI) / 180;
    slab(bed.head, bed.hr, a, 0, MT);
    slab(bed.pillow, bed.pr, a, MT, MT + 4);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const bed of beds) { draw(bed, tval(bed.t, now)); if (!tdone(bed.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const inside = (poly, [x, y]) => poly.every((p, i) => { const q = poly[(i + 1) % poly.length]; return (q[0] - p[0]) * (y - p[1]) - (q[1] - p[1]) * (x - p[0]) >= 0; }) ||
    poly.every((p, i) => { const q = poly[(i + 1) % poly.length]; return (q[0] - p[0]) * (y - p[1]) - (q[1] - p[1]) * (x - p[0]) <= 0; });
  function hit(pt) {
    for (let k = N - 1; k >= 0; k--) if (inside(beds[k].hit, pt)) return k;
    return -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    beds.forEach((bed, k) => {
      const dd = Math.abs(k - a), deg = a < 0 ? REST[k] : dd === 0 ? UP : dd === 1 ? 26 : 8;
      tset(bed.t, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      bed.head.sil.classList.toggle("hi", on);
      bed.pillow.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "bed " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "hospitalbeds",
  means: "A ward of three hospital beds: the head section of the bed under the pointer raises, and its neighbours raise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[165, 116], [219, 169], [230, 240], null],
  mount,
});
