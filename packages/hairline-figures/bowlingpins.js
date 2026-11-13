/**
 * Bowling pins: the ten pins in their triangle on the end of a lane, a ball
 * resting in front of them. The pointer is a near miss: the pins near it tilt
 * away from it, each on its own spring, the one under it most and bright. At
 * rest the head pin wobbles back, bright. The slider is the reach.
 *
 * The pattern: a continuous field (terrain) over a triangle of parts; the hit
 * is on a fixed plane through the pins' bellies, which never moves.
 */
const {
  Cam, clamp, fit, facing, open, poly, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SP = 12, ROW = 10.4, TMAX = 0.5, HZ = 6, BR = 4.3, BALL = [20, 9], X0 = -38, X1 = 30, YW = 22;
// the pin's profile, [height, radius]: foot, belly, neck, head
const PRO = [[0, 1.1], [1.5, 1.8], [3, 2.3], [4.8, 2.45], [6.6, 2.25], [8.5, 1.6], [10, 0.95], [11, 0.9], [12.2, 1.2], [13.3, 1.25], [14.3, 0.95], [15, 0.25]];
const REST = { 1: [-0.24, 0.04], 2: [-0.07, -0.06], 3: [-0.07, 0.06] }, FAV = 1;
const falloff = (u) => (u <= 0 ? 1 : u <= 0.42 ? 1 - (u / 0.42) * 0.69 : u <= 1 ? 0.31 - ((u - 0.42) / 0.58) * 0.31 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value, over = null;
  const C = Cam(45, 0.5, 3.2);
  fit(C, [[X0, -YW, -3], [X1, YW, -3], [X1, -YW, -3], [X0, YW, -3], [-3 * ROW - 6, -20, 17], [-3 * ROW - 6, 20, 17]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the lane's end: a slab, its gutter edges and the deck's board line
  const [lr, li] = rings(X0, -YW, X1, YW, 3, 1.4);
  const lane = solid(g);
  put(lane, prism(P, front, lr, li, -3, 0));
  mk("path", { class: "nf lo", d: open([P(X0 + 3, -17, 0), P(X1 - 3, -17, 0)]) + open([P(X0 + 3, 17, 0), P(X1 - 3, 17, 0)]) + open([P(9, -17, 0), P(9, 17, 0)]) }, lane.g);

  // pins and ball, painted far to near by x + y
  const parts = [];
  for (let r = 0; r < 4; r++) for (let j = 0; j <= r; j++) {
    const n = (r * (r + 1)) / 2 + j + 1, rs = REST[n] || [0, 0];
    parts.push({ n, x: -r * ROW, y: (j - r / 2) * SP, rest: rs, tx: spring(rs[0], { eps: 0.002 }), ty: spring(rs[1], { eps: 0.002 }), last: "" });
  }
  parts.push({ ball: true, x: BALL[0], y: BALL[1] });
  parts.sort((a, b) => a.x + a.y - (b.x + b.y));
  for (const p of parts) {
    p.grp = mk("g", {}, g);
    p.sil = mk("path", { class: "sil" }, p.grp);
    p.cr = mk("path", { class: "nf lo" }, p.grp);
  }
  const pins = parts.filter((p) => !p.ball).sort((a, b) => a.n - b.n);
  const ball = parts.find((p) => p.ball);
  { // the ball: a disc on screen, with its three finger holes turned toward us
    const [cx, cy] = P(ball.x, ball.y, BR), R = BR * C.S, pts = [];
    for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]); }
    ball.sil.setAttribute("d", poly(pts));
    const hole = (u, v, s) => { const q = []; for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; q.push([cx + R * (u + s * Math.cos(a)), cy + R * (v + s * 0.7 * Math.sin(a))]); } return poly(q); };
    ball.cr.setAttribute("d", hole(-0.32, -0.38, 0.11) + hole(0.02, -0.5, 0.11) + hole(-0.08, 0.02, 0.13));
  }

  /** A pin's rings, tipped by the tilt (tx, ty) about the edge of its foot. */
  function ringsOf(p, tx, ty) {
    const th = Math.hypot(tx, ty), dx = th ? tx / th : -1, dy = th ? ty / th : 0, c = Math.cos(th), s = Math.sin(th);
    return PRO.map(([z, r]) => Array.from({ length: 24 }, (_, i) => {
      const t = (i / 24) * Math.PI * 2, u = r * Math.cos(t), v = r * Math.sin(t), a = u * dx + v * dy - 1.1;
      const a2 = a * c + z * s, z2 = -a * s + z * c;
      return P(p.x + u + (a2 - a) * dx, p.y + v + (a2 - a) * dy, z2);
    }));
  }
  /** The near half of a projected ring: the arc between its left and right ends that lies lower on screen. */
  function nearArc(ring) {
    const n = ring.length; let lo = 0, hi = 0;
    ring.forEach((q, i) => { if (q[0] < ring[lo][0]) lo = i; if (q[0] > ring[hi][0]) hi = i; });
    const arc = (a, b) => { const o = []; for (let i = a; ; i = (i + 1) % n) { o.push(ring[i]); if (i === b) break; } return o; };
    const A = arc(lo, hi), Bk = arc(hi, lo), mean = (q) => q.reduce((m, p) => m + p[1], 0) / q.length;
    return mean(A) > mean(Bk) ? A : Bk.reverse();
  }
  function draw(p) {
    const tx = p.tx.x, ty = p.ty.x, key = tx.toFixed(4) + ty.toFixed(4);
    if (key === p.last) return;
    p.last = key;
    const R = ringsOf(p, tx, ty), side = (f) => R.map((ring) => ring.reduce((b, q) => (f(q[0], b[0]) ? q : b)));
    const right = side((a, b) => a > b), left = side((a, b) => a < b);
    p.sil.setAttribute("d", poly(nearArc(R[0]).concat(right.slice(1), left.slice(1).reverse())));
    p.cr.setAttribute("d", open(nearArc(R[6])));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const p of pins) { if (stepS(p.tx, dt)) m = true; if (stepS(p.ty, dt)) m = true; draw(p); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    let hit = null, bd = 6.5;
    if (over) for (const p of pins) { const d = Math.hypot(p.x - over[0], p.y - over[1]); if (d < bd) { bd = d; hit = p; } }
    for (const p of pins) {
      let t = p.rest;
      if (over) {
        const ex = p.x - over[0], ey = p.y - over[1], d = Math.hypot(ex, ey), a = p === hit ? TMAX : TMAX * 0.75 * falloff(d / RAD);
        t = d > 0.6 ? [(a * ex) / d, (a * ey) / d] : [-a, 0];
      }
      p.tx.t = clamp(t[0], -TMAX, TMAX); p.ty.t = clamp(t[1], -TMAX, TMAX);
      p.sil.classList.toggle("hi", over ? p === hit : p.n === FAV);
    }
    read.textContent = hit ? "pin " + hit.n : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (q) => {
      const [x, y] = unproj(C, q[0], q[1], HZ);
      over = x > -3 * ROW - 10 && x < 12 && y > -YW - 2 && y < YW + 2 ? [x, y] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "bowlingpins",
  means: "Ten bowling pins on the lane's end: the pins near the pointer tilt away from it, the one under it most.",
  rules: [1, 3, 5, 9],
  range: [12, 22, 36],
  tour: [[209, 176], [179, 120], [98, 161], null],
  mount,
});
