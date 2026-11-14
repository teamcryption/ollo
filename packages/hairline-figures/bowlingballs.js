/**
 * Bowling balls: five balls resting on a ball return's twin rails. The
 * pointer picks a ball by where it stands: it lifts off the rails, turning
 * its finger holes up, and the balls beside it rise a little, staggered from
 * it. At rest one ball sits raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 30, R = 13, LIFT = 20, FAV = 2, RZ = 10;
const X1 = (N - 1) * STEP + 2 * R;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-6, -2, 0], [X1 + 6, 2 * R + 2, 0], [X1 + 6, -2, 0], [-6, 2 * R + 2, 0], [R, R, RZ + 2 * R + LIFT], [X1 - R, R, RZ + 2 * R + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the return: a low base and two rails the balls sit across
  const [br, bi] = rings(-6, -2, X1 + 6, 2 * R + 2, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  const [r1, i1] = rings(-4, 4, X1 + 4, 8, 2, 0.8);
  put(solid(g), prism(P, front, r1, i1, 4, RZ));
  const [r2, i2] = rings(-4, 2 * R - 8, X1 + 4, 2 * R - 4, 2, 0.8);
  put(solid(g), prism(P, front, r2, i2, 4, RZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R, grp = mk("g", {}, g);
    const ball = mk("path", { class: "sil" }, grp), holes = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, grp, ball, holes, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN, spin: 0.3 + k * 1.1 });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const cz = RZ - 3 + R + lift, pts = [];
    for (let i = -6; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(it.x, it.y, R * Math.cos(t), 28), cz + R * Math.sin(t))); }
    it.ball.setAttribute("d", poly(hull(pts)));
    // three finger holes on the cap; the grip turns up as the ball lifts
    const tilt = 1.15 - (lift / LIFT) * 0.75, a0 = it.spin + lift / 12;
    let d = "";
    [[0, 2.2], [0.5, 1.7], [-0.5, 1.7]].forEach(([da, hr], j) => {
      const el = tilt + (j === 0 ? 0.3 : 0), az = a0 + da;
      const hx = it.x + R * Math.sin(el) * Math.cos(az), hy = it.y + R * Math.sin(el) * Math.sin(az), hz = cz + R * Math.cos(el);
      d += poly(ringAt(P, disc(hx, hy, hr, 12), hz));
    });
    it.holes.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, RZ + R));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.ball.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "ball " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "bowlingballs",
  means: "Five balls on a ball return: the one under the pointer lifts, turning its finger holes up, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[126, 130], [190, 162], [274, 204], null],
  mount,
});
