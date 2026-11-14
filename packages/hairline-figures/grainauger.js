/**
 * Grain auger: a long tube on a wheeled strut, its intake hopper on the
 * ground and its spout over a round grain silo. The pointer on the ground
 * swings the auger about its foot to face it, on a spring, grain falling
 * from the spout wherever it points. At rest it leans over the silo's
 * roof, its tube bright. The slider is the tube's elevation.
 *
 * The pattern: a part turning to face the pointer (a rotated cylinder hull).
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, circ, seg, unproj, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid, flatDot, place,
} = HL;

const FX = 40, FY = -12, FZ = 4, LEN = 78, R = 3, SX = -2, SY = 30, SR = 16, SH = 34, ROOF = 46, SWING = 55;
const REST = Math.atan2(SY - FY, SX - FX) * 180 / Math.PI;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let elev = value;
  const C = Cam(45, 0.5, 2.5);
  const ends = [-SWING, 0, SWING].map((d) => [FX + Math.cos(rad(REST + d)) * LEN * 0.82, FY + Math.sin(rad(REST + d)) * LEN * 0.82, 56]);
  fit(C, [[SX - SR, SY - SR, 0], [SX + SR, SY + SR, ROOF], [FX + 8, FY + 8, 0], [FX - 6, FY - 6, 0]].concat(ends), 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the silo: a round bin and its cone roof with a fill hole
  const sr = circ(SR, 32).map((s) => ({ ...s, u: s.u + SX, v: s.v + SY }));
  const si = circ(SR - 1.2, 32).map((s) => ({ ...s, u: s.u + SX, v: s.v + SY }));
  const silo = solid(g);
  put(silo, prism(P, front, sr, si, 0, SH));
  const roof = solid(g), hole = circ(3, 16).map((s) => ({ ...s, u: s.u + SX, v: s.v + SY }));
  roof.sil.setAttribute("d", poly(hull(ringAt(P, sr, SH).concat(ringAt(P, hole, ROOF)))));
  roof.cr.setAttribute("d", poly(ringAt(P, hole, ROOF)) + open(ringAt(P, sr.filter(front), SH + 0.8)));
  let bands = "";
  for (const z of [11, 22]) bands += open(ringAt(P, sr.filter(front), z));
  mk("path", { class: "nf lo", d: bands }, silo.g);

  const grain = [];
  for (let i = 0; i < 7; i++) grain.push(flatDot(g, C, 1.3, i % 2 ? "dot m" : "dot off"));
  const strut = mk("path", { class: "nf" }, g), wheels = solid(g);
  const hop = solid(g), [hr, hi] = rings(FX - 6, FY - 6, FX + 6, FY + 6, 6, 1);
  put(hop, prism(P, front, hr, hi, 0, 7));
  const tube = solid(g);
  tube.sil.classList.add("hi");

  let last = NaN, lastE = NaN;
  function draw(yawDeg) {
    if (yawDeg === last && elev === lastE) return;
    last = yawDeg; lastE = elev;
    const y = rad(yawDeg), e = rad(elev);
    const ax = [Math.cos(y) * Math.cos(e), Math.sin(y) * Math.cos(e), Math.sin(e)];
    const u = [-Math.sin(y), Math.cos(y), 0], v = [-Math.sin(e) * Math.cos(y), -Math.sin(e) * Math.sin(y), Math.cos(e)];
    const at = (t, a, b) => P(FX + ax[0] * t + u[0] * a + v[0] * b, FY + ax[1] * t + u[1] * a + v[1] * b, FZ + ax[2] * t + u[2] * a + v[2] * b);
    const ends = [];
    for (const t of [0, LEN]) for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; ends.push(at(t, R * Math.cos(a), R * Math.sin(a))); }
    tube.sil.setAttribute("d", poly(hull(ends)));
    let d = open([0, 0.25, 0.5, 0.75, 1].map((f) => at(LEN - 2, R * 0.8 * Math.cos(Math.PI * f), R * 0.8 * Math.sin(Math.PI * f))));
    for (let t = 8; t < LEN - 6; t += 7) d += seg(at(t, -R * 0.7, R * 0.7), at(t + 3, R * 0.7, R * 0.7));
    tube.cr.setAttribute("d", d);
    // the undercarriage: wheels under the tube's middle, a strut up to it
    const wt = LEN * 0.45 * Math.cos(e), wx = FX + Math.cos(y) * wt, wy = FY + Math.sin(y) * wt;
    const [wr, wi] = rings(wx - 3, wy - 3, wx + 3, wy + 3, 3, 0.8);
    put(wheels, prism(P, front, wr, wi, 0, 5));
    strut.setAttribute("d", seg(P(wx, wy, 5), at(LEN * 0.6, 0, -R)) + seg(P(wx, wy, 5), at(LEN * 0.3, 0, -R)));
    // the grain, falling from the spout to the ground
    const sx = FX + ax[0] * LEN, sy = FY + ax[1] * LEN, sz = FZ + ax[2] * LEN;
    grain.forEach((dot, i) => place(dot, P(sx + ((i * 5) % 3 - 1) * 1.2, sy + ((i * 3) % 3 - 1) * 1.2, sz - 4 - i * 1.6)));
  }

  const yaw = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(yaw, dt); draw(yaw.x); return m; });
  bag.add(B.unregister);

  function move([px, py]) {
    const [wx, wy] = unproj(C, px, py, 0);
    const dx = wx - FX, dy = wy - FY;
    if (Math.hypot(dx, dy) > 110) return leave();
    let a = Math.atan2(dy, dx) * 180 / Math.PI - REST;
    a = ((a + 540) % 360) - 180;
    yaw.t = REST + clamp(a, -SWING, SWING);
    read.textContent = (yaw.t - REST >= 0 ? "+" : "") + Math.round(yaw.t - REST) + "°";
    B.wake();
  }
  function leave() { yaw.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { elev = v; B.wake(); draw(yaw.x); }, destroy: bag.dispose };
}

hairline({
  name: "grainauger",
  means: "A grain auger beside a silo swings about its foot to face the pointer, grain falling from its spout where it points.",
  rules: [3, 5, 8, 9],
  range: [35, 45, 52],
  tour: [[206, 183], [117, 263], [312, 289], null],
  mount,
});
