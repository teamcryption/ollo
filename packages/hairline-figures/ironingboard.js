/**
 * Ironing board: a padded board with a tapered nose on crossed legs, a steam
 * iron standing on it and a folded shirt at its wide end. The pointer is
 * where the iron should press: the iron glides along the board to it on a
 * spring and is bright. At rest the iron stands a little past the middle and
 * the folded shirt is the bright mark. The slider is how quickly it follows.
 *
 * The pattern: a continuous position (terrain's spring, on one number); the
 * hit is on the board's top plane, which never moves.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rings, run, ringAt, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L0 = -64, L1 = 60, HW = 15, TOP = 44, IX0 = -44, IX1 = 18, REST = -6;
const FOOT = [[9, -6.5], [9, 6.5], [-3, 6.5], [-12, 0], [-3, -6.5]];
/** A closed polygon of [x, y] as a ring of samples with outward normals. */
function ring(pts) {
  const m = pts.length; let A = 0;
  for (let i = 0; i < m; i++) { const a = pts[i], b = pts[(i + 1) % m]; A += a[0] * b[1] - b[0] * a[1]; }
  const sg = A > 0 ? 1 : -1;
  return pts.map((p, i) => {
    const a = pts[(i + m - 1) % m], b = pts[(i + 1) % m], nu = (b[1] - a[1]) * sg, nv = -(b[0] - a[0]) * sg, n = Math.hypot(nu, nv) || 1;
    return { u: p[0], v: p[1], nu: nu / n, nv: nv / n };
  });
}
const shape = (pts, r, dx = 0, s = 1, du = 0) => ring(fillet(pts.map(([u, v]) => [dx + du + u * s, v * s]), pts.map(() => r), 4));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[L0, -HW, TOP], [L1, HW, TOP], [L1, -HW, TOP + 16], [L0, HW, TOP + 16], [-36, 12, 0], [18, 12, 0], [-36, -12, 0], [18, -12, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // crossed legs, a foot bar at each end and the pivot, behind the board
  const legs = [];
  for (const y of [-9, 9]) { legs.push(seg(P(-34, y, 0), P(16, y, TOP - 3)), seg(P(16, y, 0), P(-34, y, TOP - 3))); }
  legs.push(seg(P(-34, -12, 0), P(-34, 12, 0)), seg(P(16, -12, 0), P(16, 12, 0)));
  mk("path", { class: "nf sil", d: legs.join("") }, g);
  mk("path", { class: "nf lo", d: seg(P(-9, -10, 20.5), P(-9, 10, 20.5)) }, g);

  const BOARD = [[L0, 0], [L0 + 24, -HW], [L1, -HW], [L1, HW], [L0 + 24, HW]];
  const INNER = [[L0 + 2.5, 0], [L0 + 25, -HW + 1.6], [L1 - 1.6, -HW + 1.6], [L1 - 1.6, HW - 1.6], [L0 + 25, HW - 1.6]];
  put(solid(g), prism(P, front, ring(fillet(BOARD, [9, 10, 3, 3, 10], 4)), ring(fillet(INNER, [8, 9, 2, 2, 9], 4)), TOP - 2.5, TOP));

  // the iron: a soleplate, a tapered body and a handle
  const iron = mk("g", {}, g), sole = solid(iron), body = solid(iron), handle = mk("path", { class: "nf sil" }, iron);
  // the folded shirt, nearer than the iron's whole run
  const shirt = solid(g), [sr, si] = rings(30, -11, 54, 11, 2.5, 1);
  put(shirt, prism(P, front, sr, si, TOP, TOP + 4));
  const col = []; for (let i = 0; i <= 12; i++) { const t = -Math.PI / 2 + (i / 12) * Math.PI; col.push(P(36 - 4.5 * Math.cos(t), 4.5 * Math.sin(t), TOP + 4)); }
  mk("path", { class: "nf lo", d: open(col) + seg(P(36, 0, TOP + 4), P(52, 0, TOP + 4)) }, shirt.g);

  const ix = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const x = ix.x;
    if (Math.abs(x - drawn) < 0.005) return;
    drawn = x;
    put(sole, prism(P, front, shape(FOOT, 3, x), shape(FOOT, 2.4, x, 0.86, 0.6), TOP, TOP + 2));
    const foot = shape(FOOT, 3, x, 0.95), top = shape(FOOT, 2.4, x, 0.7, 2), inner = shape(FOOT, 2, x, 0.6, 2.2);
    put(body, { sil: poly(hull(ringAt(P, foot, TOP + 2).concat(ringAt(P, top, TOP + 8)))), crease: open(ringAt(P, run(inner, front), TOP + 8)) });
    handle.setAttribute("d", open([P(x + 6, 0, TOP + 8), P(x + 5.5, 0, TOP + 14), P(x - 3, 0, TOP + 14.5), P(x - 5.5, 0, TOP + 7.5)]));
  }

  const B = register(stage, (dt) => { const m = stepS(ix, dt); draw(); return m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    ix.t = over == null ? REST : clamp(over, IX0, IX1);
    body.sil.classList.toggle("hi", over != null);
    shirt.sil.classList.toggle("hi", over == null);
    read.textContent = over == null ? "rest" : "iron " + Math.round(((ix.t - IX0) / (IX1 - IX0)) * 100) + "%";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], TOP);
      over = x > L0 - 12 && x < L1 + 12 && Math.abs(y) < HW + 18 ? x : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { ix.k = 100 * v; ix.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "ironingboard",
  means: "An ironing board with an iron and a folded shirt: the iron glides along the board to the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[151, 119], [205, 146], [262, 172], null],
  mount,
});
