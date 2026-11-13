/**
 * Moon rover: a six-wheeled rover on rockers, with a camera head on a mast
 * and a small dish on a post, standing on a cratered patch of ground. The
 * pointer is what the rover looks at: the camera and the dish each turn on a
 * spring to face it, and the camera is bright. At rest the camera looks off
 * to one side and the dish to another, and the dish is bright. The slider is
 * how quickly they follow (a stiffer or softer spring).
 *
 * The pattern: a continuous aim per part (officechairs, spotlights); the hit
 * is on the ground's plane, which never moves.
 */
const {
  Cam, circ, facing, fit, hull, poly, prism, proj, rad, ringAt, rings, seg, open, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const RG = 62, WX = [-15, 0, 15], WY = 16, WR = 5.5, WT = 2.4, CZ = [7, 14], MX = 12, MY = -5, DX = -12, DY = 3;
const CRATERS = [[-38, 24, 10], [24, 42, 7], [36, -34, 12], [-22, -42, 6]], REST = [rad(70), rad(150)], EL = rad(35);
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const turn = (ring, a, cx, cy) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-RG, 0, -5], [RG, 0, -5], [0, -RG, -5], [0, RG, -5], [0, -RG, 0], [MX, MY, 40]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(RG, 72), circ(RG - 2, 72), -5, 0));
  mk("path", { class: "nf lo", d: CRATERS.map(([x, y, r]) => poly(ringAt(P, disc(x, y, r, 32), 0)) + poly(ringAt(P, disc(x + r * 0.15, y + r * 0.15, r * 0.6, 24), 0))).join("") }, g);

  const wheel = (x, y) => {
    const side = (yy) => Array.from({ length: 24 }, (_, i) => { const t = (i / 24) * Math.PI * 2; return P(x + WR * Math.cos(t), yy, WR + WR * Math.sin(t)); });
    const face = (r) => Array.from({ length: 24 }, (_, i) => { const t = (i / 24) * Math.PI * 2; return P(x + r * Math.cos(t), y + WT, WR + r * Math.sin(t)); });
    mk("path", { class: "sil", d: poly(hull(side(y - WT).concat(side(y + WT)))) }, g);
    mk("path", { class: "nf lo", d: poly(face(WR - 1.3)) + poly(face(1.4)) }, g);
  };
  for (const x of WX) wheel(x, -WY);
  const [cr, ci] = rings(-21, -12, 21, 12, 3, 1.3);
  put(solid(g), prism(P, front, cr, ci, CZ[0], CZ[1]));
  for (const x of WX) wheel(x, WY);
  mk("path", { class: "nf sil", d: open([P(-15, WY + WT, WR), P(-7, WY + WT, 11), P(7, WY + WT, 11), P(15, WY + WT, WR)]) + seg(P(0, WY + WT, WR), P(0, WY + WT, 11)) }, g);

  // the dish on its post, then the mast and its camera head
  put(solid(g), prism(P, front, disc(DX, DY, 1.1, 16), null, CZ[1], 24));
  const bowl = mk("path", { class: "sil" }, g), rim = mk("path", { class: "nf lo" }, g), feed = mk("path", { class: "nf sil" }, g);
  put(solid(g), prism(P, front, disc(MX, MY, 1.3, 16), null, CZ[1], 33));
  const head = solid(g), lens = mk("path", { class: "nf" }, g);
  const HEAD = rings(-3, -5, 3, 5, 1.4, 0.7);
  const opt = { k: 100 * value, c: 18 * Math.sqrt(value) };
  const cam = spring(REST[0], opt), dish = spring(REST[1], opt);
  let drawn = "";
  const V = [Math.cos(rad(45)) * 0.87, Math.sin(rad(45)) * 0.87, 0.5];

  function draw() {
    const key = cam.x.toFixed(4) + "," + dish.x.toFixed(4);
    if (key === drawn) return;
    drawn = key;
    const a = cam.x, ca = Math.cos(a), sa = Math.sin(a);
    put(head, prism(P, front, turn(HEAD[0], a, MX, MY), turn(HEAD[1], a, MX, MY), 32, 38));
    const lc = [MX + 3 * ca, MY + 3 * sa, 35];
    lens.setAttribute("d", ca * V[0] + sa * V[1] > 0.05 ? poly(Array.from({ length: 20 }, (_, i) => {
      const t = (i / 20) * Math.PI * 2, r = 1.6;
      return P(lc[0] - r * Math.cos(t) * sa, lc[1] + r * Math.cos(t) * ca, lc[2] + r * Math.sin(t));
    })) : "");
    const b = dish.x, d = [Math.cos(b) * Math.cos(EL), Math.sin(b) * Math.cos(EL), Math.sin(EL)], c = [DX, DY, 26.5];
    let u = [-d[1], d[0], 0]; const un = Math.hypot(...u) || 1; u = u.map((x) => x / un);
    const v = [u[1] * d[2] - u[2] * d[1], u[2] * d[0] - u[0] * d[2], u[0] * d[1] - u[1] * d[0]];
    const ring = (off, r) => Array.from({ length: 28 }, (_, i) => {
      const t = (i / 28) * Math.PI * 2, q = (j) => c[j] + d[j] * off + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]);
      return P(q(0), q(1), q(2));
    });
    bowl.setAttribute("d", poly(hull(ring(-1.6, 1.8).concat(ring(1.4, 7)))));
    rim.setAttribute("d", d[0] * V[0] + d[1] * V[1] + d[2] * V[2] > 0 ? poly(ring(1.4, 6.2)) : "");
    feed.setAttribute("d", seg(P(c[0], c[1], c[2]), P(c[0] + d[0] * 6, c[1] + d[1] * 6, c[2] + d[2] * 6)));
  }

  const B = register(stage, (dt) => { const m1 = stepS(cam, dt), m2 = stepS(dish, dt); draw(); return m1 || m2; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    const aim = (s, x, y, rest) => { const t = over ? Math.atan2(over[1] - y, over[0] - x) : rest; s.t = s.t + wrap(t - s.t); };
    aim(cam, MX, MY, REST[0]); aim(dish, DX, DY, REST[1]);
    head.sil.classList.toggle("hi", !!over);
    bowl.classList.toggle("hi", !over);
    read.textContent = over ? `aim ${Math.round(((Math.atan2(over[1] - MY, over[0] - MX) * 180) / Math.PI + 360) % 360)}°` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y), k = Math.min(1, RG / r);
      over = r > RG + 24 ? null : [x * k, y * k];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const s of [cam, dish]) { s.k = 100 * v; s.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "moonrover",
  means: "A six-wheeled lunar rover on a cratered patch: its mast camera and dish turn to face the pointer, the camera bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[258, 201], [110, 127], [110, 217], null],
  mount,
});
