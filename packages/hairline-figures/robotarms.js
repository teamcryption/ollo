/**
 * Robot arms: two industrial arms in a work cell, each a round base, a turret,
 * an upper arm and a forearm on pinned joints, a wrist and a two-finger
 * gripper, beside a table holding one part. The pointer is where the work is:
 * both arms reach toward it, every joint on its own spring, and the nearer
 * arm's gripper is bright. At rest arm 1 grips the part and arm 2 stands
 * folded. The slider is how quickly the joints follow.
 *
 * The pattern: a continuous aim (springs on joint angles from a two-link
 * reach); the hit is on the floor's plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, poly, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SH = 16, L1 = 34, L2 = 30, WR = 7, TZ = 18;
const BASES = [[-30, 6], [30, -6]], PART = [0, -40];
const FLOOR = [-68, -62, 60, 42];
const REST = [[PART[0], PART[1], TZ + 6 + WR + 7], [44, 20, 40]];
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

/** A round bar from a to b, radius r: the hull of its two end rings. */
function bar(P, a, b, r, n = 14) {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d) || 1, e = d.map((x) => x / L);
  let u = Math.abs(e[2]) < 0.9 ? [e[1], -e[0], 0] : [0, e[2], -e[1]];
  const un = Math.hypot(...u); u = u.map((x) => x / un);
  const v = [e[1] * u[2] - e[2] * u[1], e[2] * u[0] - e[0] * u[2], e[0] * u[1] - e[1] * u[0]];
  const ring = (c) => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2, co = Math.cos(t), si = Math.sin(t);
    return P(c[0] + r * (co * u[0] + si * v[0]), c[1] + r * (co * u[1] + si * v[1]), c[2] + r * (co * u[2] + si * v[2]));
  });
  return poly(hull(ring(a).concat(ring(b))));
}

function solve(base, W) {
  const dx = W[0] - base[0], dy = W[1] - base[1], h = Math.hypot(dx, dy), dz = W[2] - SH;
  const D = clamp(Math.hypot(h, dz), 16, L1 + L2 - 1);
  const a = Math.atan2(dz, h) + Math.acos(clamp((L1 * L1 + D * D - L2 * L2) / (2 * L1 * D), -1, 1));
  const e = Math.acos(clamp((L1 * L1 + L2 * L2 - D * D) / (2 * L1 * L2), -1, 1));
  return [Math.atan2(dy, dx), a, a - (Math.PI - e)];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.9);
  const [f0, f1, f2, f3] = FLOOR;
  fit(C, [[f0, f1, -3], [f2, f3, -3], [f2, f1, -3], [f0, f3, -3], ...BASES.map(([x, y]) => [x, y, 58])], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(f0, f1, f2, f3, 6, 2), -3, 0));
  // the table and its part, far side of the cell
  const [tx, ty] = PART;
  for (const [lx, ly] of [[-13, -9], [13, -9], [-13, 9], [13, 9]]) put(solid(g), prism(P, front, circ(1.4, 12).map((q) => ({ ...q, u: q.u + tx + lx, v: q.v + ty + ly })), null, 0, TZ - 2));
  put(solid(g), prism(P, front, ...rings(tx - 16, ty - 12, tx + 16, ty + 12, 3, 1.4), TZ - 2, TZ));
  put(solid(g), prism(P, front, ...rings(tx - 4.5, ty - 4.5, tx + 4.5, ty + 4.5, 1.2, 0.8), TZ, TZ + 6));

  const arms = BASES.map((b, k) => {
    const grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, ...rings(b[0] - 9, b[1] - 9, b[0] + 9, b[1] + 9, 9, 1.6), 0, 4));
    put(solid(grp), prism(P, front, circ(5.5, 24).map((q) => ({ ...q, u: q.u + b[0], v: q.v + b[1] })), null, 4, SH - 3));
    const el = {};
    for (const n of ["sj", "up", "ej", "fo", "wr", "fa", "fb"]) el[n] = mk("path", { class: "sil" }, grp);
    const [y, a, f] = solve(b, REST[k]), o = { k: 100 * value, c: 18 * Math.sqrt(value) };
    return { k, b, el, sy: spring(y, o), sa: spring(a, o), sf: spring(f, o), drawn: "" };
  });

  function draw(arm) {
    const y = arm.sy.x, a = arm.sa.x, f = arm.sf.x, key = [y, a, f].map((x) => x.toFixed(4)).join();
    if (key === arm.drawn) return;
    arm.drawn = key;
    const dir = (p) => [Math.cos(p) * Math.cos(y), Math.cos(p) * Math.sin(y), Math.sin(p)];
    const add = (p, d, s) => p.map((x, i) => x + d[i] * s);
    const S = [arm.b[0], arm.b[1], SH], E = add(S, dir(a), L1), W = add(E, dir(f), L2), G = [W[0], W[1], W[2] - WR];
    const n = [-Math.sin(y), Math.cos(y), 0], { el } = arm;
    el.sj.setAttribute("d", bar(P, add(S, n, -4), add(S, n, 4), 5));
    el.up.setAttribute("d", bar(P, S, E, 3.4));
    el.ej.setAttribute("d", bar(P, add(E, n, -3.4), add(E, n, 3.4), 3.8));
    el.fo.setAttribute("d", bar(P, E, W, 2.6));
    el.wr.setAttribute("d", bar(P, W, G, 2.2));
    el.fa.setAttribute("d", bar(P, add(G, n, -2.6), add(add(G, n, -2), [0, 0, 1], -6), 0.9, 8));
    el.fb.setAttribute("d", bar(P, add(G, n, 2.6), add(add(G, n, 2), [0, 0, 1], -6), 0.9, 8));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const arm of arms) { for (const s of [arm.sy, arm.sa, arm.sf]) if (stepS(s, dt)) m = true; draw(arm); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = arms[0];
    if (over) near = arms.reduce((p, q) => (Math.hypot(over[0] - q.b[0], over[1] - q.b[1]) < Math.hypot(over[0] - p.b[0], over[1] - p.b[1]) ? q : p));
    const onTable = over && Math.abs(over[0] - tx) < 18 && Math.abs(over[1] - ty) < 14;
    for (const arm of arms) {
      const W = over ? [over[0], over[1], onTable ? TZ + 22 : 18] : REST[arm.k];
      const [y, a, f] = solve(arm.b, W);
      arm.sy.t = arm.sy.t + wrap(y - arm.sy.t); arm.sa.t = a; arm.sf.t = f;
      const on = arm === near;
      for (const n of ["wr", "fa", "fb"]) arm.el[n].classList.toggle("hi", on);
    }
    read.textContent = over ? "arm " + (near.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      const out = x < f0 - 20 || x > f2 + 20 || y < f1 - 20 || y > f3 + 20;
      over = out ? null : [clamp(x, f0 + 4, f2 - 4), clamp(y, f1 + 4, f3 - 4)];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const arm of arms) for (const s of [arm.sy, arm.sa, arm.sf]) { s.k = 100 * v; s.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "robotarms",
  means: "Two robot arms in a work cell: both reach toward the pointer, joint by joint, and the nearer arm's gripper is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[240, 201], [190, 150], [160, 225], null],
  mount,
});
