/**
 * Spotlights: four stage lamps hung from a truss over a round stage, each a
 * flared can on a yoke. The pointer is where the light should fall: every
 * lamp turns to aim at it, the spot on the stage follows on a spring, and the
 * lamp nearest it is bright. At rest the lamps meet on a spot left of centre.
 * The slider is how quickly the lamps follow (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (terrain's spring, on an angle); the hit is on
 * the stage's plane, which never moves.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const RS = 62, TRUSS = 92, HANG = 12, XS = [-48, -16, 16, 48], LEN = 18, RB = 5, RF = 7.5;
const REST = [-14, 10];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-RS, -RS, -6], [RS, RS, -6], [RS, -RS, -6], [-RS, RS, -6], [-58, 0, TRUSS + 4], [58, 0, TRUSS + 4]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(RS, 72), circ(RS - 2, 72), -6, 0));
  const spotEl = mk("path", { class: "nf hi" }, g);
  // the truss: one bar along x, and the lamps under it, far to near
  const [tr, ti] = rings(-58, -2.5, 58, 2.5, 1.5, 0.6);
  put(solid(g), prism(P, front, tr, ti, TRUSS, TRUSS + 5));
  const lamps = XS.map((x, k) => {
    const yoke = mk("path", { class: "nf sil" }, g), body = mk("path", { class: "sil" }, g), lens = mk("path", { class: "nf" }, g);
    return { k, c: [x, 0, TRUSS - HANG], yoke, body, lens };
  });
  const tx = spring(REST[0], { k: 100 * value, c: 18 * Math.sqrt(value) }), ty = spring(REST[1], { k: 100 * value, c: 18 * Math.sqrt(value) });
  let lastKey = "", over = null;

  /** A can from back (radius RB) to a flared front (RF), along d from its middle. */
  function can(l, d) {
    const [cx, cy, cz] = l.c, z = [0, 0, 1];
    let u = [d[1] * z[2] - d[2] * z[1], d[2] * z[0] - d[0] * z[2], d[0] * z[1] - d[1] * z[0]];
    const un = Math.hypot(...u) || 1; u = u.map((x) => x / un);
    const v = [u[1] * d[2] - u[2] * d[1], u[2] * d[0] - u[0] * d[2], u[0] * d[1] - u[1] * d[0]];
    const ring = (off, r) => Array.from({ length: 24 }, (_, i) => {
      const t = (i / 24) * Math.PI * 2, q = (j) => [cx, cy, cz][j] + d[j] * off + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]);
      return P(q(0), q(1), q(2));
    });
    const back = ring(-LEN / 2, RB), lensRing = ring(LEN / 2, RF);
    l.body.setAttribute("d", poly(hull(back.concat(lensRing))));
    l.lens.setAttribute("d", poly(lensRing));
    l.yoke.setAttribute("d", seg(P(cx, cy, TRUSS), P(cx, cy, cz + RB)));
  }

  function draw() {
    const key = tx.x.toFixed(2) + "," + ty.x.toFixed(2);
    if (key === lastKey) return;
    lastKey = key;
    for (const l of lamps) {
      const d = [tx.x - l.c[0], ty.x - l.c[1], 0 - l.c[2]], n = Math.hypot(...d);
      can(l, d.map((x) => x / n));
    }
    const ring = circ(9, 40).map((q) => P(tx.x + q.u, ty.x + q.v, 0.2));
    spotEl.setAttribute("d", poly(ring));
  }

  const B = register(stage, (dt) => { const a = stepS(tx, dt), b = stepS(ty, dt); draw(); return a || b; });
  bag.add(B.unregister);

  function retarget() {
    const [x, y] = over ?? REST;
    tx.t = x; ty.t = y;
    let near = -1;
    if (over) { let bd = Infinity; lamps.forEach((l, k) => { const dd = Math.abs(l.c[0] - x); if (dd < bd) { bd = dd; near = k; } }); }
    lamps.forEach((l, k) => l.body.classList.toggle("hi", k === near));
    read.textContent = over ? `lamp ${near + 1} · ${Math.round(Math.hypot(x, y))}` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y), k = Math.min(1, (RS - 10) / r);
      over = r > RS + 30 ? null : [x * k, y * k];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { tx.k = ty.k = 100 * v; tx.c = ty.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "spotlights",
  means: "Four stage lamps on a truss: they turn to aim where the pointer is, and the spot follows across the stage.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[140, 230], [260, 230], [200, 260], null],
  mount,
});
