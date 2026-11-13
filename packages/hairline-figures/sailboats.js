/**
 * Sailboats: a small harbour, four boats moored bow-in to a jetty on calm
 * water, each a pointed hull, a mast and a triangular sail on its boom. The
 * pointer is the wind: every sail swings toward it on its own spring, held
 * within the boom's reach, and the boat nearest it is bright. At rest the
 * sails lie aft, each a little off, one boat bright. The slider is how
 * quickly the sails follow (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (Office chairs); the hit is on the water's
 * plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, open, poly, prism, proj, ringAt, rings, run, unproj,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const BOATS = [[-42, -12, -80, 22], [-14, -4, -96, -16], [16, -10, -86, 30], [44, 0, -100, -24]], FAV = 1;
const LH = 15, BH = 5.4, MAST = 2.4, MZ = 44, BOOM = 19, REACH = 1.9;
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
/** A hull's footprint, bow toward +u, scaled; normals from the outline's own tangent. */
const lens = (su, sv) => {
  const pts = [];
  for (let i = 0; i < 40; i++) { const t = (i / 40) * Math.PI * 2, c = Math.cos(t); pts.push([LH * su * c, BH * sv * Math.sin(t) * (1 - 0.5 * Math.max(0, c))]); }
  return pts.map(([u, v], i) => {
    const [a, b] = pts[(i + 39) % 40], [c, d] = pts[(i + 1) % 40], du = c - a, dv = d - b, l = Math.hypot(du, dv);
    return { u, v, nu: dv / l, nv: -du / l };
  });
};
const turn = (ring, a, cx, cy) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.1);
  const ext = [[-64, -48, -2], [64, 26, -2], [64, -48, -2], [-64, 26, -2]];
  for (const [x, y] of BOATS) ext.push([x, y, MZ], [x - BOOM, y + BOOM, 6], [x + BOOM, y - BOOM, 6]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1) => { const s = solid(g), [o, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, o, i, z0, z1)); return s; };

  // the water, the jetty's posts, then its deck
  block(-64, -48, 64, 26, 8, 1.6, -2, 0);
  for (let x = -54; x <= 54; x += 18) put(solid(g), prism(P, front, circ(1.4, 16).map((q) => ({ ...q, u: q.u + x, v: q.v - 37.5 })), null, 0, 2.6));
  block(-62, -46, 58, -37, 1.6, 0.8, 2.4, 4.4);

  const FOOT = lens(0.72, 0.6), TOP = lens(1, 1), INNER = lens(0.9, 0.72), MASTR = circ(0.8, 12);
  const boats = BOATS.map(([x, y, hd, off], k) => {
    const h = (hd * Math.PI) / 180, stern = h + Math.PI, rest = stern + (off * Math.PI) / 180;
    return { k, x, y, h, stern, rest, sp: spring(rest, { k: 100 * value, c: 18 * Math.sqrt(value) }), drawn: NaN, first: null };
  });
  for (const b of [...boats].sort((p, q) => p.x + p.y - (q.x + q.y))) {
    const grp = mk("g", {}, g), T = (r) => turn(r, b.h, b.x, b.y);
    b.hull = solid(grp);
    put(b.hull, { sil: poly(hull(ringAt(P, T(FOOT), 0).concat(ringAt(P, T(TOP), 4)))), crease: open(ringAt(P, run(T(INNER), front), 4)) });
    b.mx = b.x + MAST * Math.cos(b.h); b.my = b.y + MAST * Math.sin(b.h);
    b.sail = solid(grp);
    b.mast = solid(grp);
    put(b.mast, prism(P, front, MASTR.map((q) => ({ ...q, u: q.u + b.mx, v: q.v + b.my })), null, 4, MZ));
  }

  function draw(b) {
    const a = b.sp.x;
    if (Math.abs(a - b.drawn) < 1e-4) return;
    b.drawn = a;
    const ex = b.mx + BOOM * Math.cos(a), ey = b.my + BOOM * Math.sin(a);
    const tri = [P(b.mx, b.my, 6), P(b.mx, b.my, MZ - 2), P(ex, ey, 6)];
    put(b.sail, { sil: poly(fillet(tri, [1.2, 1.2, 1.2])), crease: open([P(b.mx, b.my, 7.4), P(ex - Math.cos(a) * 1.4, ey - Math.sin(a) * 1.4, 7.4)]) });
    // the sail is painted before the mast when it swings to the far side
    const first = Math.cos(a) + Math.sin(a) < 0;
    if (first !== b.first) { b.first = first; if (first) b.mast.g.before(b.sail.g); else b.sail.g.before(b.mast.g); }
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const b of boats) { if (stepS(b.sp, dt)) m = true; draw(b); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null, bd = Infinity;
    for (const b of boats) {
      let aim = b.rest;
      if (over) {
        const d = Math.hypot(over[0] - b.x, over[1] - b.y);
        if (d < bd) { bd = d; near = b; }
        aim = b.stern + clamp(wrap(Math.atan2(over[1] - b.my, over[0] - b.mx) - b.stern), -REACH, REACH);
      }
      b.sp.t = b.sp.t + wrap(aim - b.sp.t);
    }
    for (const b of boats) {
      const on = over ? b === near : b.k === FAV;
      b.sail.sil.classList.toggle("hi", on);
      b.hull.sil.classList.toggle("hi", on);
    }
    read.textContent = near ? "boat " + (near.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { over = unproj(C, p[0], p[1], 0); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const b of boats) { b.sp.k = 100 * v; b.sp.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "sailboats",
  means: "Four sailboats moored at a jetty: every sail swings toward the pointer like wind, and the boat nearest it is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[222, 188], [140, 160], [262, 215], null],
  mount,
});
