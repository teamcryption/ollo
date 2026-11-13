/**
 * Excavator: a tracked digger beside a dirt mound, two track pods under a
 * turntable, a house with its cab, and a boom, stick and bucket on pins. The
 * pointer is a spot on the ground to dig: the house swings toward it and the
 * boom and stick reach for it, each on its own spring, bucket bright. At rest
 * the bucket sits in the mound. The slider is how quickly the arm follows.
 *
 * The pattern: a continuous aim (springs on swing, boom and stick angles from
 * a two-link reach); the hit is on the ground plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, poly, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PZ = 15, PX = 10, L1 = 36, L2 = 28, DMIN = 24, DMAX = 54, MOUND = [50, -36];
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function solve(x, y) {
  const yaw = Math.atan2(y, x), d = clamp(Math.hypot(x, y), DMIN, DMAX), h = d - PX - 6, dz = 6 - PZ;
  const D = clamp(Math.hypot(h, dz), 12, L1 + L2 - 1);
  const a = Math.atan2(dz, h) + Math.acos(clamp((L1 * L1 + D * D - L2 * L2) / (2 * L1 * D), -1, 1));
  const e = Math.acos(clamp((L1 * L1 + L2 * L2 - D * D) / (2 * L1 * L2), -1, 1));
  return [yaw, a, a - (Math.PI - e), d];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.2);
  const ext = [[-24, -18, 0], [24, 18, 0], [-24, 18, 0], [MOUND[0] + 22, MOUND[1] - 22, 0], [0, 0, 56]];
  for (let k = 0; k < 8; k++) { const t = (k / 8) * Math.PI * 2; ext.push([DMAX * Math.cos(t), DMAX * Math.sin(t), 0]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const foot = circ(24, 40).map((q) => ({ ...q, u: q.u + MOUND[0], v: q.v + MOUND[1] }));
  const top = circ(9, 32).map((q) => ({ ...q, u: q.u + MOUND[0] - 2, v: q.v + MOUND[1] + 2 }));
  const ms = solid(g);
  ms.sil.setAttribute("d", poly(hull(foot.map((q) => P(q.u, q.v, 0)).concat(top.map((q) => P(q.u, q.v, 9))))));
  ms.cr.setAttribute("d", poly(top.map((q) => P(q.u, q.v, 9))));
  for (const y0 of [-17, 7]) put(solid(g), prism(P, front, ...rings(-24, y0, 24, y0 + 10, 5, 1.4), 0, 8));
  put(solid(g), prism(P, front, circ(10, 32), circ(8.8, 32), 8, 10));
  const house = mk("g", {}, g), arm = mk("g", {}, g);
  const body = solid(house), cab = solid(house);
  const el = {};
  for (const n of ["boom", "stick", "bucket", "pin"]) el[n] = mk("path", { class: n === "bucket" ? "sil hi" : "sil" }, arm);
  const BODY = rings(-15, -13, 15, 13, 4, 1.4), CAB = rings(-4, -13, 11, -1, 2.6, 1.2);
  const [y0, a0, f0] = solve(MOUND[0] - 6, MOUND[1] + 6), o = { k: 100 * value, c: 18 * Math.sqrt(value) };
  const sy = spring(y0, o), sa = spring(a0, o), sf = spring(f0, o);
  let drawn = "", armFront = null;

  function bar(a, b, r, n = 14) {
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d) || 1, e = d.map((x) => x / L);
    let u = [e[1], -e[0], 0]; const un = Math.hypot(...u) || 1; u = u.map((x) => x / un);
    const v = [e[1] * u[2] - e[2] * u[1], e[2] * u[0] - e[0] * u[2], e[0] * u[1] - e[1] * u[0]];
    const ring = (c) => Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2, co = Math.cos(t), si = Math.sin(t);
      return P(c[0] + r * (co * u[0] + si * v[0]), c[1] + r * (co * u[1] + si * v[1]), c[2] + r * (co * u[2] + si * v[2]));
    });
    return poly(hull(ring(a).concat(ring(b))));
  }

  function draw() {
    const y = sy.x, a = sa.x, f = sf.x, key = [y, a, f].map((x) => x.toFixed(4)).join();
    if (key === drawn) return;
    drawn = key;
    put(body, prism(P, front, turn(BODY[0], y), turn(BODY[1], y), 10, 18));
    put(cab, prism(P, front, turn(CAB[0], y), turn(CAB[1], y), 18, 31));
    const c = Math.cos(y), s = Math.sin(y), dir = (p) => [Math.cos(p) * c, Math.cos(p) * s, Math.sin(p)];
    const add = (p, d, k) => p.map((x, i) => x + d[i] * k), n = [-s, c, 0];
    const S = [PX * c + 4 * -s, PX * s + 4 * c, PZ], E = add(S, dir(a), L1), W = add(E, dir(f), L2);
    el.pin.setAttribute("d", bar(add(S, n, -4), add(S, n, 4), 3.4));
    el.boom.setAttribute("d", bar(S, E, 3));
    el.stick.setAttribute("d", bar(E, W, 2.2));
    const fw = [c, s, 0], pts = [[0, 0], [6, -2], [7, -8], [1, -10], [-3, -5]], ring = [];
    for (const w of [-4, 4]) for (const [hh, zz] of pts) ring.push(P(...add(add(add(W, fw, hh), n, w), [0, 0, 1], zz)));
    el.bucket.setAttribute("d", poly(hull(ring)));
    const af = c + s > -0.2;
    if (af !== armFront) { armFront = af; if (af) house.after(arm); else arm.after(house); }
  }

  const B = register(stage, (dt) => { const m = [sy, sa, sf].map((x) => stepS(x, dt)).some(Boolean); draw(); return m; });
  bag.add(B.unregister);

  function aim(p) {
    const [y, a, f, d] = p ? solve(p[0], p[1]) : solve(MOUND[0] - 6, MOUND[1] + 6);
    sy.t = sy.t + wrap(y - sy.t); sa.t = a; sf.t = f;
    read.textContent = p ? "reach " + Math.round(((d - DMIN) / (DMAX - DMIN)) * 100) + "%" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (q) => {
      const [x, y] = unproj(C, q[0], q[1], 0), r = Math.hypot(x, y);
      aim(r > DMAX + 28 || r < 6 ? null : [x, y]);
    },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return {
    set: (v) => { for (const s of [sy, sa, sf]) { s.k = 100 * v; s.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "excavator",
  means: "A tracked excavator beside a dirt mound: it swings and reaches its boom and stick toward the pointer's spot on the ground.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[96, 221], [112, 135], [158, 246], null],
  mount,
});
