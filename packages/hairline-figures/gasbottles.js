/**
 * Gas cylinders: four tall bottles standing on the plinth of a storage cage,
 * a meshed back wall behind them. The pointer picks a bottle by where it is
 * along the row: it tips forward on the front of its foot, as if drawn out
 * of the cage, and the bottles beside it rock after it, staggered from it.
 * At rest they lean a little this way and that, one bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row; the hit is on a fixed plane
 * across the bottles' resting middles.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rad, rings, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 14, X0 = 7, YC = 2, R = 6, H = 30, BZ = 2;
const REST = [2, -3, 5, 0], FAV = 1, TIP = 26;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.25);
  fit(C, [[-3, -9, 0], [57, 12, 0], [57, -9, 0], [-3, 12, 0], [-3, -9, 44], [57, -9, 44], [X0, 22, 34], [X0 + 42, 22, 34]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the cage: a meshed back wall, then the plinth
  const [wr, wi] = rings(-3, -9, 57, -7, 0.8, 0.4);
  const wall = solid(g);
  put(wall, prism(P, front, wr, wi, 0, 44));
  let mesh = "";
  for (let x = 4; x < 56; x += 6) mesh += seg(P(x, -7, 4), P(x, -7, 41));
  for (let z = 8; z < 42; z += 6) mesh += seg(P(0, -7, z), P(54, -7, z));
  mk("path", { class: "nf lo", d: mesh }, wall.g);
  const [pr, pi] = rings(-3, -7, 57, 12, 3, 1.2);
  put(solid(g), prism(P, front, pr, pi, 0, BZ));

  // a bottle's rings, foot to valve: [radius, height]
  const prof = [[R, 0], [R, H], [R * 0.96, H + 1.6], [R * 0.85, H + 3], [R * 0.62, H + 4.2], [R * 0.3, H + 4.8]];
const valve = [[1.7, H + 4], [1.7, H + 8.5]];
  const c32 = circ(1, 32);
  const bot = [];
  for (let k = 0; k < N; k++) {
    const bg = mk("g", {}, g);
    bot.push({ x: X0 + k * STEP, sil: mk("path", { class: "sil" }, bg), cr: mk("path", { class: "nf lo" }, bg), v: mk("path", {}, bg), a: tween(REST[k]), last: NaN });
  }
  function tilt(x, deg, u, v, z) {
    const c = Math.cos(rad(deg)), s = Math.sin(rad(deg)), w = v - R;
    return P(x + u, YC + R + w * c + z * s, BZ + z * c - w * s);
  }
  function draw(b, deg) {
    if (deg === b.last) return;
    b.last = deg;
    let pts = [];
    prof.forEach(([r, z]) => c32.forEach((s) => pts.push(tilt(b.x, deg, s.u * r, s.v * r, z))));
    b.sil.setAttribute("d", poly(hull(pts)));
    const vp = [];
    valve.forEach(([r, z]) => c32.forEach((s) => vp.push(tilt(b.x, deg, s.u * r, s.v * r, z))));
    b.v.setAttribute("d", poly(hull(vp)));
    const band = c32.filter((s) => s.v > 0 || s.u > 0.7 || s.u < -0.7).filter((s) => s.v > -0.2);
    b.cr.setAttribute("d", open(band.sort((p, q) => Math.atan2(p.v, p.u) - Math.atan2(q.v, q.u)).map((s) => tilt(b.x, deg, s.u * (R - 0.4), s.v * (R - 0.4), H - 2))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    bot.forEach((b) => { draw(b, tval(b.a, now)); if (!tdone(b.a, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H * 0.6);
    if (x < -5 || x > 59 || y < -10 || y > 14) return -1;
    return clamp(Math.round((x - X0) / STEP), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    bot.forEach((b, k) => {
      const d = Math.abs(k - a);
      tset(b.a, a < 0 ? REST[k] : d === 0 ? TIP : REST[k] + Math.max(0, 10 - 4 * d), now, from < 0 ? 0 : d * stag);
      b.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "cyl " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "gasbottles",
  means: "Gas cylinders in a cage: the bottle under the pointer tips forward out of the row, the bottles beside it rock after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[153, 155], [185, 171], [249, 203], null],
  mount,
});
