/**
 * Cable cars: a cable line hung between a low tower and a tall one on a rock,
 * with three cabins on hangers along the sagging cable. The cabins slide
 * along the cable toward the pointer's place on it, each on a spring, and
 * the nearest is bright. At rest the middle cabin is bright. The slider is
 * the pull.
 *
 * The pattern: a rate along a line (slide); the pointer is read against the
 * cable's fixed ends, never against a cabin.
 */
const {
  Cam, clamp, fit, facing, hull, lerp, open, poly, prism, proj, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 150, ZA = 50, ZB = 82, SAG = 16, HB = 14, U0 = [0.24, 0.5, 0.77], ROCK = 22;
const M = [Math.SQRT1_2, -Math.SQRT1_2];
const at = (u) => [u * L * M[0] - (L / 2) * M[0], u * L * M[1] - (L / 2) * M[1]];
const cz = (u) => lerp(ZA, ZB, u) - SAG * 4 * u * (1 - u);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let pull = value, over = null;
  const C = Cam(45, 0.5, 1.9);
  const A = at(0), Bp = at(1);
  fit(C, [[A[0] - 14, A[1] + 14, 0], [Bp[0] + 14, Bp[1] - 14, 0], [...A, ZA + 6], [...Bp, ZB + 6], [...at(0.5), cz(0.5) - HB - 12]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const tower = (b, z0, z1) => {
    const ring = (r, z) => Array.from({ length: 24 }, (_, i) => { const t = (i / 24) * Math.PI * 2; return P(b[0] + r * Math.cos(t), b[1] + r * Math.sin(t), z); });
    mk("path", { d: poly(hull(ring(4, z0).concat(ring(1.6, z1)))), class: "sil" }, g);
    const [r, i] = rings(b[0] - 5, b[1] - 2, b[0] + 5, b[1] + 2, 1.2, 0.5);
    put(solid(g), prism(P, front, r, i, z1, z1 + 3));
  };
  { const [r, i] = rings(Bp[0] - 14, Bp[1] - 14, Bp[0] + 14, Bp[1] + 14, 6, 2); put(solid(g), prism(P, front, r, i, 0, ROCK)); }
  tower(Bp, ROCK, ZB);
  { const [r, i] = rings(A[0] - 10, A[1] - 10, A[0] + 10, A[1] + 10, 4, 1.5); put(solid(g), prism(P, front, r, i, 0, 4)); }
  tower(A, 4, ZA);
  const pts = Array.from({ length: 41 }, (_, i) => { const u = i / 40, p = at(u); return P(p[0], p[1], cz(u)); });
  mk("path", { d: open(pts), class: "nf sil" }, g);

  const cabs = U0.map((u0, k) => {
    const grp = mk("g", {}, g), hang = mk("path", { class: "nf lo" }, grp), el = solid(grp), band = mk("path", { class: "nf lo" }, grp);
    return { k, grp, hang, el, band, u: spring(u0, { eps: 0.0005 }), last: NaN };
  });

  function draw(c) {
    const u = c.u.x;
    if (u === c.last) return;
    c.last = u;
    const p = at(u), z = cz(u), top = z - HB;
    c.hang.setAttribute("d", seg(P(p[0], p[1], z), P(p[0], p[1], top)) + seg(P(p[0] - 2, p[1] - 2, z + 0.6), P(p[0] + 2, p[1] + 2, z - 0.6)));
    const [r, i] = rings(p[0] - 6, p[1] - 6, p[0] + 6, p[1] + 6, 2.4, 1);
    put(c.el, prism(P, front, r, i, top - 12, top));
    c.band.setAttribute("d", open(r.filter(front).map((q) => P(q.u, q.v, top - 4))));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const c of cabs) { if (stepS(c.u, dt)) m = true; draw(c); }
    return m;
  });
  bag.add(B.unregister);

  const sA = P(...A, ZA), sB = P(...Bp, ZB);
  function retarget() {
    let up = null;
    if (over) {
      const u = (over[0] - sA[0]) / (sB[0] - sA[0]), line = lerp(sA[1], sB[1], clamp(u, 0, 1));
      if (u > -0.1 && u < 1.1 && over[1] > line - 40 && over[1] < line + 90) up = clamp(u, 0, 1);
    }
    cabs.forEach((c, k) => { c.u.t = up === null ? U0[k] : lerp(U0[k], up, pull); });
    let mark = cabs[1];
    if (up !== null) mark = cabs.reduce((a, b) => (Math.abs(b.u.t - up) < Math.abs(a.u.t - up) ? b : a));
    for (const c of cabs) c.el.sil.classList.toggle("hi", c === mark);
    read.textContent = up === null ? "rest" : "cabin " + (mark.k + 1);
    B.wake();
  }
  bag.add(pointer(stage, { move: (p) => { over = p; retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { pull = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "cablecars",
  means: "Three cable car cabins on a line between two towers: the cabins slide along the cable toward the pointer, the nearest bright.",
  rules: [1, 3, 5, 8],
  range: [0.15, 0.35, 0.55],
  tour: [[125, 190], [276, 165], [200, 200], null],
  mount,
});
