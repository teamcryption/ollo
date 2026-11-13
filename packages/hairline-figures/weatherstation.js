/**
 * Weather station: a mast on a footplate carrying a louvred instrument box,
 * a crossarm with a wind vane (tail fin and counterweight on a rod) and a cup
 * anemometer on top, with a rain gauge standing beside it. The pointer is the
 * wind: the vane turns on a spring to point at it, and the cups spin faster
 * the closer it is (a spring on the rate), slowing to a stop when it leaves.
 * At rest the vane points off to one side, bright, the cups still. The slider
 * is how quickly the vane follows (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (spotlights' spring, on an angle) and a
 * spring on a rate; the hit is the vane's own fixed plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, open, poly, prism, proj, ringAt, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 66, ARM = 50, VX = 24, VZ = 56, AR = 10, CUP = 3.4, REST = 200, PHI = 0.4, GX = 36, GY = -10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[-10, -10, 0], [-10, 10, 0], [GX + 6, GY - 6, 0], [GX + 6, GY + 6, 0], [VX + 20, -20, VZ + 10], [VX - 20, 20, VZ], [-14, 14, H + 8], [14, -14, H + 8], [-10, 12, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); return put(solid(g), prism(P, front, o, i, z0, z1)); };
  box(-9, -9, 9, 9, 3, 1, 0, 2.5);
  box(-1.8, -1.8, 1.8, 1.8, 0.8, 0.4, 2.5, H);
  box(-6, 2, 6, 11, 1.8, 0.8, 22, 38);
  let lv = "";
  for (const z of [26, 30, 34]) lv += seg(P(-4.4, 11, z), P(4.4, 11, z));
  mk("path", { class: "nf lo", d: lv }, g);
  box(-1, -1.2, VX + 1.4, 1.2, 0.6, 0.3, ARM - 2, ARM);
  box(VX - 0.8, -0.8, VX + 0.8, 0.8, 0.4, 0.2, ARM, VZ - 0.6);

  // the vane: a rod, then its tail fin and counterweight painted far to near
  const rod = mk("path", { class: "nf sil" }, g), vb = [mk("path", { class: "sil hi" }, g), mk("path", { class: "sil hi" }, g)];
  // the anemometer: spindle and arms, cups far to near, hub cap last
  mk("path", { class: "nf sil", d: seg(P(0, 0, H), P(0, 0, H + 4)) }, g);
  const arms = mk("path", { class: "nf sil" }, g), cups = [0, 1, 2].map(() => solid(g)), cap = solid(g);
  put(cap, prism(P, front, circ(1.6, 16), circ(1.1, 16), H + 3, H + 5));
  const gauge = solid(g);
  put(gauge, prism(P, front, circ(5, 32).map((q) => ({ ...q, u: q.u + GX, v: q.v + GY })), circ(4.2, 32).map((q) => ({ ...q, u: q.u + GX, v: q.v + GY })), 0, 18));
  mk("path", { class: "nf lo", d: poly(ringAt(P, circ(2.2, 24).map((q) => ({ ...q, u: q.u + GX, v: q.v + GY })), 15)) }, g);

  const vs = { k: 100 * value, c: 18 * Math.sqrt(value) };
  const vane = spring((REST * Math.PI) / 180, vs), rate = spring(0);
  let phi = PHI, lastV = NaN, lastP = NaN, moved = -1e9;

  function drawVane(t) {
    if (Math.abs(t - lastV) < 1e-4) return;
    lastV = t;
    const c = Math.cos(t), s = Math.sin(t), at = (d, z) => P(VX + d * c, d * s, z);
    rod.setAttribute("d", seg(at(-17, VZ), at(13, VZ)));
    const fin = poly(fillet([at(-6, VZ - 0.5), at(-19, VZ - 3), at(-19.5, VZ + 9), at(-12, VZ + 6.5)], [0.6, 1, 1.2, 1.2], 3));
    const w = P(VX + 14 * c, 14 * s, VZ), ball = poly(Array.from({ length: 24 }, (_, i) => [w[0] + 5.4 * Math.cos(i * 0.2618), w[1] + 5.4 * Math.sin(i * 0.2618)]));
    const finFirst = -(c + s) < c + s; // tail farther than the weight
    vb[0].setAttribute("d", finFirst ? fin : ball);
    vb[1].setAttribute("d", finFirst ? ball : fin);
  }
  function drawCups(p) {
    if (Math.abs(p - lastP) < 1e-4) return;
    lastP = p;
    let a = "";
    const list = [0, 1, 2].map((i) => {
      const t = p + (i * 2 * Math.PI) / 3, c = Math.cos(t), s = Math.sin(t), x = AR * c, y = AR * s, z = H + 4;
      a += seg(P(0, 0, z), P(x, y, z));
      // the cup's mouth faces along its turn: a disc in the plane of the arm and the spindle
      const disc = (r) => Array.from({ length: 20 }, (_, j) => { const q = (j / 20) * Math.PI * 2; return P(x + r * Math.cos(q) * c, y + r * Math.cos(q) * s, z + r * Math.sin(q)); });
      return { key: x + y, sil: poly(disc(CUP)), cr: poly(disc(CUP * 0.65)) };
    }).sort((u, v) => u.key - v.key);
    arms.setAttribute("d", a);
    list.forEach((q, i) => put(cups[i], { sil: q.sil, crease: q.cr }));
  }

  const B = register(stage, (dt, now) => {
    if (now - moved > 700) rate.t = 0; // the cups spin only while the pointer moves
    const a = stepS(vane, dt), b = stepS(rate, dt);
    phi += rate.x * dt;
    drawVane(vane.x);
    drawCups(phi);
    return a || b || Math.abs(rate.x) > 1e-3;
  });
  bag.add(B.unregister);

  function aim(p) {
    let deg = REST, spin = 0;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], VZ), t = Math.atan2(y, x - VX);
      vane.t = vane.t + (((t - vane.t + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
      const [ax, ay] = unproj(C, p[0], p[1], H + 4);
      spin = 10 * clamp(1 - Math.hypot(ax, ay) / 110, 0.12, 1);
      deg = (Math.round((t * 180) / Math.PI / 5) * 5 + 360) % 360;
    } else vane.t = vane.t + ((((REST * Math.PI) / 180 - vane.t + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
    rate.t = spin;
    moved = p ? performance.now() : -1e9;
    read.textContent = p ? "wind " + deg + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { vane.k = 100 * v; vane.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "weatherstation",
  means: "A weather station: the wind vane turns to point at the pointer, and the anemometer cups spin faster the closer it is.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[292, 105], [213, 123], [121, 241], null],
  mount,
});
