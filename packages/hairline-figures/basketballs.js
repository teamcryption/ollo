/**
 * Basketballs: a two-tier ball cart on casters, six balls with their seams
 * resting on pairs of rails, three high at the back and three low at the
 * front. The pointer dribbles: the balls near it bounce up, each on its own
 * spring, the one under it highest and bright. At rest one front ball sits a
 * little raised and bright. The slider is the reach, in ball widths.
 *
 * The pattern: a continuous field over stepped parts; the hit is the pointer
 * against each ball's resting screen centre, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, open, prism, proj, rings, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid, r2,
} = HL;

const R = 11, XS = [0, 25, 50], X0 = -15, X1 = 65, YB = -14, YF = 14, Y0 = -24, Y1 = 26;
const ZF = 22, ZK = 50, CF = ZF + 2.4 + 8.5, CK = ZK + 2.4 + 8.5, LMAX = 24;
const REST = [2, 0, 4, 7, 1, 3], FAV = 3, V = [0.6124, 0.6124, 0.5];
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.62 : u <= 1 ? 0.38 - ((u - 0.45) / 0.55) * 0.38 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value * 2 * R, over = null;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[X0, Y0, 0], [X1, Y1, 0], [X0, Y1, 0], [X1, Y0, 0], [X0, Y0, CK + R + LMAX], [X1, Y0, CK + R + LMAX]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  const post = (x, y, z1) => {
    put(solid(g), prism(P, front, circ(3, 16).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), null, 0, 6));
    put(solid(g), prism(P, front, circ(1.8, 16).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), null, 6, z1));
  };
  const railX = (y, z) => block(X0, y - 1.3, X1, y + 1.3, 1.2, 0.5, z, z + 2.4);
  const railY = (x, z) => block(x - 1.3, Y0, x + 1.3, Y1, 1.2, 0.5, z, z + 2.4);

  // seams: two great circles and two side curves, in each ball's own turn
  const seamPts = (b) => {
    const s = Math.sin(b), c = Math.cos(b), out = [];
    const ax = [c, s, 0], ay = [-s, c, 0], az = [0, 0, 1];
    const curve = (o, u, v, r) => {
      const pts = [];
      for (let a = 0; a <= 48; a++) { const t = (a / 48) * Math.PI * 2; pts.push([0, 1, 2].map((k) => o[k] + r * (u[k] * Math.cos(t) + v[k] * Math.sin(t)))); }
      return pts;
    };
    out.push(curve([0, 0, 0], ay, az, 1), curve([0, 0, 0], ax, ay, 1));
    for (const sg of [-1, 1]) out.push(curve(ax.map((k) => k * sg * 0.62), ay, az, 0.78));
    return out;
  };
  const seamPath = (ball, z) => {
    let d = "";
    for (const pts of ball.seams) {
      let runp = [];
      for (const p of pts) {
        if (p[0] * V[0] + p[1] * V[1] + p[2] * V[2] > 0.05) runp.push(P(ball.x + p[0] * R, ball.y + p[1] * R, z + p[2] * R));
        else { if (runp.length > 1) d += open(runp); runp = []; }
      }
      if (runp.length > 1) d += open(runp);
    }
    return d;
  };

  const balls = [];
  const addBall = (i, x, y, z) => {
    const grp = mk("g", {}, g);
    const b = { i, x, y, z, sp: spring(REST[i], { eps: 0.02 }), drawn: NaN, seams: seamPts(0.4 + i * 1.1) };
    b.body = mk("ellipse", { class: "sil", rx: r2(R * C.S), ry: r2(R * C.S) }, grp);
    b.seam = mk("path", { class: "nf lo", d: "" }, grp);
    b.c = P(x, y, z);
    balls[i] = b;
  };

  // back to front: casters and back posts, far side, back tier, front tier, near side
  for (const [x, y] of [[X0, Y0], [X1, Y0], [X0, Y1], [X1, Y1]]) place(flatDot(g, C, 2.2, "dot off"), P(x, y, 0));
  post(X0, Y0, ZK + 18); post(X1, Y0, ZK + 18);
  railX(Y0, 10); railX(Y0, ZK + 16);
  railY(X0, 10); railY(X0, ZF); railX(YB - 7, ZK); railX(YB + 7, ZK);
  block(X0, Y0, X0 + 2.6, YB + 8, 1.2, 0.5, ZK, ZK + 2.4);
  XS.forEach((x, k) => addBall(k, x, YB, CK));
  railX(YF - 7, ZF); railX(YF + 7, ZF);
  XS.forEach((x, k) => addBall(3 + k, x, YF, CF));
  post(X0, Y1, ZF + 10);
  railX(Y1, 10);
  block(X1 - 2.6, Y0, X1, YB + 8, 1.2, 0.5, ZK, ZK + 2.4);
  railY(X1, 10); railY(X1, ZF);
  post(X1, Y1, ZF + 10);

  function draw(b) {
    const l = clamp(b.sp.x, -1, LMAX * 1.5);
    if (Math.abs(l - b.drawn) < 0.01) return;
    b.drawn = l;
    const [sx, sy] = P(b.x, b.y, b.z + l);
    b.body.setAttribute("cx", r2(sx)); b.body.setAttribute("cy", r2(sy));
    b.seam.setAttribute("d", seamPath(b, b.z + l));
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const b of balls) { if (stepS(b.sp, dt)) m = true; draw(b); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    let hit = null, bd = R * C.S * 1.15;
    if (over) for (const b of balls) { const d = Math.hypot(over[0] - b.c[0], over[1] - b.c[1]); if (d < bd) { bd = d; hit = b; } }
    for (const b of balls) {
      if (!over) b.sp.t = REST[b.i];
      else b.sp.t = b === hit ? LMAX : LMAX * 0.7 * falloff(Math.hypot(over[0] - b.c[0], over[1] - b.c[1]) / (RAD * C.S));
      b.body.classList.toggle("hi", over ? b === hit : b.i === FAV);
    }
    read.textContent = hit ? "ball " + (hit.i + 1) : "rest";
    B.wake();
  }

  const box = [P(X0, Y1, 0)[0] - 10, P(X1, Y0, 0)[0] + 10, P(X0, Y0, CK + R + 6)[1], P(X1, Y1, 0)[1] + 8];
  bag.add(pointer(stage, {
    move: (p) => { over = p[0] > box[0] && p[0] < box[1] && p[1] > box[2] && p[1] < box[3] ? p : null; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v * 2 * R; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "basketballs",
  means: "A two-tier cart of basketballs: the balls near the pointer bounce up, the one under it highest and bright.",
  rules: [1, 3, 5, 9],
  range: [1, 1.6, 3],
  tour: [[141, 158], [167, 95], [236, 227], null],
  mount,
});
