/**
 * Steel beams: four I-beams laid side by side in a yard, ends staggered.
 * The pointer picks a beam by where it is across the row: the crane takes
 * it up and slews it round, the others shift a little, staggered from it.
 * At rest one beam lies slightly skewed, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is on a fixed plane
 * through the beams' resting tops.
 */
const { Cam, clamp, facing, fit, prism, proj, rings, unproj, tdone, tset, tval, tween, disposer, put, register, solid, mk, pointer } = HL;

const N = 4, L = 34, W = 5, FT = 2, WT = 1.1, H = 11, GAP = 15, LIFT = 26, SWING = 34;
const RX = [0, 7, -4, 3], RROT = [0, 0, 7, 0], FAV = 2;

function rot(ring, cx, cy, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((p) => ({ u: cx + c * p.u - s * p.v, v: cy + s * p.u + c * p.v, nu: c * p.nu - s * p.nv, nv: s * p.nu + c * p.nv }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.0);
  const Y1 = (N - 1) * GAP;
  fit(C, [[-L - 6, -W, 0], [L + 8, Y1 + W, 0], [L + 8, -W, 0], [-L - 6, Y1 + W, 0], [0, GAP, H + LIFT], [-L, GAP, H + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const beams = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    beams.push({ k, grp, parts: [solid(grp), solid(grp), solid(grp)], z: tween(0), a: tween(RROT[k]), dx: tween(RX[k]), last: "" });
  }
  // the three plates of an I: bottom flange, web, top flange, around the beam's centre
  const PLATES = [[W, 0, FT], [WT, FT, H - FT], [W, H - FT, H]];
  function draw(b, z, a, dx) {
    const key = z.toFixed(2) + a.toFixed(2) + dx.toFixed(2);
    if (key === b.last) return;
    b.last = key;
    PLATES.forEach(([hw, z0, z1], i) => {
      const [r, n] = rings(-L, -hw, L, hw, Math.min(1, hw * 0.6), Math.min(0.5, hw * 0.4));
      put(b.parts[i], prism(P, front, rot(r, dx, b.k * GAP, (a * Math.PI) / 180), rot(n, dx, b.k * GAP, (a * Math.PI) / 180), z + z0, z + z1));
    });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    beams.forEach((b) => {
      draw(b, tval(b.z, now), tval(b.a, now), tval(b.dx, now));
      if (!tdone(b.z, now) || !tdone(b.a, now) || !tdone(b.dx, now)) moving = true;
    });
    // the lifted beam is painted last; the rest far to near
    const order = beams.slice().sort((p, q) => (tval(p.z, now) > H * 0.5) - (tval(q.z, now) > H * 0.5) || p.k - q.k);
    order.forEach((b) => { if (g.lastChild !== b.grp) g.appendChild(b.grp); });
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    if (x < -L - 8 || x > L + 10 || y < -W - 6 || y > Y1 + W + 6) return -1;
    return clamp(Math.round(y / GAP), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    beams.forEach((b, k) => {
      const d = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(b.z, a === k ? LIFT : 0, now, d);
      tset(b.a, a < 0 ? RROT[k] : a === k ? SWING : 0, now, d);
      tset(b.dx, a < 0 ? RX[k] : a === k ? 4 : RX[k] - 3 * Math.sign(k - a), now, d);
      b.parts.forEach((p) => p.sil.classList.toggle("hi", k === (a < 0 ? FAV : a)));
    });
    read.textContent = a < 0 ? "rest" : "beam " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "ibeam",
  means: "Four steel I-beams in a row: the crane lifts the beam under the pointer and slews it round, the others shift after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[182, 119], [182, 183], [214, 230], null],
  mount,
});
