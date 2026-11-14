/**
 * Softbox: a studio light on a tripod stand, its big square diffuser on a
 * tapering box. The pointer on the floor is where the light should fall: the
 * head pans and tilts to aim at it, and a dashed beam drops to a spot there.
 * At rest it leans toward a corner of the set, the spot lit. The slider is
 * how far out the light will reach.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, fit, hull, poly, prism, proj, rings, rrect, seg, unproj, clamp, rad,
  disposer, mk, pointer, put, register, solid, spring, stepS, facing, flatDot, place,
} = HL;

const HZ = 66, F = 13, BK = -22, REST = [44, 26];
const FR = rrect(-27, -27, 27, 27, 6, 4), FI = rrect(-24, -24, 24, 24, 4.5, 4), BR = rrect(-9, -9, 9, 9, 3, 3);
const V = [0.612, 0.612, 0.5];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-36, -36, HZ + 36], [36, 36, HZ - 36], [-36, 36, HZ + 36], [36, -36, HZ - 30], [44, 26, 0], [-40, -30, 0], [-22, -22, 0]], 200, 128);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const beam = mk("path", { class: "dash nf" }, g);
  const spot = flatDot(g, C, 3.2, "dot");
  // the stand: three legs to a collar, one pole up to the head
  const legs = [];
  for (const a of [100, 220, 340]) legs.push(seg(P(26 * Math.cos(rad(a)), 26 * Math.sin(rad(a)), 0), P(0, 0, 16)));
  mk("path", { d: legs.join(" "), class: "nf" }, g);
  const [pr, pi] = rings(-1.8, -1.8, 1.8, 1.8, 1.8, 0.6);
  put(solid(g), prism(P, front, pr, pi, 12, HZ - 8));
  const [cr, ci] = rings(-3.4, -3.4, 3.4, 3.4, 3.4, 1);
  put(solid(g), prism(P, front, cr, ci, 12, 18));
  const head = solid(g), panel = mk("path", { class: "nf lo" }, head.g);

  const th = spring(0), ph = spring(0);
  let last = "", act = false;
  function aimAt(x, y) {
    const d = Math.hypot(x, y), dd = clamp(d, 22, reach);
    let t = Math.atan2(y, x);
    while (t - th.x > Math.PI) t -= 2 * Math.PI;
    while (t - th.x < -Math.PI) t += 2 * Math.PI;
    th.t = t; ph.t = Math.atan2(HZ, dd);
  }
  aimAt(REST[0], REST[1]); th.x = th.t; ph.x = ph.t;

  function draw() {
    const key = th.x.toFixed(4) + ph.x.toFixed(4);
    if (key === last) return;
    last = key;
    const ct = Math.cos(th.x), st = Math.sin(th.x), cp = Math.cos(ph.x), sp = Math.sin(ph.x);
    const f = [ct * cp, st * cp, -sp], s = [-st, ct, 0], u = [ct * sp, st * sp, cp];
    const at = (a, b, d) => P(f[0] * d + s[0] * a + u[0] * b, f[1] * d + s[1] * a + u[1] * b, HZ + f[2] * d + s[2] * a + u[2] * b);
    const ring = (r, d) => r.map((q) => at(q.u, q.v, d));
    head.sil.setAttribute("d", poly(hull(ring(FR, F).concat(ring(FR, F - 3), ring(BR, BK)))));
    const toward = f[0] * V[0] + f[1] * V[1] + f[2] * V[2] > 0;
    head.cr.setAttribute("d", poly(toward ? ring(FR, F - 3) : ring(BR, BK + 1)));
    panel.setAttribute("d", toward ? poly(ring(FI, F)) : "");
    const tt = HZ / Math.max(sp, 0.2), gx = f[0] * tt, gy = f[1] * tt;
    beam.setAttribute("d", seg(at(0, 0, F), P(gx, gy, 0)));
    place(spot, P(gx, gy, 0));
    read.textContent = act ? Math.round(((th.x * 180) / Math.PI % 360 + 360) % 360) + "°" : "rest";
  }

  const B = register(stage, (dt) => {
    const m = stepS(th, dt) | stepS(ph, dt);
    draw();
    return !!m;
  });
  bag.add(B.unregister);

  function setActive(on) {
    act = on;
    head.sil.classList.toggle("hi", on);
    spot.setAttribute("class", on ? "dot off" : "dot");
    last = "";
    B.wake();
  }
  setActive(false);
  draw();
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0); aimAt(x, y); setActive(true); },
    leave: () => { aimAt(REST[0], REST[1]); setActive(false); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "softbox",
  means: "A softbox light on a tripod stand: the head pans and tilts to aim where the pointer stands on the floor.",
  rules: [1, 3, 4, 5],
  range: [30, 48, 64],
  tour: [[175, 163], [56, 239], [353, 243], null],
  mount,
});
