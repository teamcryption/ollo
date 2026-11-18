/**
 * Milking robot: a stall floor with a rail on its far side and, beside it, a
 * robot on a pedestal: a column, a two-link arm and a carrier of four teat
 * cups at its tip. Pointing at it swings the arm into the stall, under where
 * the udder would be. At rest the arm is parked outside, the cups bright. The
 * slider is how far the arm swings in.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rad, rings, unproj, tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid } = HL;

const BX = 70, BY = 66, CZ = 32, L1 = 40, L2 = 26, REST = 12;

function bar(P, A, B, r, n = 12) {
  let d = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
  const dn = Math.hypot(...d); d = d.map((x) => x / dn);
  const k = Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  let u = [d[1] * k[2] - d[2] * k[1], d[2] * k[0] - d[0] * k[2], d[0] * k[1] - d[1] * k[0]];
  const un = Math.hypot(...u); u = u.map((x) => x / un);
  const v = [u[1] * d[2] - u[2] * d[1], u[2] * d[0] - u[0] * d[2], u[0] * d[1] - u[1] * d[0]];
  const ring = (c) => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2, q = (j) => c[j] + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]);
    return P(q(0), q(1), q(2));
  });
  return poly(hull(ring(A).concat(ring(B))));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-6, -6, 0], [134, -6, 0], [134, 80, 0], [-6, 80, 0], [0, 0, 58], [BX, BY, CZ + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-6, -6, 106, 54, 6, 2);
  put(solid(g), prism(P, front, fr, fi, -3, 0));
  for (const x of [0, 50, 100]) mk("path", { class: "sil", d: bar(P, [x, 0, 0], [x, 0, 56], 2.2) }, g);
  for (const z of [30, 56]) mk("path", { class: "sil", d: bar(P, [0, 0, z], [100, 0, z], 1.6) }, g);
  const [pr, pi] = rings(BX - 9, BY - 9, BX + 9, BY + 9, 5, 1.5);
  put(solid(g), prism(P, front, pr, pi, 0, 8));
  const col = mk("path", { class: "sil", d: bar(P, [BX, BY, 8], [BX, BY, CZ + 3], 4.5) }, g);
  const arm = mk("g", {}, g);
  const l1 = mk("path", { class: "sil" }, arm), l2 = mk("path", { class: "sil" }, arm), carrier = mk("path", { class: "sil" }, arm);
  const cups = Array.from({ length: 4 }, () => mk("path", { class: "sil" }, arm));

  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const p = rad(a), q = rad(a * 1.6);
    const e = [BX + L1 * Math.cos(p), BY - L1 * Math.sin(p), CZ];
    const t = [e[0] + L2 * Math.cos(q), e[1] - L2 * Math.sin(q), CZ - 10];
    l1.setAttribute("d", bar(P, [BX, BY, CZ], e, 3.4));
    l2.setAttribute("d", bar(P, e, t, 2.8));
    const [hr, hi] = rings(t[0] - 7, t[1] - 7, t[0] + 7, t[1] + 7, 3, 1);
    carrier.setAttribute("d", prism(P, front, hr, hi, t[2] - 3, t[2]).sil);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([i, j], n) => cups[n].setAttribute("d", bar(P, [t[0] + 4 * i, t[1] + 4 * j, t[2]], [t[0] + 4 * i, t[1] + 4 * j, t[2] + 9], 2)));
    // paint the arm's parts far to near
    [[l1, BX + BY + e[0] + e[1]], [l2, e[0] + e[1] + t[0] + t[1]], [carrier, 2 * (t[0] + t[1]) + 0.1], ...cups.map((c, n) => [c, 2 * (t[0] + t[1]) + 0.2 + n * 0.01])]
      .sort((m, n) => m[1] - n[1]).forEach(([el]) => arm.append(el));
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  // hit on two fixed planes against the rest footprint
  const hit = ([sx, sy]) => {
    for (const z of [0, CZ]) {
      const [x, y] = unproj(C, sx, sy, z);
      if (x > -8 && x < 136 && y > -8 && y < 82) return y > 54 || x > 106 ? 1 : 0;
    }
    return -1;
  };

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a < 0 ? REST : maxA, performance.now(), 0);
    for (const el of [l1, l2]) el.classList.toggle("hi", a >= 0);
    read.textContent = a < 0 ? "rest" : a === 1 ? "arm" : "stall";
    B.wake();
  }
  for (const el of cups) el.classList.add("hi");
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act >= 0) { tset(ang, maxA, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "milkingrobot",
  means: "A milking robot beside a stall: point at it and its arm swings the cup carrier in under the stall.",
  rules: [1, 3, 5, 8],
  range: [50, 75, 95],
  tour: [[289, 230], [215, 175], [150, 160], null],
  mount,
});
