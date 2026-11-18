/**
 * Moving head light: a square base with a turntable, a U-shaped yoke that
 * pans on it, and between the yoke's arms a round head with a wide lens that
 * tilts. The pointer over the light swings it: the yoke pans away across the
 * room and the head tilts up. At rest it faces us, lens bright, dipped a
 * little. The slider is how far the head tilts up.
 *
 * The pattern: one part answering (a pan and tilt on the discrete clock);
 * the hit is on the light's rest box, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, lerp, poly, prism, proj, rad, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BT = 14, YB = 18, AZ = 60, PZ = 44, PAN0 = 45, PAN1 = 5, T0 = -12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tiltMax = clamp(value, 35, 80);
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[-22, -22, 0], [22, 22, 0], [22, -22, 0], [-22, 22, 0], [-26, -26, AZ + 4], [26, 26, PZ], [0, 0, PZ + 22]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the base, its turntable
  const [br, bi] = rings(-22, -22, 22, 22, 7, 1.5);
  put(solid(g), prism(P, front, br, bi, 0, BT));
  mk("path", { class: "nf lo", d: "M" + P(22, -12, BT / 2) + "L" + P(22, 12, BT / 2) }, g);
  put(solid(g), prism(P, front, circ(15, 48), circ(13.6, 48), BT, YB));

  // the moving parts: yoke foot, two arms, the head between them
  const yg = mk("g", {}, g);
  const foot = solid(yg), armA = solid(yg), armB = solid(yg);
  const head = mk("g", {}, yg);
  const body = mk("path", { class: "sil" }, head), lens = mk("path", { class: "nf hi" }, head), lensIn = mk("path", { class: "nf lo" }, head);
  const turn = (ring, th) => ring.map((q) => {
    const c = Math.cos(th), s = Math.sin(th);
    return { u: q.u * -s + q.v * c, v: q.u * c + q.v * s, nu: q.nu * -s + q.nv * c, nv: q.nu * c + q.nv * s };
  });
  const footR = [rrect(-19, -7, 19, 7, 5, 4), rrect(-17.6, -5.6, 17.6, 5.6, 3.6, 4)];
  const armR = (s) => [rrect(s * 13 - 2.5, -7, s * 13 + 2.5, 7, 2.4, 4), rrect(s * 13 - 1.7, -6.2, s * 13 + 1.7, 6.2, 1.6, 4)];
  const ringsA = armR(1), ringsB = armR(-1);

  function draw(t) {
    const th = rad(lerp(PAN0, PAN1, t)), ti = rad(lerp(T0, tiltMax, t));
    put(foot, prism(P, front, turn(footR[0], th), turn(footR[1], th), YB, YB + 5));
    put(armA, prism(P, front, turn(ringsA[0], th), turn(ringsA[1], th), YB + 5, AZ));
    put(armB, prism(P, front, turn(ringsB[0], th), turn(ringsB[1], th), YB + 5, AZ));
    const sv = [-Math.sin(th), Math.cos(th), 0], w = [Math.cos(th), Math.sin(th), 0];
    const d = [w[0] * Math.cos(ti), w[1] * Math.cos(ti), Math.sin(ti)];
    const v = [sv[1] * d[2] - sv[2] * d[1], sv[2] * d[0] - sv[0] * d[2], sv[0] * d[1] - sv[1] * d[0]];
    const ring = (off, r) => Array.from({ length: 32 }, (_, i) => {
      const a = (i / 32) * Math.PI * 2, q = (j) => [0, 0, PZ][j] + d[j] * off + r * (Math.cos(a) * sv[j] + Math.sin(a) * v[j]);
      return P(q(0), q(1), q(2));
    });
    const back = ring(-12, 8.5), mid = ring(4, 10.5), lensR = ring(14, 10.5);
    body.setAttribute("d", poly(hull(back.concat(mid, lensR))));
    lens.setAttribute("d", poly(lensR));
    lensIn.setAttribute("d", poly(ring(14, 7)));
    // paint order: the far arm, the head, the near arm
    const sA = Math.cos(th) + -Math.sin(th);
    if (sA > 0) { yg.append(armB.g, head, armA.g); } else { yg.append(armA.g, head, armB.g); }
  }

  const tw = tween(0);
  let last = NaN;
  const B = register(stage, (_dt, now) => { const t = tval(tw, now); if (t !== last) { last = t; draw(t); } return !tdone(tw, now); });
  bag.add(B.unregister);

  const c0 = P(0, 0, 0), c1 = P(0, 0, AZ);
  function hit([sx, sy]) { return Math.abs(sx - c0[0]) < 95 && sy > c1[1] - 40 && sy < c0[1] + 35 ? 1 : -1; }
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(tw, a < 0 ? 0 : 1, performance.now(), 0);
    if (force) last = NaN;
    read.textContent = a < 0 ? "rest" : "tilt " + Math.round(tiltMax);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tiltMax = clamp(v, 35, 80); setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "movinghead",
  means: "A moving head light: the pointer swings it, the yoke panning away on its base and the head tilting its lens up.",
  rules: [1, 3, 5, 6],
  range: [35, 60, 80],
  tour: [[200, 138], [150, 210], [260, 240], null],
  mount,
});
